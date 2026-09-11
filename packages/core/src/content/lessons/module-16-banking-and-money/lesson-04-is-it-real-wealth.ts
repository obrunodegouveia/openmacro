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
  ],
  keyTakeaways: [
    'Created money is real wealth exactly insofar as the projects it funded are real.',
    'Money represents wealth; it is not wealth. Gold cannot be eaten either.',
    'Money creation can coexist with falling prices when output grows faster.',
  ],
});
