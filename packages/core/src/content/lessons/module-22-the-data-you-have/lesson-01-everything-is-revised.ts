import { defineLesson } from '../../schema';

/**
 * Orphanides' real-time critique, which is the most useful single finding in
 * applied monetary policy and is almost never taught outside central banks.
 *
 * Working with real-time vintages of US data, he showed that the output gap
 * believed in the 1970s was far more negative than later revisions made it,
 * and that policy which looked correct against the data of the day was
 * substantially too loose against the data we now have. The rule was not the
 * problem. Its inputs were.
 */
export const everythingIsRevisedLesson = defineLesson({
  id: 'everything-is-revised',
  title: 'The Number You Decided On Was Wrong',
  subtitle:
    'Not falsified, not fabricated — revised, years later, by enough to change what you should have done.',
  icon: '📉',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'sim-real-time',
      type: 'interactive_sim',
      tags: ['real-time-data', 'output-gap', 'taylor-rule'],
      xp: 40,
      constants: { inflationWeight: 0.5, gapWeight: 0.5, target: 0.02, neutralReal: 0.01 },
      prompt: 'Set policy twice on the same economy.',
      instructions: 'Open a wide gap between the real-time estimate and the revised one',
      narrative:
        'The same rule from "Setting the Rate", run on two different estimates of the same output gap: the one available at the meeting, and the one the statisticians settle on years later. Inflation is not revised much. The gap is revised enormously — it is not measured but inferred, from a potential output nobody observes. Move the two apart and read the bottom number as what it is: the policy error you would have made, at the time, following the rule correctly.',
      sliders: [
        {
          key: 'inflation',
          label: 'Inflation at the time',
          min: 0,
          max: 0.12,
          step: 0.005,
          defaultValue: 0.06,
          format: 'percent',
        },
        {
          key: 'outputGap',
          label: 'Output gap as estimated then',
          min: -0.08,
          max: 0.04,
          step: 0.005,
          defaultValue: -0.04,
          format: 'percent',
          hint: 'In the 1970s this was believed to be deeply negative',
        },
        {
          key: 'revisedGap',
          label: 'Output gap as later revised',
          min: -0.08,
          max: 0.04,
          step: 0.005,
          defaultValue: 0,
          format: 'percent',
          hint: 'Revisions of several points are ordinary',
        },
      ],
      readouts: [
        {
          key: 'error',
          label: 'Policy error at the time',
          formulaId: 'real_time_policy_error',
          format: 'percent',
          emphasis: true,
          caption: 'negative means policy was too loose',
        },
        {
          key: 'realtime',
          label: 'Rate the rule gave you then',
          formulaId: 'taylor_rate',
          format: 'percent',
          caption: 'on the data of the day',
        },
        {
          key: 'revised',
          label: 'Rate it would give with hindsight',
          formulaId: 'taylor_rate_revised',
          format: 'percent',
          caption: 'on the revised gap',
        },
      ],
      objective: {
        description: 'Reproduce the 1970s: a gap believed deeply negative that was later revised away, leaving policy at least 1.5 points too loose',
        requiredObservations: [{ sliderKey: 'outputGap', values: [-0.08] }],
        target: { readoutKey: 'error', comparator: 'lte', value: -0.015 },
      },
      explanation:
        'This is Orphanides’ finding, and it reframes the whole of the 1970s. The usual story is that central bankers did not understand inflation or lacked the nerve to act. The real-time data says something less comfortable: they were following a defensible rule, competently, on an output gap that the statistics of the day put several points below where later revisions placed it. The rule did not fail. Its input did — and the input was an estimate of something nobody can observe.',
    },
    {
      id: 'mc-why-gap-revised',
      type: 'multiple_choice',
      tags: ['output-gap', 'measurement'],
      xp: 35,
      prompt: 'Why is the output gap revised so much more than inflation?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'unobservable',
          label: 'Potential output is inferred, never measured',
        },
        {
          id: 'gdp',
          label: 'Because GDP itself gets revised heavily after the first print',
          feedback:
            'GDP revisions contribute and they are the smaller half. Even with GDP known exactly, the gap would still move, because the thing it is measured against is a construct.',
        },
        {
          id: 'inflation-accurate',
          label: 'Because price indices are measured precisely',
          feedback:
            'They have real problems — quality adjustment, substitution, owner-occupied housing. They are still observations of transactions, which puts them in a different category from an inferred trend.',
        },
        {
          id: 'political',
          label: 'Because the estimate is politically sensitive',
          feedback:
            'It is, and the revisions follow methodological changes and later data rather than pressure. A productivity slowdown only becomes visible once enough years have passed to distinguish it from a bad patch.',
        },
      ],
      correctOptionId: 'unobservable',
      explanation:
        'Inflation is a measurement of prices that were actually paid. The output gap is the difference between output and a potential nobody can see, estimated by a filter over a series that is itself revised. When productivity slows, it takes years to tell a slowdown in potential from a shortfall in demand — and until you can, you will read a supply problem as a demand problem and set policy accordingly. That is the 1970s in one sentence, and it is the reason r* and the output gap are best held as sign rather than size.',
    },
    {
      id: 'match-revision-behaviour',
      type: 'concept_match',
      tags: ['data', 'revisions'],
      xp: 30,
      prompt: 'Not everything is uncertain in the same way. Match each series to how much you should trust the first print.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'prices',
          term: 'Consumer prices',
          definition: 'Barely revised — a compiled observation of transactions, with known conceptual problems',
        },
        {
          id: 'gdp',
          term: 'Quarterly GDP',
          definition: 'Revised routinely by tenths, occasionally by more than a point, for years',
        },
        {
          id: 'gap',
          term: 'The output gap',
          definition: 'Not a measurement — revised by whole points, sometimes changing sign',
        },
        {
          id: 'employment',
          term: 'Payrolls and unemployment',
          definition: 'Timely and revised modestly, which is why they carry weight they do not always deserve',
        },
      ],
      explanation:
        'The ranking is the practical takeaway: decide against the series that are observed, hold the inferred ones loosely, and never let a construct carry the weight of an observation. The last pair contains a trap of its own — labour data arrives fast and gets revised less, so committees lean on it, and it is a lagging indicator of exactly the thing they are trying to get ahead of.',
    },
    {
      id: 'mc-what-to-do',
      type: 'multiple_choice',
      tags: ['real-time-data', 'method'],
      xp: 35,
      prompt: 'Given that your best estimate of the gap may be wrong by points, what follows for how you set policy?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'less-weight',
          label: 'Weight the gap less and move in reversible steps',
        },
        {
          id: 'better-model',
          label: 'Invest in building a better estimate of potential output',
          feedback:
            'Worth doing and it does not solve this. The problem is not that the models are bad, it is that the quantity only becomes knowable after the fact — a better filter still cannot see a productivity slowdown while it is happening.',
        },
        {
          id: 'ignore',
          label: 'Drop the output gap from the framework',
          feedback:
            'Then you have no way to distinguish an economy running hot from one merely growing, which is the distinction the whole decision rests on. The answer is to weight it less, not to pretend demand pressure is unmeasurable.',
        },
        {
          id: 'wait',
          label: 'Wait for the revised data before acting',
          feedback:
            'The revised data arrives years later. Waiting for it is choosing to make every decision after the fact, and the lags module already established what that costs.',
        },
      ],
      correctOptionId: 'less-weight',
      explanation:
        'The literature that followed Orphanides asked which rules perform well when the inputs are wrong, and the answer is consistent: rules that lean on observed inflation and on the *change* in activity, rather than on the level of an estimated gap, do far less damage when the estimate is off. That is a technical argument for the gradualism this course keeps arriving at — not caution as temperament, but caution as the correct response to a known property of your instruments.',
    },
  ],
  keyTakeaways: [
    'The output gap is inferred, not measured, and is revised by whole points.',
    'The 1970s were a failure of inputs, not of the rule applied to them.',
    'Weight observed series above constructed ones.',
    'Rules that lean on changes rather than levels do less damage when the estimate is wrong.',
  ],
});
