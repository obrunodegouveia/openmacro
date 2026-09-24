import { defineLesson } from '../../schema';

/**
 * The central claim of the module, stated precisely enough to be tested:
 * productivity growth is the only variable that improves the debt path and
 * the inflation path at the same time. Also the honest caveat about AI.
 */
export const theOnlyLeverThatHelpsTwiceLesson = defineLesson({
  id: 'the-only-lever-that-helps-twice',
  title: 'The Only Lever That Helps Twice',
  subtitle:
    'Everything else that shrinks a debt makes inflation worse, and everything that fights inflation makes the debt worse. Productivity is the single exception, which is why so much rests on it.',
  icon: '⚙️',
  difficulty: 'advanced',
  estimatedMinutes: 14,
  /**
   * The decomposition this lesson turns on — output per hour as capital,
   * human capital and the residual — done once, slowly, before the
   * challenges ask anything about it. `match-growth-sources` is the same
   * split.
   */
  video: {
    url: 'https://www.youtube.com/watch?v=yrPrzY3rmQM',
    minutes: 5,
    source: 'Khan Academy — The aggregate production function and growth (CC BY-NC-SA)',
  },
  challenges: [
    {
      id: 'mc-why-twice',
      type: 'multiple_choice',
      tags: ['productivity', 'inflation', 'sovereign-debt'],
      xp: 40,
      prompt: 'Why does productivity growth help the debt ratio and inflation at the same time?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'both',
          label: 'It raises GDP and lowers the cost of making each thing',
        },
        {
          id: 'demand',
          label: 'It reduces demand across the whole economy',
          feedback:
            'It does not. A productivity boom usually raises investment and demand — the 1990s were not a slump. The disinflation comes from the supply side growing faster than demand, not from demand shrinking.',
        },
        {
          id: 'wages',
          label: 'It holds wage growth down for longer',
          feedback:
            'The opposite: productivity growth is what makes rising real wages possible without inflation. What matters for prices is wages relative to output per hour.',
        },
        {
          id: 'rates',
          label: 'It lets the central bank cut interest rates sooner',
          feedback:
            'A consequence rather than the mechanism, and an ambiguous one — faster growth can raise the neutral rate. The direct effects are the two in the answer.',
        },
      ],
      correctOptionId: 'both',
      explanation:
        'Two separate channels from one variable. On the debt side, productivity is most of real growth, real growth is most of nominal growth, and nominal growth is the g that has to beat r. On the price side, what drives costs is not wages but unit labour costs — wages divided by output per hour. If pay rises 4% and each hour produces 4% more, the cost of making a thing has not moved and there is nothing to pass on. That is why the late 1990s ran unemployment below anything thought safe with inflation falling: output per hour was rising fast enough to absorb the pay rises.',
    },
    {
      id: 'sim-double-dividend',
      type: 'interactive_sim',
      tags: ['productivity', 'inflation', 'sovereign-debt'],
      xp: 55,
      constants: {
        debtRatio: 1,
        interestRate: 0.035,
        inflationRate: 0.02,
      },
      prompt: 'One slider moves both the inflation number and the debt number. Find it.',
      instructions: 'Drive productivity from one end to the other and watch both readouts',
      narrative:
        'Inflation is held at 2% and the debt costs 3.5% — both fixed, so you cannot solve anything by assuming them away. Unit labour costs are wage growth minus productivity growth: the pressure firms actually feel. Nominal growth is productivity and workforce and prices compounded together. The snowball is what the debt ratio does per year on its own, with no budget decision in it at all.',
      sliders: [
        {
          key: 'productivityGrowth',
          label: 'Productivity growth',
          min: 0,
          max: 0.04,
          step: 0.0025,
          defaultValue: 0.015,
          format: 'percent',
          hint: 'US output per hour has averaged roughly 1.5% since 2005',
        },
        {
          key: 'wageGrowth',
          label: 'Wage growth',
          min: 0,
          max: 0.08,
          step: 0.0025,
          defaultValue: 0.04,
          format: 'percent',
        },
        {
          key: 'labourForceGrowth',
          label: 'Workforce growth',
          min: -0.005,
          max: 0.015,
          step: 0.0025,
          defaultValue: 0.005,
          format: 'percent',
          hint: 'Births and immigration, decades in advance',
        },
      ],
      readouts: [
        {
          key: 'ulc',
          label: 'Unit labour cost growth',
          formulaId: 'unit_labour_cost_growth',
          format: 'percent',
          caption: 'Wages minus productivity — the pressure on prices',
        },
        {
          key: 'growthRate',
          label: 'Nominal GDP growth',
          formulaId: 'nominal_growth_from_productivity',
          format: 'percent',
          caption: 'Productivity, workforce and prices compounded',
        },
        {
          key: 'snowball',
          label: 'Debt ratio change per year',
          formulaId: 'debt_snowball',
          format: 'percent',
          emphasis: true,
          caption: 'Negative means it falls with no decision taken',
        },
      ],
      objective: {
        description:
          'Get the debt ratio falling by at least 1 point a year while unit labour costs stay at or below 2%',
        requiredObservations: [{ sliderKey: 'productivityGrowth', values: [0, 0.04] }],
        target: { readoutKey: 'snowball', comparator: 'lte', value: -0.01 },
      },
      explanation:
        'Drag productivity alone and both numbers improve together — the only slider in this course that does. Every other route down costs somebody something: inflation taxes savers, austerity cuts spending, repression underpays lenders. Productivity growth just makes the pie larger, which is why a Treasury and a central bank can agree about it when they agree about nothing else. It is also why the stakes around whether a technology genuinely raises output per hour are fiscal stakes and not only commercial ones.',
    },
    {
      id: 'mc-the-ai-question',
      type: 'multiple_choice',
      tags: ['productivity', 'technology'],
      xp: 45,
      prompt:
        'The argument runs: American firms are extraordinarily innovative, so productivity will carry the debt. What is the honest weakness in it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'not-yet-measured',
          label: 'Spectacular firms are visible long before the productivity shows up in the data',
        },
        {
          id: 'not-innovative',
          label: 'American firms are not actually more innovative',
          feedback:
            'They plainly lead in several of the industries that matter most, and the research spending and market values are real. The weakness is not in the premise.',
        },
        {
          id: 'doesnt-matter',
          label: 'Productivity does not really affect the debt ratio',
          feedback:
            'It is the main thing that does — the previous simulation is the arithmetic. The weakness is about timing and measurement, not mechanism.',
        },
        {
          id: 'other-countries',
          label: 'Other countries innovate too',
          feedback:
            'True and mostly irrelevant. What matters for the American debt is American output per hour, not the ranking.',
        },
      ],
      correctOptionId: 'not-yet-measured',
      explanation:
        'Robert Solow said in 1987 that computers were visible everywhere except in the productivity statistics, and the measured payoff took until the mid-1990s to arrive. Electricity took longer still — factories had to be rebuilt around it before it paid. The pattern is that the firms come first, the reorganisation takes a decade or two, and the aggregate numbers move last. So the claim that innovation will carry the debt is a claim about the future that has good historical precedent and is not yet visible in the data. Holding it as a bet with a plausible basis is reasonable. Holding it as an established fact is what gets a fiscal plan into trouble, because the interest is due on a schedule and the productivity is not.',
    },
    {
      id: 'match-growth-sources',
      type: 'concept_match',
      tags: ['productivity', 'growth'],
      xp: 40,
      prompt: 'Four ways an economy grows. Match each to what it actually requires.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'hours',
          term: 'More people working',
          definition: 'Births decades ago, or immigration policy today',
        },
        {
          id: 'capital',
          term: 'More equipment per worker',
          definition: 'Investment now, paid for by saving or borrowing',
        },
        {
          id: 'tfp',
          term: 'Better use of what you have',
          definition: 'Ideas and reorganisation — the residual nobody can buy directly, from the same people and equipment',
        },
        {
          id: 'reallocation',
          term: 'The same resources in better firms',
          definition: 'Failing companies allowed to fail and capital moving on',
        },
      ],
      explanation:
        'Only the second is straightforwardly purchasable, which is the uncomfortable part: the lever most available to a government is investment, and investment is exactly what a rising interest bill squeezes. The fourth is worth dwelling on because it is the cheapest and the least discussed — a great deal of measured American productivity growth has come from resources moving out of weak firms into strong ones, which requires letting the weak ones go. Every bailout, in those terms, is a small tax on future productivity.',
    },
  ],
  keyTakeaways: [
    'Productivity raises g and lowers unit labour costs — it helps the debt and prices at once.',
    'Every other route down transfers the cost to savers, lenders or spending.',
    'The productivity payoff from a technology historically lags its arrival by a decade or more.',
    'The lever a government can buy is investment, which is what interest crowds out.',
  ],
});
