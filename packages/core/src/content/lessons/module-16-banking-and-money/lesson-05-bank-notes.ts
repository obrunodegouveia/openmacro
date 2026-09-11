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
  ],
  keyTakeaways: [
    'A bank note is a bearer claim, and therefore a liability of the issuer.',
    'A dollar bill is a Federal Reserve note — the same instrument, one issuer.',
    'Notes beat metal on divisibility and portability, which is why they won.',
  ],
});
