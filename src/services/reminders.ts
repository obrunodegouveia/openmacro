/**
 * ============================================================================
 * Daily reminders — the learner's choice, the permission, and the schedule
 * ============================================================================
 *
 * What to schedule and what each reminder says is decided in
 * `packages/core/src/progress/reminders.ts`; this file only stores the choice
 * and hands the plan to the operating system. See that file for why the plan
 * is a week of one-off notifications rebuilt on every launch, not one
 * repeating alarm.
 *
 * Everything is local. No push token is requested and nothing leaves the
 * phone: the operating system holds the schedule, and the app rebuilds it.
 *
 * Off by default. The switch asks for permission when it is turned on, never
 * at launch: a permission prompt before the learner knows what the app is for
 * is the one most often refused, and iOS will not show it twice.
 *
 * Not on the web export, where `expo-notifications` has no implementation;
 * `remindersSupported` hides the switch there.
 */

import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import type { Translator } from '@openmacro/core/i18n';
import type { LearnerProfile } from '@openmacro/core/progress/types';
import { localDateKey, reconcileProfile } from '@openmacro/core/progress/rules';
import {
  DEFAULT_REMINDER_TIME,
  isReminderTime,
  planReminders,
  type PlannedReminder,
  type ReminderTime,
} from '@openmacro/core/progress/reminders';
import { readVersioned, writeVersioned } from '@/services/localStore';

/** False on the web export, where there is nothing to schedule with. */
export const remindersSupported = Platform.OS === 'ios' || Platform.OS === 'android';

const STORAGE_KEY = 'openmacro.reminders.v1';
const STORAGE_VERSION = 1;

/** Prefix of every identifier this file schedules, so a rebuild cancels only its own. */
const ID_PREFIX = 'openmacro.reminder.';

/** The Android channel. Its name is what the learner sees in system settings. */
const CHANNEL_ID = 'daily-reminders';

export interface ReminderChoice {
  enabled: boolean;
  time: ReminderTime;
}

function isReminderChoice(value: unknown): value is ReminderChoice {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as ReminderChoice).enabled === 'boolean' &&
    isReminderTime((value as ReminderChoice).time)
  );
}

// ---------------------------------------------------------------------------
// The choice, shared by the switch and the scheduler
// ---------------------------------------------------------------------------

let choice: ReminderChoice = { enabled: false, time: DEFAULT_REMINDER_TIME };
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

async function hydrate(): Promise<void> {
  const stored = await readVersioned(STORAGE_KEY, STORAGE_VERSION, isReminderChoice);
  if (stored) {
    choice = stored;
    emit();
  }
}

// At import, like the video preferences: the scheduler runs at launch and
// should see the saved choice, not the default, on its first pass.
if (remindersSupported) void hydrate();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getChoice(): ReminderChoice {
  return choice;
}

/** Change the choice. Persisted; failure to persist is survivable. */
export function setReminderChoice(next: ReminderChoice): void {
  choice = next;
  emit();
  writeVersioned(STORAGE_KEY, STORAGE_VERSION, next).catch(() => {});
}

/** The current choice, re-rendering when it changes. */
export function useReminderChoice(): ReminderChoice {
  return useSyncExternalStore(subscribe, getChoice, getChoice);
}

// ---------------------------------------------------------------------------
// Permission
// ---------------------------------------------------------------------------

export type ReminderPermission = 'granted' | 'undetermined' | 'denied';

function permissionOf(settings: Notifications.NotificationPermissionsStatus): ReminderPermission {
  if (settings.granted) return 'granted';
  // Provisional (quiet, in Notification Centre only) is still a yes on iOS.
  if (settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) return 'granted';
  return settings.canAskAgain ? 'undetermined' : 'denied';
}

/**
 * Creates the Android channel. On Android 13 the permission prompt does not
 * appear until a channel exists, so this runs before every request.
 */
async function ensureChannel(name: string): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name,
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

/** Where the permission stands, without asking. */
export async function reminderPermission(): Promise<ReminderPermission> {
  if (!remindersSupported) return 'denied';
  try {
    return permissionOf(await Notifications.getPermissionsAsync());
  } catch {
    return 'denied';
  }
}

/**
 * Asks for permission if it has not been refused for good.
 *
 * @param t For the Android channel's name.
 * @return Where the permission stands afterwards.
 */
export async function requestReminderPermission(t: Translator): Promise<ReminderPermission> {
  if (!remindersSupported) return 'denied';
  try {
    await ensureChannel(t('reminders.label'));
    const current = permissionOf(await Notifications.getPermissionsAsync());
    if (current !== 'undetermined') return current;
    return permissionOf(
      await Notifications.requestPermissionsAsync({
        ios: { allowAlert: true, allowSound: true, allowBadge: false },
      }),
    );
  } catch {
    return 'denied';
  }
}

// ---------------------------------------------------------------------------
// The schedule
// ---------------------------------------------------------------------------

// The app is open, so a reminder that fires now has nothing to add. Without a
// handler a foreground notification is dropped anyway; this says so on purpose.
if (remindersSupported) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: false,
      shouldShowList: false,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/**
 * The title and body of one planned reminder, in the learner's language.
 *
 * @param reminder From `planReminders`.
 * @param t The current translator.
 * @return Notification content.
 */
export function reminderContent(reminder: PlannedReminder, t: Translator): { title: string; body: string } {
  const values = { count: reminder.streak };
  switch (reminder.kind) {
    case 'save-streak':
      return { title: t('reminders.push.saveStreak.title', values), body: t('reminders.push.saveStreak.body') };
    case 'keep-streak':
      return { title: t('reminders.push.keepStreak.title', values), body: t('reminders.push.keepStreak.body') };
    case 'daily':
      return { title: t('reminders.push.daily.title'), body: t('reminders.push.daily.body') };
    case 'comeback':
      return { title: t('reminders.push.comeback.title'), body: t('reminders.push.comeback.body') };
    case 'last':
      return { title: t('reminders.push.last.title'), body: t('reminders.push.last.body') };
  }
}

let queue: Promise<void> = Promise.resolve();

/**
 * Throws away the scheduled reminders and schedules a fresh plan.
 *
 * Calls are queued, not run side by side: a launch and a finished lesson can
 * ask within the same second, and two rebuilds interleaving would leave both
 * plans scheduled — two notifications a day.
 *
 * Never asks for permission. If it has been withdrawn in system settings, the
 * old plan is cleared and nothing new is scheduled.
 *
 * @param profile The learner's profile; reconciled to today here.
 * @param t The current translator, so reminders are in the current language.
 * @return Resolves when the rebuild is done; never rejects.
 */
export function syncReminders(profile: LearnerProfile | null, t: Translator): Promise<void> {
  if (!remindersSupported) return Promise.resolve();
  const { enabled, time } = choice;
  queue = queue.then(async () => {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      await Promise.all(
        scheduled
          .filter((request) => request.identifier.startsWith(ID_PREFIX))
          .map((request) => Notifications.cancelScheduledNotificationAsync(request.identifier)),
      );
      if (!enabled || (await reminderPermission()) !== 'granted') return;

      await ensureChannel(t('reminders.label'));
      const now = new Date();
      // The stored profile can be from yesterday: "already practised today"
      // must mean today, or the first reminder would be skipped for nothing.
      const today = profile ? reconcileProfile(profile, localDateKey(now)) : null;
      const plan = planReminders({
        now,
        time,
        dayStreak: today?.dayStreak ?? 0,
        streakActiveToday: today?.streakActiveToday ?? false,
      });

      for (const reminder of plan) {
        await Notifications.scheduleNotificationAsync({
          identifier: `${ID_PREFIX}${localDateKey(reminder.at)}`,
          content: { ...reminderContent(reminder, t), sound: 'default' },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: reminder.at,
            channelId: CHANNEL_ID,
          },
        });
      }
      if (__DEV__) console.log('[reminders] scheduled', plan.map((r) => `${r.at.toString()} ${r.kind}`));
    } catch (error) {
      // A reminder is a nicety. Failing to schedule one must never surface.
      if (__DEV__) console.warn('[reminders] could not schedule', error);
    }
  });
  return queue;
}

/**
 * A time of day as the learner's language writes it: "19:00", or "7:00 PM".
 *
 * @param time The time.
 * @param locale A BCP 47 tag.
 * @return The formatted time.
 */
export function formatReminderTime(time: ReminderTime, locale: string): string {
  const date = new Date(2000, 0, 1, time.hour, time.minute);
  try {
    return date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' });
  } catch {
    return `${time.hour}:${String(time.minute).padStart(2, '0')}`;
  }
}
