import { defineLesson } from '../../schema';

/** Video 14. The target rate as the price of overnight reserves, moved by changing their supply. */
export const kabFedFundsRateLesson = defineLesson({
  id: 'kab-fed-funds-rate',
  title: 'How the Central Bank Hits Its Target Rate',
  subtitle:
    'The central bank cannot order banks to lend to each other at 5%. Instead it adds reserves until the rate falls to 5%.',
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
      prompt: 'The federal funds rate is an interest rate. Who lends to whom at this rate?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'interbank',
          label: 'Banks lend reserves to each other, for one night',
        },
        {
          id: 'to-public',
          label: 'Banks lend to families and businesses',
          feedback:
            'Those rates follow it. But the federal funds rate is only between banks: a bank with spare reserves lends to a bank that needs more.',
        },
        {
          id: 'fed-lends',
          label: 'The central bank lends directly to banks',
          feedback:
            'That is the discount rate, from video 19. It is set higher on purpose, so that banks borrow from each other first.',
        },
        {
          id: 'treasury',
          label: 'The government borrows money for one day',
          feedback:
            'Short-term government borrowing is a different market. The federal funds rate is about the reserves banks keep at the central bank.',
        },
      ],
      correctOptionId: 'interbank',
      explanation:
        'It is a target, not an order. The central bank says which rate it wants. Then it buys or sells Treasury bonds until the supply of reserves gives that rate. One detail from the video: at that time, reserves earned no interest. That is why a bank with spare reserves was keen to lend them.',
    },
    {
      id: 'mc-lower-the-rate',
      type: 'multiple_choice',
      tags: ['monetary-policy', 'open-market-operations'],
      xp: 25,
      prompt:
        'Banks are lending reserves to each other for one night at 8%. The central bank wants that rate to be 5%. What does it do?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'buy',
          label:
            'Buy Treasury bonds, so there are more reserves and they get cheaper',
        },
        {
          id: 'sell',
          label: 'Sell Treasury bonds, which takes reserves out of the banks',
          feedback:
            'That pushes the rate up. With fewer reserves, banks that need to borrow are more desperate, and banks that lend have less to spare.',
        },
        {
          id: 'instruct',
          label: 'Tell the banks to charge 5%',
          feedback:
            'It cannot control a private deal between two banks. Both banks must agree. So the tool is changing how many reserves there are, not giving orders.',
        },
        {
          id: 'reserve-req',
          label: 'Raise the reserve requirement',
          feedback:
            'Banks would then need more reserves. Reserves would be even harder to find, and the rate would go up. That is the opposite of what it wants.',
        },
      ],
      correctOptionId: 'buy',
      explanation:
        'The rate is a price, set by supply and demand. When the central bank buys bonds, it adds reserves. Banks with spare reserves have more to lend, and banks that were short need to borrow less. So the rate falls. If it falls below 5%, the central bank sells bonds until it comes back up.',
    },
    {
      id: 'mc-overnight-really',
      type: 'multiple_choice',
      tags: ['fed-funds', 'interest-rates'],
      xp: 30,
      prompt:
        'Bank B lends to Bank A for one night “at 10%”. Bank A pays it back the next morning. About how much interest does Bank A pay for that one night?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'annualised',
          label: 'About 10% ÷ 365, or about 0.03% of the amount, because the rate is per year',
        },
        {
          id: 'tenpercent',
          label: '10% of the amount borrowed',
          feedback:
            'That would make one-night loans the most expensive loans in the world. Interest rates are normally given per year, even for very short loans.',
        },
        {
          id: 'depends',
          label: 'It depends on what the Fed decides the next morning',
          feedback:
            'The rate is agreed when the loan is made. What the Fed does tomorrow only affects tomorrow’s loans.',
        },
        {
          id: 'nothing',
          label: 'Nothing, because it is paid back the next day',
          feedback:
            'A very small amount is still a real amount. If you repeat the loan every night for a year, it adds up to about the yearly rate. That is why the rate is given per year.',
        },
      ],
      correctOptionId: 'annualised',
      explanation:
        'The loan is for one night, but the rate is given per year. Banks borrow and repay every day, and giving a yearly rate lets you compare it with any other loan. The market rate changes every day. The central bank changes its target only at its meetings (eight times a year at the Fed).',
    },
    {
      id: 'mc-iorb-changes-it',
      type: 'multiple_choice',
      tags: ['fed-funds', 'reserves', 'monetary-policy'],
      xp: 35,
      prompt:
        'In the video, reserves earn no interest, so banks lend their spare reserves at whatever rate they can get. Since 2008, the Fed pays interest on reserves. What does that change?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'floor',
          label: 'The interest on reserves sets a floor under the rate between banks',
        },
        {
          id: 'nothing',
          label: 'Nothing, because banks still lend spare reserves to each other',
          feedback:
            'They do, but not at any price. If a bank can earn 4% safely at the Fed, it will not lend to another bank at 3%. So the Fed has to work differently to hit its target.',
        },
        {
          id: 'higher',
          label: 'It makes the market rate always higher than the target',
          feedback:
            'It keeps the rate near the target, not above it. In practice the market rate is usually a little below what the Fed pays on reserves. Some lenders in that market are not banks, so they cannot earn it.',
        },
        {
          id: 'nomore',
          label: 'The Fed can no longer buy or sell bonds at all',
          feedback:
            'It still buys and sells bonds. That is how its balance sheet grew and shrank after 2008. What changed is that the amount of reserves no longer sets the rate.',
        },
      ],
      correctOptionId: 'floor',
      explanation:
        'This is the biggest way the video is now out of date. In the video, the Fed keeps reserves scarce, and the scarcity sets the price. Today the Fed keeps lots of reserves and simply says what it will pay on them. No bank will lend for much less than that, so it works as a floor. That is how the Fed could hold trillions of reserves and still raise rates.',
    },
    {
      id: 'order-transmission',
      type: 'order_flow',
      tags: ['open-market-operations', 'fed-funds'],
      xp: 30,
      prompt: 'Put the steps in order: from the Fed buying bonds to a lower federal funds rate.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'buy', label: 'The Fed buys Treasury bonds from the market', detail: 'It pays with money it has just created' },
        { id: 'grandmother', label: 'The seller is paid and puts the money in a bank' },
        { id: 'reserves', label: 'Reserves go up across the banks', detail: 'At banks that needed more and at banks that had spare' },
        { id: 'demand', label: 'The bank that needed reserves now has to borrow less for the night' },
        { id: 'supply', label: 'So the bank with spare reserves finds fewer banks to lend to' },
        { id: 'rate', label: 'The one-night rate goes down', detail: 'More to lend, fewer borrowers, lower price' },
      ],
      correctOrder: ['buy', 'grandmother', 'reserves', 'demand', 'supply', 'rate'],
      explanation:
        'Here the Fed never sets the rate by order. It changes the amount of reserves, and the banks lending to each other find the price. That is why it is a target, and why the real rate moves a little around it. Compare the previous question: once the Fed pays interest on reserves, it is much closer to simply announcing the rate.',
    },
  ],
  keyTakeaways: [
    'The federal funds rate is the price banks pay to borrow reserves from each other for one night.',
    'The central bank reaches its target by changing the amount of reserves, not by giving orders.',
    'In the video, reserves earned no interest, so banks with spare reserves wanted to lend them.',
  ],
});
