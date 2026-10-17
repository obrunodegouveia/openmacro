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
        onPress={() => void apply()}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
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
    // Less than the other banners, because the 44pt button sets the height.
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: palette.mintSoft,
  },
  text: {
    ...typography.body,
    color: palette.ink,
    flexShrink: 1,
  },
  button: { minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.6 },
  action: {
    ...typography.bodyStrong,
    color: palette.mintDark,
  },
});
