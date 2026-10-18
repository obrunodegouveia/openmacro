import { defineLesson } from '../../schema';

/**
 * Video 5. The bank note as a claim cheque on gold in a vault — and the
 * recognition that the note in your wallet is the same object.
 */
export const kabBankNotesLesson = defineLesson({
  id: 'kab-bank-notes',
  title: 'The Note in Your Wallet Is a Bank Note',
  subtitle:
    'If all the gold is in the vault, what do people spend? A receipt — and that receipt is a dollar bill.',
  icon: '💵',
  difficulty: 'intro',
  estimatedMinutes: 14,
  video: {
    url: 'https://www.youtube.com/watch?v=cNFLqhU4MN0',
    minutes: 9,
    source: 'Khan Academy — Banking 5',
  },
  challenges: [
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
          label: 'An asset, since the bank printed it and owns it',
          feedback:
            'Printing a promise does not create an asset. The moment the note leaves the building, the bank owes whoever holds it.',
        },
        {
          id: 'equity',
          label: 'Equity, because it is issued by the owner',
          feedback:
            'Equity is what is left after liabilities are met. A note is a claim that must be met first.',
        },
        {
          id: 'neither',
          label: 'Nothing — it is only paper until redeemed',
          feedback:
            'The bank owes the gold from the moment the note is issued, not only when it is brought back. That is why the bank must keep gold against it.',
        },
      ],
      correctOptionId: 'liability',
      explanation:
        'A bank note is a claim on the issuer that belongs to whoever holds it (a bearer claim). The video’s punchline is that this is not a historical curiosity: a dollar bill is a Federal Reserve note — a liability of the Federal Reserve. Before central banks, ordinary banks each issued their own notes, so many different notes circulated side by side.',
    },
    {
      id: 'match-note-anatomy',
      type: 'concept_match',
      tags: ['bank-notes', 'money'],
      xp: 25,
      prompt: 'Match each property of a bank note to why it matters.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'divisible',
          term: 'Issued in denominations',
          definition:
            'Exact change without cutting metal — a note can be a quarter of a gold piece, a coin cannot',
        },
        {
          id: 'portable',
          term: 'Light to carry',
          definition: 'Five hundred gold pieces weigh a great deal; five hundred on paper does not',
        },
        {
          id: 'hard-to-forge',
          term: 'Hard to counterfeit',
          definition:
            'Without this the bank would be paying out gold for notes it never issued',
        },
        {
          id: 'bearer',
          term: 'Payable to the bearer',
          definition:
            'Anyone holding it can claim the gold, so it changes hands without the bank being involved',
        },
      ],
      explanation:
        'Each property solves a practical problem of paying with metal directly. Together they turn a vault receipt into something more useful than the gold it stands for — which is why the gold eventually stopped moving at all.',
    },
    {
      id: 'taccount-issue-note',
      type: 't_account_flow',
      tags: ['bank-notes', 'balance-sheets'],
      xp: 35,
      prompt:
        'Villager A has 500 gold pieces on deposit and asks to take 100 of them as Bank of Sal notes.',
      instructions: 'Place every posting this operation requires',
      scenario:
        'No gold leaves the vault and nobody lends anything. The villager simply swaps one claim on the bank for another: part of his account balance becomes paper he can hand to someone else. Post what that does to both balance sheets.',
      entities: [
        {
          id: 'bank',
          label: 'Bank of Sal',
          tier: 'commercial_bank',
          role: 'Issuer of both the deposit and the note',
          openingLines: [
            { account: 'Gold in the vault', side: 'asset', amount: 1000 },
            { account: 'Building', side: 'asset', amount: 100 },
            { account: 'Demand deposits', side: 'liability', amount: 1000 },
            { account: 'Equity', side: 'liability', amount: 100 },
          ],
        },
        {
          id: 'villager',
          label: 'Villager A',
          tier: 'fiduciary_core',
          role: 'Holds a claim either way',
          openingLines: [
            { account: 'Deposit at Bank of Sal', side: 'asset', amount: 500 },
            { account: 'Net worth', side: 'liability', amount: 500 },
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
            'The gold stays exactly where it is. That is the whole invention: the note is a claim on the vault, so handing one over moves the claim without moving the metal.',
        },
        {
          id: 'notes-asset',
          shift: { entityId: 'bank', side: 'asset', account: 'Notes outstanding', delta: 100 },
          feedback:
            'A note the bank has issued is something the bank owes. Whoever walks in holding it can demand gold, which is the definition of a liability.',
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
          note: 'The gold never moved. On the island’s own definition, base money is the metal in the vault and it is still 1,000.',
        },
        {
          aggregate: 'M1',
          direction: 'unchanged',
          note: 'The villager could spend the 100 before and can spend it now. Swapping a deposit for a note changes the form of the claim, not the quantity.',
        },
      ],
      explanation:
        'One liability (deposits) shrinks, another (notes) grows by the same amount, and the asset side never moves. Taking cash from an ATM today is the descendant of this swap, with one difference: your bank no longer prints its own notes. It hands you Federal Reserve notes from its own cash, so its deposits and its cash both fall. Either way, what you hold before and after is somebody’s promise.',
    },
    {
      id: 'mc-dollar-is-a-note',
      type: 'multiple_choice',
      tags: ['bank-notes', 'central-banking'],
      xp: 25,
      prompt:
        'Sal points out that the thing he has just drawn is in your wallet. A US dollar bill is a Federal Reserve note. Whose liability is it, and which assets stand behind it today?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'fed-treasuries',
          label: 'The Federal Reserve’s liability, backed mainly by US Treasuries',
        },
        {
          id: 'fed-gold',
          label: 'The Federal Reserve’s liability, backed by gold at Fort Knox',
          feedback:
            'The first half is right. But dollars have not been convertible into gold since 1971, and the assets behind the note today are overwhelmingly government debt.',
        },
        {
          id: 'treasury',
          label: 'The Treasury’s liability, since the Treasury prints it',
          feedback:
            'The Treasury’s Bureau of Engraving and Printing does print the notes, but read the top of one: "Federal Reserve Note". The Federal Reserve issues it and owes it.',
        },
        {
          id: 'nobody',
          label: 'Nobody’s liability — fiat money is not owed by anyone',
          feedback:
            'It sits on the liability side of the Fed’s published balance sheet, alongside bank reserves. What has changed since the gold standard is what you get when you present it, not whether it is owed.',
        },
      ],
      correctOptionId: 'fed-treasuries',
      explanation:
        'Every dollar note is a line on the Federal Reserve’s balance sheet, and the assets on the other side are mostly Treasuries and mortgage-backed securities. The chain the video is building leads straight here: Bank of Sal notes backed by gold become central bank notes backed by government debt. Video 17 returns to what happened to the gold.',
    },
    {
      id: 'mc-forgery',
      type: 'multiple_choice',
      tags: ['bank-notes', 'counterfeiting'],
      xp: 25,
      prompt:
        'Sal keeps saying the note must be impossible to forge. Suppose a perfect forgery is never spotted, and someone hands it to the bank and collects a gold piece. Who loses?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'bank',
          label: 'The bank. It pays out real gold for a note it never issued and never received anything for',
        },
        {
          id: 'holder',
          label: 'Whoever is holding the fake note when it is discovered',
          feedback:
            'That is who loses if the forgery is caught. In this case it is never caught: the bank treats it as genuine and pays gold for it.',
        },
        {
          id: 'forger',
          label: 'The forger, since counterfeiting is a crime',
          feedback:
            'The forger is the one who gains. Ask instead whose gold leaves the vault when the forged note is exchanged.',
        },
        {
          id: 'nobody',
          label: 'Nobody, as long as the note circulates and is accepted',
          feedback:
            'It circulates because people trust the bank to pay gold for it. Every forgery quietly lowers the gold standing behind each genuine note.',
        },
      ],
      correctOptionId: 'bank',
      explanation:
        'Each genuine note went out in exchange for gold coming in. A forged one is a claim with no matching gold, so it dilutes the reserves behind every real note — counterfeiting steals from the issuer and, little by little, from every honest note holder. That is why issuers fight forgery so hard.',
    },
  ],
  keyTakeaways: [
    'A bank note is a bearer claim, and therefore a liability of the issuer.',
    'A dollar bill is a Federal Reserve note — the same instrument, one issuer.',
    'Notes beat metal on divisibility and portability, which is why they won.',
  ],
});
