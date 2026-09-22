import { defineLesson } from '../../schema';

/**
 * The lesson the rest of the module points at: one policy rate sets the price
 * of credit and not its destination, and where credit lands decides whether a
 * boom leaves capacity behind or only higher prices for things that already
 * existed.
 *
 * Jordà, Schularick and Taylor's long-run data is the spine here: mortgage
 * lending rose from roughly a third of advanced-economy bank balance sheets
 * around 1900 to roughly two thirds by 2010, and credit booms concentrated in
 * real estate are followed by deeper recessions and slower recoveries than
 * booms in business lending.
 */
export const whereTheCreditGoesLesson = defineLesson({
  id: 'where-the-credit-goes',
  title: 'The Rate Sets the Price, Not the Destination',
  subtitle:
    'Two economies borrow the same amount at the same rate. One is richer in ten years and one has expensive houses.',
  icon: '🏗️',
  difficulty: 'advanced',
  estimatedMinutes: 13,
  challenges: [
    {
      id: 'mc-what-the-rate-cannot-do',
      type: 'multiple_choice',
      tags: ['credit', 'policy-rate', 'allocation'],
      xp: 30,
      prompt:
        'You cut the rate to encourage investment in productive capacity. What does the instrument actually do?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'all-credit',
          label: 'It cheapens all borrowing at once — for factories, for existing houses, for share buybacks',
        },
        {
          id: 'investment',
          label: 'It lowers the hurdle rate, so marginal investment projects get funded',
          feedback:
            'True, and incomplete in the way that matters. The same cut lowers the hurdle for buying an asset that already exists, and that is usually the faster, safer, more collateralised loan for a bank to write.',
        },
        {
          id: 'banks',
          label: 'It gives banks cheaper funding, and they choose what to do with it',
          feedback:
            'Closer. But the point is not that banks choose freely — it is that the price signal you sent carries no information about destination at all.',
        },
        {
          id: 'inflation',
          label: 'It raises inflation expectations, which encourages spending now',
          feedback:
            'One channel among several, and it says nothing about composition either. Spending now can mean a new plant or a second-hand flat.',
        },
      ],
      correctOptionId: 'all-credit',
      explanation:
        'A policy rate is one number for an entire economy. It can make credit cheaper or dearer and it has no way to say what for. That is not a flaw to be fixed — it is what makes the instrument robust and hard to politicise — but it means the composition of a credit boom is decided by banks, collateral rules and tax law, not by the committee that started it.',
    },
    {
      id: 'sim-where-it-lands',
      type: 'interactive_sim',
      tags: ['credit', 'capital-formation'],
      xp: 40,
      constants: {},
      prompt: 'Same credit, two destinations.',
      instructions: 'Move the split to both ends and compare what the economy has afterwards',
      narrative:
        'Credit grows by some share of GDP this year. Part of it funds new productive capital — plant, equipment, housing that did not exist before, infrastructure. The rest buys assets that already exist: land, second-hand property, shares. Both are lending, both show up in the credit aggregates, and both look identical in the statistics your staff hand you. Only one raises what the economy can produce next year.',
      sliders: [
        {
          key: 'creditGrowth',
          label: 'New credit, as a share of GDP',
          min: 0.01,
          max: 0.2,
          step: 0.01,
          defaultValue: 0.08,
          format: 'percent',
          hint: 'Spain ran double digits for several years before 2008',
        },
        {
          key: 'capitalShare',
          label: 'Share funding new productive capital',
          min: 0,
          max: 1,
          step: 0.05,
          defaultValue: 0.35,
          format: 'percent',
          hint: 'Mortgages on existing housing are the largest single use in most rich economies',
        },
        {
          key: 'capitalReturn',
          label: 'Annual output the new capital yields',
          min: 0.02,
          max: 0.15,
          step: 0.01,
          defaultValue: 0.08,
          format: 'percent',
        },
      ],
      readouts: [
        {
          key: 'capacity',
          label: 'Extra output per year, afterwards',
          formulaId: 'capacity_from_credit',
          format: 'percent',
          emphasis: true,
          caption: 'credit × productive share × return',
        },
        {
          key: 'productive',
          label: 'Into new capital',
          formulaId: 'credit_to_capital',
          format: 'percent',
          caption: 'credit × share',
        },
        {
          key: 'existing',
          label: 'Into assets that already exist',
          formulaId: 'credit_to_existing_assets',
          format: 'percent',
          caption: 'bids up a fixed stock',
        },
      ],
      objective: {
        description: 'Compare both extremes of the split, then leave the economy gaining at least 1% of output a year',
        requiredObservations: [{ sliderKey: 'capitalShare', values: [0, 1] }],
        target: { readoutKey: 'capacity', comparator: 'gte', value: 0.01 },
      },
      explanation:
        'The credit aggregate your staff report is the same number at both ends of that slider. What differs is everything: at one end the economy can produce more next year, at the other the same houses cost more and the debt against them is larger. Note what happens to the second readout as you push credit growth up with a low productive share — that is a country talking itself into a housing boom while congratulating itself on strong lending growth.',
    },
    {
      id: 'mc-mortgage-shift',
      type: 'multiple_choice',
      tags: ['credit', 'history', 'housing'],
      xp: 35,
      prompt:
        'Across advanced economies, mortgage lending went from roughly a third of bank balance sheets around 1900 to roughly two thirds by 2010. What is the significance for a central bank?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'transmission',
          label: 'The rate now steers mostly property lending',
        },
        {
          id: 'housing-good',
          label: 'Housing finance became more efficient, which is a success worth defending',
          feedback:
            'Access to mortgage credit did improve lives and the shift is not straightforwardly bad. The question here is what it does to the instrument: the transmission channel now runs mostly through house prices.',
        },
        {
          id: 'banks-safer',
          label: 'Banks became safer, since mortgages are well collateralised',
          feedback:
            'Loan by loan, yes — which is exactly why the shift happened. In aggregate it concentrated the banking system in one asset whose price moves together everywhere, which is the opposite of safe.',
        },
        {
          id: 'nothing',
          label: 'Little — credit is credit, whatever it is secured on',
          feedback:
            'The long-run evidence says otherwise. Credit booms concentrated in real estate are followed by deeper recessions and slower recoveries than booms in business lending of the same size.',
        },
      ],
      correctOptionId: 'transmission',
      explanation:
        'This is the structural fact that makes the instrument blunter than the textbook assumes. When you cut, the largest single response is in lending against a stock of housing that does not grow when its price does. When you raise, the first thing to break is household budgets rather than corporate investment. The rate is still the right tool for aggregate demand — and it is a poor tool for a problem that is specifically about composition.',
    },
    {
      id: 'match-composition-tools',
      type: 'concept_match',
      tags: ['macroprudential', 'credit'],
      xp: 35,
      prompt: 'If the rate cannot steer composition, something else has to. Match each tool to what it does.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'ltv',
          term: 'Loan-to-value and income caps',
          definition:
            'Limits how much can be borrowed against a given property or income — bites on mortgage credit and leaves business lending alone',
        },
        {
          id: 'sectoral',
          term: 'Sectoral capital requirements',
          definition:
            'Makes a bank hold more capital against one kind of exposure, so that lending becomes dearer without moving the policy rate',
        },
        {
          id: 'ccyb',
          term: 'The countercyclical buffer',
          definition:
            'Capital built up while credit is growing fast and released in the downturn, so lending need not stop when losses arrive',
        },
        {
          id: 'collateral',
          term: 'The collateral framework',
          definition:
            'What the central bank itself will lend against, and at what haircut — which quietly decides what banks find it worth holding',
        },
      ],
      explanation:
        'These are the instruments that act on composition, and a governor who only knows the policy rate is working with one of five levers. Worth knowing the objection too: steering credit towards favoured uses is a short step from allocating it politically, which is what credit guidance became in several countries. The defensible version is symmetric and rule-based — leaning against concentration wherever it appears, rather than picking industries.',
    },
    {
      id: 'mc-growth-conclusion',
      type: 'multiple_choice',
      tags: ['growth', 'credit', 'framework'],
      xp: 35,
      prompt:
        'What is the most defensible statement about a central bank and long-run growth?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'conditions',
          label: 'It cannot create growth, and it can destroy it — stability and sound credit allocation are the contribution',
        },
        {
          id: 'engine',
          label: 'Low rates drive growth, so keep them low',
          feedback:
            'Rates below neutral stimulate demand for as long as there is slack, and after that they produce inflation, not output. The module opened with why: the rate is a position against neutral, and neutral is set by things the bank does not control.',
        },
        {
          id: 'irrelevant',
          label: 'Monetary policy is neutral in the long run, so it has no bearing on growth',
          feedback:
            'Long-run neutrality is about the price level, not about damage. A banking crisis, a lost decade or an unanchored inflation each leave permanent scars on output, and all three are avoidable.',
        },
        {
          id: 'allocate',
          label: 'It should direct credit to productive sectors',
          feedback:
            'The instinct is right and the mechanism is dangerous. A central bank choosing industries is a central bank making industrial policy without a mandate for it — and the record of credit guidance is mixed at best.',
        },
      ],
      correctOptionId: 'conditions',
      explanation:
        'Growth comes from capital, labour, and the productivity of combining them. A central bank supplies none of those. What it can do is keep the unit of account stable enough to plan in, keep the payment system standing, stop credit concentrating until it breaks, and avoid being the cause of a depression. That sounds modest until you look at the economies where it was not done — and it is the honest technical answer to what the job is for.',
    },
  ],
  keyTakeaways: [
    'A policy rate prices credit and cannot address it; composition is decided elsewhere.',
    'Lending against existing assets raises their price; lending into new capital raises capacity.',
    'Composition is steered by LTV limits, sectoral capital, the buffer and the collateral framework.',
    'A central bank cannot create growth and can destroy it; that asymmetry is the job.',
  ],
});
