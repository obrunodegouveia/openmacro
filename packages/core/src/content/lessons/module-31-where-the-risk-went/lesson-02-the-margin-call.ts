import { defineLesson } from '../../schema';

/**
 * Margin as a transmission mechanism for stress. The simulation reconstructs
 * the arithmetic of the 2022 gilt crisis.
 */
export const theMarginCallLesson = defineLesson({
  id: 'the-margin-call',
  title: 'The Cash Has to Be There This Afternoon',
  subtitle:
    'A position can be right, funded and profitable at maturity, and still destroy you on a Wednesday because the cash was due before the payoff was.',
  icon: '📞',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'sim-margin',
      type: 'interactive_sim',
      tags: ['margin', 'leverage', 'ldi'],
      xp: 45,
      currency: 'GBP',
      constants: {},
      prompt: 'How much cash does a yield move demand?',
      instructions: 'Reconstruct September 2022 and find the shortfall',
      narrative:
        'A leveraged holder of long-dated bonds posts collateral against the position and tops it up whenever prices move against it — in cash, within the day. Duration measures how much value moves per point of yield, so the call is simply the notional times the duration times the move. Nothing about this depends on the position being wrong. It depends only on the position being large, long and leveraged.',
      sliders: [
        {
          key: 'notional',
          label: 'Position size',
          min: 100000000000,
          max: 1500000000000,
          step: 50000000000,
          defaultValue: 1000000000000,
          format: 'currency',
          hint: 'UK liability-driven investment strategies ran around £1 trillion',
        },
        {
          key: 'duration',
          label: 'Duration of the holdings',
          min: 2,
          max: 20,
          step: 1,
          defaultValue: 12,
          format: 'number',
          hint: 'Years — pension liabilities are very long',
        },
        {
          key: 'yieldMove',
          label: 'Yield move against the position',
          min: 0,
          max: 0.025,
          step: 0.0005,
          defaultValue: 0.013,
          format: 'percent',
          hint: '30-year gilt yields moved about 1.3pp in days',
        },
        {
          key: 'liquidAssets',
          label: 'Cash and liquid assets held',
          min: 0,
          max: 300000000000,
          step: 10000000000,
          defaultValue: 60000000000,
          format: 'currency',
        },
      ],
      readouts: [
        {
          key: 'shortfall',
          label: 'Must be raised by selling',
          formulaId: 'liquidity_shortfall',
          format: 'currency',
          emphasis: true,
          caption: 'Call minus what is already liquid',
        },
        {
          key: 'call',
          label: 'Total margin call',
          formulaId: 'margin_call',
          format: 'currency',
          caption: 'notional × duration × yield move',
        },
      ],
      objective: {
        description: 'Reproduce a shortfall of more than £90 billion from a move of 1.3 percentage points',
        requiredObservations: [{ sliderKey: 'yieldMove', values: [0, 0.025] }],
        target: { readoutKey: 'shortfall', comparator: 'gte', value: 90000000000 },
      },
      explanation:
        'A trillion of exposure at twelve years duration generates a £156bn call from a 1.3 point move, against £60bn of liquid assets — so £96bn has to be raised by selling, and the only thing liquid enough to sell quickly is the gilts themselves. Selling gilts pushes yields higher, which generates a larger call, which forces more selling. That is a doom loop with no insolvency anywhere in it: the pension schemes were better funded at higher yields, and their own hedging was destroying them. The Bank of England’s intervention bought time for the deleveraging rather than rescuing anybody, which is why it was explicitly temporary and why it made money.',
    },
    {
      id: 'mc-procyclical',
      type: 'multiple_choice',
      tags: ['margin', 'procyclicality'],
      xp: 40,
      prompt: 'Margin protects a counterparty from default. Why is it destabilising for the system?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'timing',
          label: 'It demands the most cash exactly when cash is hardest to raise',
        },
        {
          id: 'excessive',
          label: 'The amounts demanded are too large',
          feedback:
            'They are calibrated to the risk actually taken. Demanding less would leave counterparties exposed, which moves the problem rather than solving it.',
        },
        {
          id: 'unfair',
          label: 'It falls hardest on smaller participants',
          feedback:
            'Margin is proportional to exposure. What varies is who has cash ready, which is a version of the timing problem in the answer.',
        },
        {
          id: 'opaque',
          label: 'The models are opaque',
          feedback:
            'Opacity makes it hard to prepare for, which is why transparency of margin models is now a live policy issue. The structural problem is the timing.',
        },
      ],
      correctOptionId: 'timing',
      explanation:
        'Every margin model is procyclical by construction: volatility rises, so required margin rises, so cash is demanded from everyone at once — in precisely the conditions where selling assets to raise it is most damaging. Each individual demand is prudent and the aggregate is a liquidity drain of exactly the wrong sign. This is not a flaw anyone can remove without recreating counterparty risk, which is why the policy work is about dampening it: margin floors set in calm times, longer lookback windows, and requiring funds to hold liquidity against plausible calls rather than against average ones.',
    },
    {
      id: 'order-spiral',
      type: 'order_flow',
      tags: ['margin', 'crisis'],
      xp: 35,
      prompt: 'Order a margin spiral.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'move', label: 'Prices move against a crowded leveraged position' },
        { id: 'call', label: 'Margin is called, in cash, same day' },
        { id: 'sell', label: 'Holders sell the most liquid thing they own' },
        { id: 'price', label: 'That selling moves the price further against them' },
        { id: 'more', label: 'A larger margin call follows' },
        { id: 'break', label: 'Only an outside buyer can break the loop' },
      ],
      correctOrder: ['move', 'call', 'sell', 'price', 'more', 'break'],
      explanation:
        'The third step is the cruel one: under pressure you sell not what you want to sell but what you can, which means the highest quality assets go first. That is why a stress originating anywhere ends up as selling pressure in government bonds — and why "flight to quality" and "forced selling of quality" can occur in the same week and look identical in the data. The last step is the uncomfortable conclusion: within the loop there is no participant who can stop it, because every one of them is acting correctly given the position they hold.',
    },
    {
      id: 'mc-preparation',
      type: 'multiple_choice',
      tags: ['margin', 'supervision'],
      xp: 35,
      prompt: 'What is the most useful supervisory question to ask a leveraged fund in calm conditions?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'plausible',
          label: 'What would you sell under an implausible move?',
        },
        {
          id: 'leverage',
          label: 'How much leverage are you currently running?',
          feedback:
            'Necessary and insufficient. Leverage tells you the size of the exposure, not whether the cash could be found when the call arrives.',
        },
        {
          id: 'var',
          label: 'What is your value at risk?',
          feedback:
            'Calibrated on recent history, which is the period that just failed to contain the event you are worried about.',
        },
        {
          id: 'returns',
          label: 'What returns have you promised investors?',
          feedback:
            'It reveals the pressure to take risk and says nothing about liquidity under stress.',
        },
      ],
      correctOptionId: 'plausible',
      explanation:
        'The word doing the work is "implausible". Every institution has prepared for the move it considers plausible; the events that matter are the ones outside that range, and the question forces the fund to name the assets it would be selling and confront that everyone else holding the same position would be selling them at the same moment. The 2022 answer would have been "we would sell gilts", from every scheme at once, which was the whole problem and was knowable in advance. Stress tests that ask only about plausible moves test the preparation rather than the vulnerability.',
    },
  ],
  keyTakeaways: [
    'A margin call is notional times duration times the move, due in cash today.',
    'Forced selling raises yields, which enlarges the call — a loop with no insolvency in it.',
    'Margin models are procyclical by construction and can only be dampened.',
    'Ask what a fund would sell under an implausible move, and whether everyone would sell it too.',
  ],
});
