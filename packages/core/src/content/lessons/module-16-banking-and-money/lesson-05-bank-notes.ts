import { defineLesson } from '../../schema';

/**
 * Video 5. The bank note as a claim cheque on gold in a vault — and the
 * recognition that the note in your wallet is the same object.
 */
export const kabBankNotesLesson = defineLesson({
  id: 'kab-bank-notes',
  title: 'The Note in Your Wallet Is a Bank Note',
  subtitle:
    'If all the gold stays in the vault, what do people spend? A paper receipt for the gold. A dollar bill is that kind of receipt.',
  icon: '💵',
  difficulty: 'intro',
  estimatedMinutes: 14,
  video: {
    url: 'https://www.youtube.com/watch?v=cNFLqhU4MN0',
    minutes: 9,
    source: 'Khan Academy — Banking 5',
  },
  challenges: [
    // ---- Olivia warm-ups --------------------------------------------------
    // Sal’s bank hands out paper notes for the gold in its vault, and people
    // spend the notes instead of the gold. These four do the same with “Breno
    // Bucks”, before Sal shows that the note in your wallet is that receipt.
    {
      id: 'olivia-breno-bucks',
      type: 'multiple_choice',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'bank-notes'],
      prompt:
        'Coins are heavy. So Breno hands out paper slips that say “Breno Bucks — €10 in coins at Breno’s Bank”. What is one Breno Buck?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'promise', label: 'A promise to give €10 of coins to whoever brings it back' },
        {
          id: 'paper',
          label: 'Just a nice piece of paper with a guitar drawn on it',
          feedback:
            'It is paper, but it is not just paper. Breno has promised to swap it for €10 of real coins.',
        },
        {
          id: 'coin',
          label: 'A brand-new kind of coin that Breno made himself',
          feedback:
            'Breno cannot make coins. The slip stands for €10 of coins that are already in his safe.',
        },
        {
          id: 'olivia-only',
          label: 'A ticket that only Olivia is allowed to use',
          feedback:
            'It has no name on it. Whoever holds it can bring it back to Breno’s Bank.',
        },
      ],
      correctOptionId: 'promise',
      explanation:
        'A Breno Buck is a receipt: a promise that €10 of coins is waiting in the safe. Sal’s bank does exactly this with its gold, and he calls the receipts bank notes.',
    },
    {
      id: 'olivia-spend-the-slip',
      type: 'multiple_choice',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'bank-notes', 'payments'],
      prompt:
        'Olivia buys new strings at a market stall and pays with one €10 Breno Buck. Why does the stall owner happily take a piece of paper?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'swap', label: 'She can swap it for €10 of coins at Breno’s Bank, or spend it herself' },
        {
          id: 'pretty',
          label: 'Because it has a nice drawing of a guitar on it',
          feedback:
            'A drawing does not pay for strings. She takes it because of the promise behind it.',
        },
        {
          id: 'kind',
          label: 'Because she is being kind to Olivia',
          feedback:
            'She is being sensible, not just kind. The slip is worth €10 of coins to anyone who holds it.',
        },
        {
          id: 'must',
          label: 'Because a law says she has to',
          feedback:
            'No law says so here. She takes it because she trusts Breno to keep his promise.',
        },
      ],
      correctOptionId: 'swap',
      explanation:
        'People take the paper because they trust the promise behind it. Soon nobody bothers to fetch the coins: they just pass the Breno Bucks along, which is what happens to the notes in Sal’s video.',
    },
    {
      id: 'olivia-receipt-words',
      type: 'concept_match',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'bank-notes'],
      prompt: 'Match each part of the Breno Bucks idea to what it means.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'coins',
          term: 'Coins in the safe',
          definition: 'The real euros that the paper slips stand for',
        },
        {
          id: 'note',
          term: 'Breno Buck',
          definition: 'A paper promise to hand over €10 of coins',
        },
        {
          id: 'holder',
          term: 'Whoever holds it',
          definition: 'The person who can bring the slip back and ask for the coins',
        },
      ],
      explanation:
        'The coins stay put; the promises move. The slip has no name on it, so whoever is holding it owns it — just like a bank note.',
    },
    {
      id: 'olivia-whose-debt-note',
      type: 'multiple_choice',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'bank-notes', 'liabilities'],
      prompt:
        'A €10 Breno Buck in Olivia’s pocket is an asset for her. What is that same slip for Breno’s Bank?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'liability', label: 'A liability — the bank owes €10 of coins to whoever brings it' },
        {
          id: 'asset',
          label: 'An asset — the bank printed it, so it owns it',
          feedback:
            'Printing a promise does not give you anything. It means you owe something: €10 of coins.',
        },
        {
          id: 'nothing',
          label: 'Nothing — once it leaves the bank, it is not the bank’s problem',
          feedback:
            'It is very much the bank’s problem: anyone can walk in with it and ask for the coins.',
        },
        {
          id: 'equity',
          label: 'Breno’s own money',
          feedback:
            'The coins behind the slip belong to whoever holds it, not to Breno.',
        },
      ],
      correctOptionId: 'liability',
      explanation:
        'Same as a deposit: one person’s asset is the bank’s liability. The euro and dollar notes in real wallets work like this too — they are promises from a central bank, which is why Sal calls the bill in your wallet a bank note.',
    },
    // ---- Sal’s bank ---------------------------------------------------------
    {
      id: 'mc-what-is-a-note',
      type: 'multiple_choice',
      tags: ['bank-notes', 'liabilities'],
      xp: 20,
      prompt:
        'The bank gives a depositor a piece of paper that says "one gold piece". Anyone who brings it back can collect a gold piece. On the bank’s balance sheet, what is that paper?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'liability',
          label: 'A liability — the bank owes a gold piece to whoever holds it',
        },
        {
          id: 'asset',
          label: 'An asset, because the bank printed it and owns it',
          feedback:
            'Printing a promise does not give the bank anything. As soon as the note leaves the bank, the bank owes gold to whoever holds it.',
        },
        {
          id: 'equity',
          label: 'Equity, because the owner hands it out',
          feedback:
            'Equity is what is left after the bank pays what it owes. A note is something it owes, so it must be paid first.',
        },
        {
          id: 'neither',
          label: 'Nothing — it is only paper until someone brings it back',
          feedback:
            'The bank owes the gold from the moment it hands out the note, not only when the note comes back. That is why the bank must keep gold for it.',
        },
      ],
      correctOptionId: 'liability',
      explanation:
        'A bank note is a promise from the bank to whoever holds the note (a bearer claim). The video’s big point is that this still matters today: a dollar bill is a Federal Reserve note, which is a liability of the Federal Reserve. Before central banks, each ordinary bank printed its own notes, so many different notes were used at the same time.',
    },
    {
      id: 'match-note-anatomy',
      type: 'concept_match',
      tags: ['bank-notes', 'money'],
      xp: 25,
      prompt: 'Match each feature of a bank note to why it is useful.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'divisible',
          term: 'Comes in different values',
          definition:
            'You can pay exact amounts without cutting metal: a note can be worth a quarter of a gold piece',
        },
        {
          id: 'portable',
          term: 'Light to carry',
          definition: 'Five hundred gold pieces are very heavy; five hundred on paper are not',
        },
        {
          id: 'hard-to-forge',
          term: 'Hard to copy',
          definition:
            'Otherwise the bank would pay out gold for fake notes it never gave out',
        },
        {
          id: 'bearer',
          term: 'Paid to whoever holds it',
          definition:
            'Anyone holding it can ask for the gold, so people can pass it on without going to the bank',
        },
      ],
      explanation:
        'Each feature solves a practical problem of paying with metal. Together they make a paper receipt more useful than the gold it stands for. That is why, in the end, the gold stopped moving at all.',
    },
    {
      id: 'taccount-issue-note',
      type: 't_account_flow',
      tags: ['bank-notes', 'balance-sheets'],
      xp: 35,
      prompt:
        'Villager A has 500 gold pieces in his account. He asks to take 100 of them as Bank of Sal notes.',
      instructions: 'Add every entry this needs',
      scenario:
        'No gold leaves the vault and nobody lends anything. The villager just swaps one promise from the bank for another: part of his account becomes paper notes he can give to someone else. Show what this does to both balance sheets.',
      entities: [
        {
          id: 'bank',
          label: 'Bank of Sal',
          tier: 'commercial_bank',
          role: 'Gives out both the deposit and the notes',
          openingLines: [
            { account: 'Gold in the vault', side: 'asset', amount: 1000 },
            { account: 'Building', side: 'asset', amount: 100 },
            { account: 'Demand deposits', side: 'liability', amount: 1000 },
            { account: 'Equity', side: 'liability', amount: 100, equity: true },
          ],
        },
        {
          id: 'villager',
          label: 'Villager A',
          tier: 'fiduciary_core',
          role: 'Is owed by the bank either way',
          openingLines: [
            { account: 'Deposit at Bank of Sal', side: 'asset', amount: 500 },
            { account: 'Net worth', side: 'liability', amount: 500, equity: true },
          ],
        },
      ],
      options: [
        {
          id: 'bank-dep-down',
          shift: { entityId: 'bank', side: 'liability', account: 'Demand deposits', delta: -100 },
        },
        {
          id: 'bank-notes-up',
          shift: { entityId: 'bank', side: 'liability', account: 'Notes outstanding', delta: 100 },
        },
        {
          id: 'vil-dep-down',
          shift: { entityId: 'villager', side: 'asset', account: 'Deposit at Bank of Sal', delta: -100 },
        },
        {
          id: 'vil-notes-up',
          shift: { entityId: 'villager', side: 'asset', account: 'Bank of Sal notes', delta: 100 },
        },
        {
          id: 'gold-out',
          shift: { entityId: 'bank', side: 'asset', account: 'Gold in the vault', delta: -100 },
          feedback:
            'The gold stays where it is. That is the whole idea: the note is a claim on the gold in the vault, so passing it on moves the claim, not the gold.',
        },
        {
          id: 'notes-asset',
          shift: { entityId: 'bank', side: 'asset', account: 'Notes outstanding', delta: 100 },
          feedback:
            'A note the bank has given out is something the bank owes. Anyone who brings it in can ask for gold. That is what a liability is.',
        },
      ],
      expectedShifts: [
        { entityId: 'bank', side: 'liability', account: 'Demand deposits', delta: -100 },
        { entityId: 'bank', side: 'liability', account: 'Notes outstanding', delta: 100 },
        { entityId: 'villager', side: 'asset', account: 'Deposit at Bank of Sal', delta: -100 },
        { entityId: 'villager', side: 'asset', account: 'Bank of Sal notes', delta: 100 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'unchanged',
          note: 'The gold never moved. On the island, base money is the gold in the vault, and it is still 1,000.',
        },
        {
          aggregate: 'M1',
          direction: 'unchanged',
          note: 'The villager could spend the 100 before and can spend it now. Swapping a deposit for notes changes the form of the money, not the amount.',
        },
      ],
      explanation:
        'One liability (deposits) gets smaller and another (notes) grows by the same amount. The assets do not change. Taking cash from an ATM today is like this, with one difference: your bank no longer prints its own notes. It gives you central bank notes from its own cash, so both its deposits and its cash fall. Either way, what you hold before and after is someone’s promise to pay.',
    },
    {
      id: 'mc-dollar-is-a-note',
      type: 'multiple_choice',
      tags: ['bank-notes', 'central-banking'],
      xp: 25,
      prompt:
        'Sal says that what he just drew is in your wallet. A US dollar bill is a Federal Reserve note. Who owes it, and what assets back it today?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'fed-treasuries',
          label: 'The Federal Reserve owes it, and it is backed mainly by US government bonds',
        },
        {
          id: 'fed-gold',
          label: 'The Federal Reserve owes it, and it is backed by the gold at Fort Knox',
          feedback:
            'The first half is right. But since 1971 you cannot swap dollars for gold, and today the assets behind the note are almost all government debt.',
        },
        {
          id: 'treasury',
          label: 'The Treasury owes it, because the Treasury prints it',
          feedback:
            'A Treasury office does print the notes. But look at the top of one: it says “Federal Reserve Note”. The Federal Reserve gives it out and owes it.',
        },
        {
          id: 'nobody',
          label: 'Nobody owes it — modern paper money is not owed by anyone',
          feedback:
            'It is on the liability side of the Fed’s published balance sheet, next to bank reserves. Since the end of the gold standard, what has changed is what you get for it, not whether it is owed.',
        },
      ],
      correctOptionId: 'fed-treasuries',
      explanation:
        'Every dollar note is a line on the Federal Reserve’s balance sheet. On the other side, the assets are mostly US government bonds and bonds backed by home loans. The video’s story leads here: Bank of Sal notes backed by gold become central bank notes backed by government debt. Video 17 comes back to what happened to the gold.',
    },
    {
      id: 'mc-forgery',
      type: 'multiple_choice',
      tags: ['bank-notes', 'counterfeiting'],
      xp: 25,
      prompt:
        'Sal says again and again that notes must be impossible to copy. Imagine a perfect fake note that nobody ever spots. Someone gives it to the bank and gets a gold piece. Who loses?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'bank',
          label: 'The bank. It pays real gold for a note it never gave out and got nothing for',
        },
        {
          id: 'holder',
          label: 'Whoever is holding the fake note when it is discovered',
          feedback:
            'That person loses only if the fake is found. Here it is never found: the bank thinks it is real and pays gold for it.',
        },
        {
          id: 'forger',
          label: 'The forger, since counterfeiting is a crime',
          feedback:
            'The forger is the one who gains. Ask instead: whose gold leaves the vault when the fake note is swapped for gold?',
        },
        {
          id: 'nobody',
          label: 'Nobody, as long as the note circulates and is accepted',
          feedback:
            'People use the note because they trust the bank to pay gold for it. Every fake note means less gold for each real note.',
        },
      ],
      correctOptionId: 'bank',
      explanation:
        'Each real note went out when gold came in. A fake note is a claim with no gold behind it, so there is less gold for every real note. Forgery steals from the bank and, little by little, from every honest person holding notes. That is why banks fight forgery so hard.',
    },
  ],
  keyTakeaways: [
    'A bank note is a promise to pay whoever holds it, so it is a liability of the bank that issues it.',
    'A dollar bill is a Federal Reserve note: the same kind of promise, but from one central bank.',
    'Notes are easier to split into small amounts and to carry than metal. That is why people chose them.',
  ],
});
