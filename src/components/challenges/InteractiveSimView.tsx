/**
 * `interactive_sim` — a live model the learner drives with sliders.
 *
 * Everything shown here comes from the lesson data plus the formula registry:
 * this component knows nothing about reserve ratios specifically, so the same
 * widget powers any future simulation (inflation, velocity, bond pricing...)
 * without a line of new UI code.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import Animated, { FadeIn } from 'react-native-reanimated';

import type { ChallengeComponentProps } from '@/components/challenges/types';
import type { SimSlider } from '@/content/schema';
import { emitFeedback } from '@/feedback';
import {
  buildObjectiveSteps,
  evaluateReadouts,
  initialSliderValues,
  observationKey,
} from '@/engine/simulation';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import { formatValue, snapToStep } from '@/utils/format';

export function InteractiveSimView({
  challenge,
  onAnswerChange,
  locked,
}: ChallengeComponentProps<'interactive_sim'>) {
  const [values, setValues] = useState<Record<string, number>>(() => ({
    ...initialSliderValues(challenge),
  }));

  /**
   * Slider settings the learner has actually rested on. Seeded with the
   * defaults, because those are on screen from the first frame.
   */
  const [observed, setObserved] = useState<Set<string>>(() => {
    const initial = initialSliderValues(challenge);
    return new Set(
      Object.entries(initial).map(([key, value]) => observationKey(key, value)),
    );
  });

  const readouts = useMemo(() => evaluateReadouts(challenge, values), [challenge, values]);

  const sliderByKey = useCallback(
    (key: string): SimSlider | undefined => challenge.sliders.find((s) => s.key === key),
    [challenge],
  );

  const objectiveSteps = useMemo(
    () =>
      buildObjectiveSteps(challenge.objective, observed, readouts, (value, sliderKey) => {
        const slider = sliderByKey(sliderKey);
        return formatValue(value, slider?.format ?? 'number');
      }),
    [challenge.objective, observed, readouts, sliderByKey],
  );

  /**
   * The sim is submittable once every *exploration* requirement is met. The
   * final `target` step is what actually gets graded — so the learner can
   * still get it wrong by finishing on the wrong setting, but can never lose
   * a heart merely for not having looked around yet.
   */
  const explorationDone = useMemo(
    () => objectiveSteps.filter((step) => !step.id.startsWith('target:')).every((s) => s.done),
    [objectiveSteps],
  );

  useEffect(() => {
    onAnswerChange(
      explorationDone
        ? { type: 'interactive_sim', sliderValues: values, observed: [...observed] }
        : null,
    );
  }, [explorationDone, values, observed, onAnswerChange]);

  const handleSliderChange = useCallback(
    (slider: SimSlider, raw: number) => {
      if (locked) return;
      const snapped = snapToStep(raw, slider.min, slider.step);
      setValues((current) => {
        if (current[slider.key] === snapped) return current;
        emitFeedback('select');
        return { ...current, [slider.key]: snapped };
      });
      setObserved((current) => {
        const key = observationKey(slider.key, snapped);
        if (current.has(key)) return current;
        const next = new Set(current);
        next.add(key);
        return next;
      });
    },
    [locked],
  );

  const hero = challenge.readouts.find((readout) => readout.emphasis);
  const secondary = challenge.readouts.filter((readout) => !readout.emphasis);

  return (
    <View style={styles.container}>
      {challenge.narrative ? (
        <Text style={styles.narrative}>{challenge.narrative}</Text>
      ) : null}

      {/* ---- hero readout --------------------------------------------- */}
      {hero ? (
        <Animated.View entering={FadeIn.duration(220)} style={styles.heroCard}>
          <Text style={styles.heroLabel}>{hero.label}</Text>
          <Text style={styles.heroValue}>
            {formatValue(readouts[hero.key] ?? 0, hero.format)}
          </Text>
          {hero.caption ? <Text style={styles.heroCaption}>{hero.caption}</Text> : null}
        </Animated.View>
      ) : null}

      {/* ---- sliders --------------------------------------------------- */}
      {challenge.sliders.map((slider) => (
        <View key={slider.key} style={styles.sliderBlock}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>{slider.label}</Text>
            <View style={styles.sliderValueChip}>
              <Text style={styles.sliderValueText}>
                {formatValue(values[slider.key] ?? slider.defaultValue, slider.format)}
              </Text>
            </View>
          </View>

          <Slider
            style={styles.slider}
            minimumValue={slider.min}
            maximumValue={slider.max}
            step={slider.step}
            value={values[slider.key] ?? slider.defaultValue}
            disabled={locked}
            onValueChange={(raw) => handleSliderChange(slider, raw)}
            minimumTrackTintColor={palette.blue}
            maximumTrackTintColor={palette.border}
            thumbTintColor={palette.blueDark}
            accessibilityLabel={slider.label}
          />

          <View style={styles.sliderScale}>
            <Text style={styles.sliderBound}>{formatValue(slider.min, slider.format)}</Text>
            {slider.hint ? <Text style={styles.sliderHint}>{slider.hint}</Text> : null}
            <Text style={styles.sliderBound}>{formatValue(slider.max, slider.format)}</Text>
          </View>
        </View>
      ))}

      {/* ---- secondary readouts ---------------------------------------- */}
      <View style={styles.readoutGrid}>
        {secondary.map((readout) => (
          <View key={readout.key} style={styles.readoutCard}>
            <Text style={styles.readoutLabel}>{readout.label}</Text>
            <Text style={styles.readoutValue}>
              {formatValue(readouts[readout.key] ?? 0, readout.format)}
            </Text>
            {readout.caption ? (
              <Text style={styles.readoutCaption}>{readout.caption}</Text>
            ) : null}
          </View>
        ))}
      </View>

      {/* ---- objective checklist --------------------------------------- */}
      <View style={styles.objective}>
        <Text style={styles.objectiveHeading}>Your goal</Text>
        {objectiveSteps.map((step) => (
          <View key={step.id} style={styles.objectiveRow}>
            <View style={[styles.checkbox, step.done && styles.checkboxDone]}>
              {step.done ? <Text style={styles.checkboxGlyph}>✓</Text> : null}
            </View>
            <Text style={[styles.objectiveText, step.done && styles.objectiveTextDone]}>
              {step.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  narrative: {
    ...typography.body,
    color: palette.inkMuted,
  },
  heroCard: {
    backgroundColor: palette.ink,
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  heroLabel: {
    ...typography.overline,
    color: palette.inkFaint,
    textTransform: 'uppercase',
  },
  heroValue: {
    ...typography.display,
    fontSize: 40,
    lineHeight: 46,
    color: '#FFFFFF',
  },
  heroCaption: {
    ...typography.caption,
    color: palette.inkFaint,
    fontVariant: ['tabular-nums'],
  },
  sliderBlock: {
    gap: spacing.xs,
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    ...typography.bodyStrong,
    color: palette.ink,
    flexShrink: 1,
  },
  sliderValueChip: {
    backgroundColor: palette.blueSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  sliderValueText: {
    ...typography.bodyStrong,
    color: palette.blueDark,
    fontVariant: ['tabular-nums'],
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sliderBound: {
    ...typography.caption,
    color: palette.inkFaint,
  },
  sliderHint: {
    ...typography.caption,
    color: palette.inkFaint,
    flexShrink: 1,
    textAlign: 'center',
    fontWeight: '500',
  },
  readoutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  readoutCard: {
    flexGrow: 1,
    flexBasis: '30%',
    minWidth: 140,
    backgroundColor: palette.canvas,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 2,
  },
  readoutLabel: {
    ...typography.caption,
    color: palette.inkMuted,
  },
  readoutValue: {
    ...typography.heading,
    color: palette.ink,
    fontVariant: ['tabular-nums'],
  },
  readoutCaption: {
    ...typography.caption,
    color: palette.inkFaint,
    fontWeight: '500',
  },
  objective: {
    backgroundColor: palette.goldSoft,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  objectiveHeading: {
    ...typography.overline,
    color: palette.goldDark,
    textTransform: 'uppercase',
  },
  objectiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: palette.goldDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: palette.goldDark,
  },
  checkboxGlyph: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  objectiveText: {
    ...typography.body,
    color: palette.ink,
    flex: 1,
  },
  objectiveTextDone: {
    color: palette.goldDark,
    fontWeight: '700',
  },
});
