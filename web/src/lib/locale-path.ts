/**
 * ============================================================================
 * Locale-prefixed paths
 * ============================================================================
 *
 * Pure string work, in its own module so a client component can import it.
 * `locale-server.ts` reaches for `next/headers`, which makes the whole module
 * server-only — and these two functions are needed on both sides of that line.
 *
 * See `middleware.ts` for why English is unprefixed and Portuguese is not.
 */

import type { Locale } from '@openmacro/core/i18n/locales';

/** URL segment per locale. English has none: `/learn`, not `/en/learn`. */
const SEGMENTS: Partial<Record<Locale, string>> = { 'pt-PT': 'pt' };

/**
 * `('pt-PT', '/learn')` → `/pt/learn`. `('en', '/learn')` → `/learn`.
 *
 * Anything that is not a site-internal path is returned untouched, so this is
 * safe to apply blindly: an absolute URL, a `mailto:`, a bare `#anchor` and an
 * already-prefixed path all come back as they went in. That matters because
 * the alternative is every caller remembering which of its hrefs are internal.
 */
export function localePath(locale: Locale, path: string): string {
  const segment = SEGMENTS[locale];
  if (!segment) return path;
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (path === `/${segment}` || path.startsWith(`/${segment}/`)) return path;

  // A path may carry a hash or a query, and the prefix belongs on the path.
  const cut = path.search(/[#?]/);
  const pathname = cut === -1 ? path : path.slice(0, cut);
  const suffix = cut === -1 ? '' : path.slice(cut);

  return `/${segment}${pathname === '/' ? '' : pathname}${suffix}`;
}

/** `/pt/learn` → `/learn`. The inverse, for the language picker. */
export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/pt(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}
