import { defineLesson } from '../../schema';

/**
 * The capstone: read a level against a trend and get a different answer.
 *
 * Weekly total assets (FRED: WALCL): peak $8,965,487m on 13 April 2022;
 * trough $6,535,781m on 3 December 2025; $6,737,204m on 2 September 2026. So
 * the sheet is $2.23tn below its peak and $201bn above its low — both true,
 * and they support opposite headlines.
 */
export const isTighteningOverLesson = defineLesson({
  id: 'is-tightening-over',
  title: 'Read the Trend, Not the Level',
  subtitle:
    'The balance sheet is $2.2tn off its peak and growing again. Both facts are on the same chart.',
  icon: '📈',
  difficulty: 'advanced',
  estimatedMinutes: 9,
  challenges: [
    {
      id: 'mc-still-tightening',
      type: 'multiple_choice',
      tags: ['qt', 'balance-sheet'],
      xp: 15,
      prompt:
        'The Fed’s assets peaked at $8.97tn in April 2022, bottomed at $6.54tn in December 2025, and stood at $6.74tn on 2 September 2026. Is the Fed still tightening?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'yes-below-peak',
          label: 'Yes — the sheet is still $2.2tn below its peak',
          feedback:
            'That is a statement about a level reached four years ago. Policy acts through what is happening now, and what is happening now is $201bn of growth since December.',
        },
        {
          id: 'no-growing',
          label: 'No — it stopped shrinking nine months ago and has been growing since',
        },
        {
          id: 'yes-mbs',
          label: 'Yes, because mortgage-backed securities are still running off',
          feedback:
            'They are — MBS holdings did not move at all in the week to 2 September, and they only fall as loans prepay. But the total is rising anyway, which means something else is being added faster than MBS runs off.',
        },
        {
          id: 'cannot-tell',
          label: 'It is impossible to tell from the balance sheet alone',
          feedback:
            'The direction of the asset side is exactly what "quantitative tightening" names. It is one of the few policy questions the balance sheet answers on its own.',
        },
      ],
      correctOptionId: 'no-growing',
      explanation:
        'This is the most common mistake made with this chart. "Still far below the peak" is a fact about 2022. The trend since December 2025 is growth of roughly $200bn, and a growing balance sheet is not a tightening one, whatever the level says.',
    },

    {
      id: 'cash-order',
      type: 't_account_flow',
      tags: ['currency', 'reserves', 'balance-sheet'],
      xp: 30,
      prompt: 'A bank orders $1bn of banknotes for its branches. Post it.',
      instructions:
        'Two sheets, four entries. Watch which one is a swap and which is a drain.',
      scenario:
        'Currency in circulation reached $2.48tn in September 2026 and rises almost every year. This is what one $1bn slice of that growth looks like on the day it happens.',
      currency: 'USD',
      entities: [
        {
          id: 'fed',
          label: 'Federal Reserve',
          tier: 'central_bank',
          role: 'Issuer of the notes',
          openingLines: [
            { account: 'Securities held outright', side: 'asset', amount: 6468278000000 },
            { account: 'Federal Reserve notes', side: 'liability', amount: 2430305000000 },
            { account: 'Reserve balances', side: 'liability', amount: 2929285000000 },
          ],
        },
        {
          id: 'bank',
          label: 'The Ordering Bank',
          tier: 'commercial_bank',
          role: 'Needs cash in its branch tills',
          openingLines: [
            { account: 'Reserve deposits at the Fed', side: 'asset', amount: 40000000000 },
            { account: 'Vault cash', side: 'asset', amount: 2000000000 },
            { account: 'Customer deposits', side: 'liability', amount: 500000000000 },
          ],
        },
      ],
      options: [
        {
          id: 'fed-notes-up',
          shift: {
            entityId: 'fed',
            side: 'liability',
            account: 'Federal Reserve notes',
            delta: 1000000000,
          },
        },
        {
          id: 'fed-reserves-down',
          shift: {
            entityId: 'fed',
            side: 'liability',
            account: 'Reserve balances',
            delta: -1000000000,
          },
        },
        {
          id: 'bank-vault-up',
          shift: {
            entityId: 'bank',
            side: 'asset',
            account: 'Vault cash',
            delta: 1000000000,
          },
        },
        {
          id: 'bank-reserves-down',
          shift: {
            entityId: 'bank',
            side: 'asset',
            account: 'Reserve deposits at the Fed',
            delta: -1000000000,
          },
        },
        {
          id: 'bank-deposits-down',
          shift: {
            entityId: 'bank',
            side: 'liability',
            account: 'Customer deposits',
            delta: -1000000000,
          },
          feedback:
            'Nobody has withdrawn anything yet. The bank moved its own asset from one form to another — the cash is sitting in its tills waiting for customers who may never come.',
        },
        {
          id: 'fed-buys',
          shift: {
            entityId: 'fed',
            side: 'asset',
            account: 'Securities held outright',
            delta: 1000000000,
          },
          feedback:
            'Not automatically — and that is the whole question this lesson is about. Printing notes does not buy anything. If the Fed wants reserves back where they were, it has to go out and buy an asset as a separate decision.',
        },
      ],
      expectedShifts: [
        {
          entityId: 'fed',
          side: 'liability',
          account: 'Federal Reserve notes',
          delta: 1000000000,
        },
        {
          entityId: 'fed',
          side: 'liability',
          account: 'Reserve balances',
          delta: -1000000000,
        },
        {
          entityId: 'bank',
          side: 'asset',
          account: 'Vault cash',
          delta: 1000000000,
        },
        {
          entityId: 'bank',
          side: 'asset',
          account: 'Reserve deposits at the Fed',
          delta: -1000000000,
        },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'unchanged',
          note: 'Base money is notes plus reserves. One rose, one fell, by the same $1bn.',
        },
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'No customer has been paid and no deposit has moved. Broad money has not noticed.',
        },
        {
          aggregate: 'collateral',
          direction: 'unchanged',
          note: 'Nothing was pledged, bought or sold. This is a swap of one Fed liability for another.',
        },
      ],
      explanation:
        'The Fed’s total assets did not change and neither did base money — but reserves fell $1bn, and they are not coming back on their own. Currency is a one-way ratchet: it grows with the economy and it is never returned in bulk. So a Fed that wants to keep reserves stable has to buy assets forever, just to stand still.',
    },

    {
      id: 'flow-why-growing',
      type: 'order_flow',
      tags: ['balance-sheet', 'reserves', 'policy'],
      xp: 20,
      prompt:
        'Put the reasoning in order: why a central bank balance sheet grows even when policy is not easing.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'demand',
          label: 'The public and the banks want more cash each year',
          detail: 'Currency in circulation almost never falls',
        },
        {
          id: 'drain',
          label: 'Every note issued drains a reserve balance',
          detail: 'One Fed liability grows at another’s expense',
        },
        {
          id: 'scarce',
          label: 'Left alone, reserves grind down toward scarcity',
          detail: 'Nothing replaces them; the asset side is not moving',
        },
        {
          id: 'buy',
          label: 'The Fed buys assets to hold reserves steady',
          detail: 'Reserve management purchases, not stimulus',
        },
        {
          id: 'grow',
          label: 'Total assets rise, with no change in the policy stance',
          detail: 'The sheet grows to stand still',
        },
      ],
      correctOrder: ['demand', 'drain', 'scarce', 'buy', 'grow'],
      explanation:
        'A growing balance sheet is the normal state of a central bank in a growing economy — the Fed’s grew almost every year from 1914 to 2008 without anyone calling it stimulus. What made 2020 different was the size and the speed, not the direction.',
    },

    {
      id: 'mc-diagnose',
      type: 'multiple_choice',
      tags: ['h41', 'diagnosis'],
      xp: 20,
      prompt:
        'You open next Thursday’s H.4.1 and see: total assets up $9bn, reserves down $40bn, Treasury account up $48bn. What happened?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'qt-resumed',
          label: 'Quantitative tightening resumed',
          feedback:
            'Assets went up, not down. Whatever drained reserves, it was not the Fed shrinking its portfolio.',
        },
        {
          id: 'treasury-collected',
          label: 'The Treasury collected more than it spent, and the cash left the banking system',
        },
        {
          id: 'bank-run',
          label: 'Depositors pulled money out of banks',
          feedback:
            'A run moves deposits between banks, or into cash. It would show up as currency rising — and currency is not in these numbers.',
        },
        {
          id: 'foreign',
          label: 'Foreign central banks pulled dollars out of the Fed',
          feedback:
            'That would show as the reverse repo line falling, and it would *add* to reserves rather than subtract from them.',
        },
      ],
      correctOptionId: 'treasury-collected',
      explanation:
        'Read the liability side as one board: reserves −$40bn against the Treasury account +$48bn is a transfer, not a loss, and the extra $9bn of assets is the Fed adding a little. That is the whole skill this module teaches — the lines move against each other, and the story is in which ones.',
    },
  ],
  keyTakeaways: [
    'A level and a trend can point opposite ways. The sheet is $2.2tn below its 2022 peak and $201bn above its December 2025 low.',
    'Currency growth quietly drains reserves every year, and the drain is permanent.',
    'A central bank must buy assets just to hold reserves still — growth is not automatically stimulus.',
    'Read the liability lines against each other: a fall in one is usually a rise in its neighbour.',
  ],
});
