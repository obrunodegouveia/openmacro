import { defineLesson } from '../../schema';

/**
 * Fiscal dominance, stated technically: the case where the policy rate is
 * determined by the government's solvency rather than by the inflation target.
 */
export const fiscalDominanceLesson = defineLesson({
  id: 'fiscal-dominance',
  title: 'When the Rate Is Not Yours to Set',
  subtitle:
    'Independence is a legal status. Whether you actually control the rate depends on arithmetic you did not write.',
  icon: '⚖️',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'mc-what-dominance-is',
      type: 'multiple_choice',
      tags: ['fiscal-dominance', 'policy'],
      xp: 35,
      prompt: 'What makes a regime fiscally dominant, technically?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'adjusts',
          label: 'The primary balance will not adjust, so something else must',
        },
        {
          id: 'orders',
          label: 'The government instructs the central bank on rates',
          feedback:
            'That is the crude version and it is rarely what happens. Dominance usually operates without an instruction being given, which is what makes it hard to see from outside.',
        },
        {
          id: 'deficit',
          label: 'The deficit is large',
          feedback:
            'A large deficit that will be corrected is a financing question. Dominance is about what happens when it will not be corrected.',
        },
        {
          id: 'debt',
          label: 'Debt exceeds 100% of GDP',
          feedback:
            'Japan sits far above that with no dominance; other countries have hit it at 40%. The level is not the variable — the willingness to adjust the primary balance is.',
        },
      ],
      correctOptionId: 'adjusts',
      explanation:
        'The government’s budget must balance over time in present-value terms: the debt is covered by future primary surpluses, or by inflation, or by default. If the primary surpluses are not coming, the other two are the only remaining terms. Nobody has to issue an instruction for this. The central bank simply finds that every path consistent with its inflation target implies a debt trajectory the government cannot fund — and the constraint does the work that an order would have done.',
    },
    {
      id: 'order-dominance-onset',
      type: 'order_flow',
      tags: ['fiscal-dominance'],
      xp: 35,
      prompt: 'Order the way an independent central bank loses control of the rate.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'deficits', label: 'Persistent deficits with no credible correction' },
        { id: 'short', label: 'Debt shortens as investors refuse long maturities', detail: 'The government’s bill now reprices quickly' },
        { id: 'sensitive', label: 'Each rate rise feeds the deficit within months' },
        { id: 'doubt', label: 'Markets price the rise as raising default risk, not lowering inflation' },
        { id: 'trapped', label: 'The central bank stops raising — and inflation expectations unanchor' },
      ],
      correctOrder: ['deficits', 'short', 'sensitive', 'doubt', 'trapped'],
      explanation:
        'The second step is the mechanism and it is worth dwelling on. A government funded with ten-year fixed-rate debt can absorb a rate rise for years; one funded at three months feels it immediately, because the whole stock reprices within a year. Debt maturity is therefore a monetary variable, decided by a debt management office. Shortening the average maturity to save on interest costs transfers control of the policy rate out of the central bank, quietly, without any change in the law.',
    },
    {
      id: 'mc-seigniorage',
      type: 'multiple_choice',
      tags: ['seigniorage', 'inflation'],
      xp: 35,
      prompt:
        'A government funds its deficit by having the central bank buy the debt. Why does this get worse over time even at a constant real amount of financing?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'base-shrinks',
          label: 'The base being taxed shrinks as inflation rises',
        },
        {
          id: 'illegal',
          label: 'It breaches the prohibition on monetary financing',
          feedback:
            'It usually does breach it where one exists, and that is a legal constraint rather than the economic mechanism. The mechanism would operate even where it is permitted.',
        },
        {
          id: 'rates',
          label: 'Interest rates rise on the debt that remains',
          feedback:
            'They do, and it compounds the problem. The specific reason the inflation tax degrades is on the other side — in what people choose to hold.',
        },
        {
          id: 'confidence',
          label: 'Confidence in the currency falls',
          feedback:
            'That is the description rather than the mechanism. What falling confidence consists of, operationally, is people holding less of the thing being taxed.',
        },
      ],
      correctOptionId: 'base-shrinks',
      explanation:
        'Seigniorage is a tax on money balances, and the rate of tax is the inflation rate. Raise it and holders economise: they spend faster, hold dollars, hold goods. The base shrinks, so financing the same real deficit needs a higher inflation rate next period, which shrinks the base further. This is the arithmetic of a hyperinflation, and it explains its characteristic shape — slow for years, then vertical. The escape is never monetary alone: every successful stabilisation in the historical record paired the monetary reform with a fiscal correction, and the ones that tried the monetary half by itself failed within months.',
    },
    {
      id: 'match-dominance-signals',
      type: 'concept_match',
      tags: ['fiscal-dominance', 'indicators'],
      xp: 30,
      prompt: 'Four things to watch for. Match each to what it tells you.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'maturity',
          term: 'Average debt maturity shortening',
          definition: 'How fast a rate rise reaches the budget — the speed of the constraint',
        },
        {
          id: 'curve',
          term: 'A rate rise steepening the curve',
          definition: 'Markets reading the rise as risk rather than as disinflation',
        },
        {
          id: 'holders',
          term: 'Banks holding more government debt',
          definition: 'Sovereign and banking solvency merging into one question',
        },
        {
          id: 'index',
          term: 'Debt shifting to FX or index-linked',
          definition: 'The inflation route being closed off — often the last one still open',
        },
      ],
      explanation:
        'These are observable weekly and none of them requires a judgement about intentions. That is deliberate: dominance is not something a governor should have to infer from the tone of a conversation with a finance minister. It shows up in the maturity profile, in the shape of the curve after a decision, and in who is holding the paper. A governor who tracks these four sees the constraint tightening a year before it binds — which is the only point at which anything can still be done about it.',
    },
  ],
  keyTakeaways: [
    'Dominance means the primary balance will not adjust, so inflation or default must.',
    'Debt maturity decides how quickly a rate rise reaches the budget.',
    'The inflation tax degrades as its own base shrinks — hence the vertical phase.',
    'The signals are in the maturity profile, the curve and the holder base.',
  ],
});
