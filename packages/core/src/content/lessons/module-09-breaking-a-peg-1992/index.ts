/**
 * Module 9 — Breaking a Peg: September 1992
 *
 * The promise: understand exactly how the sterling trade made the money it
 * made, well enough to price it yourself.
 *
 * Built so the mechanism arrives in the order it has to: why the position was
 * unbearable, what the trade actually was, what the defence cost the other
 * side, and then the day itself with the arithmetic run against the published
 * exchange rates. The payoff simulation reproduces the reported outcome — a
 * position reported near $10bn and a profit reported near $1bn — from rates
 * anyone can look up, which is the difference between understanding the trade
 * and having heard the story.
 *
 * Verified figures: sterling joined the ERM on 8 October 1990 at DM 2.95 with
 * a ±6% band, putting the floor at DM 2.7780. Daily dollar rates (FRED
 * DEXUSUK) were $2.0030 on 8 September 1992, $1.8715 on the 15th, $1.8110 on
 * Black Wednesday and $1.7082 by the 22nd. DM/£ derived from EXUSUK × EXGEUS
 * fell from 2.8131 in August 1992 to 2.4238 by November. HM Treasury papers
 * released in 2005 put the cost to the UK at about £3.3bn.
 */

import { defineModule } from '../../schema';
import { theTrapLesson } from './lesson-01-the-trap';
import { theAsymmetricBetLesson } from './lesson-02-the-asymmetric-bet';
import { defendingAPegLesson } from './lesson-03-defending-a-peg';
import { blackWednesdayLesson } from './lesson-04-black-wednesday';

export const moduleBreakingAPeg = defineModule({
  id: 'breaking-a-peg-1992',
  title: 'Breaking a Peg: September 1992',
  description:
    'The sterling trade, priced rather than retold: why the ERM position was unbearable, why shorting a peg costs only carry, what defending one actually spends, and the arithmetic of Black Wednesday.',
  accent: 'coral',
  lessons: [
    theTrapLesson,
    theAsymmetricBetLesson,
    defendingAPegLesson,
    blackWednesdayLesson,
  ],
});
