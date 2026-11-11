/**
 * ============================================================================
 * Bounty card
 * ============================================================================
 *
 * Tells every learner on Today about the 21,000 sats bounty (see
 * docs/bounty-exam.md) and opens its rules on the website. The bounty itself
 * is decided by the database and paid by hand by the organiser; this card
 * only announces it. The website's dashboard shows the same words
 * (web/src/components/app/bounty-card.tsx).
 *
 * When the bounty ends, remove this card and the website's together.
 *
 * Known risk, as with EurcLink: App Store guideline 3.1.5(v) bars
 * cryptocurrency for completing tasks. If a review objects, remove it.
 */

import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { localeSegment } from '@openmacro/core/content/links';

import { Chevron } from '@/components/ui/CourseRows';
import { useLocale } from '@/providers/LocaleProvider';
import { palette, radius, spacing, typography } from '@/theme/tokens';

const SITE = 'https://openmacro.org';

export function BountyCard() {
  const { t, locale } = useLocale();
  const url = `${SITE}${localeSegment(locale)}/bounty`;

  return (
    <Pressable
      onPress={() => void Linking.openURL(url)}
      accessibilityRole="link"
      accessibilityLabel={t('bounty.card.title')}
      accessibilityHint={t('bounty.card.hint')}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.icon}>
        <Text style={styles.iconText} allowFontScaling={false}>₿</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.eyebrow}>{t('bounty.card.eyebrow')}</Text>
        <Text style={styles.title}>{t('bounty.card.title')}</Text>
        <Text style={styles.text}>{t('bounty.card.body')}</Text>
      </View>
      <Chevron />
    </Pressable>
  );
}

const BITCOIN = '#F7931A';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: BITCOIN,
    backgroundColor: palette.surface,
  },
  pressed: { opacity: 0.7 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BITCOIN,
  },
  iconText: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  body: { flex: 1, gap: 2 },
  eyebrow: { ...typography.overline, color: palette.ink, textTransform: 'uppercase' },
  title: { ...typography.bodyStrong, color: palette.ink },
  text: { ...typography.caption, color: palette.inkMuted },
});
