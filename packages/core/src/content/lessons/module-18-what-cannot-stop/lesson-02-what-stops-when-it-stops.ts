import { defineLesson } from '../../schema';

/**
 * The test that makes criticality measurable: not what a thing costs, but
 * how much output stops when it is missing.
 *
 * The simulation is a Leontief production function with an explicit
 * substitutability dial, because the whole distinction between a cost share
 * and a criticality ratio lives in whether inputs can stand in for one
 * another.
 *
 * Figures: the 2021 semiconductor shortage idled several million vehicles
 * worldwide, on an industry whose global revenue is under one per cent of
 * world output; the Ever Given blocked the Suez Canal for six days in March
 * 2021, a route carrying something over a tenth of world trade.
 */
export const whatStopsWhenItStopsLesson = defineLesson({
  id: 'what-stops-when-it-stops',
  title: 'A €4 Part and a €30,000 Car',
  subtitle:
    'How important something is does not depend on what it costs. It depends on how much stops without it.',
  icon: '🔌',
  difficulty: 'core',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'mc-chips',
      type: 'multiple_choice',
      tags: ['criticality', 'supply-chains'],
      xp: 25,
      prompt:
        'In 2021, car factories stopped because they could not get computer chips. The chips cost a few euros in a car worth tens of thousands. Why did their small cost not predict the damage?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'fixed-proportions',
          label: 'Every car needs its chips — no chip means no car, whatever you pay',
        },
        {
          id: 'price-spike',
          label: 'Chip prices rose so much that the cars lost money',
          feedback:
            'Prices did rise. But a carmaker would happily pay ten times more for such a cheap part. What it could not do was buy chips that did not exist.',
        },
        {
          id: 'demand',
          label: 'Car demand collapsed at the same time',
          feedback:
            'Demand was so strong that used car prices rose sharply. That points to a supply problem, not a demand problem.',
        },
        {
          id: 'mismanagement',
          label: 'The carmakers had managed their stocks of parts badly',
          feedback:
            'Keeping very small stocks did make it worse, and that is a real lesson. But even with big stocks, the rule holds: you can only make as much as your scarcest needed part allows.',
        },
      ],
      correctOptionId: 'fixed-proportions',
      explanation:
        'When every part is needed and none can replace another, production is limited by the scarcest part. Its cost tells you nothing. The economist Leontief made this point. The cheapest needed part can stop production just as well as the most expensive one.',
    },
    {
      id: 'sim-criticality',
      type: 'interactive_sim',
      tags: ['criticality', 'leontief'],
      xp: 40,
      constants: {},
      prompt: 'How much production is really lost when an input goes missing?',
      instructions: 'Move the last slider to zero and watch the two estimates move apart',
      narrative:
        'An input (like energy) is a share of the economy’s costs. Some of it goes missing. The easy guess multiplies the two: if energy is 5% of costs and 20% of it is gone, you lose 1% of production. The other view says every input is needed, so production is limited by the scarcest one. Then you lose the whole missing share, minus whatever you can work around in time. Which view is right depends on the last slider.',
      sliders: [
        {
          key: 'inputShare',
          label: 'The input’s share of costs',
          min: 0.005,
          max: 0.2,
          step: 0.005,
          defaultValue: 0.05,
          format: 'percent',
          hint: 'Computer chips are well under 1% of world production; energy is a few per cent',
        },
        {
          key: 'shortfall',
          label: 'How much of it is missing',
          min: 0,
          max: 0.5,
          step: 0.05,
          defaultValue: 0.2,
          format: 'percent',
          hint: 'The 1973 oil embargo removed less than 10% of world supply',
        },
        {
          key: 'substitutability',
          label: 'What can be worked around in the time available',
          min: 0,
          max: 1,
          step: 0.05,
          defaultValue: 0.3,
          format: 'percent',
          hint: 'Almost nothing in a month; much more over ten years',
        },
      ],
      readouts: [
        {
          key: 'realLoss',
          label: 'Production lost',
          formulaId: 'output_lost_to_shortfall',
          format: 'percent',
          emphasis: true,
          caption: 'shortfall × (1 − substitutability)',
        },
        {
          key: 'guess',
          label: 'What the cost share predicts',
          formulaId: 'cost_share_estimate',
          format: 'percent',
          caption: 'share × shortfall',
        },
        {
          key: 'ratio',
          label: 'How wrong that guess is',
          formulaId: 'criticality_ratio',
          format: 'multiplier',
          caption: 'the criticality ratio: real loss ÷ guess',
        },
      ],
      objective: {
        description: 'Find a setting where the real loss is more than twenty times the guess',
        requiredObservations: [{ sliderKey: 'substitutability', values: [0, 1] }],
        target: { readoutKey: 'ratio', comparator: 'gte', value: 20 },
      },
      explanation:
        'At 100% the loss is zero: something else can do the missing input’s job, so its absence is only a nuisance. At 0% you lose the whole missing share, however cheap the input is. The gap between the two numbers is what “critical” means. It is why a sector can be too small to notice in GDP and still cause a recession.',
    },
    {
      id: 'order-propagation',
      type: 'order_flow',
      tags: ['supply-chains', 'criticality'],
      xp: 30,
      prompt: 'Put the 2021 chip shortage in order, from cancelled orders to stopped factories.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'cancel', label: 'Carmakers cut chip orders as the pandemic hits', detail: 'It looked like nobody would buy cars' },
        { id: 'reallocate', label: 'Chip factories sell the spare chips to phone and laptop makers' },
        { id: 'rebound', label: 'People start buying cars again sooner than expected' },
        { id: 'queue', label: 'Carmakers go back to the chip makers and find a long queue', detail: 'A chip factory takes years to build' },
        { id: 'idle', label: 'Car factories stop, missing a few euros of parts' },
        { id: 'used', label: 'Used car prices rise sharply', detail: 'The shortage shows up where supply cannot grow quickly' },
      ],
      correctOrder: ['cancel', 'reallocate', 'rebound', 'queue', 'idle', 'used'],
      explanation:
        'Nobody acted foolishly here. Each step follows from the one before. The damage came from one thing nobody could change quickly: new chip factories take years to build. So being critical is also about time. An input you can replace next week is not critical, however much of it you use.',
    },
    {
      id: 'match-three-properties',
      type: 'concept_match',
      tags: ['criticality'],
      xp: 30,
      prompt: 'Three things decide whether a small sector can stop a big economy. Match each one to the question it asks.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'substitution',
          term: 'Substitutability',
          definition: 'Can anything else do this job, and how much production is lost if it does?',
        },
        {
          id: 'upstream',
          term: 'Position',
          definition: 'How many other products need this one before anything is finished?',
        },
        {
          id: 'replacement',
          term: 'Replacement time',
          definition: 'If supply stops today, how long until we can get it from somewhere else?',
        },
      ],
      explanation:
        'Score anything on these three and you know how critical it is. The systems that move payments cost very little, but score badly on all three. Restaurants are a much bigger share of spending, but score well on all three. Closing every restaurant would be a disaster for the people who work there, but no other business would stop.',
    },
  ],
  keyTakeaways: [
    'When every input is needed, production is limited by the scarcest one, and its cost tells you nothing.',
    'How critical something is depends on three things: whether it can be replaced, where it sits in the chain, and how long replacing it takes.',
    'A sector can be too small to notice in GDP and still big enough to cause a recession.',
  ],
});
