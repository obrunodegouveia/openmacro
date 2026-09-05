/**
 * ============================================================================
 * Module 2 · Lesson 7 — "Illiquid is not insolvent, until it is"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to distinguish a liquidity problem from a
 * solvency problem, and explain why the distinction is clean in theory and
 * often undecidable in the moment.
 *
 * Sources / further reading for reviewers:
 *   - Diamond & Dybvig (1983), "Bank Runs, Deposit Insurance, and Liquidity".
 *   - Bagehot, "Lombard Street" (1873) — lend freely, against good collateral,
 *     at a penalty rate.
 *   - FDIC report on Silicon Valley Bank (2023) — a run driven by unrealised
 *     losses on long-dated securities.
 *
 * A note on rigour: the two-equilibrium framing is a model. Real runs mix a
 * genuine solvency doubt with a coordination failure, and the lesson says so —
 * a learner who thinks every run is pure panic will misread every rescue.
 */

import { defineLesson } from '../../schema';

export const runsAndLiquidityLesson = defineLesson({
  id: 'runs-and-liquidity',
  title: 'Illiquid, or Insolvent?',
  subtitle: 'The distinction every rescue turns on — and why nobody can be sure at the time.',
  icon: '🚪',
  difficulty: 'advanced',
  estimatedMinutes: 8,
  hearts: 3,

  keyTakeaways: [
    'Illiquid means the assets are good but cannot be sold fast enough. Insolvent means they are not worth what is owed.',
    'Banks are illiquid by design: they fund long assets with deposits repayable instantly.',
    'A run can be self-fulfilling — withdrawing is rational if you expect others to withdraw.',
    'Forced selling turns a liquidity problem into a solvency one, which is why the distinction blurs exactly when it matters.',
  ],

  challenges: [
    {
      id: 'match-liquidity-solvency',
      type: 'concept_match',
      tags: ['runs', 'liquidity'],
      xp: 15,
      prompt: 'Match each term to what it describes.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'illiquid',
          term: 'Illiquid',
          definition: 'Assets are worth enough, but cannot be turned into cash in time',
        },
        {
          id: 'insolvent',
          term: 'Insolvent',
          definition: 'Assets are worth less than what is owed, however long you wait',
        },
        {
          id: 'maturity',
          term: 'Maturity transformation',
          definition: 'Funding thirty-year loans with money repayable on demand',
        },
        {
          id: 'firesale',
          term: 'Fire sale',
          definition: 'Selling assets fast enough to move their price against you',
        },
        {
          id: 'lolr',
          term: 'Lender of last resort',
          definition: 'A central bank lending against good collateral when nobody else will',
        },
      ],
      explanation:
        'Maturity transformation is not a flaw banks should fix — it is the service they provide. Savers want their money available; borrowers want it for decades. A bank stands between them and absorbs the mismatch. Everything about bank fragility follows from that one useful trick, which is why the answer to runs has always been a backstop rather than an instruction to stop doing it.',
    },

    {
      id: 'sim-solvency-margin',
      type: 'interactive_sim',
      tags: ['leverage', 'solvency'],
      xp: 30,
      prompt: 'How big a loss wipes out a bank?',
      instructions: 'Move the loss and watch the equity',
      narrative:
        'A bank holds €100bn of assets funded with €94bn of deposits and debt, leaving €6bn of equity. Assets fall in value. Find where the bank stops being solvent.',
      constants: { assets: 100e9, equity: 6e9 },
      sliders: [
        {
          key: 'lossRate',
          label: 'Fall in asset value',
          min: 0,
          max: 0.15,
          step: 0.01,
          defaultValue: 0,
          format: 'percent',
          hint: 'A 6% fall is not a dramatic market move',
        },
      ],
      readouts: [
        {
          key: 'equity_after_loss',
          label: 'Equity left',
          formulaId: 'equity_after_loss',
          format: 'currency',
          emphasis: true,
          caption: 'equity - assets x lossRate',
        },
        {
          key: 'leverage_ratio',
          label: 'Leverage',
          formulaId: 'leverage_ratio',
          format: 'multiplier',
          caption: 'assets / equity',
        },
        {
          key: 'wipeout_loss_rate',
          label: 'Loss that wipes equity out',
          formulaId: 'wipeout_loss_rate',
          format: 'percent',
          caption: 'equity / assets',
        },
      ],
      objective: {
        description: 'Push the loss until equity is gone',
        requiredObservations: [
          { sliderKey: 'lossRate', values: [0, 0.03, 0.07] },
        ],
        target: { readoutKey: 'equity_after_loss', comparator: 'lte', value: 0 },
      },
      explanation:
        'At 17x leverage a 6% fall in asset values is fatal — and 6% is an ordinary move in a bond portfolio when rates rise. This is what happened to Silicon Valley Bank in 2023: it had bought long-dated bonds that were perfectly good and would repay in full at maturity, but rates rose and their market value fell far enough that selling them to meet withdrawals would have exposed the hole. The run was fast, but the solvency problem was already sitting on the balance sheet.',
    },

    {
      id: 'order-run-dynamics',
      type: 'order_flow',
      tags: ['runs', 'crisis'],
      xp: 20,
      prompt: 'Put the mechanics of a bank run in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'doubt',
          label: 'Depositors start doubting the bank',
          detail: 'A loss is disclosed, or a rumour spreads',
        },
        {
          id: 'first',
          label: 'The quickest depositors withdraw in full',
          detail: 'Whoever asks first is paid first — that is the whole problem',
        },
        {
          id: 'sell',
          label: 'The bank sells assets to raise cash',
          detail: 'Starting with the liquid ones, then whatever is left',
        },
        {
          id: 'losses',
          label: 'Selling into a falling market realises losses',
          detail: 'Unrealised losses on the books become real ones',
        },
        {
          id: 'insolvent',
          label: 'The bank is now genuinely insolvent',
          detail: 'The run made true what it merely feared',
        },
      ],
      correctOrder: ['doubt', 'first', 'sell', 'losses', 'insolvent'],
      explanation:
        'The last step is the trap. A run does not merely reveal insolvency, it can manufacture it: a bank whose assets were worth enough if held to maturity is destroyed by having to sell them all at once. That is why withdrawing early is individually rational and collectively ruinous, and why the two standard answers — deposit insurance to stop the first step, and a lender of last resort to stop the third — target the sequence rather than the bank.',
    },

    {
      id: 'mc-bagehot',
      type: 'multiple_choice',
      tags: ['lender-of-last-resort', 'policy'],
      xp: 15,
      prompt: 'Bagehot’s rule says a central bank should lend freely, against good collateral, at a penalty rate. Why the penalty?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'profit',
          label: 'So the central bank profits from the crisis',
          feedback:
            'Profit is incidental and central banks usually remit it to the treasury anyway. The rate is set for its incentive effect.',
        },
        {
          id: 'last-resort',
          label: 'So banks only come when genuinely stuck, and leave as soon as markets reopen',
        },
        {
          id: 'punish',
          label: 'To punish the bank for poor management',
          feedback:
            'Punishment would argue for refusing to lend at all. The rule exists to make lending possible without making it attractive.',
        },
        {
          id: 'inflation',
          label: 'To offset the inflationary effect of the lending',
          feedback:
            'Emergency lending against collateral is not the kind of operation that drives inflation, and the rate is not chosen with the price level in mind.',
        },
      ],
      correctOptionId: 'last-resort',
      explanation:
        'A penalty rate makes the facility a genuine last resort rather than a cheap funding source, and gives borrowers a reason to leave once private markets recover. The "good collateral" clause does the other half of the work: it is what keeps the rule from becoming a bailout of insolvent banks. Lend against assets that are worth it and you rescue a liquidity problem; lend against assets that are not and you have absorbed someone else’s losses. The difficulty in every real crisis is that nobody can tell which case they are in at three in the morning.',
    },
  ],
});
