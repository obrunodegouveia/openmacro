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
    // ---- Olivia warm-ups --------------------------------------------------
    // Sal lends the same gold again and again until 1,000 coins back 2,710 of
    // deposits. These five do it with Olivia’s €50 at the bank Breno opens in
    // the back of his music shop: her deposit is his debt, he lends most of it
    // on, it comes back as another deposit, and the town’s accounts add up to
    // more than the coins that exist.
    {
      id: 'olivia-deposit-mirror',
      type: 't_account_flow',
      speaker: 'olivia',
      kids: true,
      xp: 15,
      tags: ['basics', 'deposits', 'balance-sheet'],
      prompt:
        'Breno opens a little bank in the back of his music shop. Olivia takes €50 out of her piggy bank and puts it in Breno’s Bank. Post it on both their lists.',
      instructions: 'Pick an entry, then choose whose list it belongs on. Four entries in total.',
      scenario:
        'Olivia sold her T-shirts at the talent show, so her piggy bank now holds €55. She still owes Breno’s shop €40 for the amp. She hands €50 of coins to Breno, who locks them in his strong safe and writes “Olivia: €50” in his book.',
      currency: 'EUR',
      entities: [
        {
          id: 'olivia',
          label: 'Olivia',
          tier: 'person',
          role: 'Singer-songwriter, 12, saving for her first gig',
          openingLines: [
            { account: 'Guitar', side: 'asset', amount: 30 },
            { account: 'Amp', side: 'asset', amount: 40 },
            { account: 'Piggy bank', side: 'asset', amount: 55 },
            { account: 'Owed to Breno’s shop', side: 'liability', amount: 40 },
            { account: 'Equity', side: 'liability', amount: 85, equity: true },
          ],
        },
        {
          id: 'bank',
          label: 'Breno’s Bank',
          tier: 'commercial_bank',
          role: 'A strong safe in the back of the music shop',
          openingLines: [
            { account: 'Safe', side: 'asset', amount: 10 },
            { account: 'Equity', side: 'liability', amount: 10, equity: true },
          ],
        },
      ],
      options: [
        {
          id: 'olivia-piggy-down',
          shift: { entityId: 'olivia', side: 'asset', account: 'Piggy bank', delta: -50 },
        },
        {
          id: 'olivia-account-up',
          shift: { entityId: 'olivia', side: 'asset', account: 'Money at Breno’s Bank', delta: 50 },
        },
        {
          id: 'bank-safe-up',
          shift: { entityId: 'bank', side: 'asset', account: 'Safe', delta: 50 },
        },
        {
          id: 'bank-owes-up',
          shift: { entityId: 'bank', side: 'liability', account: 'Owed to Olivia', delta: 50 },
        },
        {
          id: 'olivia-equity-down',
          shift: { entityId: 'olivia', side: 'liability', account: 'Equity', delta: -50, equity: true },
          feedback:
            'Olivia did not lose anything. She swapped coins in her piggy bank for €50 that Breno’s Bank owes her, so what is truly hers stays the same.',
        },
        {
          id: 'bank-equity-up',
          shift: { entityId: 'bank', side: 'liability', account: 'Equity', delta: 50, equity: true },
          feedback:
            'The coins are in Breno’s safe, but they are not his. He has to give them back whenever Olivia asks, so they are something he owes.',
        },
      ],
      expectedShifts: [
        { entityId: 'olivia', side: 'asset', account: 'Piggy bank', delta: -50 },
        { entityId: 'olivia', side: 'asset', account: 'Money at Breno’s Bank', delta: 50 },
        { entityId: 'bank', side: 'asset', account: 'Safe', delta: 50 },
        { entityId: 'bank', side: 'liability', account: 'Owed to Olivia', delta: 50 },
      ],
      explanation:
        'Her deposit is a mirror: for Olivia it is an asset — money the bank owes her — and for Breno’s Bank the very same €50 is a liability. Nobody got richer. That is exactly how Sal draws his bank: the gold in the vault on the left, and the deposits it owes on the right.',
    },
    {
      id: 'olivia-whose-coins',
      type: 'multiple_choice',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'deposits', 'liabilities'],
      prompt:
        'Olivia’s €50 of coins is now locked in Breno’s safe. For Breno’s Bank, what is the €50 he wrote next to her name?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'owes', label: 'A debt — he owes Olivia €50 whenever she asks for it' },
        {
          id: 'his',
          label: 'His money now — it is in his safe',
          feedback:
            'Holding the coins does not make them his. Olivia can walk in and ask for her €50 back at any time.',
        },
        {
          id: 'gift',
          label: 'A present from Olivia to the bank',
          feedback:
            'She did not give it away. She is keeping it at the bank, and the line in Breno’s book says so.',
        },
        {
          id: 'nothing',
          label: 'Nothing — it is only a line written in a book',
          feedback:
            'That line is a promise to pay €50, and promises to pay are what a bank’s book is made of. It counts.',
        },
      ],
      correctOptionId: 'owes',
      explanation:
        'Every deposit is something the bank owes back. Sal’s bank owes its depositors every one of their gold pieces, even while it is lending some of them out.',
    },
    {
      id: 'olivia-lend-it-on',
      type: 'order_flow',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'lending', 'deposits'],
      prompt:
        'Breno knows Olivia will not ask for all €50 at once. Put what happens next in order.',
      instructions: 'Drag the steps into order',
      events: [
        {
          id: 'deposit',
          label: 'Olivia deposits €50',
          detail: 'Her coins go into Breno’s safe.',
        },
        {
          id: 'keep',
          label: 'Breno keeps €10 in the safe',
          detail: 'Enough for Olivia if she needs a little back.',
        },
        {
          id: 'lend',
          label: 'Breno lends €40 to Dona Rosa',
          detail: 'Her bakery’s oven needs fixing.',
        },
        {
          id: 'pay',
          label: 'Dona Rosa pays the oven repairer €40',
        },
        {
          id: 'redeposit',
          label: 'The repairer deposits €40 at Breno’s Bank',
          detail: 'Back into the same safe.',
        },
      ],
      correctOrder: ['deposit', 'keep', 'lend', 'pay', 'redeposit'],
      explanation:
        'The same coins went round a loop: from Olivia, to Dona Rosa, to the repairer and back into the safe. Sal’s video is this loop again and again — lend, redeposit, lend again.',
    },
    {
      id: 'olivia-accounts-add-up',
      type: 'multiple_choice',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'deposits', 'money-creation'],
      prompt:
        'Olivia’s account at Breno’s Bank says €50. The oven repairer’s account says €40. How much money do the accounts at Breno’s Bank add up to now?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'ninety', label: '€90' },
        {
          id: 'fifty',
          label: '€50',
          feedback:
            '€50 is the coins Olivia brought. But Olivia still has €50 in her account and the repairer has €40 in his. Add both accounts.',
        },
        {
          id: 'forty',
          label: '€40',
          feedback: '€40 is only the repairer’s account. Olivia’s €50 is still hers too.',
        },
        {
          id: 'onethirty',
          label: '€130',
          feedback:
            'Dona Rosa’s €40 loan is not an account: she spent it on the oven. Only Olivia’s €50 and the repairer’s €40 are in accounts.',
        },
      ],
      correctOptionId: 'ninety',
      explanation:
        '€50 + €40 = €90 in accounts. Both of them can spend their money, so to the town it feels like €90. Sal gets 2,710 of deposits out of 1,000 gold pieces the same way.',
    },
    {
      id: 'olivia-coins-in-town',
      type: 'multiple_choice',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'money-creation'],
      prompt:
        'Olivia brought €50 of coins, and now the accounts add up to €90. How many new coins were made along the way?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'none', label: 'None — the same coins went round the loop and came back' },
        {
          id: 'forty',
          label: '€40 of new coins, for the repairer’s account',
          feedback:
            'The repairer deposited the very coins Breno had lent to Dona Rosa. They came out of the safe and went back in.',
        },
        {
          id: 'ninety',
          label: '€90 of new coins — one for every euro in the accounts',
          feedback:
            'Nobody can make coins at a bank, not even Breno. There are simply more euros in the accounts than there are coins.',
        },
        {
          id: 'fifty',
          label: '€50 of new coins, to match Olivia’s deposit',
          feedback:
            'Olivia’s coins were already real before she brought them. Putting them in the safe did not make any more.',
        },
      ],
      correctOptionId: 'none',
      explanation:
        'Not a single new coin — yet €90 in accounts instead of €50. Lending made more money in accounts without making more coins. Sal’s first question below asks the same thing about his gold.',
    },
    // ---- Sal’s bank ---------------------------------------------------------
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
