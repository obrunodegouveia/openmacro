import { defineLesson } from '../../schema';

/**
 * A case study of the module's ideas, in a currency that floats: the
 * Colombian peso from November 2025 to November 2026.
 *
 * The figures are rounded from press reports of the official reference rate
 * (TRM) and of Banco de la República's decisions, checked against each
 * other on 12 November 2026:
 *
 *   - about 3,750 pesos per dollar on 11 November 2025;
 *   - about 3,680 at the end of May 2026, before the first round of the
 *     presidential election (31 May; runoff 21 June);
 *   - about 3,150 in early August, the strongest in roughly seven years;
 *   - about 3,300 on 11 November 2026.
 *   - Policy rate: 9.25% in December 2025, raised in steps to 12.25% by
 *     September 2026, against rising inflation; held in October.
 *   - Record remittances, strong oil and coal exports, and a weaker dollar
 *     worldwide through most of the year.
 *
 * Kept to round numbers on purpose: the lesson is about how to read the
 * move, not about the third digit of a rate. Update the numbers, not the
 * reasoning, if they are revised.
 */
export const thePesosYearLesson = defineLesson({
  id: 'the-pesos-year',
  title: 'The Peso’s Year',
  subtitle:
    'The dollar lost about an eighth of its value in Colombian pesos in a year. Most of it went in ten weeks.',
  icon: '🇨🇴',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-how-much',
      type: 'multiple_choice',
      tags: ['exchange-rates', 'emerging-markets'],
      xp: 30,
      prompt:
        'A dollar cost about 3,750 Colombian pesos in November 2025 and about 3,300 a year later. How much more is a peso worth in dollars?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'fourteen',
          label: 'About 14%',
        },
        {
          id: 'twelve',
          label: 'About 12%',
          feedback:
            'That is how much the dollar lost in pesos: 450 out of 3,750. Turn the rate around. A peso bought 1/3,750 of a dollar and now buys 1/3,300, which is 3,750 ÷ 3,300 ≈ 1.136.',
        },
        {
          id: 'four-fifty',
          label: '450%',
          feedback:
            'The 450 is a change in pesos per dollar, not a percentage. Divide it by where it started.',
        },
        {
          id: 'none',
          label: 'Nothing; a peso is still a peso',
          feedback:
            'Inside Colombia, yes. But anything priced in dollars — an imported phone, a dollar debt, a barrel of oil — now costs fewer pesos.',
        },
      ],
      correctOptionId: 'fourteen',
      explanation:
        'Exchange rates are quoted as pesos per dollar, so a falling number means a stronger peso. That trips people up twice: the number goes down when the currency goes up, and the two percentages are not the same. The dollar fell 12% in pesos; the peso rose about 14% in dollars. At its strongest, around 3,150 in August, the peso had gained about 19% on the year before.',
    },
    {
      id: 'mc-carry',
      type: 'multiple_choice',
      tags: ['carry-trade', 'interest-rates'],
      xp: 35,
      prompt:
        'Through 2026 Banco de la República raised its policy rate from 9.25% to 12.25%, while a yen could be borrowed at around 1%. What does a carry trade bet on?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'not-fall',
          label: 'That the peso will not fall by more than the interest gap',
        },
        {
          id: 'rise',
          label: 'That the peso will rise',
          feedback:
            'A rise is a bonus. The trade already wins if the peso merely holds still, because the investor keeps the difference in interest.',
        },
        {
          id: 'inflation',
          label: 'That Colombian inflation will fall',
          feedback:
            'The investor cares about inflation only through what it does to the currency and the central bank. The bet itself is on the exchange rate.',
        },
        {
          id: 'riskless',
          label: 'Nothing: the interest gap is a free profit',
          feedback:
            'If it were free everyone would do it until the gap closed. The gap is payment for the risk that the peso drops faster than the interest comes in.',
        },
      ],
      correctOptionId: 'not-fall',
      explanation:
        'Borrow where money is cheap, convert, lend where it is dear. With an eleven-point gap, the peso can fall about eleven percent in a year before the investor loses money. The more investors do it, the more pesos they buy, and the stronger the peso gets — which makes the trade look even better. It also means the money can leave just as fast: a carry trade unwinds when the currency starts to fall, which is when the country needs the money most. That is the surge from the previous lesson, from the other side.',
    },
    {
      id: 'match-dollars-in',
      type: 'concept_match',
      tags: ['balance-of-payments', 'emerging-markets'],
      xp: 30,
      prompt:
        'Every peso bought with a dollar strengthens the peso. Four places those dollars came from in 2026.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'remittances',
          term: 'Remittances',
          definition: 'Colombians working abroad sending wages home; a record year',
        },
        {
          id: 'exports',
          term: 'Oil and coal exports',
          definition: 'Sold in dollars, and converted to pay wages and taxes in pesos',
        },
        {
          id: 'portfolio',
          term: 'Portfolio inflows',
          definition: 'Foreign investors buying peso bonds for the high rate',
        },
        {
          id: 'global',
          term: 'A weaker dollar worldwide',
          definition: 'The dollar falling against most currencies, not only the peso',
        },
      ],
      explanation:
        'An exchange rate is a price, and like any price it moves when more people want to buy than sell. The first two are slow and steady: they are why the peso had support all year. The third is fast and fickle. The fourth is not about Colombia at all, which is the trap in reading a currency: part of what looks like a judgement on a country is a judgement on the dollar.',
    },
    {
      id: 'mc-timing',
      type: 'multiple_choice',
      tags: ['exchange-rates', 'expectations'],
      xp: 35,
      prompt:
        'The rate was about 3,750 in November 2025 and still about 3,680 at the end of May. By early August it was about 3,150. What does the timing tell you?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'trigger',
          label: 'Something changed in those weeks; the slow causes were there all along',
        },
        {
          id: 'remittances',
          label: 'Remittances must have doubled over the summer',
          feedback:
            'Remittances were at records all year, including the months when the peso barely moved. A cause that was present before and after cannot explain a jump in between.',
        },
        {
          id: 'nothing',
          label: 'Nothing: currencies move at random',
          feedback:
            'Day to day they nearly do. But a move of about 15% in ten weeks, lining up with a known event, is worth asking about.',
        },
        {
          id: 'rates',
          label: 'The rate rises finally worked through',
          feedback:
            'Part of the story, since the rate was raised again in June. But most of the rises had come earlier, while the peso stood still.',
        },
      ],
      correctOptionId: 'trigger',
      explanation:
        'The weeks in question held a presidential election: a first round on 31 May and a runoff on 21 June, won narrowly by the pro-business candidate. The peso jumped the day after the first round. High rates, remittances and exports were the dry wood; the election was the match. Markets price expectations, so the move came when the odds changed, not when any policy did. That also cuts the other way: a rally built on expectations is only as firm as the expectations.',
    },
    {
      id: 'order-strong-peso',
      type: 'order_flow',
      tags: ['exchange-rates', 'trade'],
      xp: 35,
      prompt: 'Follow a stronger peso from the exchange rate to a coffee farm.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'inflow', label: 'Dollars flow in and buy pesos' },
        { id: 'stronger', label: 'The peso strengthens', detail: 'About 3,750 to about 3,150' },
        { id: 'fewer', label: 'Each dollar of coffee sold abroad brings fewer pesos' },
        { id: 'squeeze', label: 'Wages and costs, paid in pesos, do not fall' },
        { id: 'margin', label: 'Exporters’ margins shrink' },
      ],
      correctOrder: ['inflow', 'stronger', 'fewer', 'squeeze', 'margin'],
      explanation:
        'A strong currency is good news for anyone who buys abroad — imports, travel, a dollar loan — and bad news for anyone who sells abroad and pays bills at home. Colombian coffee, flower and oil producers took the second side in 2026. From 3,750 to 3,150 pesos per dollar, the same sales bring in 16% fewer pesos. Neither side is the "real" economy; a central bank watching the exchange rate is choosing whom to listen to.',
    },
    {
      id: 'mc-reversal',
      type: 'multiple_choice',
      tags: ['exchange-rates', 'inflation'],
      xp: 35,
      prompt:
        'By November 2026 the dollar was back near 3,300, with Colombian inflation rising and the dollar firming worldwide. Which reading fits best?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'margin',
          label: 'The fast money needs a reason to stay, and the reasons are thinning',
        },
        {
          id: 'crash',
          label: 'A sudden stop has begun',
          feedback:
            'Giving back a quarter of a big gain is not a stop. A sudden stop is a currency falling fast enough to break balance sheets, and the peso is still much stronger than a year earlier.',
        },
        {
          id: 'rates-fail',
          label: 'High rates never support a currency',
          feedback:
            'They supported it for most of the year. What they cannot do is outweigh everything else: inflation eats the real return, and a stronger dollar pulls money home.',
        },
        {
          id: 'exporters',
          label: 'Exporters were right, so the peso fell back',
          feedback:
            'Exporters’ complaints do not move the rate. Flows do.',
        },
      ],
      correctOptionId: 'margin',
      explanation:
        'A carry investor watches the real return, not the headline rate: 12.25% with inflation rising is worth less than 12.25% with inflation falling, and analysts already expect cuts. Add a dollar that is firming worldwide and the expected gain shrinks while the risk does not. The slow dollars — remittances, exports — keep arriving either way. That is why the peso is still far stronger than a year ago, and why the part that came from fast money is the part that can leave.',
    },
  ],
  keyTakeaways: [
    'Pesos per dollar falling means a stronger peso; the two percentages differ.',
    'High rates attract carry money, which strengthens the peso and can leave as fast.',
    'Slow causes give a currency support; news decides when it moves.',
    'A strong currency helps importers and hurts exporters at the same moment.',
  ],
});
