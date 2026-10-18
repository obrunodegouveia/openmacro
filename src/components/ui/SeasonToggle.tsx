/**
 * The seasonal look switch, in Profile: On, Calm or Off.
 *
 * Only there while a season is on the calendar, because a switch about
 * nothing is clutter; turned off, it stays, so the learner can turn it back
 * on. A segmented control like the language picker beside it, for the same
 * reasons (see `LanguagePicker`).
 *
 * Decorations follow the choice at once. The colours were painted at launch,
 * so when they are now out of date the row says so and offers a restart,
 * rather than leaving a learner to wonder why the screen is still orange.
 */

import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import type { SeasonPreference } from '@openmacro/seasons';

import { SeasonalBurst } from '@/components/ui/SeasonalDecor';
import { emitFeedback } from '@/feedback';
import { useLocale } from '@/providers/LocaleProvider';
import { restartForSeason, useSeasonSettings } from '@/seasons';
import { palette, radius, spacing, typography } from '@/theme/tokens';

const OPTIONS: readonly SeasonPreference[] = ['auto', 'calm', 'off'];

/** The selection's slide from one option to the next: quick, with a little settle. */
const SLIDE = { damping: 18, stiffness: 220, mass: 0.8 } as const;

/**
 * The switch. The selection slides between the options on a spring, and the
 * notes below it fade in and out, so a change of look is felt as well as
 * seen; the decorations themselves fade in and out where they hang. Turning
 * the season on throws a burst of it out of the switch, with a cheer.
 *
 * @return The switch, or nothing while no season is on the calendar.
 */
export function SeasonToggle() {
  const { t } = useLocale();
  const { available, preference, setPreference, needsRestart } = useSeasonSettings();
  const [width, setWidth] = useState(0);
  const index = OPTIONS.indexOf(preference);
  const slot = width > 0 ? (width - spacing.xs * 2 - spacing.xs * (OPTIONS.length - 1)) / OPTIONS.length : 0;
  const x = useSharedValue(0);
  const placed = useRef(false);
  // Counts each time the season is turned on, so every one gets a burst.
  const [cheer, setCheer] = useState(0);

  const choose = (option: SeasonPreference) => {
    if (option === 'auto' && preference !== 'auto') {
      setCheer((n) => n + 1);
      emitFeedback('complete');
    }
    setPreference(option);
  };

  useEffect(() => {
    if (slot === 0) return;
    const target = index * (slot + spacing.xs);
    // The first placement jumps; every change after it slides.
    x.value = placed.current ? withSpring(target, SLIDE) : target;
    placed.current = true;
  }, [index, slot, x]);

  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  if (!available) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.text}>
        <Text style={styles.label}>{t('season.settings.label')}</Text>
        <Text style={styles.hint}>
          {t('season.settings.hint', { season: t(`season.${available}.name`) })}
        </Text>
      </View>

      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={t('season.settings.label')}
        style={styles.track}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      >
        {slot > 0 ? <Animated.View pointerEvents="none" style={[styles.thumb, { width: slot }, thumb]} /> : null}
        {OPTIONS.map((option) => {
          const selected = option === preference;
          return (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityHint={option === 'calm' ? t('season.mode.calmHint') : undefined}
              onPress={() => choose(option)}
              // Before the track is measured, the selected option draws its own
              // thumb; after, the sliding one does.
              style={({ pressed }) => [styles.option, selected && slot === 0 && styles.optionSelected, pressed && !selected && styles.optionPressed]}
            >
              <Text numberOfLines={1} style={[styles.optionText, selected && styles.optionTextSelected]}>
                {t(`season.mode.${option}`)}
              </Text>
            </Pressable>
          );
        })}
        {/* Out of the "On" option, which sits first. */}
        {cheer > 0 && slot > 0 ? (
          <View pointerEvents="none" style={[styles.cheer, { left: spacing.xs + slot / 2 }]}>
            <SeasonalBurst key={cheer} />
          </View>
        ) : null}
      </View>

      {preference === 'calm' ? (
        <Animated.Text entering={FadeIn.duration(250)} exiting={FadeOut.duration(150)} style={styles.note}>
          {t('season.mode.calmHint')}
        </Animated.Text>
      ) : null}

      {needsRestart ? (
        <Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(150)} layout={LinearTransition} style={styles.restart}>
          <Text style={[styles.note, styles.restartText]}>{t('season.restart.body')}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={restartForSeason}
            hitSlop={8}
            style={({ pressed }) => [styles.restartButton, pressed && styles.optionPressed]}
          >
            <Text style={styles.restartLabel}>{t('season.restart.action')}</Text>
          </Pressable>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // A card like its neighbours in Profile (language, music). It draws its own,
  // because outside a season it renders nothing and an empty card would remain.
  wrap: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  text: { gap: 2 },
  label: { ...typography.bodyStrong, color: palette.ink },
  hint: { ...typography.caption, color: palette.inkMuted, fontWeight: '500' },
  track: {
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: palette.canvas,
    borderWidth: 1,
    borderColor: palette.border,
  },
  option: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  cheer: { position: 'absolute', top: '50%', width: 0, height: 0 },
  thumb: {
    position: 'absolute',
    top: spacing.xs,
    bottom: spacing.xs,
    left: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.borderStrong,
    shadowColor: palette.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  optionSelected: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.borderStrong,
    shadowColor: palette.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  optionPressed: { backgroundColor: palette.border },
  optionText: { ...typography.caption, color: palette.inkMuted },
  optionTextSelected: { color: palette.ink, fontWeight: '800' },
  note: { ...typography.caption, color: palette.inkFaint, fontWeight: '500', lineHeight: 18 },
  restart: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  restartText: { flex: 1 },
  restartButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: palette.blueSoft,
  },
  restartLabel: { ...typography.caption, fontWeight: '800', color: palette.blueDark },
});
