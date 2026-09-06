import { defineLesson } from '../../schema';

/**
 * Inversion history from the FRED spread series:
 *
 *   10Y−2Y  inverted 1 Apr 2022 → 5 Sep 2024, deepest −1.08 on 3 Jul 2023
 *   10Y−3M  inverted 18 Oct 2022 → 16 Oct 2025, deepest −1.89 on 4 May 2023
 *
 * On 3 September 2026 the curve was upward sloping throughout: 2s10s +43bp,
 * 3M10Y +88bp, 10s30s +48bp.
 */
export const theLongInversionLesson = defineLesson({
  id: 'the-long-inversion',
  title: 'The Inversion That Would Not End',
  subtitle:
    'The curve was upside down for years, and the two most-quoted versions of it disagreed by thirteen months.',
  icon: '🙃',
  difficulty: 'advanced',
  estimatedMinutes: 9,
  challenges: [
    {
      id: 'mc-what-inversion-is',
      type: 'multiple_choice',
      tags: ['yield-curve', 'inversion'],
      xp: 15,
      prompt:
        'An inverted curve means ten-year money costs less than three-month money. What is the market saying?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'recession-signal',
          label: 'That a recession is coming within a year',
          feedback:
            'That is the correlation people quote, and it has a real record. But it is an inference about consequences, not what the prices literally say — and this inversion outlasted every previous one without the recession arriving on schedule.',
        },
        {
          id: 'lower-later',
          label: 'That short rates will be lower on average over the next decade than they are now',
        },
        {
          id: 'demand-long',
          label: 'That investors have stopped buying long bonds',
          feedback:
            'Backwards. A low long yield means the long bond is expensive, which means people are buying it. Not buying it would push the yield up.',
        },
        {
          id: 'broken',
          label: 'That the market is mispricing and the arbitrage will close',
        },
      ],
      correctOptionId: 'lower-later',
      explanation:
        'A ten-year yield below a three-month yield says the market expects the average overnight rate over ten years to be below today’s. Since today’s is set by the Fed, an inversion is a forecast that the Fed will cut — eventually, and by enough to drag a decade’s average below the current level.',
    },

    {
      id: 'mc-which-curve',
      type: 'multiple_choice',
      tags: ['yield-curve', 'inversion'],
      xp: 20,
      prompt:
        'The 10Y−2Y spread turned positive on 6 September 2024. The 10Y−3M spread stayed inverted until 16 October 2025 — thirteen months longer. How can "the curve" un-invert twice?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'measurement',
          label: 'One of the two is measured wrongly',
          feedback:
            'Both are simple subtractions of published yields. Neither is wrong; they are answers to different questions.',
        },
        {
          id: 'different-questions',
          label: 'They compare different things: 2-year expectations versus where the Fed is today',
        },
        {
          id: 'revision',
          label: 'The data was revised later',
        },
        {
          id: 'holiday',
          label: 'Trading calendars differ between the two series',
        },
      ],
      correctOptionId: 'different-questions',
      explanation:
        'The 2-year yield is itself a forecast, so 10Y−2Y compares one forecast with another and can turn positive while policy is still tight. The 3-month bill is not a forecast — it is roughly where the Fed is standing. 10Y−3M stays inverted until the Fed has actually cut. So the first spread told you the market had changed its mind; the second told you the Fed had.',
    },

    {
      id: 'flow-inversion-lifecycle',
      type: 'order_flow',
      tags: ['yield-curve', 'inversion', 'policy'],
      xp: 25,
      prompt: 'Put the life of an inversion in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'hikes',
          label: 'The Fed raises the overnight rate quickly',
          detail: 'The front end follows within days — it has no choice',
        },
        {
          id: 'long-anchored',
          label: 'The long end refuses to follow all the way up',
          detail: 'Ten years of average rates cannot rise as far as one night of them',
        },
        {
          id: 'inverted',
          label: 'The curve inverts',
          detail: '10Y−3M reached −1.89 points in May 2023',
        },
        {
          id: 'expectations-shift',
          label: 'The 2-year starts pricing the coming cuts',
          detail: '10Y−2Y turns positive first, in September 2024',
        },
        {
          id: 'cuts',
          label: 'The Fed actually cuts, and the bill yield finally falls',
          detail: '10Y−3M turns positive in October 2025, thirteen months later',
        },
      ],
      correctOrder: ['hikes', 'long-anchored', 'inverted', 'expectations-shift', 'cuts'],
      explanation:
        'An inversion is not an event, it is a period — this one ran three years on the 3-month measure. It begins because the Fed can move the front end and cannot move the back end, and it ends the same way, in the opposite direction and in two stages.',
    },

    {
      id: 'match-shapes',
      type: 'concept_match',
      tags: ['yield-curve', 'shapes'],
      xp: 20,
      prompt: 'Match each curve shape to what usually produced it.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'normal',
          term: 'Upward sloping',
          definition:
            'The ordinary state: term premium plus no expectation of deep cuts — the curve on 3 September 2026',
        },
        {
          id: 'inverted',
          term: 'Inverted',
          definition:
            'Policy is tight now and the market expects it not to stay that way',
        },
        {
          id: 'bull-steepener',
          term: 'Bull steepener',
          definition:
            'Short yields fall faster than long ones — the shape a cutting cycle makes',
        },
        {
          id: 'bear-steepener',
          term: 'Bear steepener',
          definition:
            'Long yields rise faster than short ones — deficits, supply or an inflation scare',
        },
      ],
      explanation:
        'Steepening is two completely different events depending on which end moved. A curve can steepen because the front end collapsed in a crisis or because the long end sold off on fiscal worry, and confusing the two is the most expensive mistake available in this market.',
    },

    {
      id: 'mc-signal-value',
      type: 'multiple_choice',
      tags: ['inversion', 'forecasting'],
      xp: 20,
      prompt:
        'This inversion lasted about three years on the 10Y−3M measure — far longer than any before it. What should that do to your confidence in the recession signal?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'stronger',
          label: 'Strengthen it — a longer inversion means a worse recession is due',
          feedback:
            'There is no mechanism that makes a signal more reliable the longer it fails to arrive. That is the reasoning of someone unwilling to update.',
        },
        {
          id: 'weaken-mechanism',
          label: 'Weaken it — the mechanism it relies on was different this time',
        },
        {
          id: 'unchanged',
          label: 'Nothing — one observation cannot overturn a long record',
          feedback:
            'One observation should not overturn a record, but it should move you. Especially an observation that breaks the previous maximum by a wide margin.',
        },
        {
          id: 'invalid',
          label: 'Discard it — the indicator is broken',
        },
      ],
      correctOptionId: 'weaken-mechanism',
      explanation:
        'The traditional story is that an inversion squeezes banks, which borrow short and lend long, so credit dries up and a recession follows. But this inversion ran while banks were sitting on trillions of reserves earning interest, and while the Fed’s balance sheet still had years of run-off ahead. When the mechanism behind an indicator changes, the indicator’s record stops transferring — which is a better lesson than either believing it or discarding it.',
    },
  ],
  keyTakeaways: [
    'An inversion says the market expects average short rates to be lower than today’s, not that a recession is scheduled.',
    '10Y−2Y compares two forecasts; 10Y−3M compares a forecast with where the Fed actually is.',
    'They un-inverted thirteen months apart, in that order, and the order is not an accident.',
    'When the mechanism behind an indicator changes, its historical record stops transferring.',
  ],
});
