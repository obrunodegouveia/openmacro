import { MODULES } from "@openmacro/core/content";
import type { MetadataRoute } from "next";
import { GLOSSARY_SORTED } from "@/lib/glossary";
import { localeUrl } from "@/lib/locale-server";

/**
 * Sitemap.
 *
 * `lastModified` is the deploy time rather than a per-page date: the content
 * ships with the build, so that is the only honest timestamp available.
 * Priorities are relative and deliberately conservative — the home page, then
 * the glossary index, then individual terms.
 *
 * Every entry is emitted once per locale, each carrying the `alternates.
 * languages` pair. That pairing is the part that matters: without it the
 * Portuguese URLs look to a crawler like near-duplicates of the English ones
 * competing for the same queries, rather than translations of them.
 */

/** One entry per locale, cross-linked, from a single route path. */
function localised(
  path: string,
  changeFrequency: "weekly" | "monthly" | "yearly",
  priority: number,
  lastModified: Date,
) {
  const languages = {
    en: localeUrl("en", path),
    "pt-PT": localeUrl("pt-PT", path),
  };
  return (["en", "pt-PT"] as const).map((locale) => ({
    url: localeUrl(locale, path),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...localised("/", "weekly", 1, now),
    ...localised("/learn", "monthly", 0.9, now),
    ...localised("/teach", "monthly", 0.9, now),
    ...localised("/glossary", "monthly", 0.8, now),
    ...GLOSSARY_SORTED.flatMap((entry) =>
      localised(`/glossary/${entry.slug}`, "monthly", 0.7, now),
    ),
    // Every lesson, straight from the content registry: adding a lesson to
    // packages/core puts it in the sitemap without anyone remembering to.
    ...MODULES.flatMap((module) =>
      module.lessons.flatMap((lesson) =>
        localised(`/learn/${lesson.id}`, "monthly", 0.8, now),
      ),
    ),
    ...localised("/login", "yearly", 0.3, now),
    ...localised("/privacy", "yearly", 0.3, now),
  ];
}
