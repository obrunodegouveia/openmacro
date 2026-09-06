import { defineLesson } from '../../schema';

/**
 * US federal figures, from the published series: total public debt
 * $39,065,421m and 122.59% of GDP (Q1 2026); federal interest payments running
 * at $1,247bn a year (Q2 2026); the FY2025 deficit $1,774,684m. Those imply
 * GDP near $31.9tn, interest at about 3.9% of GDP, and interest absorbing
 * roughly seventy cents of every dollar borrowed.
 */
export const theArithmeticLesson = defineLesson({
  id: 'the-arithmetic-of-the-debt',
  title: 'Thirty-Nine Trillion, and What It Costs',
  subtitle:
    'The sustainability argument is one line of arithmetic. Run it yourself and the positions stop being opinions.',
  icon: '🧾',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-interest-scale',
      type: 'multiple_choice',
      tags: ['debt', 'fiscal'],
      xp: 20,
      prompt:
        'US federal interest payments are running at about $1.25 trillion a year against a deficit of roughly $1.77 trillion. What does that ratio mean?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'seventy-cents',
          label: 'About seventy cents of every borrowed dollar goes to servicing what was already borrowed',
        },
        {
          id: 'nearly-balanced',
          label: 'The budget is nearly balanced once you ignore interest',
          feedback:
            'The primary deficit — before interest — is around half a trillion, which is not balance. But you have spotted the right decomposition: the primary balance and the interest bill are two different problems.',
        },
        {
          id: 'sustainable',
          label: 'Nothing in particular — interest is a normal budget line',
          feedback:
            'It is a normal line that has quadrupled in a decade and now exceeds defence spending. Normal lines do not usually do that.',
        },
        {
          id: 'default',
          label: 'The government is close to being unable to pay',
          feedback:
            'A government borrowing in a currency it issues does not face that constraint in the way a household does. The constraint is what it costs to keep doing it, and who is willing to hold the paper — not the arithmetic of running out.',
        },
      ],
      correctOptionId: 'seventy-cents',
      explanation:
        'Interest at about 3.9% of GDP is a claim on output that buys nothing new — no road, no soldier, no pension. It is the price of decisions already taken. That is why the level of the debt matters less than what it costs to carry, and why the next screen is about a single subtraction.',
    },

    {
      id: 'sim-debt-dynamics',
      type: 'interactive_sim',
      tags: ['debt', 'fiscal', 'sustainability'],
      xp: 35,
      prompt: 'Run the debt forward ten years.',
      instructions: 'Move the interest rate and the primary balance, and read the ratio',
      narrative:
        'Federal debt is 122.6% of GDP. Nominal growth is held at 4%. Everything then turns on r − g: when the interest rate on the stock exceeds the growth rate of the economy, the ratio climbs on its own, before anyone decides to spend a cent.',
      constants: {
        debtRatio: 1.2259,
        growthRate: 0.04,
        years: 10,
      },
      sliders: [
        {
          key: 'interestRate',
          label: 'Average interest rate on the debt (r)',
          min: 0.02,
          max: 0.07,
          step: 0.005,
          defaultValue: 0.035,
          format: 'percent',
          hint: '$1.25tn of interest on $39tn is about 3.2% — and it rises as old low-coupon debt matures.',
        },
        {
          key: 'primaryBalance',
          label: 'Primary balance, before interest',
          min: -0.05,
          max: 0.03,
          step: 0.005,
          defaultValue: -0.02,
          format: 'percent',
          hint: 'Negative is a deficit. The US has run one nearly every year since 2002.',
        },
      ],
      readouts: [
        {
          key: 'ratio',
          label: 'Debt as a share of GDP, ten years out',
          formulaId: 'debt_ratio_after',
          format: 'percent',
          emphasis: true,
          caption: 'Rolled forward one year at a time',
        },
        {
          key: 'snowball',
          label: 'Added each year by r − g alone',
          formulaId: 'debt_snowball',
          format: 'percent',
          caption: 'Before any spending decision. Negative means the debt melts on its own.',
        },
      ],
      objective: {
        description:
          'Compare a 3.5% interest rate with 6%, and leave the ratio at 160% or higher',
        requiredObservations: [
          { sliderKey: 'interestRate', values: [0.035, 0.06] },
        ],
        target: {
          readoutKey: 'ratio',
          comparator: 'gte',
          value: 1.6,
        },
      },
      explanation:
        'Two findings are worth keeping. First, r − g does more work than the deficit: at 2% interest the ratio falls even while borrowing 2% of GDP a year, and at 6% it climbs even with the primary budget balanced. Second, nothing here is a matter of opinion — the disagreement in public about sustainability is almost entirely a disagreement about what r and g will be, not about the arithmetic that turns them into a path.',
    },

    {
      id: 'mc-r-minus-g',
      type: 'multiple_choice',
      tags: ['debt', 'sustainability'],
      xp: 20,
      prompt:
        'For two decades r was below g and debt ratios drifted down without anyone balancing a budget. What made that era end?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'rates-rose',
          label: 'Rates rose, and the stock is refinancing into them as old debt matures',
        },
        {
          id: 'spending',
          label: 'Governments started spending more',
          feedback:
            'They did. But the snowball term is about r and g, not about spending — and it turned positive in countries whose primary balances barely moved.',
        },
        {
          id: 'growth-collapsed',
          label: 'Growth collapsed',
          feedback:
            'Nominal growth has been reasonable. What changed was the other side of the subtraction.',
        },
        {
          id: 'accounting',
          label: 'A change in how the debt is measured',
        },
      ],
      correctOptionId: 'rates-rose',
      explanation:
        'This is the slow part, and the reason it is easy to miss. A government does not refinance its whole stock at once — debt issued at 1% matures gradually and is replaced at whatever the market charges now. Interest costs therefore keep climbing for years after rates stop rising, which is exactly what $1.25 trillion a year and still growing represents.',
    },

    {
      id: 'mc-three-exits',
      type: 'multiple_choice',
      tags: ['debt', 'fiscal', 'inflation'],
      xp: 20,
      prompt:
        'A debt ratio is rising and the primary deficit is politically fixed. Historically, which exit gets used?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'austerity',
          label: 'Sustained primary surpluses over a decade or more',
          feedback:
            'It has been done — post-war Britain, Belgium, Canada in the 1990s. It is the rarest of the four, because it requires a decade of governments agreeing with each other.',
        },
        {
          id: 'growth',
          label: 'Growth fast enough to outrun the interest bill',
          feedback:
            'The best outcome and the least controllable. No government has ever chosen it and reliably got it.',
        },
        {
          id: 'inflation',
          label: 'Inflation, which shrinks the real value of a nominal stock without a vote',
        },
        {
          id: 'default',
          label: 'Outright default on domestic debt',
          feedback:
            'It happens, but it is the rarest for debt issued in a currency the government controls — because the third option is always available and costs less politically.',
        },
      ],
      correctOptionId: 'inflation',
      explanation:
        'There are four exits: grow out of it, tax and cut your way out of it, inflate it away, or default. Only two are decisions a single government can take, and of those two, only one requires nothing to be voted on. That is not a prediction about any particular country — it is an observation about which door has been used most often, and why the first lesson in this module matters.',
    },
  ],
  keyTakeaways: [
    'US federal debt is $39.1tn, 122.6% of GDP, with interest running at $1.25tn a year — about 3.9% of GDP.',
    'Interest absorbs roughly seventy cents of every dollar currently being borrowed.',
    'r − g drives the path more than the deficit does: the sign of that subtraction decides whether debt compounds or melts.',
    'Of the four ways out, inflation is the only one that needs no vote — which is why it is the one most often used.',
  ],
});
