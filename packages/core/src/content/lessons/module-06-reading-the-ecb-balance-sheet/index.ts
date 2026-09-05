/**
 * Module 6 — Reading the ECB's Balance Sheet
 *
 * The promise: read the Eurosystem's weekly statement, and know why it does
 * not look like the Fed's.
 *
 * Figures are the consolidated financial statement of the Eurosystem as at 28
 * August 2026, published 1 September 2026, in millions of euro, with trend
 * figures from the same weekly series (ECB Data Portal, ILM) and policy rates
 * as at 6 September 2026.
 *
 * It follows the Fed module deliberately. Almost every lesson here is a
 * contrast — gold marked to market against gold at a 1973 statutory price, two
 * reserve accounts against one, a lending framework barely used against a
 * lending facility kept for emergencies. A learner who has only ever read one
 * central bank's balance sheet does not know which parts of it were choices.
 */

import { defineModule } from '../../schema';
import { aDifferentShapeLesson } from './lesson-01-a-different-shape';
import { goldAndRevaluationLesson } from './lesson-02-gold-and-revaluation';
import { twoPlacesToParkAEuroLesson } from './lesson-03-two-places-to-park-a-euro';
import { twoSheetsDivergingLesson } from './lesson-04-two-sheets-diverging';

export const moduleReadingTheEcbBalanceSheet = defineModule({
  id: 'reading-the-ecb-balance-sheet',
  title: "Reading the ECB's Balance Sheet",
  description:
    "The Eurosystem's weekly statement against the Fed's: a fifth of it gold, two reserve accounts instead of one, and a lending framework it no longer needs. Figures as at 28 August 2026.",
  accent: 'azure',
  lessons: [
    aDifferentShapeLesson,
    goldAndRevaluationLesson,
    twoPlacesToParkAEuroLesson,
    twoSheetsDivergingLesson,
  ],
});
