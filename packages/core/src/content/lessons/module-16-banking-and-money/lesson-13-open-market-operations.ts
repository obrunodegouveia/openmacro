import { defineLesson } from '../../schema';

/** Video 13. The mechanism: print, buy treasuries, and let the seller's deposit multiply through the banks. */
export const kabOpenMarketOperationsLesson = defineLesson({
  id: 'kab-open-market-operations',
  title: 'The Two Printing Presses',
  subtitle:
    'The central bank prints reserves and buys government debt. The base rises once; the banks multiply it again.',
  icon: '🖨️',
  difficulty: 'core',
  estimatedMinutes: 18,
  video: {
    url: 'https://www.youtube.com/watch?v=BTNarhvGX88',
    minutes: 12,
    source: 'Khan Academy — Banking 13',
  },
  challenges: [
    {
      id: 'order-omo',
      type: 'order_flow',
      tags: ['open-market-operations', 'money-supply'],
      xp: 30,
      prompt: 'Put an open market purchase in order, from the press to the loan.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'print', label: 'The central bank creates 100 of notes', detail: 'An asset, with notes outstanding as the matching liability' },
        { id: 'buy', label: 'It buys treasuries on the open market', detail: 'From whoever will sell — a pension fund, China, your uncle' },
        { id: 'seller', label: 'The seller now holds cash instead of a bond' },
        { id: 'deposit', label: 'The seller deposits that cash in a commercial bank' },
        { id: 'reserves', label: 'The bank’s reserves rise', detail: 'M0 has gone from 200 to 300' },
        { id: 'multiply', label: 'The bank lends against the new reserves', detail: 'And M1 rises by a multiple' },
      ],
      correctOrder: ['print', 'buy', 'seller', 'deposit', 'reserves', 'multiply'],
      explanation:
        'Two presses, as the video puts it: the base money press at the central bank, and the leverage press in the commercial banks. A 100 injection raised M0 by 100 and M1 by 200 at a 50% reserve ratio — and by 1,000 at a 10% one.',
    },
    {
      id: 'mc-why-not-reserve-req',
      type: 'multiple_choice',
      tags: ['monetary-policy', 'reserve-ratio'],
      xp: 25,
      prompt:
        'The central bank could expand money simply by lowering the reserve requirement. Why does it prefer open market operations?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'unwind',
          label:
            'Because raising it back forces banks to dump assets or unwind loans',
        },
        {
          id: 'illegal',
          label: 'Because it is not allowed to set the requirement',
          feedback:
            'It does set it. The video is explicit that this is one of its tools — just a clumsy one.',
        },
        {
          id: 'no-effect',
          label: 'Because changing the requirement would not affect the money supply',
          feedback:
            'It would, dramatically: at 10% rather than 50%, the same base supports five times the deposits. The objection is to the reverse move.',
        },
        {
          id: 'slow',
          label: 'Because a change in the requirement takes months to reach lending',
          feedback:
            'Speed is not the complaint. The problem is that the tool is hard to reverse without breaking the banks that responded to it.',
        },
      ],
      correctOptionId: 'unwind',
      explanation:
        'Banks operate close to whatever limit they are given, because idle reserves earn nothing. Loosening the limit invites them to lend up to it; tightening it again then forces fire sales at the worst moment. Open market operations adjust the base instead, which is reversible by simply selling the bonds back.',
    },
    {
      id: 'mc-omo-arithmetic',
      type: 'multiple_choice',
      tags: ['open-market-operations', 'multiplier'],
      xp: 35,
      prompt:
        'The Fed prints 100 and buys treasuries. With a 50% reserve requirement the video gets M0 from 200 to 300 and M1 from 400 to 600. What would the same 100 have done at a 10% requirement?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'thousand',
          label: 'M0 still rises 100, but M1 could rise by 1,000',
        },
        {
          id: 'same',
          label: 'The same, since the Fed printed the same 100 either way',
          feedback:
            'The base rises by 100 either way. What the banking system can build on top of that 100 is set by the ratio, and 1/0.10 is five times 1/0.50.',
        },
        {
          id: 'twohundred',
          label: 'M0 rises 100 and M1 rises 200, as before',
          feedback:
            'That is the 50% answer. At 10% each new dollar of reserves supports ten of deposits rather than two.',
        },
        {
          id: 'hundred',
          label: 'Both rise by exactly 100 — the Fed cannot create deposits',
          feedback:
            'The Fed cannot, and does not. The commercial banks do, on the back of the reserves it supplied — which is the whole point of the two presses.',
        },
      ],
      correctOptionId: 'thousand',
      explanation:
        'The central bank controls only the base. What that base turns into depends on a ratio it sets but does not operate, and on whether banks want to lend and anyone wants to borrow. This is why quantitative easing after 2008 produced an enormous rise in M0 and a modest one in M1: the reserves were created, and the second press largely did not run.',
    },
    {
      id: 'mc-no-requirement-for-the-fed',
      type: 'multiple_choice',
      tags: ['central-banking', 'reserves'],
      xp: 30,
      prompt:
        'Every commercial bank faces a reserve requirement. The central bank faces none, and Sal says it does not need one. Why not?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'ownliability',
          label: 'What people demand from it is its own liability, and it can always issue more of that',
        },
        {
          id: 'gold',
          label: 'Because it holds enough gold to cover everything it has issued',
          feedback:
            'It holds a fraction, which is the whole design. If the gold were the answer there would be nothing distinctive about the central bank at all.',
        },
        {
          id: 'trusted',
          label: 'Because nobody would ever run on a central bank',
          feedback:
            'People have — that is what a currency crisis is. What protects it is not that the run cannot start but that it cannot run the bank out of its own money.',
        },
        {
          id: 'regulator',
          label: 'Because it writes the rules and would not impose one on itself',
          feedback:
            'True and beside the point. Even a central bank that wanted a requirement would find it meaningless: it cannot run short of a thing it issues.',
        },
      ],
      correctOptionId: 'ownliability',
      explanation:
        'A commercial bank promises something it cannot make — reserves. A central bank promises reserves and notes, which it makes by typing. That asymmetry is the whole of central banking, and it has one real limit: it can always meet a demand for its currency, and it cannot control what that currency is worth once it does. Illiquidity is impossible for it; debasement is not.',
    },
    {
      id: 'match-two-presses',
      type: 'concept_match',
      tags: ['money-creation', 'central-banking'],
      xp: 30,
      prompt: 'Sal talks about two printing presses. Match each to who operates it and what it makes.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'base',
          term: 'The base money press',
          definition: 'Run by the central bank, which creates reserves and notes out of nothing and buys assets with them',
        },
        {
          id: 'leverage',
          term: 'The leverage press',
          definition: 'Run by commercial banks, which turn each unit of reserves into several of deposits by lending',
        },
        {
          id: 'brake',
          term: 'The brake on the second',
          definition: 'The reserve ratio, plus whether anyone creditworthy actually wants to borrow',
        },
      ],
      explanation:
        'Keeping these apart resolves most public confusion about money printing. The central bank runs the first press and cannot run the second; the phrase "the Fed printed trillions" describes reserves that only become spendable money if banks lend them on. It also explains why the same operation is inflationary in one decade and not in another — the second press is operated by people deciding whether a loan is worth making.',
    },
  ],
  keyTakeaways: [
    'An open market purchase raises base money, which banks then multiply.',
    'The seller of the bond is the channel: their deposit becomes a bank’s reserves.',
    'Reserve requirements are a real tool but a nearly irreversible one.',
  ],
});
