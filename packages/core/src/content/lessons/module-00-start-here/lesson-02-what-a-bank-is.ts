import { defineLesson } from '../../schema';

/**
 * The first T-account anybody meets in the course, kept as simple as the
 * mechanic allows: two entities, two postings each, no distractors that
 * require prior knowledge.
 */
export const whatABankIsLesson = defineLesson({
  id: 'what-a-bank-actually-is',
  title: 'What a Bank Really Is',
  subtitle:
    'Two lists: what it owns and what it owes. Every bank in the world works like this, and so does every person.',
  icon: '🏦',
  difficulty: 'intro',
  estimatedMinutes: 6,
  hearts: 5,
  challenges: [
    {
      id: 'mc-two-lists',
      type: 'multiple_choice',
      tags: ['basics', 'balance-sheet'],
      xp: 10,
      prompt:
        'A bank keeps two lists: what it owns and what it owes. On which list is your deposit?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'owes',
          label: 'On the "owes" list — the bank owes it to you',
        },
        {
          id: 'owns',
          label: 'On the "owns" list — the bank has your money',
          feedback:
            'The bank holds it, but it is not the bank’s. Think of a cloakroom: your coat is in the building, but it is still yours, and they must give it back.',
        },
        {
          id: 'neither',
          label: 'Neither — deposits are kept separately',
        },
        {
          id: 'both',
          label: 'Both, since it holds it and owes it',
          feedback:
            'Close. After you deposit, the bank does have something new on its “owns” list. But that is not your deposit. The next question shows what it is.',
        },
      ],
      correctOptionId: 'owes',
      explanation:
        'Your deposit is the bank’s liability (something it owes). It is the promise from the last lesson, written in the bank’s books. Here is the most useful habit in this course: when you see an amount of money, ask whose promise it is and on which of their two lists it sits.',
    },
    {
      id: 'deposit-posting',
      type: 't_account_flow',
      tags: ['basics', 'balance-sheet', 'deposits'],
      xp: 20,
      prompt: 'You walk into a bank and deposit €1,000 in cash. Post it on both lists.',
      instructions:
        'Pick an entry, then choose whose list it belongs on. Four entries in total.',
      scenario:
        'You hand over €1,000 in notes. Your lists and the bank’s lists both change, but nobody gets richer or poorer.',
      currency: 'EUR',
      entities: [
        {
          id: 'you',
          label: 'You',
          tier: 'fiduciary_core',
          role: 'Owns things and owes things: the same two lists as a bank',
          openingLines: [
            { account: 'Cash in your pocket', side: 'asset', amount: 1500 },
            { account: 'Money in the bank', side: 'asset', amount: 2400 },
            { account: 'Net worth', side: 'liability', amount: 3_900, equity: true },
          ],
        },
        {
          id: 'bank',
          label: 'Your Bank',
          tier: 'commercial_bank',
          role: 'Takes the notes, owes you the balance',
          openingLines: [
            { account: 'Cash in the vault', side: 'asset', amount: 900000 },
            { account: 'Customer deposits', side: 'liability', amount: 4000000 },
            { account: 'Loans and other assets', side: 'asset', amount: 3_100_000 },
          ],
        },
      ],
      options: [
        {
          id: 'you-cash-down',
          shift: { entityId: 'you', side: 'asset', account: 'Cash in your pocket', delta: -1000 },
        },
        {
          id: 'you-deposit-up',
          shift: { entityId: 'you', side: 'asset', account: 'Money in the bank', delta: 1000 },
        },
        {
          id: 'bank-vault-up',
          shift: { entityId: 'bank', side: 'asset', account: 'Cash in the vault', delta: 1000 },
        },
        {
          id: 'bank-owes-up',
          shift: {
            entityId: 'bank',
            side: 'liability',
            account: 'Customer deposits',
            delta: 1000,
          },
        },
        {
          id: 'bank-owes-down',
          shift: {
            entityId: 'bank',
            side: 'liability',
            account: 'Customer deposits',
            delta: -1000,
          },
          feedback:
            'Wrong direction. Taking your notes makes the bank owe you more, not less. It now owes you €1,000 that it did not owe you this morning.',
        },
      ],
      expectedShifts: [
        { entityId: 'you', side: 'asset', account: 'Cash in your pocket', delta: -1000 },
        { entityId: 'you', side: 'asset', account: 'Money in the bank', delta: 1000 },
        { entityId: 'bank', side: 'asset', account: 'Cash in the vault', delta: 1000 },
        { entityId: 'bank', side: 'liability', account: 'Customer deposits', delta: 1000 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'You had €1,000 of money before and €1,000 after. It changed form, not amount.',
        },
        {
          aggregate: 'M0',
          direction: 'unchanged',
          note: 'The notes still exist. They moved from your pocket into a vault.',
        },
      ],
      explanation:
        'You are not richer: you swapped notes for a promise. The bank is not richer either: it got €1,000 in notes and now owes you €1,000, so the two cancel out. A balance sheet always balances, for everyone. If it does not, something is missing. This is the idea the rest of the course is built on.',
    },
    {
      id: 'mc-where-does-it-go',
      type: 'multiple_choice',
      tags: ['basics', 'banking'],
      xp: 15,
      prompt:
        'The bank now has your €1,000 in its vault. What does it do with it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'lends-most',
          label: 'Keeps a small amount available and lends or invests the rest',
        },
        {
          id: 'keeps-all',
          label: 'Keeps all of it, ready for you',
          feedback:
            'Then the bank would earn nothing. It could not pay for branches, staff or your interest. No bank has ever worked like that. One that did would have to charge you for storage.',
        },
        {
          id: 'central-bank',
          label: 'Sends all of it to the central bank',
        },
        {
          id: 'spends',
          label: 'Spends it on its own costs',
          feedback:
            'It cannot, because it owes you that money. Lending it is different from spending it: a loan is something the bank still owns.',
        },
      ],
      correctOptionId: 'lends-most',
      explanation:
        'This is how a bank makes money. It keeps enough for the withdrawals people really make, and puts the rest to work earning more than it pays you. This works because depositors do not all come at once. When they do, it is called a bank run, and a later lesson covers it.',
    },
  ],
  keyTakeaways: [
    'Every balance sheet is two lists: what is owned and what is owed. Yours too.',
    'Your deposit is on the bank’s “owes” list: the bank owes it to you.',
    'Depositing cash makes nobody richer. It swaps notes for a promise.',
    'Banks keep only what they need for normal withdrawals and put the rest to work.',
  ],
});
