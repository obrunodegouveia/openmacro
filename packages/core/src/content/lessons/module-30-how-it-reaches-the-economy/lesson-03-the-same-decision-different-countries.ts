import { defineLesson } from '../../schema';

/**
 * Why the same decision is a different decision depending on where it lands.
 * The mortgage market is the clearest case and the simulation makes it
 * concrete.
 */
export const sameDecisionDifferentCountriesLesson = defineLesson({
  id: 'same-decision-different-countries',
  title: 'The Same Rise, Nine Times the Pain',
  subtitle:
    'The ECB sets one rate for twenty countries whose mortgage markets transmit it at wildly different speeds. This is not a design flaw anyone forgot about.',
  icon: '🏘️',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'sim-mortgage-passthrough',
      type: 'interactive_sim',
      tags: ['transmission', 'mortgages', 'euro-area'],
      xp: 45,
      constants: {},
      prompt: 'How much of a rate rise reaches households in the first year?',
      instructions: 'Set it to Portugal, then to the United States, and compare the income absorbed',
      narrative:
        'A borrower on a floating rate feels the whole increase almost immediately. A borrower on a thirty-year fixed rate feels none of it — they only feel it if they move or refinance. Everything between is a matter of how many fixed deals expire this year. Multiply the share that reaches households by how much they owe relative to income, and you have the amount of spending power a decision removes.',
      sliders: [
        {
          key: 'floatingShare',
          label: 'Mortgages on floating rates',
          min: 0,
          max: 1,
          step: 0.05,
          defaultValue: 0.85,
          format: 'percent',
          hint: 'About 85% in Portugal, under 5% in the United States',
        },
        {
          key: 'resetShare',
          label: 'Fixed deals expiring this year',
          min: 0,
          max: 0.4,
          step: 0.05,
          defaultValue: 0.2,
          format: 'percent',
        },
        {
          key: 'debtToIncome',
          label: 'Household debt to income',
          min: 0.5,
          max: 3,
          step: 0.1,
          defaultValue: 2,
          format: 'multiplier',
        },
        {
          key: 'rateRise',
          label: 'Size of the rate rise',
          min: 0,
          max: 0.06,
          step: 0.0025,
          defaultValue: 0.04,
          format: 'percent',
        },
      ],
      readouts: [
        {
          key: 'absorbed',
          label: 'Household income absorbed',
          formulaId: 'income_absorbed',
          format: 'percent',
          emphasis: true,
          caption: 'Spending power removed within the year',
        },
        {
          key: 'reach',
          label: 'Share of borrowers reached',
          formulaId: 'household_rate_passthrough',
          format: 'percent',
          caption: 'Floating, plus fixed deals resetting',
        },
      ],
      objective: {
        description: 'Take more than 7% of household income out of the economy in a single year',
        requiredObservations: [{ sliderKey: 'floatingShare', values: [0, 1] }],
        target: { readoutKey: 'absorbed', comparator: 'gte', value: 0.07 },
      },
      explanation:
        'The defaults are Portugal: 85% floating, debt at twice income, a four-point rise takes 7% of household income within a year. Now set floating to 5% and resets to 5% — the United States, where most borrowers hold a thirty-year fixed rate — and the same four points takes 0.8%. Nine times the impact, from the same decision by the same central bank, because of a contract convention. This is the concrete content of "transmission differs across the euro area", and it is why a single policy rate does not mean a single monetary policy. It also explains something that looks like a puzzle from outside: why American consumption barely flinched during the fastest tightening in forty years.',
    },
    {
      id: 'match-structural-differences',
      type: 'concept_match',
      tags: ['transmission', 'structure'],
      xp: 35,
      prompt: 'Four structural features. Match each to how it changes transmission.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'mortgage',
          term: 'Fixed-rate mortgage share',
          definition: 'Determines how fast a decision reaches household cash flow',
        },
        {
          id: 'bank',
          term: 'Bank-based versus market-based finance',
          definition: 'Whether firms feel the policy rate through a lender’s decision or a bond price',
        },
        {
          id: 'open',
          term: 'Trade openness',
          definition: 'How much of the adjustment arrives through the currency rather than through demand',
        },
        {
          id: 'saving',
          term: 'Net saver or net borrower households',
          definition: 'Whether a rise takes income from households or hands it to them',
        },
      ],
      explanation:
        'The fourth is the one that can reverse the sign. In an economy of net savers with short-dated deposits — an ageing population with little mortgage debt — a rate rise increases household interest income, and the contractionary effect on consumption may be small or absent. This is a live argument about Japan and about parts of northern Europe. It does not mean tightening fails there; the other channels still work. It does mean the channel a governor is implicitly relying on may not exist in their economy, and assuming it does is how a cycle overshoots.',
    },
    {
      id: 'mc-fragmentation',
      type: 'multiple_choice',
      tags: ['euro-area', 'transmission', 'fragmentation'],
      xp: 40,
      prompt:
        'In the euro area, the same policy rate produces different borrowing costs in different member states. When is that a problem the ECB must act on?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'unwarranted',
          label: 'When the spread is not explained by the borrower’s own fundamentals',
        },
        {
          id: 'any',
          label: 'Whenever spreads widen at all',
          feedback:
            'Spreads that reflect genuinely different credit risk are the market working correctly. Compressing them would be a transfer between member states, which is a fiscal act.',
        },
        {
          id: 'large',
          label: 'When the spread exceeds a threshold',
          feedback:
            'A numerical trigger invites being tested precisely at the threshold, and no threshold distinguishes a justified spread from an unjustified one.',
        },
        {
          id: 'crisis',
          label: 'Only when a member state loses market access',
          feedback:
            'By then the transmission mechanism has already failed in that country and the intervention required is much larger.',
        },
      ],
      correctOptionId: 'unwarranted',
      explanation:
        'The distinction between warranted and unwarranted fragmentation is the legal and economic basis for the ECB’s country-specific tools, and it is deliberately a judgement rather than a rule. A spread reflecting a country’s own debt position is information; a spread reflecting a self-fulfilling fear of redenomination is a broken transmission mechanism, because the ECB’s single rate is no longer reaching that economy. The first is not the central bank’s business and the second is precisely its business — and telling them apart in real time, under pressure, with a market watching, is one of the hardest technical judgements in the job.',
    },
    {
      id: 'mc-implication-for-union',
      type: 'multiple_choice',
      tags: ['euro-area', 'transmission'],
      xp: 35,
      prompt:
        'Given that transmission differs this much across members, what follows for a monetary union?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'aggregate',
          label: 'Policy must be set for the aggregate, and adjustment must come from elsewhere',
        },
        {
          id: 'average',
          label: 'The rate should be set for the average member',
          feedback:
            'The aggregate and the average member are different things, and weighting by economic size is what the aggregate already does. Nothing here fixes the dispersion.',
        },
        {
          id: 'differentiate',
          label: 'Rates should be differentiated by country',
          feedback:
            'That would end the single currency — one currency with several prices for money is arbitraged back into one within days.',
        },
        {
          id: 'converge',
          label: 'Structures should be harmonised so transmission converges',
          feedback:
            'Desirable and glacially slow; mortgage conventions are cultural and legal as much as economic. It is not available to a governor deciding this quarter.',
        },
      ],
      correctOptionId: 'aggregate',
      explanation:
        'The honest position is that a single rate will always be too tight for some members and too loose for others, and monetary policy cannot fix that. What can is fiscal policy at national level, macroprudential tools set country by country — which is exactly why those are national competences within the union — and labour mobility. This is not a criticism of the euro so much as a description of what a currency union requires from the rest of its policy apparatus, and the 2010s demonstrated what happens when that apparatus is missing.',
    },
  ],
  keyTakeaways: [
    'Mortgage contract conventions change the force of a rate rise by a factor of nine.',
    'In an economy of net savers, a rise may add to household income rather than remove it.',
    'Unwarranted fragmentation is a broken transmission mechanism, not a wider spread.',
    'A single rate needs national fiscal and macroprudential tools to be workable.',
  ],
});
