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
          term: 'Instant settlement',
          definition: 'The note is the payment — the bank does nothing and need not be told',
        },
        {
          id: 'cheque-large',
          term: 'Arbitrary amount',
          definition: 'Any sum can be written without carrying anything worth stealing',
        },
      ],
      explanation:
        'The pair covers the range: notes for the apple, cheques for the house. The bank does nothing at all for the first and a little paperwork for the second, and in neither case does the gold leave the vault.',
    },
    {
      id: 'mc-note-vs-cheque',
      type: 'multiple_choice',
      tags: ['bank-notes', 'payments'],
      xp: 30,
      prompt:
        'A pays B two gold pieces with notes, and later pays B 200 gold pieces by cheque. Both customers bank with Sal. What does each payment do to the bank’s balance sheet?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'notes-nothing',
          label: 'The notes, nothing at all. The cheque, two entries that cancel',
        },
        {
          id: 'both-nothing',
          label: 'Neither does anything, since no gold moves in either case',
          feedback:
            'Half right. No gold moves either way — but the bank does have to write the cheque down, because it tracks who owns each deposit. It does not track who holds which note.',
        },
        {
          id: 'both-move',
          label: 'Both reduce A’s balance and raise B’s by the same amount',
          feedback:
            'Only the cheque does. Once the notes left the bank it stopped knowing where they were; A handing them to B is invisible to the ledger.',
        },
        {
          id: 'notes-liability',
          label: 'The notes reduce notes outstanding, since they have been spent',
          feedback:
            'Spending a note does not redeem it. Notes outstanding only falls when someone brings one back and asks for gold.',
        },
      ],
      correctOptionId: 'notes-nothing',
      explanation:
        'This is the real distinction between the two instruments. A note is a bearer claim — the bank owes whoever is holding it and has no idea who that is, so the note circulating is not a banking event. A deposit is a registered claim, so every transfer is a ledger entry. The same split exists today between cash and a bank transfer, and it is why one leaves a trail and the other does not.',
    },
    {
      id: 'match-instruments',
      type: 'concept_match',
      tags: ['payments', 'bank-notes'],
      xp: 25,
      prompt: 'Match each way of paying to the specific problem it solves and the one it leaves open.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'gold',
          term: 'Handing over gold',
          definition: 'Settles instantly and needs no bank — but is heavy, hard to divide, and worth stealing',
        },
        {
          id: 'note',
          term: 'Handing over notes',
          definition: 'Light and divisible into any denomination the bank cares to print — but still just as stealable, because anyone holding it can claim it',
        },
        {
          id: 'cheque',
          term: 'Writing a cheque',
          definition: 'Works for amounts too large to carry and only the account holder can sign one — but it settles on the bank’s ledger, not in your hand',
        },
      ],
      explanation:
        'Each instrument fixes what the previous one could not and introduces its own weakness. Notes solved gold’s weight and divisibility while keeping its anonymity, good and bad. Cheques solved theft and size by making the payer identifiable — which is precisely the property that made them useless for anyone who wanted no record.',
    },
    {
      id: 'order-cheque',
      type: 'order_flow',
      tags: ['payments', 'clearing'],
      xp: 25,
      prompt: 'Put A’s 200 gold piece payment to B, by cheque, in order.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'build', label: 'B builds A a house', detail: 'The real transaction happens first' },
        { id: 'write', label: 'A writes and signs a cheque for 200' },
        { id: 'hand', label: 'A hands B the cheque' },
        { id: 'present', label: 'B takes it to the Bank of Sal' },
        { id: 'verify', label: 'The bank checks the signature against its records' },
        { id: 'move', label: 'A’s balance falls to 200, B’s rises to 300', detail: 'One ledger, two entries, no gold' },
      ],
      correctOrder: ['build', 'write', 'hand', 'present', 'verify', 'move'],
      explanation:
        'Notice how much of this is bookkeeping and how little is money moving. The house was built before any payment existed, and the payment itself is one clerk adjusting two numbers. The verification step is what a note never needs and what makes a cheque safe to write for an amount you would never carry in coin.',
    },
  ],
  keyTakeaways: [
    'A cheque reassigns an existing deposit; it creates nothing.',
    'Notes are bearer instruments; cheques are authenticated instructions.',
    'Most payment is bookkeeping rather than the movement of anything.',
  ],
});
