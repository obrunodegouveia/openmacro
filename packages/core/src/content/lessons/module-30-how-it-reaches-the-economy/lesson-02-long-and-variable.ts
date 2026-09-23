import { defineLesson } from '../../schema';

/**
 * Lags. The reason the job cannot be done by observing the present, and the
 * reason it is possible to be both right and too late.
 */
export const longAndVariableLesson = defineLesson({
  id: 'long-and-variable',
  title: 'Long, Variable, and Not Measurable in Advance',
  subtitle:
    'Friedman’s phrase is quoted to excuse almost anything. It is worth knowing what it actually implies about a decision taken today.',
  icon: '⏳',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'mc-what-lags-imply',
      type: 'multiple_choice',
      tags: ['transmission', 'lags'],
      xp: 40,
      prompt: 'Inflation is falling but still above target. What do long lags imply for the decision?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'pipeline',
          label: 'Past tightening has not finished arriving yet',
        },
        {
          id: 'more',
          label: 'Keep tightening until inflation hits the target',
          feedback:
            'That guarantees overtightening: you would stop only once the effects had fully arrived, and by then a further year of effects is still in the pipeline behind the decision.',
        },
        {
          id: 'nothing',
          label: 'Lags mean the decision today is largely irrelevant',
          feedback:
            'It is highly relevant to the economy eighteen months out, which is the one the decision is for. Lags change the target date, not the importance.',
        },
        {
          id: 'reverse',
          label: 'Start easing, since the work is already done',
          feedback:
            'Symmetrically wrong, and it requires knowing that enough is in the pipeline. The pipeline is not directly observable, which is the actual difficulty.',
        },
      ],
      correctOptionId: 'pipeline',
      explanation:
        'A committee looking at current inflation is looking at the consequences of decisions taken a year or more ago. Tightening until the number behaves means tightening past the point where enough has been done, and then watching the excess arrive over the following year — which is a recession you caused after the problem was solved. This is the formal argument for stopping while inflation is still above target, a decision that is nearly impossible to explain publicly and is usually correct. It is also why "we will keep going until the job is done" is a phrase that should worry you.',
    },
    {
      id: 'match-lag-lengths',
      type: 'concept_match',
      tags: ['transmission', 'lags'],
      xp: 30,
      prompt: 'Four effects, four horizons. Match them.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'financial',
          term: 'Financial conditions',
          definition: 'Immediate, and often ahead of the decision itself',
        },
        {
          id: 'housing',
          term: 'Housing and durables',
          definition: 'Within two to four quarters — the fastest part of the real economy',
        },
        {
          id: 'activity',
          term: 'Output and unemployment',
          definition: 'A year to eighteen months, and the peak is hard to date even afterwards',
        },
        {
          id: 'inflation',
          term: 'Inflation',
          definition: 'Eighteen months to three years, by which time other things have happened',
        },
      ],
      explanation:
        'The spread is the problem. If everything arrived at once you could wait and see; instead the early effects are visible while the ones you care about are still in transit, which tempts a committee into reading housing weakness as the job being done. The dating is also genuinely uncertain: estimates of the peak effect on inflation range from four to twelve quarters across studies of the same economy, and "variable" in Friedman’s phrase is doing as much work as "long".',
    },
    {
      id: 'mc-why-variable',
      type: 'multiple_choice',
      tags: ['transmission', 'lags'],
      xp: 35,
      prompt: 'Why is the lag variable rather than a fixed period you could plan around?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'state',
          label: 'It depends on the state the economy is in when the decision lands',
        },
        {
          id: 'measure',
          label: 'The data is too noisy to date it precisely',
          feedback:
            'Noise makes the lag hard to estimate. It does not make the underlying lag itself vary, which is the stronger claim in the answer.',
        },
        {
          id: 'models',
          label: 'Different models give different answers',
          feedback:
            'They do, and that is a symptom. The models disagree partly because the thing they are estimating is not constant.',
        },
        {
          id: 'size',
          label: 'Larger rate changes act faster',
          feedback:
            'There is some evidence for nonlinearity in the size of moves. It is a much smaller source of variation than the condition of balance sheets when the move arrives.',
        },
      ],
      correctOptionId: 'state',
      explanation:
        'A rate rise into an economy with stretched household balance sheets, high debt and floating-rate mortgages bites within months. The same rise into an economy with fixed-rate debt, cash-rich firms and repaired balance sheets may take two years and land softly. So the lag is not a property of monetary policy — it is a property of the economy at that moment, which is why estimating it from a historical average is estimating something that no longer exists. A governor should ask what the transmission mechanism looks like now, not what it averaged over thirty years.',
    },
    {
      id: 'mc-implication',
      type: 'multiple_choice',
      tags: ['transmission', 'policy'],
      xp: 35,
      prompt: 'Given all this, what is the defensible way to run a tightening cycle?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'forecast',
          label: 'Set policy against the forecast, not the present',
        },
        {
          id: 'rule',
          label: 'Follow a rule so that the lags average out',
          feedback:
            'A rule computed on current data has the same problem — it responds to inflation that already happened. Module 20 works through why the rule is a benchmark rather than an instruction.',
        },
        {
          id: 'gradual',
          label: 'Move in small steps so mistakes stay small',
          feedback:
            'Gradualism limits the size of an error and lengthens the time before the effect arrives. It is a reasonable default, not a solution.',
        },
        {
          id: 'wait',
          label: 'Wait for clear evidence before each move',
          feedback:
            'Clear evidence arrives with the lag. A policy of waiting for it is a policy of being late every time.',
        },
      ],
      correctOptionId: 'forecast',
      explanation:
        'This is why the forecast round exists and why the previous module spent four lessons on it. Lags make the present unusable as a guide, so the only coherent object to set policy against is a projection of where inflation will be when the decision acts — with an explicit account of how much past tightening has not yet arrived. It is an uncomfortable answer, because it means acting on a number that is frequently wrong. The alternative is acting on a number that is reliably out of date, which is worse in a way that is harder to see.',
    },
  ],
  keyTakeaways: [
    'Today’s inflation reflects decisions taken a year or more ago.',
    'Tightening until the number behaves guarantees overtightening.',
    'The lag depends on the state of balance sheets, so it is not a stable parameter.',
    'Lags are why policy must be set against a forecast rather than the present.',
  ],
});
