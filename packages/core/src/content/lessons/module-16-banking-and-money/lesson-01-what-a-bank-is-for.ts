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
  estimatedMinutes: 18,
  video: {
    url: 'https://www.youtube.com/watch?v=E-HOz8T6tAo',
    minutes: 12,
    source: 'Khan Academy — Banking 1',
  },
  challenges: [
    // ---- Olivia warm-ups --------------------------------------------------
    // Sal draws a bank's balance sheet in this video. These four ask the same
    // three questions — what you own, what you owe, what is truly yours — about
    // a 12-year-old with a guitar, before the challenges below ask them about
    // a bank. Olivia and Breno are fictional, and her numbers carry on into
    // lesson 2.
    {
      id: 'olivia-what-is-an-asset',
      type: 'multiple_choice',
      xp: 10,
      tags: ['basics', 'assets'],
      prompt:
        'An asset is something you own that is worth money. Olivia is 12, writes songs on her guitar and dreams of her first gig. Which of these is one of her assets?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'tshirts', label: 'The T-shirts she printed and has not sold yet' },
        {
          id: 'tune',
          label: 'The new tune stuck in her head',
          feedback:
            'It might become a great song one day. But today nobody can buy a tune she is still humming, so it is not worth money yet.',
        },
        {
          id: 'compliment',
          label: 'Her music teacher saying she sang brilliantly',
          feedback:
            'A compliment feels great, but she cannot sell it or spend it. An asset has to be worth money.',
        },
        {
          id: 'ticket',
          label: 'The €10 she spent on a cinema ticket last week',
          feedback:
            'That money is gone and the film is over. There is nothing left for her to own.',
        },
      ],
      correctOptionId: 'tshirts',
      explanation:
        'An asset does not have to be cash. Her unsold T-shirts are worth money because she can sell them at the talent show — just as Sal’s bank counts its building and its loans as assets, not only its gold.',
    },
    {
      id: 'olivia-iou',
      type: 'multiple_choice',
      xp: 10,
      tags: ['basics', 'assets', 'liabilities'],
      prompt:
        'Olivia’s friend borrows €5 for the bus and promises to pay it back on Friday. For Olivia, what is that promise?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'asset', label: 'An asset — money she is owed' },
        {
          id: 'liability',
          label: 'A liability — money she owes',
          feedback:
            'Olivia does not owe anybody here. Her friend does. The €5 is her friend’s liability.',
        },
        {
          id: 'nothing',
          label: 'Nothing, until the €5 is back in her hand',
          feedback:
            'Even before Friday, the promise is worth €5 to her: it is money she is owed and can ask for. Money you are owed counts already.',
        },
        {
          id: 'friends',
          label: 'Nothing for Olivia — it is her friend’s asset',
          feedback:
            'Her friend spent the €5 on the bus. What her friend has left is a promise to pay, and a promise to pay is a debt, not an asset.',
        },
      ],
      correctOptionId: 'asset',
      explanation:
        'Surprise: a promise to pay you is an asset. The same €5 is a liability for her friend. One person’s IOU (“I owe you”) is always somebody else’s asset.',
    },
    {
      id: 'olivia-amp-pay-later',
      type: 't_account_flow',
      xp: 15,
      tags: ['basics', 'balance-sheet', 'liabilities'],
      prompt:
        'Olivia buys a €40 amp at Breno’s music shop, and Breno lets her pay later. Post it on both their lists.',
      instructions: 'Pick an entry, then choose whose list it belongs on. Four entries in total.',
      scenario:
        'Breno takes a €40 amp off his shelf and hands it to Olivia for her first gig. She promises to pay him the €40 later. The right-hand column shows what each of them owes, and underneath, their equity — what is truly theirs.',
      currency: 'EUR',
      entities: [
        {
          id: 'olivia',
          label: 'Olivia',
          tier: 'person',
          role: 'Singer-songwriter, 12, saving for her first gig',
          openingLines: [
            { account: 'Guitar', side: 'asset', amount: 30 },
            { account: 'Piggy bank', side: 'asset', amount: 20 },
            { account: 'T-shirts', side: 'asset', amount: 10 },
            { account: 'Equity', side: 'liability', amount: 60, equity: true },
          ],
        },
        {
          id: 'breno',
          label: 'Breno’s music shop',
          tier: 'small_business',
          role: 'Guitars, amps and strings — and a big friendly beard',
          openingLines: [
            { account: 'Shop stock', side: 'asset', amount: 200 },
            { account: 'Equity', side: 'liability', amount: 200, equity: true },
          ],
        },
      ],
      options: [
        {
          id: 'olivia-amp-up',
          shift: { entityId: 'olivia', side: 'asset', account: 'Amp', delta: 40 },
        },
        {
          id: 'olivia-owes-up',
          shift: { entityId: 'olivia', side: 'liability', account: 'Owed to Breno', delta: 40 },
        },
        {
          id: 'breno-shelf-down',
          shift: { entityId: 'breno', side: 'asset', account: 'Shop stock', delta: -40 },
        },
        {
          id: 'breno-owed-up',
          shift: { entityId: 'breno', side: 'asset', account: 'Owed by Olivia', delta: 40 },
        },
        {
          id: 'olivia-piggy-down',
          shift: { entityId: 'olivia', side: 'asset', account: 'Piggy bank', delta: -40 },
          feedback:
            'Her piggy bank was not touched — she is paying later. That is exactly why she now owes Breno €40.',
        },
        {
          id: 'olivia-equity-up',
          shift: { entityId: 'olivia', side: 'liability', account: 'Equity', delta: 40, equity: true },
          feedback:
            'A new amp feels like being richer, but she has not paid for any of it yet. What is truly hers does not change.',
        },
      ],
      expectedShifts: [
        { entityId: 'olivia', side: 'asset', account: 'Amp', delta: 40 },
        { entityId: 'olivia', side: 'liability', account: 'Owed to Breno', delta: 40 },
        { entityId: 'breno', side: 'asset', account: 'Shop stock', delta: -40 },
        { entityId: 'breno', side: 'asset', account: 'Owed by Olivia', delta: 40 },
      ],
      explanation:
        'Olivia now owns the amp and owes €40 — owning and owing at the same time. Breno has one amp fewer on his shelf but €40 that Olivia owes the shop, so neither of them got richer or poorer. Olivia’s €40 debt is Breno’s €40 asset.',
    },
    {
      id: 'olivia-whats-truly-hers',
      type: 'multiple_choice',
      xp: 10,
      tags: ['basics', 'equity'],
      prompt:
        'Before the amp, what was truly Olivia’s was €60. Now her things are worth €100, and she owes Breno €40. What is truly hers now?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'sixty', label: '€60' },
        {
          id: 'hundred',
          label: '€100',
          feedback:
            'That counts the amp as if it were paid for. It is not yet: she still owes €40 for it.',
        },
        {
          id: 'hundredforty',
          label: '€140',
          feedback:
            'Debts do not add to what is yours. Take what you owe away from what you own: €100 − €40.',
        },
        {
          id: 'forty',
          label: '€40',
          feedback: '€40 is what she owes. Take it away from the €100 she owns to see what is left.',
        },
      ],
      correctOptionId: 'sixty',
      explanation:
        'What is truly yours — your equity — is what you own minus what you owe: €100 − €40 = €60. Borrowing gave Olivia an amp, not extra wealth. Sal’s bank works the same way: its gold, loans and building are assets, its deposits are what it owes, and what is left is the owner’s equity.',
    },
    // ---- Sal’s bank ---------------------------------------------------------
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
    'Assets are what you own, liabilities what you owe, and equity — what is truly yours — is the difference.',
  ],
});
