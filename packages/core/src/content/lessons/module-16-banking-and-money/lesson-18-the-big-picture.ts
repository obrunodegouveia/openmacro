import { defineLesson } from '../../schema';

/** Video 18. Money against wealth, and the honest admission that gold's 1980-to-2009 record is a warning to both sides. */
export const kabBigPictureLesson = defineLesson({
  id: 'kab-big-picture',
  title: 'Money Is Not Wealth',
  subtitle:
    'Scarce or flexible, metal or paper: every kind of money is a bet on how people will behave.',
  icon: '🧭',
  difficulty: 'advanced',
  estimatedMinutes: 18,
  video: {
    url: 'https://www.youtube.com/watch?v=T9byZBGtGuw',
    minutes: 14,
    source: 'Khan Academy — Banking 18',
  },
  challenges: [
    {
      id: 'mc-scarcity',
      type: 'multiple_choice',
      tags: ['money-vs-wealth', 'gold'],
      xp: 25,
      prompt:
        'The video says gold works as money because it is scarce (hard to get more of). It says this is both good and bad. How?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'both',
          label:
            'Nobody can create more of it, which is good, but it cannot grow when the economy needs more money, which is bad',
        },
        {
          id: 'virtue',
          label: 'Only good, because money nobody can create more of is always better',
          feedback:
            'That is one side. The other side is the planting-season problem from video 16: if the amount of money cannot grow, good projects get no money.',
        },
        {
          id: 'defect',
          label: 'Only bad, because money that cannot change is always worse',
          feedback:
            'The video does not accept that either. Scarcity really does stop a government from creating money to make its debts smaller through rising prices.',
        },
        {
          id: 'neither',
          label: 'Neither, because scarcity does not matter once banks lend most deposits',
          feedback:
            'Banks lend on top of whatever base money exists, but they still need that base. When money is linked to gold, the base still has to be dug out of the ground.',
        },
      ],
      correctOptionId: 'both',
      explanation:
        'The same thing is good or bad depending on what you fear more: a government making money worth less, or an economy without enough loans. The video does not choose. It shows the trade-off clearly and lets you decide.',
    },
    {
      id: 'mc-gold-1980',
      type: 'multiple_choice',
      tags: ['gold', 'inflation', 'investing'],
      xp: 30,
      prompt:
        'In 1980 prices were rising very fast, and buying gold looked like the obvious choice. In 2009 dollars (when the video was made), gold cost about $2,400 at its 1980 peak and about $840 in 2009. What lesson does the video take from this?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'bet-on-humans',
          label:
            'That keeping your savings in something like gold is a bet on what people will do',
        },
        {
          id: 'gold-bad',
          label: 'That gold is always a bad investment over the long term',
          feedback:
            'That goes too far. The point is that it is hard to put a price on something that pays no income. It is not a judgement on gold.',
        },
        {
          id: 'inflation-never',
          label: 'That people always worry too much about rising prices',
          feedback:
            'The worry in 1980 made sense at the time. What stopped the rising prices was a policy decision that few people expected to go so far.',
        },
        {
          id: 'cash-better',
          label: 'That a savings account always beats gold in the long run',
          feedback:
            'The comparison is with a bank account paying 3–4% during that one period. It is not a general rule.',
        },
      ],
      correctOptionId: 'bet-on-humans',
      explanation:
        'A sensible person in 1980 could have put everything into gold and still done worse than a savings account decades later. The reason: the Fed, led by Paul Volcker, raised interest rates very high despite huge political pressure, and prices stopped rising so fast. Gold pays no income, so its price depends on what people expect. That makes it a bet on human decisions, not on simple maths.',
    },
    {
      id: 'mc-four-systems',
      type: 'multiple_choice',
      tags: ['monetary-systems', 'full-reserve'],
      xp: 35,
      prompt:
        'Sal describes other possible systems. Banks could keep all deposits as reserves (100%) or only part of them. And the base money could be gold or paper. Which mix limits the creation of money the most, and what is the argument for it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'fullgold',
          label: '100% reserves and gold money, so nobody can create money or misuse it',
        },
        {
          id: 'fracgold',
          label: 'Partial reserves and gold money, as in the 1800s',
          feedback:
            'This limits money more than today’s system, but less than 100% reserves with gold. Banks could still lend most deposits, and that is where most new money comes from.',
        },
        {
          id: 'fullpaper',
          label: '100% reserves and paper money, since the central bank still controls the base',
          feedback:
            'Closer, but the central bank can still create more base money whenever it wants. Take away the power to print, and nobody can add money at all.',
        },
        {
          id: 'none',
          label: 'They all limit money the same, since all four have a reserve rule',
          feedback:
            'The rules are very different. With 100% reserves, each dollar of base money stays one dollar. With 10% reserves, it can become up to ten.',
        },
      ],
      correctOptionId: 'fullgold',
      explanation:
        '100% reserves with gold money stops both printing presses at once. Banks cannot lend out deposits, and nobody can add base money without mining. Some serious economists support 100% reserves, for example the “Chicago Plan” of the 1930s. But the cost is the one Sal names: no flexibility at all. The amount of money cannot respond to a planting season or a panic. You swap one kind of crisis (money being misused) for another (money that cannot change).',
    },
    {
      id: 'mc-what-you-are-betting-on',
      type: 'multiple_choice',
      tags: ['gold', 'investing', 'inflation'],
      xp: 35,
      prompt:
        'In 1980 prices were rising very fast. A sensible person bought gold, and lost out over the next 30 years. Sal does not say they were foolish. What is his point?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'humans',
          label: 'It was a bet on people, and few expected the Fed to act so hard',
        },
        {
          id: 'wrong',
          label: 'They were simply wrong about prices rising fast',
          feedback:
            'They were right: prices were rising fast and getting worse. What they could not see was how hard the Fed would act to stop it.',
        },
        {
          id: 'timing',
          label: 'They bought at the wrong moment and should have waited',
          feedback:
            'You only know the right moment afterwards. The point is about what kind of thing you are trying to predict, not about when to buy.',
        },
        {
          id: 'goldbad',
          label: 'Gold is always a bad investment, at any moment',
          feedback:
            'He clearly refuses to say that, and says gold may do well in the future. His point is that it is very hard to put a price on, not that it will always lose.',
        },
      ],
      correctOptionId: 'humans',
      explanation:
        'Gold pays no income, so you cannot value it from what it earns. You are guessing what everyone else will think. Here, that depended on how far the Fed, led by Paul Volcker, would go: it pushed interest rates to about 20%. Sal’s numbers show the surprise: a normal savings account paying 3% or 4% from 1980 did better than gold until 2009, even though the fear of rising prices was right at the time.',
    },
    {
      id: 'match-spins',
      type: 'concept_match',
      tags: ['gold', 'fiat-money', 'monetary-systems'],
      xp: 30,
      prompt: 'Sal says each feature of money can be described in a kind way or an unkind way. Match each description to what it says.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'goldgood',
          term: 'Scarce, said kindly',
          definition: 'Safe from misuse: no government can create more of it to pay its bills',
        },
        {
          id: 'goldbad',
          term: 'Scarce, said unkindly',
          definition: 'Rigid: the amount cannot grow for a harvest, a panic or a century of growth',
        },
        {
          id: 'papergood',
          term: 'Printable, said kindly',
          definition: 'Flexible: the amount can grow just when the economy needs it',
        },
        {
          id: 'paperbad',
          term: 'Printable, said unkindly',
          definition: 'Easy to misuse: governments have often printed too much, sometimes until the money was worth nothing',
        },
      ],
      explanation:
        'Each fact is described twice. Which description people choose often depends on their politics more than on economics. The point is to keep both in mind. Scarcity really does protect against one problem and really does cause another. Choosing a kind of money means choosing which crisis you would rather risk.',
    },
  ],
  keyTakeaways: [
    'Money is what we use to swap things. Wealth is the things we swap it for.',
    'Scarce money is safe from misuse but cannot adapt. Both come from the same feature.',
    'Banks keeping 100% reserves is a real alternative, with its own costs.',
  ],
});
