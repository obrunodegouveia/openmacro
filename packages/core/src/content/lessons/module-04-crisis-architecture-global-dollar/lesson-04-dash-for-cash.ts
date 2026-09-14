/**
 * ============================================================================
 * Module 4 · Lesson 3 — "When the safest asset stops being liquid"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to distinguish safety from liquidity, and explain
 * how a rush into cash can dislocate the Treasury market itself — the asset
 * everyone flees *to*.
 *
 * Sources / further reading for reviewers:
 *   - Vissing-Jorgensen, "The Treasury Market in Spring 2020" (2021).
 *   - BIS, "The dash for cash" (Bulletin No 2, 2020).
 *   - NY Fed on the September 2019 repo spike.
 *
 * A note on rigour: March 2020 was not a solvency crisis — the bonds being
 * dumped were fine. It was a market-functioning failure, and treating it as a
 * credit event misreads why the response was so unusual.
 */

import { defineLesson } from '../../schema';

export const dashForCashLesson = defineLesson({
  id: 'dash-for-cash',
  title: 'When the Safest Asset Stops Being Liquid',
  subtitle: 'In March 2020 everyone sold Treasuries to raise dollars, and the market seized.',
  icon: '💥',
  difficulty: 'advanced',
  estimatedMinutes: 8,
  hearts: 3,

  keyTakeaways: [
    'Safe and liquid are different properties. A Treasury is always safe; it is not always sellable at a good price.',
    'When everyone raises cash at once, they sell what they *can* sell — which is the best asset they own.',
    'Dealers who intermediate the market have limited balance sheet, and it runs out.',
    'The 2020 response worked because the central bank bought as a market maker, not as a stimulus.',
  ],

  challenges: [
    {
      id: 'mc-safe-vs-liquid',
      type: 'multiple_choice',
      tags: ['liquidity', 'crisis'],
      xp: 15,
      prompt: 'A 10-year Treasury will certainly repay in full. Why might you still be unable to sell it at a fair price?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'default',
          label: 'Because it might default after all',
          feedback:
            'Credit risk is not the issue — that is what "certainly repay" rules out. The problem is about trading, not repayment.',
        },
        {
          id: 'no-buyer',
          label: 'Because selling requires a buyer with balance sheet, and in a panic there may not be one at that price',
        },
        {
          id: 'closed',
          label: 'Because the market closes in a crisis',
          feedback:
            'The Treasury market stayed open throughout March 2020. Open and functioning are different things.',
        },
        {
          id: 'illegal',
          label: 'Because regulators suspend trading',
          feedback:
            'No such suspension happened. Prices were available; they were just far from where they should have been.',
        },
      ],
      correctOptionId: 'no-buyer',
      explanation:
        'Safety is about the issuer; liquidity is about the market. Selling a bond needs somebody to take it, and in the middle of a panic the dealers who normally do that are already full — their balance sheets are finite and regulatory ratios bind. So the price gaps until someone with capacity appears, and for several days in March 2020 nobody did.',
    },

    {
      id: 'order-dash-for-cash',
      type: 'order_flow',
      tags: ['liquidity', 'crisis'],
      xp: 25,
      prompt: 'Reconstruct March 2020. Put the sequence in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'shock',
          label: 'A global shock makes every institution want cash',
          detail: 'Margin calls, redemptions, and plain caution all at once',
        },
        {
          id: 'sell-best',
          label: 'They sell the asset that is easiest to sell',
          detail: 'Treasuries — because the illiquid things cannot be sold at all',
        },
        {
          id: 'dealers-full',
          label: 'Dealers absorb the flow until their balance sheets are full',
          detail: 'Leverage ratios bind exactly when capacity is needed',
        },
        {
          id: 'prices-gap',
          label: 'Treasury prices fall and bid-ask spreads blow out',
          detail: 'The world’s benchmark asset stops trading normally',
        },
        {
          id: 'fed-buys',
          label: 'The Fed buys on a scale that dwarfs any QE programme',
          detail: 'Roughly a trillion dollars in three weeks',
        },
      ],
      correctOrder: ['shock', 'sell-best', 'dealers-full', 'prices-gap', 'fed-buys'],
      explanation:
        'Step two is the counterintuitive part and the key to the whole episode. In a scramble for cash you do not sell your worst assets — nobody wants them — you sell your best. So a flight *to* safety and a collapse in the price of the safe asset happen together, which looks contradictory until you see that selling Treasuries was how institutions were buying safety. The Fed’s response was not stimulus; it was standing in as the buyer of last resort so the market could clear.',
    },

    {
      id: 'mc-2019-repo-spike',
      type: 'multiple_choice',
      tags: ['repo', 'reserves', 'crisis'],
      xp: 20,
      prompt: 'In September 2019 repo rates spiked to nearly 10% overnight, with no credit event. What had happened?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'default',
          label: 'A large borrower defaulted',
          feedback:
            'Nobody defaulted. The collateral was Treasuries and the borrowers were sound — which is what made the episode so alarming.',
        },
        {
          id: 'reserves-scarce',
          label: 'Reserves had been drained far enough that the system was no longer comfortably supplied',
        },
        {
          id: 'fed-hiked',
          label: 'The Fed had raised rates that morning',
          feedback:
            'No meeting took place. The spike was in the market rate, far above anything the Fed had set.',
        },
        {
          id: 'holiday',
          label: 'A public holiday closed the market',
          feedback:
            'Markets were open. A corporate tax date and a large Treasury settlement coincided, but those are ordinary events — the point is that ordinary events should not do this.',
        },
      ],
      correctOptionId: 'reserves-scarce',
      explanation:
        'Years of QT had removed reserves gradually, and nobody knew where "ample" ended until the system went past it. A tax date and a bond settlement then drained cash on the same morning and there was no cushion. This is the episode Module 3’s QT lesson ends on, and its legacy is the standing repo facility — a permanent offer to lend against Treasuries, so scarcity can never again be discovered this way.',
    },

    {
      id: 'match-liquidity-terms',
      type: 'concept_match',
      tags: ['liquidity', 'markets'],
      xp: 15,
      prompt: 'Match each term to what it describes.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'market-liquidity',
          term: 'Market liquidity',
          definition: 'How easily an asset can be sold without moving its price',
        },
        {
          id: 'funding-liquidity',
          term: 'Funding liquidity',
          definition: 'How easily an institution can obtain cash to meet its obligations',
        },
        {
          id: 'dealer',
          term: 'Dealer balance sheet',
          definition: 'The finite capacity of intermediaries to warehouse assets between buyers and sellers',
        },
        {
          id: 'flight',
          term: 'Flight to quality',
          definition: 'Moving into the safest assets — which can mean selling them for cash',
        },
        {
          id: 'mmlr',
          term: 'Market maker of last resort',
          definition: 'A central bank buying to restore trading, not to loosen policy',
        },
      ],
      explanation:
        'The two liquidities feed each other, which is what makes these episodes spiral. An institution short of funding liquidity sells assets; heavy selling degrades market liquidity; worse market liquidity means everyone needs a bigger cash buffer, so they sell more. Breaking that loop is what a market maker of last resort is for — and the distinction from stimulus matters, because the operations look identical and are doing completely different jobs.',
    },
  ],
});
