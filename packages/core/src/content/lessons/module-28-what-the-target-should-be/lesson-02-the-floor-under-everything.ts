import { defineLesson } from '../../schema';

/**
 * The effective lower bound as a design constraint rather than an episode.
 * The simulation makes the arithmetic of the 2010s unavoidable.
 */
export const theFloorUnderEverythingLesson = defineLesson({
  id: 'the-floor-under-everything',
  title: 'The Floor Under Everything',
  subtitle:
    'A framework that cannot cut when it needs to is not a framework with a problem. It is a different framework.',
  icon: '🧱',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'sim-policy-space',
      type: 'interactive_sim',
      tags: ['lower-bound', 'framework'],
      xp: 45,
      constants: {},
      prompt: 'How much room does the framework actually have?',
      instructions: 'Set the neutral real rate to where it spent the 2010s and read the shortfall',
      narrative:
        'A normal policy rate is the neutral real rate plus the inflation target. Everything below the effective lower bound is unavailable. A typical recession has historically called for around five percentage points of cuts, so the question is simply whether the distance between a normal rate and the floor is five points — and for most of the last fifteen years, in most advanced economies, it was not close.',
      sliders: [
        {
          key: 'rStar',
          label: 'Neutral real rate',
          min: -0.01,
          max: 0.04,
          step: 0.005,
          defaultValue: 0.02,
          format: 'percent',
          hint: 'Around 2% historically; estimated near zero through the 2010s',
        },
        {
          key: 'inflationTarget',
          label: 'Inflation target',
          min: 0,
          max: 0.04,
          step: 0.005,
          defaultValue: 0.02,
          format: 'percent',
        },
        {
          key: 'lowerBound',
          label: 'Effective lower bound',
          min: -0.01,
          max: 0.005,
          step: 0.005,
          defaultValue: 0,
          format: 'percent',
          hint: 'Slightly negative where cash is costly to hold',
        },
        {
          key: 'typicalCut',
          label: 'Easing a recession calls for',
          min: 0.02,
          max: 0.08,
          step: 0.005,
          defaultValue: 0.05,
          format: 'percent',
        },
      ],
      readouts: [
        {
          key: 'shortfall',
          label: 'Easing you cannot deliver',
          formulaId: 'easing_shortfall',
          format: 'percent',
          emphasis: true,
          caption: 'What the balance sheet has to cover',
        },
        {
          key: 'space',
          label: 'Room above the bound',
          formulaId: 'policy_space',
          format: 'percent',
          caption: 'r* + target − floor',
        },
      ],
      objective: {
        description: 'Find a combination where the framework can deliver the full easing a recession needs',
        requiredObservations: [{ sliderKey: 'rStar', values: [-0.01, 0.04] }],
        target: { readoutKey: 'shortfall', comparator: 'lte', value: 0 },
      },
      explanation:
        'At the historical settings — 2% neutral, 2% target — there are four points of room against a five-point need, so even the good case is short. Drop the neutral rate to zero, which is where it was estimated to be for most of the 2010s, and half the required easing is simply unavailable. This is the arithmetic that produced everything in the Fed and ECB modules: asset purchases, forward guidance, negative rates, funding schemes. They were not innovations anybody wanted. They were what was left after the instrument ran out, and a framework designed today has to assume they will be needed again.',
    },
    {
      id: 'mc-why-bound-exists',
      type: 'multiple_choice',
      tags: ['lower-bound'],
      xp: 30,
      prompt: 'Why is there a lower bound on interest rates at all?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'cash',
          label: 'Physical cash pays zero, so nobody accepts much less',
        },
        {
          id: 'law',
          label: 'Negative rates are legally prohibited',
          feedback:
            'Several central banks ran negative policy rates for years. The constraint is economic, and it binds without any law being involved.',
        },
        {
          id: 'banks',
          label: 'Banks cannot operate with negative rates',
          feedback:
            'Bank profitability does erode, and that is why the bound is "effective" rather than exactly zero. Cash is the reason a bound exists at all.',
        },
        {
          id: 'savers',
          label: 'Savers would refuse to deposit money',
          feedback:
            'What they would do is hold notes instead, which is the same mechanism stated from the other end.',
        },
      ],
      correctOptionId: 'cash',
      explanation:
        'Cash is a zero-yield bearer asset available to everyone, so a rate far below zero triggers a switch into banknotes. The bound is "effective" rather than exactly zero because storing and insuring large amounts of cash costs something — which is why rates of −0.5% held without a stampede, and why the bound moves if the cost of holding cash changes. It is also the reason the abolition of high-denomination notes and the design of a retail CBDC are monetary policy questions, not merely payments ones.',
    },
    {
      id: 'mc-asymmetry',
      type: 'multiple_choice',
      tags: ['lower-bound', 'framework'],
      xp: 40,
      prompt:
        'The bound makes policy asymmetric. What does that imply for how a committee should behave in normal times?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'preemptive',
          label: 'Ease earlier and harder than the symmetric case would suggest',
        },
        {
          id: 'tighten',
          label: 'Keep rates higher on average to preserve room',
          feedback:
            'Tightening to protect future capacity to ease is self-defeating — it lowers inflation and therefore the neutral nominal rate, which is the room itself.',
        },
        {
          id: 'nothing',
          label: 'Nothing — the bound only matters when you reach it',
          feedback:
            'The expectation of hitting it changes behaviour before you do: it lowers expected future inflation, which raises real rates today. It is binding in advance.',
        },
        {
          id: 'balance',
          label: 'Rely on the balance sheet instead of the rate',
          feedback:
            'That is what you do at the bound. The question is what the asymmetry implies before you get there.',
        },
      ],
      correctOptionId: 'preemptive',
      explanation:
        'Overshooting on the easy side is correctable — you raise rates. Undershooting into the bound is not, because the instrument is gone and what remains is slower and less certain. When the costs of the two errors differ that much, the optimal policy is not the one that balances them equally. This is the formal argument for acting fast and large in a downturn, and it is the mirror image of the argument in the inflation module for acting before you are sure on the way up. Both come from asymmetry; they point in opposite directions because the irreversible outcome is at a different end.',
    },
    {
      id: 'order-at-the-bound',
      type: 'order_flow',
      tags: ['lower-bound', 'tools'],
      xp: 30,
      prompt: 'Order the tools as a central bank runs out of room.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'cut', label: 'Cut to the effective lower bound' },
        { id: 'guidance', label: 'Commit to holding it — forward guidance' },
        { id: 'qe', label: 'Buy duration to compress long rates' },
        { id: 'funding', label: 'Lend to banks on terms tied to their lending' },
        { id: 'negative', label: 'Push modestly below zero if cash costs allow' },
        { id: 'fiscal', label: 'Say publicly that the rest is fiscal', detail: 'Which is not a tool you hold' },
      ],
      correctOrder: ['cut', 'guidance', 'qe', 'funding', 'negative', 'fiscal'],
      explanation:
        'The order reflects both effectiveness and cost — guidance is free, purchases carry balance sheet risk, negative rates erode bank margins. The final step is the honest one and it is not an instrument: at the bound, with the toolkit exhausted, the binding constraint on demand is fiscal, and the only thing a governor can do is say so clearly and accept that saying it is uncomfortable. A central bank that pretends it still has ample room when it does not is making a communication choice that will be tested.',
    },
  ],
  keyTakeaways: [
    'Room above the bound is the neutral real rate plus the target, and it has been under five points.',
    'The bound exists because cash pays zero, so it moves if holding cash gets costlier.',
    'Asymmetric costs imply easing earlier and harder than a symmetric rule would.',
    'At the bound the binding constraint is fiscal, and saying so is part of the job.',
  ],
});
