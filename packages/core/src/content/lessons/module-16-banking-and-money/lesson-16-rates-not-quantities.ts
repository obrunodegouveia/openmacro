import { defineLesson } from '../../schema';

/** Video 16. Why target a rate rather than a quantity: measurement, and the elasticity argument with the planting season. */
export const kabRatesNotQuantitiesLesson = defineLesson({
  id: 'kab-rates-not-quantities',
  title: 'Why Not Just Target the Money Supply?',
  subtitle:
    'If you fix the amount of money, good projects miss out in spring and bad ones get money in autumn. So fix the interest rate instead.',
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
        'Imagine the amount of money never changes. In planting season, there are more good projects than money to pay for them. After the season, there are far fewer projects. What goes wrong?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'both-ways',
          label:
            'Good projects get no money in planting season, and after it, spare money goes to bad ones',
        },
        {
          id: 'inflation',
          label: 'Prices rise, because the money has nowhere useful to go',
          feedback:
            'The problem here is money going to the wrong projects, not prices in general. The same amount of money pays for a 12% project in one season and a 1% project in another.',
        },
        {
          id: 'spring-only',
          label: 'Only the planting-season problem: some good projects get no money',
          feedback:
            'That is only half. The other half is worse. After the season there are fewer borrowers but the same money, so really poor projects get money at 1% or 2%.',
        },
        {
          id: 'nothing',
          label: 'Nothing, because the money always goes to whoever offers the most',
          feedback:
            'It does, and that is the problem. In a quiet season, the one offering the most may be a project the video calls shady. Paying for it destroys wealth.',
        },
      ],
      correctOptionId: 'both-ways',
      explanation:
        'If the amount of money is fixed, the interest rate jumps up and down with demand. So whether a project gets money depends on the season, not on how good it is. If the central bank fixes the rate instead, the bar stays the same all year. The amount of money then changes, and every project above the bar gets paid for.',
    },
    {
      id: 'mc-measurement',
      type: 'multiple_choice',
      tags: ['monetary-policy', 'measurement'],
      xp: 20,
      prompt: 'Besides the seasons, the video gives a simple, practical reason to target an interest rate instead of the amount of money. What is it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'observable',
          label: 'You can see the rate between banks at any moment, but measuring M2 means collecting data and waiting',
        },
        {
          id: 'legal',
          label: 'The law does not let the central bank target an amount of money',
          feedback:
            'The video mentions no such law. It also says some economists do want a target for the amount of money, for example keeping it at 50% of GDP.',
        },
        {
          id: 'public',
          label: 'People understand interest rates better than totals like M2',
          feedback:
            'That may be true, but it is not the reason given. The reason is about what the central bank itself can see right now.',
        },
        {
          id: 'accurate',
          label: 'Because interest rates measure the amount of money more accurately',
          feedback:
            'They do not measure it at all. They are a different number, which you can see minute by minute.',
        },
      ],
      correctOptionId: 'observable',
      explanation:
        'To know the rate between banks, you call a few banks. To know M2, you collect numbers from every bank and wait. If you want to change course this afternoon, you need a number you can have this afternoon. It is a very practical reason, alongside the one about the seasons.',
    },
    {
      id: 'mc-which-error-worse',
      type: 'multiple_choice',
      tags: ['monetary-policy', 'capital-allocation'],
      xp: 35,
      prompt:
        'A fixed amount of money causes two mistakes. A project expected to earn 12% gets no money in the planting season. A project expected to earn 1% gets money after the season. Sal thinks one mistake is worse. Which one, and why?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'funding-bad',
          label: 'Paying for the 1% project, because it can actually lose wealth, not just miss a gain',
        },
        {
          id: 'missing-good',
          label: 'Missing the 12% project, because 12% is a much bigger number than 1%',
          feedback:
            'Comparing the two numbers misses the point. Not doing the 12% project leaves things as they were. Doing the 1% project can leave things worse than before.',
        },
        {
          id: 'same',
          label: 'They are equally bad, because both put money in the wrong place',
          feedback:
            'Both put money in the wrong place, but only one can lose money. Sal says it clearly: 1% is what the investor expects, and the real result may be minus 5%.',
        },
        {
          id: 'neither',
          label: 'Neither of them, because the market fixes both mistakes in time',
          feedback:
            'The seasons are the point. By the time the market fixes it, the planting season is over and the seeds were never bought.',
        },
      ],
      correctOptionId: 'funding-bad',
      explanation:
        'Even the investor’s own hopeful guess for the 1% project is barely above zero. So the real result can easily be a loss: savings are used up, not just left unused. That is why many people worry about money being too cheap for too long. Some argue that very low rates for years pay for projects that should never have been started.',
    },
    {
      id: 'mc-the-spread',
      type: 'multiple_choice',
      tags: ['interest-rates', 'monetary-policy'],
      xp: 30,
      prompt:
        'The Fed targets 5% for one-night loans between banks. But in Sal’s example, a farmer borrows at about 8%. Why does the farmer not get 5%?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'risk',
          label: 'He might not pay it back, and he borrows for a whole season, not for one night',
        },
        {
          id: 'profit',
          label: 'Only because banks want a bigger profit',
          feedback:
            'Part of the gap is the bank’s profit, and competition between banks keeps it small. It cannot explain the whole gap. A loan to a farmer is really different from a one-night loan to a bank.',
        },
        {
          id: 'reserverules',
          label: 'Because reserve requirements force banks to charge more',
          feedback:
            'Reserve requirements limit how much a bank can lend, not what it charges. The gap would exist even with no requirement.',
        },
        {
          id: 'broken',
          label: 'Something is broken, because in theory he should get 5%',
          feedback:
            'Nothing is broken. The central bank’s rate is the base that all other rates are built on. It is not the rate every borrower pays.',
        },
      ],
      correctOptionId: 'risk',
      explanation:
        'Every interest rate is roughly the one-night rate plus extra for two things: how long the money is lent, and how likely it is not to come back. The Fed moves the base. The extra part (the spread) moves on its own. So cutting rates does not help a borrower nobody trusts. In 2008 the problem was that these spreads shot up, not the central bank’s rate.',
    },
    {
      id: 'match-elastic',
      type: 'concept_match',
      tags: ['monetary-policy', 'elasticity'],
      xp: 30,
      prompt: 'These ideas explain why central banks target an interest rate. Match each one to what it means.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'elastic',
          term: 'An elastic currency',
          definition: 'An amount of money that grows and shrinks when people want to borrow more or less, not by a fixed plan',
        },
        {
          id: 'threshold',
          term: 'A target rate as a bar to clear',
          definition: 'The lowest return a project must beat to be worth paying for, in any season',
        },
        {
          id: 'measurable',
          term: 'The practical reason',
          definition: 'You can see the market rate this minute, but measuring M2 means collecting data and waiting',
        },
      ],
      explanation:
        'When the central bank sets a rate, the amount of money follows what people need. That is the goal, not a side effect. It is why the words “an elastic currency” are in the first line of the Federal Reserve Act of 1913. The old system was rigid. People blamed it for the panic of 1907: there was no way to add money when everyone needed cash at once.',
    },
  ],
  keyTakeaways: [
    'With a fixed amount of money, whether a project gets money depends on the season.',
    'Targeting the rate keeps the bar the same, and lets the amount of money change with demand.',
    'Rates are also easier to see right now than totals like M2.',
  ],
});
