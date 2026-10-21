import { defineLesson } from '../../schema';

/** Video 8. The reserve ratio defined against demand liabilities, and the bank run it exists to prevent. */
export const kabReserveRatiosLesson = defineLesson({
  id: 'kab-reserve-ratios',
  title: 'The Ratio That Sets the Limit',
  subtitle:
    'Gold in the vault divided by what people can ask for today. That number decides how big a bank can grow.',
  icon: '⚖️',
  difficulty: 'core',
  estimatedMinutes: 16,
  video: {
    url: 'https://www.youtube.com/watch?v=VP3nKDUw1jA',
    minutes: 11,
    source: 'Khan Academy — Banking 8',
  },
  challenges: [
    // ---- Olivia warm-ups --------------------------------------------------
    // Sal divides the gold in the vault by what people could ask for today,
    // and shows a run bringing down a bank whose loans are sound. These four
    // do the same at Breno’s Bank, with a rumour going round Olivia’s school.
    {
      id: 'olivia-why-keep-coins',
      type: 'multiple_choice',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'reserves'],
      prompt:
        'Breno lends most of the money at his bank, but he always keeps some coins in the safe. Why?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'ask', label: 'People with accounts can walk in any day and ask for their money' },
        {
          id: 'rich',
          label: 'So the bank looks rich when people visit',
          feedback:
            'Nobody sees inside the safe. The coins are there for a practical reason: paying people who ask.',
        },
        {
          id: 'interest',
          label: 'Coins in the safe earn extra money for Breno',
          feedback:
            'Coins sitting in a safe earn nothing. Breno would earn more by lending them, so he keeps only as many as he needs.',
        },
        {
          id: 'never',
          label: 'Because coins must never leave the safe',
          feedback:
            'Coins leave whenever someone asks for their money. That is exactly why he keeps some there.',
        },
      ],
      correctOptionId: 'ask',
      explanation:
        'An account is money you can ask for at any moment, so Breno keeps enough coins to pay the people who usually come in. Sal’s bank keeps gold in the vault for the same reason.',
    },
    {
      id: 'olivia-reserve-ratio',
      type: 'multiple_choice',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'reserve-ratio'],
      prompt:
        'Say Breno has €20 of coins in the safe, and people with accounts could ask for €100 today. Bankers divide the coins by what people could ask for. What is that ratio?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'twenty', label: '20%' },
        {
          id: 'five',
          label: '5',
          feedback: 'That is upside down: €100 ÷ €20. Put the coins on top: €20 ÷ €100.',
        },
        {
          id: 'eighty',
          label: '80%',
          feedback:
            '€80 is the part that is not in the safe. The ratio is about the coins that are: €20 of €100.',
        },
        {
          id: 'onetwenty',
          label: '€120',
          feedback: 'A ratio divides, it does not add. Try €20 ÷ €100.',
        },
      ],
      correctOptionId: 'twenty',
      explanation:
        '€20 ÷ €100 = 20%. Bankers call it the reserve ratio: coins in the safe over what people could ask for today. Sal calls the bottom number the bank’s demand liabilities.',
    },
    {
      id: 'olivia-rumour',
      type: 'order_flow',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'bank-run'],
      prompt: 'A rumour goes round Olivia’s school. Put what happens at Breno’s Bank in order.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'lend', label: 'Breno lends most of the money and keeps some coins in the safe' },
        { id: 'rumour', label: 'Tomás hears that Breno’s Bank is in trouble', detail: 'It is not true' },
        { id: 'rush', label: 'Lots of families go to ask for their money on the same day' },
        { id: 'empty', label: 'The safe runs out of coins', detail: 'The loans are fine, just not paid back yet' },
        { id: 'wait', label: 'Breno has to ask everyone else to wait', detail: 'Until Dona Rosa pays her loan back' },
      ],
      correctOrder: ['lend', 'rumour', 'rush', 'empty', 'wait'],
      explanation:
        'The rumour was false, but it still emptied the safe, and everyone who came late has to wait for their money. Grown-ups call this a bank run. Sal shows one in the video: what breaks the bank is everybody asking at once, not bad loans.',
    },
    {
      id: 'olivia-run-not-broke',
      type: 'multiple_choice',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'liquidity', 'solvency'],
      prompt:
        'The safe is empty, but Dona Rosa will pay back her whole loan by the end of the year. Is Breno’s Bank broke?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'not-yet', label: 'No — it owns enough, it just cannot pay everyone today' },
        {
          id: 'broke',
          label: 'Yes — an empty safe means the money is gone',
          feedback:
            'The money is not gone: it is in Dona Rosa’s loan, and she is paying it back. It is just not coins yet.',
        },
        {
          id: 'lost',
          label: 'Yes — Olivia’s €50 is lost for ever',
          feedback:
            'Breno still owes Olivia €50 and owns enough to pay it. She may just have to wait.',
        },
        {
          id: 'fine',
          label: 'No — everyone can have their coins today',
          feedback:
            'Not today: the safe is empty. Breno can pay everyone back only once the loans come in.',
        },
      ],
      correctOptionId: 'not-yet',
      explanation:
        'Not having coins today is different from not having enough at all. Breno’s Bank owns more than it owes; the trouble is only timing. Sal makes the same point: a run can bring down a bank whose loans are perfectly good.',
    },
    // ---- Sal’s bank ---------------------------------------------------------
    {
      id: 'mc-denominator',
      type: 'multiple_choice',
      tags: ['reserve-ratio', 'liquidity'],
      xp: 25,
      prompt:
        'The bank has 500 gold pieces of reserves. Its depositors and note holders could ask for 700 at any moment. The reserve ratio is the reserves divided by what?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'demand',
          label:
            'Demand liabilities: deposits and notes that people can ask for at any moment',
        },
        {
          id: 'all-liabilities',
          label: 'Total liabilities of every kind',
          feedback:
            'A ten-year loan that the bank took is a liability. But nobody can ask for it tomorrow, so it needs no reserves. The ratio is about what people can ask for straight away.',
        },
        {
          id: 'assets',
          label: 'Total assets, because reserves are kept for what the bank owns',
          feedback:
            'That tells you how much of what the bank owns is gold. It does not tell you if the bank can pay what people ask for today. The reserve ratio is about that.',
        },
        {
          id: 'equity',
          label: 'Equity, the owner’s cushion against losses',
          feedback:
            'That tells you nothing about paying depositors. Equity is what is left for the owner after everyone else is paid.',
        },
      ],
      correctOptionId: 'demand',
      explanation:
        '500 divided by 700 is about 71%. That is a very careful bank. The bottom number matters. Only debts that people can ask for right now need cash ready, so the ratio uses demand liabilities, not all liabilities.',
    },
    {
      id: 'mc-run-vs-solvency',
      type: 'multiple_choice',
      tags: ['bank-run', 'liquidity'],
      xp: 25,
      prompt:
        'People with 600 gold pieces in deposits and notes all ask for their gold at once. The bank has only 500. Its loans are good and will be paid back in time. What is the bank’s situation?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'liquidity',
          label:
            'A liquidity problem: the bank can pay everyone in time, but not today',
        },
        {
          id: 'insolvent',
          label: 'Insolvency: the bank can never pay what it owes',
          feedback:
            'Insolvent means the bank owns less than it owes. Here the loans are good. The bank just cannot turn them into gold today.',
        },
        {
          id: 'fine',
          label: 'No problem, because the loans will be paid back one day',
          feedback:
            '“One day” is the problem. A bank only works while people trust it. When someone is sent away without their money, that trust breaks.',
        },
        {
          id: 'fraud',
          label: 'Fraud, because the bank promised money it did not hold',
          feedback:
            'Sal does feel uneasy about this, and he comes back to it in his last videos. But the word for this balance sheet is illiquid.',
        },
      ],
      correctOptionId: 'liquidity',
      explanation:
        'The bank is solvent but illiquid: it owns enough, but it cannot pay everyone today. A bank run can still destroy it. That is why a lender of last resort (a bank that lends to banks in trouble) was invented later. A run can also spread: when one bank fails, people start to doubt similar banks.',
    },
    {
      id: 'mc-why-demand',
      type: 'multiple_choice',
      tags: ['reserves', 'liquidity'],
      xp: 30,
      prompt:
        'Sal measures the ratio against demand liabilities only, not all liabilities. Suppose the bank itself borrowed money for ten years. Why does that loan need no reserves?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'notondemand',
          label: 'Because nobody can ask for that money back tomorrow',
        },
        {
          id: 'notdebt',
          label: 'Because money the bank borrowed is not really owed in the same way',
          feedback:
            'It is a real debt, just like a deposit. The difference is when it can be asked for, not whether it is owed.',
        },
        {
          id: 'smaller',
          label: 'Because that kind of borrowing is small compared with deposits',
          feedback:
            'Size does not matter here. A billion borrowed for ten years still needs no reserves. A million in demand deposits does.',
        },
        {
          id: 'interest',
          label: 'Because it pays interest, and deposits do not',
          feedback:
            'Deposits can pay interest too. Sal’s bank paid 5% in the first video. The ratio cares about when the money can be asked for, not what it costs.',
        },
      ],
      correctOptionId: 'notondemand',
      explanation:
        'Reserves answer one question: can the bank pay what people may ask for today? A debt that is due in ten years cannot be asked for today, so it needs no cash ready. Today’s regulators use two separate rules: liquidity rules for money due soon, and capital rules for losses on what the bank owns.',
    },
    {
      id: 'mc-lending-lowers-ratio',
      type: 'multiple_choice',
      tags: ['reserves', 'lending'],
      xp: 30,
      prompt:
        'The bank has 500 of gold and 700 of demand liabilities, a ratio of about 71%. Now it makes another 500 of loans by creating new deposits for the borrowers. What is the ratio after that?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'fortytwo',
          label: 'About 42% — 500 of gold against 1,200 of demand liabilities' },
        {
          id: 'unchanged',
          label: 'Still 71%, because no gold left the vault',
          feedback:
            'No gold left, so the top number stays at 500. The bottom number changed: people can now ask for 1,200 against the same 500.',
        },
        {
          id: 'higher',
          label: 'Higher, because the bank now has 500 more of assets',
          feedback:
            'The new asset is a loan, not gold. Only gold counts as reserves. You cannot hand a loan to a depositor who wants gold.',
        },
        {
          id: 'hundred',
          label: 'About 100%, because assets and liabilities both went up by 500',
          feedback:
            'The ratio is not assets divided by liabilities. It is gold divided by demand liabilities.',
        },
      ],
      correctOptionId: 'fortytwo',
      explanation:
        '500 divided by 1,200 is about 42%. Each new loan lowers the ratio, even though no coin moves. That is because each loan adds a new promise on the same pile of gold. So a reserve requirement limits lending by limiting how many promises the gold can cover.',
    },
    {
      id: 'mc-headroom',
      type: 'multiple_choice',
      tags: ['reserves', 'regulation'],
      xp: 25,
      prompt:
        'Suppose the reserve requirement is 20%. The bank has 500 of gold in the vault. What is the most it is allowed to owe in demand liabilities?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'twofive', label: '2,500 — the gold divided by the requirement' },
        {
          id: 'onek',
          label: '100, which is 20% of the 500 it has',
          feedback:
            'That is the reserve you would need for 500 of deposits. The question goes the other way: the 500 of gold is the 20%. So what is 100%?',
        },
        {
          id: 'sixhundred',
          label: 'No more, because it already owes 700 with only 500 of gold, so it is over the limit',
          feedback:
            '500 of gold for 700 of demand liabilities is a 71% ratio. That is far above 20%. The bank still has a lot of room.',
        },
        {
          id: 'fivehundred',
          label: '500, because a bank cannot owe on demand more than it has',
          feedback:
            'Then there would be no fractional reserve banking. Banks owe more on demand than they hold, because not everyone asks at once.',
        },
      ],
      correctOptionId: 'twofive',
      explanation:
        '500 divided by 0.20 is 2,500. Today it owes 700, so it could create another 1,800 of deposits before it reaches the limit. Notice that the rule limits what the bank owes. It does not tell the bank how much gold to buy. It tells the bank how many promises it can make.',
    },
    {
      id: 'order-bank-run',
      type: 'order_flow',
      tags: ['bank-run', 'liquidity', 'confidence'],
      xp: 30,
      prompt: 'Put the steps of the bank run from the video in order.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'lend', label: 'The bank lends by creating deposits', detail: 'People can ask for 700, and there are 500 of gold' },
        { id: 'doubt', label: 'Something makes depositors and note holders want their gold' },
        { id: 'drain', label: 'People ask for more than 500 and the vault is empty' },
        { id: 'refuse', label: 'Someone is sent away without their gold', detail: 'They asked for a deposit they were told they could have any time' },
        { id: 'confidence', label: 'People who were calm now start to worry too' },
        { id: 'fail', label: 'Everyone asks at once, and a bank that owns enough still fails' },
      ],
      correctOrder: ['lend', 'doubt', 'drain', 'refuse', 'confidence', 'fail'],
      explanation:
        'The real damage comes from lost trust, not from the empty vault. A bank can survive running out of gold, because its loans are good and will be paid back. It cannot survive sending someone away in public. People only left their money there because they believed they could get it. That is why later fixes stop the refusal from happening: first a reserve bank that lends gold, later deposit insurance.',
    },
  ],
  keyTakeaways: [
    'The reserve ratio is reserves divided by demand liabilities (what people can ask for today), not by all liabilities.',
    'Illiquid means the bank cannot pay today. Insolvent means it cannot pay at all.',
    'A bank run can bring down a bank that is solvent (one that owns more than it owes).',
  ],
});
