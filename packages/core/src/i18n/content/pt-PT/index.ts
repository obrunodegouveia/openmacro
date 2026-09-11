import type { ContentTranslation } from '../index';
import { coursePtPT, headingsPtPT } from './headings';
import { startHerePtPT } from './start-here';

/**
 * The Portuguese content overlay.
 *
 * One fully translated module plus every module's heading. Adding the next
 * module is one import and one line — and `npm run i18n:status` will say so
 * without anyone updating a README.
 */
export const ptPTContent: ContentTranslation = {
  course: coursePtPT,
  modules: {
    ...headingsPtPT,
    'start-here': startHerePtPT,
  },
};
