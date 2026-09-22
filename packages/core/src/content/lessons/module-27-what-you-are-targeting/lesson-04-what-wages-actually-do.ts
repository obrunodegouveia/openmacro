import { defineLesson } from '../../schema';

/**
 * Wages and prices. The lesson exists because "wages are rising" is treated
 * as an inflation statement in public argument and is not one.
 */
export const whatWagesActuallyDoLesson = defineLesson({
  id: 'what-wages-actually-do',
  title: 'A Pay Rise Is Not an Inflation Forecast',
  subtitle:
    'Wages rising 5% tells you nothing until you know what happened to output per hour and what happened to margins.',
  icon: '💷',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'sim-unit-costs',
      type: 'interactive_sim',
      tags: ['wages', 'productivity', 'inflation'],
      xp: 45,
      // Non-labour costs held fixed: the point of the exercise is the
      // interaction between pay, productivity and margins.
      constants: { otherCostGrowth: 0.02 },
      prompt: 'Work out what a pay rise does to prices.',
      instructions: 'Get implied inflation to 2% without cutting the pay rise',
      narrative:
        'What a firm must charge depends on what an hour of labour costs it per unit of output, not on what the hour costs. Pay rising 5% while output per hour rises 5% leaves the cost of making a thing unchanged. The rest is the labour share — how much of the price is labour at all — and the margin, which is the part that was argued about throughout 2022 and is genuinely in the arithmetic.',
      sliders: [
        {
          key: 'wageGrowth',
          label: 'Wage growth',
          min: 0,
          max: 0.12,
          step: 0.005,
          defaultValue: 0.055,
          format: 'percent',
        },
        {
          key: 'productivityGrowth',
          label: 'Productivity growth',
          min: -0.02,
          max: 0.04,
          step: 0.005,
          defaultValue: 0.01,
          format: 'percent',
          hint: 'Output per hour — the thing that makes a pay rise free',
        },
        {
          key: 'labourShare',
          label: 'Labour share of costs',
          min: 0.3,
          max: 0.8,
          step: 0.05,
          defaultValue: 0.6,
          format: 'percent',
        },
        {
          key: 'marginChange',
          label: 'Change in margins',
          min: -0.02,
          max: 0.03,
          step: 0.005,
          defaultValue: 0.005,
          format: 'percent',
          hint: 'Firms widening or conceding',
        },
      ],
      readouts: [
        {
          key: 'implied',
          label: 'Inflation implied by costs',
          formulaId: 'inflation_from_costs',
          format: 'percent',
          emphasis: true,
          caption: 'Labour, other costs, and margin',
        },
        {
          key: 'ulc',
          label: 'Unit labour cost growth',
          formulaId: 'unit_labour_cost_growth',
          format: 'percent',
          caption: 'Wages minus productivity',
        },
      ],
      objective: {
        description: 'Reach 2% implied inflation with wage growth still at 5.5% or above',
        requiredObservations: [{ sliderKey: 'productivityGrowth', values: [-0.02, 0.04] }],
        target: { readoutKey: 'implied', comparator: 'lte', value: 0.02 },
      },
      explanation:
        'There are two ways to get there and neither one cuts pay. Raise productivity and the unit cost falls even as the wage rises; or take it out of the margin, which is a distributional outcome rather than a monetary one. This is why "wage growth of 5.5% is incompatible with 2% inflation" is a claim with a hidden assumption — it assumes productivity growth of around 1% and a constant margin. State the assumption and the sentence becomes arguable, which it should be. Drag productivity to negative and watch the same pay rise become genuinely inflationary: that is the case where the sentence is right.',
    },
    {
      id: 'mc-spiral',
      type: 'multiple_choice',
      tags: ['wages', 'inflation'],
      xp: 40,
      prompt: 'What would actually make a wage-price spiral, as opposed to a catch-up?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'indexation',
          label: 'Settlements indexed to past inflation, round after round',
        },
        {
          id: 'high',
          label: 'Wage growth running above 5% a year',
          feedback:
            'A level tells you nothing without productivity and without what preceded it. Wages catching up after a real-terms fall are recovering lost ground, not initiating anything.',
        },
        {
          id: 'shortage',
          label: 'A persistently tight labour market',
          feedback:
            'Tightness raises wages and raises them once. A spiral needs a mechanism that regenerates the rise next year, and scarcity by itself does not.',
        },
        {
          id: 'unions',
          label: 'Strong collective bargaining institutions',
          feedback:
            'Coordinated bargaining has often delivered lower inflation, because coordinated negotiators internalise the aggregate outcome. The structure matters less than the indexation.',
        },
      ],
      correctOptionId: 'indexation',
      explanation:
        'A spiral requires a loop, and formal or habitual indexation to past inflation is the loop: this year’s prices set next year’s wages, which set next year’s prices. Italy’s scala mobile is the textbook case and its abolition in the early 1990s is the textbook demonstration. Absent that mechanism, a wage catch-up after an inflation shock is a one-off level adjustment — real wages had fallen and are being restored — and it looks alarming in the data for about two years before it stops. Telling the two apart is most of the judgement in a post-shock tightening cycle.',
    },
    {
      id: 'mc-real-wage',
      type: 'multiple_choice',
      tags: ['wages', 'real-wages'],
      xp: 30,
      prompt:
        'Inflation runs at 8%, wages rise 5.5%. A commentator calls it a wage-driven inflation. What is wrong with that?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'falling',
          label: 'Real wages fell 2.5% — labour absorbed the shock',
        },
        {
          id: 'lag',
          label: 'Wage data is published with a long lag',
          feedback:
            'It is, and that is a timing complaint. Even with perfect timing the arithmetic in the answer would still refute the claim.',
        },
        {
          id: 'average',
          label: 'Average wages hide the distribution',
          feedback:
            'They do, and the distribution matters for who was hurt. The direct refutation is simpler and does not need the distribution at all.',
        },
        {
          id: 'productivity',
          label: 'Productivity might have risen alongside',
          feedback:
            'It might, and that would make the case weaker still. The decisive point is available before you look at productivity.',
        },
      ],
      correctOptionId: 'falling',
      explanation:
        'If pay is rising more slowly than prices, labour is being paid less in real terms than before — it is taking a cut, not extracting a gain. Something else raised prices and wages are trailing it. This is not an argument that wage growth never matters; it is an argument that the direction of causation is a question with an answer in the data, and the answer in 2021–23 across most of Europe was that real wages fell substantially. A governor who gets this backwards tightens against the party that is already absorbing the loss.',
    },
    {
      id: 'match-labour-indicators',
      type: 'concept_match',
      tags: ['labour-market', 'indicators'],
      xp: 30,
      prompt: 'Four labour market indicators. Match each to what it actually tells you.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'ulc',
          term: 'Unit labour costs',
          definition: 'The only wage measure that maps directly onto prices',
        },
        {
          id: 'vacancies',
          term: 'Vacancies per unemployed worker',
          definition: 'Tightness now, and it moves before wages do',
        },
        {
          id: 'settlements',
          term: 'Negotiated settlements',
          definition: 'Wage growth already locked in for the quarters ahead',
        },
        {
          id: 'quits',
          term: 'The quit rate',
          definition: 'What workers believe about their options — an expectation with money on it',
        },
      ],
      explanation:
        'Read them in that order and you have the labour market pipeline: vacancies lead, quits confirm that workers believe the tightness, settlements convert it into contracts, and unit labour costs tell you what it does to prices. The negotiated settlements series is the one a euro area governor watches most closely, because a large share of employment there is covered by multi-year agreements — meaning a good part of next year’s cost pressure is already signed and no rate decision can reach it.',
    },
  ],
  keyTakeaways: [
    'Unit labour cost — pay minus productivity — is the wage number that maps to prices.',
    'A spiral needs indexation; a catch-up after a shock is a one-off level adjustment.',
    'Wages rising slower than prices means real wages are falling, whatever the headline says.',
    'Signed settlements are cost pressure no rate decision can reach.',
  ],
});
