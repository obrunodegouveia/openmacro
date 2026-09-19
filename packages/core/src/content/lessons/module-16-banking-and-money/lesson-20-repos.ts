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
            'Legal ownership of the collateral actually transfers',
        },
        {
          id: 'interest',
          label: 'A repo charges no interest, only a fee for the service',
          feedback:
            'It does — buried in the price. The borrower repurchases for more than was paid, and the difference is the interest.',
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
    {
      id: 'mc-repo-or-reverse',
      type: 'multiple_choice',
      tags: ['repo', 'terminology'],
      xp: 25,
      prompt:
        'Sal ends up holding the watch and the agreement; you end up holding the cash. Both of you are in the same trade. Who is in a repo and who is in a reverse repo?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'seller',
          label: 'You are, since you sold and will repurchase. Sal is in the reverse',
        },
        {
          id: 'lender',
          label: 'Sal is, since he lent the money',
          feedback:
            'Naming follows the collateral, not the cash. The party who sells the asset and agrees to buy it back is the one doing the repurchasing.',
        },
        {
          id: 'both',
          label: 'Both are repos — the word describes the trade, not a side of it',
          feedback:
            'It is one trade with two names precisely so you can tell which side someone is on. Reading a report that says "the Fed did reverse repos" only means something if the side is fixed.',
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
        'Repo is short for repurchase agreement, so the repo party is whoever is doing the repurchasing — the one who starts with the asset, hands it over for cash, and buys it back. The cash lender is on the reverse side. Getting this the right way round matters when you read the Fed: its reverse repo facility drains reserves by *selling* collateral to money funds overnight, which is the opposite of what the name suggests to most people.',
    },
    {
      id: 'mc-why-ownership-matters',
      type: 'multiple_choice',
      tags: ['repo', 'collateral', 'bankruptcy'],
      xp: 35,
      prompt:
        'Economically the pawn and the repo are identical. Sal wants legal ownership anyway. What does that actually get him if you never come back?',
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
            'A secured lender generally has to return the surplus over the debt either way. The advantage is about speed and certainty, not about keeping the excess.',
        },
        {
          id: 'interest',
          label: 'He can charge a higher rate of interest',
          feedback:
            'Better security usually means he charges *less* — the whole point of collateral is that safer lending is cheaper.',
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
        'When a borrower fails, an ordinary secured creditor waits for a court and, in the United States, is frozen by the automatic stay. A repo counterparty already owns the collateral and simply sells it. That carve-out is why repo became the plumbing of the entire financial system — and why it failed the way it did in 2008, when everybody exercised that right at once and the forced selling drove down the price of the very collateral everyone else was holding.',
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
          label: 'Regulations cap how much can be lent against jewellery',
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
        'That gap is the haircut, and it is the single most important number in repo. Raise the haircut and the same collateral supports less borrowing — so a market-wide rise in haircuts drains funding from the system without anyone withdrawing a deposit. That is precisely how the 2008 run happened: not depositors queueing at branches, but repo lenders quietly demanding more collateral for the same cash, which Gary Gorton named the run on repo.',
    },
  ],
  keyTakeaways: [
    'A repo is a sale plus a binding agreement to buy back at a higher price.',
    'The difference in price is the interest.',
    'Legal title transfers, which is why lenders prefer it to a pledge.',
  ],
});
