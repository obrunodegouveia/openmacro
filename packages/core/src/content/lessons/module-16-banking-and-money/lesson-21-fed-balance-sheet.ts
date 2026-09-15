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
        'Of $871 billion of Federal Reserve assets in February 2007, what was the overwhelming majority?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'treasuries', label: 'Treasuries — roughly $780 billion of bills, notes and bonds' },
        {
          id: 'gold',
          label: 'Gold, held since the founding of the system',
          feedback:
            'About $12 billion including certificates and coin — well under 2%. The video pauses on exactly this: for an institution founded on metal, there is remarkably little of it.',
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
        'This is the earlier videos made literal: the central bank creates reserves and buys government debt with them, so its assets are overwhelmingly that debt. The $30 billion of repurchase agreements is the discount window in action, and the gold is a residue nobody found a use for.',
    },
    {
      id: 'mc-how-it-earns',
      type: 'multiple_choice',
      tags: ['central-banking', 'seigniorage'],
      xp: 25,
      prompt:
        'The Fed paid no interest on its notes or on the $17 billion of bank deposits it held. How did it fund itself?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'spread',
          label:
            'Interest on its treasuries, against liabilities that pay none',
        },
        {
          id: 'fees',
          label: 'Fees charged to member banks for holding their reserves',
          feedback:
            'Not the mechanism described. The asymmetry is the point: interest-bearing assets funded by non-interest-bearing liabilities.',
        },
        {
          id: 'taxes',
          label: 'An appropriation from Congress',
          feedback:
            'The flow runs the other way — surplus goes back to the Treasury after expenses.',
        },
        {
          id: 'private',
          label: 'Profits distributed to its private shareholders',
          feedback:
            'It is officially a private institution with a government-appointed board, but the surplus does not enrich anyone. As the video puts it, Bernanke was not driving a Bentley on it.',
        },
      ],
      correctOptionId: 'spread',
      explanation:
        'Liabilities that cost nothing, assets that pay interest — the widest spread in finance, and the reason the arrangement is described as easy money. The obligation runs both ways: were the Fed to become insolvent, Congress would stand behind it, which is what "obligations of the United States government" means.',
    },
    {
      id: 'mc-fed-leverage',
      type: 'multiple_choice',
      tags: ['central-banking', 'leverage', 'solvency'],
      xp: 35,
      prompt:
        '$871 billion of assets on $31 billion of capital. Apply the leverage lesson: roughly what write-down wipes the Fed out, and why does nobody worry about it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'insolvency-fine',
          label: 'About 3.6%, and it does not matter — it cannot run out of its own liabilities',
        },
        {
          id: 'cantfail',
          label: 'No write-down can, because the Fed holds only risk-free assets',
          feedback:
            'Treasuries carry no default risk and plenty of price risk — a rate rise marks them down hard, which is exactly what happened to the Fed’s book after 2022.',
        },
        {
          id: 'fifty',
          label: 'About 50%, because central banks hold far more capital than banks',
          feedback:
            'Run the numbers: 31 divided by 871. The Fed is levered roughly 28 to 1, thinner than most of the banks it regulates.',
        },
        {
          id: 'bailout',
          label: 'About 3.6%, and Congress would have to recapitalise it immediately',
          feedback:
            'Congress stands behind it, but no recapitalisation is *needed*. A central bank with negative equity keeps paying in the money it issues, and several have run that way for years.',
        },
      ],
      correctOptionId: 'insolvency-fine',
      explanation:
        'On paper the Fed is levered about twenty-eight times, which in any commercial bank would be alarming. It is not, for the reason video 13 gave: what people demand of it is its own liability, so it can always pay. This stopped being hypothetical in 2022, when rising rates put the Fed deep into operating losses; it recorded a deferred asset and carried on, because the only thing insolvency would cost it is the remittance it sends the Treasury.',
    },
    {
      id: 'mc-gold-share',
      type: 'multiple_choice',
      tags: ['central-banking', 'gold-standard'],
      xp: 30,
      prompt:
        'Gold certificates and coin come to roughly $12 billion of the $871 billion. What does that proportion tell you?',
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
            'There is no design here and no ratio being defended. Nothing obliges the Fed to hold any gold at all, and nobody chose 1.4%.',
        },
        {
          id: 'undervalued',
          label: 'The Fed’s gold is worth far more than stated, so the figure means little',
          feedback:
            'The certificates are indeed carried at a statutory $42.22 an ounce rather than market. Mark it to market and it is still a rounding error against $871 billion.',
        },
        {
          id: 'reserve',
          label: 'It is the reserve behind the notes, as under the gold standard',
          feedback:
            'Video 17 makes the point that it stopped being that. The assets actually standing behind the notes are the $780 billion of treasuries.',
        },
      ],
      correctOptionId: 'vestigial',
      explanation:
        'This is video 17’s argument as a number rather than an argument. What stands behind a dollar in February 2007 is $780 billion of claims on the US government and about $12 billion of metal — and the metal is there because nobody decided what else to do with it. Sal’s phrase was that it was just sitting there; the balance sheet says the same thing to three decimal places.',
    },
    {
      id: 'mc-then-and-now',
      type: 'multiple_choice',
      tags: ['central-banking', 'quantitative-easing', 'reserves'],
      xp: 35,
      prompt:
        'In February 2007, notes outstanding were $769 billion of $839 billion of liabilities, while bank deposits at the Fed were $17 billion. What happened to that shape after 2008?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'inverted',
          label: 'It inverted — reserves became the Fed’s largest liability',
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
        'Every asset the Fed buys is paid for by crediting a bank’s reserve account, so a balance sheet that grows by trillions grows its reserves by trillions. The $17 billion line on this 2007 statement became the defining feature of the modern Fed, peaking above $4 trillion — which is also why paying interest on reserves stopped being a technicality and became the main instrument of policy. Pull up today’s H.4.1 beside this one and you can read the whole of the last two decades off two columns.',
    },
    {
      id: 'match-fed-lines',
      type: 'concept_match',
      tags: ['central-banking', 'balance-sheets'],
      xp: 30,
      prompt: 'Match each line on the February 2007 statement to what it actually is.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'treasuries',
          term: 'US treasury securities, $780bn',
          definition: 'What the Fed bought with money it created, and what now stands behind the currency',
        },
        {
          id: 'repos',
          term: 'Repurchase agreements, $30bn',
          definition: 'Collateral bought under an agreement to sell it back — lending to banks, wearing a purchase’s clothes',
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
        'Four lines and you have the entire module: the Fed owns government debt, lends to banks against collateral, owes the public its banknotes and owes the banks their reserves. Everything the course has built by hand is a real line item with a real number beside it, and the statement is published weekly as the H.4.1 if you want to check what it says today.',
    },
  ],
  keyTakeaways: [
    'Central bank assets are overwhelmingly government debt; gold is a rounding error.',
    'Its liabilities are the banknotes and reserve accounts it has issued.',
    'It funds itself on the spread and returns the surplus to the Treasury.',
  ],
});
