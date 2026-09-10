#!/usr/bin/env node
/**
 * ============================================================================
 * Store release preflight — `npm run preflight:store`
 * ============================================================================
 *
 * Every check here exists because the thing it checks is invisible to the
 * compiler and expensive to get wrong. A typecheck cannot tell you that the
 * version in `store.config.json` no longer matches `app.json`, that an icon
 * carries an alpha channel Apple will reject, or that the review contact is
 * still the placeholder this repository ships with. Each of those costs a full
 * review cycle to find out the slow way.
 *
 * Run it before `eas build --profile production` and again before
 * `eas submit` — `npm run build:store` and `npm run submit:*` both do. The
 * release workflow runs it before it starts a build, so a release stops here
 * rather than forty minutes later on a build server.
 *
 * Exit code 0 means "nothing here will bounce a submission". Warnings do not
 * fail the run: they are things worth fixing that no store rejects you for.
 *
 * Requires Node 22.18+, like the rest of the tooling here.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * `--metadata` tightens the listing checks from warnings into blockers.
 *
 * The split matters because the two things happen at different times. A build
 * going to TestFlight needs a signable, launchable app and nothing else — the
 * listing is not read by anyone. `eas metadata:push` writes to a real App Store
 * Connect record under your name, so by then the copy has to be finished.
 */
const strictMetadata = process.argv.includes('--metadata');

const errors = [];
const warnings = [];

/** @param {string} where @param {string} message */
const fail = (where, message) => errors.push({ where, message });
/** @param {string} where @param {string} message */
const warn = (where, message) => warnings.push({ where, message });

/** Reads a JSON file relative to the repository root, or null if absent. */
function readJson(relativePath) {
  const path = join(ROOT, relativePath);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    fail(relativePath, `not valid JSON — ${error.message}`);
    return null;
  }
}

/**
 * PNG header reader. The IHDR chunk is always the first chunk and always at a
 * fixed offset, so dimensions and colour type can be read without a decoder.
 *
 * Colour type 6 (RGBA) and 4 (grey + alpha) mean the file has an alpha
 * channel, which matters for the iOS app icon: App Store Connect rejects an
 * icon with transparency, and it does so at upload time, after the build.
 */
function readPng(relativePath) {
  const path = join(ROOT, relativePath);
  if (!existsSync(path)) return null;
  const bytes = readFileSync(path);
  if (bytes.length < 26 || bytes.readUInt32BE(0) !== 0x89504e47) return null;
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    hasAlpha: bytes[25] === 4 || bytes[25] === 6,
  };
}

// ---------------------------------------------------------------------------
// app.json — the identity the stores key everything else off
// ---------------------------------------------------------------------------

const appJson = readJson('app.json');
const app = appJson?.expo;

if (!app) {
  fail('app.json', 'missing or has no `expo` key — nothing else can be checked.');
} else {
  if (!app.ios?.bundleIdentifier) {
    fail('app.json', 'ios.bundleIdentifier is required to build for the App Store.');
  }
  if (!app.android?.package) {
    fail('app.json', 'android.package is required to build for Google Play.');
  }
  if (!app.version) fail('app.json', 'version is required.');

  // A production EAS build in CI cannot prompt, so the project has to be
  // linked already. `eas init` writes both of these.
  if (!app.extra?.eas?.projectId) {
    fail(
      'app.json',
      'extra.eas.projectId is missing. Run `eas init` and add the id it prints to app.json — ' +
        'a non-interactive build cannot link the project for you.',
    );
  }
  if (!app.owner) {
    warn(
      'app.json',
      'owner is unset. Builds run under whoever is logged in, which is fine solo and ' +
        'confusing the moment a second person or a CI token builds.',
    );
  }

  // Apple asks the export-compliance question on every single upload unless
  // the answer is baked into the build.
  if (app.ios?.config?.usesNonExemptEncryption !== false) {
    warn(
      'app.json',
      'ios.config.usesNonExemptEncryption is not false. Every upload will then stop and ask ' +
        'the export compliance question by hand before the build can be used.',
    );
  }

  if (app.icon) {
    const icon = readPng(app.icon.replace(/^\.\//, ''));
    if (!icon) {
      fail('app.json', `icon ${app.icon} is missing or is not a PNG.`);
    } else {
      if (icon.width !== 1024 || icon.height !== 1024) {
        fail('assets', `icon must be 1024×1024; ${app.icon} is ${icon.width}×${icon.height}.`);
      }
      if (icon.hasAlpha) {
        fail(
          'assets',
          `${app.icon} has an alpha channel. App Store Connect rejects an app icon with ` +
            'transparency, at upload, after the build has already run.',
        );
      }
    }
  }

  const adaptive = app.android?.adaptiveIcon ?? {};
  for (const key of ['foregroundImage', 'backgroundImage', 'monochromeImage']) {
    const value = adaptive[key];
    if (!value) continue;
    const png = readPng(value.replace(/^\.\//, ''));
    if (!png) {
      fail('app.json', `android.adaptiveIcon.${key} (${value}) is missing or is not a PNG.`);
    } else if (png.width < 1024 || png.height < 1024) {
      warn(
        'assets',
        `${value} is ${png.width}×${png.height}. Android generates launcher icons up to ` +
          '1024×1024; a smaller source is upscaled and looks soft on a modern display.',
      );
    }
  }

  // Anything the plugins point at has to exist, or the build fails on the
  // build server rather than here.
  for (const plugin of app.plugins ?? []) {
    if (!Array.isArray(plugin)) continue;
    const [name, options] = plugin;
    if (name !== 'expo-splash-screen' || !options?.image) continue;
    if (!existsSync(join(ROOT, options.image.replace(/^\.\//, '')))) {
      fail('app.json', `expo-splash-screen image ${options.image} does not exist.`);
    }
  }
}

// ---------------------------------------------------------------------------
// eas.json — the profiles the release commands name
// ---------------------------------------------------------------------------

const eas = readJson('eas.json');

if (!eas) {
  fail('eas.json', 'missing. Run `eas build:configure`, or restore it from git.');
} else {
  for (const profile of ['development', 'preview', 'production']) {
    if (!eas.build?.[profile]) fail('eas.json', `build profile "${profile}" is missing.`);
  }
  if (!eas.submit?.production) {
    fail('eas.json', 'submit profile "production" is missing — `eas submit` has nothing to read.');
  }
  if (eas.build?.production?.distribution !== 'store') {
    fail('eas.json', 'build.production.distribution must be "store" for a store build.');
  }

  // Accounts change what the stores require of you. Apple's guideline
  // 5.1.1(v) and Google Play's data deletion policy both say that an app which
  // lets someone create an account must let them delete it from inside the
  // app. OpenMacro's sign-in is optional and off by default, which is why it
  // can ship without one — turning it on for a store build is what makes the
  // requirement bite, and it bites at review, days later.
  /**
   * Resolve a profile's env through `extends`, because a value inherited from
   * a base profile is just as present in the build as one written inline —
   * and this check missed exactly that the first time it mattered.
   */
  const resolvedEnv = (name, seen = new Set()) => {
    const profile = eas.build?.[name];
    if (!profile || seen.has(name)) return {};
    seen.add(name);
    const inherited = profile.extends ? resolvedEnv(profile.extends, seen) : {};
    return { ...inherited, ...(profile.env ?? {}) };
  };

  if (resolvedEnv('production').EXPO_PUBLIC_SUPABASE_URL) {
    warn(
      'eas.json',
      'the production profile configures Supabase, so the store build will offer Google ' +
        'sign-in. Both stores then require in-app account deletion (Apple 5.1.1(v)); ' +
        '`reset()` clears progress rows but does not delete the auth user. ' +
        'See docs/mobile-release.md#accounts-change-what-review-asks-for.',
    );
  }

  // EXPO_PUBLIC_* is inlined into the JavaScript bundle at build time and
  // ships to every device. A secret placed here is a published secret.
  const SECRET_SHAPES = /service_role|BEGIN [A-Z ]*PRIVATE KEY|secret|password|-----BEGIN/i;
  for (const [name, profile] of Object.entries(eas.build ?? {})) {
    for (const [key, value] of Object.entries(profile.env ?? {})) {
      if (typeof value !== 'string') continue;
      if (!key.startsWith('EXPO_PUBLIC_')) {
        warn(
          'eas.json',
          `build.${name}.env.${key} is not EXPO_PUBLIC_*, so the app cannot read it at runtime. ` +
            'It is only visible to the build itself.',
        );
      }
      if (SECRET_SHAPES.test(value) || SECRET_SHAPES.test(key)) {
        fail(
          'eas.json',
          `build.${name}.env.${key} looks like a secret. EXPO_PUBLIC_* is inlined into the ` +
            'bundle — anything here is readable on every device that installs the app.',
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// store.config.json — what App Store review actually reads
// ---------------------------------------------------------------------------

const store = readJson('store.config.json');

if (!store) {
  fail('store.config.json', 'missing — `eas metadata:push` has nothing to push.');
} else {
  const apple = store.apple ?? {};
  const info = apple.info?.['en-US'];

  if (store.configVersion !== 0) {
    fail('store.config.json', 'configVersion must be 0.');
  }

  if (app?.version && apple.version && apple.version !== app.version) {
    fail(
      'store.config.json',
      `apple.version is "${apple.version}" but app.json version is "${app.version}". ` +
        'Metadata is attached to a version string; a mismatch writes release notes onto the ' +
        'wrong version, or creates a version that has no build.',
    );
  }

  if (!info) {
    fail('store.config.json', 'apple.info["en-US"] is missing — the listing has no copy.');
  } else {
    // Apple's own limits. Exceeding one is rejected on push, not at review,
    // but only after everything else has been uploaded.
    const LIMITS = { title: 30, subtitle: 30, promoText: 170, description: 4000 };
    for (const [field, max] of Object.entries(LIMITS)) {
      const value = info[field];
      if (typeof value === 'string' && value.length > max) {
        fail('store.config.json', `apple.info.en-US.${field} is ${value.length} chars; max ${max}.`);
      }
    }

    // Keywords are one comma-joined field to Apple, capped at 100 characters
    // in total — a limit that is invisible when you are looking at a list.
    const keywords = (info.keywords ?? []).join(',');
    if (keywords.length > 100) {
      fail(
        'store.config.json',
        `apple.info.en-US.keywords joins to ${keywords.length} characters; Apple's limit is 100.`,
      );
    }

    for (const field of ['privacyPolicyUrl', 'supportUrl']) {
      if (!info[field]) {
        fail(
          'store.config.json',
          `apple.info.en-US.${field} is required by App Store review.`,
        );
      }
    }
  }

  if (!apple.review) {
    fail('store.config.json', 'apple.review is missing — review has no one to contact.');
  }

  // The placeholders this repository ships with. Pushing them sends nonsense
  // to App Store Connect under your name — but they do not stop a build, and a
  // TestFlight round trip should not wait on marketing copy.
  const placeholders = JSON.stringify(store).match(/REPLACE_[A-Z_]+/g);
  if (placeholders) {
    (strictMetadata ? fail : warn)(
      'store.config.json',
      `still contains placeholder(s): ${[...new Set(placeholders)].join(', ')}. ` +
        'Fill them in before `npm run metadata:push` — TestFlight does not read them.',
    );
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log('\nOpenMacro store preflight\n');

for (const { where, message } of warnings) {
  console.warn('\x1b[33m%s\x1b[0m', `  ! ${where}`);
  console.warn(`    ${message}`);
}

if (errors.length === 0) {
  const tail = warnings.length ? ` (${warnings.length} warning(s))` : '';
  console.log('\x1b[32m%s\x1b[0m', `✓ Ready to build and submit${tail}.\n`);
  process.exit(0);
}

console.error('\x1b[31m%s\x1b[0m', `\n✗ ${errors.length} blocking issue(s):`);
for (const { where, message } of errors) {
  console.error(`  • ${where}\n    ${message}`);
}
console.error('');
process.exit(1);
