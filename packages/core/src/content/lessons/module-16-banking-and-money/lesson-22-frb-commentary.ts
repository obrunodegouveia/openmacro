import { defineLesson } from '../../schema';

/** Video 22. The first commentary: the half-truth at the centre of a demand deposit, and the risk-taking it rewards. */
export const kabFrbCommentaryLesson = defineLesson({
  id: 'kab-frb-commentary',
  title: 'The Half-Truth at the Centre',
  subtitle:
    'You were told you could withdraw everything at any time. What is true is that you can, unless too many others try.',
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
        'The video says a demand deposit comes with a hidden asterisk — fine print nobody reads out. For a bank holding 10% reserves, what is it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'asterisk',
          label: '"On demand — as long as no more than about 10% of the money is asked for at once"',
        },
        {
          id: 'insured',
          label: '"On demand — unless the bank fails, in which case insurance pays"',
          feedback:
            'Insurance is the fix examined in the next video. The asterisk here comes from fractional reserve banking itself, and it is there whether or not there is insurance.',
        },
        {
          id: 'notice',
          label: '"On demand — with a notice period"',
          feedback:
            'No notice period is mentioned to the depositor. Telling depositors when they can have their money is exactly the honest alternative the video proposes — and then explains why banks avoid it.',
        },
        {
          id: 'fees',
          label: '"On demand — subject to withdrawal fees"',
          feedback:
            'Fees are not the issue. The issue is that the money is not all there.',
        },
      ],
      correctOptionId: 'asterisk',
      explanation:
        'The video is even-handed about it: the gold-era version and the modern version produce identical balance sheets, so neither is shadier than the other. And it notes the honest alternative exists — tell depositors their money is locked up — but then they would demand more interest, which is exactly the cost the half-truth saves the bank.',
    },
    {
      id: 'mc-risk-incentive',
      type: 'multiple_choice',
      tags: ['moral-hazard', 'bank-run'],
      xp: 30,
      prompt:
        'There are three banks. Two lend carefully; the third lends to riskier borrowers at higher rates. Before anything goes wrong, which one looks best to a depositor?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'risky',
          label:
            'The risky one, because it can pay depositors the highest interest rate',
        },
        {
          id: 'prudent',
          label: 'A careful one, because depositors check what each bank lends to',
          feedback:
            'The video’s point is that they cannot. Risk stays hidden while times are good, and the reckless bank simply looks like the most profitable one.',
        },
        {
          id: 'same',
          label: 'They look identical, since all deposits are equally safe',
          feedback:
            'Worse than identical: the riskiest bank visibly pays the most, which actively attracts deposits.',
        },
        {
          id: 'largest',
          label: 'Whichever is largest, since size implies safety',
          feedback:
            'Size is not the signal discussed. The signal depositors actually see is the interest rate.',
        },
      ],
      correctOptionId: 'risky',
      explanation:
        'So money flows towards the bank taking the most risk, precisely because it takes the most risk — and when it fails, the run does not stop at its door. Two problems follow: a fragile system where one bad apple can empty every bank, and the impossibility of telling good banks from bad, which the lender of last resort makes harder still.',
    },
    {
      id: 'mc-why-not-honest',
      type: 'multiple_choice',
      tags: ['fractional-reserve', 'deposits'],
      xp: 35,
      prompt:
        'Sal offers an honest version: tell a depositor with 100 in the bank that 10 is available now, 40 more when a loan is repaid in a year, and the last 50 in two years. Nothing else changes. Why is this not what banks do?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'interest',
          label: 'Depositors want more interest for money they cannot touch, so the honest bank would pay more',
        },
        {
          id: 'illegal',
          label: 'Regulation requires deposits to be available on demand',
          feedback:
            'Term deposits are legal and ordinary — a fixed-term deposit is exactly this product. Nothing stops a bank offering only those.',
        },
        {
          id: 'nobody',
          label: 'Nobody would deposit at all on those terms',
          feedback:
            'People lock money away all the time for a decent rate. The issue is not that they refuse, but how much interest they want for it.',
        },
        {
          id: 'lending',
          label: 'The bank would not be able to lend out nearly as much',
          feedback:
            'The loans are identical in Sal’s two versions. What differs is only what the depositor was told, and therefore how much interest they demand.',
        },
      ],
      correctOptionId: 'interest',
      explanation:
        'This is the sharpest part of the argument and the easiest to miss. The half-truth is not a harmless simplification — it is worth money: the difference between the interest a depositor accepts on money they can take out at any moment and the interest they would demand on money locked away for two years. Every bank collects that difference, every day, for telling people something not quite true.',
    },
    {
      id: 'mc-adverse-selection',
      type: 'multiple_choice',
      tags: ['risk', 'adverse-selection', 'banking'],
      xp: 35,
      prompt:
        'Bank three lends to riskier borrowers, so it earns more, so it can pay depositors more. According to Sal, what happens next, while times are still good?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'attracts',
          label: 'It looks like the best bank, and attracts the most deposits',
        },
        {
          id: 'punished',
          label: 'Depositors notice the risk and move to the safer banks',
          feedback:
            'They would if they could see it. A depositor sees the interest rate on offer, not the loans behind it, and in good years the risky loans are all being repaid.',
        },
        {
          id: 'regulator',
          label: 'The regulator steps in before any harm is done',
          feedback:
            'The video’s point is that the risk is hidden while times are good, including from regulators. It shows up as higher profits, which look like competence.',
        },
        {
          id: 'nothing',
          label: 'Nothing, until the loans go bad',
          feedback:
            'Something important happens first: money flows towards the risk. By the time the loans go bad, the risky bank is the biggest one.',
        },
      ],
      correctOptionId: 'attracts',
      explanation:
        'The market rewards the risk-taker right up until the risk destroys it, and it rewards it by handing it more of everyone else’s money. Extra risk looks like skill for exactly as long as times stay good — which is why the biggest failures are so often the fastest-growing banks of the decade before, and why "they were the most profitable bank in the country" appears in so many post-mortems.',
    },
    {
      id: 'mc-lolr-moral-hazard',
      type: 'multiple_choice',
      tags: ['moral-hazard', 'lender-of-last-resort'],
      xp: 35,
      prompt:
        'Sal names two problems — one bad bank can bring down the whole system, and depositors cannot tell good banks from bad — and then says the lender of last resort makes the second one worse. How?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'harder',
          label: 'A safety net lets a weak bank keep paying out, so nothing reveals that it is weak',
        },
        {
          id: 'runs',
          label: 'Knowing a safety net exists makes depositors panic sooner',
          feedback:
            'It works the other way — a credible safety net is what stops them panicking. And the question is about telling banks apart, not about runs.',
        },
        {
          id: 'inflation',
          label: 'It causes inflation, since the Fed must print money to lend',
          feedback:
            'Emergency lending does create reserves, but it is repaid. And the question is about telling banks apart, not about prices.',
        },
        {
          id: 'insolvency',
          label: 'It makes banks insolvent, because the loans have to be repaid eventually',
          feedback:
            'A solvent bank repays comfortably. The trouble is that the lending also keeps insolvent banks standing long enough to look solvent.',
        },
      ],
      correctOptionId: 'harder',
      explanation:
        'Failure is information. A system where weak banks fail teaches depositors which banks are weak; a system where they are propped up teaches nobody anything, and the reward for extra risk survives while the punishment does not. Sal is describing what economists call moral hazard, and reaching the dilemma every post-2008 reform wrestled with: you cannot have both the stability of a safety net and the discipline of having none.',
    },
    {
      id: 'order-one-bad-apple',
      type: 'order_flow',
      tags: ['bank-run', 'contagion', 'fractional-reserve'],
      xp: 30,
      prompt: 'Put in order how one reckless bank leads to a panic across the whole system.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'risk', label: 'Bank three lends to borrowers the others refused' },
        { id: 'attract', label: 'It pays the best rates and wins the most deposits', detail: 'Extra risk reads as skill' },
        { id: 'turn', label: 'Times turn bad and its loans are not repaid' },
        { id: 'insolvent', label: 'It is insolvent, not merely short of cash' },
        { id: 'fear', label: 'Depositors elsewhere cannot tell which bank is which' },
        { id: 'solvent', label: 'Sound banks face runs they did nothing to deserve' },
      ],
      correctOrder: ['risk', 'attract', 'turn', 'insolvent', 'fear', 'solvent'],
      explanation:
        'What turns one bank’s failure into a problem for the whole system is that depositors cannot tell the banks apart. If they could, the reckless bank would fail alone and the system would be healthier for it. They cannot, so the failure of the worst bank becomes a cost for the best — and a bank that lent carefully for a decade finds that its reward is a queue at the door.',
    },
  ],
  keyTakeaways: [
    'The gold-era and modern balance sheets are equivalent; neither is more honest.',
    'Telling the truth about lock-ups would cost banks more in interest.',
    'Hidden risk lets the most reckless bank look like the most generous.',
  ],
});
