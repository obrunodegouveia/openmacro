import { defineLesson } from '../../schema';

/**
 * The test the thesis has to survive.
 *
 * Eurostat house price index, 2015=100, peak to trough after the 2008 credit
 * boom:
 *
 *   Ireland  163.3 (2007-Q2) -> 74.3 (2013-Q1)   -54%, back to the peak in
 *            2022-Q3 — fifteen years
 *   Spain    150.9 (2007-Q3) -> 95.2 (2014-Q1)   -37%, back in 2024-Q1 —
 *            sixteen and a half years
 *   Portugal 109.6 (2008-Q2) -> 92.2 (2013-Q2)   -16%, back in 2017-Q1
 */
export const whenDesirablePlacesFallLesson = defineLesson({
  id: 'when-desirable-places-fall',
  title: 'Dublin Fell by Half',
  subtitle:
    'The floor is real and it is not where most people think. Here is what actually predicts a fall.',
  icon: '📉',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'mc-they-do-fall',
      type: 'multiple_choice',
      tags: ['property', 'crashes', 'evidence'],
      xp: 25,
      prompt:
        'Irish house prices fell 54% between 2007 and 2013; Spanish prices fell 37%. Dublin and Madrid are desirable places. What does that do to "desirable property does not fall"?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'refutes-as-stated',
          label: 'Refutes it as stated — desirability did not prevent a halving',
        },
        {
          id: 'not-desirable-then',
          label: 'Those places were not genuinely desirable in 2007',
          feedback:
            'Unfalsifiable, and it is how the claim gets protected from evidence. If "desirable" is defined as "did not fall", it has stopped being a prediction about anything.',
        },
        {
          id: 'exception',
          label: 'They are exceptions to a rule that otherwise holds',
          feedback:
            'Two of the larger euro area housing markets, in the same decade, is not an exception. Japan and parts of the US would extend the list.',
        },
        {
          id: 'recovered',
          label: 'Nothing, since both eventually recovered',
          feedback:
            'Ireland took fifteen years to regain its 2007 peak and Spain sixteen and a half. Somebody who bought at the top and needed to move in 2012 did not get to wait.',
        },
      ],
      correctOptionId: 'refutes-as-stated',
      explanation:
        'The claim has to be weakened to survive, and weakening it correctly is the useful part. What the evidence supports is narrower and still powerful: after a credit-driven boom, prices in desirable places can halve and take fifteen years to recover; absent a credit boom, they are sticky downward and give up ground to inflation rather than to nominal falls. Those are different claims, and only the second one is safe to act on.',
    },

    {
      id: 'match-warning-signs',
      type: 'concept_match',
      tags: ['property', 'crashes', 'diagnosis'],
      xp: 30,
      prompt: 'Match each indicator to what it actually tells you about downside risk.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'credit',
          term: 'Mortgage credit growing far faster than income',
          definition:
            'The strongest single warning — every large fall on record followed one',
        },
        {
          id: 'supply',
          term: 'A building boom under way',
          definition:
            'Ireland was completing homes at multiples of household formation. Supply that arrives after the demand does is what breaks a price',
        },
        {
          id: 'rates',
          term: 'Rates rising',
          definition:
            'Cuts transactions long before it cuts prices — necessary for a fall, nowhere near sufficient',
        },
        {
          id: 'desirability',
          term: 'The location being desirable',
          definition:
            'Sets the level the price recovers to. Says almost nothing about whether it falls first',
        },
      ],
      explanation:
        'The last pairing is the correction that matters. Desirability is a claim about the long-run floor, not about the path. It tells you the price will come back — as it did in Dublin, fifteen years later — and it tells you nothing about how far it goes down before then, or whether you can afford to wait. Credit growth is the variable to watch, and it is published monthly.',
    },

    {
      id: 'mc-nominal-vs-real',
      type: 'multiple_choice',
      tags: ['property', 'inflation', 'method'],
      xp: 25,
      prompt:
        'A market where prices stay flat for eight years while inflation runs 3%. Did it fall?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'real-fall',
          label: 'Yes — about 21% in real terms, and this is how most housing corrections actually happen',
        },
        {
          id: 'no',
          label: 'No — the price is the same',
          feedback:
            'The same number of euros, each worth 21% less. That is the whole lesson of the debasement module applied to the one asset people are most confident holds its value.',
        },
        {
          id: 'rose',
          label: 'It rose, because it kept pace with nothing',
        },
        {
          id: 'cannot-say',
          label: 'Impossible to say without transaction data',
        },
      ],
      correctOptionId: 'real-fall',
      explanation:
        'Sellers refuse nominal losses — they take the house off the market rather than accept less than they paid, which is why volumes collapse in a downturn and headline prices barely move. So the correction arrives as years of flat nominal prices while inflation does the work quietly. It is a real fall that never appears in a headline, and it is the most common form the adjustment takes in a market with a hard floor under it.',
    },

    {
      id: 'flow-what-breaks-it',
      type: 'order_flow',
      tags: ['property', 'crashes', 'credit'],
      xp: 25,
      prompt: 'Put the sequence of an actual housing crash in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'credit-boom',
          label: 'Lending standards loosen and mortgage credit outruns income',
          detail: 'The money bidding for houses is being created faster than the ability to repay it',
        },
        {
          id: 'building',
          label: 'Developers respond, and keep building past the demand',
          detail: 'Ireland was completing homes far beyond household formation',
        },
        {
          id: 'shock',
          label: 'Credit stops — a rate rise, a bank failure, a funding market closing',
          detail: 'The new money that was bidding simply is not created that month',
        },
        {
          id: 'forced',
          label: 'Forced sellers appear: arrears, negative equity, developers with debt',
          detail: 'This is the step that distinguishes a crash from a quiet market',
        },
        {
          id: 'fall',
          label: 'Prices fall until they clear against whoever can still pay cash',
          detail: 'Below replacement cost, and it stays there for years',
        },
      ],
      correctOrder: ['credit-boom', 'building', 'shock', 'forced', 'fall'],
      explanation:
        'The fourth step is the whole difference. Prices do not fall because buyers step back — that produces a quiet market with firm prices, which is what rate rises alone deliver. They fall because sellers are forced, and sellers are forced by debt. Which means the question to ask about any housing market is not whether it looks expensive. It is how much of it is owned by people who could be made to sell.',
    },

    {
      id: 'mc-so-what-do-you-do',
      type: 'multiple_choice',
      tags: ['property', 'method', 'conclusion'],
      xp: 25,
      prompt:
        'What is the defensible version of the thesis this module started with?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'defensible',
          label: 'Real assets beat nominal claims through monetary expansion, and supply-constrained property has a cost floor — but leverage cuts both ways and credit booms still break it',
        },
        {
          id: 'strong',
          label: 'Desirable property cannot fall, so leverage is free money',
          feedback:
            'Ireland at −54% and Spain at −37% are the reply. Leverage that turns 4.4% a year into a 204% real return also turns a 30% fall into a wipeout of a 20% deposit.',
        },
        {
          id: 'weak',
          label: 'Property is just another asset with no special properties',
          feedback:
            'It has a cost of production, its supply is legally constrained, its owners are not forced to sell, and it is the only asset ordinary households can lever five to one. None of that is true of a share.',
        },
        {
          id: 'renting',
          label: 'Nobody should ever hold euros',
        },
      ],
      correctOptionId: 'defensible',
      explanation:
        'Every clause in that sentence has been earned somewhere in this module. Cash lost 24% in real terms while the same period gave a levered buyer 204%; construction costs ratchet and desirable land cannot be made; and Dublin still halved. Hold all three at once and you have something you can act on — including the recognition that a 20% deposit is wiped out by a 20% fall, which is the identical asymmetry the sterling module taught, pointed the other way.',
    },
  ],
  keyTakeaways: [
    'Ireland fell 54% and took fifteen years to regain its peak; Spain fell 37% and took sixteen and a half.',
    'Desirability sets the level a price recovers to, not whether it falls first.',
    'Most corrections arrive as flat nominal prices while inflation does the work — a real fall with no headline.',
    'Falls need forced sellers, and forced sellers are made by debt. Watch credit growth, not price levels.',
  ],
});
