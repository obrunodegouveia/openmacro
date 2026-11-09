/**
 * Keeps the scheduled reminders in step with the learner.
 *
 * Mounted once, under the progress provider. Rebuilds the plan when the app
 * opens or returns to the foreground, when the streak changes (a lesson was
 * finished), when the language changes, and when the reminder choice changes.
 * See `src/services/reminders.ts`.
 */

import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useLocale } from '@/providers/LocaleProvider';
import { useProgress } from '@/providers/ProgressProvider';
import { remindersSupported, syncReminders, useReminderChoice } from '@/services/reminders';

export function useReminderSchedule(): void {
  const { t } = useLocale();
  const { profile } = useProgress();
  const choice = useReminderChoice();

  const streak = profile?.dayStreak;
  const activeToday = profile?.streakActiveToday;
  const lastActiveOn = profile?.lastActiveOn;

  useEffect(() => {
    if (!remindersSupported || !profile) return;
    void syncReminders(profile, t);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void syncReminders(profile, t);
    });
    return () => subscription.remove();
    // `profile` is a new object on every XP change; only these fields change the plan.
  }, [streak, activeToday, lastActiveOn, t, choice.enabled, choice.time.hour, choice.time.minute]);
}

/** Renders nothing; exists so the hook can sit inside the providers it reads. */
export function ReminderSchedule(): null {
  useReminderSchedule();
  return null;
}
