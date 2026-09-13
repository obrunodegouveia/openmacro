#!/usr/bin/env node
/**
 * ============================================================================
 * Set the app's price — `npm run asc:pricing`
 * ============================================================================
 *
 * OpenMacro is free, and App Store Connect will not accept a submission until
 * something says so. An app with no price schedule is not "free by default": it
 * is unpriced, which is a blocker that shows up in App Store Connect as a
 * section you have not filled in rather than as an error naming what is wrong.
 *
 * This is separate from the listing for the same reason `asc-appinfo.mjs` is.
 * Price is set once for the life of the app, not once per release, and it does
 * not depend on a line of marketing copy or a reviewer's phone number.
 *
 * ---------------------------------------------------------------------------
 * WHY THE REQUEST LOOKS LIKE THAT
 * ---------------------------------------------------------------------------
 *
 * A price schedule is one resource built from three, and Apple wants the whole
 * graph in a single POST: the schedule points at a price *entry*, and the entry
 * points at a price *point*, which is the territory-specific object that happens
 * to cost 0.00. The entry does not exist yet, so it is sent in `included` under
 * an id this request invents, and the relationship refers to that id. It reads
 * oddly and it is the documented shape.
 *
 * `startDate: null` means "from now, indefinitely", which is what a price that
 * is not a sale means.
 *
 * The base territory is the United States. It decides which currency Apple
 * equalises every other territory's price from — and for a price of zero that
 * conversion is zero everywhere, so the choice is immaterial beyond needing to
 * be made.
 */

import { api, credentials, token } from './asc.mjs';

const dryRun = process.argv.includes('--dry-run');

const BASE_TERRITORY = 'USA';

const bearer = token();
const { appId } = credentials();

// Already priced? Setting it twice is not harmful, but saying so is clearer than
// a silent no-op, and re-posting a schedule that exists is a 409.
const existing = await api(`/v1/appPriceSchedules/${appId}?include=manualPrices`, { bearer }).catch(
  () => null,
);
if (existing?.data) {
  const prices = existing.data.relationships?.manualPrices?.data ?? [];
  console.log(`\n\x1b[32m✓ Already priced\x1b[0m — ${String(prices.length)} manual price entry(ies).\n`);
  process.exit(0);
}

/**
 * The free price point for the base territory.
 *
 * Found rather than hardcoded: the id is a base64 blob containing the app id, so
 * it is different for every app and cannot be copied from documentation.
 */
const points = await api(
  `/v1/apps/${appId}/appPricePoints?filter[territory]=${BASE_TERRITORY}&limit=200`,
  { bearer },
);
const free = points.data.find((point) => Number(point.attributes.customerPrice) === 0);
if (!free) {
  console.error('\n\x1b[31m✗ No zero-cost price point offered for ' + BASE_TERRITORY + '.\x1b[0m\n');
  process.exit(1);
}

console.log(`\nPricing ${appId}: free (${BASE_TERRITORY} price point ${free.id.slice(0, 12)}…)`);

if (dryRun) {
  console.log('\nDry run — nothing sent.\n');
  process.exit(0);
}

const entry = '${new-price}';

await api('/v1/appPriceSchedules', {
  bearer,
  method: 'POST',
  body: {
    data: {
      type: 'appPriceSchedules',
      relationships: {
        app: { data: { type: 'apps', id: appId } },
        baseTerritory: { data: { type: 'territories', id: BASE_TERRITORY } },
        manualPrices: { data: [{ type: 'appPrices', id: entry }] },
      },
    },
    included: [
      {
        id: entry,
        type: 'appPrices',
        attributes: { startDate: null, endDate: null },
        relationships: { appPricePoint: { data: { type: 'appPricePoints', id: free.id } } },
      },
    ],
  },
});

// Re-read, because "the POST returned 201" and "the app has a price" are not the
// same claim.
const after = await api(`/v1/appPriceSchedules/${appId}?include=manualPrices`, { bearer });
const count = after?.data?.relationships?.manualPrices?.data?.length ?? 0;
if (count === 0) {
  console.error('\n\x1b[31m✗ The schedule was accepted but reads back with no prices.\x1b[0m\n');
  process.exit(1);
}

console.log(`\x1b[32m✓ Price set: free, in every territory.\x1b[0m\n`);
