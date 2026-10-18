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
        'Deposit insurance does stop bank runs. What side effect does the video consider more serious?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'indifference',
          label:
            'Depositors stop caring what a bank does with their money and simply go for the highest interest rate',
        },
        {
          id: 'cost',
          label: 'The premiums are expensive, and the cost reaches depositors',
          feedback:
            'The opposite: a fraction of a percent a year, far cheaper than the extra interest a bank would have to pay without it. The cheapness is the problem.',
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
            'Limits exist, but they are not the argument. The argument is that insurance makes all banks look alike to a depositor.',
        },
      ],
      correctOptionId: 'indifference',
      explanation:
        'A deposit is a loan to the bank, so the interest rate on deposits *is* the bank’s borrowing cost. Insurance lets a reckless bank borrow at nearly the price a careful one pays — the video puts the insurance cost at about 0.1% a year, against the extra 3–4% depositors would otherwise demand from a risky bank. That gap is a subsidy, and it is largest for the bank taking the most risk.',
    },
    {
      id: 'mc-correlated',
      type: 'multiple_choice',
      tags: ['insurance', 'correlation'],
      xp: 30,
      prompt:
        'Car insurance works by spreading the cost across a million drivers. Why does the same maths not work for deposit insurance?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'correlated',
          label:
            'Bank failures tend to happen together, so the claims all arrive at once',
        },
        {
          id: 'rare',
          label: 'Because bank failures are too rare to price',
          feedback:
            'Rare events can be insured if they happen independently of each other. Failures arriving together, not rarity, is what breaks the model.',
        },
        {
          id: 'large',
          label: 'Because a single failure is too large for any premium to cover',
          feedback:
            'Size can be handled with enough premium. What cannot be handled is every claim arriving in the same quarter.',
        },
        {
          id: 'political',
          label: 'Because the government would bail banks out anyway',
          feedback:
            'True, and the video mentions it, but it is the consequence rather than the cause. The insurance maths fails first.',
        },
      ],
      correctOptionId: 'correlated',
      explanation:
        'One driver crashing does not make another crash. One bank failing really does make others more likely to fail, because banks are linked and confidence is shared. So the insurer collects premiums calmly for years and then faces every claim at once — which is why the video expects the US deposit insurer (the FDIC) to need the government, and so the taxpayer, behind it.',
    },
    {
      id: 'mc-deposit-rate-is-borrowing-cost',
      type: 'multiple_choice',
      tags: ['deposit-insurance', 'subsidy'],
      xp: 35,
      prompt:
        'A bank pays perhaps 0.1% a year for deposit insurance from the FDIC. Sal says it saves far more than that. Where does the saving show up, and who carries the risk in the end?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'borrowingcost',
          label: 'In the low interest rate it pays depositors — its borrowing cost — while the government, and so the taxpayer, stands behind the insurance',
        },
        {
          id: 'fees',
          label: 'In lower fees for customers, paid for by the FDIC',
          feedback:
            'The saving is real, but the bank keeps it rather than passing it on. And the FDIC’s premiums are paid by banks — until the fund runs short.',
        },
        {
          id: 'nothing',
          label: 'There is no saving; the premium is the whole cost',
          feedback:
            'Then the insurance would be pointless for the bank. What it buys is the ability to borrow from depositors at a rate that ignores how it lends.',
        },
        {
          id: 'shareholders',
          label: 'In the share price, paid for by other banks’ premiums',
          feedback:
            'Shareholders do capture much of the saving, and premiums do come from banks — but Sal’s point is that the premiums are too low for the risk, and the government guarantee stands behind the fund.',
        },
      ],
      correctOptionId: 'borrowingcost',
      explanation:
        'Your deposit is a loan to the bank, so the rate it pays you is its borrowing cost. Uninsured, a bank making risky loans would have to pay 3 or 4% more to persuade you; insured, it pays the FDIC about 0.1% instead. The gap is a subsidy that grows with how recklessly the bank lends, and if the fund runs out, the government stands behind it. (In 2009 the US fund did go negative; it was rebuilt by charging banks more, in advance, without drawing on taxpayer money.)',
    },
    {
      id: 'mc-why-not-price-risk',
      type: 'multiple_choice',
      tags: ['deposit-insurance', 'risk'],
      xp: 35,
      prompt:
        'The obvious fix is to charge risky banks a higher insurance premium. Sal says that is easier said than done. Why?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'hidden',
          label: 'In good years the risk is invisible — it looks like good management',
        },
        {
          id: 'political',
          label: 'Banks would lobby against being charged more',
          feedback:
            'They would, and they have. But Sal’s argument is about knowledge rather than politics: even a regulator nobody could influence would struggle to see the risk in time.',
        },
        {
          id: 'illegal',
          label: 'The FDIC is not permitted to vary its premiums',
          feedback:
            'It does vary them by risk, and has since the 1990s. It still charged too little for the risk before 2008.',
        },
        {
          id: 'small',
          label: 'The difference in premium would be too small to matter',
          feedback:
            'It would have to be enormous to match the risk actually taken, which is the problem — you cannot price something you can only measure afterwards.',
        },
      ],
      correctOptionId: 'hidden',
      explanation:
        'Risk in a bank’s loans is about the future, and it only becomes visible when the future turns out badly. Until then the bank carrying the most risk is posting the best results, and any premium based on visible results will charge it the least — the insurer is reading a signal that points the wrong way. This is the same information problem as video 22, seen from the insurer’s side.',
    },
    {
      id: 'match-two-fixes',
      type: 'concept_match',
      tags: ['deposit-insurance', 'lender-of-last-resort'],
      xp: 30,
      prompt: 'Match each tool to the situation it is meant for.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'lolr',
          term: 'Lender of last resort',
          definition: 'For a sound bank that has simply run out of cash — it lends against collateral and gets repaid',
        },
        {
          id: 'fdic',
          term: 'Deposit insurance',
          definition: 'Removes the depositor’s reason to run at all, so the queue never forms',
        },
        {
          id: 'receivership',
          term: 'Receivership',
          definition: 'For a bank whose loans really are worthless — it is taken over rather than lent to',
        },
      ],
      explanation:
        'Three tools for three different situations, and using the wrong one makes a crisis worse. Lending to an insolvent bank throws public money after bad loans; taking over a bank that is merely short of cash destroys a viable business. Everything rests on telling which is which, quickly, from accounts the bank itself prepared — which video 22 already warned nobody can reliably do.',
    },
  ],
  keyTakeaways: [
    'The interest rate on deposits is a bank’s borrowing cost; insurance lowers it for careful and reckless banks alike.',
    'Equal borrowing costs reward the bank taking the most risk.',
    'Insurance maths needs independent events, and bank failures are correlated.',
  ],
});
