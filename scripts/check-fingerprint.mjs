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

import { spawnSync } from 'node:child_process';
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
 * — a result that looks like a passing test and is not one.
 */
function hash() {
  const result = spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `import { createFingerprintAsync } from '@expo/fingerprint';
       const fp = await createFingerprintAsync(process.cwd(), { platforms: ['ios'], silent: true });
       process.stdout.write(fp.hash);`,
    ],
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 },
  );
  if (result.status !== 0) {
    throw new Error(`fingerprint failed:\n${result.stderr}`);
  }
  return result.stdout.trim();
}

/** Apply `edit` to `rel`, hash, then put the file back exactly as it was. */
function hashWith(rel, edit) {
  const file = path(rel);
  const original = readFileSync(file);
  try {
    writeFileSync(file, edit(original));
    return hash();
  } finally {
    writeFileSync(file, original);
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

console.log('\nFingerprint — what can and cannot travel over the air\n');

const baseline = hash();
console.log(`  baseline  \x1b[2m${baseline}\x1b[0m\n`);

let failures = 0;
for (const testCase of CASES) {
  const moved = hashWith(testCase.file, testCase.edit) !== baseline;
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
