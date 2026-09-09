import { defineLesson } from '../../schema';

/**
 * The trade-off lesson, and the one that makes Mariana an economics story
 * rather than a technology story.
 *
 * The simulation is anchored on the report's own calibration result: a €50
 * million EUR/CHF trade at a cost of about one basis point requires a pool of
 * roughly €1.8 billion, and holding a cost steady while doubling the trade
 * size requires roughly doubling the pool (Graph 4 and the surrounding text).
 * So cost is approximately proportional to trade ÷ pool, and the sliders stay
 * inside the region the report actually plots.
 *
 * The finding the learner is meant to leave with is the report's own: "the use
 * of AMMs requires the pre-funding of liquidity and their adoption would
 * therefore entail a significant departure from the ex post funding (deferred
 * net settlement) in use in today's FX markets."
 */
export const thePriceOfInstantFxLesson = defineLesson({
  id: 'the-price-of-instant-fx',
  title: 'What Instant Settlement Costs',
  subtitle:
    'The pool really does remove settlement risk. Now work out how much central bank money has to sit in it, doing nothing, for that to be true.',
  icon: '⚖️',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'mc-what-it-replaces',
      type: 'multiple_choice',
      tags: ['fx', 'settlement-risk', 'pvp'],
      xp: 25,
      prompt:
        'Foreign exchange turned over $9.6 trillion a day in April 2025, about $3 trillion of it spot — and much of it still settles with delays of up to two days. What specific risk does settling both legs in a single transaction remove?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'settlement-risk',
          label:
            'The risk that you have paid your leg and your counterparty fails before paying theirs',
        },
        {
          id: 'market-risk',
          label: 'The risk that the exchange rate moves against you',
          feedback:
            'Price risk is untouched, and arguably raised: against a pool, the rate you get moves with the size of your own trade. Settlement risk is about delivery, not about price.',
        },
        {
          id: 'credit-risk-loans',
          label: 'The credit risk on the loan books of the participating banks',
          feedback:
            'Nothing in this design lends to anybody. The risk being removed lives entirely inside the settlement window of an FX trade.',
        },
        {
          id: 'liquidity-risk',
          label: 'The risk that there is no liquidity in a currency pair',
          feedback:
            'The report is blunt about this one: an AMM "does not, in and of itself, solve any underlying market or funding liquidity issues that might exist in a currency pair". If nobody funds the pool, there is no price at all.',
        },
      ],
      correctOptionId: 'settlement-risk',
      explanation:
        'This is Herstatt risk, named for the German bank closed in 1974 after it had taken in Deutschmarks and before it had paid out dollars. Payment-versus-payment is the standard answer and CLS is the machinery that delivers it today, by netting and settling in batches. The market-maker gets to the same place differently — by making the trade and the settlement the same atomic event — which is why it needs the money to be there before anyone trades.',
    },
    {
      id: 'sim-pool-depth',
      type: 'interactive_sim',
      tags: ['fx', 'amm', 'liquidity'],
      xp: 40,
      currency: 'EUR',
      prompt: 'How deep does a pool have to be before trading against it is cheap?',
      instructions: 'Move both sliders, then meet the objective',
      narrative:
        'Mariana calibrated its market-maker and then simulated what trading against it would cost. One published anchor: a €50 million EUR/CHF trade costs about one basis point when the pool holds roughly €1.8 billion. The report also states that doubling the trade size requires roughly doubling the pool to hold the cost steady. Find out what a cheap market demands.',
      constants: {},
      sliders: [
        {
          key: 'poolSize',
          label: 'Liquidity in the pool',
          min: 200_000_000,
          max: 5_000_000_000,
          step: 100_000_000,
          defaultValue: 1_000_000_000,
          format: 'currency',
          hint: 'Wholesale CBDC committed by banks in advance, and unavailable for anything else while it waits',
        },
        {
          key: 'tradeSize',
          label: 'Size of the trade',
          min: 10_000_000,
          max: 200_000_000,
          step: 10_000_000,
          defaultValue: 50_000_000,
          format: 'currency',
          hint: 'One spot EUR/CHF ticket, of the size a bank deals in',
        },
      ],
      readouts: [
        {
          key: 'costBp',
          label: 'Trading cost',
          formulaId: 'amm_trading_cost_bp',
          format: 'number',
          emphasis: true,
          caption: 'basis points ≈ 36 × trade ÷ pool',
        },
        {
          key: 'costAmount',
          label: 'What that costs you',
          formulaId: 'amm_trading_cost_amount',
          format: 'currency',
        },
        {
          key: 'poolMultiple',
          label: 'Pool, in multiples of the trade',
          formulaId: 'amm_pool_to_trade',
          format: 'multiplier',
        },
      ],
      objective: {
        description: 'Get the trading cost down to one basis point or less',
        requiredObservations: [
          { sliderKey: 'tradeSize', values: [50_000_000, 100_000_000] },
          { sliderKey: 'poolSize', values: [1_800_000_000] },
        ],
      },
      explanation:
        'Cost is a ratio: what you are trading, against what is already sitting there. A basis point on €50 million is €5,000, which sounds like nothing — until you notice it took €1.8 billion of central bank money parked in a pool, in advance, doing nothing else, to get there. That is the trade the report states plainly: the use of these pools "requires the pre-funding of liquidity and their adoption would therefore entail a significant departure from the ex post funding (deferred net settlement) in use in today’s FX markets". Today a bank trades all day and funds one net number at the end. Here it funds first and trades afterwards.',
    },
    {
      id: 'mc-prefunding',
      type: 'multiple_choice',
      tags: ['liquidity', 'settlement', 'amm'],
      xp: 30,
      prompt:
        'Why is pre-funding treated as the central objection, when the banks providing the liquidity can withdraw it again?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'opportunity-cost',
          label:
            'Because the money is committed in advance and can do nothing else while it waits — and the pool has to be very large relative to the trades it serves',
        },
        {
          id: 'lost',
          label: 'Because liquidity put into a pool is gone for good',
          feedback:
            'It is not gone: providers hold LP tokens and can withdraw. The cost is what the money could have been earning elsewhere, plus the divergence loss you will meet next.',
        },
        {
          id: 'taxed',
          label: 'Because pre-funded balances attract a capital charge that netting avoids',
          feedback:
            'Regulatory treatment is a real question and the report leaves it out of scope. The cost it does name is the departure from deferred net settlement.',
        },
        {
          id: 'no-interest',
          label: 'Because a wholesale CBDC pays no interest by design',
          feedback:
            'Remuneration of wholesale CBDC was explicitly out of scope in Mariana and is listed as an open monetary policy question for future work. Nobody has decided it pays nothing.',
        },
      ],
      correctOptionId: 'opportunity-cost',
      explanation:
        'Deferred net settlement exists because it is cheap on liquidity: a day of trading between two banks might be thousands of tickets and one net payment. Gross pre-funded settlement is the opposite bargain — certainty bought with idle money. Neither is obviously the right answer, and the report is careful to say that commercial viability against existing arrangements remains unresolved and would need the FX market itself to help test it.',
    },
    {
      id: 'mc-divergence-loss',
      type: 'multiple_choice',
      tags: ['amm', 'liquidity', 'arbitrage'],
      xp: 30,
      prompt:
        'The euro/franc rate moves in the outside market while a bank’s money is sitting in the pool. What happens to that bank?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'divergence',
          label:
            'Arbitrageurs trade against the stale pool price, and the provider is left holding more of the currency that fell and less of the one that rose',
        },
        {
          id: 'protected',
          label: 'Nothing — the pool rebalances automatically and providers are held whole',
          feedback:
            'The rebalancing is what does the damage. It happens by arbitrageurs taking whichever side is cheap, and the loss lands on whoever supplied the pool.',
        },
        {
          id: 'central-bank-covers',
          label: 'The central bank that issued the token covers the difference',
          feedback:
            'There is no such backstop anywhere in the design. Central banks issue, allow-list and redeem; the market risk of providing liquidity sits with the commercial banks that chose to take it.',
        },
        {
          id: 'fees-always-cover',
          label: 'Fees always exceed it, which is what makes liquidity provision profitable',
          feedback:
            'Fees are calibrated to try to make provision profitable. The report describes that calibration as varying one parameter at a time, yielding "ranges of values that yield acceptable results" rather than an optimum, and says robustness would need further testing.',
        },
      ],
      correctOptionId: 'divergence',
      explanation:
        'This is divergence loss — impermanent loss, in decentralised finance’s more optimistic vocabulary — and the report treats it as the equivalent of adverse selection cost in an order book. It is why liquidity provision has to be paid for at all. It is also the quiet reason a central bank cannot simply decree that its wholesale FX market runs on a pool: somebody has to want to fund it, at a price that leaves them ahead.',
    },
    {
      id: 'mc-out-of-scope',
      type: 'multiple_choice',
      tags: ['mariana', 'scope', 'method'],
      xp: 30,
      prompt: 'Which of these was in scope for Project Mariana?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'feasibility',
          label:
            'Whether the architecture works technically, and how pool size and trade size drive the cost of trading',
        },
        {
          id: 'legal',
          label: 'The legal status of the transnational network and of the tokens held on it',
          feedback:
            'Explicitly out of scope, alongside governance of the market-maker and of the platforms. A monetary claim whose legal status is unsettled is not yet a monetary instrument.',
        },
        {
          id: 'integration',
          label: 'Integration with the real-time gross settlement systems that exist today',
          feedback:
            'Out of scope, and named as such. Connecting DLT platforms to the existing settlement system is precisely what the Eurosystem’s Pontes project is for — three years later, and as a separate undertaking.',
        },
        {
          id: 'privacy',
          label: 'Privacy and technical performance',
          feedback:
            'Both listed as out of scope under "non-functional aspects". The report mentions stealth addresses as a possible direction, which is a research pointer rather than a design.',
        },
      ],
      correctOptionId: 'feasibility',
      explanation:
        'The out-of-scope list is the most informative passage in the report and the one nobody quotes. Governance, law, privacy, performance, RTGS integration and remuneration were all set aside so that feasibility could be tested cleanly. That is ordinary engineering practice — and it means a working prototype is entirely compatible with every hard policy question being untouched. When somebody says a CBDC "has been built", the useful reply is to ask which of those six they built.',
    },
  ],
  keyTakeaways: [
    'What the design removes is settlement risk — Herstatt risk — by making the trade and the settlement one atomic event.',
    'Cost is a ratio of trade size to pool depth: roughly €1.8bn of pool for one basis point on a €50m trade.',
    'The price of instant gross settlement is pre-funding, which is a real departure from deferred net settlement.',
    'Liquidity providers bear divergence loss, so the pool exists only if funding it pays.',
    'Law, governance, privacy, performance, RTGS integration and remuneration were all out of scope.',
  ],
});
