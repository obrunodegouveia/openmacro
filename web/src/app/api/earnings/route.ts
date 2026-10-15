import { NextResponse } from "next/server";

import { getLearnerFromRequest, getSupabaseAdmin } from "@/lib/supabase-admin";
import { baseScanUrl } from "@/lib/blockchain/payout";
import { recordAdminEvent } from "@/lib/rewards/admin";
import {
  MIN_WITHDRAWAL_BASE_UNITS,
  readEarnings,
  recordActiveMinute,
  withdrawalClaimKey,
  type EarningsSummary,
} from "@/lib/rewards/earnings";
import { payClaim } from "@/lib/rewards/pay-claim";
import {
  normaliseAddress,
  resolveRecipientForClaimant,
  setClaimantAddress,
  type Recipient,
} from "@/lib/rewards/recipients";

/**
 * ============================================================================
 * /api/earnings — the balance of an 'earnings' recipient
 * ============================================================================
 *
 * GET  — the balance, how it was earned, and past withdrawals.
 * POST — one of three actions:
 *
 *   heartbeat    "I am here and active." The server stamps the minute.
 *   set-address  The learner's own EURC address on Base. Immediate.
 *   withdraw     Pays the whole balance, down to the cent, to that address.
 *
 * Every request resolves the recipient from the signed-in account. Nothing in
 * a request body names a recipient or an amount, and the only address a body
 * may carry is the learner's own, for their own row (see setClaimantAddress).
 *
 * A signed-in account that is not an 'earnings' recipient gets
 * `{ earnings: null }` from GET and a refusal from POST, and its activity is
 * never recorded.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** The balance as JSON. Base units travel as strings: they are bigints. */
function serialise(recipient: Recipient, summary: EarningsSummary) {
  return {
    label: recipient.label,
    address: recipient.address,
    xp: summary.xp,
    maxXp: summary.maxXp,
    activeMinutes: summary.activeMinutes,
    activeMinutesToday: summary.activeMinutesToday,
    xpRateEuros: summary.xpRateEuros,
    hourRateEuros: summary.hourRateEuros,
    earnedFromXp: summary.earnedFromXp.toString(),
    earnedFromTime: summary.earnedFromTime.toString(),
    withdrawn: summary.withdrawn.toString(),
    balance: summary.balance.toString(),
    withdrawable: summary.withdrawable.toString(),
    minWithdrawal: MIN_WITHDRAWAL_BASE_UNITS.toString(),
    withdrawals: summary.withdrawals.map((w) => ({
      id: w.id,
      amount: w.amount.toString(),
      status: w.status,
      explorerUrl: w.txHash ? baseScanUrl(w.txHash) : null,
      createdAt: w.createdAt,
    })),
  };
}

async function enrolled(request: Request) {
  const learner = await getLearnerFromRequest(request);
  if (!learner?.email) return { learner: null, recipient: null } as const;
  const recipient = await resolveRecipientForClaimant(learner.email);
  return {
    learner,
    recipient: recipient?.scheme === "earnings" ? recipient : null,
  } as const;
}

export async function GET(request: Request) {
  // Every signed-in page view asks this once (components/app/activity-heartbeat).
  // A deployment without reward credentials answers "not enrolled" quietly
  // instead of failing for every learner on every page.
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ earnings: null });

  const { learner, recipient } = await enrolled(request);
  if (!learner) {
    return NextResponse.json({ error: "Sign in to view earnings." }, { status: 401 });
  }
  if (!recipient) return NextResponse.json({ earnings: null });

  try {
    const summary = await readEarnings(learner.id, recipient);
    return NextResponse.json({ earnings: serialise(recipient, summary) });
  } catch (error) {
    console.error("[earnings] read failed", error);
    return NextResponse.json({ error: "Could not read your balance." }, { status: 500 });
  }
}

interface ActionBody {
  action?: unknown;
  address?: unknown;
}

export async function POST(request: Request) {
  const { learner, recipient } = await enrolled(request);
  if (!learner) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  if (!recipient) {
    return NextResponse.json(
      { error: "There is no reward wallet set up for this account." },
      { status: 403 },
    );
  }

  let body: ActionBody;
  try {
    body = (await request.json()) as ActionBody;
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  switch (body.action) {
    // -----------------------------------------------------------------------
    case "heartbeat": {
      const ok = await recordActiveMinute(learner.id);
      return NextResponse.json({ ok }, { status: ok ? 200 : 500 });
    }

    // -----------------------------------------------------------------------
    case "set-address": {
      const parsed = normaliseAddress(typeof body.address === "string" ? body.address : "");
      if ("error" in parsed) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
      }

      const result = await setClaimantAddress(learner.email!, parsed.address);
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      // The audit log is the only record of where money was pointed and when.
      // The actor is the learner, which is exactly what it should say.
      await recordAdminEvent(learner.email!, "recipient.address-set-by-claimant", {
        key: recipient.key,
        from: result.previous,
        to: parsed.address,
      });
      return NextResponse.json({ address: result.recipient.address });
    }

    // -----------------------------------------------------------------------
    case "withdraw":
      return withdraw(learner.id, recipient);

    default:
      return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }
}

/**
 * Pay the whole withdrawable balance.
 *
 * Double payment is prevented the same way as for module claims, plus one
 * step. Two concurrent withdrawals both read the same balance and the same
 * withdrawal count, so both try to insert `withdrawal:<n>` with the same n —
 * the unique index lets exactly one in. A withdrawal that starts after another
 * was inserted sees it in `withdrawn` and computes a smaller balance.
 */
async function withdraw(userId: string, recipient: Recipient) {
  if (!recipient.address) {
    return NextResponse.json(
      { error: "Add your EURC address on Base before withdrawing." },
      { status: 400 },
    );
  }

  let summary: EarningsSummary;
  try {
    summary = await readEarnings(userId, recipient);
  } catch (error) {
    console.error("[earnings] read failed", error);
    return NextResponse.json({ error: "Could not read your balance." }, { status: 500 });
  }

  if (summary.withdrawable < MIN_WITHDRAWAL_BASE_UNITS) {
    return NextResponse.json(
      { error: "You can withdraw once your balance reaches €1.00." },
      { status: 409 },
    );
  }

  const db = getSupabaseAdmin();
  const amountBaseUnits = summary.withdrawable.toString();

  const { data: inserted, error: insertError } = await db
    .from("reward_claims")
    .insert({
      user_id: userId,
      claim_key: withdrawalClaimKey(summary.withdrawalCount + 1),
      recipient_key: recipient.key,
      amount_base_units: amountBaseUnits,
      status: "UNCLAIMED",
    })
    .select("id")
    .maybeSingle();

  if (insertError || !inserted) {
    if (insertError?.code === "23505") {
      return NextResponse.json(
        { error: "A withdrawal is already in progress." },
        { status: 409 },
      );
    }
    console.error("[earnings] could not open withdrawal", insertError);
    return NextResponse.json({ error: "Could not start the withdrawal." }, { status: 500 });
  }

  const outcome = await payClaim({
    claimId: inserted.id as string,
    toAddress: recipient.address,
    amountBaseUnits,
    retryableStatus: "VOID",
    logPrefix: "[earnings]",
  });

  switch (outcome.status) {
    case "PAID":
      return NextResponse.json({
        status: "PAID",
        amountEurc: outcome.amountEurc,
        explorerUrl: outcome.explorerUrl,
      });
    case "LOCK_ERROR":
      return NextResponse.json({ error: "Could not start the withdrawal." }, { status: 500 });
    case "LOCKED":
      return NextResponse.json(
        { error: "A withdrawal is already in progress." },
        { status: 409 },
      );
    default:
      return NextResponse.json({ status: outcome.status, error: outcome.error }, { status: 502 });
  }
}
