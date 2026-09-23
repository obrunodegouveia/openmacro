import { defineLesson } from '../../schema';

/**
 * The alternative to holding your own reserves: borrowing someone else's
 * currency from the institution that issues it. Which is available to some
 * countries and not others, and that asymmetry is most of the international
 * monetary system.
 */
export const theSwapLineLesson = defineLesson({
  id: 'the-swap-line',
  title: 'Reserves You Do Not Have to Own',
  subtitle:
    'A swap line is unlimited dollars from the institution that prints them. Who gets one is the most consequential list nobody voted on.',
  icon: '🔗',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'mc-what-a-swap-line-is',
      type: 'multiple_choice',
      tags: ['swap-lines', 'reserves'],
      xp: 30,
      prompt: 'What does a central bank swap line actually provide?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'lend-currency',
          label: 'Dollars, lent against the other central bank’s own currency as collateral',
        },
        {
          id: 'gift',
          label: 'A transfer of reserves from one country to another',
          feedback:
            'Nothing is transferred permanently. It is a swap: currencies are exchanged at a rate and exchanged back at the same rate, with interest. The Fed has never lost money on one.',
        },
        {
          id: 'guarantee',
          label: 'A guarantee that the exchange rate will be defended',
          feedback:
            'No rate commitment is involved. It supplies funding, which is a different thing from supporting a price.',
        },
        {
          id: 'credit-line',
          label: 'An overdraft the other central bank can draw at will',
          feedback:
            'Close, and the collateral is the point: the borrowing central bank hands over its own currency. That is what lets the lender treat the exposure as close to riskless.',
        },
      ],
      correctOptionId: 'lend-currency',
      explanation:
        'The mechanism is deliberately boring, which is why it scales. The Fed credits dollars to a foreign central bank and receives that central bank’s currency at the prevailing rate, with a binding agreement to reverse at the same rate — so there is no exchange rate risk, and the counterparty is a central bank rather than a commercial one. It is Bagehot across borders, with the currency of issue.',
    },
    {
      id: 'mc-why-it-matters',
      type: 'multiple_choice',
      tags: ['swap-lines', 'eurodollar'],
      xp: 35,
      prompt:
        'Why does a foreign central bank need dollars badly enough to build permanent arrangements for it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'offshore',
          label: 'Its banks owe dollars it cannot create',
        },
        {
          id: 'trade',
          label: 'To pay for the imports its economy depends on',
          feedback:
            'Trade is funded by exporters and importers, and it is small next to the financial flows. The problem is a banking system that borrowed short in a currency its own central bank cannot issue.',
        },
        {
          id: 'reserves',
          label: 'To add to its reserves',
          feedback:
            'Swap lines are drawn in a stress and repaid; they are not an accumulation strategy. A country that wanted more reserves would buy them.',
        },
        {
          id: 'peg',
          label: 'To defend a peg against the dollar',
          feedback:
            'They have been used that way and the main use is funding: lending dollars onward to domestic banks that cannot roll their dollar borrowing.',
        },
      ],
      correctOptionId: 'offshore',
      explanation:
        'This is the eurodollar problem from earlier in the course arriving as an operational emergency. Banks outside the United States create dollar liabilities and cannot create the dollars that settle them, so when offshore dollar funding dries up their own central bank is a lender of last resort in a currency it cannot issue. A swap line makes it one anyway — which is why the Fed ends up acting as the world’s central bank without ever having been appointed to it.',
    },
    {
      id: 'mc-who-gets-one',
      type: 'multiple_choice',
      tags: ['swap-lines', 'hierarchy'],
      xp: 35,
      prompt:
        'Standing swap lines exist between a handful of central banks. Everyone else gets temporary arrangements, a repo facility against collateral, or nothing. What does that structure create?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'hierarchy',
          label: 'A hierarchy: some countries need not self-insure and others must',
        },
        {
          id: 'fair',
          label: 'A fair reflection of which countries are creditworthy',
          feedback:
            'Creditworthiness is part of it and it is not sufficient. Several countries with strong balance sheets are outside the arrangements, and the distinction has as much to do with systemic importance to the lender as with the borrower’s quality.',
        },
        {
          id: 'temporary',
          label: 'A temporary arrangement that expires after each crisis',
          feedback:
            'The core lines were made standing in 2013 precisely so they would not have to be negotiated in an emergency. Permanence is the point.',
        },
        {
          id: 'imf',
          label: 'A substitute for the IMF',
          feedback:
            'They cover different things: swap lines are liquidity for solvent systems, programmes are for balance of payments problems with conditions. The countries outside the lines are the ones that end up needing the second.',
        },
      ],
      correctOptionId: 'hierarchy',
      explanation:
        'A country inside the network can hold fewer reserves, because it has access to the currency it needs. A country outside must buy its own insurance, pay the sterilisation cost every year, and still face a programme if the insurance proves too small. That is a real, quantifiable cost of being outside a list — and it explains the reserve accumulation of the last twenty-five years better than any argument about exchange rates does.',
    },
    {
      id: 'order-dollar-squeeze',
      type: 'order_flow',
      tags: ['swap-lines', 'crisis'],
      xp: 30,
      prompt: 'Put an offshore dollar squeeze in order, from the first sign to the resolution.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'basis', label: 'The cost of swapping local currency into dollars widens sharply', detail: 'The first and cleanest signal' },
        { id: 'hoard', label: 'Dollar lenders stop rolling over funding to foreign banks' },
        { id: 'sell', label: 'Those banks sell dollar assets to repay, driving prices down' },
        { id: 'local', label: 'Their own central bank lends out its reserves and they run low' },
        { id: 'swap', label: 'A swap line is drawn and dollars are auctioned onward to domestic banks' },
        { id: 'narrow', label: 'The swap cost narrows and the selling stops' },
      ],
      correctOrder: ['basis', 'hoard', 'sell', 'local', 'swap', 'narrow'],
      explanation:
        'The first step is the one worth memorising, because it is a price you can watch daily and it moves before anything visible happens. When it costs materially more to obtain dollars through the swap market than the interest rate differential implies, someone is paying up for dollars specifically — and that is the earliest warning of the sequence that follows. In March 2020 that measure moved days before the facilities were expanded.',
    },
  ],
  keyTakeaways: [
    'A swap line lends the currency of issue against the borrower’s own currency, with no exchange rate risk.',
    'It exists because banks outside a currency area create liabilities in a currency they cannot issue.',
    'Being inside the network means holding fewer reserves; being outside means paying to self-insure.',
    'A widening cost of swapping into dollars is the earliest signal of a squeeze.',
  ],
});
