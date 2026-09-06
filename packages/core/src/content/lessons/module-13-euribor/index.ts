/**
 * Module 13 — Euribor
 *
 * The promise: read the euro money market from four numbers, and know what
 * your own mortgage is actually indexed to.
 *
 * Written to be difficult. Every challenge here can be got wrong by somebody
 * who can define Euribor correctly, which is the point — the definition is the
 * easy part and it is where most explanations stop. The module takes away
 * three assumptions first (it is not an ECB rate, it is not risk-free, it is
 * not always a transaction), then shows the benchmark leading the central bank
 * rather than following it, then turns it into a household's monthly payment,
 * and ends on five questions that need the whole thing at once.
 *
 * Figures: Euribor by tenor for August 2026 (ECB Data Portal, FM) — 1M 2.221%,
 * 3M 2.513%, 6M 2.713%, 12M 2.954%. Twelve-month Euribor bottomed at −0.505%
 * in January 2021 and peaked at 4.160% in October 2023, a move of 4.66 points
 * in 33 months; three-month bottomed at −0.582% and peaked at 3.972% a month
 * later. €STR fixed at 2.189% on 3 September 2026, against a deposit facility
 * rate of 2.25% and a main refinancing rate of 2.40%.
 */

import { defineModule } from '../../schema';
import { whatEuriborIsLesson } from './lesson-01-what-euribor-is';
import { euriborIsAForecastLesson } from './lesson-02-euribor-is-a-forecast';
import { theResetLesson } from './lesson-03-the-reset';
import { theGrillingLesson } from './lesson-04-the-grilling';

export const moduleEuribor = defineModule({
  id: 'euribor',
  title: 'Euribor',
  description:
    'The rate most euro area mortgages reset on, and almost nobody can define correctly. What it measures, why it moves before the ECB does, what a reset costs — and five questions that separate knowing from understanding.',
  accent: 'azure',
  lessons: [
    whatEuriborIsLesson,
    euriborIsAForecastLesson,
    theResetLesson,
    theGrillingLesson,
  ],
});
