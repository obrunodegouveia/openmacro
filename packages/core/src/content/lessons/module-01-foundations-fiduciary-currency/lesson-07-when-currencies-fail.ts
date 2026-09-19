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
  subtitle: 'Hyperinflation is not fast inflation. It is a different mechanism.',
  icon: '🔥',
  difficulty: 'core',
  estimatedMinutes: 7,
  hearts: 3,

  keyTakeaways: [
    'Hyperinflation is usually a fiscal event: a deficit that cannot be taxed or borrowed gets financed by issuance.',
    'The loop is the mechanism — spending faster to avoid holding the currency raises prices, which makes holding it worse.',
    'Money loses its three jobs in order: store of value first, unit of account next, medium of exchange last.',
    'It ends abruptly when the fiscal position becomes credible, not gradually as the money supply shrinks.',
  ],

  challenges: [
    {
      id: 'order-hyperinflation-loop',
      type: 'order_flow',
      tags: ['hyperinflation', 'crisis'],
      xp: 20,
      prompt: 'Put the hyperinflation spiral in causal order.',
      instructions: 'Earliest cause at the top',
      events: [
        {
          id: 'deficit',
          label: 'The government cannot fund itself by tax or borrowing',
          detail: 'Lenders refuse, and the tax base is too small or too damaged',
        },
        {
          id: 'issue',
          label: 'It finances the gap by issuing currency',
          detail: 'The central bank buys the debt nobody else will',
        },
        {
          id: 'prices',
          label: 'Prices rise as the new money chases the same goods',
          detail: 'The first round looks like ordinary inflation',
        },
        {
          id: 'flee',
          label: 'People spend it the moment they receive it',
          detail: 'Holding cash for a week is now a guaranteed loss',
        },
        {
          id: 'velocity',
          label: 'Faster spending drives prices up further',
          detail: 'The same stock of money now does far more work — velocity is the accelerant',
        },
        {
          id: 'real-collapse',
          label: 'Real tax revenue collapses, widening the original gap',
          detail: 'Taxes are assessed today and paid in money worth less tomorrow',
        },
      ],
      correctOrder: ['deficit', 'issue', 'prices', 'flee', 'velocity', 'real-collapse'],
      explanation:
        'The last step is what makes it a spiral rather than a one-off. As prices rise, the real value of tax collected between assessment and payment falls — the Olivera–Tanzi effect — so the deficit the government was trying to close gets *wider*, forcing more issuance. That feedback, not the initial printing, is why hyperinflations accelerate rather than settling at a high plateau.',
    },

    {
      id: 'mc-not-just-printing',
      type: 'multiple_choice',
      tags: ['hyperinflation', 'fiscal'],
      xp: 15,
      prompt: 'Central banks created trillions in QE after 2008 without hyperinflation. Why not?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'not-enough',
          label: 'The amounts were not actually that large',
          feedback:
            'They were enormous — several times the pre-crisis monetary base. Size was not the difference.',
        },
        {
          id: 'reserves-not-spent',
          label: 'It created reserves, not spending — and it was not financing a deficit that could not be funded',
        },
        {
          id: 'luck',
          label: 'It very nearly did happen',
          feedback:
            'Inflation ran below target for most of the decade after QE began. This was not a near miss; the prediction was wrong about the mechanism.',
        },
        {
          id: 'gold',
          label: 'Those currencies are backed by reserves',
          feedback:
            'They are not redeemable for anything. Whatever restrained inflation, it was not backing.',
        },
      ],
      correctOptionId: 'reserves-not-spent',
      explanation:
        'Two differences. First, QE swapped one safe asset for another inside the banking system — it created reserves that only banks can hold, not purchasing power in anyone’s hands. Second, and more important, these governments could still borrow at low rates: the issuance was a policy choice, not a last resort. Hyperinflation is what happens when a state has no other way to pay its bills, and the market knows it.',
    },

    {
      id: 'sim-real-savings',
      type: 'interactive_sim',
      tags: ['hyperinflation', 'real-rates'],
      xp: 25,
      prompt: 'Can a bank account protect you?',
      instructions: 'Move inflation and see what the saver keeps',
      narrative:
        'A saver holds money in an account paying 8% a year — generous by rich-country standards. Move the inflation rate and watch what the real return does.',
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
        description: 'Finish at 40% — where saving in the currency is hopeless',
        requiredObservations: [
          { sliderKey: 'inflationRate', values: [0.04, 0.08, 0.4] },
        ],
        // At 40% inflation an 8% account returns about -23% in real terms.
        target: { readoutKey: 'real_interest_rate', comparator: 'lte', value: -0.2 },
      },
      explanation:
        'At 8% inflation the account exactly breaks even — that is the definition of a zero real rate. Past it every extra point is a loss the saver cannot avoid by choosing a better bank, because no deposit rate keeps pace once inflation is accelerating. At 40% the real return is about −23% a year. This is the moment the store-of-value function dies, and it is why people in high-inflation countries buy dollars, property or anything durable: they are not speculating, they are refusing to hold a melting asset.',
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
          label: 'Medium of exchange — people stop accepting it',
          feedback:
            'This goes last, and often never entirely. People keep transacting in the local currency long after they stop saving or quoting prices in it.',
        },
        {
          id: 'store',
          label: 'Store of value — nobody holds it any longer than they must',
        },
        {
          id: 'unit',
          label: 'Unit of account — prices get quoted in something else',
          feedback:
            'This is second. Shops start pricing in dollars once repricing daily becomes impractical — but only after holding the currency has already become untenable.',
        },
        {
          id: 'all-together',
          label: 'All three collapse simultaneously',
          feedback:
            'They come apart in a consistent order, which is what makes the process recognisable while it is happening rather than only afterwards.',
        },
      ],
      correctOptionId: 'store',
      explanation:
        'The sequence is store of value, then unit of account, then medium of exchange. You stop *saving* in it first, because the loss is immediate and personal. You stop *pricing* in it next, when menus need rewriting faster than they can be printed. You stop *spending* it last — often only when the state stops accepting it in tax. Recognising which stage a currency is in tells you how far the process has run, and dollarisation of prices is the reliable signal that the second stage has passed.',
    },
  ],
});
