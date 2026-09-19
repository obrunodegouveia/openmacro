import { defineLesson } from '../../schema';

/** Video 14. The target rate as the price of overnight reserves, moved by changing their supply. */
export const kabFedFundsRateLesson = defineLesson({
  id: 'kab-fed-funds-rate',
  title: 'A Target Rate Is a Promise About Supply',
  subtitle:
    'The central bank cannot order banks to lend at 5%. It floods the market with reserves until they do.',
  icon: '🎯',
  difficulty: 'core',
  estimatedMinutes: 17,
  video: {
    url: 'https://www.youtube.com/watch?v=IniG1KkPS2c',
    minutes: 12,
    source: 'Khan Academy — Banking 14',
  },
  challenges: [
    {
      id: 'mc-what-is-the-rate',
      type: 'multiple_choice',
      tags: ['fed-funds', 'interest-rates'],
      xp: 25,
      prompt: 'The federal funds rate is the rate at which — what?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'interbank',
          label: 'Banks lend reserves to each other, overnight',
        },
        {
          id: 'to-public',
          label: 'Banks lend to households and businesses',
          feedback:
            'Those rates follow it, but the funds rate itself is strictly interbank — one bank with surplus reserves lending to one that is short.',
        },
        {
          id: 'fed-lends',
          label: 'The central bank lends directly to banks',
          feedback:
            'That is the discount rate, covered in video 19, and it is deliberately set higher so banks go to each other first.',
        },
        {
          id: 'treasury',
          label: 'The government borrows for one day',
          feedback:
            'Overnight government borrowing is a different market. The funds rate is about reserves held at the central bank.',
        },
      ],
      correctOptionId: 'interbank',
      explanation:
        'And it is a *target*, not a decree. The central bank announces the rate it wants and then buys or sells treasuries until supply and demand for reserves produce it. Note the quiet detail the video draws out: reserves pay no interest, which is why a bank with a surplus is eager to lend it.',
    },
    {
      id: 'mc-lower-the-rate',
      type: 'multiple_choice',
      tags: ['monetary-policy', 'open-market-operations'],
      xp: 25,
      prompt:
        'Banks are lending to each other at 8% and the central bank wants 5%. What does it do?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'buy',
          label:
            'Buy treasuries, so reserves become plentiful and cheap',
        },
        {
          id: 'sell',
          label: 'Sell treasuries, draining reserves out of the banking system',
          feedback:
            'That raises the rate. Scarcer reserves mean the borrowing bank is more desperate and the lending bank has less to spare.',
        },
        {
          id: 'instruct',
          label: 'Instruct the banks to charge 5%',
          feedback:
            'It has no such power over a private transaction. Both parties must agree, which is why the tool is supply rather than command.',
        },
        {
          id: 'reserve-req',
          label: 'Raise the reserve requirement so banks need fewer reserves',
          feedback:
            'That would make reserves scarcer still and push the rate up — the opposite of the intent.',
        },
      ],
      correctOptionId: 'buy',
      explanation:
        'Price is set by supply and demand, and the central bank moves both at once: buying bonds puts reserves into the system, raising supply from the bank with surplus and lowering demand from the bank that was short. If 5% is overshot, it sells until the rate comes back.',
    },
    {
      id: 'mc-overnight-really',
      type: 'multiple_choice',
      tags: ['fed-funds', 'interest-rates'],
      xp: 30,
      prompt:
        'Bank B lends to Bank A overnight "at 10%". The loan is repaid in the morning. Roughly what does Bank A actually pay for the night?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'annualised',
          label: 'About a 365th of 10% — the rate is quoted per year, not per night',
        },
        {
          id: 'tenpercent',
          label: '10% of the amount borrowed',
          feedback:
            'That would make overnight money the most expensive borrowing in the world. Every rate you see quoted, however short the loan, is an annual rate.',
        },
        {
          id: 'depends',
          label: 'It depends on what the Fed sets the following morning',
          feedback:
            'The rate is agreed when the loan is made. What the Fed does tomorrow affects tomorrow’s loan.',
        },
        {
          id: 'nothing',
          label: 'Nothing, since it is repaid the next day',
          feedback:
            'A very small amount is still a real amount, and rolled every night for a year it compounds to roughly the quoted rate — which is the point of quoting it that way.',
        },
      ],
      correctOptionId: 'annualised',
      explanation:
        'The loan really is overnight — the term is literal, not historical — and the rate really is annual. Banks borrow and repay across the close of business every single day, rolling the position each night, which is why an annualised quote is the only one that lets you compare it with anything else. It also means the policy rate is reset in the market daily, not quarterly when the committee meets.',
    },
    {
      id: 'mc-iorb-changes-it',
      type: 'multiple_choice',
      tags: ['fed-funds', 'reserves', 'monetary-policy'],
      xp: 35,
      prompt:
        'The video’s mechanism depends on reserves earning no interest, so banks push surplus reserves out at whatever rate they can get. Since 2008 the Fed pays interest on reserves. What does that change?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'floor',
          label: 'That rate becomes a floor, and scarcity stops being the lever',
        },
        {
          id: 'nothing',
          label: 'Nothing — banks still lend surplus reserves to each other',
          feedback:
            'They do, but not at any price. A bank with a risk-free alternative paying 4% will not lend to another bank at 3%, and that changes what the Fed has to do to hit its target.',
        },
        {
          id: 'higher',
          label: 'It makes the funds rate permanently higher than the target',
          feedback:
            'It anchors the rate near the target rather than above it. The effective rate has generally traded slightly *below* what the Fed pays, for reasons to do with who may hold reserve accounts.',
        },
        {
          id: 'nomore',
          label: 'The Fed can no longer conduct open market operations at all',
          feedback:
            'It still buys and sells freely — that is how the balance sheet grew and shrank after 2008. What changed is that the size of the balance sheet stopped being how the rate is set.',
        },
      ],
      correctOptionId: 'floor',
      explanation:
        'This is the single biggest way the video has dated, and it inverts the logic. Sal’s Fed makes reserves scarce and lets the scarcity set the price. Today’s Fed keeps reserves abundant and simply announces what it will pay on them, so no bank lends much below that — an administered floor rather than a market clearing under pressure. It is why the Fed could hold trillions of reserves and raise rates at the same time, which on the video’s mechanism would be impossible.',
    },
    {
      id: 'order-transmission',
      type: 'order_flow',
      tags: ['open-market-operations', 'fed-funds'],
      xp: 30,
      prompt: 'Put the chain from an open market purchase to a lower funds rate in order.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'buy', label: 'The Fed buys treasuries in the open market', detail: 'Paying with notes it has just created' },
        { id: 'grandmother', label: 'The seller is paid and banks the proceeds' },
        { id: 'reserves', label: 'Both banks’ reserve ratios drift upward' },
        { id: 'demand', label: 'The short bank needs to borrow less' },
        { id: 'supply', label: 'The long bank has even more to lend' },
        { id: 'rate', label: 'The overnight rate falls', detail: 'More supply, less demand, lower price' },
      ],
      correctOrder: ['buy', 'grandmother', 'reserves', 'demand', 'supply', 'rate'],
      explanation:
        'The Fed never sets the funds rate by decree in this mechanism — it changes the quantity of reserves and lets two banks negotiating overnight discover the price. That is why it is a *target* rate rather than a fixed one, and why the published effective rate wanders a basis point or two around it. Hold that word "target" up against the previous question: once the Fed pays interest on reserves, it is much closer to simply announcing the rate.',
    },
  ],
  keyTakeaways: [
    'The funds rate is the overnight price of reserves between banks.',
    'A target is achieved by changing the supply of reserves, not by decree.',
    'Reserves earn no interest, which is why surplus banks want to lend them.',
  ],
});
