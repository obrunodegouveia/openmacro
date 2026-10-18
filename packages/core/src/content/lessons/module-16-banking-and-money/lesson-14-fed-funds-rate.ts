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
      prompt: 'The federal funds rate is the interest rate at which who lends to whom?',
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
            'Those rates follow it, but the funds rate itself is only between banks — one bank with spare reserves lending to one that is short.',
        },
        {
          id: 'fed-lends',
          label: 'The central bank lends directly to banks',
          feedback:
            'That is the discount rate, covered in video 19. It is deliberately set higher, so banks go to each other first.',
        },
        {
          id: 'treasury',
          label: 'The government borrows for one day',
          feedback:
            'Short-term government borrowing is a different market. The funds rate is about reserves that banks hold at the central bank.',
        },
      ],
      correctOptionId: 'interbank',
      explanation:
        'And it is a *target*, not an order. The central bank announces the rate it wants and then buys or sells Treasuries until supply and demand for reserves produce it. Note the quiet detail in the video: reserves paid no interest at the time, which is why a bank with spare reserves was eager to lend them.',
    },
    {
      id: 'mc-lower-the-rate',
      type: 'multiple_choice',
      tags: ['monetary-policy', 'open-market-operations'],
      xp: 25,
      prompt:
        'Banks are lending reserves to each other overnight at 8%, and the central bank wants that rate at 5%. What does it do?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'buy',
          label:
            'Buy Treasuries, so reserves become plentiful and cheap',
        },
        {
          id: 'sell',
          label: 'Sell Treasuries, draining reserves out of the banking system',
          feedback:
            'That raises the rate. With scarcer reserves, the bank that needs to borrow is more desperate and the bank that lends has less to spare.',
        },
        {
          id: 'instruct',
          label: 'Instruct the banks to charge 5%',
          feedback:
            'It has no such power over a private deal between two banks. Both must agree, which is why the tool is changing the supply of reserves, not giving orders.',
        },
        {
          id: 'reserve-req',
          label: 'Raise the reserve requirement',
          feedback:
            'Banks would then need more reserves, making them scarcer still and pushing the rate up — the opposite of what it wants.',
        },
      ],
      correctOptionId: 'buy',
      explanation:
        'The price is set by supply and demand, and the central bank moves both at once: buying bonds puts reserves into the system, so the bank with spare reserves has more to lend and the bank that was short needs to borrow less. If the rate falls below 5%, it sells until the rate comes back up.',
    },
    {
      id: 'mc-overnight-really',
      type: 'multiple_choice',
      tags: ['fed-funds', 'interest-rates'],
      xp: 30,
      prompt:
        'Bank B lends to Bank A overnight "at 10%". The loan is repaid the next morning. Roughly how much interest does Bank A pay for that one night?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'annualised',
          label: 'About 10% ÷ 365 (roughly 0.03%) of the amount — the rate is quoted per year, not per night',
        },
        {
          id: 'tenpercent',
          label: '10% of the amount borrowed',
          feedback:
            'That would make overnight money the most expensive borrowing in the world. Interest rates are normally quoted per year, however short the loan.',
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
        'The loan really is for one night, and the rate really is per year. Banks borrow and repay every day, often renewing the loan each night, and quoting a yearly rate is what lets you compare it with any other loan. It also means the market rate is set afresh every day, even though the central bank changes its target only at its meetings (eight a year at the Fed).',
    },
    {
      id: 'mc-iorb-changes-it',
      type: 'multiple_choice',
      tags: ['fed-funds', 'reserves', 'monetary-policy'],
      xp: 35,
      prompt:
        'The video’s mechanism depends on reserves earning no interest, so banks lend out spare reserves at whatever rate they can get. Since 2008 the Fed has paid interest on reserves. What does that change?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'floor',
          label: 'The rate paid on reserves becomes a floor, and making reserves scarce stops being the lever',
        },
        {
          id: 'nothing',
          label: 'Nothing — banks still lend surplus reserves to each other',
          feedback:
            'They do, but not at any price. A bank that can earn 4% risk free at the Fed will not lend to another bank at 3%, and that changes what the Fed has to do to hit its target.',
        },
        {
          id: 'higher',
          label: 'It makes the funds rate permanently higher than the target',
          feedback:
            'It anchors the rate near the target rather than above it. In practice the market rate has usually been slightly *below* what the Fed pays on reserves, because some lenders in that market are not banks and cannot earn it.',
        },
        {
          id: 'nomore',
          label: 'The Fed can no longer conduct open market operations at all',
          feedback:
            'It still buys and sells — that is how its balance sheet grew and shrank after 2008. What changed is that the amount of reserves stopped being how the rate is set.',
        },
      ],
      correctOptionId: 'floor',
      explanation:
        'This is the biggest way the video has dated, and it turns the logic around. Sal’s Fed keeps reserves scarce and lets the scarcity set the price. Today’s Fed keeps reserves plentiful and simply announces what it will pay on them, so no bank lends much below that — a floor set by the Fed rather than a price found under pressure. It is why the Fed could hold trillions of reserves and raise rates at the same time, which the video’s mechanism would make impossible.',
    },
    {
      id: 'order-transmission',
      type: 'order_flow',
      tags: ['open-market-operations', 'fed-funds'],
      xp: 30,
      prompt: 'Put in order the chain from an open market purchase to a lower federal funds rate.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'buy', label: 'The Fed buys Treasuries in the open market', detail: 'Paying with money it has just created' },
        { id: 'grandmother', label: 'The seller is paid and deposits the money in a bank' },
        { id: 'reserves', label: 'Reserves rise across the banking system', detail: 'At the bank that was short and at the bank with spare reserves' },
        { id: 'demand', label: 'The bank that was short now needs to borrow less overnight' },
        { id: 'supply', label: 'So the bank with spare reserves finds fewer borrowers for them' },
        { id: 'rate', label: 'The overnight rate falls', detail: 'More to lend, fewer borrowers, lower price' },
      ],
      correctOrder: ['buy', 'grandmother', 'reserves', 'demand', 'supply', 'rate'],
      explanation:
        'In this mechanism the Fed never sets the funds rate by order — it changes the quantity of reserves and lets banks lending to each other overnight find the price. That is why it is a *target* rate rather than a fixed one, and why the actual market rate moves a little around it. Compare that with the previous question: once the Fed pays interest on reserves, it is much closer to simply announcing the rate.',
    },
  ],
  keyTakeaways: [
    'The federal funds rate is the price of reserves lent between banks overnight.',
    'A target is achieved by changing the supply of reserves, not by decree.',
    'In the video, reserves earned no interest, which is why banks with spare reserves wanted to lend them.',
  ],
});
