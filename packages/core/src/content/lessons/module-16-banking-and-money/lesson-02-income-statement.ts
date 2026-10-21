import { defineLesson } from '../../schema';

/**
 * Video 2. The income statement introduced as the bridge between two balance
 * sheets — and net income shown to be exactly the change in equity.
 */
export const kabIncomeStatementLesson = defineLesson({
  id: 'kab-income-statement',
  title: 'From One Balance Sheet to the Next',
  subtitle:
    'A balance sheet is like a photo of one day. An income statement shows what happened between two photos. Its last line is the change in equity.',
  icon: '📄',
  difficulty: 'intro',
  estimatedMinutes: 18,
  video: {
    url: 'https://www.youtube.com/watch?v=h3lMANILkw0',
    minutes: 12,
    source: 'Khan Academy — Banking 2',
  },
  challenges: [
    // ---- Olivia warm-ups --------------------------------------------------
    // Sal builds an income statement in this video and shows that the profit
    // a bank keeps is exactly the rise in its equity. These four do the same at
    // Olivia's merch table and Breno's music shop, picking up her €60 of equity
    // from lesson 1.
    {
      id: 'olivia-merch-words',
      type: 'concept_match',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'income-statement'],
      prompt:
        'Olivia runs a merch table at the school talent show, selling badges and bracelets. Match each word to what happens at her table.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'income',
          term: 'Income',
          definition: 'Money coming in: €2 for every bracelet she sells',
        },
        {
          id: 'costs',
          term: 'Costs',
          definition: 'Money going out to make them: the beads, the pins, the sign',
        },
        {
          id: 'profit',
          term: 'Profit',
          definition: 'What is left over for her when the show is done',
        },
      ],
      explanation:
        'Income is what comes in, costs are what she pays to make it happen, and profit is what is left. Sal’s income statement is the same list, with interest instead of bracelets.',
    },
    {
      id: 'olivia-profit',
      type: 'multiple_choice',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'income-statement'],
      prompt:
        'At the talent show Olivia sells €40 of badges and bracelets. The beads and pins cost her €10, and printing a sign cost €5. What is her profit?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'twentyfive', label: '€25' },
        {
          id: 'forty',
          label: '€40',
          feedback:
            '€40 is her income — everything that came in. Profit is what is left after the costs are paid.',
        },
        {
          id: 'thirty',
          label: '€30',
          feedback: 'You took off the beads and pins but not the sign. Every cost comes off.',
        },
        {
          id: 'fiftyfive',
          label: '€55',
          feedback: 'Costs come off, not on: €40 − €10 − €5.',
        },
      ],
      correctOptionId: 'twentyfive',
      explanation:
        'Profit is income minus costs: €40 − €10 − €5 = €25. Grown-ups call it net income, and it is the bottom line of Sal’s income statement too.',
    },
    {
      id: 'olivia-breno-shop-profit',
      type: 'multiple_choice',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'income-statement'],
      prompt:
        'Breno’s music shop has its own list. This week he sells €200 of strings and picks. Buying them from the factory cost him €100, and the shop’s rent is €60. What is the shop’s profit this week?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'forty', label: '€40' },
        {
          id: 'twohundred',
          label: '€200',
          feedback:
            '€200 is the shop’s income — everything customers paid. Breno still has to pay for the strings and the rent.',
        },
        {
          id: 'hundred',
          label: '€100',
          feedback: 'You took off what the strings cost him but not the rent. Rent is a cost too.',
        },
        {
          id: 'sixty',
          label: '€60',
          feedback: '€60 is the rent, one of his costs. Profit is what is left after all of them.',
        },
      ],
      correctOptionId: 'forty',
      explanation:
        'Income minus costs: €200 − €100 − €60 = €40. A merch table, a music shop and Sal’s bank all use the same list — only the lines change.',
    },
    {
      id: 'olivia-profit-grows-equity',
      type: 'multiple_choice',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'equity', 'income-statement'],
      prompt:
        'Before the show, what was truly Olivia’s was €60. She puts her €25 profit in her piggy bank and owes nobody anything new. What is truly hers now?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'eightyfive', label: '€85' },
        {
          id: 'sixty',
          label: '€60',
          feedback:
            'The profit is hers to keep. Nobody is owed it, so what is truly hers goes up.',
        },
        {
          id: 'twentyfive',
          label: '€25',
          feedback: '€25 is only what she made at the show. Add it to the €60 she already had.',
        },
        {
          id: 'thirtyfive',
          label: '€35',
          feedback:
            'Profit is money coming in, so it adds to what is yours. Only a loss would take away.',
        },
      ],
      correctOptionId: 'eightyfive',
      explanation:
        'Her piggy bank grew by €25 and she owes nothing new, so what is truly hers grew by €25 too: €60 + €25 = €85. Sal shows the same thing below — the bank keeps 200,000 of net income, and its equity rises from 1 million to 1.2 million.',
    },
    // ---- Sal’s bank ---------------------------------------------------------
    {
      id: 'mc-net-income-equals',
      type: 'multiple_choice',
      tags: ['accounting', 'equity'],
      xp: 20,
      prompt:
        'Sal’s bank starts the year with 1 million of equity and ends it with 1.2 million. Its net income (profit) for the year was 200,000. Sal took no money out and put no new money in. Is it just luck that equity grew by exactly the profit?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'identity',
          label: 'No — profit the bank keeps can only add to equity, so the two must match',
        },
        {
          id: 'coincidence',
          label: 'Yes, they match only because deposits did not change',
          feedback:
            'Deposits staying the same makes the example simpler, but it is not why the numbers are equal. Profit that is not paid out can only go to equity.',
        },
        {
          id: 'cash',
          label: 'No — net income is the change in cash',
          feedback:
            'Cash did rise from 1 million to 1.2 million here, but only because nothing else changed. If a loan is repaid or a building is bought, cash and profit are no longer the same. That is why there is a third statement: the cash flow statement.',
        },
        {
          id: 'assets',
          label: 'No — net income is the change in total assets',
          feedback:
            'Assets grew by 200,000 here only because liabilities did not change. When a bank takes in a new deposit, its assets grow but it makes no profit.',
        },
      ],
      correctOptionId: 'identity',
      explanation:
        'Equity is assets minus liabilities. Profit that the bank keeps adds to assets but not to liabilities, so equity grows by the same amount. So if the owner takes nothing out and puts nothing in, two balance sheets show you the profit made in between.',
    },
    {
      id: 'order-income-statement',
      type: 'order_flow',
      tags: ['accounting', 'income-statement'],
      xp: 25,
      prompt: 'Put Sal’s income statement in order, as in the video: interest first, then running costs, then tax, and last what the owner keeps.',
      instructions: 'Drag the lines into order',
      events: [
        { id: 'interest-income', label: 'Interest income', detail: '900,000 — 10% on 9 million of loans' },
        { id: 'interest-expense', label: 'Minus interest paid', detail: '500,000 — 5% on 10 million of deposits' },
        { id: 'operating', label: 'Minus salaries and upkeep', detail: '100,000 to run the building and pay the guards' },
        { id: 'pretax', label: 'Profit before tax', detail: '300,000' },
        { id: 'tax', label: 'Minus tax', detail: '100,000 — the village takes one third' },
        { id: 'net', label: 'Net income (profit)', detail: '200,000, which is also the rise in equity' },
      ],
      correctOrder: ['interest-income', 'interest-expense', 'operating', 'pretax', 'tax', 'net'],
      explanation:
        'Income goes at the top. Then you take away the costs, one by one, and tax last. Net income is at the bottom. From this you can work out the return on equity: 200,000 earned on 1 million of equity is 20%.',
    },
    {
      id: 'mc-roe',
      type: 'multiple_choice',
      tags: ['return-on-equity', 'accounting'],
      xp: 25,
      prompt:
        'Sal put in 1,000,000 of his own money. In its first year the bank made 200,000 of net income. What was his return on equity (profit divided by the owner’s money), and why does it tell you more than the 200,000 alone?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'twenty',
          label: '20% — a profit only means something when you compare it with what the owner put in',
        },
        {
          id: 'two',
          label: 'About 2% — 200,000 compared with the 11.2 million of assets the bank has',
          feedback:
            'That is return on assets, which is a real measure too. But most of those assets were paid for with depositors’ money. Return on equity asks what the owner’s own money earned.',
        },
        {
          id: 'twentydeposits',
          label: '2% — 200,000 compared with the 10 million of deposits',
          feedback:
            'Deposits are money the bank owes, not money the owner put in. Dividing profit by what you owe does not measure any return.',
        },
        {
          id: 'nomeaning',
          label: 'The percentage does not matter: 200,000 of profit is always 200,000',
          feedback:
            'It matters a lot. If Sal had put in 10 million to earn the same 200,000, that would be only 2%. He would have done better by lending his gold to someone else.',
        },
      ],
      correctOptionId: 'twenty',
      explanation:
        'Return on equity is net income divided by the equity at the start of the year: 200,000 ÷ 1,000,000 = 20%. Profit alone does not tell you if a business is worth owning. You must compare it with what the owner put in. Remember this for the leverage video: there, the way to raise this number is to put in less of your own money and borrow more.',
    },
    {
      id: 'mc-equity-identity-breaks',
      type: 'multiple_choice',
      tags: ['accounting', 'equity'],
      xp: 30,
      prompt:
        'In the video, the change in equity equals net income. So you can find the year’s profit from two balance sheets. When would this shortcut give the wrong answer?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'dividends',
          label: 'If the owner took money out or put new money in that year',
        },
        {
          id: 'never',
          label: 'Never — it is always true in accounting',
          feedback:
            'It is only true when the owners do not take money out or put money in. Equity changes for two reasons: profit or loss, and money the owners put in or take out.',
        },
        {
          id: 'loss',
          label: 'If the bank lost money that year instead of making a profit',
          feedback:
            'A loss works the same way, but the other way round: equity falls by the size of the loss. The shortcut still works.',
        },
        {
          id: 'defaults',
          label: 'If some borrowers did not pay back their loans',
          feedback:
            'An unpaid loan is a real cost. The bank lowers the value of the loan, the loss goes into the income statement, and equity falls by the same amount. The shortcut still works.',
        },
      ],
      correctOptionId: 'dividends',
      explanation:
        'Equity goes up with profits and with new money from the owners. It goes down with losses and with dividends (money paid out to the owners). Sal’s bank pays no dividend and gets no new money, so its two balance sheets do show its profit. In a real bank, a dividend can hide a good year. That is why real accounts also have a statement of changes in equity.',
    },
    {
      id: 'mc-where-profit-sits',
      type: 'multiple_choice',
      tags: ['accounting', 'balance-sheets'],
      xp: 20,
      prompt:
        'At the end of the year, equity is 1.2 million instead of 1 million. Deposits have not changed. On the asset side of the balance sheet, where is the extra 200,000?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'cash', label: 'In cash — the vault holds 1.2 million instead of 1 million' },
        {
          id: 'loans',
          label: 'In the loans, which grew to 9.2 million',
          feedback:
            'No loans were repaid and no new ones were made, so loans are still 9 million. What came in during the year was interest, and interest is paid in cash.',
        },
        {
          id: 'building',
          label: 'In the building, which is worth more now',
          feedback:
            'The building is still worth 1 million. The upkeep money kept it in good condition, but it did not make it worth more.',
        },
        {
          id: 'nowhere',
          label: 'Nowhere. Equity is just what is left over, not a thing you can point at',
          feedback:
            'Equity is what is left over, but the balance sheet must still balance. If equity grew by 200,000 and liabilities did not change, some asset must have grown by 200,000 too.',
        },
      ],
      correctOptionId: 'cash',
      explanation:
        'Profit is not just an idea. It ends up somewhere real. Borrowers paid 900,000 of interest in cash, and depositors were paid 500,000 in cash. What was left after wages, upkeep and tax stayed in the vault. Equity went up because an asset (cash) went up.',
    },
  ],
  keyTakeaways: [
    'A balance sheet shows one moment. An income statement explains what changed between two balance sheets.',
    'If the owner takes no money out, net income (profit) equals the change in equity.',
    'Return on equity is net income divided by the equity at the start. Here it is 20%.',
    'Profit is income minus costs, and profit you keep makes what is truly yours grow.',
  ],
});
