#!/usr/bin/env node
/**
 * ============================================================================
 * App Store screenshots — `npm run shots:ios`
 * ============================================================================
 *
 * Captures the required screenshot sets from the iOS Simulator, in every
 * language the app ships, without anybody tapping anything.
 *
 * Screenshots are the only part of an App Store listing that is not text in
 * this repository, which is exactly why they rot: the copy gets updated with
 * the app and the pictures keep showing last year's tab bar. Making them a
 * script means they are regenerated with a command rather than reconstructed
 * from memory by whoever is doing the release.
 *
 * ---------------------------------------------------------------------------
 * HOW IT NAVIGATES WITHOUT A FINGER
 * ---------------------------------------------------------------------------
 *
 * Three levers, none of which need UI automation:
 *
 *   1. DEEP LINKS. `simctl openurl openmacro:///progress` puts expo-router on
 *      any route, including a specific lesson. A lesson opens on its first
 *      challenge, so choosing the right lesson chooses which kind of challenge
 *      is photographed — that is why the list below names lessons rather than
 *      screens.
 *
 *   2. LAUNCH ARGUMENTS. `-AppleLanguages "(pt-PT)"` is the standard Xcode
 *      trick and it is what makes a Portuguese set possible: NSLocale honours
 *      it, so `expo-localization` reports Portuguese and the app picks it up as
 *      the device language. No reboot, no editing the simulator's preferences,
 *      and nothing left behind for the next run.
 *
 *   3. SEEDED STORAGE. A fresh install has 0 XP, no streak and one unlocked
 *      lesson, which photographs as an empty app. The seed below writes a
 *      plausible fortnight of study straight into AsyncStorage's files while
 *      the app is not running.
 *
 * ---------------------------------------------------------------------------
 * WHY THE SEED IS WRITTEN THE WAY IT IS
 * ---------------------------------------------------------------------------
 *
 * AsyncStorage on iOS keeps a `manifest.json` of key → value, but only for
 * values up to 1,024 characters; anything longer is written to a sibling file
 * named after the MD5 of its key, with `null` left in the manifest as the
 * marker. A seeder that only writes the manifest therefore works until the
 * progress it seeds gets interesting, and then silently stops working — the app
 * reads `null`, finds no file, and starts fresh. Both paths are implemented for
 * that reason, not for completeness.
 *
 * ---------------------------------------------------------------------------
 * REQUIRES
 * ---------------------------------------------------------------------------
 *
 * The app already installed on each simulator, built for Release:
 *
 *     npx expo run:ios --configuration Release --device <name>
 *
 * Release rather than Debug, because a Debug build photographs with a dev
 * banner and unminified timings. Delete `ios/` afterwards — it is generated,
 * and a stale copy silently overrides `app.json` on the next build.
 */

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'assets/store/ios');

const BUNDLE_ID = 'org.openmacro.app';
const SCHEME = 'openmacro';

/** Simulators to shoot, by name, with the App Store slot each one fills. */
const DEVICES = [
  { name: 'shots-iphone', slot: 'APP_IPHONE_67', expect: [1320, 2868] },
  { name: 'shots-ipad', slot: 'APP_IPAD_PRO_3GEN_129', expect: [2064, 2752] },
];

/**
 * Languages, and what to call the folder.
 *
 * The keys are App Store Connect locales, because that is what
 * `store.config.json` is keyed by and a second naming scheme between here and
 * there would only ever be a source of mismatched paths.
 */
const LOCALES = [
  { locale: 'en-US', appleLanguages: 'en', appleLocale: 'en_US' },
  { locale: 'pt-PT', appleLanguages: 'pt-PT', appleLocale: 'pt_PT' },
];

/**
 * The set, in order.
 *
 * Chosen so the six pictures answer six different questions, rather than
 * showing the same list six times. A lesson deep link lands on that lesson's
 * first challenge, so each entry naming a lesson is really naming a challenge
 * type — the balance sheet, the simulator, the matching pairs, the ordering.
 */
const SHOTS = [
  { name: 'path', url: '/', settle: 3500 },
  { name: 'balance-sheet', url: '/lesson/whoever-gets-it-first' },
  { name: 'simulator', url: '/lesson/what-rising-prices-do-to-you' },
  { name: 'concept-match', url: '/lesson/base-and-broad-money' },
  { name: 'order-flow', url: '/lesson/why-paper-is-accepted' },
  { name: 'progress', url: '/progress' },
];

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

/** `xcrun simctl …`, throwing with the tool's own stderr on failure. */
function simctl(...args) {
  return execFileSync('xcrun', ['simctl', ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function deviceUdid(name) {
  const list = JSON.parse(simctl('list', 'devices', 'available', '-j'));
  for (const devices of Object.values(list.devices)) {
    const found = devices.find((device) => device.name === name);
    if (found) return found.udid;
  }
  throw new Error(
    `No available simulator named "${name}". Create it with:\n` +
      `  xcrun simctl create "${name}" <deviceType> <runtime>`,
  );
}

async function boot(udid) {
  const state = JSON.parse(simctl('list', 'devices', '-j'));
  const booted = Object.values(state.devices)
    .flat()
    .find((device) => device.udid === udid)?.state;
  if (booted !== 'Booted') {
    simctl('boot', udid);
    // `bootstatus -b` blocks until the device finishes booting, which is the
    // difference between a screenshot of the app and one of a black screen.
    execFileSync('xcrun', ['simctl', 'bootstatus', udid, '-b'], { stdio: 'ignore' });
  }
}

// ---------------------------------------------------------------------------
// The seed
// ---------------------------------------------------------------------------

/** `YYYY-MM-DD`, `daysAgo` days before today, in local time. */
function dateKey(daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

/**
 * A fortnight of honest-looking study.
 *
 * The numbers have to be consistent with each other or the screenshots
 * contradict themselves: `totalXp` is the sum of the per-lesson bests, the
 * streak is dated today so it reads as live rather than broken, and the lessons
 * are the opening run of the course in the order someone would actually meet
 * them.
 */
function seedProgress() {
  const lessons = [
    ['kab-what-a-bank-is-for', 60, true],
    ['kab-income-statement', 50, false],
    ['kab-fractional-reserve', 60, true],
    ['kab-is-it-real-wealth', 40, false],
    ['why-paper-is-accepted', 60, true],
    ['base-and-broad-money', 50, true],
    ['what-money-does', 60, true],
    ['when-currencies-fail', 40, false],
  ];

  const progress = {};
  let totalXp = 0;
  lessons.forEach(([lessonId, bestXp, perfect], index) => {
    totalXp += bestXp;
    progress[lessonId] = {
      lessonId,
      bestXp,
      completions: perfect ? 2 : 1,
      perfect,
      lastCompletedAt: `${dateKey(lessons.length - 1 - index)}T18:20:00.000Z`,
    };
  });

  return {
    version: 1,
    snapshot: {
      profile: {
        id: 'local-learner',
        displayName: 'Learner',
        totalXp,
        dayStreak: 12,
        streakActiveToday: true,
        lastActiveOn: dateKey(0),
      },
      progress,
    },
  };
}

/**
 * Writes AsyncStorage entries into an installed app's container.
 *
 * The app must not be running: it holds the manifest in memory and would write
 * its own copy back over this one on the next save.
 */
function seedStorage(udid, entries) {
  const container = simctl('get_app_container', udid, BUNDLE_ID, 'data').trim();
  const dir = join(container, 'Library/Application Support', BUNDLE_ID, 'RCTAsyncLocalStorage_V1');
  mkdirSync(dir, { recursive: true });

  const manifestPath = join(dir, 'manifest.json');
  const manifest = existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, 'utf8'))
    : {};

  for (const [key, value] of Object.entries(entries)) {
    const serialised = JSON.stringify(value);
    const filePath = join(dir, createHash('md5').update(key).digest('hex'));
    if (serialised.length <= 1024) {
      manifest[key] = serialised;
      rmSync(filePath, { force: true });
    } else {
      writeFileSync(filePath, serialised, 'utf8');
      manifest[key] = null;
    }
  }

  writeFileSync(manifestPath, JSON.stringify(manifest), 'utf8');
}

// ---------------------------------------------------------------------------
// Capture
// ---------------------------------------------------------------------------

/** PNG dimensions, so a wrong-sized set is caught here and not by Apple. */
function pngSize(path) {
  const bytes = readFileSync(path);
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
}

async function captureLocale(udid, device, { locale, appleLanguages, appleLocale }) {
  const directory = join(OUT, locale, device.slot);
  mkdirSync(directory, { recursive: true });

  try {
    simctl('terminate', udid, BUNDLE_ID);
  } catch {
    /* not running, which is the state we wanted anyway */
  }

  // Seeded while stopped, for the reason in `seedStorage`.
  seedStorage(udid, {
    'openmacro:progress': seedProgress(),
    // The app prefers a stored choice over the device language; setting it to
    // match means the picker in Account agrees with the rest of the shot.
    'openmacro.locale.v1': { version: 1, data: { locale: locale === 'pt-PT' ? 'pt-PT' : 'en' } },
    'openmacro.videoCollapsed.v1': { version: 1, data: { collapsed: false } },
  });

  /**
   * A clean status bar. Apple's own screenshots read 9:41 with full bars, and a
   * real one reads 14:07 with two bars and a low battery — which is the kind of
   * detail that makes a listing look unfinished for no reason.
   */
  simctl(
    'status_bar', udid, 'override',
    '--time', '9:41',
    '--batteryState', 'charged',
    '--batteryLevel', '100',
    '--cellularMode', 'active',
    '--cellularBars', '4',
    '--dataNetwork', 'wifi',
    '--wifiMode', 'active',
    '--wifiBars', '3',
  );

  simctl(
    'launch', udid, BUNDLE_ID,
    '-AppleLanguages', `(${appleLanguages})`,
    '-AppleLocale', appleLocale,
  );

  const written = [];
  for (const [index, shot] of SHOTS.entries()) {
    if (shot.url !== '/') simctl('openurl', udid, `${SCHEME}://${shot.url}`);
    // Cold start needs longer than a route change; both need the animation to
    // finish, or the screenshot catches a view mid-slide.
    await sleep(shot.settle ?? 2200);

    const file = join(directory, `${String(index + 1).padStart(2, '0')}-${shot.name}.png`);
    simctl('io', udid, 'screenshot', '--type', 'png', file);

    const [width, height] = pngSize(file);
    const [expectedWidth, expectedHeight] = device.expect;
    const ok = width === expectedWidth && height === expectedHeight;
    console.log(
      `    ${ok ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m'} ${shot.name.padEnd(15)}` +
        `${String(width)}×${String(height)}` +
        (ok ? '' : `  \x1b[31m(expected ${String(expectedWidth)}×${String(expectedHeight)})\x1b[0m`),
    );
    written.push(file.replace(`${ROOT}/`, './'));
  }

  try {
    simctl('terminate', udid, BUNDLE_ID);
  } catch {
    /* already gone */
  }
  return written;
}

// ---------------------------------------------------------------------------

const wanted = process.argv.slice(2).filter((arg) => !arg.startsWith('-'));
const paths = {};

for (const device of DEVICES) {
  if (wanted.length && !wanted.includes(device.name)) continue;
  console.log(`\n\x1b[1m${device.name}\x1b[0m  →  ${device.slot}`);
  const udid = deviceUdid(device.name);
  await boot(udid);

  for (const locale of LOCALES) {
    console.log(`  ${locale.locale}`);
    const written = await captureLocale(udid, device, locale);
    (paths[locale.locale] ??= {})[device.slot] = written;
  }
}

/**
 * Printed rather than written into `store.config.json`.
 *
 * The listing file is edited by hand and reviewed in a diff; a script that
 * rewrites it would reformat the whole thing every run and bury the change that
 * mattered. Paste these in once and they stay correct, because the filenames
 * are stable.
 */
console.log('\n\x1b[1mFor store.config.json — apple.info.<locale>.screenshots:\x1b[0m\n');
console.log(JSON.stringify(paths, null, 2));
console.log();
