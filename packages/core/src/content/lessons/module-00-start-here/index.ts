/**
 * Module 0 — Start Here
 *
 * The on-ramp. Written because the course had three genuinely beginner lessons
 * — about eighteen minutes — before it reached "Pegs, and Why They Break", and
 * a homepage promising to explain how money works to people who do not already
 * know.
 *
 * Six lessons, all `intro`, five hearts each so a first mistake is not
 * punishing, and no jargon that is not defined on the spot. Each one takes a
 * question an ordinary person actually asks and answers it mechanically rather
 * than by analogy: what is the number in a banking app, what is a bank, what
 * is an interest rate, who is in charge, what does inflation do to me, and
 * what does a rate decision mean for my mortgage.
 *
 * It deliberately does not repeat the existing intro lessons in module 1 —
 * the three jobs of money, why unbacked paper is accepted, inflation as the
 * price of money. It fills what sat underneath them and was assumed: deposits
 * as promises, the two-list structure of any balance sheet, the parts of an
 * interest rate, the limits of what a central bank controls, and the personal
 * distribution of inflation.
 *
 * One T-account, in lesson two, kept to two entities and four postings: you
 * deposit cash at a bank. It is the first time a learner meets the mechanic
 * the whole course is built on, and it is chosen because nobody gets richer,
 * which makes the balancing visible.
 *
 * The last lesson is a bridge. It reads a single news sentence — "the ECB
 * raised rates" — using everything the track has established, and its final
 * challenge points at the modules that go deeper.
 */

import { defineModule } from '../../schema';
import { yourMoneyIsAPromiseLesson } from './lesson-01-your-money-is-a-promise';
import { whatABankIsLesson } from './lesson-02-what-a-bank-is';
import { thePriceOfTimeLesson } from './lesson-03-the-price-of-time';
import { whoIsInChargeLesson } from './lesson-04-who-is-in-charge';
import { whatRisingPricesDoLesson } from './lesson-05-what-rising-prices-do';
import { readingOneHeadlineLesson } from './lesson-06-reading-one-headline';

export const moduleStartHere = defineModule({
  id: 'start-here',
  title: 'Start Here',
  description:
    'No background needed. What the number in your banking app actually is, what a bank does with it, what an interest rate is for, and why a decision in Frankfurt reaches your mortgage.',
  accent: 'mint',
  lessons: [
    yourMoneyIsAPromiseLesson,
    whatABankIsLesson,
    thePriceOfTimeLesson,
    whoIsInChargeLesson,
    whatRisingPricesDoLesson,
    readingOneHeadlineLesson,
  ],
});
