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
    {
      id: 'mc-max-deposits',
      type: 'multiple_choice',
      tags: ['reserve-ratio', 'arithmetic'],
      xp: 25,
      prompt:
        'The bank holds 300 gold pieces of reserves and the requirement is 10%. What is the largest its demand deposits can be?',
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
            'That would be full reserve banking, a real alternative discussed in the final video, but not what a 10% requirement means.',
        },
        {
          id: 'two-seven',
          label: '2,700, since 300 is already deposited',
          feedback:
            'The 3,000 ceiling is the total of demand deposits, and the 100 of customer deposits already counts toward it. The limit is on the total, not on new lending on top of it.',
        },
      ],
      correctOptionId: 'three-thousand',
      explanation:
        'Reserves ÷ ratio gives the ceiling: 300 ÷ 0.1 = 3,000. Lending 900 and then 2,000 on top of the original 100 of deposits reaches it exactly, and the bank is then at its limit — maxed out, in the video’s phrase.',
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
        'Two different failures need two different rules. Reserves answer "can you pay this afternoon"; leverage answers "how wrong can your loans be before you are finished". The next video takes up the second question.',
    },
    {
      id: 'mc-where-reserves-came-from',
      type: 'multiple_choice',
      tags: ['reserves', 'equity'],
      xp: 30,
      prompt:
        'The bank holds 300 gold pieces of reserves, but only 100 gold was ever deposited with it. Where did the other 200 come from?',
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
          label: 'He borrowed it from one of the other banks in the village',
          feedback:
            'There are no other banks yet; that arrives in video 11. This gold is his own.',
        },
      ],
      correctOptionId: 'equity',
      explanation:
        'Reserves do not have to come from depositors. Equity is cash the owner put in and nobody can demand back, so it makes the most reliable reserve there is — which is exactly why a well capitalised bank can support a larger balance sheet. Sal’s 200 of own gold is doing the same job as the 100 belonging to depositors, and doing it without being a claim on anyone.',
    },
    {
      id: 'mc-maxed-out',
      type: 'multiple_choice',
      tags: ['liquidity', 'solvency'],
      xp: 30,
      prompt:
        'The bank has lent to the limit: 3,000 of demand deposits against 300 of gold, with 3,300 of assets. Holders of 400 gold pieces of deposits turn up wanting metal. What is the bank’s position?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'illiquid',
          label: 'Illiquid but solvent — it cannot pay today, but it is good for it',
        },
        {
          id: 'insolvent',
          label: 'Insolvent, because it owes 3,000 and holds 300',
          feedback:
            'Owing more on demand than you hold in cash is the design of the business. Insolvency means assets worth less than liabilities, and here they are 3,300 against 3,000.',
        },
        {
          id: 'fine',
          label: 'Fine — it holds exactly the 10% the regulator asked for',
          feedback:
            'It has obeyed the rule and still cannot pay. The rule was a bet that no more than 10% would ask at once, and 400 out of 3,000 is over 13%.',
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
        'Hold the two words apart, because almost every argument about a banking crisis turns on which one applies. Solvency asks whether the assets are worth more than the liabilities; liquidity asks whether you can pay what is demanded today. A solvent bank that cannot pay today can be saved by a loan. An insolvent one cannot be saved by any amount of lending, and the next video is about how you tell.',
    },
    {
      id: 'mc-double-the-ratio',
      type: 'multiple_choice',
      tags: ['reserves', 'regulation'],
      xp: 25,
      prompt:
        'Same 300 of gold, but the requirement is raised from 10% to 20%. What is the largest balance sheet the bank can now support?',
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
        'Doubling the requirement halves the balance sheet, and it does so without anyone lending or repaying a thing — 1,500 of the bank’s existing loans would have to go. That is an enormous lever, and it is the reason central banks stopped pulling it: changing reserve requirements forces abrupt, blunt contractions, which is why the modern toolkit reaches for interest rates instead. Video 16 makes that argument directly.',
    },
  ],
  keyTakeaways: [
    'Maximum deposits equal reserves divided by the required ratio.',
    'Reserve requirements target liquidity; leverage limits target solvency.',
    'A bank at its reserve limit has no room to lend without new reserves.',
  ],
});
