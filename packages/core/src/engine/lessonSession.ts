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
} from '../content/schema';
import type { ChallengeAnswer } from './answers';
import { gradeChallenge, type GradeResult } from './grading';
import type { Translator } from '../i18n';

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
  /**
   * Grade an answer.
   *
   * `t` carries the learner's language to the feedback copy. It rides on the
   * action rather than living in session state deliberately: the reducer stays
   * a pure function of (state, action) with no captured locale, and a learner
   * who switches language mid-lesson gets the new one on the very next answer
   * instead of having to leave and come back.
   */
  | { kind: 'submit'; answer: ChallengeAnswer; t?: Translator }
  | { kind: 'continue' }
  | { kind: 'restart' }
  /**
   * Bring a challenge to the front of the queue.
   *
   * For arriving on a shared link to one particular question. It rotates
   * rather than skips: everything ahead of the target moves behind it and is
   * still answered, so a shared link changes the order of a run and never its
   * contents.
   */
  | { kind: 'jump'; challengeId: string }
  /**
   * Pick a run back up where the learner left it (see `snapshotSession`).
   *
   * Only from a clean start, and only when the snapshot still fits the
   * lesson; otherwise it is ignored and the run starts over.
   */
  | { kind: 'resume'; snapshot: SessionSnapshot };

/**
 * What is kept of a run in progress so that closing a lesson by accident does
 * not lose it. Plain JSON: each client stores it on the device per lesson.
 *
 * Hearts, the combo and XP come back exactly as they were, so leaving and
 * returning is never a way to refill hearts or retry for free. An answer that
 * had been graded but not yet continued past is applied on resume, as if the
 * learner had pressed Continue.
 */
export interface SessionSnapshot {
  version: 1;
  lessonId: string;
  queue: readonly string[];
  resolved: readonly string[];
  missed: readonly string[];
  hearts: number;
  combo: number;
  bestCombo: number;
  xpEarned: number;
  submissionCount: number;
  stepSerial: number;
  /** The graded answer on screen when the run was left, if any. */
  pending: { challengeId: string; correct: boolean } | null;
}

/**
 * The part of a run worth resuming, or null when there is nothing to keep:
 * nothing answered yet, or the run is over.
 *
 * @param state The session.
 * @return A snapshot to store, or null meaning "clear what is stored".
 */
export function snapshotSession(state: LessonSessionState): SessionSnapshot | null {
  if (state.status !== 'in_progress' || state.submissionCount === 0) return null;
  return {
    version: 1,
    lessonId: state.lesson.id,
    queue: state.queue,
    resolved: state.resolved,
    missed: state.missed,
    hearts: state.hearts,
    combo: state.combo,
    bestCombo: state.bestCombo,
    xpEarned: state.xpEarned,
    submissionCount: state.submissionCount,
    stepSerial: state.stepSerial,
    pending: state.feedback
      ? { challengeId: state.feedback.challengeId, correct: state.feedback.correct }
      : null,
  };
}

/**
 * Whether a stored snapshot still describes this lesson: same id, and exactly
 * the lesson's challenges between what is left and what is done. A lesson
 * changed by an update since the snapshot was taken starts over instead.
 */
function snapshotFits(lesson: Lesson, snapshot: SessionSnapshot): boolean {
  if (snapshot?.version !== 1 || snapshot.lessonId !== lesson.id) return false;
  const ids = lesson.challenges.map((challenge) => challenge.id);
  const left = new Set(snapshot.queue);
  const done = new Set(snapshot.resolved);
  if (left.size !== snapshot.queue.length || done.size !== snapshot.resolved.length) return false;
  if (left.size === 0 || left.size + done.size !== ids.length) return false;
  if (!ids.every((id) => left.has(id) !== done.has(id))) return false;
  if (!snapshot.missed.every((id) => ids.includes(id))) return false;
  if (snapshot.pending && snapshot.pending.challengeId !== snapshot.queue[0]) return false;
  const maxHearts = lesson.hearts ?? DEFAULT_HEARTS;
  if (!Number.isInteger(snapshot.hearts) || snapshot.hearts > maxHearts) return false;
  // No hearts left is only possible with the losing answer still on screen;
  // resuming then fails the run, so leaving is never a way out of failing.
  return snapshot.hearts > 0 || (snapshot.pending !== null && !snapshot.pending.correct && snapshot.hearts === 0);
}

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
    case 'jump': {
      // Only from a clean start: rotating mid-run would strand a feedback
      // sheet on a challenge that is no longer on screen.
      if (state.status !== 'in_progress' || state.feedback) return state;
      if (state.resolved.length > 0 || state.submissionCount > 0) return state;
      const index = state.queue.indexOf(action.challengeId);
      if (index <= 0) return state;
      return {
        ...state,
        queue: [
          action.challengeId,
          ...state.queue.slice(0, index),
          ...state.queue.slice(index + 1),
        ],
      };
    }

    // -----------------------------------------------------------------------
    case 'resume': {
      if (state.status !== 'in_progress' || state.feedback) return state;
      if (state.resolved.length > 0 || state.submissionCount > 0) return state;
      const { snapshot } = action;
      if (!snapshotFits(state.lesson, snapshot)) return state;

      const resumed: LessonSessionState = {
        ...state,
        queue: snapshot.queue,
        resolved: snapshot.resolved,
        missed: snapshot.missed,
        hearts: snapshot.hearts,
        combo: snapshot.combo,
        bestCombo: snapshot.bestCombo,
        xpEarned: snapshot.xpEarned,
        submissionCount: snapshot.submissionCount,
        stepSerial: snapshot.stepSerial,
      };
      if (!snapshot.pending) return resumed;
      // The graded answer was already counted; move past it as Continue would.
      return lessonSessionReducer(
        {
          ...resumed,
          feedback: { correct: snapshot.pending.correct, title: '', explanation: '', challengeId: snapshot.pending.challengeId },
        },
        { kind: 'continue' },
      );
    }

    // -----------------------------------------------------------------------
    case 'submit': {
      // Ignore double submissions while the feedback sheet is already open.
      if (state.status !== 'in_progress' || state.feedback) return state;

      const challenge = currentChallenge(state);
      if (!challenge) return state;

      const result = gradeChallenge(challenge, action.answer, action.t);
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
