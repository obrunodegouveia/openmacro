"use client";

/**
 * ============================================================================
 * Learner progress
 * ============================================================================
 *
 * Two stores behind one shape.
 *
 *   - Signed out, progress lives in this browser. Playing without an account
 *     is a promise the site makes on every page, and losing that work the
 *     moment someone signs in — or closes the tab — made the promise a lie.
 *   - Signed in, it lives in Supabase under row-level security, so it follows
 *     the learner between devices.
 *
 * Both use `ProgressSnapshot` from `@openmacro/core`, which is also what the
 * mobile app stores. That is what lets `mergeSnapshots` fold a device's
 * signed-out play into an account without either side inventing rules the
 * other does not share.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  applyLessonResult,
  hasLocalProgress,
  localDateKey,
  mergeSnapshots,
  reconcileSnapshot,
  seedSnapshot,
  type ProgressSnapshot,
} from "@openmacro/core/progress/rules";
import type { LessonProgress, LessonResult } from "@openmacro/core/progress/types";

export type { ProgressSnapshot };

// ---------------------------------------------------------------------------
// This device
// ---------------------------------------------------------------------------

const LOCAL_KEY = "openmacro:progress";

function storage(): Storage | null {
  // Absent during prerender; throws outright when site data is blocked.
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

/** This browser's progress, reconciled against today so a stale streak dies. */
export function readLocalProgress(): ProgressSnapshot {
  const store = storage();
  if (!store) return seedSnapshot();

  try {
    const raw = store.getItem(LOCAL_KEY);
    if (!raw) return seedSnapshot();
    const parsed = JSON.parse(raw) as ProgressSnapshot;
    if (!parsed?.profile || typeof parsed.profile.totalXp !== "number") {
      return seedSnapshot();
    }
    return reconcileSnapshot(parsed, localDateKey());
  } catch {
    // Corrupt or unreadable: start clean rather than crash the lesson.
    return seedSnapshot();
  }
}

export function writeLocalProgress(snapshot: ProgressSnapshot): void {
  try {
    invalidateCache();
    storage()?.setItem(LOCAL_KEY, JSON.stringify(snapshot));
  } catch {
    // Full or blocked storage. The run still counted on screen; it just will
    // not survive a reload, which is the pre-existing behaviour.
  }
}

/**
 * Stable-identity read for `useSyncExternalStore`.
 *
 * That hook compares snapshots by identity and re-renders whenever they
 * differ, so a function parsing fresh JSON on every call would render forever.
 * The parsed value is cached against the raw string and the current day, which
 * are the only two things that can change what it returns.
 */
let cachedRaw: string | null = null;
let cachedDay = "";
let cachedSnapshot: ProgressSnapshot | null = null;

/**
 * Drops the cache after this module writes.
 *
 * It clears the *snapshot*, not `cachedRaw`: an absent key reads back as
 * `null`, so using `null` as the "stale" marker made a clear indistinguishable
 * from a hit on empty storage, and `peekLocalProgress` went on handing out the
 * snapshot it had just deleted.
 */
function invalidateCache(): void {
  cachedSnapshot = null;
}

export function peekLocalProgress(): ProgressSnapshot | null {
  const store = storage();
  if (!store) return null;

  let raw: string | null;
  try {
    raw = store.getItem(LOCAL_KEY);
  } catch {
    return null;
  }

  const today = localDateKey();
  if (raw !== cachedRaw || today !== cachedDay || !cachedSnapshot) {
    cachedRaw = raw;
    cachedDay = today;
    cachedSnapshot = readLocalProgress();
  }
  return cachedSnapshot;
}

/** What the server sees: no browser storage exists during prerender. */
export function readNoLocalProgress(): null {
  return null;
}

/**
 * Subscription required by `useSyncExternalStore`.
 *
 * Inert on purpose: the only writer is this tab, through actions that already
 * re-render, so there is no event worth listening for.
 */
export function subscribeToLocalProgress(): () => void {
  return () => {};
}

export function clearLocalProgress(): void {
  try {
    invalidateCache();
    storage()?.removeItem(LOCAL_KEY);
  } catch {
    // Nothing to do: an unreadable store is also an unwritable one.
  }
}

// ---------------------------------------------------------------------------
// The account
// ---------------------------------------------------------------------------

interface ProfileRow {
  display_name: string | null;
  total_xp: number;
  day_streak: number;
  last_active_on: string | null;
}

interface LessonRow {
  lesson_id: string;
  best_xp: number;
  completions: number;
  perfect: boolean;
  last_completed_at: string | null;
}

/** Everything the account holds, in the shared snapshot shape. */
export async function readCloudProgress(
  client: SupabaseClient,
  userId: string,
  displayName: string,
): Promise<ProgressSnapshot> {
  const [profileResult, lessonResult] = await Promise.all([
    client
      .from("profiles")
      .select("display_name, total_xp, day_streak, last_active_on")
      .eq("user_id", userId)
      .maybeSingle(),
    client
      .from("lesson_progress")
      .select("lesson_id, best_xp, completions, perfect, last_completed_at")
      .eq("user_id", userId),
  ]);

  if (profileResult.error) throw new Error(profileResult.error.message);
  if (lessonResult.error) throw new Error(lessonResult.error.message);

  const row = profileResult.data as ProfileRow | null;
  const progress: Record<string, LessonProgress> = {};
  for (const entry of (lessonResult.data ?? []) as LessonRow[]) {
    progress[entry.lesson_id] = {
      lessonId: entry.lesson_id,
      bestXp: entry.best_xp,
      completions: entry.completions,
      perfect: entry.perfect,
      lastCompletedAt: entry.last_completed_at ?? "",
    };
  }

  const today = localDateKey();
  return reconcileSnapshot(
    {
      profile: {
        id: userId,
        displayName: row?.display_name ?? displayName,
        totalXp: row?.total_xp ?? 0,
        dayStreak: row?.day_streak ?? 0,
        streakActiveToday: false,
        lastActiveOn: row?.last_active_on ?? today,
      },
      progress,
    },
    today,
  );
}

/**
 * Writes a whole snapshot to the account.
 *
 * Every lesson row goes in one upsert rather than one call each: a merge after
 * sign-in can carry a dozen lessons, and a dozen round trips is a dozen
 * chances to half-write someone's history.
 */
export async function writeCloudProgress(
  client: SupabaseClient,
  userId: string,
  snapshot: ProgressSnapshot,
): Promise<void> {
  const profileError = (
    await client.from("profiles").upsert(
      {
        user_id: userId,
        display_name: snapshot.profile.displayName,
        total_xp: snapshot.profile.totalXp,
        day_streak: snapshot.profile.dayStreak,
        last_active_on: snapshot.profile.lastActiveOn,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
  ).error;
  if (profileError) throw new Error(profileError.message);

  const rows = Object.values(snapshot.progress).map((lesson) => ({
    user_id: userId,
    lesson_id: lesson.lessonId,
    best_xp: lesson.bestXp,
    completions: lesson.completions,
    perfect: lesson.perfect,
    last_completed_at: lesson.lastCompletedAt || new Date().toISOString(),
  }));
  if (!rows.length) return;

  const lessonError = (
    await client.from("lesson_progress").upsert(rows, { onConflict: "user_id,lesson_id" })
  ).error;
  if (lessonError) throw new Error(lessonError.message);
}

// ---------------------------------------------------------------------------
// Recording and syncing
// ---------------------------------------------------------------------------

/**
 * Records a finished run.
 *
 * Local first, always — that write is synchronous and cannot fail on a flaky
 * network, so a lesson is never lost between finishing it and a request
 * timing out. If there is an account, the local store is then pushed up and
 * cleared. Local is effectively a write-ahead log: anything the cloud has not
 * accepted yet is still sitting there for the next attempt.
 */
export async function recordCompletion(
  result: LessonResult,
  account?: { client: SupabaseClient; userId: string; displayName: string },
): Promise<ProgressSnapshot> {
  const today = localDateKey();
  const next = applyLessonResult(readLocalProgress(), result, today);
  writeLocalProgress(next);

  if (!account) return next;
  return syncLocalIntoAccount(account);
}

/**
 * Folds anything played on this device into the account, then clears it.
 *
 * Runs on sign-in and after every completion by a signed-in learner. It is
 * safe to run repeatedly: `mergeSnapshots` takes the best of each field rather
 * than adding, so a merge that runs twice cannot inflate anyone's XP.
 */
export async function syncLocalIntoAccount({
  client,
  userId,
  displayName,
}: {
  client: SupabaseClient;
  userId: string;
  displayName: string;
}): Promise<ProgressSnapshot> {
  const cloud = await readCloudProgress(client, userId, displayName);
  const local = readLocalProgress();

  if (!hasLocalProgress(local)) return cloud;

  const merged = reconcileSnapshot(mergeSnapshots(local, cloud), localDateKey());
  await writeCloudProgress(client, userId, merged);
  // Only once it is safely stored does the local copy go.
  clearLocalProgress();
  return merged;
}
