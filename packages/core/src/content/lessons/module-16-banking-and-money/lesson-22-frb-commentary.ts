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
        'The video says a demand deposit carries an unstated asterisk. What is it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'asterisk',
          label: '"On demand — provided no more than about 10% of us demand at once"',
        },
        {
          id: 'insured',
          label: '"On demand — unless the bank fails, in which case insurance pays"',
          feedback:
            'Insurance is the fix examined in the next video. The asterisk here is about the mechanics of fractional reserve itself, which exist whether or not there is insurance.',
        },
        {
          id: 'notice',
          label: '"On demand — with a notice period"',
          feedback:
            'No notice period is stated to the depositor. That is exactly the honest alternative the video proposes and then explains why banks avoid.',
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
        'The video is even-handed about it: the gold-era version and the modern version produce identical balance sheets, so neither is shadier than the other. And it notes the honest alternative exists — tell depositors their money is locked up — but then they would demand more interest, which is precisely what the half-truth saves the bank.',
    },
    {
      id: 'mc-risk-incentive',
      type: 'multiple_choice',
      tags: ['moral-hazard', 'bank-run'],
      xp: 30,
      prompt:
        'Three banks; two lend prudently, one lends to riskier borrowers. Before any failure, which looks best to a depositor?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'risky',
          label:
            'The risky one, because it can pay the highest deposit rate',
        },
        {
          id: 'prudent',
          label: 'A prudent one, because depositors examine loan books',
          feedback:
            'The video’s point is that they cannot. Risk is hidden while times are good, and the reckless bank simply looks like the profitable one.',
        },
        {
          id: 'same',
          label: 'They look identical, since all deposits are equally safe',
          feedback:
            'Worse than identical: the riskiest is visibly the most generous, which actively attracts deposits.',
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
        'So capital flows toward the bank taking the most risk, precisely because it takes the most risk — and when it fails, the run does not stop at its door. Two problems fall out: an unstable equilibrium where one bad apple empties the system, and the impossibility of telling good banks from bad, which the lender of last resort makes harder still.',
    },
    {
      id: 'mc-why-not-honest',
      type: 'multiple_choice',
      tags: ['fractional-reserve', 'deposits'],
      xp: 35,
      prompt:
        'Sal offers an honest version: tell the depositor 10 is available now, 40 when that loan repays in a year, 50 in two. Nothing else changes. Why is this not what banks do?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'interest',
          label: 'Locked-up money has to be paid for, so the honest bank owes more',
        },
        {
          id: 'illegal',
          label: 'Regulation requires deposits to be available on demand',
          feedback:
            'Term deposits are legal and ordinary — a certificate of deposit is exactly this product. Nothing stops a bank offering only those.',
        },
        {
          id: 'nobody',
          label: 'Nobody would deposit at all on those terms',
          feedback:
            'People lock money up all the time for a decent rate. The issue is not that they refuse, but what they charge for it.',
        },
        {
          id: 'lending',
          label: 'The bank would not be able to lend out nearly as much',
          feedback:
            'The loan book is identical in Sal’s two versions. What differs is only what the depositor was told and therefore what they demand in return.',
        },
      ],
      correctOptionId: 'interest',
      explanation:
        'This is the sharpest part of the argument and the easiest to miss. The half-truth is not a harmless simplification — it is worth money, and the money it is worth is the difference between what a depositor charges for money they can retrieve instantly and what they charge for money locked away for two years. The bank collects that difference for telling people something not quite true, and it is collected every day by every bank.',
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
          label: 'It looks like the best bank, and attracts the most deposits',
        },
        {
          id: 'punished',
          label: 'Depositors notice the risk and move to the safer banks',
          feedback:
            'They would if they could see it. A depositor sees the rate on offer, not the loan book behind it, and in good years the risky loans are all performing.',
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
            'Something very consequential happens first: capital flows towards the risk. By the time the loans go bad, the risky bank is the large one.',
        },
      ],
      correctOptionId: 'attracts',
      explanation:
        'The market rewards the risk-taker right up until it destroys them, and it rewards them by handing them more of everyone else’s money. Extra risk reads as skill for exactly as long as the weather holds — which is why the biggest failures are so often the fastest-growing institutions of the preceding decade, and why "they were the most profitable bank in the country" appears in so many post-mortems.',
    },
    {
      id: 'mc-lolr-moral-hazard',
      type: 'multiple_choice',
      tags: ['moral-hazard', 'lender-of-last-resort'],
      xp: 35,
      prompt:
        'Sal names two problems and then says the lender of last resort makes the second one worse. Which, and how?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'harder',
          label: 'Telling good banks from bad. A backstop lets a weak bank keep paying, so nothing reveals it',
        },
        {
          id: 'runs',
          label: 'Bank runs. Knowing a backstop exists makes depositors panic sooner',
          feedback:
            'It works the other way — a credible backstop is what stops them panicking. The problem it worsens is the one about information.',
        },
        {
          id: 'inflation',
          label: 'Inflation, since the Fed must print to lend',
          feedback:
            'Emergency lending does create reserves, and it is repaid. Sal’s two problems are instability and indistinguishability, not the price level.',
        },
        {
          id: 'insolvency',
          label: 'Solvency, because the loans have to be repaid eventually',
          feedback:
            'A solvent bank repays comfortably. The trouble is that the facility also keeps insolvent ones upright long enough to look solvent.',
        },
      ],
      correctOptionId: 'harder',
      explanation:
        'Failure is information. A system where weak banks fail teaches depositors which banks are weak; a system where they are propped up teaches nobody anything, and the reward for extra risk survives while the punishment does not. Sal is describing moral hazard without using the phrase, and reaching the conclusion every post-2008 reform wrestled with: you cannot have both the stability of a backstop and the discipline of its absence.',
    },
    {
      id: 'order-one-bad-apple',
      type: 'order_flow',
      tags: ['bank-run', 'contagion', 'fractional-reserve'],
      xp: 30,
      prompt: 'Put the spread from one reckless bank to a system-wide panic in order.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'risk', label: 'Bank three lends to borrowers the others refused' },
        { id: 'attract', label: 'It pays the best rates and wins the most deposits', detail: 'Extra risk reads as skill' },
        { id: 'turn', label: 'The weather turns and its loans go bad' },
        { id: 'insolvent', label: 'It is insolvent, not merely short of cash' },
        { id: 'fear', label: 'Depositors elsewhere cannot tell which bank is which' },
        { id: 'solvent', label: 'Sound banks face runs they did nothing to deserve' },
      ],
      correctOrder: ['risk', 'attract', 'turn', 'insolvent', 'fear', 'solvent'],
      explanation:
        'The step that makes this a systemic problem rather than one firm’s failure is the fifth. If depositors could distinguish a prudent bank from a reckless one, the reckless one would fail alone and the system would be healthier for it. They cannot, so the failure of the worst institution becomes a tax on the best — and a bank that lent carefully for a decade discovers that its reward is a queue at the door.',
    },
  ],
  keyTakeaways: [
    'The gold-era and modern balance sheets are equivalent; neither is more honest.',
    'Telling the truth about lock-ups would cost banks more in interest.',
    'Hidden risk lets the most reckless bank look like the most generous.',
  ],
});
