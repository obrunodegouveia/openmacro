/**
 * Module 17 — What GDP Counts
 *
 * The promise: read a growth figure and know what it cannot tell you.
 *
 * The module exists because the most common argument about GDP — that a war
 * can raise it while making a country poorer — is correct, and is almost
 * always made badly. It gets made by asserting that the accountants have got
 * something wrong, when what is actually true is narrower and much harder to
 * argue with: GDP is a flow of production, destruction of the stock is not a
 * flow, and so the two never meet in the same table.
 *
 * So the argument is built in the order it has to be built. What GDP counts,
 * and the flow-versus-stock distinction that everything rests on. Consumption
 * against capital formation, using cosmetics rather than a straw man, because
 * consumption is not a lesser use of output and pretending otherwise would be
 * a different kind of error. Then destruction, where the case is made — with
 * the inconvenient fact that since 2008 a warship is capital formation in the
 * accounts, which the argument has to survive rather than ignore. Then who
 * pays, where "deficits are paid by inflation" is taught with its conditions
 * attached, because it is true against a capacity ceiling and false in a
 * slump, and a course that flattened that would be worse than one that never
 * raised it. Finally a simulation where the same outlay produces the same GDP
 * and three different decades.
 *
 * Figures: US federal spending about 10% of GDP in 1940 against over 40% by
 * 1944; US consumer prices about 8.4% in 1942, 3% in 1943 under the Emergency
 * Price Control Act, then 8.5% in 1946 and 14.4% in 1947 once controls were
 * lifted. SNA 2008 moved durable military equipment from government
 * consumption to gross fixed capital formation; single-use items remain
 * military inventories. Kuznets' warning to Congress that national welfare
 * can scarcely be inferred from national income is from the 1934 report.
 */

import { defineModule } from '../../schema';
import { whatGdpCountsLesson } from './lesson-01-what-gdp-counts';
import { consumptionIsNotCapitalLesson } from './lesson-02-consumption-is-not-capital';
import { destructionDoesNotSubtractLesson } from './lesson-03-destruction-does-not-subtract';
import { whoPaysForItLesson } from './lesson-04-who-pays-for-it';
import { sameNumberThreeEconomiesLesson } from './lesson-05-same-number-three-economies';

export const moduleWhatGdpCounts = defineModule({
  id: 'what-gdp-counts',
  title: 'What GDP Counts',
  description:
    'Why building a hospital and shelling a city both show up as growth, and what the number would have to be to tell them apart. Flow against stock, consumption against capital, and who ends up paying for the difference.',
  accent: 'gold',
  lessons: [
    whatGdpCountsLesson,
    consumptionIsNotCapitalLesson,
    destructionDoesNotSubtractLesson,
    whoPaysForItLesson,
    sameNumberThreeEconomiesLesson,
  ],
});
