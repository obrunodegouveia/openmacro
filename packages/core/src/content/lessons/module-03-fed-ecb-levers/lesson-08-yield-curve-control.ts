/**
 * ============================================================================
 * Module 3 · Lesson 8 — "Fixing a price instead of a quantity"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to explain the difference between committing to a
 * quantity of purchases and committing to a yield, and why the second is
 * cheaper when credible and unbounded when not.
 *
 * Sources / further reading for reviewers:
 *   - Bank of Japan, YCC framework from September 2016 and its 2022–24
 *     adjustments.
 *   - Federal Reserve, the 1942–51 pegged-yield period and the 1951 Accord.
 *
 * A note on rigour: this is the same structural bet as a currency peg —
 * defending a price with unlimited issuance of your own liability. The
 * comparison with Module 1's peg lesson is deliberate; the asymmetry runs the
 * other way, and the final challenge is about why.
 */

import { defineLesson } from '../../schema';

export const yieldCurveControlLesson = defineLesson({
  id: 'yield-curve-control',
  title: 'Fixing a Price, Not a Quantity',
  subtitle: 'Promise to buy any amount at a set yield, and you may not have to buy much at all.',
  icon: '📌',
  difficulty: 'advanced',
  estimatedMinutes: 7,
  hearts: 3,

  keyTakeaways: [
    'QE fixes a quantity and lets the yield land where it lands. Yield curve control fixes the yield and lets the quantity land where it lands.',
    'If the target is credible, few purchases are needed — the promise does the work.',
    'If it is not, the central bank must buy without limit, which it technically can.',
    'Unlike a currency peg, the central bank cannot run out — it is defending a price in the money it issues.',
  ],

  challenges: [
    {
      id: 'mc-ycc-vs-qe',
      type: 'multiple_choice',
      tags: ['ycc', 'qe'],
      xp: 15,
      prompt: 'Under yield curve control, how much does the central bank buy?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'announced',
          label: 'A fixed amount announced in advance',
          feedback:
            'That is QE. The whole point of YCC is that the quantity is not chosen — it is whatever the target requires.',
        },
        {
          id: 'whatever',
          label: 'Whatever it takes to hold the yield at the target — possibly nothing',
        },
        {
          id: 'nothing',
          label: 'Nothing — it only sets a rate',
          feedback:
            'It must stand ready to buy, and sometimes does so heavily. The commitment is worthless if it is not backed by actual willingness to transact.',
        },
        {
          id: 'proportional',
          label: 'An amount proportional to the gap from target',
          feedback:
            'There is no formula. The central bank offers to buy unlimited quantities at the target price, and the market decides how much to sell.',
        },
      ],
      correctOptionId: 'whatever',
      explanation:
        'The quantity becomes endogenous. If investors believe the target will hold, nobody sells at a worse price and the central bank buys little — the Bank of Japan went months at a time barely transacting. When belief weakened in 2022 the same commitment forced it to buy enormous quantities, ending up owning more than half the government bond market. Same policy, wildly different cost, depending only on credibility.',
    },

    {
      id: 'match-ycc-terms',
      type: 'concept_match',
      tags: ['ycc', 'policy'],
      xp: 15,
      prompt: 'Match each idea to what it describes.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'qe',
          term: 'QE',
          definition: 'Commit to a quantity of purchases; the yield settles wherever it settles',
        },
        {
          id: 'ycc',
          term: 'Yield curve control',
          definition: 'Commit to a yield; the quantity purchased is whatever that requires',
        },
        {
          id: 'guidance',
          term: 'Forward guidance',
          definition: 'Commit to a future policy path to move rates today',
        },
        {
          id: 'endogenous',
          term: 'Endogenous quantity',
          definition: 'An amount decided by the market’s response, not by the policymaker',
        },
        {
          id: 'exit',
          term: 'Exit problem',
          definition: 'The difficulty of stopping without triggering the move you were suppressing',
        },
      ],
      explanation:
        'The exit problem is what makes YCC hard to leave. Every holder knows that when the target goes, yields rise and prices fall — so the announcement itself causes the selling. Japan spent two years widening the band in small increments precisely to avoid a single cliff-edge repricing, and each widening was still treated as a signal about the next one.',
    },

    {
      id: 'order-ycc-pressure',
      type: 'order_flow',
      tags: ['ycc', 'crisis'],
      xp: 20,
      prompt: 'A yield target comes under pressure. Put the sequence in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'inflation',
          label: 'Inflation rises and other central banks tighten',
          detail: 'The target yield now looks far below fair value',
        },
        {
          id: 'sell',
          label: 'Investors sell bonds to the central bank at the target price',
          detail: 'Why hold at 0.25% when the world pays 4%?',
        },
        {
          id: 'buy',
          label: 'The central bank buys everything offered',
          detail: 'It must, or the target is not a target',
        },
        {
          id: 'own',
          label: 'It ends up owning most of the market',
          detail: 'Liquidity in the underlying bond dries up',
        },
        {
          id: 'currency',
          label: 'The pressure moves to the currency instead',
          detail: 'Rates cannot adjust, so the exchange rate does',
        },
      ],
      correctOrder: ['inflation', 'sell', 'buy', 'own', 'currency'],
      explanation:
        'The last step is the one people miss. Suppressing a domestic yield does not remove the pressure, it redirects it — with the interest rate fixed, the adjustment appears in the exchange rate, and the yen fell sharply through 2022. This is the trilemma from Module 1 in a new costume: fixing an internal price while capital moves freely means giving up control of the external one.',
    },

    {
      id: 'mc-ycc-vs-peg',
      type: 'multiple_choice',
      tags: ['ycc', 'pegs'],
      xp: 20,
      prompt: 'A currency peg can run out of reserves. Can yield curve control run out of anything?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'yes-bonds',
          label: 'Yes — it runs out of bonds to buy',
          feedback:
            'Owning the entire market is a real limit, but it is a limit on the market’s existence rather than on the central bank’s ability to pay. It never fails to settle.',
        },
        {
          id: 'no-own-currency',
          label: 'No — it buys with money it issues, so it can always pay',
        },
        {
          id: 'yes-capital',
          label: 'Yes — losses on the bonds eventually make it insolvent',
          feedback:
            'Central banks do book large losses on such portfolios and several are technically in negative equity. It is politically awkward and operationally irrelevant: they can still create the money to settle.',
        },
        {
          id: 'yes-inflation',
          label: 'Yes — inflation forces it to stop',
          feedback:
            'This is the true constraint, and it is a *choice* rather than a limit. The bank stops because the consequences become unacceptable, not because it cannot continue.',
        },
      ],
      correctOptionId: 'no-own-currency',
      explanation:
        'This is the crucial asymmetry with a peg. Defending a currency means buying it with foreign reserves you must already hold, and those run out. Defending a yield means buying bonds with reserves you create, and those never do. So YCC cannot fail technically — it fails politically, when the inflation or currency consequences of continuing become worse than the repricing of abandoning it. Japan’s exit came when it chose one, not when it ran out.',
    },
  ],
});
