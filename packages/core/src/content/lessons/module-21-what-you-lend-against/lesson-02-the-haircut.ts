import { defineLesson } from '../../schema';

/**
 * The haircut, driven from the direction that matters in a crisis: not what
 * the collateral is worth but how much of it has to be handed over.
 */
export const theHaircutLesson = defineLesson({
  id: 'the-haircut',
  title: 'How Much Do You Have to Hand Over?',
  subtitle:
    'The price falls and the haircut widens at the same moment. Both multiply, and that is how funding disappears.',
  icon: '✂️',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'sim-haircut',
      type: 'interactive_sim',
      tags: ['collateral', 'haircut', 'liquidity'],
      xp: 40,
      currency: 'EUR',
      constants: {},
      prompt: 'Raise cash against a portfolio while the ground moves.',
      instructions: 'Take the price fall and the haircut up together and watch the two multiply',
      narrative:
        'A bank holds a portfolio it can pledge. In calm conditions the lender takes a small haircut and hands over almost the full value. In a stress two things happen at once and they are not independent: the collateral is marked down, and the lender widens the haircut because it has become less sure of the mark. Push both and watch how little is left — this is the arithmetic behind every funding crisis in this course.',
      sliders: [
        {
          key: 'collateralValue',
          label: 'Portfolio, at calm-market value',
          min: 1000000000,
          max: 20000000000,
          step: 1000000000,
          defaultValue: 10000000000,
          format: 'currency',
        },
        {
          key: 'priceFall',
          label: 'Mark-down on the collateral',
          min: 0,
          max: 0.4,
          step: 0.05,
          defaultValue: 0,
          format: 'percent',
          hint: 'Long bonds lost double digits through 2022',
        },
        {
          key: 'haircut',
          label: 'Haircut the lender applies',
          min: 0.01,
          max: 0.5,
          step: 0.01,
          defaultValue: 0.05,
          format: 'percent',
          hint: 'A few per cent on government bonds; far more on anything complicated',
        },
      ],
      readouts: [
        {
          key: 'stressed',
          label: 'Cash it can raise',
          formulaId: 'collateral_after_stress',
          format: 'currency',
          emphasis: true,
          caption: 'value × (1 − fall) × (1 − haircut)',
        },
        {
          key: 'calm',
          label: 'What it could raise before the mark-down',
          formulaId: 'collateral_cash_raised',
          format: 'currency',
          caption: 'value × (1 − haircut)',
        },
      ],
      objective: {
        description: 'Compare no mark-down with a severe one, and cut the portfolio’s funding capacity below €5bn',
        requiredObservations: [{ sliderKey: 'priceFall', values: [0, 0.4] }],
        target: { readoutKey: 'stressed', comparator: 'lte', value: 5000000000 },
      },
      explanation:
        'Nothing defaulted. The bank owns exactly what it owned yesterday, and its funding capacity has halved, because two multiplicative terms moved together. Note which one the central bank controls: the market sets the mark-down, and the haircut is a published schedule the central bank writes. In a crisis that schedule is the difference between a bank that can fund itself and one that cannot — which is why not widening it, when every private lender is widening theirs, is itself an intervention.',
    },
    {
      id: 'mc-procyclical',
      type: 'multiple_choice',
      tags: ['haircut', 'procyclicality'],
      xp: 35,
      prompt:
        'Private lenders raise haircuts in a crisis. Why is a central bank that keeps its schedule unchanged doing something powerful, rather than merely doing nothing?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'anchor',
          label: 'It becomes the only funding that has not tightened',
        },
        {
          id: 'cheap',
          label: 'It is lending more cheaply than the market will at that moment',
          feedback:
            'The rate is usually a penalty rate, so it is often lending more *dearly* than calm-market terms. The generosity is in the haircut, not the price.',
        },
        {
          id: 'signal',
          label: 'It signals confidence in the collateral',
          feedback:
            'A real effect and a by-product. The mechanical point is that stable haircuts put a floor under how much cash a given portfolio can raise, whatever private lenders decide.',
        },
        {
          id: 'risk',
          label: 'It is taking on more risk than the private sector will',
          feedback:
            'True, and it is the cost rather than the mechanism — and a central bank that can create the currency it is lending bears that risk very differently from a private lender.',
        },
      ],
      correctOptionId: 'anchor',
      explanation:
        'Gorton and Metrick called 2008 a run on repo, and the run was haircuts widening: the same collateral raised less and less cash until institutions that had never missed a payment could not fund themselves. A central bank holding its schedule steady breaks that spiral, because no private lender can demand terms much worse than the ones available at the window. This is Bagehot restated for a collateralised system — lend freely means hold the haircut.',
    },
    {
      id: 'mc-collateral-required',
      type: 'multiple_choice',
      tags: ['haircut', 'liquidity'],
      xp: 30,
      prompt:
        'A bank must raise €9.3bn. At a 7% haircut, how much collateral does it have to pledge?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'ten', label: '€10bn — the cash divided by 93%' },
        {
          id: 'ninety-nine',
          label: '€9.95bn — add 7% of the shortfall',
          feedback:
            'That adds the haircut to the cash rather than grossing up. The haircut applies to the collateral, so you divide by what is left after it, rather than multiplying the cash by it.',
        },
        {
          id: 'nine-three',
          label: '€9.3bn — the amounts match',
          feedback:
            'Then the lender would be taking no haircut at all. Pledging exactly what you want to borrow works only at a haircut of zero.',
        },
        {
          id: 'depends',
          label: 'Not answerable without knowing the interest rate',
          feedback:
            'The rate decides what the loan costs. How much has to be pledged is set entirely by the haircut.',
        },
      ],
      correctOptionId: 'ten',
      explanation:
        'Cash divided by one minus the haircut: 9.3 over 0.93 is 10. Get comfortable in this direction, because it is the one a treasurer works in at two in the morning — not "what is my portfolio worth" but "have I got enough of it to survive Friday". And notice what happens as the haircut climbs: at 50% the same €9.3bn needs €18.6bn pledged, which is usually more than the bank has.',
    },
    {
      id: 'match-haircut-drivers',
      type: 'concept_match',
      tags: ['haircut', 'collateral'],
      xp: 30,
      prompt: 'What makes a haircut larger? Match each property to why it costs you.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'volatility',
          term: 'A volatile price',
          definition: 'More can be lost between the borrower failing and the collateral being sold',
        },
        {
          id: 'maturity',
          term: 'A long maturity',
          definition: 'More sensitive to rates, so the same move in yields costs more of the value',
        },
        {
          id: 'liquidity',
          term: 'A thin market',
          definition: 'Selling it at all moves the price against you, so the mark is optimistic',
        },
        {
          id: 'complexity',
          term: 'A structure nobody can model',
          definition: 'The mark is an opinion, and the haircut is the price of not trusting it',
        },
      ],
      explanation:
        'Every one is about the gap between today’s mark and what the asset fetches after a default, in the market conditions that default implies. That is why haircuts are not a judgement about the issuer’s credit — a sovereign bond that will certainly repay still takes a haircut if it is long, because the loss in question is a price loss before maturity rather than a default. The 2023 failures were entirely of that kind.',
    },
  ],
  keyTakeaways: [
    'The mark-down and the haircut are multiplicative, and they move together.',
    'Cash needed divided by one minus the haircut is the amount that must be pledged.',
    'Holding a haircut schedule steady while private lenders widen theirs is itself the intervention.',
    'A haircut prices the loss between today’s mark and a forced sale, not the issuer’s credit.',
  ],
});
