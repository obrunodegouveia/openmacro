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

export interface Recipient {
  id: string;
  key: string;
  label: string;
  address: Address;
  status: RecipientStatus;
  amountEuros: string | null;
  note: string | null;
  createdAt: string;
  activatedAt: string | null;
}

interface RecipientRow {
  id: string;
  key: string;
  label: string;
  address: string;
  status: RecipientStatus;
  amount_euros: string | null;
  note: string | null;
  created_at: string;
  activated_at: string | null;
}

function toRecipient(row: RecipientRow): Recipient {
  return {
    id: row.id,
    key: row.key,
    label: row.label,
    address: getAddress(row.address),
    status: row.status,
    amountEuros: row.amount_euros,
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
 * The address to pay for a key, or null.
 *
 * Null means "not payable" and covers unknown, pending and disabled alike —
 * the claim route should treat all three the same way and say nothing more
 * specific to the player.
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
  address: Address;
  amountEuros?: string | null;
  note?: string | null;
}): Promise<{ recipient: Recipient } | { error: string }> {
  const { data, error } = await getSupabaseAdmin()
    .from("reward_recipients")
    .insert({
      key: input.key.trim().toLowerCase(),
      label: input.label.trim(),
      // Stored lowercase; checksummed on read.
      address: input.address.toLowerCase(),
      amount_euros: input.amountEuros?.trim() || null,
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
