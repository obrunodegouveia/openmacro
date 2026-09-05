import { defineLesson } from '../../schema';

/**
 * The capstone: two statements, one week apart, pointing opposite ways.
 *
 * Eurosystem total assets peaked at €8,835,987m in week 25 of 2022 and stood
 * at €5,915,343m on 28 August 2026 — down €174bn over the preceding year and
 * still falling. The Fed peaked at $8,965,487m on 13 April 2022 and stood at
 * $6,737,204m on 2 September 2026 — up $135bn over the same year.
 */
export const twoSheetsDivergingLesson = defineLesson({
  id: 'two-sheets-diverging',
  title: 'Two Sheets, Opposite Directions',
  subtitle:
    'Both are far below their 2022 peaks. One is growing again and the other is not.',
  icon: '🧭',
  difficulty: 'advanced',
  estimatedMinutes: 8,
  challenges: [
    {
      id: 'mc-who-is-shrinking',
      type: 'multiple_choice',
      tags: ['qt', 'ecb', 'fed'],
      xp: 20,
      prompt:
        'Over the year to late summer 2026 the Fed’s assets rose $135bn and the Eurosystem’s fell €174bn. Both are roughly €/$2-3tn below their 2022 peaks. Which is tightening?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'both',
          label: 'Both — they are both far below their peaks',
          feedback:
            'The distance from a 2022 peak is history. Tightening is a direction, and only one of these two is still pointing down.',
        },
        {
          id: 'ecb-only',
          label: 'The Eurosystem. The Fed stopped, and has been adding since December 2025',
        },
        {
          id: 'fed-only',
          label: 'The Fed, because its portfolio still contains long-dated MBS',
        },
        {
          id: 'neither',
          label: 'Neither — balance sheet size is not a policy stance',
          feedback:
            'It is not the *whole* stance, and rates matter more. But the direction of the asset side is precisely what "quantitative tightening" names, and it is not nothing.',
        },
      ],
      correctOptionId: 'ecb-only',
      explanation:
        'The Eurosystem is running APP and PEPP off in full and has no reinvestment floor to stop at. The Fed reached the level of reserves it considered ample, stopped shrinking, and now adds slowly. Same headline — "well below the peak" — and opposite policies underneath it.',
    },

    {
      id: 'match-same-word-different-thing',
      type: 'concept_match',
      tags: ['ecb', 'fed', 'comparison'],
      xp: 25,
      prompt: 'Each of these means something different at the two central banks. Match them.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'reserves',
          term: '"Reserves"',
          definition:
            'One line at the Fed; two at the Eurosystem, and 86% of it sits in the one that pays',
        },
        {
          id: 'floor',
          term: 'The rate floor',
          definition:
            'Interest on reserves plus a facility for non-banks at the Fed; the deposit facility, banks only, at the ECB',
        },
        {
          id: 'gold',
          term: 'Gold on the balance sheet',
          definition:
            'Marked to market quarterly in Frankfurt; carried at a 1973 statutory price in Washington',
        },
        {
          id: 'lending',
          term: 'Lending to banks',
          definition:
            'A framework the ECB was built around and now barely uses; a facility the Fed keeps for emergencies',
        },
      ],
      explanation:
        'This is the trap in reading cross-Atlantic commentary. "Reserves fell", "the floor held", "the balance sheet shrank" — each is a precise statement about a specific line, and the lines are not the same institution to institution.',
    },

    {
      id: 'flow-why-diverge',
      type: 'order_flow',
      tags: ['qt', 'reserves', 'policy'],
      xp: 25,
      prompt:
        'Put the reasoning in order: why one central bank stops shrinking before the other.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'runoff',
          label: 'Both let their bond portfolios run off',
          detail: 'Maturing holdings are not replaced',
        },
        {
          id: 'buffers',
          label: 'The non-reserve liabilities absorb the shrinkage first',
          detail: 'The Fed’s reverse repo facility; the euro area’s enormous excess liquidity',
        },
        {
          id: 'exhausted',
          label: 'One system runs out of buffer before the other',
          detail: 'The Fed’s facility emptied; €2tn of excess liquidity did not',
        },
        {
          id: 'watch',
          label: 'The overnight rate starts twitching where the buffer is gone',
          detail: 'Repo pressure is the first symptom, not a reserve number',
        },
        {
          id: 'stop',
          label: 'That central bank stops, and the other carries on',
          detail: 'Same instrument, different stopping point',
        },
      ],
      correctOrder: ['runoff', 'buffers', 'exhausted', 'watch', 'stop'],
      explanation:
        'Neither institution decided a target size for its balance sheet and shrank to it. Both shrank until the money market told them to stop, and the money markets are differently plumbed — which is why the answer arrived years apart.',
    },

    {
      id: 'mc-read-both',
      type: 'multiple_choice',
      tags: ['diagnosis', 'ecb', 'fed'],
      xp: 20,
      prompt:
        'A headline reads: "Central bank balance sheet swells past €6 trillion". Before believing anything, what do you check first?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'gold',
          label: 'Whether the increase is gold revaluation rather than anything bought',
        },
        {
          id: 'rates',
          label: 'What the policy rate did that week',
          feedback:
            'Worth knowing, but it does not tell you what moved on the sheet. A revaluation quarter can add a hundred billion with no policy decision behind it at all.',
        },
        {
          id: 'gdp',
          label: 'The size relative to euro area GDP',
          feedback:
            'A ratio to GDP tells you about scale over years. It cannot tell you what happened in the week the headline is about.',
        },
        {
          id: 'peak',
          label: 'How far it is from the 2022 peak',
          feedback:
            'That is the number the previous lesson was about, and it is the one that misleads most reliably. It is a fact about four years ago.',
        },
      ],
      correctOptionId: 'gold',
      explanation:
        'The Eurosystem revalues gold and foreign currency at every quarter end, and it holds €1.23tn of gold. A single quarterly revaluation can move total assets by more than a year of bond run-off — with nothing bought, nothing sold, and no policy behind it. The first question about any move in this balance sheet is which line moved.',
    },
  ],
  keyTakeaways: [
    'Distance from a peak is history. Direction over the last year is policy.',
    'The Fed stopped shrinking in December 2025; the Eurosystem was still shrinking through 2026.',
    'The same words — reserves, the floor, lending — name different things at the two institutions.',
    'On the euro side, always check whether a move is a purchase or a gold revaluation.',
  ],
});
