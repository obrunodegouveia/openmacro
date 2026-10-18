import { defineLesson } from '../../schema';

/**
 * Video 4. The question left hanging by the multiplier: is the extra money a
 * shell game? The answer turns on whether the projects were real.
 */
export const kabIsItRealWealthLesson = defineLesson({
  id: 'kab-is-it-real-wealth',
  title: 'Is the Extra Money a Shell Game?',
  subtitle:
    'Deposits nearly tripled. Whether that is wealth or a trick depends on one thing — and it is not the gold.',
  icon: '🍎',
  difficulty: 'core',
  estimatedMinutes: 17,
  video: {
    url: 'https://www.youtube.com/watch?v=F7r7l1VG-Tw',
    minutes: 11,
    source: 'Khan Academy — Banking 4',
  },
  challenges: [
    {
      id: 'mc-what-makes-it-real',
      type: 'multiple_choice',
      tags: ['money-vs-wealth', 'investment'],
      xp: 20,
      prompt:
        'The villagers’ accounts now add up to 2,710 gold pieces, but only 1,000 coins exist. What decides whether the extra money stands for real wealth?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'projects',
          label:
            'Whether the projects it funded really produce at least as much value as was borrowed',
        },
        {
          id: 'gold-ratio',
          label: 'Whether enough gold is held against the deposits',
          feedback:
            'The gold is inert. It sits in the vault whether the canal works or not — it cannot tell you whether wealth was created.',
        },
        {
          id: 'confidence',
          label: 'Whether depositors believe their money is there',
          feedback:
            'Confidence keeps the bank open; it does not make an irrigation ditch produce apples. A confident village funding useless projects is still poorer afterwards.',
        },
        {
          id: 'never',
          label: 'It never does — money created by lending is always illusory',
          feedback:
            'That is the conclusion the video argues against, and its test is concrete: did apple production rise? In the example it goes from 1,000 to 3,000 a year.',
        },
      ],
      correctOptionId: 'projects',
      explanation:
        'The money expanded to finance production. If the canal and the factory really produce more than was borrowed, the deposits are backed by future goods rather than by metal. If the projects fail, the deposits are hollow — and no reserve ratio would have changed that.',
    },
    {
      id: 'mc-deflation',
      type: 'multiple_choice',
      tags: ['inflation', 'productivity'],
      xp: 25,
      prompt:
        'Apple production rises from 1,000 a year to 3,000, while the money people believe they hold rises from 1,000 to 2,710. Assume people spend their money as often as before. What happens to the price of an apple?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'falls',
          label: 'It falls — output grew faster than the money supply',
        },
        {
          id: 'rises',
          label: 'It rises, because far more money is chasing apples',
          feedback:
            'Money grew 2.71 times; apples grew 3 times. Apples grew faster than money, so each apple costs less money, not more.',
        },
        {
          id: 'same',
          label: 'It stays the same, since both roughly tripled',
          feedback:
            'Close, but the ratio moved: 2,710 against 3,000 is less money per apple than 1,000 against 1,000.',
        },
        {
          id: 'unknowable',
          label: 'It cannot be known without the interest rate',
          feedback:
            'The interest rate shapes which projects get funded. Here you already know the result, and comparing money with goods is enough to settle the price.',
        },
      ],
      correctOptionId: 'falls',
      explanation:
        'This is the counter-example to "creating money always means inflation". Money grew and prices still fell, because the money funded projects that grew output faster than the money grew. Inflation depends on the race between money and goods, not on money creation alone.',
    },
    {
      id: 'mc-bad-projects',
      type: 'multiple_choice',
      tags: ['money-creation', 'inflation', 'credit-risk'],
      xp: 30,
      prompt:
        'Now run the same story with bad projects. The canal silts up, the tool factory never opens, and apple production stays at 1,000 a year. Deposits are still 2,710. What goes wrong?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'both',
          label: 'Two things: prices rise, and the bank is in trouble because its loans will not be repaid',
        },
        {
          id: 'inflation',
          label: 'Only inflation — more money chasing the same number of apples',
          feedback:
            'That is half of it. Look at what the bank holds against those 2,710 of deposits: two loans that will not be repaid.',
        },
        {
          id: 'bankonly',
          label: 'Only the bank is in trouble. Prices are set by supply and demand, not by deposits',
          feedback:
            'Deposits are the demand side: they are what people spend. 2,710 of spendable money against 1,000 apples gives a higher price than 1,000 against 1,000.',
        },
        {
          id: 'nothing',
          label: 'Nothing. The money was created and still exists',
          feedback:
            'It exists as a number in an account. What it buys, and whether the bank can pay it out, are exactly what the failed projects have changed.',
        },
      ],
      correctOptionId: 'both',
      explanation:
        'This is the mirror image of the video. More lending is not inflationary or harmless by nature — it depends on whether the things it pays for actually get built. When they do, money and goods grow together. When they do not, the same failed projects bring both rising prices and a banking crisis, which is a fair description of many financial crises.',
    },
    {
      id: 'mc-partial-growth',
      type: 'multiple_choice',
      tags: ['inflation', 'money-supply'],
      xp: 30,
      prompt:
        'Now suppose the projects only half worked: apple production rises from 1,000 to 1,500 a year instead of 3,000, while deposits still reach 2,710. Assume people spend their money as often as before. What happens to the price of an apple?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'rises',
          label: 'It rises — money grew 2.7 times and apples only 1.5 times',
        },
        {
          id: 'falls',
          label: 'It falls, as it did in the video, because output went up',
          feedback:
            'Output going up is not enough on its own. What matters is whether it grew faster than money, and 1.5 times is well short of 2.7.',
        },
        {
          id: 'same',
          label: 'It stays at one gold piece, because there are still only 1,000 coins of gold (M0)',
          feedback:
            'People spend what they believe they hold, which is the 2,710 in their accounts. M0 sitting in a vault is not what meets the apples at market.',
        },
        {
          id: 'unknowable',
          label: 'There is not enough information without knowing the interest rate',
          feedback:
            'The interest rate decides who gets to borrow. The price here follows from the two growth figures you already have.',
        },
      ],
      correctOptionId: 'rises',
      explanation:
        '2,710 of money against 1,500 apples is about 1.8 gold pieces an apple, up from one. The video picks numbers where goods grow faster than money, and prices fall. Pick numbers where they do not, and the same mechanism raises prices. Lending itself does not decide which — how productive the funded projects are does.',
    },
    {
      id: 'match-money-wealth',
      type: 'concept_match',
      tags: ['money-supply', 'wealth'],
      xp: 25,
      prompt: 'The video insists that money and wealth are different things. Match each idea to what it refers to on the island.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'money',
          term: 'Money',
          definition: 'The 2,710 in people’s accounts — you cannot eat it, live in it or travel on it',
        },
        {
          id: 'wealth',
          term: 'Wealth',
          definition: 'The apples, the canal and the tool factory — the real things the money can buy',
        },
        {
          id: 'm0',
          term: 'M0',
          definition: 'The 1,000 gold coins themselves, which never changed in number',
        },
        {
          id: 'deflation',
          term: 'Deflation on the island',
          definition: 'Goods grew faster than money, so each gold piece came to buy more',
        },
      ],
      explanation:
        'Sal says confusing the two will make you unhappy, and he means it as an economic point, not a moral one. Money represents wealth; it is not wealth. An island that doubles its gold and grows no more apples is not richer, and an island that triples its apples is richer whether or not anyone mines more gold.',
    },
  ],
  keyTakeaways: [
    'Created money is real wealth exactly insofar as the projects it funded are real.',
    'Money represents wealth; it is not wealth. Gold cannot be eaten either.',
    'Money creation can coexist with falling prices when output grows faster.',
  ],
});
