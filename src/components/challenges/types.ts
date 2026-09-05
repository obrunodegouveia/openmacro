/**
 * The contract every challenge component implements.
 *
 * Components own their own *draft* state and publish a complete answer (or
 * `null` while the answer is still incomplete) through `onAnswerChange`. The
 * runner owns submission, grading and hearts — a challenge component never
 * grades itself.
 *
 * CONTRIBUTORS: adding a fifth challenge type means
 *   1. a new variant in `src/content/schema.ts`
 *   2. a new answer shape in `src/engine/answers.ts`
 *   3. a `case` in `src/engine/grading.ts`
 *   4. a component here, registered in `ChallengeView.tsx`
 * TypeScript's exhaustiveness checks will point you at 1–3 automatically.
 */

import type { Challenge, ChallengeType } from '@openmacro/core/content/schema';
import type { AnswerOf } from '@openmacro/core/engine/answers';
import type { GradeResult } from '@openmacro/core/engine/grading';

export interface ChallengeComponentProps<T extends ChallengeType> {
  challenge: Extract<Challenge, { type: T }>;
  /** Publish the current draft answer, or `null` when it is not yet complete. */
  onAnswerChange: (answer: AnswerOf<T> | null) => void;
  /** True once the answer has been graded — components must lock input. */
  locked: boolean;
  /** Grading verdict, non-null only while `locked`. */
  result: GradeResult | null;
}
