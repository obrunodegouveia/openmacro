import { defineLesson } from '../../schema';

/**
 * Every figure in this module comes from the H.4.1 release of 3 September
 * 2026, reporting Wednesday 2 September 2026, in millions of dollars. The
 * historical comparisons come from the same series (FRED: WALCL, RRPONTSYD).
 *
 * Dated on purpose. A lesson that says "roughly seven trillion" teaches
 * nothing about reading a release; a lesson that says "6,737,204 on 2
 * September 2026" teaches someone to go and find the next one.
 */
export const h41AnatomyLesson = defineLesson({
  id: 'h41-anatomy',
  title: 'Open the Actual Release',
  subtitle:
    'The Fed publishes its balance sheet every Thursday. Here is how to read the one it published last week.',
  icon: '📄',
  difficulty: 'core',
  estimatedMinutes: 7,
  challenges: [
    {
      id: 'mc-what-is-h41',
      type: 'multiple_choice',
      tags: ['h41', 'central-banking'],
      xp: 10,
      prompt:
        'The Fed publishes a release called H.4.1 every Thursday afternoon. What is in it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'minutes',
          label: 'The minutes of the last policy meeting',
          feedback:
            'Those are published three weeks after each FOMC meeting, and they are prose. The H.4.1 is a table of numbers, published weekly.',
        },
        {
          id: 'balance-sheet',
          label: "The Fed's own balance sheet, as of the previous Wednesday",
        },
        {
          id: 'forecast',
          label: "The Fed's forecast for growth and inflation",
        },
        {
          id: 'bank-deposits',
          label: 'Deposits and lending at commercial banks',
          feedback:
            'That is the H.8 release. Easy to confuse — the Fed publishes both, and they describe different balance sheets: H.8 is the banks, H.4.1 is the Fed.',
        },
      ],
      correctOptionId: 'balance-sheet',
      explanation:
        'H.4.1 is the weekly statement of condition of the Federal Reserve Banks: what the Fed owns, what it owes, and what changed since last week. It is the primary source for everything anyone says about "the Fed’s balance sheet", and it is free.',
    },

    {
      id: 'match-lines',
      type: 'concept_match',
      tags: ['h41', 'balance-sheet'],
      xp: 20,
      prompt: 'Match each line on the release to what it actually is.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'treasuries',
          term: 'U.S. Treasury securities',
          definition:
            'Government debt the Fed bought and still holds — its single largest asset, $4.55 trillion',
        },
        {
          id: 'mbs',
          term: 'Mortgage-backed securities',
          definition:
            'Bundled home loans bought during easing cycles, $1.91 trillion and falling only as they mature',
        },
        {
          id: 'notes',
          term: 'Federal Reserve notes',
          definition:
            'The physical cash in your wallet, carried as a liability of the Fed, $2.43 trillion',
        },
        {
          id: 'reserves',
          term: 'Deposits of depository institutions',
          definition:
            "Commercial banks' accounts at the Fed — reserves — $2.93 trillion",
        },
        {
          id: 'tga',
          term: 'U.S. Treasury, General Account',
          definition:
            "The federal government's own chequing account at the Fed, $944 billion",
        },
      ],
      explanation:
        'Four of these five are liabilities. That is the thing to absorb early: almost everything on the Fed’s balance sheet that people talk about — cash, reserves, the Treasury’s cash pile — is money the Fed owes, not money it has.',
    },

    {
      id: 'mc-which-side',
      type: 'multiple_choice',
      tags: ['reserves', 'balance-sheet'],
      xp: 15,
      prompt:
        'Bank reserves sit on the liability side of the Fed’s balance sheet. Why?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'accounting-quirk',
          label: 'An accounting convention with no real meaning',
          feedback:
            'It has a very concrete meaning: it says who can claim what from whom. Conventions that survive two centuries usually encode something.',
        },
        {
          id: 'owes-banks',
          label: 'A reserve balance is money the Fed owes a commercial bank',
        },
        {
          id: 'fed-borrowed',
          label: 'The Fed borrowed the reserves from banks and must repay them',
          feedback:
            'Close, but backwards. The Fed did not borrow reserves — it created them when it bought assets. They are its liability from the moment they exist, not the trace of a loan it received.',
        },
        {
          id: 'losses',
          label: 'Because the Fed might lose money on them',
        },
      ],
      correctOptionId: 'owes-banks',
      explanation:
        "A reserve balance is a deposit, exactly like the one you hold at your bank — except the depositor is a bank and the bank is the Fed. Your deposit is your asset and your bank's liability. A reserve balance is the bank's asset and the Fed's liability. Same relationship, one tier up.",
    },

    {
      id: 'mc-what-balances',
      type: 'multiple_choice',
      tags: ['h41', 'balance-sheet'],
      xp: 15,
      prompt:
        "On 2 September 2026 the Fed reported total assets of $6,737,204 million and total liabilities of $6,689,488 million. What is the $47,716 million difference?",
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'profit',
          label: 'Profit the Fed made that week',
          feedback:
            'The Fed does earn interest, but its earnings are remitted to the Treasury rather than accumulated. This line is a stock, not a weekly flow.',
        },
        {
          id: 'capital',
          label: "Capital — paid-in capital plus surplus, the Fed's own equity",
        },
        {
          id: 'rounding',
          label: 'Rounding across the twelve Reserve Banks',
          feedback:
            'Forty-eight billion dollars is not a rounding error. The release balances to the dollar; the difference is a real line item.',
        },
        {
          id: 'gold',
          label: 'The gold certificates the Fed holds',
          feedback:
            "Gold certificates are an asset, and only $11,037 million of one. They are already inside the $6.74 trillion.",
        },
      ],
      correctOptionId: 'capital',
      explanation:
        'Assets = liabilities + capital, on the Fed’s sheet as on anyone’s. Its capital is $40,931 million paid in by member banks plus a $6,785 million surplus. Note the scale: $47.7 billion of equity against $6.74 trillion of assets is leverage of about 141 to 1 — a ratio that would be lethal for a commercial bank and is irrelevant for an institution whose liabilities are the definition of money.',
    },
  ],
  keyTakeaways: [
    'H.4.1 is published every Thursday and reports the previous Wednesday. It is the source, not a summary of one.',
    'Most of what people call "the Fed’s balance sheet" is its liability side: cash, reserves and the Treasury’s account.',
    'Reserves are a liability because they are a deposit — a bank’s asset and the Fed’s obligation.',
    'The Fed runs on about $48 billion of capital against $6.7 trillion of assets, and it does not matter, because its liabilities are money.',
  ],
});
