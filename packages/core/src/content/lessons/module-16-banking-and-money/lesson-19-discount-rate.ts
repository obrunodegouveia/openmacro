import { defineLesson } from '../../schema';

/** Video 19. The discount window as lender of last resort, and why its rate sits above the funds rate. */
export const kabDiscountRateLesson = defineLesson({
  id: 'kab-discount-rate',
  title: 'When Nobody Will Lend to You',
  subtitle:
    'The funds rate needs a willing counterparty. The discount window is what exists for when there is none.',
  icon: '🪟',
  difficulty: 'core',
  estimatedMinutes: 17,
  video: {
    url: 'https://www.youtube.com/watch?v=FxkTSjctXdk',
    minutes: 13,
    source: 'Khan Academy — the discount rate',
  },
  challenges: [
    {
      id: 'mc-why-higher',
      type: 'multiple_choice',
      tags: ['discount-rate', 'lender-of-last-resort'],
      xp: 25,
      prompt: 'Why is the discount rate deliberately set above the federal funds rate?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'last-resort',
          label:
            'So banks borrow from each other first and only come to the central bank when they must',
        },
        {
          id: 'profit',
          label: 'So the central bank makes more money on the loan',
          feedback:
            'Its surplus goes back to the Treasury, so profit is not the motive. The spread exists to shape behaviour.',
        },
        {
          id: 'risk',
          label: 'Because lending to a distressed bank is riskier',
          feedback:
            'Reasonable in principle, but the loan is collateralised. The stated purpose is to keep the window a last resort rather than a first option.',
        },
        {
          id: 'inflation',
          label: 'To stop discount lending from being inflationary',
          feedback:
            'Both channels create reserves. The distinction is about who lends to whom, not about the inflationary effect.',
        },
      ],
      correctOptionId: 'last-resort',
      explanation:
        'If the window were cheaper than the interbank market, no bank would ever bother with another bank. Historically the gap was about a percentage point. That gap is also an information signal: heavy use of the window says the interbank market has stopped functioning.',
    },
    {
      id: 'mc-pariah',
      type: 'multiple_choice',
      tags: ['bank-run', 'liquidity'],
      xp: 25,
      prompt:
        'A bank faces withdrawals and no other bank will lend to it, because none can value its assets. Why does everyone else still care?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'systemic',
          label:
            'If one depositor is turned away, the story spreads and every bank faces a run',
        },
        {
          id: 'charity',
          label: 'Because the central bank is obliged to rescue any bank that asks',
          feedback:
            'It is not, and the commentary videos argue it often cannot tell whether it should — the distressed bank and the merely unlucky one make the same claim.',
        },
        {
          id: 'exposure',
          label: 'Because the other banks have lent to it',
          feedback:
            'A real channel in practice, but the mechanism emphasised here is confidence: depositors cannot tell which bank is sound.',
        },
        {
          id: 'no-care',
          label: 'They do not — a failing bank is a competitor gone',
          feedback:
            'That is the reasoning the video rejects. In a fractional reserve system a single visible failure can empty every other bank.',
        },
      ],
      correctOptionId: 'systemic',
      explanation:
        'The first depositor turned away calls the press, and then nobody knows which banks are good. The window exists because the alternative to lending against collateral is a system-wide panic — which is also why it hands the central bank the hard problem of telling illiquid apart from insolvent.',
    },
  ],
  keyTakeaways: [
    'The funds rate is bank-to-bank; the discount rate is central-bank-to-bank.',
    'The discount rate sits higher so the window stays a last resort.',
    'Lending is collateralised, through repurchase agreements.',
  ],
});
