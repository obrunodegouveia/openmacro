import { defineLesson } from '../../schema';

/**
 * The Phillips curve and expectations. The relationship the whole framework
 * rests on, stated honestly: unreliable in the data, indispensable in theory,
 * and dangerous to ignore in exactly one direction.
 */
export const theCurveThatKeepsDyingLesson = defineLesson({
  id: 'the-curve-that-keeps-dying',
  title: 'The Relationship That Keeps Being Pronounced Dead',
  subtitle:
    'Slack is supposed to lower inflation. For thirty years it barely did. Then in 2021 it did, violently, and everyone who had written the obituary had to explain.',
  icon: '📐',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'mc-what-the-curve-says',
      type: 'multiple_choice',
      tags: ['phillips-curve', 'inflation'],
      xp: 35,
      prompt: 'In its modern form, what does the Phillips curve actually claim?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'expectations',
          label: 'Inflation equals expected inflation, plus a term for slack, plus shocks',
        },
        {
          id: 'tradeoff',
          label: 'A country can buy lower unemployment by accepting higher inflation',
          feedback:
            'That was the 1960s reading, and it is what the 1970s destroyed. Accepting higher inflation permanently buys no unemployment at all once people expect it.',
        },
        {
          id: 'wages',
          label: 'Wages rise when unemployment is low',
          feedback:
            'That is Phillips’s original 1958 finding, an empirical regularity in UK wage data. The modern curve is about prices and is built on expectations, which his was not.',
        },
        {
          id: 'money',
          label: 'Inflation is proportional to money growth',
          feedback:
            'A different proposition entirely, and one this course has already dealt with. The curve is about real activity and expectations, not aggregates.',
        },
      ],
      correctOptionId: 'expectations',
      explanation:
        'The expectations term is the whole modern content, and it is why the 1960s trade-off vanished. If inflation is what people expect plus a slack term, then a central bank that engineers surprise inflation gets a temporary gain and a permanently higher expected rate — the gain is one-off and the cost recurs. This is the argument that produced independent central banks with inflation targets, and it is the reason the expectations term matters more than the slack term: slack moves inflation a little, expectations set the level it moves around.',
    },
    {
      id: 'mc-why-flat',
      type: 'multiple_choice',
      tags: ['phillips-curve', 'anchoring'],
      xp: 40,
      prompt:
        'From the 1990s to 2019 inflation barely responded to unemployment. What is the most useful reading of that flatness?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'anchored',
          label: 'Success — anchored expectations hold inflation still while slack varies',
        },
        {
          id: 'dead',
          label: 'The relationship no longer exists',
          feedback:
            'It reappeared with force in 2021, which a relationship that had ceased to exist could not have done. A flat curve is a curve.',
        },
        {
          id: 'globalisation',
          label: 'Global supply broke the link between domestic slack and prices',
          feedback:
            'Globalisation contributed and the timing lines up badly — the flattening persisted after global integration stopped deepening, and reversed while it was still in place.',
        },
        {
          id: 'measurement',
          label: 'Unemployment was measuring slack badly',
          feedback:
            'Participation and underemployment genuinely muddied the measure. That explains some noise rather than a thirty-year flattening across many countries with different labour markets.',
        },
      ],
      correctOptionId: 'anchored',
      explanation:
        'This is the reading with the most uncomfortable implication, which is why it is the one to hold. If the curve was flat because expectations were nailed to the target, then the flatness was a product of credibility rather than a structural feature of the modern economy — and it lasts exactly as long as the credibility does. Central banks spent the 2010s treating a flat curve as permission to run the economy hot at little inflationary cost. It was permission, conditional on a variable they had stopped watching closely.',
    },
    {
      id: 'match-expectation-measures',
      type: 'concept_match',
      tags: ['expectations', 'measurement'],
      xp: 30,
      prompt: 'Four ways to observe expectations. Match each to its weakness.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'households',
          term: 'Household surveys',
          definition: 'Track petrol and food more than anything else, and read high by several points',
        },
        {
          id: 'forecasters',
          term: 'Professional forecasters',
          definition: 'Well behaved, well anchored, and the last to move when something changes',
        },
        {
          id: 'breakeven',
          term: 'Market-implied breakevens',
          definition: 'Contaminated by liquidity and risk premia, so they move when nobody’s view has',
        },
        {
          id: 'wages',
          term: 'Wage settlements',
          definition: 'The slowest and the most consequential — an expectation somebody has signed',
        },
      ],
      explanation:
        'Each measure is unreliable in a different direction, which is why the job is to read all four and mistrust each. The fourth is the one that decides the outcome: a three-year wage agreement is an inflation expectation converted into a contractual obligation, and once signed it cannot be talked down by a communication strategy. A governor watching breakevens daily and settlements quarterly has the weights exactly backwards.',
    },
    {
      id: 'order-unanchoring',
      type: 'order_flow',
      tags: ['expectations', 'inflation'],
      xp: 35,
      prompt: 'Order the way anchored expectations come loose.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'shock', label: 'A large visible price shock — energy, food, rent' },
        { id: 'salience', label: 'Inflation becomes salient enough for households to notice' },
        { id: 'survey', label: 'Short-horizon expectations rise; long-horizon ones do not yet' },
        { id: 'bargain', label: 'Wage bargaining starts to compensate for it' },
        { id: 'persist', label: 'Inflation persists in components the shock never touched' },
        { id: 'costly', label: 'Restoring the anchor now requires real economic pain' },
      ],
      correctOrder: ['shock', 'salience', 'survey', 'bargain', 'persist', 'costly'],
      explanation:
        'The step to watch is the third, because it is the last cheap one. Short-horizon expectations rising while long-horizon ones stay put is the normal, benign response to a visible shock — it is not yet unanchoring. Unanchoring is the fifth step: inflation appearing in items the original shock had nothing to do with. By then the anchor has gone and the cost of replacing it is a recession, which is what Volcker’s tenure demonstrated and what every framework since has been designed to avoid needing. The asymmetry is the whole argument for acting before you are sure.',
    },
  ],
  keyTakeaways: [
    'The modern curve is expectations plus slack plus shocks — the expectations term dominates.',
    'A flat curve is evidence of credibility, and lasts only as long as the credibility.',
    'Every measure of expectations is unreliable differently; wage settlements decide the outcome.',
    'Unanchoring shows up as inflation in components the original shock never touched.',
  ],
});
