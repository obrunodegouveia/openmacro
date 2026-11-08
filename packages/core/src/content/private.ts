/**
 * ============================================================================
 * Modules shown only to the learners they are granted to
 * ============================================================================
 *
 * Kept out of `MODULES` on purpose. Everything that reads `MODULES` (the public
 * course map, the sitemap, the module pages, rewards, the course exam, the
 * translation coverage) never sees these, so a private module cannot leak onto
 * a public page by being forgotten in one of them.
 *
 * A module here reaches a learner only through `localisedModules(locale,
 * unlocked)`, and `unlocked` comes from the `module_grants` table, which a
 * learner can read only for themselves (`supabase/migrations/0009`). Who has a
 * grant is decided in the SQL editor, so no name or email address is ever
 * written into this repository. See `docs/private-modules.md`.
 *
 * WHAT THIS DOES NOT DO: the lessons are still in the public repository and in
 * the app bundle. "Private" means the module is not shown, not that its text is
 * secret. Nothing that must stay confidential belongs here.
 */

import type { Lesson, Module } from './schema';
import { moduleBitcoinPriceFormation } from './private/bitcoin-price-formation';

/** Every private module, in the order they appear after the public course. */
export const PRIVATE_MODULES: readonly Module[] = [moduleBitcoinPriceFormation];

const PRIVATE_IDS = new Set(PRIVATE_MODULES.map((module) => module.id));

/** True for a module that only granted learners may see. */
export function isPrivateModule(moduleId: string): boolean {
  return PRIVATE_IDS.has(moduleId);
}

/** Every lesson in a private module. */
export const PRIVATE_LESSONS: readonly Lesson[] = PRIVATE_MODULES.flatMap(
  (module) => module.lessons,
);

/** The private module a lesson belongs to, if it belongs to one. */
export function privateModuleForLesson(lessonId: string): Module | undefined {
  return PRIVATE_MODULES.find((module) =>
    module.lessons.some((lesson) => lesson.id === lessonId),
  );
}

/** The `module_grants` columns a client reads. */
export const MODULE_GRANT_COLUMNS = 'module_id';

/** Grant rows as the list of private modules they unlock, ignoring unknown ids. */
export function unlockedFromRows(rows: readonly { module_id: string }[] | null): string[] {
  return (rows ?? []).map((row) => row.module_id).filter(isPrivateModule);
}
