/**
 * Module — What Is Economics? (id `what-is-economics`)
 *
 * The first module of the course, before Banking and Money. Everything after
 * it assumes an answer to a question nobody had asked: what is economics
 * about? The answer here is the textbook one, in plain words — how people deal
 * with scarcity — and one way of seeing it that the rest of the course leans
 * on: people put in their energy (work, time and skill), get products and
 * services back, and money is the tool that carries that energy between them.
 *
 * "Energy" is the course's shorthand, not a term economists use. The
 * explanations name the real ones as they go: labour, capital and land,
 * subjective value, the double coincidence of wants.
 *
 * Every lesson opens with Olivia and Breno, so kids mode has a full path
 * through the module, and the warm-ups carry the same three ideas as the
 * grown-up challenges below them.
 */

import { defineModule } from '../../schema';
import { whyEconomicsExistsLesson } from './lesson-01-why-economics-exists';
import { energyInGoodsOutLesson } from './lesson-02-energy-in-goods-out';
import { howEnergyTravelsLesson } from './lesson-03-how-energy-travels';

export const moduleWhatIsEconomics = defineModule({
  id: 'what-is-economics',
  title: 'What Is Economics?',
  description:
    'Start here. Economics is the study of how people deal with scarcity: what we give, in work and time, for the products and services we want, and how money carries that energy from one person to the next.',
  accent: 'gold',
  level: 'beginner',
  lessons: [whyEconomicsExistsLesson, energyInGoodsOutLesson, howEnergyTravelsLesson],
});
