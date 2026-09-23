import { defineLesson } from '../../schema';

/**
 * Currency mismatch: the single fact that makes running a central bank in an
 * emerging economy a different job rather than the same job with worse data.
 */
export const originalSinLesson = defineLesson({
  id: 'original-sin',
  title: 'Debt in a Currency You Cannot Print',
  subtitle:
    'Everything you have learned assumed the state borrows in money its central bank issues. For most of the world that assumption is false.',
  icon: '⛓️',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'sim-fx-debt',
      type: 'interactive_sim',
      tags: ['emerging-markets', 'debt', 'fx'],
      xp: 45,
      currency: 'USD',
      constants: {},
      prompt: 'A country borrows part of its debt abroad. Then its currency falls.',
      instructions: 'Move the depreciation and watch the ratio move without anyone borrowing',
      narrative:
        'Debt ratios are a fraction: debt over GDP. When part of the debt is denominated in dollars and the currency depreciates, the numerator rises in local terms while the denominator does not. Nobody issued a bond. No deficit was run. The ratio moves anyway, and it moves most in exactly the circumstances — a currency under pressure — where the government can least afford it.',
      sliders: [
        {
          key: 'debtRatio',
          label: 'Public debt before the move',
          min: 0.2,
          max: 1.2,
          step: 0.05,
          defaultValue: 0.6,
          format: 'percent',
          hint: 'As a share of GDP',
        },
        {
          key: 'fxShare',
          label: 'Share of that debt in foreign currency',
          min: 0,
          max: 1,
          step: 0.05,
          defaultValue: 0.4,
          format: 'percent',
        },
        {
          key: 'depreciation',
          label: 'Depreciation of the local currency',
          min: 0,
          max: 0.7,
          step: 0.05,
          defaultValue: 0.3,
          format: 'percent',
        },
      ],
      readouts: [
        {
          key: 'after',
          label: 'Debt ratio afterwards',
          formulaId: 'debt_ratio_after_depreciation',
          format: 'percent',
          emphasis: true,
          caption: 'The foreign slice revalues; GDP does not',
        },
        {
          key: 'jump',
          label: 'Of which the currency alone',
          formulaId: 'depreciation_debt_jump',
          format: 'percent',
          caption: 'Points of GDP added by the exchange rate',
        },
      ],
      objective: {
        description: 'Show that the exchange rate alone can add more than 20 points of GDP to the debt ratio',
        requiredObservations: [{ sliderKey: 'fxShare', values: [0, 1] }],
        target: { readoutKey: 'jump', comparator: 'gte', value: 0.2 },
      },
      explanation:
        'Set the foreign share to zero and the depreciation does nothing at all — the whole effect is the mismatch, not the exchange rate. That is the point. A country that borrows in its own currency can let its currency fall and watch its debt burden shrink in real terms; a country that borrows in dollars watches it grow at the moment of maximum stress. It is why the same depreciation is an adjustment mechanism in one country and a solvency event in another, and why a governor in the second country cannot treat the exchange rate as a shock absorber the textbooks say it is.',
    },
    {
      id: 'mc-why-borrow-abroad',
      type: 'multiple_choice',
      tags: ['emerging-markets', 'debt'],
      xp: 35,
      prompt: 'If foreign-currency debt is this dangerous, why does any country issue it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'no-choice',
          label: 'Investors will not lend long in the local currency at any tolerable price',
        },
        {
          id: 'cheaper',
          label: 'The interest rate on it is lower than on local-currency debt',
          feedback:
            'It usually is lower, and that is the trap rather than the reason. The apparent saving is the currency risk, priced and handed to the borrower.',
        },
        {
          id: 'reserves',
          label: 'It brings in foreign exchange reserves',
          feedback:
            'Borrowed reserves are a genuine tactic and a fragile one — you have acquired an asset and a matching liability, so the net insurance is close to zero.',
        },
        {
          id: 'rules',
          label: 'International rules require part of the debt to be external',
          feedback:
            'No such requirement exists. What does exist is a market that will not offer the alternative.',
        },
      ],
      correctOptionId: 'no-choice',
      explanation:
        'This was named "original sin" because it looked like something countries were born with rather than chose. A government that cannot sell a fifteen-year bond in its own currency can either borrow short domestically — and face rollover risk every few months — or borrow long in dollars and face currency risk. It is a choice between two mismatches, not between risk and safety. The work of escaping it is decades long: credible inflation, a domestic institutional investor base, a functioning yield curve. Several countries have done it, which is the encouraging part of the story.',
    },
    {
      id: 'match-mismatches',
      type: 'concept_match',
      tags: ['emerging-markets', 'balance-sheet'],
      xp: 30,
      prompt: 'Three mismatches, three different ways to fail.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'currency',
          term: 'Currency mismatch',
          definition: 'Liabilities in a money you cannot issue, assets and revenue in one you can',
        },
        {
          id: 'maturity',
          term: 'Maturity mismatch',
          definition: 'Debt that must be refinanced sooner than the assets it funded will pay',
        },
        {
          id: 'holder',
          term: 'Holder mismatch',
          definition: 'Debt held by investors who will leave for reasons that have nothing to do with you',
        },
      ],
      explanation:
        'The third is the one most often missed and it is why local-currency issuance is not a complete escape. A government can issue every bond in its own currency and still find that 40% of them sit with foreign funds who sell when a policy rate somewhere else moves. The currency mismatch has been eliminated from the government’s balance sheet and relocated to the exchange rate, where it shows up as capital outflow rather than default risk. Better, certainly. Not solved.',
    },
    {
      id: 'mc-hike-or-not',
      type: 'multiple_choice',
      tags: ['emerging-markets', 'policy'],
      xp: 40,
      prompt:
        'The currency is falling and half the public debt is in dollars. Standard practice says raise rates to defend it. What is the argument against?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'both-ways',
          label: 'Higher rates worsen the fiscal position that is frightening investors',
        },
        {
          id: 'inflation',
          label: 'Higher rates would push inflation below target',
          feedback:
            'Inflation is almost certainly rising, not falling, when the currency is depreciating — the pass-through works quickly in these economies.',
        },
        {
          id: 'ineffective',
          label: 'Rate rises have no effect on exchange rates',
          feedback:
            'They usually do have an effect, and the size of it is unreliable. Unreliability is a reason for caution about how much to rely on the tool, not an argument that it does nothing.',
        },
        {
          id: 'growth',
          label: 'It would slow growth',
          feedback:
            'It would, and a defence that works is normally worth that cost. The sharper objection is that the defence can make the underlying fear more rational rather than less.',
        },
      ],
      correctOptionId: 'both-ways',
      explanation:
        'This is the circularity that makes the emerging-market job genuinely harder. Raising rates makes local assets more attractive, which supports the currency — and it raises the government’s interest bill, which worsens the debt dynamics investors are selling on. Past some point the rate rise confirms the fear it was meant to dispel, and the currency falls further on the announcement. There is no formula for where that point is. What there is: the debt’s maturity profile, its currency composition, and the primary balance. A governor who knows those three numbers can judge it. One who applies a rule cannot.',
    },
  ],
  keyTakeaways: [
    'Foreign-currency debt revalues upward exactly when a country can least afford it.',
    'Countries borrow abroad because the local-currency alternative is not offered, not because it is cheaper.',
    'Local-currency issuance moves the mismatch to the exchange rate rather than removing it.',
    'A rate defence can worsen the fiscal position that caused the run.',
  ],
});
