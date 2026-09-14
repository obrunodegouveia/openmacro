/**
 * ============================================================================
 * Module 4 · Lesson 6 — "Everyone borrows in dollars"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to explain why a stronger dollar tightens
 * financial conditions worldwide, and why the Fed's domestic mandate has
 * global consequences it does not weigh.
 *
 * Sources / further reading for reviewers:
 *   - Rey, "Dilemma not Trilemma" (Jackson Hole, 2013).
 *   - BIS, "The dollar exchange rate as a global risk factor" (Avdjiev et al.).
 *   - Original sin literature: Eichengreen & Hausmann.
 *
 * A note on rigour: Rey's claim is that free capital mobility leaves a country
 * with one real choice, not two — a strong version that remains debated. The
 * lesson presents it as an argument with evidence rather than as settled.
 */

import { defineLesson } from '../../schema';

export const globalDollarCycleLesson = defineLesson({
  id: 'global-dollar-cycle',
  title: 'Everyone Borrows in Dollars',
  subtitle: 'Why a Fed decision made for Ohio changes the cost of money in Jakarta.',
  icon: '🪙',
  difficulty: 'advanced',
  estimatedMinutes: 8,
  hearts: 3,

  keyTakeaways: [
    'Firms and governments outside the US borrow heavily in dollars while earning in local currency.',
    'A stronger dollar therefore increases their debt burden without their debt changing.',
    'Lenders see weaker borrowers, lend less, and the tightening spreads without any local policy change.',
    'This is why a floating exchange rate buys less independence than the trilemma promises.',
  ],

  challenges: [
    {
      id: 'mc-currency-mismatch',
      type: 'multiple_choice',
      tags: ['global-dollar', 'currency-mismatch'],
      xp: 15,
      prompt: 'An Indonesian firm earns rupiah and owes $100m. The dollar strengthens 20%. What happened to the debt?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'unchanged',
          label: 'Nothing — it still owes $100m',
          feedback:
            'True in dollars and irrelevant to the firm. It repays out of rupiah earnings, and it now needs 20% more of them.',
        },
        {
          id: 'heavier',
          label: 'It grew by 20% in the currency the firm actually earns',
        },
        {
          id: 'smaller',
          label: 'It shrank, since the dollar buys more',
          feedback:
            'The dollar buying more is the problem, not the relief — the firm must *buy* dollars to repay.',
        },
        {
          id: 'hedged',
          label: 'Nothing, because firms always hedge',
          feedback:
            'Hedging is expensive and long-dated hedges in emerging currencies are often unavailable. Large mismatches are the norm, not the exception.',
        },
      ],
      correctOptionId: 'heavier',
      explanation:
        'This is currency mismatch, and it is the mechanism that transmits US monetary policy to economies with no other connection to it. The firm’s revenue is unchanged, its debt in dollars is unchanged, and yet it is materially closer to default — because the only number that matters is how much of what it earns is needed to buy what it owes.',
    },

    {
      id: 'order-global-cycle',
      type: 'order_flow',
      tags: ['global-dollar', 'transmission'],
      xp: 25,
      prompt: 'The Fed raises rates. Trace the effect on an emerging economy.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'hike',
          label: 'The Fed raises rates for domestic reasons',
          detail: 'US inflation, US labour market — nothing to do with anywhere else',
        },
        {
          id: 'dollar-up',
          label: 'The dollar strengthens as capital moves toward higher US yields',
          detail: 'Money leaves other markets to chase the return',
        },
        {
          id: 'debt-heavier',
          label: 'Dollar debts get heavier in local currency',
          detail: 'Without anyone borrowing another cent',
        },
        {
          id: 'lenders-retreat',
          label: 'Lenders see weaker balance sheets and cut credit lines',
          detail: 'The measured risk of the same borrower has genuinely risen',
        },
        {
          id: 'tighten',
          label: 'Local financial conditions tighten regardless of the local central bank',
          detail: 'Which may be trying to loosen at that very moment',
        },
      ],
      correctOrder: ['hike', 'dollar-up', 'debt-heavier', 'lenders-retreat', 'tighten'],
      explanation:
        'Nothing in this chain involves the local central bank, and the last step can happen while it is actively cutting. That is the substance of Hélène Rey’s "dilemma not trilemma" argument: a floating exchange rate is supposed to buy monetary independence, but when global credit conditions are set by the dollar cycle, floating buys much less than the textbook promises. Many central banks respond by raising rates *into* a slowdown to defend their currency — the opposite of what domestic conditions call for.',
    },

    {
      id: 'match-global-dollar-terms',
      type: 'concept_match',
      tags: ['global-dollar', 'concepts'],
      xp: 15,
      prompt: 'Match each term to what it means.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'mismatch',
          term: 'Currency mismatch',
          definition: 'Owing in one currency while earning in another',
        },
        {
          id: 'original-sin',
          term: 'Original sin',
          definition: 'The inability of some countries to borrow abroad in their own currency',
        },
        {
          id: 'exorbitant',
          term: 'Exorbitant privilege',
          definition: 'The issuer of the reserve currency borrowing more cheaply than others',
        },
        {
          id: 'self-insurance',
          term: 'Reserve accumulation',
          definition: 'Holding foreign currency as protection, at the cost of the domestic return foregone',
        },
        {
          id: 'triffin',
          term: 'Triffin dilemma',
          definition: 'The reserve issuer must supply the world’s liquidity while keeping its own house in order',
        },
      ],
      explanation:
        'Triffin’s dilemma is the structural tension underneath all of this. The world needs dollar assets to hold as reserves, which requires the US to supply them — but supplying them indefinitely means running deficits that eventually raise doubts about the very asset everyone is holding. It was framed in the 1960s about gold convertibility and it did not go away when that ended; it changed shape.',
    },

    {
      id: 'mc-why-still-dollars',
      type: 'multiple_choice',
      tags: ['global-dollar', 'reserve-currency'],
      xp: 20,
      prompt: 'Given all this, why do borrowers outside the US keep borrowing in dollars?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'forced',
          label: 'They are forced to by the US',
          feedback:
            'Nobody compels it. These are commercial decisions made because the alternatives are worse or unavailable.',
        },
        {
          id: 'cheaper-deeper',
          label: 'Dollar funding is cheaper, deeper and available at maturities their own markets cannot offer',
        },
        {
          id: 'no-choice',
          label: 'No other currency exists in size',
          feedback:
            'The euro is a genuine alternative and is used, particularly in Europe’s neighbourhood. The dollar’s dominance is a matter of degree, not exclusivity.',
        },
        {
          id: 'stability',
          label: 'The dollar never changes in value',
          feedback:
            'It moves a great deal, which is exactly the risk this lesson is about.',
        },
      ],
      correctOptionId: 'cheaper-deeper',
      explanation:
        'A firm choosing dollar debt is usually taking a real bargain: a lower rate, a longer maturity and a lender who will actually show up, none of which its domestic market offers. The currency risk is the price, and it is invisible until the dollar moves. That trade-off is rational one borrower at a time and dangerous in aggregate — which is a fair description of most of what this module has covered.',
    },
  ],
});
