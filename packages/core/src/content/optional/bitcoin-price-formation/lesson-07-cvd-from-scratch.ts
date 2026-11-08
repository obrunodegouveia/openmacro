import { defineLesson } from '../../schema';

/**
 * Cumulative volume delta, built up from a single trade.
 *
 * CVD is quoted everywhere and understood almost nowhere, because the usual
 * explanation starts at the chart. This lesson starts one level lower, at the
 * fact that every trade has a buyer and a seller, and adds one idea per
 * challenge: who crossed the spread, one bar's delta, the running sum, what
 * the slope says, and what it cannot say.
 *
 * Sits straight after the order-book lesson, which introduces CVD in one
 * question; this is the long version. File numbered 07 because it was written
 * last; its place on the path is the module's `lessons` array.
 */
export const btcCvdFromScratchLesson = defineLesson({
  id: 'btc-cvd-from-scratch',
  title: 'CVD From Scratch',
  subtitle:
    'Every trade has a buyer and a seller, so “more sellers than buyers” can never be true. What CVD counts instead is who was in a hurry — and that is worth learning to read.',
  icon: '📈',
  difficulty: 'core',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-two-sides',
      type: 'multiple_choice',
      tags: ['bitcoin', 'microstructure', 'cvd'],
      xp: 35,
      prompt:
        'Bitcoin fell, and a headline said there were “more sellers than buyers”. What is wrong with that sentence?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'hurry', label: 'Every coin sold was bought; what differed was who was in a hurry' },
        {
          id: 'nothing',
          label: 'Nothing — a fall means sellers outnumbered buyers',
          feedback:
            'Count the bitcoins: each one sold in a trade was bought in that same trade. The two sides are always equal, so the count cannot be what moved the price.',
        },
        {
          id: 'buyers',
          label: 'It should say more buyers, because buyers set the price',
          feedback:
            'Neither side sets the price alone. A trade happens at a price both accepted, and the question is which of them accepted the other’s price.',
        },
        {
          id: 'volume',
          label: 'It should say volume fell, not that sellers rose',
          feedback:
            'Volume can rise or fall in a sell-off. Volume has no direction; it counts both sides of every trade once.',
        },
      ],
      correctOptionId: 'hurry',
      explanation:
        'One side of every trade was already waiting in the order book with a limit order: the maker. The other side arrived with a market order and took that price: the taker, or aggressor. The aggressor is the one who paid to trade now. When sellers are the aggressors, they keep hitting lower bids and the price steps down. CVD is nothing more than a careful count of which side was the aggressor.',
    },
    {
      id: 'match-who-initiated',
      type: 'concept_match',
      tags: ['bitcoin', 'microstructure', 'cvd'],
      xp: 40,
      prompt:
        'The best bid is $60,000 and the best ask is $60,010. Match each event to how CVD counts it.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'at-ask',
          term: '0.5 BTC trades at $60,010',
          definition: 'Buyer-initiated: a market buy lifted the ask, so +0.5',
        },
        {
          id: 'at-bid',
          term: '2 BTC trades at $60,000',
          definition: 'Seller-initiated: a market sell hit the bid, so −2',
        },
        {
          id: 'new-bid',
          term: 'Buy limit, 5 BTC at $59,900',
          definition: 'No trade yet: it adds depth to the book, not delta',
        },
        {
          id: 'cancel-ask',
          term: 'Sell limit, 3 BTC, cancelled',
          definition: 'No trade at all: liquidity removed, delta unchanged',
        },
      ],
      explanation:
        'A trade at the ask means a buyer accepted the seller’s price; a trade at the bid means a seller accepted the buyer’s. Orders that rest or are cancelled never trade, so they never touch CVD, even though they can move the price a long way, as the last lesson showed. That gap is exactly why CVD is read beside the order book and never instead of it.',
    },
    {
      id: 'mc-one-bar',
      type: 'multiple_choice',
      tags: ['bitcoin', 'microstructure', 'cvd'],
      xp: 40,
      prompt:
        'In one five-minute bar, aggressive buyers took 120 BTC and aggressive sellers hit 170 BTC. What is the bar’s volume delta?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'minus-50', label: '−50 BTC: sellers led' },
        {
          id: 'plus-50',
          label: '+50 BTC: buyers led',
          feedback:
            'Right size, wrong sign. Delta is aggressive buying minus aggressive selling: 120 − 170.',
        },
        {
          id: 'total',
          label: '290 BTC: all of it',
          feedback: 'That is the bar’s volume, which has no direction. Delta keeps the sign.',
        },
        {
          id: 'zero',
          label: '0 BTC: it always nets out',
          feedback:
            'True of the coins, not of the aggressors. Delta counts only who crossed the spread, and that need not balance.',
        },
      ],
      correctOptionId: 'minus-50',
      explanation:
        'Volume delta is one subtraction: buyer-initiated volume minus seller-initiated volume, for one slice of time. Here sellers were the hurried side by 50 BTC. The bar still traded 290 BTC in total, and every one of those coins had a buyer and a seller; delta only says which side was paying to trade now.',
    },
    {
      id: 'mc-running-sum',
      type: 'multiple_choice',
      tags: ['bitcoin', 'microstructure', 'cvd'],
      xp: 40,
      prompt:
        'Four bars in a row have volume deltas of +30, −10, −40 and −20 BTC. Starting from zero, where is CVD after the fourth bar?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'minus-40', label: '−40 BTC' },
        {
          id: 'minus-20',
          label: '−20 BTC',
          feedback: 'That is only the last bar’s delta. CVD carries every earlier bar along with it.',
        },
        {
          id: 'minus-70',
          label: '−70 BTC',
          feedback: 'That adds only the negative bars. The +30 in the first bar counts too.',
        },
        {
          id: 'plus-30',
          label: '+30 BTC',
          feedback: 'The first bar does not set the level for good. Each later bar moves the sum.',
        },
      ],
      correctOptionId: 'minus-40',
      explanation:
        'Cumulative means a running sum: 0 + 30 − 10 − 40 − 20 = −40. Drawn as a line, CVD rose for one bar and then fell for three. That shape is the whole point of the metric. Delta bar by bar is noisy; the running sum shows whether aggressive selling or buying has been winning over the whole stretch.',
    },
    {
      id: 'mc-level-arbitrary',
      type: 'multiple_choice',
      tags: ['bitcoin', 'microstructure', 'cvd'],
      xp: 40,
      prompt:
        'Two charts of the same exchange over the same hour show CVD at +5,000 BTC and at −200 BTC. How can both be right?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'start', label: 'They started the sum at different times' },
        {
          id: 'one-wrong',
          label: 'They cannot; one chart has bad data',
          feedback:
            'Both can be correct. A running sum’s level depends on where it started, and the two charts started counting at different moments.',
        },
        {
          id: 'units',
          label: 'One counts bitcoins and the other counts dollars',
          feedback:
            'Possible on a badly labelled chart, but it would not flip the sign. The start time explains both numbers without any error.',
        },
        {
          id: 'venue',
          label: 'One of them must include other exchanges',
          feedback:
            'The question fixes the exchange. Even on one venue, the level changes with the start of the count.',
        },
      ],
      correctOptionId: 'start',
      explanation:
        'CVD’s level is arbitrary: it is whatever the sum happens to be since the chart began counting. Only its changes mean something, so read the slope, not the number. “CVD fell 800 BTC in the last hour” is information; “CVD is at −200” is not.',
    },
    {
      id: 'sim-build-cvd',
      type: 'interactive_sim',
      tags: ['bitcoin', 'microstructure', 'cvd'],
      xp: 50,
      constants: {},
      prompt: 'Build a CVD line yourself. What makes it fall?',
      instructions: 'Move the buyers’ share and watch the running sum',
      narrative:
        'A hypothetical run of identical five-minute bars. Each bar trades the same volume; the slider sets what share of it was buyer-initiated. CVD is the running sum of every bar’s delta.',
      sliders: [
        {
          key: 'buyShare',
          label: 'Buyer-initiated share of volume',
          min: 0.2,
          max: 0.8,
          step: 0.05,
          defaultValue: 0.5,
          format: 'percent',
          hint: 'The rest was seller-initiated',
        },
        {
          key: 'barVolume',
          label: 'Volume per bar (BTC)',
          min: 100,
          max: 1000,
          step: 100,
          defaultValue: 500,
          format: 'number',
        },
        {
          key: 'bars',
          label: 'Number of bars',
          min: 1,
          max: 12,
          step: 1,
          defaultValue: 6,
          format: 'number',
        },
      ],
      readouts: [
        {
          key: 'barDelta',
          label: 'Delta per bar (BTC)',
          formulaId: 'btc_bar_delta',
          format: 'number',
          caption: 'Volume × (2 × buyer share − 1)',
        },
        {
          key: 'cvdChange',
          label: 'CVD change over the run (BTC)',
          formulaId: 'btc_cvd_change',
          format: 'number',
          emphasis: true,
          caption: 'Delta per bar × bars',
        },
      ],
      objective: {
        description:
          'Try a 50%, 60% and 40% buyer share, then leave CVD down at least 600 BTC',
        requiredObservations: [{ sliderKey: 'buyShare', values: [0.5, 0.6, 0.4] }],
        target: { readoutKey: 'cvdChange', comparator: 'lte', value: -600 },
      },
      explanation:
        'At a 50% share the line is flat however much trades: heavy volume with balanced aggressors moves CVD nowhere. Tilt the share to 40% and every bar adds a negative delta, so the line slopes down, and more volume or more bars make it steeper. CVD measures the tilt in aggression, multiplied by how much traded, added up over time.',
    },
    {
      id: 'match-divergences',
      type: 'concept_match',
      tags: ['bitcoin', 'microstructure', 'cvd'],
      xp: 45,
      prompt: 'Price and CVD do not always move together. Match each pattern to its likeliest reading.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'flat-falling',
          term: 'Price flat, CVD falling hard',
          definition: 'A large resting buyer is absorbing the aggressive selling',
        },
        {
          id: 'up-falling',
          term: 'Price rising, CVD falling',
          definition: 'Sellers hit bids, yet asks were pulled or bids kept stepping up',
        },
        {
          id: 'down-flat',
          term: 'Price falling, CVD flat',
          definition: 'Little traded: bids were withdrawn rather than sold into',
        },
        {
          id: 'spot-futures',
          term: 'Spot CVD rising, futures CVD falling',
          definition: 'Spot buyers taking coins while derivatives traders sell or hedge',
        },
      ],
      explanation:
        'A divergence means aggression and price disagree, so something passive is doing the work: limit orders absorbing, or limit orders disappearing. Each of these readings is a hypothesis to check against the order book, open interest and other venues, not a conclusion. That is the habit the rest of this module keeps asking for.',
    },
    {
      id: 'mc-honest-reading',
      type: 'multiple_choice',
      tags: ['bitcoin', 'microstructure', 'cvd'],
      xp: 40,
      prompt: 'CVD on one large exchange fell sharply over an hour. What is the honest conclusion?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'venue', label: 'Aggressive selling led on that venue; check others and the book' },
        {
          id: 'signal',
          label: 'The price will keep falling, so it is a signal to sell',
          feedback:
            'CVD describes what already happened. It is indicative at best, and nothing in this module is a trading signal.',
        },
        {
          id: 'whales',
          label: 'Large holders are dumping their coins',
          feedback:
            'CVD cannot see who traded, only which side was the aggressor. Many small market sells and one large one look alike.',
        },
        {
          id: 'useless',
          label: 'Nothing: CVD from a single exchange is meaningless',
          feedback:
            'It is partial, not meaningless. It tells you what happened on that venue; the work is checking whether the rest of the market agrees.',
        },
      ],
      correctOptionId: 'venue',
      explanation:
        'Three limits keep a CVD reading honest. One exchange is not the market, and spot and futures can disagree. Deciding which side was the aggressor is itself an approximation, inferred from the trade price against the quotes. And a falling line says sellers were in a hurry, not why, nor what comes next. Read it as one piece of evidence among several.',
    },
  ],
  keyTakeaways: [
    'Every trade has both a buyer and a seller; CVD counts who was the aggressor.',
    'A bar’s delta is buyer-initiated minus seller-initiated volume.',
    'CVD is the running sum of deltas; read its slope, never its level.',
    'Divergence from price points to limit orders absorbing or vanishing.',
    'One venue’s CVD is indicative, never proof and never a signal.',
  ],
});
