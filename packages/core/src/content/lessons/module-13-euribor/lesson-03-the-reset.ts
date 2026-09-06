import { defineLesson } from '../../schema';

/**
 * Where Euribor stops being a benchmark and becomes a household's monthly
 * payment.
 *
 * 12-month Euribor bottomed at −0.505% in January 2021 and peaked at +4.160%
 * in October 2023 — a move of 4.66 points in 33 months. On €200,000 over 30
 * years at a 1.00% spread, the level payment goes from about €598 to about
 * €1,093: an increase of 83%.
 */
export const theResetLesson = defineLesson({
  id: 'the-euribor-reset',
  title: 'The Day the Rate Resets',
  subtitle:
    'A benchmark becomes a mortgage payment on one scheduled morning, and the number it uses is already old.',
  icon: '🗓️',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'sim-payment-shock',
      type: 'interactive_sim',
      tags: ['euribor', 'mortgage', 'shock'],
      xp: 35,
      currency: 'EUR',
      prompt: 'Reset a €200,000 mortgage at any Euribor of the last five years.',
      instructions: 'Move the Euribor fixing and your contract spread',
      narrative:
        'Thirty years, level payments, a spread agreed once at signing and never revisited. The only thing that changes at each reset is the index. Twelve-month Euribor was −0.505% in January 2021 and +4.160% in October 2023, and the comparison below is against that 2021 low.',
      constants: {
        principal: 200000,
        years: 30,
        baseRate: 0.00495,
      },
      sliders: [
        {
          key: 'euribor',
          label: 'Euribor at the reset',
          min: -0.01,
          max: 0.05,
          step: 0.0025,
          defaultValue: 0.03,
          format: 'percent',
          hint: 'Low −0.505% (Jan 2021), peak +4.160% (Oct 2023), 2.954% in August 2026.',
        },
        {
          key: 'spread',
          label: 'Your contract spread',
          min: 0,
          max: 0.03,
          step: 0.0025,
          defaultValue: 0.01,
          format: 'percent',
          hint: 'Fixed for the life of the loan. It never resets, and it never falls.',
        },
      ],
      readouts: [
        {
          key: 'annualRate',
          label: 'Rate you actually pay',
          formulaId: 'rate_plus_spread',
          format: 'percent',
          caption: 'Euribor + spread',
        },
        {
          key: 'payment',
          label: 'Monthly payment',
          formulaId: 'mortgage_monthly_payment',
          format: 'currency',
          emphasis: true,
          caption: '€200,000 over 30 years',
        },
        {
          key: 'increase',
          label: 'Against the January 2021 payment',
          formulaId: 'mortgage_payment_increase',
          format: 'percent',
          caption: 'When the same loan cost about €598 a month',
        },
      ],
      objective: {
        description:
          'Compare the 2021 low with the 2023 peak, and leave the payment at least 50% above the low',
        requiredObservations: [
          { sliderKey: 'euribor', values: [-0.005, 0.0425] },
        ],
        target: {
          readoutKey: 'increase',
          comparator: 'gte',
          value: 0.5,
        },
      },
      explanation:
        'At the 2023 peak the same loan on the same terms cost about €1,093 a month against €598 — an 83% rise, with no renegotiation, no new borrowing and no change in the borrower’s circumstances. Notice what the spread slider does too: at a 1% spread the borrower’s rate rose about ninefold, and at a 3% spread it roughly doubled. A fat spread makes the good years worse and the bad years less bad, which is not how it is usually sold.',
    },
    {
      id: 'mc-the-lag',
      type: 'multiple_choice',
      tags: ['euribor', 'mortgage', 'reset'],
      xp: 30,
      prompt:
        'Your loan resets annually on 12-month Euribor. Euribor peaked in October 2023 and has since fallen. When did your payment peak?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'up-to-a-year-later',
          label: 'On whichever reset date followed the peak — up to a year after it, and it stayed there a further year',
        },
        {
          id: 'same-month',
          label: 'In October 2023, with the index',
          feedback:
            'Only if your reset happened to fall that month. The index moves daily and the contract looks at it once a year, so the two peaks coincide for about one borrower in twelve.',
        },
        {
          id: 'immediately-fell',
          label: 'It fell as soon as Euribor did',
          feedback:
            'Backwards. A borrower who reset just after the peak paid the peak rate for the following twelve months, while the index was falling the whole time.',
        },
        {
          id: 'never',
          label: 'It never peaked, since the spread is fixed',
        },
      ],
      correctOptionId: 'up-to-a-year-later',
      explanation:
        'The reset is a snapshot, and you live with it until the next one. Two neighbours with identical loans and reset dates six months apart paid materially different amounts through 2024 for no reason other than which month they signed in. It also means the pain of a tightening cycle is still arriving in household budgets long after the central bank has stopped — which is one reason monetary policy is described as working with a lag, and it is a very concrete one.',
    },
    {
      id: 'mc-choose-tenor',
      type: 'multiple_choice',
      tags: ['euribor', 'mortgage', 'choice'],
      xp: 30,
      prompt:
        'You can index the same loan to 3-month or 12-month Euribor. Rates are expected to rise. Which is better?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'depends-priced',
          label: 'Neither by default — the 12-month already contains the expected rises, so you pay for the certainty up front',
        },
        {
          id: 'twelve',
          label: 'The 12-month, because it locks the rate for a year',
          feedback:
            'It does lock it — at 2.954% rather than 2.513%, which is 44 basis points bought in advance. That may be worth it, but it is not free, and calling it "better" skips the price.',
        },
        {
          id: 'three',
          label: 'The 3-month, because it starts lower',
          feedback:
            'It starts lower precisely because it will reprice sooner into whatever comes. Picking the cheaper index in a rising market is choosing to reset more often into rising rates.',
        },
        {
          id: 'no-difference',
          label: 'No difference — they track each other',
        },
      ],
      correctOptionId: 'depends-priced',
      explanation:
        'The gap between the tenors is the market’s price for that certainty, and you are paying it either way — up front in a higher fixing, or later in more frequent resets. The genuine reason to prefer the 12-month is not a forecast, because the market has already made one: it is that you would rather know your payment for a year. That is a statement about your household, not about rates, and it is the only version of this decision you have an information advantage in.',
    },
    {
      id: 'mc-negative-euribor',
      type: 'multiple_choice',
      tags: ['euribor', 'negative-rates', 'contracts'],
      xp: 25,
      prompt:
        'Euribor was −0.505% and your spread is 1.00%. Some contracts paid 0.495%, others paid 1.00%. Why the difference?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'floor-clause',
          label: 'A zero floor on the index, written into some contracts and not others',
        },
        {
          id: 'illegal',
          label: 'Negative indices are not legally enforceable',
          feedback:
            'Courts in several euro area countries held that a negative index does reduce the rate where the contract does not say otherwise — which is why banks that had not written a floor paid for its absence.',
        },
        {
          id: 'rounding',
          label: 'Rounding conventions',
        },
        {
          id: 'bank-choice',
          label: 'Each bank chose at the time',
          feedback:
            'They chose at drafting, years earlier, which is the point. By the time it mattered the wording was already fixed.',
        },
      ],
      correctOptionId: 'floor-clause',
      explanation:
        'Nobody drafting a mortgage in 2005 expected to need a sentence about the index going below zero. When it did, whether a borrower got the benefit came down to a clause written before anyone thought it could bind — and there is a general lesson in that. The interesting terms in a floating-rate contract are the ones describing states of the world the drafters considered impossible.',
    },
  ],
  keyTakeaways: [
    'Euribor moved 4.66 points in 33 months; on €200,000 that took the payment from about €598 to €1,093.',
    'You pay the index as it stood on your reset date, so payments peak after the index does and stay there.',
    'The longer tenor is not safer, it is pre-paid: the expected rises are already in the fixing.',
    'Whether a negative index reached the borrower came down to a floor clause drafted decades earlier.',
  ],
});
