/**
 * ============================================================================
 * Module 1 · Lesson 3 — "Inflation is the price of money"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to distinguish a change in the price *level* from
 * a change in *relative* prices, compute what compounding inflation does to a
 * fixed sum, and reason about real versus nominal returns.
 *
 * Sources / further reading for reviewers:
 *   - ECB, "What is inflation?" and the HICP methodology notes.
 *   - Fisher, "The Theory of Interest" (1930) — the exact real-rate relation
 *     used by the `real_interest_rate` formula.
 *
 * A note on rigour: the sim compounds a single constant rate, which no real
 * economy delivers. Its job is to break the linear intuition ("10% for 10
 * years means it halves"), not to forecast. The explanation says so.
 */

import { defineLesson } from '../../schema';

export const purchasingPowerLesson = defineLesson({
  id: 'purchasing-power',
  title: 'Inflation Is the Price of Money',
  subtitle: 'What your savings slowly lose while the number in the account stays the same.',
  icon: '📉',
  difficulty: 'intro',
  estimatedMinutes: 6,
  hearts: 3,

  keyTakeaways: [
    'Inflation means one euro buys less. It is the same event as prices rising, seen from the money’s side.',
    'It compounds: each year’s loss builds on the last. Ten years of 10% does not take 100% of your buying power; it takes about 61%.',
    'One price going up is not inflation. Inflation is prices in general going up.',
    'For a saver, what matters is the real rate: the interest earned minus inflation.',
  ],

  challenges: [
    {
      id: 'mc-relative-vs-level',
      type: 'multiple_choice',
      tags: ['inflation', 'foundations'],
      xp: 10,
      prompt: 'A drought doubles the price of coffee. All other prices stay the same. Is that inflation?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'yes',
          label: 'Yes, because a price went up',
          feedback:
            'One price rising is a change in relative prices. It tells you coffee became scarcer, not that money buys less in general.',
        },
        {
          id: 'no-relative',
          label: 'No, because only one price changed, not the value of money',
        },
        {
          id: 'yes-index',
          label: 'Yes, because the price index will tick up',
          feedback:
            'The price index will move a little, because coffee is part of it. But that is about coffee. Inflation is the general level of prices moving, not one item pulling the average up.',
        },
        {
          id: 'only-if-wages',
          label: 'Only if wages rise to match',
          feedback:
            'Wages affect whether the rise lasts. But they are not what makes something inflation.',
        },
      ],
      correctOptionId: 'no-relative',
      explanation:
        'Relative prices change all the time, and that is useful. Expensive coffee tells people to drink less and tells farmers to grow more. Inflation is different: all prices rise together. That says nothing about any one product. It tells you something about the money.',
    },

    {
      id: 'sim-purchasing-power',
      type: 'interactive_sim',
      tags: ['inflation', 'compounding', 'foundations'],
      xp: 25,
      prompt: 'You keep €10,000 under the mattress. What is it really worth later?',
      instructions: 'Move the rate and see what happens',
      narrative:
        'The number never changes. Compare a central bank that hits its 2% target with a country at 25%, and see what ten years do to the same €10,000.',
      constants: { nominal: 10000, years: 10 },
      sliders: [
        {
          key: 'inflationRate',
          label: 'Annual inflation',
          min: 0,
          max: 0.5,
          step: 0.01,
          defaultValue: 0.02,
          format: 'percent',
          hint: 'Most central banks target 2%',
        },
      ],
      readouts: [
        {
          key: 'purchasing_power',
          label: 'What your €10,000 still buys after 10 years',
          formulaId: 'purchasing_power',
          format: 'currency',
          emphasis: true,
          caption: 'P = nominal / (1 + i)^years',
        },
        {
          key: 'purchasing_power_lost',
          label: 'Share of value gone',
          formulaId: 'purchasing_power_lost',
          format: 'percent',
          caption: '1 - 1 / (1 + i)^years',
        },
        {
          key: 'halving_years',
          label: 'Years to lose half',
          formulaId: 'halving_years',
          format: 'number',
          caption: 'ln 2 / ln(1 + i)',
        },
      ],
      objective: {
        description: 'End at 25%, the kind of rate a currency in trouble has',
        requiredObservations: [
          { sliderKey: 'inflationRate', values: [0.02, 0.1, 0.25] },
        ],
        // 25% over ten years destroys ~89% of the value. Targeting the
        // readout rather than the slider means the learner has to end on a
        // rate that actually produces the loss, not merely touch a number.
        target: { readoutKey: 'purchasing_power_lost', comparator: 'gte', value: 0.85 },
      },
      explanation:
        'At the 2% target, ten years cost you about 18%. That hurts, but you can live with it. At 10% it costs 61%. At 25% it costs 89%: your €10,000 buys what €1,074 buys today. Notice that the time to lose half falls much faster than the rate rises, because the losses compound. Also, “inflation is coming down” does not mean prices are falling. They still rise, just more slowly.',
    },

    {
      id: 'match-inflation-terms',
      type: 'concept_match',
      tags: ['inflation', 'foundations'],
      xp: 15,
      prompt: 'Match each term to what it measures.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'purchasing-power',
          term: 'Purchasing power',
          definition: 'How many real things one unit of money can buy',
        },
        {
          id: 'nominal',
          term: 'Nominal value',
          definition: 'The number written on the note or shown in the account',
        },
        {
          id: 'real',
          term: 'Real value',
          definition: 'The same amount after taking out the effect of inflation',
        },
        {
          id: 'disinflation',
          term: 'Disinflation',
          definition: 'Prices still rising, but more slowly than before',
        },
        {
          id: 'deflation',
          term: 'Deflation',
          definition: 'Prices in general actually going down',
        },
      ],
      explanation:
        'People often mix up disinflation and deflation, even in the news. Disinflation means the rate goes down but prices keep rising. That is almost always what “inflation is falling” means. Deflation means prices really fall. It has its own problem: debts stay the same in euros, so they get harder to pay every year.',
    },

    {
      id: 'mc-real-return',
      type: 'multiple_choice',
      tags: ['real-rates', 'foundations'],
      xp: 15,
      prompt: 'Your savings account pays 4%. Inflation is 6%. What happened to your money this year?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'gained-4',
          label: 'It grew by 4%',
          feedback:
            'That is the nominal return. The number did grow by 4%, but the question is what it can buy.',
        },
        {
          id: 'lost-2',
          label: 'It lost about 2% of what it can buy',
        },
        {
          id: 'flat',
          label: 'It broke even, since interest offsets inflation',
          feedback:
            'Only if the two rates were the same. Here interest is lower than inflation, so the gap is a real loss.',
        },
        {
          id: 'lost-6',
          label: 'It lost 6%',
          feedback:
            'That is the loss before interest. The 4% you earned covers most of it. The loss is the difference, not all of inflation.',
        },
      ],
      correctOptionId: 'lost-2',
      explanation:
        'The real rate is what is left after inflation. Here it is about −1.9%, because (1.04 ÷ 1.06) − 1 = −0.019. The quick way, interest minus inflation, gives −2%, which is close enough at these levels. At high inflation like 25% the quick way is no longer close. A negative real rate means a saver who does everything right still gets poorer.',
    },
  ],
});
