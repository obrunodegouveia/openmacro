import { defineLesson } from '../../schema';

/**
 * The first lesson of the course. Before money, banks or rates, the one idea
 * economics is built on: some things are scarce and wanted, so people need a
 * way to decide who gets them, and every choice costs the thing given up.
 *
 * The definition is Lionel Robbins's (1932), in plain words: economics studies
 * how people use scarce means, which have other uses, to get what they want.
 */
export const whyEconomicsExistsLesson = defineLesson({
  id: 'why-economics-exists',
  title: 'Why Economics Exists',
  subtitle:
    'Not everything we want is free and endless. Economics is the study of how people deal with that.',
  icon: '⏳',
  difficulty: 'intro',
  estimatedMinutes: 9,
  hearts: 4,
  challenges: [
    // ---- Olivia and Breno warm-ups ------------------------------------------
    // Scarce and wanted, opportunity cost, and why scarcity needs a system,
    // each told with something a 12-year-old has actually had to share.
    {
      id: 'olivia-scarce-and-wanted',
      type: 'multiple_choice',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'scarcity'],
      prompt:
        'Something is scarce when there is not enough of it for everyone who wants it. Olivia is singing at the school talent show. The hall has 40 seats, and 100 people want to come. Which of these is scarce and wanted?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'seats', label: 'The 40 seats in the hall' },
        {
          id: 'air',
          label: 'The air in the hall',
          feedback:
            'Everybody wants air, but there is enough for all 100 people. Nobody has to give anything up to breathe, so air is not scarce here.',
        },
        {
          id: 'broken-chair',
          label: 'The one broken chair at the back that nobody wants',
          feedback:
            'There is only one, so it is rare. But nobody wants it, so nobody has to decide who gets it. Scarce means rare and wanted.',
        },
        {
          id: 'sunshine',
          label: 'The sunshine in the playground outside',
          feedback:
            'Sunshine is lovely, but there is enough for everyone in the playground. Nobody needs to share it out.',
        },
      ],
      correctOptionId: 'seats',
      explanation:
        'Forty seats and a hundred people who want one: somebody has to decide who sits down. That decision is what economics is about. It only starts when something is both scarce and wanted.',
    },
    {
      id: 'olivia-saturday',
      type: 'multiple_choice',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'opportunity-cost'],
      prompt:
        'Olivia has three free hours on Saturday. She can practise her song for the talent show, or go to the beach with her friends. She cannot do both. What does practising really cost her?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'beach', label: 'The trip to the beach she gives up' },
        {
          id: 'nothing',
          label: 'Nothing, because practising is free',
          feedback:
            'She pays no money, but she pays with her time. Three hours spent practising are three hours she cannot spend at the beach.',
        },
        {
          id: 'strings',
          label: 'The price of the guitar strings she uses',
          feedback:
            'Strings wear out slowly, but that is not the big cost here. The biggest thing she gives up is the afternoon with her friends.',
        },
        {
          id: 'zero',
          label: '€0, because nobody pays her to practise',
          feedback:
            'Costs are not only money. Her time is scarce: every hour can only be used once.',
        },
      ],
      correctOptionId: 'beach',
      explanation:
        'Time is the scarcest thing Olivia has. Whatever she chooses, the real cost is the best thing she gave up. Economists call it the opportunity cost, and every choice has one.',
    },
    {
      id: 'breno-one-amp-left',
      type: 'multiple_choice',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'scarcity', 'prices'],
      prompt:
        'Breno has one amp left in his music shop, and three kids want it. What do shops usually do to decide who gets it?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'price', label: 'Put a price on it: whoever pays €40 gets it' },
        {
          id: 'loudest',
          label: 'Give it to whoever shouts the loudest',
          feedback:
            'That would be a system too, but a terrible one: it rewards shouting, not wanting the amp most. Shops use prices because they are fair to everyone who can pay.',
        },
        {
          id: 'magic',
          label: 'Make two more amps appear',
          feedback:
            'Nobody can make an amp appear. Somebody has to build it, which takes work and time. That is exactly why there is only one.',
        },
        {
          id: 'cut',
          label: 'Cut it into three pieces',
          feedback:
            'Then nobody would have a working amp. Some scarce things cannot be shared out in pieces, so someone has to get the whole thing.',
        },
      ],
      correctOptionId: 'price',
      explanation:
        'When something is scarce and wanted, people need a system to decide who gets it. A price is one system. A queue, a lottery or a rule like “first come, first served” are others. Economics studies these systems and how well they work.',
    },
    {
      id: 'olivia-first-come',
      type: 'multiple_choice',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'scarcity'],
      prompt:
        'Tickets for the talent show are free. The school gives the 40 seats to the first 40 people who arrive. What is the school using to share out the seats?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'first-come', label: 'A rule: first come, first served' },
        {
          id: 'price',
          label: 'A price, because seats are worth money',
          feedback:
            'Nobody pays anything here: the tickets are free. The seats still have to be shared out, so the school picked a different system.',
        },
        {
          id: 'lottery',
          label: 'A lottery, picking names out of a hat',
          feedback:
            'Nobody draws names. Whoever arrives early gets a seat, so the people who pay are the ones who give up their time to queue.',
        },
        {
          id: 'no-system',
          label: 'No system at all, because the seats are free',
          feedback:
            'Free does not mean there is enough. Forty seats and a hundred people still need a rule, and “first come, first served” is one.',
        },
      ],
      correctOptionId: 'first-come',
      explanation:
        'Even when something costs no money, if it is scarce somebody pays for it some other way. Here people pay with their time, by arriving early. Prices, queues and lotteries are all answers to the same problem: scarcity.',
    },
    // ---- The definition -----------------------------------------------------
    {
      id: 'mc-definition',
      type: 'multiple_choice',
      tags: ['basics', 'scarcity', 'definition'],
      xp: 15,
      prompt: 'Which is the best definition of economics?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'scarcity',
          label: 'How people deal with scarcity, and the choices it forces',
        },
        {
          id: 'money',
          label: 'The study of money, banks and how they create credit',
          feedback:
            'Money and banks are tools economics studies, but economics would exist without them. A person alone on an island still has to choose how to spend scarce hours: fishing, building a shelter or resting.',
        },
        {
          id: 'rich',
          label: 'The study of how people and companies get rich',
          feedback:
            'That is personal finance. Economics explains how a whole society shares out what is scarce, which includes people who never get rich.',
        },
        {
          id: 'markets',
          label: 'The study of the stock market and share prices',
          feedback:
            'The stock market is one small corner of it. Most economics is about everyday things: jobs, prices, food, housing and time.',
        },
      ],
      correctOptionId: 'scarcity',
      explanation:
        'The classic definition comes from the economist Lionel Robbins, in 1932: economics studies how people use scarce means, which have other uses, to reach their ends. In short: scarcity and choice. Money comes later in this course, as the tool people invented to deal with it.',
    },
    {
      id: 'mc-economic-good',
      type: 'multiple_choice',
      tags: ['basics', 'scarcity'],
      xp: 15,
      prompt:
        'An economic good is something both scarce and wanted, so people have to decide how to share it. Which of these is one?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'water', label: 'Clean drinking water in a city during a drought' },
        {
          id: 'sand',
          label: 'Sand in the middle of the Sahara',
          feedback:
            'There is far more sand there than anyone wants, so nobody has to give anything up to have some. It is a free good in that place.',
        },
        {
          id: 'air',
          label: 'Air on a windy beach',
          feedback:
            'Everyone wants it, but there is plenty for all. Wanted is not enough: it also has to be scarce.',
        },
        {
          id: 'cold',
          label: 'The cold you caught last week',
          feedback:
            'It may feel like you have plenty of it, but nobody wants it. Economics deals with things people want and cannot all have.',
        },
      ],
      correctOptionId: 'water',
      explanation:
        'Water is usually cheap, but in a drought there is not enough for every use: drinking, washing, farming, gardens. The city has to decide who gets how much, by price, by rules or by rationing. The same thing can be free in one place and scarce in another.',
    },
    {
      id: 'match-scarcity-words',
      type: 'concept_match',
      tags: ['basics', 'scarcity', 'opportunity-cost'],
      xp: 15,
      prompt: 'Four words this course will use again and again. Match each one to its meaning.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'scarcity',
          term: 'Scarcity',
          definition: 'Not enough of something for everyone who wants it',
        },
        {
          id: 'opportunity-cost',
          term: 'Opportunity cost',
          definition: 'The best thing you give up when you make a choice',
        },
        {
          id: 'economic-good',
          term: 'Economic good',
          definition: 'Something scarce and wanted, so people must decide how to share it',
        },
        {
          id: 'free-good',
          term: 'Free good',
          definition: 'Something so plentiful that nobody gives anything up to have it',
        },
      ],
      explanation:
        'Every lesson after this one is about an economic good, and about the systems people built to share it out: prices, markets, money, banks and the rules around them. Scarcity is why any of those exist.',
    },
  ],
  keyTakeaways: [
    'Economics is the study of how people deal with scarcity.',
    'Something matters to economics when it is both scarce and wanted.',
    'Every choice has an opportunity cost: the best thing you gave up.',
    'Scarcity needs a system to decide who gets what, and prices are one of them.',
  ],
});
