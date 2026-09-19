/**
 * ============================================================================
 * Website copy
 * ============================================================================
 *
 * The marketing site's own words — navigation, hero, footer, the pages a
 * reader meets before any lesson. Separate from `../ui` on purpose.
 *
 * WHY A SECOND CATALOGUE RATHER THAN MORE KEYS IN THE FIRST. The app never
 * renders any of this, and `../ui` is imported by every screen in it. Folding
 * 380-odd strings of website copy into that catalogue would ship all of them
 * inside the iOS bundle to be never read. Nothing here is imported by the app,
 * so nothing here reaches it.
 *
 * The machinery is identical — same ICU formatting, same per-key fallback to
 * English — because the failure it prevents is identical: a half-translated
 * locale should show Portuguese where it has it and English where it does
 * not, rather than reverting wholesale on one missing string.
 */

import { formatMessage, type MessageValues } from '../format';
import { DEFAULT_LOCALE, LOCALE_TAGS, type Locale } from '../locales';
import { en } from './en';
import { ptPT } from './pt-PT';

export { en as siteEn } from './en';

export type SiteKey = keyof typeof en;
export type SiteDictionary = Record<SiteKey, string>;

const CATALOGUES: Record<Locale, Partial<SiteDictionary>> = {
  en,
  'pt-PT': ptPT,
};

/** Per-key fallback to English. See `../index.ts` for why the tag follows the template. */
export function siteTranslate(locale: Locale, key: SiteKey, values?: MessageValues): string {
  const catalogue = CATALOGUES[locale] ?? CATALOGUES[DEFAULT_LOCALE];
  const translated = catalogue[key];
  const template = translated ?? en[key];
  const tag = LOCALE_TAGS[translated !== undefined ? locale : DEFAULT_LOCALE];
  if (!values) return template;
  return formatMessage(template, tag, values);
}

export type SiteTranslator = (key: SiteKey, values?: MessageValues) => string;

export function createSiteTranslator(locale: Locale): SiteTranslator {
  return (key, values) => siteTranslate(locale, key, values);
}

/** 0..1. Feeds `npm run i18n:status`, so a gap here is visible rather than assumed. */
export function siteCoverage(locale: Locale): number {
  const keys = Object.keys(en) as SiteKey[];
  if (keys.length === 0) return 1;
  const catalogue = CATALOGUES[locale] ?? {};
  return keys.filter((key) => catalogue[key] !== undefined).length / keys.length;
}

/**
 * A locale's raw catalogue, with no fallback — an absent key reads as absent.
 *
 * Same contract as `uiCatalogue`, and for the same reason: the tooling has to
 * tell "translated to the same word" from "not translated at all", which
 * `siteTranslate` deliberately cannot.
 */
export function siteCatalogue(locale: Locale): Partial<SiteDictionary> {
  return CATALOGUES[locale] ?? {};
}

export function missingSiteKeys(locale: Locale): SiteKey[] {
  const catalogue = CATALOGUES[locale] ?? {};
  return (Object.keys(en) as SiteKey[]).filter((key) => catalogue[key] === undefined);
}
