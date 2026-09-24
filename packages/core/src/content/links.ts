/**
 * ============================================================================
 * Public links to course content
 * ============================================================================
 *
 * Where a module or a lesson lives on the web, as a URL anyone can open
 * without installing anything.
 *
 * This is the app's answer to "can you send me that?". A learner who wants to
 * show someone a lesson cannot send them an app; the website is the shareable
 * form of the same course, running the same content from `packages/core`, so
 * a link to it is a link to the identical exercise.
 *
 * Built here rather than in either client because the format is a contract
 * between them: the website owns the routes and the anchors, the app produces
 * links that have to land on them, and a copy of the rules in each place is a
 * copy that drifts. See the parity rule in CONTRIBUTING.md.
 *
 * Pure string work — no DOM, no React Native — so it compiles in `core`.
 */

import type { Locale } from '../i18n/locales';

/** Where the web course is served. */
export const SITE_ORIGIN = 'https://openmacro.org';

/**
 * URL segment per locale, mirroring `web/src/lib/locale-path.ts`.
 *
 * English is unprefixed: `/learn`, not `/en/learn`. If that file gains a
 * locale, this one has to as well — a link with the wrong prefix does not
 * fail, it silently sends a Portuguese reader to the English course.
 */
const SEGMENTS: Partial<Record<Locale, string>> = { 'pt-PT': 'pt' };

function localeSegment(locale: Locale): string {
  const segment = SEGMENTS[locale];
  return segment ? `/${segment}` : '';
}

/**
 * A link to one module on the course map, which opens at that module.
 *
 * The anchor is the module id, and the website's course map reads the hash on
 * load to expand both the level and the module inside it — the `id` on each
 * module section exists for exactly this.
 */
export function moduleUrl(moduleId: string, locale: Locale): string {
  return `${SITE_ORIGIN}${localeSegment(locale)}/learn#${moduleId}`;
}

/** A link to one lesson, playable in a browser. */
export function lessonUrl(lessonId: string, locale: Locale): string {
  return `${SITE_ORIGIN}${localeSegment(locale)}/learn/${lessonId}`;
}
