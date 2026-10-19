import { defineLesson } from '../../schema';

/** Video 8. The reserve ratio defined against demand liabilities, and the bank run it exists to prevent. */
export const kabReserveRatiosLesson = defineLesson({
  id: 'kab-reserve-ratios',
  title: 'The Ratio That Sets the Limit',
  subtitle:
    'Gold in the vault over claims that can be demanded today. That fraction decides how big a bank may become.',
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
        'The bank holds 500 gold pieces of reserves. Its depositors and note holders could ask for 700 at any moment. The reserve ratio is reserves divided by what?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'demand',
          label:
            'Demand liabilities — deposits and notes that can be claimed at any moment',
        },
        {
          id: 'all-liabilities',
          label: 'Total liabilities of every kind',
          feedback:
            'A ten-year loan the bank has taken is a liability, but nobody can demand it tomorrow, so no reserves are needed for it. The ratio is about what could be asked for at once.',
        },
        {
          id: 'assets',
          label: 'Total assets, since reserves are held against what the bank owns',
          feedback:
            'That would tell you what share of the bank’s assets is gold, not whether it can pay what may be demanded today. The reserve ratio is about meeting demands for cash.',
        },
        {
          id: 'equity',
          label: 'Equity, the owner’s cushion against loss',
          feedback:
            'Reserves against equity would tell you nothing about whether depositors can be paid — equity is what is left over after they have been.',
        },
      ],
      correctOptionId: 'demand',
      explanation:
        '500 over 700 is about 71%, an unusually cautious bank. The denominator matters: only debts that can be claimed immediately need cash ready to cover them, which is why the definition says demand liabilities rather than all liabilities.',
    },
    {
      id: 'mc-run-vs-solvency',
      type: 'multiple_choice',
      tags: ['bank-run', 'liquidity'],
      xp: 25,
      prompt:
        'People holding 600 gold pieces’ worth of deposits and notes all ask for gold at once, but the bank holds only 500. Its loans are sound and will be repaid in time. What is the situation?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'liquidity',
          label:
            'A liquidity problem, not insolvency — the bank can pay everyone in time, but not today',
        },
        {
          id: 'insolvent',
          label: 'Insolvency — it cannot pay what it owes',
          feedback:
            'Insolvency means assets are worth less than liabilities. Here the loans are sound; the bank simply cannot turn them into gold this afternoon.',
        },
        {
          id: 'fine',
          label: 'No problem, since the loans will be repaid eventually',
          feedback:
            '"Eventually" is the problem. Confidence is what keeps a fractional reserve system standing, and a depositor turned away at the counter is how confidence ends.',
        },
        {
          id: 'fraud',
          label: 'Fraud, because the bank promised money it did not hold',
          feedback:
            'The video admits this discomfort and returns to it in Sal’s commentary videos — but as a description of the balance sheet, the word for this is illiquid.',
        },
      ],
      correctOptionId: 'liquidity',
      explanation:
        'Solvent but illiquid is a distinction the rest of the module depends on. A solvent bank can be destroyed by a run; that is why a lender of last resort is eventually invented. Note also how contagious the failure is — a run on one bank teaches everyone to doubt every bank that looks like it.',
    },
    {
      id: 'mc-why-demand',
      type: 'multiple_choice',
      tags: ['reserves', 'liquidity'],
      xp: 30,
      prompt:
        'Sal deliberately measures the ratio against demand liabilities rather than all liabilities. Why does a ten-year loan that the bank itself has taken out need no reserves behind it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'notondemand',
          label: 'Because nobody can ask for that money back tomorrow. Reserves exist for claims that can arrive without warning',
        },
        {
          id: 'notdebt',
          label: 'Because money the bank borrowed is not really owed in the same way',
          feedback:
            'It is owed just as genuinely, and it counts fully against solvency. What makes it different is when it can be demanded, not whether.',
        },
        {
          id: 'smaller',
          label: 'Because such borrowings are small compared with deposits',
          feedback:
            'Size is not the test. A billion borrowed for ten years still needs no reserves; a million of demand deposits does.',
        },
        {
          id: 'interest',
          label: 'Because it pays interest, and deposits do not',
          feedback:
            'Deposits can pay interest too — Sal’s paid 5% in the first video. What the ratio cares about is when the money can be claimed, not what it costs.',
        },
      ],
      correctOptionId: 'notondemand',
      explanation:
        'Reserves answer one question only: can you pay what might be demanded today? A debt that is not due for ten years cannot be demanded today, so it needs no cash standing behind it. This is the seed of two separate rules that modern regulators use: liquidity rules for claims that can come due soon, and capital rules for losses on the bank’s assets.',
    },
    {
      id: 'mc-lending-lowers-ratio',
      type: 'multiple_choice',
      tags: ['reserves', 'lending'],
      xp: 30,
      prompt:
        'The bank holds 500 gold against 700 of demand liabilities — a ratio of about 71%. It now makes another 500 of loans by creating new deposits for the borrowers. What is the ratio afterwards?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'fortytwo',
          label: 'About 42% — 500 of gold against 1,200 of demand liabilities' },
        {
          id: 'unchanged',
          label: 'Still 71%, because no gold left the vault',
          feedback:
            'No gold left, which is why the numerator is unchanged. The denominator is what moved: there are now 1,200 of claims on that same 500.',
        },
        {
          id: 'higher',
          label: 'Higher, because the bank now has 500 more of assets',
          feedback:
            'The new asset is a loan, not gold. Only gold counts as reserves, and loans cannot be handed to a depositor who wants metal.',
        },
        {
          id: 'hundred',
          label: 'About 100%, since assets and liabilities both rose by 500',
          feedback:
            'The ratio is not assets over liabilities — that would be a solvency question. It is *gold* over demand liabilities.',
        },
      ],
      correctOptionId: 'fortytwo',
      explanation:
        '500 / 1,200 is about 42%. Every loan a bank makes lowers its own reserve ratio without a single coin moving, because the loan creates a new claim on the same pile of gold. That is how a reserve requirement limits lending: not by rationing the gold, but by limiting how many promises the gold may stand behind.',
    },
    {
      id: 'mc-headroom',
      type: 'multiple_choice',
      tags: ['reserves', 'regulation'],
      xp: 25,
      prompt:
        'Suppose the reserve requirement is 20%. With 500 gold in the vault, what is the most the bank may owe in demand liabilities?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'twofive', label: '2,500 — the gold divided by the requirement' },
        {
          id: 'onek',
          label: '100 — twenty per cent of the 500 it holds',
          feedback:
            'That is the reserve you would need against 500 of deposits. The question runs the other way: the 500 of gold is the 20%, so what is the whole?',
        },
        {
          id: 'sixhundred',
          label: 'Nothing more — it already owes 700 against 500 of gold, so it is over the limit',
          feedback:
            '700 of demand liabilities against 500 of gold is a 71% ratio, comfortably above 20%. The bank has a great deal of room left, not none.',
        },
        {
          id: 'fivehundred',
          label: '500 — a bank cannot owe on demand more than it holds',
          feedback:
            'Then there would be no fractional reserve banking. The whole business is owing more on demand than you hold, expecting that not everyone asks at once.',
        },
      ],
      correctOptionId: 'twofive',
      explanation:
        '500 / 0.20 = 2,500, against the 700 it owes today — so it could create another 1,800 of deposits before hitting the rule. Two useful habits come out of this: read the ratio in both directions, and notice that the limit applies to the *liability* side. The regulator is not telling the bank how much gold to buy; it is telling it how many promises it may make.',
    },
    {
      id: 'order-bank-run',
      type: 'order_flow',
      tags: ['bank-run', 'liquidity', 'confidence'],
      xp: 30,
      prompt: 'Put the bank run the video describes in order.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'lend', label: 'The bank lends by creating deposits', detail: '700 of claims against 500 of gold' },
        { id: 'doubt', label: 'Something makes depositors and note holders want gold instead' },
        { id: 'drain', label: 'Requests for gold pass 500 and the vault runs dry' },
        { id: 'refuse', label: 'Someone is turned away at the counter', detail: 'A demand deposit that cannot be demanded' },
        { id: 'confidence', label: 'People who had no reason to worry now have one' },
        { id: 'fail', label: 'Everyone asks at once and a solvent bank fails' },
      ],
      correctOrder: ['lend', 'doubt', 'drain', 'refuse', 'confidence', 'fail'],
      explanation:
        'The step that does the damage is the loss of confidence, not the empty vault. Running out of gold is survivable — the loans are good and, given time, they are repaid. What is not survivable is the counter refusing someone in public, because the only thing keeping everyone else’s claims in place was the belief that they could be paid. A bank run is a loss of confidence that looks like a shortage of cash, which is why the cure has always been to make the refusal impossible: first a reserve bank to lend the gold, later deposit insurance to make queuing pointless.',
    },
  ],
  keyTakeaways: [
    'The reserve ratio is reserves over demand liabilities, not over all liabilities.',
    'Illiquid means cannot pay today; insolvent means cannot pay at all.',
    'A run can destroy a perfectly solvent bank.',
  ],
});
