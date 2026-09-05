import type { MetadataRoute } from "next";
import { GLOSSARY_SORTED } from "@/lib/glossary";
import { SITE } from "@/lib/site";

/**
 * Sitemap.
 *
 * `lastModified` is the deploy time rather than a per-page date: the content
 * ships with the build, so that is the only honest timestamp available.
 * Priorities are relative and deliberately conservative — the home page, then
 * the glossary index, then individual terms.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: SITE.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE.url}/learn`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/teach`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/glossary`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...GLOSSARY_SORTED.map((entry) => ({
      url: `${SITE.url}/glossary/${entry.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE.url}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
