import "server-only";

import type { Address } from "viem";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { baseScanUrl, PayoutError, sendEurcReward } from "@/lib/blockchain/payout";

/**
 * ============================================================================
 * Paying an open claim
 * ============================================================================
 *
 * The last three steps of every payout — lock, send, record — shared by module
 * claims and earnings withdrawals so there is exactly one copy of the part
 * that can pay twice.
 *
 * The caller has already inserted the reward_claims row. This takes it from
 * UNCLAIMED to PAID, or to the right failure state, and never touches the
 * chain unless the compare-and-set says this caller is the only one paying.
 */

export type PayClaimOutcome =
  | { status: "PAID"; txHash: string; explorerUrl: string; amountEurc: string }
  /** Somebody else holds the lock, or already paid it. Nothing was sent. */
  | { status: "LOCKED" }
  | { status: "LOCK_ERROR" }
  | { status: "UNCLAIMED" | "VOID" | "FAILED"; error: string };

export async function payClaim(input: {
  claimId: string;
  toAddress: Address;
  amountBaseUnits: string;
  /**
   * Where a claim goes when it failed before anything was broadcast. A module
   * claim returns to UNCLAIMED and can simply be retried; a withdrawal becomes
   * VOID, because its amount was the balance at one moment and a retry must
   * recompute it.
   */
  retryableStatus: "UNCLAIMED" | "VOID";
  logPrefix: string;
}): Promise<PayClaimOutcome> {
  const db = getSupabaseAdmin();
  const { claimId, toAddress, amountBaseUnits, retryableStatus, logPrefix } = input;

  // --- exactly one caller proceeds -----------------------------------------
  const { data: locked, error: lockError } = await db.rpc("begin_reward_claim", {
    p_claim_id: claimId,
  });
  if (lockError) {
    console.error(`${logPrefix} lock failed`, lockError);
    return { status: "LOCK_ERROR" };
  }
  // Check the id, not the truthiness of the result. begin_reward_claim returns
  // a single composite, and when the compare-and-set matches nothing Postgres
  // yields a row of nulls, which PostgREST serialises as `{ id: null, … }`.
  // That object is truthy, so `Boolean(locked)` let the losing caller pay too.
  const row = (Array.isArray(locked) ? locked[0] : locked) as { id?: unknown } | null | undefined;
  const won = row?.id === claimId;
  if (!won) return { status: "LOCKED" };

  // --- pay -----------------------------------------------------------------
  try {
    const payout = await sendEurcReward({
      toAddress,
      amountBaseUnits,
      onNonceAssigned: async (nonce) => {
        await db.from("reward_claims").update({ broadcast_nonce: nonce }).eq("id", claimId);
      },
    });

    // --- record it ---------------------------------------------------------
    const { error: updateError } = await db
      .from("reward_claims")
      .update({
        status: "PAID",
        tx_hash: payout.txHash,
        paid_to_address: payout.recipientAddress,
        updated_at: new Date().toISOString(),
      })
      .eq("id", claimId);

    if (updateError) {
      // The money is gone and the row says pending. Loud, because only a human
      // can reconcile this — and must not simply retry the payment.
      console.error(
        `${logPrefix} PAID BUT NOT RECORDED`,
        { claimId, txHash: payout.txHash, nonce: payout.nonce },
        updateError,
      );
    }

    return {
      status: "PAID",
      txHash: payout.txHash,
      explorerUrl: baseScanUrl(payout.txHash),
      amountEurc: payout.amountEurc,
    };
  } catch (error) {
    const payoutError = error instanceof PayoutError ? error : null;
    const reason = payoutError?.message ?? (error as Error).message;
    console.error(`${logPrefix} payout failed`, { claimId, reason });

    /**
     * Only treat it as retryable when nothing was broadcast. Every PayoutError
     * thrown before the send is safe; a broadcast that failed after leaving the
     * process is not, because the transaction may still be mined.
     */
    const safeToRetry =
      payoutError?.retryable === true && payoutError.code !== "BROADCAST_FAILED";
    const status = safeToRetry ? retryableStatus : "FAILED";

    await db
      .from("reward_claims")
      .update({
        status,
        failure_reason: reason.slice(0, 500),
        updated_at: new Date().toISOString(),
      })
      .eq("id", claimId);

    return {
      status,
      error: safeToRetry
        ? "The payment could not be sent right now. Try again shortly."
        : "The payment could not be sent. Someone will need to look at this.",
    };
  }
}
