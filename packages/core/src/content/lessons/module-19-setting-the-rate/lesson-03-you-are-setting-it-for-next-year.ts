import { defineLesson } from '../../schema';

/**
 * Lags: you act on data about the past, and what you do lands in a future
 * you cannot see. Friedman's "long and variable" is usually quoted and
 * rarely worked through.
 */
export const youAreSettingItForNextYearLesson = defineLesson({
  id: 'you-are-setting-it-for-next-year',
  title: 'Driving by the Mirror',
  subtitle:
    'The data is three months old, the effect lands in eighteen. Everything difficult about this job is in that sentence.',
  icon: '🪞',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'order-the-lag',
      type: 'order_flow',
      tags: ['lags', 'transmission'],
      xp: 30,
      prompt: 'Put one rate rise in order, from the decision to its effect on prices.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'decide', label: 'The committee raises the rate', detail: 'Day zero' },
        { id: 'money', label: 'Money market and short bond yields move', detail: 'Minutes — often before, if it was expected' },
        { id: 'lending', label: 'Banks reprice new loans and deposits', detail: 'Weeks' },
        { id: 'decisions', label: 'Firms shelve projects; households delay purchases', detail: 'Months' },
        { id: 'demand', label: 'Spending and hiring slow' },
        { id: 'prices', label: 'Price and wage setting responds', detail: 'A year to two years out' },
      ],
      correctOrder: ['decide', 'money', 'lending', 'decisions', 'demand', 'prices'],
      explanation:
        'The first two steps are nearly instant and the last is where the mandate lives. That asymmetry is the trap: you get immediate confirmation that markets moved, and no information for a year about whether it worked. A committee that judges itself on the fast steps is judging itself on the part that was never in doubt.',
    },
    {
      id: 'mc-forecast-targeting',
      type: 'multiple_choice',
      tags: ['lags', 'forecasting'],
      xp: 35,
      prompt:
        'Inflation today is 8%. Your forecast says that with no change it will be 2% in eighteen months. What does the lag imply about today’s decision?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'forecast',
          label: 'Set policy against the forecast — today’s 8% is already beyond your reach',
        },
        {
          id: 'current',
          label: 'Tighten hard: 8% is four times the target',
          feedback:
            'Nothing you do today touches today’s 8%; that inflation was determined months ago. Tightening into a forecast already at target is how a central bank produces the next recession and then wonders where it came from.',
        },
        {
          id: 'average',
          label: 'Split the difference between the current reading and the forecast',
          feedback:
            'An understandable instinct that has no mechanism behind it. The current reading is not a target you can affect; averaging it in means deliberately aiming at something unreachable.',
        },
        {
          id: 'wait',
          label: 'Hold until the data confirms the forecast',
          feedback:
            'By the time the data confirms it, your response is eighteen months late. Waiting for certainty is choosing to always act too late.',
        },
      ],
      correctOptionId: 'forecast',
      explanation:
        'This is why modern central banks describe themselves as inflation-*forecast* targeters. The target is the forecast at the policy horizon, not the print on the screen — and it is also why every inflation-targeting bank faces the same accusation, that it ignores the inflation people are actually living through. The accusation is correct as description and wrong as criticism: the alternative is aiming at something that has already happened.',
    },
    {
      id: 'mc-variable',
      type: 'multiple_choice',
      tags: ['lags', 'uncertainty'],
      xp: 30,
      prompt: 'Friedman called the lags "long and variable". What follows from *variable*, specifically?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'overshoot',
          label: 'Act in steps you can reverse: you cannot fine-tune a system whose delay you do not know',
        },
        {
          id: 'bigger',
          label: 'Move in larger steps, to overcome the delay',
          feedback:
            'This is the instinct that produces the cycle Friedman was describing: tighten hard, see nothing, tighten again, then have both rounds land at once on an economy that has already turned.',
        },
        {
          id: 'model',
          label: 'Model the lag precisely and time the move to match',
          feedback:
            'Variable means the lag itself moves — with household debt, with how much of it is at fixed rates, with the state of the banking system. A precise estimate of an unstable quantity is precision about the wrong thing.',
        },
        {
          id: 'ignore',
          label: 'Ignore the lag and respond to whatever the latest data shows',
          feedback:
            'That is the definition of the policy Friedman was arguing against. It guarantees you are always adding stimulus into a recovery and restraint into a slowdown.',
        },
      ],
      correctOptionId: 'overshoot',
      explanation:
        'Long you can plan around. Variable you cannot, and the practical consequence is gradualism plus a willingness to stop and look. Note how much the lag has moved in one country: in a housing market of two-year fixed mortgages a rate rise bites within months, and in one of thirty-year fixed mortgages the same rise barely touches existing borrowers at all. The transmission mechanism is a feature of the country, not of monetary policy.',
    },
    {
      id: 'match-what-changes-the-lag',
      type: 'concept_match',
      tags: ['transmission', 'lags'],
      xp: 30,
      prompt: 'The same rate rise bites at different speeds. Match each feature to what it does to the lag.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'floating',
          term: 'Mostly floating-rate mortgages',
          definition: 'Short — household budgets change within a reset cycle, which in the euro area is months',
        },
        {
          id: 'fixed',
          term: 'Mostly long fixed-rate mortgages',
          definition: 'Long — existing borrowers are untouched, so the rise only reaches new buyers',
        },
        {
          id: 'bankdebt',
          term: 'Firms funded by bank loans',
          definition: 'Short — repricing passes through at the next rollover',
        },
        {
          id: 'marketdebt',
          term: 'Firms funded in bond markets',
          definition: 'Long and lumpy — nothing changes until the debt matures and has to be refinanced',
        },
      ],
      explanation:
        'Read those four and you can see why one policy rate for twenty countries is genuinely hard, and why the same ECB decision lands on Portugal and Germany at different speeds and in different sectors. Knowing your own country’s financing structure is not a detail of the job. It is the difference between a rate rise that works in six months and one that works in three years.',
    },
  ],
  keyTakeaways: [
    'Today’s inflation is beyond today’s decision; the target is the forecast at the horizon.',
    'Variable lags argue for reversible steps rather than decisive ones.',
    'How fast a rate rise bites is a property of the country’s debt structure, not of policy.',
  ],
});
