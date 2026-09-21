/**
 * Module 18 — What the Economy Cannot Do Without
 *
 * The promise: stop reading a sector's share of GDP as a measure of how much
 * it matters, and be able to say instead what would actually stop.
 *
 * The module follows the previous one, which established that GDP is a flow
 * that counts spending. This one attacks the next assumption in the chain —
 * that the size of the spending tells you the size of the dependence. It
 * does not, in either direction. Agriculture fell to a couple of per cent by
 * winning; health rises as a share partly because it cannot automate; and a
 * semiconductor industry worth under one per cent of world output idled
 * several million cars.
 *
 * So criticality is made measurable: substitutability, position in the chain,
 * and replacement time, with a simulation that separates what a cost share
 * predicts from what fixed proportions actually cost. Then the horizon, which
 * is the term almost every energy argument leaves out — nothing substitutes
 * in a month and most things substitute in a decade. Then the unit changes
 * from the world to one country, where a fourth score appears that the
 * capital-stock view misses entirely: whether the output can be sold abroad.
 *
 * That last lesson is the honest correction to the module before it. Hotel
 * nights and luxury goods build no capacity and they earn the foreign
 * currency that pays for the things that do.
 *
 * Figures: crude roughly $3 to $12 across 1973-74 and about $14 to $35 across
 * 1979-80; OECD energy use per unit of output roughly halved since 1973;
 * Russian pipeline gas over 40% of EU gas imports before 2022 and under a
 * tenth by the end of it, against a 15% EU demand-reduction target; the Ever
 * Given blocked Suez for six days in March 2021 on a route carrying something
 * over a tenth of world trade. Baumol and Bowen published the cost disease in
 * 1966.
 */

import { defineModule } from '../../schema';
import { shareIsNotImportanceLesson } from './lesson-01-share-is-not-importance';
import { whatStopsWhenItStopsLesson } from './lesson-02-what-stops-when-it-stops';
import { substitutionIsAFunctionOfTimeLesson } from './lesson-03-substitution-is-a-function-of-time';
import { whatACountryMustSellLesson } from './lesson-04-what-a-country-must-sell';

export const moduleWhatCannotStop = defineModule({
  id: 'what-cannot-stop',
  title: 'What the Economy Cannot Do Without',
  description:
    'Agriculture is 2% of output and nobody eats without it. Semiconductors are under 1% and they idled the car industry. How to tell what a sector is worth from what would stop without it — and why that is a different ranking from its size.',
  accent: 'coral',
  level: 'beginner',
  lessons: [
    shareIsNotImportanceLesson,
    whatStopsWhenItStopsLesson,
    substitutionIsAFunctionOfTimeLesson,
    whatACountryMustSellLesson,
  ],
});
