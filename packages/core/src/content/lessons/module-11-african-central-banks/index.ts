/**
 * Module 11 — African Central Banks and the CFA Franc
 *
 * The promise: understand a monetary arrangement well enough to say who bears
 * each cost and who takes each benefit, by name.
 *
 * The franc zone is the clearest teaching case in the course, for the reason
 * the reader who asked for it gave: fewer moving parts. The peg is explicit,
 * the parity is a published constant, the institutional links are documented by
 * the governments themselves, and there is a natural comparison group next
 * door running the opposite regime.
 *
 * It is also the module where getting the facts current matters most, because
 * the most repeated version of the argument went half out of date in 2020. The
 * obligation to centralise reserves at the French Treasury and France's seats
 * on the BCEAO's governing bodies both ended for the eight UEMOA states; the
 * euro peg and the French convertibility guarantee did not. So the module posts
 * the operations account by hand, dates it, and then spends its second half on
 * the mechanism that no reform touched — the fixed rate, and where the
 * adjustment it refuses to make lands instead.
 *
 * The last lesson puts both columns up with numbers on each, because the
 * evidence genuinely points both ways: 4.4% inflation in Côte d'Ivoire against
 * 38.1% in Ghana in 2023, and a currency that moved 1.2x against the dollar
 * since 2010 where the naira moved 10.1x — set against no independent monetary
 * policy, accumulating real appreciation, dollar-priced exports under a euro
 * peg, and frictionless profit repatriation. A learner should finish able to
 * argue either side and to say what evidence would settle it.
 *
 * Sources: the French government's own Franc Zone page for the institutional
 * facts and the 2019 reform; BCEAO and BEAC for policy rates (3.00% from 16
 * March 2026; TIAO 4.50% from 29 June 2026); World Bank for inflation and
 * exchange rates.
 */

import { defineModule } from '../../schema';
import { theFrancZoneMapLesson } from './lesson-01-the-franc-zone-map';
import { theOperationsAccountLesson } from './lesson-02-the-operations-account';
import { whatThePegCostsLesson } from './lesson-03-what-the-peg-costs';
import { theLedgerLesson } from './lesson-04-the-ledger';

export const moduleAfricanCentralBanks = defineModule({
  id: 'african-central-banks',
  title: 'African Central Banks and the CFA Franc',
  description:
    'Fourteen countries, two currencies with one name, and a peg fixed at 655.957 since 1999. What the account in Paris was, what changed in 2020, and who bears the cost of a rate that cannot move.',
  accent: 'gold',
  lessons: [
    theFrancZoneMapLesson,
    theOperationsAccountLesson,
    whatThePegCostsLesson,
    theLedgerLesson,
  ],
});
