import { defineLesson } from '../../schema';

/**
 * Inflation from the point of view of a household rather than of an index. The
 * course has a conceptual inflation lesson and a module on debasement; neither
 * starts from wages, savings and rent.
 */
export const whatRisingPricesDoLesson = defineLesson({
  id: 'what-rising-prices-do-to-you',
  title: 'What Rising Prices Do to You Specifically',
  subtitle:
    'Not to "the economy". To your salary, your savings and your rent — which move at different speeds, and that is the whole story.',
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
      prompt: 'You put €10,000 aside and left it alone for ten years.',
      instructions: 'Move the inflation rate and see what is left',
      narrative:
        'The money is safe. Nobody takes any of it, the bank does not fail, and the number in the app never goes down. The only thing that happens is that everything you were going to buy with it gets more expensive.',
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
          caption: 'Nobody sent you a bill for this',
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
        'Even at the 2% target — the number policy is deliberately aiming at, and considered a success — ten years costs you about a fifth of it. At 5% it costs nearly two fifths. This is not a scandal or a failure; it is the system working as designed. It is simply worth knowing that "keeping your money safe" and "keeping what your money can buy" are two different things, and only one of them is on offer.',
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
          definition: 'Worse off — the same euros, buying less',
        },
        {
          id: 'borrower',
          term: 'Someone with a fixed-rate mortgage',
          definition: 'Better off — repaying with euros that are worth less than the ones borrowed',
        },
        {
          id: 'worker',
          term: 'Someone on a salary reviewed once a year',
          definition: 'Worse off for a while — pay catches up late, if it catches up',
        },
        {
          id: 'owner',
          term: 'Someone who owns a flat',
          definition: 'Roughly protected — the flat is repriced along with everything else',
        },
      ],
      explanation:
        'Inflation is not a tax on everyone equally; it is a transfer between them. What the saver and the salaried worker lose, the borrower and the asset owner keep. That is worth sitting with, because it explains a great deal about who is anxious about inflation and who is quietly relaxed about it — and the two groups are not the ones you would expect from the newspapers.',
    },
    {
      id: 'mc-why-not-zero',
      type: 'multiple_choice',
      tags: ['basics', 'inflation', 'policy'],
      xp: 20,
      prompt:
        'If inflation costs savers a fifth of their money every decade, why does the ECB aim for 2% rather than zero?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'buffer',
          label: 'Because it leaves room to cut rates in a downturn, and falling prices bring problems of their own',
        },
        {
          id: 'revenue',
          label: 'Because inflation raises money for governments',
          feedback:
            'It does transfer value to borrowers, governments among them — which is a real criticism of the arrangement rather than the stated reason for the target.',
        },
        {
          id: 'impossible',
          label: 'Because zero is impossible to achieve',
        },
        {
          id: 'growth',
          label: 'Because inflation causes economic growth',
          feedback:
            'It does not, and the mainstream view has never claimed it does. The argument for a small positive target is about having room to manoeuvre, not about growth.',
        },
      ],
      correctOptionId: 'buffer',
      explanation:
        'Two reasons, both about room. If inflation sits at zero, then in a downturn a central bank cutting rates to zero has nothing left; a small positive target gives it space. And when prices are falling, people postpone buying and firms postpone hiring, which is a hard hole to climb out of — Japan spent decades on it. You can disagree with the trade, and plenty of serious people do. But it is a trade, made deliberately, and not an accident.',
    },
  ],
  keyTakeaways: [
    'At the 2% target, ten years costs about a fifth of what your savings can buy.',
    'Inflation is a transfer, not a general loss: savers and wage earners lose, borrowers and asset owners gain.',
    'Money kept safe and buying power kept are different things, and only the first is on offer.',
    'The 2% target is a deliberate trade — room to cut rates, and away from falling prices.',
  ],
});
