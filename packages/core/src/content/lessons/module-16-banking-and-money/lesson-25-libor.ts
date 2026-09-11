import { defineLesson } from '../../schema';

/** Video 25. LIBOR as a surveyed average of interbank rates, and how it differs from the fed funds rate. */
export const kabLiborLesson = defineLesson({
  id: 'kab-libor',
  title: 'A Rate Nobody Sets',
  subtitle:
    'The fed funds rate is steered by policy. LIBOR was a survey — and that difference is the whole distinction.',
  icon: '🇬🇧',
  difficulty: 'core',
  estimatedMinutes: 13,
  video: {
    url: 'https://www.youtube.com/watch?v=wBCowBiXV7A',
    minutes: 5,
    source: 'Khan Academy — LIBOR',
  },
  challenges: [
    {
      id: 'mc-what-is-libor',
      type: 'multiple_choice',
      tags: ['libor', 'benchmarks'],
      xp: 20,
      prompt: 'What was LIBOR?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'survey',
          label:
            'An average of rates a panel of London banks reported paying',
        },
        {
          id: 'set-by-boe',
          label: 'A benchmark rate set each day by the Bank of England',
          feedback:
            'No central bank set it. That is the contrast the video draws with the fed funds rate, which a central bank actively steers.',
        },
        {
          id: 'mortgage',
          label: 'The rate British banks charged on mortgages',
          feedback:
            'Retail products were often priced as a margin over LIBOR, but LIBOR itself was strictly interbank.',
        },
        {
          id: 'exchange',
          label: 'A foreign exchange rate between ten currencies',
          feedback:
            'It was quoted in ten currencies, which is easy to mistake for this — but it measured borrowing cost, not exchange.',
        },
      ],
      correctOptionId: 'survey',
      explanation:
        'London Interbank Offered Rate — compiled for the British Bankers’ Association, in ten currencies, which is what made it a global benchmark rather than a domestic one. Note the structural weakness the video describes without naming: it was built on what banks *said* they paid. That is what made the later manipulation scandal possible, and why LIBOR has since been retired for transaction-based rates.',
    },
    {
      id: 'mc-vs-fed-funds',
      type: 'multiple_choice',
      tags: ['libor', 'fed-funds'],
      xp: 25,
      prompt: 'How does LIBOR differ from the effective federal funds rate?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'policy',
          label:
            'Both are interbank rates, but the funds rate is steered by policy',
        },
        {
          id: 'same',
          label: 'They are the same measure published under two names',
          feedback:
            'Both are interbank rates, but one is a multi-currency survey run by a trade body and the other is a domestic rate a central bank targets.',
        },
        {
          id: 'secured',
          label: 'LIBOR is secured lending; the funds rate is unsecured',
          feedback:
            'Both describe unsecured interbank lending. The distinction drawn is about who influences the number.',
        },
        {
          id: 'longer',
          label: 'LIBOR is long-term and the funds rate overnight',
          feedback:
            'LIBOR was published at several tenors including overnight. The difference emphasised here is policy control.',
        },
      ],
      correctOptionId: 'policy',
      explanation:
        'Same underlying transaction — one bank short of reserves borrowing from one with a surplus — measured two ways. One is a benchmark for pricing other contracts; the other is an instrument of monetary policy. Knowing which is which tells you whether a moving rate reflects the market or a decision.',
    },
  ],
  keyTakeaways: [
    'LIBOR was a surveyed average of interbank lending rates, in ten currencies.',
    'The fed funds rate covers the same kind of lending but is steered by policy.',
    'A benchmark built on what banks report is a benchmark that can be misreported.',
  ],
});
