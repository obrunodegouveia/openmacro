/**
 * ============================================================================
 * OpenMacro content schema
 * ============================================================================
 *
 * Every piece of learning content in OpenMacro is plain, serialisable data.
 * There are no functions, no JSX and no imports from the UI layer in here —
 * which means a lesson can live equally happily as a `.ts` file, a `.json`
 * file, or a row fetched from a CMS later on.
 *
 * Five challenge types are supported today:
 *
 *   | type               | learner interaction                               |
 *   |--------------------|---------------------------------------------------|
 *   | `multiple_choice`  | pick one option, get an explanation                |
 *   | `concept_match`    | pair terms with their definitions                  |
 *   | `order_flow`       | arrange events into a causal sequence              |
 *   | `interactive_sim`  | drive sliders, watch derived values, hit a target  |
 *   | `t_account_flow`   | post double-entry shifts across balance sheets     |
 *
 * CONTRIBUTORS: to add a lesson you only need this file and
 * `src/content/lessons/README.md`. You should not need to touch the engine.
 */

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

/** Discriminator for the challenge union. */
export type ChallengeType =
  | 'multiple_choice'
  | 'concept_match'
  | 'order_flow'
  | 'interactive_sim'
  | 't_account_flow';

/** How difficult a lesson feels, used for ordering and badges on the path. */
export type Difficulty = 'intro' | 'core' | 'advanced';

/**
 * The four balance-sheet tiers OpenMacro models.
 *
 * Every entity in a `t_account_flow` belongs to exactly one tier, and the tier
 * is what makes a scenario legible: money behaves differently depending on
 * whose liability it is.
 *
 *   | tier               | who sits here                                     |
 *   |--------------------|---------------------------------------------------|
 *   | `central_bank`     | the Fed, the ECB — issuers of the monetary base   |
 *   | `commercial_bank`  | deposit-taking banks that create M1/M2            |
 *   | `shadow_bank`      | MMFs, dealers, repo desks, the eurodollar system  |
 *   | `fiduciary_core`   | the state, taxpayers, and the legal tender frame  |
 */
export type MonetaryTier =
  | 'central_bank'
  | 'commercial_bank'
  | 'shadow_bank'
  | 'fiduciary_core';

/**
 * Fields shared by every challenge.
 *
 * `explanation` is the single most important field in the schema: it is what
 * the learner reads in the feedback sheet after answering, and it is what
 * turns a quiz into a lesson. Write it as one or two mechanical sentences —
 * describe *why* the answer works, not just *that* it is correct.
 */
export interface BaseChallenge {
  /** Unique within the lesson. Used as a React key and as the answer key. */
  id: string;
  type: ChallengeType;
  /** The question, shown as the headline of the step. */
  prompt: string;
  /** Optional sub-line telling the learner what to physically do. */
  instructions?: string;
  /** Shown in the feedback sheet regardless of correct/incorrect. */
  explanation: string;
  /** Experience points awarded for a first-try correct answer. Default 10. */
  xp?: number;
  /** Free-form taxonomy, e.g. ['money-creation', 'central-banking']. */
  tags?: string[];
}

// ---------------------------------------------------------------------------
// 1. multiple_choice
// ---------------------------------------------------------------------------

export interface MultipleChoiceOption {
  id: string;
  label: string;
  /**
   * Optional targeted rebuttal shown when the learner picks *this* wrong
   * option. Far more effective than a generic "Incorrect".
   */
  feedback?: string;
}

export interface MultipleChoiceChallenge extends BaseChallenge {
  type: 'multiple_choice';
  options: MultipleChoiceOption[];
  /** Must match one `MultipleChoiceOption.id`. */
  correctOptionId: string;
}

// ---------------------------------------------------------------------------
// 2. concept_match
// ---------------------------------------------------------------------------

export interface ConceptPair {
  id: string;
  /** Left column, e.g. "Purchasing power". */
  term: string;
  /** Right column, e.g. "The quantity of goods a unit of money can buy". */
  definition: string;
}

export interface ConceptMatchChallenge extends BaseChallenge {
  type: 'concept_match';
  /** 3–5 pairs works best on a phone screen. */
  pairs: ConceptPair[];
}

// ---------------------------------------------------------------------------
// 3. order_flow
// ---------------------------------------------------------------------------

export interface FlowEvent {
  id: string;
  /** Short label shown on the card, e.g. "Borrowing surges". */
  label: string;
  /** Optional one-liner adding mechanical detail. */
  detail?: string;
}

export interface OrderFlowChallenge extends BaseChallenge {
  type: 'order_flow';
  /** Presented to the learner shuffled; order in this array is irrelevant. */
  events: FlowEvent[];
  /** The causally correct sequence, as `FlowEvent.id`s. */
  correctOrder: string[];
}

// ---------------------------------------------------------------------------
// 4. interactive_sim
// ---------------------------------------------------------------------------

/** How a number is rendered to the learner. */
export type ValueFormat = 'currency' | 'percent' | 'multiplier' | 'number';

export interface SimSlider {
  /** Variable name referenced by formulas, e.g. 'reserveRatio'. */
  key: string;
  label: string;
  min: number;
  max: number;
  /** Slider granularity. Use 0 for a continuous slider. */
  step: number;
  defaultValue: number;
  format: ValueFormat;
  /** Optional helper text under the slider. */
  hint?: string;
}

/**
 * Identifier of a pure function registered in `src/content/formulas.ts`.
 *
 * Formulas live in code rather than in content so that lessons stay 100%
 * serialisable (JSON-safe) and so the maths can be unit-tested independently
 * of any lesson that happens to use it.
 */
export type FormulaId = string;

export interface SimReadout {
  /** Variable name this readout produces, e.g. 'totalMoney'. */
  key: string;
  label: string;
  formulaId: FormulaId;
  format: ValueFormat;
  /** Render this readout as the big hero number. At most one per sim. */
  emphasis?: boolean;
  /** Shown under the value, e.g. "M = D x (1 / R)". */
  caption?: string;
}

export type Comparator = 'eq' | 'gte' | 'lte' | 'gt' | 'lt';

/**
 * Forces genuine exploration: the learner must actually park the slider on
 * each listed value at least once before the sim can be submitted. This is
 * what turns a toy into a lesson — you cannot skip the 10% vs 20% comparison.
 */
export interface RequiredObservation {
  sliderKey: string;
  values: number[];
}

export interface SimObjective {
  /** Rendered as the checklist headline, e.g. "Compare 10% and 20%". */
  description: string;
  requiredObservations?: RequiredObservation[];
  /** Final slider state the learner must be resting on when they submit. */
  target?: {
    readoutKey: string;
    comparator: Comparator;
    value: number;
    /** Absolute tolerance for floating-point comparisons. Default 0.001. */
    tolerance?: number;
  };
}

export interface InteractiveSimChallenge extends BaseChallenge {
  type: 'interactive_sim';
  /**
   * ISO 4217 code used to render every `currency`-formatted slider and
   * readout. Default 'USD' — a euro-area sim must say so, or it will label
   * the ECB's balance sheet in dollars.
   */
  currency?: string;
  /** Fixed inputs available to formulas, e.g. { initialDeposit: 1000 }. */
  constants: Record<string, number>;
  sliders: SimSlider[];
  readouts: SimReadout[];
  objective: SimObjective;
  /** Optional framing paragraph shown above the widget. */
  narrative?: string;
}

// ---------------------------------------------------------------------------
// 5. t_account_flow
// ---------------------------------------------------------------------------

/**
 * Which side of a T-account a line sits on.
 *
 * Deliberately only two values. Equity is folded into liabilities, because at
 * the level OpenMacro teaches, "what it owes" and "what it owns" is the
 * distinction that carries the mechanics.
 */
export type BalanceSheetSide = 'asset' | 'liability';

/** One line already on an entity's balance sheet when the scenario opens. */
export interface TAccountLine {
  /** Account name as it should read on the sheet, e.g. "US Treasuries". */
  account: string;
  side: BalanceSheetSide;
  /** Opening balance in the challenge's currency units. */
  amount: number;
}

/**
 * A participant in the scenario, rendered as one T-account.
 *
 * Two or three entities is the sweet spot: enough to show that one party's
 * asset is always another's liability, few enough to fit a phone screen.
 */
export interface TAccountEntity {
  /** Referenced by `BalanceSheetShift.entityId`. */
  id: string;
  /** Display name, e.g. "Federal Reserve". */
  label: string;
  tier: MonetaryTier;
  /** Optional one-liner under the name, e.g. "Issuer of the monetary base". */
  role?: string;
  /** Opening balance sheet. Omit for an entity that starts empty. */
  openingLines?: TAccountLine[];
}

/**
 * A single posting: this account, on this side of this entity's sheet, moves
 * by this much.
 *
 * `delta` is signed and denominated in the challenge's currency units, so a
 * drain is expressed as a negative number rather than as a separate opposite
 * "credit" concept. Learners think in "reserves went down by 500 million",
 * and the schema should not make them translate that.
 */
export interface BalanceSheetShift {
  entityId: string;
  side: BalanceSheetSide;
  account: string;
  delta: number;
}

/**
 * An entry the learner can place, shown as a draggable/tappable chip.
 *
 * Distractors are the point of this type. Offering only the correct postings
 * turns the puzzle into a sorting exercise; offering plausible wrong ones —
 * the right amount on the wrong side, the right side on the wrong entity —
 * is what tests whether the mechanism is actually understood.
 */
export interface TAccountEntryOption {
  id: string;
  /** The posting this chip represents if placed. */
  shift: BalanceSheetShift;
  /** Shown when the learner places this chip and it is wrong. */
  feedback?: string;
}

/** Which monetary aggregate an effect describes. */
export type MonetaryAggregate = 'M0' | 'M1' | 'M2' | 'collateral';

/** Direction an aggregate moves once the scenario settles. */
export type AggregateDirection = 'expand' | 'contract' | 'unchanged';

/**
 * The "instant analysis" shown after a correct submission.
 *
 * This is where the lesson lands: the learner has just built the postings by
 * hand, and now sees which aggregates actually moved as a result. "Did M0
 * expand? Yes. Did M2 expand? Yes." is worth more than any paragraph.
 */
export interface AggregateEffect {
  aggregate: MonetaryAggregate;
  direction: AggregateDirection;
  /** One mechanical sentence explaining why it moved, or why it did not. */
  note: string;
}

export interface TAccountFlowChallenge extends BaseChallenge {
  type: 't_account_flow';
  /** Framing paragraph: the operation being executed, in plain language. */
  scenario?: string;
  /** ISO 4217 code used for formatting. Default 'USD'. */
  currency?: string;
  /** The T-accounts on screen, left to right. */
  entities: TAccountEntity[];
  /** Chips offered to the learner, correct ones and distractors together. */
  options: TAccountEntryOption[];
  /**
   * The postings that must all be present for the answer to be correct.
   * Every expected shift should have a matching `options` entry.
   */
  expectedShifts: BalanceSheetShift[];
  /** Shown in the feedback sheet once the postings balance. */
  aggregateEffects?: AggregateEffect[];
}

// ---------------------------------------------------------------------------
// The union
// ---------------------------------------------------------------------------

export type Challenge =
  | MultipleChoiceChallenge
  | ConceptMatchChallenge
  | OrderFlowChallenge
  | InteractiveSimChallenge
  | TAccountFlowChallenge;

/** Narrow a `Challenge` by its `type` discriminator. */
export type ChallengeOf<T extends ChallengeType> = Extract<Challenge, { type: T }>;

// ---------------------------------------------------------------------------
// Lessons, modules and courses
// ---------------------------------------------------------------------------

export interface Lesson {
  /** Globally unique, kebab-case. Used in the URL: /lesson/[lessonId]. */
  id: string;
  title: string;
  /** One-line promise of what the learner will understand afterwards. */
  subtitle: string;
  /** Emoji used as the lesson icon on the learning path. */
  icon: string;
  difficulty: Difficulty;
  /** Rough minutes-to-complete, shown on the lesson card. */
  estimatedMinutes: number;
  /** Hearts the learner starts with. Default 3. */
  hearts?: number;
  challenges: Challenge[];
  /** Take-aways shown on the completion screen. */
  keyTakeaways?: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  /** Accent colour for the module header. Any token from `palette`. */
  accent: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Default XP awarded when a challenge does not specify its own. */
export const DEFAULT_CHALLENGE_XP = 10;

/** Default hearts per lesson when a lesson does not specify its own. */
export const DEFAULT_HEARTS = 3;

/**
 * Identity helper that gives contributors full autocomplete and type errors
 * inside a lesson literal, without having to write an explicit annotation.
 *
 * ```ts
 * export const myLesson = defineLesson({ id: 'my-lesson', ... });
 * ```
 */
export function defineLesson<T extends Lesson>(lesson: T): T {
  return lesson;
}

/** Same as `defineLesson`, for a whole module of lessons. */
export function defineModule<T extends Module>(module: T): T {
  return module;
}
