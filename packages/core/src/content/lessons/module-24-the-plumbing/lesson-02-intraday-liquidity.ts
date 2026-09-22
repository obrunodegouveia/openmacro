import { defineLesson } from '../../schema';

/**
 * The constraint nobody outside a treasury department has heard of: the money
 * a bank needs during the day, which it does not need at the end of it.
 */
export const intradayLiquidityLesson = defineLesson({
  id: 'intraday-liquidity',
  title: 'The Money You Need Only Until Teatime',
  subtitle:
    'A bank can end every day flat and still need billions at eleven in the morning. That gap is where settlement systems break.',
  icon: '⏱️',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'sim-netting',
      type: 'interactive_sim',
      tags: ['payments', 'liquidity', 'netting'],
      xp: 40,
      currency: 'EUR',
      constants: {},
      prompt: 'How much cash does settling gross actually require?',
      instructions: 'Take the offsetting rate to both extremes and compare',
      narrative:
        'A bank sends a given value of payments across the day. Much of it is matched by payments coming the other way, which it can recycle as they arrive — but only if they arrive first. The offsetting rate is how much of its outgoing flow is covered that way. What is left has to be funded: from its own reserves, or borrowed intraday from the central bank against collateral. Settling net would need almost none of it; settling gross needs all of it, every day, before anything has gone wrong.',
      sliders: [
        {
          key: 'grossPayments',
          label: 'Payments sent across the day',
          min: 1000000000,
          max: 100000000000,
          step: 1000000000,
          defaultValue: 40000000000,
          format: 'currency',
        },
        {
          key: 'offsetRate',
          label: 'Share matched by incoming payments',
          min: 0,
          max: 1,
          step: 0.05,
          defaultValue: 0.85,
          format: 'percent',
          hint: 'High in normal conditions — and it is the first thing to fall in a stress',
        },
        {
          key: 'netObligations',
          label: 'What would settle if the system netted',
          min: 0,
          max: 20000000000,
          step: 500000000,
          defaultValue: 3000000000,
          format: 'currency',
        },
      ],
      readouts: [
        {
          key: 'need',
          label: 'Liquidity it must find',
          formulaId: 'gross_settlement_need',
          format: 'currency',
          emphasis: true,
          caption: 'gross × (1 − offset)',
        },
        {
          key: 'saved',
          label: 'What netting would save',
          formulaId: 'netting_efficiency',
          format: 'percent',
          caption: '(gross − net) ÷ gross',
        },
      ],
      objective: {
        description: 'Compare a normal day with one where nothing offsets, and drive the funding need above €20bn',
        requiredObservations: [{ sliderKey: 'offsetRate', values: [0, 1] }],
        target: { readoutKey: 'need', comparator: 'gte', value: 20000000000 },
      },
      explanation:
        'Watch the offsetting rate rather than the volume. At 85% a bank sending €40bn needs €6bn; at 40% the same bank needs €24bn on a day when nothing about its business has changed. And the offsetting rate is not a constant — it falls precisely when other banks start holding on to payments, which they do when they are worried about each other. That is how a confidence problem becomes a liquidity problem inside a morning, without a single payment being refused.',
    },
    {
      id: 'mc-gridlock',
      type: 'multiple_choice',
      tags: ['payments', 'gridlock'],
      xp: 35,
      prompt:
        'Every bank in a system decides to wait for incoming payments before releasing its own. What happens?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'gridlock',
          label: 'Nothing settles — each is waiting for money that is waiting for it',
        },
        {
          id: 'slower',
          label: 'Settlement simply happens later in the day',
          feedback:
            'That is the benign version, and it tips into the other one. If enough participants wait, the first payment never comes and there is no later.',
        },
        {
          id: 'central-bank',
          label: 'The central bank lends to everyone and it resolves',
          feedback:
            'That is the fix, not the outcome, and it is why intraday credit exists. The system is designed on the assumption that somebody has to break the deadlock.',
        },
        {
          id: 'netting',
          label: 'The system automatically nets the queue',
          feedback:
            'Modern systems do run offsetting algorithms over the queue, which is exactly a response to this. Without one, waiting is individually rational and collectively fatal.',
        },
      ],
      correctOptionId: 'gridlock',
      explanation:
        'Waiting is rational for each bank — holding on to liquidity costs nothing and releasing it early costs interest — and universally fatal. This is why large-value systems run queue-offsetting algorithms, why central banks provide intraday credit free or nearly free against collateral, and why throughput rules exist that require a share of a bank’s payments to be released by set times. Every one of those is a deliberate intervention against an equilibrium the participants would otherwise reach on their own.',
    },
    {
      id: 'mc-intraday-credit',
      type: 'multiple_choice',
      tags: ['payments', 'collateral', 'intraday'],
      xp: 35,
      prompt:
        'Central banks lend intraday at zero or near-zero cost, against collateral. Why not charge for it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'encourage-flow',
          label: 'Charging for it is charging banks to pay on time',
        },
        {
          id: 'cheap',
          label: 'It costs the central bank nothing to provide',
          feedback:
            'It costs it risk, which is why collateral is taken. Being cheap to provide has not stopped central banks pricing other things they provide.',
        },
        {
          id: 'fair',
          label: 'Charging would fall hardest on small banks',
          feedback:
            'Distributional effects are real and secondary to the systemic one: any positive price makes waiting more attractive than paying, for everybody.',
        },
        {
          id: 'legal',
          label: 'Statute does not permit them to charge for it',
          feedback:
            'Some systems do charge, and where they do the design compensates elsewhere — with throughput requirements, for instance.',
        },
      ],
      correctOptionId: 'encourage-flow',
      explanation:
        'The pricing decision and the gridlock problem are the same problem. Charge for intraday credit and every treasurer’s incentive is to delay outgoing payments until incoming ones arrive, which is precisely the behaviour that jams the system. Free intraday credit against collateral buys smooth throughput, and it is paid for in the collateral framework rather than in a fee — which is one more place where the collateral list turns out to be the instrument doing the work.',
    },
    {
      id: 'order-morning-in-a-crisis',
      type: 'order_flow',
      tags: ['payments', 'crisis'],
      xp: 30,
      prompt: 'Put a settlement morning under stress in order.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'rumour', label: 'A rumour circulates about one participant' },
        { id: 'hold', label: 'Others delay payments to that bank', detail: 'Individually prudent' },
        { id: 'offset', label: 'Its offsetting rate collapses and its funding need jumps' },
        { id: 'draw', label: 'It draws heavily on intraday credit against collateral' },
        { id: 'collateral', label: 'Its usable collateral runs down' },
        { id: 'visible', label: 'The queue position becomes visible to the operator', detail: 'The supervisor now knows before the market does' },
      ],
      correctOrder: ['rumour', 'hold', 'offset', 'draw', 'collateral', 'visible'],
      explanation:
        'The last step is the reason this module belongs in a course about running a central bank. A central bank that operates the settlement system watches a bank’s liquidity position in real time, payment by payment — earlier and more reliably than any supervisory return or market price will tell it. In 2023 the institutions that saw trouble first were the ones watching the plumbing, not the filings.',
    },
  ],
  keyTakeaways: [
    'Gross settlement needs funding for whatever incoming payments do not cover.',
    'The offsetting rate falls exactly when participants start worrying about each other.',
    'Waiting to pay is individually rational and collectively fatal.',
    'Operating the system means seeing a bank’s liquidity before any supervisory return does.',
  ],
});
