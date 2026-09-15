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
            'Both sides grow: a 300 loan asset, a 300 deposit liability',
        },
        {
          id: 'gold-falls',
          label: 'Gold falls by 300 and loans rise by 300, leaving the total unchanged',
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
            'The reserve requirement it must hold against its demand liabilities',
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
    {
      id: 'taccount-loan-creates-deposit',
      type: 't_account_flow',
      tags: ['money-creation', 'balance-sheets', 'lending'],
      xp: 35,
      prompt: 'Sal lends Entrepreneur C 300 gold pieces for an irrigation project.',
      instructions: 'Place every posting this operation requires',
      scenario:
        'C walks in with an idea and no money, and walks out able to pay his labourers. Nothing is taken out of the vault and no existing depositor’s balance falls. Post what the bank does instead.',
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
            'This is the assumption the video is built to break. The gold stays in the vault; what C receives is an account he can write cheques against, created by writing it down.',
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
        'Both sides of both balance sheets grow at once, and that symmetry is the whole thing: the entrepreneur’s new asset is his new debt, and the bank’s new asset is its new liability. Nobody had to save first. This is what economists mean by loans creating deposits, and it is the single most counter-intuitive fact in banking — which is why the video spends a whole episode arriving at it by hand.',
    },
    {
      id: 'mc-same-bank',
      type: 'multiple_choice',
      tags: ['lending', 'reserves', 'clearing'],
      xp: 30,
      prompt:
        'Entrepreneur D pays builder A with a cheque, and A banks with Sal too — so the payment is one ledger entry. What would have been different if A banked somewhere else?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'gold-leaves',
          label: 'Sal would have had to settle up, and gold would finally leave',
        },
        {
          id: 'nothing',
          label: 'Nothing — a cheque is a cheque',
          feedback:
            'It is a cheque to the two people involved. To Sal it is the difference between moving a number between two of his own accounts and owing an outside institution real reserves.',
        },
        {
          id: 'loan-cancels',
          label: 'The loan would have been cancelled, since the money left the bank',
          feedback:
            'D still owes the 300 whatever happens. What changes is the bank’s reserves, not its loan book.',
        },
        {
          id: 'more-money',
          label: 'More money would have been created, since two banks are involved',
          feedback:
            'The deposit exists either way; it just ends up at a different bank. Nothing about the payee’s choice of bank creates money.',
        },
      ],
      correctOptionId: 'gold-leaves',
      explanation:
        'A bank that is the only game in town can lend almost without limit, because every loan it makes comes straight back as a deposit. The moment there is a second bank, lending leaks: the borrower spends, the money lands elsewhere, and reserves have to follow. That leak is the real discipline on an individual bank, and it is why the next videos need an institution where banks settle with each other.',
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
          label: 'Only timing and safety — the end state is the same balance sheet',
        },
        {
          id: 'more-money',
          label: 'The new way creates money and the old way only moved it',
          feedback:
            'Both create money. In the old version the gold went out, came back as a new deposit, and the money supply rose exactly as much — it simply took a lap around the island first.',
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
        'Lend the gold and it travels to labourers, gets redeposited and ends up back in the vault with a loan and a deposit on the books. Create the account and you arrive at the same two entries without the journey. Seeing that these are the same operation is what stops fractional reserve banking looking like a trick: the multiplier was never a property of paper, only of the fact that people redeposit what they are paid.',
    },
  ],
  keyTakeaways: [
    'A loan is created as a matched pair: an asset and a new deposit.',
    'Making a loan does not change the bank’s equity — only its size and risk.',
    'The binding constraint is the reserve ratio, not the amount of gold.',
  ],
});
