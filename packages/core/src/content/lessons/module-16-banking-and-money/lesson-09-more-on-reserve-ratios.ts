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
  ],
  keyTakeaways: [
    'Maximum deposits equal reserves divided by the required ratio.',
    'Reserve requirements target liquidity; leverage limits target solvency.',
    'A bank at its reserve limit has no room to lend without new reserves.',
  ],
});
