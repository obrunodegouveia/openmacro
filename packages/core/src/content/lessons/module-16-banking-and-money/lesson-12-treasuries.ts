import { defineLesson } from '../../schema';

/** Video 12. Government debt introduced as the instrument open market operations will act on. */
export const kabTreasuriesLesson = defineLesson({
  id: 'kab-treasuries',
  title: 'Why Government IOUs Count as Risk Free',
  subtitle:
    'A treasury is a promise to pay in a currency the promiser can levy taxes in. That is what "risk free" means here.',
  icon: '📜',
  difficulty: 'core',
  estimatedMinutes: 15,
  video: {
    url: 'https://www.youtube.com/watch?v=JBWdbzzYbtU',
    minutes: 11,
    source: 'Khan Academy — Banking 12',
  },
  challenges: [
    {
      id: 'mc-risk-free',
      type: 'multiple_choice',
      tags: ['treasuries', 'sovereign-debt'],
      xp: 25,
      prompt:
        'Why does the video call treasuries risk free, given governments are hardly models of restraint?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'own-currency',
          label:
            'The debt is denominated in the currency of the economy the government can tax',
        },
        {
          id: 'honest',
          label: 'Because governments always repay their debts',
          feedback:
            'Plenty have not. The claim is narrower and more mechanical: default is not forced on a government borrowing in a currency it can raise by taxation.',
        },
        {
          id: 'gold-backed',
          label: 'Because they are backed by the gold in the reserve bank',
          feedback:
            'The video makes the opposite point — obligations of the government rest on its power to tax, which is a claim on a real economy rather than on metal.',
        },
        {
          id: 'insured',
          label: 'Because the central bank guarantees them',
          feedback:
            'The direction of the guarantee runs the other way: Federal Reserve notes are obligations of the government, not the reverse.',
        },
      ],
      correctOptionId: 'own-currency',
      explanation:
        '"Risk free" here means free of *credit* risk, not free of every risk — inflation can still erode what you are repaid. The distinction matters for the euro area, where member states borrow in a currency none of them individually controls.',
    },
    {
      id: 'match-maturities',
      type: 'concept_match',
      tags: ['treasuries', 'maturity'],
      xp: 20,
      prompt: 'Match each government IOU to its maturity.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        { id: 'bill', term: 'Treasury bill', definition: 'A year or less' },
        { id: 'note', term: 'Treasury note', definition: 'Out to about ten years' },
        { id: 'bond', term: 'Treasury bond', definition: 'Longer than ten years' },
        {
          id: 'why',
          term: 'Open market operations',
          definition:
            'Buying and selling these is how the central bank injects or drains reserves',
        },
      ],
      explanation:
        'Bills, notes and bonds differ only in how long the government has your money. The last pair is the reason they appear in this playlist at all: open market operations need something safe and liquid to trade, and government debt is the deepest such market there is.',
    },
  ],
  keyTakeaways: [
    'Treasuries are risk free in the credit sense because the issuer can tax in that currency.',
    'Bills, notes and bonds are the same instrument at different maturities.',
    'They are what the central bank buys and sells to change the money supply.',
  ],
});
