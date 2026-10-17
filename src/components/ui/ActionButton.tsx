/**
 * The chunky "3D" button used for every primary action.
 *
 * It renders a coloured face sitting on a darker shadow slab; pressing sinks
 * the face onto the slab. Reanimated drives the sink so it stays on the UI
 * thread and never stutters behind a re-render.
 */

import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle, type ColorValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { tapCue } from '@/feedback';
import { fontScale, palette, radius, spacing, typography } from '@/theme/tokens';

export type ActionButtonTone = 'primary' | 'danger' | 'neutral' | 'ghost';

interface ToneStyle {
  face: ColorValue;
  shadow: ColorValue;
  label: ColorValue;
  border?: ColorValue;
}

const TONES: Record<ActionButtonTone, ToneStyle> = {
  primary: { face: palette.mint, shadow: palette.mintBevel, label: palette.onFill },
  danger: { face: palette.coral, shadow: palette.coralBevel, label: palette.onFill },
  neutral: { face: palette.blue, shadow: palette.blueBevel, label: '#FFFFFF' },
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
    // The sound lands with the sink, not when the finger lifts.
    tapCue();
    sink.value = withTiming(SINK, { duration: 60 });
  }, [sink]);

  const handlePressOut = useCallback(() => {
    sink.value = withTiming(0, { duration: 90 });
  }, [sink]);

  const handlePress = useCallback(() => {
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
        <Text
          maxFontSizeMultiplier={fontScale.title}
          style={[styles.label, { color: toneStyle.label }]}
          numberOfLines={1}
        >
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
  // Sentence case, as iOS writes buttons. Spaced capitals read slower and
  // shout; the labels are already written the way they should appear.
  label: {
    ...typography.bodyStrong,
    fontSize: 17,
  },
});

export const ActionButton = memo(ActionButtonComponent);
