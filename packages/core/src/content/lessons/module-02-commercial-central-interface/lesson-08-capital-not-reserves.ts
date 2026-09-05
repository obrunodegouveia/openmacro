/**
 * ============================================================================
 * Module 2 · Lesson 8 — "What actually limits lending"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to name capital, funding costs and loan demand as
 * the operative constraints on bank lending, and post a loss against equity to
 * see why capital — not reserves — is the buffer that matters.
 *
 * Sources / further reading for reviewers:
 *   - Basel III framework, in particular the CET1 and leverage ratio rules.
 *   - Admati & Hellwig, "The Bankers' New Clothes" (2013) — on why bank equity
 *     is treated differently from equity anywhere else.
 *
 * A note on rigour: this lesson closes the module by explicitly overturning
 * the multiplier intuition built in Module 1. Keep the tension visible; the
 * classic model is worth knowing and worth knowing the limits of.
 */

import { defineLesson } from '../../schema';

export const capitalNotReservesLesson = defineLesson({
  id: 'capital-not-reserves',
  title: 'What Actually Limits Lending',
  subtitle: 'Not the reserve requirement. Capital, funding, and someone worth lending to.',
  icon: '🧮',
  difficulty: 'advanced',
  estimatedMinutes: 7,
  hearts: 3,

  keyTakeaways: [
    'Capital is the buffer that absorbs losses — it is equity, not a pot of cash held aside.',
    'Every loan consumes capital, so a bank with thin equity must stop lending or raise more.',
    'Reserves settle payments; capital absorbs losses. Confusing them is the most common error in this subject.',
    'In a downturn banks hold reserves and still do not lend, because capital is scarce and borrowers are risky.',
  ],

  challenges: [
    {
      id: 'mc-capital-is-not-cash',
      type: 'multiple_choice',
      tags: ['capital', 'regulation'],
      xp: 15,
      prompt: 'A bank is told to "hold more capital". What does it actually have to do?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'set-aside',
          label: 'Set aside a pile of cash it cannot touch',
          feedback:
            'This is the single most common misunderstanding. Capital is not an asset held in reserve — it is the *funding structure* of the assets it already has.',
        },
        {
          id: 'fund-with-equity',
          label: 'Fund more of its assets with equity and less with debt',
        },
        {
          id: 'more-reserves',
          label: 'Hold more reserves at the central bank',
          feedback:
            'Reserves are an asset and can be funded by debt like any other. Holding more of them does nothing for capital.',
        },
        {
          id: 'lend-less',
          label: 'Stop lending entirely until the ratio recovers',
          feedback:
            'Shrinking the loan book is one way to hit a ratio, and banks do it — but the requirement is about how assets are funded, not about refusing to lend.',
        },
      ],
      correctOptionId: 'fund-with-equity',
      explanation:
        'Capital sits on the right-hand side of the balance sheet, alongside deposits and debt. Requiring more of it means a larger share of the bank’s assets must be paid for by shareholders who can lose money, rather than by depositors who cannot be allowed to. Nothing is set aside and no asset is idle — a well-capitalised bank can be fully invested. This is why "capital requirements force banks to hold money instead of lending it" is wrong twice over.',
    },

    {
      id: 't-loss-against-capital',
      type: 't_account_flow',
      tags: ['capital', 'balance-sheets'],
      xp: 30,
      prompt: 'A developer’s project fails and the €4bn loan will not be repaid. Post the loss on both sheets.',
      instructions: 'Pick an entry, then choose whose sheet it lands on and which side',
      scenario:
        'The buildings are worth €4bn less than they cost, and the developer cannot repay. The loss has to land somewhere on each balance sheet. Four entries are needed — three of the seven do not belong.',
      currency: 'EUR',
      entities: [
        {
          id: 'bank',
          label: 'The Bank',
          tier: 'commercial_bank',
          role: 'Holds the loan',
          openingLines: [
            { account: 'Loans to customers', side: 'asset', amount: 90e9 },
            { account: 'Reserves at the central bank', side: 'asset', amount: 10e9 },
            { account: 'Customer deposits', side: 'liability', amount: 88e9 },
            { account: 'Shareholders’ equity', side: 'liability', amount: 12e9 },
          ],
        },
        {
          id: 'developer',
          label: 'The Developer',
          tier: 'commercial_bank',
          role: 'Owns the failed project',
          openingLines: [
            { account: 'Property under development', side: 'asset', amount: 6e9 },
            { account: 'Bank loans', side: 'liability', amount: 4e9 },
            { account: 'Shareholders’ equity', side: 'liability', amount: 2e9 },
          ],
        },
      ],
      options: [
        {
          id: 'bank-loans-down',
          shift: { entityId: 'bank', side: 'asset', account: 'Loans to customers', delta: -4e9 },
        },
        {
          id: 'bank-equity-down',
          shift: { entityId: 'bank', side: 'liability', account: 'Shareholders’ equity', delta: -4e9 },
        },
        {
          id: 'dev-property-down',
          shift: { entityId: 'developer', side: 'asset', account: 'Property under development', delta: -4e9 },
        },
        {
          id: 'dev-equity-down',
          shift: { entityId: 'developer', side: 'liability', account: 'Shareholders’ equity', delta: -4e9 },
        },
        {
          id: 'bank-deposits-down',
          shift: { entityId: 'bank', side: 'liability', account: 'Customer deposits', delta: -4e9 },
          feedback:
            'Depositors are still owed in full. A loss falls on shareholders first — that is what equity is for, and depositors only lose once it is exhausted.',
        },
        {
          id: 'bank-reserves-down',
          shift: { entityId: 'bank', side: 'asset', account: 'Reserves at the central bank', delta: -4e9 },
          feedback:
            'No payment was made. A write-down recognises that an asset is worth less; it moves no central bank money anywhere.',
        },
        {
          id: 'dev-loans-down',
          shift: { entityId: 'developer', side: 'liability', account: 'Bank loans', delta: -4e9 },
          feedback:
            'The developer still owes the money — that is why the bank has a loss. The debt is not cancelled by the project failing.',
        },
      ],
      expectedShifts: [
        { entityId: 'bank', side: 'asset', account: 'Loans to customers', delta: -4e9 },
        { entityId: 'bank', side: 'liability', account: 'Shareholders’ equity', delta: -4e9 },
        { entityId: 'developer', side: 'asset', account: 'Property under development', delta: -4e9 },
        { entityId: 'developer', side: 'liability', account: 'Shareholders’ equity', delta: -4e9 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'Deposits are untouched. The developer already spent the borrowed money, and it still sits in the accounts of the builders who were paid.',
        },
        {
          aggregate: 'collateral',
          direction: 'contract',
          note: 'The property backing the loan is worth less, so there is less good collateral in the system than the books previously showed.',
        },
      ],
      explanation:
        'The loss shows up twice because the same economic event has two owners: the buildings really are worth less, and the claim on them really is worth less. On both sheets it lands on equity, which is what equity is for. The bank’s fell from €12bn to €8bn and depositors noticed nothing — but at a €14bn loss equity would have gone to zero and the rest would have come out of deposits. That distance is exactly what a capital requirement sets.',
    },

    {
      id: 'order-lending-decision',
      type: 'order_flow',
      tags: ['capital', 'lending'],
      xp: 20,
      prompt: 'What does a bank actually check before making a large loan? Order it.',
      instructions: 'First consideration at the top',
      events: [
        {
          id: 'borrower',
          label: 'Is there a borrower worth lending to?',
          detail: 'Creditworthy, and actually wanting the money',
        },
        {
          id: 'profitable',
          label: 'Does the rate cover funding, expected losses and costs?',
          detail: 'Lending below that destroys value however safe it is',
        },
        {
          id: 'capital',
          label: 'Is there capital to support the risk?',
          detail: 'Every loan consumes some, and raising more is expensive',
        },
        {
          id: 'liquidity',
          label: 'Can the resulting outflows be funded?',
          detail: 'A liquidity question, answered after the credit decision',
        },
        {
          id: 'reserves',
          label: 'Can settlement be arranged if the money is spent elsewhere?',
          detail: 'Borrowed overnight if needed — rarely the binding constraint',
        },
      ],
      correctOrder: ['borrower', 'profitable', 'capital', 'liquidity', 'reserves'],
      explanation:
        'Reserves come last, and often do not come up at all. A solvent bank can obtain reserves whenever it needs them, at a price the central bank sets — which makes them a cost, not a limit. The constraints that actually bind are at the top of the list, and in a recession the first one binds hardest: banks with plenty of capital and mountains of reserves still do not lend, because there is nobody creditworthy who wants to borrow.',
    },

    {
      id: 'mc-recession-puzzle',
      type: 'multiple_choice',
      tags: ['capital', 'policy'],
      xp: 15,
      prompt: 'After 2008 banks held record reserves and lending fell anyway. What does that rule out?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'multiplier',
          label: 'That reserves are what determines how much banks lend',
        },
        {
          id: 'demand',
          label: 'That loan demand matters',
          feedback:
            'The opposite — weak demand is one of the leading explanations for what happened. The episode is evidence *for* demand mattering.',
        },
        {
          id: 'capital-matters',
          label: 'That capital constrains lending',
          feedback:
            'Also the opposite. Banks were repairing damaged capital, which is precisely why they could not expand lending despite the reserves.',
        },
        {
          id: 'qe-worked',
          label: 'That QE had any effect at all',
          feedback:
            'A separate question. QE plainly moved asset prices and long-term yields; what it did not do is push reserves into loans, because that is not a channel that exists.',
        },
      ],
      correctOptionId: 'multiplier',
      explanation:
        'If reserves drove lending, the largest reserve injection in history should have produced the largest credit boom in history. Instead lending contracted for years. The reserves could not become loans because banks were short of capital, borrowers were deleveraging, and reserves were never the input anyway. That decade is the cleanest natural experiment there is against the money multiplier as a causal account — which is why this module ends here.',
    },
  ],
});
