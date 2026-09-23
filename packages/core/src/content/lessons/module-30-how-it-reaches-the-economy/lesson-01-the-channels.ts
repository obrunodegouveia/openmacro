import { defineLesson } from '../../schema';

/**
 * The transmission channels, set out together. The course has used every one
 * of these and never laid them side by side.
 */
export const theChannelsLesson = defineLesson({
  id: 'the-channels',
  title: 'Six Ways a Rate Decision Travels',
  subtitle:
    'You change one overnight rate. Nothing about that obliges a company in another city to cancel a factory. Here is what actually connects them.',
  icon: '🛤️',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'match-channels',
      type: 'concept_match',
      tags: ['transmission', 'channels'],
      xp: 35,
      prompt: 'Six channels. Match each to how it moves demand.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'rate',
          term: 'Interest rate channel',
          definition: 'Saving becomes more attractive than spending, and projects stop clearing their hurdle',
        },
        {
          id: 'credit',
          term: 'Bank lending channel',
          definition: 'Banks’ own funding costs and capacity change what they will lend at all',
        },
        {
          id: 'balance',
          term: 'Balance sheet channel',
          definition: 'Collateral values fall, so borrowers qualify for less regardless of the rate',
        },
        {
          id: 'fx',
          term: 'Exchange rate channel',
          definition: 'The currency appreciates, import prices fall and exporters lose competitiveness',
        },
        {
          id: 'expect',
          term: 'Expectations channel',
          definition: 'What people believe about future rates and prices changes what they do today',
        },
        {
          id: 'risk',
          term: 'Risk-taking channel',
          definition: 'Low rates push investors into riskier assets reaching for yield, and high rates reverse it',
        },
      ],
      explanation:
        'Two things to take from having these side by side. The first is that only one of them — the interest rate channel — is the textbook mechanism most people imagine, and it is not the strongest in most economies. The second is that they do not operate independently: a tightening that works through collateral values makes the bank lending channel bite harder, because the same falling asset prices weaken both borrower and lender at once. That interaction is why tightening cycles tend to end abruptly rather than gradually.',
    },
    {
      id: 'mc-strongest-channel',
      type: 'multiple_choice',
      tags: ['transmission'],
      xp: 40,
      prompt:
        'Which channel typically does the most work in a small open economy, and why does that matter?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'fx',
          label: 'The exchange rate, because trade is a large share of activity',
        },
        {
          id: 'rate',
          label: 'The interest rate channel, as in any economy',
          feedback:
            'Domestic investment is a smaller share of a very open economy’s demand, so the same intertemporal mechanism moves less. Size of the economy changes which channel dominates.',
        },
        {
          id: 'expect',
          label: 'The expectations channel',
          feedback:
            'It matters everywhere and it is rarely dominant on its own — it amplifies the others rather than carrying the adjustment.',
        },
        {
          id: 'credit',
          label: 'The bank lending channel',
          feedback:
            'Dominant where firms are bank-dependent, which is a separate dimension from openness. A small open economy with market-financed firms would not fit.',
        },
      ],
      correctOptionId: 'fx',
      explanation:
        'It matters because the exchange rate channel is fast, powerful, and not available to everyone at once — every country cannot depreciate simultaneously. A small open economy tightening gets much of its disinflation through an appreciating currency within quarters rather than through domestic demand over years. The awkward implication is that the most effective channel for such an economy is partly a transfer from its trading partners, and it is one of the reasons a currency union removes an adjustment mechanism its members previously relied on more than they realised.',
    },
    {
      id: 'mc-risk-taking',
      type: 'multiple_choice',
      tags: ['transmission', 'financial-stability'],
      xp: 40,
      prompt:
        'The risk-taking channel is the one added to the list after 2008. Why was it a problem for policy design?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'conflict',
          label: 'The rate right for inflation may build risk',
        },
        {
          id: 'unpredictable',
          label: 'It is extremely hard to measure',
          feedback:
            'Measurement is genuinely hard and it is not the structural difficulty. Even measured perfectly, the conflict in the answer would remain.',
        },
        {
          id: 'slow',
          label: 'It works more slowly than the other channels',
          feedback:
            'It builds over years, which is part of why it was missed. Slowness alone would make it a forecasting problem rather than a design problem.',
        },
        {
          id: 'banks',
          label: 'It operates only through the banks',
          feedback:
            'It operates most strongly outside banks — insurers with guaranteed returns, pension funds with fixed liabilities, funds marketed on yield.',
        },
      ],
      correctOptionId: 'conflict',
      explanation:
        'Before this channel was taken seriously, price stability and financial stability were treated as separable: set the rate for inflation, handle stability with regulation. The risk-taking channel says the instrument that achieves one can undermine the other — years of low rates to lift inflation are also years of institutions reaching for yield to meet promised returns. That is the intellectual origin of macroprudential policy as a second toolkit: not because regulation is fashionable, but because one instrument cannot hit two targets, and the alternative was setting rates for financial stability instead of for inflation.',
    },
    {
      id: 'order-tightening-path',
      type: 'order_flow',
      tags: ['transmission', 'sequence'],
      xp: 30,
      prompt: 'Order what a rate rise touches, from soonest to latest.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'money', label: 'Money market and overnight rates', detail: 'Same day' },
        { id: 'expect', label: 'Asset prices and the exchange rate', detail: 'Often before the decision' },
        { id: 'lending', label: 'New loan and deposit rates' },
        { id: 'payments', label: 'Existing borrowers’ payments, as they reset' },
        { id: 'demand', label: 'Spending and investment decisions' },
        { id: 'prices', label: 'Wages and consumer prices' },
      ],
      correctOrder: ['money', 'expect', 'lending', 'payments', 'demand', 'prices'],
      explanation:
        'Note that the second step frequently happens before the first: markets move on the expectation of a decision, so by the time a well-signalled rise is announced much of the asset price adjustment has already occurred. This is why a decision that surprises nobody still works, and why a governor should read "the market had already priced it" as evidence that transmission is functioning rather than as evidence that the decision did nothing. The gap between the first step and the last is the subject of the next lesson, and it is measured in years.',
    },
  ],
  keyTakeaways: [
    'Six channels, of which the textbook interest rate channel is rarely the strongest.',
    'Channels interact — falling collateral values make the lending channel bite harder.',
    'In a small open economy the exchange rate does most of the work, and fast.',
    'The risk-taking channel is why macroprudential policy exists as a second toolkit.',
  ],
});
