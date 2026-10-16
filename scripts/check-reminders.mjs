#!/usr/bin/env node
/**
 * ============================================================================
 * Streak reminder self-test — `npm run check:reminders`
 * ============================================================================
 *
 * `src/services/reminders` decides which notifications exist on someone's
 * phone. Getting it wrong is either spam (a reminder on a day the streak is
 * already kept, or one that survives switching the setting off) or silence
 * (cancelling reminders it did not create, or none scheduled at all), and
 * neither shows up in a type check or on a simulator that cannot tap through
 * the permission prompt.
 *
 * So this drives the real module against a stub `expo-notifications` that
 * keeps the scheduled set in memory, the same way `check-feedback` drives
 * the sound module. `react-native` and AsyncStorage are stubbed through a
 * resolve hook, so the file under test is the shipped one.
 */

import { registerHooks } from 'node:module';
import { mkdtempSync, writeFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const ROOT = new URL('../', import.meta.url);
const STUBS = mkdtempSync(join(tmpdir(), 'openmacro-reminders-'));
const HARNESS = pathToFileURL(join(STUBS, 'harness.mjs')).href;

writeFileSync(
  join(STUBS, 'harness.mjs'),
  `export const scheduled = new Map();
   export const state = { permission: 'granted' };
   export const storage = new Map();\n`,
);
writeFileSync(
  join(STUBS, 'expo-notifications.mjs'),
  `import { scheduled, state } from ${JSON.stringify(HARNESS)};
   export const IosAuthorizationStatus = { AUTHORIZED: 2, DENIED: 1, PROVISIONAL: 3 };
   export const AndroidImportance = { DEFAULT: 3 };
   export async function setNotificationChannelAsync() {}
   export const SchedulableTriggerInputTypes = { DATE: 'date' };
   export async function requestPermissionsAsync() {
     const granted = state.permission === 'granted';
     return { granted, ios: { status: granted ? 2 : 1 } };
   }
   export async function getAllScheduledNotificationsAsync() {
     return [...scheduled.values()];
   }
   export async function cancelScheduledNotificationAsync(id) { scheduled.delete(id); }
   export async function scheduleNotificationAsync(request) {
     scheduled.set(request.identifier, request);
     return request.identifier;
   }\n`,
);
writeFileSync(
  join(STUBS, 'async-storage.mjs'),
  `import { storage } from ${JSON.stringify(HARNESS)};
   export default {
     async getItem(k) { return storage.has(k) ? storage.get(k) : null; },
     async setItem(k, v) { storage.set(k, v); },
     async removeItem(k) { storage.delete(k); },
   };\n`,
);
writeFileSync(
  join(STUBS, 'react.mjs'),
  `export function useSyncExternalStore(_s, get) { return get(); }\nexport default {};\n`,
);

writeFileSync(join(STUBS, 'react-native.mjs'), `export const Platform = { OS: 'ios' };\nexport default { Platform };\n`);

const STUB_FOR = {
  'react-native': join(STUBS, 'react-native.mjs'),
  'expo-notifications': join(STUBS, 'expo-notifications.mjs'),
  '@react-native-async-storage/async-storage': join(STUBS, 'async-storage.mjs'),
  react: join(STUBS, 'react.mjs'),
};

function isFile(url) {
  try { return statSync(fileURLToPath(url)).isFile(); } catch { return false; }
}
function firstExisting(base) {
  return [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`].find(isFile) ?? null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (STUB_FOR[specifier]) return { url: pathToFileURL(STUB_FOR[specifier]).href, shortCircuit: true };
    if (specifier.startsWith('@/')) {
      const resolved = firstExisting(new URL(`src/${specifier.slice(2)}`, ROOT).href);
      if (resolved) return { url: resolved, shortCircuit: true };
    }
    if (specifier.startsWith('.') && context.parentURL) {
      const resolved = firstExisting(new URL(specifier, context.parentURL).href);
      if (resolved) return { url: resolved, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});

const harness = await import(HARNESS);
const reminders = await import('@/services/reminders');
await new Promise((resolve) => setTimeout(resolve, 0)); // let hydration finish

let failures = 0;
function check(name, condition, detail = '') {
  console.log(
    condition
      ? `  \x1b[32m✓\x1b[0m ${name}${detail ? `  \x1b[2m${detail}\x1b[0m` : ''}`
      : `  \x1b[31m✗\x1b[0m ${name}${detail ? `  ${detail}` : ''}`,
  );
  if (!condition) failures += 1;
}
const content = { title: 't', body: 'b' };
const ours = () => [...harness.scheduled.keys()].filter((id) => id.startsWith('streak-reminder-'));
const dates = () =>
  ours().map((id) => harness.scheduled.get(id).trigger.date).sort((a, b) => a - b);

console.log('\nStreak reminders — self-test\n');

console.log('Off by default');
await reminders.rescheduleReminders({ keptToday: false, content });
check('nothing is scheduled before the learner opts in', ours().length === 0);

console.log('\nPermission');
harness.state.permission = 'denied';
check('a refusal is reported', (await reminders.enableReminder('Daily reminder')) === 'denied');
await reminders.rescheduleReminders({ keptToday: false, content });
check('…and nothing is scheduled', ours().length === 0);
harness.state.permission = 'granted';
check('a grant switches it on', (await reminders.enableReminder('Daily reminder')) === 'enabled');

console.log('\nScheduling');
// A time that is always still ahead today, so today counts.
const later = new Date();
const hour = Math.min(23, later.getHours() + 1);
await reminders.setReminderTime(hour, 59);
await reminders.rescheduleReminders({ keptToday: false, content });
const ahead = dates();
check('fourteen reminders when today is not done', ahead.length === 14, `${ahead.length} scheduled`);
check(
  '…the first one today, at the chosen time',
  ahead.length > 0 &&
    new Date(ahead[0]).toDateString() === new Date().toDateString() &&
    new Date(ahead[0]).getHours() === hour &&
    new Date(ahead[0]).getMinutes() === 59,
);
check(
  '…one a day, on consecutive days',
  ahead.every((d, i) => i === 0 || Math.round((d - ahead[i - 1]) / 86400000) === 1),
);

await reminders.rescheduleReminders({ keptToday: true, content });
const kept = dates();
check('a lesson done today drops today', kept.length === 13, `${kept.length} scheduled`);
check(
  '…and starts tomorrow',
  kept.length > 0 && new Date(kept[0]).toDateString() !== new Date().toDateString(),
);

await reminders.rescheduleReminders({ keptToday: false, content });
check('rescheduling replaces rather than stacking up', ours().length === 14, `${ours().length} scheduled`);

console.log('\nOther notifications');
harness.scheduled.set('someone-else', { identifier: 'someone-else', trigger: {} });
await reminders.rescheduleReminders({ keptToday: false, content });
check('a notification it did not create survives a reschedule', harness.scheduled.has('someone-else'));

console.log('\nSwitching off');
await reminders.disableReminder();
check('every reminder is removed', ours().length === 0);
check('…and only its own', harness.scheduled.has('someone-else'));
await reminders.rescheduleReminders({ keptToday: false, content });
check('…and a later reschedule adds none back', ours().length === 0);

console.log('\nPersistence');
const stored = [...harness.storage.values()].map(String).find((v) => v.includes('enabled'));
check('the setting is written to storage', Boolean(stored));

if (failures === 0) {
  console.log('\x1b[32m%s\x1b[0m', '\n✓ Streak reminders — every check passed.\n');
  process.exit(0);
}
console.log('\x1b[31m%s\x1b[0m', `\n✗ ${failures} check(s) failed.\n`);
process.exit(1);
