/**
 * ============================================================================
 * Module 3 · Lesson 9 — "Talking as an instrument"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to explain why long rates depend on the expected
 * path of short rates, and therefore why a credible statement about the future
 * moves borrowing costs today without any transaction.
 *
 * Sources / further reading for reviewers:
 *   - Woodford, "Methods of Policy Accommodation at the Interest-Rate Lower
 *     Bound" (Jackson Hole, 2012).
 *   - The Fed's calendar-based, then threshold-based, then outcome-based
 *     guidance formulations, 2011–2020.
 *
 * A note on rigour: guidance can be Delphic (a forecast) or Odyssean (a
 * commitment). Only the second binds, and the difference is the whole reason
 * central banks agonise over wording. The lesson keeps that distinction
 * explicit without using the jargon.
 */

import { defineLesson } from '../../schema';

export const forwardGuidanceLesson = defineLesson({
  id: 'forward-guidance',
  title: 'Talking as an Instrument',
  subtitle: 'Long rates are a forecast of short rates — so changing the forecast changes them today.',
  icon: '🗣️',
  difficulty: 'advanced',
  estimatedMinutes: 7,
  hearts: 3,

  keyTakeaways: [
    'A ten-year rate is roughly the average short rate expected over ten years, plus a premium.',
    'So a credible statement about future policy moves long rates now, without any purchase.',
    'Guidance that merely forecasts is weak; guidance that commits is powerful and hard to escape.',
    'The escape is the problem: a promise that binds when conditions change is a promise you must break or regret.',
  ],

  challenges: [
    {
      id: 'mc-long-rate-composition',
      type: 'multiple_choice',
      tags: ['expectations', 'yield-curve'],
      xp: 15,
      prompt: 'The overnight rate is 3%. Why might the ten-year yield be 4%?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'risk',
          label: 'Ten-year lending is riskier',
          feedback:
            'Government bonds carry no meaningful default risk in their own currency. What differs is exposure to rate changes and inflation over a longer horizon.',
        },
        {
          id: 'expectations',
          label: 'Markets expect short rates to average above 3%, plus compensation for the uncertainty',
        },
        {
          id: 'supply',
          label: 'The government issues more ten-year bonds',
          feedback:
            'Supply does affect yields at the margin, which is what QE exploits. But it is a second-order effect next to the expected path of policy.',
        },
        {
          id: 'inflation-only',
          label: 'It is purely an inflation forecast',
          feedback:
            'Expected inflation is embedded in expected short rates, so it matters — but the yield is about the whole expected policy path, not inflation alone.',
        },
      ],
      correctOptionId: 'expectations',
      explanation:
        'A ten-year bond competes with rolling an overnight deposit for ten years, so its yield must be close to the expected average of those overnight rates, plus a term premium for bearing the uncertainty. This is the mechanism that makes talking an instrument: a central bank cannot set the ten-year rate directly, but it can change what people expect the overnight rate to be — and that is most of the ten-year rate.',
    },

    {
      id: 'order-guidance-transmission',
      type: 'order_flow',
      tags: ['expectations', 'transmission'],
      xp: 20,
      prompt: 'A central bank says rates will stay low for years. Trace the effect.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'statement',
          label: 'The committee commits to holding rates until conditions are met',
          detail: 'No transaction of any kind takes place',
        },
        {
          id: 'revise',
          label: 'Markets revise down the expected path of short rates',
          detail: 'The average that long yields are built on has moved',
        },
        {
          id: 'longrates',
          label: 'Long-term yields fall',
          detail: 'Mechanically, since they are that average plus a premium',
        },
        {
          id: 'borrowing',
          label: 'Mortgage and corporate borrowing costs fall with them',
          detail: 'These are priced off the long end, not off the overnight rate',
        },
        {
          id: 'activity',
          label: 'Borrowing and investment pick up',
          detail: 'The point of the exercise',
        },
      ],
      correctOrder: ['statement', 'revise', 'longrates', 'borrowing', 'activity'],
      explanation:
        'Nothing was bought or sold anywhere in this chain. That is why guidance became central when policy rates hit zero: the overnight rate could not go lower, but the *expected path* still could, and long rates responded. It is also why central bank communication became so heavily lawyered — at that point the words were the policy.',
    },

    {
      id: 'mc-commitment-vs-forecast',
      type: 'multiple_choice',
      tags: ['expectations', 'credibility'],
      xp: 20,
      prompt: 'Which statement moves long rates more, and why?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'forecast',
          label: '"We expect rates to stay low" — because it is honest about uncertainty',
          feedback:
            'Honest, and weak. A forecast can be revised next meeting, so markets discount it accordingly.',
        },
        {
          id: 'commitment',
          label: '"We will not raise rates until unemployment falls below 6.5%" — because it binds',
        },
        {
          id: 'same',
          label: 'They are equivalent — both describe the same intention',
          feedback:
            'Markets treat them very differently, and correctly so. One is a plan; the other has a cost to abandoning.',
        },
        {
          id: 'vague',
          label: 'The vaguer statement, because it preserves flexibility',
          feedback:
            'Flexibility is exactly what weakens it. The power comes from giving some up.',
        },
      ],
      correctOptionId: 'commitment',
      explanation:
        'A forecast says what you currently expect; a commitment says what you will do even if you later wish otherwise. Only the second changes behaviour much, because only the second is costly to break. That is the whole bargain of forward guidance: you buy influence over today’s long rates by surrendering some freedom tomorrow — and the surrender must be real, or nobody pays you for it.',
    },

    {
      id: 'mc-guidance-trap',
      type: 'multiple_choice',
      tags: ['expectations', 'credibility'],
      xp: 15,
      prompt: 'Inflation surges a year after a central bank promised to hold rates low. What is the problem?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'no-problem',
          label: 'None — it simply raises rates',
          feedback:
            'It can, and it did in 2022. But it pays for it: the next commitment is worth less, because everyone has now seen one abandoned.',
        },
        {
          id: 'trap',
          label: 'Keeping the promise is now wrong, and breaking it damages the tool for next time',
        },
        {
          id: 'legal',
          label: 'It is legally bound by the guidance',
          feedback:
            'Guidance is not a contract. The constraint is reputational, which is both softer and, over time, more expensive.',
        },
        {
          id: 'markets',
          label: 'Markets will sue',
          feedback:
            'No such claim exists. Investors who positioned on the guidance lose money and remember, which is the actual sanction.',
        },
      ],
      correctOptionId: 'trap',
      explanation:
        'This is the cost the bargain always carried, arriving. The value of a commitment comes from being hard to abandon, so abandoning it is genuinely expensive — not in fines but in the price of the next promise. Several central banks moved to outcome-based language after 2021 for exactly this reason: tying guidance to observable conditions rather than dates makes it possible to change course without having broken your word.',
    },
  ],
});
