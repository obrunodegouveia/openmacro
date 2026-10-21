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
    'Almost nothing can be replaced in a month. Almost everything can be replaced in ten years. So “critical” always means critical over some length of time.',
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
        'The oil price rose four times over in 1973–74, and rich countries fell into recession. By the mid-1980s, they used much less oil for the same production. What does that show?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'horizon',
          label: 'Replacing oil is possible but slow — it needs new machines, buildings and habits',
        },
        {
          id: 'overstated',
          label: 'The 1974 recession was not really caused by oil',
          feedback:
            'It was caused largely by oil, and by how governments reacted. The point is not that the shock was small. It is that the same shock hits differently depending on how much time there is to adapt.',
        },
        {
          id: 'permanent',
          label: 'Economies always adapt fully within a year or two of any shock',
          feedback:
            'It took ten years and a lot of spending: new boilers, insulation, smaller cars, different factories. After a year or two, almost nothing had changed.',
        },
        {
          id: 'prices-fix',
          label: 'Prices solve shortages, so the shock fixed itself',
          feedback:
            'High prices did drive the change, but it took ten years to replace the old equipment. Something that takes ten years does not help this winter.',
        },
      ],
      correctOptionId: 'horizon',
      explanation:
        'In the short run, people can hardly use less of an essential input. In the long run, they can use much less. The difference is the equipment and buildings: you cannot insulate a house, replace your vehicles or change a factory by Friday. So “the market will adapt” and “this will be terrible” can both be true about the same shock, over different lengths of time.',
    },
    {
      id: 'mc-gas-2022',
      type: 'multiple_choice',
      tags: ['energy', 'europe', 'substitution'],
      xp: 35,
      prompt:
        'Russian pipeline gas fell from over 40% of EU gas imports to under 10% within a year. That was faster than almost anyone expected, and industry did not collapse as many had predicted. What made it possible?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'many-margins',
          label: 'Many small changes at once, none of them enough on its own',
        },
        {
          id: 'renewables',
          label: 'Wind and solar were built fast enough to replace the missing gas',
          feedback:
            'Building did speed up, but not fast enough to do this in one year. Most of the gap was closed by buying gas elsewhere and by using less.',
        },
        {
          id: 'recession',
          label: 'A deep recession cut the demand for gas',
          feedback:
            'The economy did better than expected. Industries that use a lot of energy did cut back hard, and that is where much of the change happened. But the big recession many expected did not come.',
        },
        {
          id: 'overstated-dependence',
          label: 'Europe had never really depended on Russian gas',
          feedback:
            'The dependence was real, and the change was expensive. Gas prices jumped, governments spent a lot on support, and some industry left for good. Surviving a shock does not mean there was no shock.',
        },
      ],
      correctOptionId: 'many-margins',
      explanation:
        'Replacement rarely comes as one big swap. It comes as many partial changes: a new supplier, a cooler building, a changed process, a closed factory. Each is small and none is enough alone. This is why forecasts of disaster often go too far: no single replacement exists. And it is why forecasts of easy change go too far the other way: each small change has a cost.',
    },
    {
      id: 'order-adaptation',
      type: 'order_flow',
      tags: ['energy', 'adaptation'],
      xp: 30,
      prompt: 'Put the reaction to an energy shock in order, from the first hours to twenty years later.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'price', label: 'The price jumps', detail: 'Hours. Nothing physical has changed yet' },
        { id: 'ration', label: 'The biggest energy users stop first', detail: 'Weeks. Metal and fertiliser plants close for a while' },
        { id: 'behaviour', label: 'Everyone turns the heating down' },
        { id: 'supply', label: 'Gas ships are sent here instead of to other buyers', detail: 'Months, and the other buyers lose out' },
        { id: 'capital', label: 'New boilers, insulation and efficient machines are installed' },
        { id: 'structure', label: 'The industries that use the most energy never come back' },
      ],
      correctOrder: ['price', 'ration', 'behaviour', 'supply', 'capital', 'structure'],
      explanation:
        'The order shows who pays at each step. The first to stop are the users who can least afford higher prices. That is why an energy shock hits industry long before it hits households. The last step is the one nobody chooses: some industry moves abroad for good, and the jobs go with it.',
    },
    {
      id: 'mc-what-criticality-means',
      type: 'multiple_choice',
      tags: ['criticality', 'framing'],
      xp: 30,
      prompt: 'After all this, what is the most precise way to say how critical an input is?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'horizon-bound',
          label: 'How much production is lost if it stops, over a stated length of time',
        },
        {
          id: 'share',
          label: 'Its share of the economy',
          feedback:
            'The last lesson showed why not: chips are a tiny sector and they stopped millions of cars. Share answers a different question.',
        },
        {
          id: 'strategic',
          label: 'Whether the government has called it “strategic”',
          feedback:
            'Those labels follow the last crisis, and companies lobby for them. The test should come from how production really works, not from a list.',
        },
        {
          id: 'import',
          label: 'How much of it is imported',
          feedback:
            'Imports matter for who can cut you off, but that is a different thing. A product made at home in one factory, with no substitute, is more critical than an import with forty suppliers.',
        },
      ],
      correctOptionId: 'horizon-bound',
      explanation:
        'Saying something is critical without saying “over how long” means little. Over one winter, gas in Europe was almost impossible to replace. Over five years it could be replaced, at a cost. Over twenty years it is a choice. Every serious argument about energy, chips or food depends on which time frame is meant, and people rarely say which.',
    },
  ],
  keyTakeaways: [
    'In the short run people can hardly use less of an essential input. In the long run they can, once equipment and buildings change.',
    'Replacement comes as many small changes, not one big swap.',
    'Calling something critical means little unless you say over how long.',
  ],
});
