import { defineLesson } from '../../schema';

/** Video 19. The discount window as lender of last resort, and why its rate sits above the funds rate. */
export const kabDiscountRateLesson = defineLesson({
  id: 'kab-discount-rate',
  title: 'When Nobody Will Lend to You',
  subtitle:
    'The funds rate needs a willing counterparty. The discount window is what exists for when there is none.',
  icon: '🪟',
  difficulty: 'core',
  estimatedMinutes: 17,
  video: {
    url: 'https://www.youtube.com/watch?v=FxkTSjctXdk',
    minutes: 13,
    source: 'Khan Academy — the discount rate',
  },
  challenges: [
    {
      id: 'mc-why-higher',
      type: 'multiple_choice',
      tags: ['discount-rate', 'lender-of-last-resort'],
      xp: 25,
      prompt: 'Why is the discount rate deliberately set above the federal funds rate?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'last-resort',
          label:
            'So banks try each other first and come to the window last',
        },
        {
          id: 'profit',
          label: 'So the central bank makes more money on the loan',
          feedback:
            'Its surplus goes back to the Treasury, so profit is not the motive. The spread exists to shape behaviour.',
        },
        {
          id: 'risk',
          label: 'Because lending to a distressed bank is riskier',
          feedback:
            'Reasonable in principle, but the loan is backed by collateral. The stated purpose is to keep the window a last resort rather than a first choice.',
        },
        {
          id: 'inflation',
          label: 'To stop discount lending from being inflationary',
          feedback:
            'Both kinds of lending move reserves around in the same way. The difference is about who lends to whom, not about inflation.',
        },
      ],
      correctOptionId: 'last-resort',
      explanation:
        'If the window were cheaper than borrowing from other banks, no bank would ever bother with another bank. When the video was made, the gap was about one percentage point. The gap also gives a signal: heavy use of the window says lending between banks has stopped working.',
    },
    {
      id: 'mc-pariah',
      type: 'multiple_choice',
      tags: ['bank-run', 'liquidity'],
      xp: 25,
      prompt:
        'A bank faces heavy withdrawals and no other bank will lend to it, because none can judge what its assets are worth. Why should the other banks care?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'systemic',
          label:
            'If one depositor is turned away, the story spreads and every bank faces a run',
        },
        {
          id: 'charity',
          label: 'Because the central bank is obliged to rescue any bank that asks',
          feedback:
            'It is not, and Sal’s commentary videos argue that it often cannot tell whether it should — a bank that is bust and one that is merely unlucky make the same claim.',
        },
        {
          id: 'exposure',
          label: 'Because the other banks have lent to it',
          feedback:
            'That is a real way trouble spreads, but the one stressed here is confidence: depositors cannot tell which bank is sound.',
        },
        {
          id: 'no-care',
          label: 'They do not — a failing bank is a competitor gone',
          feedback:
            'That is the reasoning the video rejects. In a fractional reserve system a single visible failure can empty every other bank.',
        },
      ],
      correctOptionId: 'systemic',
      explanation:
        'The first depositor turned away calls the newspapers, and then nobody knows which banks are sound. The window exists because the alternative to lending against collateral is a panic across the whole system — which is also why it hands the central bank the hard problem of telling a bank that is short of cash from one that is bust.',
    },
    {
      id: 'mc-target-versus-price',
      type: 'multiple_choice',
      tags: ['discount-rate', 'fed-funds', 'monetary-policy'],
      xp: 35,
      prompt:
        'Sal says the federal funds rate and the discount rate move together but are "pretty different in their actual implementation". What is the difference?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'targetvsprice',
          label: 'The funds rate is a target the Fed steers the market towards; the discount rate is a price the Fed itself charges',
        },
        {
          id: 'termlength',
          label: 'One is overnight and the other is for a longer term',
          feedback:
            'Discount window loans are short too. The difference is who is lending, and whether the rate is simply posted or reached in the market.',
        },
        {
          id: 'whopays',
          label: 'One is paid by banks and the other by the public',
          feedback:
            'The public borrows from neither. Both rates live entirely inside the banking system.',
        },
        {
          id: 'sameahing',
          label: 'Nothing real — the two names describe one rate',
          feedback:
            'They are reliably different numbers, and the gap between them is deliberate. A bank choosing between them is choosing between two different lenders.',
        },
      ],
      correctOptionId: 'targetvsprice',
      explanation:
        'The funds rate is a goal the Fed reaches indirectly, by adding or removing reserves until banks lending to each other overnight settle on it. The discount rate is simply posted: turn up at the window and this is what you pay. One is policy carried out through a market, the other is a service with a price list — which is why the Fed can change the discount rate just by announcing it, and cannot change the funds rate the same way.',
    },
    {
      id: 'mc-money-destroyed',
      type: 'multiple_choice',
      tags: ['open-market-operations', 'money-supply'],
      xp: 35,
      prompt:
        'The Fed sells a Treasury bill to raise rates. The buyer pays with money held at a bank, so that bank’s reserves at the Fed fall by the same amount. What has happened to that money?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'destroyed',
          label: 'It no longer exists: the Fed’s liability (the reserves) shrank as its asset (the bill) left',
        },
        {
          id: 'vault',
          label: 'It is sitting in the Fed’s vault, waiting to be spent again',
          feedback:
            'Money owed by the Fed to itself is not money — it is a promise to itself, which is no promise at all. Only notes and reserves held outside the Fed count.',
        },
        {
          id: 'treasury',
          label: 'It went to the Treasury as government revenue',
          feedback:
            'The Treasury is not party to this trade. The Fed sold a bond it already owned to a private buyer.',
        },
        {
          id: 'moved',
          label: 'It moved to the buyer, who now holds it instead',
          feedback:
            'The buyer handed money over and received a bond. Follow the money rather than the bond: it goes back to the Fed, which issued it, and vanishes.',
        },
      ],
      correctOptionId: 'destroyed',
      explanation:
        'Money creation runs in reverse just as cleanly, and this is the fact most commentary misses: base money is not a stock released into the world once that then circulates forever. It is created when the central bank buys and destroyed when it sells. Quantitative tightening is nothing more exotic than this, repeated on a large scale — the Fed lets bonds mature or sells them, and the reserves that paid for them disappear.',
    },
    {
      id: 'mc-stigma',
      type: 'multiple_choice',
      tags: ['discount-rate', 'lender-of-last-resort'],
      xp: 35,
      prompt:
        'The discount window exists for a bank nobody else will lend to. What problem does that create for a bank that really needs it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'stigma',
          label: 'Using it announces that nobody else would lend to you',
        },
        {
          id: 'collateral',
          label: 'It has to post collateral, which it may not have',
          feedback:
            'Collateral is a real limit, but a sound bank usually has some. The deeper problem is what everyone else concludes when they find out the bank used the window.',
        },
        {
          id: 'expensive',
          label: 'The rate is higher, so it costs more than borrowing from a bank',
          feedback:
            'It costs about a percentage point more — trivial next to failing. Banks have avoided the window while paying far more elsewhere, which shows price is not what stops them.',
        },
        {
          id: 'slow',
          label: 'The Fed takes too long to approve and fund the loan',
          feedback:
            'The window is designed to lend on the same day. Speed is one thing it reliably delivers.',
        },
      ],
      correctOptionId: 'stigma',
      explanation:
        'Sal calls such a bank the pariah of the banking community, and that label is the problem. A service only desperate banks use marks you as desperate, so banks avoid it exactly when it would help most. In late 2007 the Fed created the Term Auction Facility, which lent on similar terms through auctions, largely to get round that stigma. Bagehot said to lend freely at a penalty rate; he did not foresee that the penalty banks feared most would be damage to their reputation.',
    },
    {
      id: 'match-two-rates',
      type: 'concept_match',
      tags: ['discount-rate', 'fed-funds'],
      xp: 30,
      prompt: 'Match each term to what it means.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'funds',
          term: 'The federal funds rate',
          definition: 'What one bank charges another overnight, steered by the Fed rather than set by it',
        },
        {
          id: 'discount',
          term: 'The discount rate',
          definition: 'What the Fed itself charges a bank that turns up at the window, posted in advance',
        },
        {
          id: 'spread',
          term: 'The gap between them',
          definition: 'Kept positive on purpose, so banks go to each other first and to the Fed last',
        },
      ],
      explanation:
        'If the window were the cheaper option, nobody would ever call another bank, and the Fed would end up funding the entire banking system every night instead of only its emergencies. The higher rate is what keeps lending between banks alive — and it is also, awkwardly, what makes turning up at the window an admission of trouble.',
    },
  ],
  keyTakeaways: [
    'The funds rate is bank-to-bank; the discount rate is central-bank-to-bank.',
    'The discount rate sits higher so the window stays a last resort.',
    'Discount window loans are backed by collateral.',
  ],
});
