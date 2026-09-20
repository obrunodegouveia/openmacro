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
    'Two outlays of €50 million, identical in GDP, leaving two different economies behind.',
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
            'Lasting is exactly what GDP does not ask about. Both are newly produced final output bought this year, so both enter at their market price.',
        },
        {
          id: 'cosmetics-less',
          label: 'Cosmetics count for less, being a luxury',
          feedback:
            'The accounts hold no opinion about which purchases are worthy. A thing produced and sold is output at the price it fetched.',
        },
        {
          id: 'hospital-zero',
          label: 'The hospital does not count — the state produced it for itself',
          feedback:
            'Government investment is in G. A hospital built by the state is output just as a hospital built by a company is.',
        },
      ],
      correctOptionId: 'same',
      explanation:
        'Identical in GDP, and that is not an oversight — GDP measures production in a period, and both were produced in the period. The difference between them is real, but it is not in this number. It is in what each country owns on the 31st of December.',
    },
    {
      id: 'mc-next-year',
      type: 'multiple_choice',
      tags: ['gdp', 'capital-stock', 'capacity'],
      xp: 25,
      prompt:
        'Now look at the following year, with no new spending in either country. What differs?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'capacity',
          label:
            'One country has a hospital and can treat patients it could not treat before; the other has used up what it bought',
        },
        {
          id: 'gdp-higher',
          label: 'The hospital country’s GDP is €50 million higher again',
          feedback:
            'The building was counted once, when it was built. What the hospital does from here is the *treatment* it produces, which is new output each year — usually far less than the building cost, and never the cost repeated.',
        },
        {
          id: 'nothing',
          label: 'Nothing — both outlays are in the past',
          feedback:
            'One of them is standing there. Capital is the part of last year’s output that is still working for you this year, and that is precisely what the cosmetics were not.',
        },
        {
          id: 'cosmetics-better',
          label: 'The cosmetics country is better off, because people got what they wanted',
          feedback:
            'They may well be happier — and that is a real thing which this number cannot see. But capacity to produce is a different question from satisfaction, and the hospital country has more of it.',
        },
      ],
      correctOptionId: 'capacity',
      explanation:
        'This is the whole distinction between consumption and capital formation. Consumption is output used up; capital is output that goes on producing. Both are legitimate uses of a year’s work — an economy that only built and never consumed would be pointless — but only one of them raises what next year can make.',
    },
    {
      id: 'match-two-questions',
      type: 'concept_match',
      tags: ['gdp', 'welfare', 'capacity'],
      xp: 25,
      prompt: 'Three different questions that get confused with one another. Match each to what answers it.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'produced',
          term: 'How much did we produce this year?',
          definition: 'GDP — and it answers this one well, which is what it was built for',
        },
        {
          id: 'capacity',
          term: 'What can we produce next year?',
          definition:
            'The capital stock, the workforce and how well they are combined — of which only the addition to capital appears in this year’s GDP, inside I',
        },
        {
          id: 'welfare',
          term: 'Are people’s lives better?',
          definition:
            'Nothing in the national accounts. Health, clean air, safety, unpaid care and free time are absent by construction, not by oversight',
        },
      ],
      explanation:
        'The cosmetics really might make someone’s life better, and the hospital certainly will. Neither of those facts is what GDP recorded — it recorded €50 million of production in each case. Simon Kuznets, who built the US accounts in the 1930s, warned in his first report to Congress that the welfare of a nation can scarcely be inferred from this measure. It is still true, and it is still ignored.',
    },
    {
      id: 'order-capital-chain',
      type: 'order_flow',
      tags: ['gdp', 'capital-stock'],
      xp: 30,
      prompt: 'Put the life of a €50 million road in order, from outlay to output.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'spend', label: 'The state contracts €50m of roadbuilding', detail: 'Enters G this year' },
        { id: 'wages', label: 'Contractors pay wages and buy materials', detail: 'The same €50m, seen as income' },
        { id: 'gdp', label: 'GDP rises by €50m in the year the road is built' },
        { id: 'stock', label: 'The capital stock is €50m larger on the 31st' },
        { id: 'freight', label: 'Freight moves faster along the new route' },
        { id: 'output', label: 'Firms along it produce more each year afterwards', detail: 'New output, counted again — this time as their production' },
      ],
      correctOrder: ['spend', 'wages', 'gdp', 'stock', 'freight', 'output'],
      explanation:
        'Two distinct things are counted here and it is worth being exact about which is which. The €50m enters GDP once, in the year of building. The extra freight and production afterwards enter GDP again in each later year — not because the road is counted twice, but because the road makes new output possible. That second stream is the return on capital formation, and it is what an economy buys when it builds rather than consumes.',
    },
  ],
  keyTakeaways: [
    'Consumption and capital formation enter GDP identically and leave different economies behind.',
    'Only capital formation raises what the following year can produce.',
    'Whether a purchase improves a life is a real question that GDP does not ask.',
  ],
});
