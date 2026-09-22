import { defineLesson } from '../../schema';

/**
 * The rate is not a dial marked "growth". It is a position relative to a
 * neutral rate nobody can observe, and almost every mistake in this subject
 * starts by forgetting one of those two facts.
 */
export const whatYouAreSteeringLesson = defineLesson({
  id: 'what-you-are-steering',
  title: 'The Rate Is a Position, Not a Level',
  subtitle:
    'Five per cent is tight in one decade and loose in another. What decides which is a number nobody can see.',
  icon: '🎚️',
  difficulty: 'core',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-nominal-vs-real',
      type: 'multiple_choice',
      tags: ['policy-rate', 'real-rates'],
      xp: 25,
      prompt:
        'Country A sets its policy rate at 12% with inflation at 15%. Country B sets 2% with inflation at 0.5%. Which is running tighter policy?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'b', label: 'B — its real rate is positive and A’s is deeply negative' },
        {
          id: 'a',
          label: 'A, obviously — 12% is six times B’s rate',
          feedback:
            'Compare each to its own inflation. A borrower in A repays in money losing 15% of its value a year while paying 12%: the debt shrinks in real terms. That is stimulus wearing a large number.',
        },
        {
          id: 'same',
          label: 'The same — both are positive nominal rates',
          feedback:
            'A positive nominal rate says nothing on its own. Turkey held double-digit rates through years of higher inflation, and policy was loose the whole time.',
        },
        {
          id: 'unknowable',
          label: 'Not answerable without knowing each country’s growth rate',
          feedback:
            'Growth matters for where the rate *should* be. For which is tighter right now, the real rate does the work, and you have both numbers.',
        },
      ],
      correctOptionId: 'b',
      explanation:
        'The first move is always to subtract inflation. A has a real rate of roughly −3%, B roughly +1.5%. Everything a policy rate does — to borrowing, to saving, to the currency — runs through the real rate, which is why a headline rate is uninformative on its own and why comparing two countries by their nominal rates tells you nothing.',
    },
    {
      id: 'mc-neutral-rate',
      type: 'multiple_choice',
      tags: ['r-star', 'neutral-rate'],
      xp: 30,
      prompt:
        'A real rate of 1.5% is restrictive in one economy and stimulative in another. What is the number it has to be compared against?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'r-star',
          label: 'The neutral real rate',
        },
        {
          id: 'growth',
          label: 'The economy’s trend growth rate over the cycle',
          feedback:
            'Related and not the same. Growth is one input into where neutral sits, along with demographics, productivity and how much the world wants to save.',
        },
        {
          id: 'target',
          label: 'The inflation target',
          feedback:
            'The target tells you where inflation should end up, not what rate gets it there. Two economies with the same 2% target can need very different rates.',
        },
        {
          id: 'previous',
          label: 'Whatever the rate was last year',
          feedback:
            'A common shortcut and a bad one. Policy can be unchanged for two years and go from loose to tight without the committee touching anything, because neutral moved underneath it.',
        },
      ],
      correctOptionId: 'r-star',
      explanation:
        'Neutral — r* — is the real rate at which policy is doing nothing in either direction. Above it you are restraining, below it you are stimulating, and the same 1.5% can be either. It is the single most important number in the job and it cannot be observed, only estimated.',
    },
    {
      id: 'mc-r-star-uncertainty',
      type: 'multiple_choice',
      tags: ['r-star', 'uncertainty'],
      xp: 35,
      prompt:
        'Estimates of the neutral real rate for advanced economies fell from around 3% before 2008 to well under 1% in the 2010s — with error bands of a percentage point or more either side. What follows for policy?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'direction',
          label: 'Trust the sign of the stance, not its size',
        },
        {
          id: 'ignore',
          label: 'Ignore r* altogether and target the inflation number directly',
          feedback:
            'You cannot. Any statement that policy is tight or loose is a statement about r*, whether or not the word is used — the estimate is unavoidable, so the honest response is to hold it loosely rather than pretend to do without it.',
        },
        {
          id: 'pick',
          label: 'Pick the best model and use its number',
          feedback:
            'Different models disagree by more than the policy question. Choosing one and reporting a point estimate converts genuine uncertainty into false precision, which is how you end up defending a decimal place.',
        },
        {
          id: 'wait',
          label: 'Wait for better estimates before moving',
          feedback:
            'The estimate improves with data you only get later. Waiting is itself a decision, and given the lags in the next lesson, usually the most expensive one.',
        },
      ],
      correctOptionId: 'direction',
      explanation:
        'This is the first genuinely technical habit of the job. The error band on r* is wider than the distance between a tight and a loose stance, so the sign of the stance is knowable and its magnitude is not. That argues for gradualism, for watching what the economy does rather than what the model says, and for saying "restrictive" rather than "170 basis points restrictive".',
    },
    {
      id: 'match-what-moves-neutral',
      type: 'concept_match',
      tags: ['r-star'],
      xp: 30,
      prompt: 'Neutral is not a constant. Match each force to which way it pushes r*.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'ageing',
          term: 'An ageing population',
          definition: 'Down — more people saving for retirement chase the same investments',
        },
        {
          id: 'productivity',
          term: 'Faster productivity growth',
          definition: 'Up — investment becomes more profitable, so capital commands more',
        },
        {
          id: 'debt',
          term: 'Heavy public borrowing',
          definition: 'Up — the state competes for the same savings everyone else wants',
        },
        {
          id: 'inequality',
          term: 'Income concentrating at the top',
          definition: 'Down — high earners save a larger share, adding to the supply of savings',
        },
      ],
      explanation:
        'All four are slow-moving and none is under your control, which is the point: neutral is handed to you by demography, technology and fiscal policy. Your job is to find where it is and position against it — not to set it. A central bank that believes it chooses the long-run real rate is about to make an expensive mistake.',
    },
  ],
  keyTakeaways: [
    'Subtract inflation first: policy works through the real rate.',
    'Restrictive or accommodative is a statement about distance from neutral.',
    'The error band on neutral is wider than the policy question, so trust the sign and not the size.',
  ],
});
