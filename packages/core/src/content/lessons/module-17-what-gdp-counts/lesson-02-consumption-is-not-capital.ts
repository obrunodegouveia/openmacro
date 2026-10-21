import { defineLesson } from '../../schema';

/**
 * The distinction the module is built on: two outlays of the same size enter
 * GDP identically and leave the economy in different states.
 *
 * Cosmetics is the deliberate example rather than a straw man. It is real
 * output, bought freely by people who wanted it, and it plainly improves some
 * lives — and it is still consumption, which is a statement about the
 * accounts rather than about its worth. Keeping those two claims apart is the
 * lesson.
 */
export const consumptionIsNotCapitalLesson = defineLesson({
  id: 'consumption-is-not-capital',
  title: 'The Hospital and the Lipstick',
  subtitle:
    'Two purchases of €50 million each. The same in GDP, but they leave two very different countries behind.',
  icon: '⚖️',
  difficulty: 'core',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-same-gdp',
      type: 'multiple_choice',
      tags: ['gdp', 'consumption', 'investment'],
      xp: 20,
      prompt:
        'In one country, households buy €50 million of cosmetics. In another, the state builds a €50 million hospital. What happens to each country’s GDP this year?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'same', label: 'Both rise by €50 million' },
        {
          id: 'hospital-more',
          label: 'The hospital counts for more, because it lasts',
          feedback:
            'GDP does not ask how long something lasts. Both were newly made and bought this year, so both count at their price.',
        },
        {
          id: 'cosmetics-less',
          label: 'Cosmetics count for less, because they are a luxury',
          feedback:
            'GDP does not judge which purchases are worthy. Anything made and sold counts at the price it was sold for.',
        },
        {
          id: 'hospital-zero',
          label: 'The hospital does not count — the state built it for itself',
          feedback:
            'Government investment is in G. A hospital built by the state counts just like a hospital built by a company.',
        },
      ],
      correctOptionId: 'same',
      explanation:
        'They are the same in GDP, and that is not a mistake. GDP measures what was produced in the year, and both were produced this year. The real difference between them is not in this number. It is in what each country owns on 31 December.',
    },
    {
      id: 'mc-next-year',
      type: 'multiple_choice',
      tags: ['gdp', 'capital-stock', 'capacity'],
      xp: 25,
      prompt:
        'Now look at the next year. Neither country spends anything new. What is different between them?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'capacity',
          label:
            'One country has a hospital and can treat more patients; the other has used up what it bought',
        },
        {
          id: 'gdp-higher',
          label: 'The hospital country’s GDP is €50 million higher again',
          feedback:
            'The building was counted once, when it was built. From now on, what counts is the treatment the hospital gives each year. That is usually much less than the building cost.',
        },
        {
          id: 'nothing',
          label: 'Nothing — both purchases are in the past',
          feedback:
            'One of them is still standing. Capital is the part of last year’s production that keeps working for you this year. The cosmetics are not that.',
        },
        {
          id: 'cosmetics-better',
          label: 'The cosmetics country is better off, because people got what they wanted',
          feedback:
            'People may well be happier, and that is real, but GDP cannot see it. Being able to produce more is a different question, and the hospital country can.',
        },
      ],
      correctOptionId: 'capacity',
      explanation:
        'This is the difference between consumption and capital. Consumption is used up; capital keeps producing. An economy needs both, because one that only built and never consumed would be pointless. But only capital raises what the country can make next year.',
    },
    {
      id: 'match-two-questions',
      type: 'concept_match',
      tags: ['gdp', 'welfare', 'capacity'],
      xp: 25,
      prompt: 'People often mix up these three questions. Match each one to what answers it.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'produced',
          term: 'How much did we produce this year?',
          definition: 'GDP. It answers this question well, because that is what it was made for',
        },
        {
          id: 'capacity',
          term: 'What can we produce next year?',
          definition:
            'Our buildings, machines and workers, and how well we use them. Only the new buildings and machines appear in this year’s GDP, inside I',
        },
        {
          id: 'welfare',
          term: 'Are people’s lives better?',
          definition:
            'Nothing in GDP. Health, clean air, safety, unpaid care and free time are left out on purpose',
        },
      ],
      explanation:
        'The cosmetics might make someone’s life better, and the hospital surely will. GDP records neither of those things. It records €50 million of production in each case. Simon Kuznets, who created the US national accounts in the 1930s, warned that this number cannot tell you how well a nation is living.',
    },
    {
      id: 'order-capital-chain',
      type: 'order_flow',
      tags: ['gdp', 'capital-stock'],
      xp: 30,
      prompt: 'Put the life of a €50 million road in order, from the spending to the extra production.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'spend', label: 'The state orders a €50m road', detail: 'Counted in G this year' },
        { id: 'wages', label: 'Builders pay wages and buy materials', detail: 'The same €50m, now as people’s income' },
        { id: 'gdp', label: 'GDP rises by €50m in the year the road is built' },
        { id: 'stock', label: 'On 31 December the country owns €50m more' },
        { id: 'freight', label: 'Lorries move goods faster on the new road' },
        { id: 'output', label: 'Firms along the road produce more every year after', detail: 'New production, counted as theirs' },
      ],
      correctOrder: ['spend', 'wages', 'gdp', 'stock', 'freight', 'output'],
      explanation:
        'Two different things are counted here. The €50m enters GDP once, in the year the road is built. The extra production afterwards enters GDP each later year. The road is not counted twice; it makes new production possible. That extra production is what a country gets when it builds instead of consuming.',
    },
  ],
  keyTakeaways: [
    'Consumption and capital count the same in GDP, but they leave different economies behind.',
    'Only capital raises what the country can produce next year.',
    'Whether a purchase makes a life better is a real question, but GDP does not ask it.',
  ],
});
