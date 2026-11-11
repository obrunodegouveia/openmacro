import { defineLesson } from '../../schema';

/**
 * Money, introduced as the tool that solves the problems of the last two
 * lessons: it lets energy put in for one person reach a stranger, and it lets
 * energy put in today be used next year.
 *
 * It ends on the leak — money that buys less than it did — because that is the
 * question the rest of the course answers: who makes money, and what happens
 * to what you stored in it when they make more. The three jobs of money are
 * named here only in passing; Foundations of Fiduciary Currency teaches them
 * properly.
 */
export const howEnergyTravelsLesson = defineLesson({
  id: 'how-energy-travels',
  title: 'Money: How Energy Travels',
  subtitle:
    'Money is the tool that carries the energy you put in to the products and services you want, even years later.',
  icon: '🔋',
  difficulty: 'intro',
  estimatedMinutes: 9,
  hearts: 4,
  challenges: [
    // ---- Olivia and Breno warm-ups ------------------------------------------
    // Why Breno will not take a song for strings, why Olivia can save her
    // busking money, and what happens when it buys less than it did.
    {
      id: 'breno-no-song-for-rent',
      type: 'multiple_choice',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'money', 'barter'],
      prompt:
        'Olivia wants a €10 set of strings from Breno’s shop. She offers to sing him a song instead of paying. Breno laughs: he loves music, but he has to pay his rent, and his landlord does not want a song. What is the problem?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'pass-on', label: 'Breno can pass money on to his landlord, but not a song' },
        {
          id: 'bad-song',
          label: 'Olivia’s song is not good enough to be worth €10',
          feedback:
            'It might be brilliant. The problem is not the song: it is that the next person Breno has to pay wants something else.',
        },
        {
          id: 'no-music',
          label: 'Breno does not really like music very much',
          feedback:
            'He runs a music shop, so he probably does. He would enjoy the song, but enjoying it does not pay his rent.',
        },
        {
          id: 'grown-ups',
          label: 'A set of strings is worth more than one song',
          feedback:
            'The trouble is not which is worth more. Even a song worth €100 would not help: Breno’s landlord cannot use a song.',
        },
      ],
      correctOptionId: 'pass-on',
      explanation:
        'Swapping one thing for another is called barter, and it only works when each side wants exactly what the other has. Money fixes that: everyone accepts it, because they can pass it on. So Olivia’s energy can reach Breno, and then Breno’s landlord, as money.',
    },
    {
      id: 'olivia-saves-for-december',
      type: 'multiple_choice',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'money', 'saving'],
      prompt:
        'Olivia earned €30 busking in May. She wants to buy a guitar pedal in December. What does money let her do?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'store', label: 'Keep the energy from May’s busking and use it in December' },
        {
          id: 'same-day',
          label: 'Nothing, because money has to be spent straight away',
          feedback:
            'Money can wait in a piggy bank for months. That is one of the most useful things about it.',
        },
        {
          id: 'replay',
          label: 'Play the same afternoon in the square again in December',
          feedback:
            'The afternoon is over and cannot happen twice. What she kept from it is the money.',
        },
        {
          id: 'grow',
          label: 'Turn her €30 into €60 by itself',
          feedback:
            'Money in a piggy bank does not grow by itself. It can even shrink, as the next question shows.',
        },
      ],
      correctOptionId: 'store',
      explanation:
        'An afternoon of music cannot be kept, but the money it earned can. Money stores energy over time: work done in May can become a pedal in December.',
    },
    {
      id: 'olivia-the-leak',
      type: 'multiple_choice',
      speaker: 'olivia',
      kids: true,
      xp: 15,
      tags: ['basics', 'money', 'inflation'],
      prompt:
        'In May the pedal cost €30. In December it costs €31, and almost everything in every shop in town has gone up too. Olivia still has her €30. What happened?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'leak', label: 'Her stored energy leaked: the same money now buys less' },
        {
          id: 'nothing',
          label: 'Nothing, because she still has €30',
          feedback:
            'The number in the piggy bank did not change, but what it can buy did. €30 is no longer enough for the pedal.',
        },
        {
          id: 'mean',
          label: 'Breno is being greedy',
          feedback:
            'If only the pedal had gone up, maybe. But when almost every price rises together, it is the money that is worth less, not one shop being greedy.',
        },
        {
          id: 'richer',
          label: 'She got richer, because the pedal is now worth more',
          feedback:
            'She does not own the pedal, so its price going up does not help her. It means her money stretches less far.',
        },
      ],
      correctOptionId: 'leak',
      explanation:
        'When prices rise across the board, each euro buys less. That is called inflation. Olivia did the same work, but her savings now buy less with it. Her energy did not simply vanish: where it went, who decides how much money there is, and why money can lose value is what the rest of this course is about.',
    },
    {
      id: 'olivia-what-money-is',
      type: 'multiple_choice',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'money'],
      prompt: 'So, in one sentence, what is money?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'tool', label: 'A tool to swap the energy you put in for products and services, now or later' },
        {
          id: 'paper',
          label: 'Special paper and metal that are valuable in themselves',
          feedback:
            'The paper in a €10 note is worth almost nothing. A note is valuable because everybody accepts it in exchange for real work and real things.',
        },
        {
          id: 'banks-only',
          label: 'Exactly the same thing as how much something is worth',
          feedback:
            'People dropped different coins into Olivia’s case for the same song, because it was worth more to some of them. Money is what you give; value is what something is worth to you.',
        },
        {
          id: 'prize',
          label: 'A prize for people who are already rich',
          feedback:
            'Olivia earned her €30 with an afternoon of music. Money is how anyone’s work reaches someone else.',
        },
      ],
      correctOptionId: 'tool',
      explanation:
        'People put in energy, as work, time and skill. Other people want what that energy makes. Money is the tool in the middle: it carries the energy from one person to the next, and keeps it until you need it.',
    },
    // ---- The grown-up version -----------------------------------------------
    {
      id: 'mc-double-coincidence',
      type: 'multiple_choice',
      tags: ['money', 'barter'],
      xp: 15,
      prompt:
        'Before money, a farmer has wheat and wants shoes. The shoemaker wants fish, not wheat. What is the name for what the farmer needs and does not have?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'double-coincidence', label: 'A double coincidence of wants' },
        {
          id: 'inflation',
          label: 'Lower inflation',
          feedback:
            'There is no money here yet, so there are no prices to rise. The problem is that the two people want different things.',
        },
        {
          id: 'more-shoes',
          label: 'More shoes in the village',
          feedback:
            'The shoes exist. The farmer cannot get them because he has nothing the shoemaker wants.',
        },
        {
          id: 'bank',
          label: 'A bank loan',
          feedback:
            'A loan would only let the farmer pay later. He would still need something the shoemaker accepts, and the shoemaker wants fish.',
        },
      ],
      correctOptionId: 'double-coincidence',
      explanation:
        'Barter needs each side to want exactly what the other has, at the same time: a double coincidence of wants. Money removes it. The farmer sells wheat to anyone for money, and pays the shoemaker with it. Anthropologists add that no pure barter economy has ever been found: early societies ran on credit and favours between neighbours, long before coins.',
    },
    {
      id: 'match-what-money-does',
      type: 'concept_match',
      tags: ['money'],
      xp: 15,
      prompt: 'Money does three jobs for the energy you put in. Match each job to what it does.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'exchange',
          term: 'Medium of exchange',
          definition: 'Carries your energy to someone else: you work for money, and they accept it for what they sell',
        },
        {
          id: 'store',
          term: 'Store of value',
          definition: 'Keeps your energy for later: money earned this year, spent next year',
        },
        {
          id: 'unit',
          term: 'Unit of account',
          definition: 'Measures everything on one scale, so an hour of work and a pair of shoes can be compared',
        },
      ],
      explanation:
        'These are the classic three jobs of money. The Foundations module later in the course looks at each one closely, and at what happens when money stops doing one of them well.',
    },
    {
      id: 'order-nurse-to-factory',
      type: 'order_flow',
      tags: ['money', 'exchange'],
      xp: 15,
      prompt: 'Follow one nurse’s night shift through the economy. Put it in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'shift',
          label: 'A nurse works a night shift',
          detail: 'Twelve hours of energy and skill.',
        },
        {
          id: 'paid',
          label: 'The hospital pays her €150',
          detail: 'Energy stored as money.',
        },
        {
          id: 'ukulele',
          label: 'She buys her son a €40 ukulele at Breno’s shop',
          detail: 'Spent in a music shop.',
        },
        {
          id: 'factory',
          label: 'Breno pays the factory that made the ukulele',
          detail: 'To the people who built it.',
        },
      ],
      correctOrder: ['shift', 'paid', 'ukulele', 'factory'],
      explanation:
        'The nurse never meets the factory workers, and they never meet her. Money links them anyway: her night of work becomes their wages. That is the job money does for an economy of strangers.',
    },
    {
      id: 'mc-more-money',
      type: 'multiple_choice',
      tags: ['money', 'inflation'],
      xp: 20,
      prompt:
        'Suppose the amount of money grows much faster than the amount of products and services people make. What happens to the energy stored in each euro?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'less', label: 'Each euro buys less, so savings lose some of the energy they stored' },
        {
          id: 'richer',
          label: 'Everyone gets richer, because there is more money',
          feedback:
            'There is more money, but not more things to buy. More euros chasing the same products and services push prices up.',
        },
        {
          id: 'fixed',
          label: 'Nothing, because the value of a euro is fixed by law',
          feedback:
            'The law fixes what a euro is called, not what it buys. What it buys depends on how much money there is and how much there is to buy.',
        },
        {
          id: 'more',
          label: 'Each euro buys more',
          feedback:
            'That happens when goods grow faster than money. Here it is the other way round.',
        },
      ],
      correctOptionId: 'less',
      explanation:
        'Money is only useful if it holds the energy you put into it. When it is created faster than what it can buy, it leaks. The next module starts with who creates most of our money, which turns out to be ordinary banks.',
    },
  ],
  keyTakeaways: [
    'Barter needs a double coincidence of wants; money removes that problem.',
    'Money carries your energy to strangers, and keeps it for later.',
    'When money grows faster than what it can buy, each euro buys less.',
    'Who creates money, and how much, is what the rest of the course explains.',
  ],
});
