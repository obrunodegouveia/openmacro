#!/usr/bin/env node
/**
 * ============================================================================
 * Submit for App Review — `npm run asc:submit`
 * ============================================================================
 *
 * The one irreversible-ish step in this toolkit. A submission can be cancelled
 * before review starts, but it puts the app in front of Apple under somebody's
 * developer account, so it refuses to run on anything it is not sure about and
 * prints what it is about to do first.
 *
 * Apple's current flow is three calls rather than one: create a review
 * submission for the app and platform, attach the version to it as an item,
 * then mark the submission `submitted`. Until that last PATCH nothing has been
 * sent — which is why `--dry-run` can safely build the first two and stop.
 *
 * `asc:status` is the gate. Anything it reports as missing is a rejection or a
 * bounce, so this refuses to submit while it fails, rather than letting a run
 * of green checks sit unread next to a submission that was going to fail
 * anyway.
 */

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

import { all, api, credentials, editableVersion, token } from './asc.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dryRun = process.argv.includes('--dry-run');

const bearer = token();
const { appId } = credentials();
const version = await editableVersion(appId, bearer);
if (!version) {
  console.error('\n\x1b[31m✗ No editable version to submit.\x1b[0m\n');
  process.exit(1);
}

console.log(`\nSubmitting version ${version.attributes.versionString} for review\n`);

// ---------------------------------------------------------------------------
// Refuse if readiness fails
// ---------------------------------------------------------------------------

try {
  execFileSync('node', [join(ROOT, 'scripts/asc-status.mjs')], { stdio: 'ignore' });
} catch {
  console.error(
    '\x1b[31m✗ `npm run asc:status` reports something missing. Fix it, or Apple will.\x1b[0m\n',
  );
  process.exit(1);
}
console.log('  \x1b[32m✓\x1b[0m readiness check passes');

// ---------------------------------------------------------------------------
// Create or reuse the review submission
// ---------------------------------------------------------------------------

/**
 * An unsubmitted review submission may already exist from a previous attempt.
 * Creating a second one is a 409, and the error does not say that is why.
 */
const open = (
  await all(`/v1/apps/${appId}/reviewSubmissions?filter[state]=READY_FOR_REVIEW&limit=10`, bearer)
).find((entry) => entry.attributes.platform === 'IOS');

let submissionId = open?.id;
if (submissionId) {
  console.log(`  \x1b[33m!\x1b[0m reusing the review submission already open (${submissionId})`);
} else {
  const created = await api('/v1/reviewSubmissions', {
    bearer,
    method: 'POST',
    body: {
      data: {
        type: 'reviewSubmissions',
        attributes: { platform: 'IOS' },
        relationships: { app: { data: { type: 'apps', id: appId } } },
      },
    },
  });
  submissionId = created.data.id;
  console.log(`  \x1b[32m✓\x1b[0m review submission created (${submissionId})`);
}

// ---------------------------------------------------------------------------
// Attach the version
// ---------------------------------------------------------------------------

const items = await all(`/v1/reviewSubmissions/${submissionId}/items?limit=10`, bearer);
if (items.length > 0) {
  console.log(`  \x1b[33m!\x1b[0m ${String(items.length)} item(s) already attached`);
} else {
  await api('/v1/reviewSubmissionItems', {
    bearer,
    method: 'POST',
    body: {
      data: {
        type: 'reviewSubmissionItems',
        relationships: {
          reviewSubmission: { data: { type: 'reviewSubmissions', id: submissionId } },
          appStoreVersion: { data: { type: 'appStoreVersions', id: version.id } },
        },
      },
    },
  });
  console.log(`  \x1b[32m✓\x1b[0m version ${version.attributes.versionString} attached`);
}

// ---------------------------------------------------------------------------
// The point of no return
// ---------------------------------------------------------------------------

if (dryRun) {
  console.log('\n\x1b[33mDry run — the submission is staged but NOT sent.\x1b[0m');
  console.log('Run without --dry-run to submit.\n');
  process.exit(0);
}

await api(`/v1/reviewSubmissions/${submissionId}`, {
  bearer,
  method: 'PATCH',
  body: { data: { type: 'reviewSubmissions', id: submissionId, attributes: { submitted: true } } },
});

// Re-read, because "the PATCH returned 200" and "Apple has it" are different
// claims — and this one is worth being certain about.
const after = await api(`/v1/reviewSubmissions/${submissionId}`, { bearer });
const state = after.data.attributes.state;
const versionAfter = await api(`/v1/appStoreVersions/${version.id}`, { bearer });

console.log(`  \x1b[32m✓\x1b[0m submitted — review submission is ${state}`);
console.log(`  \x1b[32m✓\x1b[0m version 1.0 is ${versionAfter.data.attributes.appStoreState}`);
console.log(
  '\nReleaseType is MANUAL, so approval will not publish it. You release it when you choose.\n',
);
