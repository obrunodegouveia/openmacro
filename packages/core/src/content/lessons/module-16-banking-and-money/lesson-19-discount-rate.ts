import { defineLesson } from '../../schema';

/** Video 19. The discount window as lender of last resort, and why its rate sits above the funds rate. */
export const kabDiscountRateLesson = defineLesson({
  id: 'kab-discount-rate',
  title: 'When Nobody Will Lend to You',
  subtitle:
    'Banks usually borrow from each other. The discount window is where a bank goes when no other bank will lend to it.',
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
      prompt:
        'The discount rate is what the Fed charges a bank for a loan. The federal funds rate is what banks charge each other. Why does the Fed set the discount rate higher on purpose?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'last-resort',
          label: 'So banks borrow from each other first and come to the Fed last',
        },
        {
          id: 'profit',
          label: 'So the central bank makes more money on each loan',
          feedback:
            'The Fed’s profit goes back to the Treasury, so profit is not the reason. The higher rate is there to change how banks behave.',
        },
        {
          id: 'risk',
          label: 'Because lending to a bank in trouble is riskier',
          feedback:
            'That sounds sensible, but the loan is backed by collateral. The real purpose is to keep the window a last choice, not a first one.',
        },
        {
          id: 'inflation',
          label: 'To stop loans from the Fed from causing inflation',
          feedback:
            'Both kinds of loan move reserves around in the same way. The difference is who lends to whom, not inflation.',
        },
      ],
      correctOptionId: 'last-resort',
      explanation:
        'If the Fed were cheaper, no bank would ever borrow from another bank. When the video was made, the gap was about one percentage point. The gap is also a signal: if many banks use the window, lending between banks has stopped working.',
    },
    {
      id: 'mc-pariah',
      type: 'multiple_choice',
      tags: ['bank-run', 'liquidity'],
      xp: 25,
      prompt:
        'Many depositors are taking money out of one bank. No other bank will lend to it, because nobody can tell what its loans are really worth. Why should the other banks care?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'systemic',
          label: 'If one depositor is sent away, the news spreads and every bank faces a run',
        },
        {
          id: 'charity',
          label: 'Because the central bank must rescue any bank that asks',
          feedback:
            'It does not have to. Sal also argues that the Fed often cannot tell a bank that is broke from one that is just short of cash.',
        },
        {
          id: 'exposure',
          label: 'Because the other banks have lent money to it',
          feedback:
            'That is one real way trouble spreads. But the video stresses trust: depositors cannot tell which bank is safe.',
        },
        {
          id: 'no-care',
          label: 'They do not care — one less bank means one less rival',
          feedback:
            'The video says the opposite. When banks keep only part of their deposits as cash, one bank failing in public can empty every other bank.',
        },
      ],
      correctOptionId: 'systemic',
      explanation:
        'The first depositor who is sent away tells the newspapers. Then nobody knows which banks are safe, and people run to all of them. The window exists to stop that panic. It also leaves the Fed with a hard job: telling a bank that is short of cash from a bank that is broke.',
    },
    {
      id: 'mc-target-versus-price',
      type: 'multiple_choice',
      tags: ['discount-rate', 'fed-funds', 'monetary-policy'],
      xp: 35,
      prompt:
        'Sal says the federal funds rate and the discount rate move together, but they work very differently. What is the difference?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'targetvsprice',
          label: 'The funds rate is a target the Fed pushes the market towards; the discount rate is a price the Fed charges',
        },
        {
          id: 'termlength',
          label: 'One rate is for loans of one night, and the other is for loans of several months',
          feedback:
            'Loans from the window are short too. The difference is who lends, and whether the rate is simply set or found in a market.',
        },
        {
          id: 'whopays',
          label: 'Banks pay one of the rates and the public pays the other',
          feedback:
            'The public borrows at neither rate. Both rates are only for banks.',
        },
        {
          id: 'sameahing',
          label: 'There is no real difference — they are two names for one rate',
          feedback:
            'They are always two different numbers, and the gap is on purpose. A bank choosing between them is choosing between two different lenders.',
        },
      ],
      correctOptionId: 'targetvsprice',
      explanation:
        'The Fed cannot set the funds rate directly. It adds or removes reserves until banks lending to each other overnight agree on that rate. The discount rate is simply a price: come to the window and this is what you pay. So the Fed can change the discount rate just by announcing it, but not the funds rate.',
    },
    {
      id: 'mc-money-destroyed',
      type: 'multiple_choice',
      tags: ['open-market-operations', 'money-supply'],
      xp: 35,
      prompt:
        'To raise rates, the Fed sells a Treasury bill (a short government bond). The buyer pays from a bank account, so that bank’s reserves at the Fed fall by the same amount. What happened to that money?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'destroyed',
          label: 'It no longer exists: the Fed’s debt (the reserves) shrank as its asset (the bill) left',
        },
        {
          id: 'vault',
          label: 'It is in the Fed’s vault, ready to be spent again later',
          feedback:
            'Money the Fed owes to itself is not money. A promise to yourself is no promise at all. Only notes and reserves held outside the Fed count.',
        },
        {
          id: 'treasury',
          label: 'It went to the Treasury as money for the government',
          feedback:
            'The Treasury is not part of this trade. The Fed sold a bond it already owned to a private buyer.',
        },
        {
          id: 'moved',
          label: 'It moved to the buyer, who holds it now instead',
          feedback:
            'The buyer gave money and got a bond. Follow the money, not the bond: it goes back to the Fed, which created it, and disappears.',
        },
      ],
      correctOptionId: 'destroyed',
      explanation:
        'The Fed creates base money when it buys, and destroys it when it sells. Base money is not a fixed amount that goes out once and stays forever. Quantitative tightening is just this on a large scale: the Fed sells bonds or lets them end, and the reserves that paid for them disappear.',
    },
    {
      id: 'mc-stigma',
      type: 'multiple_choice',
      tags: ['discount-rate', 'lender-of-last-resort'],
      xp: 35,
      prompt:
        'The discount window is for a bank that no one else will lend to. What problem does that cause for a bank that really needs it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'stigma',
          label: 'Using it tells everyone that no other bank would lend to you',
        },
        {
          id: 'collateral',
          label: 'It must give collateral, which it may not have',
          feedback:
            'Collateral is a real limit, but a healthy bank usually has some. The bigger problem is what everyone thinks when they hear the bank used the window.',
        },
        {
          id: 'expensive',
          label: 'The rate is higher, so it costs more than borrowing from a bank',
          feedback:
            'It costs about one percentage point more, which is tiny next to failing. Banks have avoided the window even when other loans cost far more, so price is not what stops them.',
        },
        {
          id: 'slow',
          label: 'The Fed takes too long to agree to the loan and pay it',
          feedback:
            'The window is built to lend on the same day. Speed is not the problem.',
        },
      ],
      correctOptionId: 'stigma',
      explanation:
        'Sal calls such a bank an outcast among banks, and that is the problem. If only desperate banks use the window, using it makes you look desperate. So banks avoid it just when it would help most. In late 2007 the Fed started the Term Auction Facility, which lent in a similar way through auctions, mainly to get round this shame.',
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
          definition: 'What one bank charges another for one night; the Fed steers it but does not set it',
        },
        {
          id: 'discount',
          term: 'The discount rate',
          definition: 'What the Fed itself charges a bank that comes to the window; it is set in advance',
        },
        {
          id: 'spread',
          term: 'The gap between them',
          definition: 'Kept above zero on purpose, so banks go to each other first and to the Fed last',
        },
      ],
      explanation:
        'If the window were cheaper, no bank would ever call another bank. The Fed would then lend to the whole banking system every night, not only in emergencies. The higher rate keeps banks lending to each other. But it also means that going to the window looks like a sign of trouble.',
    },
  ],
  keyTakeaways: [
    'The funds rate is what banks charge each other; the discount rate is what the Fed charges banks.',
    'The discount rate is higher so that the window stays a last choice.',
    'Loans from the discount window are backed by collateral.',
  ],
});
