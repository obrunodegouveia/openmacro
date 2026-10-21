import { defineLesson } from '../../schema';

/** Video 10. Leverage as assets over equity, and the asymmetry that a 50% loss can wipe out a bank at 10:3. */
export const kabLeverageLesson = defineLesson({
  id: 'kab-leverage',
  title: 'How Much Loss Can You Survive?',
  subtitle:
    'Leverage makes gains and losses bigger. At 10 to 3, losing half your loans leaves you with negative equity.',
  icon: '📉',
  difficulty: 'core',
  estimatedMinutes: 16,
  video: {
    url: 'https://www.youtube.com/watch?v=8fxilNdEQTo',
    minutes: 9,
    source: 'Khan Academy — Banking 10 (poor audio)',
  },
  challenges: [
    // ---- Olivia warm-ups --------------------------------------------------
    // Sal shows that equity is the cushion that takes a bank’s losses, and how
    // little of it a heavily borrowed bank has. These four do the same with
    // Breno’s Bank and its €10 of equity. They are the last stop on Olivia’s
    // path, so the final one looks back over the whole journey.
    {
      id: 'olivia-bank-cushion',
      type: 'multiple_choice',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'equity'],
      prompt:
        'Breno’s Bank owns €100: coins in the safe and loans. It owes €90 to the people with accounts. How much of the bank is truly Breno’s?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'ten', label: '€10' },
        {
          id: 'hundred',
          label: '€100',
          feedback:
            'The bank owns €100, but €90 of it is owed to the people with accounts. That part is not Breno’s.',
        },
        {
          id: 'ninety',
          label: '€90',
          feedback: '€90 is what the bank owes. Take it away from what it owns: €100 − €90.',
        },
        {
          id: 'oneninety',
          label: '€190',
          feedback: 'What you owe never adds to what is yours. Take it away: €100 − €90.',
        },
      ],
      correctOptionId: 'ten',
      explanation:
        'Own minus owe: €100 − €90 = €10. That €10 is Breno’s equity, the same idea as Olivia’s own equity in lesson 1. Sal calls it the bank’s cushion.',
    },
    {
      id: 'olivia-oven-breaks',
      type: 'multiple_choice',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'equity', 'leverage'],
      prompt:
        'Oh no — Dona Rosa’s oven breaks, and €20 of her loan will never be paid back. Now the bank owns €80 and still owes €90. What is truly Breno’s now?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'minusten', label: '−€10' },
        {
          id: 'ten',
          label: 'Still €10',
          feedback:
            'The bank lost €20 of what it owns, and it still owes the same €90. The loss comes out of Breno’s €10 first.',
        },
        {
          id: 'zero',
          label: 'Exactly €0',
          feedback: '€80 − €90 goes below zero. The loss was bigger than the whole cushion.',
        },
        {
          id: 'eighty',
          label: '€80',
          feedback: '€80 is what the bank owns. Take away the €90 it owes.',
        },
      ],
      correctOptionId: 'minusten',
      explanation:
        '€80 − €90 = −€10. Breno’s €10 cushion is gone, and he cannot pay everybody back. With only €10 of cushion on €100, losing just 10% is enough to wipe it out. That is Sal’s warning about leverage.',
    },
    {
      id: 'olivia-own-owe-words',
      type: 'concept_match',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'equity', 'balance-sheet'],
      prompt: 'Olivia learns the grown-up names for the three things she has used all along. Match each one.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'own',
          term: 'Assets',
          definition: 'What you own that is worth money: Olivia’s guitar and amp, Breno’s coins and loans',
        },
        {
          id: 'owe',
          term: 'Liabilities',
          definition: 'What you owe and must pay back: Olivia’s €40 for the amp, the bank’s accounts',
        },
        {
          id: 'equity',
          term: 'Equity',
          definition: 'What is truly yours: own minus owe, the cushion that takes the first bump',
        },
      ],
      explanation:
        'Assets are what you own, liabilities are what you owe, and equity is what is left. A loss always eats the equity first. Sal’s bank has the same three parts, just with bigger numbers.',
    },
    {
      id: 'olivia-the-big-rule',
      type: 'multiple_choice',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'equity', 'balance-sheet'],
      prompt:
        'Look how far you’ve come! Olivia bought an amp on credit, made a profit at the talent show and put money in a bank. Breno ran a shop and then a bank. Which rule worked for both of them, every single time?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'own-owe', label: 'What is truly yours = what you own − what you owe' },
        {
          id: 'borrow',
          label: 'The more you borrow, the richer you are',
          feedback:
            'Borrowing gave Olivia an amp, but it did not make her richer: she owed €40 for it.',
        },
        {
          id: 'coins',
          label: 'Whoever has the most coins is the richest',
          feedback:
            'Coins are only one thing you can own. Olivia’s guitar and Breno’s loans count too, and so does what you owe.',
        },
        {
          id: 'keep',
          label: 'A bank keeps all the money people put in it',
          feedback:
            'The money in Olivia’s account belongs to her. The bank owes it to her, and lends most of it out.',
        },
      ],
      correctOptionId: 'own-owe',
      explanation:
        'Own minus owe, every time: for a 12-year-old with a guitar, a music shop, a bakery and a bank. That is a balance sheet, the same tool Sal uses for the Bank of Sal. You have finished Olivia’s path!',
    },
    // ---- Sal’s bank ---------------------------------------------------------
    {
      id: 'mc-leverage-definition',
      type: 'multiple_choice',
      tags: ['leverage', 'solvency'],
      xp: 20,
      prompt:
        'The bank owns 1,000 of assets. It paid for them with 700 of borrowed money (deposits) and 300 of the owner’s money (equity). When people say a bank is “levered 10 to 1”, which two numbers are they comparing?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'assets-equity', label: 'Assets to equity: 1,000 to 300, or 10 to 3' },
        {
          id: 'debt-assets',
          label: 'Debt to assets: 700 to 1,000',
          feedback:
            'That is a real ratio, but not the one in “levered 10 to 1”. People usually mean assets to equity. The video also mentions debt to equity, which is 7 to 3 here.',
        },
        {
          id: 'reserves',
          label: 'Reserves to deposits',
          feedback:
            'That is the reserve ratio. It is about paying people today. Leverage is about how much of the owner’s money is there to take losses.',
        },
        {
          id: 'loans-deposits',
          label: 'Loans to deposits',
          feedback:
            'That shows how much a bank lends. It says nothing about the equity that takes the losses.',
        },
      ],
      correctOptionId: 'assets-equity',
      explanation:
        'Leverage tells you how much the bank owns for each euro of the owner’s money. The bank likes high leverage, because every extra asset earns interest. The danger is that losses are multiplied in the same way.',
    },
    {
      id: 'mc-wiped-out',
      type: 'multiple_choice',
      tags: ['leverage', 'insolvency'],
      xp: 30,
      prompt:
        'Half of the loans go bad, so the bank’s assets fall from 1,000 to 500. It still owes 700. What is its equity now, and what does that mean?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'negative',
          label: 'Minus 200: the bank is insolvent and must close',
        },
        {
          id: 'one-fifty',
          label: '150, because equity also falls by 50%',
          feedback:
            'That would be true if the bank had no debt. But the 700 it owes does not go down. So the whole loss comes out of the 300 of equity, and the loss is bigger than the equity.',
        },
        {
          id: 'zero',
          label: 'Zero: the equity is exactly used up',
          feedback:
            'A loss of 300 would use it up exactly. Here the loss is 500, so it goes 200 below zero.',
        },
        {
          id: 'illiquid',
          label: 'Still 300, because this is a cash problem, not a loss',
          feedback:
            'A cash problem is when the bank is short of reserves today. Loans that will never be fully paid back are a loss, and a loss comes straight out of equity.',
        },
      ],
      correctOptionId: 'negative',
      explanation:
        'What the bank owes does not go down when its assets do. 500 − 700 = −200. The bank owes depositors more than everything it owns. That is insolvency, not just a cash problem. At 10 to 3, a 30% loss is enough to get there. At 10 to 1, only 10%.',
    },
    {
      id: 'mc-two-ratios',
      type: 'multiple_choice',
      tags: ['leverage', 'accounting'],
      xp: 25,
      prompt:
        'Sal gives two numbers for the same bank: assets to equity of 10 to 3, and debt to equity of 7 to 3. How are the two numbers connected?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'plusone',
          label: 'Assets to equity is always debt to equity plus one',
        },
        {
          id: 'different',
          label: 'They measure different things, so you cannot get one from the other',
          feedback:
            'They hold exactly the same information. If you know one, you can always work out the other.',
        },
        {
          id: 'double',
          label: 'One of them is about double the other',
          feedback:
            '10/3 is about 3.33 and 7/3 is about 2.33. They differ by exactly one, not by double. Try another bank and the difference is still one.',
        },
        {
          id: 'depends',
          label: 'It depends on what the assets are made of',
          feedback:
            'This link is simple arithmetic and works for any assets. What the assets are only changes how likely you are to lose them.',
        },
      ],
      correctOptionId: 'plusone',
      explanation:
        'Assets = debt + equity. So assets ÷ equity = debt ÷ equity + 1. Here: 10/3 = 7/3 + 1. Both ways are used in real life, and they differ by one. So when someone gives you a leverage number, first ask which one they mean.',
    },
    {
      id: 'mc-wipeout',
      type: 'multiple_choice',
      tags: ['leverage', 'solvency'],
      xp: 30,
      prompt:
        'Sal says a bank with leverage of 10 to 1 is wiped out by a 10% loss on its assets. What is the general rule? And what loss wipes out this bank, at 10 to 3?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'reciprocal',
          label: 'Equity divided by assets: here 3/10, so a 30% loss',
        },
        {
          id: 'fifty',
          label: '50%, because that is the loss used in the video',
          feedback:
            'Sal uses 50% as an example, and it takes the bank 200 below zero, not exactly to zero. The loss that takes equity exactly to zero is smaller.',
        },
        {
          id: 'tenpercent',
          label: '10%, the same for any bank that borrows',
          feedback:
            '10% is the answer for 10 to 1. This bank has 3 of equity for every 10 of assets, not 1. So it can take three times the loss.',
        },
        {
          id: 'leverage',
          label: 'The leverage ratio itself: 10 to 3 means a 3.3% loss',
          feedback:
            'That is the wrong way round. More equity means a bigger cushion. So the more equity a bank has, the bigger the loss it can take.',
        },
      ],
      correctOptionId: 'reciprocal',
      explanation:
        'Equity ÷ assets is 300 ÷ 1,000, which is 30%. Losing 30% of 1,000 (that is 300) leaves exactly nothing. The rule works for any bank. At 20 to 1, a 5% loss wipes it out. At 30 to 1, about 3.3%. The biggest US investment banks were near 30 to 1 before the 2008 crisis.',
    },
    {
      id: 'sim-leverage',
      type: 'interactive_sim',
      tags: ['leverage', 'solvency'],
      xp: 30,
      prompt: 'How much cushion is enough?',
      instructions: 'Try 50 and then 300 of equity. Then find how much equity survives a 50% loss',
      narrative:
        'The bank owns 1,000 of assets. Change how much of that the owner paid with their own money instead of borrowed money. Watch two numbers move: how levered the bank is, and how small a loss leaves it with nothing. Sal’s bank has 300 of equity. The big investment banks in 2007 had only about 30 for every 1,000 of assets.',
      constants: {
        assets: 1000,
      },
      sliders: [
        {
          key: 'equity',
          label: 'Owner’s equity',
          min: 25,
          max: 500,
          step: 25,
          defaultValue: 300,
          format: 'currency',
          hint: 'The rest of the 1,000 is borrowed',
        },
        {
          key: 'lossRate',
          label: 'Loss on the assets',
          min: 0,
          max: 0.5,
          step: 0.05,
          defaultValue: 0.5,
          format: 'percent',
          hint: 'How badly the loans turn out',
        },
      ],
      readouts: [
        {
          key: 'equityAfter',
          label: 'Equity after the loss',
          formulaId: 'equity_after_loss',
          format: 'currency',
          emphasis: true,
          caption: 'Below zero is insolvent',
        },
        {
          key: 'leverage',
          label: 'Leverage',
          formulaId: 'leverage_ratio',
          format: 'multiplier',
          caption: 'Assets for each 1 of equity',
        },
        {
          key: 'wipeout',
          label: 'Loss that wipes it out',
          formulaId: 'wipeout_loss_rate',
          format: 'percent',
          caption: 'Equity / assets',
        },
      ],
      objective: {
        description: 'Try 50 and then 300 of equity. Then find an amount that survives a 50% loss',
        requiredObservations: [{ sliderKey: 'equity', values: [50, 300] }],
        target: { readoutKey: 'equityAfter', comparator: 'gte', value: 0 },
      },
      explanation:
        'With 300 of equity, a 50% loss leaves minus 200, just like in the video. To survive losing half its assets, a bank must pay for half of them (500) with its own money. No bank does that, because it would earn much less on the owner’s money. More leverage means more profit in good years and more danger in bad ones.',
    },
  ],
  keyTakeaways: [
    'Leverage is assets divided by equity. Debt divided by equity is another way to say the same thing.',
    'Losses come out of equity only, because what the bank owes does not go down.',
    'The more leverage a bank has, the smaller the loss that makes it insolvent.',
  ],
});
