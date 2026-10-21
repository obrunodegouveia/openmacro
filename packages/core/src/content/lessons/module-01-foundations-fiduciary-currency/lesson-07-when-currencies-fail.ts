/**
 * ============================================================================
 * Module 1 · Lesson 6 — "How a currency actually dies"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to describe hyperinflation as a self-reinforcing
 * loss of the unit-of-account function rather than simply "printing money",
 * and explain why the three jobs of money are abandoned in a predictable
 * order.
 *
 * Sources / further reading for reviewers:
 *   - Cagan, "The Monetary Dynamics of Hyperinflation" (1956) — the velocity
 *     feedback loop.
 *   - Sargent, "The Ends of Four Big Inflations" (1982) — why credible fiscal
 *     reform stops them abruptly.
 *
 * A note on rigour: "printing money causes hyperinflation" is true but skips
 * the mechanism and the cause. Issuance is usually a *symptom* of a fiscal
 * position that cannot be financed any other way. The lesson makes the fiscal
 * root explicit, because a learner who thinks hyperinflation is a printing
 * decision will not understand why it stops the moment budgets are credible.
 */

import { defineLesson } from '../../schema';

export const whenCurrenciesFailLesson = defineLesson({
  id: 'when-currencies-fail',
  title: 'How a Currency Dies',
  subtitle: 'Hyperinflation is not just fast inflation. It works in a different way.',
  icon: '🔥',
  difficulty: 'core',
  estimatedMinutes: 7,
  hearts: 3,

  keyTakeaways: [
    'Hyperinflation usually starts with the budget: a government that cannot tax or borrow enough pays its bills by creating money.',
    'The loop is the cause: people spend fast to avoid holding the money, which pushes prices up, which makes holding it even worse.',
    'Money loses its three jobs in order: store of value first, then unit of account, then medium of exchange.',
    'It ends suddenly, when people believe the government can pay its way again. It does not end slowly as money is removed.',
  ],

  challenges: [
    {
      id: 'order-hyperinflation-loop',
      type: 'order_flow',
      tags: ['hyperinflation', 'crisis'],
      xp: 20,
      prompt: 'Put the steps of the hyperinflation spiral in order, from cause to effect.',
      instructions: 'First step at the top',
      events: [
        {
          id: 'deficit',
          label: 'The government cannot pay its bills from taxes or by borrowing',
          detail: 'Lenders say no, and taxes bring in too little',
        },
        {
          id: 'issue',
          label: 'It covers the gap by creating money',
          detail: 'The central bank buys the debt nobody else wants',
        },
        {
          id: 'prices',
          label: 'Prices rise, because more money is chasing the same goods',
          detail: 'The first round looks like ordinary inflation',
        },
        {
          id: 'flee',
          label: 'People spend it the moment they receive it',
          detail: 'Keeping cash for even a week now means a sure loss',
        },
        {
          id: 'velocity',
          label: 'Faster spending pushes prices up even more',
          detail: 'The same money changes hands much more often: this speed (“velocity”) makes it worse',
        },
        {
          id: 'real-collapse',
          label: 'The real value of taxes collapses, so the gap gets bigger',
          detail: 'Taxes are set today but paid later, in money worth less',
        },
      ],
      correctOrder: ['deficit', 'issue', 'prices', 'flee', 'velocity', 'real-collapse'],
      explanation:
        'The last step turns this into a spiral, not a one-time jump. As prices rise, taxes lose value between the day they are set and the day they are paid. This is called the Olivera–Tanzi effect. So the gap the government wanted to close gets bigger, and it creates even more money. This loop, not the first printing, is why hyperinflation speeds up instead of settling at a high level.',
    },

    {
      id: 'mc-not-just-printing',
      type: 'multiple_choice',
      tags: ['hyperinflation', 'fiscal'],
      xp: 15,
      prompt: 'After 2008, central banks created trillions through QE, but there was no hyperinflation. Why not?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'not-enough',
          label: 'The amounts were not actually that large',
          feedback:
            'They were huge: several times the base money before the crisis. Size was not the difference.',
        },
        {
          id: 'reserves-not-spent',
          label: 'It created reserves, not spending, and governments could still borrow normally',
        },
        {
          id: 'luck',
          label: 'It very nearly did happen',
          feedback:
            'Inflation stayed below target for most of the ten years after QE began. It was not a near miss. The warning was wrong about how it works.',
        },
        {
          id: 'gold',
          label: 'Those currencies are backed by reserves',
          feedback:
            'They cannot be swapped for anything. Whatever kept inflation low, it was not backing.',
        },
      ],
      correctOptionId: 'reserves-not-spent',
      explanation:
        'There are two differences. First, QE swapped one safe asset for another inside the banking system. It created reserves that only banks can hold, not money in people’s hands. Second, and more important, these governments could still borrow at low rates. Creating money was a policy choice, not a last resort. Hyperinflation happens when a state has no other way to pay its bills, and the market knows it.',
    },

    {
      id: 'sim-real-savings',
      type: 'interactive_sim',
      tags: ['hyperinflation', 'real-rates'],
      xp: 25,
      prompt: 'Can a bank account protect you?',
      instructions: 'Move inflation and see what the saver keeps',
      narrative:
        'A saver keeps money in an account that pays 8% a year, which is a lot in rich countries. Move the inflation rate and watch what happens to the real return.',
      constants: { nominalRate: 0.08, nominal: 10000, years: 5 },
      sliders: [
        {
          key: 'inflationRate',
          label: 'Annual inflation',
          min: 0,
          max: 1,
          step: 0.02,
          defaultValue: 0.04,
          format: 'percent',
          hint: 'Push it past the 8% the account pays',
        },
      ],
      readouts: [
        {
          key: 'real_interest_rate',
          label: 'Real return after inflation',
          formulaId: 'real_interest_rate',
          format: 'percent',
          emphasis: true,
          caption: '(1 + nominal) / (1 + inflation) - 1',
        },
        {
          key: 'purchasing_power',
          label: 'What €10,000 buys after 5 years',
          formulaId: 'purchasing_power',
          format: 'currency',
          caption: 'Before interest is added',
        },
        {
          key: 'halving_years',
          label: 'Years to lose half',
          formulaId: 'halving_years',
          format: 'number',
        },
      ],
      objective: {
        description: 'End at 40%, where saving in this currency is hopeless',
        requiredObservations: [
          { sliderKey: 'inflationRate', values: [0.04, 0.08, 0.4] },
        ],
        // At 40% inflation an 8% account returns about -23% in real terms.
        target: { readoutKey: 'real_interest_rate', comparator: 'lte', value: -0.2 },
      },
      explanation:
        'At 8% inflation the account just breaks even: that is what a zero real rate means. Above that, every extra point is a loss. No bank can save you, because no deposit rate keeps up once inflation speeds up. At 40%, the real return is about −23% a year. This is when money stops being a store of value. It is why people in high-inflation countries buy dollars, property or anything that lasts. They are not gambling. They are refusing to hold something that is melting away.',
    },

    {
      id: 'mc-order-of-collapse',
      type: 'multiple_choice',
      tags: ['hyperinflation', 'money-functions'],
      xp: 15,
      prompt: 'As a currency collapses, which job does it lose first?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'medium',
          label: 'Medium of exchange: people stop accepting it',
          feedback:
            'This goes last, and often never fully. People keep paying in the local currency long after they stop saving in it or writing prices in it.',
        },
        {
          id: 'store',
          label: 'Store of value: nobody keeps it any longer than they must',
        },
        {
          id: 'unit',
          label: 'Unit of account: prices are written in another currency',
          feedback:
            'This is second. Shops start writing prices in dollars when changing prices every day becomes too hard. But that only happens after keeping the currency has already become a bad idea.',
        },
        {
          id: 'all-together',
          label: 'All three at the same time',
          feedback:
            'They fall apart in a fixed order. That is what lets people recognise the process while it is happening, not only afterwards.',
        },
      ],
      correctOptionId: 'store',
      explanation:
        'The order is: store of value, then unit of account, then medium of exchange. You stop saving in it first, because the loss is quick and personal. You stop writing prices in it next, when menus need changing faster than they can be printed. You stop spending it last, often only when the state stops taking it for taxes. When shops start pricing in dollars, you know the second stage has arrived.',
    },
  ],
});
