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

import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { SeasonPreference } from '@openmacro/seasons';

import { useLocale } from '@/providers/LocaleProvider';
import { restartForSeason, useSeasonSettings } from '@/seasons';
import { palette, radius, spacing, typography } from '@/theme/tokens';

const OPTIONS: readonly SeasonPreference[] = ['auto', 'calm', 'off'];

export function SeasonToggle() {
  const { t } = useLocale();
  const { available, preference, setPreference, needsRestart } = useSeasonSettings();
  if (!available) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.text}>
        <Text style={styles.label}>{t('season.settings.label')}</Text>
        <Text style={styles.hint}>
          {t('season.settings.hint', { season: t(`season.${available}.name`) })}
        </Text>
      </View>

      <View accessibilityRole="radiogroup" accessibilityLabel={t('season.settings.label')} style={styles.track}>
        {OPTIONS.map((option) => {
          const selected = option === preference;
          return (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityHint={option === 'calm' ? t('season.mode.calmHint') : undefined}
              onPress={() => setPreference(option)}
              style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && !selected && styles.optionPressed]}
            >
              <Text numberOfLines={1} style={[styles.optionText, selected && styles.optionTextSelected]}>
                {t(`season.mode.${option}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {preference === 'calm' ? <Text style={styles.note}>{t('season.mode.calmHint')}</Text> : null}

      {needsRestart ? (
        <View style={styles.restart}>
          <Text style={[styles.note, styles.restartText]}>{t('season.restart.body')}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={restartForSeason}
            hitSlop={8}
            style={({ pressed }) => [styles.restartButton, pressed && styles.optionPressed]}
          >
            <Text style={styles.restartLabel}>{t('season.restart.action')}</Text>
          </Pressable>
        </View>
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
