/**
 * The daily reminder switch on Profile, with a short choice of times.
 *
 * Asking for notification permission happens here, when the learner turns
 * the switch on, and never at launch: a permission prompt with no context is
 * the one most people refuse. If the system says no, the switch stays off and
 * the row says how to change it in Settings rather than pretending.
 */

import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { emitFeedback } from '@/feedback';
import { useLocale } from '@/providers/LocaleProvider';
import {
  disableReminder,
  enableReminder,
  REMINDER_TIMES,
  setReminderTime,
  useReminderSetting,
} from '@/services/reminders';
import { palette, radius, spacing, typography } from '@/theme/tokens';

export function ReminderSetting() {
  const { t, locale } = useLocale();
  const reminder = useReminderSetting();
  const [denied, setDenied] = useState(false);
  const [busy, setBusy] = useState(false);

  const label = (hour: number, minute: number) =>
    new Date(2000, 0, 1, hour, minute).toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    });

  async function toggle(next: boolean) {
    setBusy(true);
    try {
      if (next) {
        const result = await enableReminder(t('reminder.settingTitle'));
        setDenied(result === 'denied');
      } else {
        setDenied(false);
        await disableReminder();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.text}>
          <Text style={styles.title}>{t('reminder.settingTitle')}</Text>
          <Text style={styles.body}>{t('reminder.settingBody')}</Text>
        </View>
        <Switch
          testID="reminder-switch"
          value={reminder.enabled}
          onValueChange={(next) => void toggle(next)}
          disabled={busy || !reminder.hydrated}
          trackColor={{ true: palette.mint, false: palette.borderStrong }}
          accessibilityLabel={t('reminder.settingTitle')}
        />
      </View>

      {denied ? (
        <View style={styles.denied}>
          <Text style={styles.deniedText}>{t('reminder.denied')}</Text>
          <Pressable
            accessibilityRole="link"
            onPress={() => void Linking.openSettings()}
            hitSlop={8}
            style={styles.settingsLink}
          >
            <Text style={styles.settingsLinkText}>{t('reminder.openSettings')}</Text>
          </Pressable>
        </View>
      ) : null}

      {reminder.enabled ? (
        <View style={styles.times} accessibilityRole="radiogroup">
          {REMINDER_TIMES.map(({ hour, minute }) => {
            const selected = reminder.hour === hour && reminder.minute === minute;
            return (
              <Pressable
                key={`${hour}:${minute}`}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => {
                  emitFeedback('select');
                  void setReminderTime(hour, minute);
                }}
                style={[styles.time, selected && styles.timeSelected]}
              >
                <Text style={[styles.timeText, selected && styles.timeTextSelected]}>
                  {label(hour, minute)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  text: { flex: 1, gap: 2 },
  title: { ...typography.bodyStrong, color: palette.ink },
  body: { ...typography.caption, color: palette.inkMuted, fontWeight: '500' },
  denied: { gap: spacing.xs },
  deniedText: { ...typography.caption, color: palette.coralDark },
  settingsLink: { minHeight: 44, justifyContent: 'center' },
  settingsLinkText: { ...typography.bodyStrong, fontSize: 15, color: palette.blueDark },
  times: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  time: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  timeSelected: { borderColor: palette.mintDark, backgroundColor: palette.mintSoft },
  timeText: { ...typography.bodyStrong, fontSize: 15, color: palette.inkMuted },
  timeTextSelected: { color: palette.mintDark },
});
