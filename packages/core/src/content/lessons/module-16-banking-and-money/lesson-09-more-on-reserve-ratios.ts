import { defineLesson } from '../../schema';

/** Video 9. Working the ratio backwards to find the maximum balance sheet, and separating liquidity from solvency. */
export const kabMoreOnReserveRatiosLesson = defineLesson({
  id: 'kab-more-on-reserve-ratios',
  title: 'Working the Ratio Backwards',
  subtitle:
    '300 of reserves and a 10% requirement. How large can the bank legally become — and is large the same as safe?',
  icon: '🧮',
  difficulty: 'core',
  estimatedMinutes: 15,
  video: {
    url: 'https://www.youtube.com/watch?v=DFPBdbx0vFc',
    minutes: 9,
    source: 'Khan Academy — Banking 9 (the audio is poor; the arithmetic is not)',
  },
  challenges: [
    // ---- Olivia warm-ups --------------------------------------------------
    // Sal works the reserve rule backwards: with 300 of gold and a 10% rule,
    // deposits can reach 3,000, and a bank at the limit can still be caught
    // short. These four do the same with Breno’s €30 of coins.
    {
      id: 'olivia-one-in-ten',
      type: 'multiple_choice',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'reserve-ratio'],
      prompt:
        'The town has a rule: a bank must keep at least €1 of coins in its safe for every €10 in its accounts. Breno has €30 of coins. What is the most that all the accounts at his bank can add up to?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'threehundred', label: '€300' },
        {
          id: 'thirty',
          label: '€30',
          feedback:
            'That would be €1 of coins for every €1 in accounts. The rule only asks for €1 for every €10.',
        },
        {
          id: 'three',
          label: '€3',
          feedback: 'That goes the wrong way. Each €1 of coins allows €10 of accounts, so multiply.',
        },
        {
          id: 'forty',
          label: '€40',
          feedback: 'Each of the 30 euros of coins allows €10 of accounts: 30 × €10.',
        },
      ],
      correctOptionId: 'threehundred',
      explanation:
        '€30 × 10 = €300. Every euro in the safe allows €10 of accounts. Sal does the same sum: 300 of gold and a 10% rule allow 3,000 of deposits.',
    },
    {
      id: 'olivia-rule-words',
      type: 'concept_match',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'reserve-ratio'],
      prompt: 'Olivia is learning the bank’s rule. Match each word to what it means at Breno’s Bank.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'coins',
          term: 'Coins in the safe',
          definition: 'Money Breno can hand over today',
        },
        {
          id: 'accounts',
          term: 'Accounts',
          definition: 'What people could ask Breno for today',
        },
        {
          id: 'rule',
          term: 'The 1-in-10 rule',
          definition: 'At least €1 in the safe for every €10 in accounts',
        },
      ],
      explanation:
        'The rule compares the first two: coins in the safe against accounts. Sal calls them reserves and demand deposits, and the rule is a 10% reserve requirement.',
    },
    {
      id: 'olivia-full-up',
      type: 'multiple_choice',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'reserve-ratio', 'lending'],
      prompt:
        'Breno has €30 of coins and €300 in accounts: right at the limit. Dona Rosa asks for another €50 loan, written into her account. Can Breno say yes?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'no', label: 'No — accounts would reach €350, and that needs €35 of coins' },
        {
          id: 'yes-any',
          label: 'Yes — he can write any number he likes',
          feedback:
            'He can write it, but the rule says no. €350 of accounts needs at least €35 of coins, and he has €30.',
        },
        {
          id: 'yes-asset',
          label: 'Yes — the loan is something he owns, so it helps',
          feedback:
            'The loan is something he owns, but it is not coins. The rule only counts coins in the safe.',
        },
        {
          id: 'olivia',
          label: 'Only if Olivia agrees',
          feedback:
            'Olivia does not decide who Breno lends to. The rule does: €1 of coins for every €10 of accounts.',
        },
      ],
      correctOptionId: 'no',
      explanation:
        'A new loan adds a new account, and every €10 of accounts needs €1 of coins. At the limit, Breno must find more coins before he can lend more. Sal’s bank at 3,000 of deposits and 300 of gold is in exactly this spot.',
    },
    {
      id: 'olivia-big-not-safe',
      type: 'multiple_choice',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'liquidity'],
      prompt:
        'Tomás says: “Breno’s Bank has €300 in accounts, so it must be super safe!” On Monday, people with €40 in their accounts all come in and ask for coins. What happens?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'short', label: 'He runs out of coins and must send someone away' },
        {
          id: 'easy',
          label: 'Nothing — €40 is tiny next to €300',
          feedback:
            'Only coins can be handed over, and there are €30 of them. The €300 is mostly loans that are not paid back yet.',
        },
        {
          id: 'loans',
          label: 'He pays them with bits of Dona Rosa’s loan',
          feedback:
            'People asked for coins. A promise from Dona Rosa to pay back later is not something they can spend today.',
        },
        {
          id: 'rule',
          label: 'Nothing goes wrong, because he kept to the rule',
          feedback:
            'The rule sets how big the bank may grow. It does not promise there will be enough coins on a busy day.',
        },
      ],
      correctOptionId: 'short',
      explanation:
        'Big is not the same as safe. A bank that keeps to the rule can still run short of coins on a day when many people ask at once. Sal shows the same: 3,000 of deposits, 300 of gold, and 400 asked for.',
    },
    // ---- Sal’s bank ---------------------------------------------------------
    {
      id: 'mc-max-deposits',
      type: 'multiple_choice',
      tags: ['reserve-ratio', 'arithmetic'],
      xp: 25,
      prompt:
        'The bank holds 300 gold pieces of reserves, and reserves must be at least 10% of demand deposits. What is the most its demand deposits can add up to, in total?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'three-thousand', label: '3,000 — because 10% of 3,000 is exactly 300' },
        {
          id: 'thirty',
          label: '30',
          feedback:
            'That takes 10% *of* the reserves. The requirement runs the other way: reserves must be at least 10% of deposits, so divide rather than multiply.',
        },
        {
          id: 'three-hundred',
          label: '300 — deposits cannot exceed reserves',
          feedback:
            'That would be full reserve banking — a real alternative, discussed in videos 18 and 24 — but not what a 10% requirement means.',
        },
        {
          id: 'two-seven',
          label: '2,700 — 3,000 minus the 300 of reserves',
          feedback:
            'Nothing is subtracted. The reserves are the 10%; the 3,000 is the total of all demand deposits, including any already on the books.',
        },
      ],
      correctOptionId: 'three-thousand',
      explanation:
        'Reserves ÷ ratio gives the ceiling: 300 ÷ 0.1 = 3,000. In the video, the original 100 of deposits plus new loans of 900 and then 2,000 reach it exactly, and the bank is then at its limit — "maxed out", in the video’s phrase.',
    },
    {
      id: 'match-liquid-solvent',
      type: 'concept_match',
      tags: ['liquidity', 'solvency'],
      xp: 25,
      prompt: 'Match each term to what it actually asks about a bank.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'liquid',
          term: 'Liquid',
          definition: 'Can hand over cash to whoever asks for it today',
        },
        {
          id: 'solvent',
          term: 'Solvent',
          definition: 'Assets are worth more than liabilities, given enough time to realise them',
        },
        {
          id: 'reserve-req',
          term: 'Reserve requirement',
          definition: 'The rule aimed at keeping a bank liquid',
        },
        {
          id: 'leverage-req',
          term: 'Leverage limit',
          definition: 'The rule aimed at keeping a bank solvent — how much loss it can absorb',
        },
      ],
      explanation:
        'Two different failures need two different rules. Reserves answer "can you pay this afternoon?"; leverage answers "how badly can your loans go before you are finished?". The next video takes up the second question.',
    },
    {
      id: 'mc-where-reserves-came-from',
      type: 'multiple_choice',
      tags: ['reserves', 'equity'],
      xp: 30,
      prompt:
        'The bank holds 300 gold pieces of reserves, but customers only ever deposited 100 gold pieces. Where did the other 200 come from?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'equity',
          label: 'From Sal’s own pocket — the equity he started the bank with',
        },
        {
          id: 'loans',
          label: 'From the loans he made, which paid interest',
          feedback:
            'The loans have not been repaid and no interest has arrived yet. Look at the opening balance sheet, before any lending happened.',
        },
        {
          id: 'created',
          label: 'He created it, the same way he creates deposits',
          feedback:
            'He can create claims on gold with a pen. He cannot create gold — and reserves, in this world, are the metal itself.',
        },
        {
          id: 'central',
          label: 'He borrowed it from another bank',
          feedback:
            'There is no other bank in this example. This gold is his own.',
        },
      ],
      correctOptionId: 'equity',
      explanation:
        'Reserves do not have to come from depositors. Equity is money the owner put in and nobody can demand back, so gold bought with it makes a very reliable reserve. Sal’s 200 of his own gold counts towards the reserve requirement just like the 100 that depositors brought, and nobody can ask for it back.',
    },
    {
      id: 'mc-maxed-out',
      type: 'multiple_choice',
      tags: ['liquidity', 'solvency'],
      xp: 30,
      prompt:
        'The bank has lent to the limit: 3,000 of demand deposits against 300 of gold. Its total assets are 3,300 and its loans are sound. Depositors with 400 gold pieces in their accounts turn up asking for gold. What is the bank’s position?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'illiquid',
          label: 'Illiquid but solvent — it cannot pay them all today, but it can pay everyone in time',
        },
        {
          id: 'insolvent',
          label: 'Insolvent, because it owes 3,000 and holds 300',
          feedback:
            'Owing more on demand than you hold in cash is how the business is designed. Insolvency means assets worth less than liabilities, and here they are 3,300 against 3,000.',
        },
        {
          id: 'fine',
          label: 'Fine — it holds exactly the 10% the regulator asked for',
          feedback:
            'It has obeyed the rule and still cannot pay. The rule was a bet that no more than 10% of deposits would be asked for at once, and 400 out of 3,000 is over 13%.',
        },
        {
          id: 'breach',
          label: 'In breach of the reserve requirement the regulator set',
          feedback:
            'It held exactly 10% when the day started. Being unable to meet an unusually large demand is not the same as having broken the rule.',
        },
      ],
      correctOptionId: 'illiquid',
      explanation:
        'Keep the two words apart, because almost every argument about a banking crisis turns on which one applies. Solvency asks whether the assets are worth more than the liabilities; liquidity asks whether you can pay what is demanded today. A solvent bank that cannot pay today can be saved by a loan. An insolvent one cannot be saved by any amount of lending, and the next video is about how much loss a bank can take before it becomes insolvent.',
    },
    {
      id: 'mc-double-the-ratio',
      type: 'multiple_choice',
      tags: ['reserves', 'regulation'],
      xp: 25,
      prompt:
        'Same 300 of gold, but the requirement is raised from 10% to 20%. What is the most the bank can now owe in demand deposits?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'fifteen', label: '1,500 of deposits — half what it could support before' },
        {
          id: 'three',
          label: '3,000 still, since the gold has not changed',
          feedback:
            'The gold is the numerator and it has not changed. The rule changed what multiple of it may be promised: 300 / 0.20 rather than 300 / 0.10.',
        },
        {
          id: 'six',
          label: '6,000 — doubling the ratio doubles the capacity',
          feedback:
            'Check which way round the ratio works. A higher reserve requirement means more gold per promise, so fewer promises.',
        },
        {
          id: 'sixhundred',
          label: '600 — twenty per cent of 3,000',
          feedback:
            'That is what the bank would need to hold against 3,000 of deposits, and it only has 300. Divide instead: 300 / 0.20.',
        },
      ],
      correctOptionId: 'fifteen',
      explanation:
        'Doubling the requirement halves the maximum, from 3,000 to 1,500. A bank already at the old limit would have to shrink its deposits by 1,500, which means cutting 1,500 of loans. That is a huge and blunt lever, and it is one reason central banks rarely use it and steer interest rates instead. Video 16 explains why they target a rate.',
    },
  ],
  keyTakeaways: [
    'Maximum deposits equal reserves divided by the required ratio.',
    'Reserve requirements target liquidity; leverage limits target solvency.',
    'A bank at its reserve limit has no room to lend without new reserves.',
  ],
});
