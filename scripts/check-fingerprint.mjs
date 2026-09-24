#!/usr/bin/env node
/**
 * ============================================================================
 * Fingerprint self-test — `npm run check:fingerprint`
 * ============================================================================
 *
 * `fingerprint.config.js` makes a series of claims about which files can and
 * cannot affect the native runtime. Every one of them is a bet with an
 * asymmetric payoff.
 *
 * Too conservative and the cost is reach: a binary is orphaned from updates
 * over a change that could not have broken it, which is the failure this
 * project keeps running into — a published update that reports success and
 * is offered to nobody.
 *
 * Too permissive and the cost is a crash on launch, in the field, for
 * everyone, delivered automatically by an update nobody reviewed. A JavaScript
 * bundle that calls into native code the binary does not contain does not
 * degrade gracefully.
 *
 * Neither is visible by reading the config, so this asserts both directions:
 * each file the config claims is safe is edited and the hash must hold, and
 * each genuinely native change is made and the hash must move. The second half
 * is the one that matters — a skip list is only trustworthy if something
 * still fails when the native surface really does change.
 *
 * Every case edits the real file and restores it. Nothing is left behind, and
 * the script fails rather than continuing if a restore did not take.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const path = (rel) => `${ROOT}${rel}`;

/**
 * Hash the tree as it stands right now, in a child process.
 *
 * The child is not an optimisation. `fingerprint.config.js` is `require`d and
 * cached for the life of a process, and so are parts of the Expo config, so
 * measuring twice in one process silently returns the first answer both times
 * — a result that looks like a passing test and is not one. That mistake was
 * made here first, and it read as six identical hashes that all looked like
 * a pass.
 *
 * **Asynchronously**, which is not incidental either. The first version used
 * `spawnSync`, and the interrupt handling below was then decorative: a
 * blocked event loop cannot run a JS signal handler, so Ctrl-C killed the
 * process mid-edit and left a mutated `eas.json` on disk. Verified by
 * interrupting a real run. Awaiting the child keeps the loop free, so the
 * handler fires and the file goes back.
 *
 * **Both platforms, hashed together.** EAS computes a separate runtime
 * version per platform, and they differ — iOS and Android have different
 * autolinking sources, and Android alone carries the adaptive icons. A test
 * that measured iOS only would be blind to a skip that behaves differently on
 * Android. The combined hash is not a runtime version and is never used as
 * one; it is a change detector that trips if *either* platform moves, which
 * is exactly the question each case below asks.
 */
async function hash() {
  const { stdout } = await run(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `import { createFingerprintAsync } from '@expo/fingerprint';
       const fp = await createFingerprintAsync(process.cwd(), {
         platforms: ['ios', 'android'],
         silent: true,
       });
       process.stdout.write(fp.hash);`,
    ],
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  );
  return stdout.trim();
}

/**
 * Files currently holding an edit, and their original bytes.
 *
 * This script edits `app.json`, `package.json`, `eas.json` and files inside
 * `node_modules`. A `finally` covers a thrown error but not a signal: Ctrl-C
 * during a run would otherwise leave a mutated `app.json` on disk, looking
 * exactly like a change somebody meant to make. So the originals are held
 * here and restored on the way out however the process ends.
 */
const outstanding = new Map();

function restoreAll() {
  for (const [file, original] of outstanding) {
    try {
      writeFileSync(file, original);
    } catch {
      // Nothing useful to do while unwinding; the check below still reports.
    }
  }
  outstanding.clear();
}

for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => {
    restoreAll();
    console.log(`\n  interrupted — files restored\n`);
    process.exit(130);
  });
}
process.on('uncaughtException', (error) => {
  restoreAll();
  console.error(error);
  process.exit(1);
});

/** Apply `edit` to `rel`, hash, then put the file back exactly as it was. */
async function hashWith(rel, edit) {
  const file = path(rel);
  const original = readFileSync(file);
  outstanding.set(file, original);
  try {
    writeFileSync(file, edit(original));
    return await hash();
  } finally {
    writeFileSync(file, original);
    outstanding.delete(file);
    if (!readFileSync(file).equals(original)) {
      throw new Error(`could not restore ${rel} — stop and check the working tree`);
    }
  }
}

/** Edit a JSON file semantically. Reformatting alone must not matter. */
const json = (mutate) => (buffer) => {
  const value = JSON.parse(buffer.toString('utf8'));
  mutate(value);
  return JSON.stringify(value, null, 2);
};

const append = (text) => (buffer) => Buffer.concat([buffer, Buffer.from(text)]);

/**
 * Cases, in both directions.
 *
 * `holds: true` means the config claims this cannot affect the native runtime.
 * `holds: false` means it genuinely can, and the guard must still catch it.
 */
const CASES = [
  // -- the whole point: content and app code ship over the air ------------
  {
    holds: true,
    what: 'a lesson is edited',
    file: 'packages/core/src/content/formulas.ts',
    edit: append('\n// fingerprint probe\n'),
  },
  {
    holds: true,
    what: 'app code is edited',
    file: 'app/review.tsx',
    edit: append('\n// fingerprint probe\n'),
  },

  // -- the four files anyone actually touches -----------------------------
  { holds: true, what: '.gitignore gains a line', file: '.gitignore', edit: append('\n# fingerprint probe\n') },
  {
    holds: true,
    what: 'the marketing version is bumped',
    file: 'app.json',
    edit: json((c) => { c.expo.version = '9.9.9'; }),
  },
  {
    holds: true,
    what: 'the store description is rewritten',
    file: 'app.json',
    edit: json((c) => { c.expo.description = 'A different description entirely.'; }),
  },
  {
    holds: true,
    what: 'the app icon is redrawn',
    file: 'assets/brand/v3/openmacro-icon-light.png',
    edit: append('fingerprint probe'),
  },
  {
    /**
     * Not the same case as the icon, which is why it is written twice.
     *
     * `ExpoConfigAssets` drops assets the Expo config names directly, and the
     * icon is one. The splash is configured through the `expo-splash-screen`
     * plugin, so it arrives as an `expoConfigExternalFile` the skip never
     * sees — it went on moving the runtime version on both platforms while
     * the icon case passed and the documentation claimed both were fine.
     */
    holds: true,
    what: 'the splash image is redrawn',
    file: 'assets/brand/v3/openmacro-splash.png',
    edit: append('fingerprint probe'),
  },
  {
    holds: true,
    what: 'an npm script is added',
    file: 'package.json',
    edit: json((c) => { c.scripts['probe:fingerprint'] = 'echo probe'; }),
  },
  {
    holds: true,
    what: 'App Store submit metadata changes',
    file: 'eas.json',
    edit: json((c) => { c.submit.production.ios.appName = 'Something Else'; }),
  },
  {
    holds: true,
    what: 'eas-cli behaviour changes',
    file: 'eas.json',
    edit: json((c) => { c.cli.requireCommit = false; }),
  },

  // -- and the half that has to still fail --------------------------------
  {
    /**
     * The case the whole scheme exists to catch.
     *
     * Everything else here is configuration. This is actual Swift compiled
     * into the binary, reached through the `expoAutolinkingIos` directory
     * hash, and it is the mechanism that stops a JavaScript bundle being
     * offered to an app whose native side does not match it. If a skip ever
     * blinds the fingerprint to this, updates stop being merely unreachable
     * and start crashing on launch.
     */
    holds: false,
    what: "a native module's iOS source changes",
    file: 'node_modules/expo-audio/ios/AudioModule.swift',
    edit: append('\n// fingerprint probe\n'),
  },
  {
    holds: false,
    what: "a native module's Android source changes",
    file: 'node_modules/expo-audio/android/src/main/java/expo/modules/audio/AudioModule.kt',
    edit: append('\n// fingerprint probe\n'),
  },
  {
    holds: false,
    what: 'a native build property changes',
    file: 'app.json',
    edit: json((c) => {
      const plugin = c.expo.plugins.find((p) => Array.isArray(p) && p[0] === 'expo-build-properties');
      plugin[1].android.enableMinifyInReleaseBuilds = false;
    }),
  },
  {
    holds: false,
    what: 'the bundle identifier changes',
    file: 'app.json',
    edit: json((c) => { c.expo.ios.bundleIdentifier = 'org.openmacro.other'; }),
  },
  {
    holds: false,
    what: 'Info.plist changes',
    file: 'app.json',
    edit: json((c) => { c.expo.ios.infoPlist.CFBundleLocalizations = ['en']; }),
  },
  {
    holds: false,
    what: 'the URL scheme changes',
    file: 'app.json',
    edit: json((c) => { c.expo.scheme = 'openmacro2'; }),
  },
  {
    holds: false,
    what: 'a config plugin is removed',
    file: 'app.json',
    edit: json((c) => { c.expo.plugins = c.expo.plugins.filter((p) => p !== 'expo-web-browser'); }),
  },
  {
    holds: false,
    what: 'the Android build type changes',
    file: 'eas.json',
    edit: json((c) => { c.build.production.android.buildType = 'apk'; }),
  },
  {
    holds: false,
    what: 'the build Node version changes',
    file: 'eas.json',
    edit: json((c) => { c.build.base.node = '20.0.0'; }),
  },
];

/**
 * Script names npm or EAS will run as part of a build.
 *
 * `PackageJsonScriptsAll` makes the entire scripts block invisible to the
 * fingerprint, which is right for this project — the scripts are content
 * tooling and linting, and hashing them orphaned TestFlight build 15 over a
 * spellcheck helper. But the skip is blind rather than selective: add a
 * `postinstall` that patches a pod, or an `eas-build-pre-install`, and it
 * would change the native build while the fingerprint said nothing happened.
 *
 * That is the one hole the skip opens, and this closes it. There are none
 * today; the check is here so that adding one is a conversation rather than a
 * silent change to what "native" means.
 */
const BUILD_HOOKS = [
  'preinstall',
  'install',
  'postinstall',
  'prepare',
  'prepack',
  'postpack',
  'eas-build-pre-install',
  'eas-build-post-install',
  'eas-build-pre-upload-artifacts',
  'eas-build-on-success',
  'eas-build-on-error',
  'eas-build-on-cancel',
  'eas-build-on-complete',
];

console.log('\nFingerprint — what can and cannot travel over the air\n');

/**
 * The claim everything else rests on.
 *
 * `release/shipped-runtimes.json` records what a build is running, computed
 * with `@expo/fingerprint` directly. The runtime version an installed app
 * actually carries is the one `expo-updates` derives. If those two ever
 * disagree, every reachability check in this repo is comparing a number to a
 * different number and reporting confidently on nothing — the guard would
 * pass while the update reached no one, which is precisely the failure it
 * exists to prevent.
 *
 * They agree today. This is here so that an SDK upgrade cannot quietly change
 * that.
 */
for (const platform of ['ios', 'android']) {
  const ours = await run(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `import { createFingerprintAsync } from '@expo/fingerprint';
       const fp = await createFingerprintAsync(process.cwd(), {
         platforms: ['${platform}'],
         silent: true,
       });
       process.stdout.write(fp.hash);`,
    ],
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  ).then((r) => r.stdout.trim());

  const theirs = await run('npx', ['expo-updates', 'fingerprint:generate', '--platform', platform], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  }).then((r) => JSON.parse(r.stdout).hash);

  if (ours !== theirs) {
    console.log('\x1b[31m%s\x1b[0m', `  ✗ ${platform}: our fingerprint is not the runtime version`);
    console.log(`
      @expo/fingerprint  ${ours}
      expo-updates       ${theirs}

  release/shipped-runtimes.json records the first and the installed app runs
  the second, so every reachability check is comparing unrelated numbers.
`);
    process.exit(1);
  }
  console.log(`  \x1b[32m✓\x1b[0m ${platform.padEnd(8)} \x1b[2mour fingerprint is the runtime version expo-updates derives\x1b[0m`);
}
console.log();

const scripts = JSON.parse(readFileSync(path('package.json'), 'utf8')).scripts ?? {};
const hooks = BUILD_HOOKS.filter((name) => name in scripts);
if (hooks.length > 0) {
  console.log('\x1b[31m%s\x1b[0m', `  ✗ package.json defines build lifecycle hooks: ${hooks.join(', ')}`);
  console.log(`
  These run during a native build, but \`PackageJsonScriptsAll\` means the
  fingerprint cannot see them — a change to one would ship as an ordinary
  update to a binary built before it existed.

  Either move the work somewhere the fingerprint tracks, or narrow the skip
  in fingerprint.config.js and accept that every script edit orphans builds.
`);
  process.exit(1);
}
console.log('  \x1b[32m✓\x1b[0m no build lifecycle hooks hidden by the scripts skip\n');

const baseline = await hash();
console.log(`  baseline  \x1b[2m${baseline}\x1b[0m\n`);

let failures = 0;
for (const testCase of CASES) {
  const moved = (await hashWith(testCase.file, testCase.edit)) !== baseline;
  const ok = testCase.holds ? !moved : moved;
  if (!ok) failures += 1;

  const mark = ok ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';
  const verdict = testCase.holds
    ? moved
      ? 'MOVED the runtime version — this orphans every installed build'
      : 'ships over the air'
    : moved
      ? 'needs a new build, and the guard says so'
      : 'DID NOT move the runtime version — a native change would ship as an update';
  console.log(`  ${mark} ${testCase.what.padEnd(38)} \x1b[2m${verdict}\x1b[0m`);
}

if (failures === 0) {
  console.log('\x1b[32m%s\x1b[0m', '\n✓ Every claim in fingerprint.config.js holds, in both directions.\n');
  process.exit(0);
}
console.log('\x1b[31m%s\x1b[0m', `\n✗ ${failures} claim(s) wrong. Do not publish until this is understood.\n`);
process.exit(1);
