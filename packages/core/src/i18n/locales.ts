/**
 * ============================================================================
 * Locales
 * ============================================================================
 *
 * The single list of languages OpenMacro ships. Adding one means adding it
 * here, writing a UI catalogue, and translating as much content as you like —
 * anything untranslated falls back to English rather than disappearing, so a
 * language can ship at 5% and improve.
 *
 * Portuguese is `pt-PT` rather than `pt`. The two Portugueses differ enough in
 * everyday vocabulary that a Brazilian learner reading European Portuguese
 * notices immediately, and picking the unqualified tag now would make adding
 * `pt-BR` later a rename of every file.
 */

export const LOCALES = ['en', 'pt-PT'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** What each language calls itself. Never translated — a language picker in a
 *  language you cannot read is useless. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  'pt-PT': 'Português',
};

/** For `<html lang>`, `Intl` and screen readers. */
export const LOCALE_TAGS: Record<Locale, string> = {
  en: 'en',
  'pt-PT': 'pt-PT',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/**
 * Best match for a device or browser language.
 *
 * Matches the region-specific tag first, then the base language, so a device
 * set to `pt-BR` gets European Portuguese rather than English — imperfect
 * Portuguese being far more useful to that reader than fluent English.
 */
export function resolveLocale(preferred: readonly string[] | string | undefined): Locale {
  const list = typeof preferred === 'string' ? [preferred] : (preferred ?? []);
  for (const candidate of list) {
    if (isLocale(candidate)) return candidate;
    const base = candidate.split('-')[0]?.toLowerCase();
    if (!base) continue;
    const match = LOCALES.find((locale) => locale.split('-')[0]?.toLowerCase() === base);
    if (match) return match;
  }
  return DEFAULT_LOCALE;
}
