import { defineLesson } from '../../schema';

/**
 * The target variable, as an object somebody constructs. Every decision in
 * this course has been aimed at a number whose composition the course had not
 * yet opened.
 */
export const buildingTheIndexLesson = defineLesson({
  id: 'building-the-index',
  title: 'Somebody Built the Number You Are Targeting',
  subtitle:
    'Inflation is not observed. It is assembled, from a basket somebody chose, with weights somebody set, using prices somebody collected.',
  icon: '🧺',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'sim-basket',
      type: 'interactive_sim',
      tags: ['inflation', 'measurement', 'cpi'],
      xp: 45,
      // Housing is held fixed so the basket has a realistic residual without
      // giving the learner five sliders to think about at once.
      constants: { housingWeight: 0.12, housingChange: 0.05 },
      prompt: 'Build the headline number out of its parts.',
      instructions: 'Push energy to its extreme, then ask which number you would set policy on',
      narrative:
        'A consumer price index is a weighted average. The weights come from a survey of what households actually spend, so they change every year, and they differ between countries — energy is a much larger share of the basket in one euro area member than another. Everything not itemised here is the residual: services, goods, rents. Watch what a large move in a small weight does to the headline, and what it does to the rest.',
      sliders: [
        {
          key: 'energyWeight',
          label: 'Energy share of the basket',
          min: 0.03,
          max: 0.2,
          step: 0.01,
          defaultValue: 0.1,
          format: 'percent',
        },
        {
          key: 'energyChange',
          label: 'Energy prices over the year',
          min: -0.4,
          max: 1,
          step: 0.05,
          defaultValue: 0.4,
          format: 'percent',
        },
        {
          key: 'foodWeight',
          label: 'Food share of the basket',
          min: 0.08,
          max: 0.4,
          step: 0.01,
          defaultValue: 0.18,
          format: 'percent',
          hint: 'Far higher in a poorer country — the same index means a different thing',
        },
        {
          key: 'foodChange',
          label: 'Food prices over the year',
          min: -0.1,
          max: 0.4,
          step: 0.01,
          defaultValue: 0.12,
          format: 'percent',
        },
        {
          key: 'coreChange',
          label: 'Everything else',
          min: -0.02,
          max: 0.12,
          step: 0.005,
          defaultValue: 0.02,
          format: 'percent',
        },
      ],
      readouts: [
        {
          key: 'headline',
          label: 'Headline inflation',
          formulaId: 'headline_from_components',
          format: 'percent',
          emphasis: true,
          caption: 'What the newspaper prints',
        },
        {
          key: 'core',
          label: 'Excluding energy and food',
          formulaId: 'core_from_components',
          format: 'percent',
          caption: 'The same basket, rescaled',
        },
      ],
      objective: {
        description: 'Produce a headline above 10% while everything else is still running at 2%',
        requiredObservations: [{ sliderKey: 'energyChange', values: [-0.4, 1] }],
        target: { readoutKey: 'headline', comparator: 'gte', value: 0.1 },
      },
      explanation:
        'A tenth of the basket rising 40% puts four points on the headline by itself. Leave "everything else" at 2% and the economy has one inflation problem in the newspaper and none in its underlying prices — which is the euro area in 2022, and the situation every governor has to decide what to do about. Note the two constants held fixed here that are not fixed in reality: the weights are re-estimated annually from spending that the price changes themselves alter, and a household whose food share is 40% rather than 18% has experienced a different inflation rate from the one being published. The index is a national average of an experience nobody has.',
    },
    {
      id: 'mc-imputed-rent',
      type: 'multiple_choice',
      tags: ['inflation', 'measurement', 'housing'],
      xp: 40,
      prompt:
        'The euro area HICP excludes the cost of owner-occupied housing. The US CPI includes it, as owners’ equivalent rent. Why does this matter to a rate decision?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'own-policy',
          label: 'Rate rises move housing costs, so the index partly measures your own policy',
        },
        {
          id: 'bigger',
          label: 'It makes the American index larger overall',
          feedback:
            'Adding a large component changes the level and it is not the interesting part. What matters is that this particular component responds to the instrument being set.',
        },
        {
          id: 'accuracy',
          label: 'One of the two indices is simply more accurate',
          feedback:
            'Both are defensible. Imputing a rent to a house nobody rents is an estimate; excluding a third of household spending is an omission. Neither is the true number.',
        },
        {
          id: 'volatile',
          label: 'Housing costs are more volatile than other prices',
          feedback:
            'Measured shelter is among the smoothest and slowest-moving components. Its problem is the opposite — it lags, which is a different complication.',
        },
      ],
      correctOptionId: 'own-policy',
      explanation:
        'This is the one to keep. Where mortgage interest enters the index directly — as it does in the UK RPI and several others — raising rates raises measured inflation on impact, and a governor is tightening into a number their own tightening has increased. Where shelter is imputed from rents, as in the US, it arrives with a lag of a year or more, so the index keeps rising after the pressure has gone. Both are reasons to know, precisely, which construction your target is written against. The mandate says a number; the number is a methodology.',
    },
    {
      id: 'match-index-problems',
      type: 'concept_match',
      tags: ['inflation', 'measurement'],
      xp: 30,
      prompt: 'Four known biases in a price index. Match each to what it does.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'substitution',
          term: 'Substitution bias',
          definition: 'Households switch away from what rose, and a fixed basket does not',
        },
        {
          id: 'quality',
          term: 'Quality adjustment',
          definition: 'A better product at the same price is a price fall, and somebody must judge how much',
        },
        {
          id: 'outlet',
          term: 'Outlet bias',
          definition: 'Shoppers move to cheaper sellers, which the sampled price does not capture',
        },
        {
          id: 'new',
          term: 'New goods',
          definition: 'Things enter the basket long after their price has already collapsed',
        },
      ],
      explanation:
        'Every one of these biases the measured number upward relative to the cost of living, and the Boskin Commission put the total at over a percentage point for the US in 1996. That figure is contested and the direction is not. It has a direct implication for the target: a 2% target measured on an index biased up by half a point is a 1.5% target in reality, which is closer to zero true inflation than the framework intends — and a smaller buffer above the effective lower bound than anyone chose.',
    },
    {
      id: 'mc-who-decides',
      type: 'multiple_choice',
      tags: ['inflation', 'institutions'],
      xp: 30,
      prompt: 'Who constructs the index a central bank is legally required to hit?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'statistics',
          label: 'A statistical agency, independent of the central bank',
        },
        {
          id: 'cb',
          label: 'The central bank’s own economics department',
          feedback:
            'Central banks compute alternative measures — trimmed means, supercore — but not the official target index. Being able to produce your own mark would defeat the point of the target.',
        },
        {
          id: 'ministry',
          label: 'The finance ministry, as part of the budget',
          feedback:
            'The government has a direct interest in the number, because pensions and index-linked debt pay off it. Which is precisely why it is kept at arm’s length.',
        },
        {
          id: 'international',
          label: 'An international body that harmonises the method',
          feedback:
            'Eurostat harmonises the HICP methodology and national institutes collect and compute it. Harmonised rules, national production.',
        },
      ],
      correctOptionId: 'statistics',
      explanation:
        'The separation is structural and worth noticing as an institutional design, not a detail. The central bank is accountable for a number it does not produce, computed by an agency it does not control, using a method that can change — and when the method changes, the target quietly changes with it. It is the same principle as the monetary financing prohibition working in a different direction: the authority that is judged does not get to hold the ruler.',
    },
  ],
  keyTakeaways: [
    'Headline inflation is a weighted average — the weights are the measurement.',
    'A large move in a small weight can put several points on the headline alone.',
    'Where housing enters the index determines whether your own rate rises show up in it.',
    'Known biases run upward, so a 2% target is less than 2% of true inflation.',
  ],
});
