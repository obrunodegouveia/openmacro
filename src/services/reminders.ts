/**
 * ============================================================================
 * Daily streak reminder
 * ============================================================================
 *
 * One optional local notification a day, at a time the learner picks, on the
 * days they have not done a lesson yet. Off until they switch it on; nothing
 * is sent to a server, and nothing is scheduled without their permission.
 *
 * Why one-off dates rather than a repeating daily trigger: a repeating
 * trigger fires on the days the streak is already kept too, which is the
 * reminder people learn to swipe away. So the next fourteen days are
 * scheduled as single notifications, today's is dropped once a lesson is
 * done, and the set is rebuilt whenever the streak, the language or the
 * setting changes and whenever the app comes back to the foreground. Fourteen
 * stays far below the 64 pending notifications iOS allows an app, and someone
 * who does not open the app for two weeks stops being reminded, which is the
 * polite way for a reminder to end.
 *
 * Only notifications this module created are ever cancelled: they carry an
 * identifier prefix, so anything else the app schedules later is left alone.
 *
 * A module-level store with `useSyncExternalStore`, like `videoPreference`,
 * because the Profile switch and the root scheduler are not under a common
 * provider.
 */

import { useSyncExternalStore } from 'react';
import * as Notifications from 'expo-notifications';

import { readVersioned, writeVersioned } from '@/services/localStore';

const STORAGE_KEY = 'openmacro.streakReminder.v1';
const STORAGE_VERSION = 1;
const ID_PREFIX = 'streak-reminder-';
const DAYS_AHEAD = 14;

/** The times offered, as hour and minute. A short list beats a time picker. */
export const REMINDER_TIMES = [
  { hour: 8, minute: 0 },
  { hour: 12, minute: 30 },
  { hour: 19, minute: 0 },
  { hour: 21, minute: 0 },
] as const;

export interface ReminderSetting {
  enabled: boolean;
  hour: number;
  minute: number;
}

const DEFAULT_SETTING: ReminderSetting = { enabled: false, hour: 19, minute: 0 };

function isSetting(value: unknown): value is ReminderSetting {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as ReminderSetting;
  return (
    typeof v.enabled === 'boolean' &&
    Number.isInteger(v.hour) &&
    v.hour >= 0 &&
    v.hour < 24 &&
    Number.isInteger(v.minute) &&
    v.minute >= 0 &&
    v.minute < 60
  );
}

let setting: ReminderSetting = DEFAULT_SETTING;
/**
 * The snapshot React reads. Replaced, never mutated, on every change, and it
 * carries `hydrated`: with nothing stored, hydration leaves `setting` as it
 * was, and a snapshot of `setting` alone would never tell React it finished.
 */
let snapshot: ReminderSetting & { hydrated: boolean } = { ...DEFAULT_SETTING, hydrated: false };
const listeners = new Set<() => void>();

function emit(hydrated = snapshot.hydrated): void {
  snapshot = { ...setting, hydrated };
  for (const listener of listeners) listener();
}

async function hydrate(): Promise<void> {
  const stored = await readVersioned(STORAGE_KEY, STORAGE_VERSION, isSetting);
  if (stored) setting = stored;
  emit(true);
}
void hydrate();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * The current setting, and whether it has been read from storage yet. The
 * scheduler waits for `hydrated` so it never cancels a learner's reminders on
 * the strength of the default.
 */
export function useReminderSetting(): ReminderSetting & { hydrated: boolean } {
  return useSyncExternalStore(subscribe, () => snapshot);
}

async function save(next: ReminderSetting): Promise<void> {
  setting = next;
  emit();
  await writeVersioned(STORAGE_KEY, STORAGE_VERSION, next);
}

/**
 * Switch the reminder on, asking for permission first.
 *
 * @return `'enabled'`, or `'denied'` when the system said no. A denial leaves
 *   the setting off, so the switch does not claim something that cannot happen.
 */
export async function enableReminder(): Promise<'enabled' | 'denied'> {
  try {
    const { ios, granted } = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowSound: true, allowBadge: false },
    });
    const allowed =
      granted ||
      ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED ||
      ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
    if (!allowed) return 'denied';
  } catch {
    return 'denied';
  }
  await save({ ...setting, enabled: true });
  return 'enabled';
}

/** Switch the reminder off and remove every reminder already scheduled. */
export async function disableReminder(): Promise<void> {
  await save({ ...setting, enabled: false });
  await cancelReminders();
}

/** Change the time of day. Rescheduling follows through the scheduler. */
export async function setReminderTime(hour: number, minute: number): Promise<void> {
  await save({ ...setting, hour, minute });
}

async function cancelReminders(): Promise<void> {
  try {
    const pending = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
      pending
        .filter((request) => request.identifier.startsWith(ID_PREFIX))
        .map((request) => Notifications.cancelScheduledNotificationAsync(request.identifier)),
    );
  } catch {
    // Nothing scheduled, or notifications unavailable: nothing to cancel.
  }
}

/**
 * Rebuild the scheduled reminders from the current state.
 *
 * @param input.keptToday Whether a lesson was finished today; if so, today's
 *   reminder is skipped.
 * @param input.content   The title and body to show, already in the learner's
 *   language, which is why a language change reschedules too.
 */
export async function rescheduleReminders(input: {
  keptToday: boolean;
  content: { title: string; body: string };
}): Promise<void> {
  await cancelReminders();
  if (!setting.enabled) return;

  const now = new Date();
  for (let day = 0; day < DAYS_AHEAD; day += 1) {
    const at = new Date(now);
    at.setDate(now.getDate() + day);
    at.setHours(setting.hour, setting.minute, 0, 0);
    if (day === 0 && (input.keptToday || at.getTime() <= now.getTime())) continue;
    try {
      await Notifications.scheduleNotificationAsync({
        identifier: `${ID_PREFIX}${day}`,
        content: { title: input.content.title, body: input.content.body },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at },
      });
    } catch {
      // A reminder that cannot be scheduled is not worth failing anything for.
      return;
    }
  }
}
