"use client";

import * as React from "react";

import { useAuth } from "@/components/site/auth-provider";
import { isActiveNow, startActivityTracking } from "@/lib/activity";
import { getSupabase } from "@/lib/supabase";

/**
 * ============================================================================
 * Activity heartbeat
 * ============================================================================
 *
 * Tells the server "this learner is here" every thirty seconds while they are
 * active, so an 'earnings' recipient is paid for time spent learning. The
 * server stamps the minute itself (lib/rewards/earnings.ts), so pinging twice
 * a minute costs nothing extra and guarantees no active minute is missed.
 *
 * Does nothing for anybody else. It asks /api/earnings once per tab session
 * whether this account is enrolled, and a learner who is not never sends a
 * single heartbeat — nobody's time is recorded unless they are being paid
 * for it.
 *
 * Mounted once in the root layout, so time on every page counts — the lesson
 * player above all, not only the dashboard. Renders nothing.
 */

const PING_EVERY_MS = 30 * 1000;

async function bearer(): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

/** Cached per tab, so most page views cost no request at all. */
async function isEnrolled(userId: string): Promise<boolean> {
  const cacheKey = `om.earnings.enrolled.${userId}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached !== null) return cached === "1";
  } catch {
    // Storage blocked: fall through and ask.
  }

  const token = await bearer();
  if (!token) return false;
  try {
    const response = await fetch("/api/earnings", {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return false;
    const { earnings } = (await response.json()) as { earnings: unknown };
    const enrolled = earnings !== null;
    try {
      sessionStorage.setItem(cacheKey, enrolled ? "1" : "0");
    } catch {
      // Not cached; the next page view asks again.
    }
    return enrolled;
  } catch {
    return false;
  }
}

export function ActivityHeartbeat() {
  const { learner } = useAuth();
  const userId = learner?.id ?? null;

  React.useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    async function ping() {
      if (!isActiveNow()) return;
      const token = await bearer();
      if (!token || cancelled) return;
      try {
        await fetch("/api/earnings", {
          method: "POST",
          headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
          body: JSON.stringify({ action: "heartbeat" }),
          keepalive: true,
        });
      } catch {
        // Offline or the server is busy: that minute simply goes unrecorded.
      }
    }

    void (async () => {
      if (!(await isEnrolled(userId)) || cancelled) return;
      startActivityTracking();
      void ping();
      timer = setInterval(() => void ping(), PING_EVERY_MS);
    })();

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [userId]);

  return null;
}
