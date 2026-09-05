/**
 * Module 1 — Where Does Money Come From?
 *
 * CONTRIBUTORS: add a new lesson by creating a sibling file in this folder and
 * appending it to the `lessons` array below. Nothing else in the app needs to
 * change — the runner, progress tracking and routing are all data-driven.
 */

import { defineModule } from '../../schema';
import { banksCreateDepositsLesson } from './lesson-01-banks-create-deposits';

export const moduleWhereDoesMoneyComeFrom = defineModule({
  id: 'module-01-where-does-money-come-from',
  title: 'Where Does Money Come From?',
  description:
    'Most money is not printed — it is typed into existence by commercial banks. Start here.',
  accent: 'mint',
  lessons: [banksCreateDepositsLesson],
});
