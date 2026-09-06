import { defineLesson } from '../../schema';

/**
 * Getting the map right first, because most of the argument about the CFA
 * franc is conducted with the pieces mislabelled.
 *
 * Three arrangements, not one: UEMOA (8 states, BCEAO, XOF), CEMAC (6 states,
 * BEAC, XAF) and the Comoros (BCC, KMF). Both CFA francs are fixed at
 * 1 EUR = 655.957. The three Sahel states left ECOWAS — effective 29 January
 * 2025 — and remain in UEMOA, still using the CFA franc.
 */
export const theFrancZoneMapLesson = defineLesson({
  id: 'the-franc-zone-map',
  title: 'Two Currencies With One Name',
  subtitle:
    'Most arguments about the CFA franc are about the wrong institution. Start with what exists.',
  icon: '🗺️',
  difficulty: 'core',
  estimatedMinutes: 8,
  challenges: [
    {
      id: 'mc-one-or-two',
      type: 'multiple_choice',
      tags: ['cfa', 'institutions', 'africa'],
      xp: 15,
      prompt:
        'The CFA franc circulates in fourteen countries. How many CFA francs are there?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'two',
          label: 'Two — the XOF and the XAF, which are not interchangeable',
        },
        {
          id: 'one',
          label: 'One, shared by all fourteen',
          feedback:
            'They share a name and a rate against the euro, and that is all. A note issued in Dakar is not legal tender in Douala.',
        },
        {
          id: 'fourteen',
          label: 'Fourteen — one per country, each pegged separately',
        },
        {
          id: 'three',
          label: 'Three, counting the euro itself',
        },
      ],
      correctOptionId: 'two',
      explanation:
        'The West African CFA franc (XOF) is issued by the BCEAO for eight UEMOA states; the Central African CFA franc (XAF) is issued by the BEAC for six CEMAC states. Both are fixed at 655.957 to the euro, so they trade one for one in practice — but they are separate currencies with separate central banks, separate reserves and, as the next lesson shows, different arrangements with France.',
    },

    {
      id: 'match-the-map',
      type: 'concept_match',
      tags: ['cfa', 'institutions', 'africa'],
      xp: 25,
      prompt: 'Match each institution to what it actually is.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'bceao',
          term: 'BCEAO',
          definition:
            'Issues the XOF for eight UEMOA states, from Dakar. France left its governing bodies in the 2019 reform',
        },
        {
          id: 'beac',
          term: 'BEAC',
          definition:
            'Issues the XAF for six CEMAC states, from Yaoundé. France still holds one seat of seven',
        },
        {
          id: 'ecowas',
          term: 'ECOWAS',
          definition:
            'A fifteen-country political and economic bloc — not a currency union, and not the issuer of anything',
        },
        {
          id: 'eco',
          term: 'The "Eco"',
          definition:
            'A planned currency, repeatedly delayed, and the name most often confused with everything else here',
        },
        {
          id: 'bcc',
          term: 'Banque Centrale des Comores',
          definition:
            'Issues the Comorian franc; half its eight-member board is designated by the French government',
        },
      ],
      explanation:
        'The third and fourth entries cause most of the confusion. ECOWAS is a bloc of fifteen countries with its own long-delayed currency plan, also called the Eco; UEMOA is the eight-country monetary union inside it. They are not the same body, they do not have the same members, and a headline about one is routinely read as being about the other.',
    },

    {
      id: 'mc-sahel',
      type: 'multiple_choice',
      tags: ['cfa', 'africa', 'current'],
      xp: 20,
      prompt:
        'Mali, Burkina Faso and Niger completed their withdrawal on 29 January 2025. From what?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'ecowas',
          label: 'From ECOWAS. They remain in UEMOA and still use the CFA franc',
        },
        {
          id: 'uemoa',
          label: 'From UEMOA — they have left the CFA franc',
          feedback:
            'This is the most common error in coverage of the region. They left the political bloc; Mali’s own finance minister has restated that the country remains a UEMOA member state.',
        },
        {
          id: 'both',
          label: 'From both, simultaneously',
        },
        {
          id: 'imf',
          label: 'From the IMF programme framework',
        },
      ],
      correctOptionId: 'ecowas',
      explanation:
        'Leaving a monetary union is a far larger operation than leaving a political bloc: you need a new currency, an issuing institution, reserves and someone willing to hold the notes. The three states have talked publicly about a common currency since 2024 and have not done it. Wanting out and being out are different states of the world, and the distinction is where most predictions about this region go wrong.',
    },

    {
      id: 'mc-parity',
      type: 'multiple_choice',
      tags: ['cfa', 'pegs'],
      xp: 20,
      prompt:
        'The parity is 1 EUR = 655.957 CFA — an oddly precise number. Where does it come from?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'inherited',
          label: 'It is the old French franc rate carried across at the euro’s conversion rate',
        },
        {
          id: 'economic',
          label: 'It was calculated from trade weights and productivity',
          feedback:
            'No such calculation produces six significant figures. A number like this is arithmetic from a previous number, not an estimate of anything.',
        },
        {
          id: 'market',
          label: 'It was where the market was trading in 1999',
        },
        {
          id: 'imf',
          label: 'It was set by the IMF',
        },
      ],
      correctOptionId: 'inherited',
      explanation:
        'The CFA franc was fixed at 100 to the French franc after the January 1994 devaluation, which had halved it from 50. When the French franc converted into the euro at 6.55957, the CFA rate came with it: 100 × 6.55957 = 655.957. The number is not an economic judgement about Africa in 1999 — it is a French franc rate from 1994 multiplied by a conversion factor, and it has not moved since.',
    },
  ],
  keyTakeaways: [
    'Two CFA francs, two central banks, two unions — plus the Comoros, on its own arrangement.',
    'ECOWAS is a fifteen-country bloc, not a currency union; UEMOA is the eight-country monetary union inside it.',
    'The Sahel states left ECOWAS in January 2025 and are still in UEMOA, still using the CFA franc.',
    '655.957 is a 1994 French franc rate carried across by the euro conversion factor.',
  ],
});
