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
        'In the village, savers keep gold under their mattresses while entrepreneurs have projects nobody funds. What problem does a bank solve here?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'matching',
          label:
            'Savers and entrepreneurs cannot find each other, judge each project, or pool enough savings for something as big as a canal',
        },
        {
          id: 'storage',
          label: 'Savings need safekeeping, and a vault is safer than a mattress',
          feedback:
            'A vault is safer, and a bank does offer that. But gold kept safe in a vault is just as idle as gold under a mattress. The problem is that savings never reach the projects.',
        },
        {
          id: 'printing',
          label: 'The village has too little money for the projects it wants to build',
          feedback:
            'The village is not short of gold. The trouble is that the gold it has is sitting idle instead of funding anything. No new money is needed to fix that.',
        },
        {
          id: 'interest',
          label: 'Savers want interest, and only a bank is legally allowed to pay it',
          feedback:
            'Nothing stops a saver from lending and charging interest directly. Interest is how the bank attracts deposits, not the problem it solves. The hard part is finding a borrower, judging the project and gathering enough savings for it.',
        },
      ],
      correctOptionId: 'matching',
      explanation:
        'A bank is an intermediary: it pools many small savings, judges borrowers on the savers’ behalf, and spreads the risk across many loans. A single saver cannot do any of that alone — and, as the video points out, a saver who announces they have gold buried in the garden mostly attracts robbers.',
    },
    {
      id: 'mc-where-the-profit-comes-from',
      type: 'multiple_choice',
      tags: ['banking', 'spread'],
      xp: 20,
      prompt:
        'Sal’s bank holds 10 million of deposits. It keeps 1 million as cash and lends the other 9 million at 10% a year. It pays depositors 5% a year. Where does its profit come from?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'spread',
          label:
            'The spread: 900,000 of interest earned on loans, minus 500,000 paid to depositors, minus running costs',
        },
        {
          id: 'fees',
          label: 'Fees charged for safekeeping',
          feedback:
            'In this video the bank charges no fees — it pays depositors 5% to hold their money. Safekeeping is what attracts deposits, not what earns the profit.',
        },
        {
          id: 'reserves',
          label: 'Interest earned on the 1 million held as cash reserves',
          feedback:
            'Cash in the vault earns nothing. That is exactly why a bank keeps as little of it as it dares — a tension that runs through the rest of this module.',
        },
        {
          id: 'deposits',
          label: 'The deposits themselves, which belong to the bank once deposited',
          feedback:
            'Deposits are a liability, not income. The bank must repay all 10 million whenever depositors ask, which is the whole reason it keeps cash in reserve.',
        },
      ],
      correctOptionId: 'spread',
      explanation:
        'Lending 9 million at 10% brings in 900,000. Paying 5% on 10 million of deposits costs 500,000. That leaves 400,000, and about 100,000 goes on salaries and guards — roughly 300,000 a year before tax, on the 1 million Sal put in himself. The bank earns the gap between the interest it receives and the interest it pays. That gap is the spread.',
    },
    {
      id: 'match-frictions',
      type: 'concept_match',
      tags: ['intermediation', 'banking'],
      xp: 25,
      prompt: 'The video gives three reasons why savers and entrepreneurs cannot simply do business with each other. Match each reason to what it means in the village.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'judging',
          term: 'Judging a project',
          definition: 'A farmer cannot tell a canal that will pay off from one that will not — and would have to learn to judge every borrower who asked',
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
        'A bank solves all three at once. It is not just a vault with better walls: it is a specialist at judging borrowers, a pool big enough to fund what no single saver could, and a way to lend your money without telling the village you have any.',
    },
    {
      id: 'mc-cost-of-reserves',
      type: 'multiple_choice',
      tags: ['reserves', 'bank-profit'],
      xp: 25,
      prompt:
        'Sal keeps 1 million of the 10 million of deposits as cash and lends the other 9 million. He earns 10% a year on the loans and pays 5% a year on every deposit. Counting only money that actually leaves his pocket, what does that idle 1 million cost him each year?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'fifty', label: '50,000 — he pays depositors 5% on it and it earns nothing' },
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
            'That is the opportunity cost: income he gives up by not lending the cash. It matters, but no money leaves his pocket for it. What he actually pays out is 5% of 1 million.',
        },
        {
          id: 'fivehundred',
          label: '500,000 — the whole interest bill',
          feedback:
            'That is what he pays on all 10 million of deposits. The question is only about the 1 million he keeps as cash.',
        },
      ],
      correctOptionId: 'fifty',
      explanation:
        'Reserves are not free: they are borrowed money that earns nothing. On top of the 50,000 he pays, Sal also gives up the 100,000 he could have earned by lending that cash. This is the pressure that runs through all of banking: every coin held back for safety is paid for and not working, which is why a bank left to itself holds as little as it dares.',
    },
    {
      id: 'mc-ratio-to-profit',
      type: 'multiple_choice',
      tags: ['reserves', 'bank-profit', 'regulation'],
      xp: 30,
      prompt:
        'Until now Sal kept 10% of deposits as cash. The village regulator now requires 20%. Deposits stay at 10 million, rates stay at 10% on loans and 5% on deposits, and salaries and upkeep stay at 100,000. What happens to Sal’s profit before tax?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'twohundred', label: 'It falls from 300,000 to 200,000' },
        {
          id: 'unchanged',
          label: 'Nothing changes — he still has the same 10 million of deposits',
          feedback:
            'He pays interest on deposits; he earns it only on loans. He now lends 8 million instead of 9, so 100,000 of interest income disappears while the 500,000 interest bill does not move.',
        },
        {
          id: 'half',
          label: 'It halves, because the reserve requirement doubled from 10% to 20%',
          feedback:
            'The cash requirement doubled, but lending did not halve. Loans went from 9 million to 8 million — one ninth less, not half.',
        },
        {
          id: 'rises',
          label: 'It rises, because a safer bank attracts more depositors',
          feedback:
            'That might happen over the years, but this year’s arithmetic is fixed: less lent at 10%, the same paid at 5%.',
        },
      ],
      correctOptionId: 'twohundred',
      explanation:
        'Loans fall to 8 million, so interest income falls to 800,000 while the 500,000 paid to depositors does not change. The spread drops to 300,000, and the 100,000 of running costs takes profit to 200,000. A third of the profit is gone because a regulator changed one number — which is why reserve requirements were a real policy lever.',
    },
  ],
  keyTakeaways: [
    'A bank exists to connect idle savings with projects that cannot otherwise be funded.',
    'Its profit is the spread between the interest it earns and the interest it pays.',
    'Deposits are liabilities. The bank owes every one of them back.',
  ],
});
