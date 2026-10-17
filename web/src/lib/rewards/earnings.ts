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
 * For a recipient on the 'earnings' scheme (migrations 0006 and 0007).
 *
 *   earned    = every XP mint (each at the rate in force when it was minted)
 *             + active minutes ÷ 60 × the hourly rate
 *   withdrawn = every withdrawal that is in flight, paid, or failed after
 *               broadcasting (it may still have been mined)
 *   balance   = earned − withdrawn
 *
 * XP is minted like money (mintNewXp): each lesson's best score, as it
 * grows, becomes euros once at the rate of that moment and is never
 * re-priced. Minted XP only grows. A withdrawal that failed before sending (VOID)
 * simply stops counting.
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
  /** XP minted so far: each lesson's best score, summed. */
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

/**
 * Mint whatever XP the learner has earned and not yet been paid for.
 *
 * Earned XP is each lesson's best score, capped at the most that lesson can
 * award, summed — the same rule as before minting. A replay counts only when
 * it beats the old best, and then only by the difference. Whatever the sum
 * has grown by since the last mint is minted now, at the recipient's current
 * rate, and never re-priced.
 *
 * @param userId     The learner.
 * @param recipient  Their active 'earnings' recipient row.
 */
async function mintNewXp(userId: string, recipient: Recipient): Promise<void> {
  const db = getSupabaseAdmin();

  const [progress, mints] = await Promise.all([
    db.from("lesson_progress").select("lesson_id, best_xp").eq("user_id", userId),
    db.from("xp_mints").select("xp").eq("user_id", userId),
  ]);
  for (const result of [progress, mints]) {
    // Minting from a partial read could mint twice what was earned.
    if (result.error) throw new Error(`xp mint read failed: ${result.error.message}`);
  }

  const earned = (progress.data ?? []).reduce((sum, row) => {
    const cap = MAX_XP_BY_LESSON.get(row.lesson_id as string);
    // A lesson the registry does not know — removed, or invented — earns nothing.
    if (cap === undefined) return sum;
    return sum + Math.min(Math.max(0, row.best_xp as number), cap);
  }, 0);
  const minted = (mints.data ?? []).reduce((sum, row) => sum + (row.xp as number), 0);

  // Minted XP only grows: if the best scores ever read lower, nothing happens.
  const xp = earned - minted;
  if (xp <= 0) return;

  const rateEuros = recipient.xpRateEuros ?? DEFAULT_XP_RATE_EUROS;
  const { error } = await db.from("xp_mints").insert({
    user_id: userId,
    recipient_key: recipient.key,
    xp,
    // Unique per learner: of two concurrent mints, only one is accepted.
    xp_total_before: minted,
    rate_euros: rateEuros,
    amount_base_units: (BigInt(xp) * eurosToBaseUnits(rateEuros)).toString(),
  });
  // 23505: a concurrent read minted this same XP first. Nothing to do.
  if (error && error.code !== "23505") throw new Error(`xp mint failed: ${error.message}`);
}

/** Mint any new XP, then compute the learner's balance. */
export async function readEarnings(
  userId: string,
  recipient: Recipient,
): Promise<EarningsSummary> {
  const db = getSupabaseAdmin();
  await mintNewXp(userId, recipient);

  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const [mints, minutesAll, minutesToday, claims] = await Promise.all([
    db.from("xp_mints").select("xp, amount_base_units").eq("user_id", userId),
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

  for (const result of [mints, minutesAll, minutesToday, claims]) {
    // A partial read would understate what was withdrawn and overstate the
    // balance. Refuse rather than guess.
    if (result.error) throw new Error(`earnings read failed: ${result.error.message}`);
  }

  const xp = (mints.data ?? []).reduce((sum, row) => sum + (row.xp as number), 0);

  const activeMinutes = minutesAll.count ?? 0;
  const xpRateEuros = recipient.xpRateEuros ?? DEFAULT_XP_RATE_EUROS;
  const hourRateEuros = recipient.hourRateEuros ?? DEFAULT_HOUR_RATE_EUROS;

  const earnedFromXp = (mints.data ?? []).reduce(
    (sum, row) => sum + BigInt(row.amount_base_units as string),
    0n,
  );
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
