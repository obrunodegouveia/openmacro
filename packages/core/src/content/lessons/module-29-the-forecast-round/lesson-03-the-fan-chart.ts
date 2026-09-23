import { defineLesson } from '../../schema';

/**
 * Uncertainty as the object of the decision. The simulation exists to make
 * one point: two forecasts with the same central number can be entirely
 * different policy problems.
 */
export const theFanChartLesson = defineLesson({
  id: 'the-fan-chart',
  title: 'The Number Is a Distribution',
  subtitle:
    'Two projections both say 2.5%. One of them should keep you awake and the central number cannot tell you which.',
  icon: '📊',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'sim-fan',
      type: 'interactive_sim',
      tags: ['forecasting', 'uncertainty'],
      xp: 45,
      constants: {},
      prompt: 'What is the chance inflation lands above the line?',
      instructions: 'Hold the central forecast at 2.5% and find a one-in-three chance of exceeding 3%',
      narrative:
        'A fan chart draws the distribution around a projection. The central line is the mode; the shaded bands are where the outturn might actually land. Policy does not respond to the central line — it responds to how much of the distribution sits somewhere unacceptable, which is why the same forecast justifies different decisions depending on how confident anyone is in it.',
      sliders: [
        {
          key: 'centralForecast',
          label: 'Central projection',
          min: 0,
          max: 0.06,
          step: 0.0025,
          defaultValue: 0.025,
          format: 'percent',
          hint: 'Inflation at the policy horizon',
        },
        {
          key: 'uncertainty',
          label: 'Forecast uncertainty',
          min: 0.002,
          max: 0.02,
          step: 0.001,
          defaultValue: 0.01,
          format: 'percent',
          hint: 'Standard deviation — about 1pp two years out, historically',
        },
        {
          key: 'threshold',
          label: 'The line you care about',
          min: 0.02,
          max: 0.05,
          step: 0.0025,
          defaultValue: 0.03,
          format: 'percent',
        },
      ],
      readouts: [
        {
          key: 'risk',
          label: 'Probability of exceeding it',
          formulaId: 'prob_above_threshold',
          format: 'percent',
          emphasis: true,
          caption: 'The part of the fan above the line',
        },
      ],
      objective: {
        description: 'With the central projection at 2.5%, reach a one-in-three chance of inflation above 3%',
        requiredObservations: [{ sliderKey: 'uncertainty', values: [0.002, 0.02] }],
        target: { readoutKey: 'risk', comparator: 'gte', value: 0.33 },
      },
      explanation:
        'Hold the central projection at 2.5% and move only the uncertainty. At a standard deviation of 0.2pp the chance of exceeding 3% is about one in seventy; at 2pp it is two in five. The forecast has not changed — the confidence in it has, and the policy problem is completely different. This is why a committee that argues only about the central number is arguing about the least decision-relevant part of the projection, and why fan charts were introduced in the first place. Note also how fast the risk moves: uncertainty is not a caveat appended to the forecast, it is a variable with as much influence on the right decision as the forecast itself.',
    },
    {
      id: 'mc-skew',
      type: 'multiple_choice',
      tags: ['forecasting', 'uncertainty'],
      xp: 40,
      prompt: 'A fan chart is drawn deliberately skewed to the upside. What is the committee saying?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'asymmetric',
          label: 'The ways this could go wrong are not symmetric',
        },
        {
          id: 'higher',
          label: 'Inflation is more likely to be high than low',
          feedback:
            'A skew moves the mean away from the mode without making the upside more likely. It says the upside misses would be larger, not more frequent.',
        },
        {
          id: 'hawkish',
          label: 'The committee intends to tighten',
          feedback:
            'It may well follow, and the chart is a statement about the distribution of outcomes rather than about intended actions.',
        },
        {
          id: 'uncertain',
          label: 'The committee is less confident than usual',
          feedback:
            'That is the width of the fan. Skew is a separate property and the two move independently.',
        },
      ],
      correctOptionId: 'asymmetric',
      explanation:
        'Skew says that if this forecast is wrong on the upside it will be wrong by more than if it is wrong on the downside — an energy price that could double but not halve, a wage round that could break out but not collapse. The mean of a skewed distribution sits away from the mode, so the "expected" outturn differs from the most likely one, and policy responds to the mean. This is the formal content of "risks are tilted to the upside", a phrase that appears in nearly every statement and is usually read as a vague mood rather than the specific claim it is.',
    },
    {
      id: 'mc-risk-management',
      type: 'multiple_choice',
      tags: ['forecasting', 'policy'],
      xp: 40,
      prompt:
        'Risk-management policy means acting on the tails rather than the central case. When is that right?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'irreversible',
          label: 'When one tail is far more costly to undo',
        },
        {
          id: 'always',
          label: 'Always — the tails are what really matter',
          feedback:
            'Acting on tails when the costs are symmetric means systematically missing the central case for no gain. The asymmetry is what justifies it.',
        },
        {
          id: 'uncertain',
          label: 'When uncertainty is unusually high',
          feedback:
            'High uncertainty widens both tails. Width alone does not tell you which way to lean.',
        },
        {
          id: 'crisis',
          label: 'Only during an actual crisis',
          feedback:
            'The clearest applications are outside crises — insuring against a deflation trap, or against an anchor coming loose, long before either has happened.',
        },
      ],
      correctOptionId: 'irreversible',
      explanation:
        'Take out insurance where the loss is unrecoverable. Two examples already in this course: easing hard near the lower bound, because falling into it is much harder to escape than overshooting is to correct; and tightening before you are sure when expectations might unanchor, because re-anchoring costs a recession. In both the central case may not justify the action and the asymmetry does. The discipline is to name which tail you are insuring against and what it would cost, rather than using "risk management" as a label for a decision reached some other way.',
    },
    {
      id: 'match-uncertainty-types',
      type: 'concept_match',
      tags: ['forecasting', 'uncertainty'],
      xp: 30,
      prompt: 'Three kinds of uncertainty in a projection. Match each to what it is.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'shock',
          term: 'Shock uncertainty',
          definition: 'The world will do things nobody forecast — the irreducible part',
        },
        {
          id: 'parameter',
          term: 'Parameter uncertainty',
          definition: 'The model’s structure may be right and its coefficients wrong',
        },
        {
          id: 'model',
          term: 'Model uncertainty',
          definition: 'The structure itself may be wrong, and no confidence band contains that',
        },
      ],
      explanation:
        'Published fan charts are built almost entirely from the first, using the historical distribution of past forecast errors. That has a specific consequence: if the economy has entered a regime unlike the one in the historical sample, the fan chart is calibrated on the wrong world and will be too narrow — exactly when it matters. The third kind is not quantified anywhere and is the reason a committee keeps several models and reads the disagreement between them as information. A fan chart is a floor on your uncertainty, never a description of it.',
    },
  ],
  keyTakeaways: [
    'The same central forecast is a different policy problem at different uncertainty.',
    'Skew says the upside misses would be larger, not more likely.',
    'Risk management is justified by asymmetric costs, not by uncertainty alone.',
    'A fan chart built on past errors is too narrow exactly when the regime has changed.',
  ],
});
