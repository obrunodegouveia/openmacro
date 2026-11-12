import { defineLesson } from '../../schema';

/**
 * A case study of the module's ideas, in a currency that floats: the
 * Colombian peso from November 2025 to November 2026.
 *
 * The figures are rounded from the official reference rate (TRM) and from
 * Banco de la República's and DANE's published figures, checked on
 * 12 November 2026:
 *
 *   - about 3,760 pesos per dollar on 11 November 2025;
 *   - about 3,680 at the end of May 2026, before the first round of the
 *     presidential election (31 May; runoff 21 June);
 *   - about 3,130 on 31 July; the low of the year, about 3,050, on
 *     22 August;
 *   - about 3,300 on 11 November 2026, most of the rise since 1 November.
 *   - Policy rate: 9.25% in December 2025; 10.25% in January, 11.25% in
 *     March, 12% on 31 July, 12.25% from 1 October; held on 30 October.
 *     The bank's stated reasons: inflation, and household and government
 *     spending above sustainable levels.
 *   - Annual inflation (DANE): 5.51% in October 2025, 6.30% in October
 *     2026. Target 3%.
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
    'A dollar bought about 3,750 Colombian pesos a year ago and about 3,300 now. Who bought the pesos, why, and why most of it happened in two months.',
  icon: '🇨🇴',
  difficulty: 'advanced',
  estimatedMinutes: 15,
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
        'The rate is quoted as pesos per dollar, so when the number falls, the peso has got stronger. The two percentages differ because they start from different places: the dollar lost 450 of its 3,750 pesos, which is 12%, while the peso went from buying 1/3,750 of a dollar to 1/3,300, which is about 14% more. At its strongest, around 3,050 in late August, a peso was worth about 23% more than a year before.',
    },
    {
      id: 'match-dollars-in',
      type: 'concept_match',
      tags: ['balance-of-payments', 'emerging-markets'],
      xp: 30,
      prompt:
        'An exchange rate is a price. Each time someone sells dollars to buy pesos, the peso is pushed up. Match the four big sources of those dollars in 2026.',
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
        'Remittances and exports are slow and steady: they held the peso up all year. Portfolio money is fast and fickle, and it follows the interest rate, which is the next question. The weaker dollar is not about Colombia at all, and that is the trap in reading a currency: part of what looked like a verdict on Colombia was a verdict on the dollar.',
    },
    {
      id: 'mc-carry',
      type: 'multiple_choice',
      tags: ['carry-trade', 'interest-rates'],
      xp: 35,
      prompt:
        'Borrow yen at about 1%, swap them for pesos, and lend the pesos in Colombia at about 12%. That is a carry trade. What is it betting on?',
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
        'The investor earns about eleven points of interest a year, so the peso can fall about ten percent before the trade loses money. Every investor who does it buys pesos, which pushes the peso up and makes the trade look even better, so more arrive. The rate was that high because Banco de la República had raised it from 9.25% to 12.25% between December 2025 and September 2026 to fight inflation. The same money can leave as fast: a carry trade unwinds when the currency starts to fall, which is when the country needs it most. That is the surge from “Money That Arrives and Money That Leaves”, seen from the investor’s side.',
    },
    {
      id: 'mc-timing',
      type: 'multiple_choice',
      tags: ['exchange-rates', 'expectations'],
      xp: 35,
      prompt:
        'The rate was about 3,750 in November 2025 and still about 3,680 at the end of May. By the end of July it was about 3,130. What does the timing tell you?',
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
            'Day to day they nearly do. But a fall from about 3,680 to about 3,130 in two months, lining up with a known event, is worth asking about.',
        },
        {
          id: 'rates',
          label: 'The rate rises finally worked through',
          feedback:
            'The timing does not fit. The rises in January and March came while the peso stood still, and the next one, to 12%, came on 31 July, when most of the move had already happened.',
        },
      ],
      correctOptionId: 'trigger',
      explanation:
        'Those two months held a presidential election: a first round on 31 May and a runoff on 21 June, won narrowly by the candidate markets favoured. The peso jumped the day after the first round. High rates, remittances and exports were the dry wood; the election was the match. Markets price expectations, so the move came when the odds changed, not when any policy did. That also cuts the other way: a rally built on expectations is only as firm as the expectations.',
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
        { id: 'stronger', label: 'The peso strengthens', detail: 'About 3,750 to about 3,050' },
        { id: 'fewer', label: 'Each dollar of coffee sold abroad converts into fewer pesos' },
        { id: 'margin', label: 'Wages are still paid in pesos, so the farm’s margin shrinks' },
        { id: 'cut', label: 'The farm cuts costs, starting with next harvest’s hiring' },
      ],
      correctOrder: ['inflow', 'stronger', 'fewer', 'margin', 'cut'],
      explanation:
        'A strong currency is good news for anyone who buys abroad — imports, travel, a dollar loan — and bad news for anyone who sells abroad and pays bills at home. Colombian coffee, flower and oil producers took the second side in 2026. From 3,750 to 3,050 pesos per dollar, the same sales bring in almost 19% fewer pesos. Neither side is the "real" economy; a central bank watching the exchange rate is choosing whom to listen to.',
    },
    {
      id: 'mc-loan-before',
      type: 'multiple_choice',
      tags: ['interest-rates', 'inflation'],
      xp: 25,
      prompt:
        'You borrow €100 for a year at 10%, so you pay back €110. Over the year, prices rise 5%. What will that €110 buy, in today’s prices?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'about-105',
          label: 'About €105',
        },
        {
          id: 'exactly-110',
          label: '€110',
          feedback:
            'That is how many euros the bank gets. But each of them buys 5% less than today, so the €110 buys less than €110 does now.',
        },
        {
          id: 'about-115',
          label: 'About €115',
          feedback:
            'Rising prices shrink what money buys, so take inflation away rather than adding it: €110 ÷ 1.05.',
        },
        {
          id: 'exactly-100',
          label: '€100',
          feedback:
            'Only if prices rose by the full 10%. They rose 5%, so the bank still comes out ahead.',
        },
      ],
      correctOptionId: 'about-105',
      explanation:
        'The bank gets €110 back, but €110 next year buys what about €105 buys today. So the loan really cost you about 5%, not 10%: the interest rate minus inflation. That is the real interest rate. Inflation quietly pays part of every borrower’s interest, because the debt is repaid in money that is worth less.',
    },
    {
      id: 'mc-loan-after',
      type: 'multiple_choice',
      tags: ['interest-rates', 'inflation'],
      xp: 30,
      prompt:
        'Now inflation jumps to 7%, and the central bank raises the rate from 10% to 11%. You borrow €100 and pay back €111. What will that €111 buy, in today’s prices?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'about-104',
          label: 'About €104',
        },
        {
          id: 'about-106',
          label: 'About €106',
          feedback:
            'That uses last year’s 5% inflation. Prices now rise 7%: €111 ÷ 1.07.',
        },
        {
          id: 'exactly-111',
          label: '€111',
          feedback:
            'That is the number of euros. Each one buys 7% less by the time you repay.',
        },
        {
          id: 'about-118',
          label: 'About €118',
          feedback:
            'Inflation shrinks what money buys, so divide by it rather than adding it.',
        },
      ],
      correctOptionId: 'about-104',
      explanation:
        'Before, the loan really cost you about €5 in today’s money. Now it costs about €4. You pay back more euros but less value, so borrowing got cheaper, even though the rate went up. The reason: the bank added 1 point of interest, but inflation rose 2 points, so inflation now pays a bigger part of your interest than before.',
    },
    {
      id: 'sim-real-rate',
      type: 'interactive_sim',
      tags: ['interest-rates', 'inflation'],
      xp: 40,
      currency: 'EUR',
      prompt: 'You are the central bank. Inflation has risen from 5% to 7%.',
      instructions: 'Set inflation to 7%, then find the rate that makes borrowing dearer than before',
      narrative:
        'Before, the rate was 10% with 5% inflation, so a €100 loan cost about €4.76 in today’s money. Move inflation to 7%, then raise the rate until the loan costs more than that again.',
      constants: {},
      sliders: [
        {
          key: 'inflationRate',
          label: 'Inflation',
          min: 0.05,
          max: 0.07,
          step: 0.01,
          defaultValue: 0.05,
          format: 'percent',
        },
        {
          key: 'nominalRate',
          label: 'Central bank rate',
          min: 0.1,
          max: 0.14,
          step: 0.01,
          defaultValue: 0.1,
          format: 'percent',
          hint: 'Before: 10%',
        },
      ],
      readouts: [
        {
          key: 'payback',
          label: 'A €100 loan repaid, in today’s prices',
          formulaId: 'loan_real_payback',
          format: 'currency',
          emphasis: true,
          caption: 'Before: about €104.76',
        },
        {
          key: 'real',
          label: 'Real interest rate',
          formulaId: 'real_interest_rate',
          format: 'percent',
          caption: '(1 + rate) ÷ (1 + inflation) − 1',
        },
      ],
      objective: {
        description: 'With inflation at 7%, try 11%, 12% and 13%',
        requiredObservations: [
          { sliderKey: 'inflationRate', values: [0.05, 0.07] },
          { sliderKey: 'nominalRate', values: [0.11, 0.12, 0.13] },
        ],
      },
      explanation:
        'With inflation at 7%, a rate of 11% leaves the loan costing about €3.74, and even 12% only about €4.67, still a little less than before. It takes 13%, a rise of 3 points, to make borrowing dearer than it was. So when inflation rises 2 points, a central bank has to raise its rate by more than 2 just to stand still. Economists call this the Taylor principle.',
    },
    {
      id: 'mc-colombia-real-rate',
      type: 'multiple_choice',
      tags: ['interest-rates', 'inflation'],
      xp: 30,
      prompt:
        'In October 2025 Colombia’s rate was 9.25% and inflation was 5.5%. In October 2026 the rate was 12.25% and inflation was 6.3%. What happened to the real rate an investor earns on pesos?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'rose',
          label: 'It rose, from about 3.5% to about 5.6%',
        },
        {
          id: 'fell',
          label: 'It fell, because inflation went up',
          feedback:
            'Inflation did go up, by 0.8 points. But the rate went up 3 points, so the bank more than made up for it.',
        },
        {
          id: 'same',
          label: 'No change: both went up',
          feedback:
            'By very different amounts: 3 points for the rate, 0.8 for inflation.',
        },
        {
          id: 'exchange-rate',
          label: 'You cannot tell without the exchange rate',
          feedback:
            'The real rate is the rate minus inflation; the exchange rate is not part of it. It decides what the investor earns in dollars, which is the next question.',
        },
      ],
      correctOptionId: 'rose',
      explanation:
        'A year ago: 1.0925 ÷ 1.055 ≈ 1.035, a real rate of about 3.5%. Now: 1.1225 ÷ 1.063 ≈ 1.056, about 5.6%. The bank raised its rate by more than inflation rose, which is what the simulation showed it must do to make money dearer. So holding pesos paid about 2 points more after inflation, and that is a big part of why money flowed in and the peso got stronger. The risk now runs the other way: inflation is still rising and analysts expect cuts, and either one lowers the real rate.',
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
            'Giving back about a third of a big gain is not a stop. A sudden stop is a currency falling fast enough to break balance sheets, and the peso is still much stronger than a year earlier.',
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
    'A rate rise only tightens if it beats the rise in inflation: watch the real rate.',
  ],
});
