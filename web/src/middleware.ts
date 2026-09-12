/**
 * ============================================================================
 * Locale routing
 * ============================================================================
 *
 * Portuguese needs its own URLs or it does not exist as far as a search engine
 * is concerned. Before this, the locale lived in `localStorage` and every URL
 * server-rendered English, so there was nothing in Portuguese to index and no
 * `hreflang` announcing that a Portuguese version existed at all.
 *
 * `/pt/learn` is rewritten — not redirected — to `/learn`, with the locale
 * carried on a request header the layout and every `generateMetadata` read.
 * The visitor's address bar keeps `/pt/learn`, which is the URL Google
 * indexes and the one `hreflang` points at, while exactly one set of route
 * files serves both languages.
 *
 * English keeps its bare paths. `/learn` was already indexed under that URL
 * and moving it to `/en/learn` would trade a real ranking for a tidier tree.
 */

import { NextResponse, type NextRequest } from 'next/server';

/** URL segment → BCP-47 tag. The segment is short because it is public. */
export const LOCALE_SEGMENTS = { pt: 'pt-PT' } as const;

export const LOCALE_HEADER = 'x-openmacro-locale';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, first, ...rest] = pathname.split('/');

  const locale = first && first in LOCALE_SEGMENTS
    ? LOCALE_SEGMENTS[first as keyof typeof LOCALE_SEGMENTS]
    : null;

  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, locale ?? 'en');

  if (!locale) return NextResponse.next({ request: { headers } });

  // Strip the segment so the existing route tree serves the page. A rewrite,
  // so the Portuguese URL is what stays in the address bar and in the index.
  const url = request.nextUrl.clone();
  url.pathname = `/${rest.join('/')}`;
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  // Everything except Next's own assets and the files that must stay at the
  // domain root to be found: sitemap.xml, robots.txt, favicons.
  matcher: ['/((?!_next|api|.*\\.).*)'],
};
