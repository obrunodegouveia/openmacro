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
  ],
  keyTakeaways: [
    'Leverage is assets over equity; debt over equity is the same idea stated differently.',
    'Losses fall entirely on equity, because liabilities are fixed.',
    'The higher the leverage, the smaller the loss needed to cause insolvency.',
  ],
});
