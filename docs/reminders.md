# Daily reminders

An optional local notification at a time the learner picks, switched on in
**Profile → Daily reminder**. Off by default; turning it on is the only thing
that asks for notification permission.

Nothing leaves the phone. There is no push token, no server and no account
involved: the operating system holds the schedule and the app rebuilds it.

## What gets scheduled

`planReminders` in `packages/core/src/progress/reminders.ts` decides. The app
does not schedule one repeating alarm. It schedules the next seven days as
separate one-off notifications, and throws the plan away and rebuilds it every
time it opens, comes back to the foreground, a lesson ends, or the language or
time changes (`src/hooks/useReminderSchedule.ts`).

Each reminder is worded for the day it fires on, assuming no lesson before then
(any lesson rebuilds the plan, so that is exactly the case in which it fires):

| Situation | Reminder |
| --- | --- |
| Streak kept today | Today skipped; tomorrow "Keep your N day streak going" |
| Streak alive, not kept today | Today "Your N day streak ends at midnight" |
| No streak | "Time for five minutes of macro" |
| Later days | "Your next lesson is waiting" |
| Day 7 | "This is the last reminder until you open OpenMacro again" |

So someone who stops opening the app gets a week of reminders and then
silence, not a notification every day from an app they no longer use.

## Platforms

- **iOS and Android:** `expo-notifications`. Adding it was a native change, so
  reminders reach learners only with a new store build, not an over-the-air
  update.
- **Android** uses an inexact alarm (the app does not ask for
  `SCHEDULE_EXACT_ALARM`), so a reminder can arrive a few minutes late.
- **iOS:** `plugins/withoutPushEntitlement.js` removes the `aps-environment`
  entitlement the library adds, because local notifications do not need it.
  Remove that plugin if remote push is ever added.
- **Website:** no reminders. The parity rule covers exercises; this is a
  device feature, and the switch does not render on the web export.

## Testing on a device

The four preset times are hours apart, so to see one fire, set the phone's
clock to a minute before the chosen time. Finishing a lesson before then should
remove today's reminder.
