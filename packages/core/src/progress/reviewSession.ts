/**
 * ============================================================================
 * Turning a schedule into a session
 * ============================================================================
 *
 * The scheduler in `review.ts` deals only in ids and dates — deliberately, so
 * that it can be reasoned about without the course in scope. This is the step
 * that puts the two back together: given what is due and a way to look a
 * lesson up, it produces the questions to ask.
 *
 * It lives here rather than in the app because both clients need it and
 * because the two traps in it are worth testing, and neither is visible from
 * a screen.
 */

import type { Challenge, Lesson } from '../content/schema';
import { dueItems, type ReviewItem } from './review';

export interface DueChallenge {
  /** `ReviewItem.id` — what a grade is recorded against. */
  itemId: string;
  challenge: Challenge;
  lessonId: string;
  lessonTitle: string;
}

/**
 * Resolve due items back to live challenges.
 *
 * Review items are stored by `lessonId#challengeId` and nothing else — no
 * text, no options, no answer. That is the first trap, handled by storing the
 * reference and resolving it here, late: content changes, a distractor gets
 * rewritten, a whole lesson is replaced, and a queue holding its own copy of
 * the question would quietly keep asking one the course no longer contains.
 * An item whose lesson or challenge has genuinely gone is dropped rather than
 * shown.
 *
 * `lessonById` is passed in rather than imported so the caller decides which
 * language the questions come back in.
 */
export function resolveDue(
  items: readonly ReviewItem[],
  lessonById: (id: string) => Lesson | undefined,
  options: { limit?: number; today?: string } = {},
): DueChallenge[] {
  const resolved: DueChallenge[] = [];
  for (const item of dueItems(items, options.today, { limit: options.limit })) {
    const lesson = lessonById(item.lessonId);
    if (!lesson) continue; // the lesson is gone — see above
    const challengeId = item.id.slice(item.lessonId.length + 1);
    const challenge = lesson.challenges.find((entry) => entry.id === challengeId);
    if (!challenge) continue; // the challenge was rewritten out of the lesson
    resolved.push({ itemId: item.id, challenge, lessonId: lesson.id, lessonTitle: lesson.title });
  }
  return resolved;
}

/**
 * The challenges of a review session, with their ids made unique.
 *
 * The second trap. Challenge ids are unique only *within* a lesson, and
 * twenty-one of them are reused across the course — `mc-haircut` sits in both
 * `kab-repos` and `open-market-operations`, `order-doom-loop` in two more. A
 * lesson never notices, because it only ever holds its own.
 *
 * A review queue holds whatever is due, from anywhere, and the session reducer
 * keys its queue by challenge id. Two colliding ids collapse into one: the
 * learner is asked once and the second item is graded on an answer it never
 * received. So each challenge is re-keyed to its `ReviewItem.id`, which is
 * unique by construction.
 *
 * Nothing downstream reads the id as meaning — the grader uses it only as the
 * seed for which praise line to show — and the grades come back already keyed
 * the way the store wants to record them.
 */
export function reviewChallenges(due: readonly DueChallenge[]): Challenge[] {
  return due.map((entry) => ({ ...entry.challenge, id: entry.itemId }));
}
