import { defineLesson } from '../../schema';

/**
 * The capstone: diagnosing a move with every system at once, and then being
 * honest about how good the diagnosis was.
 *
 * Three things are practised here. Reading a combination of indicators into a
 * likely explanation. Price impact as a ratio, with its limits stated, since
 * it is the relationship most worth becoming obsessed with. And the research
 * journal — writing the explanation down before looking at what happened
 * next — which is what separates a model from a convincing story.
 */
export const btcDiagnoseACrashLesson = defineLesson({
  id: 'btc-diagnose-a-crash',
  title: 'Diagnose a Crash',
  subtitle:
    'Bitcoin falls 6% in two hours. Read the order flow, the book, the leverage and the spot market together, and say what most likely happened — and how sure you are.',
  icon: '🩺',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'match-diagnoses',
      type: 'concept_match',
      tags: ['bitcoin', 'diagnosis'],
      xp: 45,
      prompt: 'Four hypothetical crashes. Match each set of readings to its likely explanation.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'delever',
          term: 'Futures CVD down, OI falling',
          definition: 'Deleveraging — longs closing, many of them forced',
        },
        {
          id: 'distribute',
          term: 'Heavy spot selling, OI stable',
          definition: 'Spot distribution — holders actually selling coins',
        },
        {
          id: 'vacuum',
          term: 'CVD near zero, bid depth collapsing',
          definition: 'A liquidity vacuum — bids pulled, little sold',
        },
        {
          id: 'new-shorts',
          term: 'Futures CVD down, OI rising',
          definition: 'New shorts opening aggressively',
        },
      ],
      explanation:
        'Open interest is the hinge: falling means positions closing, rising means new ones opening, stable means the selling came from somewhere other than leverage. CVD says who was aggressive, and depth says whether the book absorbed them. Each mapping is indicative, not proof of causation and not a trading signal — liquidation records, spot volumes and the macro tape are what confirm or refute it.',
    },
    {
      id: 'mc-short-squeeze',
      type: 'multiple_choice',
      tags: ['bitcoin', 'diagnosis', 'derivatives'],
      xp: 40,
      prompt:
        'The opposite case: Bitcoin jumps 7%. Futures CVD is strongly positive, open interest falls sharply and funding turns from negative to neutral. Most likely?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'squeeze', label: 'A short squeeze — shorts buying back, many forced to' },
        {
          id: 'new-longs',
          label: 'New longs piling in on good news',
          feedback:
            'New longs would raise open interest. A sharp fall in OI with aggressive buying means existing shorts were closing.',
        },
        {
          id: 'spot-demand',
          label: 'Fund creations driving spot demand',
          feedback:
            'That would show up in spot volumes and creation data. Everything here points to the futures market.',
        },
        {
          id: 'vacuum',
          label: 'Asks pulled from a thin book',
          feedback:
            'Possible as a contributor, but strongly positive CVD says buying was aggressive, not merely unopposed.',
        },
      ],
      correctOptionId: 'squeeze',
      explanation:
        'Negative funding meant shorts were crowded and paying to stay in. A rise forced the most leveraged of them out, and a forced short exit is a market buy. Falling OI with aggressive buying is the mirror image of the long squeeze, and funding returning to neutral is the crowding being cleared.',
    },
    {
      id: 'sim-impact-ratio',
      type: 'interactive_sim',
      tags: ['bitcoin', 'price-impact'],
      xp: 55,
      currency: 'USD',
      constants: {},
      prompt: 'Same sell, different day. Why did $100m move the price 2% once and 8% the next time?',
      instructions: 'Work the impact ratio across days, then try the flow near zero',
      narrative:
        'The impact ratio is the absolute price change per $100m of net aggressive flow, over the same window and in the same units. The book is hypothetical and uniform; depth is what changed between the two days.',
      sliders: [
        {
          key: 'netFlow',
          label: 'Net aggressive flow',
          min: -200_000_000,
          max: 200_000_000,
          step: 25_000_000,
          defaultValue: -100_000_000,
          format: 'currency',
          hint: 'Negative is net market selling',
        },
        {
          key: 'bookDepth',
          label: 'Depth per 1% of price',
          min: 10_000_000,
          max: 100_000_000,
          step: 2_500_000,
          defaultValue: 50_000_000,
          format: 'currency',
        },
      ],
      readouts: [
        {
          key: 'impact',
          label: 'Price change',
          formulaId: 'btc_price_impact',
          format: 'percent',
          caption: 'Net flow ÷ depth per 1%',
        },
        {
          key: 'ratio',
          label: 'Impact per $100m',
          formulaId: 'btc_impact_per_100m',
          format: 'percent',
          emphasis: true,
          caption: '|Price change| ÷ |net flow| — undefined at zero flow',
        },
      ],
      objective: {
        description: 'Set the flow to zero once, then find a day where $100m costs 8% or more',
        requiredObservations: [{ sliderKey: 'netFlow', values: [0, -100_000_000] }],
        target: { readoutKey: 'ratio', comparator: 'gte', value: 0.08 },
      },
      explanation:
        'With a fixed book the ratio is just one over depth, and it quadruples when depth falls to a quarter. Real days differ in more than depth — how fast liquidity is replaced, how volatile the market is, what traders expect — and that is what a serious study of impact tries to separate. At zero flow the ratio has no meaning, so it shows nothing. And flow is not independent of price: falling prices attract sellers, so a high ratio is a description of a day, not a law.',
    },
    {
      id: 'order-journal',
      type: 'order_flow',
      tags: ['bitcoin', 'method', 'journal'],
      xp: 40,
      prompt: 'The daily twenty-minute investigation. Put it in order.',
      instructions: 'First step at the top',
      events: [
        { id: 'biggest', label: 'Find the biggest move of the last 24 hours' },
        { id: 'flow', label: 'Check spot and futures aggressive flow' },
        { id: 'leverage', label: 'Compare open interest, funding and liquidations' },
        { id: 'book', label: 'See whether bids were consumed or withdrawn' },
        { id: 'macro', label: 'Check macro news and fund flows' },
        { id: 'write', label: 'Write three sentences and a confidence level' },
      ],
      correctOrder: ['biggest', 'flow', 'leverage', 'book', 'macro', 'write'],
      explanation:
        'Mechanism first, then motivation, then the write-up. The routine runs from the most precise evidence to the most inferential, so that the story has to fit the order book rather than the order book being bent to fit the story. Three sentences and a stated confidence is enough — the discipline is in writing it at all.',
    },
    {
      id: 'mc-why-journal',
      type: 'multiple_choice',
      tags: ['bitcoin', 'method', 'journal'],
      xp: 45,
      prompt: 'Why write the explanation down before looking at what the price did next?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'hindsight', label: 'So hindsight cannot quietly rewrite what you thought, and you can score it' },
        {
          id: 'trade',
          label: 'So you can trade on it before others do',
          feedback:
            'The journal is for testing understanding, not for generating trades. This module teaches diagnosis, not signals.',
        },
        {
          id: 'memory',
          label: 'Because you will forget the numbers',
          feedback:
            'True, but the numbers can be looked up again. What cannot be recovered is what you believed before you knew the outcome.',
        },
        {
          id: 'required',
          label: 'Because a good explanation will always predict the next move',
          feedback:
            'Most will not, and that is the point of checking. An explanation of the past and a forecast of the future are different claims.',
        },
      ],
      correctOptionId: 'hindsight',
      explanation:
        'Every story sounds right after the fact. Recording the explanation and a confidence level first, then reviewing it an hour, a day and a week later, is how you learn whether your reading of these indicators is a model or just fluent narration. Over months the journal shows which signals you over-trust — and that, not any single call, is what it is for.',
    },
  ],
  keyTakeaways: [
    'Open interest decides whether a move was leverage opening, closing or absent.',
    'Price impact depends on flow and liquidity together; the ratio describes, it does not predict.',
    'Work from mechanism to motivation, then write it down.',
    'A journal written before the outcome is what turns stories into a tested model.',
  ],
});
