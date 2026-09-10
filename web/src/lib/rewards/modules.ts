import "server-only";

import { MODULES } from "@openmacro/core/content/registry";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * ============================================================================
 * Has this learner finished this module?
 * ============================================================================
 *
 * The question a €1 claim depends on, answered against the content registry
 * and the learner's own progress rows — never against anything the browser
 * asserts. The request names a module; everything else is looked up.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS CANNOT PROVE
 * ---------------------------------------------------------------------------
 *
 * `lesson_progress` is writable by the learner. That is deliberate and stated
 * in migration 0001: the honest-client model is right for XP, where the worst
 * a cheat achieves is lying to themselves.
 *
 * Money changes what that costs. Somebody who can use the anon key directly
 * can insert completions they did not earn and claim the reward. There is no
 * fix for that short of grading server-side, which would mean moving the whole
 * engine off the device and giving up offline play.
 *
 * What makes it acceptable here is the cap, not the check: one claim per
 * learner per module, so the entire scheme is bounded at
 * `MODULES.length × the reward`. At sixteen modules and €1 that is sixteen
 * euros per person, ever. If the reward ever grows past what you would hand
 * over on trust, this is the assumption to revisit first.
 */

export interface ModuleCompletion {
  moduleId: string;
  title: string;
  lessonCount: number;
  completedCount: number;
  complete: boolean;
}

/** The claim key for a module. One per learner, enforced by a unique index. */
export function moduleClaimKey(moduleId: string): string {
  return `module:${moduleId}`;
}

export function findModule(moduleId: string) {
  return MODULES.find((candidate) => candidate.id === moduleId) ?? null;
}

/**
 * Check completion for one module.
 *
 * A module counts as finished when every lesson in it has at least one
 * completion. Deliberately not "every lesson at full XP": the reward is for
 * getting to the end, and demanding perfection would turn a gift into a grind.
 */
export async function readModuleCompletion(
  userId: string,
  moduleId: string,
): Promise<ModuleCompletion | null> {
  const found = findModule(moduleId);
  if (!found) return null;

  const lessonIds = found.lessons.map((lesson) => lesson.id);

  const { data, error } = await getSupabaseAdmin()
    .from("lesson_progress")
    .select("lesson_id, completions")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds);

  if (error) {
    console.error("[rewards] progress lookup failed", { userId, moduleId }, error);
    return null;
  }

  const finished = new Set(
    (data ?? [])
      .filter((row) => (row.completions as number) > 0)
      .map((row) => row.lesson_id as string),
  );

  const completedCount = lessonIds.filter((id) => finished.has(id)).length;

  return {
    moduleId: found.id,
    title: found.title,
    lessonCount: lessonIds.length,
    completedCount,
    complete: completedCount === lessonIds.length,
  };
}

/** Every module with its progress, for the claim UI. */
export async function readAllModuleCompletions(userId: string): Promise<ModuleCompletion[]> {
  const { data } = await getSupabaseAdmin()
    .from("lesson_progress")
    .select("lesson_id, completions")
    .eq("user_id", userId);

  const finished = new Set(
    (data ?? [])
      .filter((row) => (row.completions as number) > 0)
      .map((row) => row.lesson_id as string),
  );

  return MODULES.map((entry) => {
    const lessonIds = entry.lessons.map((lesson) => lesson.id);
    const completedCount = lessonIds.filter((id) => finished.has(id)).length;
    return {
      moduleId: entry.id,
      title: entry.title,
      lessonCount: lessonIds.length,
      completedCount,
      complete: completedCount === lessonIds.length,
    };
  });
}
