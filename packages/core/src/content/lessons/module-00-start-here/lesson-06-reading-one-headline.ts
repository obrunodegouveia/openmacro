import { defineLesson } from '../../schema';

/**
 * The bridge out of the intro track. Everything learned so far, applied to the
 * one sentence a beginner will actually meet in the news — and each answer
 * points at the module that goes deeper.
 */
export const readingOneHeadlineLesson = defineLesson({
  id: 'reading-one-headline',
  title: '"The ECB Raised Rates." So What?',
  subtitle:
    'One sentence in the news. Five lessons is enough to say what it means for your mortgage, your rent and your savings.',
  icon: '📰',
  difficulty: 'intro',
  estimatedMinutes: 6,
  hearts: 5,
  challenges: [
    {
      id: 'mc-what-changed',
      type: 'multiple_choice',
      tags: ['basics', 'rates', 'news'],
      xp: 15,
      prompt: 'The ECB raises its rate by half a point. What has literally changed that day?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'overnight-price',
          label: 'The price of money for one night, between banks and the ECB. Nothing else, yet',
        },
        {
          id: 'all-loans',
          label: 'Every loan in Europe got more expensive that morning',
          feedback:
            'They will, and not that morning. A fixed-rate mortgage does not move at all, and a variable one moves on its own reset date, which may be months away.',
        },
        {
          id: 'money-supply',
          label: 'The amount of money in the economy fell',
          feedback:
            'Not directly. Money changes when banks lend more or less, and that responds to the rate over months, not on the day it changes.',
        },
        {
          id: 'inflation',
          label: 'Inflation came down',
        },
      ],
      correctOptionId: 'overnight-price',
      explanation:
        'One overnight price changed. Everything else — mortgages, savings rates, company loans, government borrowing — follows over weeks and months as banks reprice and contracts hit their reset dates. The gap between the announcement and the effect on you is not a delay in the news; it is how the machinery actually works.',
    },
    {
      id: 'flow-reaches-you',
      type: 'order_flow',
      tags: ['basics', 'rates', 'mortgage'],
      xp: 20,
      prompt: 'Put it in the order it reaches an ordinary household.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'announcement',
          label: 'The ECB announces the rise',
          detail: 'On a Thursday, roughly every six weeks',
        },
        {
          id: 'market',
          label: 'Money market rates move within days',
          detail: 'Including Euribor, which most euro area mortgages are tied to',
        },
        {
          id: 'new-loans',
          label: 'New mortgage offers get more expensive',
          detail: 'Anyone buying next month pays more',
        },
        {
          id: 'reset',
          label: 'Existing variable mortgages change on their next reset date',
          detail: 'Which could be tomorrow or eleven months away',
        },
        {
          id: 'savings',
          label: 'Savings rates rise last, and by less',
          detail: 'Banks are quicker to charge more than to pay more',
        },
      ],
      correctOrder: ['announcement', 'market', 'new-loans', 'reset', 'savings'],
      explanation:
        'The last step is the one worth remembering, because it is the one nobody announces. Lending rates rise quickly and deposit rates rise slowly and less — the gap between them is where a good deal of bank profit comes from in a tightening cycle. If your mortgage repriced within the year and your savings account did not, that was not an oversight.',
    },
    {
      id: 'mc-which-mortgage',
      type: 'multiple_choice',
      tags: ['basics', 'mortgage', 'euribor'],
      xp: 20,
      prompt:
        'Two neighbours have identical mortgages. One pays €200 a month more than the other. What is the most likely reason?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'reset-date',
          label: 'Their rates reset on different dates, so one is still paying an older, lower rate',
        },
        {
          id: 'negotiation',
          label: 'One negotiated a better deal',
          feedback:
            'A better margin is worth something, and it is usually a few tenths of a per cent — not €200 a month. The dates are worth far more than the negotiation.',
        },
        {
          id: 'bank',
          label: 'They use different banks',
        },
        {
          id: 'credit',
          label: 'One has a better credit record',
        },
        {
          id: 'error',
          label: 'One of them is being overcharged',
        },
      ],
      correctOptionId: 'reset-date',
      explanation:
        'Most euro area mortgages track Euribor and reset every three, six or twelve months. Two people who signed six months apart are paying rates set six months apart, which through 2022 and 2023 was worth hundreds of euros a month on the same loan. Nothing was negotiated and nothing went wrong — the calendar did it, and there is a whole module about that index later on.',
    },
    {
      id: 'match-where-next',
      type: 'concept_match',
      tags: ['basics', 'orientation'],
      xp: 20,
      prompt:
        'You now have the vocabulary. Match each question you might still have to where the course answers it.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'creation',
          term: '"How exactly does a bank create money?"',
          definition: 'The commercial and central bank interface — you post it by hand',
        },
        {
          id: 'levers',
          term: '"What else can a central bank do besides rates?"',
          definition: 'The Fed and ECB levers, and then their actual published balance sheets',
        },
        {
          id: 'mortgage',
          term: '"Why did my mortgage payment jump?"',
          definition: 'The Euribor module, ending in five questions designed to be hard',
        },
        {
          id: 'house',
          term: '"Should I buy a flat?"',
          definition: 'The Portuguese arithmetic — every tax to the euro, and the break-even',
        },
      ],
      explanation:
        'That is the end of the introduction. You know what your bank balance is, what a bank is, what a rate is, who is and is not in charge, what inflation does to whom, and how a policy decision reaches your account. Everything after this is the same ideas at larger institutions, with real published numbers — and you now have what you need to follow it.',
    },
  ],
  keyTakeaways: [
    'A rate decision changes one overnight price. Everything else follows over weeks and months.',
    'Lending rates rise quickly, savings rates slowly and by less — that gap is bank profit.',
    'Two identical mortgages can differ by hundreds a month purely because of reset dates.',
    'You now have the vocabulary for the rest of the course.',
  ],
});
