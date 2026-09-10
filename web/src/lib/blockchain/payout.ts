import "server-only";

import {
  createPublicClient,
  createWalletClient,
  erc20Abi,
  formatUnits,
  getAddress,
  http,
  parseUnits,
  type Address,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

/**
 * ============================================================================
 * EURC payouts on Base
 * ============================================================================
 *
 * The only module that holds the treasury key or broadcasts a transaction.
 *
 * `import "server-only"` is the first line on purpose: it makes importing this
 * from a client component a build error rather than a leaked private key. Do
 * not remove it, and do not re-export anything from here through a file that a
 * client component imports.
 *
 * ---------------------------------------------------------------------------
 * THE THREAT MODEL, BRIEFLY
 * ---------------------------------------------------------------------------
 *
 * This is a hot wallet: a key sitting in server memory that can move funds
 * without a human. Anyone who reaches the server's environment can drain it.
 * Two consequences that are not optional:
 *
 *   - Fund it like a petty cash drawer. Tens of euros, not thousands. Top it
 *     up deliberately. The blast radius of a compromise is exactly the balance.
 *   - This module never decides *who* gets paid. It is handed an address that
 *     `lib/rewards/recipients.ts` has already resolved from an active row, and
 *     an API that accepts an address from a request is an API that pays
 *     whoever asks. Keep that resolution in one place, and keep it out of here.
 */

/** Circle's EURC on Base mainnet. Six decimals, unlike ETH's eighteen. */
export const EURC_ADDRESS: Address = getAddress(
  "0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42",
);
export const EURC_DECIMALS = 6;

export interface PayoutRequest {
  /**
   * Where the money goes. Resolved by the caller from `reward_recipients`,
   * never from a request body — see lib/rewards/recipients.ts.
   *
   * This module deliberately does not look addresses up. Keeping resolution
   * out of here means there is exactly one place that decides who may be paid,
   * and it is the place that also checks the recipient is active.
   */
  toAddress: Address;
  /** Base units as a decimal string, e.g. "10000000" for €10.00. */
  amountBaseUnits: string;
  /**
   * Called with the nonce this payout will use, before anything is broadcast.
   * Persist it: a request that dies mid-flight leaves a claim that can only be
   * resolved safely by looking up what that nonce actually did on-chain.
   */
  onNonceAssigned?: (nonce: number) => Promise<void>;
}

export interface PayoutResult {
  txHash: Hex;
  nonce: number;
  recipientAddress: Address;
  amountBaseUnits: string;
  /** Human-readable, for logs and the UI. */
  amountEurc: string;
}

/** Distinguishes "we refused to try" from "the chain rejected it". */
export class PayoutError extends Error {
  constructor(
    message: string,
    readonly code:
      | "CONFIG"
      | "INSUFFICIENT_EURC"
      | "INSUFFICIENT_GAS"
      | "BROADCAST_FAILED"
      | "REVERTED",
    readonly retryable: boolean,
  ) {
    super(message);
    this.name = "PayoutError";
  }
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new PayoutError(`${name} is not set.`, "CONFIG", false);
  }
  return value;
}

/**
 * The treasury key, validated into an account.
 *
 * Read lazily rather than at module scope so that importing this file during a
 * build — where the secret is legitimately absent — does not fail the build.
 */
function treasuryAccount() {
  const raw = required("GAME_TREASURY_PRIVATE_KEY").trim();
  const key = raw.startsWith("0x") ? raw : `0x${raw}`;
  if (!/^0x[0-9a-fA-F]{64}$/.test(key)) {
    throw new PayoutError(
      "GAME_TREASURY_PRIVATE_KEY must be 32 bytes of hex (64 characters, 0x optional).",
      "CONFIG",
      false,
    );
  }
  return privateKeyToAccount(key as Hex);
}

function publicClient() {
  return createPublicClient({
    chain: base,
    transport: http(process.env.BASE_RPC_URL || undefined),
  });
}

// ---------------------------------------------------------------------------
// Preflight
// ---------------------------------------------------------------------------

export interface TreasuryStatus {
  address: Address;
  eurcBaseUnits: bigint;
  eurcFormatted: string;
  ethWei: bigint;
  ethFormatted: string;
}

/** Read-only view of the treasury. Safe to expose to an admin page; never to a learner. */
export async function readTreasuryStatus(): Promise<TreasuryStatus> {
  const account = treasuryAccount();
  const client = publicClient();

  const [eurc, eth] = await Promise.all([
    client.readContract({
      address: EURC_ADDRESS,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [account.address],
    }),
    client.getBalance({ address: account.address }),
  ]);

  return {
    address: account.address,
    eurcBaseUnits: eurc,
    eurcFormatted: formatUnits(eurc, EURC_DECIMALS),
    ethWei: eth,
    ethFormatted: formatUnits(eth, 18),
  };
}

/**
 * Convert euros to EURC base units.
 *
 * Takes a string, never a number: `10.10` in binary floating point is not
 * exactly 10.10, and `parseUnits` on a stringified float can round the wrong
 * way. Amounts should be strings from configuration to the chain.
 */
export function eurosToBaseUnits(euros: string): bigint {
  if (!/^\d+(\.\d{1,6})?$/.test(euros.trim())) {
    throw new PayoutError(
      `Reward amount "${euros}" must be a positive decimal with at most 6 places.`,
      "CONFIG",
      false,
    );
  }
  const units = parseUnits(euros.trim(), EURC_DECIMALS);
  if (units <= 0n) {
    throw new PayoutError("Reward amount must be greater than zero.", "CONFIG", false);
  }
  return units;
}

// ---------------------------------------------------------------------------
// Sending
// ---------------------------------------------------------------------------

/**
 * Serialises sends within this process.
 *
 * One wallet means one nonce sequence. Two payouts building transactions
 * concurrently can read the same pending nonce, and the second is then dropped
 * as a duplicate or silently replaces the first. Queuing costs a few hundred
 * milliseconds and removes the whole class of problem.
 *
 * Caveat worth knowing: this is per-instance. Cloud Run running two containers
 * has two queues and can still collide. What protects the *learner* is the
 * database's unique index, not this; what this protects is throughput. If
 * payouts ever become frequent, move nonce allocation into Postgres.
 */
let queue: Promise<unknown> = Promise.resolve();
function serialise<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  // Keep the chain alive regardless of outcome, without holding rejections.
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

/**
 * Send EURC to a configured family member.
 *
 * Checks balances before broadcasting, because a transfer that reverts for
 * insufficient balance still costs gas and still needs explaining. Returns as
 * soon as the transaction is accepted by the network — confirmation is the
 * caller's business, so a slow block cannot hold an HTTP request open.
 */
export async function sendEurcReward(request: PayoutRequest): Promise<PayoutResult> {
  const amount = BigInt(request.amountBaseUnits);
  if (amount <= 0n) {
    throw new PayoutError("Payout amount must be positive.", "CONFIG", false);
  }

  const account = treasuryAccount();
  // Re-checksum on the way in: a malformed address should fail here, before a
  // nonce is spent, rather than at the chain.
  const to = getAddress(request.toAddress);
  const client = publicClient();

  return serialise(async () => {
    // --- preflight: can this possibly succeed? --------------------------
    const [eurcBalance, ethBalance] = await Promise.all([
      client.readContract({
        address: EURC_ADDRESS,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [account.address],
      }),
      client.getBalance({ address: account.address }),
    ]);

    if (eurcBalance < amount) {
      throw new PayoutError(
        `Treasury holds €${formatUnits(eurcBalance, EURC_DECIMALS)} EURC, ` +
          `needs €${formatUnits(amount, EURC_DECIMALS)}. Top up ${account.address}.`,
        "INSUFFICIENT_EURC",
        true,
      );
    }

    // Simulate first: it both estimates gas honestly and surfaces a revert
    // (a frozen token, a blocklisted address) before any gas is spent.
    let gas: bigint;
    try {
      const simulation = await client.simulateContract({
        account,
        address: EURC_ADDRESS,
        abi: erc20Abi,
        functionName: "transfer",
        args: [to, amount],
      });
      gas = await client.estimateContractGas({
        account,
        address: EURC_ADDRESS,
        abi: erc20Abi,
        functionName: "transfer",
        args: [to, amount],
      });
      void simulation;
    } catch (error) {
      throw new PayoutError(
        `EURC transfer would revert: ${(error as Error).message}`,
        "REVERTED",
        false,
      );
    }

    const fees = await client.estimateFeesPerGas();
    const maxFee = fees.maxFeePerGas ?? 0n;
    // 20% headroom: gas estimation is a snapshot and Base's base fee moves.
    const gasCost = (gas * maxFee * 120n) / 100n;

    if (ethBalance < gasCost) {
      throw new PayoutError(
        `Treasury holds ${formatUnits(ethBalance, 18)} ETH, needs about ` +
          `${formatUnits(gasCost, 18)} for gas. Send ETH to ${account.address} on Base.`,
        "INSUFFICIENT_GAS",
        true,
      );
    }

    // --- broadcast ------------------------------------------------------
    const nonce = await client.getTransactionCount({
      address: account.address,
      blockTag: "pending",
    });

    // Persist the nonce before the send. If the process dies after this, the
    // claim is recoverable: ask the chain what this nonce did.
    await request.onNonceAssigned?.(nonce);

    const wallet = createWalletClient({
      account,
      chain: base,
      transport: http(process.env.BASE_RPC_URL || undefined),
    });

    let txHash: Hex;
    try {
      txHash = await wallet.writeContract({
        address: EURC_ADDRESS,
        abi: erc20Abi,
        functionName: "transfer",
        args: [to, amount],
        nonce,
        gas: (gas * 120n) / 100n,
      });
    } catch (error) {
      throw new PayoutError(
        `Broadcast failed: ${(error as Error).message}`,
        "BROADCAST_FAILED",
        true,
      );
    }

    return {
      txHash,
      nonce,
      recipientAddress: to,
      amountBaseUnits: amount.toString(),
      amountEurc: formatUnits(amount, EURC_DECIMALS),
    };
  });
}

/**
 * Wait for a broadcast transaction to be mined.
 *
 * Separate from `sendEurcReward` so the API can answer immediately with a hash
 * and let the client watch, rather than holding a request open across block
 * times. Base blocks are about two seconds; the default here allows for a
 * congested minute.
 */
export async function waitForPayout(
  txHash: Hex,
  timeoutMs = 60_000,
): Promise<"success" | "reverted"> {
  const receipt = await publicClient().waitForTransactionReceipt({
    hash: txHash,
    timeout: timeoutMs,
  });
  return receipt.status === "success" ? "success" : "reverted";
}

/** A BaseScan link, for logs and the UI. */
export function baseScanUrl(txHash: string): string {
  return `https://basescan.org/tx/${txHash}`;
}
