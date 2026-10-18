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
            'An average of the rates at which a panel of banks in London said they could borrow',
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
            'Loans to customers were often priced as LIBOR plus a margin, but LIBOR itself was only about lending between banks.',
        },
        {
          id: 'exchange',
          label: 'A foreign exchange rate between ten currencies',
          feedback:
            'It was published in ten currencies, which is easy to mistake for this — but it measured the cost of borrowing, not an exchange rate.',
        },
      ],
      correctOptionId: 'survey',
      explanation:
        'London Interbank Offered Rate — compiled for the British Bankers’ Association, in ten currencies, which made it a global benchmark rather than a national one. Note the built-in weakness the video describes without naming: it was based on what banks *said*, not on actual trades. That is what made the later manipulation scandal possible, and why LIBOR has since been replaced by rates based on real transactions.',
    },
    {
      id: 'mc-vs-fed-funds',
      type: 'multiple_choice',
      tags: ['libor', 'fed-funds'],
      xp: 25,
      prompt: 'How does LIBOR differ from the effective federal funds rate (the actual average rate on overnight loans between US banks)?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'policy',
          label:
            'Both are rates on lending between banks, but the funds rate is steered by the central bank',
        },
        {
          id: 'same',
          label: 'They are the same measure published under two names',
          feedback:
            'Both are rates on lending between banks, but one was a survey in many currencies run by a banking association, and the other is a US rate the central bank targets.',
        },
        {
          id: 'secured',
          label: 'LIBOR is secured lending; the funds rate is unsecured',
          feedback:
            'Both describe lending between banks without collateral. The difference drawn is about who influences the number.',
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
        'Similar transactions — banks lending to each other without collateral — measured two ways. One was a benchmark for pricing other contracts; the other is a tool of monetary policy. Knowing which is which tells you whether a moving rate reflects the market or a central bank decision.',
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
            'It was published daily and used the same day. Speed was never the problem.',
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
            'The calculation already handled that — the highest and lowest answers were thrown out before averaging. The weakness was answers bent on purpose, not extreme ones.',
        },
      ],
      correctOptionId: 'misreport',
      explanation:
        'A benchmark built on what banks *say* rather than what they *did* asks a question nobody can check, and asks it of people who gain from the answer. That is the heart of the LIBOR scandal — from 2012 it emerged that traders at several banks had for years asked colleagues to submit numbers that suited their trades, sometimes in chat messages.',
    },
    {
      id: 'mc-two-motives',
      type: 'multiple_choice',
      tags: ['libor', 'financial-crisis'],
      xp: 35,
      prompt:
        'During 2007 and 2008, some panel banks reported LIBOR rates lower than they were really paying. What was the motive?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'lookhealthy',
          label: 'Reporting a high rate would tell everyone the bank was struggling to borrow',
        },
        {
          id: 'cheaper',
          label: 'To pay less on their own borrowing',
          feedback:
            'A bank’s answer did not set what it paid — it reported it. What lenders actually charged it did not change with what it said.',
        },
        {
          id: 'regulator',
          label: 'Because regulators instructed them to',
          feedback:
            'The role of officials is genuinely disputed, and some conversations at the time were murky. But the motive behind the low numbers was the banks’ own reputation, and they understood that perfectly well.',
        },
        {
          id: 'error',
          label: 'Honest uncertainty, since nobody was lending at any rate',
          feedback:
            'Markets really were frozen and the estimate really was hard. That would explain errors in both directions, but the numbers were consistently too low.',
        },
      ],
      correctOptionId: 'lookhealthy',
      explanation:
        'This is the stigma from video 19 in new clothes. Admitting you pay 5% when the others say 3% announces that lenders think you are in trouble — so the number became a statement about your health rather than a measurement of the market. Note the two separate scandals: traders nudging the rate to profit on their trades, and whole banks reporting low numbers during the crisis to look healthy.',
    },
    {
      id: 'mc-what-replaced-it',
      type: 'multiple_choice',
      tags: ['libor', 'benchmarks', 'repo'],
      xp: 35,
      prompt:
        'LIBOR has now been retired. Its main replacement for dollars, SOFR, is calculated from real overnight repo trades. Why does that fix the problem?',
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
            'Borrowing against collateral is cheaper, and that gap made converting old contracts genuinely hard. But being lower is not what makes a benchmark trustworthy.',
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
        'Move a benchmark from opinion to observation and misreporting is no longer possible: you cannot misstate a trade that actually happened. There is a real cost — SOFR is backed by collateral, so it does not include the risk of a bank failing the way LIBOR did, and that made converting trillions of old contracts genuinely hard. The judgement was that a benchmark you can check beats one that measures the right thing but cannot be trusted. Note how much of the module lands here: SOFR is built on the repo market of video 20.',
    },
    {
      id: 'match-benchmarks',
      type: 'concept_match',
      tags: ['libor', 'fed-funds', 'benchmarks'],
      xp: 30,
      prompt: 'Three short-term interest rates that are easy to confuse. Match each to what it actually measures.',
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
        'Two distinctions do the work here. One is opinion against observation: LIBOR was a survey, the other two come from real trades. The other is with or without collateral: LIBOR included the risk that the borrowing bank might fail, while SOFR loans are backed by Treasury securities and carry almost none. That second gap is why replacing one with the other took years of rewriting contracts rather than a change of name.',
    },
  ],
  keyTakeaways: [
    'LIBOR was a surveyed average of interbank lending rates, in ten currencies.',
    'The federal funds rate covers similar lending between banks but is steered by the central bank.',
    'A benchmark built on what banks report is a benchmark that can be misreported.',
  ],
});
