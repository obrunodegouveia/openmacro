/**
 * Module 22 — The Data You Actually Have
 *
 * The promise: know what your own numbers are worth before you decide on
 * them.
 *
 * "Setting the Rate" gave a framework for the decision. This module attacks
 * its inputs, which is where most of the historical damage has come from.
 * Orphanides' real-time work reframed the Great Inflation as a failure of
 * measurement rather than of nerve: the output gap believed in the 1970s was
 * several points more negative than later revisions made it, and policy that
 * followed a defensible rule on the data of the day was far too loose. The
 * opening simulation reproduces that, using the same Taylor rule from module
 * 19 run on two vintages of the same number.
 *
 * Then nowcasting, because the decision never waits for the release; what a
 * published projection actually is, since it is conditional and almost
 * everyone reads it as a promise; and expectations, which do most of the work
 * of monetary policy and cannot be observed at all.
 *
 * Figures: the Bank of England began publishing fan charts in its February
 * 1996 Inflation Report; breakeven inflation rates contain an inflation risk
 * premium and a liquidity discount, which is why they collapsed in March 2020
 * with almost no change in expected inflation.
 */

import { defineModule } from '../../schema';
import { everythingIsRevisedLesson } from './lesson-01-everything-is-revised';
import { beforeTheDataArrivesLesson } from './lesson-02-before-the-data-arrives';
import { aForecastIsADistributionLesson } from './lesson-03-a-forecast-is-a-distribution';
import { expectationsAreDataLesson } from './lesson-04-expectations-are-data';

export const moduleTheDataYouHave = defineModule({
  id: 'the-data-you-have',
  title: 'The Data You Actually Have',
  description:
    'The output gap is revised by whole points, the quarter you are deciding on has not been published, your forecast is conditional on an assumption nobody reads, and the variable that matters most cannot be observed. What to do anyway.',
  accent: 'emerald',
  level: 'advanced',
  lessons: [
    everythingIsRevisedLesson,
    beforeTheDataArrivesLesson,
    aForecastIsADistributionLesson,
    expectationsAreDataLesson,
  ],
});
