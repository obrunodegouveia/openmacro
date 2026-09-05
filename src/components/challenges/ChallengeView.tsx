/**
 * Challenge dispatcher.
 *
 * The one place that maps a `Challenge` variant to its component. Adding a
 * challenge type is a single `case` here — the runner, the progress model and
 * the routing layer never learn about challenge types at all.
 */

import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import { ConceptMatchView } from '@/components/challenges/ConceptMatchView';
import { InteractiveSimView } from '@/components/challenges/InteractiveSimView';
import { MultipleChoiceView } from '@/components/challenges/MultipleChoiceView';
import { OrderFlowView } from '@/components/challenges/OrderFlowView';
import { TAccountFlowView } from '@/components/challenges/TAccountFlowView';
import type { Challenge } from '@/content/schema';
import type { ChallengeAnswer } from '@/engine/answers';
import type { GradeResult } from '@/engine/grading';
import { palette, spacing, typography } from '@/theme/tokens';

export interface ChallengeViewProps {
  challenge: Challenge;
  onAnswerChange: (answer: ChallengeAnswer | null) => void;
  locked: boolean;
  result: GradeResult | null;
  /**
   * Bumped by the runner whenever the challenge changes, so the enter/exit
   * transition replays even if the same challenge is re-queued.
   */
  transitionKey: string;
}

function ChallengeBody({
  challenge,
  onAnswerChange,
  locked,
  result,
}: Omit<ChallengeViewProps, 'transitionKey'>) {
  switch (challenge.type) {
    case 'multiple_choice':
      return (
        <MultipleChoiceView
          challenge={challenge}
          onAnswerChange={onAnswerChange}
          locked={locked}
          result={result}
        />
      );
    case 'concept_match':
      return (
        <ConceptMatchView
          challenge={challenge}
          onAnswerChange={onAnswerChange}
          locked={locked}
          result={result}
        />
      );
    case 'order_flow':
      return (
        <OrderFlowView
          challenge={challenge}
          onAnswerChange={onAnswerChange}
          locked={locked}
          result={result}
        />
      );
    case 'interactive_sim':
      return (
        <InteractiveSimView
          challenge={challenge}
          onAnswerChange={onAnswerChange}
          locked={locked}
          result={result}
        />
      );
    case 't_account_flow':
      return (
        <TAccountFlowView
          challenge={challenge}
          onAnswerChange={onAnswerChange}
          locked={locked}
          result={result}
        />
      );
    default:
      // Adding a challenge type without a component now fails to compile,
      // rather than rendering a blank step at runtime.
      return assertNever(challenge);
  }
}

/** Exhaustiveness guard for the challenge union. */
function assertNever(challenge: never): never {
  throw new Error(
    `[OpenMacro] No component registered for challenge ${JSON.stringify(challenge)}`,
  );
}

function ChallengeViewComponent(props: ChallengeViewProps) {
  const { challenge, transitionKey } = props;

  return (
    <Animated.View
      // A new key remounts the subtree, which is what makes each step feel
      // like a fresh screen and resets every component's draft state.
      key={transitionKey}
      entering={FadeInRight.duration(260)}
      exiting={FadeOutLeft.duration(160)}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.prompt}>{challenge.prompt}</Text>
        {challenge.instructions ? (
          <Text style={styles.instructions}>{challenge.instructions}</Text>
        ) : null}
      </View>

      <ChallengeBody {...props} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
  },
  header: {
    gap: spacing.xs,
  },
  prompt: {
    ...typography.title,
    color: palette.ink,
  },
  instructions: {
    ...typography.caption,
    color: palette.inkMuted,
    fontWeight: '500',
  },
});

export const ChallengeView = memo(ChallengeViewComponent);
