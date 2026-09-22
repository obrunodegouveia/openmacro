import { defineLesson } from '../../schema';

/**
 * Expectations as a measured series rather than a metaphor — including the
 * uncomfortable fact that the cleanest-looking measure is contaminated.
 */
export const expectationsAreDataLesson = defineLesson({
  id: 'expectations-are-data',
  title: 'The Variable You Cannot Observe and Must Watch',
  subtitle:
    'Anchored expectations do most of the work of monetary policy. Every way of measuring them is flawed, and you need all of them.',
  icon: '⚓',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'mc-breakevens',
      type: 'multiple_choice',
      tags: ['expectations', 'breakevens'],
      xp: 35,
      prompt:
        'The gap between a nominal bond yield and an index-linked one of the same maturity is called the breakeven inflation rate. What is wrong with reading it as expected inflation?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'premia',
          label: 'It also contains an inflation risk premium and a liquidity premium, and they move',
        },
        {
          id: 'wrong-index',
          label: 'The two bonds reference different price indices',
          feedback:
            'They are matched to an index by construction. There are timing and indexation-lag subtleties, and they are small next to the premia.',
        },
        {
          id: 'traders',
          label: 'It reflects only what traders think, not households or firms',
          feedback:
            'True, and it is a point about whose expectations rather than about the measure being contaminated. Market-based and survey-based measures differ for both reasons.',
        },
        {
          id: 'illiquid',
          label: 'Index-linked bonds are too illiquid to price anything',
          feedback:
            'They are less liquid, which is part of why a liquidity premium sits in the spread. Illiquid is not the same as uninformative.',
        },
      ],
      correctOptionId: 'premia',
      explanation:
        'The breakeven is expected inflation plus compensation for bearing inflation risk, minus a liquidity discount on the index-linked leg. In March 2020 breakevens collapsed and almost none of it was a change in expected inflation — it was liquidity. A governor who reacted to that print as though households had revised their views would have been responding to the plumbing of a bond market. The measure is useful because it is daily and market-based, and it must be read alongside surveys that are slower and cleaner.',
    },
    {
      id: 'match-expectation-measures',
      type: 'concept_match',
      tags: ['expectations', 'measurement'],
      xp: 30,
      prompt: 'Four ways to measure the same unobservable. Match each to its particular flaw.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'market',
          term: 'Market-based measures',
          definition: 'Daily and contaminated by risk and liquidity premia that move with the market’s mood',
        },
        {
          id: 'professional',
          term: 'Professional forecaster surveys',
          definition: 'Clean and slow, and they cluster — forecasters watch each other and the central bank',
        },
        {
          id: 'households',
          term: 'Household surveys',
          definition: 'Persistently higher than outturns and dominated by fuel and food, which are what people see priced',
        },
        {
          id: 'firms',
          term: 'Firm surveys',
          definition: 'The ones that set prices, and the least measured of the four in most countries',
        },
      ],
      explanation:
        'The fourth is the gap. Prices are set by firms, so firms’ expectations are the ones most directly connected to the mechanism — and most central banks have far better data on what traders and economists think than on what the businesses in their own economy think. New Zealand and a handful of others built firm surveys precisely for this reason, and the research that came out of them showed firm expectations behaving quite differently from the professional consensus.',
    },
    {
      id: 'mc-anchoring',
      type: 'multiple_choice',
      tags: ['expectations', 'anchoring'],
      xp: 35,
      prompt:
        'Inflation is 8% and five-year-ahead expectations have barely moved. What does that combination tell you?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'anchored',
          label: 'The anchor is holding: the shock is being read as temporary, which buys time',
        },
        {
          id: 'lagging',
          label: 'The expectations data is lagging and will catch up',
          feedback:
            'Long-horizon expectations do move when the anchor slips, and they move fast when it does. Their stability under a large near-term shock is information rather than delay.',
        },
        {
          id: 'wrong',
          label: 'The measure is wrong — nobody believes 8% is temporary',
          feedback:
            'Several measures agreeing is harder to dismiss than one. And the stability of long-horizon expectations through 2022 is one of the better-documented facts of that episode.',
        },
        {
          id: 'ignore',
          label: 'Expectations can be ignored while actual inflation is this high',
          feedback:
            'The opposite: it is precisely when realised inflation is high that the anchor is being tested, and whether it holds determines how much tightening will be needed.',
        },
      ],
      correctOptionId: 'anchored',
      explanation:
        'This is the single most valuable reading on the dashboard during a shock. If long-horizon expectations stay near target while near-term inflation is high, wage and price setters are treating the episode as passing and the disinflation can be achieved without crushing demand. If they drift up, every subsequent decision gets more expensive, because you are no longer only offsetting a shock — you are re-establishing the anchor. Volcker’s cost in 1979 was the cost of the second job, and avoiding it is most of the argument for acting early.',
    },
    {
      id: 'order-unanchoring',
      type: 'order_flow',
      tags: ['expectations', 'wages'],
      xp: 30,
      prompt: 'Put the unanchoring in order, from a shock to a changed regime.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'shock', label: 'A large price shock arrives', detail: 'Long-horizon expectations do not move' },
        { id: 'persist', label: 'It persists longer than anyone said it would' },
        { id: 'households', label: 'Household expectations rise first', detail: 'They see fuel and food weekly' },
        { id: 'wages', label: 'Wage demands begin to reference recent inflation rather than the target' },
        { id: 'contracts', label: 'Indexation appears in multi-year contracts' },
        { id: 'regime', label: 'The target stops being the default assumption in price setting' },
      ],
      correctOrder: ['shock', 'persist', 'households', 'wages', 'contracts', 'regime'],
      explanation:
        'Read the order for where the intervention point is. It is not the first step — nothing can be done about the shock — and it is not the last, by which time you are Volcker. It is between the third and the fifth, when expectations have begun to move but before indexation is written into contracts that will outlive the shock. That window is months, it is visible in data you can watch weekly, and it is the reason this unglamorous module exists: the decision that matters most is taken on the basis of a series nobody can observe directly.',
    },
  ],
  keyTakeaways: [
    'A breakeven is expected inflation plus risk and liquidity premia that move on their own.',
    'Firms set prices and are the least surveyed of the four measures.',
    'Stable long-horizon expectations under a large shock are what makes cheap disinflation possible.',
    'The intervention point is after expectations move and before indexation is written into contracts.',
  ],
});
