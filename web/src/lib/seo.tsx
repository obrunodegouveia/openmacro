import type { Metadata } from "next";
import { SITE } from "@/lib/site";

/**
 * Shared metadata helpers.
 *
 * Every indexable route builds its metadata through `pageMetadata` so that the
 * canonical URL, the OG/Twitter pair and the title format can never drift
 * apart page by page — the most common way a technically clean site ends up
 * with duplicate or missing canonicals.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
  publishedTime,
}: {
  title: string;
  description: string;
  /** Route path beginning with a slash, e.g. `/glossary`. */
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const url = `${SITE.url}${path === "/" ? "" : path}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: SITE.name,
      title,
      description,
      locale: "en_US",
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
