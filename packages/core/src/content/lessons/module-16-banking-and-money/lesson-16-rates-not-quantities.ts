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
        'Suppose the money supply is held fixed. In planting season there are more good projects than money to fund them; after the season there are far fewer projects. What goes wrong?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'both-ways',
          label:
            'Good projects are turned away in planting season, and afterwards spare money funds bad ones',
        },
        {
          id: 'inflation',
          label: 'Inflation, because the money has nowhere useful to go',
          feedback:
            'The problem described is money going to the wrong projects, not the general price level. The same quantity of money funds a 12% project in one season and a 1% project in another.',
        },
        {
          id: 'spring-only',
          label: 'Only the planting-season problem — some good projects get no money',
          feedback:
            'Half of it. The other half is worse: after the season, with fewer borrowers and the same money, genuinely poor projects get funded at 1% or 2%.',
        },
        {
          id: 'nothing',
          label: 'Nothing — the market allocates to the highest bidder either way',
          feedback:
            'It does, and that is the trouble. In a quiet season the highest bidder may be a project the video calls shady, and funding it destroys wealth.',
        },
      ],
      correctOptionId: 'both-ways',
      explanation:
        'With a fixed quantity of money, the interest rate swings with demand, so the minimum return a project must offer depends on the season rather than on its merit. Targeting the rate instead sets a constant minimum and lets the quantity of money move — funding every project above that bar, whenever it appears.',
    },
    {
      id: 'mc-measurement',
      type: 'multiple_choice',
      tags: ['monetary-policy', 'measurement'],
      xp: 20,
      prompt: 'Besides the seasons, the video gives a practical, unglamorous reason for targeting an interest rate rather than the money supply. What is it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'observable',
          label: 'The rate between banks can be seen at any moment; M2 has to be collected from the banks and takes time',
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
        'To know the funds rate you ring a few banks. To know M2 you collect figures from the whole banking system and wait. A policymaker who wants to correct course this afternoon needs a number available this afternoon — a thoroughly practical reason, sitting underneath the more elegant one about the seasons.',
    },
    {
      id: 'mc-which-error-worse',
      type: 'multiple_choice',
      tags: ['monetary-policy', 'capital-allocation'],
      xp: 35,
      prompt:
        'A fixed money supply produces two mistakes: a project expected to return 12% goes unfunded in the planting season, and a project expected to return 1% gets funded once the season ends. Sal thinks one is worse. Which, and why?',
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
            'Comparing the two numbers misses the point. Not doing the 12% project leaves the world where it was. Doing the 1% project can leave it worse off than before.',
        },
        {
          id: 'same',
          label: 'They are equally bad — both are capital in the wrong place',
          feedback:
            'Both put money in the wrong place, but only one can lose more than a missed opportunity. Sal says it explicitly: the 1% return is what the investor *expects*, and it may turn out to be minus 5%.',
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
        'A borderline project is borderline even on the investor’s own optimistic estimate, so its actual return can easily be negative — savings used up rather than merely left idle. This is why many people worry more about money that is too cheap for too long, and it is the seed of the argument that long periods of near-zero rates fund things that should never have been funded.',
    },
    {
      id: 'mc-the-spread',
      type: 'multiple_choice',
      tags: ['interest-rates', 'monetary-policy'],
      xp: 30,
      prompt:
        'The Fed targets 5% for overnight loans between banks, but in Sal’s example a farmer borrows at around 8%. Why does the farmer not get 5%?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'risk',
          label: 'He might not repay, and he borrows for a whole season rather than for one night',
        },
        {
          id: 'profit',
          label: 'Only because banks want a bigger profit',
          feedback:
            'Some of the gap is the bank’s margin, and competition between banks squeezes it. It cannot explain the whole gap, because a loan to a farmer really is a different thing from a loan to a bank for one night.',
        },
        {
          id: 'reserverules',
          label: 'Because reserve requirements force banks to charge more',
          feedback:
            'Reserve requirements limit how much a bank can lend, not what it must charge. The spread would exist with no requirement at all.',
        },
        {
          id: 'broken',
          label: 'Something is broken; in theory he should get 5%',
          feedback:
            'Nothing is broken. The policy rate sets the base that all other rates are built on, not the rate any particular borrower pays.',
        },
      ],
      correctOptionId: 'risk',
      explanation:
        'Every rate in an economy is roughly the overnight rate plus extra pay for two things: how long the money is gone, and how likely it is not to come back. The Fed moves the base; the extra (the spread) moves on its own — which is why cutting rates does nothing for a borrower nobody will lend to, and why in 2008 the trouble was soaring spreads rather than the policy rate.',
    },
    {
      id: 'match-elastic',
      type: 'concept_match',
      tags: ['monetary-policy', 'elasticity'],
      xp: 30,
      prompt: 'Match each idea from the case for targeting an interest rate to what it means.',
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
          definition: 'A minimum return every project must beat to be worth funding, whatever the season',
        },
        {
          id: 'measurable',
          term: 'The unglamorous reason',
          definition: 'You can see the market rate this minute; measuring M2 takes collecting data and waiting',
        },
      ],
      explanation:
        'Setting a rate lets the quantity of money settle wherever demand puts it, and that is the point rather than a side effect — it is why "an elastic currency" appears in the opening line of the Federal Reserve Act of 1913. The rigid alternative is what the old system delivered, and what the panic of 1907 was blamed on: no way to expand the money supply when everyone needed cash at once.',
    },
  ],
  keyTakeaways: [
    'A fixed quantity of money makes the funding hurdle depend on the season.',
    'Targeting the rate fixes the hurdle and lets quantity flex with demand.',
    'Rates are also simply easier to observe in real time than aggregates.',
  ],
});
