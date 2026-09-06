import { defineLesson } from '../../schema';

/**
 * The capstone, and the point of the module: five questions that cannot be
 * answered by knowing what Euribor stands for.
 *
 * Reference points used throughout: Euribor 3M 2.513% and 12M 2.954% in
 * August 2026, €STR fixing 2.189% on 3 September 2026, deposit facility rate
 * 2.25%, main refinancing rate 2.40%.
 */
export const theGrillingLesson = defineLesson({
  id: 'euribor-under-pressure',
  title: 'Five Questions That Separate Knowing From Understanding',
  subtitle:
    'Every one of these can be got wrong by someone who can define Euribor correctly.',
  icon: '🔥',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'mc-euribor-ois',
      type: 'multiple_choice',
      tags: ['euribor', 'stress', 'diagnosis'],
      xp: 30,
      prompt:
        '3-month Euribor jumps 40 basis points in a fortnight. The €STR-based overnight index swap for the same three months does not move. What happened?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'credit-stress',
          label: 'Bank credit or funding stress — the expected policy path is unchanged, so the whole move is the risk premium',
        },
        {
          id: 'hikes',
          label: 'The market started pricing rate hikes',
          feedback:
            'Then the swap would have moved too — it prices the same expected path over the same window, without the bank credit component. Its stillness is the evidence.',
        },
        {
          id: 'inflation',
          label: 'An inflation surprise',
          feedback:
            'An inflation surprise moves the expected policy path, which moves the swap. Same objection.',
        },
        {
          id: 'technical',
          label: 'A quarter-end technical effect with no information in it',
        },
      ],
      correctOptionId: 'credit-stress',
      explanation:
        'This difference has a name — the Euribor–OIS spread — and it is the cleanest stress gauge in euro money markets. Both legs price the same expected overnight path over the same window; only Euribor also contains the risk of lending unsecured to a bank for three months. Subtract one from the other and what is left is the price of bank credit. It sat near zero for years, blew out in 2008, and moved again in March 2020.',
    },
    {
      id: 'mc-fallback',
      type: 'multiple_choice',
      tags: ['euribor', 'fallbacks', 'contracts'],
      xp: 30,
      prompt:
        'Euribor ceases to be published. Your contract falls back to compounded €STR plus a fixed adjustment spread. Why the adjustment?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'credit-gap',
          label: 'Because €STR is risk-free and Euribor was not — without it the borrower gets a windfall and the lender a loss',
        },
        {
          id: 'admin',
          label: 'To cover the administrator’s costs',
        },
        {
          id: 'volatility',
          label: 'Because €STR is more volatile',
          feedback:
            'Compounded €STR over three months is smoother than a Euribor fixing, not rougher — it averages sixty-odd daily observations. The gap being bridged is a level, not a volatility.',
        },
        {
          id: 'timing',
          label: 'Because €STR is published a day later',
          feedback:
            'Publication timing is a genuine operational nuisance and it is worth about one day, not a permanent spread of dozens of basis points.',
        },
      ],
      correctOptionId: 'credit-gap',
      explanation:
        'Swap Euribor for €STR unadjusted and every floating-rate contract in the euro area silently reprices by the credit and term premium — tens of basis points, in the borrower’s favour, on trillions. The adjustment spread exists to make the switch economically neutral on the day it happens, which is why it is fixed historically rather than set at the moment of transition: otherwise whoever chose the date would be choosing who gains.',
    },
    {
      id: 'mc-in-advance',
      type: 'multiple_choice',
      tags: ['euribor', 'estr', 'mechanics'],
      xp: 30,
      prompt:
        'Euribor is set in advance for the period; compounded €STR is known only in arrears. Why does that difference matter to a borrower?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'know-the-payment',
          label: 'With Euribor you know the payment at the start of the period; with €STR you learn it at the end',
        },
        {
          id: 'cheaper',
          label: 'Because in-advance rates are always cheaper',
          feedback:
            'They are usually higher, since they contain a term and credit premium. What they buy is certainty, not cheapness.',
        },
        {
          id: 'accurate',
          label: 'Because compounding in arrears is more accurate',
        },
        {
          id: 'no-difference',
          label: 'It does not matter once the adjustment spread is applied',
          feedback:
            'The spread fixes the level. It does nothing about when you find out, and for a household budgeting a mortgage payment that is the part that matters.',
        },
      ],
      correctOptionId: 'know-the-payment',
      explanation:
        'This is the practical reason term benchmarks survive at all in retail lending. A corporate treasury can handle a payment confirmed two days before it is due; a household planning around a mortgage cannot. The wholesale market has largely moved to overnight rates compounded in arrears, and consumer lending has not, and that difference in who needs certainty is the whole explanation.',
    },
    {
      id: 'flow-panel-risk',
      type: 'order_flow',
      tags: ['euribor', 'governance', 'risk'],
      xp: 30,
      prompt:
        'Put the failure mode of a submission-based benchmark in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'market-thins',
          label: 'The underlying market stops trading',
          detail: 'Banks fund themselves in other ways; term interbank lending dries up',
        },
        {
          id: 'judgement',
          label: 'Submissions rely more on judgement than on trades',
          detail: 'The waterfall descends to its lower levels',
        },
        {
          id: 'liability',
          label: 'Panel banks face legal risk for submitting a judgement',
          detail: 'After the LIBOR prosecutions, no bank wants to be the one estimating',
        },
        {
          id: 'panel-shrinks',
          label: 'Banks resign from the panel',
          detail: 'Each departure makes the remaining submissions matter more',
        },
        {
          id: 'unrepresentative',
          label: 'The benchmark becomes fragile — few submitters, thin evidence, enormous contract volume',
          detail: 'Which is how LIBOR ended',
        },
      ],
      correctOrder: ['market-thins', 'judgement', 'liability', 'panel-shrinks', 'unrepresentative'],
      explanation:
        'The failure is circular, and Euribor is not immune to it — the 2019 hybrid methodology and the Benchmarks Regulation were built to slow the spiral, not to make it impossible. The structural problem is unchanged: an enormous stock of contracts referencing a rate measured in a market that is far smaller than they are. That is why the fallback in the previous screen exists and why anyone with Euribor exposure should know what their contract says about it.',
    },
    {
      id: 'mc-final-diagnosis',
      type: 'multiple_choice',
      tags: ['euribor', 'diagnosis', 'capstone'],
      xp: 35,
      prompt:
        'Over one month: 1M Euribor 2.22% → 2.20%, 12M 2.95% → 3.30%, €STR unchanged at 2.19%, the ECB does nothing and says nothing. What changed?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'later-hikes',
          label: 'The market brought forward nothing for next month and priced materially more tightening later in the year',
        },
        {
          id: 'credit-stress',
          label: 'Bank credit stress',
          feedback:
            'Credit stress lifts the near tenors hardest and fastest — that is where the risk of lending to a bank is most acute. Here the 1-month actually fell, which is close to the opposite signature.',
        },
        {
          id: 'ecb-hiked',
          label: 'The ECB tightened without announcing it',
          feedback:
            '€STR did not move, and €STR is where an unannounced tightening would show up first — it is the transaction rate the policy rates bracket.',
        },
        {
          id: 'noise',
          label: 'Nothing meaningful — 35 basis points on a single tenor is noise',
          feedback:
            'Thirty-five basis points on the 12-month with the 1-month moving the other way is not noise. Noise does not have a shape, and this has one.',
        },
      ],
      correctOptionId: 'later-hikes',
      explanation:
        'Read all four numbers together and only one story fits. €STR flat says today is unchanged. The 1-month falling slightly says nothing is expected imminently. The 12-month up 35 basis points says a good deal more is expected within the year. And the ECB saying nothing is the point — Euribor is not waiting for it. If you can do this in four numbers, you can read the euro money market, which is what the module was for.',
    },
  ],
  keyTakeaways: [
    'Euribor minus the €STR swap is the price of bank credit — the cleanest stress gauge in euro money markets.',
    'The fallback adjustment spread exists because €STR is risk-free and Euribor is not; without it, trillions silently reprice.',
    'Set in advance versus compounded in arrears is about who needs to know the payment before the period starts.',
    'A thin panel is the failure mode: a huge stock of contracts on a rate measured in a market far smaller than they are.',
  ],
});
