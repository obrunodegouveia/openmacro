import { defineLesson } from '../../schema';

/**
 * The forecast as an institutional object. It is not a prediction and
 * treating it as one is the most common way to misread a central bank.
 */
export const whatAForecastIsForLesson = defineLesson({
  id: 'what-a-forecast-is-for',
  title: 'It Is Not a Prediction',
  subtitle:
    'A central bank forecast is a conditional statement whose conditions are chosen. Change the conditions and you change the number, deliberately.',
  icon: '🔮',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'mc-conditioning',
      type: 'multiple_choice',
      tags: ['forecasting', 'conditioning'],
      xp: 35,
      prompt:
        'A forecast conditioned on market interest rate expectations shows inflation at 1.6% in three years. What has the committee just said?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'too-tight',
          label: 'Rates priced by the market are higher than needed to hit the target',
        },
        {
          id: 'undershoot',
          label: 'Inflation will undershoot the target',
          feedback:
            'Only if rates follow the market path, which the committee is signalling they should not. Reading a conditional forecast as unconditional inverts its message.',
        },
        {
          id: 'wrong',
          label: 'The committee believes the market is mispricing the economy',
          feedback:
            'It is a statement about the rate path, not about the market’s view of the economy. The distinction matters because the committee controls one and not the other.',
        },
        {
          id: 'nothing',
          label: 'Nothing — a three-year forecast carries no information',
          feedback:
            'Three years is roughly the horizon at which policy fully acts. It is the most policy-relevant part of the projection, not the least.',
        },
      ],
      correctOptionId: 'too-tight',
      explanation:
        'This is the single most useful thing to know about reading a central bank. If the projection conditioned on market rates undershoots the target, the committee is saying — without saying it — that the market path is too high and rates should be lower than priced. The forecast is how a committee communicates a policy signal while preserving the fiction that it has not pre-committed. Which is why the choice of conditioning assumption is itself a policy decision: constant rates, market rates, or the committee’s own path each send a different message from identical economics.',
    },
    {
      id: 'match-conditioning-choices',
      type: 'concept_match',
      tags: ['forecasting', 'communication'],
      xp: 30,
      prompt: 'Three conditioning conventions. Match each to what it costs.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'constant',
          term: 'Constant interest rates',
          definition: 'Transparent and implausible — nobody believes rates will sit still for three years',
        },
        {
          id: 'market',
          term: 'Market-implied path',
          definition: 'Plausible, and makes the forecast a comment on the market rather than on the economy',
        },
        {
          id: 'own',
          term: 'The committee’s own projected path',
          definition: 'Most informative, and reads as a commitment the committee does not want to make',
        },
      ],
      explanation:
        'Every option leaks. The third — publishing your own expected rate path, as the Fed does with the dot plot and Norway and Sweden do properly — is the most honest and creates a problem the others avoid: the public reads a projection as a promise, so deviating from it later looks like a broken one even when circumstances plainly changed. There is no convention without this tension. What a governor can do is state which one is in use and what it implies, every time, so that the signal is read as intended rather than decoded.',
    },
    {
      id: 'mc-horizon',
      type: 'multiple_choice',
      tags: ['forecasting', 'horizon'],
      xp: 35,
      prompt: 'Why does the forecast horizon run two to three years rather than one?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'lags',
          label: 'That is roughly when today’s decision finishes acting',
        },
        {
          id: 'accuracy',
          label: 'Forecasts are more accurate at longer horizons',
          feedback:
            'They are far worse — beyond about two years most central bank forecasts do little better than assuming a return to target. The horizon is chosen despite that, not because of it.',
        },
        {
          id: 'convention',
          label: 'It is an international convention',
          feedback:
            'The convergence is real and it follows from the underlying reason rather than causing it.',
        },
        {
          id: 'data',
          label: 'Shorter horizons are already determined by published data',
          feedback:
            'The next few quarters genuinely are largely baked in, which is a good reason not to focus there. It does not explain why the horizon stops where it does.',
        },
      ],
      correctOptionId: 'lags',
      explanation:
        'Policy acts with a lag of roughly a year to eighteen months on activity and longer on prices, so the horizon is set by the transmission mechanism rather than by forecasting ability. This produces the uncomfortable position a central bank actually occupies: it must aim at a point in time where its forecast is barely better than a coin toss, using an instrument whose effect it cannot observe until long after the decision. There is no version of the job without this, which is why the forecast’s role is to organise an argument rather than to be right.',
    },
    {
      id: 'order-forecast-round',
      type: 'order_flow',
      tags: ['forecasting', 'process'],
      xp: 30,
      prompt: 'Order a quarterly forecast round as an institution actually runs it.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'data', label: 'Assemble the data and settle the starting point' },
        { id: 'assumptions', label: 'Agree the conditioning assumptions', detail: 'Rates, oil, fiscal, exchange rate' },
        { id: 'model', label: 'Run the core model' },
        { id: 'judgement', label: 'Staff apply judgement where the model is known to be wrong' },
        { id: 'committee', label: 'The committee challenges it and sends parts back' },
        { id: 'publish', label: 'Publish the projection and the decision together' },
      ],
      correctOrder: ['data', 'assumptions', 'model', 'judgement', 'committee', 'publish'],
      explanation:
        'The fifth step is the one outsiders underestimate. The published projection is not the model’s output — it is a negotiated document that a committee of people who disagree have all agreed they can live with, after several rounds of sending pieces back. This is a feature: a number that has survived being attacked by everyone in the room is more robust than one that has not. It also means the forecast contains information about the committee’s internal balance, which is why the revisions between rounds often say more than the levels.',
    },
  ],
  keyTakeaways: [
    'A projection is conditional, and the conditions are a policy choice.',
    'A conditioned forecast that misses target is a signal about the rate path.',
    'The horizon is set by transmission lags, not by forecast accuracy.',
    'The published forecast is a negotiated document, not a model output.',
  ],
});
