import { defineModule } from '../../schema';
import { settlementIsTheProductLesson } from './lesson-01-settlement-is-the-product';
import { intradayLiquidityLesson } from './lesson-02-intraday-liquidity';
import { whenItStopsLesson } from './lesson-03-when-it-stops';

/**
 * The operational half of the job. Policy decides the rate; the payment system
 * is what the institution actually runs, every second, and it is where a
 * governor sees trouble before any market price shows it.
 */
export const moduleThePlumbing = defineModule({
  id: 'the-plumbing',
  title: 'The Plumbing',
  description:
    'Settlement, intraday liquidity and operational risk — the largest thing a central bank operates and the least discussed.',
  accent: 'amber',
  level: 'advanced',
  lessons: [settlementIsTheProductLesson, intradayLiquidityLesson, whenItStopsLesson],
});
