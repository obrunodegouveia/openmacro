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
import { englishTranslator, pickVariant, type Translator } from '../i18n';

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

/** How many phrasings English offers for each verdict. See `pickVariant`. */
const CORRECT_VARIANTS = 4;
const INCORRECT_VARIANTS = 3;

/**
 * Deterministic title picker — varies the copy so a long lesson does not read
 * like a broken record, without introducing randomness that would make the UI
 * impossible to snapshot-test.
 */
function pickTitle(t: Translator, correct: boolean, seed: string): string {
  return correct
    ? pickVariant(t, 'grade.correct', CORRECT_VARIANTS, seed)
    : pickVariant(t, 'grade.incorrect', INCORRECT_VARIANTS, seed);
}

/** Exhaustiveness guard: adding a challenge type without a case fails to compile. */
function assertNever(value: never, context: string): never {
  throw new Error(`[OpenMacro] Unhandled ${context}: ${JSON.stringify(value)}`);
}

/**
 * Grade an answer and produce the copy the feedback sheet shows.
 *
 * The `t` argument is what makes the sheet speak the learner's language. It
 * defaults to English so every existing caller — and every test — keeps
 * working unchanged, but the app always passes its own, because the alternative
 * is a Portuguese lesson whose corrections arrive in English.
 *
 * Note what is *not* translated here: `challenge.explanation`, and the option
 * feedback, come from the content overlay rather than the UI catalogue. Those
 * are the lesson, not the interface, and they are translated in
 * `packages/core/src/i18n/content` — by the time grading sees a challenge it
 * has already been localised.
 */
export function gradeChallenge(
  challenge: Challenge,
  answer: ChallengeAnswer,
  t: Translator = englishTranslator,
): GradeResult {
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
        title: pickTitle(t, correct, challenge.id),
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
        title: pickTitle(t, correct, challenge.id),
        explanation: challenge.explanation,
        detail: correct ? undefined : t('grade.match.partial', { matched, total }),
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
            ? t('grade.order.step', { number: firstWrong + 1, label: expectedEvent.label })
            : undefined;
        }
      }
      return {
        correct,
        title: pickTitle(t, correct, challenge.id),
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
        title: pickTitle(t, correct, challenge.id),
        explanation: challenge.explanation,
        detail: correct ? undefined : t('grade.sim.open', { count: remaining }),
      };
    }

    // -----------------------------------------------------------------------
    case 't_account_flow': {
      const { shifts } = answer as Extract<ChallengeAnswer, { type: 't_account_flow' }>;
      const verdict = evaluateTAccount(challenge, shifts);
      return {
        correct: verdict.correct,
        title: pickTitle(t, verdict.correct, challenge.id),
        explanation: challenge.explanation,
        detail: describeVerdict(challenge, verdict, t),
      };
    }

    // -----------------------------------------------------------------------
    default:
      return assertNever(challenge, 'challenge type');
  }
}
