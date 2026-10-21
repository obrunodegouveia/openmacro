import { defineLesson } from '../../schema';

/**
 * Video 6. Two ways to move value without moving metal: hand over a note, or
 * write a cheque and let the bank move a number between two names.
 */
export const kabNotesAndChequesLesson = defineLesson({
  id: 'kab-notes-and-cheques',
  title: 'Paying Without Moving the Gold',
  subtitle:
    'You pay with a note by handing it over. You pay with a cheque by changing names in the bank’s book. The gold in the vault does not move either way.',
  icon: '🧾',
  difficulty: 'intro',
  estimatedMinutes: 15,
  video: {
    url: 'https://www.youtube.com/watch?v=IOzZVmgK3IM',
    minutes: 11,
    source: 'Khan Academy — Banking 6',
  },
  challenges: [
    // ---- Olivia warm-ups --------------------------------------------------
    // Sal moves value without moving gold: a note changes hands, or a cheque
    // changes a name in the bank’s ledger. These four have Olivia pay Tomás
    // €5 through Breno’s Bank, where only two numbers in the book change.
    {
      id: 'olivia-pay-by-app',
      type: 'multiple_choice',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'payments'],
      prompt:
        'Olivia and her classmate Tomás both have accounts at Breno’s Bank. She pays him €5 for a set of guitar picks with a tap in the bank’s app. What changes?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'two-numbers', label: 'Olivia’s account goes down €5 and Tomás’s goes up €5' },
        {
          id: 'coins-move',
          label: 'Breno takes €5 of coins out of the safe and gives them to Tomás',
          feedback:
            'Nobody touches the safe. Both accounts are in the same book, so Breno only changes two numbers.',
        },
        {
          id: 'only-olivia',
          label: 'Only Olivia’s account goes down €5',
          feedback:
            'The €5 does not vanish. It lands in Tomás’s account, so his number goes up by the same amount.',
        },
        {
          id: 'bank-richer',
          label: 'Breno’s Bank keeps the €5',
          feedback:
            'The bank is only passing it along. The €5 now belongs to Tomás, and the bank owes it to him instead of to Olivia.',
        },
      ],
      correctOptionId: 'two-numbers',
      explanation:
        'Paying someone at the same bank is just changing two lines in the book: €5 less owed to Olivia, €5 more owed to Tomás. Sal’s cheque does exactly this.',
    },
    {
      id: 'olivia-safe-untouched',
      type: 'multiple_choice',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'payments'],
      prompt:
        'After Olivia pays Tomás €5, how many coins have left Breno’s safe?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'none', label: 'None' },
        {
          id: 'five',
          label: '€5',
          feedback:
            'Tomás did not ask for coins. His €5 sits in his account, so the safe stays exactly as it was.',
        },
        {
          id: 'ten',
          label: '€10 — €5 out for Olivia and €5 out for Tomás',
          feedback:
            'Only numbers in the book changed. No coin went anywhere.',
        },
        {
          id: 'all',
          label: 'All of Olivia’s coins',
          feedback:
            'Olivia still has the rest of her money at the bank. Only €5 of what the bank owes moved from her name to Tomás’s.',
        },
      ],
      correctOptionId: 'none',
      explanation:
        'Not a single coin moved. Most paying in the real world is like this: banks change numbers in their books instead of moving cash around.',
    },
    {
      id: 'olivia-cheque-steps',
      type: 'order_flow',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'payments', 'cheques'],
      prompt:
        'The old way is a cheque: a signed note telling the bank to pay someone. Put Olivia’s €5 cheque to Tomás in order.',
      instructions: 'Drag the steps into order',
      events: [
        {
          id: 'write',
          label: 'Olivia writes “Pay Tomás €5” and signs it',
        },
        {
          id: 'bring',
          label: 'Tomás brings the cheque to Breno’s Bank',
        },
        {
          id: 'check',
          label: 'Breno checks the signature and that Olivia has €5',
        },
        {
          id: 'change',
          label: 'Breno takes €5 off Olivia’s account and adds €5 to Tomás’s',
          detail: 'The safe stays shut.',
        },
      ],
      correctOrder: ['write', 'bring', 'check', 'change'],
      explanation:
        'A cheque is an instruction, not money. The bank checks it is real and that the money is there, then changes two names in its book — the same steps as in Sal’s video.',
    },
    {
      id: 'olivia-note-or-cheque',
      type: 'concept_match',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'payments', 'bank-notes'],
      prompt: 'Olivia can pay in three ways. Match each one to how it works.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'note',
          term: 'Breno Buck',
          definition: 'Paper you hand over — whoever holds it owns it',
        },
        {
          id: 'cheque',
          term: 'Cheque',
          definition: 'A signed note telling the bank to pay one named person',
        },
        {
          id: 'app',
          term: 'App transfer',
          definition: 'A tap on the phone that tells the bank to change two numbers',
        },
      ],
      explanation:
        'A note moves from hand to hand; a cheque and an app transfer move a number from one name to another in the bank’s book. None of them needs the coins to leave the safe.',
    },
    // ---- Sal’s bank ---------------------------------------------------------
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
            'The bank moves 200 from A’s account to B’s, and no gold moves',
        },
        {
          id: 'gold-moves',
          label: 'The bank takes 200 in gold from the vault and hands it to B',
          feedback:
            'A cheque exists to avoid this. B is not asking for gold. B is asking for 200 of A’s money in the bank to become B’s.',
        },
        {
          id: 'new-money',
          label: 'The bank creates 200 of brand-new deposits for B’s account',
          feedback:
            'No money is created. A has 200 less and B has 200 more, so the bank owes exactly the same as before.',
        },
        {
          id: 'notes',
          label: 'The bank prints 200 in notes and gives them to B',
          feedback:
            'That would be B asking for cash. A cheque is an order to move money between accounts, so it works even for amounts too big to carry.',
        },
      ],
      correctOptionId: 'ledger',
      explanation:
        'A cheque is an order to move part of a deposit from one name to another. Total deposits stay the same. Only the owner changes. This idea comes back in the rest of the module: most payments are changes in records, not things being carried.',
    },
    {
      id: 'match-note-vs-cheque',
      type: 'concept_match',
      tags: ['payments', 'money'],
      xp: 25,
      prompt: 'Each feature below belongs to a bank note or to a cheque. Match each feature to what it means in real life.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'note-bearer',
          term: 'Paid to whoever holds it',
          definition: 'The note belongs to whoever has it, so it is easy to steal, and nobody records who has which note',
        },
        {
          id: 'cheque-named',
          term: 'Signed by the account holder',
          definition: 'Only the owner of the account can write one, and the bank checks the signature',
        },
        {
          id: 'note-small',
          term: 'Payment happens on the spot',
          definition: 'Handing over the note is the payment. The bank does nothing and does not need to know',
        },
        {
          id: 'cheque-large',
          term: 'Any amount at all',
          definition: 'You can write any amount, and you carry nothing worth stealing',
        },
      ],
      explanation:
        'A note is paid to whoever holds it and pays on the spot. A cheque has a signature and can be for any amount. So notes are good for an apple, and cheques for a house. The bank does nothing for a note and a little paperwork for a cheque. In both cases the gold stays in the vault.',
    },
    {
      id: 'mc-note-vs-cheque',
      type: 'multiple_choice',
      tags: ['bank-notes', 'payments'],
      xp: 30,
      prompt:
        'A pays B two gold pieces with notes. Later, A pays B 200 gold pieces by cheque. Both have accounts at Sal’s bank. What does each payment change in the bank’s records?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'notes-nothing',
          label: 'The notes: nothing. The cheque: A’s deposit goes down 200 and B’s goes up 200, so the total stays the same',
        },
        {
          id: 'both-nothing',
          label: 'Neither changes anything, because no gold moves in either case',
          feedback:
            'Half right. No gold moves either way. But the bank must record the cheque, because it keeps a record of who owns each deposit. It does not record who holds each note.',
        },
        {
          id: 'both-move',
          label: 'Both reduce A’s balance and raise B’s by the same amount',
          feedback:
            'Only the cheque does. Once notes leave the bank, the bank does not know where they are. A giving them to B never appears in its records.',
        },
        {
          id: 'notes-liability',
          label: 'The notes lower the bank’s total of notes owed, because they were spent',
          feedback:
            'Spending a note does not hand it back to the bank. The bank’s total of notes owed only falls when someone brings a note back and asks for gold.',
        },
      ],
      correctOptionId: 'notes-nothing',
      explanation:
        'This is the real difference. With a note, the bank owes whoever holds it and does not know who that is. So passing a note from hand to hand does not involve the bank. A deposit is in someone’s name, so every transfer is written in the bank’s records. Cash and bank transfers work the same way today. That is why a transfer leaves a record and cash does not.',
    },
    {
      id: 'match-instruments',
      type: 'concept_match',
      tags: ['payments', 'bank-notes'],
      xp: 25,
      prompt: 'Match each way of paying to what is good and bad about it.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'gold',
          term: 'Handing over gold',
          definition: 'Pays instantly and needs no bank, but it is heavy, hard to split and worth stealing',
        },
        {
          id: 'note',
          term: 'Handing over notes',
          definition: 'Light and printed in useful values, but just as easy to steal, because anyone holding a note can claim the gold',
        },
        {
          id: 'cheque',
          term: 'Writing a cheque',
          definition: 'Works for amounts too big to carry, and only the account owner can sign it, but the bank must complete the payment and it leaves a record',
        },
      ],
      explanation:
        'Each way of paying fixes a problem of the one before, but has its own weakness. Notes fixed gold’s weight and made it easy to pay small amounts, but nobody knows who holds them. Cheques fixed theft and size because the payer is known. But that also means they are no use to someone who wants to leave no record.',
    },
    {
      id: 'order-cheque',
      type: 'order_flow',
      tags: ['payments', 'clearing'],
      xp: 25,
      prompt: 'B builds a house for A, and A pays B 200 gold pieces by cheque. Before the payment, A has 400 in his account and B has 100. Put the steps in order.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'build', label: 'B builds a house for A', detail: 'The real work happens first' },
        { id: 'write', label: 'A writes and signs a cheque for 200' },
        { id: 'hand', label: 'A hands B the cheque' },
        { id: 'present', label: 'B takes it to the Bank of Sal' },
        { id: 'verify', label: 'The bank checks the signature against its records' },
        { id: 'move', label: 'A’s balance falls to 200, B’s rises to 300', detail: 'One book, two changes, no gold' },
      ],
      correctOrder: ['build', 'write', 'hand', 'present', 'verify', 'move'],
      explanation:
        'See how much of this is record keeping and how little is money moving. The house came first. The payment itself is just one clerk changing two numbers. A note never needs a signature check. That check is what makes a cheque safe for amounts you would never carry in coins.',
    },
  ],
  keyTakeaways: [
    'A cheque moves an existing deposit from one person to another. It does not create new money.',
    'A note belongs to whoever holds it. A cheque is a signed order that the bank checks.',
    'Most payments are just changes in a bank’s records. Nothing physical moves.',
  ],
});
