/**
 * Choose the language the course is in.
 *
 * Lives in the Account tab. It spent its first life at the foot of the
 * learning path, on the reasoning that a settings screen built to hold one
 * two-item control would be the wrong thing to build — which was true until
 * there was a tab bar, and then it meant a learner had to scroll the entire
 * course to discover the course was available in their language.
 *
 * Two deliberate details:
 *
 * • Language names are never translated. "Português" reads as Português in
 *   every language, and a picker whose options are written in a language you
 *   cannot read is exactly useless to the person who needs it.
 *
 * • The honesty line under it only appears for a partially translated
 *   language. Half a screen in Portuguese and half in English looks like a bug
 *   unless somebody says otherwise — and saying so costs one sentence and
 *   turns a defect into a known state.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useLocale } from '@/providers/LocaleProvider';
import { palette, radius, spacing, typography } from '@/theme/tokens';

export function LanguagePicker() {
  const { t, locale, setLocale, available, names, partial } = useLocale();

  // One language is not a choice.
  if (available.length < 2) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{t('language.label')}</Text>

      <View style={styles.row}>
        {available.map((candidate) => {
          const selected = candidate === locale;
          return (
            <Pressable
              key={candidate}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={t('language.choose', { name: names[candidate] })}
              onPress={() => setLocale(candidate)}
              style={({ pressed }) => [
                styles.option,
                selected && styles.optionSelected,
                pressed && styles.optionPressed,
              ]}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {names[candidate]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {partial ? <Text style={styles.note}>{t('language.partial')}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    ...typography.overline,
    color: palette.inkFaint,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  option: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  optionSelected: {
    borderColor: palette.blueDark,
    backgroundColor: palette.blueSoft,
  },
  optionPressed: {
    backgroundColor: palette.canvas,
  },
  optionText: {
    ...typography.caption,
    color: palette.inkMuted,
  },
  optionTextSelected: {
    color: palette.blueDark,
  },
  note: {
    ...typography.caption,
    color: palette.inkFaint,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.lg,
  },
});
