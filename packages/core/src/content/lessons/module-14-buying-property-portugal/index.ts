/**
 * Module 14 — Buying Property in Portugal: The Arithmetic
 *
 * The promise: know to the euro what a purchase costs, and the number of years
 * of appreciation it takes to get that back.
 *
 * The most directly practical module in the course, and the only one that
 * computes a decision rather than explaining a mechanism. Every figure is a
 * published Portuguese parameter: the 2026 IMT table for a permanent primary
 * residence (Ofício Circulado n.º 40129/2026), stamp duty at 0.8%, IMI at
 * 0.30%–0.45% of the VPT with most councils at the floor, and the standard
 * agency commission of 5% plus VAT. The IMT function reproduces the Tax
 * Authority's own worked example to the cent.
 *
 * On a €300,000 permanent home that is €13,942 to buy, 6.15% to sell, and
 * about €4,100 a year to hold — 4.65% in, 6.15% out, 1.37% a year. The
 * break-even by appreciation rate: 10% in two years, 5% in four, 3% in seven,
 * 2% in fourteen, and at 1% never, because appreciation below the carry rate
 * loses ground every year no matter how long it is held. That cliff — at the
 * carry rate rather than at zero — is the finding the module is built around.
 *
 * Mortgage interest is deliberately excluded and the exclusion is taught: its
 * comparator is the rent not paid, not the appreciation on the flat, and
 * mixing the two produces a number that answers neither question. The last
 * lesson returns everything that was left out — capital gains tax, the rent
 * comparison, illiquidity, the IMT Jovem exemption — and notes that three of
 * the four make the honest break-even later, which is why a simple model of a
 * property purchase almost always flatters it.
 */

import { defineModule } from '../../schema';
import { theCostOfTheDeedLesson } from './lesson-01-the-cost-of-the-deed';
import { theCarryLesson } from './lesson-02-the-carry';
import { theBreakEvenLesson } from './lesson-03-the-break-even';
import { whatItLeavesOutLesson } from './lesson-04-what-it-leaves-out';

export const moduleBuyingPropertyPortugal = defineModule({
  id: 'buying-property-portugal',
  title: 'Buying Property in Portugal: The Arithmetic',
  description:
    'IMT, stamp duty, IMI, maintenance and the agency commission, to the euro — and how many years of appreciation it takes to clear them. There is a rate below which it never happens.',
  accent: 'emerald',
  lessons: [
    theCostOfTheDeedLesson,
    theCarryLesson,
    theBreakEvenLesson,
    whatItLeavesOutLesson,
  ],
});
