/**
 * ============================================================================
 * Speaker reactions
 * ============================================================================
 *
 * Which face a challenge's `speaker` pulls, and when. Decided here, once, so
 * that the app and the website cannot disagree about whether Olivia looks
 * pleased or sheepish after the same answer. A client only turns the
 * `(character, expression)` pair this returns into an image.
 *
 *   moment       expression
 *   ----------   ----------------------------------------------------------
 *   question     `thinking` when the prompt asks something, `happy` when it
 *                is an instruction ("Match each word…", "Post it on…")
 *   correct      `excited`
 *   incorrect    `oops`
 *   idle         `happy` — anywhere the character is shown with no question
 */

import type { CharacterExpression, CharacterId } from '../content/characters';
import type { Challenge } from '../content/schema';

export type SpeakerMoment = 'question' | 'correct' | 'incorrect' | 'idle';

export interface SpeakerReaction {
  character: CharacterId;
  expression: CharacterExpression;
}

/**
 * Does the prompt end on a question?
 *
 * Read from the text the learner sees, so it follows the translation: a
 * question in English is a question in Portuguese, and both end in "?".
 * Trailing quotes and brackets are ignored.
 */
export function promptAsks(prompt: string): boolean {
  return /\?\s*["'”’»)\]]*\s*$/.test(prompt);
}

/** The expression for a moment, given the prompt on screen. */
export function speakerExpression(moment: SpeakerMoment, prompt = ''): CharacterExpression {
  switch (moment) {
    case 'question':
      return promptAsks(prompt) ? 'thinking' : 'happy';
    case 'correct':
      return 'excited';
    case 'incorrect':
      return 'oops';
    case 'idle':
      return 'happy';
    default: {
      const unhandled: never = moment;
      throw new Error(`Unhandled speaker moment: ${String(unhandled)}`);
    }
  }
}

/**
 * The speaker's reaction to a challenge at a moment, or `null` when the
 * challenge has no speaker and nothing should be drawn.
 */
export function speakerReaction(
  challenge: Pick<Challenge, 'speaker' | 'prompt'>,
  moment: SpeakerMoment,
): SpeakerReaction | null {
  if (!challenge.speaker) return null;
  return { character: challenge.speaker, expression: speakerExpression(moment, challenge.prompt) };
}

/** The moment that follows a graded answer. */
export function verdictMoment(correct: boolean): SpeakerMoment {
  return correct ? 'correct' : 'incorrect';
}
