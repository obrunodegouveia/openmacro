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
        'The bank issues a piece of paper reading "one gold piece". On the bank’s balance sheet, what is it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'liability',
          label: 'A liability — whoever holds it can come back and claim a gold piece',
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
            'An obligation exists the moment it is issued, which is precisely why the bank must keep gold against it.',
        },
      ],
      correctOptionId: 'liability',
      explanation:
        'A bank note is a bearer claim on the issuer. The video’s punchline is that this is not a historical curiosity: a dollar bill is a Federal Reserve note — a liability of the Federal Reserve — and before central banking, individual banks each issued their own, which is why colonial America had dozens of competing currencies.',
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
            'Without this the bank would be redeeming gold against notes it never issued',
        },
        {
          id: 'bearer',
          term: 'Payable to the bearer',
          definition:
            'Anyone holding it can claim the gold, so it changes hands without the bank being involved',
        },
      ],
      explanation:
        'Each property solves a practical problem with using metal directly. Together they turn a vault receipt into something more useful than the thing it is a receipt for — which is why the gold eventually stopped moving at all.',
    },
    {
      id: 'taccount-issue-note',
      type: 't_account_flow',
      tags: ['bank-notes', 'balance-sheets'],
      xp: 35,
      prompt:
        'Villager A has 500 gold pieces on deposit and asks for 100 of it in Bank of Sal notes.',
      instructions: 'Place every posting this operation requires',
      scenario:
        'No gold leaves the vault and nobody lends anything. The villager simply swaps one claim on the bank for another: a balance he can write cheques against becomes paper he can hand over. Post what that does to both sheets.',
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
          ],
        },
        {
          id: 'villager',
          label: 'Villager A',
          tier: 'fiduciary_core',
          role: 'Holds a claim either way',
          openingLines: [{ account: 'Deposit at Bank of Sal', side: 'asset', amount: 500 }],
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
        'Two liabilities trade places and the asset side never moves — which is exactly what happens today when you take cash out of an ATM. Your bank’s deposit liability falls and it hands you a Federal Reserve note instead; the reason it feels like "getting your own money" is that both sides of the swap were always somebody’s promise.',
    },
    {
      id: 'mc-dollar-is-a-note',
      type: 'multiple_choice',
      tags: ['bank-notes', 'central-banking'],
      xp: 25,
      prompt:
        'Sal points out that the thing he has just drawn is in your wallet. A US dollar bill is a Federal Reserve note — so whose liability is it, and what stands behind it?',
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
            'The first half is right. The backing has not been gold since 1971 — the video says so directly, and the assets behind the note are overwhelmingly government debt.',
        },
        {
          id: 'treasury',
          label: 'The Treasury’s liability, since the Treasury prints it',
          feedback:
            'The Bureau of Engraving and Printing does manufacture the paper, but read what is printed on it. The note is issued by, and owed by, the Federal Reserve.',
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
        'Every dollar note is a line item on the Federal Reserve’s balance sheet, and the assets on the other side are mostly Treasuries and mortgage-backed securities. The chain the video is building runs straight to this: Bank of Sal notes backed by gold become central bank notes backed by government debt, and video 17 makes the case that the second is the better collateral.',
    },
    {
      id: 'mc-forgery',
      type: 'multiple_choice',
      tags: ['bank-notes', 'counterfeiting'],
      xp: 25,
      prompt:
        'Sal keeps saying the note must be impossible to forge. Whose problem is a convincing forgery, in the first instance?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'bank',
          label: 'The bank’s. A forged note is a claim on gold the bank never received gold for',
        },
        {
          id: 'holder',
          label: 'Whoever ends up holding it when the fraud is discovered',
          feedback:
            'That is who bears the loss if the forgery is caught. But while it circulates undetected it is a perfectly good claim, and the bank will pay gold against it.',
        },
        {
          id: 'forger',
          label: 'The forger’s, since counterfeiting is a crime',
          feedback:
            'Asking who profits is not the same as asking who loses. Work out which balance sheet shrinks when a forged note is redeemed.',
        },
        {
          id: 'nobody',
          label: 'Nobody’s, as long as it circulates and is accepted',
          feedback:
            'It circulates on the promise that the bank will honour it. Every forgery quietly lowers the reserve ratio behind every genuine note.',
        },
      ],
      correctOptionId: 'bank',
      explanation:
        'Each genuine note went out in exchange for gold coming in. A forged one is a liability with no matching asset, so it dilutes the reserves standing behind every real note in circulation — counterfeiting is theft from the issuer, and from every honest holder by degrees. This is why the right to issue notes was eventually taken away from private banks and given to one institution that could be watched.',
    },
  ],
  keyTakeaways: [
    'A bank note is a bearer claim, and therefore a liability of the issuer.',
    'A dollar bill is a Federal Reserve note — the same instrument, one issuer.',
    'Notes beat metal on divisibility and portability, which is why they won.',
  ],
});
