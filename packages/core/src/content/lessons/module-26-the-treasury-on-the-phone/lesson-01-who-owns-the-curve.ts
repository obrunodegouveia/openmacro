import { defineLesson } from '../../schema';

/**
 * The consolidated balance sheet: why a purchase programme and a debt office
 * can undo each other, and why neither side is doing anything wrong.
 */
export const whoOwnsTheCurveLesson = defineLesson({
  id: 'who-owns-the-curve',
  title: 'Two Institutions, One Balance Sheet',
  subtitle:
    'The central bank buys long bonds to lower long rates. The debt office issues long bonds to lock in funding. Both are right, and they are pulling against each other.',
  icon: '📞',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'sim-consolidated-maturity',
      type: 'interactive_sim',
      tags: ['qe', 'debt-management', 'consolidation'],
      xp: 45,
      currency: 'EUR',
      constants: {},
      prompt: 'How long is the state’s debt really, once you consolidate?',
      instructions: 'Increase the holdings and watch the effective maturity shorten',
      narrative:
        'A purchase programme does not retire debt. It takes a long bond out of private hands and puts overnight reserves in — reserves on which the central bank pays the policy rate, and which the state as a whole must therefore refinance every night. Consolidate the two balance sheets and the question is not how much debt exists but how long it is.',
      sliders: [
        {
          key: 'totalDebt',
          label: 'Public debt outstanding',
          min: 100000000000,
          max: 3000000000000,
          step: 50000000000,
          defaultValue: 2000000000000,
          format: 'currency',
        },
        {
          key: 'avgMaturity',
          label: 'Average maturity as issued',
          min: 1,
          max: 15,
          step: 0.5,
          defaultValue: 8,
          format: 'number',
          hint: 'Years — what the debt office reports',
        },
        {
          key: 'cbHoldings',
          label: 'Held by the central bank',
          min: 0,
          max: 1500000000000,
          step: 50000000000,
          defaultValue: 600000000000,
          format: 'currency',
        },
        {
          key: 'heldMaturity',
          label: 'Average maturity of what it holds',
          min: 1,
          max: 20,
          step: 0.5,
          defaultValue: 11,
          format: 'number',
          hint: 'Purchases skew long by design',
        },
      ],
      readouts: [
        {
          key: 'consolidated',
          label: 'Effective maturity, consolidated',
          formulaId: 'consolidated_maturity',
          format: 'number',
          emphasis: true,
          caption: 'Reserves refinance overnight',
        },
        {
          key: 'removed',
          label: 'Years of maturity removed',
          formulaId: 'duration_removed',
          format: 'number',
          caption: 'What the programme took out',
        },
      ],
      objective: {
        description: 'Take the consolidated maturity below 4 years without changing what the debt office issued',
        requiredObservations: [{ sliderKey: 'cbHoldings', values: [0] }],
        target: { readoutKey: 'consolidated', comparator: 'lte', value: 4 },
      },
      explanation:
        'At the defaults the debt office reports eight years and the state is effectively funded at 4.7. Nobody misreported anything: the debt office issued eight-year money and the central bank converted a third of it into overnight money. The consequence is concrete and arrived in 2022 — when the policy rate rose, the interest on those reserves repriced immediately, so a state that believed it had locked in cheap funding for eight years found a large part of its bill floating. Consolidated maturity is the number that would have shown this in advance, and almost nobody published it.',
    },
    {
      id: 'mc-offsetting',
      type: 'multiple_choice',
      tags: ['qe', 'debt-management'],
      xp: 35,
      prompt:
        'The central bank buys long bonds to compress term premia. The debt office responds by issuing more long bonds. What has happened?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'neutralised',
          label: 'The duration removed from the market has been put back',
        },
        {
          id: 'cheaper',
          label: 'The government has funded itself more cheaply',
          feedback:
            'It has funded itself at rates the purchases helped create, which is the awkward part. The effect on term premia is what the extra issuance then undoes.',
        },
        {
          id: 'illegal',
          label: 'The debt office has breached monetary financing rules',
          feedback:
            'Issuing into a market is not monetary financing however willing the buyer is. Both institutions are acting within their mandates, which is exactly the problem.',
        },
        {
          id: 'nothing',
          label: 'Nothing — they operate on different parts of the curve',
          feedback:
            'They operate on the same instrument. The purchases and the issuance are the same maturity, in opposite directions.',
        },
      ],
      correctOptionId: 'neutralised',
      explanation:
        'Both institutions did their job correctly. The central bank’s transmission channel is duration extraction — removing interest-rate risk from private portfolios so the term premium falls. The debt office’s job is to minimise cost and risk for the taxpayer, and with long rates low that means issuing long. The net duration in private hands is roughly unchanged, so the programme delivers less than intended. This is not a conspiracy or a failure; it is what happens when two mandates operate on one balance sheet without either being required to look at the other.',
    },
    {
      id: 'match-coordination-boundaries',
      type: 'concept_match',
      tags: ['coordination', 'governance'],
      xp: 30,
      prompt: 'Four coordination arrangements. Match each to what it protects.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'info',
          term: 'Shared issuance calendar',
          definition: 'Neither side is surprised, and neither is told what to do',
        },
        {
          id: 'consolidated',
          term: 'Published consolidated maturity',
          definition: 'Makes the combined position visible without requiring either to change it',
        },
        {
          id: 'separation',
          term: 'No consultation on rate decisions',
          definition: 'Keeps the debt office out of monetary policy, which is the risk running the other way',
        },
        {
          id: 'crisis',
          term: 'Pre-agreed crisis protocol',
          definition: 'Decides in calm conditions who does what when the market for government debt stops functioning',
        },
      ],
      explanation:
        'Notice that three of the four are about information rather than agreement. That is deliberate. Coordination in this field means both institutions can see the same picture and each decides independently — because the alternative, a negotiated joint position, is how a debt office acquires influence over the policy rate. The fourth exists because the one moment when improvisation is guaranteed to go badly is a failed government bond auction, and that is not the moment to be establishing who is allowed to buy.',
    },
    {
      id: 'mc-market-functioning',
      type: 'multiple_choice',
      tags: ['qe', 'market-functioning'],
      xp: 40,
      prompt:
        'A central bank buys government bonds because the market for them has stopped functioning. What distinguishes this from financing the government?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'reversible',
          label: 'It is sized to the dysfunction, bought in the secondary market, and unwound when it clears',
        },
        {
          id: 'small',
          label: 'The amounts are smaller',
          feedback:
            'March 2020 purchases were enormous. Size is not the distinguishing feature, and an intervention too small to restore function fails at its stated purpose.',
        },
        {
          id: 'temporary',
          label: 'It is announced as temporary',
          feedback:
            'Announcing it is not the same as being it. What matters is whether the design makes the exit possible — pricing, sizing and the secondary market all do.',
        },
        {
          id: 'secondary',
          label: 'It is bought in the secondary market rather than at auction',
          feedback:
            'Necessary and not sufficient. Unlimited secondary purchases with no exit are financing conducted one step removed, which is why the other two conditions are in the answer.',
        },
      ],
      correctOptionId: 'reversible',
      explanation:
        'This is the hardest technical judgement in the module, and it is judgement rather than a rule. The three conditions in the answer work together: sized to the dysfunction rather than to the deficit; bought from holders rather than from the issuer; and designed so that when conditions normalise the position runs off. A programme meeting all three restores a market. One meeting none of them funds a government. Most real programmes sit somewhere between, which is why the decision goes to a committee and the reasoning gets published.',
    },
  ],
  keyTakeaways: [
    'Purchases swap long debt for overnight reserves — the state’s effective maturity shortens.',
    'A debt office issuing long can neutralise duration extraction, with both sides acting correctly.',
    'Coordination should share information, not decisions.',
    'Market-functioning purchases are distinguished by sizing, venue and reversibility.',
  ],
});
