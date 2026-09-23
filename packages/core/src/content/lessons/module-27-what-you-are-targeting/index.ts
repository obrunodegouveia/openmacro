/**
 * The target variable itself. Every earlier module aimed policy at a number;
 * this one opens it up — how the index is built, which measure to act on,
 * where expectations come from, what wages actually do to prices, and how
 * much of an external shock ever arrives.
 *
 * It sits before the framework and forecasting modules because a governor who
 * cannot say how the target is constructed cannot sensibly argue about what
 * the target should be.
 */

import { defineModule } from '../../schema';
import { buildingTheIndexLesson } from './lesson-01-building-the-index';
import { coreAndHeadlineLesson } from './lesson-02-core-and-headline';
import { theCurveThatKeepsDyingLesson } from './lesson-03-the-curve-that-keeps-dying';
import { whatWagesActuallyDoLesson } from './lesson-04-what-wages-actually-do';
import { theShockAndTheEchoLesson } from './lesson-05-the-shock-and-the-echo';

export const moduleWhatYouAreTargeting = defineModule({
  id: 'what-you-are-targeting',
  title: 'What You Are Actually Targeting',
  description:
    'How inflation is measured, which measure to act on, where expectations come from, and what wages and exchange rates really do to prices.',
  accent: 'mint',
  level: 'advanced',
  lessons: [
    buildingTheIndexLesson,
    coreAndHeadlineLesson,
    theCurveThatKeepsDyingLesson,
    whatWagesActuallyDoLesson,
    theShockAndTheEchoLesson,
  ],
});
