import type { Metadata } from "next";
import type { Locale } from "@openmacro/core/i18n/locales";
import { SITE } from "@/lib/site";
import { alternates as localeAlternates, localeUrl } from "@/lib/locale-server";

/**
 * Shared metadata helpers.
 *
 * Every indexable route builds its metadata through `pageMetadata` so that the
 * canonical URL, the OG/Twitter pair and the title format can never drift
 * apart page by page — the most common way a technically clean site ends up
 * with duplicate or missing canonicals.
 *
 * `locale` drives three things at once: the canonical URL gains its `/pt`
 * prefix, the `hreflang` pair is emitted so a crawler knows the two URLs are
 * translations rather than duplicates, and Open Graph is told which language
 * it is looking at. Omitting it renders an English page, which is what every
 * caller did before Portuguese had URLs.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
  publishedTime,
  locale = "en",
}: {
  title: string;
  description: string;
  /** Route path beginning with a slash, e.g. `/glossary`. */
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  locale?: Locale;
}): Metadata {
  const url = localeUrl(locale, path);

  return {
    title,
    description,
    keywords,
    alternates: localeAlternates(locale, path),
    openGraph: {
      type,
      url,
      siteName: SITE.name,
      title,
      description,
      locale: locale === "pt-PT" ? "pt_PT" : "en_US",
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * Renders a JSON-LD block.
 *
 * The payload is always an object this codebase constructs, never user input,
 * which is what makes the `dangerouslySetInnerHTML` here safe. Keep it that
 * way: if a value ever comes from outside, escape `<` before injecting.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** `BreadcrumbList` for a sub-page, so search results show the hierarchy. */
export function breadcrumbs(
  trail: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE.url}${crumb.path === "/" ? "" : crumb.path}`,
    })),
  };
}

/** The publisher block, reused by every structured-data payload. */
export const ORGANIZATION = {
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/icon.svg`,
  description: SITE.description,
  sameAs: [`https://github.com/${SITE.githubRepo}`],
} as const;
