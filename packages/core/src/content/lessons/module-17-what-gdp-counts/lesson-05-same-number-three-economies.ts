import { defineLesson } from '../../schema';

/**
 * The capstone: drive the split between capital formation and consumed
 * output, watch GDP refuse to move, and watch the decade behind it move a
 * great deal.
 *
 * The return on capital is a flat rate rather than a growth model. That is a
 * simplification and the narrative says so — the object is the sign and the
 * order of magnitude, not a forecast.
 */
export const sameNumberThreeEconomiesLesson = defineLesson({
  id: 'same-number-three-economies',
  title: 'Same Number, Three Economies',
  subtitle:
    'One amount of spending, one GDP figure, and a next ten years that depend on what the money bought.',
  icon: '🔀',
  difficulty: 'advanced',
  estimatedMinutes: 8,
  challenges: [
    {
      id: 'sim-what-it-bought',
      type: 'interactive_sim',
      tags: ['gdp', 'capital-stock', 'war'],
      xp: 40,
      currency: 'EUR',
      // Every input is a slider here; the panel is the argument.
      constants: {},
      prompt: 'Spend the same money in different ways.',
      instructions: 'Move the split and see which number never changes',
      narrative:
        'A state spends money this year. Part of it becomes lasting capital that keeps working: roads, hospitals, housing. The rest is used up or destroyed within the year, like ammunition that is fired. GDP equals the spending either way. What the economy can produce afterwards does not. Set the split to 0% and then to 100%, and compare the next ten years.',
      sliders: [
        {
          key: 'outlay',
          label: 'This year’s spending',
          min: 50000000000,
          max: 200000000000,
          step: 10000000000,
          defaultValue: 100000000000,
          format: 'currency',
          hint: 'What the state pays for, whatever it buys',
        },
        {
          key: 'capitalShare',
          label: 'Share that becomes lasting capital',
          min: 0,
          max: 1,
          step: 0.05,
          defaultValue: 0.5,
          format: 'percent',
          hint: '0% is all used up or destroyed; 100% is all roads and hospitals',
        },
        {
          key: 'returnOnCapital',
          label: 'Extra production per year from capital',
          min: 0.02,
          max: 0.15,
          step: 0.01,
          defaultValue: 0.08,
          format: 'percent',
          hint: 'What each euro of roads or hospitals adds to production each year',
        },
      ],
      readouts: [
        {
          key: 'gdpThisYear',
          label: 'GDP this year',
          formulaId: 'gdp_from_outlay',
          format: 'currency',
          emphasis: true,
          caption: 'The spending, whatever it bought',
        },
        {
          key: 'capitalAdded',
          label: 'Still standing next year',
          formulaId: 'capital_formed',
          format: 'currency',
          caption: 'spending × share',
        },
        {
          key: 'yieldPerYear',
          label: 'Extra production per year afterwards',
          formulaId: 'capital_yield',
          format: 'currency',
          caption: 'capital × return',
        },
        {
          key: 'yieldDecade',
          label: 'Over ten years',
          formulaId: 'capital_yield_decade',
          format: 'currency',
          caption: 'simply added up, to keep it simple',
        },
      ],
      objective: {
        description:
          'Compare spending that is all destroyed with spending that is all built, and end with more than €50bn over ten years',
        requiredObservations: [{ sliderKey: 'capitalShare', values: [0, 1] }],
        target: { readoutKey: 'yieldDecade', comparator: 'gte', value: 50000000000 },
      },
      explanation:
        'The big number never moved. Whatever the split, GDP equalled the spending, because GDP records production in the year, and the production happened either way. Everything else went from nothing to a lot. So always ask what a GDP figure was spent on. “The economy grew 4%” is the start of a question, not the answer.',
    },
    {
      id: 'mc-three-economies',
      type: 'multiple_choice',
      tags: ['gdp', 'interpretation'],
      xp: 35,
      prompt:
        'Three countries each report €100bn of GDP growth. One built hospitals. One made ammunition and fired it. One rebuilt after a flood. Which is richest at the end of the year?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'hospitals',
          label: 'The hospital builder — it has €100bn of new hospitals and lost nothing',
        },
        {
          id: 'all-equal',
          label: 'All three equally — the growth figure is the same',
          feedback:
            'The growth figure is the same, but the countries are not. One has new hospitals. One has fired its shells and owns less. One has only replaced what it already had.',
        },
        {
          id: 'flood',
          label: 'The flood rebuilder, because rebuilding is the most useful spending',
          feedback:
            'Rebuilding brings back what existed. It is useful and necessary, but it leaves the country about where it was before the flood, not ahead.',
        },
        {
          id: 'munitions',
          label: 'The ammunition maker, since defence protects everything else',
          feedback:
            'Defence may be necessary, but that is a different question from being richer. This country now owns less than it did before.',
        },
      ],
      correctOptionId: 'hospitals',
      explanation:
        '“Necessary” and “makes us richer” are separate questions. A country may have to fight, and defence may be the most important money it spends. It still owns less than a country that spent the same on hospitals. GDP cannot tell these three apart. That is not a reason to distrust GDP, but a reason to always ask what the money bought.',
    },
    {
      id: 'mc-what-would-fix-it',
      type: 'multiple_choice',
      tags: ['gdp', 'net-domestic-product', 'measurement'],
      xp: 35,
      prompt:
        'Which measure comes closest to answering: “Did what the country owns grow or shrink this year?”',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'ndp',
          label:
            'Net domestic product — GDP minus the wear and tear on what already exists',
        },
        {
          id: 'gni',
          label: 'Gross national income, because it counts income instead of spending',
          feedback:
            'GNI only changes whose production is counted: residents instead of everything made in the country. Like GDP, it says nothing about what happened to what the country owns.',
        },
        {
          id: 'real-gdp',
          label: 'Real GDP, because it removes inflation',
          feedback:
            'That fixes the units, not the question. Real GDP still only counts production, with no line for destruction.',
        },
        {
          id: 'none',
          label: 'None — the national accounts do not track what a country owns',
          feedback:
            'They do. The national balance sheet tracks buildings and machines, and wear and tear is in the standard tables. They are just not quoted on the news.',
        },
      ],
      correctOptionId: 'ndp',
      explanation:
        'NDP takes away the normal wear and tear (depreciation) on what exists, so it is closer. But it is still not the full answer: normal wear is not the same as a warehouse being flattened. Losses from war and disasters are recorded elsewhere, outside both GDP and NDP. The information exists; people just do not quote it.',
    },
  ],
  keyTakeaways: [
    'GDP shows how much was spent, but not what the money bought.',
    '“Necessary” and “makes us richer” are different. Defence can be the first without being the second.',
    'Net domestic product and the national balance sheet already show what GDP cannot.',
  ],
});
