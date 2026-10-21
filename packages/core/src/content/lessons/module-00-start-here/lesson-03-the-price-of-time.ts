import { defineLesson } from '../../schema';

/**
 * Interest, from scratch. The course refers to rates constantly from module 2
 * onward and never says plainly what one is.
 */
export const thePriceOfTimeLesson = defineLesson({
  id: 'the-price-of-time',
  title: 'What an Interest Rate Actually Is',
  subtitle:
    'A rate is a price: the price of having money now instead of later.',
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
            'A small part covers costs, but that part hardly changes when rates move. When a rate goes from 1% to 5%, the paperwork does not get five times harder.',
        },
        {
          id: 'inflation',
          label: 'Compensation for inflation only',
          feedback:
            'Inflation is one part, but there is more: the risk that you do not pay back, and the fact that the lender cannot use the money while you have it.',
        },
        {
          id: 'profit',
          label: 'Pure profit for the lender',
        },
      ],
      correctOptionId: 'use-of-money',
      explanation:
        'An interest rate is the price of time. Someone with money gives it to someone who wants it now, and gets it back later. The fee pays for three things: the waiting, the risk of not being paid back, and the buying power lost as prices rise. All three are shown as one number.',
    },
    {
      id: 'match-rate-parts',
      type: 'concept_match',
      tags: ['basics', 'interest'],
      xp: 20,
      prompt: 'A lender’s rate has three parts. Match each part to what it pays for.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'waiting',
          term: 'Waiting',
          definition: 'The lender cannot use the money while you have it',
        },
        {
          id: 'risk',
          term: 'Risk',
          definition: 'You might not pay it back, and some borrowers do not',
        },
        {
          id: 'inflation',
          term: 'Inflation',
          definition: 'The euros paid back will buy less than the euros lent',
        },
      ],
      explanation:
        'This is why two people who borrow the same amount on the same day can get different rates. The waiting is the same, but the risk is not. It is also why all rates rise when people expect inflation: every lender wants to be paid for that third part.',
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
          label: 'They grew in euros but shrank in what they can buy: about 1% worse off',
        },
        {
          id: 'gained',
          label: 'They grew, because 2% is more than nothing',
          feedback:
            'You have more euros, yes. But you save so you can buy things later, and those things now cost 3% more. Count in what you can buy, not in euros.',
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
        'Economists call the 2% the nominal rate and the −1% the real rate (interest minus inflation). The real rate tells you if saving was worth it. You can earn interest every year and still slowly get poorer. That happened across Europe for most of the 2010s.',
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
          label: 'A central bank sets one very short-term rate, and markets set every other rate based on it',
        },
        {
          id: 'banks',
          label: 'Each bank decides its own, freely',
          feedback:
            'Banks add their own margins, but they all move together when the central bank moves. None of them can lend far below what they could earn safely overnight.',
        },
        {
          id: 'government',
          label: 'The government sets them by law',
          feedback:
            'Governments did this in the past and mostly stopped. In the euro area the ECB is independent from governments on purpose. A later module covers this.',
        },
        {
          id: 'market-only',
          label: 'Purely supply and demand, with nobody in charge',
        },
      ],
      correctOptionId: 'cb-one-rate',
      explanation:
        'The central bank sets one overnight rate: the price of money for a single night. Every other rate is built from it: your mortgage, a company loan, a 30-year government bond. It is a small lever that moves a very big system. The next lesson shows how.',
    },
  ],
  keyTakeaways: [
    'An interest rate is the price of having money now instead of later.',
    'It pays for three things at once: waiting, the risk of not being repaid, and inflation.',
    'Interest minus inflation (the real rate) tells you if saving was worth it.',
    'A central bank sets one overnight rate, and every other rate is based on it.',
  ],
});
