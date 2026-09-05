/**
 * ============================================================================
 * Module 2 · Lesson 3 — "Gross, net, and the risk in between"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to explain the trade-off every payment system
 * makes: real-time gross settlement removes credit risk but demands enormous
 * liquidity, while netting economises on liquidity by leaving obligations
 * outstanding.
 *
 * Sources / further reading for reviewers:
 *   - CPMI, "Principles for financial market infrastructures" (2012).
 *   - ECB, "TARGET2 Annual Report"; Federal Reserve, "Fedwire" statistics.
 *   - Herstatt Bank (1974) — the failure that gave settlement risk its name.
 *
 * A note on rigour: modern RTGS systems use liquidity-saving mechanisms that
 * blur the gross/net distinction — they queue and offset payments while still
 * settling gross. The lesson teaches the two poles first because the hybrid
 * only makes sense as a compromise between them.
 */

import { defineLesson } from '../../schema';

export const settlementSystemsLesson = defineLesson({
  id: 'settlement-systems',
  title: 'Gross, Net, and the Risk Between',
  subtitle: 'Why the biggest payment systems settle one payment at a time, and what that costs.',
  icon: '🔀',
  difficulty: 'core',
  estimatedMinutes: 7,
  hearts: 3,

  keyTakeaways: [
    'Gross settlement finalises each payment individually and immediately — no exposure, but every payment needs liquidity on hand.',
    'Net settlement offsets the day’s payments and moves only the difference — cheap in liquidity, but obligations sit unsettled meanwhile.',
    'The window between clearing and settlement is where a failing participant does damage.',
    'Big-value systems chose gross settlement precisely because the amounts made that window intolerable.',
  ],

  challenges: [
    {
      id: 'mc-netting-saving',
      type: 'multiple_choice',
      tags: ['settlement', 'netting'],
      xp: 15,
      prompt: 'Bank A owes Bank B €900m today. Bank B owes Bank A €850m. Under net settlement, what moves?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'both',
          label: '€900m one way and €850m the other',
          feedback:
            'That is gross settlement. Netting exists precisely to avoid moving €1.75bn to achieve a €50m change.',
        },
        {
          id: 'net-50',
          label: '€50m from Bank A to Bank B',
        },
        {
          id: 'nothing',
          label: 'Nothing — they roughly cancel',
          feedback:
            'They nearly cancel, but not exactly. The residual is a real obligation and must be settled in central bank money.',
        },
        {
          id: 'average',
          label: '€875m, the average of the two',
          feedback:
            'Averaging has no meaning here. Netting is subtraction: what remains after obligations offset.',
        },
      ],
      correctOptionId: 'net-50',
      explanation:
        'Netting reduces €1.75bn of gross obligations to a €50m settlement — a 97% saving in the reserves needed. That efficiency is why retail systems net. The cost is that for most of the day both banks are exposed to each other for the full gross amount, and if one fails before settlement, the netting has to be recalculated without it.',
    },

    {
      id: 'match-settlement-systems',
      type: 'concept_match',
      tags: ['settlement', 'infrastructure'],
      xp: 15,
      prompt: 'Match each system or term to what it is.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'rtgs',
          term: 'RTGS',
          definition: 'Each payment settled individually and finally, the moment it is made',
        },
        {
          id: 'dns',
          term: 'Deferred net settlement',
          definition: 'Obligations offset through the day and the balance settled at the end',
        },
        {
          id: 'fedwire',
          term: 'Fedwire',
          definition: 'The US real-time gross settlement system, run by the Federal Reserve',
        },
        {
          id: 'target2',
          term: 'TARGET2',
          definition: 'The euro area equivalent, run by the Eurosystem',
        },
        {
          id: 'herstatt',
          term: 'Herstatt risk',
          definition: 'Paying one leg of a currency trade and not receiving the other',
        },
      ],
      explanation:
        'Herstatt risk is named after a German bank closed by regulators at the end of a business day in 1974, after it had received Deutschmarks but before it had paid the dollars it owed. Its counterparties lost the full amount. That single failure is why cross-currency settlement now runs through payment-versus-payment systems where both legs move together or neither does.',
    },

    {
      id: 'order-settlement-failure',
      type: 'order_flow',
      tags: ['settlement', 'risk'],
      xp: 20,
      prompt: 'A bank fails at midday in a net settlement system. Put the consequences in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'payments',
          label: 'The bank sends and receives payments all morning',
          detail: 'Nothing is final yet — these are obligations, not settled transfers',
        },
        {
          id: 'fails',
          label: 'The bank fails before the settlement cycle runs',
          detail: 'It cannot meet its net obligation',
        },
        {
          id: 'unwind',
          label: 'Its payments are stripped out and the netting recalculated',
          detail: 'Everyone’s position changes, including banks that never dealt with it',
        },
        {
          id: 'shortfall',
          label: 'Banks that expected incoming funds are suddenly short',
          detail: 'They had already paid out against money that will not arrive',
        },
        {
          id: 'contagion',
          label: 'Some of them cannot meet their own obligations',
          detail: 'One failure becomes several',
        },
      ],
      correctOrder: ['payments', 'fails', 'unwind', 'shortfall', 'contagion'],
      explanation:
        'The third step is the dangerous one, and it is the reason large-value systems abandoned netting. An unwind changes the position of participants who never traded with the failed bank at all — their net figure was computed in a pool that included it. Gross settlement makes this impossible: each payment is final on arrival, so a failure at midday cannot reach backwards into the morning.',
    },

    {
      id: 'mc-why-rtgs-costs',
      type: 'multiple_choice',
      tags: ['settlement', 'liquidity'],
      xp: 15,
      prompt: 'Fedwire settles trillions a day gross. What does that demand of the banks using it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'capital',
          label: 'More capital, to absorb losses',
          feedback:
            'Capital absorbs losses. This is not a loss problem — the payments are all good — it is a timing problem.',
        },
        {
          id: 'liquidity',
          label: 'Intraday liquidity — reserves available at the moment each payment is sent',
        },
        {
          id: 'nothing',
          label: 'Nothing extra, since payments in and out roughly match',
          feedback:
            'They match by the end of the day. They do not match at 10:04am, and a gross system needs the reserves at 10:04am.',
        },
        {
          id: 'collateral-only',
          label: 'Only collateral, not actual reserves',
          feedback:
            'Collateral is how a bank *borrows* intraday liquidity from the central bank — but what settles the payment is still reserves.',
        },
      ],
      correctOptionId: 'liquidity',
      explanation:
        'A bank might end the day exactly flat and still have needed billions at eleven in the morning, because payments out ran ahead of payments in. Central banks supply this gap as intraday credit against collateral, usually free but repaid before the close. This is the hidden cost of gross settlement — and the reason systems spent decades building queueing and offsetting mechanisms that recover some of netting’s efficiency without reopening the unwind risk.',
    },
  ],
});
