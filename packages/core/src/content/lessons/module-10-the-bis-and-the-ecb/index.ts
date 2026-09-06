/**
 * Module 10 — The BIS and the ECB
 *
 * The promise: know exactly which channels of influence between Basel and
 * Frankfurt are real, which are imagined, and how to tell.
 *
 * The honest answer is more interesting than either the conspiracy or the
 * dismissal. The BIS has no authority over the ECB — Article 130 TFEU forbids
 * the ECB from taking instructions from any body, the Global Economy Meeting
 * is chaired by the ECB's own President, and the BIS is owned and funded by
 * the central banks it supposedly directs. And yet influence is real: Basel
 * standards become EU law and bind the banks the ECB supervises, BIS research
 * sets terms the Governing Council has to answer, and the BIS assembles the
 * statistics that decide what the debate can be about.
 *
 * So the module teaches the distinction rather than a verdict, and ends on a
 * method: test a claim about institutional power by looking for the case where
 * the alleged authority was not obeyed. The EU postponing the Basel market
 * risk framework twice and then rewriting it is that case, and it is recent.
 *
 * Verified figures: BIS Annual Report 2025/26 — balance sheet SDR 482bn at 31
 * March 2026, SDR 428bn of it currency deposits, 16% of assets in gold
 * including 102 tonnes in its own portfolio, owned by 63 central banks
 * covering about 95% of world GDP. The Global Economy Meeting: 30 governors
 * plus 22 observer central banks, chaired by Christine Lagarde; the All
 * Governors' Meeting: 63, chaired by Fabio Panetta. CRR3 and CRD6 applied from
 * 1 January 2025; the market risk framework postponed by delegated act to 1
 * January 2027 and amended in June 2026 with relief running to January 2030.
 */

import { defineModule } from '../../schema';
import { aBankForCentralBanksLesson } from './lesson-01-a-bank-for-central-banks';
import { baselToBrusselsLesson } from './lesson-02-basel-to-brussels';
import { theRoomInBaselLesson } from './lesson-03-the-room-in-basel';
import { testingTheClaimLesson } from './lesson-04-testing-the-claim';

export const moduleTheBisAndTheEcb = defineModule({
  id: 'the-bis-and-the-ecb',
  title: 'The BIS and the ECB',
  description:
    'Which channels of influence between Basel and Frankfurt are real: standards that must pass a legislature, research that sets the terms, statistics nobody else collects — and which are the other way round.',
  accent: 'emerald',
  lessons: [
    aBankForCentralBanksLesson,
    baselToBrusselsLesson,
    theRoomInBaselLesson,
    testingTheClaimLesson,
  ],
});
