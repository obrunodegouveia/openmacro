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
        'The reserve ratio is reserves divided by what, exactly? The bank has 500 gold and 700 of claims against it.',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'demand',
          label:
            'Demand liabilities — checking accounts and notes outstanding',
        },
        {
          id: 'all-liabilities',
          label: 'Total liabilities of every kind',
          feedback:
            'A ten-year loan taken by the bank is a liability but cannot be demanded tomorrow, so no reserve need sit against it. The ratio is about what could be asked for at once.',
        },
        {
          id: 'assets',
          label: 'Total assets, since reserves are held against what the bank owns',
          feedback:
            'That would measure something closer to leverage. The reserve ratio is about meeting demands, not about solvency.',
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
        '500 over 700 is about 71%, an unusually cautious bank. The denominator matters: only obligations that can come due immediately require liquid cover, which is why the definition says demand liabilities rather than liabilities.',
    },
    {
      id: 'mc-run-vs-solvency',
      type: 'multiple_choice',
      tags: ['bank-run', 'liquidity'],
      xp: 25,
      prompt:
        'Holders of 600 gold pieces of claims all demand metal at once, but the bank holds only 500. Its loans are good. What is the situation?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'liquidity',
          label:
            'A liquidity failure, not an insolvency — the bank is good for the money but not today',
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
            'Eventually is the difficulty. Confidence is what keeps a fractional system standing, and a depositor turned away is how confidence ends.',
        },
        {
          id: 'fraud',
          label: 'Fraud, because the bank promised money it did not hold',
          feedback:
            'The video raises this discomfort honestly and returns to it in the commentary videos — but as a description of the balance sheet, the word for this is illiquid.',
        },
      ],
      correctOptionId: 'liquidity',
      explanation:
        'Solvent but illiquid is the distinction the whole rest of the module depends on. A solvent bank can be destroyed by a run; that is why a lender of last resort is eventually invented. Note also how contagious the failure is — a run on one bank teaches everyone to doubt the buildings that look just like it.',
    },
    {
      id: 'mc-why-demand',
      type: 'multiple_choice',
      tags: ['reserves', 'liquidity'],
      xp: 30,
      prompt:
        'Sal deliberately defines the ratio against demand liabilities rather than total liabilities. Why does a ten year loan the bank itself has taken out need no reserves behind it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'notondemand',
          label: 'Because nobody can ask for it tomorrow. Reserves exist for claims that can arrive without warning',
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
            'Size is not the test. A billion of ten year funding still needs no liquidity buffer; a million of deposits does.',
        },
        {
          id: 'interest',
          label: 'Because it pays interest, and deposits do not',
          feedback:
            'The deposits in this very example pay 5%. The distinction the ratio cares about is maturity, not cost.',
        },
      ],
      correctOptionId: 'notondemand',
      explanation:
        'Reserves answer one question only: can you pay what might be demanded today? A liability with ten years to run cannot be demanded today, so it needs no cash standing behind it. This is the seed of what modern regulators separate into two distinct rules — liquidity coverage against short-dated claims, and capital against losses on any claim at all.',
    },
    {
      id: 'mc-lending-lowers-ratio',
      type: 'multiple_choice',
      tags: ['reserves', 'lending'],
      xp: 30,
      prompt:
        'The bank holds 500 gold against 700 of demand liabilities — about 71%. It now makes another 500 of loans by creating deposits. What is the ratio afterwards?',
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
        '500 / 1,200 is roughly 42%. Every loan a bank makes dilutes its own reserve ratio without a single coin moving, because the loan creates a new claim on the same unchanged pile of gold. That is the mechanism by which a reserve requirement caps lending: not by rationing the gold, but by capping how many promises it may stand behind.',
    },
    {
      id: 'mc-headroom',
      type: 'multiple_choice',
      tags: ['reserves', 'regulation'],
      xp: 25,
      prompt:
        'Sal floats a 20% reserve requirement for this world. With 500 gold in the vault, what is the most the bank could ever owe on demand?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'twofive', label: '2,500 — the gold divided by the requirement' },
        {
          id: 'onek',
          label: '100 — twenty per cent of the 500 it holds',
          feedback:
            'That is the reserve you would hold against 500 of deposits. The question runs the other way: 500 of gold is the 20%, so what is the whole?',
        },
        {
          id: 'sixhundred',
          label: '600 — it already owes 700, so it is over the limit',
          feedback:
            '700 of claims against 500 of gold is a 71% ratio, comfortably above 20%. The bank has a great deal of room left, not none.',
        },
        {
          id: 'fivehundred',
          label: '500 — a bank cannot owe on demand more than it holds',
          feedback:
            'Then there would be no banking. The entire business is owing more on demand than you hold, in the confident expectation that not everyone asks at once.',
        },
      ],
      correctOptionId: 'twofive',
      explanation:
        '500 / 0.20 = 2,500, against the 700 it owes today — so it could create another 1,800 of deposits before the rule bit. Two useful habits come out of this: read the ratio in both directions, and notice that the constraint binds on the *liability* side. The regulator is not telling the bank how much gold to buy; it is telling it how many promises it may sell.',
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
        { id: 'doubt', label: 'Something makes holders want metal instead' },
        { id: 'drain', label: 'Demands pass 500 and the vault empties' },
        { id: 'refuse', label: 'Someone is turned away at the counter', detail: 'A demand deposit that cannot be demanded' },
        { id: 'confidence', label: 'Holders with no reason to worry acquire one' },
        { id: 'fail', label: 'Everyone asks at once and a solvent bank fails' },
      ],
      correctOrder: ['lend', 'doubt', 'drain', 'refuse', 'confidence', 'fail'],
      explanation:
        'The step that does the damage is the fifth, not the third. Running out of gold is survivable — the loans are good and given time they pay. What is not survivable is the counter refusing someone in public, because the only thing holding the other 600 of claims in place was the belief that they could be redeemed. A bank run is a failure of confidence that arrives dressed as a failure of liquidity, which is why the cure has always been to make the refusal impossible: first a reserve bank to lend the gold, later deposit insurance to make asking pointless.',
    },
  ],
  keyTakeaways: [
    'The reserve ratio is reserves over demand liabilities, not over all liabilities.',
    'Illiquid means cannot pay today; insolvent means cannot pay at all.',
    'A run can destroy a perfectly solvent bank.',
  ],
});
