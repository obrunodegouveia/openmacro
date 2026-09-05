/**
 * Module 2 — The Commercial–Central Bank Interface
 *
 * The promise: trace a payment from one bank to another and say exactly what
 * settles, and in what.
 *
 * The arc deliberately ends by overturning something Module 1 taught. The
 * deposit multiplier in lesson 1 is the classic model; by lesson 8 the learner
 * has seen why reserves do not in fact constrain lending. Both are worth
 * knowing, and the second only lands if the first was taken seriously.
 */

import { defineModule } from '../../schema';
import { banksCreateDepositsLesson } from './lesson-01-banks-create-deposits';
import { interbankPaymentLesson } from './lesson-02-interbank-payment';
import { settlementSystemsLesson } from './lesson-03-settlement-systems';
import { correspondentBankingLesson } from './lesson-04-correspondent-banking';
import { whyBanksHoldReservesLesson } from './lesson-05-why-banks-hold-reserves';
import { overnightRatesLesson } from './lesson-06-overnight-rates';
import { runsAndLiquidityLesson } from './lesson-07-runs-and-liquidity';
import { capitalNotReservesLesson } from './lesson-08-capital-not-reserves';

export const moduleCommercialCentralInterface = defineModule({
  id: 'commercial-central-interface',
  title: 'The Commercial–Central Bank Interface',
  description:
    'How a payment actually settles, why banks hold reserves, and what really limits lending.',
  accent: 'emerald',
  lessons: [
    banksCreateDepositsLesson,
    interbankPaymentLesson,
    settlementSystemsLesson,
    correspondentBankingLesson,
    whyBanksHoldReservesLesson,
    overnightRatesLesson,
    runsAndLiquidityLesson,
    capitalNotReservesLesson,
  ],
});
