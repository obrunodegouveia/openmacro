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
        'After the chain of lending and redepositing, deposits total 2,710 gold pieces. How much gold is physically in the vault?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'thousand',
          label: '1,000 — exactly what was first deposited',
        },
        {
          id: 'twenty-seven',
          label: '2,710, because every deposit is backed by its own gold',
          feedback:
            'That is exactly the illusion the example is built to break. Count the vault: 100 + 90 + 810 = 1,000. The gold never multiplied — only the claims on it did.',
        },
        {
          id: 'seventeen',
          label: '1,710 — the 900 and the 810 that were lent out',
          feedback:
            'Those 1,710 are the same coins counted again: each was lent out and then redeposited. No gold was ever added, so the vault still holds the original 1,000.',
        },
        {
          id: 'nine-hundred',
          label: '900, because the rest was lent out and has left the bank',
          feedback:
            'The gold came back. The workers who were paid with it deposited it again, which is exactly what keeps the chain going.',
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
      prompt: 'Put the first steps of the lending chain in order, as the video draws them.',
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
        'Each new deposit is smaller than the last — 1,000, then 900, then 810 — which is why the total levels off instead of growing forever. The reserve ratio sets how fast the deposits shrink, and so how large the money supply can get.',
    },
    {
      id: 'sim-rounds',
      type: 'interactive_sim',
      tags: ['money-creation', 'multiplier'],
      xp: 30,
      prompt: 'How far did Sal’s chain actually get?',
      instructions: 'Set the deposits to 3 to rebuild the video, then keep going',
      narrative:
        'The video’s chain has three deposits — 1,000, then 900, then 810 — and stops there, with the last 810 kept in the vault. Each new deposit is what is left after the bank holds back R of the previous one, so the total after n deposits is D x (1 − (1 − R)^n) / R. Put the ratio at 10% and the deposits at 3 and you should see the video’s 2,710. Then add more deposits and watch how slowly the rest arrives.',
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
          label: 'Deposits in the chain (n)',
          min: 1,
          max: 40,
          step: 1,
          defaultValue: 3,
          format: 'number',
          hint: 'The video stops at three: 1,000, 900 and 810',
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
        description: 'Rebuild the video with 3 deposits, then see how far 20 gets you',
        requiredObservations: [{ sliderKey: 'rounds', values: [3, 20] }],
      },
      explanation:
        'Three deposits at a 10% ratio reach 2,710 — only 27% of the 10,000 ceiling. Twenty reach 8,784. The textbook figure of "ten times the gold" is a limit the chain keeps approaching and never quite reaches, because every new deposit is smaller than the last. Notice too that the gold stays at 1,000 wherever you put the sliders.',
    },
    {
      id: 'mc-the-limit',
      type: 'multiple_choice',
      tags: ['money-creation', 'multiplier'],
      xp: 25,
      prompt:
        'Sal stops the chain by choice: he keeps the last 810 as reserves instead of lending 729 of it. If he had kept lending 90% of every new deposit forever, what total would deposits have approached?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'tenk', label: '10,000 — the original 1,000 divided by the reserve ratio' },
        {
          id: 'infinite',
          label: 'They would grow without limit, since each loan creates another deposit',
          feedback:
            'Each new deposit is 90% of the one before, so the additions keep shrinking and the total has a limit: 1,000 + 900 + 810 + 729 + … gets ever closer to 10,000.',
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
            'It is slowing, but slowly. The next deposits add 729, 656, 590 and so on; together they add up to another 7,290.',
        },
      ],
      correctOptionId: 'tenk',
      explanation:
        'Limit = D / R = 1,000 / 0.1 = 10,000. Compare that with 2,710: the video’s dramatic near-tripling of the money supply is barely a quarter of what the same 1,000 gold pieces could support. Real systems sit well below the ceiling too, because borrowers must want the loans and banks must want to make them.',
    },
    {
      id: 'mc-slack',
      type: 'multiple_choice',
      tags: ['reserves', 'money-creation'],
      xp: 30,
      prompt:
        'With the chain stopped, the vault holds 1,000 gold pieces against 2,710 of deposits. If the rule says reserves must be at least 10% of deposits, what does that tell you about Sal’s position?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'slack',
          label: 'His reserves are about 37% of deposits — far more than required, so he could lend a great deal more',
        },
        {
          id: 'tight',
          label: 'He is exactly at the limit, since 1,000 of gold backs 2,710 of deposits',
          feedback:
            'Work out the ratio: 1,000 divided by 2,710 is about 37%, not 10%. He holds nearly four times the gold the rule demands.',
        },
        {
          id: 'breach',
          label: 'He is breaking the rule — he owes 2,710 and has only 1,000',
          feedback:
            'Owing more than you hold in cash is how fractional reserve banking works, not a breach of it. The rule asks for 10% of deposits, and he has 37%.',
        },
        {
          id: 'depends',
          label: 'You cannot say without knowing whether the loans are good',
          feedback:
            'Loan quality decides whether he is solvent — whether his assets cover what he owes. The reserve ratio is a separate question, and these two numbers are enough to answer it.',
        },
      ],
      correctOptionId: 'slack',
      explanation:
        '1,000 / 2,710 is about 37%. The rule requires only 271 (10% of 2,710), so Sal holds about 729 gold pieces more than he must — what a modern balance sheet calls excess reserves. He stopped lending because he chose to, not because a rule stopped him. That difference between a limit that binds and one that does not comes back with the modern Fed.',
    },
  ],
  keyTakeaways: [
    'Fractional reserve banking multiplies deposits without creating any new base money.',
    'M0 counts the gold; M1 counts what people believe they hold.',
    'The multiplier works under a gold standard too — it is not a property of paper.',
  ],
});
