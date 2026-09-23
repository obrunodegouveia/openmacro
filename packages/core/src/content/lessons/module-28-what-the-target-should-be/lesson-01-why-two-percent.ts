import { defineLesson } from '../../schema';

/**
 * Where the number came from. A governor inherits a target and is
 * occasionally asked to defend or revise it; this is the argument.
 */
export const whyTwoPercentLesson = defineLesson({
  id: 'why-two-percent',
  title: 'Where the Two Came From',
  subtitle:
    'Almost every inflation target on earth is 2%. It was not derived from a model. It was said out loud in a television interview in New Zealand.',
  icon: '2️⃣',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'mc-not-zero',
      type: 'multiple_choice',
      tags: ['framework', 'inflation-target'],
      xp: 35,
      prompt:
        'If inflation is a cost, why is the target not zero? Which argument does the most work?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'room',
          label: 'A positive target puts the normal policy rate further above the floor',
        },
        {
          id: 'bias',
          label: 'The index overstates true inflation anyway',
          feedback:
            'Measurement bias is real and argues for a target of maybe half a point, not two. It is a supporting argument rather than the decisive one.',
        },
        {
          id: 'wages',
          label: 'Nominal wages almost never fall, so some inflation eases adjustment',
          feedback:
            'Downward nominal rigidity is a genuine second argument — inflation lets relative wages adjust without anyone taking a stated pay cut. It matters less than the one about the floor.',
        },
        {
          id: 'growth',
          label: 'A little inflation stimulates growth',
          feedback:
            'It does not, over any horizon a framework is designed for. A target justified this way would have been abandoned decades ago.',
        },
      ],
      correctOptionId: 'room',
      explanation:
        'The neutral nominal rate is the neutral real rate plus the target, so the target sets the distance between a normal policy rate and the effective lower bound. Target zero with a neutral real rate near zero and the policy rate has nowhere to go in a recession — you have designed a framework that disarms itself precisely when it is needed. The other arguments are real and they are supporting. This one determines the answer, and the next lesson is about what happened when it turned out that two points of room was not enough either.',
    },
    {
      id: 'mc-origin',
      type: 'multiple_choice',
      tags: ['framework', 'history'],
      xp: 30,
      prompt: 'What does the origin of the 2% number tell you about it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'convention',
          label: 'It is a convention that worked, not a result that was derived',
        },
        {
          id: 'optimal',
          label: 'It was calculated as the welfare-maximising rate',
          feedback:
            'Welfare analyses exist and they mostly point below 2%, some to zero or negative. The number did not come from them and does not match them.',
        },
        {
          id: 'historical',
          label: 'It was the historical average inflation rate',
          feedback:
            'Inflation in the decades before targeting was far higher and far more variable. The target was set against that record, not derived from it.',
        },
        {
          id: 'treaty',
          label: 'It was agreed internationally and then adopted',
          feedback:
            'The spread was imitative rather than negotiated — New Zealand first, then Canada, the UK and the rest. Nobody signed anything.',
        },
      ],
      correctOptionId: 'convention',
      explanation:
        'Don Brash, then governor of the Reserve Bank of New Zealand, mentioned a 0–2% range in a 1988 television interview; it went into the 1989 Act and then into most of the world by imitation. That history is not an argument against it — a convention that has anchored expectations for thirty years has earned enormous standing, and the anchoring is worth more than any refinement of the number. But it is why a governor should be able to say plainly that the value is conventional. Defending it as a derived optimum invites a challenge the evidence cannot support.',
    },
    {
      id: 'mc-why-not-four',
      type: 'multiple_choice',
      tags: ['framework', 'inflation-target'],
      xp: 40,
      prompt:
        'A higher target would give more room above the lower bound. What is the strongest objection to raising it to 4%?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'transition',
          label: 'You would have to abandon the anchor to get to the new one',
        },
        {
          id: 'costs',
          label: 'Four percent inflation is substantially more costly than two',
          feedback:
            'The measured welfare costs of moderate steady inflation are surprisingly small. That is what makes the case for raising it arguable at all.',
        },
        {
          id: 'salience',
          label: 'People start paying attention to inflation above some threshold',
          feedback:
            'This is a real and underrated argument — inattention is what makes anchoring cheap. It is second to the transition problem, which bites immediately.',
        },
        {
          id: 'credibility',
          label: 'Markets would not believe the new target',
          feedback:
            'They would eventually, and getting there is the problem rather than the destination. Name the mechanism and the objection becomes concrete.',
        },
      ],
      correctOptionId: 'transition',
      explanation:
        'The destination might be fine; the journey destroys the asset. Announcing a higher target means telling the public that the number you promised for thirty years is revisable when it becomes inconvenient — and the most valuable feature of a target is that it is not. Worse, the announcement would come precisely when the old target was proving hard to defend, which is the moment it reads as surrender. This is why the debate moved to changing the *strategy* rather than the number, and that is the third lesson of this module.',
    },
    {
      id: 'match-target-design',
      type: 'concept_match',
      tags: ['framework', 'design'],
      xp: 30,
      prompt: 'Four design choices in a target. Match each to what it settles.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'point',
          term: 'Point versus range',
          definition: 'Whether missing by half a point is a miss at all, and who decides',
        },
        {
          id: 'horizon',
          term: 'The horizon',
          definition: 'How long you have to get back, which is how much output loss you must accept',
        },
        {
          id: 'index',
          term: 'Which index',
          definition: 'Binds you to a methodology a statistical agency can revise',
        },
        {
          id: 'hierarchy',
          term: 'Hierarchical or dual',
          definition: 'Whether employment is an objective in its own right or only via inflation',
        },
      ],
      explanation:
        'The horizon is the one that does the most quiet work. "Over the medium term" is what converts a rigid-sounding target into flexible inflation targeting: it gives a committee room to let a supply shock pass through rather than crushing demand to meet a date. Lengthen the horizon indefinitely and the target stops constraining anything; shorten it to a year and every shock becomes a recession. Almost every real framework leaves it deliberately vague, and that vagueness is a design decision rather than an oversight.',
    },
  ],
  keyTakeaways: [
    'The target sets the distance between a normal policy rate and the floor.',
    'Two percent is a convention that earned its standing, not a derived optimum.',
    'The objection to a higher target is the transition, not the destination.',
    'The horizon is what makes inflation targeting flexible.',
  ],
});
