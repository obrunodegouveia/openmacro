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
  subtitle: 'What your savings quietly lose while the number in the account stays still.',
  icon: '📉',
  difficulty: 'intro',
  estimatedMinutes: 6,
  hearts: 3,

  keyTakeaways: [
    'Inflation is a fall in what one unit buys — the same event seen from the money’s side rather than the goods’ side.',
    'It compounds. Ten years of 10% does not remove 100% of your purchasing power; it removes about 61%.',
    'A rise in one price is not inflation. Inflation is a rise in the general level, which is why a single supply shock is not the same thing.',
    'What matters to a saver is the real rate: interest earned minus what inflation took.',
  ],

  challenges: [
    {
      id: 'mc-relative-vs-level',
      type: 'multiple_choice',
      tags: ['inflation', 'foundations'],
      xp: 10,
      prompt: 'A drought doubles the price of coffee while everything else is unchanged. Is that inflation?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'yes',
          label: 'Yes — a price went up',
          feedback:
            'One price rising is a relative price change. It tells you coffee got scarcer, not that money is buying less across the board.',
        },
        {
          id: 'no-relative',
          label: 'No — that is a relative price change, not a fall in the value of money',
        },
        {
          id: 'yes-index',
          label: 'Yes, because the price index will tick up',
          feedback:
            'The index will move a little, since coffee is in the basket. But the signal is about coffee. Inflation is the general level moving, not one component dragging the average.',
        },
        {
          id: 'only-if-wages',
          label: 'Only if wages rise to match',
          feedback:
            'Wage responses matter for whether a shock persists, but they are not what makes something inflation in the first place.',
        },
      ],
      correctOptionId: 'no-relative',
      explanation:
        'Relative prices move all the time and that is the price system doing its job — expensive coffee tells people to drink less of it and tells farmers to plant more. Inflation is different: it is every price drifting up together, which conveys no information about any particular good and instead says something about the money.',
    },

    {
      id: 'sim-purchasing-power',
      type: 'interactive_sim',
      tags: ['inflation', 'compounding', 'foundations'],
      xp: 25,
      prompt: 'What is €10,000 under the mattress actually worth later?',
      instructions: 'Move the rate and see',
      narrative:
        'The number in the account never changes. Compare a central bank hitting its 2% target with a country running 25%, and watch what a decade does to the same €10,000.',
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
        description: 'Finish at 25% — the rate a currency in trouble runs at',
        requiredObservations: [
          { sliderKey: 'inflationRate', values: [0.02, 0.1, 0.25] },
        ],
        // 25% over ten years destroys ~89% of the value. Targeting the
        // readout rather than the slider means the learner has to end on a
        // rate that actually produces the loss, not merely touch a number.
        target: { readoutKey: 'purchasing_power_lost', comparator: 'gte', value: 0.85 },
      },
      explanation:
        'At the 2% target a decade costs you about 18% — unpleasant but survivable. At 10% it costs 61%, and at 25% it costs 89%: the €10,000 buys what €1,074 buys today. Notice the halving time collapses far faster than the rate rises, because the erosion compounds. This is also why "inflation is coming down" does not mean prices are: a falling rate still eats what is left, only more slowly.',
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
          definition: 'The quantity of real goods one unit of money can buy',
        },
        {
          id: 'nominal',
          term: 'Nominal value',
          definition: 'The number printed on the note or shown in the account',
        },
        {
          id: 'real',
          term: 'Real value',
          definition: 'The same amount after inflation has been taken back out',
        },
        {
          id: 'disinflation',
          term: 'Disinflation',
          definition: 'Prices still rising, but more slowly than before',
        },
        {
          id: 'deflation',
          term: 'Deflation',
          definition: 'The general price level actually falling',
        },
      ],
      explanation:
        'Disinflation and deflation get confused constantly, including in headlines. Disinflation is the rate coming down while prices keep climbing — which is what "inflation is falling" almost always means. Deflation is the level itself going into reverse, and it brings its own problem: debts are fixed in nominal terms, so they get heavier in real terms every year.',
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
            'That is the nominal return. The number in the account did grow by 4% — but the question is what it buys.',
        },
        {
          id: 'lost-2',
          label: 'It lost roughly 2% of its purchasing power',
        },
        {
          id: 'flat',
          label: 'It broke even, since interest offsets inflation',
          feedback:
            'Only if the two rates matched. Here interest is below inflation, so the gap is a real loss.',
        },
        {
          id: 'lost-6',
          label: 'It lost 6%',
          feedback:
            'That is the erosion before interest. The 4% you earned offsets most of it — the loss is the difference, not the whole of inflation.',
        },
      ],
      correctOptionId: 'lost-2',
      explanation:
        'The real rate is what is left after inflation: about −1.9% here, since (1.04 / 1.06) − 1 = −0.0189. The rough version — subtract inflation from interest — gives −2% and is close enough at these levels. It stops being close at high rates, which is why the exact form matters to anyone saving in a currency running at 25%. A negative real rate means a saver doing everything right still gets poorer.',
    },
  ],
});
