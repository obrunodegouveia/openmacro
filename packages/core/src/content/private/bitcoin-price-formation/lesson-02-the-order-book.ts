import { defineLesson } from '../../schema';

/**
 * Market microstructure: how orders become a price.
 *
 * The goal set for this lesson is one specific puzzle — how Bitcoin can fall
 * 3% while relatively little is actually sold. The answer is that the price
 * depends on resting liquidity as much as on trades, and resting liquidity
 * can be cancelled without a single trade printing.
 */
export const btcTheOrderBookLesson = defineLesson({
  id: 'btc-the-order-book',
  title: 'The Book Behind the Price',
  subtitle:
    'Trades print the price, but the order book decides how far each trade moves it. Learn to read both, and how a price can fall with almost nothing sold.',
  icon: '📒',
  difficulty: 'core',
  estimatedMinutes: 9,
  challenges: [
    {
      id: 'match-order-terms',
      type: 'concept_match',
      tags: ['bitcoin', 'microstructure'],
      xp: 35,
      prompt: 'Match each piece of the order book to what it is.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'limit',
          term: 'Limit order',
          definition: 'Rests in the book at a chosen price and supplies liquidity',
        },
        {
          id: 'market',
          term: 'Market order',
          definition: 'Executes at once against resting orders and takes liquidity',
        },
        {
          id: 'spread',
          term: 'Spread',
          definition: 'The gap between the best bid and the best ask',
        },
        {
          id: 'depth',
          term: 'Depth',
          definition: 'How much is resting within a given distance of the price',
        },
        {
          id: 'slippage',
          term: 'Slippage',
          definition: 'How far a large order’s average fill lands from the quoted price',
        },
      ],
      explanation:
        'The market order is the aggressor: it crosses the spread and consumes resting limit orders, level by level, until it is filled. The deeper the book, the less each level consumed moves the price. That is why "how much was traded" is the wrong first question and "how much was traded against how much was resting" is the right one.',
    },
    {
      id: 'mc-what-cvd-measures',
      type: 'multiple_choice',
      tags: ['bitcoin', 'microstructure', 'cvd'],
      xp: 35,
      prompt: 'Cumulative volume delta (CVD) adds up, over time, what?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'aggressor', label: 'Volume bought by aggressive buyers minus volume sold by aggressive sellers' },
        {
          id: 'total',
          label: 'Total volume traded on all exchanges',
          feedback:
            'Total volume has no sign. CVD exists precisely because every trade has both a buyer and a seller, and the only meaningful split is which of them crossed the spread.',
        },
        {
          id: 'book',
          label: 'Bids resting in the book minus asks resting in the book',
          feedback:
            'That is order-book imbalance — liquidity that has not traded. CVD counts trades that did execute.',
        },
        {
          id: 'onchain',
          label: 'Coins moved onto exchanges minus coins moved off',
          feedback:
            'That is net exchange flow, an on-chain measure. CVD is built from exchange trade data.',
        },
      ],
      correctOptionId: 'aggressor',
      explanation:
        'Each trade is tagged by its aggressor: a market buy lifting the ask, or a market sell hitting the bid. CVD is the running sum of buys minus sells, so a falling CVD means sellers were the ones in a hurry. Spot CVD and futures CVD are worth keeping apart — they often disagree, and the disagreement is informative.',
    },
    {
      id: 'sim-thin-book',
      type: 'interactive_sim',
      tags: ['bitcoin', 'microstructure', 'liquidity'],
      xp: 50,
      currency: 'USD',
      constants: {},
      prompt: 'The same $100m of market selling. How far does it move the price?',
      instructions: 'Hold the selling at $100m and thin the book out',
      narrative:
        'A hypothetical book with the same number of dollars resting in every 1% band below the price. Market selling eats through it band by band. Depth is the dollars resting per 1%.',
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
          hint: 'Bids resting within each 1% band',
        },
      ],
      readouts: [
        {
          key: 'impact',
          label: 'Price change',
          formulaId: 'btc_price_impact',
          format: 'percent',
          emphasis: true,
          caption: 'Net flow ÷ depth per 1%',
        },
      ],
      objective: {
        description: 'Compare a book with $50m per 1% to one with $12.5m, then leave it at an 8% fall',
        requiredObservations: [{ sliderKey: 'bookDepth', values: [50_000_000, 12_500_000] }],
        target: { readoutKey: 'impact', comparator: 'lte', value: -0.08 },
      },
      explanation:
        'The selling never changed; only the resting bids did, and the same $100m went from a 2% fall to an 8% one. A real book is not uniform and real impact grows more slowly than size — closer to a square root than a straight line — but the lesson holds: price impact is a function of flow and liquidity together, never of flow alone.',
    },
    {
      id: 'order-bids-pulled',
      type: 'order_flow',
      tags: ['bitcoin', 'microstructure', 'liquidity'],
      xp: 40,
      prompt: 'How Bitcoin falls 3% on modest selling. Put it in order.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'news', label: 'Uncertainty rises', detail: 'A headline, a large transfer, a sharp move elsewhere' },
        { id: 'cancel', label: 'Market makers cancel bids', detail: 'Resting liquidity below the price thins out' },
        { id: 'sell', label: 'A modest market sell arrives', detail: 'An ordinary size on an ordinary day' },
        { id: 'sweep', label: 'It sweeps several thin levels', detail: 'Each consumed level is further away' },
        { id: 'reprice', label: 'The price prints 3% lower', detail: 'With little volume actually traded' },
      ],
      correctOrder: ['news', 'cancel', 'sell', 'sweep', 'reprice'],
      explanation:
        'Liquidity providers are not obliged to stay. When they think the risk of being run over has risen, they widen quotes and pull size, and the book becomes a vacuum. A seller who would have moved the price 0.5% an hour earlier now moves it 3%. Cancellations leave no trade on the tape, which is why looking only at executed volume misses half of what happened.',
    },
    {
      id: 'mc-consumed-or-withdrawn',
      type: 'multiple_choice',
      tags: ['bitcoin', 'microstructure', 'liquidity'],
      xp: 40,
      prompt:
        'Bid depth within 1% of the price halved during a fall, while executed market selling stayed small. What most likely happened to the bids?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'withdrawn', label: 'They were withdrawn — cancelled rather than filled' },
        {
          id: 'consumed',
          label: 'They were consumed by sellers',
          feedback:
            'Consuming that much depth would have shown up as heavy executed selling and a sharply falling CVD. Small selling against vanishing depth points to cancellation.',
        },
        {
          id: 'moved-up',
          label: 'They moved above the price',
          feedback:
            'A bid above the best ask would simply execute. Bids sit below the price by definition.',
        },
        {
          id: 'onchain',
          label: 'The coins behind them left the exchange',
          feedback:
            'Bids are cash offers to buy, not coins. Their disappearance is a choice by whoever placed them.',
        },
      ],
      correctOptionId: 'withdrawn',
      explanation:
        'Depth can disappear in two ways, and they mean different things. Consumed depth is selling pressure that was met. Withdrawn depth is buyers stepping back, which lets a small flow move the price a long way and often reverses when they return. Comparing executed flow with the change in resting depth is how you tell them apart.',
    },
  ],
  keyTakeaways: [
    'Market orders take liquidity; limit orders supply it.',
    'CVD sums aggressive buying minus aggressive selling.',
    'The same flow moves price far more through a thin book.',
    'Cancelled bids move the price without leaving a trade on the tape.',
  ],
});
