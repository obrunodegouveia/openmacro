/**
 * Module 15 — Scrutinising CBDCs: Project Mariana
 *
 * The promise: read a central bank digital currency experiment well enough to
 * say what it built, who it grants power over, and who would have to say yes
 * before any of it became money.
 *
 * The module is built around one document — the Project Mariana final report
 * (BIS Innovation Hub with the Bank of France, the Monetary Authority of
 * Singapore and the Swiss National Bank, 28 September 2023) — because working
 * a single primary source properly teaches more than surveying ten.
 *
 * It opens by taking away the confusion everything else rests on. Wholesale
 * and retail CBDC share an acronym and almost nothing else: banks have held
 * digital central bank money for decades, so a wholesale token changes the
 * plumbing, while a retail one changes who holds a claim on the central bank.
 * The learner posts the issuance by hand and finds it is a liability swap —
 * M0 unchanged, M2 unchanged, nothing created.
 *
 * Then the project itself, literally: hypothetical euro, Singapore dollar and
 * Swiss franc tokens as ERC-20 smart contracts, domestic platforms on
 * permissioned Ethereum and a transnational network on the public Sepolia
 * testnet, bridges built from paired smart contracts and six relayers, and a
 * three-currency automated market-maker replacing the correspondent chain.
 * Twenty-four test cases, no real money, and a disclaimer in the executive
 * summary that the project "does not indicate that any of the involved central
 * banks intend to issue CBDC".
 *
 * The third lesson prices it. The report's own calibration — a €50 million
 * EUR/CHF trade at about one basis point against a pool of roughly €1.8
 * billion, with cost approximately proportional to trade over pool — becomes a
 * simulation, and the finding is the report's: instant gross settlement is
 * bought with pre-funded liquidity, "a significant departure from the ex post
 * funding (deferred net settlement) in use in today's FX markets".
 *
 * The fourth lesson handles the control features honestly in both directions.
 * Access control, pause, recovery, upgradeability and monitoring are all named
 * in the report as requirements C.1–C.5; three of the five restate powers any
 * operator of a settlement system already holds over a bank, and upgradeability
 * is the one without a precedent. The claim that complexity is concealment is
 * tested and mostly fails here — the design is public — while the genuine gap,
 * the questions ruled out of scope, is where the report says it is.
 *
 * The last lesson supplies the test that outlives the project: who would have
 * to say yes. A BIS prototype cannot become a currency; the digital euro is a
 * legislative file whose holding limit is undecided; Pontes, the wholesale
 * link between DLT platforms and TARGET, goes live in the third quarter of
 * 2026 and is not a CBDC; and mBridge changed owner in October 2024, which is
 * how a project stops being followable.
 *
 * Editorially this is a module about method rather than a verdict. It was
 * prompted by a thread arguing that the complexity of these experiments
 * signals an absence of transparency. That claim deserves testing rather than
 * either adoption or dismissal, and testing it turns out to require knowing
 * what is in the documents — which is the course this module belongs to.
 */

import { defineModule } from '../../schema';
import { wholesaleIsNotRetailLesson } from './lesson-01-wholesale-is-not-retail';
import { whatMarianaBuiltLesson } from './lesson-02-what-mariana-built';
import { thePriceOfInstantFxLesson } from './lesson-03-the-price-of-instant-fx';
import { readTheRequirementsLesson } from './lesson-04-read-the-requirements';
import { whoWouldHaveToSayYesLesson } from './lesson-05-who-would-have-to-say-yes';

export const moduleScrutinisingCbdcs = defineModule({
  id: 'scrutinising-cbdcs',
  title: 'Scrutinising CBDCs: Project Mariana',
  description:
    'One BIS experiment, read properly. What a wholesale CBDC changes and what it does not, what Mariana actually built, what instant settlement costs in parked liquidity, which control features are new — and who would have to say yes before any of it is money.',
  accent: 'violet',
  level: 'advanced',
  lessons: [
    wholesaleIsNotRetailLesson,
    whatMarianaBuiltLesson,
    thePriceOfInstantFxLesson,
    readTheRequirementsLesson,
    whoWouldHaveToSayYesLesson,
  ],
});
