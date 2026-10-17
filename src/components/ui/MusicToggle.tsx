/**
 * The background music switch, in Profile. See `src/feedback/music.ts`.
 */

import { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { isMusicEnabled, setMusicEnabled, subscribeMusic } from '@/feedback/music';
import { useLocale } from '@/providers/LocaleProvider';
import { palette, spacing, typography } from '@/theme/tokens';

export function MusicToggle() {
  const { t } = useLocale();
  const [on, setOn] = useState(isMusicEnabled);

  // The saved choice is read at boot and may land after this first renders.
  useEffect(() => subscribeMusic(setOn), []);

  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text style={styles.label}>{t('music.label')}</Text>
        <Text style={styles.hint}>{t('music.hint')}</Text>
      </View>
      <Switch
        value={on}
        onValueChange={setMusicEnabled}
        trackColor={{ true: palette.mint }}
        accessibilityLabel={t('music.label')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 44 },
  text: { flex: 1, gap: 2 },
  label: { ...typography.bodyStrong, color: palette.ink },
  hint: { ...typography.caption, color: palette.inkMuted, fontWeight: '500' },
});
