import { NextResponse } from "next/server";

import { getLearnerFromRequest, getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * ============================================================================
 * POST /api/account/delete
 * ============================================================================
 *
 * Deletes the calling learner's account and everything attached to it.
 *
 * Apple guideline 5.1.1(v) and Google Play's data deletion policy both require
 * an app that lets people create accounts to let them delete one from inside
 * the app. This is that endpoint, and both the website and the mobile app call
 * it — deletion logic that exists twice will eventually behave differently in
 * the two places, and the difference will be discovered by someone who wanted
 * their data gone.
 *
 * Deleting the auth user is the whole operation: `profiles`, `lesson_progress`
 * and `game_sessions` all cascade from it. `reward_claims` deliberately does
 * not — migration 0005 makes it `set null`, so a record that euros moved
 * survives with nothing in it pointing at a person.
 *
 * It deletes only the caller. The user id comes from a Supabase-verified
 * bearer token and is never read from the body, so there is no shape of
 * request that deletes somebody else.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const learner = await getLearnerFromRequest(request);
  if (!learner) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  /**
   * A deliberate second step. The request must carry the caller's own email,
   * typed by them, matching the session — so a stray tap or a replayed request
   * cannot erase an account. It is confirmation, not authentication; the token
   * above is what actually decides who this is.
   */
  let body: { confirmEmail?: unknown };
  try {
    body = (await request.json()) as { confirmEmail?: unknown };
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const typed = typeof body.confirmEmail === "string" ? body.confirmEmail.trim() : "";
  if (!learner.email || typed.toLowerCase() !== learner.email.toLowerCase()) {
    return NextResponse.json(
      { error: "Type the email address of this account to confirm." },
      { status: 400 },
    );
  }

  const { error } = await getSupabaseAdmin().auth.admin.deleteUser(learner.id);

  if (error) {
    // Loud, because a learner who asked to be deleted and was not is owed an
    // answer, and this is the only place that would record the attempt.
    console.error("[account] deletion failed", { userId: learner.id }, error);
    return NextResponse.json(
      { error: "The account could not be deleted. Nothing has been changed." },
      { status: 500 },
    );
  }

  console.warn("[account] deleted", { userId: learner.id });
  return NextResponse.json({ deleted: true });
}
