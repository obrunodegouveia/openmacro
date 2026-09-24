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
import { whereTheProductivityComesFromLesson } from './lesson-03-where-the-productivity-comes-from';
import { demandBeforeSupplyLesson } from './lesson-04-demand-before-supply';
import { theSameRiseTwiceLesson } from './lesson-05-the-same-rise-twice';
import { findingTheBalanceLesson } from './lesson-06-finding-the-balance';

export const moduleWhatTheDebtCosts = defineModule({
  id: 'what-the-debt-costs',
  title: 'What the Debt Actually Costs',
  description:
    'Why a country that issues its own currency cannot be bankrupted, what the debt costs instead, and why productivity is the only lever that helps twice.',
  accent: 'azure',
  /**
   * The full Solow treatment, for anyone who wants the derivation rather
   * than the result.
   *
   * At the module rather than on a lesson, and deliberately. Fifty minutes
   * attached to a thirteen-minute lesson makes that lesson advertise an hour
   * on the path, which is untrue for the great majority who will not watch
   * it — `audit:content` said so, in those terms. Here it is what it
   * actually is: optional depth for the whole module, with nothing loading
   * from YouTube until somebody presses play.
   *
   * `demand-before-supply` carries the short Khan Academy companion and
   * `mc-level-not-growth` examines this lecture's central result — that
   * accumulating capital moves the level of output and never the growth
   * rate.
   */
  video: {
    url: 'https://www.youtube.com/watch?v=VE4whF07w08',
    minutes: 50,
    source: 'MIT 14.02 Lecture 14 — Saving, Capital Accumulation and Output (CC BY-NC-SA)',
  },
  level: 'advanced',
  lessons: [
    whatBankruptcyWouldMeanLesson,
    theOnlyLeverThatHelpsTwiceLesson,
    whereTheProductivityComesFromLesson,
    demandBeforeSupplyLesson,
    theSameRiseTwiceLesson,
    findingTheBalanceLesson,
  ],
});
