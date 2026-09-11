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
  ],
  keyTakeaways: [
    'The gold-era and modern balance sheets are equivalent; neither is more honest.',
    'Telling the truth about lock-ups would cost banks more in interest.',
    'Hidden risk lets the most reckless bank look like the most generous.',
  ],
});
