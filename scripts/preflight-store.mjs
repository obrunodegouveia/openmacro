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

/**
 * Where the store build gets its Supabase configuration from, or null if it
 * does not get one. Set while reading `eas.json`; read by the account and
 * sign-in checks further down, which only apply to a build that has accounts.
 */
let accountsExpected = null;

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

/** Apple's App Store locale for a bundle language, e.g. `en` → `en-US`. */
function APPLE_LOCALE(language, overrides) {
  return overrides[language] ?? language;
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

  /**
   * Whether the store build will have accounts at all.
   *
   * This used to read `eas.json` alone and answer no — while the production
   * build has had Supabase all along, because the value lives in the EAS
   * `production` environment (`eas env:list production`), not in this file. A
   * check that looks in one of two places and reports "not configured" is worse
   * than no check, so it consults both and says which one it found.
   */
  const profileEnv = resolvedEnv('production').EXPO_PUBLIC_SUPABASE_URL;
  const hostedEnv = eas.build?.production?.environment;
  if (profileEnv) {
    accountsExpected = 'eas.json';
  } else if (hostedEnv) {
    accountsExpected = `the EAS "${hostedEnv}" environment`;
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
// Sign-in: every surface has to agree, including one that is not in this repo
// ---------------------------------------------------------------------------

/**
 * Guideline 4.8 and the three-way split it creates.
 *
 * An app offering a third-party login service must also offer one that
 * collects no more than name and email and does not track the person. Sign in
 * with Apple is that option, and offering it takes three things that live in
 * three different places: the entitlement (`app.json`), the client code (the
 * plugin and the module), and the provider switched on in the Supabase
 * dashboard. Two out of three is a sign-in button that throws.
 *
 * A broken alternative is worse than an absent one — Apple reads it as a 4.8
 * failure *and* a crash — so the ones this can prove are blocking.
 */
if (app && accountsExpected) {
  const hasApplePlugin = (app.plugins ?? []).some(
    (plugin) => (Array.isArray(plugin) ? plugin[0] : plugin) === 'expo-apple-authentication',
  );
  const pkg = readJson('package.json');
  const hasAppleModule = Boolean(pkg?.dependencies?.['expo-apple-authentication']);

  if (!app.ios?.usesAppleSignIn) {
    fail(
      'app.json',
      `the store build offers Google sign-in (Supabase comes from ${accountsExpected}), so ` +
        'App Store guideline 4.8 requires an equivalent privacy-preserving option. Set ' +
        'ios.usesAppleSignIn and offer Sign in with Apple, or ship with no accounts at all.',
    );
  }
  if (app.ios?.usesAppleSignIn && !hasApplePlugin) {
    fail(
      'app.json',
      'ios.usesAppleSignIn is set but "expo-apple-authentication" is not in plugins, so the ' +
        'entitlement never reaches the binary and `isAvailableAsync()` answers false in the ' +
        'build you ship.',
    );
  }
  if (app.ios?.usesAppleSignIn && !hasAppleModule) {
    fail(
      'package.json',
      'ios.usesAppleSignIn is set but expo-apple-authentication is not a dependency.',
    );
  }
}

// ---------------------------------------------------------------------------
// Screenshots — the only part of the listing that is not text
// ---------------------------------------------------------------------------

/**
 * Required sizes, keyed by App Store Connect's own display type.
 *
 * Apple accepts two pixel sizes per slot because two generations of hardware
 * share it, and rejects anything else at push time. `supportsTablet` is what
 * makes the iPad set mandatory rather than optional — an app that says it runs
 * on iPad has to show itself running on one.
 */
const SCREENSHOT_SLOTS = {
  APP_IPHONE_67: {
    label: '6.9" iPhone',
    sizes: [
      [1320, 2868],
      [1290, 2796],
    ],
  },
  APP_IPAD_PRO_3GEN_129: {
    label: '13" iPad',
    sizes: [
      [2064, 2752],
      [2048, 2732],
    ],
    onlyIfTablet: true,
  },
};

if (store?.apple?.info) {
  for (const [locale, info] of Object.entries(store.apple.info)) {
    const sets = info.screenshots ?? {};

    for (const [slot, spec] of Object.entries(SCREENSHOT_SLOTS)) {
      if (spec.onlyIfTablet && !app?.ios?.supportsTablet) continue;

      const shots = sets[slot] ?? [];
      if (shots.length === 0) {
        (strictMetadata ? fail : warn)(
          'store.config.json',
          `apple.info.${locale} has no ${spec.label} screenshots (${slot}). A submission ` +
            'without them is rejected before a human sees the app, and they are the one part ' +
            'of the listing that cannot be written — they are pictures of it running.',
        );
        continue;
      }

      for (const relative of shots) {
        const png = readPng(relative.replace(/^\.\//, ''));
        if (!png) {
          fail('store.config.json', `screenshot ${relative} is missing or is not a PNG.`);
          continue;
        }
        const matches = spec.sizes.some(([w, h]) => png.width === w && png.height === h);
        if (!matches) {
          fail(
            'assets',
            `${relative} is ${png.width}×${png.height}; ${slot} accepts only ` +
              `${spec.sizes.map(([w, h]) => `${w}×${h}`).join(' or ')}.`,
          );
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Languages — the binary and the listing should claim the same ones
// ---------------------------------------------------------------------------

/**
 * A language in `CFBundleLocalizations` with no App Store listing means the app
 * speaks Portuguese and its store page does not, which costs nothing at review
 * and everything in discovery: the App Store will not show a localised page it
 * does not have. The reverse — a listing for a language the binary does not
 * declare — is the one that looks like a mistake to a reviewer.
 */
if (app && store?.apple?.info) {
  const APP_STORE_LOCALE = { en: 'en-US' };
  const declared = app.ios?.infoPlist?.CFBundleLocalizations ?? [];
  const listed = Object.keys(store.apple.info);

  for (const language of declared) {
    const expected = APPLE_LOCALE(language, APP_STORE_LOCALE);
    if (!listed.includes(expected)) {
      warn(
        'store.config.json',
        `the app declares "${language}" in CFBundleLocalizations but there is no ` +
          `apple.info["${expected}"], so the App Store has no page in that language.`,
      );
    }
  }
  for (const locale of listed) {
    const language = locale.startsWith('en') ? 'en' : locale;
    if (!declared.includes(language)) {
      warn(
        'app.json',
        `there is an App Store listing for "${locale}" but the app does not declare ` +
          `"${language}" in ios.infoPlist.CFBundleLocalizations.`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// The one check that needs the network
// ---------------------------------------------------------------------------

/**
 * Is the Apple provider actually switched on in Supabase?
 *
 * Everything above is in this repository. This is not: the provider is a toggle
 * in the Supabase dashboard, and with it off `signInWithIdToken` rejects a
 * perfectly valid Apple token. The app then ships a Sign in with Apple button
 * that fails every time it is pressed, which fails guideline 4.8 more
 * comprehensively than not offering Apple at all — a reviewer sees the required
 * alternative, taps it, and watches it error.
 *
 * `/auth/v1/settings` is a public endpoint that lists the enabled providers, so
 * this is cheap and needs no secret. It reads the URL from `.env`, which is the
 * local copy of what the EAS environment holds; a build that gets its values
 * only from EAS still gets the same answer, because it is the same project.
 *
 * Unreachable is a warning, not a failure. A preflight that cannot run on a
 * train is a preflight people learn to skip.
 */
function dotEnv() {
  const path = join(ROOT, '.env');
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (match) out[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return out;
}

if (app?.ios?.usesAppleSignIn && accountsExpected) {
  const local = dotEnv();
  const url = local.EXPO_PUBLIC_SUPABASE_URL;
  const key = local.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    warn(
      '.env',
      'cannot check which sign-in providers Supabase has enabled without ' +
        'EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY here. The store build ' +
        `reads them from ${accountsExpected}; this check reads .env.`,
    );
  } else {
    try {
      const response = await fetch(`${url}/auth/v1/settings`, {
        headers: { apikey: key },
        signal: AbortSignal.timeout(6000),
      });
      if (!response.ok) throw new Error(`HTTP ${String(response.status)}`);
      const settings = await response.json();
      if (settings.external?.apple !== true) {
        const enabled = Object.entries(settings.external ?? {})
          .filter(([, on]) => on)
          .map(([name]) => name);
        fail(
          'supabase',
          'the app offers Sign in with Apple but the Supabase project has the Apple provider ' +
            `switched off (enabled: ${enabled.join(', ') || 'none'}). Every tap will error. ` +
            'Enable it under Authentication → Sign In / Providers → Apple and add the bundle ' +
            `id "${app.ios?.bundleIdentifier ?? ''}" to its authorised client ids — a native ` +
            'iOS sign-in needs no Services ID and no secret key.',
        );
      }
    } catch (error) {
      warn(
        'supabase',
        `could not reach ${url}/auth/v1/settings to check the enabled providers ` +
          `(${error.message}). Verify by hand that Apple is on before submitting.`,
      );
    }
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
