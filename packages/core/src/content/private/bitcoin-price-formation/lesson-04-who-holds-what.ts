import { defineLesson } from '../../schema';

/**
 * On-chain economics: who is sitting on a profit, who is taking it, and at
 * what prices supply might come loose.
 *
 * The blockchain records when each coin last moved and, by joining that to
 * the price on the day, roughly what it cost its current holder. Every
 * measure in this lesson is built from that one idea — and inherits its
 * limits, since one entity can own many addresses and exchanges pool
 * thousands of customers into a few.
 */
export const btcWhoHoldsWhatLesson = defineLesson({
  id: 'btc-who-holds-what',
  title: 'What Every Coin Cost',
  subtitle:
    'The blockchain shows when each coin last moved, and so roughly what its holder paid. From that you can see who is in profit, who is taking it, and where supply might be waiting.',
  icon: '🧾',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'match-onchain-terms',
      type: 'concept_match',
      tags: ['bitcoin', 'on-chain'],
      xp: 35,
      prompt: 'Match each on-chain measure to what it describes.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'realized',
          term: 'Realized capitalization',
          definition: 'Every coin valued at the price it last moved, summed',
        },
        {
          id: 'mvrv',
          term: 'MVRV',
          definition: 'Market value divided by realized value',
        },
        {
          id: 'sopr',
          term: 'SOPR',
          definition: 'Price when coins are spent over price when they were last moved',
        },
        {
          id: 'urpd',
          term: 'URPD',
          definition: 'How much of the supply last moved at each price level',
        },
        {
          id: 'flows',
          term: 'Exchange net flow',
          definition: 'Coins deposited to exchanges minus coins withdrawn',
        },
      ],
      explanation:
        'Market capitalization values every coin at today’s price; realized capitalization values each at the price it last changed hands, which approximates what holders collectively paid. MVRV compares the two. SOPR looks only at coins spent today and asks whether they were sold at a profit (above 1) or a loss (below 1). URPD shows where the cost bases are bunched.',
    },
    {
      id: 'sim-mvrv',
      type: 'interactive_sim',
      tags: ['bitcoin', 'on-chain', 'mvrv'],
      xp: 50,
      currency: 'USD',
      constants: { realizedPrice: 40000 },
      prompt: 'The average coin last moved at $40,000. What does the price do to its holder?',
      instructions: 'Move the price and watch the average holder’s position',
      narrative:
        'A hypothetical realized price of $40,000 — the average price at which the whole supply last moved. The market price is yours to set.',
      sliders: [
        {
          key: 'price',
          label: 'Market price',
          min: 20000,
          max: 120000,
          step: 5000,
          defaultValue: 60000,
          format: 'currency',
        },
      ],
      readouts: [
        {
          key: 'mvrv',
          label: 'MVRV',
          formulaId: 'btc_mvrv',
          format: 'multiplier',
          emphasis: true,
          caption: 'Price ÷ realized price',
        },
        {
          key: 'unrealised',
          label: 'Average unrealised gain',
          formulaId: 'btc_average_unrealised',
          format: 'percent',
          caption: 'MVRV − 1',
        },
      ],
      objective: {
        description: 'Look at $30,000 and $100,000, then leave the average holder at a loss',
        requiredObservations: [{ sliderKey: 'price', values: [30000, 100000] }],
        target: { readoutKey: 'mvrv', comparator: 'lt', value: 1 },
      },
      explanation:
        'At $100,000 the average holder sits on a 150% gain, and a lot of supply has a reason to sell into strength. Below $40,000 the average holder is under water, and the sellers left tend to be those forced to or giving up. MVRV describes the incentive; it does not say when anyone will act on it.',
    },
    {
      id: 'mc-sopr-below-one',
      type: 'multiple_choice',
      tags: ['bitcoin', 'on-chain', 'sopr'],
      xp: 40,
      prompt: 'SOPR drops below 1 for several days during a fall. What does that say?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'losses', label: 'Coins being spent are, on average, being sold at a loss' },
        {
          id: 'holders-loss',
          label: 'Most holders are now at a loss',
          feedback:
            'SOPR only looks at coins that moved today. The holders who did nothing are invisible to it — that is what MVRV and URPD are for.',
        },
        {
          id: 'bottom',
          label: 'The bottom is in',
          feedback:
            'Capitulation often shows up as SOPR below 1, but so does the middle of a long decline. It describes behaviour; it does not time anything.',
        },
        {
          id: 'buying',
          label: 'Buyers are paying more than sellers paid',
          feedback:
            'That would push SOPR above 1. Below 1 means the coin is worth less now than when it last moved.',
        },
      ],
      correctOptionId: 'losses',
      explanation:
        'SOPR is a ratio of spending price to acquisition price for the coins that actually moved. Below 1, the people transacting are realising losses — selling below what they paid. It is a window onto who is selling and in what state, which is exactly the motivation that order-book data cannot show.',
    },
    {
      id: 'mc-urpd-cluster',
      type: 'multiple_choice',
      tags: ['bitcoin', 'on-chain', 'urpd'],
      xp: 40,
      prompt:
        'URPD shows a large share of supply last moved between $58,000 and $62,000. The price is now $55,000. Why might that band matter?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'breakeven', label: 'Many holders there would get their money back on a rally to it, and some may sell' },
        {
          id: 'floor',
          label: 'It is a guaranteed floor the price cannot fall through',
          feedback:
            'The price is already below it. Nothing on-chain is a guarantee; clusters describe where incentives sit, not where the price must stop.',
        },
        {
          id: 'irrelevant',
          label: 'It does not matter, because those coins have not moved',
          feedback:
            'That is what makes it interesting: the coins are held, at a known approximate cost, by people who are currently under water.',
        },
        {
          id: 'exchange',
          label: 'Those coins are on exchanges, ready to sell',
          feedback:
            'URPD says when coins last moved, not where they sit. Some of that supply may be in cold storage for years.',
        },
      ],
      correctOptionId: 'breakeven',
      explanation:
        'A dense cluster of cost bases is a place where many holders’ circumstances change at once. Above it they are in profit; below it they are not. Holders who bought there and endured a fall are a plausible source of supply on a return to break-even. Plausible is the right word — treat it as a hypothesis to watch, not a wall.',
    },
    {
      id: 'match-cohorts',
      type: 'concept_match',
      tags: ['bitcoin', 'on-chain', 'cohorts'],
      xp: 40,
      prompt: 'Match each pattern to its most likely reading.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'old-coins',
          term: 'Long-dormant coins start moving',
          definition: 'Long-term holders distributing into strength',
        },
        {
          id: 'outflows',
          term: 'Steady exchange outflows',
          definition: 'Coins moving to self-custody, usually accumulation',
        },
        {
          id: 'young-loss',
          term: 'Recent buyers spending at a loss',
          definition: 'Short-term holders capitulating',
        },
        {
          id: 'inflow-spike',
          term: 'A sudden spike in deposits',
          definition: 'Supply that may be about to sell — or collateral',
        },
      ],
      explanation:
        'Coin age separates two populations with different behaviour: short-term holders react to price, long-term holders tend to sell into rallies and buy in drawdowns. Each reading here is the likely one, not the certain one. Addresses are not people, exchanges consolidate wallets, and an internal reshuffle can look exactly like a whale moving.',
    },
  ],
  keyTakeaways: [
    'Realized cap values each coin at its last move — roughly what holders paid.',
    'MVRV above 1 means the average holder is in profit; below 1, at a loss.',
    'SOPR describes the coins spent today, not the holders who sat still.',
    'Cost-basis clusters show where incentives change, not where price must stop.',
  ],
});
