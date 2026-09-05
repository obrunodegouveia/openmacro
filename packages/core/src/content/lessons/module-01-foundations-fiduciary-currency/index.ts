/**
 * Module 1 — Foundations of Fiduciary Currency
 *
 * The promise: explain why a piece of unbacked paper is accepted at all,
 * without hand-waving about trust. Everything later in the course assumes the
 * learner has stopped believing money is a substance.
 *
 * CONTRIBUTORS: add a lesson file beside this one and list it below. The order
 * of `lessons` is the order learners meet them, so it should build.
 */

import { defineModule } from '../../schema';
import { whatMoneyDoesLesson } from './lesson-01-what-money-does';
import { whyPaperIsAcceptedLesson } from './lesson-02-why-paper-is-accepted';
import { purchasingPowerLesson } from './lesson-03-purchasing-power';
import { pegsAndConvertibilityLesson } from './lesson-04-pegs-and-convertibility';
import { baseAndBroadMoneyLesson } from './lesson-05-base-and-broad-money';
import { whenCurrenciesFailLesson } from './lesson-06-when-currencies-fail';

export const moduleFoundationsFiduciaryCurrency = defineModule({
  id: 'foundations-fiduciary-currency',
  title: 'Foundations of Fiduciary Currency',
  description:
    'Why unbacked paper is accepted, what inflation actually is, and what breaks when a currency fails.',
  accent: 'gold',
  lessons: [
    whatMoneyDoesLesson,
    whyPaperIsAcceptedLesson,
    purchasingPowerLesson,
    pegsAndConvertibilityLesson,
    baseAndBroadMoneyLesson,
    whenCurrenciesFailLesson,
  ],
});
