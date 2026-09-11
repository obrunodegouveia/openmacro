import { defineLesson } from '../../schema';

/** Video 11. Three banks, three reserve ratios, three currencies — and the central bank invented to fix all three. */
export const kabAReserveBankLesson = defineLesson({
  id: 'kab-a-reserve-bank',
  title: 'Why Banks Invented a Bank for Banks',
  subtitle:
    'One reckless bank can run every other bank. Pooling the gold in one vault fixes that — and fixes the currency too.',
  icon: '🏦',
  difficulty: 'core',
  estimatedMinutes: 17,
  video: {
    url: 'https://www.youtube.com/watch?v=M-4GWomLbpc',
    minutes: 11,
    source: 'Khan Academy — Banking 11',
  },
  challenges: [
    {
      id: 'mc-weak-link',
      type: 'multiple_choice',
      tags: ['central-banking', 'contagion'],
      xp: 25,
      prompt:
        'One bank keeps 8% reserves; the others keep 10% and 12%. The 8% bank fails when 9% of depositors want their money. Why is that everyone’s problem?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'contagion',
          label:
            'Depositors cannot tell prudent banks from reckless ones, so they run on all of them',
        },
        {
          id: 'lent-to',
          label: 'Because the other banks had lent to it',
          feedback:
            'Interbank exposure is a real channel, but not the one in this example. The contagion here is pure confidence: the buildings all look alike.',
        },
        {
          id: 'same-gold',
          label: 'Because all three share the same gold',
          feedback:
            'They do not yet — that is the solution the video is about to propose, not the problem.',
        },
        {
          id: 'regulation',
          label: 'Because regulators force the others to match the weakest bank',
          feedback:
            'No such rule is described. The damage spreads through depositors’ fear, which needs no regulator to transmit it.',
        },
      ],
      correctOptionId: 'contagion',
      explanation:
        'The bitter detail is that the failure was avoidable: the 12% bank had surplus gold and would gladly have lent 1% to prevent a systemic run. What is missing is a mechanism for that lending to happen — which is precisely what a reserve bank provides.',
    },
    {
      id: 'order-central-bank',
      type: 'order_flow',
      tags: ['central-banking', 'reserves'],
      xp: 25,
      prompt: 'Put the invention of a reserve bank in order.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'problems', label: 'Three problems appear', detail: 'Inconsistent ratios, contagious runs, competing currencies' },
        { id: 'pool', label: 'All banks move their gold to one vault' },
        { id: 'accounts', label: 'Their reserves become accounts at the reserve bank', detail: 'Rather than metal in their own vaults' },
        { id: 'lend', label: 'A short bank borrows from the pool', detail: 'Instead of failing while others sit on surplus' },
        { id: 'monopoly', label: 'Only the reserve bank may issue notes', detail: 'One currency instead of three' },
        { id: 'shift', label: 'Reserves come to mean those notes, not gold' },
      ],
      correctOrder: ['problems', 'pool', 'accounts', 'lend', 'monopoly', 'shift'],
      explanation:
        'The last step is the quiet one that matters most. Once commercial banks hold central bank notes as their reserves, the gold is an ornament sitting in a vault — and the system has already become fiat in everything but name. Video 17 returns to finish that thought.',
    },
  ],
  keyTakeaways: [
    'One weak bank can run the whole system, because depositors cannot tell banks apart.',
    'Pooling reserves lets surplus banks fund short ones instead of watching them fail.',
    'A note monopoly gives one currency; reserves then become central bank money.',
  ],
});
