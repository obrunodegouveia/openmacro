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
    'The measure of importance is not what something costs. It is how much stops without it.',
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
        'In 2021 carmakers idled plants for want of semiconductors — a few euros of parts in a car costing tens of thousands. Why did the cost share not predict the damage?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'fixed-proportions',
          label: 'The inputs combine in fixed proportions — no chip, no car, at any price',
        },
        {
          id: 'price-spike',
          label: 'Chip prices rose enough to make the cars unprofitable',
          feedback:
            'Prices did rise, and a carmaker would happily have paid ten times the price for a part that is a rounding error in the bill of materials. What it could not do was buy one that did not exist.',
        },
        {
          id: 'demand',
          label: 'Car demand collapsed at the same time',
          feedback:
            'Demand was strong enough that used car prices rose sharply — an unusual signal, and one that points at supply rather than demand.',
        },
        {
          id: 'mismanagement',
          label: 'The carmakers had mismanaged their inventories',
          feedback:
            'Just-in-time did amplify it, and that is a real lesson about buffers. But even with generous stocks the arithmetic holds: output is capped by the scarcest necessary input.',
        },
      ],
      correctOptionId: 'fixed-proportions',
      explanation:
        'Where inputs are complements rather than substitutes, output follows the scarcest one and the cost share tells you nothing at all. This is Leontief’s point, and it is why criticality and size come apart so violently. The cheapest necessary component in a process is exactly as capable of stopping it as the most expensive.',
    },
    {
      id: 'sim-criticality',
      type: 'interactive_sim',
      tags: ['criticality', 'leontief'],
      xp: 40,
      constants: {},
      prompt: 'How much output does a missing input actually cost?',
      instructions: 'Take substitutability to zero and watch the two estimates separate',
      narrative:
        'An input takes some share of the economy’s costs. Some of it goes missing. The intuitive estimate multiplies the share by the shortfall — if energy is 5% of costs and 20% of it is gone, that is 1% of output. The other estimate assumes inputs are complements: output is capped by the scarcest one, so the loss is the shortfall itself, less whatever can be worked around in the time available. Which one is right depends entirely on the last slider.',
      sliders: [
        {
          key: 'inputShare',
          label: 'The input’s share of costs',
          min: 0.005,
          max: 0.2,
          step: 0.005,
          defaultValue: 0.05,
          format: 'percent',
          hint: 'Semiconductors are well under 1% of world output; energy a few per cent',
        },
        {
          key: 'shortfall',
          label: 'How much of it is missing',
          min: 0,
          max: 0.5,
          step: 0.05,
          defaultValue: 0.2,
          format: 'percent',
          hint: 'The 1973 embargo removed a single-digit percentage of world supply',
        },
        {
          key: 'substitutability',
          label: 'What can be worked around in the time available',
          min: 0,
          max: 1,
          step: 0.05,
          defaultValue: 0.3,
          format: 'percent',
          hint: 'Near zero in a month; much higher over a decade',
        },
      ],
      readouts: [
        {
          key: 'realLoss',
          label: 'Output lost',
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
          label: 'How far out that guess is',
          formulaId: 'criticality_ratio',
          format: 'multiplier',
          caption: 'the criticality ratio',
        },
      ],
      objective: {
        description: 'Find a setting where the cost share understates the loss by more than twenty times',
        requiredObservations: [{ sliderKey: 'substitutability', values: [0, 1] }],
        target: { readoutKey: 'ratio', comparator: 'gte', value: 20 },
      },
      explanation:
        'At full substitutability the loss is nothing — anything can stand in for the missing input, so its absence is an inconvenience. Take that to zero and the loss is the shortfall itself, however trivial the input’s cost. The gap between the two readouts is the whole of criticality, and it is why a sector can be small enough to ignore in the national accounts and large enough to cause a recession.',
    },
    {
      id: 'order-propagation',
      type: 'order_flow',
      tags: ['supply-chains', 'criticality'],
      xp: 30,
      prompt: 'Put the 2021 chip shortage in order, from cancelled orders to idle plants.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'cancel', label: 'Carmakers cut chip orders as the pandemic hits', detail: 'Demand looked like it was collapsing' },
        { id: 'reallocate', label: 'Foundries reallocate the freed capacity to consumer electronics' },
        { id: 'rebound', label: 'Car demand comes back faster than forecast' },
        { id: 'queue', label: 'Carmakers return to a queue that is now years long', detail: 'A fab takes years to build, not months' },
        { id: 'idle', label: 'Assembly lines stop for want of a few euros of parts' },
        { id: 'used', label: 'Used car prices rise sharply', detail: 'The scarcity surfaces where supply cannot respond' },
      ],
      correctOrder: ['cancel', 'reallocate', 'rebound', 'queue', 'idle', 'used'],
      explanation:
        'Nothing here required anyone to behave irrationally. Each step follows from the last, and the damage came from the one property that no participant could change in the time available: fabrication capacity takes years to add. Criticality is as much about replacement time as about substitution — an input you can replace next week is not critical however much you use.',
    },
    {
      id: 'match-three-properties',
      type: 'concept_match',
      tags: ['criticality'],
      xp: 30,
      prompt: 'Three properties decide whether a small sector can stop a large economy. Match each to what it asks.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'substitution',
          term: 'Substitutability',
          definition: 'Can anything else do this job — and at what loss of output?',
        },
        {
          id: 'upstream',
          term: 'Position',
          definition: 'How many other processes have this one inside them, before anything final is made?',
        },
        {
          id: 'replacement',
          term: 'Replacement time',
          definition: 'If supply stops today, how long until it can come from somewhere else?',
        },
      ],
      explanation:
        'Score anything on those three and you have its criticality. Payments infrastructure costs almost nothing and scores badly on all three. Restaurants are a far larger share of spending and score well on all three — closing every restaurant in a country is a catastrophe for the people in them and not a supply shock to anything else.',
    },
  ],
  keyTakeaways: [
    'Where inputs are complements, output follows the scarcest one and the cost share predicts nothing.',
    'Criticality is substitutability, position in the chain, and replacement time.',
    'A sector can be too small to notice in GDP and large enough to cause a recession.',
  ],
});
