/**
 * The bottom sheet that slides up after every graded answer.
 *
 * Green for correct, red for incorrect, always carrying the mechanical
 * explanation — this sheet is where the actual teaching happens, so it is
 * deliberately the loudest element on screen.
 */

import { memo, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/ui/ActionButton';
import { palette, radius, spacing, typography } from '@/theme/tokens';

/** How far below its resting place the sheet starts, in px. */
const SHEET_TRAVEL = 420;

export interface FeedbackSheetProps {
  correct: boolean;
  title: string;
  explanation: string;
  /** Answer-specific extra line, e.g. the rebuttal for the chosen distractor. */
  detail?: string;
  continueLabel?: string;
  onContinue: () => void;
  /**
   * Reports the sheet's rendered height so the runner can pad the scroll view
   * behind it. Without this, anything the challenge renders near the bottom —
   * a T-account's aggregate summary, the last option in a long list — sits
   * under the sheet and cannot be scrolled into view.
   */
  onHeightChange?: (height: number) => void;
}

function FeedbackSheetComponent({
  correct,
  title,
  explanation,
  detail,
  continueLabel = 'Continue',
  onContinue,
  onHeightChange,
}: FeedbackSheetProps) {
  const insets = useSafeAreaInsets();

  /**
   * The slide-up is driven by an explicit shared value rather than Reanimated's
   * `entering={SlideInDown}` layout animation: on react-native-web the layout
   * animation can settle without clearing its transform, leaving the sheet
   * parked off-screen. A plain animated style behaves identically everywhere.
   */
  const offset = useSharedValue(SHEET_TRAVEL);

  useEffect(() => {
    offset.value = withSpring(0, { damping: 20, stiffness: 220, mass: 0.9 });
  }, [offset]);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  const accent = correct ? palette.mintDark : palette.coralDark;
  const background = correct ? palette.mintSoft : palette.coralSoft;

  return (
    <Animated.View
      style={[
        styles.sheet,
        { backgroundColor: background, paddingBottom: Math.max(insets.bottom, spacing.lg) },
        slideStyle,
      ]}
      accessibilityLiveRegion="polite"
      onLayout={(event) => onHeightChange?.(event.nativeEvent.layout.height)}
    >
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: accent }]}>
          <Text style={styles.badgeIcon}>{correct ? '✓' : '✕'}</Text>
        </View>
        <Text style={[styles.title, { color: accent }]}>{title}</Text>
      </View>

      {detail ? <Text style={[styles.detail, { color: accent }]}>{detail}</Text> : null}

      <Text style={styles.explanation}>{explanation}</Text>

      <ActionButton
        label={continueLabel}
        tone={correct ? 'primary' : 'danger'}
        onPress={onContinue}
        style={styles.button}
        testID="feedback-continue"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    gap: spacing.md,
    // Lift the sheet above the challenge content.
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -6 },
    elevation: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  badge: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    lineHeight: 22,
  },
  title: {
    ...typography.title,
    flexShrink: 1,
  },
  detail: {
    ...typography.bodyStrong,
  },
  explanation: {
    ...typography.body,
    color: palette.ink,
  },
  button: {
    marginTop: spacing.sm,
  },
});

export const FeedbackSheet = memo(FeedbackSheetComponent);
