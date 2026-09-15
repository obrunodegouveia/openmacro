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
        'The bank controls 1,000 of assets on 300 of equity. What is its leverage, in the sense people mean by "2:1 leverage"?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'assets-equity', label: 'Assets to equity — 1,000 to 300, or 10:3' },
        {
          id: 'debt-assets',
          label: 'Debt to assets — 700 to 1,000',
          feedback:
            'A real ratio, but not the one meant by "10:1 leverage". Assets over equity is the usual convention; debt over equity, here 7:3, is the other one the video mentions.',
        },
        {
          id: 'reserves',
          label: 'Reserves to deposits',
          feedback:
            'That is the reserve ratio, which is about liquidity. Leverage is about how much cushion stands between losses and insolvency.',
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
        'Leverage asks how many assets are being controlled per unit of owner’s money. The bank wants it high, because every extra asset earns the spread; the danger is that the same multiple applies on the way down.',
    },
    {
      id: 'mc-wiped-out',
      type: 'multiple_choice',
      tags: ['leverage', 'insolvency'],
      xp: 30,
      prompt:
        'Assets of 1,000 fall by half to 500. Liabilities are 700. What is equity, and what does that mean?',
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
            'That is what happens with no leverage at all. With liabilities of 700 fixed in place, the entire loss lands on the 300 of equity and then keeps going.',
        },
        {
          id: 'zero',
          label: 'Zero — equity is wiped out exactly',
          feedback:
            'A 300 loss would wipe it out exactly. The loss here is 500, so it goes 200 past the cushion.',
        },
        {
          id: 'illiquid',
          label: 'Still 300 — this is a liquidity problem, not a loss',
          feedback:
            'Reserves being short is a liquidity problem. Loans genuinely worth less than was lent is a loss, and it comes straight out of equity.',
        },
      ],
      correctOptionId: 'negative',
      explanation:
        'Liabilities do not shrink when assets do. At 10:3 leverage a 50% fall destroys the bank; at 10:1 a 10% fall would do it. Leverage is a direct measure of how much bad news you can absorb before your depositors are owed more than you own — and this is insolvency, not illiquidity.',
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
        'A = D + E, so A/E = D/E + 1. Worth knowing because the two conventions are used interchangeably in practice and a factor of one is enough to make a bank sound dramatically safer or riskier than the one you are comparing it with. When someone quotes a leverage number, the first question is always which ratio they mean.',
    },
    {
      id: 'mc-wipeout',
      type: 'multiple_choice',
      tags: ['leverage', 'solvency'],
      xp: 30,
      prompt:
        'Sal says a bank at 10:1 leverage is wiped out by a 10% loss. What is the general rule, and what does it give for this bank at 10:3?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'reciprocal',
          label: 'Equity over assets — here 3/10, so a 30% write-down',
        },
        {
          id: 'fifty',
          label: '50%, since that is the loss the video applies',
          feedback:
            '50% is the loss Sal chooses to illustrate, and it leaves the bank 200 in the hole rather than exactly at zero. The break-even point is lower.',
        },
        {
          id: 'tenpercent',
          label: '10%, which is the same for any levered bank',
          feedback:
            '10% is the answer for 10:1. This bank holds three units of equity per ten of assets rather than one, so it can absorb three times as much.',
        },
        {
          id: 'leverage',
          label: 'The leverage ratio itself: 10:3 means a 3.3% loss',
          feedback:
            'That inverts it. More equity per unit of assets means more cushion, so the wipeout loss rises with equity rather than falling.',
        },
      ],
      correctOptionId: 'reciprocal',
      explanation:
        'Equity divided by assets — 300/1,000 — is 30%, and losing 30% of 1,000 leaves exactly nothing. This single reciprocal is the most portable thing in the whole module: a bank levered 20 times is gone on a 5% write-down, 30 times on 3.3%, and the investment banks of 2008 were running well past 30. You now have the arithmetic of that crisis in one line.',
    },
    {
      id: 'sim-leverage',
      type: 'interactive_sim',
      tags: ['leverage', 'solvency'],
      xp: 30,
      prompt: 'How much cushion is enough?',
      instructions: 'Move the equity down and watch what a small loss starts doing',
      narrative:
        'The bank controls 1,000 of assets. Change how much of that is the owner’s own money rather than borrowed, and watch two numbers move together: how levered it is, and how small a write-down it takes to leave nothing. Sal’s bank sits at 300 of equity. The investment banks of 2007 sat nearer 30.',
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
          label: 'Write-down on the assets',
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
          label: 'Equity after the write-down',
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
          label: 'Write-down that wipes it out',
          formulaId: 'wipeout_loss_rate',
          format: 'percent',
          caption: 'Equity / assets',
        },
      ],
      objective: {
        description: 'Find a capital cushion that survives a 50% write-down',
        requiredObservations: [{ sliderKey: 'equity', values: [50, 300] }],
        target: { readoutKey: 'equityAfter', comparator: 'gte', value: 0 },
      },
      explanation:
        'At 300 of equity a 50% loss leaves minus 200 — the video’s own result. To survive losing half your assets you need to have funded half of them yourself, which no bank does, because a bank funded half by equity earns a fraction of the return on it. That is the trade in one screen: every point of leverage raises the return on the owner’s money in good years and shortens the distance to zero in bad ones.',
    },
  ],
  keyTakeaways: [
    'Leverage is assets over equity; debt over equity is the same idea stated differently.',
    'Losses fall entirely on equity, because liabilities are fixed.',
    'The higher the leverage, the smaller the loss needed to cause insolvency.',
  ],
});
