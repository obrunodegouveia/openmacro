import { defineLesson } from '../../schema';

/**
 * The qualification of the previous lesson. Productivity is the lever that
 * helps twice, and "build productive assets to lower inflation" is still
 * wrong in three specific ways — the sign of the short run, the mix of assets,
 * and the fact that the gain cannot be spent twice.
 */
export const demandBeforeSupplyLesson = defineLesson({
  id: 'demand-before-supply',
  title: 'A Road Is Demand Before It Is Supply',
  subtitle:
    'Building productive assets does raise output per hour eventually. On the way there it hires workers and buys cement, which is the opposite of what someone trying to lower inflation this year wants.',
  icon: '🚧',
  difficulty: 'advanced',
  estimatedMinutes: 13,
  video: {
    url: 'https://www.youtube.com/watch?v=yrPrzY3rmQM',
    minutes: 5,
    source: 'Khan Academy — The aggregate production function and growth (CC BY-NC-SA)',
  },
  challenges: [
    {
      id: 'mc-sign-flip',
      type: 'multiple_choice',
      tags: ['investment', 'inflation'],
      xp: 40,
      prompt:
        'The government starts a large infrastructure programme while unemployment is already very low. What happens to inflation in the first two years?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'rises',
          label: 'It rises — the spending is demand long before the asset is supply',
        },
        {
          id: 'falls',
          label: 'It falls, because the economy is becoming more productive',
          feedback:
            'Eventually. A road under construction produces nothing; it consumes workers, cement and diesel. The productivity arrives when the road opens, which is years after the wage bill starts.',
        },
        {
          id: 'nothing',
          label: 'Nothing — investment is not consumption',
          feedback:
            'The distinction matters for what you end up owning, not for what it does to demand today. Wages paid to build something are spent in exactly the same shops as any other wages.',
        },
        {
          id: 'depends-funding',
          label: 'It depends whether it is funded by tax or by borrowing',
          feedback:
            'It matters at the margin — taxing takes spending power back out — but even a tax-funded programme moves resources toward construction in an economy that has none spare. The timing problem survives either way.',
        },
      ],
      correctOptionId: 'rises',
      explanation:
        'This is the awkward part of an otherwise good argument. Investment adds to demand immediately and to supply with a lag measured in years — sometimes a decade for a grid connection or a rail line. In an economy with slack, that is close to free. In one at full employment it competes for the same scarce workers and materials as everything else, and the prices of those things go up. None of this is a reason not to build. It is a reason not to sell it as this year’s answer to inflation, because for this year it is the opposite.',
    },
    {
      id: 'match-asset-mix',
      type: 'concept_match',
      tags: ['investment', 'productivity'],
      xp: 45,
      prompt: 'Four things a government can build. Match each to what it actually does to productivity.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'grid',
          term: 'Power grid, fibre, semiconductors',
          definition: 'Strongest effect, and the payoff lags the spending by a decade',
        },
        {
          id: 'roads',
          term: 'Roads and ports in a rich country',
          definition: 'Positive but modest — the network already exists, so returns are on the margin',
        },
        {
          id: 'housing',
          term: 'Housing where it is scarce',
          definition: 'Hits the largest single component of the price index directly',
        },
        {
          id: 'hospitals',
          term: 'Hospitals',
          definition: 'Real welfare gain, weak measured productivity, and costs that rise faster than prices generally',
        },
      ],
      explanation:
        'These are not interchangeable and the argument usually treats them as if they were. The early estimates of enormous returns to public capital came from countries that did not yet have the network; in a country with an interstate system, the marginal road is worth much less than the first one. Hospitals are the sharpest case: they are unambiguously worth building and they are a poor instrument for this particular job, because healthcare is the classic sector where productivity cannot rise much and costs therefore rise faster than everything else. Building more of a cost-disease sector does not lower a price index.',
    },
    {
      id: 'mc-bottleneck',
      type: 'multiple_choice',
      tags: ['investment', 'inflation', 'housing'],
      xp: 40,
      prompt:
        'If the aim is genuinely to lower measured American inflation by building something, what should be built?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'housing',
          label: 'Housing, where it is scarce — shelter is about a third of the index',
        },
        {
          id: 'factories',
          label: 'Factories, to make goods cheaper',
          feedback:
            'Goods are a smaller share of the index than most people assume, and they are already supplied by a world market. Domestic capacity mostly changes where they are made, not what they cost.',
        },
        {
          id: 'anything',
          label: 'Anything productive — it all feeds through eventually',
          feedback:
            'Eventually and diffusely. The question asked what lowers the measured index, and the index is weighted. Relieving the constraint with the biggest weight beats a general improvement.',
        },
        {
          id: 'research',
          label: 'Research capacity, since technology matters most',
          feedback:
            'Best long-run return and the slowest and least certain path to a lower print. Correct answer to a different question.',
        },
      ],
      correctOptionId: 'housing',
      explanation:
        'This is the strongest version of the build-your-way-out argument and it is worth separating from the weak version. Inflation is rarely general — it concentrates where supply cannot respond. In the United States that is overwhelmingly shelter, which carries roughly a third of the index and is constrained by land use rules more than by money. Building there is disinflationary in a way that is direct, measurable and attributable. "Build productive assets" is vague; "relieve the binding constraint in the heaviest component" is a policy.',
    },
    {
      id: 'sim-spend-it-twice',
      type: 'interactive_sim',
      tags: ['productivity', 'inflation', 'sovereign-debt'],
      xp: 60,
      constants: {
        debtRatio: 1,
        interestRate: 0.04,
        labourForceGrowth: 0.005,
      },
      prompt: 'A productivity gain can show up as more output or as lower prices. Which one pays the debt?',
      instructions: 'Raise productivity, then try taking the gain as lower inflation instead',
      narrative:
        'The debt costs 4% and the workforce grows 0.5%. A productivity gain has to go somewhere: either firms produce more at roughly stable prices, or they charge less for the same output. The debt ratio does not care about real output or about prices separately — only about nominal GDP growth against the nominal interest rate. Push productivity up, then pull inflation down by the same amount, and watch what happens to the bottom number.',
      sliders: [
        {
          key: 'productivityGrowth',
          label: 'Productivity growth',
          min: 0,
          max: 0.04,
          step: 0.0025,
          defaultValue: 0.015,
          format: 'percent',
        },
        {
          key: 'inflationRate',
          label: 'Inflation',
          min: 0,
          max: 0.04,
          step: 0.0025,
          defaultValue: 0.02,
          format: 'percent',
          hint: 'Where the central bank lets the gain land',
        },
      ],
      readouts: [
        {
          key: 'growthRate',
          label: 'Nominal GDP growth',
          formulaId: 'nominal_growth_from_productivity',
          format: 'percent',
          caption: 'The only growth the debt ratio can see',
        },
        {
          key: 'snowball',
          label: 'Debt ratio change per year',
          formulaId: 'debt_snowball',
          format: 'percent',
          emphasis: true,
          caption: 'Negative means the debt is being outgrown',
        },
      ],
      objective: {
        description: 'Get the debt ratio falling by at least 2 points a year',
        requiredObservations: [{ sliderKey: 'inflationRate', values: [0, 0.04] }],
        target: { readoutKey: 'snowball', comparator: 'lte', value: -0.02 },
      },
      explanation:
        'You cannot spend the gain twice. Take productivity from 1.5% to 4% with inflation left at target and the ratio falls by about two and a half points a year. Take the same gain as inflation falling to zero instead and almost all of that disappears, because nominal growth is back where it started and nominal growth is the only thing the debt arithmetic can see. So the two claims people make together — that productivity will lower inflation and that productivity will carry the debt — are in mild tension. The debt benefit requires the central bank to hold inflation at target and let the extra *real* growth through. That is not an argument against disinflation; it is a reason to be precise about which benefit you are claiming.',
    },
    {
      id: 'mc-right-version',
      type: 'multiple_choice',
      tags: ['productivity', 'inflation', 'policy'],
      xp: 45,
      prompt: 'Which statement about productive assets and inflation survives all of the above?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'trade-off',
          label: 'They raise the output consistent with 2% inflation, rather than lowering inflation',
        },
        {
          id: 'kills',
          label: 'They are the most reliable way to bring inflation down',
          feedback:
            'They are slow, they add demand first, and over the medium run inflation is roughly what the central bank targets regardless. Reliable is the one thing this route is not.',
        },
        {
          id: 'useless',
          label: 'They make no difference to inflation at all',
          feedback:
            'Too strong in the other direction. Relieving a binding supply constraint — housing above all — lowers measured inflation in a way that is direct and attributable.',
        },
        {
          id: 'only-tech',
          label: 'Only technology counts; physical assets are irrelevant',
          feedback:
            'Technology has the highest ceiling and physical capital is the part a government can actually buy. Dismissing it discards the only lever available to the person making the decision.',
        },
      ],
      correctOptionId: 'trade-off',
      explanation:
        'That is the version worth carrying out of this module. Productive assets improve the trade-off rather than setting the inflation rate: they raise how much real income is compatible with the target, they raise the nominal growth that has to beat the interest rate, and where they relieve a binding constraint they lower measured prices directly. They also cost demand before they add supply, and they are not interchangeable with one another. Holding all three of those at once is harder than holding a slogan, and it is the difference between an argument that survives a hostile room and one that does not.',
    },
  ],
  keyTakeaways: [
    'Investment adds demand immediately and supply years later — the sign flips.',
    'Grids and fibre, roads, housing and hospitals do very different things to productivity.',
    'Relieving the heaviest constrained component — shelter — is the direct disinflation.',
    'The gain cannot be spent twice: the debt needs the real growth, not the disinflation.',
  ],
});
