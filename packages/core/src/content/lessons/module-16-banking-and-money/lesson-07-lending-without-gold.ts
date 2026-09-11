import { defineLesson } from '../../schema';

/**
 * Video 7. The step that makes modern banking legible: a loan is made by
 * writing two new entries, not by handing over anything from the vault.
 */
export const kabLendingWithoutGoldLesson = defineLesson({
  id: 'kab-lending-without-gold',
  title: 'A Loan Is Two Entries, Not a Withdrawal',
  subtitle:
    'The bank lends 300 gold pieces without opening the vault. Both sides of the balance sheet grow at once.',
  icon: '✍️',
  difficulty: 'core',
  estimatedMinutes: 16,
  video: {
    url: 'https://www.youtube.com/watch?v=On3c86V5A_E',
    minutes: 9,
    source: 'Khan Academy — Banking 7',
  },
  challenges: [
    {
      id: 'mc-two-entries',
      type: 'multiple_choice',
      tags: ['money-creation', 'lending'],
      xp: 25,
      prompt:
        'The bank lends entrepreneur C 300 gold pieces by opening a checking account for him. What happens to the balance sheet?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'both-grow',
          label:
            'Assets grow by a 300 loan and liabilities grow by a 300 deposit — both sides expand together',
        },
        {
          id: 'gold-falls',
          label: 'Gold falls by 300 and loans rise by 300',
          feedback:
            'That is the older version, where the bank handed over metal and waited for it to be redeposited. The point of this video is that the gold never needs to move at all.',
        },
        {
          id: 'equity',
          label: 'Equity rises by 300, since the bank is now owed more',
          feedback:
            'Equity is assets minus liabilities. Both grew by the same 300, so equity is untouched — the bank is no richer for having made the loan, only more exposed.',
        },
        {
          id: 'nothing',
          label: 'Nothing changes until the borrower spends the money',
          feedback:
            'The loan and the deposit both exist from the moment they are written. Spending only moves the deposit to somebody else’s name.',
        },
      ],
      correctOptionId: 'both-grow',
      explanation:
        'This is where "banks create money by lending" stops sounding mystical. The loan is the asset, the borrower’s new deposit is the liability, and they are written in the same motion. The video is candid that it looks like conjuring — and notes it is no different in substance from the gold version, minus the wait for redeposit.',
    },
    {
      id: 'mc-what-stops-it',
      type: 'multiple_choice',
      tags: ['reserve-ratio', 'regulation'],
      xp: 20,
      prompt:
        'If a bank can create a loan and a deposit with a pen, what stops it doing so indefinitely?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'reserves',
          label:
            'The reserve requirement — how much it must hold against the deposits and notes it has issued',
        },
        {
          id: 'gold-stock',
          label: 'Running out of gold in the vault',
          feedback:
            'The gold is not being spent, so it does not run down. What binds is the ratio between the gold and the claims written against it.',
        },
        {
          id: 'borrowers',
          label: 'Running out of people who want to borrow',
          feedback:
            'A real constraint on a quiet high street, but not the one being introduced here. The next video makes the ratio explicit.',
        },
        {
          id: 'nothing',
          label: 'Nothing — this is why banking is unstable',
          feedback:
            'The video asks exactly this and answers it: reserve requirements exist, and a prudent bank would keep some cushion even without them.',
        },
      ],
      correctOptionId: 'reserves',
      explanation:
        'The limit is not the stock of metal but the permitted ratio of claims to metal. That single number decides how far the balance sheet can be stretched, and it is the subject of the next two videos.',
    },
  ],
  keyTakeaways: [
    'A loan is created as a matched pair: an asset and a new deposit.',
    'Making a loan does not change the bank’s equity — only its size and risk.',
    'The binding constraint is the reserve ratio, not the amount of gold.',
  ],
});
