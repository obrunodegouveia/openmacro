/**
 * "You're not signed in" — shown on Today and above every lesson while
 * nobody is signed in.
 *
 * Progress made signed out is kept on this device only: it never reaches an
 * account, so it is not on other devices and cannot be rewarded. Learners
 * found that out after the fact, so it is said before and during the work.
 *
 * Renders nothing when this build has no accounts (no Supabase project), while
 * the stored session is still being restored, or once someone is signed in.
 */

import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/providers/AuthProvider';
import { useLocale } from '@/providers/LocaleProvider';
import { palette, radius, spacing, typography } from '@/theme/tokens';

/**
 * @param props.inLesson True above a lesson: one line and no button, since
 *   leaving to sign in would abandon the lesson.
 * @return The warning, or nothing when it does not apply.
 */
export function SignedOutWarning({ inLesson = false }: { inLesson?: boolean }) {
  const { enabled, loading, identity } = useAuth();
  const { t } = useLocale();
  if (!enabled || loading || identity) return null;

  return (
    <View style={[styles.wrap, inLesson && styles.wrapInLesson]} accessibilityRole="alert">
      <Text style={styles.text}>
        {inLesson ? t('signedOut.lesson') : t('signedOut.today')}
      </Text>
      {inLesson ? null : (
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.action}>{t('signedOut.signIn')}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: palette.goldSoft,
  },
  wrapInLesson: { marginTop: spacing.xs, marginBottom: 0, paddingVertical: spacing.sm },
  text: { ...typography.caption, fontWeight: '600', color: palette.ink, flexShrink: 1 },
  action: { ...typography.bodyStrong, color: palette.goldDark },
});
