/**
 * The daily reminder switch, in Profile. See `src/services/reminders.ts`.
 *
 * Turning it on is the only thing that asks for notification permission. If
 * the permission has been refused for good, the switch stays off and the row
 * says where to change it instead of silently doing nothing.
 *
 * Renders nothing on the web export.
 */

import { useEffect, useState } from 'react';
import { AppState, Linking, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { REMINDER_TIMES, type ReminderTime } from '@openmacro/core/progress/reminders';
import { useLocale } from '@/providers/LocaleProvider';
import {
  formatReminderTime,
  reminderPermission,
  remindersSupported,
  requestReminderPermission,
  setReminderChoice,
  useReminderChoice,
  type ReminderPermission,
} from '@/services/reminders';
import { palette, radius, spacing, typography } from '@/theme/tokens';

function sameTime(a: ReminderTime, b: ReminderTime): boolean {
  return a.hour === b.hour && a.minute === b.minute;
}

export function ReminderToggle() {
  const { t, locale } = useLocale();
  const choice = useReminderChoice();
  const [permission, setPermission] = useState<ReminderPermission | null>(null);

  // Re-read on return from system settings, where it may have been changed.
  useEffect(() => {
    if (!remindersSupported) return;
    const read = () => void reminderPermission().then(setPermission);
    read();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') read();
    });
    return () => subscription.remove();
  }, []);

  if (!remindersSupported) return null;

  const blocked = permission === 'denied';
  const on = choice.enabled && !blocked;

  const toggle = async (next: boolean) => {
    if (!next) {
      setReminderChoice({ ...choice, enabled: false });
      return;
    }
    const result = await requestReminderPermission(t);
    setPermission(result);
    setReminderChoice({ ...choice, enabled: result === 'granted' });
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.text}>
          <Text style={styles.label}>{t('reminders.label')}</Text>
          <Text style={styles.hint}>{t('reminders.hint')}</Text>
        </View>
        <Switch
          value={on}
          onValueChange={(next) => void toggle(next)}
          trackColor={{ true: palette.mint }}
          accessibilityLabel={t('reminders.label')}
        />
      </View>

      {blocked ? (
        <View style={styles.blocked}>
          <Text style={styles.hint}>{t('reminders.denied')}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => void Linking.openSettings()}
            hitSlop={8}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text style={styles.link}>{t('reminders.openSettings')}</Text>
          </Pressable>
        </View>
      ) : null}

      {on ? (
        <View style={styles.times} accessibilityRole="radiogroup">
          {REMINDER_TIMES.map((time) => {
            const selected = sameTime(time, choice.time);
            const label = formatReminderTime(time, locale);
            return (
              <Pressable
                key={`${time.hour}:${time.minute}`}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={t('reminders.time', { time: label })}
                onPress={() => setReminderChoice({ ...choice, time })}
                style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.pressed]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // The same card as the other settings rows in Profile.
  card: {
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 44 },
  text: { flex: 1, gap: 2 },
  label: { ...typography.bodyStrong, color: palette.ink },
  hint: { ...typography.caption, color: palette.inkMuted, fontWeight: '500' },
  blocked: { gap: spacing.xs },
  link: { ...typography.bodyStrong, color: palette.mintDark },
  times: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  // Two by two: four 12-hour times ("12:30 PM") do not fit one row on a phone,
  // and three and one looks like a mistake.
  chip: {
    flexBasis: '45%',
    flexGrow: 1,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: { borderColor: palette.mint, backgroundColor: palette.mintSoft },
  chipText: { ...typography.bodyStrong, color: palette.ink },
  chipTextSelected: { color: palette.mintDark },
  pressed: { opacity: 0.6 },
});
