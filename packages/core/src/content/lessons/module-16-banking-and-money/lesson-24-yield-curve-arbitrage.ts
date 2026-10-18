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
        'According to the video, what does fractional reserve banking combined with deposit insurance really allow banks to do?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'arbitrage',
          label:
            'Borrow short-term from depositors and lend long-term at higher rates, with the government insuring the deposits',
        },
        {
          id: 'intermediation',
          label: 'Financial intermediation — connecting savers to projects',
          feedback:
            'The video is careful here: connecting savers to projects really adds value, and venture capital and private equity do it without fractional reserve or any government safety net. The objection is to the extra layer on top.',
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
            'The proposed alternative — one-year and ten-year term deposits — funds lending perfectly well without lending out money that depositors can withdraw at any time.',
        },
      ],
      correctOptionId: 'arbitrage',
      explanation:
        'A current-account deposit is the shortest loan imaginable, renewed every second you do not withdraw. Insurance lets a bank borrow there at rates close to the government’s and lend for five or ten years for far more. As the video puts it, no special genius is required — everyone knows long-term rates are usually higher than short-term ones. What makes the trade available only to banks is the government-backed deposit guarantee.',
    },
    {
      id: 'mc-alternative',
      type: 'multiple_choice',
      tags: ['full-reserve', 'alternatives'],
      xp: 25,
      prompt:
        'The video sketches a bank that does not use fractional reserves at all. How does it work?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'cds',
          label:
            'Money you can withdraw any time is kept in full and earns nothing; only money placed in term deposits is lent out',
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
            'The alternative is more market, not less — depositors judging the risk themselves and pricing it, without a government safety net.',
        },
      ],
      correctOptionId: 'cds',
      explanation:
        'The products already exist: current accounts and term deposits. The difference is that the term is stated honestly, so depositors know their money is at work and price the risk themselves. The video is candid about its own position — resigned to fractional reserve continuing, but unwilling to call a government-subsidised system capitalism.',
    },
    {
      id: 'mc-maturity-matching',
      type: 'multiple_choice',
      tags: ['maturity-transformation', 'full-reserve'],
      xp: 35,
      prompt:
        'In Sal’s honest bank, a depositor locks money away in a ten-year term deposit and the bank lends it out for eight years. Why is that safe, and when would it stop being safe?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'matched',
          label: 'The loan is repaid before the deposit is due. Lend it for twelve years and the bank would be short when the deposit is due',
        },
        {
          id: 'anylength',
          label: 'Any length is safe, since the depositor cannot withdraw early either way',
          feedback:
            'The depositor cannot withdraw early, but the ten years do end. If the loan runs longer than the deposit, the bank has to find the money somewhere when the deposit is due.',
        },
        {
          id: 'rate',
          label: 'It is safe because the loan pays more than the CD',
          feedback:
            'Earning a spread is how the bank makes a profit, and says nothing about whether it can pay on time. Being profitable and having the cash on the day are different questions.',
        },
        {
          id: 'insured',
          label: 'It is safe because the deposit is insured',
          feedback:
            'This is exactly the bank that needs no insurance. Its safety comes from the dates lining up, which is the whole point of the design.',
        },
      ],
      correctOptionId: 'matched',
      explanation:
        'Match the dates and the bank can actually keep its promise, with no reserve ratio, no central bank and no insurance fund needed. That is what makes the sketch so persuasive: the whole machinery of modern banking regulation exists to manage a mismatch that this bank simply refuses to create.',
    },
    {
      id: 'mc-deposit-is-overnight',
      type: 'multiple_choice',
      tags: ['yield-curve', 'deposits'],
      xp: 30,
      prompt:
        'Sal calls a current-account deposit the shortest possible loan — renewed every second. What does that way of looking at it help you see?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'shortend',
          label: 'The bank borrows at the very shortest, cheapest end of the yield curve and lends for longer, at higher rates',
        },
        {
          id: 'notloan',
          label: 'That a deposit is not really a loan at all',
          feedback:
            'It is exactly a loan — you hand the bank money and it owes you money. The point is to make the very short term visible, not to deny the debt.',
        },
        {
          id: 'risky',
          label: 'That depositors are taking enormous risk by not withdrawing',
          feedback:
            'The insured depositor is taking very little risk, which is the subsidy the video is complaining about.',
        },
        {
          id: 'interest',
          label: 'That banks should pay overnight interest rates on current accounts',
          feedback:
            'They roughly do, and that is the point rather than a proposal — the bank pays the very lowest rate on the curve.',
        },
      ],
      correctOptionId: 'shortend',
      explanation:
        'Once you see a deposit as an overnight loan renewed non-stop, the bank’s business becomes a bet on the yield curve: borrow at the short, cheap end, lend at the longer, dearer end, and earn the difference. Everything else — branches, apps, account managers — is machinery for gathering the cheap short-term money. It is also why an inverted yield curve (short rates above long ones) is such bad news for banks: the trade runs backwards.',
    },
    {
      id: 'mc-strongest-objection',
      type: 'multiple_choice',
      tags: ['maturity-transformation', 'banking'],
      xp: 40,
      prompt:
        'Sal argues that banks earn the spread without adding value. What is the strongest reply a defender of the system could give?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'transformation',
          label: 'Connecting savers who want their money back at any time with borrowers who need it for years is itself a valuable service',
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
        'This is the real debate, and it deserves stating at its strongest. Savers want to be able to get their money at any time; factories and houses need money for decades; somebody must stand in between and absorb the mismatch, and doing so is genuinely risky. On that reading the spread is payment for bearing risk, not an unearned rent. Sal’s reply still bites: much of the risk is borne by whoever guarantees the deposits, not by the shareholders. Where you land depends on how much of the risk the bank really carries and how much has been passed to the taxpayer — which is exactly the argument about bank capital rules ever since.',
    },
    {
      id: 'match-intermediaries',
      type: 'concept_match',
      tags: ['intermediation', 'maturity-transformation'],
      xp: 30,
      prompt: 'The video’s central claim is that connecting savers to borrowers does not require fractional reserve banking. Match each institution to how it handles the gap between when savers want their money and when borrowers repay.',
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
        'Line the three up and the argument makes itself: the first two either tell investors plainly or avoid the mismatch altogether, and neither needs a central bank or an insurance fund to survive a bad year. Only the third needs public machinery to exist at all — the uncomfortable observation the video leaves you with, given how often that industry describes itself as the free market at work.',
    },
  ],
  keyTakeaways: [
    'Connecting savers to projects adds value; venture capital does it with no government safety net.',
    'Fractional reserve plus insurance enables a subsidised yield-curve trade.',
    'Full reserve banking with term deposits is a workable alternative.',
  ],
});
