import { defineLesson } from '../../schema';

/**
 * What a central bank is, in plain terms. Module 3 opens on quantitative
 * easing and rate corridors; nothing before it says what the institution is
 * for.
 */
export const whoIsInChargeLesson = defineLesson({
  id: 'who-is-in-charge-of-money',
  title: 'Who Is Really in Charge of Money',
  subtitle:
    'Less than you think, and not who you would guess. Nobody decides how much money exists.',
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
      prompt: 'Who created most of the money in the euro area?',
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
            'The ECB issues the notes, but notes are a small part of the money people use. Most of what you spend is bank deposits, and those come from somewhere else.',
        },
        {
          id: 'government',
          label: 'Governments, by spending',
        },
        {
          id: 'mint',
          label: 'The mint, by making coins',
          feedback:
            'Coins are tiny: less than one per cent of the money in the euro area.',
        },
      ],
      correctOptionId: 'banks-lending',
      explanation:
        'When a bank gives a mortgage, it does not hand over someone else’s savings. It writes a loan on one list and a deposit on the other. That deposit is new money that did not exist that morning. Most money in Europe was created this way: by banks, one loan at a time, to make a profit, not as part of anyone’s plan.',
    },
    {
      id: 'flow-what-cb-does',
      type: 'order_flow',
      tags: ['basics', 'central-banks'],
      xp: 20,
      prompt: 'A central bank does not control how much people borrow. How does it still affect it? Put the steps in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'sets-rate',
          label: 'It sets the overnight rate: the price of money for one night',
          detail: 'The one number it decides directly',
        },
        {
          id: 'banks-follow',
          label: 'Banks change the rates on everything they lend',
          detail: 'None of them will lend far below what they can earn with no risk',
        },
        {
          id: 'borrowing-changes',
          label: 'Borrowing becomes more or less attractive for families and companies',
          detail: 'A mortgage at 2% and one at 5% are different decisions',
        },
        {
          id: 'lending-changes',
          label: 'Fewer or more loans are made',
          detail: 'Each new loan is new money, so fewer loans means less new money',
        },
        {
          id: 'prices',
          label: 'Spending, and later prices, change one or two years later',
          detail: 'Slowly, indirectly, and never exactly as planned',
        },
      ],
      correctOrder: ['sets-rate', 'banks-follow', 'borrowing-changes', 'lending-changes', 'prices'],
      explanation:
        'See how indirect this is. A central bank cannot make anyone borrow, and it cannot stop a bank from lending. It sets one price and waits. The effect comes through millions of private decisions over a year or more. That delay is a big part of why monetary policy is hard.',
    },
    {
      id: 'match-who-does-what',
      type: 'concept_match',
      tags: ['basics', 'institutions'],
      xp: 20,
      prompt: 'Match each one to what it really does.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'ecb',
          term: 'The central bank',
          definition:
            'Sets the overnight rate, issues the notes, and is the bank for the banks',
        },
        {
          id: 'banks',
          term: 'Commercial banks',
          definition: 'Create most of the money, by making loans',
        },
        {
          id: 'gov',
          term: 'The government',
          definition:
            'Taxes, spends and borrows, but in the euro area does not set the interest rate',
        },
        {
          id: 'you',
          term: 'Borrowers and savers',
          definition:
            'Decide if any of it happens, by taking loans or not',
        },
      ],
      explanation:
        'Look at the last one again, because people often forget it. If nobody wants to borrow, a central bank can cut rates to zero and very little happens. Europe learned this in the 2010s. Nobody controls the whole system: there is one price-setter, many banks that create money, and millions of people who decide whether to borrow.',
    },
    {
      id: 'mc-independent',
      type: 'multiple_choice',
      tags: ['basics', 'central-banks', 'politics'],
      xp: 15,
      prompt:
        'The ECB is independent from governments on purpose. Why was it designed this way?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'temptation',
          label: 'A government that controls money is tempted to create more, and inflation is a tax nobody votes for',
        },
        {
          id: 'expertise',
          label: 'Because central bankers know more about economics',
          feedback:
            'Finance ministries have economists too. The reason is about temptation, not knowledge.',
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
        'A government that needs money can raise taxes, which needs a vote and makes people angry. Or it can create money, which needs nothing and shows up later as rising prices. The second way is easier. Independence takes that option away from whoever is in power. A later module looks at times when governments took it back.',
    },
  ],
  keyTakeaways: [
    'Most euro area money was created by commercial banks making loans, not by the ECB.',
    'A central bank sets one overnight rate. Everything else reacts indirectly, over a year or more.',
    'It cannot make anyone borrow. If nobody wants a loan, cutting rates does very little.',
    'Central banks are independent because creating money is a tax that needs no vote.',
  ],
});
