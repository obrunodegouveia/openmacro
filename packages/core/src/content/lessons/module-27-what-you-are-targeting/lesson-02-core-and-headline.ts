import { defineLesson } from '../../schema';

/**
 * Which measure to act on. The answer is neither of the two everybody argues
 * about, and the reason is the point of the lesson.
 */
export const coreAndHeadlineLesson = defineLesson({
  id: 'core-and-headline',
  title: 'The Number You Act On',
  subtitle:
    'Households pay the headline. Policy cannot reach most of it. Both facts are true and the second one is not an excuse.',
  icon: '🎯',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-why-core',
      type: 'multiple_choice',
      tags: ['inflation', 'core'],
      xp: 35,
      prompt: 'Why does any central bank look at a measure that excludes food and energy?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'signal',
          label: 'Volatile components add noise, not signal',
        },
        {
          id: 'unimportant',
          label: 'Food and energy matter less to households',
          feedback:
            'They matter most, and disproportionately to the poorest households. Excluding them is a statement about forecasting, never about importance.',
        },
        {
          id: 'lower',
          label: 'It usually produces a lower number overall',
          feedback:
            'It ran above headline for much of the 2010s. A measure chosen because of the direction it points is not a measure.',
        },
        {
          id: 'target',
          label: 'The mandate itself is written against core',
          feedback:
            'Essentially every mandate is written against the headline index. Core is a diagnostic used to hit a headline target, not the target.',
        },
      ],
      correctOptionId: 'signal',
      explanation:
        'A component that jumps 40% and back is telling you about a pipeline or a war, not about the economy’s underlying price-setting. Excluding it improves the forecast of where headline will be in two years, which is the horizon policy actually operates over. That is the entire justification, and it is a statistical one: core is used because it predicts headline better than headline predicts itself. When it stops doing that — and it does stop — the reason for using it has gone.',
    },
    {
      id: 'match-underlying-measures',
      type: 'concept_match',
      tags: ['inflation', 'core', 'statistics'],
      xp: 30,
      prompt: 'Four measures of underlying inflation. Match each to how it is built.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'ex',
          term: 'Core (ex food and energy)',
          definition: 'Drops the same two categories every month whether or not they were the volatile ones',
        },
        {
          id: 'trimmed',
          term: 'Trimmed mean',
          definition: 'Drops whichever items moved most this month, from both tails',
        },
        {
          id: 'median',
          term: 'Weighted median',
          definition: 'Takes the price change at the middle of the distribution, immune to any one outlier',
        },
        {
          id: 'persistent',
          term: 'Persistent and common component',
          definition: 'Extracts what is moving across many items at once, which is what policy can act on',
        },
      ],
      explanation:
        'The order runs from crudest to most informative, and the first one is the crude one everybody quotes. Ex-food-and-energy removes a fixed list, so in a month when services are the volatile component it removes the wrong things — which is exactly what happened in 2022, when the volatility migrated into airfares, hotels and used cars, all of them inside core. The trimmed mean and the median kept working because they identify the outliers rather than assuming them. A governor who watches only the fixed-exclusion measure is using a tool calibrated for the last decade’s shocks.',
    },
    {
      id: 'mc-both-mistakes',
      type: 'multiple_choice',
      tags: ['inflation', 'policy-error'],
      xp: 40,
      prompt:
        'Energy prices double. A central bank decides to look through it. Under what condition is that the right call?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'anchored',
          label: 'Expectations stay anchored and wages do not chase it',
        },
        {
          id: 'temporary',
          label: 'The energy price rise is temporary',
          feedback:
            'Almost every energy shock is temporary in the price itself and the question is what it leaves behind. A spike that fully reverses can still have moved wage bargaining permanently.',
        },
        {
          id: 'supply',
          label: 'The shock is a supply shock rather than a demand shock',
          feedback:
            'That is the reason looking through it is even considered — policy cannot make gas. It does not establish that looking through it will work.',
        },
        {
          id: 'core',
          label: 'Core inflation is at target',
          feedback:
            'Core is where the shock would show up second, with a lag. Reading a lagging indicator as an all-clear is how a central bank arrives late.',
        },
      ],
      correctOptionId: 'anchored',
      explanation:
        'Looking through a supply shock is a bet, and the answer names the thing being bet on. Raising rates cannot produce energy, so the first-round effect is beyond reach and tightening into it buys a recession and the same energy price. But the bet fails if the shock passes into expectations and wage settlements, because then it is no longer an energy problem — it is a general inflation problem that started with energy. The judgement is therefore never about the shock. It is about the conditioning: how anchored expectations are, how wages are set, how much slack there is. This is the decision the next lesson is about.',
    },
    {
      id: 'order-which-measure',
      type: 'order_flow',
      tags: ['inflation', 'process'],
      xp: 30,
      prompt: 'Order how a policy committee should reason from the price data.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'headline', label: 'Read the headline — it is the mandate and what households pay' },
        { id: 'decompose', label: 'Decompose it: which components, what weights' },
        { id: 'breadth', label: 'Check breadth — how many items are rising, not how fast a few are' },
        { id: 'expect', label: 'Check whether expectations have moved' },
        { id: 'decide', label: 'Decide on the headline forecast at the policy horizon' },
      ],
      correctOrder: ['headline', 'decompose', 'breadth', 'expect', 'decide'],
      explanation:
        'First and last are the same number, and everything between them is diagnosis. This is the answer to the argument about whether a central bank should target core or headline: it targets headline, always, because that is the mandate and the thing people live in — and it uses every underlying measure available to forecast where headline will be when today’s decision actually bites. The measure you act on is the headline in two years, which nobody has published yet.',
    },
  ],
  keyTakeaways: [
    'Core is justified statistically — it forecasts headline better than headline does.',
    'Fixed-exclusion core fails when the volatility moves inside it, as in 2022.',
    'Looking through a supply shock is a bet on expectations staying anchored.',
    'The mandate is the headline; underlying measures are how you forecast it.',
  ],
});
