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
    {
      id: 'mc-survey-not-trades',
      type: 'multiple_choice',
      tags: ['libor', 'benchmarks'],
      xp: 35,
      prompt:
        'LIBOR was produced by asking a panel of London banks what rate they could borrow at, and averaging the answers. What does that design make possible?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'misreport',
          label: 'A bank can submit a number it likes rather than one it transacted at',
        },
        {
          id: 'slow',
          label: 'The rate is published too slowly to be useful',
          feedback:
            'It was published daily and used the same day. Timeliness was never the problem.',
        },
        {
          id: 'currencies',
          label: 'It can cover ten currencies at once',
          feedback:
            'It did, and that breadth is why it spread worldwide. But that is a feature of its scope, not a consequence of being a survey.',
        },
        {
          id: 'average',
          label: 'The average can be dragged around by one outlier',
          feedback:
            'The trimmed mean was designed to handle exactly that — the highest and lowest submissions were discarded. Coordinated submissions were the weakness, not extreme ones.',
        },
      ],
      correctOptionId: 'misreport',
      explanation:
        'A benchmark built on what banks *say* rather than what they *did* asks a question with no verifiable answer, and hands it to people with an interest in the answer. That is the whole of the LIBOR scandal — from 2012 it emerged that traders at multiple banks had been requesting submissions to suit their positions, for years, sometimes over instant messenger.',
    },
    {
      id: 'mc-two-motives',
      type: 'multiple_choice',
      tags: ['libor', 'financial-crisis'],
      xp: 35,
      prompt:
        'During 2007 and 2008, some panel banks submitted LIBOR rates lower than they were really paying. What was the motive?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'lookhealthy',
          label: 'A high submission would say the bank was struggling to borrow',
        },
        {
          id: 'cheaper',
          label: 'To pay less on their own borrowing',
          feedback:
            'A bank’s submission does not set what it pays — it reports it. Whatever it was actually being charged was unaffected by what it said.',
        },
        {
          id: 'regulator',
          label: 'Because regulators instructed them to',
          feedback:
            'The role of officials is genuinely disputed and some contemporaneous conversations were murky. The motive that drove the submissions was reputational, and the banks understood it perfectly well themselves.',
        },
        {
          id: 'error',
          label: 'Honest uncertainty, since nobody was lending at any rate',
          feedback:
            'Markets really were frozen and the estimate really was hard. That explains noise in both directions, and the submissions were biased consistently downwards.',
        },
      ],
      correctOptionId: 'lookhealthy',
      explanation:
        'This is the stigma from video 19 in a new outfit. Admitting you are paying 5% when the panel says 3% announces that lenders think you are in trouble — so the submission became a statement about your health rather than a measurement of the market. Note the two distinct scandals: traders nudging the rate to profit on derivatives, and whole institutions lowballing during the crisis to look solvent.',
    },
    {
      id: 'mc-what-replaced-it',
      type: 'multiple_choice',
      tags: ['libor', 'benchmarks', 'repo'],
      xp: 35,
      prompt:
        'LIBOR has now been retired. Its main dollar replacement, SOFR, is built on actual overnight repo transactions. Why is that the fix?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'nothingtoguess',
          label: 'There is nothing left to estimate — the trades either happened or they did not',
        },
        {
          id: 'lower',
          label: 'Because repo rates are lower than interbank rates',
          feedback:
            'Secured borrowing is cheaper, and that gap caused real difficulty converting old contracts. Being lower is not what makes a benchmark trustworthy.',
        },
        {
          id: 'government',
          label: 'Because the government sets it rather than banks',
          feedback:
            'The New York Fed publishes it, but it does not choose the number — it reports a volume-weighted median of trades that actually took place.',
        },
        {
          id: 'currencies',
          label: 'Because it covers more currencies',
          feedback:
            'It covers fewer — SOFR is dollars only, and other currencies have their own replacements. Breadth was LIBOR’s advantage, not its problem.',
        },
      ],
      correctOptionId: 'nothingtoguess',
      explanation:
        'Move a benchmark from opinion to observation and misreporting stops being available: you cannot misstate a trade that settled. There is a real cost — SOFR is secured, so it does not carry the bank credit risk LIBOR did, and that made converting trillions of legacy contracts genuinely hard. The judgement was that a benchmark you can verify beats one that measures the right thing and cannot be trusted. Note how much of the module lands here: SOFR is built on the repo market of video 20.',
    },
    {
      id: 'match-benchmarks',
      type: 'concept_match',
      tags: ['libor', 'fed-funds', 'benchmarks'],
      xp: 30,
      prompt: 'Three interbank rates that are easy to confuse. Match each to what it actually measures.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'libor',
          term: 'LIBOR',
          definition: 'What a panel of London banks said they could borrow at, in ten currencies — now retired',
        },
        {
          id: 'effr',
          term: 'The effective federal funds rate',
          definition: 'What US banks actually paid each other overnight, and what the Fed steers towards its target',
        },
        {
          id: 'sofr',
          term: 'SOFR',
          definition: 'What overnight dollar repo actually traded at, taken from the transactions themselves',
        },
      ],
      explanation:
        'Two distinctions are doing the work here. One is opinion against observation: LIBOR was surveyed, the other two are measured. The other is unsecured against secured: LIBOR carried the risk that the borrowing bank might fail, SOFR is lent against treasury collateral and carries almost none. That second gap is why replacing one with the other took years of contract rewriting rather than a change of name.',
    },
  ],
  keyTakeaways: [
    'LIBOR was a surveyed average of interbank lending rates, in ten currencies.',
    'The fed funds rate covers the same kind of lending but is steered by policy.',
    'A benchmark built on what banks report is a benchmark that can be misreported.',
  ],
});
