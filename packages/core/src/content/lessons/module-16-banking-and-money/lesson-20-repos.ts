import { defineLesson } from '../../schema';

/** Video 20. The repo explained through a pawned watch: a collateralised loan dressed as a sale and a promise to buy back. */
export const kabReposLesson = defineLesson({
  id: 'kab-repos',
  title: 'A Loan Dressed as a Sale',
  subtitle:
    'Pawn a watch and you hand over collateral. Sell it with a promise to buy it back and you have invented the repo.',
  icon: '⌚',
  difficulty: 'core',
  estimatedMinutes: 16,
  video: {
    url: 'https://www.youtube.com/watch?v=QWninXOAMXE',
    minutes: 11,
    source: 'Khan Academy — repurchase agreements',
  },
  challenges: [
    {
      id: 'mc-what-differs',
      type: 'multiple_choice',
      tags: ['repo', 'collateral'],
      xp: 25,
      prompt:
        'Economically a repo is identical to a collateralised loan. What is the actual difference?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'ownership',
          label:
            'Legal ownership of the collateral genuinely transfers to the lender for the duration',
        },
        {
          id: 'interest',
          label: 'A repo charges no interest',
          feedback:
            'It does — buried in the price. The borrower repurchases for more than was paid, and the difference is the interest.',
        },
        {
          id: 'no-collateral',
          label: 'A repo needs no collateral',
          feedback:
            'The collateral is the whole structure. It has simply been sold rather than pledged.',
        },
        {
          id: 'longer',
          label: 'A repo runs for years rather than days',
          feedback:
            'Repos are typically very short — often overnight. Duration is not what distinguishes them.',
        },
      ],
      correctOptionId: 'ownership',
      explanation:
        'The pawnbroker analogy makes the motive plain: the lender wants unambiguous title, not a claim to be argued over later. In a default there is no seizing to be done — the lender already owns the asset. That is why the central bank lends through repos at the discount window rather than taking a pledge.',
    },
    {
      id: 'order-repo',
      type: 'order_flow',
      tags: ['repo', 'discount-window'],
      xp: 25,
      prompt: 'Put a repo with the central bank in order.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'need', label: 'A bank needs cash', detail: 'It holds treasuries but will not dump them into a falling market' },
        { id: 'print', label: 'The central bank creates reserves', detail: 'With notes outstanding as the matching liability' },
        { id: 'sell', label: 'The bank sells its treasuries to the central bank', detail: 'Title genuinely transfers' },
        { id: 'cash', label: 'The bank receives the cash it needed' },
        { id: 'buyback', label: 'Later, the bank repurchases the same treasuries', detail: 'At a higher price' },
        { id: 'interest', label: 'The price difference is the interest', detail: 'Set by the discount rate' },
      ],
      correctOrder: ['need', 'print', 'sell', 'cash', 'buyback', 'interest'],
      explanation:
        'From the other side it is a reverse repo. The structure lets a bank turn illiquid-but-sound assets into cash without selling them into a market that is not paying what they are worth — which is exactly the situation a liquidity crisis creates.',
    },
  ],
  keyTakeaways: [
    'A repo is a sale plus a binding agreement to buy back at a higher price.',
    'The difference in price is the interest.',
    'Legal title transfers, which is why lenders prefer it to a pledge.',
  ],
});
