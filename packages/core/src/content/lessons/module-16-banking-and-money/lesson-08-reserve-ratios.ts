import { defineLesson } from '../../schema';

/** Video 8. The reserve ratio defined against demand liabilities, and the bank run it exists to prevent. */
export const kabReserveRatiosLesson = defineLesson({
  id: 'kab-reserve-ratios',
  title: 'The Ratio That Sets the Limit',
  subtitle:
    'Gold in the vault over claims that can be demanded today. That fraction decides how big a bank may become.',
  icon: '⚖️',
  difficulty: 'core',
  estimatedMinutes: 16,
  video: {
    url: 'https://www.youtube.com/watch?v=VP3nKDUw1jA',
    minutes: 11,
    source: 'Khan Academy — Banking 8',
  },
  challenges: [
    {
      id: 'mc-denominator',
      type: 'multiple_choice',
      tags: ['reserve-ratio', 'liquidity'],
      xp: 25,
      prompt:
        'The reserve ratio is reserves divided by what, exactly? The bank has 500 gold and 700 of claims against it.',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'demand',
          label:
            'Total *demand* liabilities — checking accounts and notes outstanding, the things claimable today',
        },
        {
          id: 'all-liabilities',
          label: 'Total liabilities of every kind',
          feedback:
            'A ten-year loan taken by the bank is a liability but cannot be demanded tomorrow, so no reserve need sit against it. The ratio is about what could be asked for at once.',
        },
        {
          id: 'assets',
          label: 'Total assets',
          feedback:
            'That would measure something closer to leverage. The reserve ratio is about meeting demands, not about solvency.',
        },
        {
          id: 'equity',
          label: 'Equity',
          feedback:
            'Reserves against equity would tell you nothing about whether depositors can be paid — equity is what is left over after they have been.',
        },
      ],
      correctOptionId: 'demand',
      explanation:
        '500 over 700 is about 71%, an unusually cautious bank. The denominator matters: only obligations that can come due immediately require liquid cover, which is why the definition says demand liabilities rather than liabilities.',
    },
    {
      id: 'mc-run-vs-solvency',
      type: 'multiple_choice',
      tags: ['bank-run', 'liquidity'],
      xp: 25,
      prompt:
        'Holders of 600 gold pieces of claims all demand metal at once, but the bank holds only 500. Its loans are good. What is the situation?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'liquidity',
          label:
            'A liquidity failure, not an insolvency — the bank is good for the money but not today',
        },
        {
          id: 'insolvent',
          label: 'Insolvency — it cannot pay what it owes',
          feedback:
            'Insolvency means assets are worth less than liabilities. Here the loans are sound; the bank simply cannot turn them into gold this afternoon.',
        },
        {
          id: 'fine',
          label: 'No problem, since the loans will be repaid eventually',
          feedback:
            'Eventually is the difficulty. Confidence is what keeps a fractional system standing, and a depositor turned away is how confidence ends.',
        },
        {
          id: 'fraud',
          label: 'Fraud, because the bank promised money it did not hold',
          feedback:
            'The video raises this discomfort honestly and returns to it in the commentary videos — but as a description of the balance sheet, the word for this is illiquid.',
        },
      ],
      correctOptionId: 'liquidity',
      explanation:
        'Solvent but illiquid is the distinction the whole rest of the module depends on. A solvent bank can be destroyed by a run; that is why a lender of last resort is eventually invented. Note also how contagious the failure is — a run on one bank teaches everyone to doubt the buildings that look just like it.',
    },
  ],
  keyTakeaways: [
    'The reserve ratio is reserves over demand liabilities, not over all liabilities.',
    'Illiquid means cannot pay today; insolvent means cannot pay at all.',
    'A run can destroy a perfectly solvent bank.',
  ],
});
