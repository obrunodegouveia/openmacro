#!/usr/bin/env node
/**
 * ============================================================================
 * Push the app-level record — `npm run asc:appinfo`
 * ============================================================================
 *
 * Categories and the age-rating questionnaire. Both hang off App Store
 * Connect's `appInfo` rather than off a version, both block a submission while
 * unset, and neither depends on anything still unwritten — which is what makes
 * them one job.
 *
 * Apple will not accept a submission while any age-rating question is
 * unanswered, and an unanswered question is invisible: App Store Connect shows
 * the section as simply not filled in, with no list of what is missing.
 *
 * `eas metadata:push` normally does both, from the same `store.config.json`
 * this script reads. It is separate for two reasons.
 *
 * The first is ordering. `metadata:push` writes the whole listing at once,
 * including the App Review contact, so it cannot run until there is a real name
 * and phone number to send. The age rating has no such dependency, and there is
 * no reason for it to wait on marketing copy.
 *
 * The second is that Apple added questions in 2025 — advertising, loot boxes,
 * messaging, user-generated content, social media, age assurance — and a tool
 * that predates them pushes a declaration that is complete by its own schema
 * and still incomplete by Apple's. This script asserts the opposite: after
 * writing, it re-reads the declaration and fails if *any* field came back null.
 * That check is the point of the script. It is the difference between "we sent
 * what we had" and "there is nothing left unanswered".
 *
 * `--dry-run` prints the requests without sending them.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

import { api, credentials, token } from './asc.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dryRun = process.argv.includes('--dry-run');

/**
 * Questions that may legitimately stay null, so the completeness check below
 * does not demand an answer that does not exist.
 *
 * `kidsAgeBand` applies only to an app in the Kids Category, which this is not
 * — answering it would put OpenMacro somewhere it does not belong. The URL is
 * for a developer who wants to explain a rating; we have nothing to explain.
 */
const OPTIONAL = new Set(['kidsAgeBand', 'developerAgeRatingInfoUrl']);

/** Fields Apple returns but does not accept back. */
const READ_ONLY = new Set(['ageRatingOverrideV2', 'apiKeyId', 'userFirstName', 'userLastName', 'userEmail']);

const store = JSON.parse(readFileSync(join(ROOT, 'store.config.json'), 'utf8'));
const advisory = store.apple?.advisory;
if (!advisory) {
  console.error('\x1b[31m✗ store.config.json has no apple.advisory block.\x1b[0m\n');
  process.exit(1);
}

/**
 * `categories` is written the way `eas metadata` accepts it — a flat pair, or a
 * pair where either entry is itself `[category, subcategory]`. Only the
 * category matters here; subcategories exist for Games and Stickers, and an app
 * in neither has none to send.
 */
const [primary, secondary] = (store.apple?.categories ?? []).map((entry) =>
  Array.isArray(entry) ? entry[0] : entry,
);

const bearer = token();
const { appId } = credentials();

/**
 * The declaration hangs off `appInfos`, not off the version.
 *
 * It used to be the other way round, and the old relationship still answers
 * 404 rather than redirecting — which reads exactly like "no age rating on this
 * app" and is why this is spelled out instead of guessed.
 */
const infos = await api(`/v1/apps/${appId}/appInfos`, { bearer });
const info = infos.data.find((i) => i.attributes.appStoreState !== 'READY_FOR_SALE') ?? infos.data[0];
if (!info) {
  console.error('\x1b[31m✗ This app has no appInfo record.\x1b[0m\n');
  process.exit(1);
}

const before = await api(`/v1/appInfos/${info.id}/ageRatingDeclaration`, { bearer });
const declarationId = before?.data?.id;
if (!declarationId) {
  console.error('\x1b[31m✗ No ageRatingDeclaration on appInfo ' + info.id + '.\x1b[0m\n');
  process.exit(1);
}

// Only send what Apple actually knows about, so one unrecognised key cannot
// reject the whole declaration and leave every question unanswered.
const known = Object.keys(before.data.attributes);
const attributes = {};
const unknown = [];
for (const [key, value] of Object.entries(advisory)) {
  if (READ_ONLY.has(key)) continue;
  if (known.includes(key)) attributes[key] = value;
  else unknown.push(key);
}

console.log(`\nAge rating → appInfo ${info.id} (declaration ${declarationId})`);
console.log(`  sending ${String(Object.keys(attributes).length)} field(s)`);
if (unknown.length) {
  console.log(
    `\x1b[33m  ! store.config.json answers ${unknown.join(', ')}, which this app's ` +
      'declaration has no field for. Not sent.\x1b[0m',
  );
}

if (dryRun) {
  console.log(JSON.stringify(attributes, null, 2));
  console.log(`categories → ${primary ?? '(none)'}${secondary ? ' + ' + secondary : ''}`);
  console.log('\nDry run — nothing sent.\n');
  process.exit(0);
}

// The write goes to the resource, not to the relationship that found it:
// PATCHing `/appInfos/{id}/ageRatingDeclaration` answers 405.
await api(`/v1/ageRatingDeclarations/${declarationId}`, {
  bearer,
  method: 'PATCH',
  body: { data: { type: 'ageRatingDeclarations', id: declarationId, attributes } },
});

// The whole reason this is a script and not a curl: prove it landed complete.
const after = await api(`/v1/appInfos/${info.id}/ageRatingDeclaration`, { bearer });
const missing = Object.entries(after.data.attributes)
  .filter(([key, value]) => value === null && !OPTIONAL.has(key))
  .map(([key]) => key);

if (missing.length) {
  console.error(
    `\n\x1b[31m✗ ${String(missing.length)} question(s) still unanswered, so Apple will not ` +
      `accept a submission:\x1b[0m\n  ${missing.join('\n  ')}\n`,
  );
  process.exit(1);
}

console.log('\x1b[32m✓ Every age-rating question is answered.\x1b[0m');

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

/**
 * Sent as relationships rather than attributes, and validated against the live
 * list rather than trusted — a category id Apple does not know is a 409 that
 * names neither the field nor the value.
 */
if (!primary) {
  console.error('\n\x1b[31m✗ store.config.json has no apple.categories.\x1b[0m\n');
  process.exit(1);
}

const valid = new Set(
  (await api('/v1/appCategories?filter[platforms]=IOS&limit=100', { bearer })).data.map((c) => c.id),
);
for (const id of [primary, secondary].filter(Boolean)) {
  if (!valid.has(id)) {
    console.error(`\n\x1b[31m✗ "${id}" is not an App Store category.\x1b[0m\n`);
    process.exit(1);
  }
}

const reference = (id) => (id ? { data: { type: 'appCategories', id } } : { data: null });

await api(`/v1/appInfos/${info.id}`, {
  bearer,
  method: 'PATCH',
  body: {
    data: {
      type: 'appInfos',
      id: info.id,
      relationships: {
        primaryCategory: reference(primary),
        secondaryCategory: reference(secondary),
      },
    },
  },
});

const categories = await api(
  `/v1/appInfos/${info.id}?include=primaryCategory,secondaryCategory`,
  { bearer },
);
const landed = {
  primary: categories.data.relationships?.primaryCategory?.data?.id ?? null,
  secondary: categories.data.relationships?.secondaryCategory?.data?.id ?? null,
};
if (landed.primary !== primary || landed.secondary !== (secondary ?? null)) {
  console.error(
    `\n\x1b[31m✗ Categories did not land: asked for ${primary}/${secondary ?? '—'}, ` +
      `Apple reports ${landed.primary ?? '—'}/${landed.secondary ?? '—'}.\x1b[0m\n`,
  );
  process.exit(1);
}

console.log(
  `\x1b[32m✓ Categories set: ${landed.primary}` +
    `${landed.secondary ? ' + ' + landed.secondary : ''}.\x1b[0m\n`,
);
