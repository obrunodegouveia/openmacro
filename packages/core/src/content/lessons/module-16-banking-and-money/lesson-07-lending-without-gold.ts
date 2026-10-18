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
        'The bank lends Entrepreneur C 300 gold pieces by opening an account for him with a balance of 300. No gold leaves the vault. What happens to the bank’s balance sheet?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'both-grow',
          label:
            'Both sides grow by 300: a new loan (asset) and a new deposit (liability)',
        },
        {
          id: 'gold-falls',
          label: 'Gold falls by 300 and loans rise by 300, leaving the total unchanged',
          feedback:
            'That is the earlier version, where the bank handed over metal and waited for it to be deposited again. The point of this video is that the gold does not need to move at all.',
        },
        {
          id: 'equity',
          label: 'Equity rises by 300, since the bank is now owed more',
          feedback:
            'Equity is assets minus liabilities. Both grew by the same 300, so equity is unchanged — making the loan does not make the bank richer, only more exposed to risk.',
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
        'This is where "banks create money by lending" stops sounding mysterious. The loan is the asset, the borrower’s new deposit is the liability, and both are written at the same moment. The video admits it looks like magic — and notes it is no different in substance from the gold version, minus the wait for the gold to be deposited again.',
    },
    {
      id: 'mc-what-stops-it',
      type: 'multiple_choice',
      tags: ['reserve-ratio', 'regulation'],
      xp: 20,
      prompt:
        'If a bank can create a loan and a deposit with a pen, what does the video say stops it doing so forever?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'reserves',
          label:
            'The reserve requirement: it must hold a minimum share of reserves against its deposits and notes',
        },
        {
          id: 'gold-stock',
          label: 'Running out of gold, since every loan draws the vault down',
          feedback:
            'The gold is not being spent, so it does not run down. What binds is the ratio between the gold and the claims written against it.',
        },
        {
          id: 'borrowers',
          label: 'Running out of people who want to borrow',
          feedback:
            'In real life that limits lending too, but it is not the limit the video introduces here. The next video makes the reserve ratio explicit.',
        },
        {
          id: 'nothing',
          label: 'Nothing — this is why banking is unstable',
          feedback:
            'The video asks exactly this and answers it: reserve requirements exist, and a careful bank would keep some reserves even without them.',
        },
      ],
      correctOptionId: 'reserves',
      explanation:
        'The limit is not the amount of metal but the minimum ratio of reserves to deposits and notes. That one number decides how far the balance sheet can be stretched, and it is the subject of the next two videos. (Later in this lesson you will see a second, practical limit: money leaking to other banks.)',
    },
    {
      id: 'taccount-loan-creates-deposit',
      type: 't_account_flow',
      tags: ['money-creation', 'balance-sheets', 'lending'],
      xp: 35,
      prompt: 'Sal lends Entrepreneur C 300 gold pieces for an irrigation project.',
      instructions: 'Place every posting this operation requires',
      scenario:
        'C walks in with an idea and no money, and walks out able to pay his workers. Nothing is taken out of the vault and no existing depositor’s balance falls. Post what happens on both balance sheets.',
      entities: [
        {
          id: 'bank',
          label: 'Bank of Sal',
          tier: 'commercial_bank',
          openingLines: [
            { account: 'Gold in the vault', side: 'asset', amount: 300 },
            { account: 'Building', side: 'asset', amount: 100 },
            { account: 'Demand deposits', side: 'liability', amount: 200 },
            { account: 'Notes outstanding', side: 'liability', amount: 100 },
          ],
        },
        {
          id: 'entrepreneur',
          label: 'Entrepreneur C',
          tier: 'fiduciary_core',
          role: 'Had an idea and no claims on anything',
        },
      ],
      options: [
        {
          id: 'bank-loan-up',
          shift: { entityId: 'bank', side: 'asset', account: 'Loan to Entrepreneur C', delta: 300 },
        },
        {
          id: 'bank-dep-up',
          shift: { entityId: 'bank', side: 'liability', account: 'Demand deposits', delta: 300 },
        },
        {
          id: 'ent-dep-up',
          shift: { entityId: 'entrepreneur', side: 'asset', account: 'Deposit at Bank of Sal', delta: 300 },
        },
        {
          id: 'ent-loan-up',
          shift: { entityId: 'entrepreneur', side: 'liability', account: 'Loan from Bank of Sal', delta: 300 },
        },
        {
          id: 'gold-down',
          shift: { entityId: 'bank', side: 'asset', account: 'Gold in the vault', delta: -300 },
          feedback:
            'This is the assumption the video sets out to break. The gold stays in the vault; what C receives is a new account balance he can write cheques against, created simply by recording it.',
        },
        {
          id: 'other-dep-down',
          shift: { entityId: 'bank', side: 'liability', account: 'Demand deposits', delta: -300 },
          feedback:
            'Nobody’s existing balance falls. Lending here does not move money from a saver to a borrower — it adds a new deposit alongside the old ones.',
        },
      ],
      expectedShifts: [
        { entityId: 'bank', side: 'asset', account: 'Loan to Entrepreneur C', delta: 300 },
        { entityId: 'bank', side: 'liability', account: 'Demand deposits', delta: 300 },
        { entityId: 'entrepreneur', side: 'asset', account: 'Deposit at Bank of Sal', delta: 300 },
        { entityId: 'entrepreneur', side: 'liability', account: 'Loan from Bank of Sal', delta: 300 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'unchanged',
          note: 'Still 300 gold pieces in the vault. Lending has not created a single coin.',
        },
        {
          aggregate: 'M1',
          direction: 'expand',
          note: 'Deposits rose by 300 and everyone else’s balance is untouched, so the island’s spendable money supply is 300 larger than it was a minute ago.',
        },
      ],
      explanation:
        'Both sides of both balance sheets grow at once, and that symmetry is the whole point: the entrepreneur’s new asset (his deposit) is matched by his new debt, and the bank’s new asset (the loan) is matched by its new liability (the deposit). Nobody had to save first. This is what economists mean by "loans create deposits", and it is one of the most counter-intuitive facts in banking — which is why the video spends a whole episode building it by hand.',
    },
    {
      id: 'mc-same-bank',
      type: 'multiple_choice',
      tags: ['lending', 'reserves', 'clearing'],
      xp: 30,
      prompt:
        'A borrower pays builder A 300 by cheque out of his new loan. A also banks with Sal, so the payment is just an entry in Sal’s own books. What would be different if A banked at another bank?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'gold-leaves',
          label: 'Sal would have to pay the other bank, so 300 of gold would finally leave his vault',
        },
        {
          id: 'nothing',
          label: 'Nothing — a cheque is a cheque',
          feedback:
            'For the two people involved it is the same cheque. For Sal it is the difference between moving a number between two of his own accounts and owing another bank real reserves.',
        },
        {
          id: 'loan-cancels',
          label: 'The loan would be cancelled, since the money left the bank',
          feedback:
            'The borrower still owes the 300 whatever happens. What changes is the bank’s reserves, not its loans.',
        },
        {
          id: 'more-money',
          label: 'More money would be created, since two banks are involved',
          feedback:
            'The deposit exists either way; it just ends up at a different bank. Which bank the builder uses does not create any money.',
        },
      ],
      correctOptionId: 'gold-leaves',
      explanation:
        'When Sal’s is the only bank in town, lending never costs him reserves, because every loan he makes comes straight back to him as a deposit; only the reserve requirement holds him back. The moment there is a second bank, lending leaks: the borrower spends, the money lands at the other bank, and Sal’s reserves have to follow it. That leak is a very practical limit on each bank, and it is why later videos need a place where banks settle with each other.',
    },
    {
      id: 'mc-what-actually-changed',
      type: 'multiple_choice',
      tags: ['lending', 'money-creation'],
      xp: 25,
      prompt:
        'Sal says lending by creating an account is "actually not that different" from the earlier version where he handed out gold and waited for it to be redeposited. What is the real difference?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'timing',
          label: 'Only the timing and the safety of the gold — the end result is the same balance sheet',
        },
        {
          id: 'more-money',
          label: 'The new way creates money and the old way only moved it',
          feedback:
            'Both create money. In the old version the gold went out, came back as a new deposit, and the money supply rose by exactly as much — the gold simply took a trip around the island first.',
        },
        {
          id: 'no-reserves',
          label: 'The new way needs no reserves behind it at all',
          feedback:
            'It needs exactly the same reserves, which is what the next video is about. What it avoids is having the metal out of the vault while the chain completes.',
        },
        {
          id: 'illegal',
          label: 'The old way was legitimate lending and the new way is not',
          feedback:
            'They produce identical balance sheets. If one is legitimate, so is the other — which is rather the point Sal is making.',
        },
      ],
      correctOptionId: 'timing',
      explanation:
        'Lend the gold and it travels to the workers, gets deposited again and ends up back in the vault, with a loan and a deposit on the books. Create the account and you reach the same two entries without the trip. Seeing that these are the same operation stops fractional reserve banking looking like a trick: the multiplier never depended on paper, only on people depositing what they are paid.',
    },
  ],
  keyTakeaways: [
    'A loan is created as a matched pair: an asset and a new deposit.',
    'Making a loan does not change the bank’s equity — only its size and risk.',
    'The binding constraint is the reserve ratio, not the amount of gold.',
  ],
});
