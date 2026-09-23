/**
 * ============================================================================
 * Review state, on the device only
 * ============================================================================
 *
 * The scheduler in `@openmacro/core/progress/review` decides when a challenge
 * should come back. This is where its answer lives between sessions.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS NOT PART OF `LearningDataProvider`
 * ---------------------------------------------------------------------------
 *
 * Two reasons, and the second is the one that settles it.
 *
 * The practical one: that interface has four implementations, one of them a
 * Supabase schema that would need migrating, and review state is per-device
 * detail rather than the record of what a learner has achieved. Syncing it
 * would mean reconciling two devices' forgetting curves, which is a real
 * problem nobody has asked to have.
 *
 * The one that settles it: this is a record of every question a person got
 * wrong, and the project promises no tracking — `/teach` answers the privacy
 * question plainly because the audience includes children. A failure log is
 * exactly the data that should never leave the device, and scheduling on the
 * device needs no server at all. The privacy promise and the simplest
 * implementation agree here, which is a good sign.
 *
 * Storage is untrusted, like everything else in `localStore`: a corrupt or
 * older document reads as "no history", which costs a learner their review
 * schedule and never crashes or half-restores into a plausible wrong state.
 */

import {
  newReviewItem,
  reviewed,
  type ReviewGrade,
  type ReviewItem,
} from '@openmacro/core/progress/review';
import { localDateKey } from '@openmacro/core/progress/rules';
import { createTaskQueue, readVersioned, removeVersioned, writeVersioned } from './localStore';

const KEY = 'openmacro.review';
const VERSION = 1;

/** Serialises writes: two lessons finishing at once must not lose one. */
const queue = createTaskQueue();

function isReviewItem(value: unknown): value is ReviewItem {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    typeof item.lessonId === 'string' &&
    typeof item.moduleId === 'string' &&
    typeof item.streak === 'number' &&
    typeof item.intervalDays === 'number' &&
    typeof item.ease === 'number' &&
    typeof item.dueOn === 'string' &&
    typeof item.lastReviewedOn === 'string' &&
    typeof item.lapses === 'number'
  );
}

export async function loadReviewItems(): Promise<ReviewItem[]> {
  const stored = await readVersioned<ReviewItem[]>(KEY, VERSION, (value): value is ReviewItem[] =>
    Array.isArray(value) && value.every(isReviewItem),
  );
  return stored ?? [];
}

export interface LessonOutcome {
  lessonId: string;
  moduleId: string;
  /** Challenge ids solved correctly, in the order they were solved. */
  resolved: readonly string[];
  /** Challenge ids got wrong at least once during the run. */
  missed: readonly string[];
}

/**
 * Turn one run of a lesson into review grades.
 *
 * The runner already knows all three outcomes; it has simply never been asked
 * for them. `resolved` holds what was eventually answered correctly and
 * `missed` what went wrong at least once, so:
 *
 *   resolved, not missed   first time             -> known
 *   resolved, and missed   got there in the end   -> struggled
 *   missed, not resolved   never got it, ran out of hearts -> missed
 *
 * A challenge in neither was never reached — the run ended before it came up
 * — and is not recorded. Grading a question nobody was asked would put it in
 * the review queue on the strength of nothing.
 *
 * Takes only the two id lists, not a whole `LessonOutcome`: a review session
 * spans many lessons and has no single lesson id to give, and the mapping has
 * never depended on one.
 */
export function gradesFor(outcome: Pick<LessonOutcome, 'resolved' | 'missed'>): Map<string, ReviewGrade> {
  const missed = new Set(outcome.missed);
  const grades = new Map<string, ReviewGrade>();
  for (const id of outcome.resolved) grades.set(id, missed.has(id) ? 'struggled' : 'known');
  for (const id of outcome.missed) if (!grades.has(id)) grades.set(id, 'missed');
  return grades;
}

/**
 * Record a finished run and return the updated library.
 *
 * Items are keyed `lessonId#challengeId`, matching the exam, and for the same
 * reason: challenge ids are only unique within a lesson.
 */
export async function recordLessonOutcome(
  outcome: LessonOutcome,
  today: string = localDateKey(),
): Promise<ReviewItem[]> {
  return queue(async () => {
    const existing = await loadReviewItems();
    const byId = new Map(existing.map((item) => [item.id, item]));

    for (const [challengeId, grade] of gradesFor(outcome)) {
      const id = `${outcome.lessonId}#${challengeId}`;
      const current = byId.get(id);
      byId.set(
        id,
        current
          ? reviewed(current, grade, today)
          : newReviewItem(id, outcome.lessonId, outcome.moduleId, grade, today),
      );
    }

    const next = [...byId.values()];
    await writeVersioned(KEY, VERSION, next);
    return next;
  });
}

/**
 * Record the outcome of a review session.
 *
 * Keyed by `ReviewItem.id` rather than by challenge, because a review session
 * draws from many lessons at once and a bare challenge id would collide
 * across them — the same reason the exam keys the way it does.
 *
 * An id with no stored item is ignored rather than created: every item in a
 * session came out of the library, so one that is missing by the time the
 * session ends means the library was cleared underneath it, and inventing a
 * fresh schedule from a half-finished session would be worse than dropping it.
 */
export async function recordReviewGrades(
  grades: ReadonlyMap<string, ReviewGrade>,
  today: string = localDateKey(),
): Promise<ReviewItem[]> {
  return queue(async () => {
    const existing = await loadReviewItems();
    const byId = new Map(existing.map((item) => [item.id, item]));

    for (const [id, grade] of grades) {
      const current = byId.get(id);
      if (!current) continue;
      byId.set(id, reviewed(current, grade, today));
    }

    const next = [...byId.values()];
    await writeVersioned(KEY, VERSION, next);
    return next;
  });
}

/** Clears the schedule. Paired with the existing "reset progress" action. */
export async function clearReviewItems(): Promise<void> {
  await queue(() => removeVersioned(KEY));
}
