import { NextResponse } from "next/server";
import type { Address } from "viem";

import { getAdminFromRequest, recordAdminEvent } from "@/lib/rewards/admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  addRecipient,
  getRecipientById,
  listRecipients,
  normaliseAddress,
  setRecipientAddress,
  setRecipientRates,
  setRecipientStatus,
} from "@/lib/rewards/recipients";
import {
  baseScanUrl,
  eurosToBaseUnits,
  PayoutError,
  readTreasuryStatus,
  sendEurcReward,
} from "@/lib/blockchain/payout";

/**
 * ============================================================================
 * Treasury administration
 * ============================================================================
 *
 * GET  — everything the dashboard shows: balances, recipients, claims, log.
 * POST — one of a small set of named actions.
 *
 * Every request is gated by `getAdminFromRequest`, which checks a
 * Supabase-verified email against a server-side allow-list. There is no
 * client-supplied role, no admin column, and no way to reach any of this by
 * guessing a URL.
 *
 * The actions that can move money somewhere new — adding an address,
 * activating one, sending a test — are all recorded in `reward_admin_events`
 * before the response is returned.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function forbidden() {
  // 404, not 403: an address that says "forbidden" confirms it exists.
  return NextResponse.json({ error: "Not found." }, { status: 404 });
}

export async function GET(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return forbidden();

  const db = getSupabaseAdmin();

  // The treasury read touches the chain and can fail independently of the
  // database. A dead RPC should still leave the rest of the page usable.
  const [treasury, recipients] = await Promise.all([
    readTreasuryStatus().catch((error: Error) => ({ error: error.message }) as const),
    listRecipients(),
  ]);

  const { data: claims } = await db
    .from("reward_claims")
    .select("id, recipient_key, claim_key, amount_base_units, status, tx_hash, paid_to_address, failure_reason, broadcast_nonce, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: events } = await db
    .from("reward_admin_events")
    .select("actor_email, action, detail, created_at")
    .order("created_at", { ascending: false })
    .limit(25);

  return NextResponse.json({
    admin: { email: admin.email },
    treasury:
      "error" in treasury
        ? { error: treasury.error }
        : {
            address: treasury.address,
            eurc: treasury.eurcFormatted,
            eth: treasury.ethFormatted,
          },
    recipients,
    claims: (claims ?? []).map((claim) => ({
      ...claim,
      explorerUrl: claim.tx_hash ? baseScanUrl(claim.tx_hash) : null,
    })),
    events: events ?? [],
  });
}

interface ActionBody {
  action?: unknown;
  [key: string]: unknown;
}

export async function POST(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return forbidden();

  let body: ActionBody;
  try {
    body = (await request.json()) as ActionBody;
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const str = (key: string): string =>
    typeof body[key] === "string" ? (body[key] as string).trim() : "";

  switch (body.action) {
    // -----------------------------------------------------------------------
    case "add-recipient": {
      const scheme = str("scheme") === "earnings" ? "earnings" : "module";

      // An 'earnings' recipient may start without an address: the learner sets
      // it from their own dashboard. A 'module' recipient never may.
      let address: Address | null = null;
      if (str("address") || scheme === "module") {
        const parsed = normaliseAddress(str("address"));
        if ("error" in parsed) {
          return NextResponse.json({ error: parsed.error }, { status: 400 });
        }
        address = parsed.address;
      }
      const key = str("key").toLowerCase();
      const label = str("label");
      if (!key || !label) {
        return NextResponse.json({ error: "Key and label are required." }, { status: 400 });
      }
      // Mirrors the check in 0003, so the admin sees why instead of a
      // generic constraint error.
      if (!/^[a-z][a-z0-9_-]{1,30}$/.test(key)) {
        return NextResponse.json(
          {
            error:
              "The key must start with a letter and use only lowercase letters, digits, - or _ (2–31 characters).",
          },
          { status: 400 },
        );
      }
      // Earnings are found from the signed-in email; without one nobody can
      // ever see the balance or set the address.
      if (scheme === "earnings" && !str("claimantEmail")) {
        return NextResponse.json(
          { error: "Pay by XP and active time needs the learner's account email." },
          { status: 400 },
        );
      }

      const result = await addRecipient({
        key,
        label,
        address,
        scheme,
        amountEuros: str("amountEuros") || null,
        // Which signed-in account may claim into this wallet. Without it the
        // wallet exists but nobody can earn into it.
        claimantEmail: str("claimantEmail") || null,
        note: str("note") || null,
      });
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      await recordAdminEvent(admin.email, "recipient.added", {
        key,
        label,
        scheme,
        address,
        claimantEmail: str("claimantEmail") || null,
      });
      return NextResponse.json({ recipient: result.recipient });
    }

    // -----------------------------------------------------------------------
    case "set-status": {
      const id = str("id");
      const status = str("status");
      if (!["pending", "active", "disabled"].includes(status)) {
        return NextResponse.json({ error: "Unknown status." }, { status: 400 });
      }

      const before = await getRecipientById(id);
      if (!before) return NextResponse.json({ error: "No such recipient." }, { status: 404 });

      const result = await setRecipientStatus(id, status as "pending" | "active" | "disabled");
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      await recordAdminEvent(admin.email, `recipient.${status}`, {
        key: before.key,
        address: before.address,
        from: before.status,
      });
      return NextResponse.json({ recipient: result.recipient });
    }

    // -----------------------------------------------------------------------
    /**
     * Send a small amount to a recipient without activating it.
     *
     * This is the step that makes an address trustworthy: confirming a €1
     * transfer actually lands in the Coinbase account, on the right network,
     * before anything larger is ever sent there. It is the one path that may
     * pay a `pending` recipient, and only an admin can trigger it.
     */
    case "test-send": {
      const id = str("id");
      const recipient = await getRecipientById(id);
      if (!recipient) return NextResponse.json({ error: "No such recipient." }, { status: 404 });
      if (recipient.status === "disabled") {
        return NextResponse.json({ error: "That recipient is disabled." }, { status: 400 });
      }
      if (!recipient.address) {
        return NextResponse.json(
          { error: "That recipient has not set an address yet." },
          { status: 400 },
        );
      }
      const toAddress = recipient.address;

      const euros = str("amountEuros") || "1.00";
      let amountBaseUnits: string;
      try {
        amountBaseUnits = eurosToBaseUnits(euros).toString();
      } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
      }

      try {
        const payout = await sendEurcReward({
          toAddress,
          amountBaseUnits,
        });
        await recordAdminEvent(admin.email, "recipient.test-send", {
          key: recipient.key,
          address: recipient.address,
          amountEuros: euros,
          txHash: payout.txHash,
        });
        return NextResponse.json({
          txHash: payout.txHash,
          explorerUrl: baseScanUrl(payout.txHash),
          amountEurc: payout.amountEurc,
        });
      } catch (error) {
        const message =
          error instanceof PayoutError ? error.message : (error as Error).message;
        await recordAdminEvent(admin.email, "recipient.test-send-failed", {
          key: recipient.key,
          reason: message,
        });
        return NextResponse.json({ error: message }, { status: 502 });
      }
    }

    // -----------------------------------------------------------------------
    /**
     * Change where a recipient is paid.
     *
     * A per-module recipient returns to pending and must be tested and
     * activated again; an earnings recipient keeps its status, as it does
     * when the learner changes the address themselves.
     */
    case "set-address": {
      const parsed = normaliseAddress(str("address"));
      if ("error" in parsed) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
      }

      const result = await setRecipientAddress(str("id"), parsed.address);
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      await recordAdminEvent(admin.email, "recipient.address-set-by-admin", {
        key: result.previous.key,
        from: result.previous.address,
        to: parsed.address,
        status: { from: result.previous.status, to: result.recipient.status },
      });
      return NextResponse.json({ recipient: result.recipient });
    }

    // -----------------------------------------------------------------------
    /**
     * Change an earnings recipient's euros per XP and per active hour.
     *
     * An empty field restores the default. A new XP rate prices XP minted from
     * now on; XP already minted keeps its price. The hourly rate still
     * re-prices all active time.
     */
    case "set-rates": {
      const id = str("id");
      const before = await getRecipientById(id);
      if (!before) return NextResponse.json({ error: "No such recipient." }, { status: 404 });
      if (before.scheme !== "earnings") {
        return NextResponse.json(
          { error: "Only a recipient paid by XP and active time has rates." },
          { status: 400 },
        );
      }

      const rate = (key: string): string | null | { error: string } => {
        const value = str(key).replace(",", ".");
        if (!value) return null;
        return /^\d+(\.\d{1,6})?$/.test(value)
          ? value
          : { error: "A rate must be a number of euros with at most 6 decimals, like 0.002." };
      };
      const xpRateEuros = rate("xpRateEuros");
      const hourRateEuros = rate("hourRateEuros");
      for (const parsed of [xpRateEuros, hourRateEuros]) {
        if (parsed && typeof parsed === "object") {
          return NextResponse.json({ error: parsed.error }, { status: 400 });
        }
      }

      const result = await setRecipientRates(id, {
        xpRateEuros: xpRateEuros as string | null,
        hourRateEuros: hourRateEuros as string | null,
      });
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      await recordAdminEvent(admin.email, "recipient.rates-changed", {
        key: before.key,
        from: { xp: before.xpRateEuros, hour: before.hourRateEuros },
        to: { xp: result.recipient.xpRateEuros, hour: result.recipient.hourRateEuros },
      });
      return NextResponse.json({ recipient: result.recipient });
    }

    // -----------------------------------------------------------------------
    /**
     * Resolve a claim stuck in CLAIM_PENDING, by hand.
     *
     * Deliberately does not retry the payment and never will: a transaction
     * that appears lost can still be mined, and a retry beside it pays twice.
     * The admin looks up `broadcast_nonce` on BaseScan, sees what that nonce
     * actually did, and records the answer here.
     */
    case "resolve-claim": {
      const id = str("id");
      const outcome = str("outcome"); // 'paid' | 'failed'
      const txHash = str("txHash");

      if (!["paid", "failed"].includes(outcome)) {
        return NextResponse.json({ error: "Outcome must be paid or failed." }, { status: 400 });
      }
      if (outcome === "paid" && !/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
        return NextResponse.json(
          { error: "Marking a claim paid requires the transaction hash that did it." },
          { status: 400 },
        );
      }

      const { error } = await getSupabaseAdmin()
        .from("reward_claims")
        .update({
          status: outcome === "paid" ? "PAID" : "FAILED",
          tx_hash: outcome === "paid" ? txHash : null,
          failure_reason: outcome === "failed" ? `Resolved by ${admin.email}` : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("status", "CLAIM_PENDING");

      if (error) {
        return NextResponse.json({ error: "Could not update that claim." }, { status: 500 });
      }

      await recordAdminEvent(admin.email, `claim.resolved-${outcome}`, { id, txHash });
      return NextResponse.json({ ok: true });
    }

    default:
      return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }
}
