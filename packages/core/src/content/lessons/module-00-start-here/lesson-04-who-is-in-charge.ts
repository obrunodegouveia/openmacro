import { defineLesson } from '../../schema';

/**
 * What a central bank is, in plain terms. Module 3 opens on quantitative
 * easing and rate corridors; nothing before it says what the institution is
 * for.
 */
export const whoIsInChargeLesson = defineLesson({
  id: 'who-is-in-charge-of-money',
  title: 'Who Is Actually in Charge of Money',
  subtitle:
    'Less than you would think, and not who you would guess. Nobody decides how much money exists.',
  icon: '🏛️',
  difficulty: 'intro',
  estimatedMinutes: 6,
  hearts: 5,
  challenges: [
    {
      id: 'mc-who-creates',
      type: 'multiple_choice',
      tags: ['basics', 'money-creation'],
      xp: 15,
      prompt: 'Most of the money in the euro area was created by whom?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'banks-lending',
          label: 'Ordinary commercial banks, when they made loans',
        },
        {
          id: 'ecb',
          label: 'The European Central Bank, by printing it',
          feedback:
            'The ECB issues the notes, and notes are a small share of the money in use. Most of what you spend is a bank deposit, and those come from somewhere else.',
        },
        {
          id: 'government',
          label: 'Governments, by spending',
        },
        {
          id: 'mint',
          label: 'The mint, by making coins',
          feedback:
            'Coins are a rounding error — a fraction of one per cent of the money in the euro area.',
        },
      ],
      correctOptionId: 'banks-lending',
      explanation:
        'When a bank grants a mortgage it does not hand over someone else’s savings. It writes a loan on one side of its accounts and a deposit on the other, and the deposit is new money that did not exist that morning. Most of the money in Europe was created exactly that way — by banks, one loan at a time, in pursuit of profit rather than as anybody’s plan.',
    },
    {
      id: 'flow-what-cb-does',
      type: 'order_flow',
      tags: ['basics', 'central-banks'],
      xp: 20,
      prompt: 'How does a central bank influence something it does not control?',
      instructions: 'Earliest first',
      events: [
        {
          id: 'sets-rate',
          label: 'It sets the overnight rate — the price of money for one night',
          detail: 'The one number it decides directly',
        },
        {
          id: 'banks-follow',
          label: 'Banks reprice everything they lend',
          detail: 'None of them will lend far below what they can earn risk-free',
        },
        {
          id: 'borrowing-changes',
          label: 'Borrowing becomes more or less attractive to households and firms',
          detail: 'A mortgage at 2% and one at 5% are different decisions',
        },
        {
          id: 'lending-changes',
          label: 'Fewer or more loans are made',
          detail: 'And each loan is new money, or its absence',
        },
        {
          id: 'prices',
          label: 'Spending, and eventually prices, respond — a year or two later',
          detail: 'Slowly, indirectly, and never quite as intended',
        },
      ],
      correctOrder: ['sets-rate', 'banks-follow', 'borrowing-changes', 'lending-changes', 'prices'],
      explanation:
        'Notice how indirect that is. A central bank cannot make anyone borrow and cannot stop a bank lending. It sets one price and waits, and the effect arrives through millions of private decisions over a year or more. That gap between the lever and the outcome is most of what makes monetary policy difficult, and most of what the rest of this course is about.',
    },
    {
      id: 'match-who-does-what',
      type: 'concept_match',
      tags: ['basics', 'institutions'],
      xp: 20,
      prompt: 'Match each institution to what it actually does.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'ecb',
          term: 'The central bank',
          definition:
            'Sets the overnight rate, issues the notes, and is banker to the banks',
        },
        {
          id: 'banks',
          term: 'Commercial banks',
          definition: 'Create most of the money, by lending it into existence',
        },
        {
          id: 'gov',
          term: 'The government',
          definition:
            'Taxes, spends and borrows — and in the euro area does not set the interest rate',
        },
        {
          id: 'you',
          term: 'Borrowers and savers',
          definition:
            'Decide whether any of it happens, by taking loans or not taking them',
        },
      ],
      explanation:
        'Read the last row again, because it is the one people leave out. If nobody wants to borrow, a central bank can cut rates to zero and very little happens — which is roughly what Europe spent the 2010s discovering. The system has no single controller; it has a price-setter, a set of money-creators, and millions of people deciding whether to take part.',
    },
    {
      id: 'mc-independent',
      type: 'multiple_choice',
      tags: ['basics', 'central-banks', 'politics'],
      xp: 15,
      prompt:
        'The ECB is deliberately independent of governments. Why would anyone design it that way?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'temptation',
          label: 'Because a government that controls the money supply is tempted to use it, and inflation is a tax nobody has to vote for',
        },
        {
          id: 'expertise',
          label: 'Because central bankers know more about economics',
          feedback:
            'Finance ministries employ economists too. The reason for independence is about incentives rather than knowledge.',
        },
        {
          id: 'eu',
          label: 'Because the euro has many governments and no single one could be trusted with it',
        },
        {
          id: 'tradition',
          label: 'Historical accident',
        },
      ],
      correctOptionId: 'temptation',
      explanation:
        'A government short of money can raise taxes, which requires a vote and makes people angry, or it can create money, which requires nothing and shows up later as prices rising. The second is easier and every generation rediscovers it. Independence is a device for taking that option away from whoever is in power — and a later module is about the times it has been taken back.',
    },
  ],
  keyTakeaways: [
    'Most euro area money was created by commercial banks making loans, not by the ECB.',
    'A central bank sets one overnight rate and everything else responds indirectly, over a year or more.',
    'It cannot make anyone borrow — if nobody wants a loan, cutting rates does very little.',
    'Independence exists because creating money is the one tax a government need not vote for.',
  ],
});
