/**
 * The last module of the technical core, and the one about the other
 * institution in the room. A governor spends more time on the boundary with
 * the finance ministry than on any single rate decision, and the boundary is
 * technical before it is anything else: consolidated maturity, the primary
 * market prohibition, and who absorbs the losses.
 *
 * The simulation makes the consolidated public sector visible — the number
 * that would have warned, in 2020, what was going to happen in 2022.
 *
 * The last lesson runs the same balance sheet from the debt office's side: a
 * Treasury that buys back long bonds with bills removes duration from the
 * market as a purchase programme does, and moves the risk onto the budget.
 */

import { defineModule } from '../../schema';
import { whoOwnsTheCurveLesson } from './lesson-01-who-owns-the-curve';
import { theLineYouDontCrossLesson } from './lesson-02-the-line-you-dont-cross';
import { lossesAndCapitalLesson } from './lesson-03-losses-and-capital';
import { yieldControlByAnotherNameLesson } from './lesson-04-yield-control-by-another-name';

export const moduleTheTreasuryOnThePhone = defineModule({
  id: 'the-treasury-on-the-phone',
  title: 'The Treasury on the Phone',
  description:
    'Consolidated balance sheets, the monetary financing line and central bank losses — the boundary with the finance ministry, technically.',
  accent: 'violet',
  level: 'advanced',
  lessons: [
    whoOwnsTheCurveLesson,
    theLineYouDontCrossLesson,
    lossesAndCapitalLesson,
    yieldControlByAnotherNameLesson,
  ],
});
