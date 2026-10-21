import { defineLesson } from '../../schema';

/** Video 20. The repo explained through a pawned watch: a collateralised loan dressed as a sale and a promise to buy back. */
export const kabReposLesson = defineLesson({
  id: 'kab-repos',
  title: 'A Loan That Looks Like a Sale',
  subtitle:
    'Leave your watch at a pawn shop and you get a loan. Sell it with a promise to buy it back, and you have made a repo.',
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
        'A repo works almost exactly like a loan backed by collateral (something valuable the lender can keep if you do not pay). What is the real difference?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'ownership',
          label: 'In a repo, the lender becomes the legal owner of the collateral',
        },
        {
          id: 'interest',
          label: 'A repo has no interest, only a fee for the service',
          feedback:
            'It does have interest, hidden in the price. The borrower buys the asset back for more than it was sold for. That difference is the interest.',
        },
        {
          id: 'no-collateral',
          label: 'A repo needs no collateral, only the borrower’s good name',
          feedback:
            'The collateral is the whole deal. It is just sold to the lender instead of being promised.',
        },
        {
          id: 'longer',
          label: 'A repo lasts for years instead of days',
          feedback:
            'Repos are usually very short, often just one night. Length is not the difference.',
        },
      ],
      correctOptionId: 'ownership',
      explanation:
        'The pawn shop example shows why: the lender wants to own the thing clearly, not argue about it later. If the borrower does not pay, the lender already owns the asset. Note: Sal shows central bank lending this way, but in real life the Fed’s discount window lends against promised collateral. The Fed uses repos in its open market operations.',
    },
    {
      id: 'order-repo',
      type: 'order_flow',
      tags: ['repo', 'discount-window'],
      xp: 25,
      prompt: 'Put the steps of a repo with the central bank in order, as the video draws them.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'need', label: 'A bank needs cash', detail: 'It owns Treasury bonds but does not want to sell them cheaply while prices are falling' },
        { id: 'print', label: 'The central bank agrees to lend and creates new reserves to pay', detail: 'This is a new debt for the central bank' },
        { id: 'sell', label: 'The bank sells its Treasury bonds to the central bank', detail: 'The central bank really becomes the owner' },
        { id: 'cash', label: 'The bank gets the cash it needed' },
        { id: 'buyback', label: 'Later, the bank buys the same bonds back', detail: 'At a higher price' },
        { id: 'interest', label: 'The difference in price is the interest', detail: 'In the video, the discount rate sets it' },
      ],
      correctOrder: ['need', 'print', 'sell', 'cash', 'buyback', 'interest'],
      explanation:
        'From the central bank’s side, this is a reverse repo. It lets a bank turn good assets into cash without selling them while the market pays too little. That is exactly what a bank needs when cash runs short in a crisis.',
    },
    {
      id: 'mc-repo-or-reverse',
      type: 'multiple_choice',
      tags: ['repo', 'terminology'],
      xp: 25,
      prompt:
        'You sell Sal your watch for cash and agree to buy it back later at a higher price. Sal now has the watch; you have the cash. Who is doing a repo, and who is doing a reverse repo?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'seller',
          label: 'You are doing the repo, because you sold and will buy back. Sal is doing the reverse repo',
        },
        {
          id: 'lender',
          label: 'Sal is doing the repo, because he lent the money',
          feedback:
            'The name follows the asset, not the cash. The side that sells the asset and agrees to buy it back is doing the repurchase.',
        },
        {
          id: 'both',
          label: 'You are both doing a repo — the word names the deal, not one side',
          feedback:
            'It is one deal with two names, so you can tell which side someone is on. A news story saying “the Fed did reverse repos” only makes sense once you know which side the name means.',
        },
        {
          id: 'neither',
          label: 'Neither of you. A repo needs a third party to hold the watch',
          feedback:
            'A version with a third party does exist. But the simple two-person version Sal shows is a real repo too.',
        },
      ],
      correctOptionId: 'seller',
      explanation:
        'Repo is short for repurchase agreement. So the repo side is the one who repurchases: they start with the asset, give it up for cash, and buy it back. The side that lends the cash does the reverse repo. Be careful when reading about the Fed: it names its deals from the other side. In its “reverse repo” facility, the Fed sells bonds to money market funds for one night and buys them back. This removes reserves.',
    },
    {
      id: 'mc-why-ownership-matters',
      type: 'multiple_choice',
      tags: ['repo', 'collateral', 'bankruptcy'],
      xp: 35,
      prompt:
        'Sal lends you 10,000 and keeps your watch, which is worth about 30,000. A pawn and a repo work almost the same way, but Sal wants to fully own the watch. What does that give him if you never come back?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'sell',
          label: 'He can sell the watch at once, instead of waiting behind the other people you owe',
        },
        {
          id: 'moreworth',
          label: 'He can keep the full 30,000, not only the 10,000 he lent',
          feedback:
            'A lender with collateral usually has to give back anything above the debt either way. The gain is speed and certainty, not keeping the extra.',
        },
        {
          id: 'interest',
          label: 'He can charge a higher interest rate',
          feedback:
            'Safer lending usually means he charges less, not more. That is the point of collateral: lower risk makes lending cheaper.',
        },
        {
          id: 'tax',
          label: 'He pays less tax on the deal',
          feedback:
            'The video is not about tax, and tax is not why the market works this way.',
        },
      ],
      correctOptionId: 'sell',
      explanation:
        'When a borrower goes bankrupt, a normal lender with collateral must wait for a court. In the United States, bankruptcy rules freeze everything for a while. A repo lender already owns the collateral, so it just sells it. That is why repo became the pipework of the whole financial system. It is also why it broke in 2008: everyone sold collateral at once, and its price fell for everybody.',
    },
    {
      id: 'mc-haircut',
      type: 'multiple_choice',
      tags: ['repo', 'collateral', 'haircut'],
      xp: 35,
      prompt:
        'Sal lends 10,000 against a watch he thinks is worth 30,000. Why does he not lend the full 30,000?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'haircut',
          label: 'The watch may sell for less than 30,000 if he must sell it quickly',
        },
        {
          id: 'greed',
          label: 'So he makes more profit on the interest',
          feedback:
            'Lending more at the same rate would earn more interest, not less. Lending less costs him money, so it must protect him from something.',
        },
        {
          id: 'rules',
          label: 'The law limits how much he can lend against a watch',
          feedback:
            'In this story Sal is not a regulated lender, and lenders did this long before any law. He does it to protect himself.',
        },
        {
          id: 'afford',
          label: 'He only has 10,000 to lend',
          feedback:
            'He might, but that would be luck, not a reason. The gap between the loan and the watch’s value is on purpose, and it has a name.',
        },
      ],
      correctOptionId: 'haircut',
      explanation:
        'That gap is called the haircut, and it is the most important number in a repo. A bigger haircut means the same collateral gets a smaller loan. So if haircuts rise across the market, money leaves the system without anyone taking out a deposit. That is a big part of what happened in 2008: lenders quietly asked for more collateral for the same cash. The economist Gary Gorton called it the run on repo.',
    },
  ],
  keyTakeaways: [
    'A repo is a sale plus a firm promise to buy the asset back at a higher price.',
    'The difference in price is the interest.',
    'The lender becomes the legal owner, which is why lenders like repos better than a simple promise of collateral.',
  ],
});
