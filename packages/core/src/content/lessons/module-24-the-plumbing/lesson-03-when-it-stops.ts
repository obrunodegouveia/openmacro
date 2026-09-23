import { defineLesson } from '../../schema';

/**
 * Operational risk, which is the risk that actually materialises: outages,
 * concentration, and the cyber question nobody has a good answer to.
 */
export const whenItStopsLesson = defineLesson({
  id: 'when-it-stops',
  title: 'When the System Goes Down',
  subtitle:
    'Every financial crisis you have read about was a solvency or liquidity problem. The outages nobody wrote about were operational, and there were more of them.',
  icon: '🚨',
  difficulty: 'advanced',
  estimatedMinutes: 9,
  challenges: [
    {
      id: 'mc-outage-cost',
      type: 'multiple_choice',
      tags: ['operational-risk', 'payments'],
      xp: 30,
      prompt:
        'The national settlement system is down for four hours on a normal Tuesday. What is the first-order damage?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'unsettled',
          label: 'Unsettled obligations pile up and exposures grow',
        },
        {
          id: 'shops',
          label: 'Card payments in shops stop working',
          feedback:
            'Retail payments run on separate rails and usually keep working, which is why the public rarely notices. The damage is wholesale and invisible.',
        },
        {
          id: 'rate',
          label: 'The policy rate loses control of market rates',
          feedback:
            'Overnight rates can certainly move if banks cannot square their positions, and it is a consequence of the first-order problem rather than the problem itself.',
        },
        {
          id: 'nothing',
          label: 'Very little — it all settles the next day',
          feedback:
            'Some of it will. But a bank that expected money at noon and planned its own payments around it is now short, and it has no way to tell whether the shortfall is technical or real.',
        },
      ],
      correctOptionId: 'unsettled',
      explanation:
        'An outage converts a system designed to eliminate credit exposure into one that accumulates it, silently, at the rate payments would have been settling. Four hours of a system moving hundreds of billions a day is a very large number of obligations sitting outstanding between institutions that cannot see each other’s position. This is why operators publish contingency arrangements, why extended settlement windows exist, and why the decision to extend the day is taken in minutes rather than by committee.',
    },
    {
      id: 'match-operational-controls',
      type: 'concept_match',
      tags: ['operational-risk', 'resilience'],
      xp: 30,
      prompt: 'Four defences, four different failures they address.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'site',
          term: 'Geographically separate secondary site',
          definition: 'Against a physical event taking out the primary — and far enough away not to share the disaster',
        },
        {
          id: 'diverse',
          term: 'Technologically diverse backup',
          definition: 'Against a fault or attack that would affect an identical system identically',
        },
        {
          id: 'window',
          term: 'Extended settlement window',
          definition: 'Against time itself — lets the day finish rather than leaving obligations overnight',
        },
        {
          id: 'reconciliation',
          term: 'Independent record of positions',
          definition: 'Against the case where the system runs but its data is wrong, which is worse than an outage',
        },
      ],
      explanation:
        'The fourth is the one institutions underweight. A system that stops is obvious and recoverable; a system that keeps running while producing incorrect positions can propagate wrong settlements for hours before anyone notices, and unwinding them collides with the settlement finality that makes the system work in the first place. Data integrity is the harder problem and the one cyber threat models now centre on.',
    },
    {
      id: 'mc-concentration',
      type: 'multiple_choice',
      tags: ['operational-risk', 'concentration'],
      xp: 35,
      prompt:
        'Four banks handle 80% of the volume in a national system. Why does an operator care, beyond the obvious?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'operational-too-big',
          label: 'One of them failing operationally is the system failing',
        },
        {
          id: 'competition',
          label: 'It is bad for competition between participants',
          feedback:
            'It probably is, and that belongs to a competition authority. The operator’s concern is that concentration converts one participant’s bad morning into everyone’s.',
        },
        {
          id: 'pricing',
          label: 'Those banks can negotiate better fees',
          feedback:
            'Commercially true and not a stability issue. Fee schedules are usually cost-recovery and published.',
        },
        {
          id: 'credit',
          label: 'They pose more credit risk to the central bank',
          feedback:
            'Intraday credit is collateralised, so credit risk is largely addressed. What collateral does not address is a participant that is simply unable to send instructions for three hours.',
        },
      ],
      correctOptionId: 'operational-too-big',
      explanation:
        'Concentration means a supervisor has to treat a large participant’s operational resilience as a public matter, not an internal one — its disaster recovery, its testing regime, its third-party dependencies. And those dependencies now concentrate further: most large participants run critical services through a handful of cloud providers and messaging networks, so "diversify your participants" no longer guarantees diverse infrastructure underneath them.',
    },
    {
      id: 'order-cyber-response',
      type: 'order_flow',
      tags: ['cyber', 'operational-risk'],
      xp: 35,
      prompt:
        'A participant reports that payment instructions on its network may have been tampered with. Order the response.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'isolate', label: 'Suspend that participant’s access', detail: 'Before deciding what happened' },
        { id: 'integrity', label: 'Establish whether settled instructions are trustworthy' },
        { id: 'contain', label: 'Check whether other participants show the same signature' },
        { id: 'liquidity', label: 'Provide liquidity to those left short by suspended payments' },
        { id: 'restore', label: 'Restore access once integrity is re-established' },
      ],
      correctOrder: ['isolate', 'integrity', 'contain', 'liquidity', 'restore'],
      explanation:
        'Suspension comes first and is the hardest decision, because it is taken on incomplete information and it damages a participant that may turn out to be fine. The reason it goes first is asymmetry: a wrongly suspended bank is inconvenienced and can be made whole, whereas corrupted instructions that settle with finality cannot be taken back. Note where liquidity sits — fourth, not first. The instinct to lend before knowing whether the records are true is exactly the instinct to resist here.',
    },
  ],
  keyTakeaways: [
    'An outage turns a risk-free system into one silently accumulating exposure.',
    'A system running on corrupted data is worse than one that has stopped.',
    'Concentration makes a participant’s operational resilience a public question.',
    'Under a suspected integrity failure, contain first and lend second.',
  ],
});
