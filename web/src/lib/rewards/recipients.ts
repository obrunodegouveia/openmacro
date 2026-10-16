import "server-only";

import { getAddress, isAddress, type Address } from "viem";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * ============================================================================
 * Reward recipients
 * ============================================================================
 *
 * Resolves a key the game asks for ("daughter") to an address the treasury may
 * pay. The lookup is the security boundary: everything upstream deals in keys,
 * and only this module turns one into somewhere money can go.
 *
 * Two rules it enforces on every read:
 *
 *   - Only `active` recipients resolve. A pending address — one that has been
 *     entered but not confirmed to arrive — cannot be paid by the normal claim
 *     path at all.
 *   - The address is re-checksummed on the way out. A row that has somehow
 *     acquired a malformed address fails here rather than at the chain.
 */

export type RecipientStatus = "pending" | "active" | "disabled";

/**
 * How a recipient is rewarded. 'module' pays a fixed amount per finished
 * module; 'earnings' keeps a balance from XP and active time that the learner
 * withdraws themselves (lib/rewards/earnings.ts).
 */
export type RewardScheme = "module" | "earnings";

export interface Recipient {
  id: string;
  key: string;
  label: string;
  /** Null only for an 'earnings' recipient who has not set one yet. */
  address: Address | null;
  status: RecipientStatus;
  scheme: RewardScheme;
  amountEuros: string | null;
  /** Euros per XP for an 'earnings' recipient; null means the default. */
  xpRateEuros: string | null;
  /** Euros per active hour for an 'earnings' recipient; null means the default. */
  hourRateEuros: string | null;
  /** The signed-in account allowed to claim into this wallet, if any. */
  claimantEmail: string | null;
  note: string | null;
  createdAt: string;
  activatedAt: string | null;
}

interface RecipientRow {
  id: string;
  key: string;
  label: string;
  address: string | null;
  status: RecipientStatus;
  scheme: RewardScheme;
  amount_euros: string | null;
  xp_rate_euros: string | null;
  hour_rate_euros: string | null;
  claimant_email: string | null;
  note: string | null;
  created_at: string;
  activated_at: string | null;
}

function toRecipient(row: RecipientRow): Recipient {
  return {
    id: row.id,
    key: row.key,
    label: row.label,
    address: row.address ? getAddress(row.address) : null,
    status: row.status,
    // Before migration 0006 the column does not exist; every row was 'module'.
    scheme: row.scheme ?? "module",
    amountEuros: row.amount_euros,
    xpRateEuros: row.xp_rate_euros,
    hourRateEuros: row.hour_rate_euros,
    claimantEmail: row.claimant_email,
    note: row.note,
    createdAt: row.created_at,
    activatedAt: row.activated_at,
  };
}

/** Normalise and validate an address, or explain why it is not one. */
export function normaliseAddress(input: string): { address: Address } | { error: string } {
  const trimmed = input.trim();
  if (!isAddress(trimmed)) {
    return {
      error:
        "That is not a valid address. It should be 0x followed by 40 hexadecimal characters.",
    };
  }
  return { address: getAddress(trimmed) };
}

/**
 * The wallet a signed-in account may claim into, or null.
 *
 * This is the resolution that matters: the request never names a recipient, so
 * a learner can only ever be paid into the wallet an admin bound to their
 * account. Null covers unbound, pending and disabled alike.
 */
export async function resolveRecipientForClaimant(email: string): Promise<Recipient | null> {
  // Compared here, exactly, rather than with `ilike`. In a LIKE pattern `%`
  // and `_` are wildcards — and PostgREST adds `*` — and all three are legal in
  // an email address, so `p%@gmail.com` would have matched somebody else's
  // row. Active, bound recipients are a handful of rows; reading them all is
  // cheaper than getting the escaping right.
  const { data, error } = await getSupabaseAdmin()
    .from("reward_recipients")
    .select("*")
    .eq("status", "active")
    .not("claimant_email", "is", null);

  if (error) {
    console.error("[rewards] claimant lookup failed", error);
    return null;
  }
  const wanted = email.trim().toLowerCase();
  const matches = (data as RecipientRow[]).filter(
    (row) => row.claimant_email?.trim().toLowerCase() === wanted,
  );
  // Two active rows for one account is a configuration error; paying either
  // would be a guess, so neither is used. (maybeSingle refused it the same way.)
  if (matches.length !== 1) {
    if (matches.length > 1) console.error("[rewards] more than one active recipient for a claimant");
    return null;
  }
  return toRecipient(matches[0]!);
}

/**
 * The address to pay for a key, or null.
 *
 * Used by admin test sends, which address a wallet directly rather than going
 * through a claimant. Null means "not payable" and covers unknown, pending and
 * disabled alike.
 */
export async function resolvePayableRecipient(key: string): Promise<Recipient | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("reward_recipients")
    .select("*")
    .eq("key", key)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    console.error("[rewards] recipient lookup failed", { key }, error);
    return null;
  }
  return data ? toRecipient(data as RecipientRow) : null;
}

/** Everyone, for the dashboard. Ordered so active recipients read first. */
export async function listRecipients(): Promise<Recipient[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("reward_recipients")
    .select("*")
    .order("status", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[rewards] recipient list failed", error);
    return [];
  }
  return (data as RecipientRow[]).map(toRecipient);
}

export async function getRecipientById(id: string): Promise<Recipient | null> {
  const { data } = await getSupabaseAdmin()
    .from("reward_recipients")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data ? toRecipient(data as RecipientRow) : null;
}

/**
 * Add a recipient. Always lands as `pending`.
 *
 * There is no way to create an active recipient in one step, and that is the
 * point: adding an address and paying it should not be the same action, so a
 * mistyped or malicious address has to survive a second look before it can
 * receive anything.
 */
export async function addRecipient(input: {
  key: string;
  label: string;
  /** Required for 'module'; optional for 'earnings', where the learner sets it. */
  address: Address | null;
  scheme?: RewardScheme;
  amountEuros?: string | null;
  claimantEmail?: string | null;
  note?: string | null;
}): Promise<{ recipient: Recipient } | { error: string }> {
  const { data, error } = await getSupabaseAdmin()
    .from("reward_recipients")
    .insert({
      key: input.key.trim().toLowerCase(),
      label: input.label.trim(),
      // Stored lowercase; checksummed on read.
      address: input.address?.toLowerCase() ?? null,
      scheme: input.scheme ?? "module",
      amount_euros: input.amountEuros?.trim() || null,
      claimant_email: input.claimantEmail?.trim().toLowerCase() || null,
      note: input.note?.trim() || null,
      status: "pending",
    })
    .select("*")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return { error: `A recipient with the key "${input.key}" already exists.` };
    }
    if (error.code === "23514") {
      return {
        error:
          "Rejected by a database constraint — check the key is lowercase letters, digits, - or _, and the amount has at most 6 decimals.",
      };
    }
    console.error("[rewards] add recipient failed", error);
    return { error: "Could not save that recipient." };
  }
  return { recipient: toRecipient(data as RecipientRow) };
}

/**
 * Set the payout address of an 'earnings' recipient, from the learner's own
 * dashboard. Takes effect immediately and keeps the recipient's status.
 *
 * This is the one place a learner decides where money goes, and it is
 * restricted twice: the row is found by the signed-in email, never by an id
 * from the request, and only an active 'earnings' row matches. A 'module'
 * recipient's address can only ever be changed by an admin.
 */
export async function setClaimantAddress(
  email: string,
  address: Address,
): Promise<{ recipient: Recipient; previous: Address | null } | { error: string }> {
  const current = await resolveRecipientForClaimant(email);
  if (!current || current.scheme !== "earnings") {
    return { error: "There is no reward wallet set up for this account." };
  }

  const { data, error } = await getSupabaseAdmin()
    .from("reward_recipients")
    .update({ address: address.toLowerCase(), updated_at: new Date().toISOString() })
    .eq("id", current.id)
    .eq("scheme", "earnings")
    .eq("status", "active")
    .select("*")
    .maybeSingle();

  if (error || !data) {
    console.error("[rewards] claimant address change failed", error);
    return { error: "Could not save that address." };
  }
  return { recipient: toRecipient(data as RecipientRow), previous: current.address };
}

/**
 * Change a recipient's status.
 *
 * Activating is the moment an address becomes payable, which is why the
 * dashboard asks for confirmation and the audit log records it.
 */
export async function setRecipientStatus(
  id: string,
  status: RecipientStatus,
): Promise<{ recipient: Recipient } | { error: string }> {
  const { data, error } = await getSupabaseAdmin()
    .from("reward_recipients")
    .update({
      status,
      updated_at: new Date().toISOString(),
      ...(status === "active" ? { activated_at: new Date().toISOString() } : {}),
    })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    // The partial unique index refuses a second active row for one key.
    if (error.code === "23505") {
      return {
        error:
          "Another recipient with that key is already active. Disable it before activating this one.",
      };
    }
    console.error("[rewards] status change failed", error);
    return { error: "Could not change that recipient." };
  }
  if (!data) return { error: "No such recipient." };
  return { recipient: toRecipient(data as RecipientRow) };
}

/**
 * Change what an earnings recipient is paid per XP and per active hour.
 *
 * Null restores the default from lib/rewards/earnings.ts. The balance is
 * recomputed from these rates on every read, so a change applies to
 * everything earned so far, not only to what is earned next.
 *
 * @param id     The recipient row.
 * @param rates  Euros as decimal strings (at most 6 decimals), or null.
 * @return The updated recipient, or why it was refused.
 */
export async function setRecipientRates(
  id: string,
  rates: { xpRateEuros: string | null; hourRateEuros: string | null },
): Promise<{ recipient: Recipient } | { error: string }> {
  const { data, error } = await getSupabaseAdmin()
    .from("reward_recipients")
    .update({
      xp_rate_euros: rates.xpRateEuros,
      hour_rate_euros: rates.hourRateEuros,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    // Rates mean nothing to a per-module recipient; refuse rather than store them.
    .eq("scheme", "earnings")
    .select("*")
    .maybeSingle();

  if (error) {
    if (error.code === "23514") {
      return { error: "A rate must be a number of euros with at most 6 decimals, like 0.002." };
    }
    console.error("[rewards] rate change failed", error);
    return { error: "Could not change those rates." };
  }
  if (!data) return { error: "No such recipient on XP and active time." };
  return { recipient: toRecipient(data as RecipientRow) };
}
