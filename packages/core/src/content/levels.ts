/**
 * ============================================================================
 * Level grouping
 * ============================================================================
 *
 * Both clients draw the path as one collapsible section per level, and both
 * need the same three facts about a group: which level it is, which modules
 * are in it, and where it starts in the overall order so the "Module N"
 * numbering keeps counting across the whole course rather than restarting.
 *
 * Shared rather than written twice because the rule that matters here is
 * subtle and easy to lose in a rewrite: **never sort.** `MODULES` is already
 * stored in level order — see the note in `registry.ts` — and a sorted copy
 * would let the path disagree with the order `localisedNextLesson` walks, so
 * "continue" would send a learner somewhere the path does not show them next.
 */

import type { Module, ModuleLevel } from './schema';

export interface LevelGroup {
  level: ModuleLevel;
  modules: readonly Module[];
  /** Index of this group's first module in the full course order. */
  offset: number;
}

/**
 * Split modules into consecutive runs of the same level, preserving order.
 *
 * Walks the list and opens a new group whenever the level changes, which
 * gives the right answer for a correctly ordered registry and — deliberately
 * — a visibly wrong one for a mis-ordered registry, rather than quietly
 * papering over it by grouping into a map.
 */
export function groupByLevel(modules: readonly Module[]): LevelGroup[] {
  const groups: LevelGroup[] = [];
  modules.forEach((module, index) => {
    const current = groups[groups.length - 1];
    if (current && current.level === module.level) {
      (current.modules as Module[]).push(module);
      return;
    }
    groups.push({ level: module.level, modules: [module], offset: index });
  });
  return groups;
}

/**
 * The group a learner should be shown first: the one holding their next
 * unfinished lesson, or the last group once everything is done.
 *
 * Collapsing every level would open the app on three headings and no course.
 * Exactly one starts open, and it is the one they would otherwise have had to
 * scroll to find.
 */
export function currentLevel(
  groups: readonly LevelGroup[],
  isLessonComplete: (lessonId: string) => boolean,
): ModuleLevel | undefined {
  const unfinished = groups.find((group) =>
    group.modules.some((module) => module.lessons.some((lesson) => !isLessonComplete(lesson.id))),
  );
  return (unfinished ?? groups[groups.length - 1])?.level;
}

/** The level a module belongs to — used to open a section a deep link targets. */
export function levelOfModule(
  groups: readonly LevelGroup[],
  moduleId: string,
): ModuleLevel | undefined {
  return groups.find((group) => group.modules.some((module) => module.id === moduleId))?.level;
}
