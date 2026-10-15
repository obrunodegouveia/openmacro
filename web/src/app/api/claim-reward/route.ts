import { NextResponse } from "next/server";

import { getLearnerFromRequest, getSupabaseAdmin } from "@/lib/supabase-admin";
import { baseScanUrl, eurosToBaseUnits } from "@/lib/blockchain/payout";
import { payClaim } from "@/lib/rewards/pay-claim";
import { resolveRecipientForClaimant } from "@/lib/rewards/recipients";
import {
  moduleClaimKey,
  readAllModuleCompletions,
  readModuleCompletion,
} from "@/lib/rewards/modules";

/**
 * ============================================================================
 * POST /api/claim-reward
 * ============================================================================
 *
 * Pays a learner in EURC on Base for finishing a module, exactly once.
 *
 * The request names one thing: which module. It does not name a recipient, an
 * address, or an amount — all three are resolved server-side, so the only
 * decision a browser makes is which module it is asking about, and lying about
 * that fails the completion check.
 *
 * The order of operations is the design, and it is not rearrangeable:
 *
 *   1. Identify the caller from their bearer token.
 *   2. Resolve the wallet bound to that account. No binding, no payout.
 *   3. Verify the module is genuinely finished, from their progress rows.
 *   4. Insert a claim. A unique index makes a second one impossible.
 *   5. Compare-and-set to CLAIM_PENDING. Exactly one caller wins.
 *   6. Only then touch the chain.
 *   7. Record the hash, or the failure.
 *
 * Steps 5–7 live in lib/rewards/pay-claim.ts, shared with withdrawals.
 *
 * Steps 4 and 5 are both needed: the insert stops two modules colliding, the
 * compare-and-set stops two requests for the *same* module both deciding they
 * are first. Doing step 6 before step 5 is the bug that pays twice.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface ClaimBody {
  moduleId?: unknown;
}

export async function POST(request: Request) {
  // --- 1. who is asking -----------------------------------------------------
  const learner = await getLearnerFromRequest(request);
  if (!learner?.email) {
    return NextResponse.json({ error: "Sign in to claim a reward." }, { status: 401 });
  }

  let body: ClaimBody;
  try {
    body = (await request.json()) as ClaimBody;
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const moduleId = typeof body.moduleId === "string" ? body.moduleId : null;
  if (!moduleId) {
    return NextResponse.json({ error: "moduleId is required." }, { status: 400 });
  }

  // --- 2. which wallet is this account bound to? ---------------------------
  //
  // The request cannot influence this. An account with no active recipient
  // bound to it simply has nothing to claim into, which is also what someone
  // signing in out of curiosity should see.
  const payee = await resolveRecipientForClaimant(learner.email);
  if (!payee) {
    return NextResponse.json(
      { error: "There is no reward wallet set up for this account." },
      { status: 403 },
    );
  }

  // --- 3. is the module actually finished? ---------------------------------
  const completion = await readModuleCompletion(learner.id, moduleId);
  if (!completion) {
    return NextResponse.json({ error: "No such module." }, { status: 404 });
  }
  if (!completion.complete) {
    return NextResponse.json(
      {
        error: `${completion.completedCount} of ${completion.lessonCount} lessons done.`,
        completedCount: completion.completedCount,
        lessonCount: completion.lessonCount,
      },
      { status: 409 },
    );
  }

  const db = getSupabaseAdmin();
  const claimKey = moduleClaimKey(moduleId);

  let amountBaseUnits: string;
  try {
    const euros = payee.amountEuros ?? process.env.REWARD_AMOUNT_DEFAULT ?? "1.00";
    amountBaseUnits = eurosToBaseUnits(euros).toString();
  } catch (error) {
    console.error("[claim-reward] bad reward configuration", error);
    return NextResponse.json({ error: "Reward is misconfigured." }, { status: 500 });
  }

  // --- 4. open the claim, idempotently -------------------------------------
  const { data: inserted, error: insertError } = await db
    .from("reward_claims")
    .insert({
      user_id: learner.id,
      claim_key: claimKey,
      recipient_key: payee.key,
      amount_base_units: amountBaseUnits,
      status: "UNCLAIMED",
    })
    .select("id")
    .maybeSingle();

  let claimId: string;

  if (insertError) {
    // 23505 is unique_violation: already claimed. The idempotent path.
    if (insertError.code !== "23505") {
      console.error("[claim-reward] insert failed", insertError);
      return NextResponse.json({ error: "Could not open a claim." }, { status: 500 });
    }

    const { data: existing } = await db
      .from("reward_claims")
      .select("id, status, tx_hash")
      .eq("user_id", learner.id)
      .eq("claim_key", claimKey)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json({ error: "Could not open a claim." }, { status: 500 });
    }
    if (existing.status === "PAID") {
      return NextResponse.json({
        status: "PAID",
        alreadyClaimed: true,
        txHash: existing.tx_hash,
        explorerUrl: existing.tx_hash ? baseScanUrl(existing.tx_hash) : null,
      });
    }
    if (existing.status === "CLAIM_PENDING") {
      return NextResponse.json(
        { status: "CLAIM_PENDING", error: "This reward is already being paid." },
        { status: 409 },
      );
    }
    claimId = existing.id as string;
  } else {
    claimId = inserted!.id as string;
  }

  // --- 5–7. lock, pay, record ------------------------------------------------
  //
  // Shared with earnings withdrawals so there is one copy of the part that can
  // pay twice. See lib/rewards/pay-claim.ts.
  const outcome = await payClaim({
    claimId,
    toAddress: payee.address,
    amountBaseUnits,
    retryableStatus: "UNCLAIMED",
    logPrefix: "[claim-reward]",
  });

  switch (outcome.status) {
    case "PAID":
      return NextResponse.json({
        status: "PAID",
        txHash: outcome.txHash,
        explorerUrl: outcome.explorerUrl,
        amountEurc: outcome.amountEurc,
        moduleTitle: completion.title,
      });
    case "LOCK_ERROR":
      return NextResponse.json({ error: "Could not start the payout." }, { status: 500 });
    case "LOCKED":
      return NextResponse.json(
        { status: "CLAIM_PENDING", error: "This reward is already being paid." },
        { status: 409 },
      );
    default:
      return NextResponse.json(
        { status: outcome.status, error: outcome.error },
        { status: 502 },
      );
  }
}

/**
 * GET /api/claim-reward
 *
 * Every module, how far through it this learner is, and what has been claimed.
 * One request so the UI never has to guess, and so a client that lost its
 * connection mid-payout can find out what happened without starting another.
 */
export async function GET(request: Request) {
  const learner = await getLearnerFromRequest(request);
  if (!learner?.email) {
    return NextResponse.json({ error: "Sign in to view rewards." }, { status: 401 });
  }

  const [payee, modules] = await Promise.all([
    resolveRecipientForClaimant(learner.email),
    readAllModuleCompletions(learner.id),
  ]);

  const { data: claims } = await getSupabaseAdmin()
    .from("reward_claims")
    .select("claim_key, status, tx_hash")
    .eq("user_id", learner.id);

  const byKey = new Map((claims ?? []).map((claim) => [claim.claim_key as string, claim]));

  return NextResponse.json({
    // Null tells the UI to show nothing at all rather than a button that
    // cannot work — a learner with no wallet bound should not be offered money.
    reward: payee ? { label: payee.label, amountEuros: payee.amountEuros ?? "1.00" } : null,
    modules: modules.map((module) => {
      const claim = byKey.get(moduleClaimKey(module.moduleId));
      return {
        ...module,
        claimStatus: (claim?.status as string) ?? "UNCLAIMED",
        txHash: claim?.tx_hash ?? null,
        explorerUrl: claim?.tx_hash ? baseScanUrl(claim.tx_hash as string) : null,
      };
    }),
  });
}
