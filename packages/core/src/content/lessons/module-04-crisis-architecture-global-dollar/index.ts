/**
 * Module 4 — Crisis Architecture & The Global Dollar
 *
 * The promise: follow the offshore dollar system, and read a rescue as it
 * happens rather than after.
 *
 * This module is the payoff for the first three. It assumes the learner can
 * already post a balance sheet, knows the difference between base and broad
 * money, and understands what a central bank can and cannot create — and it
 * ends with a capstone that asks them to diagnose an unlabelled crisis.
 */

import { defineModule } from '../../schema';
import { eurodollarSystemLesson } from './lesson-01-eurodollar-system';
import { swapLinesLesson } from './lesson-02-swap-lines';
import { dashForCashLesson } from './lesson-03-dash-for-cash';
import { bailInBailOutLesson } from './lesson-04-bail-in-bail-out';
import { doomLoopLesson } from './lesson-05-doom-loop';
import { globalDollarCycleLesson } from './lesson-06-global-dollar-cycle';
import { readingACrisisLesson } from './lesson-07-reading-a-crisis';

export const moduleCrisisArchitecture = defineModule({
  id: 'crisis-architecture-global-dollar',
  title: 'Crisis Architecture & The Global Dollar',
  description:
    'Offshore dollars, swap lines, resolution and the doom loop — and how to tell one kind of crisis from another.',
  accent: 'violet',
  lessons: [
    eurodollarSystemLesson,
    swapLinesLesson,
    dashForCashLesson,
    bailInBailOutLesson,
    doomLoopLesson,
    globalDollarCycleLesson,
    readingACrisisLesson,
  ],
});
