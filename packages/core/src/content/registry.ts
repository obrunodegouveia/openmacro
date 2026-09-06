/**
 * ============================================================================
 * Content registry
 * ============================================================================
 *
 * The single place the app learns what content exists. Everything is imported
 * statically so the bundler can tree-shake and so the app works fully offline
 * with no network and no backend.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ CONTRIBUTORS — HOW TO ADD A MODULE                                       │
 * │                                                                          │
 * │ 1. Create `src/content/lessons/module-XX-your-topic/index.ts`            │
 * │ 2. Export a `defineModule({ ... })` from it                              │
 * │ 3. Import it below and add it to `MODULES`                               │
 * │ 4. Run `npm run lint:content` to validate your JSON before opening a PR  │
 * │                                                                          │
 * │ See `src/content/lessons/README.md` for the full authoring guide.        │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

import type { Course, Lesson, Module } from './schema';
import { moduleFoundationsFiduciaryCurrency } from './lessons/module-01-foundations-fiduciary-currency';
import { moduleCommercialCentralInterface } from './lessons/module-02-commercial-central-interface';
import { moduleFedEcbLevers } from './lessons/module-03-fed-ecb-levers';
import { moduleCrisisArchitecture } from './lessons/module-04-crisis-architecture-global-dollar';
import { moduleReadingTheFedBalanceSheet } from './lessons/module-05-reading-the-fed-balance-sheet';
import { moduleReadingTheEcbBalanceSheet } from './lessons/module-06-reading-the-ecb-balance-sheet';
import { moduleTheTreasuryYieldCurve } from './lessons/module-07-the-treasury-yield-curve';
import { moduleDebtDebasementAndCapital } from './lessons/module-08-debt-debasement-and-capital';
import { moduleBreakingAPeg } from './lessons/module-09-breaking-a-peg-1992';
import { moduleTheBisAndTheEcb } from './lessons/module-10-the-bis-and-the-ecb';
import { moduleAfricanCentralBanks } from './lessons/module-11-african-central-banks';
import { moduleRealAssetsAndProperty } from './lessons/module-12-real-assets-and-property';
import { moduleEuribor } from './lessons/module-13-euribor';

/** Ordered list of every module shipped with the app. Add yours here. */
export const MODULES: readonly Module[] = [
  moduleFoundationsFiduciaryCurrency,
  moduleCommercialCentralInterface,
  moduleFedEcbLevers,
  moduleCrisisArchitecture,
  moduleReadingTheFedBalanceSheet,
  moduleReadingTheEcbBalanceSheet,
  moduleTheTreasuryYieldCurve,
  moduleDebtDebasementAndCapital,
  moduleBreakingAPeg,
  moduleTheBisAndTheEcb,
  moduleAfricanCentralBanks,
  moduleRealAssetsAndProperty,
  moduleEuribor,
];

export const COURSE: Course = {
  id: 'macro-foundations',
  title: 'Macro Foundations',
  description:
    'Money, banking and monetary policy — built from first principles, five minutes at a time.',
  modules: [...MODULES],
};

/** Flat view of every lesson across every module, in path order. */
export const ALL_LESSONS: readonly Lesson[] = MODULES.flatMap((module) => module.lessons);

export function getLessonById(lessonId: string): Lesson | undefined {
  return ALL_LESSONS.find((lesson) => lesson.id === lessonId);
}

export function getModuleForLesson(lessonId: string): Module | undefined {
  return MODULES.find((module) => module.lessons.some((lesson) => lesson.id === lessonId));
}

/** The next lesson on the path after `lessonId`, or `undefined` if it is last. */
export function getNextLesson(lessonId: string): Lesson | undefined {
  const index = ALL_LESSONS.findIndex((lesson) => lesson.id === lessonId);
  if (index < 0) return undefined;
  return ALL_LESSONS[index + 1];
}
