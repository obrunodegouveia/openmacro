/**
 * Will this update reach anything?
 *
 * `runtimeVersion` uses the `fingerprint` policy, so an update is only ever
 * offered to a binary whose fingerprint matches it byte for byte. Publish at a
 * fingerprint nothing in the field carries and the update is not rejected — it
 * is simply never offered. `eas update` prints success, the dashboard shows a
 * new update, and no learner sees anything. It is the most expensive kind of
 * failure because it looks exactly like the success.
 *
 * That already happened here. Adding `i18n:fixspelling` to `package.json`
 * moved the iOS fingerprint from f010afee to b19b4646 and orphaned TestFlight
 * build 15; a hand-run `npm run update:store` would have shipped to nobody.
 * `fingerprint.config.js` fixed that particular cause. This script exists
 * because there will be others, and the class of bug is worth a guard rather
 * than a docs paragraph.
 *
 * ---------------------------------------------------------------------------
 * WHY A COMMITTED FILE RATHER THAN ASKING EAS
 * ---------------------------------------------------------------------------
 *
 * The obvious implementation asks EAS what is in the field. It does not work
 * here: these builds are made with `eas build --local` and uploaded with
 * `altool`, so EAS has no record of them at all — `eas build:list` returns
 * zero rows for a project with sixteen builds on TestFlight. The runtime
 * version of the thing people are actually running is knowable at build time
 * and nowhere afterwards, so it gets written down when it is known.
 *
 * `release/shipped-runtimes.json` is that record. `--record` writes it from
 * the current working tree, which is correct precisely when run from the same
 * commit the build was made from.
 *
 * A missing record warns rather than fails. A guard that blocks on data it
 * does not have teaches people to skip it, and skipping is the behaviour this
 * is trying to prevent.
 */

import { createFingerprintAsync } from '@expo/fingerprint';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const RECORD = fileURLToPath(new URL('../release/shipped-runtimes.json', import.meta.url));
const PLATFORMS = ['ios', 'android'];

const args = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : (args[at + 1] ?? true);
};
const channel = flag('channel', 'production');
const recording = args.includes('--record');
/**
 * Report without failing.
 *
 * Publishing is the place to refuse, and it still does. On a pull request the
 * useful thing is the opposite: a native change is a perfectly good change,
 * and failing the build for making one would train people to ignore this. What
 * costs reach is not knowing — merging something that quietly moved the
 * runtime version and finding out weeks later when an update goes nowhere. So
 * CI says which of the two this is, in words, and lets it through.
 */
const reporting = args.includes('--report');

/** The fingerprint the current tree would publish at, per platform. */
async function fingerprints() {
  const out = {};
  for (const platform of PLATFORMS) {
    out[platform] = (await createFingerprintAsync(ROOT, { platforms: [platform] })).hash;
  }
  return out;
}

function readRecord() {
  if (!existsSync(RECORD)) return {};
  return JSON.parse(readFileSync(RECORD, 'utf8'));
}

const now = await fingerprints();

if (recording) {
  const record = readRecord();
  const build = flag('build');
  // Record only the platforms actually released. A platform that has never
  // been submitted has nothing in the field, and writing a runtime version for
  // it would assert a reachability that does not exist.
  const only = flag('platform');
  const recordable = only ? [String(only)] : PLATFORMS;
  for (const platform of recordable) {
    if (!PLATFORMS.includes(platform)) throw new Error(`unknown platform: ${platform}`);
  }
  record[channel] = {
    ...(record[channel] ?? {}),
    ...Object.fromEntries(
      recordable.map((platform) => [
        platform,
        {
          runtimeVersion: now[platform],
          ...(build ? { build: String(build) } : {}),
          recordedAt: new Date().toISOString().slice(0, 10),
        },
      ]),
    ),
  };
  writeFileSync(RECORD, `${JSON.stringify(record, null, 2)}\n`);
  console.log(`\n  Recorded what channel "${channel}" is running:\n`);
  for (const platform of recordable) console.log(`    ${platform.padEnd(8)} ${now[platform]}`);
  console.log(`\n  ${RECORD.replace(ROOT, '')}\n`);
  process.exit(0);
}

const shipped = readRecord()[channel];

console.log(`\n  Update reachability — channel "${channel}"\n`);

if (!shipped) {
  console.log(`  ! No build recorded for "${channel}", so reachability cannot be checked.`);
  console.log(`    After a build, from the commit it was built at:\n`);
  console.log(`      node ./scripts/update-reachability.mjs --record --channel ${channel} --build <n>\n`);
  process.exit(0);
}

const broken = [];
for (const platform of PLATFORMS) {
  const was = shipped[platform]?.runtimeVersion;
  const is = now[platform];
  if (!was) {
    console.log(`  · ${platform.padEnd(8)} nothing released — not checked`);
  } else if (was === is) {
    console.log(`  ✓ ${platform.padEnd(8)} ${is}${shipped[platform].build ? `  (build ${shipped[platform].build})` : ''}`);
  } else {
    console.log(`  ✗ ${platform.padEnd(8)} shipped ${was}`);
    console.log(`    ${' '.repeat(8)} would publish at ${is}`);
    broken.push(platform);
  }
}

if (broken.length) {
  console.log(`\n  This update would reach nothing on ${broken.join(' and ')}.`);
  console.log(`  The fingerprint has moved since the build that is out there, so no`);
  console.log(`  installed app matches it. Publishing would report success and ship`);
  console.log(`  to nobody.\n`);
  console.log(`  Either make a new build and record it, or find what moved:\n`);
  console.log(`    npx expo-updates fingerprint:generate --platform ${broken[0]}\n`);
  if (reporting) {
    console.log(`  This is a native change. It needs a build, not an update.\n`);
    process.exit(0);
  }
  process.exit(1);
}

console.log(`\n  Reachable.\n`);
