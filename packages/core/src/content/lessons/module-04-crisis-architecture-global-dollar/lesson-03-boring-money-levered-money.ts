/**
 * ============================================================================
 * Module 4 · Lesson 3 — "One loan, two completely different businesses"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to say why a money fund lends in repo rather than
 * holding a deposit, compute the leverage a haircut implies, post a levered
 * Treasury purchase across both balance sheets, and explain why collateral
 * makes every individual lender safe and the system procyclical.
 *
 * Why this lesson exists
 * ----------------------
 * A learner asked who actually makes money from repo, and the honest answer is
 * that almost nobody makes it from the rate. Overnight margins are a few basis
 * points by design. The money is made three ways — volume, leverage and fees —
 * and the course taught none of them.
 *
 * The framing that does the work is that the *same* overnight loan is two
 * entirely different trades depending on which end you are holding. For the
 * money fund it is the safest asset it can own and it is boring on purpose.
 * For the hedge fund on the other side it is fifty times leverage, and the repo
 * rate is a cost rather than a return.
 *
 * Placed before `dash-for-cash`, because March 2020 is what happens when this
 * trade is unwound at speed by everybody at once, and that lesson reads far
 * better once a learner has posted the position by hand.
 *
 * Sources / further reading for reviewers:
 *   - BIS Quarterly Review, "The market turmoil of March 2020" — on levered
 *     relative-value positions and Treasury market dysfunction.
 *   - Bank of England Financial Stability Reports and BIS commentary on the
 *     Treasury cash–futures basis trade.
 *   - SEC money market fund reforms — why government MMFs concentrate in repo.
 *
 * A note on rigour: haircuts are negotiated, not fixed. Two per cent on
 * Treasuries is representative rather than a rule, and it moves — which is the
 * entire mechanism of the last two challenges. The lesson says so rather than
 * letting a learner memorise a number that is really a variable.
 */

import { defineLesson } from '../../schema';

export const boringMoneyLeveredMoneyLesson = defineLesson({
  id: 'boring-money-levered-money',
  title: 'Boring Money, Levered Money',
  subtitle:
    'The same overnight loan is a money fund’s safest asset and a hedge fund’s fifty-times bet.',
  icon: '🏋️',
  difficulty: 'advanced',
  estimatedMinutes: 9,
  hearts: 3,

  keyTakeaways: [
    'A money fund lends cash against collateral. It earns a few basis points and takes almost no credit risk — the trade is boring on purpose.',
    'The hedge fund on the other side does not earn the repo rate. It pays it, and profits from what the borrowed money lets it hold.',
    'The haircut sets the leverage. Two per cent on Treasuries means $2m of capital carries $100m of bonds, turning a 0.2% spread into roughly 10% on capital.',
    'Collateral makes each lender individually safe and the system collectively fragile: when prices fall, haircuts rise, and every levered holder has to sell at the same moment.',
  ],

  challenges: [
    {
      id: 'mc-why-the-money-fund-lends',
      type: 'multiple_choice',
      tags: ['repo', 'money-market-funds'],
      xp: 20,
      prompt:
        'A government money market fund has $5B to place overnight. A bank offers a deposit at 4.28%. Repo against Treasuries pays 4.30%. Why does the fund overwhelmingly choose repo?',
      explanation:
        'Not for the two basis points. A $5B deposit makes the fund an unsecured creditor of one bank — if that bank fails, the fund queues with everyone else, and a money fund whose whole promise is a stable dollar per share cannot take that risk at that size. In repo it holds Treasuries worth more than it lent. The counterparty failing becomes an inconvenience rather than a loss: it keeps the collateral and sells it. That is why money funds are the largest cash lenders in repo, and why the business is deliberately dull.',
      options: [
        {
          id: 'collateral',
          label: 'It holds collateral worth more than it lent, so a failed counterparty is not a loss',
        },
        {
          id: 'yield',
          label: 'The two extra basis points',
          feedback:
            'Two basis points on $5B overnight is about $2,800. Real, but nowhere near enough to explain the choice. Ask what the fund is avoiding rather than what it is earning.',
        },
        {
          id: 'insured',
          label: 'Repo balances are government-insured and deposits are not',
          feedback:
            'Backwards, and neither is quite right. Deposit insurance exists but is capped far below $5B; repo has no insurance at all. Its protection is the collateral itself.',
        },
        {
          id: 'liquid',
          label: 'Repo can be withdrawn at any time and a deposit cannot',
          feedback:
            'An overnight deposit is available the next morning too. Both are short. The difference is what happens on the morning the counterparty does not open.',
        },
      ],
      correctOptionId: 'collateral',
    },

    {
      id: 'mc-the-leverage-arithmetic',
      type: 'multiple_choice',
      tags: ['repo', 'leverage', 'hedge-funds'],
      xp: 25,
      prompt:
        'A fund buys $100m of Treasuries yielding 4.5% and funds them in repo at 4.3%. The haircut is 2%, so it must put up $2m of its own money. What does it earn on its own capital?',
      explanation:
        'About 10%. The spread is 0.2% on $100m, which is $200,000 a year — and the fund only committed $2m to get it, so $200,000 on $2m is 10%. That is the whole business: a spread nobody would cross the road for, multiplied by the leverage the haircut allows. The haircut is the lever. At 2% you carry fifty times your capital; at 4% you carry twenty-five times and the same trade earns half as much. And haircuts are negotiated, not fixed — which is what makes the next two exercises frightening rather than arithmetic.',
      options: [
        { id: 'ten', label: 'About 10%' },
        {
          id: 'twotenths',
          label: '0.2% — the spread it captured',
          feedback:
            'That is the return on the *bonds*, not on the fund’s money. It only put up $2m of the $100m. Divide the profit by what it actually committed.',
        },
        {
          id: 'two',
          label: '2% — the haircut',
          feedback:
            'The haircut is how much capital the trade consumes, not what it earns. It sets the size of the lever, and the return depends on the spread as well.',
        },
        {
          id: 'fifty',
          label: '50% — the leverage multiple',
          feedback:
            'Fifty times is the leverage, not the return. Multiply the spread by the leverage: 0.2% × 50 is about 10%.',
        },
      ],
      correctOptionId: 'ten',
    },

    {
      id: 'ta-the-levered-purchase',
      type: 't_account_flow',
      tags: ['repo', 'leverage', 'balance-sheets', 'shadow-banking'],
      xp: 30,
      prompt: 'Post the trade: a fund buys $100m of Treasuries and repos them out the same day.',
      instructions: 'Pick an entry, then choose whose sheet it lands on and which side',
      scenario:
        'The fund pays $100m for the bonds. It raises $98m by pledging them in repo to a money market fund, and covers the remaining $2m — the haircut — from its own cash. Five entries are needed; three of the eight do not belong.',
      currency: 'USD',
      entities: [
        {
          id: 'fund',
          label: 'Hedge Fund',
          tier: 'shadow_bank',
          role: 'Borrowing against the bonds it just bought',
          openingLines: [
            { account: 'Cash', side: 'asset', amount: 50e6 },
            { account: 'Partners’ capital', side: 'liability', amount: 50e6 },
          ],
        },
        {
          id: 'mmf',
          label: 'Money Market Fund',
          tier: 'shadow_bank',
          role: 'Lending cash against collateral',
          openingLines: [
            { account: 'Cash', side: 'asset', amount: 5000e6 },
            { account: 'Shares issued', side: 'liability', amount: 5000e6 },
          ],
        },
      ],
      options: [
        {
          id: 'fund-bonds-up',
          shift: { entityId: 'fund', side: 'asset', account: 'US Treasuries', delta: 100e6 },
        },
        {
          id: 'fund-cash-down',
          shift: { entityId: 'fund', side: 'asset', account: 'Cash', delta: -2e6 },
        },
        {
          id: 'fund-repo-up',
          shift: { entityId: 'fund', side: 'liability', account: 'Repo borrowing', delta: 98e6 },
        },
        {
          id: 'mmf-cash-down',
          shift: { entityId: 'mmf', side: 'asset', account: 'Cash', delta: -98e6 },
        },
        {
          id: 'mmf-repo-up',
          shift: { entityId: 'mmf', side: 'asset', account: 'Repo lending', delta: 98e6 },
        },
        {
          id: 'fund-capital-up',
          shift: { entityId: 'fund', side: 'liability', account: 'Partners’ capital', delta: 98e6 },
          feedback:
            'Nobody invested in the fund. It borrowed the $98m — which is the entire point. Capital is what the partners put in; this is what the money fund lent.',
        },
        {
          id: 'mmf-shares-up',
          shift: { entityId: 'mmf', side: 'liability', account: 'Shares issued', delta: 98e6 },
          feedback:
            'No new investor bought into the money fund. It moved cash it already had into a different asset; its total does not change at all.',
        },
        {
          id: 'fund-cash-up',
          shift: { entityId: 'fund', side: 'asset', account: 'Cash', delta: 98e6 },
          feedback:
            'The $98m never sat with the fund — it went straight to whoever sold the bonds. Following cash that only ever passes through is the commonest way to double-count a financing trade.',
        },
      ],
      expectedShifts: [
        { entityId: 'fund', side: 'asset', account: 'US Treasuries', delta: 100e6 },
        { entityId: 'fund', side: 'asset', account: 'Cash', delta: -2e6 },
        { entityId: 'fund', side: 'liability', account: 'Repo borrowing', delta: 98e6 },
        { entityId: 'mmf', side: 'asset', account: 'Cash', delta: -98e6 },
        { entityId: 'mmf', side: 'asset', account: 'Repo lending', delta: 98e6 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'Not a cent of deposits was created or destroyed. Shadow bank leverage can grow enormously without ever appearing in the money supply.',
        },
        {
          aggregate: 'collateral',
          direction: 'unchanged',
          note: 'The same bond now does two jobs: it is owned by the fund and pledged to the money fund. That double duty is what collateral re-use means.',
        },
      ],
      explanation:
        'Look at the two sheets. The money fund’s total did not move — it swapped cash for a secured claim, which is exactly the dull, safe trade it exists to do. The hedge fund’s grew by $98m on the strength of $2m. It now owns fifty times its capital in bonds, and its liability has to be renewed tomorrow morning, and the morning after that. Nothing here is hidden or improper; it is visible on the balance sheet, which is the point. The fragility is not that the position is secret. It is that it must be refinanced every single day.',
    },

    {
      id: 'of-the-unwind',
      type: 'order_flow',
      tags: ['repo', 'leverage', 'fire-sales'],
      xp: 25,
      prompt: 'Bond prices fall sharply. Put the unwind in order.',
      instructions: 'First step at the top',
      explanation:
        'Each step is individually rational and collectively ruinous. The money fund raising its haircut is prudent risk management — it is protecting the shareholders whose dollar it promised to keep stable. The fund selling bonds to meet the call is the only thing it can do. But every levered holder faces the same call on the same morning, and they all sell the same asset into the same bid. Collateral makes each lender safe and turns the system procyclical: exactly when prices fall, the amount you may borrow against them falls too. This is the mechanism that made the safest asset on earth briefly hard to sell in March 2020, and it is what `dash-for-cash` picks up next.',
      events: [
        {
          id: 'prices',
          label: 'Treasury prices fall',
          detail: 'The collateral is worth less than it was yesterday',
        },
        {
          id: 'haircut',
          label: 'The money fund raises its haircut',
          detail: 'It will now lend only 96%, not 98% — prudent, and the right thing for its own shareholders',
        },
        {
          id: 'call',
          label: 'The hedge fund must find more capital by this afternoon',
          detail: 'The same bonds now support a smaller loan, and the gap is due today',
        },
        {
          id: 'sell',
          label: 'It sells bonds to raise the cash',
          detail: 'The fastest way to free capital is to shrink the position',
        },
        {
          id: 'everyone',
          label: 'Every other levered holder is doing the same thing',
          detail: 'Same haircut, same morning, same asset, same direction',
        },
        {
          id: 'spiral',
          label: 'Selling pushes prices down again, and haircuts rise again',
          detail: 'The loop feeds itself until somebody with an unlimited balance sheet steps in',
        },
      ],
      correctOrder: ['prices', 'haircut', 'call', 'sell', 'everyone', 'spiral'],
    },

    {
      id: 'mc-safe-lender-fragile-system',
      type: 'multiple_choice',
      tags: ['repo', 'financial-stability'],
      xp: 20,
      prompt:
        'Through all of that, the money fund lost nothing. So why do regulators worry about this trade at all?',
      explanation:
        'Because safety was not removed, it was moved. The collateral and the haircut genuinely protect the lender — that part works. What they do is transfer the risk to the borrower and, through the borrower’s forced selling, into the price of the asset itself. Every lender individually protecting itself is what produces the fire sale. That is why supervisors watch the size of the levered position rather than the health of the money funds: the funds are fine, and their being fine is precisely what makes everybody sell at once.',
      options: [
        {
          id: 'transferred',
          label: 'The risk moved into forced selling rather than disappearing',
        },
        {
          id: 'hidden',
          label: 'The positions are hidden from regulators and supervisors',
          feedback:
            'They are on a balance sheet and increasingly reported. The exercise you just posted was not a secret — the fragility is structural, not concealed.',
        },
        {
          id: 'fraud',
          label: 'This kind of leverage is improper and ought to be banned',
          feedback:
            'Nothing here breaks a rule. Levered relative-value trading is a legitimate business that usually makes Treasury markets more liquid, not less. The problem appears only when everyone unwinds together.',
        },
        {
          id: 'mmfrisk',
          label: 'Money funds might break the buck and lose investor capital',
          feedback:
            'In this episode the money funds were the ones who came through intact — that is the point. Their safety is what forced the selling elsewhere.',
        },
      ],
      correctOptionId: 'transferred',
    },
  ],
});
