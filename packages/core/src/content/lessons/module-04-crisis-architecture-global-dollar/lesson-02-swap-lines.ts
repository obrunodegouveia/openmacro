/**
 * ============================================================================
 * Module 4 · Lesson 2 — "The Fed lends to other central banks"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to post a central bank swap and explain why the
 * structure — Fed to central bank, central bank to its own banks — leaves the
 * Fed with no foreign credit risk.
 *
 * Sources / further reading for reviewers:
 *   - Federal Reserve, "Central Bank Liquidity Swaps" explainer and the
 *     standing arrangements with five central banks.
 *   - Bahaj & Reis, "Central Bank Swap Lines: Evidence and Policy" (2022).
 *
 * A note on rigour: the swap is collateralised by foreign currency at a fixed
 * repurchase rate, so the Fed carries no exchange rate risk either. Learners
 * often assume this is aid; it is a secured, priced transaction, and framing
 * it correctly is what makes the politics comprehensible.
 */

import { defineLesson } from '../../schema';

export const swapLinesLesson = defineLesson({
  id: 'swap-lines',
  title: 'The Fed Lends to Other Central Banks',
  subtitle: 'How dollars reach a bank in Tokyo without the Fed taking any Japanese risk.',
  icon: '🤝',
  difficulty: 'advanced',
  estimatedMinutes: 8,
  hearts: 3,

  keyTakeaways: [
    'A swap line lends dollars to a foreign central bank against its own currency, at a fixed repurchase rate.',
    'That central bank lends the dollars to its own banks and carries the credit risk itself.',
    'The Fed’s exposure is to another central bank, fully collateralised, with the exchange rate fixed at the outset.',
    'It made the Fed the world’s dollar lender of last resort without any formal decision that it should be.',
  ],

  challenges: [
    {
      id: 't-swap-line',
      type: 't_account_flow',
      tags: ['swap-lines', 'balance-sheets'],
      xp: 30,
      prompt: 'The Fed swaps $30bn to the Bank of Japan. Post the first leg.',
      instructions: 'Pick an entry, then choose whose sheet it lands on and which side',
      scenario:
        'The Fed credits $30bn to the Bank of Japan and receives yen in return, at an exchange rate fixed now for the reversal. Four entries are needed — three of the seven do not belong.',
      currency: 'USD',
      entities: [
        {
          id: 'fed',
          label: 'Federal Reserve',
          tier: 'central_bank',
          role: 'Can create dollars',
          openingLines: [
            { account: 'Securities held outright', side: 'asset', amount: 7e12 },
            { account: 'Bank reserves', side: 'liability', amount: 3e12 },
          ],
        },
        {
          id: 'boj',
          label: 'Bank of Japan',
          tier: 'central_bank',
          role: 'Cannot create dollars',
          openingLines: [
            { account: 'Japanese government bonds', side: 'asset', amount: 500e12 },
            { account: 'Yen reserves owed to banks', side: 'liability', amount: 400e12 },
          ],
        },
      ],
      options: [
        {
          id: 'fed-yen-up',
          shift: { entityId: 'fed', side: 'asset', account: 'Yen received under swap', delta: 30e9 },
        },
        {
          id: 'fed-boj-deposit-up',
          shift: { entityId: 'fed', side: 'liability', account: 'Dollar deposit owed to Bank of Japan', delta: 30e9 },
        },
        {
          id: 'boj-dollars-up',
          shift: { entityId: 'boj', side: 'asset', account: 'Dollar deposit at the Fed', delta: 30e9 },
        },
        {
          id: 'boj-swap-liability-up',
          shift: { entityId: 'boj', side: 'liability', account: 'Yen owed to the Fed under swap', delta: 30e9 },
        },
        {
          id: 'fed-securities-down',
          shift: { entityId: 'fed', side: 'asset', account: 'Securities held outright', delta: -30e9 },
          feedback:
            'The Fed did not sell anything. It created the dollars, exactly as it does for any other operation — its balance sheet grows rather than rotating.',
        },
        {
          id: 'boj-jgb-down',
          shift: { entityId: 'boj', side: 'asset', account: 'Japanese government bonds', delta: -30e9 },
          feedback:
            'The collateral is yen, not JGBs. The Bank of Japan created the yen leg, just as the Fed created the dollar leg.',
        },
        {
          id: 'fed-reserves-down',
          shift: { entityId: 'fed', side: 'liability', account: 'Bank reserves', delta: -30e9 },
          feedback:
            'No US bank lost reserves. The dollars are new, and appear as a fresh liability to the Bank of Japan.',
        },
      ],
      expectedShifts: [
        { entityId: 'fed', side: 'asset', account: 'Yen received under swap', delta: 30e9 },
        { entityId: 'fed', side: 'liability', account: 'Dollar deposit owed to Bank of Japan', delta: 30e9 },
        { entityId: 'boj', side: 'asset', account: 'Dollar deposit at the Fed', delta: 30e9 },
        { entityId: 'boj', side: 'liability', account: 'Yen owed to the Fed under swap', delta: 30e9 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'expand',
          note: 'The Fed created $30bn that did not exist. Both central bank balance sheets grew on both sides.',
        },
        {
          aggregate: 'collateral',
          direction: 'expand',
          note: 'Dollar funding is available where it was not, which is the entire purpose — the squeeze eases without anyone selling assets.',
        },
      ],
      explanation:
        'Both central banks expand their balance sheets and each holds a claim on the other. The Fed’s asset is yen at a rate fixed today for the reversal, so it has no exchange rate exposure. And the Bank of Japan — not the Fed — decides which Japanese banks receive the dollars and bears the loss if one fails. That structure is what made the arrangement politically survivable: the Fed can say truthfully that it has taken no foreign credit risk.',
    },

    {
      id: 'mc-why-not-direct',
      type: 'multiple_choice',
      tags: ['swap-lines', 'design'],
      xp: 20,
      prompt: 'Why lend to the Bank of Japan rather than directly to the Japanese banks that need the dollars?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'risk-and-mandate',
          label: 'The Fed would have to assess foreign banks it does not supervise, and take losses on them',
        },
        {
          id: 'faster',
          label: 'It is faster',
          feedback:
            'Direct lending would be faster if anything. The indirect route exists for reasons of risk and authority, not speed.',
        },
        {
          id: 'illegal-abroad',
          label: 'The Fed cannot transact with any foreign entity',
          feedback:
            'It transacts with foreign central banks constantly, including in this very operation.',
        },
        {
          id: 'exchange-rate',
          label: 'To avoid moving the exchange rate',
          feedback:
            'The swap is designed to be exchange-rate neutral by fixing the reversal rate, but that is a feature of the structure rather than the reason for routing through a central bank.',
        },
      ],
      correctOptionId: 'risk-and-mandate',
      explanation:
        'Two problems solved at once. The Fed does not supervise Japanese banks and has no basis to judge which are solvent — but the Bank of Japan does. And lending to foreign banks with public money would raise a question no US central banker wants asked. Routing through the foreign central bank puts the credit decision with the institution that has the information and the mandate, while the Fed lends only to a counterparty that cannot fail in yen.',
    },

    {
      id: 'match-crisis-facilities',
      type: 'concept_match',
      tags: ['swap-lines', 'facilities'],
      xp: 15,
      prompt: 'Match each arrangement to what it does.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'swap',
          term: 'Central bank swap line',
          definition: 'Dollars lent to a foreign central bank against its own currency',
        },
        {
          id: 'fima',
          term: 'FIMA repo facility',
          definition: 'Lets foreign central banks borrow dollars against Treasuries they already hold',
        },
        {
          id: 'standing',
          term: 'Standing arrangement',
          definition: 'A permanent line with five central banks, no negotiation needed',
        },
        {
          id: 'temporary',
          term: 'Temporary line',
          definition: 'Opened case by case in a crisis, and closed afterwards',
        },
        {
          id: 'stigma-free',
          term: 'Pre-emptive drawing',
          definition: 'Using a facility before you need it, so that using it says nothing',
        },
      ],
      explanation:
        'The FIMA facility, added in 2020, closed a different gap: a country with plenty of Treasuries but no swap line previously had to *sell* them to raise dollars, which pushed Treasury yields up in the middle of a panic. Letting it borrow against them instead removed a mechanism that turned foreign dollar shortages into US bond market stress.',
    },

    {
      id: 'mc-who-gets-a-line',
      type: 'multiple_choice',
      tags: ['swap-lines', 'geopolitics'],
      xp: 15,
      prompt: 'Five central banks have permanent swap lines with the Fed. What does that imply for everyone else?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'no-difference',
          label: 'Nothing — others can request one when needed',
          feedback:
            'They can request, and may be refused, and will not know until they ask. Uncertainty in a crisis is itself the cost.',
        },
        {
          id: 'tiering',
          label: 'A tiered system — some countries have assured dollar access and others must self-insure',
        },
        {
          id: 'unfair',
          label: 'The Fed is required to treat all countries equally',
          feedback:
            'It has a domestic mandate and no obligation to lend abroad at all. Equal treatment was never the standard.',
        },
        {
          id: 'imf',
          label: 'The IMF fills the gap entirely',
          feedback:
            'IMF lending is slower, conditional and aimed at governments. It is not a substitute for overnight dollar funding for banks.',
        },
      ],
      correctOptionId: 'tiering',
      explanation:
        'Countries outside the circle self-insure instead, accumulating foreign reserves — which is expensive, since it means holding low-yielding Treasuries rather than investing domestically. That accumulation is one driver of the global demand for US government debt, and it is a direct consequence of who does and does not have assured access to dollars in a crisis. The hierarchy is not written down anywhere, and it is one of the most consequential facts about the international monetary system.',
    },
  ],
});
