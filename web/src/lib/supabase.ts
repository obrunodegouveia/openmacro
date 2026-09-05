"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * ============================================================================
 * Supabase browser client
 * ============================================================================
 *
 * Returns `null` when the site is built without a project configured, which is
 * the default for a fork and for local development. Every consumer has to
 * handle that: with no client the site behaves exactly as it does today —
 * lessons play, nothing is saved, and no account UI appears anywhere.
 *
 * `NEXT_PUBLIC_*` values are inlined into the client bundle at build time, so
 * they must be present when `next build` runs — see the ARG/ENV pair in the
 * Dockerfile. Both are safe to ship: the publishable key grants only what
 * row-level security allows, which is "your own rows".
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True when this build has somewhere to sync to. Gates all account UI. */
export const cloudSyncConfigured = url.length > 0 && anonKey.length > 0;

let client: SupabaseClient | null = null;

/**
 * The shared browser client, created lazily.
 *
 * Lazy because module-level creation would run during prerender, where there
 * is no browser storage to bind a session to.
 */
export function getSupabase(): SupabaseClient | null {
  if (!cloudSyncConfigured) return null;
  if (!client) {
    client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // The browser comes back from Google with the session in the URL.
        detectSessionInUrl: true,
        /**
         * PKCE, not the library default of `implicit`. Implicit returns the
         * session in a URL fragment, which is invisible to a server and awkward
         * to clean up; PKCE returns `?code=` and is what Supabase recommends.
         */
        flowType: "pkce",
      },
    });
  }
  return client;
}
