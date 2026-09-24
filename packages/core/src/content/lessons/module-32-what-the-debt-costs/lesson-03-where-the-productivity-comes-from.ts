import { defineLesson } from '../../schema';

/**
 * Where American productivity actually comes from, and the measurement trap
 * sitting on top of the question. The previous lesson established that
 * productivity is the lever; this asks whether the country the module is
 * about really has it, and finds a more interesting answer than yes.
 */
export const whereTheProductivityComesFromLesson = defineLesson({
  id: 'where-the-productivity-comes-from',
  title: 'Is America Actually the Most Productive?',
  subtitle:
    'The whole argument rests on American output per hour. Which makes it worth asking where that comes from, and whether the country is even top of the table — because on the usual measure, it is not.',
  icon: '🗽',
  difficulty: 'advanced',
  estimatedMinutes: 30,
  video: {
    url: 'https://www.youtube.com/watch?v=EFNT6w6fBhA',
    minutes: 18,
    source: 'VisualEconomik — How Did the U.S. Become the Richest Country in the World?',
  },
  challenges: [
    {
      id: 'match-sources',
      type: 'concept_match',
      tags: ['productivity', 'growth'],
      xp: 45,
      prompt: 'Four American advantages. Match each to the mechanism it works through.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'rivers',
          term: 'Navigable rivers and coastline',
          definition: 'Moving goods by water costs a fraction of moving them by road',
        },
        {
          id: 'capital',
          term: 'Deep venture and equity markets',
          definition: 'A firm that should grow can raise the money to, at the moment it needs it',
        },
        {
          id: 'reallocation',
          term: 'A labour market that moves people',
          definition: 'Workers end up at the firms that use them best, and failures release them',
        },
        {
          id: 'talent',
          term: 'Universities that import people',
          definition: 'The skill is acquired without the twenty years of schooling being paid for',
        },
      ],
      explanation:
        'Notice that only one of these is about inventing anything. The Mississippi system carries more freight than the road network could at any price, and the cost of moving a tonne of grain shapes what it is worth growing. Capital depth decides whether a good idea reaches scale or dies solvent. Labour mobility is the reallocation channel from the last lesson — the cheapest productivity there is, and the one that requires letting firms fail. And a country that admits trained adults collects the return on an education somebody else funded. The innovation everyone points to sits on top of these rather than instead of them.',
    },
    {
      id: 'mc-the-ranking',
      type: 'multiple_choice',
      tags: ['productivity', 'measurement'],
      xp: 45,
      prompt:
        'On GDP per hour worked, Ireland and Luxembourg beat the United States comfortably. What does that mostly tell you?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'accounting',
          label: 'Where multinationals book profits, more than how hard anyone works',
        },
        {
          id: 'harder',
          label: 'Irish and Luxembourgish workers really are more efficient',
          feedback:
            'Both are genuinely rich and well run. Neither is three times more efficient than Germany, which is roughly what the table claims once profit booking is counted as output produced on the ground.',
        },
        {
          id: 'small',
          label: 'Small countries are easier to run well',
          feedback:
            'Size does help specialisation, and it does not manufacture the gap here. The distortion is an accounting one, not a management one.',
        },
        {
          id: 'wrong',
          label: 'The measure is simply useless',
          feedback:
            'Too strong. GDP per hour is the right measure for most comparisons; it breaks in specific places, and knowing which places is the skill.',
        },
      ],
      correctOptionId: 'accounting',
      explanation:
        'Intellectual property is mobile in a way that a steel mill is not. A pharmaceutical patent or a software licence can be held by a subsidiary in a low-tax jurisdiction, so the profit on a sale made anywhere in the world lands in the national accounts of a country with a few million people. Ireland’s output statistics moved so violently after one such restructuring that its own central bank invented a different measure to see through it. This is not an argument that Ireland is poor — it is prosperous by any honest measure. It is a warning that the top of a productivity table is the place where accounting distortions are largest, and the ranking is doing less work than it appears to.',
    },
    {
      id: 'sim-scale',
      type: 'interactive_sim',
      tags: ['productivity', 'growth', 'measurement'],
      xp: 60,
      currency: 'USD',
      constants: {},
      prompt: 'Output is three numbers multiplied. Which of them makes an economy large?',
      instructions: 'Push output per hour to the top and try to reach $20 trillion',
      narrative:
        'An economy produces workers times hours each times output per hour, and nothing else. Productivity tables rank the last number alone. Start from roughly the American shape — 168 million people working about 1,800 hours a year — and then try small-and-brilliant instead: drag the workforce down to a few million and the hourly rate as high as it goes.',
      sliders: [
        {
          key: 'workers',
          label: 'People working',
          min: 2000000,
          max: 200000000,
          step: 2000000,
          defaultValue: 168000000,
          format: 'number',
          hint: 'The United States has about 168 million',
        },
        {
          key: 'hoursPerWorker',
          label: 'Hours worked per year, each',
          min: 1200,
          max: 2200,
          step: 50,
          defaultValue: 1800,
          format: 'number',
          hint: 'Around 1,800 in the US; nearer 1,350 in Germany',
        },
        {
          key: 'outputPerHour',
          label: 'Output per hour worked',
          min: 20,
          max: 180,
          step: 5,
          defaultValue: 85,
          format: 'currency',
          hint: 'The number productivity tables rank',
        },
      ],
      readouts: [
        {
          key: 'total',
          label: 'Everything the economy produces in a year',
          formulaId: 'total_output',
          format: 'currency',
          emphasis: true,
          caption: 'workers × hours × output per hour',
        },
      ],
      objective: {
        description: 'Reach $20 trillion of annual output',
        requiredObservations: [{ sliderKey: 'outputPerHour', values: [20, 180] }],
        target: { readoutKey: 'total', comparator: 'gte', value: 20000000000000 },
      },
      explanation:
        'With a few million workers you cannot get there at any hourly rate the slider offers, and that is the entire point. The United States is not the most productive country per hour and it produces more than any other, because it combines a high rate with a very large workforce that also works several hundred hours a year more than Western Europe does. Those extra hours are a real choice with a real cost — leisure is worth something, and a shorter year is not a failure — but they are part of why the totals differ. For a debt, the total is what matters: a bond is serviced out of the whole economy, not out of an hourly average.',
    },
    {
      id: 'mc-why-cheap',
      type: 'multiple_choice',
      tags: ['sovereign-debt', 'reserve-currency'],
      xp: 45,
      prompt:
        'Productivity gives the US a large tax base. What lets it borrow more cheaply than a country with the same debt ratio?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'demand',
          label: 'Standing global demand for the world\u2019s safe asset',
        },
        {
          id: 'growth',
          label: 'Faster growth, which reassures the people lending',
          feedback:
            'It helps, and it is not the distinctive part. Several economies have grown faster while paying more to borrow, because nobody wanted to hold their paper as a reserve.',
        },
        {
          id: 'size',
          label: 'The sheer size of the economy, taken on its own',
          feedback:
            'Size is why there is enough debt to be liquid, which matters. What makes it cheap is who is obliged to hold it and why.',
        },
        {
          id: 'military',
          label: 'Military power standing behind the currency',
          feedback:
            'A popular story with little to show for it. The mechanism runs through central banks needing dollar reserves and exporters needing somewhere to put the proceeds.',
        },
      ],
      correctOptionId: 'demand',
      explanation:
        'Central banks hold reserves, exporters accumulate dollars, and pension funds and insurers need an asset that is liquid in a crisis. Treasuries are what all of them buy, which means a permanent bid exists for the debt regardless of what any individual investor thinks about American fiscal policy. That bid is worth perhaps half a percentage point or more on the rate, and on thirty trillion dollars half a point is a very large number. It is the privilege the previous module described from the other side — everyone borrows in dollars, so everyone holds them. The uncomfortable part is that this is a demand for the *currency*, and the thing that would end it is not a downgrade but the emergence of an alternative anyone trusts more.',
    },
    {
      id: 'mc-the-catch',
      type: 'multiple_choice',
      tags: ['sovereign-debt', 'budget'],
      xp: 45,
      prompt:
        'Given all of that, what is the honest reason to worry about the American debt anyway?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'crowding',
          label: 'Interest outranks defence and is paid before anything else',
        },
        {
          id: 'default',
          label: 'The country could one day simply run out of money',
          feedback:
            'It cannot, in the currency it issues — the first lesson of this module. Repeating that worry is what stops people noticing the real one.',
        },
        {
          id: 'foreign',
          label: 'Foreign governments hold far too much of it',
          feedback:
            'Foreign holders are mostly a sign of demand rather than of vulnerability, and the largest single holder of Treasuries is American. Japan’s debt is held almost entirely at home and is twice the size.',
        },
        {
          id: 'ratio',
          label: 'The ratio has passed a genuinely dangerous threshold',
          feedback:
            'No such threshold has survived contact with the evidence, which the arithmetic module covers. What binds is the cost, not the level.',
        },
      ],
      correctOptionId: 'crowding',
      explanation:
        'Everything above is true and none of it makes the debt free. Interest is contractual, it is paid before anything discretionary, and it has grown past the defence budget — so each year it takes a larger share of revenue that could have funded the research, infrastructure and education that produce the very productivity the whole argument depends on. That is the loop worth holding in your head: the thing that makes the debt affordable is the thing the debt is beginning to squeeze. Not a crisis, and not nothing. A slow trade being made without anyone deciding to make it.',
    },
  ],
  keyTakeaways: [
    'American productivity rests on geography, capital depth, reallocation and imported talent — not only invention.',
    'The top of a per-hour table is where profit-shifting distorts most; Ireland is an accounting artefact.',
    'Output is workers × hours × output per hour, and a debt is serviced out of the total.',
    'Reserve-currency demand, not growth or size, is what makes American borrowing cheap.',
    'Interest now outranks defence and squeezes the investment productivity depends on.',
  ],
});
