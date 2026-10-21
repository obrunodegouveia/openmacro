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
    'For one country, the question is not only what is productive. It is also what earns money from the rest of the world.',
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
        'A country builds a €50m hospital. Separately, it sells €50m of hotel nights to foreign tourists. What does each one do that the other does not?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'both-something',
          label: 'The hospital lets the country treat more people; the hotel nights earn money from abroad',
        },
        {
          id: 'hospital-only',
          label: 'Only the hospital matters — hotel nights are just consumption',
          feedback:
            'They are consumption for the tourist. For the country they are an export, and exports pay for the machines, medicines and fuel it does not make.',
        },
        {
          id: 'hotel-only',
          label: 'Only the hotel nights matter, since they bring in money from abroad',
          feedback:
            'Money from abroad is good, but it does not treat anyone. A country with hotels and no hospitals must import its health care too.',
        },
        {
          id: 'identical',
          label: 'Nothing separates them; both are €50m of GDP',
          feedback:
            'Both are €50m of GDP; that was the last module. The difference here: one leaves a building, the other brings in money from the rest of the world.',
        },
      ],
      correctOptionId: 'both-something',
      explanation:
        'This corrects a view that only buildings and machines matter. Tourism, fashion and luxury goods are consumption in the accounts. But when foreigners buy them, they bring in the money that pays for imports. A small country does not need to make everything. It needs to make something the rest of the world wants to buy.',
    },
    {
      id: 'match-tradable',
      type: 'concept_match',
      tags: ['trade', 'tradables'],
      xp: 30,
      prompt: 'Match each kind of production to what it can and cannot do for a country.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'tradable',
          term: 'Tradable goods and services',
          definition:
            'Can be sold to foreigners, so they earn the money that pays for imports. They also face competition from everywhere',
        },
        {
          id: 'nontradable',
          term: 'Non-tradable goods and services',
          definition:
            'Haircuts, most building work, most health care: real and needed, but they cannot pay for a single imported machine',
        },
        {
          id: 'import',
          term: 'Imports you cannot avoid',
          definition:
            'What the country cannot make at a sensible cost. For most countries: fuel, medicines and advanced equipment',
        },
      ],
      explanation:
        'Notice where tourism fits. A foreigner uses the service inside the country, so a local-looking activity becomes an export. The same is true when a foreign student pays university fees. This is how countries that mainly sell services pay for their imports.',
    },
    {
      id: 'mc-cannot-produce',
      type: 'multiple_choice',
      tags: ['trade', 'criticality'],
      xp: 35,
      prompt:
        'A country makes almost no energy, no computer chips and few medicines. When is that fine?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'sell-and-access',
          label: 'When it has something to sell, and nobody can stop it from buying',
        },
        {
          id: 'rich',
          label: 'When it is rich enough to buy them',
          feedback:
            'Being rich is half of it. Money does not help if a supplier refuses to sell. Recent years have taught this to countries that thought money was enough.',
        },
        {
          id: 'never',
          label: 'Never — a country must make its own essentials',
          feedback:
            'Almost no country does. Making everything yourself costs far more than the risk it removes. The real question is how many suppliers you depend on, and how big your reserves are.',
        },
        {
          id: 'allies',
          label: 'When its suppliers are its allies',
          feedback:
            'That helps, but less than it sounds. Alliances can change faster than a country can change its energy system, and the last lesson showed how slow that is.',
        },
      ],
      correctOptionId: 'sell-and-access',
      explanation:
        'There are two conditions, and most worries about security are about the second. Depending on imports is normal and efficient. The danger is depending on one single supplier for something with no substitute that takes years to replace. That is the test from the earlier lessons, applied to a country.',
    },
    {
      id: 'mc-synthesis',
      type: 'multiple_choice',
      tags: ['criticality', 'gdp', 'synthesis'],
      xp: 35,
      prompt:
        'Someone says: “Tourism is 15% of our economy, so it is our most important sector.” What is the most useful reply?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'which-question',
          label: 'Important in which way — size, criticality or future capacity?',
        },
        {
          id: 'agree',
          label: 'Agree: 15% is a big share, and share shows importance',
          feedback:
            'Share shows size, and this module began by showing why that is not the same. Farming is 2% of the economy, and nobody eats without it.',
        },
        {
          id: 'dismiss',
          label: 'Disagree: tourism is consumption, so it builds nothing',
          feedback:
            'It builds nothing, but it earns money from abroad, and that money pays for things that do build. Dismissing tourism is the opposite mistake to overrating it.',
        },
        {
          id: 'diversify',
          label: 'Point out that depending on one sector is the real risk',
          feedback:
            'True, but that answers a different question: how stable income is, not what “important” means.',
        },
      ],
      correctOptionId: 'which-question',
      explanation:
        'Tourism scores high on size and high on earning money from abroad. It scores low on criticality: if tourism stops, the country has a serious income problem, but nothing else stops working. It also scores low on future capacity: hotel nights do not help anyone produce more next year. All of this is true at once. An argument that uses only one of these is trying to win, not to understand.',
    },
  ],
  keyTakeaways: [
    'A country uses what it can buy, and it buys with what it can sell.',
    'Tourism and foreign students turn local services into exports.',
    'Depending on imports is normal. Depending on one supplier with no substitute is not.',
    'Size, money earned from abroad, criticality and future capacity are four separate scores. A sector can be high on one and low on the others.',
  ],
});
