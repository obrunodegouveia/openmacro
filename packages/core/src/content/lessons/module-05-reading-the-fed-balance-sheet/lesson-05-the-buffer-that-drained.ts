import { defineLesson } from '../../schema';

/**
 * The ON RRP facility peaked at $2,553.7bn on 30 December 2022 and stood at
 * $0.7bn on 4 September 2026 (FRED: RRPONTSYD). Over the same period the Fed's
 * assets fell by roughly $2.2 trillion — and reserves did not collapse. The
 * arithmetic of why is the point of this lesson.
 */
export const theBufferThatDrainedLesson = defineLesson({
  id: 'the-buffer-that-drained',
  title: 'The Buffer That Absorbed Two Trillion',
  subtitle:
    'How the Fed shrank its balance sheet by $2.2tn without draining the banking system.',
  icon: '🕳️',
  difficulty: 'advanced',
  estimatedMinutes: 8,
  challenges: [
    {
      id: 'mc-where-did-qt-land',
      type: 'multiple_choice',
      tags: ['qt', 'rrp', 'reserves'],
      xp: 15,
      prompt:
        'Between April 2022 and September 2026 the Fed’s assets fell from $8.97tn to $6.74tn — down $2.2tn. Reserves fell far less. Where did the rest of the shrinkage come from?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'currency',
          label: 'Currency in circulation fell',
          feedback:
            'Currency almost never falls. It grew right through this period, to $2.48tn — which made the squeeze on everything else slightly worse, not better.',
        },
        {
          id: 'rrp',
          label: 'The overnight reverse repo facility drained, from $2.55tn to almost nothing',
        },
        {
          id: 'capital',
          label: 'The Fed wrote down its capital',
          feedback:
            'Fed capital is $47.7bn — two per cent of the shrinkage. It could go to zero and barely register on this question.',
        },
        {
          id: 'tga',
          label: 'The Treasury emptied its account',
          feedback:
            'The Treasury account moves in both directions and ended the period higher, near $944bn. It absorbed reserves over this stretch rather than releasing them.',
        },
      ],
      correctOptionId: 'rrp',
      explanation:
        'Money market funds had parked $2.55tn at the Fed overnight because there was nothing better to hold. As the Treasury flooded the market with bills paying more than the facility, the funds walked their cash out of the Fed and into bills. Each dollar that left shrank a Fed liability that was not reserves — so the asset side could fall without reserves falling with it.',
    },

    {
      id: 'match-rrp-anatomy',
      type: 'concept_match',
      tags: ['rrp', 'money-markets'],
      xp: 20,
      prompt: 'Match each piece of the reverse repo story to what it does.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'onrrp',
          term: 'ON RRP facility',
          definition:
            'An overnight place for money funds to lend to the Fed against Treasury collateral',
        },
        {
          id: 'floor',
          term: 'Rate floor',
          definition:
            'Nobody lends below what the Fed itself will pay, so the facility rate sets a hard minimum',
        },
        {
          id: 'foreign',
          term: 'Foreign repo pool',
          definition:
            "Other central banks' dollar cash, $357bn of the $358bn now on the line",
        },
        {
          id: 'bills',
          term: 'Treasury bill supply',
          definition:
            'The thing that emptied the facility, by out-paying it for the same overnight risk',
        },
      ],
      explanation:
        'Note what the last line means for today: the domestic side of the facility is finished. Of the $357.7bn still on the sheet on 2 September 2026, all but about half a billion belongs to foreign central banks, and that portion barely moves. The buffer is gone.',
    },

    {
      id: 'flow-drain-order',
      type: 'order_flow',
      tags: ['qt', 'rrp', 'reserves', 'money-markets'],
      xp: 25,
      prompt: 'Put the drain in causal order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'qt',
          label: 'The Fed stops replacing maturing bonds',
          detail: 'The asset side begins to shrink on its own',
        },
        {
          id: 'bills',
          label: 'The Treasury issues heavily in bills',
          detail: 'Short-dated paper floods the market at competitive yields',
        },
        {
          id: 'leave',
          label: 'Money funds move cash out of the Fed and into bills',
          detail: 'The facility pays less than the alternative for the first time in years',
        },
        {
          id: 'rrp-falls',
          label: 'The reverse repo balance collapses toward zero',
          detail: '$2.55tn to under a billion',
        },
        {
          id: 'reserves-exposed',
          label: 'Reserves become the only thing left to absorb further shrinkage',
          detail: 'The cushion is spent; from here QT bites directly',
        },
      ],
      correctOrder: ['qt', 'bills', 'leave', 'rrp-falls', 'reserves-exposed'],
      explanation:
        'The order matters because it explains the timing of the Fed’s caution. While the facility had money in it, the Fed could shrink almost painlessly. The moment it emptied, every further dollar of shrinkage came straight out of reserves — and that is the point at which the Fed slowed, and then stopped.',
    },

    {
      id: 'mc-why-it-mattered',
      type: 'multiple_choice',
      tags: ['rrp', 'policy', 'liquidity'],
      xp: 15,
      prompt:
        'With the facility at $0.7bn, what has changed about how a reserve drain now feels?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'nothing',
          label: 'Nothing — the facility was always a sideshow',
          feedback:
            'A sideshow does not reach $2.55tn. For two years it was the second-largest liability on the Fed’s balance sheet after reserves.',
        },
        {
          id: 'direct',
          label: 'Drains now hit reserves directly, with no cushion in between',
        },
        {
          id: 'safer',
          label: 'The system is safer, because the facility was a source of instability',
          feedback:
            'The facility was a shock absorber, not a shock. Its balance falling to zero removes an option, it does not remove a risk.',
        },
        {
          id: 'fed-lost',
          label: 'The Fed has lost control of the floor under short rates',
          feedback:
            'The floor still works — it just has almost nobody using it domestically. Interest on reserves is doing the work now, and that channel is intact.',
        },
      ],
      correctOptionId: 'direct',
      explanation:
        'A Treasury account rebuild, a tax date, a quarter-end — each of these used to be met by money leaving the reverse repo facility instead of leaving the banking system. Now there is nothing between the drain and reserves, which is why the same-sized flow makes a much bigger dent in money market rates than it did in 2023.',
    },
  ],
  keyTakeaways: [
    'The reverse repo facility went from $2.55tn at the end of 2022 to $0.7bn in September 2026.',
    'That drain is how the Fed shrank its balance sheet by $2.2tn without a matching collapse in reserves.',
    'What is left is almost entirely foreign central banks’ cash, which does not move much.',
    'With the cushion gone, reserve drains now land directly on the banking system.',
  ],
});
