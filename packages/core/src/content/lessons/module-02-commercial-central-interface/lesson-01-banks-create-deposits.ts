/**
 * ============================================================================
 * Module 2 · Lesson 1 — "Banks don't lend out the vault"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * By the end of this lesson the learner should be able to state, in their own
 * words, that commercial bank lending *creates* new deposit money rather than
 * transferring pre-existing cash, and to compute the theoretical credit
 * expansion implied by a given reserve requirement.
 *
 * Sources / further reading for reviewers:
 *   - Bank of England Quarterly Bulletin 2014 Q1, "Money creation in the
 *     modern economy" (McLeay, Radia & Thomas)
 *   - Federal Reserve, "Reserve Requirements" (regulation D)
 *
 * A note on rigour: the deposit-multiplier model taught here is the classic
 * textbook *ceiling*, not a description of how modern central banks operate
 * (most now target interest rates, and several have set reserve requirements
 * to zero). Step 2's explanation says so explicitly — please keep that nuance
 * if you edit this lesson.
 */

import { defineLesson } from '../../schema';

export const banksCreateDepositsLesson = defineLesson({
  id: 'banks-create-deposits',
  title: 'Where Does Money Come From?',
  subtitle: 'How a bank loan conjures a brand-new deposit out of thin air.',
  icon: '🏦',
  difficulty: 'intro',
  estimatedMinutes: 5,
  hearts: 3,

  keyTakeaways: [
    'Commercial banks create new deposit money when they lend — they do not hand over someone else’s cash.',
    'A loan expands both sides of the bank’s balance sheet at once: a new asset (your debt) and a new liability (your deposit).',
    'The reserve requirement R caps the theoretical expansion at M = D x (1 / R).',
    'Base money never grows in this process. Only broad money — the deposits in everyone’s accounts — does.',
  ],

  challenges: [
    // -----------------------------------------------------------------------
    // STEP 1 — Break the "banks lend out vault cash" myth.
    // -----------------------------------------------------------------------
    {
      id: 'mc-loan-origin',
      type: 'multiple_choice',
      tags: ['money-creation', 'banking'],
      xp: 10,
      prompt: 'A bank approves your $10,000 loan. Where does that $10,000 come from?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'vault',
          label: 'From cash sitting in the bank’s vault',
          feedback:
            'Vault cash is a tiny fraction of a bank’s balance sheet, and it never moves when a loan is made — the loan is a number typed into an account.',
        },
        {
          id: 'savers',
          label: 'From other customers’ savings, lent onwards',
          feedback:
            'This is the intuitive story, but savers’ balances do not fall by one cent when you borrow. Nobody’s deposit is moved to fund your loan.',
        },
        {
          id: 'created',
          label: 'The bank creates it as a new deposit in your account',
        },
        {
          id: 'centralbank',
          label: 'The central bank prints and delivers it to the bank',
          feedback:
            'Central banks issue reserves and physical notes, not your loan. The overwhelming majority of the money supply is created by commercial banks lending.',
        },
      ],
      correctOptionId: 'created',
      explanation:
        'The bank writes two new entries at the same instant: a loan of $10,000 as its asset, and a $10,000 deposit in your account as its liability. No existing deposit shrank. That keystroke is the moment new money enters the economy.',
    },

    // -----------------------------------------------------------------------
    // STEP 2 — Interactive sim: 10% vs 20% reserve ratio on a $1,000 deposit.
    // -----------------------------------------------------------------------
    {
      id: 'sim-reserve-multiplier',
      type: 'interactive_sim',
      tags: ['fractional-reserve', 'money-multiplier'],
      xp: 20,
      prompt: 'How far can $1,000 stretch?',
      instructions: 'Drag the reserve requirement and watch the money supply react',
      narrative:
        'Someone deposits $1,000 of cash. Every bank must park a fraction R of each deposit as reserves and may lend the rest — which becomes a deposit at the next bank, and so on. Compare a 10% requirement with a 20% one.',

      // Fixed inputs available to every formula in this sim.
      constants: {
        initialDeposit: 1000,
      },

      sliders: [
        {
          key: 'reserveRatio',
          label: 'Reserve requirement (R)',
          min: 0.05,
          max: 0.5,
          step: 0.05,
          defaultValue: 0.2,
          format: 'percent',
          hint: 'The share of every deposit a bank must hold back',
        },
      ],

      // Evaluated top-to-bottom; each formula id is registered in
      // `src/content/formulas.ts`.
      readouts: [
        {
          key: 'totalMoney',
          label: 'Total deposits in the system',
          formulaId: 'total_money_created',
          format: 'currency',
          emphasis: true,
          caption: 'M = D x (1 / R)',
        },
        {
          key: 'multiplier',
          label: 'Money multiplier',
          formulaId: 'money_multiplier',
          format: 'multiplier',
          caption: '1 / R',
        },
        {
          key: 'newCredit',
          label: 'New money created',
          formulaId: 'new_credit_created',
          format: 'currency',
          caption: 'M − D',
        },
        {
          key: 'requiredReserves',
          label: 'Reserves held against it all',
          formulaId: 'required_reserves',
          format: 'currency',
          caption: 'Still just the original $1,000',
        },
      ],

      objective: {
        description: 'Finish at 10% — the loosest requirement in this range',
        requiredObservations: [
          // The learner must physically rest on both settings, so the
          // comparison cannot be skipped.
          { sliderKey: 'reserveRatio', values: [0.2, 0.1] },
        ],
        target: {
          readoutKey: 'totalMoney',
          comparator: 'gte',
          value: 10000,
        },
      },

      explanation:
        'Halving the reserve requirement from 20% to 10% doubles the multiplier from 5x to 10x: the same $1,000 of base money now supports $10,000 of deposits, $9,000 of which is newly created. Notice the reserves line never budges — base money did not grow, only the deposits built on top of it. Real banking is messier (cash leaks out, banks hold excess reserves, and many central banks now set R to zero and steer lending with interest rates instead), but the direction of the effect is exactly this.',
    },

    // -----------------------------------------------------------------------
    // STEP 3 — Order flow: how a loan creates a new demand deposit.
    // -----------------------------------------------------------------------
    {
      id: 'flow-loan-creates-deposit',
      type: 'order_flow',
      tags: ['balance-sheet', 'money-creation'],
      xp: 15,
      prompt: 'Put the loan sequence in causal order.',
      instructions: 'Tap the events in the order they happen',
      events: [
        {
          id: 'apply',
          label: 'You sign a loan agreement',
          detail: 'You promise to repay $10,000 plus interest',
        },
        {
          id: 'asset',
          label: 'The bank books your promise as an asset',
          detail: 'Your debt is now something the bank owns',
        },
        {
          id: 'deposit',
          label: 'The bank credits $10,000 to your account',
          detail: 'A new liability appears on the same balance sheet',
        },
        {
          id: 'supply',
          label: 'The broad money supply rises by $10,000',
          detail: 'Deposits are money — and there are $10,000 more of them',
        },
        {
          id: 'repay',
          label: 'You repay the principal and that money is destroyed',
          detail: 'The deposit and the loan cancel out; only interest remains',
        },
      ],
      correctOrder: ['apply', 'asset', 'deposit', 'supply', 'repay'],
      explanation:
        'Assets and liabilities are created in the same stroke, which is why the bank’s books still balance even though money was created from nothing. The last step is the half people forget: repaying principal *destroys* deposit money. An economy that stops borrowing is an economy whose money supply shrinks.',
    },

    // -----------------------------------------------------------------------
    // STEP 4 — Summary concept match.
    // -----------------------------------------------------------------------
    {
      id: 'match-money-vocabulary',
      type: 'concept_match',
      tags: ['vocabulary', 'summary'],
      xp: 15,
      prompt: 'Match each term to what it actually means.',
      instructions: 'Tap a term, then tap its definition',
      pairs: [
        {
          id: 'fractional-reserve',
          term: 'Fractional reserve',
          definition: 'Holding only a slice of deposits as reserves and lending the rest',
        },
        {
          id: 'money-multiplier',
          term: 'Money multiplier',
          definition: '1 / R — how far one unit of base money can stretch',
        },
        {
          id: 'broad-money',
          term: 'Broad money',
          definition: 'Cash plus all the deposits sitting in people’s accounts',
        },
        {
          id: 'base-money',
          term: 'Base money',
          definition: 'Physical notes plus reserves held at the central bank',
        },
        {
          id: 'purchasing-power',
          term: 'Purchasing power',
          definition: 'The quantity of real goods a unit of money can buy',
        },
      ],
      explanation:
        'Base money is what the central bank issues; broad money is what lending builds on top of it; the multiplier is the ceiling on that construction. Purchasing power is the reason any of it matters — if broad money grows faster than the supply of real goods, each unit buys less.',
    },
  ],
});
