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
            'Nobody can find, judge or pool with enough counterparties to fund a canal',
        },
        {
          id: 'storage',
          label: 'Savings need safekeeping, and a vault is safer than a mattress',
          feedback:
            'Gold famously does not corrode — that is part of why it was chosen. Safekeeping is a service the bank sells, but it is not the problem that made a bank worth inventing.',
        },
        {
          id: 'printing',
          label: 'The village has too little money for the projects it wants to build',
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
    {
      id: 'match-frictions',
      type: 'concept_match',
      tags: ['intermediation', 'banking'],
      xp: 25,
      prompt: 'The video names three separate reasons the savers and the entrepreneurs cannot simply find each other. Match each to what it costs them.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'judging',
          term: 'Judging a project',
          definition: 'A farmer cannot tell a canal that will pay from one that will not — and would have to learn that skill for every borrower who asked',
        },
        {
          id: 'size',
          term: 'Size of the project',
          definition: 'A canal needs the savings of a thousand people at once, and no one of them has enough alone',
        },
        {
          id: 'secrecy',
          term: 'Admitting you have savings',
          definition: 'Advertising a hoard invites robbery, so the people with money to lend are the last to say so',
        },
      ],
      explanation:
        'All three are information problems, and that is the whole business. A bank is not a vault with better walls — it is a specialist at assessing borrowers, a pool deep enough to fund things no single saver could, and a place where lending your money does not require telling the village you have any.',
    },
    {
      id: 'mc-cost-of-reserves',
      type: 'multiple_choice',
      tags: ['reserves', 'bank-profit'],
      xp: 25,
      prompt:
        'Sal keeps 1 million of the 10 million in cash and lends the other 9 million. He earns 10% on the loans and pays 5% on deposits. What does the cash in the vault cost him each year?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'fifty', label: '50,000 — he pays 5% on it and earns nothing on it' },
        {
          id: 'nothing',
          label: 'Nothing. It is sitting there doing no harm',
          feedback:
            'It is not his money. Every gold piece in that vault is a deposit he is paying 5% a year to keep, whether he lends it or not.',
        },
        {
          id: 'hundred',
          label: '100,000 — the 10% he could have earned by lending it',
          feedback:
            'That is the forgone income, not the cost. Ask what actually leaves his pocket: 5% of a million. The 10% was never his to begin with.',
        },
        {
          id: 'fivehundred',
          label: '500,000 — the whole interest bill',
          feedback:
            'That is what he pays on all 10 million of deposits. The question is only about the million he chose not to lend.',
        },
      ],
      correctOptionId: 'fifty',
      explanation:
        'Reserves are not free storage — they are borrowed money earning nothing. This is the pressure that runs through the whole of banking: every gold piece held back for safety is a gold piece being paid for and not working, which is exactly why a bank left to itself holds as few as it dares.',
    },
    {
      id: 'mc-ratio-to-profit',
      type: 'multiple_choice',
      tags: ['reserves', 'bank-profit', 'regulation'],
      xp: 30,
      prompt:
        'The village regulator doubles the reserve requirement to 20%. Deposits stay at 10 million, the rates stay at 10% and 5%, and salaries and upkeep stay at 100,000. What happens to Sal’s profit?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'twohundred', label: 'It falls from 300,000 to 200,000' },
        {
          id: 'unchanged',
          label: 'Nothing changes — he still has the same 10 million of deposits',
          feedback:
            'Deposits are what he pays for, not what he earns on. He now lends 8 million instead of 9, so 100,000 of interest income simply disappears while the 500,000 interest bill does not move.',
        },
        {
          id: 'half',
          label: 'It halves, because the reserve requirement doubled',
          feedback:
            'The ratio doubled; the loan book did not halve. It went from 9 million to 8 million — a ninth less lending, not half.',
        },
        {
          id: 'rises',
          label: 'It rises, because a safer bank attracts more depositors',
          feedback:
            'That may be true over years, but the arithmetic of this year is fixed: less lent at 10%, the same paid at 5%.',
        },
      ],
      correctOptionId: 'twohundred',
      explanation:
        'Loans fall to 8 million, so interest income falls to 800,000 while the 500,000 owed to depositors is untouched. The spread drops to 300,000 and the 100,000 of running costs takes it to 200,000. A third of the profit, gone, from one number moved by a regulator — which is why reserve requirements were a real policy lever and why banks lobbied hard over them.',
    },
  ],
  keyTakeaways: [
    'A bank exists to connect idle savings with projects that cannot otherwise be funded.',
    'Its profit is the spread between the interest it earns and the interest it pays.',
    'Deposits are liabilities. The bank owes every one of them back.',
  ],
});
