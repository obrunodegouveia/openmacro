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
    'One sentence in the news. After five lessons you can say what it means for your mortgage, your rent and your savings.',
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
      prompt: 'The ECB raises its rate by half a point. What really changes on that day?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'overnight-price',
          label: 'Only the price of money for one night, between banks and the ECB. Nothing else yet',
        },
        {
          id: 'all-loans',
          label: 'Every loan in Europe got more expensive that morning',
          feedback:
            'Loans will get more expensive, but not that morning. A fixed-rate mortgage does not change at all. A variable one changes on its own reset date, which may be months away.',
        },
        {
          id: 'money-supply',
          label: 'The amount of money in the economy fell',
          feedback:
            'Not directly. The amount of money changes when banks lend more or less, and that reacts to the rate over months, not on the day.',
        },
        {
          id: 'inflation',
          label: 'Inflation came down',
        },
      ],
      correctOptionId: 'overnight-price',
      explanation:
        'Only one overnight price changed. Mortgages, savings rates, company loans and government borrowing follow over weeks and months, as banks change their prices and contracts reach their reset dates. The delay is not slow news: it is how the system works.',
    },
    {
      id: 'flow-reaches-you',
      type: 'order_flow',
      tags: ['basics', 'rates', 'mortgage'],
      xp: 20,
      prompt: 'Put these in the order they reach an ordinary family.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'announcement',
          label: 'The ECB announces the rise',
          detail: 'On a Thursday, about every six weeks',
        },
        {
          id: 'market',
          label: 'Money market rates move within days',
          detail: 'Including Euribor, which most euro area mortgages follow',
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
          detail: 'Banks raise what they charge faster than what they pay',
        },
      ],
      correctOrder: ['announcement', 'market', 'new-loans', 'reset', 'savings'],
      explanation:
        'Remember the last step, because nobody announces it. Loan rates rise fast. Savings rates rise slowly and by less. The gap between them is a big source of bank profit when rates go up. If your mortgage went up within the year and your savings rate did not, that was not an accident.',
    },
    {
      id: 'mc-which-mortgage',
      type: 'multiple_choice',
      tags: ['basics', 'mortgage', 'euribor'],
      xp: 20,
      prompt:
        'Two neighbours have the same mortgage. One pays €200 a month more than the other. What is the most likely reason?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'reset-date',
          label: 'Their rates reset on different dates, so one still pays an older, lower rate',
        },
        {
          id: 'negotiation',
          label: 'One negotiated a better deal',
          feedback:
            'A better deal helps, but usually by a few tenths of a per cent, not €200 a month. The reset dates matter much more.',
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
        'Most euro area mortgages follow Euribor and reset every three, six or twelve months. Two people who signed six months apart pay rates set six months apart. In 2022 and 2023 that meant hundreds of euros a month on the same loan. Nobody negotiated anything and nothing went wrong: the calendar did it. A later module covers Euribor.',
    },
    {
      id: 'match-where-next',
      type: 'concept_match',
      tags: ['basics', 'orientation'],
      xp: 20,
      prompt:
        'You now know the basic words. Match each question you may still have to the part of the course that answers it.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'creation',
          term: '"How exactly does a bank create money?"',
          definition: 'The module on how commercial banks and the central bank work together, where you post it yourself',
        },
        {
          id: 'levers',
          term: '"What else can a central bank do besides rates?"',
          definition: 'The Fed and ECB tools, and then their real published balance sheets',
        },
        {
          id: 'mortgage',
          term: '"Why did my mortgage payment jump?"',
          definition: 'The Euribor module, which ends with five hard questions',
        },
        {
          id: 'house',
          term: '"Should I buy a flat?"',
          definition: 'The Portuguese numbers: every tax to the euro, and when buying beats renting',
        },
      ],
      explanation:
        'That is the end of the introduction. You now know what your bank balance is, what a bank is, what a rate is, who is in charge, what inflation does to whom, and how a rate decision reaches you. The rest of the course uses the same ideas with bigger institutions and real published numbers.',
    },
  ],
  keyTakeaways: [
    'A rate decision changes one overnight price. Everything else follows over weeks and months.',
    'Loan rates rise fast, savings rates slowly and by less. That gap is bank profit.',
    'Two identical mortgages can differ by hundreds of euros a month just because of reset dates.',
    'You now know the basic words for the rest of the course.',
  ],
});
