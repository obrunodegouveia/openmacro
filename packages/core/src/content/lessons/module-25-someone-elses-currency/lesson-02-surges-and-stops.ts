import { defineLesson } from '../../schema';

/**
 * Capital flows: why the money that arrives is as much of a problem as the
 * money that leaves, and what a central bank can actually do about either.
 */
export const surgesAndStopsLesson = defineLesson({
  id: 'surges-and-stops',
  title: 'Money That Arrives and Money That Leaves',
  subtitle:
    'A sudden stop is the famous one. The surge that preceded it did most of the damage.',
  icon: '🌊',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-surge-problem',
      type: 'multiple_choice',
      tags: ['capital-flows', 'emerging-markets'],
      xp: 35,
      prompt:
        'Foreign capital floods into a mid-sized economy for three years. Why is a governor worried during the good part?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'builds-exposure',
          label: 'It funds a credit boom and a stronger currency, and both reverse together',
        },
        {
          id: 'inflation',
          label: 'The inflow is inflationary in itself',
          feedback:
            'The direct effect is often disinflationary, because the currency appreciates and imports get cheaper. That is precisely what makes the boom comfortable while it runs.',
        },
        {
          id: 'reserves',
          label: 'Reserves become too large to manage',
          feedback:
            'Accumulating reserves during an inflow is the standard and sensible response. Managing them is a cost, not a danger.',
        },
        {
          id: 'rates',
          label: 'It forces the policy rate lower than the central bank wants',
          feedback:
            'It puts downward pressure on market rates, and a central bank that has kept its policy rate distinct can resist it. The lasting problem is what the cheap funding was used to build.',
        },
      ],
      correctOptionId: 'builds-exposure',
      explanation:
        'Inflows arrive as foreign borrowing by domestic banks and firms, which then lend at home — often against property, often in foreign currency to borrowers who earn in local currency. The exchange rate appreciates, which makes the foreign debt look cheap and the local assets look valuable. Every one of those positions is a bet on the inflow continuing. When it stops, the currency, the collateral and the borrowers’ solvency move against you in the same week. The vulnerability was built in the boom; the stop only revealed it.',
    },
    {
      id: 'order-sudden-stop',
      type: 'order_flow',
      tags: ['capital-flows', 'crisis'],
      xp: 35,
      prompt: 'Put a sudden stop in order.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'external', label: 'Rates rise in a major economy', detail: 'Nothing has happened locally' },
        { id: 'outflow', label: 'Portfolio investors reduce emerging-market positions' },
        { id: 'depreciate', label: 'The currency depreciates' },
        { id: 'balance', label: 'Unhedged borrowers’ balance sheets deteriorate' },
        { id: 'credit', label: 'Domestic banks cut lending against falling collateral' },
        { id: 'recession', label: 'Demand contracts — and the current account closes by force' },
      ],
      correctOrder: ['external', 'outflow', 'depreciate', 'balance', 'credit', 'recession'],
      explanation:
        'Read the first and last steps together. The trigger was a decision taken in another country for reasons entirely unrelated to this one, and the final adjustment is a recession severe enough to eliminate the current account deficit by destroying the imports. That is what "sudden stop" describes: not a market falling, but an external balance being closed by force in a matter of quarters. Every policy tool discussed in this module exists to make that final step smaller.',
    },
    {
      id: 'match-flow-tools',
      type: 'concept_match',
      tags: ['capital-flows', 'policy-tools'],
      xp: 30,
      prompt: 'Four responses to an inflow, and what each one actually does.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'reserves',
          term: 'Buy reserves and sterilise',
          definition: 'Leans against appreciation and builds the buffer for the reversal, at a carrying cost',
        },
        {
          id: 'macropru',
          term: 'Macroprudential limits',
          definition: 'Caps what domestic banks may build with the money — loan-to-value, FX lending limits',
        },
        {
          id: 'cfm',
          term: 'Capital flow measures',
          definition: 'Taxes or holding periods that slow the inflow at source, and lose force as they are evaded',
        },
        {
          id: 'fiscal',
          term: 'Tighter fiscal policy',
          definition: 'Reduces the demand the inflow is financing, and is the one tool not in your control',
        },
      ],
      explanation:
        'The last pair is the honest one. Everything a central bank can do about a capital surge is a partial offset to something fiscal policy is doing, and the most effective single response — running a surplus during the boom — is decided by a finance ministry. This is the practical content of "coordination": not a committee, but knowing which lever the problem actually sits under and saying so early, while the numbers are still good.',
    },
    {
      id: 'mc-trinity',
      type: 'multiple_choice',
      tags: ['trinity', 'emerging-markets'],
      xp: 35,
      prompt:
        'The impossible trinity says you cannot have a fixed exchange rate, free capital movement and an independent monetary policy at once. What does practice add to it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'dilemma',
          label: 'Even a float buys only partial independence',
        },
        {
          id: 'false',
          label: 'The trinity does not hold up empirically',
          feedback:
            'The corners hold well. What fails is the assumption that the floating corner delivers full independence, which is a refinement rather than a refutation.',
        },
        {
          id: 'reserves',
          label: 'Large reserves let a country have all three',
          feedback:
            'Reserves buy time against the constraint and do not remove it — as every defence that eventually failed demonstrates.',
        },
        {
          id: 'pegs',
          label: 'Pegs are always the wrong choice to make',
          feedback:
            'Pegs work for small open economies with concentrated trade and the discipline to accept the constraint. The choice is about what you are willing to give up.',
        },
      ],
      correctOptionId: 'dilemma',
      explanation:
        'Hélène Rey’s argument, and it changed what the trinity means in practice: a global financial cycle driven by conditions in the major economies moves credit and asset prices everywhere, floating rate or not. Floating does not give you independence so much as a better shock absorber. Which is why the modern emerging-market toolkit is not "float and set your own rate" but a combination — the float, plus reserves, plus macroprudential limits on what the credit cycle can build, and occasionally measures on the flows themselves.',
    },
  ],
  keyTakeaways: [
    'The vulnerability is built during the inflow, not the outflow.',
    'A sudden stop ends by closing the external balance through recession.',
    'Every central bank tool here partly offsets a fiscal decision it does not control.',
    'Floating buys a shock absorber, not full monetary independence.',
  ],
});
