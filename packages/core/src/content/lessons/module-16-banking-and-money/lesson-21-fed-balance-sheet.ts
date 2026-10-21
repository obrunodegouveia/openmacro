import { defineLesson } from '../../schema';

/** Video 21. The real Federal Reserve balance sheet, 14 February 2007, read line by line. */
export const kabFedBalanceSheetLesson = defineLesson({
  id: 'kab-fed-balance-sheet',
  title: 'The Real Balance Sheet, February 2007',
  subtitle:
    'The Fed owned $871 billion, almost all of it government debt. It owed $769 billion of that as banknotes.',
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
        'In February 2007, the Federal Reserve owned $871 billion of assets. What were almost all of them?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'treasuries', label: 'US government bonds (Treasuries) — about $780 billion of them' },
        {
          id: 'gold',
          label: 'Gold, kept since the Fed was first set up',
          feedback:
            'Gold, gold certificates and coins came to about $12 billion — well under 2%. The video stops on this point: a system that began with metal now holds very little of it.',
        },
        {
          id: 'loans',
          label: 'Loans to banks through the discount window',
          feedback:
            'Direct loans were only $39 million — “peanuts”, as the video says. That changed a lot in the crisis that came next.',
        },
        {
          id: 'buildings',
          label: 'Buildings — the twelve regional Fed banks',
          feedback:
            'Bank buildings came to about $2 billion. Big buildings, but a tiny part of the balance sheet.',
        },
      ],
      correctOptionId: 'treasuries',
      explanation:
        'This is the earlier videos in real life. The central bank creates reserves and buys government debt with them, so most of what it owns is that debt. The $30 billion of repurchase agreements were short loans to the market, made as repos. The discount window shows up as just $39 million of loans. The gold is left over from the past.',
    },
    {
      id: 'mc-how-it-earns',
      type: 'multiple_choice',
      tags: ['central-banking', 'seigniorage'],
      xp: 25,
      prompt:
        'In 2007, the Fed paid no interest on its banknotes, or on the $17 billion that banks kept in their accounts at the Fed. So how did it pay its costs?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'spread',
          label: 'With interest from its Treasuries, while its own debts cost it nothing',
        },
        {
          id: 'fees',
          label: 'With fees that banks paid it for holding their reserves',
          feedback:
            'That is not what the video shows. The key is the imbalance: assets that earn interest, paid for with debts that pay none.',
        },
        {
          id: 'taxes',
          label: 'With money that Congress gave it each year',
          feedback:
            'The money flows the other way. After costs, the Fed sends its extra money to the Treasury.',
        },
        {
          id: 'private',
          label: 'With profits paid to private owners',
          feedback:
            'Member banks must hold Fed shares and get a small fixed dividend. But that is not how the Fed pays its way, and the rest goes to the Treasury. As the video jokes, Bernanke was not driving a Bentley.',
        },
      ],
      correctOptionId: 'spread',
      explanation:
        'Its debts cost nothing, and its assets pay interest. That is the biggest gap in all of finance, so the video calls it easy money. It also works the other way: if the Fed ever went broke, the US government would stand behind it. That is what “obligations of the United States” on the notes means.',
    },
    {
      id: 'mc-fed-leverage',
      type: 'multiple_choice',
      tags: ['central-banking', 'leverage', 'solvency'],
      xp: 35,
      prompt:
        'The Fed had $871 billion of assets and $31 billion of capital (its own equity). Use the leverage lesson: about what loss on its assets would wipe out that capital? And why does nobody worry?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'insolvency-fine',
          label: 'About 3.6%, and it does not matter much — people can only ask it for money it creates itself',
        },
        {
          id: 'cantfail',
          label: 'No loss could, because the Fed only owns assets with no risk at all',
          feedback:
            'Treasuries will be paid back, but their price can still fall. When interest rates rise, their value drops a lot. That happened to the Fed’s bonds from 2022.',
        },
        {
          id: 'fifty',
          label: 'About 50%, because central banks keep much more capital than banks',
          feedback:
            'Do the sum: 31 ÷ 871 is about 3.6%. The Fed owns about 28 times its capital, a thinner cushion than most banks it watches over.',
        },
        {
          id: 'bailout',
          label: 'About 3.6%, and Congress would have to give it new capital at once',
          feedback:
            'The government stands behind it, but it does not need new capital. A central bank with negative equity can keep paying with the money it creates. Several have done this for years.',
        },
      ],
      correctOptionId: 'insolvency-fine',
      explanation:
        '31 ÷ 871 is about 3.6%. So on paper the Fed owns about 28 times its capital, which would scare people at a normal bank. It does not at the Fed, as video 13 explained: people can only ask it for its own money, so it can always pay. This really happened in 2022, when higher rates gave the Fed big losses. It wrote them down as a “deferred asset” and carried on. The main cost was that it stopped sending profits to the Treasury until the losses are made up.',
    },
    {
      id: 'mc-gold-share',
      type: 'multiple_choice',
      tags: ['central-banking', 'gold-standard'],
      xp: 30,
      prompt:
        'Gold certificates and coins are about $12 billion of the Fed’s $871 billion of assets. What does that share tell you?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'vestigial',
          label: 'About 1.4% — the gold is left over from the past and backs almost nothing',
        },
        {
          id: 'backing',
          label: 'The dollar is planned to be about 1.4% backed by gold',
          feedback:
            'Nothing is planned here. No rule links the number of dollars to this gold, and nobody chose 1.4%.',
        },
        {
          id: 'undervalued',
          label: 'The gold is worth much more than shown, so the number means little',
          feedback:
            'True, the certificates use a legal price of $42.22 an ounce, not the market price. But even at market prices the gold is small next to $871 billion.',
        },
        {
          id: 'reserve',
          label: 'It is what backs the banknotes, as under the gold standard',
          feedback:
            'Video 17 shows that this stopped being true. What really stands behind the notes is the $780 billion of Treasuries.',
        },
      ],
      correctOptionId: 'vestigial',
      explanation:
        'This turns video 17’s argument into a number. In February 2007, the dollar was backed by $780 billion of loans to the US government and about $12 billion of gold. The gold was there only because nobody decided what else to do with it. Sal says it was “just sitting there”, and the balance sheet agrees.',
    },
    {
      id: 'mc-then-and-now',
      type: 'multiple_choice',
      tags: ['central-banking', 'quantitative-easing', 'reserves'],
      xp: 35,
      prompt:
        'In February 2007, banknotes were $769 billion of the Fed’s $839 billion of liabilities (what it owes). Banks’ deposits at the Fed (their reserves) were only $17 billion. How did that change after 2008?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'inverted',
          label: 'It turned around — bank reserves became the Fed’s biggest debt for years',
        },
        {
          id: 'notes',
          label: 'Banknotes grew as fast as the whole balance sheet',
          feedback:
            'Cash did grow, about three times in fifteen years. But the balance sheet grew almost ten times at its peak. People did not want trillions in banknotes.',
        },
        {
          id: 'same',
          label: 'The shares stayed the same, and everything just got bigger',
          feedback:
            'They could not stay the same. The Fed pays for the bonds it buys by adding to banks’ reserve accounts, so the growth had to land on that line.',
        },
        {
          id: 'equity',
          label: 'The Fed’s equity grew too, so its leverage stayed the same',
          feedback:
            'Its capital stayed small and about the same while its assets multiplied. So leverage rose sharply.',
        },
      ],
      correctOptionId: 'inverted',
      explanation:
        'The Fed pays for every asset it buys by adding money to a bank’s reserve account. So when its balance sheet grows by trillions, reserves grow by trillions too. The $17 billion line of 2007 became the main feature of today’s Fed, peaking above $4 trillion. That is also why paying interest on reserves became the Fed’s main tool. Put today’s weekly statement (called the H.4.1) next to this one and you can see the last twenty years in two columns.',
    },
    {
      id: 'match-fed-lines',
      type: 'concept_match',
      tags: ['central-banking', 'balance-sheets'],
      xp: 30,
      prompt: 'Match each line of the Fed’s February 2007 balance sheet to what it really is.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'treasuries',
          term: 'US Treasury securities, $780bn',
          definition: 'Government bonds the Fed bought with money it created; they now stand behind the dollar',
        },
        {
          id: 'repos',
          term: 'Repurchase agreements, $30bn',
          definition: 'Bonds bought with a promise to sell them back — a short loan that looks like a purchase',
        },
        {
          id: 'notes',
          term: 'Notes outstanding, $769bn',
          definition: 'Every dollar bill in every wallet in the country, written down as something the Fed owes',
        },
        {
          id: 'deposits',
          term: 'Depository institution deposits, $17bn',
          definition: 'The banks’ reserve accounts at the Fed — tiny here, but soon to become the biggest line',
        },
      ],
      explanation:
        'These four lines sum up the whole module. The Fed owns government debt, lends against collateral, owes the public its banknotes and owes the banks their reserves. Everything the course built by hand is a real line with a real number. The Fed publishes this statement every week as the H.4.1, so you can check it today.',
    },
  ],
  keyTakeaways: [
    'Almost everything a central bank owns is government debt; its gold is tiny.',
    'What it owes is the banknotes and reserve accounts it has created.',
    'It earns money on the gap between interest it gets and pays, and gives the extra to the Treasury.',
  ],
});
