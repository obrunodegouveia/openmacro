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
    {
      id: 'sim-rounds',
      type: 'interactive_sim',
      tags: ['money-creation', 'multiplier'],
      xp: 30,
      prompt: 'How far did Sal actually get?',
      instructions: 'Set the rounds to 3 to rebuild the video, then keep going',
      narrative:
        'The video lends, re-deposits and lends again exactly three times, then stops and keeps the last 810 in the vault. Each round re-lends whatever fraction the reserve ratio leaves, so the total after n rounds is D x (1 − (1 − R)^n) / R. Put the ratio at 10% and the rounds at 3 and you should see the video’s own 2,710 — then push the rounds up and watch how slowly the last of it arrives.',
      constants: {
        initialDeposit: 1000,
      },
      sliders: [
        {
          key: 'reserveRatio',
          label: 'Reserve ratio (R)',
          min: 0.05,
          max: 0.5,
          step: 0.05,
          defaultValue: 0.1,
          format: 'percent',
          hint: 'What Sal holds back from each new deposit',
        },
        {
          key: 'rounds',
          label: 'Lending rounds completed',
          min: 1,
          max: 40,
          step: 1,
          defaultValue: 3,
          format: 'number',
          hint: 'The video stops at three',
        },
      ],
      readouts: [
        {
          key: 'deposits',
          label: 'Deposits people believe they hold',
          formulaId: 'deposits_after_rounds',
          format: 'currency',
          emphasis: true,
          caption: 'M(n) = D x (1 − (1 − R)^n) / R',
        },
        {
          key: 'ceiling',
          label: 'Where it would end up eventually',
          formulaId: 'total_money_created',
          format: 'currency',
          caption: 'D x (1 / R)',
        },
        {
          key: 'share',
          label: 'Share of that ceiling reached',
          formulaId: 'share_of_limit',
          format: 'percent',
          caption: '1 − (1 − R)^n',
        },
        {
          key: 'gold',
          label: 'Gold in the vault throughout',
          formulaId: 'required_reserves',
          format: 'currency',
          caption: 'Still the original 1,000',
        },
      ],
      objective: {
        description: 'Rebuild the video at 3 rounds, then see how far 20 gets you',
        requiredObservations: [{ sliderKey: 'rounds', values: [3, 20] }],
      },
      explanation:
        'Three rounds at a 10% ratio reach 2,710 — only 27% of the 10,000 the multiplier promises. Twenty rounds reach 8,784. The textbook figure of "ten times base money" is a destination the system is always walking towards and never arrives at, because every round is smaller than the last. Notice too that the gold never moves off 1,000 no matter where you put the sliders.',
    },
    {
      id: 'mc-the-limit',
      type: 'multiple_choice',
      tags: ['money-creation', 'multiplier'],
      xp: 25,
      prompt:
        'Sal stops the chain by choice — he keeps the last 810 as reserves instead of lending 729 of it. Had he carried on at 10% forever, what would deposits have approached?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'tenk', label: '10,000 — the original 1,000 divided by the reserve ratio' },
        {
          id: 'infinite',
          label: 'They would grow without limit, since each round creates more',
          feedback:
            'Each round is 90% of the one before, so the total is a geometric series with a finite sum. 1,000 + 900 + 810 + 729 … converges on 10,000.',
        },
        {
          id: 'fivek',
          label: '5,000 — you cannot create more than five times the gold',
          feedback:
            'Nothing caps it at five. The ceiling is set by the reserve ratio alone: at 10% each gold piece can back ten of deposits.',
        },
        {
          id: 'twok',
          label: 'About 3,000 — it was already slowing down at 2,710',
          feedback:
            'It is slowing, but slowly. The next rounds add 729, 656, 590 and so on; the tail is long and sums to another 7,290.',
        },
      ],
      correctOptionId: 'tenk',
      explanation:
        'M = D / R = 1,000 / 0.1 = 10,000. The number that matters here is how far 2,710 is from it: the video’s dramatic near-tripling of the money supply is barely a quarter of what the same 1,000 gold pieces could support. Real systems sit well below the ceiling too, because borrowers must want the loans and banks must want to make them.',
    },
    {
      id: 'mc-slack',
      type: 'multiple_choice',
      tags: ['reserves', 'money-creation'],
      xp: 30,
      prompt:
        'With the chain stopped, the vault holds 1,000 gold against 2,710 of deposits. If the requirement is 10%, what does that tell you about Sal’s position?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'slack',
          label: 'He is holding about 37% — far more than required, so he could lend a great deal more',
        },
        {
          id: 'tight',
          label: 'He is at the limit, since 1,000 of gold backs 2,710 of claims',
          feedback:
            'Work out the ratio: 1,000 divided by 2,710 is roughly 37%, not 10%. He has nearly four times the gold the rule demands.',
        },
        {
          id: 'breach',
          label: 'He is in breach — he owes 2,710 and has only 1,000',
          feedback:
            'Owing more than you hold in cash is the definition of the business, not a breach of it. The rule asks for 10% of demand deposits, and he has 37%.',
        },
        {
          id: 'depends',
          label: 'You cannot say without knowing whether the loans are good',
          feedback:
            'Loan quality decides whether he is solvent. The reserve ratio is a separate question about liquidity, and it is answerable from these two numbers alone.',
        },
      ],
      correctOptionId: 'slack',
      explanation:
        '1,000 / 2,710 is about 37%. Sal is sitting on roughly 730 gold pieces of reserves he is not required to hold — what a modern balance sheet would call excess reserves. He stopped lending because he chose to, not because a rule stopped him, and that distinction between a binding constraint and a voluntary one runs all the way to the modern Fed.',
    },
  ],
  keyTakeaways: [
    'Fractional reserve banking multiplies deposits without creating any new base money.',
    'M0 counts the gold; M1 counts what people believe they hold.',
    'The multiplier works under a gold standard too — it is not a property of paper.',
  ],
});
