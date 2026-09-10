import "server-only";

import { getLearnerFromRequest, getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * ============================================================================
 * Who may manage the treasury
 * ============================================================================
 *
 * Admin identity comes from `REWARDS_ADMIN_EMAILS` in the server environment
 * and from nowhere else.
 *
 * It is deliberately not a column. A boolean `is_admin` in Postgres is one SQL
 * injection, one leaked service key, or one careless migration away from
 * promoting an attacker, and nothing about that is visible in a code review.
 * An environment variable can only be changed by someone who can deploy, which
 * for a treasury is the right bar.
 *
 * The email is taken from the Supabase-verified session, not from the request
 * body, so it cannot be asserted by the caller.
 */

export interface Admin {
  id: string;
  email: string;
}

/** Comma-separated, case-insensitive. Empty means nobody is an admin. */
function adminEmails(): string[] {
  return (process.env.REWARDS_ADMIN_EMAILS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Resolve the caller to an admin, or null.
 *
 * Null covers every failure — not signed in, signed in as someone else,
 * no allow-list configured — because the caller should not learn which.
 */
export async function getAdminFromRequest(request: Request): Promise<Admin | null> {
  const learner = await getLearnerFromRequest(request);
  if (!learner?.email) return null;

  const allowed = adminEmails();
  if (allowed.length === 0) {
    console.warn("[rewards] REWARDS_ADMIN_EMAILS is unset; treasury admin is disabled.");
    return null;
  }

  if (!allowed.includes(learner.email.toLowerCase())) return null;
  return { id: learner.id, email: learner.email };
}

/**
 * Record something that could move money somewhere new.
 *
 * Deliberately never throws: a failed audit write must not roll back the action
 * it describes, and losing the log entry is less bad than a half-applied
 * change. It is loud in the server log instead.
 */
export async function recordAdminEvent(
  actorEmail: string,
  action: string,
  detail: Record<string, unknown> = {},
): Promise<void> {
  try {
    await getSupabaseAdmin()
      .from("reward_admin_events")
      .insert({ actor_email: actorEmail, action, detail });
  } catch (error) {
    console.error("[rewards] failed to record admin event", { action, detail }, error);
  }
}
