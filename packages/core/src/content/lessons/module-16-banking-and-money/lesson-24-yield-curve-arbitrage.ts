import { defineLesson } from '../../schema';

/** Video 24. The closing argument: fractional reserve plus insurance is a subsidised yield-curve trade. */
export const kabYieldCurveArbitrageLesson = defineLesson({
  id: 'kab-yield-curve-arbitrage',
  title: 'Borrow Short, Lend Long, Send the Bill to Taxpayers',
  subtitle:
    'The strongest form of Sal’s criticism: the system is not a fraud, but its profit is paid for by the public.',
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
        'Fractional reserve banking means banks keep only part of their deposits as cash. According to the video, what does this, together with deposit insurance, really let banks do?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'arbitrage',
          label: 'Borrow for a short time from depositors and lend for years at higher rates, with the government insuring the deposits',
        },
        {
          id: 'intermediation',
          label: 'Bring savers and projects together, so that people’s savings get put to good use',
          feedback:
            'The video is careful here. Bringing savers and projects together really is useful, and venture capital and private equity do it with no safety net from the government. Sal objects to the extra layer on top.',
        },
        {
          id: 'creation',
          label: 'Create money, which is wrong in itself',
          feedback:
            'That is not the argument. Earlier videos said created money is real when it pays for real projects. This video attacks the public support, not the money creation.',
        },
        {
          id: 'lending',
          label: 'Lend to families, which would otherwise be impossible',
          feedback:
            'The other option the video suggests — one-year and ten-year term deposits — pays for lending just as well, without lending out money that people can take out at any time.',
        },
      ],
      correctOptionId: 'arbitrage',
      explanation:
        'Money in a current account is the shortest loan there is: it is renewed every second you leave it there. Insurance lets a bank borrow this money at rates close to the government’s, then lend it for five or ten years at much higher rates. As the video says, this needs no special skill — everyone knows long-term rates are usually higher. Only banks can do it, because only their deposits have the government guarantee.',
    },
    {
      id: 'mc-alternative',
      type: 'multiple_choice',
      tags: ['full-reserve', 'alternatives'],
      xp: 25,
      prompt:
        'The video describes a bank that does not use fractional reserves at all. How does it work?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'cds',
          label: 'Money you can take out any time is all kept and earns nothing; only fixed-term deposits are lent out',
        },
        {
          id: 'no-lending',
          label: 'It does not lend at all; it only keeps money safe',
          feedback:
            'It does lend the fixed-term deposits. It just does not lend money it promised you could take out at any time.',
        },
        {
          id: 'gold',
          label: 'It goes back to the gold standard and only lends out the gold it holds in its vault',
          feedback:
            'Full reserves and the gold standard are separate choices. The video shows them as two different questions.',
        },
        {
          id: 'government',
          label: 'The government does all the lending instead',
          feedback:
            'The other option means more market, not less. Depositors judge the risk themselves and set a price for it, with no safety net from the government.',
        },
      ],
      correctOptionId: 'cds',
      explanation:
        'These products already exist: current accounts and fixed-term deposits. The difference is that the time is stated honestly, so depositors know their money is being used and judge the risk themselves. The video is open about its own view: it expects fractional reserve banking to continue, but it will not call a system the government props up “capitalism”.',
    },
    {
      id: 'mc-maturity-matching',
      type: 'multiple_choice',
      tags: ['maturity-transformation', 'full-reserve'],
      xp: 35,
      prompt:
        'In Sal’s honest bank, a depositor locks money away for ten years, and the bank lends it out for eight years. Why is that safe? And when would it stop being safe?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'matched',
          label: 'The loan is paid back before the deposit ends. A twelve-year loan would leave the bank short when the deposit ends',
        },
        {
          id: 'anylength',
          label: 'Any length is safe, because the depositor cannot take the money out early',
          feedback:
            'The depositor cannot take it out early, but the ten years do end. If the loan lasts longer than the deposit, the bank must find the money somewhere when the deposit ends.',
        },
        {
          id: 'rate',
          label: 'It is safe because the loan pays more interest than the deposit',
          feedback:
            'Earning the difference is how the bank makes a profit. It says nothing about paying on time. Making a profit and having the cash on the day are two different things.',
        },
        {
          id: 'insured',
          label: 'It is safe because the deposit is insured',
          feedback:
            'This bank needs no insurance at all. It is safe because the dates match, and that is the whole idea.',
        },
      ],
      correctOptionId: 'matched',
      explanation:
        'When the dates match, the bank can really keep its promise. It needs no reserve ratio, no central bank and no insurance fund. That is why the idea is so convincing: all the rules of modern banking exist to manage a mismatch that this bank never creates.',
    },
    {
      id: 'mc-deposit-is-overnight',
      type: 'multiple_choice',
      tags: ['yield-curve', 'deposits'],
      xp: 30,
      prompt:
        'Sal says money in a current account is the shortest loan possible, renewed every second. What does looking at it this way help you see?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'shortend',
          label: 'The bank borrows at the shortest, cheapest rates and lends for longer at higher rates',
        },
        {
          id: 'notloan',
          label: 'That a deposit is not really a loan at all',
          feedback:
            'It really is a loan: you give the bank money and it owes you money. The point is to show how short the loan is, not to say there is no debt.',
        },
        {
          id: 'risky',
          label: 'That depositors take a huge risk by leaving their money in',
          feedback:
            'An insured depositor takes very little risk. That is exactly the public support the video complains about.',
        },
        {
          id: 'interest',
          label: 'That banks should pay one-night interest rates on current accounts',
          feedback:
            'They more or less already do. That is the point, not a suggestion: the bank pays the lowest rate there is.',
        },
      ],
      correctOptionId: 'shortend',
      explanation:
        'A yield curve shows interest rates for loans of different lengths. If a deposit is a one-night loan that renews non-stop, the bank’s business is a bet on that curve: borrow short and cheap, lend long and dear, and keep the difference. Branches, apps and staff are mostly tools for collecting cheap short-term money. That is also why an inverted yield curve (short rates above long ones) is bad news for banks: the bet runs backwards.',
    },
    {
      id: 'mc-strongest-objection',
      type: 'multiple_choice',
      tags: ['maturity-transformation', 'banking'],
      xp: 40,
      prompt:
        'Sal says banks earn the difference in rates without adding value. What is the strongest answer someone defending banks could give?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'transformation',
          label: 'Linking savers who want their money any time with borrowers who need it for years is a useful service',
        },
        {
          id: 'jobs',
          label: 'Banks give jobs to a great many people',
          feedback:
            'That is true of any industry, so it does not defend this one. The question is whether this activity creates value, not whether it creates jobs.',
        },
        {
          id: 'profitable',
          label: 'Banks make a profit, so the market has already decided that they are useful',
          feedback:
            'Sal’s whole point is that the profit comes from public support. Pointing at the profit assumes the very thing being argued about.',
        },
        {
          id: 'necessary',
          label: 'There is no other way — every country does banking like this',
          feedback:
            'The video answers this directly, with venture capital, private equity and its own fixed-term-deposit bank as working examples.',
        },
      ],
      correctOptionId: 'transformation',
      explanation:
        'This is the real debate, so it is worth stating fairly. Savers want their money available at any time. Factories and houses need money for decades. Someone must stand in the middle and carry that mismatch, and that is truly risky. Seen this way, the bank’s profit is payment for carrying risk. But Sal’s answer still matters: much of the risk is carried by whoever guarantees the deposits, not by the bank’s owners. Who really carries the risk is what the debate over bank capital rules has been about ever since.',
    },
    {
      id: 'match-intermediaries',
      type: 'concept_match',
      tags: ['intermediation', 'maturity-transformation'],
      xp: 30,
      prompt: 'The video says you do not need fractional reserve banking to link savers and borrowers. Savers may want money back before borrowers can repay. Match each institution to how it deals with that gap.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'vc',
          term: 'A venture capital fund',
          definition: 'Tells investors clearly that their money is locked up for years, and invests with that in mind',
        },
        {
          id: 'cdbank',
          term: 'Sal’s term-deposit bank',
          definition: 'Pays nothing on money you can take out today, and more the longer you leave it',
        },
        {
          id: 'frb',
          term: 'A fractional reserve bank',
          definition: 'Promises everyone their money at any time, lends most of it for years, and is backed up for the gap',
        },
      ],
      explanation:
        'Put the three side by side and the argument is clear. The first two are honest with investors or avoid the gap, and neither needs a central bank or an insurance fund to survive a bad year. Only the third needs public support just to exist. That is the uncomfortable point the video ends on, since banks often describe themselves as the free market at work.',
    },
  ],
  keyTakeaways: [
    'Linking savers and projects is useful; venture capital does it with no government safety net.',
    'Fractional reserves plus deposit insurance let banks borrow short and lend long with public support.',
    'Full reserve banking with fixed-term deposits is a working alternative.',
  ],
});
