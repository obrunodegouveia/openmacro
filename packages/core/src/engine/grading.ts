/**
 * ============================================================================
 * Grading
 * ============================================================================
 *
 * Pure, synchronous, dependency-free. Give it a challenge and an answer, get
 * back a verdict plus the copy the feedback sheet should show.
 *
 * Keeping this separate from the reducer means new challenge types only need
 * three touch points: the schema union, a `case` here, and a component.
 */

import type { Challenge, ConceptPair } from '../content/schema';
import type { ChallengeAnswer } from './answers';
import {
  buildObjectiveSteps,
  evaluateReadouts,
  isObjectiveComplete,
} from './simulation';
import { describeVerdict, evaluateTAccount } from './tAccounts';

export interface GradeResult {
  correct: boolean;
  /** Feedback sheet headline, e.g. "Spot on!" / "Not quite". */
  title: string;
  /** The mechanical explanation. Always shown. */
  explanation: string;
  /**
   * Extra, answer-specific line — e.g. the targeted rebuttal for the exact
   * distractor the learner picked, or "3 of 4 pairs matched".
   */
  detail?: string;
}

const CORRECT_TITLES = ['Spot on!', 'Exactly right', 'Nailed it', 'That’s it'] as const;
const INCORRECT_TITLES = ['Not quite', 'Close, but no', 'Let’s look again'] as const;

/**
 * Deterministic title picker — varies the copy so a long lesson does not read
 * like a broken record, without introducing randomness that would make the UI
 * impossible to snapshot-test.
 */
function pickTitle(correct: boolean, seed: string): string {
  const pool = correct ? CORRECT_TITLES : INCORRECT_TITLES;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 997;
  }
  return pool[hash % pool.length] as string;
}

/** Exhaustiveness guard: adding a challenge type without a case fails to compile. */
function assertNever(value: never, context: string): never {
  throw new Error(`[OpenMacro] Unhandled ${context}: ${JSON.stringify(value)}`);
}

export function gradeChallenge(challenge: Challenge, answer: ChallengeAnswer): GradeResult {
  if (challenge.type !== answer.type) {
    throw new Error(
      `[OpenMacro] Answer type "${answer.type}" does not match challenge type "${challenge.type}".`,
    );
  }

  switch (challenge.type) {
    // -----------------------------------------------------------------------
    case 'multiple_choice': {
      const { optionId } = answer as Extract<ChallengeAnswer, { type: 'multiple_choice' }>;
      const correct = optionId === challenge.correctOptionId;
      const chosen = challenge.options.find((option) => option.id === optionId);
      return {
        correct,
        title: pickTitle(correct, challenge.id),
        explanation: challenge.explanation,
        detail: correct ? undefined : chosen?.feedback,
      };
    }

    // -----------------------------------------------------------------------
    case 'concept_match': {
      const { pairings } = answer as Extract<ChallengeAnswer, { type: 'concept_match' }>;
      const matched = challenge.pairs.filter(
        (pair: ConceptPair) => pairings[pair.id] === pair.id,
      ).length;
      const total = challenge.pairs.length;
      const correct = matched === total;
      return {
        correct,
        title: pickTitle(correct, challenge.id),
        explanation: challenge.explanation,
        detail: correct ? undefined : `You matched ${matched} of ${total} pairs.`,
      };
    }

    // -----------------------------------------------------------------------
    case 'order_flow': {
      const { order } = answer as Extract<ChallengeAnswer, { type: 'order_flow' }>;
      const expected = challenge.correctOrder;
      const correct =
        order.length === expected.length &&
        expected.every((eventId, index) => order[index] === eventId);

      let detail: string | undefined;
      if (!correct) {
        const firstWrong = expected.findIndex((eventId, index) => order[index] !== eventId);
        if (firstWrong >= 0) {
          const expectedEvent = challenge.events.find((event) => event.id === expected[firstWrong]);
          detail = expectedEvent
            ? `Step ${firstWrong + 1} should be "${expectedEvent.label}".`
            : undefined;
        }
      }
      return {
        correct,
        title: pickTitle(correct, challenge.id),
        explanation: challenge.explanation,
        detail,
      };
    }

    // -----------------------------------------------------------------------
    case 'interactive_sim': {
      const { sliderValues, observed } = answer as Extract<
        ChallengeAnswer,
        { type: 'interactive_sim' }
      >;
      const readouts = evaluateReadouts(challenge, sliderValues);
      const steps = buildObjectiveSteps(
        challenge.objective,
        new Set(observed),
        readouts,
        (value) => String(value),
      );
      const correct = isObjectiveComplete(steps);
      const remaining = steps.filter((step) => !step.done).length;
      return {
        correct,
        title: pickTitle(correct, challenge.id),
        explanation: challenge.explanation,
        detail: correct
          ? undefined
          : `${remaining} objective${remaining === 1 ? '' : 's'} still open.`,
      };
    }

    // -----------------------------------------------------------------------
    case 't_account_flow': {
      const { shifts } = answer as Extract<ChallengeAnswer, { type: 't_account_flow' }>;
      const verdict = evaluateTAccount(challenge, shifts);
      return {
        correct: verdict.correct,
        title: pickTitle(verdict.correct, challenge.id),
        explanation: challenge.explanation,
        detail: describeVerdict(challenge, verdict),
      };
    }

    // -----------------------------------------------------------------------
    default:
      return assertNever(challenge, 'challenge type');
  }
}
