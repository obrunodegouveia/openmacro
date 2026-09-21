import { defineLesson } from '../../schema';

/**
 * The ranking changes again when the unit is one country rather than the
 * world. A small open economy consumes what it can buy, and buys with what
 * it can sell — which rehabilitates a great deal of output the capital-stock
 * view treats as merely consumed.
 *
 * Written with Portugal in mind without naming it in every line: tourism and
 * hospitality are a large share of the economy and are consumption services
 * in the accounts, and they are also a substantial part of how the country
 * pays for what it imports.
 */
export const whatACountryMustSellLesson = defineLesson({
  id: 'what-a-country-must-sell',
  title: 'A Hotel Night Sold to a Foreigner',
  subtitle:
    'For one country the question is not what is productive, but what earns the claim on everybody else.',
  icon: '🧳',
  difficulty: 'core',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-hotel-vs-hospital',
      type: 'multiple_choice',
      tags: ['trade', 'tradables'],
      xp: 30,
      prompt:
        'A country builds a €50m hospital, and separately sells €50m of hotel nights to foreign visitors. What does each do that the other does not?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'both-something',
          label: 'The hospital adds capacity; the hotel nights earn foreign currency',
        },
        {
          id: 'hospital-only',
          label: 'Only the hospital matters — the hotel nights are consumption',
          feedback:
            'They are consumption for the visitor. For the country they are an export, and exports are how it pays for the machines, medicines and fuel it does not make.',
        },
        {
          id: 'hotel-only',
          label: 'Only the hotel nights matter, since they bring in money from outside',
          feedback:
            'Money from outside is worth having and it does not treat anybody. A country of hotels and no hospitals has to import the health care too, and eventually runs out of things to sell.',
        },
        {
          id: 'identical',
          label: 'Nothing distinguishes them; both are €50m of GDP',
          feedback:
            'Both are €50m of GDP, which is the module before this one. The difference here is that one leaves an asset and the other leaves a claim on the rest of the world.',
        },
      ],
      correctOptionId: 'both-something',
      explanation:
        'This is the honest correction to a purely capital-centric view. Tourism, fashion and luxury are consumption in the accounts, and when they are sold abroad they earn the foreign currency that pays for imports. A small open economy does not need to produce everything. It needs to produce something the rest of the world wants enough to pay for.',
    },
    {
      id: 'match-tradable',
      type: 'concept_match',
      tags: ['trade', 'tradables'],
      xp: 30,
      prompt: 'Match each kind of output to what it can and cannot do for a country.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'tradable',
          term: 'Tradable output',
          definition:
            'Can be sold to foreigners, so it earns the currency that pays for imports — and is exposed to competition from everywhere',
        },
        {
          id: 'nontradable',
          term: 'Non-tradable output',
          definition:
            'Haircuts, most construction, most health care: real, necessary, and it cannot pay for a single imported machine',
        },
        {
          id: 'import',
          term: 'Unavoidable imports',
          definition:
            'Whatever the country cannot make at a sane cost — for most countries, fuel, medicines and advanced equipment',
        },
      ],
      explanation:
        'Note where tourism sits. It is a service consumed inside the country by someone from outside it, which makes a non-tradable-looking activity into an export. The same is true of a foreign student’s tuition. These are the loopholes through which service economies pay their import bills.',
    },
    {
      id: 'mc-cannot-produce',
      type: 'multiple_choice',
      tags: ['trade', 'criticality'],
      xp: 35,
      prompt:
        'A country produces almost no energy, no semiconductors and few medicines. Under what condition is that fine?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'sell-and-access',
          label: 'It has something to sell, and nobody can cut it off from buying',
        },
        {
          id: 'rich',
          label: 'It is rich enough to afford them',
          feedback:
            'Rich is half of it. Wealth is no help against a supplier who will not sell, which is what the last few years have been teaching countries that assumed money was sufficient.',
        },
        {
          id: 'never',
          label: 'Never — a country must produce its own essentials',
          feedback:
            'Almost no country does, and autarky is dramatically more expensive than the risk it removes. The question is not whether to depend but on how many suppliers, and with what buffer.',
        },
        {
          id: 'allies',
          label: 'Its suppliers are allies',
          feedback:
            'Better than the alternative and thinner than it sounds. Alliances change faster than an energy system does, and the previous lesson is about how slowly the second one moves.',
        },
      ],
      correctOptionId: 'sell-and-access',
      explanation:
        'Two conditions, and most of the security argument is about the second. Dependence on imports is normal and efficient; dependence on a *single* supplier for something with no substitute and a long replacement time is the thing that is not. That is the criticality test from earlier, applied to a country rather than a firm.',
    },
    {
      id: 'mc-synthesis',
      type: 'multiple_choice',
      tags: ['criticality', 'gdp', 'synthesis'],
      xp: 35,
      prompt:
        'Someone says "tourism is 15% of our economy, so it is our most important sector." What is the most useful reply?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'which-question',
          label: 'Important for which of the three — size, criticality, or future capacity?',
        },
        {
          id: 'agree',
          label: 'Agree: 15% is a large share and shares measure importance',
          feedback:
            'It measures size, and the module opened by taking that apart. Agriculture is 2% and nobody eats without it.',
        },
        {
          id: 'dismiss',
          label: 'Disagree: tourism is consumption, so it builds nothing',
          feedback:
            'It builds nothing and it earns foreign currency, which is what pays for the things that do build something. Dismissing it is the mirror-image error of overrating it.',
        },
        {
          id: 'diversify',
          label: 'Point out that concentration is the real risk',
          feedback:
            'True and it is an answer to a different question — one about the variance of income rather than about what importance means.',
        },
      ],
      correctOptionId: 'which-question',
      explanation:
        'Tourism scores high on size, high on earning foreign currency, low on criticality — a country whose tourism stops has a severe income problem and not a supply shock — and low on future capacity, since hotel nights do not raise what anyone can produce next year. All four of those statements are true at once, and any argument that uses only one of them is being used to win rather than to understand.',
    },
  ],
  keyTakeaways: [
    'A country consumes what it can buy and buys with what it can sell.',
    'Tourism and foreign students turn non-tradable-looking services into exports.',
    'Import dependence is normal; single-supplier dependence with no substitute is not.',
    'Size, foreign earnings, criticality and future capacity are four separate scores, and a sector can be high on one and low on the rest.',
  ],
});
