'use client';

/**
 * The site's own copy, in a client component.
 *
 * Reads the locale the provider was handed by the server, so a client island
 * inside a Portuguese page renders Portuguese on its first paint rather than
 * flipping after hydration.
 */

import * as React from 'react';
import { createSiteTranslator, type SiteTranslator } from '@openmacro/core/i18n/site';

import { useLocale } from '@/components/site/locale-provider';

export function useSiteText(): SiteTranslator {
  const { locale } = useLocale();
  return React.useMemo(() => createSiteTranslator(locale), [locale]);
}
