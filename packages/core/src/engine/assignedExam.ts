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
import { isOptionalModule } from '../content/optional';
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
  /**
   * When set, the paper is drawn only from these lessons (and still only the
   * ones the learner has finished). A retake on what they got wrong.
   */
  focusLessons: readonly string[] | null;
  /** `ExamItem.id`s never to ask, such as every question of an earlier paper. */
  excludeItems: readonly string[];
  /** `ExamItem.id`s the learner got wrong before, shown as "study these first". */
  reviewItems: readonly string[];
  /** More lessons the teacher wants redone before the exam. */
  reviewLessons: readonly string[];
  /** ISO time the exam was assigned: a lesson finished after it counts as redone. */
  assignedAt: string;
  /**
   * A final exam. Passing one releases earnings a teacher locked until then
   * (migration 0011), so the intro says what is at stake.
   */
  isFinal: boolean;
  /**
   * Seconds allowed for each question (migration 0012). When they run out the
   * exam moves on by itself, keeping whatever answer was chosen; with none
   * chosen the question counts as wrong. Null: no limit per question.
   */
  secondsPerQuestion: number | null;
  /** The teacher's advice, shown first in the study plan. Null: none. */
  studyNote: string | null;
}

/** The `assigned_exams` columns a client reads. */
export const ASSIGNED_EXAM_COLUMNS =
  'id, locale, seed, item_count, assigned_at, focus_lessons, exclude_items, review_items, review_lessons, is_final, seconds_per_question, study_note';

/** A database row as an exam, or null if its language is not one we ship. */
export function assignedExamFromRow(row: {
  id: string;
  locale: string;
  seed: string;
  item_count: number;
  assigned_at?: string | null;
  focus_lessons?: string[] | null;
  exclude_items?: string[] | null;
  review_items?: string[] | null;
  review_lessons?: string[] | null;
  is_final?: boolean | null;
  seconds_per_question?: number | null;
  study_note?: string | null;
}): AssignedExam | null {
  if (!isLocale(row.locale)) return null;
  return {
    id: row.id,
    locale: row.locale,
    seed: row.seed,
    itemCount: row.item_count,
    focusLessons: row.focus_lessons && row.focus_lessons.length > 0 ? row.focus_lessons : null,
    excludeItems: row.exclude_items ?? [],
    reviewItems: row.review_items ?? [],
    reviewLessons: row.review_lessons ?? [],
    assignedAt: row.assigned_at ?? new Date(0).toISOString(),
    isFinal: row.is_final === true,
    secondsPerQuestion:
      typeof row.seconds_per_question === 'number' && row.seconds_per_question > 0
        ? row.seconds_per_question
        : null,
    studyNote: row.study_note?.trim() ? row.study_note.trim() : null,
  };
}

/**
 * Seconds left on the current question, or null when the exam has no limit
 * per question. `elapsedMs` is the time since the question appeared. Both
 * clients count down with this, so they agree on when a question ends.
 */
export function questionSecondsLeft(
  exam: Pick<AssignedExam, 'secondsPerQuestion'>,
  elapsedMs: number,
): number | null {
  if (exam.secondsPerQuestion === null) return null;
  return Math.max(0, Math.ceil(exam.secondsPerQuestion - elapsedMs / 1000));
}

/**
 * ---------------------------------------------------------------------------
 * What to study before the exam
 * ---------------------------------------------------------------------------
 *
 * A retake comes with advice, like a tutor's: the questions the learner got
 * wrong last time, and the lessons to go back to, each ticked off once it
 * has been finished again since the exam was assigned. Built here so the app
 * and the website give the same advice. Advice only: Start is never locked.
 *
 * `modules` must be in the exam's language, so the questions read in it.
 */
export interface StudyPlan {
  /** The teacher's own advice, shown first. */
  note: string | null;
  /** Questions answered wrong before, in the order the teacher listed them. */
  missed: readonly { itemId: string; lessonId: string; prompt: string }[];
  /** Lessons to go back to: those of the missed questions, then the rest. */
  lessons: readonly {
    lessonId: string;
    title: string;
    moduleTitle: string;
    /** The lesson is built around a video, which plays when it is opened. */
    hasVideo: boolean;
    redone: boolean;
  }[];
  redoneCount: number;
  /**
   * The lessons of the plan that are built around a video, listed again on
   * their own so the videos to watch stand out. Opening one plays it.
   */
  videos: readonly { lessonId: string; title: string; moduleTitle: string; watched: boolean }[];
}

export function examStudyPlan(
  modules: readonly Module[],
  exam: Pick<AssignedExam, 'reviewItems' | 'reviewLessons' | 'assignedAt'> &
    Partial<Pick<AssignedExam, 'studyNote'>>,
  lastCompletedAt: (lessonId: string) => string | null | undefined,
): StudyPlan | null {
  const lessons = new Map(
    modules.flatMap((module) =>
      module.lessons.map((lesson) => [lesson.id, { lesson, module }] as const),
    ),
  );

  const missed = exam.reviewItems.flatMap((itemId) => {
    const [lessonId, challengeId] = itemId.split('#');
    const found = lessons.get(lessonId ?? '');
    const challenge = found?.lesson.challenges.find((entry) => entry.id === challengeId);
    return found && challenge ? [{ itemId, lessonId: found.lesson.id, prompt: challenge.prompt }] : [];
  });

  const ids = [...new Set([...missed.map((item) => item.lessonId), ...exam.reviewLessons])];
  const since = Date.parse(exam.assignedAt);
  const plan = ids.flatMap((lessonId) => {
    const found = lessons.get(lessonId);
    if (!found) return [];
    const finished = lastCompletedAt(lessonId);
    return [
      {
        lessonId,
        title: found.lesson.title,
        moduleTitle: found.module.title,
        hasVideo: Boolean(found.lesson.video),
        redone: Boolean(finished) && Date.parse(finished as string) > since,
      },
    ];
  });

  const note = exam.studyNote?.trim() ? exam.studyNote.trim() : null;
  if (!note && missed.length === 0 && plan.length === 0) return null;
  return {
    note,
    missed,
    lessons: plan,
    redoneCount: plan.filter((lesson) => lesson.redone).length,
    videos: plan
      .filter((lesson) => lesson.hasVideo)
      .map(({ lessonId, title, moduleTitle, redone }) => ({
        lessonId,
        title,
        moduleTitle,
        watched: redone,
      })),
  };
}

/**
 * Draw the paper from the lessons this learner has finished.
 *
 * A private module is left out even when the learner can see it: a teacher
 * sets the exam on the course, and the two clients must draw the same paper
 * whatever else the learner happens to be granted.
 */
export function assembleAssignedExam(
  modules: readonly Module[],
  isLessonDone: (lessonId: string) => boolean,
  assignment: Pick<AssignedExam, 'seed' | 'itemCount'> &
    Partial<Pick<AssignedExam, 'focusLessons' | 'excludeItems'>>,
): AssembledExam {
  const focus = assignment.focusLessons ? new Set(assignment.focusLessons) : null;
  const excluded = new Set(assignment.excludeItems ?? []);
  const finished = modules
    .filter((module) => !isOptionalModule(module.id))
    .map((module) => ({
      ...module,
      lessons: module.lessons
        .filter((lesson) => isLessonDone(lesson.id) && (!focus || focus.has(lesson.id)))
        .map((lesson) => ({
          ...lesson,
          challenges: lesson.challenges.filter(
            (challenge) => !excluded.has(`${lesson.id}#${challenge.id}`),
          ),
        }))
        .filter((lesson) => lesson.challenges.length > 0),
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

/**
 * The arguments for `submit_assigned_exam`. Scores only, never the answers:
 * which questions were asked and which were missed are ids, so a teacher can
 * set a retake on exactly those, but what the learner answered is not sent.
 */
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
    p_paper_items: result.items.map((item) => item.id),
    p_missed_items: result.items.filter((item) => !item.correct).map((item) => item.id),
  };
}

/**
 * ---------------------------------------------------------------------------
 * The clock, and the bonus for finishing fast
 * ---------------------------------------------------------------------------
 *
 * The database times the exam (`supabase/migrations/0010_exam_timer.sql`):
 * the clock starts the first time the learner taps Start, keeps running if
 * they leave, and stops when they hand in. The bonus is worked out there too,
 * and minted to euros like lesson XP. This copy of the rule is for explaining
 * it on screen; a test keeps the two in step.
 *
 * No bonus below the pass mark, so rushing and guessing never pay, and none
 * after leaving the exam even once (switching apps, hiding the tab, or
 * closing it and starting again), so looking answers up does not either.
 */
export const EXAM_SPEED_BONUS = {
  /** The share of answers that must be right before speed counts at all. */
  minShare: 0.7,
  /** At or under this many seconds a question: the full bonus. */
  fastSecondsPerQuestion: 30,
  /** At or under this many seconds a question: half the bonus. */
  steadySecondsPerQuestion: 60,
  /** The full bonus, per question asked. */
  xpPerQuestion: 5,
} as const;

/**
 * Whether a result passes: at least 70% right, the same mark the speed bonus
 * needs. Passing a final exam is what releases locked earnings
 * (`web/src/lib/rewards/earnings.ts`).
 */
export function examPassed(asked: number | null, correct: number | null): boolean {
  if (asked === null || correct === null || asked <= 0) return false;
  if (correct < 0 || correct > asked) return false;
  return correct >= Math.ceil(asked * EXAM_SPEED_BONUS.minShare);
}

/** The bonus for a result and a time, by the same rule as the database. */
export function examSpeedBonusXp(
  asked: number,
  correct: number,
  seconds: number | null,
  leaves = 0,
): number {
  const rule = EXAM_SPEED_BONUS;
  if (leaves > 0) return 0;
  if (seconds === null || asked <= 0 || correct < Math.ceil(asked * rule.minShare)) return 0;
  const full = asked * rule.xpPerQuestion;
  if (seconds <= asked * rule.fastSecondsPerQuestion) return full;
  if (seconds <= asked * rule.steadySecondsPerQuestion) return Math.floor(full / 2);
  return 0;
}

/** What the database recorded when the exam was handed in. */
export interface ExamTiming {
  /** Null when the exam was never started through the clock. */
  seconds: number | null;
  bonusXp: number;
  /** Times the learner left the exam before handing it in. */
  leaves: number;
}

/**
 * The reply from `submit_assigned_exam` as a timing, or null when it said
 * nothing usable. Supabase returns a set-returning function as an array.
 */
export function examTimingFromReply(data: unknown): ExamTiming | null {
  const row = Array.isArray(data) ? data[0] : data;
  if (typeof row !== 'object' || row === null) return null;
  const { duration_seconds: seconds, bonus_xp: bonus, leaves } = row as Record<string, unknown>;
  return {
    seconds: typeof seconds === 'number' ? seconds : null,
    bonusXp: typeof bonus === 'number' ? bonus : 0,
    leaves: typeof leaves === 'number' ? leaves : 0,
  };
}

/** The reply from `start_assigned_exam`: the clock so far, and the leaves. */
export function examStartFromReply(data: unknown): { seconds: number; leaves: number } {
  const row = Array.isArray(data) ? data[0] : data;
  const { elapsed_seconds: seconds, leaves } =
    typeof row === 'object' && row !== null ? (row as Record<string, unknown>) : {};
  return {
    seconds: typeof seconds === 'number' ? seconds : 0,
    leaves: typeof leaves === 'number' ? leaves : 0,
  };
}

/** `m:ss`, or `h:mm:ss` from an hour, for a clock on screen. */
export function formatExamClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}
