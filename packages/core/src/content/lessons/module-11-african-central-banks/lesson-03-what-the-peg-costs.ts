import { defineLesson } from '../../schema';

/**
 * The mechanism that survives every reform, and the one the 1994 devaluation
 * was caused by.
 *
 * Policy rates: BCEAO's main refinancing rate 3.00% from 16 March 2026, held
 * in June; BEAC's TIAO cut to 4.50% on 29 June 2026. The ECB's main
 * refinancing rate is 2.40%, with the deposit facility at 2.25%.
 */
export const whatThePegCostsLesson = defineLesson({
  id: 'what-the-peg-costs',
  title: 'The Cost That Survives Every Reform',
  subtitle:
    'Take away the account and the seats and one thing remains: the rate cannot move, so something else must.',
  icon: '⚓',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-whose-policy',
      type: 'multiple_choice',
      tags: ['cfa', 'trilemma', 'monetary-policy'],
      xp: 20,
      prompt:
        'A UEMOA state is in recession while the euro area is fighting inflation. What can the BCEAO do about it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'bounded',
          label: 'Very little — it can differ from the ECB only within the room the peg leaves it',
        },
        {
          id: 'anything',
          label: 'Whatever it judges right; it is an independent central bank',
          feedback:
            'It is formally independent and its rate is genuinely its own. But cut far enough below the anchor and capital leaves, reserves fall and the peg comes under pressure — which is a constraint no statute removes.',
        },
        {
          id: 'nothing',
          label: 'Nothing at all — its rate must equal the ECB’s',
          feedback:
            'Not equal. The BCEAO was at 3.00% and the BEAC at 4.50% while the ECB’s main rate was 2.40% — real, chosen differences. The constraint is on the direction and the size of the gap, not on having one.',
        },
        {
          id: 'devalue',
          label: 'Devalue, as it did in 1994',
        },
      ],
      correctOptionId: 'bounded',
      explanation:
        'This is the trilemma from the sterling module, in permanent form. Britain met it for two years and broke; the CFA zone has lived inside it for decades. Note the spreads: 3.00% at the BCEAO and 4.50% at the BEAC against 2.40% at the ECB. A pegged central bank generally has to pay *more* than its anchor, not less — the gap compensates for the risk of holding the pegged currency, and it is a cost borne by every domestic borrower.',
    },

    {
      id: 'sim-real-appreciation',
      type: 'interactive_sim',
      tags: ['cfa', 'pegs', 'competitiveness'],
      xp: 35,
      currency: 'EUR',
      prompt: 'Run the peg for ten years at a slightly higher inflation rate.',
      instructions: 'Move domestic inflation and watch the real exchange rate drift',
      narrative:
        'The nominal rate is frozen at 655.957 and cannot adjust. Euro area inflation is 2%. If domestic prices rise faster than that, the entire difference accumulates in the real exchange rate: exports get dearer abroad every year, imports get cheaper at home, and no market price corrects it because the price that would have is fixed.',
      constants: {
        anchorInflation: 0.02,
        years: 10,
      },
      sliders: [
        {
          key: 'domesticInflation',
          label: 'Domestic inflation',
          min: 0,
          max: 0.1,
          step: 0.005,
          defaultValue: 0.04,
          format: 'percent',
          hint: 'CFA zone inflation has often been close to the anchor — but not always, and the gap compounds.',
        },
      ],
      readouts: [
        {
          key: 'drift',
          label: 'Real appreciation after ten years',
          formulaId: 'real_exchange_rate_drift',
          format: 'percent',
          emphasis: true,
          caption: 'How much dearer your exports have become, with nothing having been decided',
        },
      ],
      objective: {
        description:
          'Compare inflation at the anchor’s 2% with 6%, then leave the drift above 40%',
        requiredObservations: [
          { sliderKey: 'domesticInflation', values: [0.02, 0.06] },
        ],
        target: {
          readoutKey: 'drift',
          comparator: 'gte',
          value: 0.4,
        },
      },
      explanation:
        'At exactly the anchor’s rate the drift is zero — a peg costs nothing in competitiveness if you match the anchor’s inflation every year for a decade. Four points above it costs 47%. This is not a hypothetical: accumulated overvaluation is why the CFA franc was devalued by half in January 1994, after years in which the nominal rate had not moved. A peg does not remove the adjustment. It stores it, and then delivers it all at once.',
    },

    {
      id: 'flow-adjustment',
      type: 'order_flow',
      tags: ['pegs', 'adjustment', 'commodities'],
      xp: 25,
      prompt:
        'A cocoa exporter’s world price falls 30%. Put the pegged country’s adjustment in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'shock',
          label: 'The export price falls in world markets',
          detail: 'Export earnings drop in euro terms',
        },
        {
          id: 'no-fx',
          label: 'The exchange rate does not move',
          detail: 'A floating currency would fall and cushion the blow; this one cannot',
        },
        {
          id: 'reserves',
          label: 'Reserves absorb the gap first',
          detail: 'The buffer buys time and does not create income',
        },
        {
          id: 'internal',
          label: 'Adjustment falls on domestic wages, budgets and employment',
          detail: 'What the currency did not absorb, people do',
        },
        {
          id: 'political',
          label: 'The cost is felt as austerity rather than as a currency move',
          detail: 'Same adjustment, different name, different politics',
        },
      ],
      correctOrder: ['shock', 'no-fx', 'reserves', 'internal', 'political'],
      explanation:
        'This is the deepest cost of a peg and the least visible one. A floating currency devalues on a bad harvest, everyone pays a little through import prices, and it is over. A pegged one holds the exchange rate and the same loss arrives as public sector wage freezes and unemployment — concentrated on whoever has least power to avoid it. The adjustment does not disappear; it changes who pays and how obviously.',
    },

    {
      id: 'mc-euro-not-dollar',
      type: 'multiple_choice',
      tags: ['cfa', 'commodities', 'pegs'],
      xp: 25,
      prompt:
        'Cocoa, oil, cotton and gold are priced in dollars. The CFA franc is pegged to the euro. What does that combination produce?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'imported-eurusd',
          label: 'Export earnings that swing with EUR/USD — a currency risk imported from a market with nothing to do with Africa',
        },
        {
          id: 'stable',
          label: 'Stability, since the euro is a hard currency',
          feedback:
            'Stability against the euro. Against the currency the exports are actually priced in, the CFA moves exactly as much as EUR/USD does — which is a lot, and for reasons set in Frankfurt and Washington.',
        },
        {
          id: 'irrelevant',
          label: 'Nothing — commodity prices adjust',
        },
        {
          id: 'advantage',
          label: 'An advantage, because the euro has been strong',
        },
      ],
      correctOptionId: 'imported-eurusd',
      explanation:
        'A peg does not give you stability in general; it gives you stability against one currency and imports that currency’s movements against every other. When the euro rises against the dollar, a CFA cocoa farmer’s dollar-priced revenue buys fewer CFA francs, through no change in the cocoa market and no decision made anywhere in Africa. The anchor was chosen for historical reasons, not because it matched the trade.',
    },
  ],
  keyTakeaways: [
    'The peg is the constraint that no reform touched, and it binds every day.',
    'Pegged central banks generally pay more than their anchor: 3.00% and 4.50% against the ECB’s 2.40%.',
    'Inflation above the anchor accumulates as real appreciation — 4 points over 10 years is 47%.',
    'The adjustment a fixed rate refuses to make is made instead by wages, budgets and employment.',
  ],
});
