/**
 * ============================================================================
 * Choose the language the course is in
 * ============================================================================
 *
 * Lives in the Account tab. It spent its first life at the foot of the learning
 * path, on the reasoning that a settings screen built to hold one two-item
 * control would be the wrong thing to build — which was true until there was a
 * tab bar, and then it meant a learner had to scroll the entire course to
 * discover the course was available in their language.
 *
 * Two deliberate details:
 *
 * • Language names are never translated. "Português" reads as Português in
 *   every language, and a picker whose options are written in a language you
 *   cannot read is exactly useless to the person who needs it.
 *
 * • The honesty line under it only appears for a partially translated
 *   language. Half a screen in Portuguese and half in English looks like a bug
 *   unless somebody says otherwise — and saying so costs one sentence and turns
 *   a defect into a known state.
 *
 * ---------------------------------------------------------------------------
 * WHY A SEGMENTED CONTROL RATHER THAN TWO PILLS
 * ---------------------------------------------------------------------------
 *
 * It was two centred pills, each sized to its own text, so "English" and
 * "Português" were visibly different widths and the pair sat off-centre against
 * everything else on the screen. Two problems with that, beyond the untidiness.
 *
 * A row of same-shaped pills does not say "pick one of these" — it reads as two
 * unrelated buttons, and which one is currently active is carried entirely by a
 * colour difference. A segmented control is the iOS idiom for a small exclusive
 * choice precisely because the enclosing track is what communicates "these are
 * the options, and one of them is on".
 *
 * And equal halves mean the target is half the row wide whatever the label
 * says, rather than however wide that particular word happens to be. Adding a
 * third language does not reflow the first two into something narrower than a
 * thumb.
 *
 * The group carries `radiogroup`, which is what lets a screen reader announce
 * "2 of 2" rather than reading two unrelated radios.
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

      <View accessibilityRole="radiogroup" style={styles.track}>
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
                pressed && !selected && styles.optionPressed,
              ]}
            >
              <Text
                numberOfLines={1}
                style={[styles.optionText, selected && styles.optionTextSelected]}
              >
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
    gap: spacing.sm,
  },
  label: {
    ...typography.overline,
    color: palette.inkFaint,
    textTransform: 'uppercase',
  },
  /**
   * The enclosing track. Inset on `canvas` so the selected segment can be
   * `surface` and read as sitting on top of it — the same figure/ground the
   * platform control uses, and the reason it does not need a border per option.
   */
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
    // Equal halves whatever the label says, and 44 tall — the smallest target
    // Apple's guidance allows.
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  optionSelected: {
    backgroundColor: palette.surface,
    // A hairline plus a soft shadow, rather than a fill colour: the selected
    // segment should look raised, not highlighted.
    borderWidth: 1,
    borderColor: palette.borderStrong,
    shadowColor: '#1F2933',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  optionPressed: {
    backgroundColor: palette.border,
  },
  optionText: {
    ...typography.caption,
    color: palette.inkMuted,
  },
  optionTextSelected: {
    color: palette.ink,
    fontWeight: '800',
  },
  note: {
    ...typography.caption,
    color: palette.inkFaint,
    fontWeight: '500',
    lineHeight: 18,
  },
});
