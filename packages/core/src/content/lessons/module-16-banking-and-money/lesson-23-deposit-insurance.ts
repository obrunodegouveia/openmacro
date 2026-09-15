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
            'Depositors stop caring how a bank invests and chase the highest rate',
        },
        {
          id: 'cost',
          label: 'The premiums are expensive, and the cost reaches depositors',
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
            'Bank failures are correlated, so the claims all arrive at once',
        },
        {
          id: 'rare',
          label: 'Because bank failures are too rare to price',
          feedback:
            'Rare events are insurable if they are independent. Correlation, not rarity, is what breaks the model.',
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
            'True and mentioned, but it is the consequence rather than the cause. The actuarial failure comes first.',
        },
      ],
      correctOptionId: 'correlated',
      explanation:
        'One driver crashing does not make another crash. One bank failing genuinely does make others more likely to fail, because the system is interlinked and confidence is shared. So the insurer collects premiums calmly for years and then faces every claim at once — which is why the video predicts the FDIC going back to Congress, with taxpayers behind it.',
    },
    {
      id: 'mc-deposit-rate-is-borrowing-cost',
      type: 'multiple_choice',
      tags: ['deposit-insurance', 'subsidy'],
      xp: 35,
      prompt:
        'A bank pays perhaps 0.1% a year for FDIC cover. Sal says it saves far more than that. Where does the saving show up, and who ultimately pays it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'borrowingcost',
          label: 'In the deposit rate — which is the bank’s borrowing cost — and the taxpayer pays',
        },
        {
          id: 'fees',
          label: 'In lower fees for customers, paid for by the FDIC',
          feedback:
            'The saving is real but it is captured by the bank, not handed on. And the FDIC’s premiums are paid by banks, not by anyone else — until they run out.',
        },
        {
          id: 'nothing',
          label: 'There is no saving; the premium is the whole cost',
          feedback:
            'Then the insurance would be pointless. Its entire function is to let the bank borrow from depositors at a rate that ignores how it lends.',
        },
        {
          id: 'shareholders',
          label: 'In the share price, paid for by other banks’ premiums',
          feedback:
            'Shareholders do capture it, and premiums do come from banks — but Sal’s point is that the premiums were too low, which is why the FDIC has had to go back to Congress.',
        },
      ],
      correctOptionId: 'borrowingcost',
      explanation:
        'Your deposit is a loan to the bank, so the rate it pays you is its cost of funds. Uninsured, a bank making risky loans would have to pay 3 or 4% to persuade you; insured, it pays a fraction of that and hands the FDIC 0.1%. The gap is a subsidy, its size grows with how recklessly the bank lends, and when the premiums prove insufficient — as Sal correctly predicted they would — Congress covers the difference.',
    },
    {
      id: 'mc-why-not-price-risk',
      type: 'multiple_choice',
      tags: ['deposit-insurance', 'risk'],
      xp: 35,
      prompt:
        'The obvious fix is to charge risky banks a higher premium. Sal says it is easier said than done. Why?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'hidden',
          label: 'In good years the risk is invisible — it reads as good management',
        },
        {
          id: 'political',
          label: 'Banks would lobby against being charged more',
          feedback:
            'They would and they have. But Sal’s argument is about knowledge rather than politics: even a regulator nobody could influence would struggle to see the risk in time.',
        },
        {
          id: 'illegal',
          label: 'The FDIC is not permitted to vary its premiums',
          feedback:
            'It does vary them, on a risk-based schedule, and has since the 1990s. It still underpriced the risk before 2008.',
        },
        {
          id: 'small',
          label: 'The difference in premium would be too small to matter',
          feedback:
            'It would have to be enormous to match the risk actually taken, which is rather the problem — you cannot set a price for something you cannot measure until afterwards.',
        },
      ],
      correctOptionId: 'hidden',
      explanation:
        'Risk in a loan book is a statement about the future, and it only becomes visible when the future arrives badly. Until then the bank carrying the most of it is posting the best numbers, and any premium set on observable performance will charge it the least — the insurer is priced off exactly the signal that is inverted. This is the same information problem as video 22, wearing an actuary’s hat.',
    },
    {
      id: 'match-two-fixes',
      type: 'concept_match',
      tags: ['deposit-insurance', 'lender-of-last-resort'],
      xp: 30,
      prompt: 'Two fixes and one outcome for a bank beyond saving. Match each to what it actually addresses.',
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
        'Three tools for three different conditions, and using the wrong one is how a crisis gets worse. Lending to an insolvent bank throws public money after bad loans; taking a merely illiquid bank into receivership destroys a viable business. Everything then rests on telling which is which, at speed, from books the bank itself compiled — which video 22 has already warned is the thing nobody can reliably do.',
    },
  ],
  keyTakeaways: [
    'A deposit rate is a bank’s borrowing cost; insurance lowers it for everyone equally.',
    'Equal borrowing costs reward the bank taking the most risk.',
    'Insurance maths needs independent events, and bank failures are correlated.',
  ],
});
