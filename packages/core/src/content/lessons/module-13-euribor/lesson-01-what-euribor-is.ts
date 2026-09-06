import { defineLesson } from '../../schema';

/**
 * Euribor by tenor, August 2026 monthly averages (ECB Data Portal, FM):
 * 1M 2.221%, 3M 2.513%, 6M 2.713%, 12M 2.954%. Against the ECB's deposit
 * facility rate of 2.25%, main refinancing rate 2.40%, and €STR fixing at
 * 2.189%.
 *
 * Note what that means before reading further: the 1-month is *below* the
 * deposit facility rate and the 12-month is 70 basis points above it.
 */
export const whatEuriborIsLesson = defineLesson({
  id: 'what-euribor-actually-is',
  title: 'Not a Policy Rate, Not Risk-Free, Not Always a Trade',
  subtitle:
    'Three things Euribor is routinely assumed to be, and is not. Start by taking them away.',
  icon: '📌',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-who-sets-it',
      type: 'multiple_choice',
      tags: ['euribor', 'benchmarks'],
      xp: 20,
      prompt: 'Who sets Euribor?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'panel-emmi',
          label: 'A panel of banks submits, and EMMI calculates and publishes it',
        },
        {
          id: 'ecb',
          label: 'The ECB, as one of its policy rates',
          feedback:
            'The ECB sets the deposit facility, main refinancing and marginal lending rates, and publishes €STR. Euribor is none of those — it is a private benchmark, administered by the European Money Markets Institute.',
        },
        {
          id: 'market',
          label: 'It is the volume-weighted average of all interbank loans that day',
          feedback:
            'That describes €STR. The unsecured term interbank market is far too thin for a 12-month rate to be computed that way, which is exactly the problem the methodology has to solve.',
        },
        {
          id: 'commission',
          label: 'The European Commission, under the Benchmarks Regulation',
          feedback:
            'The Regulation governs how a benchmark must be administered and authorises the administrator. It does not produce the number.',
        },
      ],
      correctOptionId: 'panel-emmi',
      explanation:
        'Euribor is a private benchmark run by EMMI from panel bank submissions, authorised under the EU Benchmarks Regulation. That the ECB does not set it is the first thing to fix: it means Euribor can move when the ECB has done nothing, and has — repeatedly.',
    },
    {
      id: 'mc-hybrid',
      type: 'multiple_choice',
      tags: ['euribor', 'methodology', 'libor'],
      xp: 25,
      prompt:
        'Since the 2019 reform Euribor uses a "hybrid waterfall": Level 1 real transactions, Level 2 transaction-derived, Level 3 modelling and expert judgement. Why not simply require Level 1?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'not-enough-trades',
          label: 'Because on most days there are not enough term interbank trades to compute one',
        },
        {
          id: 'banks-refused',
          label: 'Because the panel banks refused to be bound to transactions',
          feedback:
            'Panel banks did leave over legal risk after the LIBOR scandal, but the binding problem is arithmetic: you cannot average trades that did not happen.',
        },
        {
          id: 'too-volatile',
          label: 'Because transaction-based rates are too volatile for mortgages',
          feedback:
            '€STR is fully transaction-based and is one of the least volatile rates in existence. Volatility is not the obstacle.',
        },
        {
          id: 'legacy',
          label: 'Because contracts written before 2019 require the old method',
        },
      ],
      correctOptionId: 'not-enough-trades',
      explanation:
        'Banks stopped lending to each other unsecured for three, six and twelve months after 2008 — the market Euribor measures largely went away, while millions of contracts kept referencing it. The waterfall is an honest response to that: use trades where they exist, and say plainly when you are modelling. It is also the reason to hold the number a little more loosely than a price you can see printed.',
    },
    {
      id: 'match-benchmarks',
      type: 'concept_match',
      tags: ['euribor', 'estr', 'benchmarks'],
      xp: 25,
      prompt: 'Match each rate to what it actually measures.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'estr',
          term: '€STR',
          definition:
            'Overnight, unsecured, transaction-based, published by the ECB — 2.189% and effectively risk-free',
        },
        {
          id: 'euribor',
          term: 'Euribor',
          definition:
            'Term unsecured bank funding, panel-submitted, carrying bank credit risk — 2.954% at 12 months',
        },
        {
          id: 'dfr',
          term: 'The deposit facility rate',
          definition:
            'What the ECB itself pays banks overnight — a decision, not a measurement, at 2.25%',
        },
        {
          id: 'spread',
          term: 'Your mortgage spread',
          definition:
            'The fixed margin your bank adds, set once at signing and never reset',
        },
      ],
      explanation:
        'Two of these are measurements, one is a decision, and one is a contract term. Confusing the last with the first is the most expensive error a borrower makes: when Euribor falls, the spread does not, and when a bank advertises a low rate it is advertising the spread over an index nobody controls.',
    },
    {
      id: 'mc-below-the-dfr',
      type: 'multiple_choice',
      tags: ['euribor', 'estr', 'curve'],
      xp: 30,
      prompt:
        '1-month Euribor was 2.221% while the ECB paid 2.25% on deposits. Why would a bank lend for a month at less than it can earn overnight at the ECB, risk-free?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'expects-cuts',
          label: 'Because a month of expected overnight rates can average below today’s, if a cut is expected within it',
        },
        {
          id: 'arbitrage',
          label: 'It would not — the quote must be wrong',
          feedback:
            'The quote is the average of the panel and it prints daily. When a published rate looks like free money, the usual explanation is that you have compared two different things.',
        },
        {
          id: 'no-access',
          label: 'Because the lenders in that market cannot use the deposit facility',
          feedback:
            'That is the right explanation for €STR printing below the floor, and Euribor is a bank panel — banks do have access. Here the answer is about time, not access.',
        },
        {
          id: 'collateral',
          label: 'Because Euribor lending is secured and therefore cheaper',
          feedback:
            'Euribor is explicitly unsecured. If anything that should push it above the risk-free rate, not below.',
        },
      ],
      correctOptionId: 'expects-cuts',
      explanation:
        'A one-month rate is a forecast of the average overnight rate over the coming month. If the market expects a cut partway through it, that average sits below today’s level even though the ECB has not moved. So Euribor printing under the deposit rate is not an anomaly — it is the market telling you what it thinks is coming, and the credit premium simply is not large enough at one month to offset the expectation.',
    },
  ],
  keyTakeaways: [
    'Euribor is a private benchmark from EMMI panel submissions, not an ECB policy rate.',
    'Since 2019 it uses a hybrid waterfall, because the term interbank market it measures largely stopped trading.',
    '€STR is overnight, transaction-based and risk-free; Euribor is term and carries bank credit risk.',
    'Euribor below the deposit rate is a forecast of cuts, not an arbitrage.',
  ],
});
