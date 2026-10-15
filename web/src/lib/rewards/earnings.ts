import "server-only";

import { MODULES } from "@openmacro/core/content/registry";
import { DEFAULT_CHALLENGE_XP } from "@openmacro/core/content/schema";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { eurosToBaseUnits } from "@/lib/blockchain/payout";
import type { Recipient } from "@/lib/rewards/recipients";

/**
 * ============================================================================
 * Earnings: a balance built from XP and active time
 * ============================================================================
 *
 * For a recipient on the 'earnings' scheme (migration 0006). The balance is
 * never stored; it is recomputed on every read from three things:
 *
 *   earned    = best XP per lesson × the XP rate
 *             + active minutes ÷ 60 × the hourly rate
 *   withdrawn = every withdrawal that is in flight, paid, or failed after
 *               broadcasting (it may still have been mined)
 *   balance   = earned − withdrawn
 *
 * Recomputing rather than storing means there is no counter to drift, and a
 * withdrawal that failed before sending (VOID) simply stops counting.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS CANNOT PROVE
 * ---------------------------------------------------------------------------
 *
 * Both inputs come from the learner's side. lesson_progress is writable by
 * them (migration 0001), and "active" means the browser said so. Two things
 * keep the damage bounded:
 *
 *   - Best XP is capped per lesson at the most that lesson can award, from
 *     the content registry. The whole course is worth MAX_COURSE_XP, however
 *     the rows were written.
 *   - Minutes are stamped by the server's clock, one row each. Nothing can be
 *     backfilled, and a day can never hold more than 24 hours.
 */

/** 0.2 cents per XP — the rate agreed for the first earnings recipient. */
export const DEFAULT_XP_RATE_EUROS = "0.002";
/** 20 cents per hour of active time. */
export const DEFAULT_HOUR_RATE_EUROS = "0.20";

/**
 * Smallest withdrawal. Base gas is a fraction of a cent, so this is not about
 * fees; it keeps the payout history readable and avoids dust transfers.
 */
export const MIN_WITHDRAWAL_BASE_UNITS = 1_000_000n; // €1.00

/** Withdrawals are rounded down to whole cents; the remainder stays. */
const CENT_BASE_UNITS = 10_000n;

/** The most XP each lesson can award, first attempt on every challenge. */
const MAX_XP_BY_LESSON: ReadonlyMap<string, number> = new Map(
  MODULES.flatMap((module) =>
    module.lessons.map((lesson) => [
      lesson.id,
      lesson.challenges.reduce((sum, challenge) => sum + (challenge.xp ?? DEFAULT_CHALLENGE_XP), 0),
    ]),
  ),
);

export const MAX_COURSE_XP = [...MAX_XP_BY_LESSON.values()].reduce((a, b) => a + b, 0);

/** Statuses that count as money gone, or possibly gone. */
const WITHDRAWN_STATUSES = ["UNCLAIMED", "CLAIM_PENDING", "PAID", "FAILED"] as const;

export interface EarningsSummary {
  xp: number;
  maxXp: number;
  activeMinutes: number;
  activeMinutesToday: number;
  xpRateEuros: string;
  hourRateEuros: string;
  earnedFromXp: bigint;
  earnedFromTime: bigint;
  withdrawn: bigint;
  balance: bigint;
  /** What a withdrawal right now would send: the balance, down to the cent. */
  withdrawable: bigint;
  withdrawals: {
    id: string;
    amount: bigint;
    status: string;
    txHash: string | null;
    createdAt: string;
  }[];
  /** Total rows ever opened, VOID included — the next withdrawal is n + 1. */
  withdrawalCount: number;
}

export function withdrawalClaimKey(n: number): string {
  return `withdrawal:${n}`;
}

/**
 * Record that this learner is active in the current minute.
 *
 * The minute comes from the server's clock. Duplicate pings in the same minute
 * collide on the primary key and are ignored, so the client can ping as often
 * as it likes without inflating anything.
 */
export async function recordActiveMinute(userId: string): Promise<boolean> {
  const minute = new Date();
  minute.setUTCSeconds(0, 0);

  const { error } = await getSupabaseAdmin()
    .from("activity_minutes")
    .upsert(
      { user_id: userId, minute: minute.toISOString() },
      { onConflict: "user_id,minute", ignoreDuplicates: true },
    );
  if (error) {
    console.error("[earnings] could not record activity", error);
    return false;
  }
  return true;
}

/** Compute the learner's balance from scratch. */
export async function readEarnings(
  userId: string,
  recipient: Recipient,
): Promise<EarningsSummary> {
  const db = getSupabaseAdmin();

  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const [progress, minutesAll, minutesToday, claims] = await Promise.all([
    db.from("lesson_progress").select("lesson_id, best_xp").eq("user_id", userId),
    db
      .from("activity_minutes")
      .select("minute", { count: "exact", head: true })
      .eq("user_id", userId),
    db
      .from("activity_minutes")
      .select("minute", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("minute", startOfToday.toISOString()),
    db
      .from("reward_claims")
      .select("id, amount_base_units, status, tx_hash, created_at")
      .eq("user_id", userId)
      .like("claim_key", "withdrawal:%")
      .order("created_at", { ascending: false }),
  ]);

  for (const result of [progress, minutesAll, minutesToday, claims]) {
    // A partial read would understate what was withdrawn and overstate the
    // balance. Refuse rather than guess.
    if (result.error) throw new Error(`earnings read failed: ${result.error.message}`);
  }

  const xp = (progress.data ?? []).reduce((sum, row) => {
    const cap = MAX_XP_BY_LESSON.get(row.lesson_id as string);
    // A lesson the registry does not know — removed, or invented — earns nothing.
    if (cap === undefined) return sum;
    return sum + Math.min(Math.max(0, row.best_xp as number), cap);
  }, 0);

  const activeMinutes = minutesAll.count ?? 0;
  const xpRateEuros = recipient.xpRateEuros ?? DEFAULT_XP_RATE_EUROS;
  const hourRateEuros = recipient.hourRateEuros ?? DEFAULT_HOUR_RATE_EUROS;

  const earnedFromXp = BigInt(xp) * eurosToBaseUnits(xpRateEuros);
  // Multiply before dividing so no partial minute is lost to rounding early.
  const earnedFromTime = (BigInt(activeMinutes) * eurosToBaseUnits(hourRateEuros)) / 60n;

  const rows = claims.data ?? [];
  const withdrawn = rows
    .filter((row) => (WITHDRAWN_STATUSES as readonly string[]).includes(row.status as string))
    .reduce((sum, row) => sum + BigInt(row.amount_base_units as string), 0n);

  const earned = earnedFromXp + earnedFromTime;
  const balance = earned > withdrawn ? earned - withdrawn : 0n;
  const withdrawable = (balance / CENT_BASE_UNITS) * CENT_BASE_UNITS;

  return {
    xp,
    maxXp: MAX_COURSE_XP,
    activeMinutes,
    activeMinutesToday: minutesToday.count ?? 0,
    xpRateEuros,
    hourRateEuros,
    earnedFromXp,
    earnedFromTime,
    withdrawn,
    balance,
    withdrawable,
    withdrawals: rows.map((row) => ({
      id: row.id as string,
      amount: BigInt(row.amount_base_units as string),
      status: row.status as string,
      txHash: (row.tx_hash as string | null) ?? null,
      createdAt: row.created_at as string,
    })),
    withdrawalCount: rows.length,
  };
}
