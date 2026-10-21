import { defineLesson } from '../../schema';

/** Video 25. LIBOR as a surveyed average of interbank rates, and how it differs from the fed funds rate. */
export const kabLiborLesson = defineLesson({
  id: 'kab-libor',
  title: 'A Rate Nobody Sets',
  subtitle:
    'The central bank steers the fed funds rate. LIBOR was just a survey of banks — and that is the key difference.',
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
          label: 'An average of the rates a group of London banks said they could borrow at',
        },
        {
          id: 'set-by-boe',
          label: 'An interest rate the Bank of England set every day',
          feedback:
            'No central bank set it. That is the contrast the video makes with the fed funds rate, which a central bank steers.',
        },
        {
          id: 'mortgage',
          label: 'The rate British banks charged on home loans',
          feedback:
            'Loans to customers were often priced as LIBOR plus an extra amount. But LIBOR itself was only about banks lending to each other.',
        },
        {
          id: 'exchange',
          label: 'An exchange rate between ten different currencies',
          feedback:
            'It was published in ten currencies, so this is an easy mistake. But it measured the cost of borrowing, not an exchange rate.',
        },
      ],
      correctOptionId: 'survey',
      explanation:
        'LIBOR stands for London Interbank Offered Rate. It was published in ten currencies, so it was used all over the world. It had a built-in weakness: it was based on what banks said, not on real trades. That made the later cheating scandal possible. It is also why LIBOR has been replaced by rates based on real trades.',
    },
    {
      id: 'mc-vs-fed-funds',
      type: 'multiple_choice',
      tags: ['libor', 'fed-funds'],
      xp: 25,
      prompt: 'The effective federal funds rate is the real average rate on one-night loans between US banks. How is LIBOR different from it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'policy',
          label: 'Both are rates for loans between banks, but the central bank steers the funds rate',
        },
        {
          id: 'same',
          label: 'They are the same number, published under two names',
          feedback:
            'Both are rates for loans between banks. But one was a survey in many currencies run by a group of banks. The other is a US rate the central bank aims for.',
        },
        {
          id: 'secured',
          label: 'LIBOR loans have collateral; fed funds loans do not',
          feedback:
            'Both are about loans between banks without collateral. The difference is who influences the number.',
        },
        {
          id: 'longer',
          label: 'LIBOR is for long loans and the funds rate is for one night',
          feedback:
            'LIBOR was published for several lengths, including one night. The difference here is control by the central bank.',
        },
      ],
      correctOptionId: 'policy',
      explanation:
        'Both measure the same kind of deal: banks lending to each other without collateral. But LIBOR was a reference number used to price other contracts. The fed funds rate is a tool the central bank uses. Knowing which is which tells you whether a rate moved because of the market or because of a central bank decision.',
    },
    {
      id: 'mc-survey-not-trades',
      type: 'multiple_choice',
      tags: ['libor', 'benchmarks'],
      xp: 35,
      prompt:
        'LIBOR was made by asking a group of London banks what rate they could borrow at, then averaging the answers. What does this way of making it allow?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'misreport',
          label: 'A bank can give a number it likes, not a rate it really paid',
        },
        {
          id: 'slow',
          label: 'The rate comes out too slowly to be useful',
          feedback:
            'It came out every day and was used the same day. Speed was never the problem.',
        },
        {
          id: 'currencies',
          label: 'It can cover ten currencies at the same time',
          feedback:
            'It did, and that is why it spread around the world. But that has nothing to do with it being a survey.',
        },
        {
          id: 'average',
          label: 'One very unusual answer can pull the average a long way',
          feedback:
            'The maths already dealt with that: the highest and lowest answers were removed before averaging. The problem was answers bent on purpose, not extreme ones.',
        },
      ],
      correctOptionId: 'misreport',
      explanation:
        'A rate based on what banks say, not on what they did, asks a question nobody can check. And it asks the people who gain from the answer. That is the heart of the LIBOR scandal. From 2012, it came out that traders at several banks had for years asked colleagues to submit numbers that helped their trades, sometimes in chat messages.',
    },
    {
      id: 'mc-two-motives',
      type: 'multiple_choice',
      tags: ['libor', 'financial-crisis'],
      xp: 35,
      prompt:
        'In 2007 and 2008, some banks in the LIBOR group reported rates lower than they were really paying. Why?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'lookhealthy',
          label: 'A high rate would tell everyone the bank was finding it hard to borrow',
        },
        {
          id: 'cheaper',
          label: 'So they would pay less on their own loans',
          feedback:
            'A bank’s answer did not decide what it paid; it only reported it. Lenders charged it the same whatever it said.',
        },
        {
          id: 'regulator',
          label: 'Because regulators told them to',
          feedback:
            'People still argue about the role of officials, and some talks at the time were unclear. But the banks reported low numbers to protect their own reputation, and they knew it.',
        },
        {
          id: 'error',
          label: 'Honest mistakes, because almost nobody was lending at any rate',
          feedback:
            'Markets really were frozen and guessing was hard. But honest mistakes would go both ways, and these numbers were always too low.',
        },
      ],
      correctOptionId: 'lookhealthy',
      explanation:
        'This is the shame problem from video 19 again. Saying you pay 5% when others say 3% tells everyone that lenders think you are in trouble. So the number became a statement about the bank’s health, not a measure of the market. There were two separate scandals: traders pushing the rate to profit on their trades, and whole banks reporting low numbers in the crisis to look healthy.',
    },
    {
      id: 'mc-what-replaced-it',
      type: 'multiple_choice',
      tags: ['libor', 'benchmarks', 'repo'],
      xp: 35,
      prompt:
        'LIBOR has now ended. Its main replacement for dollars, SOFR, is worked out from real one-night repo trades. Why does that fix the problem?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'nothingtoguess',
          label: 'There is nothing left to guess — each trade either happened or it did not',
        },
        {
          id: 'lower',
          label: 'Because repo rates are lower than rates between banks',
          feedback:
            'Borrowing with collateral is cheaper, and that gap made changing old contracts really hard. But being lower does not make a rate trustworthy.',
        },
        {
          id: 'government',
          label: 'Because the government sets it, not the banks',
          feedback:
            'The New York Fed publishes it, but does not choose the number. It reports the middle rate of trades that really took place, weighted by size.',
        },
        {
          id: 'currencies',
          label: 'Because it covers more currencies',
          feedback:
            'It covers fewer: SOFR is for dollars only, and other currencies have their own replacements. Covering many currencies was LIBOR’s strength, not its problem.',
        },
      ],
      correctOptionId: 'nothingtoguess',
      explanation:
        'Base a rate on real trades instead of opinions, and false reporting is no longer possible: you cannot lie about a trade that really happened. There is a cost. SOFR loans have collateral, so SOFR does not include the risk of a bank failing the way LIBOR did. That made changing trillions of old contracts really hard. But a rate you can check was judged better than one you cannot trust. Note that SOFR is built on the repo market from video 20.',
    },
    {
      id: 'match-benchmarks',
      type: 'concept_match',
      tags: ['libor', 'fed-funds', 'benchmarks'],
      xp: 30,
      prompt: 'Here are three short-term interest rates that are easy to mix up. Match each to what it really measures.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'libor',
          term: 'LIBOR',
          definition: 'What a group of London banks said they could borrow at, in ten currencies — now ended',
        },
        {
          id: 'effr',
          term: 'The effective federal funds rate',
          definition: 'What US banks really paid each other for one night; the Fed steers it towards its target',
        },
        {
          id: 'sofr',
          term: 'SOFR',
          definition: 'The real rate on one-night dollar repo deals, taken from the trades themselves',
        },
      ],
      explanation:
        'Two differences matter here. First, opinion or real trades: LIBOR was a survey, while the other two come from real trades. Second, with or without collateral: LIBOR included the risk that the borrowing bank might fail, while SOFR loans are backed by government bonds and have almost no such risk. That second gap is why replacing LIBOR took years of rewriting contracts, not just a new name.',
    },
  ],
  keyTakeaways: [
    'LIBOR was an average of rates that banks reported for lending to each other, in ten currencies.',
    'The federal funds rate covers similar loans between banks, but the central bank steers it.',
    'A rate based on what banks report can be falsely reported.',
  ],
});
