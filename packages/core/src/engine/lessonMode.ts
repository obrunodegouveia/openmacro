/**
 * ============================================================================
 * Lesson modes: standard and kids
 * ============================================================================
 *
 * Kids mode is a shorter, gentler way through a module for a young beginner.
 * It shows only the challenges flagged `kids: true` — Olivia and Breno's
 * warm-ups — and only the lessons that have any. Everything else about a
 * lesson stays as it is — the same id, video and hearts — except its
 * estimated minutes, which follow the shorter run, and its takeaways, which
 * summarise questions a kids run never asks.
 *
 * Decided here, once, so the app and the website agree on what a kids lesson
 * contains. A client reads the learner's mode from its own device setting and
 * passes the result of `lessonForMode` to `createSession`, never the raw
 * lesson: the session, its snapshot check and its XP all count
 * `lesson.challenges`.
 *
 *   mode       lesson on the kids path        lesson off it
 *   --------   ----------------------------   -------------------------------
 *   standard   every challenge, kids first    every challenge
 *   kids       the kids challenges only       unchanged (not listed in kids
 *                                             mode, but a shared link opens)
 */

import type { Lesson, Module } from '../content/schema';

export type LessonMode = 'standard' | 'kids';

export const LESSON_MODES: readonly LessonMode[] = ['standard', 'kids'];

/** Does the lesson have anything for kids mode to show? */
export function onKidsPath(lesson: Lesson): boolean {
  return lesson.challenges.some((challenge) => challenge.kids === true);
}

/** Does the module offer kids mode at all? Clients show the switch only then. */
export function moduleHasKidsPath(module: Module): boolean {
  return module.lessons.some(onKidsPath);
}

/**
 * The mode that actually applies to a lesson: kids mode only reaches lessons
 * on the kids path, so anywhere else it falls back to standard.
 */
export function effectiveMode(lesson: Lesson, mode: LessonMode): LessonMode {
  return mode === 'kids' && onKidsPath(lesson) ? 'kids' : 'standard';
}

// Same lesson in, same object out, so a client can use the result as a React
// dependency or reducer seed without remounting on every render.
const kidsLessons = new WeakMap<Lesson, Lesson>();

/**
 * The lesson as a learner in `mode` meets it.
 *
 * @param lesson The lesson, localised or not — the filter reads only `kids`.
 * @param mode   The learner's mode.
 * @return The same lesson in standard mode or off the kids path; otherwise a
 *         copy holding only its kids challenges, in their original order.
 */
export function lessonForMode(lesson: Lesson, mode: LessonMode): Lesson {
  if (effectiveMode(lesson, mode) === 'standard') return lesson;
  let kids = kidsLessons.get(lesson);
  if (!kids) {
    const challenges = lesson.challenges.filter((challenge) => challenge.kids === true);
    kids = {
      ...lesson,
      challenges,
      // The takeaways summarise the grown-up questions, which a kids run
      // never asked.
      keyTakeaways: undefined,
      // The video plus about a minute and a half a step, the same estimate
      // `scripts/audit-content.mjs` holds the authored lessons to.
      estimatedMinutes: Math.round((lesson.video?.minutes ?? 0) + challenges.length * 1.5),
    };
    kidsLessons.set(lesson, kids);
  }
  return kids;
}

/**
 * The lessons a module lists in `mode`, each already shaped for it.
 *
 * @param module The module.
 * @param mode   The learner's mode.
 * @return In kids mode, only the kids-path lessons; otherwise all of them.
 */
export function lessonsForMode(module: Module, mode: LessonMode): readonly Lesson[] {
  if (mode !== 'kids' || !moduleHasKidsPath(module)) return module.lessons;
  return module.lessons.filter(onKidsPath).map((lesson) => lessonForMode(lesson, mode));
}

/**
 * The next lesson on the kids path after `lessonId`, or null at its end.
 *
 * Kids mode never walks off its own path into a grown-up lesson: after the
 * last kids lesson the client shows that the path is finished instead.
 */
export function nextKidsLesson(module: Module, lessonId: string): Lesson | null {
  const path = module.lessons.filter(onKidsPath);
  const index = path.findIndex((lesson) => lesson.id === lessonId);
  if (index < 0) return null;
  const next = path[index + 1];
  return next ? lessonForMode(next, 'kids') : null;
}

/**
 * Where a run in progress is stored, per mode.
 *
 * A kids run and a standard run of the same lesson hold different
 * challenges, so each keeps its own snapshot; sharing one would make the
 * other mode silently start over (`snapshotFits` rejects it).
 */
export function resumeId(lesson: Lesson, mode: LessonMode): string {
  return effectiveMode(lesson, mode) === 'kids' ? `${lesson.id}.kids` : lesson.id;
}
