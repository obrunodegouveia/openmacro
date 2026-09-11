import { defineLesson } from '../../schema';

/** Video 24. The closing argument: fractional reserve plus insurance is a subsidised yield-curve trade. */
export const kabYieldCurveArbitrageLesson = defineLesson({
  id: 'kab-yield-curve-arbitrage',
  title: 'Borrow Short, Lend Long, Bill the Taxpayer',
  subtitle:
    'The strongest version of the case against: not that the system is fraudulent, but that its profit is a public subsidy.',
  icon: '📐',
  difficulty: 'advanced',
  estimatedMinutes: 20,
  video: {
    url: 'https://www.youtube.com/watch?v=8SAMey9Gl5I',
    minutes: 21,
    source: 'Khan Academy — FRB Commentary 3: Big Picture',
  },
  challenges: [
    {
      id: 'mc-the-trade',
      type: 'multiple_choice',
      tags: ['yield-curve', 'critique'],
      xp: 30,
      prompt:
        'What does the video argue fractional reserve banking plus deposit insurance actually enables?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'arbitrage',
          label:
            'Borrowing at the short end and lending at the long end, spread insured',
        },
        {
          id: 'intermediation',
          label: 'Financial intermediation — connecting savers to projects',
          feedback:
            'The video is careful here: intermediation genuinely adds value, and venture capital and private equity do it without fractional reserve or any government backstop. The objection is to the extra layer.',
        },
        {
          id: 'creation',
          label: 'The creation of money, which is inherently illegitimate',
          feedback:
            'Not the argument. Earlier videos defended created money as real when it funds real projects. This one targets the subsidy, not the creation.',
        },
        {
          id: 'lending',
          label: 'Lending to households, which would otherwise be impossible',
          feedback:
            'The proposed alternative — deposits, one-year CDs, ten-year CDs — funds lending perfectly well without demand deposits being lent out.',
        },
      ],
      correctOptionId: 'arbitrage',
      explanation:
        'A checking deposit is the shortest loan imaginable, renewed every second you do not withdraw. Insurance lets a bank borrow there at near-government rates and lend at five or ten years for far more. As the video puts it, no special genius is required — everyone knows long rates exceed short ones. What makes it available only to banks is the FDIC guarantee.',
    },
    {
      id: 'mc-alternative',
      type: 'multiple_choice',
      tags: ['full-reserve', 'alternatives'],
      xp: 25,
      prompt:
        'The video sketches a bank that does not do fractional reserve at all. How does it work?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'cds',
          label:
            'Demand money sits idle and unpaid; lent money is locked in term deposits',
        },
        {
          id: 'no-lending',
          label: 'It does not lend at all, only stores money',
          feedback:
            'It lends the term deposits freely. What it does not do is lend money it promised was available on demand.',
        },
        {
          id: 'gold',
          label: 'It returns to a gold standard and lends only what it holds',
          feedback:
            'Full reserve and the gold standard are separate choices. The video explicitly lays them out as two independent axes.',
        },
        {
          id: 'government',
          label: 'The government does the lending instead',
          feedback:
            'The alternative is more market, not less — depositors judging risk directly and pricing it, without a federal backstop.',
        },
      ],
      correctOptionId: 'cds',
      explanation:
        'The instruments already exist: current accounts and certificates of deposit. The difference is that the term is stated honestly, so the depositor knows their money is at work and prices the risk themselves. The video is candid about its own position — resigned to fractional reserve continuing, but unwilling to call a government-subsidised system capitalism.',
    },
  ],
  keyTakeaways: [
    'Intermediation adds value; venture capital does it with no government backstop.',
    'Fractional reserve plus insurance enables a subsidised yield-curve trade.',
    'Full reserve banking with term deposits is a workable alternative.',
  ],
});
