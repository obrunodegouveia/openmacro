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
    'One outlay, one GDP figure, and a decade that depends entirely on what the money bought.',
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
      prompt: 'Spend the same money three ways.',
      instructions: 'Move the split and watch which number refuses to change',
      narrative:
        'A state commits an outlay this year. Some of it becomes durable capital that goes on working — roads, hospitals, housing. The rest becomes output that is used up or destroyed within the year: munitions expended, and anything else consumed. GDP is the outlay. What the economy can produce afterwards is not. Put the split at 0% and at 100% and compare the decade.',
      sliders: [
        {
          key: 'outlay',
          label: 'This year’s outlay',
          min: 50000000000,
          max: 200000000000,
          step: 10000000000,
          defaultValue: 100000000000,
          format: 'currency',
          hint: 'What the state contracts for, whatever it buys',
        },
        {
          key: 'capitalShare',
          label: 'Share that becomes durable capital',
          min: 0,
          max: 1,
          step: 0.05,
          defaultValue: 0.5,
          format: 'percent',
          hint: '0% is entirely used up or destroyed; 100% is entirely roads and hospitals',
        },
        {
          key: 'returnOnCapital',
          label: 'Annual output that capital yields',
          min: 0.02,
          max: 0.15,
          step: 0.01,
          defaultValue: 0.08,
          format: 'percent',
          hint: 'What a euro of infrastructure adds to output each year',
        },
      ],
      readouts: [
        {
          key: 'gdpThisYear',
          label: 'GDP this year',
          formulaId: 'gdp_from_outlay',
          format: 'currency',
          emphasis: true,
          caption: 'The outlay, whatever it bought',
        },
        {
          key: 'capitalAdded',
          label: 'Still standing next year',
          formulaId: 'capital_formed',
          format: 'currency',
          caption: 'outlay × share',
        },
        {
          key: 'yieldPerYear',
          label: 'Extra output per year afterwards',
          formulaId: 'capital_yield',
          format: 'currency',
          caption: 'capital × return',
        },
        {
          key: 'yieldDecade',
          label: 'Over ten years',
          formulaId: 'capital_yield_decade',
          format: 'currency',
          caption: 'undiscounted, to keep one idea at a time',
        },
      ],
      objective: {
        description:
          'Compare a fully destroyed outlay with a fully built one, and leave the decade above €50bn',
        requiredObservations: [{ sliderKey: 'capitalShare', values: [0, 1] }],
        target: { readoutKey: 'yieldDecade', comparator: 'gte', value: 50000000000 },
      },
      explanation:
        'The hero number never moved. Whatever you did to the split, GDP was the outlay — because GDP is a record of production in the year, and the production happened either way. Everything else on the panel moved from nothing to a great deal. That gap is the entire case for reading a GDP figure alongside what it was spent on, and it is why "the economy grew 4%" is the beginning of a question rather than the end of one.',
    },
    {
      id: 'mc-three-economies',
      type: 'multiple_choice',
      tags: ['gdp', 'interpretation'],
      xp: 35,
      prompt:
        'Three countries each report €100bn of GDP growth. One built hospitals, one built and expended munitions, one rebuilt after a flood. Which is richest at the end of the year?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'hospitals',
          label: 'The hospital builder — it has €100bn of new assets and lost nothing',
        },
        {
          id: 'all-equal',
          label: 'All three equally — the growth figure is the same',
          feedback:
            'The growth figure is the same and the countries are not. One has new hospitals, one has spent shells and a smaller capital stock, and one has replaced what it already had.',
        },
        {
          id: 'flood',
          label: 'The flood rebuilder, because reconstruction is the most productive spending',
          feedback:
            'Reconstruction restores what existed. Useful, necessary, and it leaves the country roughly where it was before the flood — not ahead of it.',
        },
        {
          id: 'munitions',
          label: 'The munitions producer, since defence protects everything else',
          feedback:
            'It may be necessary, and that is a different claim from being richer. The lesson is about what the accounts show, and what they show is a country with less standing than it had.',
        },
      ],
      correctOptionId: 'hospitals',
      explanation:
        'Necessity and enrichment are separate questions, and both are real. A country may have to fight, and defence spending can be the most important money it ever spends — while still leaving it poorer in capital than a country that spent the same sum on hospitals. GDP cannot tell those three apart, which is not a reason to distrust the number so much as a reason to always ask the second question.',
    },
    {
      id: 'mc-what-would-fix-it',
      type: 'multiple_choice',
      tags: ['gdp', 'net-domestic-product', 'measurement'],
      xp: 35,
      prompt:
        'Which existing measure comes closest to answering "did the capital stock grow or shrink this year"?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'ndp',
          label:
            'Net domestic product — GDP minus capital consumption, the wear on what already exists',
        },
        {
          id: 'gni',
          label: 'Gross national income, because it counts income rather than spending',
          feedback:
            'GNI changes whose production is counted — residents rather than territory. It is just as gross as GDP, and just as silent on what happened to the stock.',
        },
        {
          id: 'real-gdp',
          label: 'Real GDP, because it strips out inflation',
          feedback:
            'That fixes the units, not the question. Real GDP is still a flow of production with no line for destruction.',
        },
        {
          id: 'none',
          label: 'None — the national accounts have no concept of the capital stock',
          feedback:
            'They very much do: the balance sheet accounts track produced assets, and capital consumption already appears in the standard tables. They are simply not what gets quoted on the news.',
        },
      ],
      correctOptionId: 'ndp',
      explanation:
        'NDP subtracts the depreciation of existing capital, which is why it is the closer measure — and it is still not a complete answer, because ordinary depreciation is not the same as a warehouse being flattened. Losses from war and disaster sit in "other changes in the volume of assets", outside both GDP and NDP. The information exists. It is a reporting habit, not a measurement gap, that nobody quotes it.',
    },
  ],
  keyTakeaways: [
    'GDP tracks the size of the outlay and is blind to what the outlay bought.',
    'Necessary and enriching are different claims; defence can be the first without being the second.',
    'Net domestic product and the balance sheet accounts already hold what GDP cannot show.',
  ],
});
