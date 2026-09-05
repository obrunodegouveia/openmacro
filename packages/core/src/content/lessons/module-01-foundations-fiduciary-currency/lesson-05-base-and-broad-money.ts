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
  subtitle: 'Your deposit and a bank’s reserves are both called money. They are not the same thing.',
  icon: '🧱',
  difficulty: 'core',
  estimatedMinutes: 6,
  hearts: 3,

  keyTakeaways: [
    'Base money (M0) is the central bank’s liability: notes, and reserves held by banks.',
    'Broad money (M2) is mostly commercial banks’ liability: the deposits in everyone’s accounts.',
    'Only banks can hold reserves. You cannot, which is why your deposit is a claim on a bank, not on the central bank.',
    'Withdrawing cash swaps one kind of money for another. It does not create or destroy any.',
  ],

  challenges: [
    {
      id: 'match-aggregates',
      type: 'concept_match',
      tags: ['aggregates', 'foundations'],
      xp: 15,
      prompt: 'Match each form of money to whose promise it is.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'notes',
          term: 'Banknotes',
          definition: 'A central bank liability you can hold in your hand',
        },
        {
          id: 'reserves',
          term: 'Reserves',
          definition: 'A central bank liability only banks are allowed to hold',
        },
        {
          id: 'deposits',
          term: 'Deposits',
          definition: 'A commercial bank’s promise to pay you on demand',
        },
        {
          id: 'base',
          term: 'Base money (M0)',
          definition: 'Notes plus reserves — everything the central bank owes',
        },
        {
          id: 'broad',
          term: 'Broad money (M2)',
          definition: 'Cash in circulation plus the deposits households and firms hold',
        },
      ],
      explanation:
        'The dividing line is not size or liquidity, it is *whose promise you are holding*. Notes and reserves are the central bank’s. Deposits are your bank’s. That distinction is invisible in normal times, which is precisely why bank runs surprise people: a deposit was never central bank money, it was a claim on a private firm that promised to convert it on demand.',
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
          label: 'Yes — anyone can, it is a public institution',
          feedback:
            'Central banks are public but they are not retail banks. Their customers are commercial banks, the government, and a handful of financial institutions.',
        },
        {
          id: 'no-banks-only',
          label: 'No — reserve accounts are for banks and a few approved institutions',
        },
        {
          id: 'yes-rich',
          label: 'Only above a certain balance',
          feedback:
            'It is not a wealth threshold. It is a question of what kind of institution you are and what supervision you are subject to.',
        },
        {
          id: 'yes-cash',
          label: 'Yes, indirectly — banknotes are a central bank account',
          feedback:
            'Tempting, and half right: a banknote *is* a central bank liability. But it pays no interest and settles nothing electronically, which is exactly what a reserve account is for.',
        },
      ],
      correctOptionId: 'no-banks-only',
      explanation:
        'This restriction shapes the whole system. Because the public cannot hold central bank money electronically, everyone needs a commercial bank to participate in the payment system — and that is why bank deposits, not reserves, are what most people mean by "money". Central bank digital currency proposals are, at bottom, arguments about whether to lift this restriction.',
    },

    {
      id: 't-cash-withdrawal',
      type: 't_account_flow',
      tags: ['aggregates', 'balance-sheets'],
      xp: 25,
      prompt: 'You withdraw $500 in cash from the ATM. Post what moves.',
      instructions: 'Pick an entry, then choose whose sheet it lands on and which side',
      scenario:
        'Your deposit falls and you walk away with notes. Two entries are needed on the bank’s sheet — three of the five do not belong.',
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
            'The notes were already in circulation as far as the central bank is concerned — they were sitting in the bank’s vault, which it counts as issued. Nothing changes on the central bank’s sheet today.',
        },
        {
          id: 'bank-reserves-down',
          shift: { entityId: 'bank', side: 'asset', account: 'Reserves at the central bank', delta: -500 },
          feedback:
            'Reserves are untouched. The bank handed over notes it already held; it did not settle anything with the central bank.',
        },
        {
          id: 'bank-deposits-up',
          shift: { entityId: 'bank', side: 'liability', account: 'Customer deposits', delta: 500 },
          feedback: 'Your deposit fell — you took the money out. This is the entry for paying cash in.',
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
          note: 'The notes existed before you took them; they simply moved from a vault to your pocket.',
        },
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'Your $500 deposit became $500 of cash. Broad money counts both, so the total is identical.',
        },
      ],
      explanation:
        'Both sides of the bank’s sheet shrink by $500 and nothing else moves. This is the clean case where money changes *form* without changing *quantity* — you swapped a claim on your bank for a claim on the central bank. Compare it with a loan, where a new asset and a new liability appear together and broad money genuinely grows. Withdrawing is a swap; lending is creation.',
    },

    {
      id: 'mc-qe-and-broad-money',
      type: 'multiple_choice',
      tags: ['aggregates', 'qe'],
      xp: 15,
      prompt: 'A central bank creates $1 trillion of reserves through QE. Does the money in your bank account go up?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'yes-directly',
          label: 'Yes — the new money is distributed to accounts',
          feedback:
            'Reserves cannot reach your account. You are not allowed to hold them, and the central bank has no way to credit you directly.',
        },
        {
          id: 'not-directly',
          label: 'Not directly — reserves and deposits are separate, though whoever sold the bonds gets a deposit',
        },
        {
          id: 'no-never',
          label: 'No, QE has no effect on broad money at all',
          feedback:
            'Too strong. When the central bank buys from a non-bank, that seller receives a *deposit* — so broad money does rise, just not by the amount of reserves created.',
        },
        {
          id: 'yes-lending',
          label: 'Yes, because banks must lend out their new reserves',
          feedback:
            'Banks cannot lend reserves to you — reserves only move between reserve-account holders. Lending creates a new deposit, and is constrained by capital and demand, not by reserves on hand.',
        },
      ],
      correctOptionId: 'not-directly',
      explanation:
        'This is the single most misunderstood point in modern monetary policy. QE creates base money, which lives in a system only banks can access. Broad money rises only to the extent the central bank buys from non-banks — a pension fund selling bonds receives a bank deposit, and that deposit is broad money. The trillions in reserves that got the headlines never entered anyone’s account and could not have.',
    },
  ],
});
