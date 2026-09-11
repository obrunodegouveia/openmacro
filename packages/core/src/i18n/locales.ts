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
 * ============================================================================
 * Matching a device language to one we ship
 * ============================================================================
 *
 * RFC 4647 "lookup": take the requested tag, and keep cutting subtags off the
 * end until something matches. `pt-BR` asks for Brazilian Portuguese, does not
 * get it, and falls back to `pt-PT` — imperfect Portuguese being far more
 * useful to that reader than fluent English.
 *
 * ---------------------------------------------------------------------------
 * WHY NOT JUST COMPARE THE BASE LANGUAGE
 * ---------------------------------------------------------------------------
 *
 * Because of Chinese. `zh-Hant-TW` and `zh-Hans-CN` share the base language
 * `zh` and are written in different scripts; a reader of one cannot
 * comfortably read the other. A base-language match would hand Traditional
 * readers a Simplified catalogue and call it a success — which is worse than
 * serving English, because English is at least obviously not their language.
 *
 * The same trap exists for Serbian (`sr-Cyrl` / `sr-Latn`) and Azerbaijani.
 * None of them are shipped today. The point of doing this properly now is
 * that the day one is added, nobody has to remember this paragraph.
 *
 * `Intl.LocaleMatcher` would do it, and is still a proposal rather than
 * something on a phone. So: lookup, by hand, in a dozen lines.
 */

/** Subtags, lower-cased. `pt-PT` → `['pt', 'pt']`. */
function subtags(tag: string): string[] {
  return tag.toLowerCase().split(/[-_]/).filter(Boolean);
}

/**
 * Does `available` satisfy a request for `wanted`?
 *
 * True when `available` is a prefix of `wanted` at subtag boundaries, which is
 * what lets `pt` serve `pt-BR` while `pt-PT` does not serve `pt-BR` on its own
 * — that second case is handled by the deliberate last resort below.
 */
function isPrefix(available: readonly string[], wanted: readonly string[]): boolean {
  if (available.length > wanted.length) return false;
  return available.every((part, index) => part === wanted[index]);
}

/**
 * Is a script subtag present, and different?
 *
 * A script is the one subtag that makes two variants mutually unreadable, so
 * it is the one that vetoes a fallback. Scripts are the four-letter subtag in
 * position two (`zh-Hant-TW`); a two-letter subtag there is a region.
 */
function scriptOf(parts: readonly string[]): string | null {
  const second = parts[1];
  return second && second.length === 4 ? second : null;
}

/**
 * The matching algorithm, over an arbitrary catalogue.
 *
 * Split out from `resolveLocale` so it can be tested against languages this
 * app does not ship — the Chinese and Serbian cases above are the whole reason
 * the function is shaped this way, and a test that cannot express them is not
 * a test of anything.
 */
export function lookupLocale<T extends string>(
  available: readonly T[],
  preferred: readonly string[] | string | undefined,
  fallback: T,
): T {
  const list = typeof preferred === 'string' ? [preferred] : (preferred ?? []);
  const shipped = available.map((locale) => ({ locale, parts: subtags(locale) }));

  for (const candidate of list) {
    if (typeof candidate !== 'string' || !candidate.trim()) continue;
    const wanted = subtags(candidate);
    if (wanted.length === 0) continue;

    // RFC 4647 lookup: exact, then progressively shorter requests.
    for (let length = wanted.length; length > 0; length -= 1) {
      const truncated = wanted.slice(0, length);
      const hit = shipped.find(({ parts }) => isPrefix(parts, truncated));
      if (hit) return hit.locale;
    }

    /**
     * Last resort: a regional cousin.
     *
     * Nothing in RFC 4647 says `pt-PT` answers a request for `pt-BR`, and
     * strictly it does not. It is offered anyway, because a Brazilian reader
     * is better served by European Portuguese than by English — but only when
     * the script agrees, which is what stops `zh-Hant-TW` being answered with
     * `zh-Hans`.
     */
    const wantedScript = scriptOf(wanted);
    const cousin = shipped.find(
      ({ parts }) =>
        parts[0] === wanted[0] &&
        (wantedScript === null || scriptOf(parts) === null || scriptOf(parts) === wantedScript),
    );
    if (cousin) return cousin.locale;
  }

  return fallback;
}

export function resolveLocale(preferred: readonly string[] | string | undefined): Locale {
  return lookupLocale(LOCALES, preferred, DEFAULT_LOCALE);
}
