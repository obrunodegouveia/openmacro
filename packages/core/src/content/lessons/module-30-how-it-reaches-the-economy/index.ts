/**
 * Transmission: how a decision about an overnight rate reaches a factory, a
 * mortgage and a wage settlement. The course has used every one of these
 * channels and never set them out together.
 *
 * The simulation is the sharpest single fact in the module — the same rate
 * rise takes nine times as much household income in Portugal as in the
 * United States, because of a mortgage contract convention.
 */

import { defineModule } from '../../schema';
import { theChannelsLesson } from './lesson-01-the-channels';
import { longAndVariableLesson } from './lesson-02-long-and-variable';
import { sameDecisionDifferentCountriesLesson } from './lesson-03-the-same-decision-different-countries';
import { whenTransmissionBreaksLesson } from './lesson-04-when-transmission-breaks';

export const moduleHowItReachesTheEconomy = defineModule({
  id: 'how-it-reaches-the-economy',
  title: 'How It Reaches the Economy',
  description:
    'The six transmission channels, why the lags are long and variable, why the same decision differs by country, and what to do when transmission breaks.',
  accent: 'violet',
  level: 'advanced',
  lessons: [
    theChannelsLesson,
    longAndVariableLesson,
    sameDecisionDifferentCountriesLesson,
    whenTransmissionBreaksLesson,
  ],
});
