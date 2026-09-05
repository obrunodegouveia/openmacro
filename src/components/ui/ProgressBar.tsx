/**
 * Linear lesson progress bar.
 *
 * Animates on the UI thread so it glides even while the next challenge is
 * mounting. It can move backwards — a re-queued challenge genuinely lengthens
 * the run, and pretending otherwise would be a lie the learner can feel.
 */

import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { palette, radius } from '@/theme/tokens';

export interface ProgressBarProps {
  /** 0..1 */
  progress: number;
  height?: number;
  trackColor?: string;
  fillColor?: string;
}

function ProgressBarComponent({
  progress,
  height = 14,
  trackColor = palette.border,
  fillColor = palette.mint,
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const width = useSharedValue(clamped);

  useEffect(() => {
    width.value = withTiming(clamped, {
      duration: 420,
      easing: Easing.out(Easing.cubic),
    });
  }, [clamped, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
    // The fill carries padding for its sheen, so a 0%-width fill would still
    // paint a small coloured stub. Hide it entirely until there is progress.
    opacity: width.value <= 0.001 ? 0 : 1,
  }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, { height, borderRadius: height / 2, backgroundColor: trackColor }]}
    >
      <Animated.View
        style={[styles.fill, { borderRadius: height / 2, backgroundColor: fillColor }, fillStyle]}
      >
        {/* Glossy highlight, purely decorative. */}
        <View style={styles.sheen} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    justifyContent: 'flex-start',
    paddingHorizontal: 5,
    paddingTop: 3,
  },
  sheen: {
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.45)',
    width: '100%',
  },
});

export const ProgressBar = memo(ProgressBarComponent);
