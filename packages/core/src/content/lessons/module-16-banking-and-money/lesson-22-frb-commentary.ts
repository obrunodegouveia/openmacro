import { defineLesson } from '../../schema';

/** Video 22. The first commentary: the half-truth at the centre of a demand deposit, and the risk-taking it rewards. */
export const kabFrbCommentaryLesson = defineLesson({
  id: 'kab-frb-commentary',
  title: 'The Half-Truth at the Centre',
  subtitle:
    'You were told you can take out all your money at any time. The truth is that you can — unless too many people try at once.',
  icon: '⚠️',
  difficulty: 'advanced',
  estimatedMinutes: 18,
  video: {
    url: 'https://www.youtube.com/watch?v=ZyyaE3DIxhc',
    minutes: 19,
    source: 'Khan Academy — Fractional Reserve Banking Commentary 1',
  },
  challenges: [
    {
      id: 'mc-the-asterisk',
      type: 'multiple_choice',
      tags: ['fractional-reserve', 'critique'],
      xp: 25,
      prompt:
        'A demand deposit is money you can take out whenever you want. The video says it comes with hidden small print (an “asterisk”). For a bank that keeps 10% of deposits as reserves, what does the small print say?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'asterisk',
          label: '“Whenever you want — as long as people ask for no more than about 10% at once”',
        },
        {
          id: 'insured',
          label: '“Whenever you want — and if the bank fails, insurance will pay”',
          feedback:
            'Insurance is the fix in the next video. This small print comes from keeping only part of deposits as reserves, and it is there with or without insurance.',
        },
        {
          id: 'notice',
          label: '“Whenever you want — after giving the bank some notice first”',
          feedback:
            'Depositors are not told about any notice. Telling them when they can have their money is the honest option the video suggests — and then it explains why banks avoid it.',
        },
        {
          id: 'fees',
          label: '“Whenever you want — but you must pay a fee to take it out”',
          feedback:
            'Fees are not the problem. The problem is that the money is not all there.',
        },
      ],
      correctOptionId: 'asterisk',
      explanation:
        'The video is fair about it: the old gold version and the modern version give the same balance sheet, so neither is more dishonest. It also notes there is an honest option: tell depositors their money is tied up. But then they would ask for more interest. That extra interest is exactly what the half-truth saves the bank.',
    },
    {
      id: 'mc-risk-incentive',
      type: 'multiple_choice',
      tags: ['moral-hazard', 'bank-run'],
      xp: 30,
      prompt:
        'There are three banks. Two lend carefully. The third lends to riskier borrowers at higher interest rates. Before anything goes wrong, which bank looks best to a depositor?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'risky',
          label: 'The risky one, because it can pay depositors the most interest',
        },
        {
          id: 'prudent',
          label: 'A careful one, because depositors check what each bank lends to',
          feedback:
            'The video’s point is that they cannot check. Risk stays hidden in good times, and the reckless bank just looks like the most profitable one.',
        },
        {
          id: 'same',
          label: 'They all look the same, because all deposits are equally safe',
          feedback:
            'It is worse than that. The riskiest bank clearly pays the most, so it pulls in more deposits.',
        },
        {
          id: 'largest',
          label: 'The biggest one, because big means safe',
          feedback:
            'The video does not talk about size. What depositors actually see is the interest rate.',
        },
      ],
      correctOptionId: 'risky',
      explanation:
        'So money flows to the bank that takes the most risk, because it takes the most risk. When it fails, the panic does not stay at its door. This causes two problems: one bad bank can empty every bank, and nobody can tell good banks from bad ones. The lender of last resort makes the second problem even worse.',
    },
    {
      id: 'mc-why-not-honest',
      type: 'multiple_choice',
      tags: ['fractional-reserve', 'deposits'],
      xp: 35,
      prompt:
        'Sal offers an honest version. A depositor has 100 in the bank. Tell them 10 is ready now, 40 more in one year when a loan is repaid, and the last 50 in two years. Nothing else changes. Why do banks not do this?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'interest',
          label: 'People want more interest for money they cannot touch, so the honest bank would pay more',
        },
        {
          id: 'illegal',
          label: 'The law says deposits must be ready whenever people ask for them',
          feedback:
            'Fixed-term deposits are legal and common, and they are exactly this product. Nothing stops a bank from offering only those.',
        },
        {
          id: 'nobody',
          label: 'Nobody would put money in the bank on those terms',
          feedback:
            'People lock money away all the time for a good rate. They do not refuse — they just want more interest for it.',
        },
        {
          id: 'lending',
          label: 'The bank would not be able to lend nearly as much',
          feedback:
            'The loans are the same in both of Sal’s versions. Only what the depositor is told changes, and so how much interest they want.',
        },
      ],
      correctOptionId: 'interest',
      explanation:
        'This is the key point, and it is easy to miss. The half-truth is not a harmless shortcut. It is worth money. People accept less interest on money they can take out any time than on money locked away for two years. Every bank keeps that difference, every day, by telling people something that is not quite true.',
    },
    {
      id: 'mc-adverse-selection',
      type: 'multiple_choice',
      tags: ['risk', 'adverse-selection', 'banking'],
      xp: 35,
      prompt:
        'Bank three lends to riskier borrowers, so it earns more, so it can pay depositors more. What does Sal say happens next, while times are still good?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'attracts',
          label: 'It looks like the best bank, and it gets the most deposits',
        },
        {
          id: 'punished',
          label: 'Depositors see the risk and move to the safer banks',
          feedback:
            'They would if they could see it. A depositor sees the interest rate, not the loans behind it. In good years, the risky loans are all being paid back.',
        },
        {
          id: 'regulator',
          label: 'The regulator steps in before any harm is done',
          feedback:
            'The video says the risk is hidden in good times, even from regulators. It shows up as higher profits, which look like good management.',
        },
        {
          id: 'nothing',
          label: 'Nothing happens until the loans go bad',
          feedback:
            'Something important happens first: money moves towards the risk. By the time the loans go bad, the risky bank is the biggest one.',
        },
      ],
      correctOptionId: 'attracts',
      explanation:
        'The market rewards the risk-taker until the risk destroys it. It rewards it by giving it more of everyone else’s money. In good times, extra risk looks like skill. That is why the biggest bank failures are often the fastest-growing banks of the years before.',
    },
    {
      id: 'mc-lolr-moral-hazard',
      type: 'multiple_choice',
      tags: ['moral-hazard', 'lender-of-last-resort'],
      xp: 35,
      prompt:
        'Sal names two problems: one bad bank can bring down the whole system, and depositors cannot tell good banks from bad ones. He then says the lender of last resort makes the second problem worse. How?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'harder',
          label: 'A safety net lets a weak bank keep paying, so nothing shows that it is weak',
        },
        {
          id: 'runs',
          label: 'Knowing there is a safety net makes depositors panic sooner',
          feedback:
            'It works the other way: a safety net people trust stops them from panicking. And the question is about telling banks apart, not about runs.',
        },
        {
          id: 'inflation',
          label: 'It causes inflation, because the Fed must print money to lend',
          feedback:
            'Emergency loans do create reserves, but they are paid back. And the question is about telling banks apart, not about prices.',
        },
        {
          id: 'insolvency',
          label: 'It makes banks go broke, because the loans must be paid back one day',
          feedback:
            'A healthy bank pays back easily. The problem is that these loans also keep broke banks standing long enough to look healthy.',
        },
      ],
      correctOptionId: 'harder',
      explanation:
        'When weak banks fail, depositors learn which banks are weak. When weak banks are saved, nobody learns anything. The reward for extra risk stays, but the punishment goes away. Economists call this moral hazard. Every reform after 2008 faced the same choice: you cannot have both the safety of a safety net and the discipline of having none.',
    },
    {
      id: 'order-one-bad-apple',
      type: 'order_flow',
      tags: ['bank-run', 'contagion', 'fractional-reserve'],
      xp: 30,
      prompt: 'Put the steps in order: how one reckless bank leads to panic across the whole system.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'risk', label: 'Bank three lends to borrowers the other banks said no to' },
        { id: 'attract', label: 'It pays the best rates and gets the most deposits', detail: 'Extra risk looks like skill' },
        { id: 'turn', label: 'Times turn bad and its loans are not paid back' },
        { id: 'insolvent', label: 'It is broke, not just short of cash' },
        { id: 'fear', label: 'Depositors at other banks cannot tell which bank is which' },
        { id: 'solvent', label: 'Healthy banks face runs they did nothing to deserve' },
      ],
      correctOrder: ['risk', 'attract', 'turn', 'insolvent', 'fear', 'solvent'],
      explanation:
        'One bank’s failure spreads because depositors cannot tell the banks apart. If they could, the reckless bank would fail alone. They cannot, so the worst bank’s failure becomes a cost for the best banks. A bank that lent carefully for ten years gets a queue of worried depositors at its door.',
    },
  ],
  keyTakeaways: [
    'The old gold balance sheet and the modern one are the same; neither is more honest.',
    'Telling the truth about when money can be taken out would make banks pay more interest.',
    'Because risk is hidden, the most reckless bank can look like the most generous one.',
  ],
});
