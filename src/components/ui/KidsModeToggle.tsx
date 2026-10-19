/**
 * The kids mode switch, on the page of a module that has a kids path.
 * See `src/services/kidsMode.ts`.
 */

import { StyleSheet, Switch, Text, View } from 'react-native';

import { CharacterAvatar } from '@/components/ui/CharacterAvatar';
import { useLocale } from '@/providers/LocaleProvider';
import { useKidsMode } from '@/services/kidsMode';
import { palette, radius, spacing, typography } from '@/theme/tokens';

export interface KidsModeToggleProps {
  /** How many lessons the kids path has, for the hint. */
  lessons: number;
}

export function KidsModeToggle({ lessons }: KidsModeToggleProps) {
  const { t } = useLocale();
  const [on, setOn] = useKidsMode();

  return (
    <View style={[styles.card, on && styles.cardOn]}>
      <CharacterAvatar character="olivia" expression={on ? 'excited' : 'happy'} size={48} />
      <View style={styles.text}>
        <Text style={styles.label}>{t('kids.label')}</Text>
        <Text style={styles.hint}>{t('kids.hint', { count: lessons })}</Text>
      </View>
      <Switch
        value={on}
        onValueChange={setOn}
        trackColor={{ true: palette.mint }}
        accessibilityLabel={t('kids.label')}
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
  text: { flex: 1, gap: 2 },
  label: { ...typography.bodyStrong, color: palette.ink },
  hint: { ...typography.caption, color: palette.inkMuted, fontWeight: '500' },
});
