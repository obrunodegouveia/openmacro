import { defineLesson } from '../../schema';

/**
 * Gold €1,232,838m against revaluation accounts €1,208,186m and capital and
 * reserves of €28,202m, all as at 28 August 2026. The Fed's gold certificate
 * account was $11,037m on 2 September 2026, carried at the statutory $42.2222
 * per fine troy ounce fixed in 1973.
 */
export const goldAndRevaluationLesson = defineLesson({
  id: 'ecb-gold-and-revaluation',
  title: 'A Fifth of the ECB Is Gold',
  subtitle:
    'Why the same metal is worth €1.2 trillion in Frankfurt and $11 billion in Washington.',
  icon: '🪙',
  difficulty: 'advanced',
  estimatedMinutes: 8,
  challenges: [
    {
      id: 'mc-why-the-gap',
      type: 'multiple_choice',
      tags: ['gold', 'accounting', 'ecb'],
      xp: 15,
      prompt:
        'The Eurosystem carries €1,232,838m of gold. The Fed carries $11,037m. The United States holds more gold than any euro area country. What explains the gap?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'sold',
          label: 'The Fed sold most of its gold decades ago',
          feedback:
            'It did not. The US official holding has been roughly unchanged since the 1970s — around 261 million ounces. What changed is the number it is written down at.',
        },
        {
          id: 'statutory-price',
          label: 'The Fed values gold at a statutory $42.22 an ounce; the ECB marks it to market',
        },
        {
          id: 'treasury-owns',
          label: 'The gold belongs to the US Treasury, not the Fed',
          feedback:
            'True, and interesting — the Fed holds *certificates* against Treasury gold rather than the metal. But that is why the line is called a certificate account, not why it is small. The certificates are issued at the same statutory price.',
        },
        {
          id: 'ecb-bought',
          label: 'The ECB has been buying gold aggressively',
          feedback:
            'Eurosystem gold moved by exactly zero that week, and it moves rarely. Its euro value changes because the price does, not because the tonnage does.',
        },
      ],
      correctOptionId: 'statutory-price',
      explanation:
        'The Gold Reserve Act price of $42.2222 per fine troy ounce was set in 1973 and never revised. The Eurosystem revalues its gold at market prices every quarter. Two central banks, comparable metal, and one of them is reporting a number from the Nixon administration.',
    },

    {
      id: 'mc-revaluation-accounts',
      type: 'multiple_choice',
      tags: ['ecb', 'accounting', 'capital'],
      xp: 20,
      prompt:
        'The Eurosystem shows revaluation accounts of €1,208,186m and capital and reserves of €28,202m. What is the €1.21 trillion?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'profits',
          label: 'Accumulated profits from decades of operations',
          feedback:
            'Realised profits are distributed to national governments each year. This line is the opposite: gains that have never been realised and mostly never will be.',
        },
        {
          id: 'unrealised',
          label: 'Unrealised gains on gold and foreign currency, held apart from profit',
        },
        {
          id: 'bailout',
          label: 'A reserve set aside against losses on the bond portfolio',
          feedback:
            'There are provisions for that, and they are far smaller. Revaluation accounts arise from marking assets up, not from anticipating losses.',
        },
        {
          id: 'seigniorage',
          label: 'Seigniorage on banknotes not yet passed to governments',
        },
      ],
      correctOptionId: 'unrealised',
      explanation:
        'When the gold price rises, the gain goes here rather than into profit — it cannot be spent, distributed, or counted as income until the metal is actually sold. The result is a central bank whose paid-in capital is €28bn while it sits on €1.21tn of paper gains, and the accounting rules keep those two numbers strictly apart on purpose.',
    },

    {
      id: 'gold-posting',
      type: 't_account_flow',
      tags: ['gold', 'accounting', 'ecb'],
      xp: 25,
      prompt: 'The gold price rises 10%. Post the quarterly revaluation.',
      instructions:
        'One entity, two lines. Nothing was bought and nothing was sold.',
      scenario:
        'At the quarter end the Eurosystem revalues its €1.23tn of gold at the market price. The price is 10% higher than at the last revaluation, so the holding is written up by roughly €123bn.',
      currency: 'EUR',
      entities: [
        {
          id: 'eurosystem',
          label: 'Eurosystem',
          tier: 'central_bank',
          role: 'ECB plus twenty national central banks',
          openingLines: [
            { account: 'Gold and gold receivables', side: 'asset', amount: 1232838000000 },
            { account: 'Securities held for monetary policy purposes', side: 'asset', amount: 3363311000000 },
            { account: 'Revaluation accounts', side: 'liability', amount: 1208186000000 },
            { account: 'Capital and reserves', side: 'liability', amount: 28202000000 },
          ],
        },
        {
          id: 'market',
          label: 'The Gold Market',
          tier: 'fiduciary_core',
          role: 'Where the price is set — and nothing is traded here today',
          openingLines: [
            { account: 'Bullion held by others', side: 'asset', amount: 5000000000000 },
          ],
        },
      ],
      options: [
        {
          id: 'gold-up',
          shift: {
            entityId: 'eurosystem',
            side: 'asset',
            account: 'Gold and gold receivables',
            delta: 123000000000,
          },
        },
        {
          id: 'reval-up',
          shift: {
            entityId: 'eurosystem',
            side: 'liability',
            account: 'Revaluation accounts',
            delta: 123000000000,
          },
        },
        {
          id: 'capital-up',
          shift: {
            entityId: 'eurosystem',
            side: 'liability',
            account: 'Capital and reserves',
            delta: 123000000000,
          },
          feedback:
            'This is the entry the rules exist to prevent. An unrealised gain that flowed into capital could be paid out to governments as profit — which would mean distributing money the Eurosystem has not actually received, on the strength of a price that can fall again.',
        },
        {
          id: 'market-down',
          shift: {
            entityId: 'market',
            side: 'asset',
            account: 'Bullion held by others',
            delta: -123000000000,
          },
          feedback:
            'Nobody lost anything. A revaluation is not a transfer — no counterparty is on the other side of it, which is exactly what makes it different from every other posting in this course.',
        },
      ],
      expectedShifts: [
        {
          entityId: 'eurosystem',
          side: 'asset',
          account: 'Gold and gold receivables',
          delta: 123000000000,
        },
        {
          entityId: 'eurosystem',
          side: 'liability',
          account: 'Revaluation accounts',
          delta: 123000000000,
        },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'unchanged',
          note: 'No reserves and no banknotes were created. The balance sheet grew without issuing a single euro of money.',
        },
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'No deposit anywhere in the euro area moved.',
        },
        {
          aggregate: 'collateral',
          direction: 'expand',
          note: 'The same metal now backs more euros of value, which matters if the Eurosystem ever has to lean on it.',
        },
      ],
      explanation:
        'This is the one entry in the whole course with no counterparty. Every other posting you have made moved a claim from one balance sheet to another; this one conjures €123bn out of a price quote. It is also why "the central bank’s balance sheet grew" is a claim worth checking: sometimes it grew because it bought something, and sometimes because gold went up.',
    },

    {
      id: 'mc-does-it-matter',
      type: 'multiple_choice',
      tags: ['gold', 'capital', 'ecb'],
      xp: 15,
      prompt:
        'Suppose the Eurosystem takes €50bn of losses on its bond portfolio. Its capital is €28bn. Is it insolvent?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'yes',
          label: 'Yes — losses exceed capital, which is the definition',
          feedback:
            'That is the definition for a commercial bank, whose creditors can demand something the bank must go and find. A central bank’s main liabilities are euros, and it makes those.',
        },
        {
          id: 'no-can-issue',
          label: 'No — its liabilities are the currency, and negative capital does not stop it issuing them',
        },
        {
          id: 'no-gold',
          label: 'No — it would sell gold to cover the loss',
          feedback:
            'It could, and that would turn an unrealised gain into a realised one. But it does not have to, and the answer does not depend on the gold being there.',
        },
        {
          id: 'depends',
          label: 'Only if the national central banks refuse to recapitalise it',
        },
      ],
      correctOptionId: 'no-can-issue',
      explanation:
        'Several central banks have run negative capital for years — the Czech National Bank and the Swiss National Bank among them — and their currencies did not stop working. What losses actually cost is the remittance to governments, which stops until the hole is filled. The constraint is political and fiscal, not an accounting one.',
    },
  ],
  keyTakeaways: [
    'The Fed values gold at a 1973 statutory price; the Eurosystem marks it to market quarterly.',
    'Revaluation accounts — €1.21tn — hold unrealised gains apart from profit so they cannot be distributed.',
    'A revaluation is the only posting in this course with no counterparty on the other side.',
    'Capital of €28bn does not make a central bank fragile: its liabilities are the money it issues.',
  ],
});
