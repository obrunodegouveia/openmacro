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
  ],
  keyTakeaways: [
    'Central bank assets are overwhelmingly government debt; gold is a rounding error.',
    'Its liabilities are the banknotes and reserve accounts it has issued.',
    'It funds itself on the spread and returns the surplus to the Treasury.',
  ],
});
