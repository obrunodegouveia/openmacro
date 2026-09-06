import { defineLesson } from '../../schema';

/**
 * The annual bleed. IMI runs 0.30%–0.45% of the VPT depending on the
 * municipality, with more than two thirds of councils at the 0.30% floor, and
 * the VPT is a tax valuation that usually sits well below the market price.
 */
export const theCarryLesson = defineLesson({
  id: 'the-cost-of-just-owning-it',
  title: 'What It Costs to Own It on a Year Where Nothing Happens',
  subtitle:
    'IMI, maintenance and insurance. About 1.37% a year — and that number decides everything later.',
  icon: '🧾',
  difficulty: 'core',
  estimatedMinutes: 9,
  challenges: [
    {
      id: 'mc-vpt',
      type: 'multiple_choice',
      tags: ['portugal', 'imi', 'tax'],
      xp: 25,
      prompt:
        'IMI is charged on the VPT, not the price you paid. Your €300,000 flat has a VPT of €200,000. Why the gap?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'formula-not-market',
          label: 'The VPT is a formula — area, location coefficients, age — and it is not a market valuation',
        },
        {
          id: 'overpaid',
          label: 'Because you overpaid by €100,000',
          feedback:
            'The VPT sits below the market price for most Portuguese property, and systematically. It is not a verdict on your negotiation.',
        },
        {
          id: 'depreciation',
          label: 'Because buildings depreciate',
        },
        {
          id: 'error',
          label: 'A valuation error you should appeal',
          feedback:
            'A low VPT means a low IMI bill. It is one of the few numbers on a Portuguese property you would rather not have corrected upward.',
        },
      ],
      correctOptionId: 'formula-not-market',
      explanation:
        'The VPT comes out of a statutory formula with coefficients for area, quality, age and location, and it lags the market badly — which is why an old flat in a district that has doubled can carry a VPT set in another era. It is also why "IMI is only 0.3%" understates nothing and overstates nothing: 0.3% of a VPT well below the price is a genuinely small bill, and comparing it to the price is the mistake.',
    },
    {
      id: 'match-the-carry',
      type: 'concept_match',
      tags: ['portugal', 'ownership', 'costs'],
      xp: 25,
      prompt: 'Match each annual cost to what it actually is on a €300,000 flat.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'imi',
          term: 'IMI',
          definition:
            '0.3% of a €200,000 VPT — about €600, and the smallest line here',
        },
        {
          id: 'maintenance',
          term: 'Maintenance and condomínio',
          definition:
            'The largest line at roughly 1% of value — about €3,000, and unavoidable over any long holding',
        },
        {
          id: 'insurance',
          term: 'Multirriscos and life cover',
          definition:
            'Around €500, and the life policy is a condition of the mortgage rather than of ownership',
        },
        {
          id: 'aimi',
          term: 'AIMI',
          definition:
            'An additional charge above a €600,000 VPT — which this flat does not reach',
        },
      ],
      explanation:
        'The surprise for most people is the ranking. The tax everyone complains about is €600 and the maintenance nobody budgets for is €3,000 — five times larger. A roof, a boiler, a bathroom and a facade all have finite lives, and averaging their cost across the years you hold is the only honest way to count them, whether or not you spent anything this particular year.',
    },
    {
      id: 'mc-carry-rate',
      type: 'multiple_choice',
      tags: ['portugal', 'carry', 'arithmetic'],
      xp: 30,
      prompt:
        'Those three lines total about €4,100 a year on a €300,000 flat. Why is expressing that as 1.37% of the price the useful way to hold it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'compare-to-growth',
          label: 'Because it is directly comparable to the appreciation rate — it is the hurdle the price has to clear',
        },
        {
          id: 'tax',
          label: 'Because that is how the tax is assessed',
          feedback:
            'IMI is assessed on the VPT and maintenance is not assessed at all. Expressing the total as a share of price is an analytical choice, not a legal one.',
        },
        {
          id: 'inflation',
          label: 'To compare it with inflation',
        },
        {
          id: 'small',
          label: 'To show how small it is',
          feedback:
            'It is not small. Held for a decade it is 13.7% of the purchase price — larger than the entry and exit taxes combined.',
        },
      ],
      correctOptionId: 'compare-to-growth',
      explanation:
        'Put the two rates side by side and the arithmetic becomes obvious. If the flat appreciates 1.37% a year, ownership is exactly free and you have made nothing. Below that, you go backwards every year you hold and no amount of patience fixes it. Above it, the excess is what has to repay the round-trip costs — and how fast that happens is the next lesson.',
    },
    {
      id: 'mc-interest-not-here',
      type: 'multiple_choice',
      tags: ['portugal', 'mortgage', 'method'],
      xp: 30,
      prompt:
        'Mortgage interest is a large annual cost. Why is it deliberately not in that 1.37%?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'rent-comparator',
          label: 'Because its comparator is the rent you are not paying, not the appreciation on the flat',
        },
        {
          id: 'deductible',
          label: 'Because mortgage interest is tax deductible',
          feedback:
            'Relief in Portugal is narrow and applies mainly to older contracts. Even where it exists, it changes the size of the number rather than which question it belongs to.',
        },
        {
          id: 'small',
          label: 'Because it is small relative to the other costs',
          feedback:
            'It is by far the largest cash cost in the early years — at 3.95% on €240,000 borrowed it is roughly €9,400 in year one, more than twice the entire carry.',
        },
        {
          id: 'not-a-cost',
          label: 'Because interest is not really a cost',
        },
      ],
      correctOptionId: 'rent-comparator',
      explanation:
        'Keeping the two questions apart is what makes either answerable. "Does owning beat renting?" nets interest against rent avoided. "Does the price gain cover the costs of transacting and holding?" is about the asset, and paying cash would not change its answer. Mixing them produces a number that answers neither — and the mortgage still matters enormously, because it decides whether you can hold the position long enough to reach the break-even the next lesson computes.',
    },
  ],
  keyTakeaways: [
    'IMI is charged on the VPT, a statutory valuation that sits well below market price.',
    'Maintenance is about five times the IMI bill and is the line most often left out.',
    'The three together are roughly 1.37% of price a year — the hurdle rate appreciation must beat.',
    'Mortgage interest belongs to the rent comparison, not to this one.',
  ],
});
