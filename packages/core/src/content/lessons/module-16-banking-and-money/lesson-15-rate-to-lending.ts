import { defineLesson } from '../../schema';

/** Video 15. The same mechanism again, with the point that a rate cut is really a lending-capacity increase. */
export const kabRateToLendingLesson = defineLesson({
  id: 'kab-rate-to-lending',
  title: 'What a Rate Cut Really Announces',
  subtitle:
    'They say five per cent. What they mean is that every new reserve lets a bank write ten times as much in loans.',
  icon: '🔁',
  difficulty: 'core',
  estimatedMinutes: 16,
  video: {
    url: 'https://www.youtube.com/watch?v=rgqFXkLAc-4',
    minutes: 12,
    source: 'Khan Academy — Banking 15',
  },
  challenges: [
    {
      id: 'mc-hidden-meaning',
      type: 'multiple_choice',
      tags: ['monetary-policy', 'multiplier'],
      xp: 25,
      prompt:
        'The central bank announces a cut from 6% to 5%. With a 10% reserve ratio, what does each dollar of new reserves enable?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'ten', label: 'About ten dollars of new lending' },
        {
          id: 'one',
          label: 'One dollar — reserves and loans move together',
          feedback:
            'That would be full reserve banking. Under a 10% requirement a dollar of reserves supports ten dollars of deposits.',
        },
        {
          id: 'tenth',
          label: 'Ten cents',
          feedback:
            'The ratio is the right number applied the wrong way round. Divide by 0.1 rather than multiplying by it.',
        },
        {
          id: 'none',
          label: 'Nothing — rate announcements are signals, not operations',
          feedback:
            'They are backed by real purchases of real bonds. The announcement is only credible because the operations follow.',
        },
      ],
      correctOptionId: 'ten',
      explanation:
        'The rate is the visible half. The invisible half is that the operations achieving it inject base money, and every unit of that multiplies through the banking system. The central bank speaks in rates because that is what it can observe minute by minute — but what it is doing is changing how much credit the system can create.',
    },
    {
      id: 'mc-seller-deposits',
      type: 'multiple_choice',
      tags: ['open-market-operations', 'reserve-ratio'],
      xp: 25,
      prompt:
        'When the bond seller deposits their proceeds, both the bank’s assets and liabilities rise by the same amount. Why does its reserve ratio improve?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'hundred-percent',
          label:
            'Because the new deposit arrives fully backed by reserves — a 100% ratio on the increment, far above the 10% it must hold',
        },
        {
          id: 'liabilities-fall',
          label: 'Because its liabilities fall',
          feedback:
            'They rise — the seller now has a checking account. The ratio improves despite that, because the reserves arrived alongside it one for one.',
        },
        {
          id: 'loans-fall',
          label: 'Because its loans are written down',
          feedback:
            'Nothing happens to the loan book. Only cash and a matching deposit are added.',
        },
        {
          id: 'no-change',
          label: 'It does not — the ratio is unchanged when both sides grow equally',
          feedback:
            'Equal growth in *currency* terms is not equal in ratio terms. Adding 100 of reserves and 100 of deposits to a bank holding 10% reserves raises the average sharply.',
        },
      ],
      correctOptionId: 'hundred-percent',
      explanation:
        'A bank at 10% that receives a deposit backed entirely by reserves ends up holding more reserves per unit of deposit than before. That surplus is what it then lends against — and it is also why the bank that was short of reserves no longer needs to borrow, which is how the interbank rate falls.',
    },
  ],
  keyTakeaways: [
    'A rate cut is delivered by injecting reserves, which expands lending capacity.',
    'A deposit arriving with its own reserves improves a bank’s ratio.',
    'Rates are targeted because they are observable in real time; credit is the real effect.',
  ],
});
