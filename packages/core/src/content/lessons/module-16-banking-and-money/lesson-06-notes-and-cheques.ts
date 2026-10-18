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
        'A writes B a cheque for 200 gold pieces. Both have accounts at the Bank of Sal. What happens when B hands the cheque to the bank?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'ledger',
          label:
            'The bank moves 200 from A’s account to B’s. No gold moves and the bank’s total deposits are unchanged',
        },
        {
          id: 'gold-moves',
          label: 'The bank takes 200 in gold from the vault and hands it to B',
          feedback:
            'That is what a cheque exists to avoid. B is not asking for metal; B is asking for 200 of A’s balance to become B’s.',
        },
        {
          id: 'new-money',
          label: 'The bank creates 200 of new deposits for B',
          feedback:
            'Nothing is created. A has 200 less and B has 200 more, so the bank owes exactly as much as before.',
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
        'A cheque is an instruction to move part of a deposit from one name to another. Total deposits are unchanged; only who owns them changes. This is the first appearance of an idea the rest of the module relies on — that most payment is bookkeeping, not transport.',
    },
    {
      id: 'match-note-vs-cheque',
      type: 'concept_match',
      tags: ['payments', 'money'],
      xp: 25,
      prompt: 'Each property below belongs either to a bank note or to a cheque. Match each property to what it means in practice.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'note-bearer',
          term: 'Payable to the bearer',
          definition: 'The note belongs to whoever holds it — easy to steal, and nobody records who has which note',
        },
        {
          id: 'cheque-named',
          term: 'Signed by the account holder',
          definition: 'Only the owner of the account can write one, and the bank checks the signature',
        },
        {
          id: 'note-small',
          term: 'Settles on the spot',
          definition: 'Handing over the note is the payment — the bank does nothing and need not be told',
        },
        {
          id: 'cheque-large',
          term: 'Any amount at all',
          definition: 'Any sum can be written, with nothing worth stealing to carry around',
        },
      ],
      explanation:
        'Paying the bearer and settling on the spot are what a note does; a signature and any amount at all are what a cheque offers. Together they cover the range: notes for an apple, cheques for a house. The bank does nothing for the first and a little paperwork for the second, and in neither case does the gold leave the vault.',
    },
    {
      id: 'mc-note-vs-cheque',
      type: 'multiple_choice',
      tags: ['bank-notes', 'payments'],
      xp: 30,
      prompt:
        'A pays B two gold pieces with notes, and later pays B 200 gold pieces by cheque. Both have accounts at Sal’s bank. What does each payment change in the bank’s books?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'notes-nothing',
          label: 'The notes: nothing. The cheque: A’s deposit falls by 200 and B’s rises by 200, so the total does not change',
        },
        {
          id: 'both-nothing',
          label: 'Neither does anything, since no gold moves in either case',
          feedback:
            'Half right. No gold moves either way — but the bank must record the cheque, because it keeps track of who owns each deposit. It does not keep track of who holds which note.',
        },
        {
          id: 'both-move',
          label: 'Both reduce A’s balance and raise B’s by the same amount',
          feedback:
            'Only the cheque does. Once the notes left the bank, it stopped knowing where they were; A handing them to B never shows up in its books.',
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
        'This is the real difference between the two. A note is a bearer claim: the bank owes whoever holds it and has no idea who that is, so passing a note from hand to hand involves no bank at all. A deposit is a claim registered in someone’s name, so every transfer is an entry in the bank’s books. The same split exists today between cash and a bank transfer, and it is why a transfer leaves a trail and cash does not.',
    },
    {
      id: 'match-instruments',
      type: 'concept_match',
      tags: ['payments', 'bank-notes'],
      xp: 25,
      prompt: 'Match each way of paying to what it does well and what it still does badly.',
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
          definition: 'Light, and printed in whatever denominations are useful — but just as easy to steal, because anyone holding a note can claim the gold',
        },
        {
          id: 'cheque',
          term: 'Writing a cheque',
          definition: 'Works for amounts too large to carry, and only the account holder can sign one — but it needs the bank to complete the payment, and it leaves a record',
        },
      ],
      explanation:
        'Each way of paying fixes what the previous one could not and brings its own weakness. Notes solved gold’s weight and divisibility but kept its anonymity, for better and worse. Cheques solved theft and size by making the payer identifiable — the very property that made them useless to anyone who wanted no record.',
    },
    {
      id: 'order-cheque',
      type: 'order_flow',
      tags: ['payments', 'clearing'],
      xp: 25,
      prompt: 'B builds A a house, and A pays B 200 gold pieces by cheque. Before the payment, A has 400 in his account and B has 100. Put the steps in order.',
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
        'Notice how much of this is bookkeeping and how little is money moving. The house came first, and the payment itself is one clerk changing two numbers. The signature check is what a note never needs, and it is what makes a cheque safe to write for an amount you would never carry in coin.',
    },
  ],
  keyTakeaways: [
    'A cheque reassigns an existing deposit; it creates nothing.',
    'Notes are bearer instruments; cheques are authenticated instructions.',
    'Most payment is bookkeeping rather than the movement of anything.',
  ],
});
