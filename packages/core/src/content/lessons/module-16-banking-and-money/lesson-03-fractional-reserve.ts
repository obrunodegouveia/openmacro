import { defineLesson } from '../../schema';

/**
 * Video 3. The multiplier built by hand: 1,000 gold in, 2,710 of deposits out,
 * and the deliberate point that this happens under a gold standard too.
 */
export const kabFractionalReserveLesson = defineLesson({
  id: 'kab-fractional-reserve',
  title: 'One Thousand Coins, Two Thousand Seven Hundred Deposits',
  subtitle:
    'Lend, redeposit, lend again. Nobody mines an ounce of gold and the money supply nearly triples.',
  icon: '♻️',
  difficulty: 'core',
  estimatedMinutes: 18,
  video: {
    url: 'https://www.youtube.com/watch?v=nH2-37rTA8U',
    minutes: 12,
    source: 'Khan Academy — Banking 3',
  },
  challenges: [
    {
      id: 'mc-m0-unchanged',
      type: 'multiple_choice',
      tags: ['money-creation', 'money-supply'],
      xp: 20,
      prompt:
        'After the lending cycle, deposits total 2,710 gold pieces. How much gold is actually in the vault?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'thousand',
          label: '1,000 — exactly what the farmers brought in',
        },
        {
          id: 'twenty-seven',
          label: '2,710, because each deposit is backed by gold',
          feedback:
            'That is precisely the illusion the example is built to break. Count the vault: 100 plus 90 plus 810. The gold never multiplied — only the claims on it did.',
        },
        {
          id: 'seventeen',
          label: '1,710, the original gold plus what was lent',
          feedback:
            'Lending moved gold out and deposits brought it back; it was never added to. Every coin lent was a coin that had been deposited.',
        },
        {
          id: 'nine-hundred',
          label: '900, because the rest was lent out and is gone',
          feedback:
            'The gold came back. Workers paid with it redeposited it, which is exactly what lets the cycle continue.',
        },
      ],
      correctOptionId: 'thousand',
      explanation:
        'M0 — the physical gold — is 1,000 and stays 1,000. M1 — what everyone believes is in their account — is 2,710. Nobody mined anything and nobody lied; the same coins simply back several promises at once. That is the multiplier, and the video makes a point of showing it under a gold standard to kill the idea that it is a paper-money trick.',
    },
    {
      id: 'order-the-cycle',
      type: 'order_flow',
      tags: ['money-creation', 'multiplier'],
      xp: 25,
      prompt: 'Put one full turn of the multiplier in order.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'deposit', label: 'Farmers deposit 1,000 gold', detail: 'A liability for the bank' },
        { id: 'reserve', label: 'Bank sets aside 100 as reserves', detail: '10% of the deposit' },
        { id: 'lend', label: 'Bank lends 900 to the canal builder' },
        { id: 'pay', label: 'The builder pays the workers 900' },
        { id: 'redeposit', label: 'Workers redeposit their 900', detail: 'Deposits are now 1,900' },
        { id: 'again', label: 'Bank keeps 90, lends 810', detail: 'And the cycle turns again' },
      ],
      correctOrder: ['deposit', 'reserve', 'lend', 'pay', 'redeposit', 'again'],
      explanation:
        'Each turn is smaller than the last — 1,000, then 900, then 810 — which is why the total converges rather than running away. The reserve ratio sets how fast it shrinks, and therefore how large the money supply can get.',
    },
  ],
  keyTakeaways: [
    'Fractional reserve banking multiplies deposits without creating any new base money.',
    'M0 counts the gold; M1 counts what people believe they hold.',
    'The multiplier works under a gold standard too — it is not a property of paper.',
  ],
});
