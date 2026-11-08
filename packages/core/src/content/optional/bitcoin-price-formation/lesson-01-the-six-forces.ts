import { defineLesson } from '../../schema';

/**
 * The framing lesson. Six forces move the price, and they answer two different
 * questions: three of them say how the price moved, three say why anybody
 * wanted it to. Most bad Bitcoin commentary is one of those mistaken for the
 * other.
 *
 * It ends on the distinction the whole module is built around — mechanism,
 * motivation and prediction are three separate claims, each harder to prove
 * than the last.
 */
export const btcTheSixForcesLesson = defineLesson({
  id: 'btc-the-six-forces',
  title: 'Who Moved the Price?',
  subtitle:
    'Every price change is a marginal buyer and a marginal seller agreeing on a new number. Six forces decide when they do, and they are not all the same kind of force.',
  icon: '🧭',
  difficulty: 'core',
  estimatedMinutes: 8,
  challenges: [
    {
      id: 'mc-the-real-question',
      type: 'multiple_choice',
      tags: ['bitcoin', 'price-formation'],
      xp: 30,
      prompt: 'Bitcoin trades at a new, lower price. What, mechanically, had to happen?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'marginal',
          label: 'A seller hit lower bids, or the bids above them were cancelled',
        },
        {
          id: 'more-sellers',
          label: 'There were more sellers than buyers in the market that hour',
          feedback:
            'Every trade has exactly one buyer and one seller, so the count is always equal. What differs is who was in a hurry — the side crossing the spread decides the direction.',
        },
        {
          id: 'value-fell',
          label: 'Its fundamental value fell, so the price followed it',
          feedback:
            'Perhaps, but a change in value only reaches the price through somebody trading on it. The question is about the mechanism, and the mechanism is orders.',
        },
        {
          id: 'volume',
          label: 'Trading volume rose above its recent average',
          feedback:
            'Volume can rise in a rally, a crash or a dead-flat churn. On its own it says nothing about direction.',
        },
      ],
      correctOptionId: 'marginal',
      explanation:
        'The price is the last trade, and a trade happens at a new level only when somebody is willing to transact there. That can be a seller who crosses the spread and hits lower bids, or buyers who withdraw their bids so the next trade happens lower. The whole module is about what changes the willingness of that marginal buyer and seller.',
    },
    {
      id: 'match-six-forces',
      type: 'concept_match',
      tags: ['bitcoin', 'price-formation'],
      xp: 35,
      prompt: 'Match each force to the question it answers.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'flow',
          term: 'Spot order flow',
          definition: 'Who is aggressively buying or selling right now?',
        },
        {
          id: 'liquidity',
          term: 'Liquidity',
          definition: 'How much trading does it take to move the price?',
        },
        {
          id: 'derivatives',
          term: 'Derivatives positioning',
          definition: 'Is leverage amplifying the move?',
        },
        {
          id: 'capital',
          term: 'Capital flows',
          definition: 'Is new money entering or leaving Bitcoin exposure?',
        },
        {
          id: 'onchain',
          term: 'On-chain supply',
          definition: 'Which holders are distributing or accumulating?',
        },
        {
          id: 'macro',
          term: 'Macroeconomics',
          definition: 'Why does the market now value risk differently?',
        },
      ],
      explanation:
        'Bitcoin is unusual in that three of these can be observed directly: the exchange order books, the derivatives positioning, and the blockchain itself. They are three separate information systems, and the skill is reading them together. None of them acts alone — leverage amplifies flow, flow is absorbed or not by liquidity, and macro changes who wants to hold the asset at all.',
    },
    {
      id: 'mc-mechanics-vs-motivation',
      type: 'multiple_choice',
      tags: ['bitcoin', 'price-formation'],
      xp: 35,
      prompt:
        'Which three forces mostly explain the immediate mechanics of a move, rather than the reason behind it?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'mech', label: 'Order flow, liquidity and derivatives' },
        {
          id: 'macro-first',
          label: 'Macroeconomics, capital flows and on-chain supply',
          feedback:
            'These are the motivation. They explain why participants want to buy or sell, usually over weeks and months, but the hour-by-hour path runs through the order book.',
        },
        {
          id: 'onchain-mech',
          label: 'On-chain supply, liquidity and order flow',
          feedback:
            'On-chain movements are slow and inferential — a coin moving to an exchange is not yet a sale. They belong with the motivation.',
        },
        {
          id: 'all-same',
          label: 'All six work on the same horizon',
          feedback:
            'They do not. A liquidation cascade lasts minutes; a shift in real interest rates plays out over quarters. Mixing horizons is a common source of confident nonsense.',
        },
      ],
      correctOptionId: 'mech',
      explanation:
        'Order flow, liquidity and derivatives describe how the price got from one number to another. Capital flows, holder supply and macro describe why people wanted it to, and they matter more the longer the horizon. A good explanation of a move usually needs one of each: a mechanism and a motivation.',
    },
    {
      id: 'order-three-claims',
      type: 'order_flow',
      tags: ['bitcoin', 'method'],
      xp: 35,
      prompt: 'Three claims about a move, from the easiest to prove to the hardest.',
      instructions: 'First step at the top',
      events: [
        {
          id: 'mechanism',
          label: 'Mechanism',
          detail: 'Which orders actually moved the price',
        },
        {
          id: 'motivation',
          label: 'Motivation',
          detail: 'Why participants submitted or withdrew those orders',
        },
        {
          id: 'prediction',
          label: 'Prediction',
          detail: 'Whether knowing this improves a forecast of what comes next',
        },
      ],
      correctOrder: ['mechanism', 'motivation', 'prediction'],
      explanation:
        'With granular exchange data, the mechanism can be established with real precision. Motivation is partly inference — you see the orders, not the minds behind them. Prediction is a statistical claim that has to be tested out of sample, and most stories that explain the past well fail it. Keeping the three apart is the single most useful habit in this module.',
    },
    {
      id: 'mc-correlation',
      type: 'multiple_choice',
      tags: ['bitcoin', 'method'],
      xp: 40,
      prompt:
        'On a day Bitcoin fell 5%, coins sent to exchanges rose sharply. What can you honestly conclude?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'consistent',
          label: 'It is consistent with selling, but the deposits alone do not prove they caused it',
        },
        {
          id: 'proved',
          label: 'Holders sold, and their selling caused the fall',
          feedback:
            'Deposits are not sales: coins can move to post as collateral, to rebalance between wallets, or after the fall, in reaction to it. That is a story, not yet a finding.',
        },
        {
          id: 'irrelevant',
          label: 'Nothing — on-chain data never matters for price',
          feedback:
            'Too strong. Exchange inflows are a reasonable input; they are just not proof on their own.',
        },
        {
          id: 'buy',
          label: 'The fall is over, because the sellers have now sold',
          feedback:
            'That is a prediction smuggled in as an observation. Whether this pattern forecasts anything has to be tested, not assumed.',
        },
      ],
      correctOptionId: 'consistent',
      explanation:
        'Explaining a move after the fact is far easier than predicting the next one, and a coincidence in time is not causation. The honest form is "this is consistent with X, and here is what would confirm it" — in this case, whether the deposited coins were actually sold, and whether the selling came before or after the fall. Every diagnosis in this module is indicative, not proof, and none of it is a trading signal.',
    },
  ],
  keyTakeaways: [
    'A new price needs a marginal buyer or seller willing to trade there.',
    'Order flow, liquidity and leverage are the mechanism; capital, holders and macro the motivation.',
    'Mechanism, motivation and prediction are three claims, each harder to prove.',
    'Coincidence in time is not causation — say "consistent with", then test it.',
  ],
});
