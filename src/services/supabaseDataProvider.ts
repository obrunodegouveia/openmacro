/**
 * ============================================================================
 * Supabase data provider
 * ============================================================================
 *
 * Reading and writing a learner's whole snapshot in Postgres, under row-level
 * security — so the anon key shipped in the bundle can only ever touch the
 * signed-in learner's own rows.
 *
 * These are primitives, not a `LearningDataProvider`. The signed-in store is
 * `syncedDataProvider`, which layers a local-first mirror over them so that a
 * lost connection never costs the learner a finished lesson.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

import {
  localDateKey,
  reconcileSnapshot,
  seedSnapshot,
  type ProgressSnapshot,
} from '@/services/progressRules';
import type { LessonProgress } from '@/services/types';

/** Identity handed down from the auth session. */
export interface CloudIdentity {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
}

interface ProfileRow {
  display_name: string | null;
  avatar_url: string | null;
  total_xp: number;
  day_streak: number;
  last_active_on: string | null;
}

interface LessonProgressRow {
  lesson_id: string;
  best_xp: number;
  completions: number;
  perfect: boolean;
  last_completed_at: string | null;
}

function fail(action: string, message: string): never {
  throw new Error(`Could not ${action}: ${message}`);
}

// ---------------------------------------------------------------------------
// Snapshot read / write — also used by the sign-in merge in ProgressProvider
// ---------------------------------------------------------------------------

/** Reads the account's whole snapshot, reconciled against today. */
export async function readCloudSnapshot(
  client: SupabaseClient,
  identity: CloudIdentity,
): Promise<ProgressSnapshot> {
  const [profileResult, progressResult] = await Promise.all([
    client
      .from('profiles')
      .select('display_name, avatar_url, total_xp, day_streak, last_active_on')
      .eq('user_id', identity.userId)
      .maybeSingle(),
    client
      .from('lesson_progress')
      .select('lesson_id, best_xp, completions, perfect, last_completed_at')
      .eq('user_id', identity.userId),
  ]);

  if (profileResult.error) fail('load your profile', profileResult.error.message);
  if (progressResult.error) fail('load your lesson progress', progressResult.error.message);

  const today = localDateKey();
  const row = profileResult.data as ProfileRow | null;

  // A brand-new account has no rows yet; that is a fresh learner, not an error.
  const base = seedSnapshot(today);

  const progress: Record<string, LessonProgress> = {};
  for (const entry of (progressResult.data ?? []) as LessonProgressRow[]) {
    progress[entry.lesson_id] = {
      lessonId: entry.lesson_id,
      bestXp: entry.best_xp,
      completions: entry.completions,
      perfect: entry.perfect,
      lastCompletedAt: entry.last_completed_at ?? '',
    };
  }

  return reconcileSnapshot(
    {
      profile: {
        id: identity.userId,
        displayName: identity.displayName || row?.display_name || base.profile.displayName,
        totalXp: row?.total_xp ?? 0,
        dayStreak: row?.day_streak ?? 0,
        streakActiveToday: false, // derived by reconcileSnapshot
        lastActiveOn: row?.last_active_on ?? base.profile.lastActiveOn,
      },
      progress,
    },
    today,
  );
}

/**
 * Writes a whole snapshot. Used by the sign-in merge; ordinary play only ever
 * touches the profile and the one lesson that changed.
 */
export async function writeCloudSnapshot(
  client: SupabaseClient,
  identity: CloudIdentity,
  snapshot: ProgressSnapshot,
): Promise<void> {
  const profileError = (
    await client.from('profiles').upsert(
      {
        user_id: identity.userId,
        display_name: identity.displayName,
        avatar_url: identity.avatarUrl,
        total_xp: snapshot.profile.totalXp,
        day_streak: snapshot.profile.dayStreak,
        last_active_on: snapshot.profile.lastActiveOn,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )
  ).error;
  if (profileError) fail('save your profile', profileError.message);

  const rows = Object.values(snapshot.progress).map((entry) => ({
    user_id: identity.userId,
    lesson_id: entry.lessonId,
    best_xp: entry.bestXp,
    completions: entry.completions,
    perfect: entry.perfect,
    last_completed_at: entry.lastCompletedAt || null,
  }));

  if (rows.length > 0) {
    const progressError = (
      await client.from('lesson_progress').upsert(rows, { onConflict: 'user_id,lesson_id' })
    ).error;
    if (progressError) fail('save your lesson progress', progressError.message);
  }
}
