/**
 * ============================================================================
 * Lesson session state machine
 * ============================================================================
 *
 * A pure reducer describing one run through a lesson. No React, no timers, no
 * side effects — every transition is a plain function of (state, action), so
 * the whole progression model can be reasoned about and tested in isolation.
 *
 * Duolingo-style behaviours modelled here:
 *   - a challenge answered incorrectly is **re-queued** to the end of the run,
 *     so the learner cannot leave until they can actually do it
 *   - a re-queued challenge is worth half XP when finally solved
 *   - hearts decrement on each wrong answer; at zero the run fails
 *   - a combo counter rewards consecutive first-attempt correct answers
 */

import {
  DEFAULT_CHALLENGE_XP,
  DEFAULT_HEARTS,
  type Challenge,
  type Lesson,
} from '@/content/schema';
import type { ChallengeAnswer } from '@/engine/answers';
import { gradeChallenge, type GradeResult } from '@/engine/grading';

export type SessionStatus = 'in_progress' | 'complete' | 'failed';

/** Set while the feedback sheet is up, cleared on "Continue". */
export interface PendingFeedback extends GradeResult {
  challengeId: string;
}

export interface LessonSessionState {
  lesson: Lesson;
  /** Challenge ids still to be solved. `queue[0]` is on screen right now. */
  queue: readonly string[];
  /** Challenge ids solved correctly, in the order they were solved. */
  resolved: readonly string[];
  /** Challenge ids the learner has got wrong at least once this run. */
  missed: readonly string[];
  hearts: number;
  maxHearts: number;
  /** Consecutive first-attempt correct answers. Resets to 0 on any miss. */
  combo: number;
  bestCombo: number;
  xpEarned: number;
  status: SessionStatus;
  feedback: PendingFeedback | null;
  /** Increments on every graded submission — used to key UI animations. */
  submissionCount: number;
  /**
   * Increments every time the runner advances past the feedback sheet.
   *
   * The challenge view is keyed on this so that a re-queued challenge remounts
   * with a clean draft (you cannot re-submit the same wrong answer untouched),
   * while grading a submission leaves the view mounted so the correct/incorrect
   * reveal stays on screen behind the sheet.
   */
  stepSerial: number;
}

export type LessonSessionAction =
  | { kind: 'submit'; answer: ChallengeAnswer }
  | { kind: 'continue' }
  | { kind: 'restart' };

export function createSession(lesson: Lesson): LessonSessionState {
  const hearts = lesson.hearts ?? DEFAULT_HEARTS;
  return {
    lesson,
    queue: lesson.challenges.map((challenge) => challenge.id),
    resolved: [],
    missed: [],
    hearts,
    maxHearts: hearts,
    combo: 0,
    bestCombo: 0,
    xpEarned: 0,
    status: lesson.challenges.length > 0 ? 'in_progress' : 'complete',
    feedback: null,
    submissionCount: 0,
    stepSerial: 0,
  };
}

/** The challenge currently on screen, or `null` when the run is over. */
export function currentChallenge(state: LessonSessionState): Challenge | null {
  const id = state.queue[0];
  if (!id) return null;
  return state.lesson.challenges.find((challenge) => challenge.id === id) ?? null;
}

/**
 * Fraction of the run completed, 0..1.
 *
 * The denominator grows when a challenge is re-queued, so the bar honestly
 * slides back a little on a wrong answer instead of lying about progress.
 */
export function progressRatio(state: LessonSessionState): number {
  const total = state.resolved.length + state.queue.length;
  if (total === 0) return 1;
  return state.resolved.length / total;
}

function xpFor(challenge: Challenge, firstAttempt: boolean): number {
  const base = challenge.xp ?? DEFAULT_CHALLENGE_XP;
  return firstAttempt ? base : Math.max(1, Math.floor(base / 2));
}

export function lessonSessionReducer(
  state: LessonSessionState,
  action: LessonSessionAction,
): LessonSessionState {
  switch (action.kind) {
    // -----------------------------------------------------------------------
    case 'submit': {
      // Ignore double submissions while the feedback sheet is already open.
      if (state.status !== 'in_progress' || state.feedback) return state;

      const challenge = currentChallenge(state);
      if (!challenge) return state;

      const result = gradeChallenge(challenge, action.answer);
      const firstAttempt = !state.missed.includes(challenge.id);

      if (result.correct) {
        const combo = firstAttempt ? state.combo + 1 : 0;
        return {
          ...state,
          combo,
          bestCombo: Math.max(state.bestCombo, combo),
          xpEarned: state.xpEarned + xpFor(challenge, firstAttempt),
          feedback: { ...result, challengeId: challenge.id },
          submissionCount: state.submissionCount + 1,
        };
      }

      return {
        ...state,
        hearts: Math.max(0, state.hearts - 1),
        combo: 0,
        missed: firstAttempt ? [...state.missed, challenge.id] : state.missed,
        feedback: { ...result, challengeId: challenge.id },
        submissionCount: state.submissionCount + 1,
      };
    }

    // -----------------------------------------------------------------------
    case 'continue': {
      const { feedback } = state;
      if (!feedback) return state;

      const [head, ...rest] = state.queue;
      if (!head) return { ...state, feedback: null, status: 'complete' };
      const stepSerial = state.stepSerial + 1;

      // Correct -> drop it. Incorrect -> send it to the back of the queue.
      const queue = feedback.correct ? rest : [...rest, head];
      const resolved = feedback.correct ? [...state.resolved, head] : state.resolved;

      let status: SessionStatus = 'in_progress';
      if (state.hearts <= 0) {
        status = 'failed';
      } else if (queue.length === 0) {
        status = 'complete';
      }

      return { ...state, queue, resolved, feedback: null, status, stepSerial };
    }

    // -----------------------------------------------------------------------
    case 'restart':
      return createSession(state.lesson);
  }
}
