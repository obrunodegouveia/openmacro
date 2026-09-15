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
            'Reasonable in principle, but the loan is collateralised. The stated purpose is to keep the window a last resort rather than a first option.',
        },
        {
          id: 'inflation',
          label: 'To stop discount lending from being inflationary',
          feedback:
            'Both channels create reserves. The distinction is about who lends to whom, not about the inflationary effect.',
        },
      ],
      correctOptionId: 'last-resort',
      explanation:
        'If the window were cheaper than the interbank market, no bank would ever bother with another bank. Historically the gap was about a percentage point. That gap is also an information signal: heavy use of the window says the interbank market has stopped functioning.',
    },
    {
      id: 'mc-pariah',
      type: 'multiple_choice',
      tags: ['bank-run', 'liquidity'],
      xp: 25,
      prompt:
        'A bank faces withdrawals and no other bank will lend to it, because none can value its assets. Why does everyone else still care?',
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
            'It is not, and the commentary videos argue it often cannot tell whether it should — the distressed bank and the merely unlucky one make the same claim.',
        },
        {
          id: 'exposure',
          label: 'Because the other banks have lent to it',
          feedback:
            'A real channel in practice, but the mechanism emphasised here is confidence: depositors cannot tell which bank is sound.',
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
        'The first depositor turned away calls the press, and then nobody knows which banks are good. The window exists because the alternative to lending against collateral is a system-wide panic — which is also why it hands the central bank the hard problem of telling illiquid apart from insolvent.',
    },
    {
      id: 'mc-target-versus-price',
      type: 'multiple_choice',
      tags: ['discount-rate', 'fed-funds', 'monetary-policy'],
      xp: 35,
      prompt:
        'Sal says the two rates move together but are "pretty different in their actual implementation". What is the difference?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'targetvsprice',
          label: 'One is a target the Fed steers towards; the other is a price the Fed charges',
        },
        {
          id: 'termlength',
          label: 'One is overnight and the other is for a longer term',
          feedback:
            'Discount window loans are short too. The distinction is who is lending and whether the rate is announced or arrived at.',
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
        'The funds rate is a wish the Fed makes come true indirectly, by adding or draining reserves until two banks negotiating overnight land on it. The discount rate is simply posted: turn up at the window and this is what you pay. One is monetary policy conducted through a market, the other is a service with a price list — which is why the Fed can change the discount rate by announcement and cannot change the funds rate the same way.',
    },
    {
      id: 'mc-money-destroyed',
      type: 'multiple_choice',
      tags: ['open-market-operations', 'money-supply'],
      xp: 35,
      prompt:
        'The Fed sells a T-bill to raise rates. The buyer pays, the reserves return to the Fed and offset its notes outstanding. What has happened to that money?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'destroyed',
          label: 'It has ceased to exist. Two sides of the Fed’s balance sheet cancelled each other',
        },
        {
          id: 'vault',
          label: 'It is sitting in the Fed’s vault, waiting to be spent again',
          feedback:
            'A note the issuer holds is not money — it is a promise the issuer has made to itself, which is no promise at all. Only notes outside the Fed count.',
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
            'The buyer handed money over and received a bond. Follow the money rather than the bond and it goes back to its issuer and vanishes.',
        },
      ],
      correctOptionId: 'destroyed',
      explanation:
        'Money creation runs in reverse just as cleanly, and this is the fact most commentary misses: base money is not a stock that was released into the world once and now circulates forever. It is called into existence when the central bank buys and extinguished when it sells. Quantitative tightening is nothing more exotic than this, repeated at scale — the Fed lets bonds mature or sells them, and the reserves that paid for them cease to be.',
    },
    {
      id: 'mc-stigma',
      type: 'multiple_choice',
      tags: ['discount-rate', 'lender-of-last-resort'],
      xp: 35,
      prompt:
        'The discount window exists for a bank nobody else will lend to. What problem does that create for a bank that genuinely needs it?',
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
            'Collateral is a real constraint and a solvent bank usually has some. The deeper problem is what the world concludes from seeing it pledged.',
        },
        {
          id: 'expensive',
          label: 'The rate is higher, so it costs more than borrowing from a bank',
          feedback:
            'It costs a percentage point or so — trivial next to failing. Banks have refused the window while paying far more elsewhere, which shows price is not what stops them.',
        },
        {
          id: 'slow',
          label: 'The Fed takes too long to approve and fund the loan',
          feedback:
            'The window is designed for same-day lending. Speed is the one thing it reliably delivers.',
        },
      ],
      correctOptionId: 'stigma',
      explanation:
        'Sal calls such a bank the pariah of the banking community, and the label is the problem. A facility only the desperate use is a facility that marks you as desperate, so banks avoid it precisely when it would do most good — in 2008 the Fed had to invent the Term Auction Facility, which lent on near-identical terms by anonymous auction, purely to remove the stigma. Bagehot said lend freely at a penalty rate; he did not anticipate that the penalty everyone feared would be reputational.',
    },
    {
      id: 'match-two-rates',
      type: 'concept_match',
      tags: ['discount-rate', 'fed-funds'],
      xp: 30,
      prompt: 'Match each rate to who charges it and when it is used.',
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
        'If the window were the cheaper option nobody would ever call another bank, and the Fed would find itself funding the entire banking system every night instead of only its emergencies. The penalty is what keeps the interbank market alive — and it is also, awkwardly, what makes turning up at the window an admission.',
    },
  ],
  keyTakeaways: [
    'The funds rate is bank-to-bank; the discount rate is central-bank-to-bank.',
    'The discount rate sits higher so the window stays a last resort.',
    'Lending is collateralised, through repurchase agreements.',
  ],
});
