import { defineLesson } from '../../schema';

/**
 * Pass-through. How much of an external price shock reaches consumer prices,
 * over what horizon, and why the second round is the only part policy can
 * actually address.
 */
export const theShockAndTheEchoLesson = defineLesson({
  id: 'the-shock-and-the-echo',
  title: 'The Shock and the Echo',
  subtitle:
    'A currency falls 20%. How much of that reaches the shops, and when? The answer decides whether you move.',
  icon: '🔊',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'sim-pass-through',
      type: 'interactive_sim',
      tags: ['pass-through', 'exchange-rate', 'inflation'],
      xp: 45,
      constants: {},
      prompt: 'How much of a currency move reaches consumer prices?',
      instructions: 'Find the combination that puts more than 4 points on inflation',
      narrative:
        'Only the imported part of the basket is exposed to the exchange rate, and only some of the currency move is passed on — importers absorb part of it in their margins, contracts are hedged for a while, and distribution and retail costs are domestic whatever happened to the currency. The pass-through coefficient is the share that arrives, and it is not a constant: it is higher in a small open economy, higher when firms expect the move to last, and much higher in a country where prices are quoted in dollars out of habit.',
      sliders: [
        {
          key: 'depreciation',
          label: 'Currency depreciation',
          min: 0,
          max: 0.5,
          step: 0.05,
          defaultValue: 0.2,
          format: 'percent',
        },
        {
          key: 'importShare',
          label: 'Imported share of the basket',
          min: 0.1,
          max: 0.6,
          step: 0.05,
          defaultValue: 0.3,
          format: 'percent',
          hint: 'A small open economy sits at the top of this range',
        },
        {
          key: 'passThrough',
          label: 'Share of the move passed on',
          min: 0.1,
          max: 1,
          step: 0.05,
          defaultValue: 0.35,
          format: 'percent',
          hint: 'Rises with credibility problems and with dollarisation',
        },
      ],
      readouts: [
        {
          key: 'effect',
          label: 'Added to inflation',
          formulaId: 'fx_pass_through',
          format: 'percent',
          emphasis: true,
          caption: 'depreciation × import share × pass-through',
        },
      ],
      objective: {
        description: 'Put more than 4 percentage points on inflation from the exchange rate alone',
        requiredObservations: [{ sliderKey: 'passThrough', values: [0.1, 1] }],
        target: { readoutKey: 'effect', comparator: 'gte', value: 0.04 },
      },
      explanation:
        'The defaults are an advanced economy: 20% depreciation adds around two points, spread over a year or more, and a central bank can reasonably look through it. Now move the three sliders to an emerging economy — a larger imported share, and pass-through above 0.7 because firms have learned that currency moves stick — and the same depreciation puts seven points on inflation within months. This is the same event requiring opposite decisions in two countries, and it is the clearest single reason the emerging-market job is not the advanced-economy job with worse data. Pass-through is itself a measure of credibility: the more people believe you will bring inflation back, the less of the shock they bother passing on.',
    },
    {
      id: 'mc-first-second-round',
      type: 'multiple_choice',
      tags: ['pass-through', 'policy'],
      xp: 40,
      prompt: 'Why does the distinction between first- and second-round effects carry so much weight?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'reachable',
          label: 'Only the second round is within reach of a rate decision',
        },
        {
          id: 'size',
          label: 'The second round is larger than the first',
          feedback:
            'It is usually smaller in the initial numbers and more persistent. Persistence is why it matters, not size.',
        },
        {
          id: 'measure',
          label: 'The second round is easier to measure',
          feedback:
            'It is considerably harder — separating an echo from a new shock is the whole difficulty of reading the data in a post-shock year.',
        },
        {
          id: 'temporary',
          label: 'First-round effects are temporary',
          feedback:
            'They often are, and a temporary effect that changes expectations leaves something permanent behind. Duration is not what makes the distinction useful.',
        },
      ],
      correctOptionId: 'reachable',
      explanation:
        'The first round is the imported price itself — the gas bill, the freight rate, the price of a euro. Raising rates does not reduce the price of gas, so tightening against the first round buys a domestic contraction and leaves the shock exactly where it was. The second round is what the economy does next: prices rising in things that use gas, wages settled to compensate, expectations drifting. That is generated domestically, it responds to the policy rate, and it is the whole of what a central bank can address. The distinction is therefore not academic — it is the difference between a tool aimed at its target and a tool aimed at nothing.',
    },
    {
      id: 'order-energy-shock',
      type: 'order_flow',
      tags: ['pass-through', 'inflation'],
      xp: 30,
      prompt: 'Order an energy shock as it moves through a price index.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'wholesale', label: 'Wholesale gas prices rise' },
        { id: 'bills', label: 'Household energy bills reprice', detail: 'On regulated or contractual schedules' },
        { id: 'inputs', label: 'Energy-intensive goods cost more to make' },
        { id: 'services', label: 'Services prices follow, through cost and through wages' },
        { id: 'base', label: 'Headline falls sharply a year later on base effects', detail: 'While the level stays high' },
      ],
      correctOrder: ['wholesale', 'bills', 'inputs', 'services', 'base'],
      explanation:
        'The last step is the trap. A year after a spike the annual comparison is against an already-high month, so headline inflation collapses towards target while prices remain at the elevated level they reached — nothing got cheaper, the arithmetic simply stopped counting the rise. A committee reading that fall as disinflation will ease into an economy where the services inflation from step four is still building. The discipline is to watch the price level and the momentum — three-month annualised rates — alongside the year-on-year number, precisely because year-on-year is at its most misleading in the twelve months after a shock.',
    },
    {
      id: 'mc-what-you-can-do',
      type: 'multiple_choice',
      tags: ['supply-shock', 'policy'],
      xp: 35,
      prompt:
        'A large supply shock hits. Policy cannot undo it. What is the actual objective of the tightening that follows?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'anchor',
          label: 'Keeping expectations anchored so the shock does not become the new level',
        },
        {
          id: 'demand',
          label: 'Reducing demand to match the reduced supply',
          feedback:
            'That describes the mechanism and states the cost as though it were the aim. Contracting demand to fit a smaller supply means accepting the loss of output rather than preventing it.',
        },
        {
          id: 'currency',
          label: 'Supporting the currency to reduce imported costs',
          feedback:
            'A useful side effect in an open economy, and not something a mandate is written against. It is a channel, not an objective.',
        },
        {
          id: 'credibility',
          label: 'Demonstrating the central bank’s resolve',
          feedback:
            'Resolve is instrumental — it matters because of what it does to expectations. Naming the mechanism rather than the signal keeps the decision honest.',
        },
      ],
      correctOptionId: 'anchor',
      explanation:
        'The output loss from a supply shock is going to happen; no monetary policy prevents it. What policy determines is whether the economy comes out the other side with the same inflation rate it went in with, or a permanently higher one that has to be removed later at a much larger cost. That is the entire objective, and it explains behaviour that looks irrational from outside — tightening into a recession the tightening cannot prevent. The alternative is not a milder recession. It is the same recession plus an unanchored inflation rate, which is the 1970s.',
    },
  ],
  keyTakeaways: [
    'Pass-through depends on the imported share and on how permanent firms think the move is.',
    'Pass-through is itself a credibility measure — belief reduces it.',
    'Only second-round effects are within reach of a rate decision.',
    'Year-on-year inflation is at its most misleading in the year after a shock.',
  ],
});
