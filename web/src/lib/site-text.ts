/**
 * The site's own copy, in the reader's language.
 *
 * Two entry points because the site has two kinds of component and they learn
 * the locale differently. A server component is rendered once per request and
 * reads it from the URL — which is the half that matters for search engines,
 * since it is the only half a crawler ever sees. A client component reads it
 * from the provider, which was given the same value.
 *
 * Both return the same bound function, so a component that later moves across
 * the boundary changes its import and nothing else.
 */

import { createSiteTranslator, type SiteTranslator } from '@openmacro/core/i18n/site';

import { serverLocale } from '@/lib/locale-server';

export type { SiteTranslator };

/** For server components and `generateMetadata`. */
export async function getSiteText(): Promise<SiteTranslator> {
  return createSiteTranslator(await serverLocale());
}
