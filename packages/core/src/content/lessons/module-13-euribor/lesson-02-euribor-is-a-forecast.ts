import { defineLesson } from '../../schema';

/**
 * The evidence that Euribor leads the ECB rather than following it.
 *
 * Monthly averages (ECB Data Portal, FM). In June 2022 — before the ECB's
 * first hike of the cycle — 12-month Euribor was already +0.852% while
 * 3-month was still −0.239%. The 12-month peaked at 4.160% in October 2023;
 * the 3-month peaked at 3.972% in November, a month later. Both bottomed
 * around −0.5% in 2021.
 */
export const euriborIsAForecastLesson = defineLesson({
  id: 'euribor-is-a-forecast',
  title: 'It Moves Before the ECB Does',
  subtitle:
    'The longer the tenor, the more of it is a prediction. Here is that showing up in the data.',
  icon: '🔮',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-june-2022',
      type: 'multiple_choice',
      tags: ['euribor', 'expectations'],
      xp: 30,
      prompt:
        'In June 2022 the ECB had not yet raised rates. 3-month Euribor was −0.239%; 12-month Euribor was +0.852%. What was the gap saying?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'hikes-coming',
          label: 'That the market expected large hikes within the year, and had already priced them into the longer tenor',
        },
        {
          id: 'credit',
          label: 'That twelve-month bank credit risk was 109 basis points',
          feedback:
            'Credit risk is part of any Euribor, but it does not move 109 basis points while three-month credit risk stays negative. What changed was the expected policy path, and only the tenor long enough to contain it responded.',
        },
        {
          id: 'liquidity',
          label: 'That twelve-month funding was scarce',
        },
        {
          id: 'error',
          label: 'That one of the two fixings was mispriced',
          feedback:
            'Both were right. They disagree because they are answers to different questions — the average overnight rate over three months, and over twelve.',
        },
      ],
      correctOptionId: 'hikes-coming',
      explanation:
        'The ECB’s first hike came in July 2022, a month after this reading. The twelve-month tenor had been climbing for months because it has to contain whatever happens over a year, and the three-month had not because most of the hiking would happen after it matured. Euribor did not respond to the ECB. It anticipated it, and the length of the tenor decided how much anticipation fitted inside.',
    },
    {
      id: 'flow-tenor-order',
      type: 'order_flow',
      tags: ['euribor', 'expectations', 'cycle'],
      xp: 25,
      prompt: 'Put a tightening cycle in the order Euribor actually experiences it.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'expect',
          label: 'The market concludes hikes are coming',
          detail: 'Inflation data, or the ECB changing its language',
        },
        {
          id: 'long-tenor',
          label: '12-month Euribor rises first, while short tenors barely move',
          detail: 'June 2022: 12M at +0.85% with 3M still at −0.24%',
        },
        {
          id: 'ecb-moves',
          label: 'The ECB actually raises',
          detail: 'July 2022 — after the long tenor had moved',
        },
        {
          id: 'short-follows',
          label: 'Short tenors catch up as the hikes land inside their window',
          detail: '3-month has nowhere left to hide',
        },
        {
          id: 'long-peaks-first',
          label: 'The 12-month peaks first, as the market starts pricing the end',
          detail: '12M peaked October 2023, 3M in November',
        },
      ],
      correctOrder: ['expect', 'long-tenor', 'ecb-moves', 'short-follows', 'long-peaks-first'],
      explanation:
        'The last step is the one that catches people out. Once the market believes the cycle is over, the twelve-month starts pricing cuts and turns down while the three-month is still rising into the last hike. So the long tenor leads at both ends — and a borrower on twelve-month Euribor feels the turn before a borrower on three-month does, in both directions.',
    },
    {
      id: 'mc-shape-today',
      type: 'multiple_choice',
      tags: ['euribor', 'curve'],
      xp: 30,
      prompt:
        'August 2026: 1M 2.221%, 3M 2.513%, 6M 2.713%, 12M 2.954%, with the deposit rate at 2.25%. What is that shape saying?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'hikes-priced',
          label: 'That the market expects the average overnight rate to be higher over the coming year than it is now',
        },
        {
          id: 'credit-only',
          label: 'That it is entirely a term credit premium and says nothing about policy',
          feedback:
            'Credit and term premium are in there and they are real. But they are fairly stable, and they cannot explain why this curve is upward sloping now when the same curve was inverted in 2023 with the same panel of banks.',
        },
        {
          id: 'cuts',
          label: 'That cuts are expected',
          feedback:
            'That would give the opposite shape — the long tenors below the short ones, which is exactly what Euribor looked like through 2023 when the market was pricing the end of the cycle.',
        },
        {
          id: 'nothing',
          label: 'Nothing — Euribor tenors always slope upward',
          feedback:
            'They do not. In 2023 the curve was inverted, with 12-month below 3-month for months, because the market was pricing cuts that had not happened yet.',
        },
      ],
      correctOptionId: 'hikes-priced',
      explanation:
        'Read Euribor tenors as a yield curve — because that is what they are, for bank funding. An upward slope with the 1-month sitting under the deposit rate is a market saying "not much in the next month, more later". This is the same machinery as the Treasury curve module, applied over one year instead of thirty, and it is more directly useful because it is the thing your mortgage resets on.',
    },
    {
      id: 'mc-what-it-cannot-tell',
      type: 'multiple_choice',
      tags: ['euribor', 'limits'],
      xp: 25,
      prompt:
        'You want to know whether the ECB will cut at its next meeting. How much does the Euribor curve tell you?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'average-not-timing',
          label: 'It gives an average over each tenor, so it constrains the path without dating any single decision',
        },
        {
          id: 'exact',
          label: 'The 1-month rate tells you exactly what happens at the next meeting',
          feedback:
            'A one-month average blends the days before a meeting with the days after it, and meetings do not fall neatly at month ends. It narrows the possibilities; it does not date them.',
        },
        {
          id: 'nothing',
          label: 'Nothing — Euribor is backward-looking',
          feedback:
            'The previous three screens were about it moving a month ahead of the ECB. It is emphatically forward-looking.',
        },
        {
          id: 'only-with-estr',
          label: 'Nothing without €STR forwards',
        },
      ],
      correctOptionId: 'average-not-timing',
      explanation:
        'This is the honest limit of the instrument. Euribor prices an average over a window, so it can tell you that roughly 70 basis points of tightening is expected within a year without telling you whether it arrives in October or in March. Traders who need the dates use dated €STR forwards, which resolve to individual meetings. Euribor is the right tool for what a borrower cares about — the average cost over the next reset period — and the wrong one for guessing a single decision.',
    },
  ],
  keyTakeaways: [
    'Euribor anticipates the ECB: 12-month was at +0.85% a month before the first hike, with 3-month still negative.',
    'The long tenor leads at both ends — it peaked in October 2023 while the 3-month peaked in November.',
    'Read the tenors as a curve: upward slope means more expected later, inversion means cuts are priced.',
    'It prices an average over a window, so it constrains the path and cannot date a single meeting.',
  ],
});
