import { defineLesson } from '../../schema';

/**
 * The mechanism itself. Daily dollar rates (FRED DEXUSUK): £1 bought $2.0030
 * on 8 September 1992, $1.8715 on the 15th, $1.8110 on Black Wednesday itself
 * and $1.7082 by the 22nd. UK base rate was 10%; the Bundesbank discount rate
 * 8.75%.
 *
 * Quantum's position was reported at around $10bn and its profit at around
 * $1bn. Those two reported numbers and the verified rates agree with each
 * other, which is the point of the simulation here.
 */
export const theAsymmetricBetLesson = defineLesson({
  id: 'the-asymmetric-bet',
  title: 'The Bet That Could Only Cost Carry',
  subtitle:
    'Borrow the currency, sell it, wait. If the peg holds you pay interest. If it breaks you keep the devaluation.',
  icon: '🎲',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'flow-the-trade',
      type: 'order_flow',
      tags: ['speculation', 'fx', 'shorting'],
      xp: 25,
      prompt: 'Put the trade in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'borrow',
          label: 'Borrow sterling from banks',
          detail: 'You now owe pounds, and you pay UK interest on them',
        },
        {
          id: 'sell',
          label: 'Sell the sterling for D-marks at the market rate',
          detail: 'Which the Bank of England is committed to defending',
        },
        {
          id: 'hold',
          label: 'Hold D-marks and wait',
          detail: 'Earning German interest while paying British interest',
        },
        {
          id: 'break',
          label: 'The peg breaks and sterling falls',
          detail: 'Fifteen per cent against the dollar in two weeks',
        },
        {
          id: 'repay',
          label: 'Buy back the cheaper sterling and repay the loan',
          detail: 'The same number of pounds now costs far fewer D-marks',
        },
      ],
      correctOrder: ['borrow', 'sell', 'hold', 'break', 'repay'],
      explanation:
        'Notice what you never needed: an opinion about where sterling should trade, a model of the British economy, or anyone to agree with you. You needed the currency to fall, and you needed to be able to fund the position until it did. That is a bet on a government running out of willingness, not on a price.',
    },

    {
      id: 'sim-payoff',
      type: 'interactive_sim',
      tags: ['speculation', 'fx', 'asymmetry'],
      xp: 35,
      prompt: 'Price the bet. Then price what it costs to be wrong.',
      instructions:
        'Move the rate sterling ends up at, and the number of months you have to wait',
      narrative:
        'A $10bn short position in sterling, put on at $1.8715 — where the pound stood on 15 September 1992, the day before it broke. Funding costs you the gap between UK rates at 10% and German rates at 8.75%. Find out what the peg holding costs you, and what it breaking pays.',
      constants: {
        position: 10000000000,
        entryRate: 1.8715,
        domesticRate: 0.1,
        foreignRate: 0.0875,
      },
      sliders: [
        {
          key: 'exitRate',
          label: 'Where sterling ends up ($ per £)',
          min: 1.4,
          max: 1.9,
          step: 0.05,
          defaultValue: 1.7,
          format: 'number',
          hint: 'It was $1.8110 on the day and $1.7082 a week later. By February 1993, $1.4395.',
        },
        {
          key: 'months',
          label: 'Months you hold the position',
          min: 1,
          max: 12,
          step: 1,
          defaultValue: 3,
          format: 'number',
          hint: 'The whole thing was over in a fortnight, but you have to be able to fund being early.',
        },
      ],
      readouts: [
        {
          key: 'profit',
          label: 'What the devaluation pays',
          formulaId: 'fx_short_profit',
          format: 'currency',
          emphasis: true,
          caption: 'Position x (entry − exit) ÷ entry',
        },
        {
          key: 'carry',
          label: 'What waiting costs',
          formulaId: 'fx_carry_cost',
          format: 'currency',
          caption: 'The interest gap, for as long as you hold',
        },
        {
          key: 'ratio',
          label: 'Payoff for every dollar of cost',
          formulaId: 'payoff_to_carry',
          format: 'multiplier',
          caption: 'This number is the entire reason pegs get attacked',
        },
      ],
      objective: {
        description:
          'See what $1.85 pays, then what $1.45 pays, and finish with more than $800m on the table',
        requiredObservations: [{ sliderKey: 'exitRate', values: [1.85, 1.45] }],
        target: {
          readoutKey: 'profit',
          comparator: 'gte',
          value: 800000000,
        },
      },
      explanation:
        'Sterling actually reached $1.7082 within a week, which on this position pays about $873m — against a carry cost of roughly $31m for three months. That is the reported outcome: a position reported near $10bn and a profit reported near $1bn, reproduced from the published exchange rates. The asymmetry is the whole trade. Being wrong costs you a rounding error; being right pays twenty-nine times it.',
    },

    {
      id: 'mc-what-if-holds',
      type: 'multiple_choice',
      tags: ['speculation', 'risk'],
      xp: 20,
      prompt:
        'Suppose the peg had held and sterling had stayed at $1.87 for a year. What would the position have lost?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'carry-only',
          label: 'Only the interest gap — about $125m on $10bn',
        },
        {
          id: 'everything',
          label: 'The whole $10bn',
          feedback:
            'A short position is not a payment. You borrowed sterling and sold it; if nothing moves you buy back the same amount at the same price and hand it over. The loss is the funding, not the notional.',
        },
        {
          id: 'nothing',
          label: 'Nothing — the rate did not move',
          feedback:
            'The rate did not move, but you were paying 10% on borrowed sterling while earning 8.75% on D-marks for a whole year. That gap is real money.',
        },
        {
          id: 'unbounded',
          label: 'Potentially unlimited, as with any short',
        },
      ],
      correctOptionId: 'carry-only',
      explanation:
        'This is the part people miss, and it is why the trade was worth doing. Sterling could not rise much — it was already near the top of what the ERM band and a recessionary economy permitted — so the downside was capped at the carry. The bet was not "sterling will fall" against "sterling will rise". It was "sterling falls a lot" against "I pay a little interest for a while".',
    },

    {
      id: 'mc-size',
      type: 'multiple_choice',
      tags: ['speculation', 'reflexivity'],
      xp: 20,
      prompt:
        'Why put on $10bn rather than $500m, given the return per dollar is identical?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'forces-outcome',
          label: 'Because at that size the trade helps cause the outcome it is betting on',
        },
        {
          id: 'greed',
          label: 'Simply to make more money on the same idea',
          feedback:
            'True as far as it goes, and it is not what made this trade famous. Plenty of funds had the same idea in smaller size and made ordinary money.',
        },
        {
          id: 'liquidity',
          label: 'Smaller positions cannot be executed in currency markets',
        },
        {
          id: 'diversify',
          label: 'To offset losses elsewhere in the fund',
        },
      ],
      correctOptionId: 'forces-outcome',
      explanation:
        'Selling $10bn of sterling is not a prediction about the market — it is a large part of the market. Every pound sold is a pound the Bank of England must buy to hold the floor, so the position drains the reserves whose exhaustion the position is betting on. Soros called this reflexivity: in markets where the participants can affect what they are forecasting, a big enough bet stops being a forecast. That is the difference between being right about sterling and making a billion dollars from it.',
    },
  ],
  keyTakeaways: [
    'Shorting a pegged currency is borrowing it, selling it, and waiting.',
    'If the peg holds you lose only the interest gap; if it breaks you keep the whole devaluation.',
    'On a $10bn position at $1.8715, covering at $1.7082 pays about $873m against roughly $31m of carry.',
    'At sufficient size the trade stops being a forecast and becomes part of the cause.',
  ],
});
