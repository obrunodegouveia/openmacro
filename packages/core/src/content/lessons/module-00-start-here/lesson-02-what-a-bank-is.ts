import { defineLesson } from '../../schema';

/**
 * The first T-account anybody meets in the course, kept as simple as the
 * mechanic allows: two entities, two postings each, no distractors that
 * require prior knowledge.
 */
export const whatABankIsLesson = defineLesson({
  id: 'what-a-bank-actually-is',
  title: 'What a Bank Actually Is',
  subtitle:
    'Two lists: what it owns, and what it owes. Every bank in the world is that, and so is every person.',
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
        'A bank’s accounts are two lists: things it owns, and things it owes. Where does your deposit go?',
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
            'It is holding it, but it is not the bank’s. Think of a cloakroom ticket: the coat is in the building and it is still yours, and the cloakroom’s obligation is to give it back.',
        },
        {
          id: 'neither',
          label: 'Neither — deposits are kept separately',
        },
        {
          id: 'both',
          label: 'Both, since it holds it and owes it',
          feedback:
            'Closer than it looks. The bank does hold *something* on the owns side after you deposit — but it is not your deposit, and the next screen shows exactly what it is.',
        },
      ],
      correctOptionId: 'owes',
      explanation:
        'Your deposit is the bank’s liability — the last lesson’s promise, written down in its accounts. This is the single most useful habit in the whole course: whenever you meet a sum of money, ask whose promise it is and which of their two lists it sits on. Everything else is that question, repeated at bigger and bigger institutions.',
    },
    {
      id: 'deposit-posting',
      type: 't_account_flow',
      tags: ['basics', 'balance-sheet', 'deposits'],
      xp: 20,
      prompt: 'You walk into a bank and deposit €1,000 in cash. Post it.',
      instructions:
        'Pick an entry, then choose whose list it belongs on. Four entries in total.',
      scenario:
        'You hand over €1,000 of notes. Your side and the bank’s side both change — and nobody has become richer or poorer.',
      currency: 'EUR',
      entities: [
        {
          id: 'you',
          label: 'You',
          tier: 'fiduciary_core',
          role: 'Owns things, owes things — same two lists as a bank',
          openingLines: [
            { account: 'Cash in your pocket', side: 'asset', amount: 1500 },
            { account: 'Money in the bank', side: 'asset', amount: 2400 },
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
            'The wrong direction. Taking your notes makes the bank owe you *more*, not less — it now has an extra €1,000 obligation to you that it did not have this morning.',
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
        'You are no richer: you swapped notes for a promise. The bank is no richer either: it gained €1,000 of notes and took on €1,000 of obligation, which cancel exactly. That is what a balance sheet does — it balances, always, for everyone, and if it does not then something has been left out. You have just done the thing the rest of this course is built on.',
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
            'Then the bank would earn nothing and could not pay for branches, staff or interest. No bank has ever worked that way, and one that did would have to charge you for storage.',
        },
        {
          id: 'central-bank',
          label: 'Sends all of it to the central bank',
        },
        {
          id: 'spends',
          label: 'Spends it on its own costs',
          feedback:
            'It cannot — it owes you that money. Lending it is different from spending it, because a loan is an asset the bank still owns.',
        },
      ],
      correctOptionId: 'lends-most',
      explanation:
        'This is the whole business: hold enough to meet the withdrawals that actually happen, and put the rest to work earning more than it pays you. It works because depositors do not all come at once — and the rare occasions when they do have a name, a bank run, which is the subject of a later lesson. What it does *not* explain is where most money comes from, and that is next.',
    },
  ],
  keyTakeaways: [
    'Every balance sheet is two lists: what is owned and what is owed. Yours too.',
    'Your deposit sits on the bank’s "owes" list — it is the bank’s obligation to you.',
    'Depositing cash makes nobody richer; it swaps notes for a promise.',
    'Banks hold back only what is needed for normal withdrawals and put the rest to work.',
  ],
});
