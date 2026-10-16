/**
 * ============================================================================
 * Where the learner is in the course
 * ============================================================================
 *
 * Today, Course, the module page and the lesson's end screen all need the same
 * few facts — the next lesson, the module it is in, how far through each
 * module the learner is, and each module's number — and they must agree. A
 * "continue" button that points somewhere the course map does not mark as
 * "you are here" is worse than having neither.
 *
 * So the facts are computed once, here, from the localised course and the
 * learner's progress. Nothing is stored: like the old path screen, everything
 * is derived on each render from the one `progress` record the runner writes.
 *
 * Order is the registry's. `groupByLevel` never sorts (see levels.ts), and
 * module numbers count across the whole course, so "Module 12" means the same
 * thing on every screen and on the website.
 */

import { useCallback, useMemo } from 'react';

import { useLocale } from '@/providers/LocaleProvider';
import { useProgress } from '@/providers/ProgressProvider';
import type { Lesson, Module, ModuleLevel } from '@openmacro/core/content/schema';
import { groupByLevel, type LevelGroup } from '@openmacro/core/content/levels';

export interface ModuleStatus {
  module: Module;
  /** 1-based, across the whole course. */
  number: number;
  level: ModuleLevel;
  done: number;
  total: number;
  minutes: number;
  finished: boolean;
  /** The first unfinished lesson in this module, if any. */
  nextLesson: Lesson | undefined;
}

export interface CourseState {
  groups: LevelGroup[];
  statuses: ModuleStatus[];
  statusOf: (moduleId: string) => ModuleStatus | undefined;
  /** The module a lesson belongs to, in the reading language. */
  moduleOfLesson: (lessonId: string) => ModuleStatus | undefined;
  /** The first unfinished lesson in course order; undefined once all are done. */
  next: { lesson: Lesson; status: ModuleStatus } | undefined;
  /** The level holding `next`, or the last level when the course is finished. */
  currentLevel: ModuleLevel | undefined;
  lessonsDone: number;
  lessonsTotal: number;
}

export function useCourse(): CourseState {
  const { modules } = useLocale();
  const { isLessonComplete } = useProgress();

  const groups = useMemo(() => groupByLevel(modules), [modules]);

  const statuses = useMemo<ModuleStatus[]>(
    () =>
      modules.map((module, index) => {
        const done = module.lessons.filter((lesson) => isLessonComplete(lesson.id)).length;
        return {
          module,
          number: index + 1,
          level: module.level,
          done,
          total: module.lessons.length,
          minutes: module.lessons.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0),
          finished: module.lessons.length > 0 && done === module.lessons.length,
          nextLesson: module.lessons.find((lesson) => !isLessonComplete(lesson.id)),
        };
      }),
    [modules, isLessonComplete],
  );

  const byModule = useMemo(
    () => new Map(statuses.map((status) => [status.module.id, status])),
    [statuses],
  );
  const byLesson = useMemo(
    () =>
      new Map(
        statuses.flatMap((status) =>
          status.module.lessons.map((lesson) => [lesson.id, status] as const),
        ),
      ),
    [statuses],
  );

  const statusOf = useCallback((moduleId: string) => byModule.get(moduleId), [byModule]);
  const moduleOfLesson = useCallback((lessonId: string) => byLesson.get(lessonId), [byLesson]);

  const next = useMemo(() => {
    for (const status of statuses) {
      if (status.nextLesson) return { lesson: status.nextLesson, status };
    }
    return undefined;
  }, [statuses]);

  const lessonsTotal = statuses.reduce((sum, status) => sum + status.total, 0);
  const lessonsDone = statuses.reduce((sum, status) => sum + status.done, 0);

  return {
    groups,
    statuses,
    statusOf,
    moduleOfLesson,
    next,
    currentLevel: next?.status.level ?? groups[groups.length - 1]?.level,
    lessonsDone,
    lessonsTotal,
  };
}
