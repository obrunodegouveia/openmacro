/**
 * What a sovereign debt actually costs, using the American one as the case.
 *
 * The module exists to replace a rhetorical question — "will the debt bankrupt
 * the United States?" — with an arithmetic one. A government borrowing in a
 * currency it issues cannot be forced to default, so the cost arrives as
 * inflation or as spending crowded out, and which of those it is depends
 * almost entirely on `r - g`.
 *
 * That makes productivity the hinge, and it is the one lever that improves the
 * debt path and the inflation path at once. The module takes that claim
 * seriously enough to state it precisely and then to name what would falsify
 * it, because the payoff from a general-purpose technology has historically
 * lagged its arrival by a decade or more while the interest falls due on a
 * fixed schedule.
 *
 * It assumes the `r - g` arithmetic from `the-arithmetic-of-the-debt` in the
 * debt and debasement module and does not repeat it. What is added here is
 * what sits either side of that equation: why the constraint is not default,
 * what actually moves g, and what a rate rise does to the other side of the
 * budget.
 */

import { defineModule } from '../../schema';
import { whatBankruptcyWouldMeanLesson } from './lesson-01-what-bankruptcy-would-mean';
import { theOnlyLeverThatHelpsTwiceLesson } from './lesson-02-the-only-lever-that-helps-twice';
import { theSameRiseTwiceLesson } from './lesson-03-the-same-rise-twice';
import { findingTheBalanceLesson } from './lesson-04-finding-the-balance';

export const moduleWhatTheDebtCosts = defineModule({
  id: 'what-the-debt-costs',
  title: 'What the Debt Actually Costs',
  description:
    'Why a country that issues its own currency cannot be bankrupted, what the debt costs instead, and why productivity is the only lever that helps twice.',
  accent: 'azure',
  level: 'advanced',
  lessons: [
    whatBankruptcyWouldMeanLesson,
    theOnlyLeverThatHelpsTwiceLesson,
    theSameRiseTwiceLesson,
    findingTheBalanceLesson,
  ],
});
