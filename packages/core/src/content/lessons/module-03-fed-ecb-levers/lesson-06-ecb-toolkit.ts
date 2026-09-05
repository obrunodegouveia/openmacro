/**
 * ============================================================================
 * Module 3 · Lesson 6 — "The euro area does it differently"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to name the ECB's three key rates and explain why
 * a currency union with nineteen sovereign issuers needs instruments the Fed
 * has never required.
 *
 * Sources / further reading for reviewers:
 *   - ECB, "The Eurosystem's instruments" and the TLTRO III terms.
 *   - Draghi, "Whatever it takes" speech, London, 26 July 2012, and the OMT
 *     announcement that followed.
 *
 * A note on rigour: OMT has never been used. Its effect came entirely from
 * being announced and being credible — which is a real and important
 * mechanism, and the lesson treats it as one rather than as a curiosity.
 */

import { defineLesson } from '../../schema';

export const ecbToolkitLesson = defineLesson({
  id: 'ecb-toolkit',
  title: 'The Euro Area Does It Differently',
  subtitle: 'Three rates, targeted loans, and a promise that worked without being kept.',
  icon: '🇪🇺',
  difficulty: 'advanced',
  estimatedMinutes: 8,
  hearts: 3,

  keyTakeaways: [
    'The ECB runs three rates: the deposit facility (floor), the main refinancing operation, and marginal lending (ceiling).',
    'TLTROs lend to banks cheaply on condition they lend onward — a tool aimed at credit, not just at rates.',
    'A currency union has many sovereign issuers and one central bank, so its bonds are not interchangeable.',
    'OMT ended a crisis by being announced. It has still never been used.',
  ],

  challenges: [
    {
      id: 'match-ecb-rates',
      type: 'concept_match',
      tags: ['ecb', 'corridor'],
      xp: 15,
      prompt: 'Match each ECB instrument to what it does.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'dfr',
          term: 'Deposit facility rate',
          definition: 'What banks earn on reserves left overnight — the floor',
        },
        {
          id: 'mro',
          term: 'Main refinancing operation',
          definition: 'Weekly lending against collateral, historically the headline rate',
        },
        {
          id: 'mlf',
          term: 'Marginal lending facility',
          definition: 'Overnight lending on demand — the ceiling',
        },
        {
          id: 'tltro',
          term: 'TLTRO',
          definition: 'Cheap multi-year funding, conditional on the bank lending it onward',
        },
        {
          id: 'omt',
          term: 'OMT',
          definition: 'A never-used promise to buy a member state’s bonds without limit',
        },
      ],
      explanation:
        'The DFR became the effective policy rate once reserves turned abundant — the same shift that happened at the Fed, for the same reason. The MRO kept its billing as the headline for years after it had stopped setting anything, which is a good reminder that the instrument a central bank talks about is not always the one doing the work.',
    },

    {
      id: 'mc-tltro-conditionality',
      type: 'multiple_choice',
      tags: ['ecb', 'tltro'],
      xp: 15,
      prompt: 'TLTROs lent to banks at rates that could go *below* the deposit rate. Why attach lending conditions?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'profit',
          label: 'To stop banks profiting from the ECB',
          feedback:
            'The subsidy was deliberate — the ECB was willing to pay banks to lend. Preventing profit was not the aim; directing it was.',
        },
        {
          id: 'transmission',
          label: 'Because cheap funding does not become credit unless banks actually pass it on',
        },
        {
          id: 'legal',
          label: 'Because lending without conditions would be monetary financing',
          feedback:
            'Monetary financing concerns lending to *governments*. Lending to banks is ordinary central banking whatever the conditions.',
        },
        {
          id: 'inflation',
          label: 'To keep the operation from being inflationary',
          feedback:
            'Encouraging credit is if anything the inflationary direction. Conditions pushed harder on that lever, not against it.',
        },
      ],
      correctOptionId: 'transmission',
      explanation:
        'This is the transmission problem. After 2011 the ECB could cut rates as far as it liked and southern European firms still could not borrow, because their banks were repairing balance sheets rather than lending. TLTROs tied the subsidy to the outcome: lend more to the real economy and your funding cost falls, up to a point below the deposit rate. It is one of the few tools that targets credit directly instead of hoping rates will do it.',
    },

    {
      id: 'mc-fragmentation',
      type: 'multiple_choice',
      tags: ['ecb', 'fragmentation'],
      xp: 20,
      prompt: 'German and Italian government bonds are both euro-denominated. Why do they yield differently?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'inflation',
          label: 'Different inflation expectations',
          feedback:
            'They share a currency and therefore an inflation rate. Whatever separates the yields, it is not the expected value of the euro.',
        },
        {
          id: 'credit-redenomination',
          label: 'Credit risk, and the risk of leaving the euro and repaying in something else',
        },
        {
          id: 'liquidity',
          label: 'Purely liquidity — the German market is larger',
          feedback:
            'Liquidity explains a few basis points. It does not explain the hundreds of basis points seen in 2011–12.',
        },
        {
          id: 'ecb',
          label: 'The ECB sets different rates for different countries',
          feedback:
            'It sets one set of rates for the whole area. That uniformity is precisely what makes the yield gap a problem rather than a policy.',
        },
      ],
      correctOptionId: 'credit-redenomination',
      explanation:
        'A country that issues its own currency can always create the money to repay its bonds — default becomes a political choice rather than a necessity. Euro area members gave that up: Italy owes a currency it cannot issue, so its bonds carry genuine default risk. Worse, in 2012 spreads also priced the chance of a country leaving and repaying in a devalued new currency. That second component is self-fulfilling — high yields make exit likelier — which is what OMT was built to kill.',
    },

    {
      id: 'order-whatever-it-takes',
      type: 'order_flow',
      tags: ['ecb', 'omt', 'crisis'],
      xp: 20,
      prompt: 'How did a speech end the euro crisis? Put it in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'spreads',
          label: 'Spanish and Italian yields rise towards unsustainable levels',
          detail: 'Markets price the chance of exit and redenomination',
        },
        {
          id: 'selffulfil',
          label: 'High yields make default more likely, which raises yields further',
          detail: 'A loop with no natural stopping point',
        },
        {
          id: 'promise',
          label: 'The ECB says it will do whatever it takes, and announces OMT',
          detail: 'Unlimited purchases, conditional on a reform programme',
        },
        {
          id: 'reprice',
          label: 'Betting on exit now means betting against unlimited buying',
          detail: 'The trade stops being attractive',
        },
        {
          id: 'fall',
          label: 'Spreads collapse without a single bond being bought',
          detail: 'The facility has never been used',
        },
      ],
      correctOrder: ['spreads', 'selffulfil', 'promise', 'reprice', 'fall'],
      explanation:
        'This is the clearest example in modern policy of an instrument working through expectations alone. The loop in step two only runs if investors believe it will — remove that belief and it unwinds by itself. OMT never bought anything because it never had to, which is why it is sometimes called the most successful monetary policy operation never conducted. The condition attached to it also matters: unlimited support was offered only alongside a reform programme, which is what made it politically survivable in creditor countries.',
    },
  ],
});
