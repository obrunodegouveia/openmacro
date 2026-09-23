/**
 * Module 20 — Before It Breaks
 *
 * The promise: know what a supervisor is looking at, and why the numbers
 * everyone quotes are the wrong ones.
 *
 * "Setting the Rate" ended on the claim that a central bank cannot create
 * growth and can destroy it. This is the other half of that sentence — the
 * machinery for not destroying it. Crises are where decades of output go,
 * and the technical work of preventing them is unglamorous, specific, and
 * almost entirely absent from public argument about central banks.
 *
 * The order is the order of the confusions. Capital first, because believing
 * it is a pot of money makes every later conversation wrong. Then liquidity,
 * because solvency and the ability to pay on Friday are different things and
 * 2023 showed how fast the second now moves. Then the stress test, driven by
 * hand, with the result that matters: two banks with identical capital
 * ratios can differ threefold in how much loss they survive, and the
 * difference is risk-weight density. Then the buffer, whose difficulty is
 * not the instrument but having to tighten into a boom. And finally
 * resolution — who takes the loss, decided in advance by rule, or at four in
 * the morning by whoever is in the room.
 *
 * Figures: Basel III sets a 4.5% CET1 minimum against risk-weighted assets,
 * with a 2.5% conservation buffer and a countercyclical buffer of up to 2.5%
 * on top, and a 3% non-risk-weighted leverage ratio. Silicon Valley Bank
 * faced roughly $42bn of withdrawal requests on 9 March 2023 with around 94%
 * of deposits above the $250,000 insured limit; EU deposit insurance covers
 * €100,000. Credit Suisse's AT1 instruments were written to zero in March
 * 2023 while shareholders received value.
 */

import { defineModule } from '../../schema';
import { capitalIsNotCashLesson } from './lesson-01-capital-is-not-cash';
import { theRunIsALiquidityEventLesson } from './lesson-02-the-run-is-a-liquidity-event';
import { theStressTestLesson } from './lesson-03-the-stress-test';
import { theBufferYouBuildInGoodTimesLesson } from './lesson-04-the-buffer-you-build-in-good-times';
import { whoFailsAndHowLesson } from './lesson-05-who-fails-and-how';

export const moduleBeforeItBreaks = defineModule({
  id: 'before-it-breaks',
  title: 'Before It Breaks',
  description:
    'Crises are where decades of output go. Capital that is not a pot of money, liquidity that kills solvent banks in a day, a stress test that only scores the scenario it was given, and the question of who takes the loss — decided in advance, or at four in the morning.',
  accent: 'coral',
  level: 'advanced',
  lessons: [
    capitalIsNotCashLesson,
    theRunIsALiquidityEventLesson,
    theStressTestLesson,
    theBufferYouBuildInGoodTimesLesson,
    whoFailsAndHowLesson,
  ],
});
