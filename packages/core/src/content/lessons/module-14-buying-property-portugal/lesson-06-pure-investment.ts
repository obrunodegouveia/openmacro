import { defineLesson } from '../../schema';

/**
 * The third question: not "does it cover its costs" and not "does it beat
 * renting", but "is it a good investment" — bought to make money, not to live
 * in.
 *
 * Different tax throughout. IMT falls under the 2026 Table III schedule, which
 * charges from the first euro: €11,605.50 on €300,000 against €10,542.04 for a
 * permanent home. There is no IMT Jovem relief and no reinvestment exemption
 * on the gain. Rent is Category F at 25%, or 10% on a residential contract of
 * three years or more with rent up to €2,300 a month. Half the gain is
 * aggregated into IRS at 13%–48%, with the acquisition value uplifted by an
 * inflation coefficient for anything held over 24 months.
 */
export const pureInvestmentLesson = defineLesson({
  id: 'property-as-a-pure-investment',
  title: 'Bought to Make Money, Not to Live In',
  subtitle:
    'No rent saved, different tax, and one finding that reverses what most people assume about leverage.',
  icon: '📈',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'mc-different-table',
      type: 'multiple_choice',
      tags: ['portugal', 'imt', 'investment'],
      xp: 30,
      prompt:
        'You buy the same €300,000 flat, but not to live in. IMT was €10,542. What is it now?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'higher-table',
          label: '€11,605 — a different schedule that charges from the first euro',
        },
        {
          id: 'same',
          label: 'The same — IMT does not care what you do with it',
          feedback:
            'It cares a great deal. There are two tables, and the permanent-residence one exempts the first €106,346 while the other charges 1% on it.',
        },
        {
          id: 'double',
          label: 'Double, as a second-home penalty',
          feedback:
            'The gap is about €1,063, not €10,000. It is a real difference and a small one — the large differences for an investor are elsewhere.',
        },
        {
          id: 'lower',
          label: 'Lower, since investment property is a business asset',
        },
      ],
      correctOptionId: 'higher-table',
      explanation:
        'About €1,063 more, which is the least of it. Buying as an investment also forfeits the IMT Jovem exemption entirely, and — far more expensive — the reinvestment relief on the eventual gain, which only exists for a permanent home. The transfer tax is the smallest of the three differences and the only one anybody mentions.',
    },
    {
      id: 'sim-buy-to-let',
      type: 'interactive_sim',
      tags: ['portugal', 'investment', 'leverage', 'yield'],
      xp: 40,
      currency: 'EUR',
      prompt: 'Ten years, no rent saved, and a decision about the tenant.',
      instructions: 'Move the rental yield and how much of it you borrow',
      narrative:
        'The same €300,000 flat, held ten years, appreciating 5% a year — not the decade’s 10.7%. You do not live in it, so nothing is credited for rent avoided. A zero yield means you left it empty for the appreciation alone. Capital gains tax is in, at 50% of the gain against a marginal 35%, with the acquisition value uplifted for inflation.',
      constants: {
        price: 300000,
        loanRate: 0.0425,
        loanTerm: 30,
        years: 10,
        entryCosts: 15005.5,
        carryAnnual: 4100,
        sellingRate: 0.0615,
        growth: 0.05,
        rentTax: 0.25,
        cgtMarginal: 0.35,
        inflCoefficient: 0.025,
      },
      sliders: [
        {
          key: 'grossYield',
          label: 'Gross rental yield',
          min: 0,
          max: 0.07,
          step: 0.005,
          defaultValue: 0.05,
          format: 'percent',
          hint: 'Zero means an empty flat held purely for appreciation.',
        },
        {
          key: 'ltv',
          label: 'Share of the price borrowed',
          min: 0,
          max: 0.8,
          step: 0.1,
          defaultValue: 0.7,
          format: 'percent',
          hint: 'Banks lend less on an investment property, and at a wider spread.',
        },
      ],
      readouts: [
        {
          key: 'imt',
          label: 'IMT on the purchase',
          formulaId: 'pt_imt_investment',
          format: 'currency',
          caption: '2026 Table III — not a permanent home',
        },
        {
          key: 'net',
          label: 'Net position after ten years',
          formulaId: 'buy_to_let_net',
          format: 'currency',
          caption: 'After the debt, the taxes, the costs and the rent received',
        },
        {
          key: 'roe',
          label: 'Return on the cash you committed',
          formulaId: 'buy_to_let_return_on_equity',
          format: 'percent',
          emphasis: true,
          caption: 'This is the number leverage is supposed to move',
        },
      ],
      objective: {
        description:
          'Leave it empty and watch, then let it at 5%, and finish above a 100% return',
        requiredObservations: [{ sliderKey: 'grossYield', values: [0, 0.05] }],
        target: {
          readoutKey: 'roe',
          comparator: 'gte',
          value: 1,
        },
      },
      explanation:
        'Now push the borrowing slider at each end and watch it reverse. With the flat empty, borrowing makes the return *worse* — 31% unleveraged, 13% at 70% borrowed, and roughly nothing at 80%. With it let at 5%, borrowing makes it far better: 68% unleveraged against 138% at 70%. The crossover sits near a 2% yield. Leverage does not magnify returns; it magnifies whatever the asset is already doing, and an empty flat is doing something negative every month.',
    },
    {
      id: 'mc-why-leverage-reverses',
      type: 'multiple_choice',
      tags: ['portugal', 'leverage', 'investment'],
      xp: 35,
      prompt:
        'Why does borrowing 70% turn a 31% return into 13% on an empty flat, and a 68% return into 138% on a let one?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'interest-vs-income',
          label: 'Because leverage adds a fixed interest cost, and only income can pay it — appreciation cannot, until you sell',
        },
        {
          id: 'risk',
          label: 'Because leverage is riskier, and the model penalises risk',
          feedback:
            'There is no risk adjustment anywhere in this calculation. Everything you are seeing is arithmetic on certain cash flows, which makes the reversal more striking rather than less.',
        },
        {
          id: 'tax',
          label: 'Because interest is not deductible against the gain',
          feedback:
            'It is not deductible, and that is a real cost. But the reversal survives at any tax treatment — it is about when cash arrives, not about what is deductible.',
        },
        {
          id: 'rates',
          label: 'Because the loan rate is above the appreciation rate',
          feedback:
            'It is not: 4.25% against 5%. And even with appreciation ahead of the rate, the empty position still gets worse with leverage, because the appreciation is not cash and the interest is.',
        },
      ],
      correctOptionId: 'interest-vs-income',
      explanation:
        'This is the sentence to take away from the module. Interest is due every month in cash; appreciation shows up once, at the end, if you sell. An empty flat therefore has to fund ten years of interest out of your pocket to collect one gain, and the interest compounds against you the whole time. A let flat funds it from the tenant. The tenant servicing the debt is what makes the leverage work — not the property going up.',
    },
    {
      id: 'match-investor-tax',
      type: 'concept_match',
      tags: ['portugal', 'tax', 'investment'],
      xp: 30,
      prompt: 'Match each tax an investor meets to what it actually does.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'imt3',
          term: 'IMT, Table III',
          definition:
            'Charges from the first euro instead of exempting €106,346 — about €1,063 more here',
        },
        {
          id: 'catf',
          term: 'Category F on the rent',
          definition:
            '25%, or 10% on a residential contract of three years or more up to €2,300 a month',
        },
        {
          id: 'gains',
          term: 'Mais-valias on the sale',
          definition:
            'Half the gain at your marginal rate, with no reinvestment relief — that exists only for a home you live in',
        },
        {
          id: 'coef',
          term: 'The inflation coefficient',
          definition:
            'Uplifts the acquisition value after 24 months, so nominal gains from inflation alone are not fully taxed',
        },
      ],
      explanation:
        'The rent line is the one worth acting on. Electing a three-year contract takes the rate from 25% to 10%, which on this position is worth about twenty-five percentage points of ten-year return — more than any negotiation on the purchase price is likely to achieve, for the cost of a longer commitment to a tenant.',
    },
    {
      id: 'mc-the-real-case',
      type: 'multiple_choice',
      tags: ['portugal', 'investment', 'conclusion'],
      xp: 35,
      prompt:
        'So what is the actual case for buying property purely as an investment?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'tenant-and-inflation',
          label: 'A tenant services a debt that inflation is shrinking, while the appreciation accrues to a thin slice of your own cash',
        },
        {
          id: 'appreciation',
          label: 'Appreciation — property goes up',
          feedback:
            'The empty-flat column is the test of that claim, and it returns 13% over a decade on a leveraged position with appreciation running at 5%. Appreciation alone is the weakest version of the case.',
        },
        {
          id: 'safe',
          label: 'That it is safer than equities',
          feedback:
            'A single flat in one city, financed with debt, is not a diversified position. Ireland fell 54% and took fifteen years to recover, and a leveraged owner did not get to wait it out.',
        },
        {
          id: 'tax',
          label: 'The tax treatment is favourable',
          feedback:
            'It is worse than for a home you live in on every line — a higher IMT table, taxed rent, and no reinvestment relief on the gain.',
        },
      ],
      correctOptionId: 'tenant-and-inflation',
      explanation:
        'Three mechanisms, and only one of them is about the price going up. Someone else pays the interest, so you can hold a large asset on a small deposit. The debt is fixed in euros while the rent and the flat are not, so inflation transfers value from the lender to you — the mechanism from the debasement module, with a tenant covering the carry. And the appreciation, whatever it turns out to be, lands on your deposit rather than on the whole price. Take the tenant away and two of the three stop working, which is why an empty flat is a far worse investment than the same flat with somebody living in it.',
    },
  ],
  keyTakeaways: [
    'As an investment the tax is worse everywhere: Table III IMT, taxed rent, and no reinvestment relief on the gain.',
    'Leverage on an empty flat makes the return worse — 31% unleveraged against 13% at 70% borrowed.',
    'Let at 5%, the same leverage takes 68% to 138%. The crossover is near a 2% yield.',
    'The case is the tenant servicing a debt inflation is shrinking, not the price going up.',
  ],
});
