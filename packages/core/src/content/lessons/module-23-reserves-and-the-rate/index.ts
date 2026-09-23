/**
 * Module 23 — Reserves and the Rate
 *
 * The promise: know what reserves are for, what they cost, and what
 * intervention can and cannot do.
 *
 * The course had the trilemma, a speculative attack and a broken peg. What it
 * never had was the ordinary management: how adequacy is judged, what a
 * defence costs before it starts, why buying foreign currency is a domestic
 * monetary operation, and the swap line network that determines which
 * countries have to self-insure at all.
 *
 * The simulation puts the two numbers a governor watches side by side — days
 * of cover, and the annual bill for holding the stock that provides them.
 * They pull in opposite directions, which is the whole of reserve policy.
 */

import { defineModule } from '../../schema';
import { whatReservesAreForLesson } from './lesson-01-what-reserves-are-for';
import { sterilisedOrNotLesson } from './lesson-02-sterilised-or-not';
import { theSwapLineLesson } from './lesson-03-the-swap-line';

export const moduleReservesAndTheRate = defineModule({
  id: 'reserves-and-the-rate',
  title: 'Reserves and the Rate',
  description:
    'What reserves are actually for, what holding them costs every year, why buying foreign currency is a domestic monetary operation, and the swap line network that decides which countries have to insure themselves at all.',
  accent: 'azure',
  level: 'advanced',
  lessons: [whatReservesAreForLesson, sterilisedOrNotLesson, theSwapLineLesson],
});
