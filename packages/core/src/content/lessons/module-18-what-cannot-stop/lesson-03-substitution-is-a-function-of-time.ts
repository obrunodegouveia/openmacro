import { defineLesson } from '../../schema';

/**
 * Why the same shock is a catastrophe over one winter and an inconvenience
 * over a decade — and why forecasters are reliably wrong about it in both
 * directions.
 *
 * Figures: crude went from roughly $3 to around $12 through the 1973-74
 * embargo and from about $14 to about $35 across 1979-80. OECD economies now
 * use roughly half the energy per unit of output that they used in 1973.
 * Russian pipeline gas was over 40% of EU gas imports before 2022 and under
 * a tenth by the end of that year, against an EU demand-reduction target of
 * 15%.
 */
export const substitutionIsAFunctionOfTimeLesson = defineLesson({
  id: 'substitution-is-a-function-of-time',
  title: 'The Same Shock, Twice, With Different Endings',
  subtitle:
    'Nothing substitutes in a month and almost everything substitutes in a decade. Criticality is a statement about a horizon.',
  icon: '⏳',
  difficulty: 'core',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-elasticity',
      type: 'multiple_choice',
      tags: ['energy', 'elasticity'],
      xp: 30,
      prompt:
        'Oil quadrupled in 1973-74 and rich economies fell into recession. By the mid-1980s they used far less oil per unit of output. What does that contrast establish?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'horizon',
          label: 'Substitution is real and slow — it needs new equipment, buildings and habits',
        },
        {
          id: 'overstated',
          label: 'The 1974 recession was not really about oil',
          feedback:
            'It was substantially about oil, and about the policy response to it. The point is not that the shock was small but that the same shock lands differently depending on how long there is to adapt.',
        },
        {
          id: 'permanent',
          label: 'Economies permanently adapt within a year or two of any shock',
          feedback:
            'It took a decade and a large amount of capital spending — new boilers, insulation, smaller cars, different factories. Within a year or two, almost nothing had changed.',
        },
        {
          id: 'prices-fix',
          label: 'Prices solve shortages, so the shock was self-correcting',
          feedback:
            'Prices are what drove the adaptation, and they took ten years to work through the capital stock. A mechanism that needs a decade is not a correction for this winter.',
        },
      ],
      correctOptionId: 'horizon',
      explanation:
        'The elasticity of demand for an essential input is close to zero in the short run and substantial in the long run, and the difference is the capital stock. You cannot insulate a house, replace a fleet or re-tool a factory by Friday. That is why "the market will adapt" and "this will be devastating" are both true statements about the same shock, at different horizons.',
    },
    {
      id: 'mc-gas-2022',
      type: 'multiple_choice',
      tags: ['energy', 'europe', 'substitution'],
      xp: 35,
      prompt:
        'Russian pipeline gas went from over 40% of EU imports to under a tenth within a year, faster than almost anyone forecast, without the industrial collapse many predicted. What made that possible?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'many-margins',
          label: 'A dozen partial margins at once, none of them sufficient alone',
        },
        {
          id: 'renewables',
          label: 'Renewables were built fast enough to replace the missing volumes',
          feedback:
            'Build-out accelerated and it is not fast enough to have done this in a year. Most of the gap was closed by buying gas from somewhere else and by using less of it.',
        },
        {
          id: 'recession',
          label: 'A deep recession destroyed the demand',
          feedback:
            'Output held up better than forecast. Energy-intensive industry did contract hard — which is where the adjustment landed — but the aggregate recession that was widely predicted did not arrive.',
        },
        {
          id: 'overstated-dependence',
          label: 'The dependence had been exaggerated all along',
          feedback:
            'It was real, and the adjustment was expensive: gas prices spiked, governments spent heavily on support, and some industry left permanently. Surviving a shock is not evidence there was none.',
        },
      ],
      correctOptionId: 'many-margins',
      explanation:
        'Substitution rarely arrives as one replacement. It arrives as a dozen partial ones — a different supplier, a warmer building, a shifted process, an idled smelter — each small and none sufficient alone. This is why forecasts of catastrophe usually overshoot: they model the input as irreplaceable because no single replacement exists. It is also why forecasts of easy adaptation undershoot, because they price none of the disruption that each margin costs.',
    },
    {
      id: 'order-adaptation',
      type: 'order_flow',
      tags: ['energy', 'adaptation'],
      xp: 30,
      prompt: 'Put the adaptation to an energy shock in order, from the first hour to the second decade.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'price', label: 'The price jumps', detail: 'Hours. Nothing physical has changed yet' },
        { id: 'ration', label: 'The most exposed users stop first', detail: 'Weeks. Smelters and fertiliser plants idle' },
        { id: 'behaviour', label: 'Everyone turns the thermostat down' },
        { id: 'supply', label: 'Cargoes are redirected from other buyers', detail: 'Months, and at their expense' },
        { id: 'capital', label: 'New boilers, insulation and efficient equipment are installed' },
        { id: 'structure', label: 'The energy-intensive industry does not come back' },
      ],
      correctOrder: ['price', 'ration', 'behaviour', 'supply', 'capital', 'structure'],
      explanation:
        'Read the order and you can see who pays at each stage. The first responders are the users with the least room to absorb a price — which is why an energy shock is felt as an industrial shock long before it is felt as a consumer one. And the last step is the one nobody votes for: some of the adaptation is permanent relocation, and the jobs move with it.',
    },
    {
      id: 'mc-what-criticality-means',
      type: 'multiple_choice',
      tags: ['criticality', 'framing'],
      xp: 30,
      prompt: 'Given all that, what is the most precise way to state how critical an input is?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'horizon-bound',
          label: 'Output lost if it stops, at a stated horizon — without one the claim is empty',
        },
        {
          id: 'share',
          label: 'Its share of national output',
          feedback:
            'The previous lesson took this apart: a 0.6% sector idled several million cars. Share answers a different question.',
        },
        {
          id: 'strategic',
          label: 'Whether the government has designated it strategic',
          feedback:
            'Designations follow the last crisis and are lobbied for. The test has to be answerable from the structure of production, not from a list.',
        },
        {
          id: 'import',
          label: 'How much of it is imported',
          feedback:
            'Import dependence matters for who can interrupt you, and it is not the same thing. A domestically produced input with one factory and no substitute is more critical than an imported one with forty suppliers.',
        },
      ],
      correctOptionId: 'horizon-bound',
      explanation:
        'Criticality without a horizon is a slogan. Over one winter, natural gas in Europe was close to irreplaceable. Over five years it was replaceable at a cost. Over twenty it is a policy choice. Every serious argument about energy security, chips or food is really an argument about which of those three clocks is being used — and that is usually left unsaid.',
    },
  ],
  keyTakeaways: [
    'Demand for an essential input is inelastic in the short run and elastic in the long run; the difference is the capital stock.',
    'Substitution arrives as many partial margins, not one replacement.',
    'A criticality claim without a stated horizon is empty.',
  ],
});
