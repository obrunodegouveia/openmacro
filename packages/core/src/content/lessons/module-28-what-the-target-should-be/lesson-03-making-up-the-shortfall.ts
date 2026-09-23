import { defineLesson } from '../../schema';

/**
 * Make-up strategies. The 2020 framework reviews, what they were trying to
 * solve, and the reason the design has a structural weakness that showed up
 * almost immediately.
 */
export const makingUpTheShortfallLesson = defineLesson({
  id: 'making-up-the-shortfall',
  title: 'Promising to Overshoot',
  subtitle:
    'If you cannot cut far enough today, promise to run hot tomorrow. It works entirely through belief, which is the problem with it.',
  icon: '🔁',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'match-strategies',
      type: 'concept_match',
      tags: ['framework', 'strategy'],
      xp: 35,
      prompt: 'Four strategies. Match each to what it does about past misses.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'it',
          term: 'Inflation targeting',
          definition: 'Bygones are bygones — aim at the target from wherever you are',
        },
        {
          id: 'plt',
          term: 'Price-level targeting',
          definition: 'Returns the price level to a path, so every miss must be fully reversed',
        },
        {
          id: 'ait',
          term: 'Average inflation targeting',
          definition: 'Makes up misses over a window, with the window left undefined',
        },
        {
          id: 'temporary',
          term: 'Temporary price-level targeting',
          definition: 'Makes up only shortfalls at the bound, then reverts to ordinary targeting',
        },
      ],
      explanation:
        'The differences are entirely about memory. Ordinary inflation targeting forgets, which is simple and means a long run of undershoots leaves the price level permanently below where people expected. Price-level targeting never forgets, which is powerful and commits you to tightening after an overshoot even into a recession. The two in the middle are attempts to get the benefit of memory without that obligation — and the fourth, applying make-up only to bound episodes, is the most defensible and the hardest to explain.',
    },
    {
      id: 'mc-why-it-works',
      type: 'multiple_choice',
      tags: ['framework', 'expectations'],
      xp: 40,
      prompt: 'Through what channel does a promise to overshoot later help an economy today?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'real-rate',
          label: 'Higher expected inflation lowers the real rate while the nominal rate is stuck',
        },
        {
          id: 'confidence',
          label: 'It reassures households that the central bank is acting',
          feedback:
            'Sentiment may improve and it is not a mechanism you can quantify or rely on. The channel in the answer is arithmetic.',
        },
        {
          id: 'credit',
          label: 'Banks lend more when they expect higher inflation',
          feedback:
            'Lending responds to the real rate and to demand, which brings you back to the channel in the answer rather than a separate one.',
        },
        {
          id: 'currency',
          label: 'The currency weakens',
          feedback:
            'A real consequence and a side effect. It also cannot work for everyone at once, which a domestic mechanism can.',
        },
      ],
      correctOptionId: 'real-rate',
      explanation:
        'At the bound the nominal rate cannot fall, but what matters for spending is the nominal rate minus expected inflation. Raise expected inflation and the real rate falls even though the policy rate has not moved. That is the entire mechanism, and notice what it requires: the public must believe a promise about behaviour years from now, made by a committee whose membership will have changed, to do something — tolerate inflation above target — that the same institution has spent thirty years establishing it will not do. The strategy asks credibility built one way to be spent in the other direction.',
    },
    {
      id: 'mc-time-inconsistency',
      type: 'multiple_choice',
      tags: ['framework', 'credibility'],
      xp: 40,
      prompt:
        'Why is a make-up promise hard to keep even for a central bank that fully intends to?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'inconsistent',
          label: 'By the time it comes due, overshooting is wrong',
        },
        {
          id: 'political',
          label: 'Political pressure will prevent it',
          feedback:
            'Pressure would certainly arrive. The deeper problem is that the committee itself, acting in good faith, would find the promise wrong on its own merits.',
        },
        {
          id: 'measure',
          label: 'The size of the shortfall is hard to measure',
          feedback:
            'It is arithmetic from published data. Difficulty of measurement is not what makes the commitment fragile.',
        },
        {
          id: 'members',
          label: 'Committee membership turns over meanwhile',
          feedback:
            'It does, and it compounds the problem. Even an unchanged committee faces the same conflict when the date arrives.',
        },
      ],
      correctOptionId: 'inconsistent',
      explanation:
        'This is the classic time-inconsistency problem, applied in the unusual direction. The promise is valuable today precisely because it commits you to doing something tomorrow that you will not want to do — deliberately allowing inflation above target once the economy has recovered. A committee that reaches that moment, looks at inflation above target, and tightens is behaving sensibly and destroying the tool for next time. Which is roughly what happened: the Fed adopted average inflation targeting in August 2020, inflation overshot from a supply shock rather than the intended path, and the framework was effectively set aside before it had ever been tested in the direction it was designed for.',
    },
    {
      id: 'order-framework-review',
      type: 'order_flow',
      tags: ['framework', 'process'],
      xp: 30,
      prompt: 'Order a framework review as an institution should run one.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'evidence', label: 'Establish what changed — r*, the bound, the shocks' },
        { id: 'diagnose', label: 'Ask which failures the current framework caused' },
        { id: 'options', label: 'Set out the alternatives and what each costs' },
        { id: 'consult', label: 'Test them publicly, including with non-economists' },
        { id: 'adopt', label: 'Adopt, and explain what would make you revise again' },
      ],
      correctOrder: ['evidence', 'diagnose', 'options', 'consult', 'adopt'],
      explanation:
        'The last clause is the one usually omitted and the one that matters most. A framework announced without stating the conditions for its revision invites the suspicion that it will be abandoned whenever it becomes costly — which is exactly what the 2020 experience then supplied evidence for. Saying in advance "this applies to shortfalls at the bound, not to supply shocks, and here is what we would do in that case" costs nothing when written and is worth a great deal when the awkward case arrives. Most reviews are silent on it because the awkward case is hard to describe without sounding like you are pre-announcing a failure.',
    },
  ],
  keyTakeaways: [
    'Make-up strategies differ from ordinary targeting only in whether they remember.',
    'The mechanism is raising expected inflation to lower the real rate at the bound.',
    'The promise is valuable because it commits you to what you will not want to do.',
    'A framework should state in advance what would make it revise.',
  ],
});
