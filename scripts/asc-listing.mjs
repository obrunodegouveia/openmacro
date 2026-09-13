#!/usr/bin/env node
/**
 * ============================================================================
 * Push the version listing — `npm run asc:listing`
 * ============================================================================
 *
 * The per-language listing copy and the App Review notes, from
 * `store.config.json` to App Store Connect.
 *
 * `eas metadata:push` is the tool for this and it does more: it would also push
 * the review contact. That is exactly why this exists. The contact needs a real
 * person's name, email and telephone number, and until somebody supplies them
 * `metadata:push` cannot run at all — which would leave the Portuguese listing
 * and the review notes unwritten too, waiting on a phone number they have
 * nothing to do with. This pushes the part that is ready.
 *
 * Everything it sends is read from `store.config.json`, so that file stays the
 * single source of truth and `metadata:push` remains the tool to use once the
 * contact exists. Running both is harmless: they write the same values from the
 * same file.
 *
 * `--dry-run` prints what would be sent.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

import { all, api, credentials, editableVersion, token } from './asc.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dryRun = process.argv.includes('--dry-run');

const store = JSON.parse(readFileSync(join(ROOT, 'store.config.json'), 'utf8'));
const info = store.apple?.info ?? {};
const review = store.apple?.review ?? {};

const bearer = token();
const { appId } = credentials();
const version = await editableVersion(appId, bearer);
if (!version) {
  console.error('\n\x1b[31m✗ No editable version.\x1b[0m\n');
  process.exit(1);
}

console.log(`\nListing → version ${version.attributes.versionString}\n`);

// ---------------------------------------------------------------------------
// Localisations
// ---------------------------------------------------------------------------

const existing = await all(
  `/v1/appStoreVersions/${version.id}/appStoreVersionLocalizations?limit=50`,
  bearer,
);
const byLocale = new Map(existing.map((entry) => [entry.attributes.locale, entry.id]));

/**
 * Has anything ever been released? It decides whether release notes exist.
 *
 * "What's New in This Version" is meaningless on a first release and Apple
 * enforces that: sending `whatsNew` to version 1.0 before anything has shipped
 * answers 409 "Attribute 'whatsNew' cannot be edited at this time", which reads
 * like a permissions problem and is really a statement about what a version is.
 */
const released = (
  await all(`/v1/apps/${appId}/appStoreVersions?limit=50&fields[appStoreVersions]=appStoreState`, bearer)
).some((entry) =>
  ['READY_FOR_SALE', 'REPLACED_WITH_NEW_VERSION', 'PENDING_DEVELOPER_RELEASE'].includes(
    entry.attributes.appStoreState,
  ),
);

/** Apple's field names differ from `store.config.json`'s in two places. */
const attributesFor = (copy) => ({
  description: copy.description,
  keywords: (copy.keywords ?? []).join(','),
  marketingUrl: copy.marketingUrl,
  supportUrl: copy.supportUrl,
  ...(released ? { whatsNew: copy.releaseNotes } : {}),
  promotionalText: copy.promoText,
});

for (const [locale, copy] of Object.entries(info)) {
  const id = byLocale.get(locale);
  const body = attributesFor(copy);

  if (dryRun) {
    console.log(`  ${id ? 'update' : 'create'} ${locale}: ${Object.keys(body).join(', ')}`);
    continue;
  }

  if (id) {
    await api(`/v1/appStoreVersionLocalizations/${id}`, {
      bearer,
      method: 'PATCH',
      body: { data: { type: 'appStoreVersionLocalizations', id, attributes: body } },
    });
    console.log(`  \x1b[32m✓\x1b[0m updated ${locale}`);
  } else {
    /**
     * `locale` is only settable at creation, and a locale Apple does not offer
     * for this app is a 409 naming neither the field nor the value — so the
     * error is reported with the locale attached.
     */
    try {
      const created = await api('/v1/appStoreVersionLocalizations', {
        bearer,
        method: 'POST',
        body: {
          data: {
            type: 'appStoreVersionLocalizations',
            attributes: { ...body, locale },
            relationships: {
              appStoreVersion: { data: { type: 'appStoreVersions', id: version.id } },
            },
          },
        },
      });
      byLocale.set(locale, created.data.id);
      console.log(`  \x1b[32m✓\x1b[0m created ${locale}`);
    } catch (error) {
      console.error(`  \x1b[31m✗\x1b[0m ${locale}: ${error.message.split('\n').slice(1).join(' ').trim()}`);
      process.exitCode = 1;
    }
  }

  // `name` and `subtitle` live on appInfoLocalizations, not on the version —
  // they belong to the app's identity rather than to a release.
  if (!dryRun && (copy.title || copy.subtitle)) await pushAppInfoLocalisation(locale, copy);
}

/** The app's name and subtitle for one language. */
async function pushAppInfoLocalisation(locale, copy) {
  const infos = await api(`/v1/apps/${appId}/appInfos`, { bearer });
  const editable =
    infos.data.find((entry) => entry.attributes.appStoreState !== 'READY_FOR_SALE') ?? infos.data[0];
  const rows = await all(`/v1/appInfos/${editable.id}/appInfoLocalizations?limit=50`, bearer);
  const row = rows.find((entry) => entry.attributes.locale === locale);
  const attributes = { name: copy.title, subtitle: copy.subtitle, privacyPolicyUrl: copy.privacyPolicyUrl };

  try {
    if (row) {
      await api(`/v1/appInfoLocalizations/${row.id}`, {
        bearer,
        method: 'PATCH',
        body: { data: { type: 'appInfoLocalizations', id: row.id, attributes } },
      });
    } else {
      await api('/v1/appInfoLocalizations', {
        bearer,
        method: 'POST',
        body: {
          data: {
            type: 'appInfoLocalizations',
            attributes: { ...attributes, locale },
            relationships: { appInfo: { data: { type: 'appInfos', id: editable.id } } },
          },
        },
      });
    }
    console.log(`      name + subtitle for ${locale}`);
  } catch (error) {
    console.error(`      \x1b[31m✗\x1b[0m name/subtitle ${locale}: ${error.message.split('\n').slice(1).join(' ').trim()}`);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------------
// Review notes — and only the notes
// ---------------------------------------------------------------------------

/**
 * The contact fields are deliberately not sent, even when they hold something.
 * `store.config.json` ships with `REPLACE_FIRST_NAME` placeholders, and writing
 * those to Apple under someone's name would be worse than leaving the section
 * empty: an empty section is obviously unfinished, while "REPLACE_EMAIL" in a
 * reviewer's contact field looks like the app was submitted by accident.
 */
// Anywhere in the value, not anchored: the shipped phone placeholder is
// `+REPLACE_PHONE`, and an anchored pattern counted it as a real number.
const placeholder = /REPLACE_/;
const contact = ['firstName', 'lastName', 'email', 'phone'].filter(
  (field) => review[field] && !placeholder.test(review[field]),
);

const notes = review.notes;
if (notes) {
  const current = await api(`/v1/appStoreVersions/${version.id}/appStoreReviewDetail`, { bearer }).catch(
    () => null,
  );
  const attributes = { notes, demoAccountRequired: review.demoRequired ?? false };

  if (dryRun) {
    console.log(`\n  ${current?.data ? 'update' : 'create'} review notes (${notes.length} chars)`);
  } else if (current?.data) {
    await api(`/v1/appStoreReviewDetails/${current.data.id}`, {
      bearer,
      method: 'PATCH',
      body: { data: { type: 'appStoreReviewDetails', id: current.data.id, attributes } },
    });
    console.log(`\n  \x1b[32m✓\x1b[0m review notes updated (${notes.length} chars)`);
  } else {
    await api('/v1/appStoreReviewDetails', {
      bearer,
      method: 'POST',
      body: {
        data: {
          type: 'appStoreReviewDetails',
          attributes,
          relationships: { appStoreVersion: { data: { type: 'appStoreVersions', id: version.id } } },
        },
      },
    });
    console.log(`\n  \x1b[32m✓\x1b[0m review notes created (${notes.length} chars)`);
  }
}

if (contact.length < 4) {
  console.log(
    `\n\x1b[33m  ! App Review contact not sent — ${String(4 - contact.length)} field(s) are still ` +
      'placeholders in store.config.json. Apple requires a real name, email and phone.\x1b[0m',
  );
}
console.log('');
