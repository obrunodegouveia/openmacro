import { defineLesson } from '../../schema';

/**
 * The framing lesson. "Can the United States go bankrupt?" is the wrong
 * question in a specific and useful way, and getting the right question is
 * what makes the rest of the module possible.
 */
export const whatBankruptcyWouldMeanLesson = defineLesson({
  id: 'what-bankruptcy-would-mean',
  title: 'A Country That Prints the Money It Owes',
  subtitle:
    'The United States owes thirty-something trillion dollars and can create dollars at will. Both halves of that sentence are true, which means the danger is real but it is not the one the word "bankruptcy" describes.',
  icon: '🏛️',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'mc-can-it-default',
      type: 'multiple_choice',
      tags: ['sovereign-debt', 'default'],
      xp: 35,
      prompt:
        'Can the United States be forced to miss a payment on a Treasury bond it issued in dollars?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'no-nominal',
          label: 'No — it can always create the dollars, so any default is a choice',
        },
        {
          id: 'yes-runs-out',
          label: 'Yes, once the debt is large enough that it runs out of money',
          feedback:
            'Running out of money is what happens to a household, a company, or a country that owes a currency it cannot issue. None of those describes this case, which is exactly what makes it confusing.',
        },
        {
          id: 'yes-refuse',
          label: 'Yes, if investors refuse to buy at any price',
          feedback:
            'A failed auction raises the price of borrowing; it does not stop the payment. The Treasury settles maturing bonds in dollars, and the dollars exist whether or not anyone bid today.',
        },
        {
          id: 'depends',
          label: 'It depends on the ratio of debt to GDP',
          feedback:
            'That ratio governs how painful the debt is, not whether payment is physically possible. Japan has run roughly twice the American ratio for years without missing a coupon.',
        },
      ],
      correctOptionId: 'no-nominal',
      explanation:
        'A government that borrows in a currency it issues cannot be forced into default, and the United States has in fact only ever come close to one by legislating a debt ceiling and then declining to raise it — a self-inflicted wound, not a market verdict. This is not a reason to relax. It means the constraint shows up somewhere else, and the rest of this module is about where. The question "can they pay?" has a boring answer. The question worth asking is "what does paying cost, and who pays it?"',
    },
    {
      id: 'mc-selling-bonds',
      type: 'multiple_choice',
      tags: ['sovereign-debt', 'inflation'],
      xp: 40,
      prompt:
        'The Treasury sells $100bn of new bonds to pension funds and banks. What happens to the money supply?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'nothing',
          label: 'Nothing — existing money changes hands, then gets spent back out',
        },
        {
          id: 'rises',
          label: 'It rises by $100bn, because the government now has money to spend',
          feedback:
            'The government has it because the buyers no longer do. Selling a bond moves purchasing power from a saver to the Treasury; it does not conjure any. That is the whole difference between borrowing and printing.',
        },
        {
          id: 'falls',
          label: 'It falls by $100bn while the money sits with the Treasury',
          feedback:
            'Briefly, in the sense that the Treasury General Account drains reserves until the money is spent. Within days it is spent and the effect reverses, so this is a plumbing detail rather than the answer.',
        },
        {
          id: 'doubles',
          label: 'It rises by more than $100bn through the money multiplier',
          feedback:
            'The multiplier story applies to bank lending against reserves. A bond sale to a non-bank does not create reserves at all.',
        },
      ],
      correctOptionId: 'nothing',
      explanation:
        'This is the distinction that most arguments about deficits skip. Issuing debt to willing buyers is not printing money — it is borrowing money that already exists, from someone who chose to lend it rather than spend it. Inflation does not come from the issuance; it comes from what the spending does to demand relative to what the economy can actually produce, and from whether the central bank ends up buying the debt itself. A government that borrows and builds a port has done something quite different from one that borrows and mails cheques, even though the bond auction looks identical.',
    },
    {
      id: 'match-constraints',
      type: 'concept_match',
      tags: ['sovereign-debt'],
      xp: 40,
      prompt: 'Four countries, four debts. Match each to the constraint that actually binds it.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'usa',
          term: 'United States, borrowing in dollars',
          definition: 'No default risk; the cost arrives as inflation or as crowded-out spending',
        },
        {
          id: 'argentina',
          term: 'Argentina, borrowing in dollars',
          definition: 'Genuine default risk — it must earn or buy a currency it cannot issue',
        },
        {
          id: 'italy',
          term: 'Italy, borrowing in euros',
          definition: 'Issues in a currency its own central bank does not control alone',
        },
        {
          id: 'japan',
          term: 'Japan, borrowing in yen at 250% of GDP',
          definition: 'Proof the ratio alone decides nothing, given who holds it and at what rate',
        },
      ],
      explanation:
        'The word "debt" covers four different situations here and only one of them is about solvency. Argentina can genuinely run out of dollars. Italy is the interesting middle case — the euro is its currency but not its central bank’s sole mandate, which is why 2012 happened and why the ECB eventually had to say it would act. Japan has carried a ratio nobody thought survivable for thirty years, because the debt is held domestically at rates near zero. Before asking whether a debt is too big, ask what currency it is in and who holds it.',
    },
    {
      id: 'order-postwar',
      type: 'order_flow',
      tags: ['sovereign-debt', 'history'],
      xp: 40,
      prompt: 'How a 250%-of-GDP war debt disappeared without being repaid. Put it in order.',
      instructions: 'Drag into the order it happened',
      events: [
        { id: 'war', label: 'A war is financed with borrowing, not taxation' },
        { id: 'rates', label: 'Rates are held below growth, partly by regulation' },
        { id: 'growth', label: 'Two decades of strong nominal growth follow' },
        { id: 'ratio', label: 'The ratio falls year after year while the stock does not' },
      ],
      correctOrder: ['war', 'rates', 'growth', 'ratio'],
      explanation:
        'This is financial repression, and it was deliberate: caps on deposit rates, captive domestic buyers, and restrictions on moving capital abroad kept the interest rate below nominal growth for decades. The stock of debt barely fell. The ratio collapsed. It is worth being honest that savers paid for this through returns below inflation — it was a transfer, not magic — but it is the historical answer to "how did anyone ever get out from under a debt like that", and it did not involve repayment.',
    },
    {
      id: 'mc-who-pays',
      type: 'multiple_choice',
      tags: ['sovereign-debt', 'inflation'],
      xp: 40,
      prompt:
        'If a government did cover its interest bill by having the central bank buy the debt, who ends up paying?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'holders',
          label: 'Everyone holding money or fixed payments, through inflation',
        },
        {
          id: 'taxpayers',
          label: 'Future taxpayers, who inherit a larger debt',
          feedback:
            'That is the cost of borrowing normally. In this case the debt is being extinguished with new money rather than passed on, so the bill lands somewhere else and sooner.',
        },
        {
          id: 'bondholders',
          label: 'Bondholders, who are repaid in devalued dollars',
          feedback:
            'They are among the losers, and they are not alone — anyone holding cash, a pension in payment or a fixed wage contract is hit the same way. The answer that names all of them is better.',
        },
        {
          id: 'nobody',
          label: 'Nobody — the debt simply disappears',
          feedback:
            'Nothing disappears. Real resources were transferred when the money was spent; monetising decides who gives them up, rather than whether anyone does.',
        },
      ],
      correctOptionId: 'holders',
      explanation:
        'This is the inflation tax, and it is a tax in the exact sense: an involuntary transfer from holders of money to the issuer of it. It is also the most regressive one available, because the people who hold their wealth as cash and fixed incomes are not the people who hold it as property and equities. That is why "we can always print it" is technically true and politically useless. The United States has not gone down this road, which is the point of the next four lessons — something has been doing the work instead.',
    },
  ],
  keyTakeaways: [
    'A government borrowing in its own currency cannot be forced to default.',
    'Post-war debts were outgrown rather than repaid, with savers paying quietly.',
    'The constraint is real: it arrives as inflation or as spending crowded out.',
    'Selling bonds moves existing money; it does not create any.',
    'Monetising a debt is a tax on everyone holding money, not a free lunch.',
  ],
});
