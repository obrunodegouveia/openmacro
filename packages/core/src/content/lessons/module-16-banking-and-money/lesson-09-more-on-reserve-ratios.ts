import { defineLesson } from '../../schema';

/** Video 9. Working the ratio backwards to find the maximum balance sheet, and separating liquidity from solvency. */
export const kabMoreOnReserveRatiosLesson = defineLesson({
  id: 'kab-more-on-reserve-ratios',
  title: 'Working the Ratio Backwards',
  subtitle:
    '300 of reserves and a 10% rule. How big can the bank grow under the rule? And does big mean safe?',
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
        'The bank has 300 gold pieces of reserves. The rule says reserves must be at least 10% of demand deposits. What is the most that all its demand deposits can add up to?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'three-thousand', label: '3,000, because 10% of 3,000 is exactly 300' },
        {
          id: 'thirty',
          label: '30',
          feedback:
            'That is 10% of the reserves. The rule works the other way: the reserves must be at least 10% of the deposits. So divide, do not multiply.',
        },
        {
          id: 'three-hundred',
          label: '300, because deposits cannot be more than reserves',
          feedback:
            'That would be full reserve banking, where every deposit is fully covered. Videos 18 and 24 talk about it. But it is not what a 10% rule means.',
        },
        {
          id: 'two-seven',
          label: '2,700, which is 3,000 minus the 300 of reserves',
          feedback:
            'You do not take anything away. The reserves are the 10%. The 3,000 is the total of all demand deposits, including the ones the bank already has.',
        },
      ],
      correctOptionId: 'three-thousand',
      explanation:
        'Divide the reserves by the ratio: 300 ÷ 0.1 = 3,000. In the video, the first 100 of deposits plus new loans of 900 and then 2,000 add up to exactly 3,000. Then the bank is at its limit, or “maxed out”, as Sal says.',
    },
    {
      id: 'match-liquid-solvent',
      type: 'concept_match',
      tags: ['liquidity', 'solvency'],
      xp: 25,
      prompt: 'Match each word to what it tells you about a bank.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'liquid',
          term: 'Liquid',
          definition: 'Can give cash today to anyone who asks for it',
        },
        {
          id: 'solvent',
          term: 'Solvent',
          definition: 'Owns more than it owes, if it has enough time to sell what it owns',
        },
        {
          id: 'reserve-req',
          term: 'Reserve requirement',
          definition: 'The rule that helps a bank stay liquid',
        },
        {
          id: 'leverage-req',
          term: 'Leverage limit',
          definition: 'The rule that helps a bank stay solvent: how much loss it can take',
        },
      ],
      explanation:
        'A bank can fail in two different ways, so there are two different rules. Reserves answer “Can you pay this afternoon?” Leverage answers “How much can your loans lose before you are finished?” The next video looks at the second question.',
    },
    {
      id: 'mc-where-reserves-came-from',
      type: 'multiple_choice',
      tags: ['reserves', 'equity'],
      xp: 30,
      prompt:
        'The bank has 300 gold pieces of reserves. But customers only ever deposited 100 gold pieces. Where did the other 200 come from?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'equity',
          label: 'From Sal’s own pocket: the equity he started the bank with',
        },
        {
          id: 'loans',
          label: 'From the loans he made, which paid interest',
          feedback:
            'The loans have not been paid back, and no interest has come in yet. Look at the first balance sheet, before any lending.',
        },
        {
          id: 'created',
          label: 'He created it, the same way he creates deposits',
          feedback:
            'He can create promises to pay gold just by writing them. He cannot create gold. Here, reserves are the gold itself.',
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
        'Reserves do not have to come from depositors. Equity is the owner’s own money, and nobody can ask for it back. So Sal’s own 200 of gold counts as reserves, just like the 100 the depositors brought.',
    },
    {
      id: 'mc-maxed-out',
      type: 'multiple_choice',
      tags: ['liquidity', 'solvency'],
      xp: 30,
      prompt:
        'The bank has lent up to the limit: 3,000 of demand deposits and 300 of gold. It owns 3,300 in total, and its loans are good. Depositors with 400 gold pieces in their accounts come in and ask for gold. What is the bank’s situation?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'illiquid',
          label: 'Illiquid but solvent: it cannot pay them all today, but it can pay everyone in time',
        },
        {
          id: 'insolvent',
          label: 'Insolvent, because it owes 3,000 and has only 300 of gold',
          feedback:
            'Owing more on demand than you have in cash is how banking works. Insolvent means owning less than you owe. Here the bank owns 3,300 and owes 3,000.',
        },
        {
          id: 'fine',
          label: 'Fine, because it keeps exactly the 10% the rule asks for',
          feedback:
            'It followed the rule and still cannot pay. The rule assumed people would not ask for more than 10% of deposits at once. 400 out of 3,000 is more than 13%.',
        },
        {
          id: 'breach',
          label: 'Breaking the reserve rule that the regulator set',
          feedback:
            'It had exactly 10% at the start of the day. Not being able to pay an unusually big demand is not the same as breaking the rule.',
        },
      ],
      correctOptionId: 'illiquid',
      explanation:
        'Keep these two words apart. Solvent asks: does the bank own more than it owes? Liquid asks: can it pay what people ask for today? A solvent bank that cannot pay today can be saved with a loan. An insolvent bank cannot be saved by any loan. The next video asks how much a bank can lose before it becomes insolvent.',
    },
    {
      id: 'mc-double-the-ratio',
      type: 'multiple_choice',
      tags: ['reserves', 'regulation'],
      xp: 25,
      prompt:
        'The bank still has 300 of gold, but the rule goes up from 10% to 20%. What is the most the bank can now owe in demand deposits?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'fifteen', label: '1,500 of deposits, half of what it could have before' },
        {
          id: 'three',
          label: 'Still 3,000, because the gold has not changed',
          feedback:
            'The gold has not changed, but the rule has. Now it is 300 ÷ 0.20, not 300 ÷ 0.10.',
        },
        {
          id: 'six',
          label: '6,000, because doubling the ratio doubles what the bank can owe',
          feedback:
            'Check which way the ratio works. A higher rule means more gold for each promise, so fewer promises.',
        },
        {
          id: 'sixhundred',
          label: '600, which is 20% of 3,000',
          feedback:
            'That is the gold the bank would need for 3,000 of deposits, and it only has 300. Divide instead: 300 ÷ 0.20.',
        },
      ],
      correctOptionId: 'fifteen',
      explanation:
        'Doubling the rule halves the maximum, from 3,000 to 1,500. A bank already at the old limit would have to cut 1,500 of deposits, which means cutting 1,500 of loans. That is a very rough tool. So central banks rarely use it and change interest rates instead. Video 16 explains why.',
    },
  ],
  keyTakeaways: [
    'The most deposits a bank can have = its reserves ÷ the required ratio.',
    'Reserve rules help a bank pay today (liquidity). Leverage limits help it survive losses (solvency).',
    'A bank at its reserve limit cannot lend more until it gets more reserves.',
  ],
});
