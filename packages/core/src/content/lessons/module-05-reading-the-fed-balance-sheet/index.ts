/**
 * Module 5 — Reading the Fed's Balance Sheet
 *
 * The promise: open the release the Fed published this week and understand it
 * without a translator.
 *
 * Every other module teaches a mechanism with round numbers. This one uses the
 * real ones, from the H.4.1 of 3 September 2026 reporting Wednesday 2
 * September 2026, with the historical comparisons taken from the same weekly
 * series (FRED: WALCL for total assets, RRPONTSYD for the reverse repo
 * facility). Dated figures go stale, and that is the point — a learner who can
 * read this week's release can read next year's, and a learner who has only
 * seen "about seven trillion" cannot read either.
 *
 * It sits last because it assumes the rest: you need to be able to post a
 * balance sheet (module 2), know what reserves are for (module 2), and know
 * what the Fed's levers actually are (module 3) before a column of numbers
 * means anything.
 */

import { defineModule } from '../../schema';
import { h41AnatomyLesson } from './lesson-01-h41-anatomy';
import { treasuryAccountDrainLesson } from './lesson-02-treasury-account-drain';
import { reservesAreTheResidualLesson } from './lesson-03-reserves-are-the-residual';
import { theBufferThatDrainedLesson } from './lesson-04-the-buffer-that-drained';
import { isTighteningOverLesson } from './lesson-05-is-tightening-over';

export const moduleReadingTheFedBalanceSheet = defineModule({
  id: 'reading-the-fed-balance-sheet',
  title: "Reading the Fed's Balance Sheet",
  description:
    "The real H.4.1, line by line: what the Fed owns, who holds its liabilities, and why reserves are whatever is left over. Figures as reported for 2 September 2026.",
  accent: 'mint',
  lessons: [
    h41AnatomyLesson,
    treasuryAccountDrainLesson,
    reservesAreTheResidualLesson,
    theBufferThatDrainedLesson,
    isTighteningOverLesson,
  ],
});
