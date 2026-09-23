/**
 * Module 21 — What You Lend Against
 *
 * The promise: understand the instrument that decides which assets are
 * money-like, and why almost nobody outside a central bank has heard of it.
 *
 * The collateral framework is a published list and a haircut schedule. It
 * reads like risk management and it functions as credit allocation: an
 * eligible asset carries a free option to convert into central bank money,
 * which makes it worth holding for reasons unrelated to its yield. Banks tilt
 * towards the list, issuance follows, and a committee thinking about risk to
 * its own balance sheet has decided whose paper is nearly cash.
 *
 * It is also the crisis lever. In March 2023 the Fed defused the failure
 * mechanism of the previous module by changing one valuation rule — lending
 * against securities at par rather than at market — with no rate decision
 * involved. And in the euro area the same framework has repeatedly decided
 * whether a member state's banks could fund themselves, by way of a rating
 * threshold described each time as technical.
 *
 * Four lessons: eligibility as an instrument; the haircut, driven from the
 * direction a treasurer works in; Bagehot's rule with every phrase opened up;
 * and the loop that forms when the collateral is the borrower's own
 * government.
 */

import { defineModule } from '../../schema';
import { theListIsAPolicyLesson } from './lesson-01-the-list-is-a-policy';
import { theHaircutLesson } from './lesson-02-the-haircut';
import { goodCollateralAtFourInTheMorningLesson } from './lesson-03-good-collateral-at-four-in-the-morning';
import { theDoomLoopLesson } from './lesson-04-the-doom-loop';

export const moduleWhatYouLendAgainst = defineModule({
  id: 'what-you-lend-against',
  title: 'What You Lend Against',
  description:
    'A published list and a haircut schedule, which together decide which assets are nearly cash — and therefore what every bank wants to hold. The quietest instrument a central bank has, and the one it reaches for when a weekend has to be survived.',
  accent: 'azure',
  level: 'advanced',
  lessons: [
    theListIsAPolicyLesson,
    theHaircutLesson,
    goodCollateralAtFourInTheMorningLesson,
    theDoomLoopLesson,
  ],
});
