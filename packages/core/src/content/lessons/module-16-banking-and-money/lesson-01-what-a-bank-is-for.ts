import { defineLesson } from '../../schema';

/**
 * Video 1. The premise the whole playlist is built on: savings sitting idle
 * and projects with no capital, and a bank as the thing that introduces them.
 */
export const kabWhatABankIsForLesson = defineLesson({
  id: 'kab-what-a-bank-is-for',
  title: 'Why Anyone Invented a Bank',
  subtitle:
    'Savings buried in a mattress and an irrigation ditch nobody can fund. A bank is what stands between them.',
  icon: '🏛️',
  difficulty: 'intro',
  estimatedMinutes: 16,
  video: {
    url: 'https://www.youtube.com/watch?v=E-HOz8T6tAo',
    minutes: 12,
    source: 'Khan Academy — Banking 1',
  },
  challenges: [
    {
      id: 'mc-what-problem',
      type: 'multiple_choice',
      tags: ['banking', 'intermediation'],
      xp: 15,
      prompt:
        'In the village, savers have gold under their mattresses and entrepreneurs have projects with no funding. What is the problem a bank actually solves?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'matching',
          label:
            'Savers cannot evaluate projects, entrepreneurs cannot find savers, and no single saver is large enough to fund a big project',
        },
        {
          id: 'storage',
          label: 'Gold rusts, so it needs professional storage',
          feedback:
            'Gold famously does not corrode — that is part of why it was chosen. Safekeeping is a service the bank sells, but it is not the problem that made a bank worth inventing.',
        },
        {
          id: 'printing',
          label: 'Somebody has to print the money',
          feedback:
            'No printing happens in this video. The village already has its 1,000 gold pieces; the trouble is that they are doing nothing.',
        },
        {
          id: 'interest',
          label: 'Savers want interest, and only a bank is legally allowed to pay it',
          feedback:
            'Interest is how the bank attracts deposits, not the underlying problem. A saver could in principle lend directly — the difficulty is finding, judging and pooling with enough other savers to fund a canal.',
        },
      ],
      correctOptionId: 'matching',
      explanation:
        'A bank is an intermediary: it aggregates many small savings, evaluates borrowers on the savers’ behalf, and spreads the risk across many loans. Every part of that is something an individual saver cannot do alone — and, as the video points out, a saver advertising that they have gold buried in the garden mostly attracts robbers.',
    },
    {
      id: 'mc-where-the-profit-comes-from',
      type: 'multiple_choice',
      tags: ['banking', 'spread'],
      xp: 20,
      prompt:
        'The bank holds 10 million in deposits, keeps 1 million as cash and lends 9 million at 10%, while paying depositors 5%. Where does its profit come from?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'spread',
          label:
            'The spread: 900,000 of interest earned, less 500,000 paid to depositors, less running costs',
        },
        {
          id: 'fees',
          label: 'Fees charged for safekeeping',
          feedback:
            'The bank pays depositors for the privilege of holding their money rather than charging them. The safekeeping is the bait, not the business.',
        },
        {
          id: 'reserves',
          label: 'Interest earned on the 1 million held as cash reserves',
          feedback:
            'Idle reserves earn nothing. That is exactly why a bank keeps as little of them as it dares — a tension that runs through the rest of this module.',
        },
        {
          id: 'deposits',
          label: 'The deposits themselves, which belong to the bank once deposited',
          feedback:
            'Deposits are a liability, not income. The bank owes every one of those 10 million back on demand, which is the whole reason reserves exist.',
        },
      ],
      correctOptionId: 'spread',
      explanation:
        'Lending 9 million at 10% brings in 900,000. Paying 5% on 10 million of deposits costs 500,000. That leaves 400,000, and about 100,000 goes on salaries and guards — roughly 300,000 a year on a 1 million investment. The bank earns the gap between what money costs it and what money earns it, which is the definition of a spread.',
    },
  ],
  keyTakeaways: [
    'A bank exists to connect idle savings with projects that cannot otherwise be funded.',
    'Its profit is the spread between the interest it earns and the interest it pays.',
    'Deposits are liabilities. The bank owes every one of them back.',
  ],
});
