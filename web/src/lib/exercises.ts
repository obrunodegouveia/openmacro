/**
 * ============================================================================
 * Lessons: sequences of exercises
 * ============================================================================
 *
 * The landing page plays a single T-account puzzle as a teaser. A lesson is
 * the real unit: several exercises in order, with the explanation after each
 * one doing the actual teaching.
 *
 * Exercise kinds are a discriminated union so adding a fifth kind is a new
 * variant plus a new `case` in the runner — TypeScript then points at every
 * place that has to handle it. `t_account` deliberately wraps the existing
 * `TAccountScenario` rather than restating it, so the teaser on the home page
 * and the same step inside a lesson are literally the same data.
 *
 * CONTRIBUTORS: a lesson is plain data. Add one to `LESSONS` below and it gets
 * a route, a place on /learn, and prerendered HTML with no other changes.
 */

import type { TierId } from "@/lib/curriculum";
import { QE_SCENARIO } from "@/lib/scenarios";
import type { TAccountScenario } from "@/lib/t-accounts";

export interface MultipleChoiceOption {
  id: string;
  label: string;
  /**
   * Shown when the learner picks *this* wrong option.
   *
   * The most valuable field in the model: a rebuttal aimed at the specific
   * misconception someone just demonstrated teaches far more than a generic
   * "incorrect".
   */
  feedback?: string;
}

export interface MultipleChoiceExercise {
  kind: "multiple_choice";
  id: string;
  prompt: string;
  instructions?: string;
  options: MultipleChoiceOption[];
  correctOptionId: string;
  /** Shown after answering, right or wrong. This is the teaching. */
  explanation: string;
  xp: number;
}

export interface TAccountExercise {
  kind: "t_account";
  id: string;
  scenario: TAccountScenario;
}

export type Exercise = MultipleChoiceExercise | TAccountExercise;

/** XP is on the scenario for T-accounts and on the exercise otherwise. */
export function exerciseXp(exercise: Exercise): number {
  return exercise.kind === "t_account" ? exercise.scenario.xp : exercise.xp;
}

export interface Lesson {
  /** URL segment: /learn/<slug>. */
  slug: string;
  title: string;
  /** One line promising what the learner will be able to do afterwards. */
  subtitle: string;
  moduleLabel: string;
  tier: TierId;
  estimatedMinutes: number;
  exercises: Exercise[];
  /** Shown on the completion screen. */
  takeaways: string[];
}

export const LESSONS: Lesson[] = [
  {
    slug: "fed-ecb-levers",
    title: "The Floor Under Every Overnight Rate",
    subtitle:
      "Why a money market fund with nowhere else to go sets the floor for what banks can pay.",
    moduleLabel: "Module 3 · The Fed & ECB Levers",
    tier: "central_bank",
    estimatedMinutes: 6,
    exercises: [
      {
        kind: "multiple_choice",
        id: "why-rrp-floors",
        prompt: "Why does the ON RRP facility put a floor under overnight rates?",
        instructions: "Pick the best answer",
        options: [
          {
            id: "caps",
            label: "It caps how much banks are allowed to charge each other",
            feedback:
              "Nothing here is a cap. The facility is an option the lender can take, not a limit imposed on the borrower.",
          },
          {
            id: "risk-free",
            label: "It gives non-banks a risk-free rate they can always take instead",
          },
          {
            id: "creates-reserves",
            label: "It creates new reserves for money market funds",
            feedback:
              "The opposite: cash moving into the facility drains reserves out of the banking system. And money funds cannot hold reserves at all.",
          },
        ],
        correctOptionId: "risk-free",
        explanation:
          "A money market fund cannot hold reserves, so without ON RRP it must lend to banks at whatever they offer. The facility gives it a risk-free alternative at a published rate — so it will not lend below that rate to anyone.",
        xp: 15,
      },
      {
        kind: "t_account",
        id: "qe-primary-dealer",
        // The same scenario the home page plays, reused rather than restated.
        scenario: QE_SCENARIO,
      },
    ],
    takeaways: [
      "A central bank facility sets a floor by being an alternative, not by imposing a limit.",
      "Reserves are a central bank liability — only banks can hold them.",
      "QE swaps one asset for another on the dealer's sheet, and expands both sides of the Fed's.",
    ],
  },
];

export function findLesson(slug: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.slug === slug);
}

/** Total XP available in a lesson, for the card on /learn. */
export function lessonXp(lesson: Lesson): number {
  return lesson.exercises.reduce((total, exercise) => total + exerciseXp(exercise), 0);
}
