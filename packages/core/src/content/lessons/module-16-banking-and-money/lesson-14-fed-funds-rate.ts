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
            'Buy treasuries — reserves flood in, the short bank needs less and the long bank has more to lend',
        },
        {
          id: 'sell',
          label: 'Sell treasuries, draining reserves',
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
          label: 'Raise the reserve requirement',
          feedback:
            'That would make reserves scarcer still and push the rate up — the opposite of the intent.',
        },
      ],
      correctOptionId: 'buy',
      explanation:
        'Price is set by supply and demand, and the central bank moves both at once: buying bonds puts reserves into the system, raising supply from the bank with surplus and lowering demand from the bank that was short. If 5% is overshot, it sells until the rate comes back.',
    },
  ],
  keyTakeaways: [
    'The funds rate is the overnight price of reserves between banks.',
    'A target is achieved by changing the supply of reserves, not by decree.',
    'Reserves earn no interest, which is why surplus banks want to lend them.',
  ],
});
