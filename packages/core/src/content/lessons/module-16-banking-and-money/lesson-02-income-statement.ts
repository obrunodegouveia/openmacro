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
  ],
  keyTakeaways: [
    'A balance sheet is a snapshot; an income statement explains the gap between two of them.',
    'Net income equals the change in equity when nothing is paid out.',
    'Return on equity is net income over starting equity — here, 20%.',
  ],
});
