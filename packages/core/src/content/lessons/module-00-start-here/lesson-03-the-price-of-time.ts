import { defineLesson } from '../../schema';

/**
 * Interest, from scratch. The course refers to rates constantly from module 2
 * onward and never says plainly what one is.
 */
export const thePriceOfTimeLesson = defineLesson({
  id: 'the-price-of-time',
  title: 'What an Interest Rate Actually Is',
  subtitle:
    'A rate is a price — the price of having money now instead of later. Everything else about it follows from that.',
  icon: '⏱️',
  difficulty: 'intro',
  estimatedMinutes: 5,
  hearts: 5,
  challenges: [
    {
      id: 'mc-what-is-a-rate',
      type: 'multiple_choice',
      tags: ['basics', 'interest'],
      xp: 10,
      prompt: 'You borrow €1,000 for a year and repay €1,040. What did the €40 buy?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'use-of-money',
          label: 'A year of having the money now rather than later',
        },
        {
          id: 'bank-costs',
          label: 'The bank’s administrative costs',
          feedback:
            'Some of it covers costs, and that part barely changes when rates move. When a rate goes from 1% to 5%, the paperwork did not get five times harder.',
        },
        {
          id: 'inflation',
          label: 'Compensation for inflation only',
          feedback:
            'Inflation is one of the things a lender wants covering, and there is more: the risk you do not repay, and the simple fact that they cannot use the money meanwhile.',
        },
        {
          id: 'profit',
          label: 'Pure profit for the lender',
        },
      ],
      correctOptionId: 'use-of-money',
      explanation:
        'An interest rate is the price of time. Someone with money now hands it to someone who wants it now, and takes it back later — and the fee is for the waiting, the risk of not being repaid, and the buying power lost to rising prices in the meantime. Three separate things, all quoted as one number.',
    },
    {
      id: 'match-rate-parts',
      type: 'concept_match',
      tags: ['basics', 'interest'],
      xp: 20,
      prompt: 'A lender’s rate has parts. Match each to what it is paying for.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'waiting',
          term: 'Waiting',
          definition: 'They cannot use the money while you have it',
        },
        {
          id: 'risk',
          term: 'Risk',
          definition: 'You might not pay it back, and some borrowers do not',
        },
        {
          id: 'inflation',
          term: 'Inflation',
          definition: 'The euros coming back will buy less than the ones handed over',
        },
      ],
      explanation:
        'This is why two people borrowing the same amount on the same day are quoted different rates: the waiting is identical and the risk is not. It is also why rates rise across the whole economy when inflation is expected — every lender wants that third part covered, and none of them can be talked out of it.',
    },
    {
      id: 'mc-real-rate',
      type: 'multiple_choice',
      tags: ['basics', 'interest', 'inflation'],
      xp: 20,
      prompt:
        'Your savings pay 2% a year. Prices rise 3% a year. What happened to your savings?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'lost',
          label: 'They grew in euros and shrank in what they can buy — about 1% worse off',
        },
        {
          id: 'gained',
          label: 'They grew — 2% is more than nothing',
          feedback:
            'More euros, yes. But the point of saving is to buy something later, and everything you were going to buy went up 3%. Count in shopping, not in euros.',
        },
        {
          id: 'flat',
          label: 'Nothing changed',
        },
        {
          id: 'cannot-say',
          label: 'It depends on the bank',
        },
      ],
      correctOptionId: 'lost',
      explanation:
        'Economists call the 2% the nominal rate and the roughly −1% the real rate, and the second is the one that decides whether saving was worth doing. A saver can be paid interest every year and still be quietly getting poorer — which happened right across Europe for most of the 2010s, and is the reason a later module is about what inflation actually does to people.',
    },
    {
      id: 'mc-who-sets-it',
      type: 'multiple_choice',
      tags: ['basics', 'interest', 'central-banks'],
      xp: 15,
      prompt: 'Who decides what interest rates are?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'cb-one-rate',
          label: 'A central bank sets one very short rate, and every other rate is priced off it by markets',
        },
        {
          id: 'banks',
          label: 'Each bank decides its own, freely',
          feedback:
            'They set their own margins, and they all move together when the central bank moves — because none of them can lend far below what they could earn risk-free overnight.',
        },
        {
          id: 'government',
          label: 'The government sets them by law',
          feedback:
            'Governments have done this in the past and mostly stopped. In the euro area the ECB is deliberately independent of governments, which a later module is about.',
        },
        {
          id: 'market-only',
          label: 'Purely supply and demand, with nobody in charge',
        },
      ],
      correctOptionId: 'cb-one-rate',
      explanation:
        'The central bank sets one overnight rate — the price of money for a single night — and everything else is built outward from it: your mortgage, a company loan, a government bond for thirty years. It is a remarkably small lever for the size of what it moves, and how it works is the subject of the next lesson.',
    },
  ],
  keyTakeaways: [
    'An interest rate is the price of having money now instead of later.',
    'It pays for three things at once: waiting, the risk of not being repaid, and inflation.',
    'Interest minus inflation is the number that decides whether saving was worth it.',
    'A central bank sets one overnight rate, and every other rate is priced off it.',
  ],
});
