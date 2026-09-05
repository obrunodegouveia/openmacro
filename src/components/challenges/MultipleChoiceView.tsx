/**
 * `multiple_choice` — pick one option.
 *
 * After grading, the correct option is always revealed in green, and a wrong
 * pick is marked red. Seeing the right answer next to your wrong one is a big
 * part of why the format works.
 */

import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { ChallengeComponentProps } from '@/components/challenges/types';
import { emitFeedback } from '@/feedback';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import { seededShuffle } from '@/utils/format';

export function MultipleChoiceView({
  challenge,
  onAnswerChange,
  locked,
}: ChallengeComponentProps<'multiple_choice'>) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Stable across re-renders, re-shuffled per challenge id.
  const [options] = useState(() => seededShuffle(challenge.options, challenge.id));

  useEffect(() => {
    onAnswerChange(selectedId ? { type: 'multiple_choice', optionId: selectedId } : null);
  }, [selectedId, onAnswerChange]);

  const handleSelect = useCallback(
    (optionId: string) => {
      if (locked) return;
      emitFeedback('select');
      setSelectedId(optionId);
    },
    [locked],
  );

  return (
    <View style={styles.list}>
      {options.map((option, index) => {
        const isSelected = option.id === selectedId;
        const isCorrectOption = option.id === challenge.correctOptionId;

        // Post-grading colouring.
        const revealCorrect = locked && isCorrectOption;
        const revealWrong = locked && isSelected && !isCorrectOption;

        return (
          <Animated.View
            key={option.id}
            entering={FadeInDown.delay(index * 45).duration(220)}
          >
            <Pressable
              accessibilityRole="radio"
              // The label text is a child, which react-native-web does not
              // promote to an accessible name on a pressable — without this the
              // options announce as an unlabelled list of radios.
              accessibilityLabel={option.label}
              accessibilityState={{ selected: isSelected, disabled: locked }}
              onPress={() => handleSelect(option.id)}
              disabled={locked}
              style={[
                styles.option,
                isSelected && !locked && styles.optionSelected,
                revealCorrect && styles.optionCorrect,
                revealWrong && styles.optionWrong,
              ]}
            >
              <View
                style={[
                  styles.marker,
                  isSelected && !locked && styles.markerSelected,
                  revealCorrect && styles.markerCorrect,
                  revealWrong && styles.markerWrong,
                ]}
              >
                <Text
                  style={[
                    styles.markerText,
                    ((isSelected && !locked) || revealCorrect || revealWrong) &&
                      styles.markerTextOnFill,
                  ]}
                >
                  {revealCorrect ? '✓' : revealWrong ? '✕' : String.fromCharCode(65 + index)}
                </Text>
              </View>
              <Text
                style={[
                  styles.optionLabel,
                  isSelected && !locked && styles.optionLabelSelected,
                  revealCorrect && styles.optionLabelCorrect,
                  revealWrong && styles.optionLabelWrong,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: palette.border,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  optionSelected: {
    borderColor: palette.blue,
    backgroundColor: palette.blueSoft,
  },
  optionCorrect: {
    borderColor: palette.mint,
    backgroundColor: palette.mintSoft,
  },
  optionWrong: {
    borderColor: palette.coral,
    backgroundColor: palette.coralSoft,
  },
  marker: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerSelected: {
    borderColor: palette.blue,
    backgroundColor: palette.blue,
  },
  markerCorrect: {
    borderColor: palette.mintDark,
    backgroundColor: palette.mintDark,
  },
  markerWrong: {
    borderColor: palette.coralDark,
    backgroundColor: palette.coralDark,
  },
  markerText: {
    ...typography.caption,
    color: palette.inkMuted,
  },
  /** Once the marker has a filled background the glyph must invert. */
  markerTextOnFill: {
    color: '#FFFFFF',
  },
  optionLabel: {
    ...typography.body,
    color: palette.ink,
    flex: 1,
  },
  optionLabelSelected: {
    color: palette.blueDark,
    fontWeight: '700',
  },
  optionLabelCorrect: {
    color: palette.mintDark,
    fontWeight: '700',
  },
  optionLabelWrong: {
    color: palette.coralDark,
    fontWeight: '700',
  },
});
