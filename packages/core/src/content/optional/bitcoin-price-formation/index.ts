/**
 * Why Bitcoin's price moves, studied the way a market maker or an on-chain
 * analyst would rather than from a chart.
 *
 * Private: this module is not in `MODULES` and appears only to accounts that
 * have been granted it. Keep it that way — it is a personal study module, and
 * the public course, its sitemap, its exam and its rewards must not see it.
 *
 * The question running through all six lessons is what makes the marginal
 * buyer and seller change the price at which they will trade. Three lessons
 * cover the mechanism (order book, derivatives) and the holders (on-chain);
 * one covers the capital arriving from outside; the last puts them together
 * into a diagnosis and a research habit.
 *
 * Everything here is educational. Numbers are hypothetical, indicators are
 * described as indicative rather than causal, and nothing is a trading signal
 * or investment advice.
 */

import { defineModule } from '../../schema';
import { btcTheSixForcesLesson } from './lesson-01-the-six-forces';
import { btcTheOrderBookLesson } from './lesson-02-the-order-book';
import { btcCvdFromScratchLesson } from './lesson-07-cvd-from-scratch';
import { btcLeverageAndLiquidationsLesson } from './lesson-03-leverage-and-liquidations';
import { btcWhoHoldsWhatLesson } from './lesson-04-who-holds-what';
import { btcTheMoneyComingInLesson } from './lesson-05-the-money-coming-in';
import { btcDiagnoseACrashLesson } from './lesson-06-diagnose-a-crash';

export const moduleBitcoinPriceFormation = defineModule({
  id: 'bitcoin-price-formation',
  title: 'Why Bitcoin Moves',
  description:
    'Order books, leverage, on-chain holders and macro capital — the six forces behind Bitcoin’s price, and how to diagnose a crash without fooling yourself.',
  accent: 'gold',
  /**
   * Khan Academy's own introduction to what Bitcoin is, for anyone arriving
   * without it. Optional depth at the module, so it adds nothing to any
   * lesson's time on the path; the lessons themselves are about price
   * formation, which the video does not cover.
   */
  video: {
    url: 'https://www.youtube.com/watch?v=EA0LkCkvUeU',
    minutes: 9,
    source: 'Khan Academy — Bitcoin: What is it? (CC BY-NC-SA)',
  },
  level: 'advanced',
  lessons: [
    btcTheSixForcesLesson,
    btcTheOrderBookLesson,
    btcCvdFromScratchLesson,
    btcLeverageAndLiquidationsLesson,
    btcWhoHoldsWhatLesson,
    btcTheMoneyComingInLesson,
    btcDiagnoseACrashLesson,
  ],
});
