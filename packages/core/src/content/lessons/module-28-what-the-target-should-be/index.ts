/**
 * The framework itself. Earlier modules take the target as given and work on
 * hitting it; this one asks what the target should be, which is the question
 * a governor faces during a strategy review and occasionally in front of a
 * legislature.
 *
 * The simulation is the arithmetic that produced the entire unconventional
 * toolkit: how much room the framework has above the floor, against how much
 * a recession asks for.
 */

import { defineModule } from '../../schema';
import { whyTwoPercentLesson } from './lesson-01-why-two-percent';
import { theFloorUnderEverythingLesson } from './lesson-02-the-floor-under-everything';
import { makingUpTheShortfallLesson } from './lesson-03-making-up-the-shortfall';
import { whatElseCouldBeTargetedLesson } from './lesson-04-what-else-could-be-targeted';

export const moduleWhatTheTargetShouldBe = defineModule({
  id: 'what-the-target-should-be',
  title: 'What the Target Should Be',
  description:
    'Where 2% came from, what the lower bound does to a framework, make-up strategies, and the anchors that suit other countries.',
  accent: 'azure',
  level: 'advanced',
  lessons: [
    whyTwoPercentLesson,
    theFloorUnderEverythingLesson,
    makingUpTheShortfallLesson,
    whatElseCouldBeTargetedLesson,
  ],
});
