import { defineLesson } from '../../schema';

/**
 * Video 7. The step that makes modern banking legible: a loan is made by
 * writing two new entries, not by handing over anything from the vault.
 */
export const kabLendingWithoutGoldLesson = defineLesson({
  id: 'kab-lending-without-gold',
  title: 'A Loan Is Two New Entries, Not Gold Leaving the Vault',
  subtitle:
    'The bank lends 300 gold pieces without opening the vault. Both sides of its balance sheet grow at the same time.',
  icon: '✍️',
  difficulty: 'core',
  estimatedMinutes: 16,
  video: {
    url: 'https://www.youtube.com/watch?v=On3c86V5A_E',
    minutes: 9,
    source: 'Khan Academy — Banking 7',
  },
  challenges: [
    // ---- Olivia warm-ups --------------------------------------------------
    // Sal lends Entrepreneur C 300 gold pieces by opening an account for him,
    // without touching the vault. These four do the same at Breno’s Bank, where
    // Dona Rosa’s bakery borrows €100 for a bigger oven and not one coin leaves
    // the safe.
    {
      id: 'olivia-loan-no-coins',
      type: 'multiple_choice',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'lending'],
      prompt:
        'Dona Rosa’s bakery is so busy she needs a bigger oven. Breno lends her €100. He does not open the safe: he writes “€100” into her account in his book. How many coins left the safe?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'none', label: 'None — she got €100 in her account, not coins' },
        {
          id: 'hundred',
          label: '€100 of coins',
          feedback:
            'Breno never opened the safe. Dona Rosa can spend the €100 from her account, so she does not need the coins.',
        },
        {
          id: 'all',
          label: 'All the coins in the safe',
          feedback:
            'Nothing came out of the safe at all. The loan is just writing in Breno’s book.',
        },
        {
          id: 'later',
          label: 'None yet, but €100 must leave by tonight',
          feedback:
            'Coins only leave if somebody asks for them. Dona Rosa can pay the oven-maker straight from her account.',
        },
      ],
      correctOptionId: 'none',
      explanation:
        'A bank lends by writing a number into the borrower’s account. No coins move, yet Dona Rosa can now spend €100. Sal does exactly this in the video: Entrepreneur C gets an account of 300 and the gold stays in the vault.',
    },
    {
      id: 'olivia-bakery-loan',
      type: 't_account_flow',
      speaker: 'breno',
      kids: true,
      xp: 15,
      tags: ['basics', 'balance-sheet', 'lending'],
      prompt: 'Breno lends Dona Rosa €100 for her new oven. Post it on both lists.',
      instructions: 'Pick an entry, then choose whose list it belongs on. Four entries in total.',
      scenario:
        'Breno writes €100 into Dona Rosa’s account at his bank. She promises to pay it back. No coins leave the safe. The right-hand column shows what each of them owes, and underneath, their equity — what is truly theirs.',
      currency: 'EUR',
      entities: [
        {
          id: 'bank',
          label: 'Breno’s Bank',
          tier: 'commercial_bank',
          role: 'A strong safe in the back of the music shop',
          openingLines: [
            { account: 'Coins in the safe', side: 'asset', amount: 60 },
            { account: 'Loan to Dona Rosa', side: 'asset', amount: 40 },
            { account: 'Accounts', side: 'liability', amount: 90 },
            { account: 'Equity', side: 'liability', amount: 10, equity: true },
          ],
        },
        {
          id: 'bakery',
          label: 'Dona Rosa’s bakery',
          tier: 'small_business',
          role: 'Bread, cakes — and a queue round the corner',
          openingLines: [
            { account: 'Oven', side: 'asset', amount: 80 },
            { account: 'Owed to Breno’s Bank', side: 'liability', amount: 40 },
            { account: 'Equity', side: 'liability', amount: 40, equity: true },
          ],
        },
      ],
      options: [
        {
          id: 'bank-loan-up',
          shift: { entityId: 'bank', side: 'asset', account: 'Loan to Dona Rosa', delta: 100 },
        },
        {
          id: 'bank-account-up',
          shift: { entityId: 'bank', side: 'liability', account: 'Dona Rosa’s account', delta: 100 },
        },
        {
          id: 'bakery-money-up',
          shift: { entityId: 'bakery', side: 'asset', account: 'Money at Breno’s Bank', delta: 100 },
        },
        {
          id: 'bakery-owes-up',
          shift: { entityId: 'bakery', side: 'liability', account: 'Owed to Breno’s Bank', delta: 100 },
        },
        {
          id: 'bakery-coins-up',
          shift: { entityId: 'bakery', side: 'asset', account: 'Coins in the till', delta: 100 },
          feedback:
            'No coins were handed over. What Dona Rosa got is €100 in her account at Breno’s Bank.',
        },
        {
          id: 'bank-equity-up',
          shift: { entityId: 'bank', side: 'liability', account: 'Equity', delta: 100, equity: true },
          feedback:
            'Lending does not make Breno richer. He owns a new €100 loan, but he also owes Dona Rosa the €100 in her account.',
        },
      ],
      expectedShifts: [
        { entityId: 'bank', side: 'asset', account: 'Loan to Dona Rosa', delta: 100 },
        { entityId: 'bank', side: 'liability', account: 'Dona Rosa’s account', delta: 100 },
        { entityId: 'bakery', side: 'asset', account: 'Money at Breno’s Bank', delta: 100 },
        { entityId: 'bakery', side: 'liability', account: 'Owed to Breno’s Bank', delta: 100 },
      ],
      explanation:
        'Both lists grow on both sides at once. The bank owns a bigger loan and owes Dona Rosa a new account. Dona Rosa owns €100 she can spend and owes €100 more. Nobody got richer, and nobody had to save first. Sal’s Bank of Sal does the same for Entrepreneur C.',
    },
    {
      id: 'olivia-loan-words',
      type: 'concept_match',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'lending', 'balance-sheet'],
      prompt: 'Olivia is working out who owns what after the loan. Match each thing to what it is.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'loan',
          term: 'The loan',
          definition: 'Something Breno’s Bank owns: Dona Rosa’s promise to pay back €100',
        },
        {
          id: 'account',
          term: 'Dona Rosa’s account',
          definition: 'Something Breno’s Bank owes: €100 she can spend whenever she likes',
        },
        {
          id: 'oven',
          term: 'The new oven',
          definition: 'What Dona Rosa buys with the money, to bake more bread',
        },
      ],
      explanation:
        'The loan and the account are two entries written at the same moment, one on each side of Breno’s list. The oven is the real thing the money pays for. In the video Sal’s loan is the asset and C’s new account is the liability, just like here.',
    },
    {
      id: 'olivia-new-money',
      type: 'multiple_choice',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'money-creation'],
      prompt:
        'Before the loan, all the accounts at Breno’s Bank added up to €90. Breno writes €100 into Dona Rosa’s account, and nobody else’s account goes down. What do the accounts add up to now?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'oneninety', label: '€190' },
        {
          id: 'ninety',
          label: '€90',
          feedback:
            'Dona Rosa has a brand-new €100 to spend, and nobody else lost any. So the total went up.',
        },
        {
          id: 'hundred',
          label: '€100',
          feedback:
            'The €90 that was already there is still there. Add Dona Rosa’s new €100 to it.',
        },
        {
          id: 'minusten',
          label: '−€10',
          feedback:
            'Nobody’s account went down. The loan added €100; it did not take any away.',
        },
      ],
      correctOptionId: 'oneninety',
      explanation:
        '€90 + €100 = €190. There is €100 more money in the town that people can spend, and not one new coin. That is what grown-ups mean by “loans create deposits”, and it is the surprise at the heart of Sal’s video.',
    },
    // ---- Sal’s bank ---------------------------------------------------------
    {
      id: 'mc-two-entries',
      type: 'multiple_choice',
      tags: ['money-creation', 'lending'],
      xp: 25,
      prompt:
        'The bank lends 300 gold pieces to Entrepreneur C. It does this by opening an account for him with 300 in it. No gold leaves the vault. What happens to the bank’s balance sheet?',
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
            'That was the older way, when the bank handed out gold. In this video the gold does not move at all.',
        },
        {
          id: 'equity',
          label: 'Equity rises by 300, because people now owe the bank more',
          feedback:
            'Equity is assets minus liabilities. Both went up by 300, so equity stays the same. The loan does not make the bank richer. It only adds risk.',
        },
        {
          id: 'nothing',
          label: 'Nothing changes until the borrower spends the money',
          feedback:
            'The loan and the deposit exist as soon as they are written. When C spends, the deposit just moves to someone else’s name.',
        },
      ],
      correctOptionId: 'both-grow',
      explanation:
        'The loan is a new asset for the bank. C’s new deposit is a new liability, because the bank owes it to him. Both are written at the same moment. That is how a bank creates money when it lends.',
    },
    {
      id: 'mc-what-stops-it',
      type: 'multiple_choice',
      tags: ['reserve-ratio', 'regulation'],
      xp: 20,
      prompt:
        'A bank can create a loan and a deposit just by writing them down. According to the video, what stops it from doing this without end?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'reserves',
          label:
            'The reserve requirement: it must keep a minimum share of reserves for its deposits and notes',
        },
        {
          id: 'gold-stock',
          label: 'Running out of gold, because every loan takes gold from the vault',
          feedback:
            'The gold is not spent, so it does not run out. The limit is the ratio between the gold and the deposits and notes.',
        },
        {
          id: 'borrowers',
          label: 'Running out of people who want to borrow',
          feedback:
            'In real life that also limits lending. But it is not the limit the video talks about here. The next video explains the reserve ratio.',
        },
        {
          id: 'nothing',
          label: 'Nothing — this is why banking is unstable',
          feedback:
            'The video asks this question and answers it. There are reserve requirements, and a careful bank would keep some reserves anyway.',
        },
      ],
      correctOptionId: 'reserves',
      explanation:
        'The limit is not the amount of gold. It is the minimum share of reserves the bank must keep for its deposits and notes. The next two videos are about this number. Later in this lesson you will see a second limit: money moving to other banks.',
    },
    {
      id: 'taccount-loan-creates-deposit',
      type: 't_account_flow',
      tags: ['money-creation', 'balance-sheets', 'lending'],
      xp: 35,
      prompt: 'Sal lends Entrepreneur C 300 gold pieces to build a water channel for his farm.',
      instructions: 'Place every entry this loan needs',
      scenario:
        'C comes in with an idea and no money. He leaves with an account he can use to pay his workers. No gold leaves the vault, and nobody else’s account goes down. Show what happens on both balance sheets.',
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
            { account: 'Equity', side: 'liability', amount: 100, equity: true },
          ],
        },
        {
          id: 'entrepreneur',
          label: 'Entrepreneur C',
          tier: 'fiduciary_core',
          role: 'Has an idea, but no money',
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
            'The video shows the gold stays in the vault. C gets a new account balance instead, and he can write cheques from it.',
        },
        {
          id: 'other-dep-down',
          shift: { entityId: 'bank', side: 'liability', account: 'Demand deposits', delta: -300 },
          feedback:
            'Nobody else’s account goes down. The loan does not move money from a saver to C. It adds a new deposit next to the old ones.',
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
          note: 'Deposits went up by 300 and nobody else’s account went down. So the island now has 300 more money that people can spend.',
        },
      ],
      explanation:
        'Both sides of both balance sheets grow at once. C owns a new deposit and owes a new loan. The bank owns a new loan and owes a new deposit. Nobody had to save first. Economists call this “loans create deposits”.',
    },
    {
      id: 'mc-same-bank',
      type: 'multiple_choice',
      tags: ['lending', 'reserves', 'clearing'],
      xp: 30,
      prompt:
        'C pays builder A 300 by cheque, using his new loan. A also has an account at Sal’s bank, so Sal just moves 300 from one account to another in his books. What would change if A had his account at a different bank?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'gold-leaves',
          label: 'Sal would have to pay the other bank, so 300 of gold would leave his vault',
        },
        {
          id: 'nothing',
          label: 'Nothing — a cheque is a cheque',
          feedback:
            'For C and A it is the same cheque. For Sal it is different. He is no longer moving a number between his own accounts. He now owes real gold to another bank.',
        },
        {
          id: 'loan-cancels',
          label: 'The loan would be cancelled, because the money left the bank',
          feedback:
            'C still owes the 300, whatever happens. What changes is the bank’s gold, not its loans.',
        },
        {
          id: 'more-money',
          label: 'More money would be created, because two banks are involved',
          feedback:
            'The deposit exists either way. It just ends up at a different bank. Which bank A uses does not create any money.',
        },
      ],
      correctOptionId: 'gold-leaves',
      explanation:
        'If Sal has the only bank, every loan comes back to him as a deposit, so lending never costs him gold. With a second bank, the money can move there, and Sal must send gold after it. This is a real limit on each bank. It is also why banks need a place to settle with each other, as later videos show.',
    },
    {
      id: 'mc-what-actually-changed',
      type: 'multiple_choice',
      tags: ['lending', 'money-creation'],
      xp: 25,
      prompt:
        'Sal says that lending by opening an account is “not that different” from the older way, when he handed out gold and waited for it to be deposited again. What is the real difference?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'timing',
          label: 'Only the timing and the safety of the gold. The balance sheet ends up the same',
        },
        {
          id: 'more-money',
          label: 'The new way creates money and the old way only moved it',
          feedback:
            'Both ways create money. In the old way the gold went out and came back as a new deposit. The money supply grew by the same amount. The gold just went round the island first.',
        },
        {
          id: 'no-reserves',
          label: 'The new way needs no reserves behind it at all',
          feedback:
            'It needs exactly the same reserves. The next video is about that. The new way only avoids having the gold outside the vault for a while.',
        },
        {
          id: 'illegal',
          label: 'The old way was honest lending, but the new way is not',
          feedback:
            'Both ways end with the same balance sheet. If one is honest, so is the other. That is Sal’s point.',
        },
      ],
      correctOptionId: 'timing',
      explanation:
        'In the old way, the gold goes to the workers, is deposited again and comes back to the vault. The books end with one loan and one deposit. In the new way, the bank writes the same two entries straight away. So it is the same thing, just faster, and the gold never leaves the vault.',
    },
  ],
  keyTakeaways: [
    'A bank makes a loan by writing two entries at once: the loan (an asset) and a new deposit (a liability).',
    'A new loan does not change the bank’s equity. The bank gets bigger and takes more risk, but it is not richer.',
    'What limits lending is the reserve ratio, not the amount of gold.',
  ],
});
