import { defineLesson } from '../../schema';

/**
 * Inflation from the point of view of a household rather than of an index. The
 * course has a conceptual inflation lesson and a module on debasement; neither
 * starts from wages, savings and rent.
 */
export const whatRisingPricesDoLesson = defineLesson({
  id: 'what-rising-prices-do-to-you',
  title: 'What Rising Prices Do to You',
  subtitle:
    'Not to “the economy”: to your salary, your savings and your rent. They change at different speeds, and that is what matters.',
  icon: '🛒',
  difficulty: 'intro',
  estimatedMinutes: 6,
  hearts: 5,
  challenges: [
    {
      id: 'sim-savings',
      type: 'interactive_sim',
      tags: ['basics', 'inflation', 'savings'],
      xp: 25,
      currency: 'EUR',
      prompt: 'You put €10,000 aside and do not touch it for ten years.',
      instructions: 'Move the inflation rate and see what is left',
      narrative:
        'The money is safe. Nobody takes any of it, the bank does not fail, and the number in the app never goes down. The only change is that everything you wanted to buy with it gets more expensive.',
      constants: {
        nominal: 10000,
        years: 10,
      },
      sliders: [
        {
          key: 'inflationRate',
          label: 'Average inflation a year',
          min: 0,
          max: 0.1,
          step: 0.005,
          defaultValue: 0.02,
          format: 'percent',
          hint: '2% is what the ECB aims for. The euro area hit 8.4% in 2022.',
        },
      ],
      readouts: [
        {
          key: 'remaining',
          label: 'What it can still buy',
          formulaId: 'purchasing_power',
          format: 'currency',
          emphasis: true,
          caption: 'In today’s prices, after ten years',
        },
        {
          key: 'lost',
          label: 'Gone',
          formulaId: 'purchasing_power_lost',
          format: 'percent',
          caption: 'Lost without anyone sending you a bill',
        },
      ],
      objective: {
        description: 'Compare the 2% target with 5%, and leave under €7,000 standing',
        requiredObservations: [{ sliderKey: 'inflationRate', values: [0.02, 0.05] }],
        target: {
          readoutKey: 'remaining',
          comparator: 'lte',
          value: 7000,
        },
      },
      explanation:
        'Even at the 2% target, which counts as success, ten years costs you about a fifth of what your money can buy. At 5% it costs nearly two fifths. This is not a failure: the system is working as designed. But “keeping your money safe” and “keeping what your money can buy” are two different things, and you only get the first.',
    },
    {
      id: 'match-who-feels-it',
      type: 'concept_match',
      tags: ['basics', 'inflation', 'distribution'],
      xp: 20,
      prompt: 'Prices rise 10% over two years. Match each person to what happens to them.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'saver',
          term: 'Someone with savings in the bank',
          definition: 'Worse off: the same euros now buy less',
        },
        {
          id: 'borrower',
          term: 'Someone with a fixed-rate mortgage',
          definition: 'Better off: pays back with euros worth less than the ones borrowed',
        },
        {
          id: 'worker',
          term: 'Someone on a salary reviewed once a year',
          definition: 'Worse off for a while: pay catches up late, if at all',
        },
        {
          id: 'owner',
          term: 'Someone who owns a flat',
          definition: 'Mostly protected: the flat’s price rises along with everything else',
        },
      ],
      explanation:
        'Inflation does not hit everyone equally. It moves value from some people to others. What savers and salary earners lose, borrowers and owners of things like flats keep. This explains who worries about inflation and who does not.',
    },
    {
      id: 'mc-why-not-zero',
      type: 'multiple_choice',
      tags: ['basics', 'inflation', 'policy'],
      xp: 20,
      prompt:
        'Inflation costs savers about a fifth of their money every ten years. So why does the ECB aim for 2% and not zero?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'buffer',
          label: 'It leaves room to cut rates in a crisis, and falling prices cause their own problems',
        },
        {
          id: 'revenue',
          label: 'Because inflation raises money for governments',
          feedback:
            'Inflation does help borrowers, including governments. That is a real criticism, but it is not the official reason for the target.',
        },
        {
          id: 'impossible',
          label: 'Because zero is impossible to achieve',
        },
        {
          id: 'growth',
          label: 'Because inflation causes economic growth',
          feedback:
            'It does not, and mainstream economists have never said it does. The case for a small positive target is about having room to act, not about growth.',
        },
      ],
      correctOptionId: 'buffer',
      explanation:
        'Two reasons, both about room to act. If inflation is zero, a central bank in a crisis can cut rates only a little before it reaches zero. And when prices fall, people delay buying and companies delay hiring, which is very hard to escape. Japan was stuck like this for decades. Many people disagree with the 2% choice, but it is a deliberate choice.',
    },
  ],
  keyTakeaways: [
    'At the 2% target, ten years costs about a fifth of what your savings can buy.',
    'Inflation moves value between people: savers and workers lose, borrowers and owners gain.',
    'Keeping money safe is not the same as keeping what it can buy. You only get the first.',
    'The 2% target is a deliberate choice: room to cut rates, and a safe distance from falling prices.',
  ],
});
