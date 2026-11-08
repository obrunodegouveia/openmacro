import { defineLesson } from '../../schema';

/**
 * Derivatives: where most of Bitcoin's volume and most of its violence live.
 *
 * The target skill is telling a leveraged long squeeze apart from genuine
 * spot distribution. They can produce the same candle, and they have opposite
 * implications for what is left afterwards: a squeeze clears positions out,
 * distribution means holders actually want out.
 */
export const btcLeverageAndLiquidationsLesson = defineLesson({
  id: 'btc-leverage-and-liquidations',
  title: 'Leverage Pulls the Trigger',
  subtitle:
    'Perpetual futures let traders borrow exposure, and borrowed exposure can be closed for them. That is how a small fall becomes a cascade.',
  icon: '⛓️',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'match-derivative-terms',
      type: 'concept_match',
      tags: ['bitcoin', 'derivatives'],
      xp: 35,
      prompt: 'Match each derivatives term to what it measures.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'perp',
          term: 'Perpetual future',
          definition: 'A futures contract with no expiry, tethered to spot by funding',
        },
        {
          id: 'funding',
          term: 'Funding rate',
          definition: 'The periodic payment between longs and shorts that pulls the perp to spot',
        },
        {
          id: 'oi',
          term: 'Open interest',
          definition: 'The number of contracts outstanding, not yet closed',
        },
        {
          id: 'basis',
          term: 'Futures basis',
          definition: 'The premium of a dated future over spot',
        },
        {
          id: 'liq',
          term: 'Liquidation',
          definition: 'A position closed by the exchange because margin ran out',
        },
      ],
      explanation:
        'Open interest counts positions, not trades: it rises when new longs and shorts open against each other and falls when they close. Funding is positive when longs pay shorts, which happens when the perp trades above spot — usually a sign that leveraged demand is on the long side. Basis tells the same story on dated futures.',
    },
    {
      id: 'sim-liquidation-distance',
      type: 'interactive_sim',
      tags: ['bitcoin', 'derivatives', 'leverage'],
      xp: 50,
      currency: 'USD',
      constants: { margin: 1000, maintenanceMargin: 0.005 },
      prompt: 'How small a fall does it take to liquidate a leveraged long?',
      instructions: 'Raise the leverage and watch the distance to liquidation shrink',
      narrative:
        'A hypothetical long on isolated margin with $1,000 posted. The exchange closes it once losses leave less than 0.5% maintenance margin. Fees and funding are ignored.',
      sliders: [
        {
          key: 'leverage',
          label: 'Leverage',
          min: 1,
          max: 50,
          step: 1,
          defaultValue: 5,
          format: 'multiplier',
        },
      ],
      readouts: [
        {
          key: 'notional',
          label: 'Position size',
          formulaId: 'btc_position_notional',
          format: 'currency',
          caption: 'Margin × leverage',
        },
        {
          key: 'distance',
          label: 'Fall that triggers liquidation',
          formulaId: 'btc_liquidation_distance',
          format: 'percent',
          emphasis: true,
          caption: '1 ÷ leverage − maintenance margin',
        },
      ],
      objective: {
        description: 'Compare 5x and 20x, then find a leverage a 3% fall would liquidate',
        requiredObservations: [{ sliderKey: 'leverage', values: [5, 20] }],
        target: { readoutKey: 'distance', comparator: 'lte', value: 0.03 },
      },
      explanation:
        'At 5x a long survives a fall of nearly 20%; at 30x it is gone after about 3%, a move Bitcoin can make in an hour. When many positions share similar leverage and entry prices, their liquidation levels cluster, and those clusters are where cascades start.',
    },
    {
      id: 'order-cascade',
      type: 'order_flow',
      tags: ['bitcoin', 'derivatives', 'liquidations'],
      xp: 40,
      prompt: 'A long liquidation cascade. Put it in order.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'crowd', label: 'Leveraged longs build up', detail: 'Open interest and funding rise together' },
        { id: 'dip', label: 'An ordinary dip arrives' },
        { id: 'first', label: 'The most leveraged longs are liquidated' },
        { id: 'forced', label: 'Their positions are sold into the book', detail: 'Forced market sells, regardless of price' },
        { id: 'next', label: 'The next cluster of liquidation levels is hit' },
        { id: 'flush', label: 'Open interest drops sharply and funding resets' },
      ],
      correctOrder: ['crowd', 'dip', 'first', 'forced', 'next', 'flush'],
      explanation:
        'A liquidation is a market order that nobody chose to send at that price. Each one pushes the price toward the next cluster, which sends more forced orders, which is why these moves accelerate and then stop abruptly once the leverage is gone. Afterwards open interest is lower and funding is closer to neutral — the fuel has been burned.',
    },
    {
      id: 'mc-squeeze-or-distribution',
      type: 'multiple_choice',
      tags: ['bitcoin', 'derivatives', 'diagnosis'],
      xp: 45,
      prompt:
        'Bitcoin fell 6%. Futures CVD collapsed, open interest fell 12%, and spot exchanges saw little net selling. Which reading fits best?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'squeeze', label: 'A leveraged long squeeze — positions were closed, many of them forced' },
        {
          id: 'distribution',
          label: 'Spot holders distributing their coins into the fall',
          feedback:
            'Distribution would show up where the coins trade: heavy spot selling and a falling spot CVD. Here spot was quiet and the action was in futures.',
        },
        {
          id: 'new-shorts',
          label: 'New shorts piling in to bet on further falls',
          feedback:
            'New shorts open positions, so open interest would rise. A 12% fall in open interest means positions were closing.',
        },
        {
          id: 'macro',
          label: 'A global repricing of risk assets across markets',
          feedback:
            'Possible as the trigger, but nothing here shows it. Check equities, the dollar and yields before naming macro.',
        },
      ],
      correctOptionId: 'squeeze',
      explanation:
        'Aggressive selling in futures with falling open interest is longs exiting, voluntarily or not. Quiet spot means the people who own coins outright did not join in. Liquidation records are what establish how much of it was forced. The distinction matters because a squeeze removes leverage and can leave the market cleaner, whereas distribution means real holders want out at these prices.',
    },
    {
      id: 'mc-funding-signal',
      type: 'multiple_choice',
      tags: ['bitcoin', 'derivatives', 'funding'],
      xp: 40,
      prompt: 'Funding has been strongly positive for two weeks while the price drifts up. What does that tell you?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'crowded', label: 'Longs are paying to stay in, so the positioning is crowded on one side' },
        {
          id: 'top',
          label: 'The price is about to fall, because the rally is exhausted',
          feedback:
            'Crowded positioning raises the vulnerability to a squeeze; it does not set a date. Funding can stay high for a long time.',
        },
        {
          id: 'spot-demand',
          label: 'Spot buyers are absorbing all the supply',
          feedback:
            'Funding is set in the perpetual market. A rally carried by perps with high funding is a different animal from one carried by spot buying.',
        },
        {
          id: 'nothing',
          label: 'Nothing — funding is just a fee and carries no information',
          feedback:
            'It is a fee that tells you which side is willing to pay to hold its position, which is information about who is leveraged.',
        },
      ],
      correctOptionId: 'crowded',
      explanation:
        'Funding measures how much leveraged traders pay to keep a position. Persistently high funding says the long side is crowded and borrowed, which makes the market more fragile to a dip — but fragility is not a forecast. It is a condition worth noting in the journal, not a signal to act on.',
    },
  ],
  keyTakeaways: [
    'Open interest counts positions; it falls when they close.',
    'Higher leverage means a smaller fall triggers liquidation.',
    'A liquidation is a forced market order, which is why cascades accelerate.',
    'Futures selling with falling OI and quiet spot reads as deleveraging, not distribution.',
  ],
});
