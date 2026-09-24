import { defineLesson } from '../../schema';

/**
 * The synthesis. How fast must the economy grow to carry the debt at a given
 * interest rate, and what does the answer imply about the bet being made.
 */
export const findingTheBalanceLesson = defineLesson({
  id: 'finding-the-balance',
  title: 'How Much Productivity Does the Debt Require?',
  subtitle:
    'The arithmetic can be run backwards. Fix the deficit and the interest rate, and it tells you exactly how fast the economy has to grow — and therefore what has to be true for the plan to work.',
  icon: '🎯',
  difficulty: 'advanced',
  estimatedMinutes: 13,
  challenges: [
    {
      id: 'sim-growth-required',
      type: 'interactive_sim',
      tags: ['sovereign-debt', 'productivity', 'policy'],
      xp: 60,
      prompt: 'Run it backwards: what growth rate does this debt actually demand?',
      instructions: 'Set a rate and a deficit, and read off what the economy has to deliver',
      narrative:
        'Instead of choosing growth and seeing what happens to the debt, fix the debt and the budget and solve for the growth rate that holds the ratio still. Anything above the number and the ratio falls; anything below and it climbs. Since inflation is roughly 2% by policy and the workforce grows slowly, whatever is left over has to come from productivity — which is the number to compare against the 1.5% or so the United States has actually managed since 2005.',
      constants: {},
      sliders: [
        {
          key: 'debtRatio',
          label: 'Debt as a share of GDP',
          min: 0.6,
          max: 1.6,
          step: 0.05,
          defaultValue: 1,
          format: 'percent',
        },
        {
          key: 'interestRate',
          label: 'Average rate on the debt',
          min: 0,
          max: 0.08,
          step: 0.0025,
          defaultValue: 0.04,
          format: 'percent',
          hint: 'Rising as the cheap debt of the 2010s rolls off',
        },
        {
          key: 'primaryBalance',
          label: 'Primary balance, before interest',
          min: -0.08,
          max: 0.04,
          step: 0.0025,
          defaultValue: -0.03,
          format: 'percent',
          hint: 'Negative is a deficit',
        },
      ],
      readouts: [
        {
          key: 'requiredGrowth',
          label: 'Nominal growth needed to hold the ratio still',
          formulaId: 'growth_needed_for_stability',
          format: 'percent',
          emphasis: true,
          caption: 'Above this the ratio falls; below it, it climbs',
        },
        {
          key: 'snowballNow',
          label: 'What the ratio does at 4% nominal growth',
          formulaId: 'debt_snowball',
          format: 'percent',
          caption: 'Interest and growth only, no budget decision',
        },
      ],
      objective: {
        description:
          'Find a combination that requires more than 7% nominal growth — and notice what it would take',
        requiredObservations: [{ sliderKey: 'interestRate', values: [0, 0.08] }],
        target: { readoutKey: 'requiredGrowth', comparator: 'gte', value: 0.07 },
      },
      explanation:
        'A 7% nominal requirement means roughly 5% real growth after 2% inflation, which the United States has not sustained for any long stretch in fifty years. That is what the readout is for: it converts an argument into a number you can hold against history. At a 3% deficit and a 4% rate the requirement is about 7%, and at a 1% deficit it drops close to the 4% the economy plausibly delivers. The gap between those two cases is a policy choice, not a fact of nature — which is the most useful thing this module can leave you with.',
    },
    {
      id: 'mc-what-the-bet-is',
      type: 'multiple_choice',
      tags: ['sovereign-debt', 'productivity'],
      xp: 45,
      prompt:
        'Stated as precisely as possible, what is the bet the United States is currently making?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'g-beats-r',
          label: 'That growth outpaces the rate on the debt for decades',
        },
        {
          id: 'never-default',
          label: 'That it will never actually have to default on anything',
          feedback:
            'That part is not a bet — it issues the currency it owes. The bet is about what avoiding default costs, which is a different question.',
        },
        {
          id: 'inflate',
          label: 'That it can always inflate the debt away if it needs to',
          feedback:
            'It could, and doing so would tax every holder of dollars and cost the reserve-currency credibility that keeps the rate low in the first place. Available, expensive, and not the plan.',
        },
        {
          id: 'grow-out',
          label: 'That the deficit will be closed at some later point',
          feedback:
            'Possible, and the arithmetic does not require it if growth beats the rate. The distinctive American bet is precisely that it will not have to be.',
        },
      ],
      correctOptionId: 'g-beats-r',
      explanation:
        'Put that way, it is testable rather than rhetorical. It needs g above r sustained over decades, with the rate rising as cheap debt rolls off and the workforce growing more slowly than it used to — which means almost all of the burden falls on productivity. The bet is reasonable: the United States really does host an unusual concentration of firms operating at the technological frontier, and the historical record of general-purpose technologies eventually showing up in output per hour is good. It is still a bet, its payoff is uncertain in timing, and the interest is due on a fixed schedule regardless.',
    },
    {
      id: 'match-who-is-right',
      type: 'concept_match',
      tags: ['sovereign-debt', 'policy'],
      xp: 40,
      prompt: 'Four positions in the debt argument. Match each to the thing it gets right.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'alarmist',
          term: '"The debt is a crisis"',
          definition: 'Interest is now a top-four line item and is contractual',
        },
        {
          id: 'relaxed',
          term: '"Debt in your own currency is different"',
          definition: 'There is no forced default, and ratios alone predict nothing',
        },
        {
          id: 'growth',
          term: '"Productivity will carry it"',
          definition: 'It is the only lever improving both the debt and inflation',
        },
        {
          id: 'hawk',
          term: '"Hold rates until inflation breaks"',
          definition: 'Losing the inflation anchor costs more than the extra interest ever will',
        },
      ],
      explanation:
        'All four are correct about something, which is why the argument never resolves in public. The disagreement is not really about the arithmetic — everyone is using the same equation — but about which risk to weight: the risk of a slow fiscal squeeze against the risk of unanchored inflation, under genuine uncertainty about whether the productivity arrives. Being able to state the strongest version of each position is more useful than picking one, and it is roughly what a central banker is expected to be able to do in the room.',
    },
    {
      id: 'mc-what-would-change-mind',
      type: 'multiple_choice',
      tags: ['sovereign-debt', 'productivity'],
      xp: 45,
      prompt:
        'You believe productivity will carry the debt. What observation should make you abandon that view?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'no-tfp',
          label: 'Heavy investment in the new technology, with output per hour still flat a decade on',
        },
        {
          id: 'ratio-rises',
          label: 'The debt ratio rising for a few years',
          feedback:
            'Consistent with the view — the thesis is about a decade-scale trend, and ratios rise in recessions even on a healthy path.',
        },
        {
          id: 'rates-rise',
          label: 'Interest rates rising',
          feedback:
            'It raises the bar rather than settling anything. The claim was always that growth beats the rate, so a higher rate demands more growth, not no growth.',
        },
        {
          id: 'criticism',
          label: 'Respected economists arguing the debt is unsustainable',
          feedback:
            'They have argued it continuously for forty years, through periods when the ratio fell and periods when it rose. Their existence is not evidence either way.',
        },
      ],
      correctOptionId: 'no-tfp',
      explanation:
        'A belief worth holding comes with a condition that would break it, and this one has a clean one: the investment is observable now, and output per hour is measured quarterly. If the capital goes in for a decade and the productivity statistics stay flat, the mechanism has failed and the fiscal plan resting on it needs replacing with something that costs somebody something. Setting that test in advance is the difference between a forecast and a hope — and it is the habit that matters most in a job where the arithmetic is public and the judgement is yours.',
    },
  ],
  keyTakeaways: [
    'The arithmetic runs backwards: fix the rate and deficit, and it names the growth required.',
    'At a 3% deficit and a 4% rate, that demand is roughly 7% nominal growth.',
    'The American bet is that g beats r for decades without a surplus, carried by productivity.',
    'Decide in advance what evidence would break the view — flat output per hour after a decade of investment.',
  ],
});
