/**
 * ============================================================================
 * Module 4 · Lesson 1 — "Dollars that never touch America"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to explain that a dollar deposit at a bank
 * outside the US is a dollar liability created outside the Fed's reach, and
 * that the offshore dollar system has no lender of last resort of its own.
 *
 * Sources / further reading for reviewers:
 *   - BIS, "The dollar's role in global banking" and the international banking
 *     statistics.
 *   - He & McCauley, "Offshore markets for the domestic currency" (BIS WP 320).
 *
 * A note on rigour: "eurodollar" has nothing to do with the euro — the name
 * predates it and refers to dollar deposits in Europe. Learners reliably
 * assume otherwise, so the lesson addresses it directly.
 */

import { defineLesson } from '../../schema';

export const eurodollarSystemLesson = defineLesson({
  id: 'eurodollar-system',
  title: 'Dollars That Never Touch America',
  subtitle: 'Most dollar lending happens outside the US, beyond the reach of the Fed.',
  icon: '🌍',
  difficulty: 'advanced',
  estimatedMinutes: 7,
  hearts: 3,

  keyTakeaways: [
    'A eurodollar is a dollar deposit at a bank outside the United States — the name predates the euro entirely.',
    'Non-US banks create dollar deposits when they lend dollars, exactly as US banks do.',
    'Those banks have no Fed account, so they cannot create the reserves to settle when the dollars are called.',
    'The offshore dollar system is larger than the onshore one and has no natural lender of last resort.',
  ],

  challenges: [
    {
      id: 'mc-eurodollar-name',
      type: 'multiple_choice',
      tags: ['eurodollar', 'global-dollar'],
      xp: 10,
      prompt: 'What is a eurodollar?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'euro-pair',
          label: 'The exchange rate between the euro and the dollar',
          feedback:
            'That is EUR/USD. The eurodollar market is older than the euro by about forty years.',
        },
        {
          id: 'offshore',
          label: 'A dollar deposit held at a bank outside the United States',
        },
        {
          id: 'ecb-dollars',
          label: 'Dollars held by the European Central Bank',
          feedback:
            'The ECB does hold dollar reserves, but that is not what the term means. Any bank outside the US holding dollar deposits is in this market, including in Tokyo and the Cayman Islands.',
        },
        {
          id: 'stablecoin',
          label: 'A digital dollar issued in Europe',
          feedback:
            'The market long predates anything digital. These are ordinary bank deposits, denominated in dollars, booked outside the US.',
        },
      ],
      correctOptionId: 'offshore',
      explanation:
        'The name is a historical accident: it began with dollar deposits in London in the 1950s and stuck, so "eurodollars" in Singapore are still eurodollars. The important part is the location of the *bank*, not the currency’s issuer, because that determines which central bank stands behind it — and for dollars booked outside the US, the answer is none of them automatically.',
    },

    {
      id: 't-offshore-dollar-creation',
      type: 't_account_flow',
      tags: ['eurodollar', 'balance-sheets'],
      xp: 30,
      prompt: 'A London bank lends $50m to a shipping firm. Post it.',
      instructions: 'Pick an entry, then choose whose sheet it lands on and which side',
      scenario:
        'Neither party is American and no US bank is involved. Four entries are needed — three of the seven do not belong.',
      currency: 'USD',
      entities: [
        {
          id: 'london-bank',
          label: 'London Bank',
          tier: 'commercial_bank',
          role: 'No Fed account',
          openingLines: [
            { account: 'Dollar loans', side: 'asset', amount: 8e9 },
            { account: 'Nostro at US correspondent', side: 'asset', amount: 400e6 },
            { account: 'Dollar deposits', side: 'liability', amount: 8.2e9 },
          ],
        },
        {
          id: 'shipping-firm',
          label: 'Shipping Firm',
          tier: 'shadow_bank',
          role: 'Borrowing dollars for a vessel',
          openingLines: [
            { account: 'Vessels', side: 'asset', amount: 300e6 },
            { account: 'Equity', side: 'liability', amount: 120e6 },
          ],
        },
      ],
      options: [
        {
          id: 'bank-loan-up',
          shift: { entityId: 'london-bank', side: 'asset', account: 'Dollar loans', delta: 50e6 },
        },
        {
          id: 'bank-deposits-up',
          shift: { entityId: 'london-bank', side: 'liability', account: 'Dollar deposits', delta: 50e6 },
        },
        {
          id: 'firm-deposit-up',
          shift: { entityId: 'shipping-firm', side: 'asset', account: 'Dollar deposit at London Bank', delta: 50e6 },
        },
        {
          id: 'firm-loan-up',
          shift: { entityId: 'shipping-firm', side: 'liability', account: 'Bank loan', delta: 50e6 },
        },
        {
          id: 'bank-nostro-down',
          shift: { entityId: 'london-bank', side: 'asset', account: 'Nostro at US correspondent', delta: -50e6 },
          feedback:
            'Nothing has been paid to anyone yet. The bank created a deposit; its dollars in New York are untouched until the firm actually spends the loan.',
        },
        {
          id: 'bank-deposits-down',
          shift: { entityId: 'london-bank', side: 'liability', account: 'Dollar deposits', delta: -50e6 },
          feedback: 'Lending creates a deposit. This is the entry for a repayment.',
        },
        {
          id: 'firm-equity-up',
          shift: { entityId: 'shipping-firm', side: 'liability', account: 'Equity', delta: 50e6 },
          feedback:
            'Borrowing does not make the firm richer. It gained an asset and an equal liability; equity is unchanged.',
        },
      ],
      expectedShifts: [
        { entityId: 'london-bank', side: 'asset', account: 'Dollar loans', delta: 50e6 },
        { entityId: 'london-bank', side: 'liability', account: 'Dollar deposits', delta: 50e6 },
        { entityId: 'shipping-firm', side: 'asset', account: 'Dollar deposit at London Bank', delta: 50e6 },
        { entityId: 'shipping-firm', side: 'liability', account: 'Bank loan', delta: 50e6 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M2',
          direction: 'expand',
          note: 'Fifty million dollars of deposits now exist that did not before — created outside the United States.',
        },
        {
          aggregate: 'M0',
          direction: 'unchanged',
          note: 'No reserves were created. The Fed’s balance sheet is exactly as it was, and it was never consulted.',
        },
      ],
      explanation:
        'A bank with no Fed account, in a country with no dollar-issuing authority, just created fifty million dollars. Nothing prevents it: a dollar deposit is a promise to pay dollars, and any bank can make that promise. This is why the offshore dollar system grew larger than the domestic one. The catch appears only when the promise is called — the London bank must find *actual* dollars, and it cannot create them.',
    },

    {
      id: 'order-eurodollar-squeeze',
      type: 'order_flow',
      tags: ['eurodollar', 'crisis'],
      xp: 20,
      prompt: 'Why is offshore dollar lending fragile? Put the sequence in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'lend',
          label: 'Non-US banks make long-term dollar loans',
          detail: 'Funded with short-term dollar borrowing',
        },
        {
          id: 'roll',
          label: 'The funding must be rolled over constantly',
          detail: 'Commercial paper, swaps, deposits from money funds',
        },
        {
          id: 'stress',
          label: 'Stress hits and dollar lenders pull back',
          detail: 'Money funds retreat to Treasuries',
        },
        {
          id: 'scramble',
          label: 'Banks scramble for dollars they cannot create',
          detail: 'They have no Fed account and no other source',
        },
        {
          id: 'firesale',
          label: 'They sell assets and cut dollar lending worldwide',
          detail: 'The squeeze is exported to every borrower they fund',
        },
      ],
      correctOrder: ['lend', 'roll', 'stress', 'scramble', 'firesale'],
      explanation:
        'This is maturity transformation again, with one extra problem: the bank is transforming maturity in a currency it cannot issue and whose central bank it cannot access. A domestic bank in trouble can go to its central bank. A German bank short of dollars in 2008 had nowhere to go — and the assets it dumped were in Brazil and Korea, which is how a US mortgage crisis became a global dollar shortage.',
    },

    {
      id: 'mc-no-lender',
      type: 'multiple_choice',
      tags: ['eurodollar', 'lender-of-last-resort'],
      xp: 20,
      prompt: 'A Japanese bank is short of dollars. Who is its lender of last resort?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'boj',
          label: 'The Bank of Japan',
          feedback:
            'It can create yen without limit and dollars not at all. Its own reserves are finite, exactly like a country defending a peg.',
        },
        {
          id: 'fed-direct',
          label: 'The Federal Reserve, directly',
          feedback:
            'The Fed lends to institutions it supervises and that hold accounts with it. A Japanese bank is neither, and lending abroad directly raises questions Congress would ask.',
        },
        {
          id: 'nobody-structurally',
          label: 'Nobody, structurally — which is the problem the swap lines were invented to solve',
        },
        {
          id: 'imf',
          label: 'The IMF',
          feedback:
            'The IMF lends to governments, on conditions, over months. A dollar squeeze plays out in days and hits banks, not sovereigns.',
        },
      ],
      correctOptionId: 'nobody-structurally',
      explanation:
        'This is the central gap in the global dollar system. Dollar liabilities are created worldwide, but the ability to create dollars sits in one place, and that institution has a domestic mandate. The gap was papered over in 2008 by inventing something new — the Fed lends dollars to the Bank of Japan, which lends them on to its own banks. That is the next lesson, and it is why the Fed became a central bank for the world without ever being given the job.',
    },
  ],
});
