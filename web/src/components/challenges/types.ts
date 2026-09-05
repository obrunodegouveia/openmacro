/**
 * The contract every web challenge component implements.
 *
 * Identical in shape to the mobile app's `src/components/challenges/types.ts`
 * on purpose: the two render with different primitives (DOM vs React Native)
 * but consume the same content and publish the same answers, so the grading
 * engine in `@openmacro/core` is the single source of truth for both.
 *
 * Components own their own *draft* state and publish a complete answer (or
 * `null` while it is still incomplete) through `onAnswerChange`. A challenge
 * component never grades itself.
 *
 * CONTRIBUTORS: adding a sixth challenge type means
 *   1. a new variant in packages/core/src/content/schema.ts
 *   2. a new answer shape in packages/core/src/engine/answers.ts
 *   3. a `case` in packages/core/src/engine/grading.ts
 *   4. a component here, registered in `challenge-view.tsx`
 *   5. the same in the mobile app
 * TypeScript's exhaustiveness checks point you at 1–4 automatically.
 */

import type { Challenge, ChallengeType } from "@openmacro/core/content/schema";
import type { AnswerOf } from "@openmacro/core/engine/answers";
import type { GradeResult } from "@openmacro/core/engine/grading";

export interface ChallengeComponentProps<T extends ChallengeType> {
  challenge: Extract<Challenge, { type: T }>;
  /** Publish the current draft answer, or `null` when it is not yet complete. */
  onAnswerChange: (answer: AnswerOf<T> | null) => void;
  /** True once the answer has been graded — components must lock input. */
  locked: boolean;
  /** Grading verdict, non-null only while `locked`. */
  result: GradeResult | null;
}
