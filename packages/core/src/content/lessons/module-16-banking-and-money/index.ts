/**
 * Module 16 — Banking and Money (Khan Academy)
 *
 * Twenty-five videos, each its own lesson: watch, then answer for it.
 *
 * The source is Sal Khan's "Banking and Money" playlist, recorded around
 * 2008–09 while the financial crisis was happening rather than after it. It is
 * the best free explanation of fractional reserve banking that exists, and it
 * builds the entire system from one island, one vault and a thousand gold
 * coins — arriving at the Federal Reserve's actual balance sheet without ever
 * asking the viewer to take a step on trust.
 *
 * WHAT THIS MODULE IS, EXACTLY
 *
 * The videos teach; the challenges check. Every question here was written
 * against the transcript of the video it sits under, so the numbers are the
 * numbers Sal uses — 1,000 gold pieces becoming 2,710 of deposits, a bank at
 * 10:3 leverage wiped out by a 50% loss, $871 billion of Fed assets on 14
 * February 2007 of which barely $12 billion is gold.
 *
 * Nothing of Khan Academy's is redistributed. The videos play inline in the
 * official YouTube iframe player — a WebView on mobile, an iframe on the web —
 * so they run on YouTube's terms with the creator's attribution intact. The
 * questions are original work under this repository's licence. Neither player
 * loads anything from Google until the learner presses play, which is the same
 * promise every other video in the course makes.
 *
 * WHY IT BELONGS HERE
 *
 * Modules 1 to 4 teach this material in OpenMacro's own voice, and a learner
 * who has done them will find much of this familiar. That is the point: this
 * module is for hearing it a second time, from someone else, drawn rather than
 * simulated. Understanding that survives a change of teacher is understanding.
 *
 * It also ends somewhere the rest of the course does not. The last three
 * videos are Sal's own commentary, and they are unusually honest for
 * educational material: he argues that the demand deposit contains a
 * half-truth, that deposit insurance subsidises the banks taking the most
 * risk, and that what fractional reserve banking finally enables is borrowing
 * at the short end of the yield curve and lending at the long end with the
 * spread underwritten by the taxpayer. He also says plainly that he started
 * neutral and talked himself into discomfort. Learners should meet an argument
 * like that made well, including where it disagrees with the tone of the rest
 * of this course.
 *
 * A NOTE ON AGE
 *
 * These were recorded in 2008–09 and some details have moved on. US reserve
 * requirements were cut to zero in March 2020. The Fed has paid interest on
 * reserves since 2008, which changes the mechanics of hitting a target rate.
 * LIBOR has been retired in favour of transaction-based benchmarks. None of
 * that touches the machinery being taught, and where a fact has dated the
 * challenge says so rather than repeating it.
 */

import { defineModule } from '../../schema';
import { kabWhatABankIsForLesson } from './lesson-01-what-a-bank-is-for';
import { kabIncomeStatementLesson } from './lesson-02-income-statement';
import { kabFractionalReserveLesson } from './lesson-03-fractional-reserve';
import { kabIsItRealWealthLesson } from './lesson-04-is-it-real-wealth';
import { kabBankNotesLesson } from './lesson-05-bank-notes';
import { kabNotesAndChequesLesson } from './lesson-06-notes-and-cheques';
import { kabLendingWithoutGoldLesson } from './lesson-07-lending-without-gold';
import { kabReserveRatiosLesson } from './lesson-08-reserve-ratios';
import { kabMoreOnReserveRatiosLesson } from './lesson-09-more-on-reserve-ratios';
import { kabLeverageLesson } from './lesson-10-leverage';
import { kabAReserveBankLesson } from './lesson-11-a-reserve-bank';
import { kabTreasuriesLesson } from './lesson-12-treasuries';
import { kabOpenMarketOperationsLesson } from './lesson-13-open-market-operations';
import { kabFedFundsRateLesson } from './lesson-14-fed-funds-rate';
import { kabRateToLendingLesson } from './lesson-15-rate-to-lending';
import { kabRatesNotQuantitiesLesson } from './lesson-16-rates-not-quantities';
import { kabWhatHappenedToTheGoldLesson } from './lesson-17-what-happened-to-the-gold';
import { kabBigPictureLesson } from './lesson-18-the-big-picture';
import { kabDiscountRateLesson } from './lesson-19-discount-rate';
import { kabReposLesson } from './lesson-20-repos';
import { kabFedBalanceSheetLesson } from './lesson-21-fed-balance-sheet';
import { kabFrbCommentaryLesson } from './lesson-22-frb-commentary';
import { kabDepositInsuranceLesson } from './lesson-23-deposit-insurance';
import { kabYieldCurveArbitrageLesson } from './lesson-24-yield-curve-arbitrage';
import { kabLiborLesson } from './lesson-25-libor';

export const moduleBankingAndMoney = defineModule({
  id: 'banking-and-money',
  title: 'Banking and Money (Khan Academy)',
  description:
    'Sal Khan builds the banking system from one island, one vault and a thousand gold coins — through fractional reserve, leverage, the central bank and open market operations, to the Fed’s real balance sheet. Twenty-five videos, each with questions written against what it actually says, ending with his own argument against the system he just explained.',
  accent: 'gold',
  lessons: [
    kabWhatABankIsForLesson,
    kabIncomeStatementLesson,
    kabFractionalReserveLesson,
    kabIsItRealWealthLesson,
    kabBankNotesLesson,
    kabNotesAndChequesLesson,
    kabLendingWithoutGoldLesson,
    kabReserveRatiosLesson,
    kabMoreOnReserveRatiosLesson,
    kabLeverageLesson,
    kabAReserveBankLesson,
    kabTreasuriesLesson,
    kabOpenMarketOperationsLesson,
    kabFedFundsRateLesson,
    kabRateToLendingLesson,
    kabRatesNotQuantitiesLesson,
    kabWhatHappenedToTheGoldLesson,
    kabBigPictureLesson,
    kabDiscountRateLesson,
    kabReposLesson,
    kabFedBalanceSheetLesson,
    kabFrbCommentaryLesson,
    kabDepositInsuranceLesson,
    kabYieldCurveArbitrageLesson,
    kabLiborLesson,
  ],
});
