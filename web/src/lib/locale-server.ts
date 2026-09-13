/**
 * The locale, on the server.
 *
 * `LocaleProvider` resolves the reader's language in the browser, which is
 * correct for a returning visitor and useless to a crawler: the HTML it fetches
 * is rendered before any of that runs. Search engines, link previews and the
 * `lang` attribute all need the answer during the render, and the only thing
 * that knows it then is the URL — carried here on a header by `middleware.ts`.
 */

import { headers } from 'next/headers';
import { isLocale, type Locale } from '@openmacro/core/i18n/locales';

import { LOCALE_HEADER } from '@/middleware';
import { SITE } from '@/lib/site';
import { localePath } from '@/lib/locale-path';

// Re-exported so server callers have one import for locale URL work, while the
// implementation stays in a module a client component can also reach.
export { localePath };

export function localeUrl(locale: Locale, path: string): string {
  const suffix = localePath(locale, path);
  return `${SITE.url}${suffix === '/' ? '' : suffix}`;
}

export async function serverLocale(): Promise<Locale> {
  const value = (await headers()).get(LOCALE_HEADER);
  return isLocale(value) ? value : 'en';
}

/**
 * `canonical` plus the `hreflang` pair for one page.
 *
 * Both languages list both URLs and each names itself canonical, which is what
 * tells a crawler these are translations of one page rather than duplicates
 * competing for the same query.
 */
export function alternates(locale: Locale, path: string) {
  return {
    canonical: localeUrl(locale, path),
    languages: {
      en: localeUrl('en', path),
      'pt-PT': localeUrl('pt-PT', path),
      'x-default': localeUrl('en', path),
    },
  };
}
