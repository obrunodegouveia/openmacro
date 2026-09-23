/**
 * The forecast round: the central institutional ritual of a modern central
 * bank, and something the course previously assumed rather than taught.
 *
 * The simulation makes the argument the module exists for — that the central
 * projection is the least decision-relevant part of a forecast, and the
 * distribution around it is where the policy problem lives.
 */

import { defineModule } from '../../schema';
import { whatAForecastIsForLesson } from './lesson-01-what-a-forecast-is-for';
import { theModelAndTheJudgementLesson } from './lesson-02-the-model-and-the-judgement';
import { theFanChartLesson } from './lesson-03-the-fan-chart';
import { whenYouAreWrongLesson } from './lesson-04-when-you-are-wrong';

export const moduleTheForecastRound = defineModule({
  id: 'the-forecast-round',
  title: 'The Forecast Round',
  description:
    'Conditioning assumptions, models and judgement, fan charts and risk management, and what to do after a very large miss.',
  accent: 'gold',
  level: 'advanced',
  lessons: [
    whatAForecastIsForLesson,
    theModelAndTheJudgementLesson,
    theFanChartLesson,
    whenYouAreWrongLesson,
  ],
});
