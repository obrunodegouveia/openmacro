/**
 * Module 19 — Setting the Rate
 *
 * The promise: know how the decision is actually made, well enough to sit in
 * the room and argue with the staff.
 *
 * The course teaches the plumbing better than most textbooks — where reserves
 * come from, how a payment settles, what a balance sheet does under stress.
 * What it never taught is the decision itself. A learner could describe every
 * lever and had no framework for where to set one, which is the whole of the
 * job this module is aimed at.
 *
 * So: the rate as a position against an unobservable neutral rather than a
 * level; the Taylor rule driven by hand and then the situations where
 * following it would be wrong; lags, and why the target has to be the forecast
 * rather than the print; supply against demand, which is the judgement that
 * decides whether a decade goes well; and finally composition — the rate
 * prices credit and cannot address it, so whether a boom leaves capacity
 * behind or only dearer houses is settled by instruments most people have
 * never heard of.
 *
 * Deliberately technical and deliberately narrow. Communication, committee
 * politics, institutional management and the legal mandate are all part of the
 * job and none of them is here.
 *
 * Figures: Taylor's 1993 rule with coefficients of 0.5 and 0.5; euro area HICP
 * peaked at 10.6% in October 2022; estimates of the advanced-economy neutral
 * real rate fell from around 3% before 2008 to under 1% in the 2010s with
 * error bands of a point or more; Jordà, Schularick and Taylor find mortgage
 * lending rising from roughly a third of advanced-economy bank balance sheets
 * around 1900 to roughly two thirds by 2010, with real-estate credit booms
 * followed by deeper recessions than business-lending booms of the same size.
 */

import { defineModule } from '../../schema';
import { whatYouAreSteeringLesson } from './lesson-01-what-you-are-steering';
import { theRuleAndItsLimitsLesson } from './lesson-02-the-rule-and-its-limits';
import { youAreSettingItForNextYearLesson } from './lesson-03-you-are-setting-it-for-next-year';
import { supplyOrDemandLesson } from './lesson-04-supply-or-demand';
import { whereTheCreditGoesLesson } from './lesson-05-where-the-credit-goes';

export const moduleSettingTheRate = defineModule({
  id: 'setting-the-rate',
  title: 'Setting the Rate',
  description:
    'Every other module explains a lever. This one is about where to set it: the stance against an unobservable neutral, a rule worth departing from, lags that make today’s inflation unreachable, supply against demand, and why the rate can price credit but never say what it is for.',
  accent: 'violet',
  level: 'advanced',
  lessons: [
    whatYouAreSteeringLesson,
    theRuleAndItsLimitsLesson,
    youAreSettingItForNextYearLesson,
    supplyOrDemandLesson,
    whereTheCreditGoesLesson,
  ],
});
