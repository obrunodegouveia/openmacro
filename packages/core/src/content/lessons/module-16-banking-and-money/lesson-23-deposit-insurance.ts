import { defineLesson } from '../../schema';

/** Video 23. Deposit insurance solves the run and creates a subsidy — and correlated failures break the insurance model. */
export const kabDepositInsuranceLesson = defineLesson({
  id: 'kab-deposit-insurance',
  title: 'The Fix That Creates the Next Problem',
  subtitle:
    'Insure the deposits and the bank runs stop. But now every bank borrows at the same price, whatever it does with the money.',
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
        'Deposit insurance means the government pays you back if your bank fails. It does stop bank runs. Which side effect does the video think is more serious?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'indifference',
          label: 'Depositors stop caring what the bank does with their money and just pick the highest rate',
        },
        {
          id: 'cost',
          label: 'The insurance is expensive, and depositors end up paying for it',
          feedback:
            'It is the opposite. It costs a tiny part of a percent a year, much less than the extra interest a bank would pay without it. Being so cheap is the problem.',
        },
        {
          id: 'slow',
          label: 'Depositors must wait a long time to get their money back',
          feedback:
            'The video does not worry about speed. It worries about how insurance changes behaviour before any bank fails.',
        },
        {
          id: 'coverage',
          label: 'The insurance only covers some deposits, not all of them',
          feedback:
            'There are limits, but that is not the argument. The argument is that insurance makes all banks look the same to a depositor.',
        },
      ],
      correctOptionId: 'indifference',
      explanation:
        'A deposit is a loan to the bank, so the interest on deposits is the bank’s cost of borrowing. Insurance lets a reckless bank borrow at almost the same price as a careful one. The video says insurance costs about 0.1% a year, while depositors would otherwise ask a risky bank for 3–4% more. That gap is a gift, and the bank taking the most risk gets the biggest one.',
    },
    {
      id: 'mc-correlated',
      type: 'multiple_choice',
      tags: ['insurance', 'correlation'],
      xp: 30,
      prompt:
        'Car insurance works by sharing the cost across a million drivers. Why does the same maths not work for deposit insurance?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'correlated',
          label: 'Banks tend to fail together, so all the claims come at the same time',
        },
        {
          id: 'rare',
          label: 'Bank failures are too rare to put a price on',
          feedback:
            'Rare events can be insured if they happen separately. The problem is failures coming together, not being rare.',
        },
        {
          id: 'large',
          label: 'One failure is too big for any insurance payment to cover',
          feedback:
            'A big cost can be covered by charging enough. What cannot be covered is every claim arriving in the same few months.',
        },
        {
          id: 'political',
          label: 'The government would save the banks anyway',
          feedback:
            'True, and the video says so, but that is the result, not the cause. The insurance maths breaks first.',
        },
      ],
      correctOptionId: 'correlated',
      explanation:
        'One driver crashing does not make another driver crash. But one bank failing does make other banks more likely to fail, because banks are linked and people lose trust in all of them. So the insurer collects payments calmly for years, then faces every claim at once. That is why the video expects the US deposit insurer (the FDIC) to need the government, and so the taxpayer, behind it.',
    },
    {
      id: 'mc-deposit-rate-is-borrowing-cost',
      type: 'multiple_choice',
      tags: ['deposit-insurance', 'subsidy'],
      xp: 35,
      prompt:
        'A bank pays about 0.1% a year to the FDIC for deposit insurance. Sal says it saves much more than that. Where does the bank save, and who carries the risk in the end?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'borrowingcost',
          label: 'In the low rate it pays depositors, while the government — so the taxpayer — backs the insurance',
        },
        {
          id: 'fees',
          label: 'In lower fees for its customers, which the FDIC pays for',
          feedback:
            'The saving is real, but the bank keeps it. And banks pay the FDIC’s charges — until the fund runs short.',
        },
        {
          id: 'nothing',
          label: 'It saves nothing; the insurance payment is the whole cost',
          feedback:
            'Then the insurance would be useless to the bank. What it buys is the chance to borrow from depositors at a rate that ignores how the bank lends.',
        },
        {
          id: 'shareholders',
          label: 'In a higher share price, paid for by other banks’ insurance payments',
          feedback:
            'Shareholders do get much of the saving, and banks do pay the insurance. But Sal’s point is that the payments are too low for the risk, and the government stands behind the fund.',
        },
      ],
      correctOptionId: 'borrowingcost',
      explanation:
        'Your deposit is a loan to the bank, so the rate it pays you is its cost of borrowing. Without insurance, a bank making risky loans would have to pay you 3 or 4% more. With insurance, it pays the FDIC about 0.1% instead. The more reckless the bank, the bigger this gift. If the fund runs out, the government stands behind it. (In 2009 the US fund did go below zero. It was rebuilt by charging banks more in advance, without using taxpayer money.)',
    },
    {
      id: 'mc-why-not-price-risk',
      type: 'multiple_choice',
      tags: ['deposit-insurance', 'risk'],
      xp: 35,
      prompt:
        'The obvious fix is to make risky banks pay more for insurance. Sal says that is harder than it sounds. Why?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'hidden',
          label: 'In good years the risk cannot be seen — it looks like good management',
        },
        {
          id: 'political',
          label: 'Banks would fight against paying more',
          feedback:
            'They would, and they have. But Sal’s point is about knowledge, not politics. Even a perfect regulator would find it hard to see the risk in time.',
        },
        {
          id: 'illegal',
          label: 'The FDIC is not allowed to charge banks different amounts',
          feedback:
            'It does charge by risk, and has since the 1990s. It still charged too little for the risk before 2008.',
        },
        {
          id: 'small',
          label: 'The difference in price would be too small to matter',
          feedback:
            'It would have to be huge to match the real risk. That is the problem: you cannot price something you can only measure afterwards.',
        },
      ],
      correctOptionId: 'hidden',
      explanation:
        'The risk in a bank’s loans is about the future. You only see it when the future turns out badly. Until then, the bank with the most risk shows the best results. So a price based on visible results charges that bank the least. It is the same problem as in video 22, seen from the insurer’s side.',
    },
    {
      id: 'match-two-fixes',
      type: 'concept_match',
      tags: ['deposit-insurance', 'lender-of-last-resort'],
      xp: 30,
      prompt: 'Match each tool to the situation it is for.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'lolr',
          term: 'Lender of last resort',
          definition: 'For a healthy bank that has just run out of cash — it lends against collateral and is paid back',
        },
        {
          id: 'fdic',
          term: 'Deposit insurance',
          definition: 'Takes away the depositor’s reason to run at all, so no queue forms',
        },
        {
          id: 'receivership',
          term: 'Receivership',
          definition: 'For a bank whose loans really are worthless — it is taken over, not lent to',
        },
      ],
      explanation:
        'There are three tools for three situations, and using the wrong one makes a crisis worse. Lending to a broke bank wastes public money. Taking over a bank that is only short of cash destroys a good business. Everything depends on telling them apart quickly, using accounts the bank made itself. Video 22 already warned that nobody can do this well.',
    },
  ],
  keyTakeaways: [
    'The interest a bank pays on deposits is its cost of borrowing; insurance lowers it for careful and reckless banks alike.',
    'When every bank borrows at the same price, the bank taking the most risk gains the most.',
    'Insurance maths needs events that happen separately, but banks tend to fail together.',
  ],
});
