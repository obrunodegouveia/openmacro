import { defineLesson } from '../../schema';

/**
 * The trade-off the module is really about: a rate rise fights inflation and
 * raises the interest bill, and the second effect arrives slowly through the
 * maturity ladder. The simulation is the gap between year one and the end.
 */
export const theSameRiseTwiceLesson = defineLesson({
  id: 'the-same-rise-twice',
  title: 'A Quarter Point, Counted Twice',
  subtitle:
    'The Federal Reserve raises by 25 basis points to slow inflation. The same 25 basis points raises what the Treasury owes, for years, long after the decision is forgotten.',
  icon: '⚖️',
  difficulty: 'advanced',
  estimatedMinutes: 14,
  challenges: [
    {
      id: 'mc-how-fast',
      type: 'multiple_choice',
      tags: ['rates', 'sovereign-debt'],
      xp: 40,
      prompt:
        'The Fed raises rates by a quarter point. How quickly does the Treasury’s interest bill rise by the same proportion?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'gradual',
          label: 'Gradually, as existing bonds mature and get refinanced at the new rate',
        },
        {
          id: 'immediately',
          label: 'Immediately — all the debt reprices',
          feedback:
            'That would be true of a floating-rate loan. Almost all of the debt is fixed-rate bonds issued years ago at whatever the rate was then, and those coupons do not change.',
        },
        {
          id: 'never',
          label: 'It does not — the coupons on existing bonds are fixed',
          feedback:
            'Existing coupons are fixed, and the debt has to be rolled over when it matures. Roughly a sixth of the American stock matures every year and comes back at current rates.',
        },
        {
          id: 'next-budget',
          label: 'At the start of the next fiscal year',
          feedback:
            'Budgets are annual; refinancing is continuous. The bill rises a little every month as bills and notes mature, not in one step.',
        },
      ],
      correctOptionId: 'gradual',
      explanation:
        'The speed is set by the weighted average maturity of the debt — about six years for US marketable Treasuries. With a six-year average, something like a sixth of the stock is refinanced annually, so a rate rise takes roughly six years to be fully reflected in what the government pays. This cuts both ways and is genuinely underrated. It buys a government time when rates rise, and it means the cost of a tightening cycle keeps growing for years after the cycle ends. A Treasury that issued short to save money in the cheap years gets the bill much faster.',
    },
    {
      id: 'sim-interest-bill',
      type: 'interactive_sim',
      tags: ['rates', 'sovereign-debt', 'budget'],
      xp: 60,
      currency: 'USD',
      constants: {
        // The average rate the stock was carrying before the tightening cycle.
        oldRate: 0.029,
      },
      prompt: 'What does a tightening cycle actually cost the budget, and when?',
      instructions: 'Move the years slider from 1 to 15 and watch the bill catch up',
      narrative:
        'The stock was carrying an average of 2.9% before the cycle began. Raise the new rate, then move the clock: only the debt that matures reprices, so the average creeps toward the new rate rather than jumping to it. The last readout is the one a finance minister actually looks at — interest as a share of the taxes collected, because GDP does not pay coupons.',
      sliders: [
        {
          key: 'debtStock',
          label: 'Debt held by the public',
          min: 20000000000000,
          max: 40000000000000,
          step: 1000000000000,
          defaultValue: 28000000000000,
          format: 'currency',
          hint: 'Around $28 trillion',
        },
        {
          key: 'newRate',
          label: 'Rate on newly issued debt',
          // Starts just above the 2.9% the stock was carrying, so every
          // position on this slider is a rise — which is the scenario.
          min: 0.03,
          max: 0.07,
          step: 0.0025,
          defaultValue: 0.0425,
          format: 'percent',
        },
        {
          key: 'maturityYears',
          label: 'Weighted average maturity',
          min: 2,
          max: 12,
          step: 1,
          defaultValue: 6,
          format: 'number',
          hint: 'Years — about 6 for US marketable debt',
        },
        {
          key: 'years',
          label: 'Years since the rate moved',
          min: 1,
          max: 15,
          step: 1,
          defaultValue: 1,
          format: 'number',
        },
        {
          key: 'revenue',
          label: 'Federal revenue',
          min: 3500000000000,
          max: 7000000000000,
          step: 250000000000,
          defaultValue: 5000000000000,
          format: 'currency',
          hint: 'Around $5 trillion a year',
        },
      ],
      readouts: [
        {
          key: 'effectiveRate',
          label: 'Average rate on the whole stock',
          formulaId: 'effective_rate_after_years',
          format: 'percent',
          caption: 'Creeps toward the new rate as debt rolls over',
        },
        {
          key: 'interestBill',
          label: 'Interest owed that year',
          formulaId: 'interest_bill',
          format: 'currency',
          caption: 'Stock times the average rate',
        },
        {
          key: 'interestShare',
          label: 'Share of federal revenue eaten by interest',
          formulaId: 'interest_share_of_revenue',
          format: 'percent',
          emphasis: true,
          caption: 'Every point here is a point not spent on anything else',
        },
      ],
      objective: {
        description:
          'Find a path where interest consumes 30% or more of federal revenue',
        requiredObservations: [{ sliderKey: 'years', values: [1, 15] }],
        target: { readoutKey: 'interestShare', comparator: 'gte', value: 0.3 },
      },
      explanation:
        'Two things are worth taking from this. First, the first year is cheap and the tenth is not — the same decision costs several times more once the ladder has fully rolled, which is why the fiscal consequences of a tightening cycle are usually discussed years too late. Second, look at what the share of revenue does as you push it. Interest is not a policy choice: it is contractual, it comes first, and every point of revenue it takes is a point unavailable for defence, research, infrastructure or anything else — including the investment that would raise the productivity the last lesson said we were relying on. That is the loop this module is about.',
    },
    {
      id: 'order-the-loop',
      type: 'order_flow',
      tags: ['rates', 'sovereign-debt', 'fiscal-dominance'],
      xp: 45,
      prompt: 'The uncomfortable loop, in order.',
      instructions: 'Drag into the order it happens',
      events: [
        { id: 'hike', label: 'Inflation rises, so the central bank raises rates' },
        { id: 'refinance', label: 'Maturing debt is refinanced at the higher rate' },
        { id: 'bill', label: 'The interest bill grows, year after year' },
        { id: 'squeeze', label: 'Interest crowds out investment inside the same budget' },
        { id: 'growth', label: 'Less public investment means slower productivity growth' },
        { id: 'worse', label: 'Slower growth makes the debt ratio harder to outrun' },
      ],
      correctOrder: ['hike', 'refinance', 'bill', 'squeeze', 'growth', 'worse'],
      explanation:
        'Every arrow here is real and none of it is a conspiracy — it is just what happens when a contractual claim on the budget grows. The loop is not a reason to avoid raising rates when inflation demands it, because letting inflation run has its own loop and a worse one. It is a reason to notice that monetary and fiscal policy are not separable in the way textbooks draw them, and that the cost of a tightening is paid by a different part of government from the one that decided it.',
    },
    {
      id: 'mc-fiscal-dominance',
      type: 'multiple_choice',
      tags: ['fiscal-dominance', 'central-banks'],
      xp: 45,
      prompt:
        'At what point does a large interest bill start to threaten a central bank’s independence?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'expectation',
          label: 'When markets expect rates held low to protect the budget',
        },
        {
          id: 'legally',
          label: 'When the government changes the law on independence',
          feedback:
            'That is the visible end of the process and almost never the start. The damage is done earlier, by expectations, while the statute is untouched.',
        },
        {
          id: 'ratio',
          label: 'When debt passes some critical ratio of GDP',
          feedback:
            'No such threshold has survived contact with the evidence. Japan passed every proposed line without this happening; other countries hit it at far lower ratios.',
        },
        {
          id: 'never',
          label: 'Never, so long as the bank is legally independent',
          feedback:
            'Legal independence is necessary and not sufficient. A bank that is formally free to raise rates but known to be unwilling has already lost the thing independence was for.',
        },
      ],
      correctOptionId: 'expectation',
      explanation:
        'This is fiscal dominance, and it is a belief before it is a fact. The moment investors conclude that rates will be held below where inflation warrants because the Treasury cannot afford otherwise, they price higher inflation into long bonds — which raises the interest bill, which makes the belief more reasonable. Nothing needs to be announced. It is the mirror image of the credibility the earlier modules described: an anchored expectation makes policy cheap, and an unanchored one makes it expensive, and in both cases what people expect is doing most of the work.',
    },
  ],
  keyTakeaways: [
    'A rate rise reaches the budget at the speed the debt rolls over — years, not months.',
    'The first year of a tightening cycle understates its cost several times over.',
    'Interest is contractual and comes first; it crowds out investment inside the budget.',
    'Fiscal dominance starts as an expectation, long before any law changes.',
  ],
});
