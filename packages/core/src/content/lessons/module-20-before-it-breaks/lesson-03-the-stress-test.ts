import { defineLesson } from '../../schema';

/**
 * The stress test, driven by hand, and the three things it cannot see.
 *
 * The simulation holds risk weights fixed under stress, which flatters every
 * result it produces — in a real downturn exposures are downgraded and the
 * denominator rises as the numerator falls. The narrative says so.
 */
export const theStressTestLesson = defineLesson({
  id: 'the-stress-test',
  title: 'How Far From Here Does It Break?',
  subtitle:
    'Not whether a bank is solvent today. Supervision is about the distance between today and the day it is not.',
  icon: '🔬',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'sim-stress',
      type: 'interactive_sim',
      tags: ['stress-test', 'capital'],
      xp: 40,
      constants: {},
      prompt: 'Find the loss that breaks the bank.',
      instructions: 'Hold capital fixed, move density between 30% and 100%, and watch the breaking point move',
      narrative:
        'The bank holds 100 of assets. Risk-weighted assets are the density times that, and its capital ratio is measured against them. A loss falls on assets — so it hits the ratio divided by the density. The CET1 minimum is 4.5%. Risk weights are held fixed here, which flatters every number on this panel: in a real downturn exposures are downgraded, the denominator rises while the numerator falls, and the bank breaks sooner than this shows.',
      sliders: [
        {
          key: 'cet1Ratio',
          label: 'CET1 ratio today',
          min: 0.06,
          max: 0.2,
          step: 0.005,
          defaultValue: 0.14,
          format: 'percent',
          hint: 'Large European banks report around 14-15%',
        },
        {
          key: 'rwaDensity',
          label: 'Risk-weight density',
          min: 0.2,
          max: 1,
          step: 0.05,
          defaultValue: 0.35,
          format: 'percent',
          hint: 'RWA over total assets — mortgage lenders sit low, corporate lenders high',
        },
        {
          key: 'lossRate',
          label: 'Loss on assets in the scenario',
          min: 0,
          max: 0.08,
          step: 0.005,
          defaultValue: 0.02,
          format: 'percent',
          hint: 'Adverse scenarios are usually a few per cent of the book',
        },
      ],
      readouts: [
        {
          key: 'after',
          label: 'CET1 after the scenario',
          formulaId: 'cet1_after_shock',
          format: 'percent',
          emphasis: true,
          caption: 'ratio − loss ÷ density',
        },
        {
          key: 'distance',
          label: 'Distance to the 4.5% minimum',
          formulaId: 'distance_to_minimum',
          format: 'percent',
          caption: 'below zero is a resolution question',
        },
        {
          key: 'breaks',
          label: 'Loss rate that breaks it',
          formulaId: 'loss_rate_to_breach',
          format: 'percent',
          caption: '(ratio − 4.5%) × density',
        },
      ],
      objective: {
        description: 'Compare the breaking point at 30% density and at 100%, then push this bank below the minimum',
        requiredObservations: [{ sliderKey: 'rwaDensity', values: [0.3, 1] }],
        target: { readoutKey: 'distance', comparator: 'lt', value: 0 },
      },
      explanation:
        'Leave capital at 14% and move only the density. At 100% the bank survives a loss of nearly ten per cent of its assets; at 30% it breaks below three. Same reported ratio, same capital, three times the fragility — because a low density means more assets standing on each euro of capital. This is the mortgage concentration of the previous module arriving as a supervisory number, and it is why "well capitalised" is not a sentence a supervisor should accept without asking what the assets are.',
    },
    {
      id: 'mc-what-it-cannot-see',
      type: 'multiple_choice',
      tags: ['stress-test', 'limits'],
      xp: 35,
      prompt:
        'Every bank in the 2023 US failures had passed its most recent supervisory stress test or was exempt from it. What does a stress test systematically miss?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'scenario',
          label: 'Whatever is not in the scenario',
        },
        {
          id: 'fraud',
          label: 'Fraud, which no model of any kind can be expected to detect',
          feedback:
            'Real and not the systematic gap. The 2023 failures involved no fraud; they involved a risk the scenarios did not contain, which is a different and more common problem.',
        },
        {
          id: 'small-banks',
          label: 'Small banks, which are not tested',
          feedback:
            'Coverage was genuinely a factor in 2023 and it is a rule choice rather than a limitation of the method. Test every bank against the wrong scenario and you learn the same nothing.',
        },
        {
          id: 'contagion',
          label: 'Contagion between banks',
          feedback:
            'A real gap in single-bank tests, and second to the scenario problem: contagion from a shock you did model can at least be reasoned about, while a shock you did not model gives you nothing to start from.',
        },
      ],
      correctOptionId: 'scenario',
      explanation:
        'A stress test answers "what happens under this scenario", and the scenario is the whole of the exercise. For a decade after 2008 they were built around credit losses and a housing collapse, because that is what had just happened. A sharp rise in interest rates destroying the value of safe government bonds was not the scenario, and the banks that died of it had passed. The correct use is not as a pass mark but as a structured argument about which futures you have considered — and a supervisor who cannot name the futures they left out has not finished.',
    },
    {
      id: 'mc-reverse-stress',
      type: 'multiple_choice',
      tags: ['stress-test', 'method'],
      xp: 35,
      prompt:
        'A reverse stress test starts from failure and works backwards. What does asking the question that way round buy you?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'find-scenario',
          label: 'It names the scenario you had not thought of, instead of scoring one you had',
        },
        {
          id: 'harsher',
          label: 'It is a harsher test, so it is more conservative',
          feedback:
            'Not harsher — differently directed. A forward test can be made arbitrarily harsh and still be about the wrong variable.',
        },
        {
          id: 'faster',
          label: 'It is quicker to run',
          feedback:
            'It is usually slower and more argumentative, because the answer is a description of a world rather than a number.',
        },
        {
          id: 'regulatory',
          label: 'Supervisors require it, so it must be done',
          feedback:
            'Several do require it, which is a reason to do it and not a reason it works.',
        },
      ],
      correctOptionId: 'find-scenario',
      explanation:
        'Forward tests ask "how do we do in this world". Reverse tests ask "what world kills us", which forces the institution to describe a failure rather than score a pass — and the description is the deliverable. Run properly it surfaces exactly the thing the 2023 failures were made of: a concentration nobody had thought to model because it had never hurt before.',
    },
    {
      id: 'match-what-supervision-watches',
      type: 'concept_match',
      tags: ['supervision', 'indicators'],
      xp: 30,
      prompt: 'Four numbers a supervisor watches. Match each to what it warns about.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'density',
          term: 'Risk-weight density',
          definition: 'How much of the balance sheet the capital ratio is not really measuring',
        },
        {
          id: 'uninsured',
          term: 'Uninsured deposit share',
          definition: 'How much of the funding has a reason to leave first',
        },
        {
          id: 'concentration',
          term: 'Sector concentration',
          definition: 'Whether one downturn can hit the whole book at once',
        },
        {
          id: 'growth',
          term: 'Loan growth far above peers',
          definition: 'The most reliable early warning there is — fast growth is usually bought by lowering the bar',
        },
      ],
      explanation:
        'The last one deserves its reputation. Across a century of data, the banks that grow their lending fastest are the ones that fail most, and the mechanism is mundane: the marginal loan that lets you outgrow your peers is the one they declined. None of these four is a capital ratio, and all four are available before the capital ratio moves.',
    },
  ],
  keyTakeaways: [
    'A loss falls on assets and hits the capital ratio divided by the risk-weight density.',
    'Two banks with the same reported ratio can differ threefold in how much loss they survive.',
    'A stress test scores the scenario it was given; the risk is whatever was left out.',
    'Fast loan growth relative to peers is the most reliable early warning available.',
  ],
});
