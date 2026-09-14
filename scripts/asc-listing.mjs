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

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

import { all, api, credentials, editableVersion, token } from './asc.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dryRun = process.argv.includes('--dry-run');

const store = JSON.parse(readFileSync(join(ROOT, 'store.config.json'), 'utf8'));
const info = store.apple?.info ?? {};

/**
 * The App Review contact, from `credentials/review-contact.json` if it exists.
 *
 * It lives there rather than in `store.config.json` because that file is
 * committed and this repository is public — the app's own review notes point
 * Apple at the GitHub URL. Apple needs a real name, email and telephone number;
 * the internet does not, and a contributor cloning this should not inherit
 * somebody's mobile number.
 *
 * `credentials/` is already gitignored for the App Store Connect key, which
 * makes it the obvious home. `store.config.json` keeps its placeholders, so the
 * shape of what is required stays documented in the open.
 */
function localContact() {
  const path = join(ROOT, 'credentials/review-contact.json');
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    console.error(`\n\x1b[31m✗ credentials/review-contact.json is not valid JSON — ${error.message}\x1b[0m\n`);
    process.exit(1);
  }
}

const review = { ...(store.apple?.review ?? {}), ...localContact() };

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
 * All four contact fields, or none — and that is Apple's rule, not a choice.
 *
 * Sending the three that were real and omitting the phone looked like the
 * obviously better behaviour, and Apple rejects it outright: 409, "You must
 * provide a value for the attribute 'contactPhone' with this request". The
 * contact is one object to App Store Connect, so a partial one cannot be
 * written at all, and attempting it fails the whole request — taking the review
 * notes in the same PATCH down with it.
 *
 * A placeholder is never sent either. `REPLACE_EMAIL` under someone's name is
 * worse than an empty section: empty reads as unfinished, a placeholder reads as
 * submitted by accident.
 */
// Anywhere in the value, not anchored: the shipped phone placeholder is
// `+REPLACE_PHONE`, and an anchored pattern counted it as a real number.
// Anywhere in the value, not anchored: the shipped phone placeholder is
// `+REPLACE_PHONE`, and an anchored pattern counted it as a real number.
const placeholder = /REPLACE_/;
const FIELDS = { firstName: 'contactFirstName', lastName: 'contactLastName', email: 'contactEmail', phone: 'contactPhone' };
const ready = {};
const stillPlaceholder = [];
for (const [field, apple] of Object.entries(FIELDS)) {
  if (review[field] && !placeholder.test(review[field])) ready[apple] = review[field];
  else stillPlaceholder.push(field);
}
const contact = stillPlaceholder.length === 0 ? ready : {};

const notes = review.notes;
if (notes) {
  const current = await api(`/v1/appStoreVersions/${version.id}/appStoreReviewDetail`, { bearer }).catch(
    () => null,
  );
  const attributes = { notes, demoAccountRequired: review.demoRequired ?? false, ...contact };

  /**
   * Once the record exists, Apple requires the whole contact on every update —
   * including an update that only touches the notes. So an incomplete contact
   * does not merely leave the contact empty: it freezes the notes at whatever
   * was written when the record was created, and the record cannot be deleted
   * and remade either (403). Attempting it fails the request outright.
   */
  const frozen = Boolean(current?.data) && Object.keys(contact).length === 0;

  if (frozen) {
    const live = current.data.attributes.notes ?? '';
    console.log(
      `\n\x1b[33m  ! Review notes left as they are — Apple requires the full contact on any ` +
        `update to this record.${live === notes ? '' : ' They no longer match store.config.json.'}\x1b[0m`,
    );
  } else if (dryRun) {
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

if (Object.keys(contact).length) {
  console.log(`      contact: ${Object.keys(contact).join(', ')}`);
}
if (stillPlaceholder.length) {
  console.log(
    `\n\x1b[33m  ! App Review contact not sent. Apple takes all four fields or none, and ` +
      `${stillPlaceholder.join(', ')} ${stillPlaceholder.length === 1 ? 'is' : 'are'} still a ` +
      'placeholder in store.config.json.\x1b[0m',
  );
}
console.log('');
