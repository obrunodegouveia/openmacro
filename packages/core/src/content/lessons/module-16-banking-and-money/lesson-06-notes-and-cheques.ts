import { defineLesson } from '../../schema';

/**
 * Video 6. Two ways to move value without moving metal: hand over a note, or
 * write a cheque and let the bank move a number between two names.
 */
export const kabNotesAndChequesLesson = defineLesson({
  id: 'kab-notes-and-cheques',
  title: 'Paying Without Moving the Gold',
  subtitle:
    'A note changes hands. A cheque changes a name in a ledger. Neither disturbs the vault.',
  icon: '🧾',
  difficulty: 'intro',
  estimatedMinutes: 15,
  video: {
    url: 'https://www.youtube.com/watch?v=IOzZVmgK3IM',
    minutes: 11,
    source: 'Khan Academy — Banking 6',
  },
  challenges: [
    {
      id: 'mc-cheque-mechanics',
      type: 'multiple_choice',
      tags: ['payments', 'cheques'],
      xp: 20,
      prompt:
        'A writes B a cheque for 200 gold pieces. Both bank with the Bank of Sal. What actually happens?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'ledger',
          label:
            'The bank moves 200 from A’s account to B’s. No gold moves and the bank’s totals are unchanged',
        },
        {
          id: 'gold-moves',
          label: 'The bank takes 200 in gold from the vault and hands it to B',
          feedback:
            'That is what a cheque exists to avoid. B is not asking for metal; B is asking for the claim to be reassigned.',
        },
        {
          id: 'new-money',
          label: 'The bank creates 200 of new deposits for B',
          feedback:
            'Nothing is created. A has 200 less and B has 200 more — the bank’s liabilities are exactly as large as they were.',
        },
        {
          id: 'notes',
          label: 'The bank prints 200 in notes and gives them to B',
          feedback:
            'That would be B asking for cash. A cheque instructs a transfer between accounts, which is why it works for amounts nobody wants to carry.',
        },
      ],
      correctOptionId: 'ledger',
      explanation:
        'A cheque is an instruction to reassign a liability. Total deposits are unchanged; only the names attached to them move. This is the first appearance of an idea the rest of the module leans on hard — that most payment is bookkeeping, not transport.',
    },
    {
      id: 'match-note-vs-cheque',
      type: 'concept_match',
      tags: ['payments', 'money'],
      xp: 25,
      prompt: 'Match each instrument to the property that distinguishes it.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'note-bearer',
          term: 'Bank note',
          definition: 'Belongs to whoever holds it — stealable, and nobody records who has which',
        },
        {
          id: 'cheque-named',
          term: 'Cheque',
          definition: 'Only the account holder can write one, and the bank verifies the signature',
        },
        {
          id: 'note-small',
          term: 'Why notes suit small payments',
          definition: 'Settlement is instant and needs no paperwork from the bank',
        },
        {
          id: 'cheque-large',
          term: 'Why cheques suit large ones',
          definition: 'Any amount can be written without carrying anything worth stealing',
        },
      ],
      explanation:
        'The pair covers the range: notes for the apple, cheques for the house. The bank does nothing at all for the first and a little paperwork for the second, and in neither case does the gold leave the vault.',
    },
  ],
  keyTakeaways: [
    'A cheque reassigns an existing deposit; it creates nothing.',
    'Notes are bearer instruments; cheques are authenticated instructions.',
    'Most payment is bookkeeping rather than the movement of anything.',
  ],
});
