/**
 * Module 3 — The Fed & ECB Levers
 *
 * Tier 1 of the monetary machine: the instruments a central bank actually
 * operates, posted as balance sheet entries rather than described in prose.
 * IORB and the ON RRP floor on the Fed side; the DFR corridor, MRO and TLTROs
 * on the ECB side.
 *
 * CONTRIBUTORS: add a lesson by creating a sibling file here and appending it
 * to the `lessons` array. Nothing else in the app needs to change — the
 * runner, progress tracking and routing are all data-driven.
 *
 * Lessons may be `.ts` or `.json`; both are checked before merge
 * (`npm run typecheck` and `npm run lint:content` respectively).
 */

import { defineModule, type Lesson } from '@/content/schema';
import { qePrimaryDealerLesson } from './lesson-01-qe-primary-dealer';
import rrpFloorMechanics from './lesson-02-rrp-floor-mechanics.json';

/**
 * A JSON import arrives with widened structural types — `string` where the
 * schema wants the literal `'t_account_flow'`. This cast is the single place
 * that assertion is made; `npm run lint:content` is what actually enforces
 * the shape, including the double-entry rule the type system cannot express.
 */
const rrpFloorMechanicsLesson = rrpFloorMechanics as unknown as Lesson;

export const moduleFedEcbLevers = defineModule({
  id: 'module-03-fed-ecb-levers',
  title: 'The Fed & ECB Levers',
  description:
    'IORB, the ON RRP floor, the discount window and the DFR corridor — posted entry by entry.',
  accent: 'blue',
  lessons: [qePrimaryDealerLesson, rrpFloorMechanicsLesson],
});
