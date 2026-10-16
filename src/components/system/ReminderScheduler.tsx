/**
 * Keeps the daily reminder in step with the learner, without rendering
 * anything.
 *
 * Reschedules when the streak changes (a lesson done today drops today's
 * reminder), when the language changes (the text is written at scheduling
 * time), when the setting changes, and when the app returns to the
 * foreground, since the fourteen days it schedules ahead are counted from
 * whenever it last ran. Waits for the stored setting before doing anything,
 * so a cold start never cancels reminders on the strength of the default.
 */

import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { useLocale } from '@/providers/LocaleProvider';
import { useProgress } from '@/providers/ProgressProvider';
import { rescheduleReminders, useReminderSetting } from '@/services/reminders';

export function ReminderScheduler(): null {
  const { profile } = useProgress();
  const { t, locale } = useLocale();
  const reminder = useReminderSetting();
  const [foregrounds, setForegrounds] = useState(0);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') setForegrounds((count) => count + 1);
    });
    return () => subscription.remove();
  }, []);

  const streak = profile?.dayStreak ?? 0;
  const keptToday = profile?.streakActiveToday ?? false;

  useEffect(() => {
    if (!reminder.hydrated) return;
    const content =
      streak > 0
        ? { title: t('reminder.title'), body: t('reminder.bodyStreak', { count: streak }) }
        : { title: t('reminder.titleStart'), body: t('reminder.body') };
    void rescheduleReminders({ keptToday, content });
  }, [
    reminder.hydrated,
    reminder.enabled,
    reminder.hour,
    reminder.minute,
    streak,
    keptToday,
    locale,
    foregrounds,
    t,
  ]);

  return null;
}
