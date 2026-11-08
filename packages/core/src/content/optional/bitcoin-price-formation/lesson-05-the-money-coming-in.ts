import { defineLesson } from '../../schema';

/**
 * Macro and institutional capital: why the whole market suddenly values
 * Bitcoin differently.
 *
 * The target skill is separating a Bitcoin-specific event from a global
 * repricing of risky assets. If equities, the dollar and real yields moved
 * the same hour, the explanation probably does not start on a blockchain.
 */
export const btcTheMoneyComingInLesson = defineLesson({
  id: 'btc-the-money-coming-in',
  title: 'The Money Coming In',
  subtitle:
    'Over weeks and months, the price follows whether new money wants Bitcoin exposure. Real rates, dollar liquidity, fund flows and stablecoins are how you see it arrive or leave.',
  icon: '🌍',
  difficulty: 'advanced',
  estimatedMinutes: 9,
  challenges: [
    {
      id: 'mc-real-rates',
      type: 'multiple_choice',
      tags: ['bitcoin', 'macro', 'real-rates'],
      xp: 40,
      prompt: 'Real interest rates rise sharply. Why would that tend to weigh on Bitcoin?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'opportunity', label: 'A zero-yield asset costs more to hold when safe assets pay' },
        {
          id: 'miners',
          label: 'Miners have to pay more interest on their loans',
          feedback:
            'Some do, but miners are a small part of the flow. The main channel is the whole market’s required return, not one industry’s debts.',
        },
        {
          id: 'supply',
          label: 'Higher rates speed up the issuance of new bitcoin',
          feedback:
            'Issuance follows a fixed schedule set in the protocol. Interest rates cannot change it.',
        },
        {
          id: 'always',
          label: 'It always falls when rates rise',
          feedback:
            'Not always — the relationship has changed sign over different periods. "Tends to" is the honest version.',
        },
      ],
      correctOptionId: 'opportunity',
      explanation:
        'A real yield is what an investor gets for holding something safe after inflation. When it rises, every risky asset with no cash flow has to compete with it, and leveraged positions cost more to carry. That makes Bitcoin sensitive to the same forces as long-duration equities, which is why it often moves with them in a global repricing.',
    },
    {
      id: 'order-etf-creation',
      type: 'order_flow',
      tags: ['bitcoin', 'capital-flows', 'etf'],
      xp: 40,
      prompt: 'How a dollar into a spot Bitcoin fund becomes buying pressure. Put it in order.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'investor', label: 'An investor buys fund shares' },
        { id: 'premium', label: 'Shares trade slightly above the value of the coins held' },
        { id: 'create', label: 'A dealer creates new shares with the fund' },
        { id: 'buy', label: 'The fund or the dealer buys bitcoin to back them' },
        { id: 'spot', label: 'That buying reaches spot markets' },
      ],
      correctOrder: ['investor', 'premium', 'create', 'buy', 'spot'],
      explanation:
        'Fund shares are created and redeemed in blocks. Net creations mean coins had to be bought; net redemptions mean coins were sold. Daily creation and redemption data is therefore one of the clearest views of institutional demand there is — though it reports what happened, a day late, and the buying may be spread over hours or done off-exchange.',
    },
    {
      id: 'mc-stablecoins',
      type: 'multiple_choice',
      tags: ['bitcoin', 'capital-flows', 'stablecoins'],
      xp: 40,
      prompt: 'The total supply of dollar stablecoins grows steadily for three months. What is a fair reading?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'dry-powder', label: 'More dollars sit inside the crypto system, able to buy without leaving it' },
        {
          id: 'already-bought',
          label: 'Those dollars have already bought bitcoin',
          feedback:
            'A stablecoin is a dollar waiting. Minting one means money came in; it has not necessarily been spent on anything yet.',
        },
        {
          id: 'inflation',
          label: 'Stablecoins are inflating the supply of bitcoin',
          feedback:
            'They are claims on dollars, not on bitcoin. Bitcoin’s supply is unaffected.',
        },
        {
          id: 'meaningless',
          label: 'Nothing — stablecoins are unrelated to Bitcoin demand',
          feedback:
            'They are the main settlement currency on most crypto exchanges, so their supply is a reasonable gauge of capital inside the system.',
        },
      ],
      correctOptionId: 'dry-powder',
      explanation:
        'Minting a stablecoin requires depositing dollars with the issuer, so a growing supply is a measure of capital entering the crypto system. That capital can buy spot, post margin for derivatives, or simply sit. It raises the capacity for demand, which is a weaker claim than demand itself.',
    },
    {
      id: 'match-specific-or-global',
      type: 'concept_match',
      tags: ['bitcoin', 'macro', 'diagnosis'],
      xp: 40,
      prompt: 'Match each observation to what it suggests about a fall.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'all-risk',
          term: 'Equities and BTC fall in the same hour',
          definition: 'A global repricing of risk, not a Bitcoin story',
        },
        {
          id: 'dollar',
          term: 'Dollar and real yields jump',
          definition: 'Tighter financial conditions everywhere',
        },
        {
          id: 'alone',
          term: 'BTC falls, equities flat',
          definition: 'Look for something specific to Bitcoin',
        },
        {
          id: 'redemptions',
          term: 'Fund redemptions on a quiet day',
          definition: 'Institutions reducing exposure, possibly rebalancing',
        },
      ],
      explanation:
        'Before explaining a Bitcoin move with a Bitcoin story, compare it with equities, the dollar, real yields and gold over the same window. If everything risky moved together, the cause is probably global and on-chain explanations are decoration. If Bitcoin moved alone, the specific explanation earns its place.',
    },
    {
      id: 'mc-rebalancing',
      type: 'multiple_choice',
      tags: ['bitcoin', 'capital-flows'],
      xp: 40,
      prompt:
        'Bitcoin rallies 40% in a quarter. A pension fund with a fixed 2% target allocation then sells some. Why?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'rebalance', label: 'Its allocation drifted above 2%, so it trims back to target' },
        {
          id: 'bearish',
          label: 'It has turned bearish on Bitcoin',
          feedback:
            'A fixed target means it sells winners and buys losers by rule. The sale says nothing about its view.',
        },
        {
          id: 'regulation',
          label: 'Regulation forces it to sell after a rally',
          feedback:
            'Its own mandate, not a regulator, sets the 2%. Rebalancing is a choice of policy made in advance.',
        },
        {
          id: 'liquidity',
          label: 'It needs cash for a margin call',
          feedback:
            'Possible for a leveraged trader. A pension fund rebalancing a fixed allocation has a simpler reason.',
        },
      ],
      correctOptionId: 'rebalance',
      explanation:
        'Institutional portfolios often hold Bitcoin as a fixed share. After a big rally the share is too large and they sell; after a fall they buy. That flow is mechanical, sizeable around quarter-ends, and has no opinion in it — a reminder that motivation is not always a view on the asset.',
    },
  ],
  keyTakeaways: [
    'Rising real yields raise the bar for an asset that pays no income.',
    'Fund creations need coins bought; redemptions need them sold.',
    'Stablecoin growth is capacity for demand, not demand itself.',
    'Check equities, the dollar and yields before telling a Bitcoin-only story.',
  ],
});
