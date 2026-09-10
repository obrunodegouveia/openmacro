import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * ============================================================================
 * Supabase service-role client
 * ============================================================================
 *
 * Bypasses row-level security completely. Every query made through this client
 * runs as the database owner, so it is the app's most dangerous object and the
 * only correct place for it is a route handler that has already decided who
 * the caller is.
 *
 * `import "server-only"` makes reaching for it from a client component a build
 * error. The key it reads is deliberately not prefixed `NEXT_PUBLIC_`, so Next
 * will not inline it into the browser bundle even by accident.
 *
 * Rules of use:
 *
 *   - Authenticate the caller first, with `getLearnerFromRequest` below, and
 *     scope every query by that user id. This client will happily return
 *     another learner's rows if you ask it to.
 *   - Never construct one in a component, a middleware, or a shared util that
 *     a client component might import transitively.
 *   - Prefer the anon client for anything a learner is allowed to do
 *     themselves. Service role is for writes the learner must not control —
 *     which, in this app, means reward claims and nothing else.
 */

let admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (admin) return admin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  admin = createClient(url, serviceRoleKey, {
    auth: {
      // A service-role client has no user and must never try to acquire one.
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return admin;
}

export interface Learner {
  id: string;
  email: string | null;
}

/**
 * Identify the caller from their bearer token.
 *
 * The browser sends the access token from its Supabase session; this verifies
 * it against Supabase and returns the user, or null. Returning null rather
 * than throwing keeps the "who are you" question separate from the "may you do
 * this" question at the call site.
 *
 * Verification happens server-side against Supabase on every request. Decoding
 * the JWT locally and trusting its claims would accept any well-formed token.
 */
export async function getLearnerFromRequest(
  request: Request,
): Promise<Learner | null> {
  const header = request.headers.get("authorization");
  const token = header?.toLowerCase().startsWith("bearer ")
    ? header.slice(7).trim()
    : null;
  if (!token) return null;

  const { data, error } = await getSupabaseAdmin().auth.getUser(token);
  if (error || !data.user) return null;

  return { id: data.user.id, email: data.user.email ?? null };
}
