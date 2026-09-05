/**
 * ============================================================================
 * Module 3 · Lesson 5 — "Repo: the loan that looks like a sale"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to post a repo, explain why it is legally a sale
 * and economically a secured loan, and say what a haircut is protecting
 * against.
 *
 * Sources / further reading for reviewers:
 *   - NY Fed, "Repo and Reverse Repo Operations" service description.
 *   - Gorton & Metrick, "Securitized Banking and the Run on Repo" (2012).
 *
 * A note on rigour: the sale-versus-loan distinction is not pedantry — it is
 * why repo escapes the automatic stay in bankruptcy, and therefore why a run
 * on repo behaves differently from a run on deposits. The lesson says so.
 */

import { defineLesson } from '../../schema';

export const openMarketOperationsLesson = defineLesson({
  id: 'open-market-operations',
  title: 'Repo: The Loan That Looks Like a Sale',
  subtitle: 'How central banks add and drain reserves without buying anything permanently.',
  icon: '🔁',
  difficulty: 'advanced',
  estimatedMinutes: 8,
  hearts: 3,

  keyTakeaways: [
    'A repo is a sale with an agreement to buy back tomorrow — economically a loan secured by the security sold.',
    'The central bank adds reserves with a repo and drains them with a reverse repo.',
    'The haircut is the lender’s protection: it lends less than the collateral is worth.',
    'Because it is legally a sale, a repo lender can seize and sell collateral immediately if the borrower fails.',
  ],

  challenges: [
    {
      id: 'mc-repo-is-a-loan',
      type: 'multiple_choice',
      tags: ['repo', 'money-markets'],
      xp: 15,
      prompt: 'A dealer sells €100m of bonds today and agrees to buy them back tomorrow for €100.01m. What is this?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'trade',
          label: 'Two separate trades that happen to involve the same bonds',
          feedback:
            'They are agreed together as one contract, at prices fixed at the outset. Neither side is taking a view on the bond’s price.',
        },
        {
          id: 'loan',
          label: 'An overnight loan of €100m secured by the bonds, at an implied interest rate',
        },
        {
          id: 'hedge',
          label: 'A hedge against the bond falling in value',
          feedback:
            'The seller keeps the economic exposure — they have agreed to buy the bonds back at a fixed price regardless of what happens to the market.',
        },
        {
          id: 'sale',
          label: 'A sale, since ownership legally transfers',
          feedback:
            'Legally true and economically misleading. Ownership does transfer, which matters enormously in a default — but the seller keeps the risk and return, so it functions as a loan.',
        },
      ],
      correctOptionId: 'loan',
      explanation:
        'The €10,000 difference between the two prices is interest: about 3.65% annualised on €100m overnight. The bonds are collateral. This is the largest short-term funding market in the world, and the reason it is structured as a sale rather than a pledge is what happens if the borrower fails — the lender already owns the collateral and can sell it immediately, rather than queueing with other creditors.',
    },

    {
      id: 't-central-bank-repo',
      type: 't_account_flow',
      tags: ['repo', 'open-market-operations', 'balance-sheets'],
      xp: 30,
      prompt: 'The central bank injects €5bn of reserves through a repo. Post it.',
      instructions: 'Pick an entry, then choose whose sheet it lands on and which side',
      scenario:
        'The central bank buys €5bn of government bonds from a bank under an agreement to sell them back next week. Four entries are needed — three of the seven do not belong.',
      currency: 'EUR',
      entities: [
        {
          id: 'central-bank',
          label: 'Central Bank',
          tier: 'central_bank',
          role: 'Supplying reserves temporarily',
          openingLines: [
            { account: 'Securities held outright', side: 'asset', amount: 4e12 },
            { account: 'Repo lending', side: 'asset', amount: 100e9 },
            { account: 'Commercial bank reserves', side: 'liability', amount: 3.5e12 },
          ],
        },
        {
          id: 'bank',
          label: 'Commercial Bank',
          tier: 'commercial_bank',
          role: 'Needs reserves this week',
          openingLines: [
            { account: 'Government bonds', side: 'asset', amount: 80e9 },
            { account: 'Reserves at the central bank', side: 'asset', amount: 20e9 },
            { account: 'Customer deposits', side: 'liability', amount: 95e9 },
          ],
        },
      ],
      options: [
        {
          id: 'cb-repo-up',
          shift: { entityId: 'central-bank', side: 'asset', account: 'Repo lending', delta: 5e9 },
        },
        {
          id: 'cb-reserves-up',
          shift: { entityId: 'central-bank', side: 'liability', account: 'Commercial bank reserves', delta: 5e9 },
        },
        {
          id: 'bank-reserves-up',
          shift: { entityId: 'bank', side: 'asset', account: 'Reserves at the central bank', delta: 5e9 },
        },
        {
          id: 'bank-bonds-down',
          shift: { entityId: 'bank', side: 'asset', account: 'Government bonds', delta: -5e9 },
        },
        {
          id: 'cb-outright-up',
          shift: { entityId: 'central-bank', side: 'asset', account: 'Securities held outright', delta: 5e9 },
          feedback:
            'This is a repo, not an outright purchase. The bonds come back next week, so they sit in the repo book rather than the permanent portfolio — the distinction between temporary and permanent operations.',
        },
        {
          id: 'bank-deposits-up',
          shift: { entityId: 'bank', side: 'liability', account: 'Customer deposits', delta: 5e9 },
          feedback:
            'No customer received anything. The bank swapped one asset for another; its depositors are not part of this transaction.',
        },
        {
          id: 'cb-reserves-down',
          shift: { entityId: 'central-bank', side: 'liability', account: 'Commercial bank reserves', delta: -5e9 },
          feedback:
            'Reserves are being *added*. This is the entry for a reverse repo, which drains them.',
        },
      ],
      expectedShifts: [
        { entityId: 'central-bank', side: 'asset', account: 'Repo lending', delta: 5e9 },
        { entityId: 'central-bank', side: 'liability', account: 'Commercial bank reserves', delta: 5e9 },
        { entityId: 'bank', side: 'asset', account: 'Reserves at the central bank', delta: 5e9 },
        { entityId: 'bank', side: 'asset', account: 'Government bonds', delta: -5e9 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'expand',
          note: 'The central bank’s balance sheet grew by €5bn of new reserves, created to make the loan.',
        },
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'No customer deposit was created. Reserves are a tier the public cannot hold, so broad money is untouched.',
        },
      ],
      explanation:
        'The central bank’s sheet expands on both sides; the commercial bank’s merely changes composition — bonds out, reserves in, total unchanged. And it reverses next week automatically. That self-unwinding property is what makes repo the instrument of choice for managing temporary reserve needs: quarter-end, tax dates, holidays. Compare it with QE, which is an outright purchase with no agreed reversal — that is why QE required a separate decision, years later, to undo.',
    },

    {
      id: 'mc-haircut',
      type: 'multiple_choice',
      tags: ['repo', 'collateral'],
      xp: 15,
      prompt: 'A lender takes €100m of bonds as collateral but lends only €98m. Why?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'fee',
          label: 'The €2m is a fee',
          feedback:
            'The fee is the interest, charged separately in the repurchase price. The €2m stays as protection, not payment.',
        },
        {
          id: 'haircut',
          label: 'A haircut — margin against the bonds falling before they could be sold',
        },
        {
          id: 'tax',
          label: 'A regulatory tax on collateral',
          feedback:
            'No such tax exists. Haircuts are set commercially, though regulators do set minimums for some transactions.',
        },
        {
          id: 'liquidity',
          label: 'Because the bonds cannot be sold quickly',
          feedback:
            'Government bonds are among the most liquid assets there are. The concern is price movement in the interval, not the ability to trade.',
        },
      ],
      correctOptionId: 'haircut',
      explanation:
        'If the borrower fails, the lender is left holding bonds that must be sold — possibly into a falling market, on the day the borrower failed, which is rarely a calm day. The haircut absorbs that. Haircuts are also procyclical and that is a systemic problem: they widen exactly when funding is scarcest, forcing borrowers to find more collateral at the worst moment. A run on repo is usually a run of rising haircuts rather than an outright refusal to lend.',
    },

    {
      id: 'mc-reverse-repo-direction',
      type: 'multiple_choice',
      tags: ['repo', 'policy'],
      xp: 15,
      prompt: 'A central bank wants to drain reserves temporarily. Which operation?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'repo',
          label: 'Repo — lend against collateral',
          feedback:
            'That adds reserves. It is the operation for the opposite problem.',
        },
        {
          id: 'reverse',
          label: 'Reverse repo — take cash in and give collateral out',
        },
        {
          id: 'qe',
          label: 'Buy bonds outright',
          feedback:
            'Outright purchases add reserves permanently. Selling would drain them, but not temporarily.',
        },
        {
          id: 'raise-iorb',
          label: 'Raise the rate on reserves',
          feedback:
            'That changes the price of reserves, not the quantity. Banks cannot collectively reduce reserves by wanting to — only the central bank can remove them.',
        },
      ],
      correctOptionId: 'reverse',
      explanation:
        'The names are from the central bank’s point of view, which is a constant source of confusion. In a reverse repo the central bank borrows: counterparties hand over cash and receive collateral, so reserves fall. The Fed’s ON RRP facility is exactly this, offered as a standing option rather than an auction — and at its 2022 peak it was draining more than $2 trillion, which is how a facility built to plug a leak in the floor became one of the largest positions on the balance sheet.',
    },
  ],
});
