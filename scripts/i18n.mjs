#!/usr/bin/env node
/**
 * ============================================================================
 * Translation tooling — `npm run i18n:status`, `npm run i18n:extract`
 * ============================================================================
 *
 * Three commands, because translating 4,400 strings is a project rather than
 * an afternoon, and a project needs to hand work out, take it back, and know
 * where it is.
 *
 *   status              What fraction of the interface and of each module is
 *                       translated, per language. Prints the gap, because the
 *                       gap is the only number anyone acts on.
 *
 *   extract <locale>    Writes `translations/<locale>/*.json` — one bilingual
 *                       file per scope, carrying the English, the current
 *                       translation and whether it is new, translated or
 *                       stale. Hand it to a translator or upload it to
 *                       Crowdin, Lokalise or Weblate.
 *
 *   import <locale>     Reads those files back into the TypeScript
 *                       catalogues, validating every string first. Without
 *                       this, translating is a developer-only activity.
 *
 * `--strict` makes `status` exit non-zero on two things, and only two:
 *
 *   • a **broken** catalogue — unbalanced braces, or a message naming an
 *     argument the English source does not provide. Both render as visible
 *     nonsense and neither is a type error, so this is the only thing that
 *     catches them.
 *
 *   • a shipped language **missing an interface string**. Content may stay
 *     incomplete forever — that is the whole design — but a half-translated
 *     menu beside fully translated lessons reads as a bug.
 *
 * Untranslated content never fails the build. Deliberately: a rule that
 * punishes adding a lesson until every language has caught up is a rule that
 * stops lessons being added.
 *
 * Requires Node 22.18+, like the rest of the tooling here.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import './i18n-loader.mjs';

const { MODULES } = await import('@openmacro/core/content/registry');
const { en, uiCatalogue } = await import('@openmacro/core/i18n');
const {
  LOCALES,
  LOCALE_NAMES,
  DEFAULT_LOCALE,
  collectKeys,
  uiCoverage,
  missingUiKeys,
  validateCatalogue,
} = await import('@openmacro/core/i18n');
const { contentCoverage, contentDictionary, courseDictionary, courseKeys } = await import(
  '@openmacro/core/i18n/content'
);
const { messageArguments } = await import('@openmacro/core/i18n/format');
const { siteCoverage, missingSiteKeys, siteCatalogue, siteEn } = await import(
  '@openmacro/core/i18n/site'
);

const { buildDocument, readState, summarise, writeDocument, TRANSLATIONS_DIR } = await import(
  './i18n-extract.mjs'
);
const { collect, writeContentIndex, writeCourse, writeModule, writeState, writeUi } =
  await import('./i18n-import.mjs');
const { fingerprint } = await import('./i18n-files.mjs');
const { applyConventions, conventionWarnings, CONVENTIONS } = await import(
  './i18n-orthography.mjs'
);

/**
 * The website's own Portuguese overlays.
 *
 * These live in `web/` rather than in `packages/core` because they overlay data
 * that only the website has — the glossary, the tier model, the page titles
 * search results show. That is a reasonable place for them and it is also how
 * fifty-six pre-1990 spellings sat in the glossary unnoticed: the checker only
 * ever saw `packages/core`. It sees these now.
 *
 * Loaded defensively. A missing or renamed file should weaken this check, not
 * break `i18n:status` for someone who only wanted a coverage number.
 */
async function webOverlays() {
  const out = {};
  for (const [scope, path, exported] of [
    ['web glossary', '../web/src/lib/glossary-pt.ts', 'GLOSSARY_PT'],
    ['web curriculum', '../web/src/lib/curriculum-pt.ts', 'CURRICULUM_PT'],
    ['web page titles', '../web/src/lib/seo-copy.ts', 'SEO_PT'],
    ['web answers', '../web/src/lib/answers-pt.ts', 'ANSWERS_PT'],
  ]) {
    try {
      const loaded = await import(new URL(path, import.meta.url).href);
      const root = loaded[exported];
      if (!root) continue;
      const units = {};
      /**
       * Strings only, at any depth, keyed by their path through the object so a
       * warning names something a person can search for.
       *
       * No English `source` is passed: these are overlays, not units, so there
       * is nothing to compare against — which is fine here because the values
       * are all prose, unlike the raw file, where scanning the docblock reported
       * `actually` and `exactly` as Portuguese misspellings.
       */
      const walk = (value, at) => {
        if (typeof value === 'string') units[at] = { target: value };
        else if (Array.isArray(value)) value.forEach((item, i) => walk(item, `${at}[${i}]`));
        else if (value && typeof value === 'object') {
          for (const [key, item] of Object.entries(value)) walk(item, at ? `${at}.${key}` : key);
        }
      };
      walk(root, '');
      out[scope] = units;
    } catch {
      // Not fatal — see above.
    }
  }
  return out;
}

/**
 * Shapes a pair of catalogues into what `conventionWarnings` reads.
 *
 * The English is passed as each unit's `source` so a term carried across
 * untranslated — a proper noun, an acronym — is not flagged as a spelling
 * decision somebody made.
 */
function catalogueUnits(source, target) {
  const units = {};
  for (const [key, value] of Object.entries(target)) {
    if (typeof value === 'string') units[key] = { target: value, source: source[key] ?? '' };
  }
  return units;
}

const [command = 'status', ...rest] = process.argv.slice(2);

// ---------------------------------------------------------------------------

function bar(ratio, width = 24) {
  const filled = Math.round(ratio * width);
  return `${'█'.repeat(filled)}${'░'.repeat(width - filled)}`;
}

const pct = (ratio) => `${(ratio * 100).toFixed(ratio > 0 && ratio < 0.01 ? 2 : 0)}%`;

// ---------------------------------------------------------------------------

if (command === 'extract') {
  const [locale, only] = rest;
  if (!locale || !LOCALES.includes(locale)) {
    console.error('usage: npm run i18n:extract -- <locale> [ui|<moduleId>]');
    console.error(`\nLocales: ${LOCALES.join(', ')}`);
    process.exit(2);
  }

  const state = readState(locale);
  const scopes = [];

  if (!only || only === 'ui') {
    scopes.push({
      scope: 'ui',
      sources: { ...en },
      targets: uiCatalogue(locale),
    });
  }

  if (!only || only === 'course') {
    scopes.push({ scope: 'course', sources: courseKeys(), targets: courseDictionary(locale) });
  }

  for (const module of MODULES) {
    if (only && only !== module.id) continue;
    if (only === 'ui' || only === 'course') break;
    scopes.push({
      scope: module.id,
      sources: collectKeys(module),
      targets: contentDictionary(locale, module.id),
    });
  }

  if (scopes.length === 0) {
    console.error(`Nothing matched "${only}". Try "ui" or a module id.`);
    process.exit(2);
  }

  console.log('');
  for (const { scope, sources, targets } of scopes) {
    const document = buildDocument({ locale, scope, sources, targets, state: state[scope] ?? {} });
    const path = writeDocument(locale, scope, document);
    const counts = summarise(document);
    const total = Object.keys(document.units).length;
    const flags = [
      counts.new ? `${counts.new} new` : null,
      counts.stale ? `${counts.stale} STALE` : null,
    ].filter(Boolean);
    console.log(
      `  ${path.padEnd(46)} ${String(total).padStart(4)} strings${flags.length ? `  · ${flags.join(', ')}` : ''}`,
    );
  }
  console.log('');
  console.log('Translate the "target" of each unit, then:');
  console.log(`  npm run i18n:import -- ${locale}`);
  console.log('');
  console.log('"stale" means the English changed after that translation was made.');
  console.log('');
  process.exit(0);
}

if (command === 'fixspelling') {
  const [locale] = rest;
  if (!locale || !LOCALES.includes(locale)) {
    console.error('usage: npm run i18n:fixspelling -- <locale>');
    process.exit(2);
  }
  const dir = join(TRANSLATIONS_DIR, locale);
  if (!existsSync(dir)) {
    console.error(`No translations at ${dir}.`);
    process.exit(2);
  }
  let changed = 0;
  for (const file of readdirSync(dir).filter((name) => name.endsWith('.json'))) {
    const path = join(dir, file);
    const document = JSON.parse(readFileSync(path, 'utf8'));
    let touched = 0;
    for (const unit of Object.values(document.units ?? {})) {
      if (!unit.target) continue;
      const fixed = applyConventions(locale, unit.target, unit.source ?? '');
      if (fixed !== unit.target) {
        unit.target = fixed;
        touched += 1;
      }
    }
    if (touched) {
      writeFileSync(path, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
      console.log(`  ${file.padEnd(44)} ${touched} corrected`);
      changed += touched;
    }
  }
  console.log('');
  console.log(changed ? `${changed} spellings corrected. Now: npm run i18n:import -- ${locale}` : 'Nothing to correct.');
  console.log('');
  process.exit(0);
}

if (command === 'import') {
  const [locale] = rest;
  if (!locale || !LOCALES.includes(locale)) {
    console.error('usage: npm run i18n:import -- <locale>');
    console.error(`\nLocales: ${LOCALES.join(', ')}`);
    process.exit(2);
  }
  if (locale === DEFAULT_LOCALE) {
    console.error(`"${locale}" is the source language — it is edited directly, not imported.`);
    process.exit(2);
  }

  const result = collect(locale, messageArguments);
  if (result.error) {
    console.error(result.error);
    process.exit(2);
  }
  const { accepted, rejected, skipped } = result;

  console.log('');
  const uiTranslations = Object.fromEntries(
    Object.entries(accepted.ui ?? {}).map(([key, { target }]) => [key, target]),
  );
  const written = [];

  /** Set when a write was refused, so the run can fail after finishing. */
  let refused = false;

  if (Object.keys(uiTranslations).length > 0) {
    const uiPath = writeUi(locale, uiTranslations);
    if (uiPath) written.push([uiPath, Object.keys(uiTranslations).length]);
    else refused = true;
  }

  const courseTranslations = Object.fromEntries(
    Object.entries(accepted.course ?? {}).map(([key, { target }]) => [key, target]),
  );
  const hasCourse = Object.keys(courseTranslations).length > 0;
  if (hasCourse) {
    written.push([writeCourse(locale, courseTranslations), Object.keys(courseTranslations).length]);
  }

  const moduleIds = [];
  for (const [scope, units] of Object.entries(accepted)) {
    if (scope === 'ui' || scope === 'course') continue;
    const translations = Object.fromEntries(
      Object.entries(units).map(([key, { target }]) => [key, target]),
    );
    if (Object.keys(translations).length === 0) continue;
    moduleIds.push(scope);
    written.push([writeModule(locale, scope, translations), Object.keys(translations).length]);
  }

  if (moduleIds.length > 0 || hasCourse) {
    written.push([writeContentIndex(locale, moduleIds.sort(), { hasCourse }), 0]);
  }

  written.push([writeState(locale, accepted), 0]);

  for (const [path, count] of written) {
    console.log(`  wrote ${path}${count ? `  (${count} strings)` : ''}`);
  }

  if (skipped.length) {
    console.log('');
    console.log(`  ${skipped.length} untranslated — left to fall back to English.`);
  }

  const convention = conventionWarnings(locale, accepted);
  if (convention.length) {
    console.log('');
    console.log(`  ${convention.length} spelling warning${convention.length === 1 ? '' : 's'} (imported anyway):`);
    for (const { scope, key, words } of convention.slice(0, 15)) {
      console.log(`    ${scope}/${key} — ${words.join(', ')}`);
    }
    if (convention.length > 15) console.log(`    … and ${convention.length - 15} more`);
  }

  if (rejected.length) {
    console.log('');
    console.log(`  ${rejected.length} REJECTED and not written:`);
    for (const { scope, key, reason } of rejected) {
      console.log(`    ${scope}/${key} — ${reason}`);
    }
    console.log('');
    console.log('  Everything else was imported. Fix these and run import again.');
    console.log('');
    process.exit(1);
  }

  console.log('');
  console.log('Now run:  npm run typecheck:core && npm run i18n:status');
  console.log('');
  // Everything that could be written has been. A refused write still fails
  // the run, so a skipped dictionary cannot be mistaken for a clean import.
  process.exit(refused ? 2 : 0);
}

if (command !== 'status') {
  console.error(`Unknown command "${command}". Try "status" or "extract <moduleId>".`);
  process.exit(2);
}

// ---------------------------------------------------------------------------
// status
// ---------------------------------------------------------------------------

const strict = rest.includes('--strict');
const verbose = rest.includes('--verbose');

const totalStrings = MODULES.reduce(
  (sum, module) => sum + Object.keys(collectKeys(module)).length,
  0,
);

console.log('');
console.log('OpenMacro — translation status');
console.log(`${MODULES.length} modules · ${totalStrings.toLocaleString('en-GB')} content strings`);

let failed = false;

for (const locale of LOCALES) {
  const isSource = locale === DEFAULT_LOCALE;
  console.log('');
  console.log(
    `── ${LOCALE_NAMES[locale]} (${locale})${isSource ? '  — source language' : ''} ${'─'.repeat(
      Math.max(0, 46 - LOCALE_NAMES[locale].length - locale.length),
    )}`,
  );

  const ui = uiCoverage(locale);
  console.log(`  interface   ${bar(ui)}  ${pct(ui).padStart(4)}`);

  // The website's own copy. Counted separately because it is a separate
  // catalogue and a separate job — the app is finished while this is not,
  // and one number covering both would hide that.
  const site = siteCoverage(locale);
  console.log(`  website     ${bar(site)}  ${pct(site).padStart(4)}`);

  const modules = contentCoverage(locale);
  const done = modules.reduce((sum, entry) => sum + entry.translated, 0);
  const all = modules.reduce((sum, entry) => sum + entry.total, 0);
  console.log(`  content     ${bar(all ? done / all : 1)}  ${pct(all ? done / all : 1).padStart(4)}   ${done.toLocaleString('en-GB')} / ${all.toLocaleString('en-GB')} strings`);

  if (!isSource) {
    const started = modules.filter((entry) => entry.ratio > 0);
    if (started.length) {
      console.log('');
      for (const entry of started) {
        console.log(
          `    ${entry.moduleId.padEnd(42)} ${bar(entry.ratio, 12)} ${pct(entry.ratio).padStart(4)}  (${entry.translated}/${entry.total})`,
        );
      }
    }
    const untouched = modules.length - started.length;
    if (untouched > 0) {
      console.log('');
      console.log(`    ${untouched} module${untouched === 1 ? '' : 's'} not started — falls back to English`);
    }

    // Stale beats missing for urgency: a missing string renders in English and
    // is obviously untranslated, while a stale one is fluent, confident and
    // describes something that is no longer true.
    const state = readState(locale);
    const stale = [];
    const staleIn = (scope, sources, translated) => {
      const recorded = state[scope] ?? {};
      for (const [key, source] of Object.entries(sources)) {
        if (recorded[key] && translated[key] && recorded[key] !== fingerprint(source)) {
          stale.push(`${scope}/${key}`);
        }
      }
    };
    staleIn('ui', en, uiCatalogue(locale));
    for (const module of MODULES) {
      staleIn(module.id, collectKeys(module), contentDictionary(locale, module.id));
    }
    if (stale.length) {
      console.log('');
      console.log(`    ${stale.length} STALE — the English changed after these were translated:`);
      for (const key of (verbose ? stale : stale.slice(0, 10))) console.log(`      ${key}`);
      if (!verbose && stale.length > 10) {
        console.log(`      … and ${stale.length - 10} more (--verbose)`);
      }
      console.log(`    Re-extract to see them:  npm run i18n:extract -- ${locale}`);
    }

    const broken = validateCatalogue(locale);
    if (broken.length) {
      console.log('');
      console.log(`    ${broken.length} broken message${broken.length === 1 ? '' : 's'}:`);
      for (const { key, problem } of broken) console.log(`      ${key} — ${problem}`);
      failed = true;
    }

    const missing = missingUiKeys(locale);
    if (missing.length) {
      console.log('');
      console.log(`    ${missing.length} interface key${missing.length === 1 ? '' : 's'} missing:`);
      const show = verbose ? missing : missing.slice(0, 10);
      for (const key of show) console.log(`      ${key}`);
      if (show.length < missing.length) {
        console.log(`      … and ${missing.length - show.length} more (--verbose)`);
      }
      if (strict) failed = true;
    }

    const missingSite = missingSiteKeys(locale);
    if (missingSite.length) {
      console.log('');
      console.log(`    ${missingSite.length} website key${missingSite.length === 1 ? '' : 's'} missing:`);
      const show = verbose ? missingSite : missingSite.slice(0, 10);
      for (const key of show) console.log(`      ${key}`);
      if (show.length < missingSite.length) {
        console.log(`      … and ${missingSite.length - show.length} more (--verbose)`);
      }
      if (strict) failed = true;
    }

    /**
     * Spelling conventions across the two hand-written catalogues.
     *
     * `import` already checks every translated *content* string as it comes in,
     * which is why the modules are clean. The interface and website catalogues
     * are written straight into TypeScript and never pass through that gate, so
     * nothing was checking them — and the website had nineteen pre-1990
     * spellings sitting in shipped copy, including `Activo` on a balance sheet
     * and `Desactivar` on a button.
     */
    const catalogueWarnings = conventionWarnings(locale, {
      interface: catalogueUnits(en, uiCatalogue(locale)),
      website: catalogueUnits(siteEn, siteCatalogue(locale)),
      ...(locale === 'pt-PT' ? await webOverlays() : {}),
    });
    if (catalogueWarnings.length) {
      console.log('');
      console.log(
        `    ${catalogueWarnings.length} spelling convention warning${
          catalogueWarnings.length === 1 ? '' : 's'
        } (${CONVENTIONS[locale]?.name ?? 'convention'}):`,
      );
      const show = verbose ? catalogueWarnings : catalogueWarnings.slice(0, 10);
      for (const { scope, key, words } of show) {
        console.log(`      ${scope}/${key} — ${words.join(', ')}`);
      }
      if (show.length < catalogueWarnings.length) {
        console.log(`      … and ${catalogueWarnings.length - show.length} more (--verbose)`);
      }
      if (strict) failed = true;
    }
  }
}

console.log('');
console.log('A missing string is not a broken one — it renders in English.');
console.log('Add a module with:  npm run i18n:extract -- <moduleId>');
console.log('');

process.exit(failed ? 1 : 0);
