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
        'The village now believes it holds 2,710 gold pieces when only 1,000 exist. What determines whether that represents real wealth?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'projects',
          label:
            'Whether the funded projects genuinely produce at least as much future value as was borrowed',
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
        'The money expanded to finance production. If the canal and the factory really do generate more than was borrowed, the claims are backed by future goods rather than by metal. If they were mismanaged, the claims are hollow — and no reserve ratio would have made them otherwise.',
    },
    {
      id: 'mc-deflation',
      type: 'multiple_choice',
      tags: ['inflation', 'productivity'],
      xp: 25,
      prompt:
        'Apples produced go from 1,000 a year to 3,000, while perceived money goes from 1,000 to 2,710. What happens to the price of an apple?',
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
            'Money grew 2.71×; apples grew 3×. More money chasing even more goods means each apple costs less money, not more.',
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
            'The interest rate shapes which projects get funded; here the outcome is already known, and the arithmetic of money against goods settles the price level.',
        },
      ],
      correctOptionId: 'falls',
      explanation:
        'This is the counter-example to "money creation always means inflation". Money grew, and prices still fell, because the money was put to work building things that made the pie bigger faster than the money grew. Inflation is about the race between the two, not about the creation of money alone.',
    },
    {
      id: 'mc-bad-projects',
      type: 'multiple_choice',
      tags: ['money-creation', 'inflation', 'credit-risk'],
      xp: 30,
      prompt:
        'Run the same story with bad projects. The canal silts up, the tool factory never opens, and apple production stays at 1,000 a year. Deposits are still 2,710. What has gone wrong, and where?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'both',
          label: 'Both an inflation and a bank failure, out of the same failed projects',
        },
        {
          id: 'inflation',
          label: 'Only inflation — more money chasing the same number of apples',
          feedback:
            'That is half of it. Ask what is on the asset side of the bank against those 2,710 of deposits: two loans that will not be repaid.',
        },
        {
          id: 'bankonly',
          label: 'Only the bank fails. Prices are set by supply and demand, not by deposits',
          feedback:
            'Prices here are set by claims meeting goods. 2,710 of spendable claims against 1,000 apples is a different price level from 1,000 against 1,000.',
        },
        {
          id: 'nothing',
          label: 'Nothing. The money was created and still exists',
          feedback:
            'It exists as a number in an account. What it buys, and whether the bank can honour it, are exactly what the failed projects have changed.',
        },
      ],
      correctOptionId: 'both',
      explanation:
        'This is the mirror image of the video and the more useful half. Credit expansion is not inflationary or benign by nature — it depends entirely on whether the things borrowed for get built. When they do, money and goods grow together. When they do not, you get both an inflation and a banking crisis out of the same failed projects, which is a fair description of most financial crises.',
    },
    {
      id: 'mc-partial-growth',
      type: 'multiple_choice',
      tags: ['inflation', 'money-supply'],
      xp: 30,
      prompt:
        'Now suppose the projects half worked: apple output rises from 1,000 to 1,500 a year rather than 3,000, while deposits still reach 2,710. What happens to the price of an apple?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'rises',
          label: 'It rises — claims grew 2.7 times and apples only 1.5',
        },
        {
          id: 'falls',
          label: 'It falls, as it did in the video, because output went up',
          feedback:
            'Output going up is not enough on its own. What matters is whether it went up faster than the claims on it, and 1.5 times is well short of 2.7.',
        },
        {
          id: 'same',
          label: 'It stays at one gold piece, because M0 is still 1,000',
          feedback:
            'People spend what they believe they hold, which is the 2,710 in their accounts. M0 sitting in a vault is not what meets the apples at market.',
        },
        {
          id: 'unknowable',
          label: 'There is not enough information without knowing the interest rate',
          feedback:
            'The interest rate decides who gets to borrow. The price level here follows from the two ratios you already have.',
        },
      ],
      correctOptionId: 'rises',
      explanation:
        'Roughly 2,710 of claims against 1,500 apples is about 1.8 gold pieces an apple, up from one. The video picks numbers where wealth outruns money and gets deflation; pick numbers where it does not and the same mechanism gives inflation. Nothing about credit creation determines which — the productivity of what was funded does.',
    },
    {
      id: 'match-money-wealth',
      type: 'concept_match',
      tags: ['money-supply', 'wealth'],
      xp: 25,
      prompt: 'The video insists on one distinction above all others. Match each idea to what it actually refers to on the island.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'money',
          term: 'Money',
          definition: 'The 2,710 of claims — you cannot eat it, live under it or travel on it',
        },
        {
          id: 'wealth',
          term: 'Wealth',
          definition: 'The apples, the canal and the tool factory, which is what the claims are claims on',
        },
        {
          id: 'm0',
          term: 'M0',
          definition: 'The 1,000 gold pieces, which never changed and never could',
        },
        {
          id: 'deflation',
          term: 'Deflation on the island',
          definition: 'Wealth grew faster than the claims on it, so each claim came to buy more',
        },
      ],
      explanation:
        'Sal says confusing the two will make you unhappy, and he is making an economic point rather than a moral one. Gold represents wealth; it is not wealth. An island that doubles its gold and grows no apples is not richer, and an island that triples its apples is richer whether or not anyone mines anything.',
    },
  ],
  keyTakeaways: [
    'Created money is real wealth exactly insofar as the projects it funded are real.',
    'Money represents wealth; it is not wealth. Gold cannot be eaten either.',
    'Money creation can coexist with falling prices when output grows faster.',
  ],
});
