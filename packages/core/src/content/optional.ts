/**
 * ============================================================================
 * Optional modules: outside the course until a learner turns them on
 * ============================================================================
 *
 * Kept out of `MODULES` on purpose. Everything that reads `MODULES` (the public
 * course map, the sitemap, the module pages, rewards, the course exam) never
 * sees these, so an optional module cannot appear on a page that has not asked
 * for it by being forgotten in one of them.
 *
 * A module here reaches a learner only through `localisedModules(locale,
 * unlocked)`. Two things put an id in `unlocked`, and both clients combine
 * them the same way (`unlockedModules` below):
 *
 *   • **Bitcoin mode**, a switch in settings anyone can turn on. It unlocks
 *     `BITCOIN_MODE_MODULES`. Per device, like kids mode.
 *   • **A grant**, a row in `module_grants` that a learner can read only for
 *     themselves (`supabase/migrations/0009`), for a module meant for one
 *     person. Chosen in the SQL editor, so no name or email address is ever
 *     written into this repository. See `docs/optional-modules.md`.
 *
 * Translations are not optional: `i18n:status --strict` and `check:language`
 * hold these modules to the same standard as the course.
 *
 * WHAT THIS DOES NOT DO: the lessons are in the public repository and in the
 * app bundle. "Optional" means not shown until unlocked, not secret.
 */

import type { Lesson, Module } from './schema';
import { moduleBitcoinPriceFormation } from './optional/bitcoin-price-formation';

/** Every optional module, in the order they appear after the course. */
export const OPTIONAL_MODULES: readonly Module[] = [moduleBitcoinPriceFormation];

/** What Bitcoin mode unlocks, in that order. */
export const BITCOIN_MODE_MODULES: readonly string[] = [moduleBitcoinPriceFormation.id];

const OPTIONAL_IDS = new Set(OPTIONAL_MODULES.map((module) => module.id));

/** True for a module outside the course, shown only once unlocked. */
export function isOptionalModule(moduleId: string): boolean {
  return OPTIONAL_IDS.has(moduleId);
}

/** True for a module that Bitcoin mode turns on. */
export function isBitcoinModeModule(moduleId: string): boolean {
  return BITCOIN_MODE_MODULES.includes(moduleId);
}

/** Every lesson in an optional module. */
export const OPTIONAL_LESSONS: readonly Lesson[] = OPTIONAL_MODULES.flatMap(
  (module) => module.lessons,
);

/** The optional module a lesson belongs to, if it belongs to one. */
export function optionalModuleForLesson(lessonId: string): Module | undefined {
  return OPTIONAL_MODULES.find((module) =>
    module.lessons.some((lesson) => lesson.id === lessonId),
  );
}

/**
 * What this learner sees beyond the course: their grants, plus Bitcoin mode's
 * modules when it is on. Sorted in `OPTIONAL_MODULES` order and without
 * repeats, so the two clients build the same list from the same inputs.
 */
export function unlockedModules(grants: readonly string[], bitcoinMode: boolean): string[] {
  const wanted = new Set([...grants, ...(bitcoinMode ? BITCOIN_MODE_MODULES : [])]);
  return OPTIONAL_MODULES.map((module) => module.id).filter((id) => wanted.has(id));
}

/** The `module_grants` columns a client reads. */
export const MODULE_GRANT_COLUMNS = 'module_id';

/** Grant rows as the list of optional modules they unlock, ignoring unknown ids. */
export function unlockedFromRows(rows: readonly { module_id: string }[] | null): string[] {
  return (rows ?? []).map((row) => row.module_id).filter(isOptionalModule);
}
