import { defineLesson } from '../../schema';

/** Video 10. Leverage as assets over equity, and the asymmetry that a 50% loss can wipe out a bank at 10:3. */
export const kabLeverageLesson = defineLesson({
  id: 'kab-leverage',
  title: 'How Much Loss Can You Survive?',
  subtitle:
    'Leverage multiplies gains and losses alike. At 10:3, losing half your loans leaves you with negative equity.',
  icon: '📉',
  difficulty: 'core',
  estimatedMinutes: 16,
  video: {
    url: 'https://www.youtube.com/watch?v=8fxilNdEQTo',
    minutes: 9,
    source: 'Khan Academy — Banking 10 (poor audio)',
  },
  challenges: [
    {
      id: 'mc-leverage-definition',
      type: 'multiple_choice',
      tags: ['leverage', 'solvency'],
      xp: 20,
      prompt:
        'The bank holds 1,000 of assets, paid for with 700 of borrowed money (deposits) and 300 of the owner’s equity. When people say a bank is "levered 10 to 1", which two numbers are they comparing?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'assets-equity', label: 'Assets to equity — 1,000 to 300, or 10:3' },
        {
          id: 'debt-assets',
          label: 'Debt to assets — 700 to 1,000',
          feedback:
            'A real ratio, but not the one meant by "levered 10 to 1". Assets over equity is the usual convention; debt over equity, here 7:3, is the other one the video mentions.',
        },
        {
          id: 'reserves',
          label: 'Reserves to deposits',
          feedback:
            'That is the reserve ratio, which is about liquidity. Leverage is about how much of the owner’s money stands between losses and insolvency.',
        },
        {
          id: 'loans-deposits',
          label: 'Loans to deposits',
          feedback:
            'Useful for judging how aggressively a bank lends, but it says nothing about the equity absorbing the losses.',
        },
      ],
      correctOptionId: 'assets-equity',
      explanation:
        'Leverage asks how many assets the bank holds for each unit of the owner’s money. The bank wants it high, because every extra asset earns the spread; the danger is that the same multiple applies to losses.',
    },
    {
      id: 'mc-wiped-out',
      type: 'multiple_choice',
      tags: ['leverage', 'insolvency'],
      xp: 30,
      prompt:
        'Half the loans go bad, and the bank’s assets fall from 1,000 to 500. It still owes 700. What is its equity now, and what does that mean?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'negative',
          label: 'Minus 200 — the bank is insolvent and out of business',
        },
        {
          id: 'one-fifty',
          label: '150 — equity falls by the same 50%',
          feedback:
            'That is what would happen with no debt at all. But the 700 owed does not shrink, so the whole loss lands on the 300 of equity — and the loss is bigger than the equity.',
        },
        {
          id: 'zero',
          label: 'Zero — equity is exactly wiped out',
          feedback:
            'A loss of 300 would wipe it out exactly. The loss here is 500, so it goes 200 beyond the equity.',
        },
        {
          id: 'illiquid',
          label: 'Still 300 — this is a liquidity problem, not a loss',
          feedback:
            'Being short of reserves is a liquidity problem. Loans that will never be repaid in full are a loss, and the loss comes straight out of equity.',
        },
      ],
      correctOptionId: 'negative',
      explanation:
        'Liabilities do not shrink when assets do. 500 − 700 = −200: the bank owes its depositors more than everything it owns. That is insolvency, not illiquidity. At 10:3 leverage it takes a 30% loss to get there; at 10:1, just 10%.',
    },
    {
      id: 'mc-two-ratios',
      type: 'multiple_choice',
      tags: ['leverage', 'accounting'],
      xp: 25,
      prompt:
        'Sal gives two numbers for the same bank: 10:3 assets to equity, and 7:3 debt to equity. How are they related?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'plusone',
          label: 'Assets to equity is always debt to equity plus one',
        },
        {
          id: 'different',
          label: 'They measure different things and cannot be converted',
          feedback:
            'They contain exactly the same information. If you know one and the balance sheet identity, you can always produce the other.',
        },
        {
          id: 'double',
          label: 'One of them is roughly double the other',
          feedback:
            '10/3 is about 3.33 and 7/3 is about 2.33 — a difference of exactly one, not a factor of two. Try it on another bank and the gap stays one.',
        },
        {
          id: 'depends',
          label: 'It depends on what the assets are made of',
          feedback:
            'The relationship is pure accounting and holds whatever the assets are. What they are made of decides how likely you are to lose them, not this identity.',
        },
      ],
      correctOptionId: 'plusone',
      explanation:
        'Assets = debt + equity, so assets/equity = debt/equity + 1. Here: 10/3 = 7/3 + 1. Worth knowing because both conventions are used in practice, and a difference of one can make a bank sound safer or riskier than the one you compare it with. When someone quotes a leverage number, first ask which ratio they mean.',
    },
    {
      id: 'mc-wipeout',
      type: 'multiple_choice',
      tags: ['leverage', 'solvency'],
      xp: 30,
      prompt:
        'Sal says a bank at 10:1 leverage is wiped out by a 10% loss on its assets. What is the general rule, and what loss wipes out this bank at 10:3?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'reciprocal',
          label: 'Equity divided by assets — here 3/10, so a 30% loss',
        },
        {
          id: 'fifty',
          label: '50%, since that is the loss the video applies',
          feedback:
            '50% is the loss Sal chooses as an example, and it leaves the bank 200 below zero rather than exactly at zero. The loss that takes equity to exactly zero is smaller.',
        },
        {
          id: 'tenpercent',
          label: '10%, which is the same for any bank that borrows',
          feedback:
            '10% is the answer for 10:1. This bank holds three units of equity per ten of assets rather than one, so it can absorb three times as much.',
        },
        {
          id: 'leverage',
          label: 'The leverage ratio itself: 10:3 means a 3.3% loss',
          feedback:
            'That gets it backwards. More equity per unit of assets means more cushion, so the loss needed to wipe the bank out gets bigger as equity grows, not smaller.',
        },
      ],
      correctOptionId: 'reciprocal',
      explanation:
        'Equity divided by assets — 300/1,000 — is 30%, and losing 30% of 1,000 (300) leaves exactly nothing. This one rule travels everywhere: a bank levered 20 to 1 is wiped out by a 5% loss, one levered 30 to 1 by about 3.3%, and the largest US investment banks were running at around 30 to 1 before 2008. That is the arithmetic of that crisis in one line.',
    },
    {
      id: 'sim-leverage',
      type: 'interactive_sim',
      tags: ['leverage', 'solvency'],
      xp: 30,
      prompt: 'How much cushion is enough?',
      instructions: 'Try 50 and 300 of equity, then find how much equity survives a 50% loss',
      narrative:
        'The bank holds 1,000 of assets. Change how much of that was paid for with the owner’s own money rather than borrowed money, and watch two numbers move together: how levered the bank is, and how small a loss it takes to leave nothing. Sal’s bank has 300 of equity. The big investment banks of 2007 had nearer 30 per 1,000 of assets.',
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
          caption: 'Assets per unit of equity',
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
        description: 'Try 50 and 300 of equity, then find an amount that survives a 50% loss',
        requiredObservations: [{ sliderKey: 'equity', values: [50, 300] }],
        target: { readoutKey: 'equityAfter', comparator: 'gte', value: 0 },
      },
      explanation:
        'At 300 of equity a 50% loss leaves minus 200 — the video’s own result. To survive losing half your assets you need to have paid for half of them (500) with your own money. No bank does that, because a bank funded half by equity earns a much lower return on that equity. That is the trade-off in one screen: more leverage raises the return on the owner’s money in good years and brings zero closer in bad ones.',
    },
  ],
  keyTakeaways: [
    'Leverage is assets over equity; debt over equity is the same idea stated differently.',
    'Losses fall entirely on equity, because liabilities are fixed.',
    'The higher the leverage, the smaller the loss needed to cause insolvency.',
  ],
});
