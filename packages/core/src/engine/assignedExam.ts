/**
 * ============================================================================
 * An exam a teacher assigns to one learner
 * ============================================================================
 *
 * `exam.ts` draws a paper from the whole course, because it asks whether
 * someone has passed the course. This asks something smaller: how much has
 * this learner kept of what they have done? So the paper is drawn only from
 * lessons they have finished, in proportion to what they have finished at each
 * level. A learner who has only done beginner lessons is not marked down for
 * never having seen the advanced ones.
 *
 * Both clients call this, so the app and the website set the same paper for
 * the same seed and the same progress. Grading is still `gradeExam`.
 */

import { MODULE_LEVELS, type Module, type ModuleLevel } from '../content/schema';
import { isLocale, type Locale } from '../i18n/locales';
import {
  assembleExam,
  type AssembledExam,
  type ExamBlueprint,
  type ExamResult,
} from './exam';

export interface AssignedExam {
  id: string;
  locale: Locale;
  seed: string;
  itemCount: number;
}

/** The `assigned_exams` columns a client reads. */
export const ASSIGNED_EXAM_COLUMNS = 'id, locale, seed, item_count';

/** A database row as an exam, or null if its language is not one we ship. */
export function assignedExamFromRow(row: {
  id: string;
  locale: string;
  seed: string;
  item_count: number;
}): AssignedExam | null {
  if (!isLocale(row.locale)) return null;
  return { id: row.id, locale: row.locale, seed: row.seed, itemCount: row.item_count };
}

/** Draw the paper from the lessons this learner has finished. */
export function assembleAssignedExam(
  modules: readonly Module[],
  isLessonDone: (lessonId: string) => boolean,
  assignment: Pick<AssignedExam, 'seed' | 'itemCount'>,
): AssembledExam {
  const finished = modules
    .map((module) => ({
      ...module,
      lessons: module.lessons.filter((lesson) => isLessonDone(lesson.id)),
    }))
    .filter((module) => module.lessons.length > 0);

  const available = (level: ModuleLevel): number =>
    finished
      .filter((module) => module.level === level)
      .reduce(
        (sum, module) =>
          sum + module.lessons.reduce((inner, lesson) => inner + lesson.challenges.length, 0),
        0,
      );

  const levelWeights = Object.fromEntries(
    MODULE_LEVELS.map((level) => [level, available(level)]),
  ) as Record<ModuleLevel, number>;
  const total = MODULE_LEVELS.reduce((sum, level) => sum + levelWeights[level], 0);

  const blueprint: ExamBlueprint = {
    itemCount: Math.min(assignment.itemCount, total),
    levelWeights,
    minAppliedShare: 0.25,
    passMark: 0.7,
    levelPassMark: 0.5,
  };

  return assembleExam(finished, assignment.seed, blueprint);
}

/** The arguments for `submit_assigned_exam`. Scores only, never the answers. */
export function assignedExamSubmission(examId: string, result: ExamResult) {
  return {
    p_exam: examId,
    p_asked: result.asked,
    p_correct: result.correct,
    p_by_level: result.byLevel
      .filter((level) => level.asked > 0)
      .map(({ level, asked, correct }) => ({ level, asked, correct })),
    p_weak_modules: [...result.weakModules],
    p_fingerprint: result.fingerprint,
  };
}
