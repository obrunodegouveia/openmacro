/**
 * The persistence seam.
 *
 * The app talks only to this interface, so swapping the bundled in-memory mock
 * for AsyncStorage, SQLite or a real API is a one-file change with no UI churn.
 */

export interface LearnerProfile {
  id: string;
  displayName: string;
  /** Lifetime XP across every lesson. */
  totalXp: number;
  /** Consecutive days with at least one completed lesson. */
  dayStreak: number;
  /** Whether the streak has already been extended today. */
  streakActiveToday: boolean;
  /** ISO date, `YYYY-MM-DD`. */
  lastActiveOn: string;
}

export interface LessonProgress {
  lessonId: string;
  /** Best XP the learner has scored on this lesson. */
  bestXp: number;
  /** Total completed runs. */
  completions: number;
  /** True if any run finished without losing a heart. */
  perfect: boolean;
  lastCompletedAt: string;
}

/** What the runner reports when a learner finishes (or fails) a lesson. */
export interface LessonResult {
  lessonId: string;
  xpEarned: number;
  heartsRemaining: number;
  maxHearts: number;
  bestCombo: number;
  completed: boolean;
}

export interface LearningDataProvider {
  getProfile(): Promise<LearnerProfile>;
  getAllProgress(): Promise<Record<string, LessonProgress>>;
  /** Persists a finished run and returns the updated snapshot. */
  recordLessonResult(
    result: LessonResult,
  ): Promise<{ profile: LearnerProfile; progress: Record<string, LessonProgress> }>;
  /** Wipes everything — handy in development and for a "start over" button. */
  reset(): Promise<void>;
}
