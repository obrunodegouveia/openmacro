import { defineLesson } from '../../schema';

/**
 * The other side of the trade, posted by hand. A central bank defending its
 * currency buys its own money with foreign reserves — which shrinks both its
 * reserves and its own monetary base, and is why the defence is self-limiting
 * in two separate ways at once.
 */
export const defendingAPegLesson = defineLesson({
  id: 'defending-a-peg',
  title: 'What Defending Actually Costs',
  subtitle:
    'The Bank of England had two weapons. Post them both and you can see why neither could win.',
  icon: '🛡️',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'intervention-posting',
      type: 't_account_flow',
      tags: ['intervention', 'fx', 'pegs'],
      xp: 30,
      prompt: 'The Bank of England buys £1bn to hold the floor. Post it.',
      instructions:
        'Two sheets. Watch what happens to the Bank’s reserves — both kinds.',
      scenario:
        'A fund is selling sterling. To stop the rate falling through DM 2.7780, the Bank of England buys £1bn, paying with D-marks out of its foreign exchange reserves.',
      currency: 'GBP',
      entities: [
        {
          id: 'boe',
          label: 'Bank of England',
          tier: 'central_bank',
          role: 'Committed to the floor',
          openingLines: [
            { account: 'Foreign exchange reserves', side: 'asset', amount: 25000000000 },
            { account: 'Domestic assets', side: 'asset', amount: 15000000000 },
            { account: 'Sterling reserves of banks', side: 'liability', amount: 12000000000 },
            { account: 'Banknotes in circulation', side: 'liability', amount: 28000000000 },
          ],
        },
        {
          id: 'fund',
          label: 'The Selling Fund',
          tier: 'shadow_bank',
          role: 'On the other side of every intervention',
          openingLines: [
            { account: 'Sterling deposits', side: 'asset', amount: 10000000000 },
            { account: 'D-mark deposits', side: 'asset', amount: 2000000000 },
            { account: 'Sterling borrowings', side: 'liability', amount: 10000000000 },
          ],
        },
      ],
      options: [
        {
          id: 'boe-fx-down',
          shift: {
            entityId: 'boe',
            side: 'asset',
            account: 'Foreign exchange reserves',
            delta: -1000000000,
          },
        },
        {
          id: 'boe-reserves-down',
          shift: {
            entityId: 'boe',
            side: 'liability',
            account: 'Sterling reserves of banks',
            delta: -1000000000,
          },
        },
        {
          id: 'fund-sterling-down',
          shift: {
            entityId: 'fund',
            side: 'asset',
            account: 'Sterling deposits',
            delta: -1000000000,
          },
        },
        {
          id: 'fund-dm-up',
          shift: {
            entityId: 'fund',
            side: 'asset',
            account: 'D-mark deposits',
            delta: 1000000000,
          },
        },
        {
          id: 'boe-domestic-up',
          shift: {
            entityId: 'boe',
            side: 'asset',
            account: 'Domestic assets',
            delta: 1000000000,
          },
          feedback:
            'This is the sterilisation entry, and it is the right instinct at the wrong moment. Buying domestic assets would put the sterling back and undo the automatic tightening — which is what central banks usually do, and exactly what removes the defence’s only self-correcting effect.',
        },
        {
          id: 'fund-borrowings-down',
          shift: {
            entityId: 'fund',
            side: 'liability',
            account: 'Sterling borrowings',
            delta: -1000000000,
          },
          feedback:
            'The fund has not repaid anything. It still owes every pound it borrowed — that is the whole position. It has simply swapped the pounds it was holding for D-marks.',
        },
      ],
      expectedShifts: [
        {
          entityId: 'boe',
          side: 'asset',
          account: 'Foreign exchange reserves',
          delta: -1000000000,
        },
        {
          entityId: 'boe',
          side: 'liability',
          account: 'Sterling reserves of banks',
          delta: -1000000000,
        },
        {
          entityId: 'fund',
          side: 'asset',
          account: 'Sterling deposits',
          delta: -1000000000,
        },
        {
          entityId: 'fund',
          side: 'asset',
          account: 'D-mark deposits',
          delta: 1000000000,
        },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'contract',
          note: 'Sterling base money was destroyed. Buying your own currency extinguishes it — the defence tightens policy automatically, in a recession.',
        },
        {
          aggregate: 'collateral',
          direction: 'contract',
          note: 'The reserve stock that makes the promise credible just got £1bn smaller, and everybody can see the number.',
        },
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'The fund still holds a deposit — denominated in D-marks now. Broad sterling money is a separate question.',
        },
      ],
      explanation:
        'Look at what the Bank spent and what it gained. It gave up a finite asset it cannot create — foreign currency — to retire a liability it can create at will. That trade runs one way only, and the number left on the asset side is published. Meanwhile the fund is in exactly the position it wanted: short sterling, long D-marks, and now with the central bank itself as the counterparty that absorbed its selling.',
    },

    {
      id: 'mc-sterilise',
      type: 'multiple_choice',
      tags: ['intervention', 'sterilisation'],
      xp: 20,
      prompt:
        'That intervention destroyed £1bn of sterling base money, which tightens policy. Should the Bank put it back?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'damned-either-way',
          label: 'Either choice loses something: putting it back removes the one force pushing sterling up',
        },
        {
          id: 'yes-recession',
          label: 'Yes — Britain was in recession and could not afford tighter money',
          feedback:
            'That is the pressure the Bank was under, and it is why sterilisation is normal. But it is only half the trade-off: the tightening is the one thing that makes the defence work without spending reserves.',
        },
        {
          id: 'no-never',
          label: 'No — sterilising an intervention is always a mistake',
          feedback:
            'Too absolute. Unsterilised intervention means letting the exchange rate dictate domestic monetary policy, which is a real cost and sometimes the wrong one to pay.',
        },
        {
          id: 'no-effect',
          label: 'It makes no difference either way',
        },
      ],
      correctOptionId: 'damned-either-way',
      explanation:
        'An unsterilised defence works — scarce money raises its own price — but at the cost of tightening into a recession. A sterilised defence spares the economy but reduces the whole exercise to spending reserves, which is a race the authorities lose whenever the speculator can borrow more than they hold. Britain, in a recession with floating-rate mortgages, could not stomach the first, so it was left with the second.',
    },

    {
      id: 'mc-rate-weapon',
      type: 'multiple_choice',
      tags: ['pegs', 'interest-rates', 'defence'],
      xp: 20,
      prompt:
        'On 16 September the base rate went from 10% to 12%, with 15% announced. Why did that not stop the selling?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'not-credible',
          label: 'Because nobody believed it could be sustained — and an unsustainable rate is not a cost',
        },
        {
          id: 'too-small',
          label: 'Because five points was not a big enough increase',
          feedback:
            'Five points is enormous. Sustained for a year it would have destroyed the housing market. Size was never the issue; duration was.',
        },
        {
          id: 'too-late',
          label: 'Because it came too late in the day',
        },
        {
          id: 'no-effect',
          label: 'Because interest rates do not affect exchange rates',
          feedback:
            'They very much do — the carry cost in the previous lesson is exactly that channel. A rate rise makes the short more expensive to hold, which works if the speculator believes it will last.',
        },
      ],
      correctOptionId: 'not-credible',
      explanation:
        'Raising rates works by making the short expensive to carry. But carry only bites over time, and a rate that will obviously be reversed within weeks costs a speculator almost nothing. Everyone could see Britain’s mortgage market and its recession. The announcement of 15% was read not as a threat but as a confession — a government that has to reach for a rate it cannot hold has already told you the end date.',
    },

    {
      id: 'match-defence-limits',
      type: 'concept_match',
      tags: ['pegs', 'defence'],
      xp: 20,
      prompt: 'Match each defensive weapon to the limit that defeats it.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'reserves',
          term: 'Spending reserves',
          definition:
            'They are finite, published, and the attacker can borrow more than you hold',
        },
        {
          id: 'rates',
          term: 'Raising interest rates',
          definition:
            'Only bites if sustained, and the domestic cost tells everyone it will not be',
        },
        {
          id: 'sterilise',
          term: 'Sterilising the intervention',
          definition:
            'Removes the automatic tightening, leaving only the reserve race',
        },
        {
          id: 'borrow',
          term: 'Borrowing more reserves from partners',
          definition:
            'Buys time and enlarges the eventual loss if the peg goes anyway',
        },
      ],
      explanation:
        'Every weapon has a limit that a speculator can see and count. That is the deep asymmetry of peg defence: the authorities must convince the market they will bear an unlimited cost, while the market only has to work out the point at which they will not. One of those is a much harder problem.',
    },
  ],
  keyTakeaways: [
    'Defending a currency means buying it with foreign reserves — spending a finite asset to retire one you can create.',
    'The intervention destroys domestic base money, so an unsterilised defence tightens into whatever the economy is doing.',
    'Sterilising spares the economy and reduces the defence to a reserve race the attacker can win.',
    'A rate rise only works if it is believed to be sustainable; announcing one you cannot hold dates the end.',
  ],
});
