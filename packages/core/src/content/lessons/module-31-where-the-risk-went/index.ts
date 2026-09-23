/**
 * Where the risk actually sits now. Banks are safer than in 2008 and a great
 * deal of intermediation left them; the last three stress events — March
 * 2020, the 2021 family office failure, the 2022 gilt crisis — all began
 * outside the banking system.
 *
 * The simulation reconstructs the arithmetic of September 2022: a margin
 * spiral with no insolvency anywhere in it.
 */

import { defineModule } from '../../schema';
import { moneyThatIsntABankLesson } from './lesson-01-money-that-isnt-a-bank';
import { theMarginCallLesson } from './lesson-02-the-margin-call';
import { theNodeInTheMiddleLesson } from './lesson-03-the-node-in-the-middle';
import { lendingToWhomLesson } from './lesson-04-lending-to-whom';

export const moduleWhereTheRiskWent = defineModule({
  id: 'where-the-risk-went',
  title: 'Where the Risk Went',
  description:
    'Non-bank intermediation, margin spirals, central counterparties, and lending to institutions that are not banks.',
  accent: 'coral',
  level: 'advanced',
  lessons: [
    moneyThatIsntABankLesson,
    theMarginCallLesson,
    theNodeInTheMiddleLesson,
    lendingToWhomLesson,
  ],
});
