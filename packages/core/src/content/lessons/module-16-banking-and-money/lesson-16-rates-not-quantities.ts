import { defineLesson } from '../../schema';

/** Video 16. Why target a rate rather than a quantity: measurement, and the elasticity argument with the planting season. */
export const kabRatesNotQuantitiesLesson = defineLesson({
  id: 'kab-rates-not-quantities',
  title: 'Why Not Just Target the Money Supply?',
  subtitle:
    'Fix the quantity and good projects go unfunded in spring while bad ones get funded in autumn. Fix the price instead.',
  icon: '🌱',
  difficulty: 'advanced',
  estimatedMinutes: 18,
  video: {
    url: 'https://www.youtube.com/watch?v=yOgGhPIHnlA',
    minutes: 12,
    source: 'Khan Academy — Banking 16',
  },
  challenges: [
    {
      id: 'mc-fixed-quantity',
      type: 'multiple_choice',
      tags: ['monetary-policy', 'capital-allocation'],
      xp: 30,
      prompt:
        'Money supply is held fixed. In planting season there are more good projects than money; afterwards there are fewer. What goes wrong?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'both-ways',
          label:
            'Good projects are turned away in spring, and money chases bad ones afterwards',
        },
        {
          id: 'inflation',
          label: 'Inflation, because the money has nowhere useful to go',
          feedback:
            'The problem described is misallocation rather than the price level. The same quantity of money funds a 12% project in one season and a 1% project in another.',
        },
        {
          id: 'spring-only',
          label: 'Only the spring problem — good projects are rationed out',
          feedback:
            'Half of it. The autumn half is worse: with demand gone and money unchanged, genuinely poor projects clear at 1% or 2%.',
        },
        {
          id: 'nothing',
          label: 'Nothing — the market allocates to the highest bidder either way',
          feedback:
            'It does, and that is the trouble. The highest bidder in a slack season may be a project the video calls shady, and funding it destroys wealth.',
        },
      ],
      correctOptionId: 'both-ways',
      explanation:
        'A fixed quantity means the interest rate swings with demand, so the hurdle a project must clear depends on the season rather than on its merit. Targeting the rate instead sets a constant hurdle and lets the quantity move — funding every project above the threshold, whenever it appears.',
    },
    {
      id: 'mc-measurement',
      type: 'multiple_choice',
      tags: ['monetary-policy', 'measurement'],
      xp: 20,
      prompt: 'What is the practical, unglamorous argument for targeting a rate?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'observable',
          label: 'The interbank rate can be observed continuously; M2 has to be surveyed',
        },
        {
          id: 'legal',
          label: 'The central bank is legally barred from targeting quantities',
          feedback:
            'No such bar is described, and the video notes some economists do argue for quantity targets — a money supply held at 50% of GDP, for example.',
        },
        {
          id: 'public',
          label: 'The public understands rates better than aggregates',
          feedback:
            'Plausible, but not the argument made. The case is about what the central bank itself can see in real time.',
        },
        {
          id: 'accurate',
          label: 'Because rates are a more accurate measure of the money supply',
          feedback:
            'They are not a measure of it at all. They are a different variable, which happens to be observable minute by minute.',
        },
      ],
      correctOptionId: 'observable',
      explanation:
        'To know the funds rate you ring a few banks. To know M2 you survey the banking system and wait. A policymaker who wants to correct course this afternoon needs a number available this afternoon — which is a thoroughly practical reason, sitting underneath the elegant one about elasticity.',
    },
  ],
  keyTakeaways: [
    'A fixed quantity of money makes the funding hurdle depend on the season.',
    'Targeting the rate fixes the hurdle and lets quantity flex with demand.',
    'Rates are also simply easier to observe in real time than aggregates.',
  ],
});
