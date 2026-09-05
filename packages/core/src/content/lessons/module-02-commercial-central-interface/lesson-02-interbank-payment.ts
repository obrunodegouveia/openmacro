/**
 * ============================================================================
 * Module 2 · Lesson 2 — "What actually moves when you pay someone"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to post a payment between customers of two
 * different banks and identify that deposits move on the customer tier while
 * *reserves* move on the settlement tier — two different liabilities of two
 * different issuers, moving in the same instant.
 *
 * Sources / further reading for reviewers:
 *   - Bank for International Settlements, "Payment, clearing and settlement
 *     systems in the CPSS countries" (Red Book).
 *   - Federal Reserve, "Fedwire Funds Service" service description.
 *
 * A note on rigour: this posts the payment as if it settled gross and
 * instantly. Most retail payments are netted and settle hours or days later —
 * lesson 3 covers that. Teaching the gross case first is deliberate: netting
 * is an optimisation over this, and makes no sense before you have seen what
 * it is optimising.
 */

import { defineLesson } from '../../schema';

export const interbankPaymentLesson = defineLesson({
  id: 'interbank-payment',
  title: 'What Moves When You Pay Someone',
  subtitle: 'Your deposit goes down and theirs goes up — but that is not the payment.',
  icon: '💸',
  difficulty: 'core',
  estimatedMinutes: 7,
  hearts: 3,

  keyTakeaways: [
    'A payment between banks moves two things at once: deposits between customers, and reserves between banks.',
    'Banks cannot pay each other in deposits. They settle in central bank money, which only they can hold.',
    'A payment inside one bank needs no reserves at all — it is a bookkeeping entry.',
    'This is why the central bank sits at the centre of the payment system without touching any customer.',
  ],

  challenges: [
    {
      id: 'mc-same-bank',
      type: 'multiple_choice',
      tags: ['payments', 'settlement'],
      xp: 10,
      prompt: 'You pay a friend €100. You both bank at the same bank. What reaches the central bank?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'reserves-move',
          label: '€100 of reserves moves between accounts',
          feedback:
            'There is only one bank involved, so there is nothing to settle between banks. Its reserve balance does not change.',
        },
        {
          id: 'nothing',
          label: 'Nothing — the bank just moves €100 between two of its own liabilities',
        },
        {
          id: 'notification',
          label: 'A notification, so the central bank can track the money supply',
          feedback:
            'Central banks do not see individual payments. They see banks’ reserve balances, and this payment does not touch one.',
        },
        {
          id: 'fee',
          label: 'A settlement fee',
          feedback:
            'No settlement happened, so there is nothing to charge for. This is the cheapest payment a bank can process.',
        },
      ],
      correctOptionId: 'nothing',
      explanation:
        'Your deposit falls by €100, your friend’s rises by €100, and the bank’s total liabilities are unchanged. No asset moved and no other institution was involved. This is why large banks are cheap to run a payment system inside — and part of why scale is so valuable in retail banking.',
    },

    {
      id: 't-interbank-payment',
      type: 't_account_flow',
      tags: ['payments', 'settlement', 'balance-sheets'],
      xp: 30,
      prompt: 'Now the payer and payee use different banks. Post the €100 payment.',
      instructions: 'Pick an entry, then choose whose sheet it lands on and which side',
      scenario:
        'A customer of Bank A pays €100 to a customer of Bank B. Four entries are needed — three of the seven do not belong. Watch which tier each one lives on.',
      currency: 'EUR',
      entities: [
        {
          id: 'bank-a',
          label: 'Bank A',
          tier: 'commercial_bank',
          role: 'The payer’s bank',
          openingLines: [
            { account: 'Reserves at the central bank', side: 'asset', amount: 500e6 },
            { account: 'Loans to customers', side: 'asset', amount: 4.5e9 },
            { account: 'Customer deposits', side: 'liability', amount: 5e9 },
          ],
        },
        {
          id: 'bank-b',
          label: 'Bank B',
          tier: 'commercial_bank',
          role: 'The payee’s bank',
          openingLines: [
            { account: 'Reserves at the central bank', side: 'asset', amount: 300e6 },
            { account: 'Loans to customers', side: 'asset', amount: 2.7e9 },
            { account: 'Customer deposits', side: 'liability', amount: 3e9 },
          ],
        },
      ],
      options: [
        {
          id: 'a-reserves-down',
          shift: { entityId: 'bank-a', side: 'asset', account: 'Reserves at the central bank', delta: -100 },
        },
        {
          id: 'a-deposits-down',
          shift: { entityId: 'bank-a', side: 'liability', account: 'Customer deposits', delta: -100 },
        },
        {
          id: 'b-reserves-up',
          shift: { entityId: 'bank-b', side: 'asset', account: 'Reserves at the central bank', delta: 100 },
        },
        {
          id: 'b-deposits-up',
          shift: { entityId: 'bank-b', side: 'liability', account: 'Customer deposits', delta: 100 },
        },
        {
          id: 'a-loans-down',
          shift: { entityId: 'bank-a', side: 'asset', account: 'Loans to customers', delta: -100 },
          feedback:
            'Nobody repaid a loan. The payer spent a deposit they already had; the loan book is untouched.',
        },
        {
          id: 'b-deposits-down',
          shift: { entityId: 'bank-b', side: 'liability', account: 'Customer deposits', delta: -100 },
          feedback: 'Bank B’s customer received the money. Its deposits rise, not fall.',
        },
        {
          id: 'a-reserves-up',
          shift: { entityId: 'bank-a', side: 'asset', account: 'Reserves at the central bank', delta: 100 },
          feedback:
            'Bank A is paying. It gives up reserves — this is the entry for receiving a payment, not making one.',
        },
      ],
      expectedShifts: [
        { entityId: 'bank-a', side: 'asset', account: 'Reserves at the central bank', delta: -100 },
        { entityId: 'bank-a', side: 'liability', account: 'Customer deposits', delta: -100 },
        { entityId: 'bank-b', side: 'asset', account: 'Reserves at the central bank', delta: 100 },
        { entityId: 'bank-b', side: 'liability', account: 'Customer deposits', delta: 100 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'unchanged',
          note: 'Reserves moved between two banks. The central bank owes the same total as before.',
        },
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'One deposit shrank and another grew by the same amount. A payment moves money; it does not create it.',
        },
      ],
      explanation:
        'Four entries, two tiers. On the customer tier, deposits move from one bank’s liabilities to another’s. On the settlement tier, reserves move between the banks’ assets — because Bank B will not accept an IOU from Bank A, only central bank money. Both sheets stay balanced because each bank’s assets and liabilities moved together. Notice that neither aggregate changed: this is the clearest possible demonstration that payments and money creation are different events.',
    },

    {
      id: 'match-payment-tiers',
      type: 'concept_match',
      tags: ['payments', 'settlement'],
      xp: 15,
      prompt: 'Match each term to what it describes.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'settlement',
          term: 'Settlement',
          definition: 'The moment a payment becomes final and cannot be reversed',
        },
        {
          id: 'clearing',
          term: 'Clearing',
          definition: 'Working out who owes whom, before any money actually moves',
        },
        {
          id: 'reserves',
          term: 'Reserves',
          definition: 'The asset banks settle with, held only at the central bank',
        },
        {
          id: 'liquidity',
          term: 'Intraday liquidity',
          definition: 'Reserves a bank needs during the day, even if it ends flat',
        },
        {
          id: 'finality',
          term: 'Finality',
          definition: 'The legal property that makes a settled payment irrevocable',
        },
      ],
      explanation:
        'Clearing and settlement are routinely used as synonyms and are not. Clearing is the arithmetic — establishing net obligations. Settlement is the discharge of those obligations in central bank money. The gap between them is where risk lives: everything is agreed but nothing is final, and if a participant fails in that window, the arithmetic has to be unwound.',
    },

    {
      id: 'mc-why-not-deposits',
      type: 'multiple_choice',
      tags: ['settlement', 'reserves'],
      xp: 15,
      prompt: 'Why do banks settle in reserves rather than simply crediting each other deposits?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'law',
          label: 'The law requires it',
          feedback:
            'Regulation shapes the plumbing, but the underlying reason is economic: a deposit at a bank is a claim on that bank, and its value depends on that bank surviving.',
        },
        {
          id: 'credit-risk',
          label: 'A deposit at another bank is credit exposure to it; reserves are not',
        },
        {
          id: 'speed',
          label: 'Reserves move faster',
          feedback:
            'Speed is a property of the system, not of the asset. Correspondent banking settles in deposits and can be quick — it just carries the risk this answer avoids.',
        },
        {
          id: 'audit',
          label: 'It makes the money supply easier to measure',
          feedback:
            'Measurement is a by-product. No bank accepts a payment instrument to help a statistician.',
        },
      ],
      correctOptionId: 'credit-risk',
      explanation:
        'If Bank B accepted a deposit at Bank A as payment, it would be lending to Bank A every time one of its customers got paid — and would lose the money if Bank A failed overnight. Central bank money carries no such risk: the issuer cannot run out of its own liability. That is the whole reason a settlement tier exists, and it is exactly the risk that correspondent banking reintroduces when no shared central bank is available.',
    },
  ],
});
