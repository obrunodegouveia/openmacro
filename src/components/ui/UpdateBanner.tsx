/**
 * "New lessons are ready" — shown on the learning path, never in a lesson.
 *
 * Deliberately a quiet strip rather than a modal. Nothing is wrong, nothing is
 * urgent, and interrupting someone to tell them their course got better is a
 * strange way to treat them. It also disappears on its own once applied,
 * because a restart is the only outcome.
 */

import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useContentUpdate } from '@/providers/ContentUpdateProvider';
import { useLocale } from '@/providers/LocaleProvider';
import { palette, radius, spacing, typography } from '@/theme/tokens';

export function UpdateBanner() {
  const { ready, applying, apply } = useContentUpdate();
  const { t } = useLocale();
  if (!ready) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{t('update.ready')}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('update.restartA11y')}
        accessibilityState={{ disabled: applying, busy: applying }}
        disabled={applying}
        hitSlop={8}
        onPress={() => void apply()}
      >
        {applying ? (
          <ActivityIndicator color={palette.mintDark} />
        ) : (
          <Text style={styles.action}>{t('update.restart')}</Text>
        )}
      </Pressable>
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
    backgroundColor: palette.mintSoft,
  },
  text: {
    ...typography.body,
    color: palette.ink,
    flexShrink: 1,
  },
  action: {
    ...typography.bodyStrong,
    color: palette.mintDark,
  },
});
