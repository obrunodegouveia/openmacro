/**
 * ============================================================================
 * `npm run i18n:extract -- <locale> [scope]`
 * ============================================================================
 *
 * Writes one bilingual file per scope into `translations/<locale>/`, ready to
 * hand to a translator or to upload to Crowdin, Lokalise or Weblate — all of
 * which ingest this shape.
 *
 * **Bilingual** is the point. The old version emitted key → English, which is
 * only useful for a first pass: a translator revising existing Portuguese had
 * no way to see what was already there, and would retranslate from scratch or
 * work from the TypeScript file by hand. Each unit now carries the English,
 * the current translation, and whether it needs attention.
 *
 *   new          no translation yet
 *   translated   translated, and the English has not moved since
 *   stale        translated, but the English has been edited since — the
 *                translation may now describe something that is no longer true
 *
 * `stale` is the one worth having. A silently outdated translation is the
 * worst state this system can reach: it is fluent, confident and wrong, and
 * coverage still reports it as done. Detecting it needs a record of what the
 * English said when the translation was made, which is `state/<locale>.json`,
 * written by `i18n:import`.
 *
 * A key with no recorded fingerprint is reported as `translated`, not `stale`.
 * Translations written before this tooling existed are not evidence of
 * anything, and crying wolf over all of them would make the signal useless on
 * the day it matters.
 */

import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

import { fingerprint } from './i18n-files.mjs';

/** Where a translator's files live. Outside packages/ — they are not source. */
export const TRANSLATIONS_DIR = 'translations';

export function statePath(locale) {
  return join('packages/core/src/i18n/state', `${locale}.json`);
}

export function readState(locale) {
  const path = statePath(locale);
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    // A corrupt state file costs stale-detection, not correctness.
    return {};
  }
}

function unitState(recorded, source, target) {
  if (!target) return 'new';
  if (!recorded) return 'translated';
  return recorded === fingerprint(source) ? 'translated' : 'stale';
}

/**
 * Build one scope's bilingual document.
 *
 * `sources` is key → English; `targets` is key → existing translation.
 */
export function buildDocument({ locale, scope, sources, targets, state }) {
  const units = {};
  for (const [key, source] of Object.entries(sources)) {
    const target = targets[key] ?? '';
    units[key] = {
      source,
      target,
      state: unitState(state[key], source, target),
    };
  }
  return {
    locale,
    source: 'en',
    scope,
    format: 'openmacro-bilingual-1',
    generated: new Date().toISOString().slice(0, 10),
    units,
  };
}

export function writeDocument(locale, scope, document) {
  const dir = join(TRANSLATIONS_DIR, locale);
  mkdirSync(dir, { recursive: true });
  const path = join(dir, `${scope}.json`);
  writeFileSync(path, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
  return path;
}

export function summarise(document) {
  const counts = { new: 0, translated: 0, stale: 0 };
  for (const unit of Object.values(document.units)) counts[unit.state] += 1;
  return counts;
}
