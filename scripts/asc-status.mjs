#!/usr/bin/env node
/**
 * ============================================================================
 * Is this app submittable? — `npm run asc:status`
 * ============================================================================
 *
 * App Store Connect's own answer to "what is still missing" is a grey Submit
 * button. It does not enumerate the gaps, several of the things it wants live on
 * different resources from the version you are editing, and two of them are not
 * in this repository at all. So every unset piece of a submission is invisible
 * from here unless something goes and asks.
 *
 * This asks. It changes nothing, so it is safe to run at any time, and it prints
 * one line per requirement with what is actually there.
 *
 * ---------------------------------------------------------------------------
 * WHAT IT CANNOT SEE
 * ---------------------------------------------------------------------------
 *
 * The App Privacy questionnaire. Apple exposes it only on the `iris` endpoint
 * behind a web session — an API key gets 401 there and 404 on the public API,
 * which is checked below rather than assumed, so the day Apple publishes it this
 * script starts reporting it instead of quietly claiming it cannot be known.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { api, all, credentials, editableVersion, token } from './asc.mjs';

const store = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'store.config.json'), 'utf8'),
);

const bearer = token();
const { appId } = credentials();

const rows = [];
/** @param {boolean|null} ok @param {string} what @param {string} detail */
const row = (ok, what, detail) => rows.push({ ok, what, detail });

const version = await editableVersion(appId, bearer);
if (!version) {
  console.error('\n\x1b[31m✗ This app has no editable version.\x1b[0m\n');
  process.exit(1);
}
const v = version.id;
console.log(`\nOpenMacro — App Store submission readiness`);
console.log(`version ${version.attributes.versionString} · ${version.attributes.appStoreState}\n`);

// ---- app-level ------------------------------------------------------------

const infos = await api(`/v1/apps/${appId}/appInfos?include=primaryCategory,secondaryCategory`, {
  bearer,
});
const info = infos.data.find((i) => i.attributes.appStoreState !== 'READY_FOR_SALE') ?? infos.data[0];
const primary = info?.relationships?.primaryCategory?.data?.id;
const secondary = info?.relationships?.secondaryCategory?.data?.id;
row(Boolean(primary), 'Category', primary ? `${primary}${secondary ? ' + ' + secondary : ''}` : 'not set');

const rating = await api(`/v1/appInfos/${info.id}/ageRatingDeclaration`, { bearer }).catch(() => null);
/**
 * Three fields are null for a reason rather than by omission.
 *
 * `kidsAgeBand` is only set for the Kids category. `developerAgeRatingInfoUrl`
 * is optional. `gracRatingClassificationNumber` is a registration number
 * issued by Korea's Game Rating and Administration Committee — it applies to
 * games distributed there, and there is nothing for an education app to put
 * in it.
 *
 * The last one cost an hour: withdrawing a version from review creates a
 * fresh `appInfo` in PREPARE_FOR_SUBMISSION whose GRAC field is null, so a
 * check that had been green for weeks started reporting a missing answer at
 * the exact moment somebody needed to resubmit.
 */
const notApplicable = ['kidsAgeBand', 'developerAgeRatingInfoUrl', 'gracRatingClassificationNumber'];
const unanswered = Object.entries(rating?.data?.attributes ?? {})
  .filter(([key, value]) => value === null && !notApplicable.includes(key))
  .map(([key]) => key);
row(
  Boolean(rating?.data) && unanswered.length === 0,
  'Age rating',
  unanswered.length ? `${String(unanswered.length)} question(s) unanswered` : 'complete',
);

const price = await api(`/v1/appPriceSchedules/${appId}?include=manualPrices`, { bearer }).catch(
  () => null,
);
const priceCount = price?.data?.relationships?.manualPrices?.data?.length ?? 0;
row(priceCount > 0, 'Price', priceCount > 0 ? `${String(priceCount)} price entry(ies)` : 'not set');

// ---- the version ----------------------------------------------------------

const locales = await all(`/v1/appStoreVersions/${v}/appStoreVersionLocalizations?limit=50`, bearer);
row(locales.length > 0, 'Listing languages', locales.map((l) => l.attributes.locale).join(', ') || 'none');

/**
 * Screenshots, per language and per required slot.
 *
 * `supportsTablet` is why the iPad set is not optional — an app that says it runs
 * on iPad has to show itself running on one — but this script reads Apple's
 * record rather than app.json, so it reports what is there and leaves the
 * requirement to `preflight:store`, which does read app.json.
 */
for (const locale of locales) {
  const sets = await all(
    `/v1/appStoreVersionLocalizations/${locale.id}/appScreenshotSets?limit=50&include=appScreenshots`,
    bearer,
  );
  const summary = sets.length
    ? sets
        .map(
          (set) =>
            `${set.attributes.screenshotDisplayType}×${String(
              set.relationships?.appScreenshots?.data?.length ?? 0,
            )}`,
        )
        .join(', ')
    : 'none';
  row(sets.length > 0, `Screenshots (${locale.attributes.locale})`, summary);
}

/**
 * Version and app attributes that block a submission and are easy to miss,
 * because App Store Connect asks for them in a dialog at submission time rather
 * than on a page you can see is unfinished.
 *
 * Every one of these was null while the rest of the record was green, which is
 * exactly the failure this script exists to prevent: a readiness report that
 * reports readiness and is not looking.
 */
const versionAttributes = (await api(`/v1/appStoreVersions/${v}`, { bearer })).data.attributes;
const appAttributes = (await api(`/v1/apps/${appId}`, { bearer })).data.attributes;

row(Boolean(versionAttributes.copyright), 'Copyright', versionAttributes.copyright ?? 'not set');
row(
  versionAttributes.usesIdfa !== null,
  'Advertising identifier',
  versionAttributes.usesIdfa === null
    ? 'unanswered — Apple asks at submission'
    : versionAttributes.usesIdfa
      ? 'declares IDFA use'
      : 'no IDFA',
);
row(
  Boolean(appAttributes.contentRightsDeclaration),
  'Third-party content rights',
  appAttributes.contentRightsDeclaration ?? 'undeclared — Apple asks at submission',
);

/**
 * Release behaviour, checked against the intent written in store.config.json
 * rather than against a constant — the two disagreeing is the bug worth
 * catching, not either value on its own.
 */
const wantsAutomatic = store.apple?.release?.automaticRelease;
const releaseMatches =
  wantsAutomatic === undefined ||
  (wantsAutomatic ? versionAttributes.releaseType === 'AFTER_APPROVAL' : versionAttributes.releaseType === 'MANUAL');
row(
  releaseMatches,
  'Release type',
  releaseMatches
    ? versionAttributes.releaseType
    : `${versionAttributes.releaseType}, but store.config.json asks for automaticRelease: ${String(wantsAutomatic)}`,
);

const review = await api(`/v1/appStoreVersions/${v}/appStoreReviewDetail`, { bearer }).catch(
  () => null,
);
const r = review?.data?.attributes;
const contactComplete = Boolean(r?.contactFirstName && r?.contactLastName && r?.contactEmail && r?.contactPhone);
row(
  contactComplete,
  'App Review contact',
  r ? `${r.contactFirstName ?? '—'} ${r.contactLastName ?? '—'} · ${r.contactEmail ?? 'no email'} · ${r.contactPhone ?? 'no phone'}` : 'not set',
);
/**
 * Not just "are there notes" but "are they the notes we wrote".
 *
 * Apple freezes this record once it exists unless the full contact is supplied,
 * so the notes on Apple can silently fall behind `store.config.json` — and notes
 * describing a feature the app no longer has is worse than no notes at all.
 */
const localNotes = store.apple?.review?.notes;
row(
  Boolean(r?.notes) && r.notes === localNotes,
  'App Review notes',
  !r?.notes
    ? 'not set'
    : r.notes === localNotes
      ? `${String(r.notes.length)} characters, matching store.config.json`
      : 'STALE — differs from store.config.json',
);

const builds = await all(
  `/v1/apps/${appId}/builds?limit=5&fields[builds]=version,processingState,expired`,
  bearer,
);
const usable = builds.filter((b) => b.attributes.processingState === 'VALID' && !b.attributes.expired);
row(usable.length > 0, 'Builds uploaded', usable.map((b) => b.attributes.version).join(', ') || 'none');

const attached = await api(`/v1/appStoreVersions/${v}/build`, { bearer }).catch(() => null);
row(Boolean(attached?.data), 'Build attached to 1.0', attached?.data ? 'yes' : 'no');

// ---- what the API will not tell us ---------------------------------------

const privacyReachable = await api(`/v1/apps/${appId}/appDataUsages?limit=1`, { bearer })
  .then(() => true)
  .catch(() => false);
row(
  null,
  'App Privacy',
  privacyReachable
    ? 'the API now exposes this — teach this script to read it'
    : 'browser only (Apple serves it from `iris`, which rejects API keys)',
);

// ---- report ---------------------------------------------------------------

const width = Math.max(...rows.map((entry) => entry.what.length));
for (const { ok, what, detail } of rows) {
  const mark = ok === null ? '\x1b[33m?\x1b[0m' : ok ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';
  console.log(`  ${mark} ${what.padEnd(width)}  ${detail}`);
}

const missing = rows.filter((entry) => entry.ok === false);
const manual = rows.filter((entry) => entry.ok === null);
console.log('');
if (missing.length === 0) {
  console.log('\x1b[32m✓ Everything this can check is in place.\x1b[0m');
} else {
  console.log(`\x1b[31m✗ ${String(missing.length)} thing(s) still needed:\x1b[0m`);
  for (const entry of missing) console.log(`    · ${entry.what}`);
}
if (manual.length) {
  console.log(`\x1b[33m  ${String(manual.length)} thing(s) only a browser can set.\x1b[0m`);
}
console.log('');
process.exit(missing.length ? 1 : 0);
