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
  estimatedMinutes: 12,
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

    {
      id: 'flow-bank-squeeze',
      type: 'order_flow',
      tags: ['inversion', 'banking', 'forecasting'],
      xp: 25,
      prompt: 'Put the classic story of why an inversion leads to a recession in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'hike',
          label: 'The Fed raises short rates',
          detail: 'Short yields climb above long ones',
        },
        {
          id: 'funding-cost',
          label: 'What banks pay to borrow short goes up',
          detail: 'Deposits and short loans follow the Fed',
        },
        {
          id: 'margin',
          label: 'Their margin on long loans shrinks',
          detail: 'Long loans pay rates set by the lower long end',
        },
        {
          id: 'lend-less',
          label: 'Banks lend less',
          detail: 'A thin margin makes new loans less worth the risk',
        },
        {
          id: 'slowdown',
          label: 'Spending and hiring slow down',
          detail: 'Less credit means less investment',
        },
      ],
      correctOrder: ['hike', 'funding-cost', 'margin', 'lend-less', 'slowdown'],
      explanation:
        'This is the mechanism behind the inversion’s record as a recession signal. Each step can be weaker or stronger in a given cycle. If one link breaks, for example because banks earn well on something else, the signal loses some of its power.',
    },

    {
      id: 'mc-first-to-turn',
      type: 'multiple_choice',
      tags: ['yield-curve', 'inversion'],
      xp: 20,
      prompt:
        'The curve is inverted and the market starts to expect the Fed to cut within a year or two, but the Fed has not cut yet. Which spread turns positive first?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'ten-two',
          label: '10Y−2Y, because the 2-year prices cuts before they happen',
        },
        {
          id: 'ten-three-month',
          label: '10Y−3M, because bills react fastest to news',
          feedback:
            'Bills track where the Fed stands today. Until the Fed actually cuts, the 3-month yield stays high and 10Y−3M stays inverted.',
        },
        {
          id: 'both-together',
          label: 'Both on the same day, because they share the 10-year',
          feedback:
            'They share the 10-year but not the other leg. In this cycle they turned positive thirteen months apart.',
        },
        {
          id: 'neither',
          label: 'Neither, until a recession has started',
          feedback:
            'The spreads follow expectations and policy, not the official date of a recession. In this cycle both turned positive without one being declared.',
        },
      ],
      correctOptionId: 'ten-two',
      explanation:
        'The 2-year is a forecast of the Fed over two years, so it falls as soon as cuts are expected. The 3-month bill moves only when the Fed moves. That is why 10Y−2Y turned positive in September 2024 and 10Y−3M only in October 2025.',
    },

    {
      id: 'match-inversion-stages',
      type: 'concept_match',
      tags: ['yield-curve', 'inversion', 'policy'],
      xp: 20,
      prompt: 'Match each stage of the 2022–2025 inversion to what the curve did.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'hiking',
          term: 'Fast hikes',
          definition: 'Short yields jumped, while the long end rose much less',
        },
        {
          id: 'deepest',
          term: 'Deepest point',
          definition: '10Y−3M reached −1.89 points in May 2023',
        },
        {
          id: 'cuts-expected',
          term: 'Cuts expected',
          definition: '10Y−2Y turned positive in September 2024',
        },
        {
          id: 'cuts-made',
          term: 'Cuts made',
          definition: '10Y−3M turned positive in October 2025',
        },
      ],
      explanation:
        'The inversion started because the Fed can push the front end but not the long end, and it ended in two steps: first the forecast changed, then the policy did. By 3 September 2026 the curve sloped upward all the way, with 3M10Y at +88 basis points.',
    },

    {
      id: 'mc-why-softer',
      type: 'multiple_choice',
      tags: ['inversion', 'forecasting', 'banking'],
      xp: 20,
      prompt:
        'The classic story says an inversion squeezes banks until they stop lending. Why was that squeeze weaker in 2022–2025?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'reserves-paid',
          label: 'Banks held large reserves that earned the Fed’s rising rate',
        },
        {
          id: 'not-inverted',
          label: 'The curve was never really inverted',
          feedback:
            'Both main spreads were inverted for years: 10Y−2Y from April 2022 and 10Y−3M from October 2022.',
        },
        {
          id: 'no-hikes',
          label: 'The Fed did not raise rates in this cycle',
          feedback:
            'It raised them fast, which is what pushed short yields above long ones in the first place.',
        },
        {
          id: 'no-deposits',
          label: 'Banks stopped taking deposits, so they had no costs',
          feedback:
            'Banks kept taking deposits, and many had to pay more on them as rates rose. The difference was on the income side, not the cost side.',
        },
      ],
      correctOptionId: 'reserves-paid',
      explanation:
        'Trillions of dollars of reserves earned interest at the Fed, and that rate rose with every hike. So a big part of bank income moved up with short rates instead of being stuck at old long rates. One link in the chain was weaker, so the signal was weaker too. The lesson is to check the mechanism, not just the record.',
    },
  ],
  keyTakeaways: [
    'An inversion says the market expects average short rates to be lower than today’s, not that a recession is scheduled.',
    '10Y−2Y compares two forecasts; 10Y−3M compares a forecast with where the Fed actually is.',
    'They un-inverted thirteen months apart, in that order, and the order is not an accident.',
    'When the mechanism behind an indicator changes, its historical record stops transferring.',
  ],
});
