#!/usr/bin/env node
/**
 * ============================================================================
 * Upload App Store screenshots — `npm run asc:screenshots`
 * ============================================================================
 *
 * Reads `apple.info.<locale>.screenshots` from `store.config.json` — the same
 * shape `eas metadata:push` reads — and uploads them.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS FOUR REQUESTS PER IMAGE
 * ---------------------------------------------------------------------------
 *
 * Apple does not accept a screenshot as a file upload. You reserve a slot, get
 * back a list of upload *operations* describing exactly which byte ranges to PUT
 * where, perform them, and then tell Apple the upload is finished and hand it an
 * MD5 of what you sent so it can check you sent what you said.
 *
 * That last step is the one worth knowing about: an image whose `uploaded: true`
 * is never PATCHed sits in App Store Connect forever as an empty grey box, and
 * the API reports the screenshot as existing. So this verifies the state Apple
 * reports afterwards — `COMPLETE`, not merely present — because "the POST
 * succeeded" and "there is a screenshot" are different claims.
 *
 * Existing sets are emptied first. Re-running would otherwise append, and the
 * order screenshots appear in on the store page is the order they were uploaded,
 * so a second run would leave eight images where four were intended and the new
 * ones behind the old.
 */

import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { basename, dirname, join, resolve } from 'node:path';

import { all, api, credentials, editableVersion, token } from './asc.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dryRun = process.argv.includes('--dry-run');

const store = JSON.parse(readFileSync(join(ROOT, 'store.config.json'), 'utf8'));
const info = store.apple?.info ?? {};

const bearer = token();
const { appId } = credentials();
const version = await editableVersion(appId, bearer);
if (!version) {
  console.error('\n\x1b[31m✗ No editable version.\x1b[0m\n');
  process.exit(1);
}

const localisations = await all(
  `/v1/appStoreVersions/${version.id}/appStoreVersionLocalizations?limit=50`,
  bearer,
);
const byLocale = new Map(localisations.map((entry) => [entry.attributes.locale, entry.id]));

let uploaded = 0;
let failed = 0;

for (const [locale, copy] of Object.entries(info)) {
  const sets = copy.screenshots ?? {};
  if (Object.keys(sets).length === 0) continue;

  const localisationId = byLocale.get(locale);
  if (!localisationId) {
    console.error(`\n\x1b[31m✗ ${locale} has no listing on App Store Connect — run asc:listing first.\x1b[0m`);
    failed += 1;
    continue;
  }

  console.log(`\n${locale}`);
  const existing = await all(
    `/v1/appStoreVersionLocalizations/${localisationId}/appScreenshotSets?limit=50`,
    bearer,
  );

  for (const [displayType, files] of Object.entries(sets)) {
    if (files.length === 0) continue;
    console.log(`  ${displayType}  (${String(files.length)} image(s))`);

    if (dryRun) {
      for (const file of files) console.log(`      ${file}`);
      // Counted even in a dry run, or the summary contradicts the list above it.
      uploaded += files.length;
      continue;
    }

    // One set per display type. Emptied rather than recreated, because the set
    // id is what the localisation points at.
    let set = existing.find((entry) => entry.attributes.screenshotDisplayType === displayType);
    if (set) {
      const old = await all(`/v1/appScreenshotSets/${set.id}/appScreenshots?limit=50`, bearer);
      for (const image of old) {
        await api(`/v1/appScreenshots/${image.id}`, { bearer, method: 'DELETE' });
      }
      if (old.length) console.log(`      cleared ${String(old.length)} existing`);
    } else {
      const created = await api('/v1/appScreenshotSets', {
        bearer,
        method: 'POST',
        body: {
          data: {
            type: 'appScreenshotSets',
            attributes: { screenshotDisplayType: displayType },
            relationships: {
              appStoreVersionLocalization: {
                data: { type: 'appStoreVersionLocalizations', id: localisationId },
              },
            },
          },
        },
      });
      set = created.data;
    }

    for (const relative of files) {
      const path = join(ROOT, relative.replace(/^\.\//, ''));
      try {
        await uploadOne(set.id, path);
        console.log(`      \x1b[32m✓\x1b[0m ${basename(path)}`);
        uploaded += 1;
      } catch (error) {
        console.error(`      \x1b[31m✗\x1b[0m ${basename(path)}: ${error.message.split('\n')[0]}`);
        failed += 1;
      }
    }
  }
}

/** Reserve, PUT every operation, then commit with a checksum. */
async function uploadOne(setId, path) {
  const bytes = readFileSync(path);
  const { size } = statSync(path);

  const reservation = await api('/v1/appScreenshots', {
    bearer,
    method: 'POST',
    body: {
      data: {
        type: 'appScreenshots',
        attributes: { fileSize: size, fileName: basename(path) },
        relationships: { appScreenshotSet: { data: { type: 'appScreenshotSets', id: setId } } },
      },
    },
  });

  const id = reservation.data.id;
  const operations = reservation.data.attributes.uploadOperations ?? [];
  if (operations.length === 0) throw new Error('Apple returned no upload operations');

  for (const operation of operations) {
    const headers = Object.fromEntries(
      (operation.requestHeaders ?? []).map((header) => [header.name, header.value]),
    );
    const response = await fetch(operation.url, {
      method: operation.method,
      headers,
      body: bytes.subarray(operation.offset, operation.offset + operation.length),
    });
    if (!response.ok) {
      throw new Error(`upload ${operation.method} → ${String(response.status)}`);
    }
  }

  await api(`/v1/appScreenshots/${id}`, {
    bearer,
    method: 'PATCH',
    body: {
      data: {
        type: 'appScreenshots',
        id,
        attributes: { uploaded: true, sourceFileChecksum: createHash('md5').update(bytes).digest('hex') },
      },
    },
  });

  /**
   * Apple processes the image after the commit, so the state is briefly
   * `UPLOAD_COMPLETE` before it becomes `COMPLETE`. Either is a real image; what
   * must not pass is a failure, which is the state an unverified upload leaves
   * behind as a grey placeholder in App Store Connect.
   */
  const check = await api(`/v1/appScreenshots/${id}`, { bearer });
  const state = check.data.attributes.assetDeliveryState?.state;
  if (state && !['COMPLETE', 'UPLOAD_COMPLETE'].includes(state)) {
    const errors = check.data.attributes.assetDeliveryState?.errors ?? [];
    throw new Error(`${state}${errors.length ? ': ' + JSON.stringify(errors) : ''}`);
  }
}

console.log('');
if (failed) {
  console.error(`\x1b[31m✗ ${String(failed)} failed, ${String(uploaded)} uploaded.\x1b[0m\n`);
  process.exit(1);
}
console.log(
  uploaded
    ? `\x1b[32m✓ ${String(uploaded)} screenshot(s) ${dryRun ? 'would be uploaded' : 'uploaded'}.\x1b[0m\n`
    : '\x1b[33m! Nothing to upload — no screenshots listed in store.config.json.\x1b[0m\n',
);
