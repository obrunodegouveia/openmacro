#!/usr/bin/env node
/**
 * ============================================================================
 * One language per string — `npm run check:language`
 * ============================================================================
 *
 * `i18n:status --strict` proves every string *has* a translation. This proves
 * the translation is actually in the right language, which coverage cannot
 * see:
 *
 *   • a Portuguese or Spanish string that is still English — copied across
 *     unchanged, or half translated ("A taxa de funding is positive");
 *   • an English source string with Portuguese or Spanish in it, which every
 *     English reader would see and every translation would inherit.
 *
 * It checks the interface, the website copy and every module, private ones
 * included, in every shipped language.
 *
 * The test is deliberately crude: it counts function words that exist in one
 * language and not the other ("the", "which", "your" against "não", "também",
 * "qué"). Proper nouns, acronyms and numbers carry no function words, so
 * "Bitcoin", "ETF" and "MVRV" pass untouched, while a real sentence left in
 * the wrong language trips it immediately. A word that is legitimately both
 * (Portuguese "for", Spanish "has") is not on the lists.
 *
 * When it is wrong, add the key to ALLOW below with the reason.
 */

import './i18n-loader.mjs';

const { MODULES } = await import('@openmacro/core/content/registry');
const { PRIVATE_MODULES } = await import('@openmacro/core/content/private');
const { LOCALES, DEFAULT_LOCALE, collectKeys, en, uiCatalogue } = await import(
  '@openmacro/core/i18n'
);
const { contentDictionary } = await import('@openmacro/core/i18n/content');
const { siteCatalogue, siteEn } = await import('@openmacro/core/i18n/site');

/** Words that mark English and are not words in Portuguese or Spanish. */
const ENGLISH = new Set(
  'the and with which that this these those you your what when where who whose why is are was were of to it its from by be been being have had not but or into than then they their them there would should could will can does did doing only also just about because'.split(
    ' ',
  ),
);

/** Words that mark Portuguese or Spanish and are not English words. */
const ROMANCE = new Set(
  'não são também então você isso isto está estão uma umas uns dos das pelo pela pelos pelas muito quando onde já ainda porque mais qué también pero muy está están una unas los las del porque cuando dónde ya todavía más'.split(
    ' ',
  ),
);

/** `scope/key` pairs that are right despite tripping the test, with why. */
const ALLOW = new Map([
  // e.g. ['pt-PT/ui/some.key', 'a quoted English product name'],
]);

/** Lower-case words, ignoring placeholders, URLs and anything in quotes. */
function words(text) {
  return text
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[«“"][^»”"]*[»”"]/g, ' ')
    .toLowerCase()
    .match(/\p{L}+/gu) ?? [];
}

/** Distinct marker words from `set` found in `text`. */
function markers(text, set) {
  return [...new Set(words(text).filter((word) => set.has(word)))];
}

const problems = [];

function check(locale, scope, sources, targets) {
  for (const [key, source] of Object.entries(sources)) {
    if (typeof source !== 'string') continue;
    const id = `${locale}/${scope}/${key}`;
    if (ALLOW.has(id)) continue;

    if (locale === DEFAULT_LOCALE) {
      const found = markers(source, ROMANCE);
      if (found.length >= 2) problems.push({ id, why: `English source has ${found.join(', ')}` });
      continue;
    }

    const target = targets[key];
    if (typeof target !== 'string' || target === '') continue; // i18n:status reports missing.
    const found = markers(target, ENGLISH);
    // Two distinct words is a sentence fragment; one in a short string is
    // usually the whole string.
    const sourceWords = words(source).length;
    if (found.length >= 2 || (found.length === 1 && sourceWords <= 4 && sourceWords > 1)) {
      problems.push({ id, why: `still English: ${found.join(', ')}` });
    } else if (target === source && markers(source, ENGLISH).length > 0) {
      problems.push({ id, why: 'identical to the English' });
    }
  }
}

const modules = [...MODULES, ...PRIVATE_MODULES];
for (const locale of LOCALES) {
  check(locale, 'ui', en, uiCatalogue(locale));
  check(locale, 'site', siteEn, siteCatalogue(locale));
  for (const module of modules) {
    check(locale, module.id, collectKeys(module), contentDictionary(locale, module.id));
  }
}

if (problems.length === 0) {
  console.log('\x1b[32m%s\x1b[0m', `✓ One language per string: ${LOCALES.join(', ')}, ${modules.length} modules.`);
  process.exit(0);
}

console.error(`\x1b[31m✗ ${problems.length} string(s) in the wrong language:\x1b[0m`);
for (const { id, why } of problems) console.error(`  • ${id} — ${why}`);
process.exit(1);
