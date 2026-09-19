import { defineLesson } from '../../schema';

/** Video 16. Why target a rate rather than a quantity: measurement, and the elasticity argument with the planting season. */
export const kabRatesNotQuantitiesLesson = defineLesson({
  id: 'kab-rates-not-quantities',
  title: 'Why Not Just Target the Money Supply?',
  subtitle:
    'Fix the quantity and good projects go unfunded in spring while bad ones get funded in autumn. Fix the price instead.',
  icon: '🌱',
  difficulty: 'advanced',
  estimatedMinutes: 18,
  video: {
    url: 'https://www.youtube.com/watch?v=yOgGhPIHnlA',
    minutes: 12,
    source: 'Khan Academy — Banking 16',
  },
  challenges: [
    {
      id: 'mc-fixed-quantity',
      type: 'multiple_choice',
      tags: ['monetary-policy', 'capital-allocation'],
      xp: 30,
      prompt:
        'Money supply is held fixed. In planting season there are more good projects than money; afterwards there are fewer. What goes wrong?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'both-ways',
          label:
            'Good projects are turned away in spring, and money chases bad ones afterwards',
        },
        {
          id: 'inflation',
          label: 'Inflation, because the money has nowhere useful to go',
          feedback:
            'The problem described is misallocation rather than the price level. The same quantity of money funds a 12% project in one season and a 1% project in another.',
        },
        {
          id: 'spring-only',
          label: 'Only the spring problem — good projects are rationed out',
          feedback:
            'Half of it. The autumn half is worse: with demand gone and money unchanged, genuinely poor projects clear at 1% or 2%.',
        },
        {
          id: 'nothing',
          label: 'Nothing — the market allocates to the highest bidder either way',
          feedback:
            'It does, and that is the trouble. The highest bidder in a slack season may be a project the video calls shady, and funding it destroys wealth.',
        },
      ],
      correctOptionId: 'both-ways',
      explanation:
        'A fixed quantity means the interest rate swings with demand, so the hurdle a project must clear depends on the season rather than on its merit. Targeting the rate instead sets a constant hurdle and lets the quantity move — funding every project above the threshold, whenever it appears.',
    },
    {
      id: 'mc-measurement',
      type: 'multiple_choice',
      tags: ['monetary-policy', 'measurement'],
      xp: 20,
      prompt: 'What is the practical, unglamorous argument for targeting a rate?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'observable',
          label: 'The interbank rate can be observed continuously; M2 has to be surveyed',
        },
        {
          id: 'legal',
          label: 'The central bank is legally barred from targeting quantities',
          feedback:
            'No such bar is described, and the video notes some economists do argue for quantity targets — a money supply held at 50% of GDP, for example.',
        },
        {
          id: 'public',
          label: 'The public understands rates better than aggregates',
          feedback:
            'Plausible, but not the argument made. The case is about what the central bank itself can see in real time.',
        },
        {
          id: 'accurate',
          label: 'Because rates are a more accurate measure of the money supply',
          feedback:
            'They are not a measure of it at all. They are a different variable, which happens to be observable minute by minute.',
        },
      ],
      correctOptionId: 'observable',
      explanation:
        'To know the funds rate you ring a few banks. To know M2 you survey the banking system and wait. A policymaker who wants to correct course this afternoon needs a number available this afternoon — which is a thoroughly practical reason, sitting underneath the elegant one about elasticity.',
    },
    {
      id: 'mc-which-error-worse',
      type: 'multiple_choice',
      tags: ['monetary-policy', 'capital-allocation'],
      xp: 35,
      prompt:
        'A fixed money supply produces two errors: a 12% project goes unfunded in the planting season, and a 1% project gets funded once the season ends. Sal thinks one is worse. Which, and why?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'funding-bad',
          label: 'Funding the 1% project, which can destroy wealth rather than merely forgo it',
        },
        {
          id: 'missing-good',
          label: 'Missing the 12% project, since 12% is a much larger number than 1%',
          feedback:
            'Comparing the headline numbers misses the asymmetry. Not doing the 12% project leaves the world where it was. Doing the 1% project can leave it worse off than before.',
        },
        {
          id: 'same',
          label: 'They are equally bad — both are capital in the wrong place',
          feedback:
            'Both are misallocations, but only one has a downside beyond the opportunity cost. Sal makes the point explicitly: the 1% return is what the investor *expects*, and it may turn out to be minus 5%.',
        },
        {
          id: 'neither',
          label: 'Neither of them, because the market corrects both in time',
          feedback:
            'The seasons are the point: by the time it corrects, the planting season has passed and the seeds were never bought.',
        },
      ],
      correctOptionId: 'funding-bad',
      explanation:
        'A marginal project is marginal on the investor’s own optimistic estimate, so the realised return can easily be negative — capital consumed rather than merely idle. This asymmetry is why cheap money for too long worries people more than dear money for too long, and it is the seed of the argument that a long period of near-zero rates funds things that should never have been funded.',
    },
    {
      id: 'mc-the-spread',
      type: 'multiple_choice',
      tags: ['interest-rates', 'monetary-policy'],
      xp: 30,
      prompt:
        'The Fed targets 5% between banks, and Sal has real projects borrowing at around 8%. Why does the farmer not get 5%?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'risk',
          label: 'He might not repay, and he is borrowing for a season rather than for a night',
        },
        {
          id: 'profit',
          label: 'Purely bank profiteering on the difference',
          feedback:
            'Some of the gap is margin, and competition between banks squeezes it. It cannot explain the whole spread, because a loan to a farmer is genuinely a different asset from a loan to a bank overnight.',
        },
        {
          id: 'reserverules',
          label: 'Because reserve requirements force banks to charge more',
          feedback:
            'Reserve requirements limit how much a bank can lend, not what it must charge. The spread would exist with no requirement at all.',
        },
        {
          id: 'broken',
          label: 'The transmission is broken; in theory he should get 5%',
          feedback:
            'The transmission is working exactly as intended. The policy rate sets the floor the whole structure of rates is built on, not the rate any particular borrower pays.',
        },
      ],
      correctOptionId: 'risk',
      explanation:
        'Every rate in an economy is the overnight rate plus compensation for the two things that make a loan different from it: how long the money is gone, and how likely it is not to come back. The Fed moves the base of that stack and the spreads move on their own — which is why cutting rates does nothing for a borrower nobody will lend to, and why the 2008 crisis was a crisis of spreads rather than of the policy rate.',
    },
    {
      id: 'match-elastic',
      type: 'concept_match',
      tags: ['monetary-policy', 'elasticity'],
      xp: 30,
      prompt: 'Match each idea from the argument for targeting a rate to what it actually means.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'elastic',
          term: 'An elastic currency',
          definition: 'A money supply that grows and shrinks with the demand for credit rather than to a fixed plan',
        },
        {
          id: 'threshold',
          term: 'A target rate as a threshold',
          definition: 'A hurdle every project must clear to be worth funding, whatever the season',
        },
        {
          id: 'measurable',
          term: 'The unglamorous reason',
          definition: 'You can ask the market its price this minute; measuring M2 takes a survey and a delay',
        },
      ],
      explanation:
        'Setting a rate lets the quantity of money settle wherever demand puts it, and that is the feature rather than a side effect — it is why "elastic currency" appears in the opening line of the Federal Reserve Act of 1913. The inelastic alternative is what the gold standard delivered, and what the 1907 panic was blamed on: no way to expand when everyone needed cash at once.',
    },
  ],
  keyTakeaways: [
    'A fixed quantity of money makes the funding hurdle depend on the season.',
    'Targeting the rate fixes the hurdle and lets quantity flex with demand.',
    'Rates are also simply easier to observe in real time than aggregates.',
  ],
});
