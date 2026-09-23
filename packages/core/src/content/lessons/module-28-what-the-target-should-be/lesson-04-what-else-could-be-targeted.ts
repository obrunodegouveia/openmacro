import { defineLesson } from '../../schema';

/**
 * The alternatives. A governor should be able to say what else was available
 * and why it was not chosen, including for the country they are actually in.
 */
export const whatElseCouldBeTargetedLesson = defineLesson({
  id: 'what-else-could-be-targeted',
  title: 'The Alternatives, and Who They Suit',
  subtitle:
    'Inflation targeting won the argument. It did not win it everywhere, and the places that chose otherwise had reasons.',
  icon: '🧭',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'match-regimes',
      type: 'concept_match',
      tags: ['framework', 'regimes'],
      xp: 35,
      prompt: 'Four nominal anchors. Match each to the country it suits.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'inflation',
          term: 'Inflation target',
          definition: 'A large or diversified economy with a credible institution and a floating rate',
        },
        {
          id: 'peg',
          term: 'Exchange rate peg',
          definition: 'Small, very open, trade concentrated on one partner, willing to import its policy',
        },
        {
          id: 'aggregate',
          term: 'Money growth target',
          definition: 'Needs a stable relationship between money and prices, which stopped holding',
        },
        {
          id: 'ngdp',
          term: 'Nominal GDP target',
          definition: 'Splits supply shocks automatically, and asks the public to follow a revised statistic',
        },
      ],
      explanation:
        'The second is the one most often dismissed and most often correct. A peg is not a primitive arrangement a country graduates out of — for a small open economy whose trade is concentrated on one partner, importing that partner’s monetary policy may genuinely beat running your own, and the whole apparatus of committees and forecasts becomes unnecessary overhead. What the peg costs is the ability to respond to a shock that hits you and not your anchor, which is the case Module 16 works through in detail.',
    },
    {
      id: 'mc-ngdp',
      type: 'multiple_choice',
      tags: ['framework', 'nominal-gdp'],
      xp: 40,
      prompt: 'What is the genuine attraction of targeting nominal GDP rather than inflation?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'splits',
          label: 'A supply shock splits between prices and output automatically',
        },
        {
          id: 'growth',
          label: 'It makes the central bank responsible for growth',
          feedback:
            'It makes it responsible for nominal spending, which is not real growth. Confusing the two is how the idea gets misrepresented in both directions.',
        },
        {
          id: 'simple',
          label: 'It is simpler to explain',
          feedback:
            'It is considerably harder — one of the strongest objections is that nobody experiences nominal GDP, whereas everybody experiences prices.',
        },
        {
          id: 'stable',
          label: 'Nominal GDP is more stable than inflation',
          feedback:
            'It is not, and stability of the target variable is not what a framework is for. The attraction is in how it responds to a particular kind of shock.',
        },
      ],
      correctOptionId: 'splits',
      explanation:
        'Under an inflation target a supply shock forces a choice: tighten and deepen the output loss, or look through it and risk the anchor. A nominal GDP target makes the trade automatically — if output falls, the framework tolerates more inflation, by construction, with no discretionary judgement and no accusation of going soft. That is a real advantage and 2022 was the best argument for it in forty years. Against it: the target is a statistic published with a lag and revised for years, nobody outside the profession has an intuition for it, and the transition from a thirty-year anchor costs what the previous lesson described.',
    },
    {
      id: 'mc-dual-mandate',
      type: 'multiple_choice',
      tags: ['framework', 'mandate'],
      xp: 35,
      prompt:
        'The Fed has a dual mandate; the ECB has a hierarchical one. In practice, how much does the difference change decisions?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'little',
          label: 'Less than it appears — a flexible horizon does most of the same work',
        },
        {
          id: 'lot',
          label: 'A great deal — the Fed tolerates much higher inflation',
          feedback:
            'The two institutions’ inflation records over thirty years are close. A difference that large would be visible in the data and is not.',
        },
        {
          id: 'crisis',
          label: 'Only in a crisis',
          feedback:
            'Crises are when both take employment seriously regardless of wording. The interesting question is what happens in normal times.',
        },
        {
          id: 'legal',
          label: 'It is purely legal wording with no operational content',
          feedback:
            'It has real content in accountability and in what each must justify. The point is that the operational gap is narrower than the legal gap.',
        },
      ],
      correctOptionId: 'little',
      explanation:
        'A hierarchical mandate that permits a medium-term horizon lets a committee take the slower path back to target when unemployment is high — which is what a dual mandate does explicitly. The gap is in accountability rather than in behaviour: the Fed must explain its employment record, the ECB must explain why its horizon was the right one. That said, the wording binds at the extreme. A hierarchical mandate makes it much harder to justify tolerating an inflation overshoot for employment reasons alone, and a governor who wants that flexibility should seek it in the horizon, because it will not be found in the statute.',
    },
    {
      id: 'mc-which-for-you',
      type: 'multiple_choice',
      tags: ['framework', 'emerging-markets'],
      xp: 35,
      prompt:
        'You are advising a small open economy with high pass-through, a short history of price stability and dollarised deposits. Which anchor?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'exchange',
          label: 'Something anchored to the exchange rate, until the conditions for a float exist',
        },
        {
          id: 'inflation',
          label: 'Inflation targeting, as the modern standard',
          feedback:
            'It requires a credible institution, a functioning transmission mechanism and a public that believes the target. Adopting the form without the preconditions produces a target that is missed and a framework that is discredited.',
        },
        {
          id: 'ngdp',
          label: 'Nominal GDP targeting, for the shock-splitting property',
          feedback:
            'It needs reliable and timely national accounts. In an economy where GDP is revised for years, the target would not be observable when decisions are taken.',
        },
        {
          id: 'money',
          label: 'A money growth target, as a transitional anchor',
          feedback:
            'It was the standard advice for decades and it depends on a stable money-price relationship, which is least reliable in economies undergoing financial deepening.',
        },
      ],
      correctOptionId: 'exchange',
      explanation:
        'With pass-through above 0.7, the exchange rate is the price level to a first approximation — so anchoring the currency anchors inflation directly, without needing a transmission mechanism that may not work or a credibility you have not yet built. The honest framing is that this is a stage rather than a destination: the peg or crawl buys stability while you build what a float requires — a deep local-currency bond market, institutional independence in practice rather than statute, and a track record. Several countries have made that journey. The failures were mostly countries that tried to skip to the end.',
    },
  ],
  keyTakeaways: [
    'A peg is the right answer for some economies, not a stage before a real framework.',
    'Nominal GDP splits supply shocks automatically, at the cost of a target nobody experiences.',
    'Dual and hierarchical mandates differ more in accountability than in behaviour.',
    'Inflation targeting has preconditions; adopting the form without them discredits it.',
  ],
});
