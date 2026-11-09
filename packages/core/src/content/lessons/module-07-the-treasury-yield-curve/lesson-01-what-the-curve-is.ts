import { defineLesson } from '../../schema';

/**
 * The Treasury par yield curve as published for 3 September 2026 (FRED:
 * DGS1MO through DGS30):
 *
 *   1M 3.83 · 3M 3.89 · 6M 3.95 · 1Y 4.11 · 2Y 4.34 · 3Y 4.41
 *   5Y 4.52 · 7Y 4.63 · 10Y 4.77 · 20Y 5.25 · 30Y 5.25
 *
 * The federal funds target range was 3.50–3.75% and interest on reserves
 * 3.65%.
 */
export const whatTheCurveIsLesson = defineLesson({
  id: 'what-the-yield-curve-is',
  title: 'A Price for Every Length of Time',
  subtitle:
    'The same borrower, eleven maturities, eleven different rates. Here is what the differences mean.',
  icon: '📐',
  difficulty: 'core',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-same-borrower',
      type: 'multiple_choice',
      tags: ['yield-curve', 'treasuries'],
      xp: 15,
      prompt:
        'On 3 September 2026 the Treasury paid 3.83% to borrow for a month and 5.25% to borrow for thirty years. Same borrower, same currency. Why the difference?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'credit',
          label: 'Lending for thirty years is riskier because the Treasury might default',
          feedback:
            'The default risk is the same borrower at both ends. If the market doubted repayment in thirty years it would doubt it in a month too — and the curve would not be smooth.',
        },
        {
          id: 'expect-plus-premium',
          label: 'It prices what short rates are expected to average, plus compensation for the uncertainty',
        },
        {
          id: 'supply',
          label: 'The Treasury issues more thirty-year bonds than bills',
          feedback:
            'The opposite is true — bills are by far the larger share of issuance. Supply does affect the shape, but it cannot be the main story when the bigger supply carries the lower yield.',
        },
        {
          id: 'inflation-only',
          label: 'Purely because inflation will be higher in thirty years',
        },
      ],
      correctOptionId: 'expect-plus-premium',
      explanation:
        'A thirty-year yield is roughly two things added together: what the market thinks overnight rates will average over thirty years, and the extra it demands for being locked in while that guess could be wrong. The second part is the term premium, and separating the two is most of the work in reading a curve.',
    },

    {
      id: 'match-tenors',
      type: 'concept_match',
      tags: ['yield-curve', 'treasuries'],
      xp: 20,
      prompt: 'Match each part of the curve to what it is mostly telling you.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'bills',
          term: '1 to 6 months',
          definition:
            'Where the Fed is right now — 3.83% to 3.95%, against a 3.50–3.75% target range',
        },
        {
          id: 'twos',
          term: '2 years',
          definition:
            'The market’s bet on the whole coming rate cycle, at 4.34%',
        },
        {
          id: 'tens',
          term: '10 years',
          definition:
            'The benchmark everything else is priced off, at 4.77%',
        },
        {
          id: 'thirties',
          term: '30 years',
          definition:
            'Almost pure term premium and inflation compensation, at 5.25%',
        },
      ],
      explanation:
        'The front end is a Fed watch: it barely reflects an opinion, because the Fed sets it. The long end is an opinion about everything — inflation, deficits, who will be buying — and almost no opinion about next month. That is why the two ends can move in opposite directions on the same day.',
    },

    {
      id: 'mc-front-end-above',
      type: 'multiple_choice',
      tags: ['yield-curve', 'policy'],
      xp: 20,
      prompt:
        'The 3-month bill yielded 3.89% while the fed funds target range topped out at 3.75%. How can a Treasury bill pay more than the Fed’s own ceiling?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'arbitrage',
          label: 'It cannot — one of the two numbers must be wrong',
          feedback:
            'Both are published daily and both are right. The target range applies to overnight lending between banks; a three-month bill is a different instrument over a different horizon.',
        },
        {
          id: 'expectations-supply',
          label: 'A three-month bill spans three months, and can price hikes or heavy bill supply',
        },
        {
          id: 'risk',
          label: 'Bills carry credit risk that overnight lending does not',
          feedback:
            'A Treasury bill is the safest dollar asset there is — safer than an unsecured overnight loan to a bank. Credit is not what puts fourteen basis points on it.',
        },
        {
          id: 'tax',
          label: 'Bills are taxed differently',
        },
      ],
      correctOptionId: 'expectations-supply',
      explanation:
        'A bill maturing in December has to price whatever the Fed does between now and December, and whatever it takes to place the volume the Treasury is selling. Fourteen basis points over the top of the range is a small statement, but it is a statement: the market is not expecting the next move to be down.',
    },

    {
      id: 'mc-flat-long-end',
      type: 'multiple_choice',
      tags: ['yield-curve', 'term-premium'],
      xp: 15,
      prompt:
        'The 20-year and the 30-year both yielded 5.25% — the curve is flat across its last decade. What does that flat stretch say?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'no-info',
          label: 'That nobody has an opinion about the 2050s',
          feedback:
            'Closer than it sounds, but too strong. The flatness says the *extra* compensation for another ten years is nil — not that there is no view at all.',
        },
        {
          id: 'no-extra-premium',
          label: 'Lenders want no additional compensation for the extra ten years of risk',
        },
        {
          id: 'cuts-coming',
          label: 'Rate cuts are expected in the 2040s',
          feedback:
            'A flat segment is consistent with almost any path that averages out the same. Reading a specific decade’s policy out of it is more than the data supports.',
        },
        {
          id: 'illiquid',
          label: 'The 20-year is illiquid and its yield is unreliable',
        },
      ],
      correctOptionId: 'no-extra-premium',
      explanation:
        'Term premium is not linear in maturity — it builds fastest over the first few years and flattens out. Once you have accepted thirty years of uncertainty, the marginal decade adds little. The interesting number here is not the flatness but the level: 5.25% at the long end against 4.77% at ten years is a steep 10s30s, and that segment is where deficits and issuance show up.',
    },

    {
      id: 'mc-no-premium-world',
      type: 'multiple_choice',
      tags: ['yield-curve', 'term-premium'],
      xp: 15,
      prompt:
        'Imagine lenders expect the overnight rate to stay at 3.65% for the next ten years, and they ask nothing extra for locking their money away. Where would the 10-year yield sit?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'at-expected',
          label: 'Close to 3.65%, the rate they expect on average',
        },
        {
          id: 'at-actual',
          label: 'At 4.77%, where it was on 3 September 2026',
          feedback:
            'That was the real yield, and it was higher than 3.65%. The gap is the extra that real lenders asked for, plus any rise in rates they expected. In this imagined world both are zero.',
        },
        {
          id: 'at-thirty',
          label: 'At 5.25%, because ten years is always a long time',
          feedback:
            'Time only adds to the yield through those two parts. Take away the expected rise and the extra for uncertainty, and a long loan costs the same as rolling short ones.',
        },
        {
          id: 'at-zero',
          label: 'Near zero, because no premium means no yield',
          feedback:
            'The premium is only the extra part. Lenders still want the overnight rate they could earn by lending one night at a time.',
        },
      ],
      correctOptionId: 'at-expected',
      explanation:
        'A long yield is built from two parts: the average short rate lenders expect over the life of the bond, and a term premium for the risk that the guess is wrong. With a flat expected path and no premium, the ten-year equals that path. The real 4.77% sat above the 3.65% reserve rate, and that gap is what the two parts add up to.',
    },

    {
      id: 'mc-premium-moves-alone',
      type: 'multiple_choice',
      tags: ['yield-curve', 'term-premium'],
      xp: 20,
      prompt:
        'Nobody changes their view of what the Fed will do. But investors grow more worried about future inflation and large deficits. What happens to the curve?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'front-falls',
          label: 'Bill yields fall while long yields stay the same',
          feedback:
            'Bills follow the Fed, and the view of the Fed did not change. Nothing here pushes the front end down.',
        },
        {
          id: 'long-rises',
          label: 'Long yields rise while bill yields hardly move',
        },
        {
          id: 'all-same',
          label: 'Nothing moves, because the expected Fed path is the same',
          feedback:
            'The expected path is only one of the two parts. The worry raises the other part, the term premium, and that is enough to move long yields.',
        },
        {
          id: 'all-rise-equally',
          label: 'Every yield rises by the same amount, from one month to thirty years',
          feedback:
            'The worry is about the long run, so it adds little to a one-month bill. The extra pay grows with how long the money is locked away.',
        },
      ],
      correctOptionId: 'long-rises',
      explanation:
        'More worry about the long run means lenders want more pay for being locked in, so the term premium rises. The premium is tiny for a one-month bill and large for a thirty-year bond, so the long end rises and the curve gets steeper. This is how two curves with the same Fed forecast can look very different.',
    },

    {
      id: 'match-two-parts',
      type: 'concept_match',
      tags: ['yield-curve', 'treasuries', 'term-premium'],
      xp: 20,
      prompt: 'Match each idea to what it means for a long Treasury yield.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'expected-path',
          term: 'Expected short rates',
          definition: 'What lenders think the overnight rate will average over the life of the bond',
        },
        {
          id: 'term-premium',
          term: 'Term premium',
          definition: 'The extra pay for being locked in while that guess could turn out wrong',
        },
        {
          id: 'one-borrower',
          term: 'One borrower',
          definition: 'Why the risk of not being repaid cannot explain the gap between maturities',
        },
        {
          id: 'one-month',
          term: 'The 1-month bill',
          definition: 'Almost no premium at all: one month leaves little room for surprise',
        },
      ],
      explanation:
        'Every point on the curve is the same borrower, so the gaps between maturities come from time alone. Time works through two channels: where short rates are expected to go, and how much lenders charge for not knowing. Short bills carry almost only the first; long bonds carry a lot of both.',
    },

    {
      id: 'mc-two-year-above',
      type: 'multiple_choice',
      tags: ['yield-curve', 'policy'],
      xp: 20,
      prompt:
        'On 3 September 2026 the 2-year yielded 4.34%, while reserves at the Fed earned 3.65%. What does that gap mostly tell you?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'cuts-soon',
          label: 'The market expects big rate cuts over the next two years',
          feedback:
            'If deep cuts were expected, the 2-year would sit below today’s rate, not above it. A yield above the policy rate points the other way.',
        },
        {
          id: 'default-risk',
          label: 'The Treasury might not repay a two-year loan',
          feedback:
            'The same Treasury borrows for one month at 3.83%. Credit risk is the same at every maturity, so it cannot explain this gap.',
        },
        {
          id: 'no-cuts',
          label: 'Lenders do not expect rates to fall on average, and add a small premium',
        },
        {
          id: 'fed-sets-it',
          label: 'The Fed sets the 2-year yield directly at 4.34%',
          feedback:
            'The Fed sets only the overnight rate, through the reserve rate and its target range. The 2-year is traded in the market and set by what lenders expect.',
        },
      ],
      correctOptionId: 'no-cuts',
      explanation:
        'Two years is short enough that the term premium is small, so the 2-year is mostly a forecast of the Fed. Sitting about 0.7 points above the reserve rate, it says the market expected rates to hold or rise, not to be cut. The Fed sets only the overnight rate; the 2-year is the market’s bet on what comes next.',
    },
  ],
  keyTakeaways: [
    'A yield curve is one borrower quoted at many maturities — the differences are about time, not credit.',
    'A long yield is expected average short rates plus a term premium for the uncertainty.',
    'The front end tracks the Fed; the long end prices inflation, deficits and who is buying.',
    'The 3-month bill can sit above the funds target, and a flat 20s30s means no extra premium for the last decade.',
  ],
});
