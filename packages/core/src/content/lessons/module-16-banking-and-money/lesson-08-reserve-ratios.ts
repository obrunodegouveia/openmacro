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
