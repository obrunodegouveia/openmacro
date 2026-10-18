import { defineLesson } from '../../schema';

/** Video 21. The real Federal Reserve balance sheet, 14 February 2007, read line by line. */
export const kabFedBalanceSheetLesson = defineLesson({
  id: 'kab-fed-balance-sheet',
  title: 'The Real Balance Sheet, February 2007',
  subtitle:
    '$871 billion of assets, almost all of it government debt, and $769 billion of it owed as banknotes.',
  icon: '📊',
  difficulty: 'core',
  estimatedMinutes: 17,
  video: {
    url: 'https://www.youtube.com/watch?v=MILF-9GeMDQ',
    minutes: 10,
    source: 'Khan Academy — Federal Reserve balance sheet',
  },
  challenges: [
    {
      id: 'mc-biggest-asset',
      type: 'multiple_choice',
      tags: ['central-banking', 'balance-sheet'],
      xp: 25,
      prompt:
        'In February 2007 the Federal Reserve had $871 billion of assets. What made up the overwhelming majority of them?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'treasuries', label: 'US Treasury securities — roughly $780 billion of bills, notes and bonds' },
        {
          id: 'gold',
          label: 'Gold, held since the founding of the system',
          feedback:
            'About $12 billion including gold certificates and coin — well under 2%. The video pauses on exactly this: for a system that started on metal, there is remarkably little of it.',
        },
        {
          id: 'loans',
          label: 'Loans to banks through the discount window',
          feedback:
            'Outright loans were $39 million — peanuts, in the video’s word. That changed dramatically in the crisis that followed.',
        },
        {
          id: 'buildings',
          label: 'Property — twelve regional banks',
          feedback:
            'Bank premises came to about $2 billion. Impressive buildings, immaterial balance sheet.',
        },
      ],
      correctOptionId: 'treasuries',
      explanation:
        'This is the earlier videos made real: the central bank creates reserves and buys government debt with them, so its assets are overwhelmingly that debt. The $30 billion of repurchase agreements were short-term loans to the market made through repos, and the discount window itself shows up as just $39 million of loans. The gold is a leftover nobody found a use for.',
    },
    {
      id: 'mc-how-it-earns',
      type: 'multiple_choice',
      tags: ['central-banking', 'seigniorage'],
      xp: 25,
      prompt:
        'In 2007 the Fed paid no interest on its notes or on the $17 billion that banks kept in their accounts with it. How did it pay its way?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'spread',
          label:
            'Interest earned on its Treasuries, while its own liabilities cost it nothing',
        },
        {
          id: 'fees',
          label: 'Fees charged to member banks for holding their reserves',
          feedback:
            'Not the mechanism described. The point is the imbalance: assets that earn interest, paid for with liabilities that pay none.',
        },
        {
          id: 'taxes',
          label: 'An appropriation from Congress',
          feedback:
            'The flow runs the other way — surplus goes back to the Treasury after expenses.',
        },
        {
          id: 'private',
          label: 'Profits paid out to private shareholders',
          feedback:
            'Member banks do receive a small fixed dividend on the Fed stock they must hold, but that is not how the Fed pays its way, and the rest of the surplus goes to the Treasury. As the video puts it, Bernanke was not driving a Bentley on it.',
        },
      ],
      correctOptionId: 'spread',
      explanation:
        'Liabilities that cost nothing, assets that pay interest — the widest spread in finance, which is why the video calls it easy money. The arrangement runs both ways: if the Fed became insolvent, the US government would stand behind it, which is what "obligations of the United States" on the notes means.',
    },
    {
      id: 'mc-fed-leverage',
      type: 'multiple_choice',
      tags: ['central-banking', 'leverage', 'solvency'],
      xp: 35,
      prompt:
        'The Fed had $871 billion of assets and $31 billion of capital (equity). Apply the leverage lesson: roughly what loss on its assets would wipe out that capital, and why does nobody worry about it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'insolvency-fine',
          label: 'About 3.6%, and it hardly matters — what people can demand from it is money it issues itself',
        },
        {
          id: 'cantfail',
          label: 'No loss can, because the Fed holds only risk-free assets',
          feedback:
            'Treasuries carry no default risk but plenty of price risk — a rise in interest rates cuts their market value hard, which is exactly what happened to the Fed’s holdings from 2022.',
        },
        {
          id: 'fifty',
          label: 'About 50%, because central banks hold far more capital than banks',
          feedback:
            'Do the sum: 31 divided by 871 is about 3.6%. The Fed is levered roughly 28 to 1, with a thinner cushion than most of the banks it regulates.',
        },
        {
          id: 'bailout',
          label: 'About 3.6%, and Congress would have to recapitalise it immediately',
          feedback:
            'The government stands behind it, but no new capital is *needed*. A central bank with negative equity can keep paying in the money it issues, and several have run that way for years.',
        },
      ],
      correctOptionId: 'insolvency-fine',
      explanation:
        '31 / 871 is about 3.6%, so on paper the Fed is levered about 28 to 1, which in an ordinary bank would be alarming. It is not, for the reason video 13 gave: what people can demand from it is its own liability, so it can always pay. This stopped being hypothetical in 2022, when rising rates pushed the Fed into large operating losses. It recorded them as a "deferred asset" and carried on; the main cost was that it stopped sending profits to the Treasury until the losses are made up.',
    },
    {
      id: 'mc-gold-share',
      type: 'multiple_choice',
      tags: ['central-banking', 'gold-standard'],
      xp: 30,
      prompt:
        'Gold certificates and coin come to roughly $12 billion of the Fed’s $871 billion of assets. What does that proportion tell you?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'vestigial',
          label: 'About 1.4% — the gold is a leftover, backing essentially nothing',
        },
        {
          id: 'backing',
          label: 'The dollar is roughly 1.4% gold-backed, by design',
          feedback:
            'There is no design here and no ratio being defended. No rule ties the amount of dollars to this gold, and nobody chose 1.4%.',
        },
        {
          id: 'undervalued',
          label: 'The Fed’s gold is worth far more than stated, so the figure means little',
          feedback:
            'The certificates are indeed valued at a legal price of $42.22 an ounce rather than the market price. Value the gold at market prices and it is still small next to $871 billion.',
        },
        {
          id: 'reserve',
          label: 'It is the reserve behind the notes, as under the gold standard',
          feedback:
            'Video 17 makes the point that it stopped being that. The assets actually standing behind the notes are the $780 billion of Treasuries.',
        },
      ],
      correctOptionId: 'vestigial',
      explanation:
        'This is video 17’s argument turned into a number. What stood behind the dollar in February 2007 was $780 billion of claims on the US government and about $12 billion of gold — and the gold was there because nobody decided what else to do with it. Sal says it was just sitting there; the balance sheet says the same.',
    },
    {
      id: 'mc-then-and-now',
      type: 'multiple_choice',
      tags: ['central-banking', 'quantitative-easing', 'reserves'],
      xp: 35,
      prompt:
        'In February 2007, notes outstanding were $769 billion of the Fed’s $839 billion of liabilities, while banks’ deposits at the Fed (their reserves) were only $17 billion. What happened to that picture after 2008?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'inverted',
          label: 'It flipped — bank reserves grew into the Fed’s largest liability for years',
        },
        {
          id: 'notes',
          label: 'Notes in circulation grew to match the balance sheet',
          feedback:
            'Currency did grow, roughly threefold over fifteen years — nothing like the balance sheet, which grew nearly tenfold at its peak. The public did not want trillions in banknotes.',
        },
        {
          id: 'same',
          label: 'The proportions held, and everything simply got bigger',
          feedback:
            'They could not hold. Quantitative easing pays for bonds by crediting reserve accounts, so the growth had to land on that line.',
        },
        {
          id: 'equity',
          label: 'The equity grew to match, keeping leverage constant',
          feedback:
            'Capital stayed small and roughly fixed while assets multiplied, so leverage rose sharply rather than holding.',
        },
      ],
      correctOptionId: 'inverted',
      explanation:
        'Every asset the Fed buys is paid for by crediting a bank’s reserve account, so a balance sheet that grows by trillions grows its reserves by trillions. The $17 billion line on this 2007 statement became the defining feature of the modern Fed, peaking above $4 trillion — which is also why paying interest on reserves stopped being a technicality and became the main policy tool. Put today’s weekly statement (the H.4.1) beside this one and you can read the last two decades off two columns.',
    },
    {
      id: 'match-fed-lines',
      type: 'concept_match',
      tags: ['central-banking', 'balance-sheets'],
      xp: 30,
      prompt: 'Match each line of the Fed’s February 2007 balance sheet to what it actually is.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'treasuries',
          term: 'US Treasury securities, $780bn',
          definition: 'What the Fed bought with money it created, and what now stands behind the currency',
        },
        {
          id: 'repos',
          term: 'Repurchase agreements, $30bn',
          definition: 'Securities bought under an agreement to sell them back — short-term lending, dressed up as a purchase',
        },
        {
          id: 'notes',
          term: 'Notes outstanding, $769bn',
          definition: 'Every dollar bill in every wallet in the country, recorded as something the Fed owes',
        },
        {
          id: 'deposits',
          term: 'Depository institution deposits, $17bn',
          definition: 'The reserve accounts of the banking system — tiny here, and about to become everything',
        },
      ],
      explanation:
        'Four lines and you have the whole module: the Fed owns government debt, lends against collateral, owes the public its banknotes and owes the banks their reserves. Everything the course has built by hand is a real line with a real number beside it, and the statement is published weekly as the H.4.1 if you want to check what it says today.',
    },
  ],
  keyTakeaways: [
    'Central bank assets are overwhelmingly government debt; gold is a rounding error.',
    'Its liabilities are the banknotes and reserve accounts it has issued.',
    'It funds itself on the spread and returns the surplus to the Treasury.',
  ],
});
