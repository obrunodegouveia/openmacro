import { defineLesson } from '../../schema';

/** Video 23. Deposit insurance solves the run and creates a subsidy — and correlated failures break the insurance model. */
export const kabDepositInsuranceLesson = defineLesson({
  id: 'kab-deposit-insurance',
  title: 'The Fix That Creates the Next Problem',
  subtitle:
    'Insure the deposits and the run stops. Now every bank borrows at the same price, whatever it does with the money.',
  icon: '🛟',
  difficulty: 'advanced',
  estimatedMinutes: 19,
  video: {
    url: 'https://www.youtube.com/watch?v=otstXFxMkl4',
    minutes: 15,
    source: 'Khan Academy — FRB Commentary 2: Deposit Insurance',
  },
  challenges: [
    {
      id: 'mc-side-effect',
      type: 'multiple_choice',
      tags: ['deposit-insurance', 'moral-hazard'],
      xp: 30,
      prompt:
        'Deposit insurance does stop bank runs. What is the side effect the video considers more serious?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'indifference',
          label:
            'Depositors stop caring how a bank invests, so they simply chase the highest rate — which is the riskiest bank',
        },
        {
          id: 'cost',
          label: 'The premiums are expensive for banks',
          feedback:
            'The opposite: a fraction of a percent, and far cheaper than the extra interest a bank would have to pay without it. Cheapness is the problem.',
        },
        {
          id: 'slow',
          label: 'Depositors wait a long time to be repaid',
          feedback:
            'Speed is not the concern raised. The concern is what insurance does to behaviour before any failure happens.',
        },
        {
          id: 'coverage',
          label: 'Only some deposits are covered',
          feedback:
            'Limits exist but are not the argument. The argument is that coverage makes all banks look alike to a depositor.',
        },
      ],
      correctOptionId: 'indifference',
      explanation:
        'A deposit is a loan to the bank, so the deposit rate *is* the bank’s borrowing cost. Insurance lets a reckless bank borrow at nearly the price a prudent one pays — the video estimates the difference at 0.1% against the 3–4% risk would otherwise demand. That gap is a subsidy, and it is largest for the bank taking the most risk.',
    },
    {
      id: 'mc-correlated',
      type: 'multiple_choice',
      tags: ['insurance', 'correlation'],
      xp: 30,
      prompt:
        'Car insurance works across a million drivers. Why does the same maths not work for deposit insurance?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'correlated',
          label:
            'Bank failures are correlated — one failing makes others more likely, so the losses arrive together',
        },
        {
          id: 'rare',
          label: 'Because bank failures are too rare to price',
          feedback:
            'Rare events are insurable if they are independent. Correlation, not rarity, is what breaks the model.',
        },
        {
          id: 'large',
          label: 'Because each failure is too large',
          feedback:
            'Size can be handled with enough premium. What cannot be handled is every claim arriving in the same quarter.',
        },
        {
          id: 'political',
          label: 'Because the government would bail banks out anyway',
          feedback:
            'True and mentioned, but it is the consequence rather than the cause. The actuarial failure comes first.',
        },
      ],
      correctOptionId: 'correlated',
      explanation:
        'One driver crashing does not make another crash. One bank failing genuinely does make others more likely to fail, because the system is interlinked and confidence is shared. So the insurer collects premiums calmly for years and then faces every claim at once — which is why the video predicts the FDIC going back to Congress, with taxpayers behind it.',
    },
  ],
  keyTakeaways: [
    'A deposit rate is a bank’s borrowing cost; insurance lowers it for everyone equally.',
    'Equal borrowing costs reward the bank taking the most risk.',
    'Insurance maths needs independent events, and bank failures are correlated.',
  ],
});
