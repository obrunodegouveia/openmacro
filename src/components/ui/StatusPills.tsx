/**
 * The two small status indicators that live in the lesson header: hearts
 * (health) and the daily streak flame.
 *
 * Both animate on change so a lost heart is felt rather than just seen.
 */

import { memo, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { palette, radius, spacing, typography } from '@/theme/tokens';

// ---------------------------------------------------------------------------
// Hearts
// ---------------------------------------------------------------------------

export interface HeartsIndicatorProps {
  hearts: number;
  maxHearts: number;
}

function HeartsIndicatorComponent({ hearts, maxHearts }: HeartsIndicatorProps) {
  const scale = useSharedValue(1);
  const previous = useSharedValue(hearts);

  useEffect(() => {
    if (hearts < previous.value) {
      // Lost a heart: a quick, slightly violent pulse.
      scale.value = withSequence(
        withTiming(1.35, { duration: 110 }),
        withSpring(1, { damping: 8, stiffness: 220 }),
      );
    }
    previous.value = hearts;
  }, [hearts, previous, scale]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View
      accessibilityLabel={`${hearts} of ${maxHearts} hearts remaining`}
      style={[styles.pill, animatedStyle]}
    >
      <Text style={styles.icon}>{hearts > 0 ? '❤️' : '💔'}</Text>
      <Text style={[styles.value, { color: palette.heart }]}>{hearts}</Text>
    </Animated.View>
  );
}

export const HeartsIndicator = memo(HeartsIndicatorComponent);

// ---------------------------------------------------------------------------
// Daily streak
// ---------------------------------------------------------------------------

export interface StreakBadgeProps {
  streak: number;
  /** Dims the flame when today's goal has not been met yet. */
  active?: boolean;
}

function StreakBadgeComponent({ streak, active = true }: StreakBadgeProps) {
  return (
    <View accessibilityLabel={`${streak} day streak`} style={styles.pill}>
      <Text style={[styles.icon, !active && styles.inactiveIcon]}>🔥</Text>
      <Text style={[styles.value, { color: active ? palette.goldDark : palette.inkFaint }]}>
        {streak}
      </Text>
    </View>
  );
}

export const StreakBadge = memo(StreakBadgeComponent);

// ---------------------------------------------------------------------------
// In-lesson combo (consecutive first-try correct answers)
// ---------------------------------------------------------------------------

export interface ComboPillProps {
  combo: number;
}

function ComboPillComponent({ combo }: ComboPillProps) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(combo >= 2 ? 1 : 0, { damping: 12, stiffness: 200 });
  }, [combo, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  const visible = combo >= 2;

  return (
    <Animated.View
      style={[styles.combo, animatedStyle]}
      pointerEvents="none"
      // Scaled to zero is still readable by a screen reader, so hide it
      // explicitly rather than relying on the visual collapse.
      accessibilityElementsHidden={!visible}
      importantForAccessibility={visible ? 'yes' : 'no-hide-descendants'}
    >
      <Text style={styles.comboText}>{combo} in a row</Text>
    </Animated.View>
  );
}

export const ComboPill = memo(ComboPillComponent);

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  icon: {
    fontSize: 18,
  },
  inactiveIcon: {
    opacity: 0.35,
  },
  value: {
    ...typography.bodyStrong,
  },
  combo: {
    alignSelf: 'center',
    backgroundColor: palette.goldSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  comboText: {
    ...typography.caption,
    color: palette.goldDark,
  },
});
