/**
 * Module 12 — Real Assets, Nominal Claims and the Price of an Address
 *
 * The promise: understand why holding property through a monetary expansion
 * transfers wealth from the people holding the currency — and what would have
 * to be true for that to stop working.
 *
 * The core of the thesis survives contact with the data, and one part of it
 * does not. Euro area money grew 69% from 2015 while consumer prices rose 32%
 * and house prices 60%, so cash lost 24% in real terms over the period while
 * the same flat on a 20% deposit returned about 204%. The mortgage is what
 * makes it a transfer rather than a coincidence: the debt is fixed in euros and
 * the building is not, so the whole appreciation lands on the deposit while the
 * lender is repaid in cheaper money. And the money doing the bidding is
 * created at the moment of sale, in an amount set by what a bank will lend.
 *
 * The part that does not survive is "desirable property does not fall". Dublin
 * fell 54% and took fifteen years to regain its peak; Madrid fell 37% and took
 * sixteen and a half. So the module weakens the claim to what the evidence
 * actually supports — a cost floor that ratchets upward, supply that cannot
 * respond in a desirable city, and owners who cannot be forced to sell unless
 * they carry debt — and then names the variable that predicts the exception,
 * which is credit growth rather than price level.
 *
 * Sources: ECB Data Portal for M3; Eurostat prc_hpi_q for house prices,
 * prc_hicp_midx for consumer prices and sts_copi_q for construction costs.
 */

import { defineModule } from '../../schema';
import { eurosOrAHouseLesson } from './lesson-01-euros-or-a-house';
import { whoeverGetsItFirstLesson } from './lesson-02-whoever-gets-it-first';
import { theFloorUnderThePriceLesson } from './lesson-03-the-floor-under-the-price';
import { whenDesirablePlacesFallLesson } from './lesson-04-when-desirable-places-fall';

export const moduleRealAssetsAndProperty = defineModule({
  id: 'real-assets-and-property',
  title: 'Real Assets and the Price of an Address',
  description:
    'Money grew 69%, consumer prices 32%, houses 60%. Why holding property through that transfers wealth from whoever held euros, what puts a floor under a price — and why Dublin still fell by half.',
  accent: 'violet',
  lessons: [
    eurosOrAHouseLesson,
    whoeverGetsItFirstLesson,
    theFloorUnderThePriceLesson,
    whenDesirablePlacesFallLesson,
  ],
});
