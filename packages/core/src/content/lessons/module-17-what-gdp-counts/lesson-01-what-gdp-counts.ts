import { defineLesson } from '../../schema';

/**
 * The expenditure identity, and the three things people assume are in GDP
 * that are not: second-hand sales, financial transactions and transfers.
 *
 * Every number here is arithmetic on figures stated in the challenge, so the
 * lesson does not age. Where a real figure appears it is labelled.
 */
export const whatGdpCountsLesson = defineLesson({
  id: 'what-gdp-counts',
  title: 'A Number About Spending, Not About Wealth',
  subtitle:
    'GDP adds up what was spent on newly produced final output in a period. Start with what that sentence excludes.',
  icon: '📐',
  difficulty: 'intro',
  estimatedMinutes: 9,
  challenges: [
    {
      id: 'mc-which-counts',
      type: 'multiple_choice',
      tags: ['gdp', 'national-accounts'],
      xp: 20,
      prompt:
        'Four things happen this year, each for €300,000. Which one adds €300,000 to this year’s GDP?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'new-house', label: 'A builder finishes a new house and sells it' },
        {
          id: 'old-house',
          label: 'Someone buys a house built in 1974',
          feedback:
            'The house was produced in 1974 and counted then. Only the estate agent’s fee is new output this year — a service produced this year — which is why a housing boom shows up in GDP mostly as fees, not as the price of the houses.',
        },
        {
          id: 'shares',
          label: 'Someone buys €300,000 of shares in the building company',
          feedback:
            'That is a change of ownership of an existing claim. Nothing was produced. The broker’s commission is output; the €300,000 is not.',
        },
        {
          id: 'pension',
          label: 'The state pays €300,000 in pensions',
          feedback:
            'A transfer moves purchasing power from one person to another without anything being produced in exchange. It is counted when the pensioner spends it, as consumption — not when it is paid.',
        },
      ],
      correctOptionId: 'new-house',
      explanation:
        'GDP counts production, and it counts it once, in the period it happened. Second-hand sales, financial trades and transfers all move money without producing anything, so all three are excluded. This is the first place intuition goes wrong: an economy can be very busy — houses changing hands, markets trading, benefits being paid — with none of that activity in GDP.',
    },
    {
      id: 'mc-intermediate',
      type: 'multiple_choice',
      tags: ['gdp', 'double-counting'],
      xp: 25,
      prompt:
        'A steelmaker sells €40,000 of steel to a bridge builder, who is paid €300,000 for the finished bridge. How much of this is in GDP?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'three-hundred', label: '€300,000 — the steel is inside the bridge’s price' },
        {
          id: 'three-forty',
          label: '€340,000 — both transactions happened',
          feedback:
            'That counts the steel twice: once when sold, and again inside the bridge. Every intermediate good would be double-counted this way, and the total would depend on how many firms the supply chain passes through rather than on how much was produced.',
        },
        {
          id: 'two-sixty',
          label: '€260,000 — the bridge’s price minus the steel',
          feedback:
            'That is the builder’s value added, and summing value added across every firm is the *other* correct way to reach GDP. But then you must also add the steelmaker’s €40,000, which brings you back to €300,000.',
        },
        {
          id: 'forty',
          label: '€40,000 — only the raw material is real production',
          feedback:
            'Turning steel into a bridge is production too. The whole point of the value-added method is that each stage adds something countable.',
        },
      ],
      correctOptionId: 'three-hundred',
      explanation:
        'Only final output counts, which is why there are two routes to the same number: add up spending on final goods, or add up value added at every stage. €300,000 either way. Hold on to this — it is what makes GDP a measure of production rather than of how many times money changed hands.',
    },
    {
      id: 'match-components',
      type: 'concept_match',
      tags: ['gdp', 'national-accounts'],
      xp: 25,
      prompt:
        'Expenditure-side GDP is C + I + G + NX. Match each component to what actually goes in it.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'c',
          term: 'C — consumption',
          definition:
            'Households buying goods and services that are used up: food, haircuts, cosmetics, a cinema ticket',
        },
        {
          id: 'i',
          term: 'I — gross capital formation',
          definition:
            'Output bought to produce with rather than to use up: machines, a new factory, a new house, additions to inventory',
        },
        {
          id: 'g',
          term: 'G — government purchases',
          definition:
            'The state buying output — a nurse’s work, a road — but never its transfers, which produce nothing',
        },
        {
          id: 'nx',
          term: 'NX — net exports',
          definition:
            'Exports minus imports, because what was produced abroad is not this country’s production',
        },
      ],
      explanation:
        'Two of these trip people up. G excludes pensions and benefits, so a government can spend enormous sums that never enter G. And imports are subtracted not as a penalty but as a correction: they were already inside C, I and G, and they were not produced here.',
    },
    {
      id: 'mc-flow-not-stock',
      type: 'multiple_choice',
      tags: ['gdp', 'flow-vs-stock'],
      xp: 30,
      prompt:
        'A country has €8 trillion of houses, roads and machines standing, and a GDP of €400 billion. What is the relationship between those two numbers?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'flow-stock',
          label: 'One is a stock and one is a flow — wealth standing, against production per year',
        },
        {
          id: 'twenty-years',
          label: 'The country would take twenty years to rebuild what it has',
          feedback:
            'The arithmetic is right and the meaning is not: most of GDP each year is consumption and replacement, not new capital. The ratio tells you nothing about a rebuilding schedule.',
        },
        {
          id: 'wealth-ratio',
          label: 'GDP is 5% of wealth, so the capital stock returns 5% a year',
          feedback:
            'GDP is output, not a return on capital — labour produces most of it. Dividing one by the other yields a number with no interpretation.',
        },
        {
          id: 'error',
          label: 'The figures are inconsistent; GDP cannot be smaller than the capital stock',
          feedback:
            'It almost always is. A country’s accumulated wealth is the result of decades of output; one year of output is a slice of that, typically well under a fifth.',
        },
      ],
      correctOptionId: 'flow-stock',
      explanation:
        'This distinction is the spine of the whole module. GDP is a flow: how much was produced between January and December. The capital stock is what is standing on the 31st. A flow measure has no line for what happened to the stock, which is why the next two lessons can happen at all.',
    },
  ],
  keyTakeaways: [
    'GDP counts newly produced final output, once, in the period it was produced.',
    'Second-hand sales, share purchases and transfers are excluded — nothing was produced.',
    'GDP is a flow per year; the capital stock is what stands at a point in time.',
  ],
});
