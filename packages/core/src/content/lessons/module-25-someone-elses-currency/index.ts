/**
 * The emerging-market module, and the honest one. The rest of the course
 * assumes a state that borrows in money its own central bank issues, a
 * currency nobody flees, and a fiscal authority that adjusts. Most of the
 * world's central banks work without one or more of those, and the job is
 * different in kind rather than in degree.
 *
 * The simulation isolates the single fact underneath all of it: what a
 * depreciation does to a debt ratio when part of the debt is somebody else's
 * currency.
 */

import { defineModule } from '../../schema';
import { originalSinLesson } from './lesson-01-original-sin';
import { surgesAndStopsLesson } from './lesson-02-surges-and-stops';
import { fiscalDominanceLesson } from './lesson-03-fiscal-dominance';

export const moduleSomeoneElsesCurrency = defineModule({
  id: 'someone-elses-currency',
  title: 'Someone Else’s Currency',
  description:
    'Currency mismatch, capital flow cycles and fiscal dominance — running a central bank without the assumptions the textbooks make.',
  accent: 'coral',
  level: 'advanced',
  lessons: [originalSinLesson, surgesAndStopsLesson, fiscalDominanceLesson],
});
