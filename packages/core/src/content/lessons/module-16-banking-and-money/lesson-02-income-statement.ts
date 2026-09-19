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
        'The bank starts the year with 1 million of equity and ends with 1.2 million. Its net income for the year was 200,000. Is that a coincidence?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'identity',
          label: 'No — net income *is* the change in equity over the period',
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
        'Equity is assets minus liabilities. Earnings that are not paid out raise assets without raising liabilities, so they land in equity pound for pound. That is why you can hand someone two balance sheets and they can reconstruct the income statement that must have happened in between.',
    },
    {
      id: 'order-income-statement',
      type: 'order_flow',
      tags: ['accounting', 'income-statement'],
      xp: 25,
      prompt: 'Put the income statement back in order, from revenue down to what the owner keeps.',
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
        'Sal put in 1,000,000 of his own gold and the bank earned 200,000 in its first year. What was his return on equity, and why does he watch that rather than the 200,000?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'twenty',
          label: '20% — because 200,000 is only impressive relative to what he had to put up to earn it',
        },
        {
          id: 'two',
          label: '2% — 200,000 against the 11.2 million of assets he controls',
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
        'Return on equity is change in equity over starting equity: 200,000 on 1,000,000 is 20%. Profit on its own says nothing about whether a business is worth owning — only profit measured against what was staked does. Hold that number in mind for the leverage video, where the way to raise it turns out to be to stake less and borrow more.',
    },
    {
      id: 'mc-equity-identity-breaks',
      type: 'multiple_choice',
      tags: ['accounting', 'equity'],
      xp: 30,
      prompt:
        'The video shows that the change in equity equals net income, and says you could reconstruct the income statement from two balance sheets. When would that fail?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'dividends',
          label: 'If the owner took money out or put more in during the year',
        },
        {
          id: 'never',
          label: 'Never — it is an accounting identity',
          feedback:
            'It is an identity only for a business whose owners neither withdraw nor contribute. Equity moves for two reasons: profits earned, and capital paid in or taken out.',
        },
        {
          id: 'loss',
          label: 'If the bank made a loss rather than a profit',
          feedback:
            'A loss works the same way in reverse — equity falls by the amount of the loss. The identity holds fine.',
        },
        {
          id: 'defaults',
          label: 'If some borrowers defaulted',
          feedback:
            'A default is a real expense: the loan is written down, that flows through the income statement, and equity falls by the same amount. The identity survives.',
        },
      ],
      correctOptionId: 'dividends',
      explanation:
        'Equity rises by profits and by capital paid in, and falls by losses and by dividends. Sal’s bank happens to pay no dividend and raise no capital, so his two balance sheets do tell you net income — but read a real bank the same way and a dividend will make a profitable year look like a flat one. This is exactly why a cash flow statement exists alongside the other two.',
    },
    {
      id: 'mc-where-profit-sits',
      type: 'multiple_choice',
      tags: ['accounting', 'balance-sheets'],
      xp: 20,
      prompt:
        'Equity ends the year at 1.2 million instead of 1 million. On the asset side of the closing balance sheet, where is that extra 200,000 actually sitting?',
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
            'The building is still worth a million — the 50,000 of upkeep went on keeping it there rather than on making it worth more.',
        },
        {
          id: 'nowhere',
          label: 'Nowhere in particular. Equity is a residual, not a thing you can point at',
          feedback:
            'Equity is indeed a residual, but the balance sheet must still balance. If the right-hand side grew by 200,000 and liabilities did not move, something concrete on the left grew by 200,000.',
        },
      ],
      correctOptionId: 'cash',
      explanation:
        'Profit is not an abstraction floating above the balance sheet — it lands somewhere specific. Borrowers paid 900,000 of interest in coin and depositors were paid 500,000 in coin, and what was left after wages, upkeep and tax stayed in the vault. Equity went up because an asset did.',
    },
  ],
  keyTakeaways: [
    'A balance sheet is a snapshot; an income statement explains the gap between two of them.',
    'Net income equals the change in equity when nothing is paid out.',
    'Return on equity is net income over starting equity — here, 20%.',
  ],
});
