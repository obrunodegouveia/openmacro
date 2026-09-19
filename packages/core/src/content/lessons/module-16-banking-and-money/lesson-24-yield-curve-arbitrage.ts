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
    {
      id: 'mc-maturity-matching',
      type: 'multiple_choice',
      tags: ['maturity-transformation', 'full-reserve'],
      xp: 35,
      prompt:
        'In Sal’s honest bank, a depositor buys a ten year CD and the bank lends that money out for eight years. Why is that safe, and where would the line be?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'matched',
          label: 'The loan repays before the CD does. Lend it for twelve years and the bank is short',
        },
        {
          id: 'anylength',
          label: 'Any length is safe, since the depositor cannot withdraw early either way',
          feedback:
            'The depositor cannot withdraw early, but the ten years do end. If the loan runs longer than the deposit, the bank has to find the money somewhere on the day.',
        },
        {
          id: 'rate',
          label: 'It is safe because the loan pays more than the CD',
          feedback:
            'Earning a spread is how the bank profits and says nothing about whether it can pay. Profitability and being able to pay on the day are different questions.',
        },
        {
          id: 'insured',
          label: 'It is safe because the deposit is insured',
          feedback:
            'This is precisely the bank that needs no insurance. Its safety comes from the dates lining up, which is the whole point of the design.',
        },
      ],
      correctOptionId: 'matched',
      explanation:
        'Match the maturities and the promise is one the bank can actually keep, with no reserve ratio, no central bank and no insurance fund required. That is what makes the sketch such an effective rhetorical device: the entire apparatus of modern banking regulation exists to manage a mismatch that this bank has simply declined to create.',
    },
    {
      id: 'mc-deposit-is-overnight',
      type: 'multiple_choice',
      tags: ['yield-curve', 'deposits'],
      xp: 30,
      prompt:
        'Sal calls a checking deposit the shortest possible duration loan — renewed every second. What does that framing let you see?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'shortend',
          label: 'The bank funds itself at the very bottom of the yield curve and lends further along it',
        },
        {
          id: 'notloan',
          label: 'That a deposit is not really a loan at all',
          feedback:
            'It is exactly a loan — you hand the bank money and it owes you money. The framing is there to make the duration visible, not to dissolve the debt.',
        },
        {
          id: 'risky',
          label: 'That depositors are taking enormous risk by not withdrawing',
          feedback:
            'The insured depositor is taking very little risk, which is the subsidy the video is complaining about.',
        },
        {
          id: 'interest',
          label: 'That banks should pay overnight rates on checking accounts',
          feedback:
            'They roughly do, and that is the point rather than a proposal — the bank pays the very lowest rate on the curve.',
        },
      ],
      correctOptionId: 'shortend',
      explanation:
        'Once you see a deposit as an overnight loan rolled continuously, the bank’s business becomes a position on the yield curve: short at the bottom, long further up, earning the slope. Everything else — branches, apps, relationship managers — is the machinery for sourcing the short leg cheaply. It is also why an inverted curve is such bad news for banks: the trade runs backwards.',
    },
    {
      id: 'mc-strongest-objection',
      type: 'multiple_choice',
      tags: ['maturity-transformation', 'banking'],
      xp: 40,
      prompt:
        'Sal argues the spread is captured without adding value. What is the strongest reply available to a defender of the system?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'transformation',
          label: 'Bridging savers who want their money back and borrowers who need it for years is itself the service',
        },
        {
          id: 'jobs',
          label: 'Banks employ a great many people',
          feedback:
            'True of any industry and no defence of this one. The question is whether the particular activity creates value, not whether it creates payroll.',
        },
        {
          id: 'profitable',
          label: 'The banks are profitable, so the market has judged them useful',
          feedback:
            'Sal’s whole argument is that the profit comes from a subsidy. Pointing at the profit assumes what is in dispute.',
        },
        {
          id: 'necessary',
          label: 'There is no alternative — every country banks this way',
          feedback:
            'The video meets this directly, with venture capital, private equity and its own term-deposit bank as working counter-examples.',
        },
      ],
      correctOptionId: 'transformation',
      explanation:
        'This is the real debate, and it deserves stating at its strongest. Savers want liquidity; factories and houses need money for decades; somebody must stand between and absorb the mismatch, and doing so is genuinely risky. On that reading the spread is payment for bearing risk, not a rent. Sal’s rejoinder still bites: the risk is borne by whoever guarantees the deposits, and it is not the shareholder. Where you land turns on how much of the mismatch the bank truly carries and how much has been passed to the taxpayer — which is exactly the argument capital requirements have been having ever since.',
    },
    {
      id: 'match-intermediaries',
      type: 'concept_match',
      tags: ['intermediation', 'maturity-transformation'],
      xp: 30,
      prompt: 'The video’s central claim is that intermediation does not require fractional reserve. Match each institution to how it handles the mismatch.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'vc',
          term: 'A venture capital fund',
          definition: 'Tells investors plainly that their money is locked up for years, and invests accordingly',
        },
        {
          id: 'cdbank',
          term: 'Sal’s term-deposit bank',
          definition: 'Pays nothing on money you can take today, and more the longer you leave it',
        },
        {
          id: 'frb',
          term: 'A fractional reserve bank',
          definition: 'Promises everyone their money at once, lends most of it long, and is backstopped for the difference',
        },
      ],
      explanation:
        'Line the three up and the argument makes itself: the first two carry the mismatch openly or refuse to create it, and neither needs a central bank or an insurance fund to survive a bad year. Only the third requires public machinery to exist at all — which is the uncomfortable observation the video leaves you with, given how much of that industry describes itself as the free market at work.',
    },
  ],
  keyTakeaways: [
    'Intermediation adds value; venture capital does it with no government backstop.',
    'Fractional reserve plus insurance enables a subsidised yield-curve trade.',
    'Full reserve banking with term deposits is a workable alternative.',
  ],
});
