/**
 * ============================================================================
 * Module 1 · Lesson 5 — "Two kinds of money, and who is allowed to hold them"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to say which instruments count as M0, M1 and M2,
 * explain that reserves and deposits are different liabilities of different
 * issuers, and post a cash withdrawal without changing broad money.
 *
 * Sources / further reading for reviewers:
 *   - Federal Reserve H.6 release, "Money Stock Measures" — definitions.
 *   - ECB, "Monetary aggregates" (M1/M2/M3 differ from the US definitions).
 *
 * A note on rigour: aggregate definitions are national and shift over time —
 * the Fed folded savings deposits into M1 in 2020, which moved trillions
 * between lines without moving a cent of money. The lesson teaches the
 * *distinction that matters* (whose liability is it) rather than asking anyone
 * to memorise a boundary that regulators redraw.
 */

import { defineLesson } from '../../schema';

export const baseAndBroadMoneyLesson = defineLesson({
  id: 'base-and-broad-money',
  title: 'Base Money and Broad Money',
  subtitle: 'Your deposit and a bank’s reserves are both called money. But they are not the same thing.',
  icon: '🧱',
  difficulty: 'core',
  estimatedMinutes: 6,
  hearts: 3,

  keyTakeaways: [
    'Base money (M0) is what the central bank owes: notes, plus the reserves banks hold with it.',
    'Broad money (M2) is mostly what commercial banks owe: the deposits in everyone’s accounts.',
    'Only banks can hold reserves. You cannot. That is why your deposit is a claim on a bank, not on the central bank.',
    'Taking out cash swaps one kind of money for another. It does not create or destroy any money.',
  ],

  challenges: [
    {
      id: 'match-aggregates',
      type: 'concept_match',
      tags: ['aggregates', 'foundations'],
      xp: 15,
      prompt: 'Match each kind of money to whose promise it is.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'notes',
          term: 'Banknotes',
          definition: 'Owed by the central bank, and you can hold it in your hand',
        },
        {
          id: 'reserves',
          term: 'Reserves',
          definition: 'Owed by the central bank, and only banks are allowed to hold it',
        },
        {
          id: 'deposits',
          term: 'Deposits',
          definition: 'A commercial bank’s promise to pay you whenever you ask',
        },
        {
          id: 'base',
          term: 'Base money (M0)',
          definition: 'Notes plus reserves: everything the central bank owes',
        },
        {
          id: 'broad',
          term: 'Broad money (M2)',
          definition: 'Cash in use plus the deposits of families and companies',
        },
      ],
      explanation:
        'What separates them is not size or how easy they are to spend. It is whose promise you hold. Notes and reserves are the central bank’s promises. Deposits are your bank’s. In normal times you cannot see this difference. That is why bank runs surprise people: a deposit was never central bank money. It was a promise from a private company to pay you on demand.',
    },

    {
      id: 'mc-who-holds-reserves',
      type: 'multiple_choice',
      tags: ['reserves', 'foundations'],
      xp: 10,
      prompt: 'Can you open an account at the central bank and hold reserves yourself?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'yes-anyone',
          label: 'Yes, anyone can, because it is a public institution',
          feedback:
            'Central banks are public, but they are not banks for the public. Their customers are commercial banks, the government and a few financial institutions.',
        },
        {
          id: 'no-banks-only',
          label: 'No, reserve accounts are only for banks and a few approved institutions',
        },
        {
          id: 'yes-rich',
          label: 'Only above a certain balance',
          feedback:
            'It is not about how much money you have. It is about what kind of institution you are and who supervises you.',
        },
        {
          id: 'yes-cash',
          label: 'Yes, in a way, because banknotes are like a central bank account',
          feedback:
            'Half right: a banknote is something the central bank owes. But it pays no interest and cannot be used for electronic payments. A reserve account does both.',
        },
      ],
      correctOptionId: 'no-banks-only',
      explanation:
        'This rule shapes the whole system. The public cannot hold central bank money electronically, so everyone needs a commercial bank to make payments. That is why bank deposits, not reserves, are what most people mean by “money”. Plans for a central bank digital currency are really about whether to change this rule.',
    },

    {
      id: 't-cash-withdrawal',
      type: 't_account_flow',
      tags: ['aggregates', 'balance-sheets'],
      xp: 25,
      prompt: 'You take $500 in cash out of the ATM. Post what changes.',
      instructions: 'Pick an entry, then choose whose list it goes on and which side',
      scenario:
        'Your deposit goes down and you leave with notes. Two entries are needed on the bank’s list. Three of the five are wrong.',
      currency: 'USD',
      entities: [
        {
          id: 'bank',
          label: 'Your Bank',
          tier: 'commercial_bank',
          role: 'Holds your deposit',
          openingLines: [
            { account: 'Vault cash', side: 'asset', amount: 20e6 },
            { account: 'Reserves at the central bank', side: 'asset', amount: 300e6 },
            { account: 'Customer deposits', side: 'liability', amount: 1.2e9 },
            { account: 'Loans and other assets', side: 'asset', amount: 880_000_000 },
          ],
        },
        {
          id: 'central-bank',
          label: 'Central Bank',
          tier: 'central_bank',
          role: 'Issuer of the notes',
          openingLines: [
            { account: 'Government bonds', side: 'asset', amount: 5e12 },
            { account: 'Banknotes in circulation', side: 'liability', amount: 2e12 },
            { account: 'Commercial bank reserves', side: 'liability', amount: 3e12 },
          ],
        },
      ],
      options: [
        {
          id: 'bank-vault-down',
          shift: { entityId: 'bank', side: 'asset', account: 'Vault cash', delta: -500 },
        },
        {
          id: 'bank-deposits-down',
          shift: { entityId: 'bank', side: 'liability', account: 'Customer deposits', delta: -500 },
        },
        {
          id: 'cb-notes-up',
          shift: { entityId: 'central-bank', side: 'liability', account: 'Banknotes in circulation', delta: 500 },
          feedback:
            'For the central bank, these notes were already out: they were in your bank’s vault, which it counts as issued. Nothing changes on the central bank’s list today.',
        },
        {
          id: 'bank-reserves-down',
          shift: { entityId: 'bank', side: 'asset', account: 'Reserves at the central bank', delta: -500 },
          feedback:
            'Reserves do not change. The bank handed you notes it already had. It did not pay anything to the central bank.',
        },
        {
          id: 'bank-deposits-up',
          shift: { entityId: 'bank', side: 'liability', account: 'Customer deposits', delta: 500 },
          feedback: 'Your deposit went down, because you took money out. This entry is for paying cash in.',
        },
      ],
      expectedShifts: [
        { entityId: 'bank', side: 'asset', account: 'Vault cash', delta: -500 },
        { entityId: 'bank', side: 'liability', account: 'Customer deposits', delta: -500 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'unchanged',
          note: 'The notes already existed. They just moved from a vault to your pocket.',
        },
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'Your $500 deposit became $500 in cash. Broad money counts both, so the total is the same.',
        },
      ],
      explanation:
        'Both sides of the bank’s list shrink by $500, and nothing else moves. Money changed its form, not its amount. You swapped a promise from your bank for a promise from the central bank. Compare this with a loan: a new asset and a new liability appear together, and broad money really grows. Taking out cash is a swap. Lending creates money.',
    },

    {
      id: 'mc-qe-and-broad-money',
      type: 'multiple_choice',
      tags: ['aggregates', 'qe'],
      xp: 15,
      prompt: 'A central bank creates $1 trillion of reserves through QE (buying bonds with new money). Does the money in your bank account go up?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'yes-directly',
          label: 'Yes, because the new money is shared out to accounts',
          feedback:
            'Reserves cannot reach your account. You are not allowed to hold them, and the central bank has no way to pay you directly.',
        },
        {
          id: 'not-directly',
          label: 'Not directly: reserves and deposits are separate, but whoever sold the bonds gets a deposit',
        },
        {
          id: 'no-never',
          label: 'No, QE has no effect on broad money at all',
          feedback:
            'Too strong. When the central bank buys from someone who is not a bank, that seller gets a deposit. So broad money does rise, just not by the full amount of reserves created.',
        },
        {
          id: 'yes-lending',
          label: 'Yes, because banks must lend out their new reserves',
          feedback:
            'Banks cannot lend reserves to you, because reserves only move between banks. A loan creates a new deposit. What limits lending is capital and demand, not the reserves a bank holds.',
        },
      ],
      correctOptionId: 'not-directly',
      explanation:
        'This is one of the most misunderstood points in monetary policy. QE creates base money, which only banks can hold. Broad money rises only when the central bank buys from someone who is not a bank. For example, a pension fund that sells bonds gets a bank deposit, and that deposit is broad money. The trillions of reserves in the news never reached anyone’s account, and they could not have.',
    },
  ],
});
