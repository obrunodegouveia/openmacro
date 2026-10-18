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
        'Economically, a repo works just like a loan backed by collateral. What is the actual difference?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'ownership',
          label:
            'In a repo, the lender becomes the legal owner of the collateral',
        },
        {
          id: 'interest',
          label: 'A repo charges no interest, only a fee for the service',
          feedback:
            'It does charge interest — hidden in the price. The borrower buys the asset back for more than it was sold for, and the difference is the interest.',
        },
        {
          id: 'no-collateral',
          label: 'A repo needs no collateral, resting on the borrower’s credit',
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
        'The pawnbroker analogy makes the motive plain: the lender wants clear ownership, not a claim to be argued over later. If the borrower defaults there is nothing to seize — the lender already owns the asset. Sal presents central bank lending this way; in practice the Fed’s discount window lends against pledged collateral, while repos are what the Fed uses in its open market operations.',
    },
    {
      id: 'order-repo',
      type: 'order_flow',
      tags: ['repo', 'discount-window'],
      xp: 25,
      prompt: 'Put a repo with the central bank in order, as the video draws it.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'need', label: 'A bank needs cash', detail: 'It holds Treasuries but does not want to sell them cheaply in a falling market' },
        { id: 'print', label: 'The central bank agrees to lend and creates new reserves to pay with', detail: 'A new liability for the central bank' },
        { id: 'sell', label: 'The bank sells its Treasuries to the central bank', detail: 'Ownership really transfers' },
        { id: 'cash', label: 'The bank receives the cash it needed' },
        { id: 'buyback', label: 'Later, the bank buys the same Treasuries back', detail: 'At a higher price' },
        { id: 'interest', label: 'The price difference is the interest', detail: 'In the video, set by the discount rate' },
      ],
      correctOrder: ['need', 'print', 'sell', 'cash', 'buyback', 'interest'],
      explanation:
        'Seen from the central bank’s side, it is a reverse repo. The structure lets a bank turn sound assets into cash without selling them into a market that is not paying what they are worth — which is exactly the situation a liquidity crisis creates.',
    },
    {
      id: 'mc-repo-or-reverse',
      type: 'multiple_choice',
      tags: ['repo', 'terminology'],
      xp: 25,
      prompt:
        'You sell Sal your watch for cash and agree to buy it back later at a higher price. Sal ends up holding the watch; you end up holding the cash. Who is doing a repo and who is doing a reverse repo?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'seller',
          label: 'You are doing the repo, since you sold and will buy back. Sal is doing the reverse repo',
        },
        {
          id: 'lender',
          label: 'Sal is doing the repo, since he lent the money',
          feedback:
            'The name follows the asset, not the cash. The side that sells the asset and agrees to buy it back is the one doing the repurchase.',
        },
        {
          id: 'both',
          label: 'Both are doing a repo — the word describes the trade, not a side of it',
          feedback:
            'It is one trade with two names precisely so you can tell which side someone is on. A report saying "the Fed did reverse repos" only means something once you know whose side the name describes.',
        },
        {
          id: 'neither',
          label: 'Neither. A repo needs a third party to hold the collateral',
          feedback:
            'Tri-party repo does exist and involves a custodian. The bilateral version Sal describes is a repo in its own right.',
        },
      ],
      correctOptionId: 'seller',
      explanation:
        'Repo is short for repurchase agreement, so the repo side is whoever does the repurchasing — the one who starts with the asset, hands it over for cash, and buys it back. The cash lender is on the reverse repo side. One trap when you read about the Fed: it names its operations from the other side’s point of view. In its "reverse repo" facility the Fed *sells* securities to money market funds overnight and buys them back, which drains reserves.',
    },
    {
      id: 'mc-why-ownership-matters',
      type: 'multiple_choice',
      tags: ['repo', 'collateral', 'bankruptcy'],
      xp: 35,
      prompt:
        'Sal lends you 10,000 and holds your watch, worth about 30,000. Economically, a pawn and a repo are the same, but Sal wants to own the watch outright. What does that get him if you never come back?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'sell',
          label: 'He can sell the watch that morning, instead of queuing behind your other creditors',
        },
        {
          id: 'moreworth',
          label: 'He gets to keep the full 30,000, rather than only the 10,000 he lent',
          feedback:
            'A lender with collateral generally has to hand back anything above the debt either way. The advantage is speed and certainty, not keeping the extra.',
        },
        {
          id: 'interest',
          label: 'He can charge a higher rate of interest',
          feedback:
            'Better security usually means he charges *less* — the point of collateral is that safer lending is cheaper.',
        },
        {
          id: 'tax',
          label: 'It is treated more favourably for tax',
          feedback:
            'Tax treatment is not what the video is reaching for, and it is not why the market is built this way.',
        },
      ],
      correctOptionId: 'sell',
      explanation:
        'When a borrower goes bust, an ordinary lender with collateral must wait for a court and, in the United States, is frozen by bankruptcy rules (the "automatic stay"). A repo lender already owns the collateral and simply sells it. That exception is why repo became the plumbing of the whole financial system — and why it broke the way it did in 2008, when everybody used that right at once and the forced selling drove down the price of the very collateral everyone else was holding.',
    },
    {
      id: 'mc-haircut',
      type: 'multiple_choice',
      tags: ['repo', 'collateral', 'haircut'],
      xp: 35,
      prompt:
        'Sal lends 10,000 against a watch he believes is worth 30,000. Why not lend the full 30,000?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'haircut',
          label: 'The watch may not fetch 30,000 when he has to sell it in a hurry',
        },
        {
          id: 'greed',
          label: 'To make more profit on the interest',
          feedback:
            'Lending more at the same rate earns more interest, not less. Holding back is costing him revenue, which means it is buying him something else.',
        },
        {
          id: 'rules',
          label: 'Regulations limit how much can be lent against a watch',
          feedback:
            'Sal is not a regulated lender in this story, and the practice long predates any rule. It is self-protection rather than compliance.',
        },
        {
          id: 'afford',
          label: 'He only has 10,000 to lend',
          feedback:
            'He might, but that is a coincidence rather than a reason. The gap between loan and collateral value is deliberate and has a name.',
        },
      ],
      correctOptionId: 'haircut',
      explanation:
        'That gap is the haircut, and it is the most important number in repo. Raise the haircut and the same collateral supports less borrowing — so a market-wide rise in haircuts drains funding from the system without anyone withdrawing a deposit. That is a large part of how the 2008 run happened: not depositors queuing at branches, but repo lenders quietly demanding more collateral for the same cash — what the economist Gary Gorton called the run on repo.',
    },
  ],
  keyTakeaways: [
    'A repo is a sale plus a binding agreement to buy back at a higher price.',
    'The difference in price is the interest.',
    'Legal title transfers, which is why lenders prefer it to a pledge.',
  ],
});
