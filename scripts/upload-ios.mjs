#!/usr/bin/env node
/**
 * ============================================================================
 * Upload an iOS build to App Store Connect — `npm run upload:ios <path.ipa>`
 * ============================================================================
 *
 * Wraps `xcrun altool`, which is what actually delivers a build here.
 *
 * `eas submit` is the obvious tool and it does not work on this project: it
 * reports "Uploaded to EAS Submit" within a second, creates the TestFlight
 * group, and then sits idle — measured at 0% CPU for 33 minutes — without ever
 * transferring the archive to Apple or registering a build. `altool` uploaded
 * the same 17 MB archive in five seconds. It also needs no EAS plan, which
 * matters on a free tier whose iOS allowance is already spent.
 *
 * Credentials come from an App Store Connect API key, so this is
 * non-interactive: no Apple ID, no 2FA, safe to run from a script.
 *
 *   ASC_KEY_ID     key id, e.g. Z74G939G4Z
 *   ASC_ISSUER_ID  issuer id (one per account, not per key)
 *
 * `altool` locates the key by name, so the .p8 must sit in one of the
 * directories it searches — `~/.appstoreconnect/private_keys/` is the usual
 * one — named exactly `AuthKey_<ASC_KEY_ID>.p8`.
 *
 * Validation runs first. It catches the things Apple would otherwise reject
 * *after* the transfer: a missing icon, a bad Info.plist, an unsigned binary.
 */

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Key and issuer from the environment, falling back to `eas.json`.
 *
 * They were environment-only, which meant a release could fail at the upload —
 * after the twenty-minute build — because two variables were not exported in
 * this particular shell. The same two values are already in the
 * `submit.production.ios` block that `eas submit` reads, so there is no reason
 * for this to be the one step that needs them typed again.
 */
function fromEasJson() {
  try {
    const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
    const ios = JSON.parse(readFileSync(join(root, 'eas.json'), 'utf8')).submit?.production?.ios;
    return { keyId: ios?.ascApiKeyId, issuerId: ios?.ascApiKeyIssuerId };
  } catch {
    return {};
  }
}

const ipa = process.argv[2];
const configured = fromEasJson();
const KEY_ID = process.env.ASC_KEY_ID ?? configured.keyId;
const ISSUER_ID = process.env.ASC_ISSUER_ID ?? configured.issuerId;

function die(message) {
  console.error(`\x1b[31m✗ ${message}\x1b[0m\n`);
  process.exit(1);
}

if (!ipa) {
  die('Usage: npm run upload:ios -- <path/to/build.ipa>');
}
if (!existsSync(resolve(ipa))) {
  die(`No such file: ${ipa}`);
}
if (!KEY_ID || !ISSUER_ID) {
  die(
    'No App Store Connect key. Set ASC_KEY_ID and ASC_ISSUER_ID, or fill in ' +
      'submit.production.ios in eas.json. See docs/mobile-release.md.',
  );
}

// Fail here rather than inside altool, whose error for a missing key is opaque.
const keyName = `AuthKey_${KEY_ID}.p8`;
const searched = [
  join(process.cwd(), 'private_keys', keyName),
  join(homedir(), 'private_keys', keyName),
  join(homedir(), '.private_keys', keyName),
  join(homedir(), '.appstoreconnect', 'private_keys', keyName),
];
if (!searched.some(existsSync)) {
  die(
    `${keyName} not found. altool looks only in:\n    ${searched.join('\n    ')}`,
  );
}

/** @param {string} mode `--validate-app` or `--upload-app` */
function altool(mode) {
  const result = spawnSync(
    'xcrun',
    ['altool', mode, '-f', resolve(ipa), '-t', 'ios', '--apiKey', KEY_ID, '--apiIssuer', ISSUER_ID],
    { encoding: 'utf8' },
  );
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  return { ok: result.status === 0, output };
}

console.log(`\nValidating ${ipa} …`);
const validation = altool('--validate-app');
if (!validation.ok) {
  console.error(validation.output.trim());
  die('Validation failed — not uploading.');
}
console.log('\x1b[32m✓ Validated\x1b[0m');

console.log('\nUploading …');
const upload = altool('--upload-app');
console.log(
  upload.output
    .split('\n')
    .filter((l) => /SUCCEEDED|ERROR|Delivery UUID|Transferred/i.test(l))
    .join('\n')
    .trim(),
);
if (!upload.ok) die('Upload failed.');

console.log(
  '\n\x1b[32m✓ Uploaded.\x1b[0m Apple processes the build for 10–30 minutes, ' +
    'then it appears under TestFlight.\n',
);
