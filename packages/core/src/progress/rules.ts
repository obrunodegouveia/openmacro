/**
 * ============================================================================
 * Progress rules
 * ============================================================================
 *
 * The domain logic behind XP, streaks and per-lesson records — extracted from
 * the providers so that every implementation of `LearningDataProvider` shares
 * exactly one definition of "what a completed lesson does to your profile".
 *
 * Pure and clock-free: every function takes `today` as an argument rather than
 * reading the system clock, which makes the streak rules directly testable
 * (including the awkward cases: same day twice, a missed day, a leap day, a
 * daylight-saving transition).
 */

import type { LearnerProfile, LessonProgress, LessonResult } from './types';

/** A full snapshot of everything we persist about a learner. */
export interface ProgressSnapshot {
  profile: LearnerProfile;
  progress: Record<string, LessonProgress>;
}

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

/**
 * `YYYY-MM-DD` in the device's **local** timezone.
 *
 * Deliberately not `toISOString().slice(0, 10)`: that returns the UTC date, so
 * a learner in UTC-8 practising at 6pm would be recorded against tomorrow, and
 * their streak would advance or break at a time that has nothing to do with
 * their own midnight.
 */
export function localDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** The local calendar day before `dateKey`. */
export function previousDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  // Constructing with local parts (not `new Date(string)`, which parses as UTC)
  // keeps this on the same timezone footing as `localDateKey`.
  const date = new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
  date.setDate(date.getDate() - 1);
  return localDateKey(date);
}

// ---------------------------------------------------------------------------
// Reconciliation
// ---------------------------------------------------------------------------

/**
 * Brings a stored profile up to date with the current calendar day.
 *
 * This only matters once progress actually persists across launches. A stored
 * profile records the state as of the last completed lesson, so on load we
 * must decide what has expired since:
 *
 *   - practised today      -> streak stands, today's goal is already met
 *   - practised yesterday  -> streak stands, but today's goal is not met yet
 *   - anything older       -> the streak is broken and resets to zero
 *
 * Without this, someone returning after a week away would still be shown the
 * streak they had when they left.
 */
export function reconcileProfile(profile: LearnerProfile, today: string): LearnerProfile {
  if (profile.lastActiveOn === today) {
    return profile.streakActiveToday ? profile : { ...profile, streakActiveToday: true };
  }

  if (profile.lastActiveOn === previousDateKey(today)) {
    return profile.streakActiveToday ? { ...profile, streakActiveToday: false } : profile;
  }

  if (profile.dayStreak === 0 && !profile.streakActiveToday) return profile;
  return { ...profile, dayStreak: 0, streakActiveToday: false };
}

/** Reconciles a whole snapshot. */
export function reconcileSnapshot(snapshot: ProgressSnapshot, today: string): ProgressSnapshot {
  const profile = reconcileProfile(snapshot.profile, today);
  return profile === snapshot.profile ? snapshot : { ...snapshot, profile };
}

// ---------------------------------------------------------------------------
// Recording a result
// ---------------------------------------------------------------------------

/**
 * Applies a finished lesson run to a snapshot and returns the new one.
 *
 * A failed run (ran out of hearts) is deliberately a no-op: no XP, no streak,
 * no completion record. It still cost the learner nothing but time, and
 * rewarding it would make hearts meaningless.
 *
 * Call `reconcileProfile` before this if the snapshot came from storage.
 */
export function applyLessonResult(
  snapshot: ProgressSnapshot,
  result: LessonResult,
  today: string,
  now: Date = new Date(),
): ProgressSnapshot {
  if (!result.completed) return snapshot;

  const previous = snapshot.profile;

  let dayStreak = previous.dayStreak;
  if (previous.lastActiveOn === today) {
    // Already practised today — XP still accrues, but the streak does not
    // advance twice in one day.
    dayStreak = Math.max(1, previous.dayStreak);
  } else if (previous.lastActiveOn === previousDateKey(today)) {
    dayStreak = previous.dayStreak + 1;
  } else {
    dayStreak = 1;
  }

  const existing = snapshot.progress[result.lessonId];

  return {
    profile: {
      ...previous,
      totalXp: previous.totalXp + result.xpEarned,
      dayStreak,
      streakActiveToday: true,
      lastActiveOn: today,
    },
    progress: {
      ...snapshot.progress,
      [result.lessonId]: {
        lessonId: result.lessonId,
        bestXp: Math.max(existing?.bestXp ?? 0, result.xpEarned),
        completions: (existing?.completions ?? 0) + 1,
        perfect: (existing?.perfect ?? false) || result.heartsRemaining === result.maxHearts,
        lastCompletedAt: now.toISOString(),
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

/** A brand-new learner: no XP, no streak, nothing completed. */
export function seedSnapshot(today: string = localDateKey()): ProgressSnapshot {
  return {
    profile: {
      id: 'local-learner',
      displayName: 'Learner',
      totalXp: 0,
      dayStreak: 0,
      streakActiveToday: false,
      // Dated today so a first session does not look like a broken streak.
      lastActiveOn: today,
    },
    progress: {},
  };
}

// ---------------------------------------------------------------------------
// Merging
// ---------------------------------------------------------------------------

/**
 * Combines the progress made on this device while signed out with whatever the
 * account already holds.
 *
 * This runs once, when someone signs in for the first time on a device. People
 * play before they sign up, and neither "throw away what you just did" nor
 * "wipe what you did on your phone" is an acceptable answer, so we take the
 * best of both:
 *
 *   - `totalXp` takes the maximum, not the sum. Summing would double-count the
 *     common case where the local store is a stale copy of the same account,
 *     and inflating XP is worse than under-crediting a genuinely new device.
 *   - `dayStreak` takes the longer, and `lastActiveOn` the more recent, since
 *     practising on either device was a real day of practice.
 *   - per-lesson rows take the best of each field independently.
 *
 * Note the asymmetry this creates: XP earned offline on a second device is not
 * added on top. That is a deliberate trade for a merge with no server-side
 * conflict resolution — see the sync limitations in the README.
 */
export function mergeSnapshots(
  local: ProgressSnapshot,
  cloud: ProgressSnapshot,
): ProgressSnapshot {
  const lastActiveOn =
    local.profile.lastActiveOn > cloud.profile.lastActiveOn
      ? local.profile.lastActiveOn
      : cloud.profile.lastActiveOn;

  const progress: Record<string, LessonProgress> = { ...cloud.progress };
  for (const [lessonId, localRow] of Object.entries(local.progress)) {
    const cloudRow = progress[lessonId];
    if (!cloudRow) {
      progress[lessonId] = localRow;
      continue;
    }
    progress[lessonId] = {
      lessonId,
      bestXp: Math.max(localRow.bestXp, cloudRow.bestXp),
      completions: Math.max(localRow.completions, cloudRow.completions),
      perfect: localRow.perfect || cloudRow.perfect,
      lastCompletedAt:
        localRow.lastCompletedAt > cloudRow.lastCompletedAt
          ? localRow.lastCompletedAt
          : cloudRow.lastCompletedAt,
    };
  }

  return {
    profile: {
      ...cloud.profile,
      totalXp: Math.max(local.profile.totalXp, cloud.profile.totalXp),
      dayStreak: Math.max(local.profile.dayStreak, cloud.profile.dayStreak),
      lastActiveOn,
      streakActiveToday: false, // Recomputed by `reconcileProfile` on read.
    },
    progress,
  };
}

/** True when the local store holds anything worth merging into an account. */
export function hasLocalProgress(snapshot: ProgressSnapshot): boolean {
  return snapshot.profile.totalXp > 0 || Object.keys(snapshot.progress).length > 0;
}
