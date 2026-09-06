import { defineLesson } from '../../schema';

/**
 * The answer, computed rather than asserted.
 *
 * €300,000 permanent home: €13,942 of purchase costs (IMT €10,542, stamp duty
 * €2,400, deed €1,000), 6.15% to sell, and €4,100 a year of carry. Break-even
 * by appreciation rate: 10% -> 2 years, 7% -> 2, 5% -> 4, 3% -> 7, 2% -> 14,
 * 1.5% -> 29, and 1% never inside forty years.
 */
export const theBreakEvenLesson = defineLesson({
  id: 'the-property-break-even',
  title: 'How Many Years Before You Are Even',
  subtitle:
    'Costs in, costs out, costs every year. At 10% it is two years — and there is a rate below which it is never.',
  icon: '⏳',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'sim-breakeven',
      type: 'interactive_sim',
      tags: ['portugal', 'property', 'break-even'],
      xp: 40,
      currency: 'EUR',
      prompt: 'Find the year the position turns positive.',
      instructions: 'Move the appreciation rate and the holding period',
      narrative:
        'A €300,000 permanent home in Portugal. You pay IMT, 0.8% stamp duty and about €1,000 for the deed on the way in; roughly €4,100 a year in IMI, maintenance and insurance while you hold; and 6.15% to an agency on the way out. The mortgage is not here — its comparator is rent, not appreciation.',
      constants: {
        price: 300000,
        deedCosts: 1000,
        sellingRate: 0.0615,
        carryAnnual: 4100,
      },
      sliders: [
        {
          key: 'growth',
          label: 'Appreciation a year',
          min: 0,
          max: 0.12,
          step: 0.005,
          defaultValue: 0.1,
          format: 'percent',
          hint: 'Portuguese prices did about 10.7% a year from 2015. That is a decade, not a law.',
        },
        {
          key: 'years',
          label: 'Years you hold it',
          min: 1,
          max: 30,
          step: 1,
          defaultValue: 5,
          format: 'number',
          hint: 'The median Portuguese owner holds far longer than the break-even needs.',
        },
      ],
      readouts: [
        {
          key: 'imt',
          label: 'IMT on the purchase',
          formulaId: 'pt_imt_own_home',
          format: 'currency',
          caption: '2026 table, permanent home, Continente',
        },
        {
          key: 'purchaseCosts',
          label: 'Total cost of buying',
          formulaId: 'pt_purchase_costs',
          format: 'currency',
          caption: 'IMT + 0.8% stamp duty + the deed',
        },
        {
          key: 'breakeven',
          label: 'Years until you are even',
          formulaId: 'pt_breakeven_years',
          format: 'number',
          emphasis: true,
          caption: 'Zero means it never happens inside forty years',
        },
        {
          key: 'net',
          label: 'Where you stand after the years you chose',
          formulaId: 'pt_net_position',
          format: 'currency',
          caption: 'Sale proceeds after costs, less everything you put in',
        },
      ],
      objective: {
        description:
          'See what 10% a year gives, then drop to 1% and watch the break-even disappear',
        requiredObservations: [{ sliderKey: 'growth', values: [0.1, 0.01] }],
        target: {
          readoutKey: 'breakeven',
          comparator: 'lte',
          value: 0,
        },
      },
      explanation:
        'At 10% a year you are even in the second year, and after that the gains are large. At 3% it takes seven years, at 2% fourteen, and at 1% the break-even readout goes to zero — meaning it never arrives, because appreciation below the 1.37% carry rate loses ground every year no matter how long you wait. The cliff is not at zero appreciation. It is at the carry.',
    },
    {
      id: 'mc-the-cliff',
      type: 'multiple_choice',
      tags: ['portugal', 'break-even', 'carry'],
      xp: 30,
      prompt:
        'At 2% appreciation the break-even is 14 years. At 1% there is none at all. Why does it collapse between two numbers so close together?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'carry-hurdle',
          label: 'Because 1.37% a year goes out in carry, so only the excess over that repays the transaction costs',
        },
        {
          id: 'compounding',
          label: 'Because compounding is weak at low rates',
          feedback:
            'Compounding is weaker, but that gives a longer break-even rather than none. What removes it entirely is a fixed annual outflow that the growth never exceeds.',
        },
        {
          id: 'costs-rise',
          label: 'Because the costs rise over time',
          feedback:
            'They are constant in this model. The asymmetry comes from comparing a rate against a rate, not from anything growing.',
        },
        {
          id: 'error',
          label: 'It is an artefact of the forty-year search limit',
        },
      ],
      correctOptionId: 'carry-hurdle',
      explanation:
        'Net of carry, 2% appreciation is 0.63% a year of progress against roughly 11% of round-trip costs — slow, but it arrives. At 1% appreciation the net is negative before the round trip is even considered, so every additional year makes the hole deeper. That is why the useful question is never "will it go up" but "will it go up by more than 1.37% a year", and those are very different bets.',
    },
    {
      id: 'flow-money-order',
      type: 'order_flow',
      tags: ['portugal', 'purchase', 'cashflow'],
      xp: 25,
      prompt: 'Put the money in the order it actually leaves your account.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'deposit',
          label: 'The deposit at the promissory contract',
          detail: 'Typically 10% of the price, and forfeited if you walk away',
        },
        {
          id: 'imt-selo',
          label: 'IMT and stamp duty, paid before the deed',
          detail: 'The tax office wants it before the notary will proceed',
        },
        {
          id: 'escritura',
          label: 'The balance, the deed and the registry',
          detail: 'The mortgage is drawn on the same day',
        },
        {
          id: 'carry',
          label: 'IMI every year, maintenance whenever it breaks',
          detail: 'About €4,100 a year, whatever the market does',
        },
        {
          id: 'exit',
          label: 'The agency commission and VAT, out of the sale proceeds',
          detail: '6.15%, and any capital gains tax on top',
        },
      ],
      correctOrder: ['deposit', 'imt-selo', 'escritura', 'carry', 'exit'],
      explanation:
        'Two things are worth noticing about the order. The taxes fall due before the deed, so they cannot be financed by the mortgage — they have to be cash you already have, on top of the deposit. And the last line arrives years later out of the proceeds, which is why it is the cost most easily forgotten and the largest single one in the whole sequence.',
    },
    {
      id: 'mc-so-what-rate',
      type: 'multiple_choice',
      tags: ['portugal', 'method', 'forecast'],
      xp: 30,
      prompt:
        'Portuguese prices rose about 10.7% a year from 2015. What is the right way to use that number in this calculation?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'test-range',
          label: 'As one point in a range you test, because the break-even is far more sensitive to the rate than to anything else you control',
        },
        {
          id: 'assume',
          label: 'Assume it continues — it is the best available estimate',
          feedback:
            'It is the best available estimate of the past. The same exercise run in Dublin in 2007 with the prior decade’s rate would have given a very comfortable answer.',
        },
        {
          id: 'halve',
          label: 'Halve it, as a margin of safety',
          feedback:
            'Better than assuming it continues, and still a guess dressed as a method. Testing the range tells you where the answer changes, which is information; halving tells you one number.',
        },
        {
          id: 'ignore',
          label: 'Ignore it — past growth says nothing',
        },
      ],
      correctOptionId: 'test-range',
      explanation:
        'Everything else in this calculation is close to fixed: the tax tables are published, the commission is standard, the carry moves slowly. The appreciation rate is the only large uncertainty and it swings the answer from two years to never. So the honest output of the exercise is not a number of years — it is the rate at which the answer stops being acceptable, which here is somewhere between 1% and 2%, and a judgement about how likely that is.',
    },
  ],
  keyTakeaways: [
    'At 10% a year the position turns positive in the second year; at 3% it takes seven.',
    'Below roughly 1.37% appreciation there is no break-even at all, because the carry outruns the growth.',
    'IMT and stamp duty fall due before the deed, so they cannot be borrowed — they are cash on top of the deposit.',
    'The appreciation rate is the only large unknown, so the useful output is the rate at which the answer changes.',
  ],
});
