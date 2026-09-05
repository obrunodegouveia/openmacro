/**
 * ============================================================================
 * Learner progress
 * ============================================================================
 *
 * Reads and writes the two tables in `supabase/migrations/0001_progress.sql`
 * (repository root), under row-level security — so the publishable key in the
 * bundle can only ever touch the signed-in learner's own rows.
 *
 * Streak rules mirror `src/services/progressRules.ts` in the app. Two points
 * are worth keeping if this is ever edited:
 *
 *   - dates are the device's **local** calendar day, not UTC. A UTC date would
 *     advance or break a learner's streak at a time unrelated to their own
 *     midnight.
 *   - `streak_active_today` is derived on read rather than stored, so someone
 *     crossing a timezone never sees a stale flame.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export interface LearnerProfile {
  totalXp: number;
  dayStreak: number;
  /** True when today's practice is already done. Derived, never stored. */
  streakActiveToday: boolean;
  /** Local calendar date, `YYYY-MM-DD`. */
  lastActiveOn: string | null;
}

export interface LessonRecord {
  lessonId: string;
  bestXp: number;
  completions: number;
}

export interface ProgressSnapshot {
  profile: LearnerProfile;
  lessons: Record<string, LessonRecord>;
}

/** `YYYY-MM-DD` in the device's local timezone. */
export function localDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** The local calendar day before `dateKey`. */
export function previousDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  // Local parts, not `new Date(string)` — that parses as UTC.
  const date = new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
  date.setDate(date.getDate() - 1);
  return localDateKey(date);
}

/**
 * Brings a stored profile up to date with the current day.
 *
 * Practised today: streak stands and is lit. Practised yesterday: streak
 * stands, unlit. Anything older: the streak is over. Without this, someone
 * returning after a week still sees the streak they left with.
 */
export function reconcile(profile: LearnerProfile, today: string): LearnerProfile {
  if (profile.lastActiveOn === today) {
    return { ...profile, streakActiveToday: true };
  }
  if (profile.lastActiveOn === previousDateKey(today)) {
    return { ...profile, streakActiveToday: false };
  }
  return { ...profile, dayStreak: 0, streakActiveToday: false };
}

export const EMPTY_PROFILE: LearnerProfile = {
  totalXp: 0,
  dayStreak: 0,
  streakActiveToday: false,
  lastActiveOn: null,
};

interface ProfileRow {
  total_xp: number;
  day_streak: number;
  last_active_on: string | null;
}

interface LessonRow {
  lesson_id: string;
  best_xp: number;
  completions: number;
}

export async function readProgress(
  client: SupabaseClient,
  userId: string,
): Promise<ProgressSnapshot> {
  const [profileResult, lessonResult] = await Promise.all([
    client
      .from("profiles")
      .select("total_xp, day_streak, last_active_on")
      .eq("user_id", userId)
      .maybeSingle(),
    client
      .from("lesson_progress")
      .select("lesson_id, best_xp, completions")
      .eq("user_id", userId),
  ]);

  if (profileResult.error) throw new Error(profileResult.error.message);
  if (lessonResult.error) throw new Error(lessonResult.error.message);

  const row = profileResult.data as ProfileRow | null;
  const lessons: Record<string, LessonRecord> = {};
  for (const entry of (lessonResult.data ?? []) as LessonRow[]) {
    lessons[entry.lesson_id] = {
      lessonId: entry.lesson_id,
      bestXp: entry.best_xp,
      completions: entry.completions,
    };
  }

  return {
    profile: reconcile(
      {
        totalXp: row?.total_xp ?? 0,
        dayStreak: row?.day_streak ?? 0,
        streakActiveToday: false,
        lastActiveOn: row?.last_active_on ?? null,
      },
      localDateKey(),
    ),
    lessons,
  };
}

/**
 * Records a finished lesson and returns the updated snapshot.
 *
 * XP is added, but `best_xp` only ever rises — replaying a lesson badly must
 * not erase the record of having done it well.
 */
export async function recordLessonComplete(
  client: SupabaseClient,
  userId: string,
  displayName: string,
  lessonId: string,
  xpEarned: number,
): Promise<ProgressSnapshot> {
  const today = localDateKey();
  const current = await readProgress(client, userId);
  const previous = current.profile;

  let dayStreak = previous.dayStreak;
  if (previous.lastActiveOn === today) {
    // Already practised today: XP accrues, the streak does not advance twice.
    dayStreak = Math.max(1, previous.dayStreak);
  } else if (previous.lastActiveOn === previousDateKey(today)) {
    dayStreak = previous.dayStreak + 1;
  } else {
    dayStreak = 1;
  }

  const existing = current.lessons[lessonId];

  const profileError = (
    await client.from("profiles").upsert(
      {
        user_id: userId,
        display_name: displayName,
        total_xp: previous.totalXp + xpEarned,
        day_streak: dayStreak,
        last_active_on: today,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
  ).error;
  if (profileError) throw new Error(profileError.message);

  const lessonError = (
    await client.from("lesson_progress").upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        best_xp: Math.max(existing?.bestXp ?? 0, xpEarned),
        completions: (existing?.completions ?? 0) + 1,
        last_completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" },
    )
  ).error;
  if (lessonError) throw new Error(lessonError.message);

  return readProgress(client, userId);
}
