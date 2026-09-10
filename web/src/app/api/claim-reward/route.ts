import { NextResponse } from "next/server";

import { getLearnerFromRequest, getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  baseScanUrl,
  eurosToBaseUnits,
  PayoutError,
  sendEurcReward,
} from "@/lib/blockchain/payout";
import { resolvePayableRecipient } from "@/lib/rewards/recipients";

/**
 * ============================================================================
 * POST /api/claim-reward
 * ============================================================================
 *
 * Pays a family member in EURC on Base for finishing a game, exactly once.
 *
 * The order of operations is the whole design, and it is not rearrangeable:
 *
 *   1. Identify the caller from their bearer token.
 *   2. Verify the session exists, belongs to them, and is finished.
 *   3. Insert a claim row. A unique index makes a second insert for the same
 *      session impossible rather than unlikely.
 *   4. Compare-and-set the row to CLAIM_PENDING. Exactly one caller wins.
 *   5. Only then touch the chain.
 *   6. Record the hash, or the failure.
 *
 * Steps 3 and 4 are both needed. The insert stops two *sessions* colliding;
 * the compare-and-set stops two requests for the *same* session both deciding
 * they are first. Doing step 5 before step 4 — checking a status in
 * application code and then paying — is the bug that pays twice.
 *
 * The response returns as soon as the transaction is accepted by the network,
 * not when it is mined. Holding an HTTP request open across block times turns
 * a slow block into a failed claim, and the hash is enough for the client to
 * watch.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface ClaimBody {
  gameSessionId?: unknown;
  recipient?: unknown;
}

/** Shape only. Whether a key is *payable* is the database's answer, not this. */
function isRecipientKeyShape(value: unknown): value is string {
  return typeof value === "string" && /^[a-z][a-z0-9_-]{1,30}$/.test(value);
}

export async function POST(request: Request) {
  // --- 1. who is asking -----------------------------------------------------
  const learner = await getLearnerFromRequest(request);
  if (!learner) {
    return NextResponse.json(
      { error: "Sign in to claim a reward." },
      { status: 401 },
    );
  }

  let body: ClaimBody;
  try {
    body = (await request.json()) as ClaimBody;
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const gameSessionId = typeof body.gameSessionId === "string" ? body.gameSessionId : null;
  if (!gameSessionId) {
    return NextResponse.json({ error: "gameSessionId is required." }, { status: 400 });
  }

  /**
   * The recipient is a key, never an address. The request may choose *which*
   * family member is paid; it may never choose where the money goes. The
   * address is resolved below from an active row, and an inactive or unknown
   * key simply does not resolve.
   */
  if (!isRecipientKeyShape(body.recipient)) {
    return NextResponse.json({ error: "recipient is not a valid key." }, { status: 400 });
  }
  const recipient = body.recipient;

  const db = getSupabaseAdmin();

  // --- 2. is the reward earned? --------------------------------------------
  const { data: session, error: sessionError } = await db
    .from("game_sessions")
    .select("id, user_id, finished_at")
    .eq("id", gameSessionId)
    // Scope by user: the service role ignores RLS, so ownership is this app's
    // job now. Omitting this would let anyone claim anyone's session.
    .eq("user_id", learner.id)
    .maybeSingle();

  if (sessionError) {
    console.error("[claim-reward] session lookup failed", sessionError);
    return NextResponse.json({ error: "Could not read that game session." }, { status: 500 });
  }
  if (!session) {
    return NextResponse.json({ error: "No such game session." }, { status: 404 });
  }
  if (!session.finished_at) {
    return NextResponse.json(
      { error: "That game is not finished yet." },
      { status: 409 },
    );
  }

  // --- 3. is this recipient payable? ---------------------------------------
  //
  // Unknown, pending and disabled are one answer to the player. A pending
  // address is one an admin has entered but not yet confirmed receives funds,
  // and it must never be paid by this path.
  const payee = await resolvePayableRecipient(recipient);
  if (!payee) {
    return NextResponse.json(
      { error: "That reward is not available." },
      { status: 409 },
    );
  }

  let amountBaseUnits: string;
  try {
    const euros = payee.amountEuros ?? process.env.REWARD_AMOUNT_DEFAULT ?? "1.00";
    amountBaseUnits = eurosToBaseUnits(euros).toString();
  } catch (error) {
    console.error("[claim-reward] bad reward configuration", error);
    return NextResponse.json({ error: "Reward is misconfigured." }, { status: 500 });
  }

  const { data: inserted, error: insertError } = await db
    .from("reward_claims")
    .insert({
      user_id: learner.id,
      game_session_id: gameSessionId,
      recipient_key: recipient,
      amount_base_units: amountBaseUnits,
      status: "UNCLAIMED",
    })
    .select("id, status, tx_hash")
    .maybeSingle();

  let claimId: string;

  if (insertError) {
    // 23505 is unique_violation: this session already has a claim. That is the
    // idempotent path, not an error — return whatever happened last time.
    if (insertError.code !== "23505") {
      console.error("[claim-reward] insert failed", insertError);
      return NextResponse.json({ error: "Could not open a claim." }, { status: 500 });
    }

    const { data: existing } = await db
      .from("reward_claims")
      .select("id, status, tx_hash, failure_reason")
      .eq("user_id", learner.id)
      .eq("game_session_id", gameSessionId)
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
    // FAILED, or an UNCLAIMED row from an insert that raced us: fall through
    // and let the compare-and-set below decide.
    claimId = existing.id as string;
  } else {
    claimId = inserted!.id as string;
  }

  // --- 4. exactly one caller proceeds --------------------------------------
  const { data: locked, error: lockError } = await db.rpc("begin_reward_claim", {
    p_claim_id: claimId,
  });

  if (lockError) {
    console.error("[claim-reward] lock failed", lockError);
    return NextResponse.json({ error: "Could not start the payout." }, { status: 500 });
  }
  // No row means the status was not UNCLAIMED: another request is paying, or
  // it is already paid. Either way this request must not touch the chain.
  const won = Array.isArray(locked) ? locked.length > 0 : Boolean(locked);
  if (!won) {
    return NextResponse.json(
      { status: "CLAIM_PENDING", error: "This reward is already being paid." },
      { status: 409 },
    );
  }

  // --- 5. pay ---------------------------------------------------------------
  try {
    const payout = await sendEurcReward({
      toAddress: payee.address,
      amountBaseUnits,
      // Recorded before broadcast so a crash here leaves something to
      // reconcile against rather than a guess.
      onNonceAssigned: async (nonce) => {
        await db.from("reward_claims").update({ broadcast_nonce: nonce }).eq("id", claimId);
      },
    });

    // --- 6. record it ------------------------------------------------------
    const { error: updateError } = await db
      .from("reward_claims")
      .update({
        status: "PAID",
        tx_hash: payout.txHash,
        // The address actually paid, so history survives an address change.
        paid_to_address: payout.recipientAddress,
        updated_at: new Date().toISOString(),
      })
      .eq("id", claimId);

    if (updateError) {
      // The money is gone and the row says pending. Loud, because only a human
      // can safely reconcile this — and must not simply retry the payment.
      console.error(
        "[claim-reward] PAID BUT NOT RECORDED",
        { claimId, txHash: payout.txHash, nonce: payout.nonce },
        updateError,
      );
    }

    return NextResponse.json({
      status: "PAID",
      txHash: payout.txHash,
      explorerUrl: baseScanUrl(payout.txHash),
      amountEurc: payout.amountEurc,
      recipient,
    });
  } catch (error) {
    const payoutError = error instanceof PayoutError ? error : null;
    const reason = payoutError?.message ?? (error as Error).message;

    console.error("[claim-reward] payout failed", { claimId, reason });

    /**
     * Only reset to UNCLAIMED when we know nothing was broadcast. Every
     * PayoutError thrown before the send is safe to retry; a broadcast that
     * failed *after* leaving the process is not, because the transaction may
     * still be mined. Anything uncertain stays FAILED for a human to look at.
     */
    const safeToRetry = payoutError?.retryable === true && payoutError.code !== "BROADCAST_FAILED";

    await db
      .from("reward_claims")
      .update({
        status: safeToRetry ? "UNCLAIMED" : "FAILED",
        failure_reason: reason.slice(0, 500),
        updated_at: new Date().toISOString(),
      })
      .eq("id", claimId);

    return NextResponse.json(
      {
        status: safeToRetry ? "UNCLAIMED" : "FAILED",
        // Configuration and funding problems are the operator's, not the
        // player's: say enough for the operator reading logs, but keep the
        // learner's message plain.
        error: safeToRetry
          ? "The reward could not be paid right now. Try again shortly."
          : "The reward could not be paid. Someone will need to look at this.",
      },
      { status: 502 },
    );
  }
}

/**
 * GET /api/claim-reward?gameSessionId=…
 *
 * The state of a claim, so a client that lost its connection mid-payout can
 * find out what happened without triggering another one.
 */
export async function GET(request: Request) {
  const learner = await getLearnerFromRequest(request);
  if (!learner) {
    return NextResponse.json({ error: "Sign in to view a claim." }, { status: 401 });
  }

  const gameSessionId = new URL(request.url).searchParams.get("gameSessionId");
  if (!gameSessionId) {
    return NextResponse.json({ error: "gameSessionId is required." }, { status: 400 });
  }

  const { data } = await getSupabaseAdmin()
    .from("reward_claims")
    .select("status, tx_hash, amount_base_units, recipient_key")
    .eq("user_id", learner.id)
    .eq("game_session_id", gameSessionId)
    .maybeSingle();

  if (!data) return NextResponse.json({ status: "UNCLAIMED" });

  return NextResponse.json({
    status: data.status,
    txHash: data.tx_hash,
    explorerUrl: data.tx_hash ? baseScanUrl(data.tx_hash) : null,
    recipient: data.recipient_key,
  });
}
