/**
 * Module 7 — The Treasury Yield Curve
 *
 * The promise: look at eleven numbers and say what the market thinks.
 *
 * Built on the par yield curve published for 3 September 2026 and on the
 * inversion that ran from 2022 to 2025, with the spread history taken from the
 * daily constant-maturity series. It sits after the two balance sheet modules
 * because a curve is only legible once you know who sets the front end and why
 * they cannot set the back end.
 */

import { defineModule } from '../../schema';
import { whatTheCurveIsLesson } from './lesson-01-what-the-curve-is';
import { priceAndYieldLesson } from './lesson-02-price-and-yield';
import { theLongInversionLesson } from './lesson-03-the-long-inversion';

export const moduleTheTreasuryYieldCurve = defineModule({
  id: 'the-treasury-yield-curve',
  title: 'The Treasury Yield Curve',
  description:
    'One borrower, eleven maturities, eleven rates. Why price and yield are one number, what an inversion actually says, and how to read the curve as published on 3 September 2026.',
  accent: 'gold',
  lessons: [whatTheCurveIsLesson, priceAndYieldLesson, theLongInversionLesson],
});
