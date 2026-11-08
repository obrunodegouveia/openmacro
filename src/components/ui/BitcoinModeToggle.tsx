/**
 * The Bitcoin mode switch, in Profile with the other settings.
 * See `src/services/bitcoinMode.ts`; the website draws the same card in
 * web/src/components/app/bitcoin-mode-switch.tsx.
 */

import { StyleSheet, Switch, Text, View } from 'react-native';

import { BITCOIN_MODE_MODULES, OPTIONAL_MODULES } from '@openmacro/core/content/optional';
import { useLocale } from '@/providers/LocaleProvider';
import { useBitcoinMode } from '@/services/bitcoinMode';
import { palette, radius, spacing, typography } from '@/theme/tokens';

/** Lessons Bitcoin mode adds, for the hint. */
const LESSONS = OPTIONAL_MODULES.filter((module) => BITCOIN_MODE_MODULES.includes(module.id)).reduce(
  (sum, module) => sum + module.lessons.length,
  0,
);

export function BitcoinModeToggle() {
  const { t } = useLocale();
  const [on, setOn] = useBitcoinMode();

  return (
    <View style={[styles.card, on && styles.cardOn]}>
      <View style={[styles.badge, on && styles.badgeOn]}>
        <Text style={styles.symbol} accessibilityElementsHidden importantForAccessibility="no">
          ₿
        </Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.label}>{t('bitcoin.label')}</Text>
        <Text style={styles.hint}>{t('bitcoin.hint', { count: LESSONS })}</Text>
      </View>
      <Switch
        value={on}
        onValueChange={setOn}
        trackColor={{ true: palette.mint }}
        accessibilityLabel={t('bitcoin.label')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  cardOn: { borderColor: palette.mint },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.canvas,
    borderWidth: 1,
    borderColor: palette.border,
  },
  badgeOn: { borderColor: palette.mint },
  symbol: { fontSize: 36, fontWeight: '800', color: palette.ink },
  text: { flex: 1, gap: 2 },
  label: { ...typography.bodyStrong, color: palette.ink },
  hint: { ...typography.caption, color: palette.inkMuted, fontWeight: '500' },
});
