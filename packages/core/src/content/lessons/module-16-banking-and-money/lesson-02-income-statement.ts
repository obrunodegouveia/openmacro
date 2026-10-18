import { defineLesson } from '../../schema';

/**
 * Video 2. The income statement introduced as the bridge between two balance
 * sheets — and net income shown to be exactly the change in equity.
 */
export const kabIncomeStatementLesson = defineLesson({
  id: 'kab-income-statement',
  title: 'What Happened Between Two Balance Sheets',
  subtitle:
    'A balance sheet is a photograph. An income statement is the film between two photographs — and it ends at the change in equity.',
  icon: '📄',
  difficulty: 'intro',
  estimatedMinutes: 16,
  video: {
    url: 'https://www.youtube.com/watch?v=h3lMANILkw0',
    minutes: 12,
    source: 'Khan Academy — Banking 2',
  },
  challenges: [
    {
      id: 'mc-net-income-equals',
      type: 'multiple_choice',
      tags: ['accounting', 'equity'],
      xp: 20,
      prompt:
        'Sal’s bank starts the year with 1 million of equity and ends it with 1.2 million. Its net income for the year was 200,000. Sal paid himself no dividend and put in no new money. Is it a coincidence that the two numbers match?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'identity',
          label: 'No — profit the bank keeps has nowhere to go but equity, so the two must match',
        },
        {
          id: 'coincidence',
          label: 'Yes, they happen to match because deposits did not change',
          feedback:
            'Deposits staying flat keeps the example tidy, but it is not what makes the numbers equal. Profit that is not paid out has nowhere to go except equity.',
        },
        {
          id: 'cash',
          label: 'No — net income is the change in cash',
          feedback:
            'Cash did rise from 1 million to 1.2 million here, but only because nothing else moved. Profit and cash part company as soon as a loan is repaid or a building is bought — which is why a third statement, the cash flow statement, exists.',
        },
        {
          id: 'assets',
          label: 'No — net income is the change in total assets',
          feedback:
            'Assets grew by 200,000 here only because liabilities were unchanged. Take in a deposit and assets jump without a penny of profit.',
        },
      ],
      correctOptionId: 'identity',
      explanation:
        'Equity is assets minus liabilities. Profit that is not paid out raises assets without raising liabilities, so it adds to equity one for one. That is why, when the owner takes nothing out and puts nothing in, two balance sheets tell you the net income earned in between.',
    },
    {
      id: 'order-income-statement',
      type: 'order_flow',
      tags: ['accounting', 'income-statement'],
      xp: 25,
      prompt: 'Put Sal’s income statement back in order, as the video builds it: interest first, then running costs, then tax, down to what the owner keeps.',
      instructions: 'Drag the lines into order',
      events: [
        { id: 'interest-income', label: 'Interest income', detail: '900,000 — 10% on 9 million of loans' },
        { id: 'interest-expense', label: 'Less interest expense', detail: '500,000 — 5% on 10 million of deposits' },
        { id: 'operating', label: 'Less salaries and upkeep', detail: '100,000 to run the building and pay the guards' },
        { id: 'pretax', label: 'Pre-tax income', detail: '300,000' },
        { id: 'tax', label: 'Less income tax', detail: '100,000 — the village takes a third' },
        { id: 'net', label: 'Net income', detail: '200,000, which is also the rise in equity' },
      ],
      correctOrder: ['interest-income', 'interest-expense', 'operating', 'pretax', 'tax', 'net'],
      explanation:
        'Revenue at the top, costs subtracted in order, tax last, and net income at the bottom. Return on equity falls straight out of it: 200,000 earned on 1 million of starting equity is 20%.',
    },
    {
      id: 'mc-roe',
      type: 'multiple_choice',
      tags: ['return-on-equity', 'accounting'],
      xp: 25,
      prompt:
        'Sal put in 1,000,000 of his own money and the bank earned 200,000 of net income in its first year. What was his return on equity, and why does it matter more than the 200,000 alone?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'twenty',
          label: '20% — a profit only means something compared with what the owner put in to earn it',
        },
        {
          id: 'two',
          label: 'About 2% — 200,000 against the 11.2 million of assets the bank holds',
          feedback:
            'That is return on assets, and it is a real measure — but most of those assets were bought with depositors’ money. Return on equity asks what the owner’s own stake earned.',
        },
        {
          id: 'twentydeposits',
          label: '2% — 200,000 against the 10 million of deposits',
          feedback:
            'Deposits are a liability, not an investment by the owner. Dividing profit by what you owe is not a return on anything.',
        },
        {
          id: 'nomeaning',
          label: 'The percentage does not matter; 200,000 of profit is 200,000 either way',
          feedback:
            'It matters entirely. The same 200,000 earned on a 10 million stake would be a 2% return, and Sal would have been better off lending his gold to someone else.',
        },
      ],
      correctOptionId: 'twenty',
      explanation:
        'Return on equity is net income divided by the equity at the start of the year: 200,000 on 1,000,000 is 20%. Profit on its own says nothing about whether a business is worth owning — only profit measured against what the owner put in does. Keep that number in mind for the leverage video, where the way to raise it turns out to be: put in less of your own money and borrow more.',
    },
    {
      id: 'mc-equity-identity-breaks',
      type: 'multiple_choice',
      tags: ['accounting', 'equity'],
      xp: 30,
      prompt:
        'In the video, the change in equity equals net income, so two balance sheets are enough to work out the year’s profit. In which case would that shortcut give the wrong answer?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'dividends',
          label: 'If the owner took money out (a dividend) or put new money in during the year',
        },
        {
          id: 'never',
          label: 'Never — it is an accounting identity',
          feedback:
            'It only holds when the owners neither take money out nor put money in. Equity moves for two reasons: profit or loss, and money the owners put in or take out.',
        },
        {
          id: 'loss',
          label: 'If the bank made a loss rather than a profit',
          feedback:
            'A loss works the same way in reverse: equity falls by the amount of the loss. The shortcut still works.',
        },
        {
          id: 'defaults',
          label: 'If some borrowers defaulted',
          feedback:
            'A default is a real expense: the loan is written down, the loss goes through the income statement, and equity falls by the same amount. The shortcut still works.',
        },
      ],
      correctOptionId: 'dividends',
      explanation:
        'Equity rises with profits and with new money from the owners, and falls with losses and with dividends. Sal’s bank pays no dividend and raises no new capital, so its two balance sheets do tell you net income. Read a real bank the same way and a dividend can make a profitable year look like a flat one — which is why real accounts also include a statement of changes in equity.',
    },
    {
      id: 'mc-where-profit-sits',
      type: 'multiple_choice',
      tags: ['accounting', 'balance-sheets'],
      xp: 20,
      prompt:
        'Equity ends the year at 1.2 million instead of 1 million, and deposits have not changed. On the asset side of the year-end balance sheet, where is that extra 200,000?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'cash', label: 'In cash — the vault holds 1.2 million instead of 1 million' },
        {
          id: 'loans',
          label: 'In the loan book, which grew to 9.2 million',
          feedback:
            'The loans were not repaid and no new ones were made; the book is still 9 million. What arrived over the year was the interest, and interest arrives as cash.',
        },
        {
          id: 'building',
          label: 'In the building, which is worth more now',
          feedback:
            'The building is still worth 1 million. The upkeep money kept it in shape; it did not make it worth more.',
        },
        {
          id: 'nowhere',
          label: 'Nowhere in particular. Equity is a residual, not a thing you can point at',
          feedback:
            'Equity is indeed a residual, but the balance sheet must still balance. If equity grew by 200,000 and liabilities did not move, some asset must have grown by 200,000 too.',
        },
      ],
      correctOptionId: 'cash',
      explanation:
        'Profit is not an abstraction floating above the balance sheet — it lands somewhere specific. Borrowers paid 900,000 of interest in cash and depositors were paid 500,000 in cash, and what was left after wages, upkeep and tax stayed in the vault. Equity went up because an asset did.',
    },
  ],
  keyTakeaways: [
    'A balance sheet is a snapshot; an income statement explains the gap between two of them.',
    'Net income equals the change in equity when nothing is paid out.',
    'Return on equity is net income over starting equity — here, 20%.',
  ],
});
