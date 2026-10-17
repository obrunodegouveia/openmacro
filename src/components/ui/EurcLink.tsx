/**
 * ============================================================================
 * EURC link
 * ============================================================================
 *
 * A link from Today to the learner's earnings on the website, where points
 * become EURC (see docs/rewards.md → "Earnings"). The exchange itself stays on
 * the website; this only opens it in Safari.
 *
 * Who sees it is decided by the server, not by the app: it asks
 * `/api/earnings` with the signed-in account's token and shows the link only
 * when that account is an active earnings recipient. No names or emails are
 * written here, and everyone else sees nothing.
 *
 * Known risk, accepted by the owner on 2026-10-17: App Store guideline
 * 3.1.5(v) bars cryptocurrency for completing tasks, and 2.3.1 bars features
 * hidden from review. If a review objects, remove this component from Today.
 */

import { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text } from 'react-native';

import { Chevron } from '@/components/ui/CourseRows';
import { useAuth } from '@/providers/AuthProvider';
import { useLocale } from '@/providers/LocaleProvider';
import { palette, radius, spacing, typography } from '@/theme/tokens';

const SITE = 'https://openmacro.org';

export function EurcLink() {
  const { session } = useAuth();
  const { t, locale } = useLocale();
  const [enrolled, setEnrolled] = useState(false);

  const token = session?.access_token ?? null;

  useEffect(() => {
    if (!token) {
      setEnrolled(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch(`${SITE}/api/earnings`, {
          headers: { authorization: `Bearer ${token}` },
        });
        const result = (await response.json()) as { earnings?: unknown };
        if (!cancelled) setEnrolled(response.ok && Boolean(result.earnings));
      } catch {
        // Offline or the site is down: no link, rather than a broken one.
        if (!cancelled) setEnrolled(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!enrolled) return null;

  const url = `${SITE}${locale === 'pt-PT' ? '/pt' : ''}/dashboard`;

  return (
    <Pressable
      onPress={() => void Linking.openURL(url)}
      accessibilityRole="link"
      accessibilityLabel={t('eurc.label')}
      accessibilityHint={t('eurc.hint')}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Text style={styles.icon} allowFontScaling={false}>✨</Text>
      <Text style={styles.label}>{t('eurc.label')}</Text>
      <Chevron />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  pressed: { opacity: 0.7 },
  icon: { fontSize: 28 },
  label: { ...typography.bodyStrong, color: palette.ink, flex: 1 },
});
