import { defineLesson } from '../../schema';

/**
 * The single most consequential technical judgement in the job: is this
 * inflation coming from demand you can restrain, or from supply you cannot?
 *
 * Both answers have a failure mode, and the module refuses to pretend one of
 * them is obviously right — "look through it" was the defensible call in 2021
 * and the wrong one, and knowing why it was defensible is the lesson.
 */
export const supplyOrDemandLesson = defineLesson({
  id: 'supply-or-demand',
  title: 'Tightening Cannot Make More Gas',
  subtitle:
    'The same 8% print demands opposite responses depending on where it came from. Getting this wrong is how decades go badly.',
  icon: '🔀',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'mc-tell-them-apart',
      type: 'multiple_choice',
      tags: ['supply-shock', 'demand'],
      xp: 30,
      prompt:
        'Inflation is 8%. What single piece of evidence best distinguishes a demand-driven episode from a supply-driven one?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'output',
          label: 'What output is doing alongside prices',
        },
        {
          id: 'breadth',
          label: 'How many spending categories are rising at once',
          feedback:
            'Breadth is genuinely useful and it is second best — a supply shock in energy passes into transport, food and eventually everything, so breadth arrives late and looks like demand by the time it does.',
        },
        {
          id: 'wages',
          label: 'Whether wages are rising',
          feedback:
            'Wages rise in both, and they rise late. Treating wage growth as the signature of demand inflation is how a central bank ends up tightening into a supply shock that has already passed.',
        },
        {
          id: 'money',
          label: 'Whether the money supply grew',
          feedback:
            'Broad money grew enormously in 2020 and the relationship with subsequent inflation was loose enough that reasonable people read it in opposite directions. It is a clue, not a discriminator.',
        },
      ],
      correctOptionId: 'output',
      explanation:
        'Demand inflation comes with an economy running hot: output above potential, unemployment below what is sustainable, prices and quantities moving together. A supply shock does the opposite — prices up, output down, the stagflation signature. That is the cleanest single test, and the reason it is hard in practice is that 2021 and 2022 had both at once, in proportions nobody could measure until afterwards.',
    },
    {
      id: 'match-two-failures',
      type: 'concept_match',
      tags: ['supply-shock', 'policy-error'],
      xp: 35,
      prompt: 'Each reading has its own way of going wrong. Match the mistake to what it costs.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'tighten-supply',
          term: 'Tightening into a supply shock',
          definition:
            'A recession bought for nothing — the shortage passes on its own schedule and you have added a demand collapse to it',
        },
        {
          id: 'lookthrough-demand',
          term: 'Looking through a demand shock',
          definition:
            'Expectations unanchor, wage-setting adjusts, and the eventual tightening has to be far harsher than the one you avoided',
        },
        {
          id: 'secondround',
          term: 'A supply shock that turns',
          definition:
            'It becomes a demand problem once it is in wage bargains and contracts — the origin stops mattering and the response has to change',
        },
      ],
      explanation:
        'The asymmetry matters. The first mistake is expensive and self-correcting; the second is cheaper at first and compounds. That is the honest case for erring towards tightening when you genuinely cannot tell — and it is exactly the argument that produced the over-tightening of 1979-82 as well as the correct call of the same period. The third pair is why "it is a supply shock" has a shelf life: after about a year, the question stops being where it came from.',
    },
    {
      id: 'mc-2021',
      type: 'multiple_choice',
      tags: ['history', 'supply-shock'],
      xp: 35,
      prompt:
        'Through 2021 most major central banks called inflation transitory and held. Why was that defensible at the time?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'genuinely-supply',
          label: 'The early impulse genuinely was supply, and supply shocks do unwind',
        },
        {
          id: 'wrong-always',
          label: 'It was never defensible — the growth in broad money was there for anyone to see',
          feedback:
            'Hindsight makes this look easy. Broad money had also surged in 2008-2012 with no inflation at all, which is precisely why the signal was not treated as decisive.',
        },
        {
          id: 'political',
          label: 'They were under political pressure to keep rates low',
          feedback:
            'The central banks that moved earliest and latest faced similar pressure. Reaching for motive here skips the analytical question, which has a real answer.',
        },
        {
          id: 'mandate',
          label: 'Their mandates did not permit acting on supply shocks',
          feedback:
            'No mandate says that. Every one of them permits acting on any inflation; the judgement was about whether this one would pass.',
        },
      ],
      correctOptionId: 'genuinely-supply',
      explanation:
        'Container rates, semiconductors and gas were real and were expected to unwind — and they did. What the call missed was that the demand side had also been transformed: enormous fiscal transfers, savings accumulated under lockdown, and demand rotating from services to goods precisely where supply was constrained. The correct lesson is not "they were fools" but that a supply shock and a demand boom can look identical for a year, and the cost of the two errors is not symmetric.',
    },
    {
      id: 'mc-second-round',
      type: 'multiple_choice',
      tags: ['expectations', 'wages'],
      xp: 35,
      prompt:
        'Gas prices have fallen back. Wage settlements are running at 6% and multi-year contracts are being signed at that rate. What does the original cause of the shock now tell you?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'nothing',
          label: 'Nothing useful — it is a demand problem now, whatever started it',
        },
        {
          id: 'still-supply',
          label: 'It is still a supply shock, so still look through it',
          feedback:
            'The shock has passed and the inflation has not. What is left is being generated domestically by wage and price setting, and that is exactly what a policy rate can act on.',
        },
        {
          id: 'reverse',
          label: 'Cut, since the original cause has reversed',
          feedback:
            'Falling gas prices will pull the headline number down on their own. Cutting into 6% settlements ratifies them, and the next round starts from there.',
        },
        {
          id: 'wait-wages',
          label: 'Wait for wage growth to fall before doing anything',
          feedback:
            'Wages are the slowest-moving series in the system and multi-year contracts lock them in. Waiting for them means acting two years after the moment.',
        },
      ],
      correctOptionId: 'nothing',
      explanation:
        'This is the second-round problem and it is where the supply-versus-demand question expires. Once a shock is embedded in contracts and expectations, the economy is generating inflation by itself and the origin is history. The technical marker to watch is not the headline but measures that strip out the shock — core, trimmed means, and above all what wage settlements and long-horizon expectations are doing. When those move, looking through has stopped being an option.',
    },
  ],
  keyTakeaways: [
    'Demand moves prices and output together; supply moves them apart.',
    'The two errors are not symmetric: over-tightening is expensive and self-correcting, under-tightening compounds.',
    'Once a shock is in wage settlements it is a demand problem, whatever started it.',
  ],
});
