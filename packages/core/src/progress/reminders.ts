/**
 * ============================================================================
 * Daily reminders — which ones to schedule, and what each should say
 * ============================================================================
 *
 * A local notification is written when it is scheduled, not when it fires, so
 * it cannot look at the learner's progress at 19:00 and decide whether to
 * speak. A single repeating alarm would therefore say the same thing every day:
 * it would nag someone who practised at lunch, and could never say "your
 * 12-day streak ends at midnight", because by the time it fires it does not
 * know there is a streak.
 *
 * So the app schedules the next few days as separate one-off reminders and
 * throws the whole plan away and rebuilds it every time it opens and every
 * time a lesson ends. Each reminder is written for the world it will fire into
 * *if the learner does nothing else before then*, which is exactly the case in
 * which it fires: any lesson in between rebuilds the plan.
 *
 * That gives three behaviours for free:
 *
 *   - today is skipped once the streak has been kept today;
 *   - the first reminder can name the streak it is protecting;
 *   - the plan runs out. Someone who has not opened the app for a week gets
 *     one last reminder saying it is the last, and then silence, rather than a
 *     daily notification from an app they have stopped using — the fastest way
 *     to have notifications switched off for good.
 *
 * Pure: takes the clock as an argument, so the rules are testable in Node.
 */

/** How many days ahead the plan reaches. Also how long silence takes. */
export const REMINDER_DAYS = 7;

/** The time a new reminder defaults to: early evening, after school or work. */
export const DEFAULT_REMINDER_TIME: ReminderTime = { hour: 19, minute: 0 };

/** The times offered in the picker, earliest first. */
export const REMINDER_TIMES: readonly ReminderTime[] = [
  { hour: 8, minute: 0 },
  { hour: 12, minute: 30 },
  { hour: 19, minute: 0 },
  { hour: 21, minute: 30 },
];

export interface ReminderTime {
  /** 0–23, local time. */
  hour: number;
  /** 0–59. */
  minute: number;
}

/**
 * What a reminder says.
 *
 * - `save-streak`: the streak is alive but not yet kept today, and ends at midnight.
 * - `keep-streak`: tomorrow's reminder after a day the streak was kept.
 * - `daily`: an ordinary first reminder, with no streak to protect.
 * - `comeback`: a later day, by which time any streak has lapsed.
 * - `last`: the final one in the plan; says reminders stop until the app is opened.
 */
export type ReminderKind = 'save-streak' | 'keep-streak' | 'daily' | 'comeback' | 'last';

export interface PlannedReminder {
  /** When it fires, in local time. */
  at: Date;
  kind: ReminderKind;
  /** The streak it names, for the two streak kinds; 0 otherwise. */
  streak: number;
}

export interface ReminderPlanInput {
  now: Date;
  time: ReminderTime;
  /** From a profile already reconciled to today (`reconcileProfile`). */
  dayStreak: number;
  streakActiveToday: boolean;
  days?: number;
}

/**
 * Whether a value read from storage is a valid time of day.
 *
 * @param value Anything.
 * @return True for `{ hour: 0–23, minute: 0–59 }` with whole numbers.
 */
export function isReminderTime(value: unknown): value is ReminderTime {
  if (typeof value !== 'object' || value === null) return false;
  const { hour, minute } = value as ReminderTime;
  return (
    Number.isInteger(hour) && hour >= 0 && hour <= 23 && Number.isInteger(minute) && minute >= 0 && minute <= 59
  );
}

/**
 * The reminders to schedule from now, oldest first.
 *
 * Days are built with the `Date` constructor in local time, so a reminder set
 * for 19:00 stays at 19:00 across a daylight-saving change rather than
 * drifting an hour, which adding 24 hours of milliseconds would do.
 *
 * @param input The clock, the chosen time and the learner's streak.
 * @return Up to `days` reminders, never one in the past or on a day already practised.
 */
export function planReminders(input: ReminderPlanInput): PlannedReminder[] {
  const { now, time, dayStreak, streakActiveToday } = input;
  const days = input.days ?? REMINDER_DAYS;
  const plan: PlannedReminder[] = [];

  for (let offset = 0; offset < days; offset++) {
    const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, time.hour, time.minute, 0, 0);
    if (offset === 0 && (streakActiveToday || at.getTime() <= now.getTime())) continue;
    plan.push({ at, ...reminderWording(offset, plan.length === 0, dayStreak, streakActiveToday) });
  }

  const last = plan[plan.length - 1];
  // A plan of one is not "the last of several"; it would read as a goodbye
  // on the only reminder someone ever gets.
  if (last && plan.length > 1) plan[plan.length - 1] = { ...last, kind: 'last', streak: 0 };
  return plan;
}

/**
 * What the reminder `offset` days from today says, assuming no lesson before it.
 *
 * The first reminder in the plan is an ordinary daily one when there is no
 * streak to name; every one after it is a comeback, because by then the
 * learner has let at least one reminder pass.
 *
 * A streak survives one day without a lesson only if it was kept today: kept
 * today, it is still alive tomorrow; kept yesterday, it is alive today and
 * gone tomorrow. Past that, every reminder is a comeback.
 */
function reminderWording(
  offset: number,
  first: boolean,
  dayStreak: number,
  streakActiveToday: boolean,
): { kind: ReminderKind; streak: number } {
  if (dayStreak > 0) {
    if (!streakActiveToday && offset === 0) return { kind: 'save-streak', streak: dayStreak };
    if (streakActiveToday && offset === 1) return { kind: 'keep-streak', streak: dayStreak };
  }
  return { kind: first ? 'daily' : 'comeback', streak: 0 };
}
