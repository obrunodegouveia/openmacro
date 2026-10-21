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
    'GDP adds up spending on new final products made in one period. First, see what it leaves out.',
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
        'Four things happen this year. Each one costs €300,000. Which one adds €300,000 to this year’s GDP?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'new-house', label: 'A builder finishes a new house and sells it' },
        {
          id: 'old-house',
          label: 'Someone buys a house built in 1974',
          feedback:
            'The house was made in 1974 and counted then. Only the estate agent’s fee is new this year, because the agent did the work this year. So a housing boom shows up in GDP mostly as fees, not as house prices.',
        },
        {
          id: 'shares',
          label: 'Someone buys €300,000 of shares in the building company',
          feedback:
            'The shares already existed. They just changed owner, and nothing new was made. The broker’s fee counts as production; the €300,000 does not.',
        },
        {
          id: 'pension',
          label: 'The state pays €300,000 in pensions',
          feedback:
            'A pension moves money from one person to another. Nothing is made in return, so it is a transfer. It only counts later, when the pensioner spends it on things.',
        },
      ],
      correctOptionId: 'new-house',
      explanation:
        'GDP counts things that are newly made, once, in the year they were made. Selling an old house, trading shares and paying pensions all move money but make nothing new. So an economy can be very busy, with houses sold, shares traded and benefits paid, and none of that is in GDP.',
    },
    {
      id: 'mc-intermediate',
      type: 'multiple_choice',
      tags: ['gdp', 'double-counting'],
      xp: 25,
      prompt:
        'A steelmaker sells €40,000 of steel to a bridge builder. The builder uses it and is paid €300,000 for the finished bridge. How much of this is in GDP?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'three-hundred', label: '€300,000 — the steel is already inside the bridge’s price' },
        {
          id: 'three-forty',
          label: '€340,000 — both sales happened',
          feedback:
            'That counts the steel twice: once when it is sold, and again inside the bridge. Counting like this would make GDP depend on how many firms a product passes through, not on how much was made.',
        },
        {
          id: 'two-sixty',
          label: '€260,000 — the bridge’s price minus the steel',
          feedback:
            'That is only the builder’s part (its “value added”). Adding up every firm’s part is another correct way to get GDP. But then you must also add the steelmaker’s €40,000, which gives €300,000 again.',
        },
        {
          id: 'forty',
          label: '€40,000 — only the raw material is real production',
          feedback:
            'Turning steel into a bridge is production too. Each step in making something adds value, and that value counts.',
        },
      ],
      correctOptionId: 'three-hundred',
      explanation:
        'Only the final product counts. So there are two ways to get the same number: add up spending on final products, or add up the value each firm adds. Both give €300,000. This is why GDP measures production, not how many times money changed hands.',
    },
    {
      id: 'match-components',
      type: 'concept_match',
      tags: ['gdp', 'national-accounts'],
      xp: 25,
      prompt:
        'GDP can be counted as spending: C + I + G + NX. Match each letter to what goes in it.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'c',
          term: 'C — consumption',
          definition:
            'Households buying things that get used up: food, haircuts, cosmetics, a cinema ticket',
        },
        {
          id: 'i',
          term: 'I — investment (capital formation)',
          definition:
            'Things bought to make other things with: machines, a new factory, a new house, extra stock in a warehouse',
        },
        {
          id: 'g',
          term: 'G — government purchases',
          definition:
            'The state buying goods and work, like a nurse’s work or a road. Pensions and benefits are not included',
        },
        {
          id: 'nx',
          term: 'NX — net exports',
          definition:
            'Exports minus imports, because things made abroad are not this country’s production',
        },
      ],
      explanation:
        'Two of these often confuse people. G leaves out pensions and benefits, so a government can spend huge sums that never enter G. Imports are taken away as a correction, not a penalty: they were already counted inside C, I and G, but they were made abroad.',
    },
    {
      id: 'mc-flow-not-stock',
      type: 'multiple_choice',
      tags: ['gdp', 'flow-vs-stock'],
      xp: 30,
      prompt:
        'A country owns €8 trillion of houses, roads and machines. Its GDP is €400 billion a year. How are these two numbers related?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'flow-stock',
          label: 'One is what the country owns; the other is what it produces each year',
        },
        {
          id: 'twenty-years',
          label: 'The country would need twenty years to rebuild everything',
          feedback:
            'The sum is right but the meaning is wrong. Most of GDP each year is things used up or replaced, not new buildings and machines. The ratio is not a rebuilding plan.',
        },
        {
          id: 'wealth-ratio',
          label: 'GDP is 5% of wealth, so the wealth earns 5% a year',
          feedback:
            'GDP is production, not a return on wealth. Most of it comes from people’s work. Dividing one by the other gives a number that means nothing.',
        },
        {
          id: 'error',
          label: 'The figures cannot be right; GDP cannot be smaller than wealth',
          feedback:
            'It almost always is smaller. A country’s wealth is built from many decades of production. One year of production is only a small slice of it.',
        },
      ],
      correctOptionId: 'flow-stock',
      explanation:
        'This difference is the key idea of the whole module. GDP is a flow: what was produced from January to December. Wealth is a stock: what is standing on 31 December. GDP has no line for what happens to the stock, and the next two lessons show why that matters.',
    },
  ],
  keyTakeaways: [
    'GDP counts new final products, once, in the year they are made.',
    'Second-hand sales, buying shares and transfers like pensions are left out, because nothing new is made.',
    'GDP is a flow per year. Wealth is a stock: what exists at one moment.',
  ],
});
