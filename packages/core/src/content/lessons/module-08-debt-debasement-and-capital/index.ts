/**
 * Module 8 — Government Debt, Debasement and Capital
 *
 * The promise: understand who pays for a debt that is never repaid, and what
 * the alternative use of the same resources would have been.
 *
 * This module takes on the most contested ground in the course, so it works
 * the way the rest of the course works: mechanisms, real figures, and
 * arithmetic the learner runs themselves. Inflation is presented as what it
 * mechanically is — a transfer from holders of nominal claims to writers of
 * them, needing no vote — and the historical record of what that mechanism has
 * been used to fund is presented as a record. The debt arithmetic is a
 * simulation rather than a claim, because r − g decides the path and reasonable
 * people forecast r and g differently. The capital lesson is deliberately
 * unsentimental about allocation: high investment badly allocated has built
 * very little, more than once.
 *
 * A learner should finish able to make the argument, and able to say what would
 * have to be true for it to be wrong. Content that asserts the conclusion
 * instead of building it belongs in an essay, not here — see the editorial
 * line in the README.
 *
 * Figures: US federal debt $39,065,421m and 122.59% of GDP (Q1 2026); federal
 * interest payments $1,247bn annualised (Q2 2026); FY2025 deficit
 * $1,774,684m; CPI 9.8 in January 1913 against 333.9 in July 2026.
 */

import { defineModule } from '../../schema';
import { theInflationTaxLesson } from './lesson-01-the-inflation-tax';
import { debasementAndWarLesson } from './lesson-02-debasement-and-war';
import { theArithmeticLesson } from './lesson-03-the-arithmetic';
import { capitalAndWhatItBuildsLesson } from './lesson-04-capital-and-what-it-builds';

export const moduleDebtDebasementAndCapital = defineModule({
  id: 'debt-debasement-and-capital',
  title: 'Debt, Debasement and Capital',
  description:
    'Who actually pays for a debt that is never repaid, what debasement has historically been used to fund, and what the same resources build when they go into capital instead.',
  accent: 'violet',
  lessons: [
    theInflationTaxLesson,
    debasementAndWarLesson,
    theArithmeticLesson,
    capitalAndWhatItBuildsLesson,
  ],
});
