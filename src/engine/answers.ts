/**
 * Answer shapes, one per challenge type.
 *
 * Each challenge component owns its local draft state and emits one of these
 * when the learner presses "Check". The engine never inspects component state
 * directly — this is the only contract between UI and grading.
 */

import type { BalanceSheetShift, ChallengeType } from '@/content/schema';
import type { SimSliderValues } from '@/engine/simulation';

export interface MultipleChoiceAnswer {
  type: 'multiple_choice';
  /** `MultipleChoiceOption.id` the learner selected. */
  optionId: string;
}

export interface ConceptMatchAnswer {
  type: 'concept_match';
  /** Map of `ConceptPair.id` (term side) -> `ConceptPair.id` (definition side). */
  pairings: Readonly<Record<string, string>>;
}

export interface OrderFlowAnswer {
  type: 'order_flow';
  /** `FlowEvent.id`s in the order the learner arranged them. */
  order: readonly string[];
}

export interface InteractiveSimAnswer {
  type: 'interactive_sim';
  sliderValues: SimSliderValues;
  /** Encoded observations (see `observationKey`) collected this attempt. */
  observed: readonly string[];
}

export interface TAccountFlowAnswer {
  type: 't_account_flow';
  /**
   * Every posting the learner placed, in placement order. The engine nets and
   * sorts them, so the component does not have to deduplicate as it goes.
   */
  shifts: readonly BalanceSheetShift[];
}

export type ChallengeAnswer =
  | MultipleChoiceAnswer
  | ConceptMatchAnswer
  | OrderFlowAnswer
  | InteractiveSimAnswer
  | TAccountFlowAnswer;

export type AnswerOf<T extends ChallengeType> = Extract<ChallengeAnswer, { type: T }>;
