/**
 * ============================================================================
 * Review scheduling
 * ============================================================================
 *
 * The course teaches 173 lessons once, in a fixed order, and never returns to
 * any of them. Someone who did *Foundations* in January and *The Plumbing* in
 * June has forgotten January, and until now nothing noticed. For a course
 * whose stated bar is that a proficient student could run a central bank,
 * that is the difference between having taught something and having taught it.
 *
 * So: spaced repetition over individual challenges, scheduled on the device.
 *
 * ---------------------------------------------------------------------------
 * WHY SM-2 AND NOT FSRS
 * ---------------------------------------------------------------------------
 *
 * FSRS is the better algorithm and it is fitted: its weights are trained on a
 * corpus of real review histories. There is no such corpus here — nothing has
 * ever recorded which challenge a learner got wrong — so adopting it now would
 * mean shipping somebody else's weights and calling it personalisation.
 *
 * SM-2 needs no training data, is four lines of arithmetic, and is good enough
 * to be obviously better than the current behaviour, which is to never ask
 * again. When there is a history worth fitting, the history this produces is
 * exactly what FSRS would need.
 *
 * ---------------------------------------------------------------------------
 * THE GRADE
 * ---------------------------------------------------------------------------
 *
 * SM-2 expects a 0-5 self-rating of recall. Asking a learner to rate their own
 * memory is a question this app never asks and should not start asking — the
 * lesson runner already knows, more honestly than they would:
 *
 *   known      answered correctly, first attempt
 *   struggled  answered correctly, but only after getting it wrong
 *   missed     not answered correctly
 *
 * Three observed outcomes beat five self-reported ones, and they come free
 * from `LessonSessionState.missed`, which the runner already tracks and — as
 * of this module having something to do with it — no longer discards.
 *
 * Pure and clock-free like `rules.ts`: every function takes `today` rather
 * than reading the clock, so the awkward cases (an item due yesterday, a
 * month away, a leap day) are directly testable.
 */

import { localDateKey } from './rules';

/** What the runner observed, in place of SM-2's self-rated 0-5. */
export type ReviewGrade = 'known' | 'struggled' | 'missed';

export interface ReviewItem {
  /** `lessonId#challengeId` — the same key the exam uses, and for the same
   *  reason: challenge ids are only unique within a lesson. */
  id: string;
  lessonId: string;
  moduleId: string;
  /** Consecutive non-missed reviews. Reset to 0 by a miss. */
  streak: number;
  /** Days waited before this review was due. */
  intervalDays: number;
  /** SM-2 ease. Higher means the interval grows faster. */
  ease: number;
  /** Local `YYYY-MM-DD` this item next comes up. */
  dueOn: string;
  lastReviewedOn: string;
  /** How many times this has been missed after previously being known. */
  lapses: number;
}

/**
 * Ease bounds.
 *
 * The floor matters more than the ceiling: without one, an item missed
 * repeatedly drives its ease towards zero and then reappears every single day
 * forever, which is how a review queue becomes a wall of the same six cards
 * and gets abandoned. 1.3 is SM-2's own floor and it has held up.
 */
const MIN_EASE = 1.3;
const MAX_EASE = 2.8;
const START_EASE = 2.5;

/**
 * Longest gap between reviews, in days.
 *
 * SM-2 unbounded will schedule something years out. That is defensible for a
 * language deck someone keeps for a decade; it is not defensible here, where
 * the claim is that a learner can still do this — an item nobody has been
 * asked about since 2029 is not knowledge anyone should be certifying.
 */
const MAX_INTERVAL_DAYS = 180;

/** `YYYY-MM-DD`, `days` after `dateKey`. Local, matching `localDateKey`. */
export function addDays(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
  date.setDate(date.getDate() + days);
  return localDateKey(date);
}

/** Negative when `a` is earlier than `b`. */
export function compareDateKeys(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function clampEase(ease: number): number {
  return Math.min(MAX_EASE, Math.max(MIN_EASE, ease));
}

/**
 * How the ease moves. SM-2's quadratic, evaluated at the three grades this
 * app can actually observe:
 *
 *   known      +0.10   recalling cleanly earns a longer leash
 *   struggled  -0.14   got there, but the interval was too long
 *   missed     -0.20   and the interval collapses as well, below
 */
const EASE_DELTA: Readonly<Record<ReviewGrade, number>> = {
  known: 0.1,
  struggled: -0.14,
  missed: -0.2,
};

/**
 * The next interval, in days.
 *
 * The first two successes are fixed at 1 and 3 days rather than derived. SM-2
 * uses 1 and 6; 6 is too long for material a learner has just met once inside
 * a lesson they may never have revisited, and the whole point here is to catch
 * the forgetting before it happens rather than to confirm it afterwards.
 */
function nextInterval(item: ReviewItem, grade: ReviewGrade, ease: number): number {
  if (grade === 'missed') return 1;
  if (grade === 'struggled') return Math.max(1, Math.round(item.intervalDays * 0.6));
  if (item.streak === 0) return 1;
  if (item.streak === 1) return 3;
  return Math.min(MAX_INTERVAL_DAYS, Math.round(item.intervalDays * ease));
}

/** A challenge seen for the first time. */
export function newReviewItem(
  id: string,
  lessonId: string,
  moduleId: string,
  grade: ReviewGrade,
  today: string = localDateKey(),
): ReviewItem {
  const base: ReviewItem = {
    id,
    lessonId,
    moduleId,
    streak: 0,
    intervalDays: 0,
    ease: START_EASE,
    dueOn: today,
    lastReviewedOn: today,
    lapses: 0,
  };
  return reviewed(base, grade, today);
}

/**
 * Apply a review outcome and schedule the next one.
 *
 * Always moves `dueOn` forward by at least a day, including on a miss. Putting
 * a missed item back into *today's* queue sounds right and is not: it turns a
 * review session into a loop the learner cannot leave, which is the lesson
 * runner's job — it re-queues within a run — and precisely not this one's.
 */
export function reviewed(
  item: ReviewItem,
  grade: ReviewGrade,
  today: string = localDateKey(),
): ReviewItem {
  const ease = clampEase(item.ease + EASE_DELTA[grade]);
  const intervalDays = nextInterval(item, grade, ease);
  const missed = grade === 'missed';

  return {
    ...item,
    ease,
    intervalDays,
    streak: missed ? 0 : item.streak + 1,
    lapses: missed && item.streak > 0 ? item.lapses + 1 : item.lapses,
    lastReviewedOn: today,
    dueOn: addDays(today, intervalDays),
  };
}

export interface DueOptions {
  /** Most items to return. The queue is a session, not an inbox. */
  limit?: number;
  /**
   * Cap on items drawn from any one module.
   *
   * Without it a bad week in one module fills the whole queue with it, and the
   * learner reviews reserves management while forgetting everything else. The
   * exam assembler spreads for the same reason.
   */
  maxPerModule?: number;
}

/**
 * The items due on `today`, hardest first.
 *
 * Ordering is: most overdue, then lowest ease. Overdue first because an item
 * three weeks late is closest to being genuinely lost; ease as the tiebreak
 * because among things due on the same day, the ones that have been difficult
 * are the ones worth the attention.
 */
export function dueItems(
  items: readonly ReviewItem[],
  today: string = localDateKey(),
  { limit = 20, maxPerModule = 5 }: DueOptions = {},
): ReviewItem[] {
  const due = items
    .filter((item) => compareDateKeys(item.dueOn, today) <= 0)
    .sort((a, b) => compareDateKeys(a.dueOn, b.dueOn) || a.ease - b.ease);

  const perModule = new Map<string, number>();
  const picked: ReviewItem[] = [];
  for (const item of due) {
    if (picked.length >= limit) break;
    const taken = perModule.get(item.moduleId) ?? 0;
    if (taken >= maxPerModule) continue;
    perModule.set(item.moduleId, taken + 1);
    picked.push(item);
  }
  return picked;
}

export interface ReviewSummary {
  tracked: number;
  dueToday: number;
  /** Due within the next seven days, today included. */
  dueThisWeek: number;
  /** Items missed at least once after having been known. */
  lapsed: number;
  /** Modules with at least one item due, worst first. */
  weakestModules: readonly string[];
}

/** What a "Review" surface needs to render without loading every item. */
export function summarise(
  items: readonly ReviewItem[],
  today: string = localDateKey(),
): ReviewSummary {
  const weekEnd = addDays(today, 6);
  const due = items.filter((item) => compareDateKeys(item.dueOn, today) <= 0);

  const byModule = new Map<string, number>();
  for (const item of due) byModule.set(item.moduleId, (byModule.get(item.moduleId) ?? 0) + 1);

  return {
    tracked: items.length,
    dueToday: due.length,
    dueThisWeek: items.filter((item) => compareDateKeys(item.dueOn, weekEnd) <= 0).length,
    lapsed: items.filter((item) => item.lapses > 0).length,
    weakestModules: [...byModule.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([moduleId]) => moduleId),
  };
}
