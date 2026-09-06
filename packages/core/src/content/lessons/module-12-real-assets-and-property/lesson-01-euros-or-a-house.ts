import { defineLesson } from '../../schema';

/**
 * Euro area, January 2015 to 2026, all from the published series:
 *
 *   M3 money stock   €10,405,448m -> €17,613,983m   +69%
 *   Consumer prices  HICP 98.2 -> 129.6              +32%
 *   House prices     index 98.4 -> 157.4             +60%
 *
 * And by country since 2015-Q1: Portugal +200%, Ireland +112%, Spain +101%.
 */
export const eurosOrAHouseLesson = defineLesson({
  id: 'euros-or-a-house',
  title: 'The Same Decade, Two Assets',
  subtitle:
    'Money grew 69%, prices 32%, houses 60%. Where you were standing decided what happened to you.',
  icon: '🏘️',
  difficulty: 'core',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-three-numbers',
      type: 'multiple_choice',
      tags: ['real-assets', 'inflation', 'property'],
      xp: 20,
      prompt:
        'Between 2015 and 2026 euro area money grew 69%, consumer prices 32%, and house prices 60%. What is the relationship?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'not-all-into-basket',
          label: 'The new money did not arrive evenly — much of it landed in assets rather than in the shopping basket',
        },
        {
          id: 'unrelated',
          label: 'Three unrelated series',
          feedback:
            'A 69% expansion of the money stock over a decade is not unrelated to what prices did. The question is which prices, and the answer is that assets and consumer goods took very different shares of it.',
        },
        {
          id: 'proportional',
          label: 'Prices rose in proportion to money, as the quantity theory predicts',
          feedback:
            'Then consumer prices would have risen 69%, and they rose 32%. Something absorbed the difference, and the house price line is a candidate you can read off the same chart.',
        },
        {
          id: 'houses-caused',
          label: 'Rising house prices caused the money growth',
        },
      ],
      correctOptionId: 'not-all-into-basket',
      explanation:
        'Inflation is usually measured on a basket of consumption. A house is not in that basket — the index counts rents, not the purchase price of a dwelling. So a decade in which money grew twice as fast as consumer prices can look like moderate inflation while an asset most households need is doing something else entirely, and the official number never has to mention it.',
    },

    {
      id: 'sim-cash-or-house',
      type: 'interactive_sim',
      tags: ['real-assets', 'leverage', 'property'],
      xp: 35,
      currency: 'EUR',
      prompt: 'Eleven years, a €300,000 flat, and a decision.',
      instructions:
        'Move the house price growth and the deposit, and compare the two real returns',
      narrative:
        'Consumer prices rose 2.53% a year over the period — the euro area’s actual 32% across eleven years. House prices rose 4.37% a year. You either hold the money or you hold the flat. The deposit slider decides how much of the flat is yours and how much is the bank’s.',
      constants: {
        propertyValue: 300000,
        inflation: 0.0253,
        years: 11,
      },
      sliders: [
        {
          key: 'houseGrowth',
          label: 'House price growth a year',
          min: 0,
          max: 0.1,
          step: 0.005,
          defaultValue: 0.045,
          format: 'percent',
          hint: 'The euro area actually did 4.37% a year. Portugal did 10.7%.',
        },
        {
          key: 'depositShare',
          label: 'Your deposit, as a share of the price',
          min: 0.1,
          max: 1,
          step: 0.05,
          defaultValue: 0.2,
          format: 'percent',
          hint: '100% means no mortgage. The rest is borrowed, and the debt does not grow.',
        },
      ],
      readouts: [
        {
          key: 'equityReal',
          label: 'Real return on the money you put in',
          formulaId: 'leveraged_equity_real_return',
          format: 'percent',
          emphasis: true,
          caption: 'After inflation. Interest-only: no payments, taxes or upkeep counted',
        },
        {
          key: 'multiple',
          label: 'Times your deposit came back',
          formulaId: 'leveraged_equity_multiple',
          format: 'multiplier',
          caption: 'Before inflation',
        },
        {
          key: 'cashReal',
          label: 'Real return on holding the cash instead',
          formulaId: 'cash_real_return',
          format: 'percent',
          caption: 'The same eleven years, in euros, under a mattress or in a 0% account',
        },
      ],
      objective: {
        description:
          'See what a flat 0% housing market does, then the actual 4.5%, and finish above +100%',
        requiredObservations: [{ sliderKey: 'houseGrowth', values: [0, 0.045] }],
        target: {
          readoutKey: 'equityReal',
          comparator: 'gte',
          value: 1,
        },
      },
      explanation:
        'Three numbers to carry away, all at the actual euro area rates. Cash lost 24% in real terms. The flat bought outright returned about +22% real. The same flat on a 20% deposit returned about +204% — the identical asset, because the debt is fixed in euros and does not grow with the building. Set growth to zero and the leveraged position still loses only what cash loses, which is the asymmetry: the mortgage magnifies the gain and the inflation covers the downside.',
    },

    {
      id: 'mc-who-paid',
      type: 'multiple_choice',
      tags: ['real-assets', 'distribution'],
      xp: 25,
      prompt:
        'That +204% real return came from somewhere. Who was on the other side?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'nominal-holders',
          label: 'Everyone holding claims fixed in euros — savers, the lender, and anyone who did not own the asset yet',
        },
        {
          id: 'seller',
          label: 'The person who sold the flat',
          feedback:
            'They received the market price on the day. Whether they did well depends on what they then held — if they took euros and sat on them, they joined the other side of the trade.',
        },
        {
          id: 'nobody',
          label: 'Nobody — the flat simply became more valuable',
          feedback:
            'The building did not change. What changed was how many euros it takes to buy it, which is a statement about euros as much as about the flat.',
        },
        {
          id: 'state',
          label: 'The state, through lost tax revenue',
        },
      ],
      correctOptionId: 'nominal-holders',
      explanation:
        'Name them precisely, because the vague version of this argument is where it goes wrong. The bank lent 240,000 euros and gets 240,000 euros back, worth 24% less — the debtor gain from the debasement module. The saver holding cash lost the same 24%. And the person who had not bought yet now needs a larger multiple of their salary to do so. Those are the counterparties, and none of them signed anything.',
    },

    {
      id: 'mc-portugal',
      type: 'multiple_choice',
      tags: ['property', 'portugal', 'evidence'],
      xp: 20,
      prompt:
        'Portuguese house prices rose 200% between 2015 and 2026, against 60% for the euro area as a whole. What does a gap that size tell you?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'local-demand-supply',
          label: 'That something local was doing the work — money is euro area wide, and this is not',
        },
        {
          id: 'more-inflation',
          label: 'That Portugal had far more inflation than the euro area',
          feedback:
            'It did not. Portugal shares the currency and its consumer inflation has tracked the area closely. The house price gap is three times the area average with no matching gap in the shopping basket.',
        },
        {
          id: 'measurement',
          label: 'That the two indices are measured differently',
        },
        {
          id: 'construction',
          label: 'That construction costs rose much faster in Portugal',
          feedback:
            'They rose 38% against the area’s 34% — a four point gap, against a 140 point gap in prices. Costs are part of the floor, and they are nowhere near the whole story.',
        },
      ],
      correctOptionId: 'local-demand-supply',
      explanation:
        'The single currency is the control variable. Everyone in the euro area got the same money growth and roughly the same consumer inflation, and Portuguese house prices still tripled while the area average rose 60%. So monetary expansion is the tide, not the explanation — what turns a tide into a 200% move is local: foreign demand, tax regimes for non-residents, tourism converting housing stock, and a supply response that did not come. The next two lessons are about why it did not.',
    },
  ],
  keyTakeaways: [
    'Euro area money grew 69% from 2015 while consumer prices rose 32% and house prices 60%.',
    'A house is not in the inflation basket, so this can happen without the headline number mentioning it.',
    'At actual rates: cash −24% real, the flat outright +22%, the flat on a 20% deposit +204%.',
    'The counterparties are savers, lenders repaid in cheaper euros, and everyone who had not bought yet.',
  ],
});
