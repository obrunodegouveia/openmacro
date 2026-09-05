"use client";

import type { Challenge } from "@openmacro/core/content/schema";
import type { ChallengeAnswer } from "@openmacro/core/engine/answers";
import type { GradeResult } from "@openmacro/core/engine/grading";
import { MultipleChoiceView } from "./multiple-choice";
import { ConceptMatchView } from "./concept-match";
import { OrderFlowView } from "./order-flow";
import { InteractiveSimView } from "./interactive-sim";
import { TAccountFlowView } from "./t-account-flow";

/**
 * Renders whichever challenge is on screen.
 *
 * The `never` in the default branch is the point: add a sixth type to the
 * schema and this stops compiling until it is handled here. A silently blank
 * challenge is far worse than a build error — it looks like a bug in the
 * lesson rather than a missing renderer.
 */
export function ChallengeView({
  challenge,
  onAnswerChange,
  locked,
  result,
}: {
  challenge: Challenge;
  onAnswerChange: (answer: ChallengeAnswer | null) => void;
  locked: boolean;
  result: GradeResult | null;
}) {
  const shared = { onAnswerChange, locked, result };

  switch (challenge.type) {
    case "multiple_choice":
      return <MultipleChoiceView challenge={challenge} {...shared} />;
    case "concept_match":
      return <ConceptMatchView challenge={challenge} {...shared} />;
    case "order_flow":
      return <OrderFlowView challenge={challenge} {...shared} />;
    case "interactive_sim":
      return <InteractiveSimView challenge={challenge} {...shared} />;
    case "t_account_flow":
      return <TAccountFlowView challenge={challenge} {...shared} />;
    default: {
      const unhandled: never = challenge;
      throw new Error(`Unhandled challenge type: ${JSON.stringify(unhandled)}`);
    }
  }
}
