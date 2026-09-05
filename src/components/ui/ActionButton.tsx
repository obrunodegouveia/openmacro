/**
 * The chunky "3D" button used for every primary action.
 *
 * It renders a coloured face sitting on a darker shadow slab; pressing sinks
 * the face onto the slab. Reanimated drives the sink so it stays on the UI
 * thread and never stutters behind a re-render.
 */

import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { emitFeedback } from '@/feedback';
import { palette, radius, spacing, typography } from '@/theme/tokens';

export type ActionButtonTone = 'primary' | 'danger' | 'neutral' | 'ghost';

interface ToneStyle {
  face: string;
  shadow: string;
  label: string;
  border?: string;
}

const TONES: Record<ActionButtonTone, ToneStyle> = {
  primary: { face: palette.mint, shadow: palette.mintDark, label: '#FFFFFF' },
  danger: { face: palette.coral, shadow: palette.coralDark, label: '#FFFFFF' },
  neutral: { face: palette.blue, shadow: palette.blueDark, label: '#FFFFFF' },
  ghost: {
    face: palette.surface,
    shadow: palette.border,
    label: palette.inkMuted,
    border: palette.border,
  },
};

const SINK = 4;

export interface ActionButtonProps {
  label: string;
  onPress: () => void;
  tone?: ActionButtonTone;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

function ActionButtonComponent({
  label,
  onPress,
  tone = 'primary',
  disabled = false,
  style,
  testID,
}: ActionButtonProps) {
  const sink = useSharedValue(0);
  const toneStyle = TONES[tone];

  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sink.value }],
  }));

  const handlePressIn = useCallback(() => {
    sink.value = withTiming(SINK, { duration: 60 });
  }, [sink]);

  const handlePressOut = useCallback(() => {
    sink.value = withTiming(0, { duration: 90 });
  }, [sink]);

  const handlePress = useCallback(() => {
    emitFeedback('select');
    onPress();
  }, [onPress]);

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[styles.slab, { backgroundColor: toneStyle.shadow }, disabled && styles.disabled, style]}
    >
      <Animated.View
        style={[
          styles.face,
          {
            backgroundColor: toneStyle.face,
            borderWidth: toneStyle.border ? 2 : 0,
            borderColor: toneStyle.border ?? 'transparent',
          },
          faceStyle,
        ]}
      >
        <Text style={[styles.label, { color: toneStyle.label }]} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
      {/* Spacer keeps the slab exactly SINK taller than the face. */}
      <View style={{ height: SINK }} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slab: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.4,
  },
  face: {
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.bodyStrong,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});

export const ActionButton = memo(ActionButtonComponent);
