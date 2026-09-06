import { defineLesson } from '../../schema';

/**
 * The capstone: both columns, with numbers on each.
 *
 * Consumer price inflation (World Bank, annual %): Côte d'Ivoire 4.4 in 2023
 * and 0.1 in 2025; Senegal 5.9 in 2023, 1.5 in 2025; Cameroon 7.4 in 2023, 3.4
 * in 2025. Against Ghana 38.1 in 2023 and 14.2 in 2025, and Nigeria 24.7 in
 * 2023 and 23.0 in 2025.
 *
 * Local currency per US dollar (World Bank official rate), 2010 to 2025: the
 * CFA franc 494.79 to 581.93 — 1.2x. The Ghanaian cedi 1.43 to 12.56 — 8.8x.
 * The Nigerian naira 150.30 to 1,518.38 — 10.1x.
 */
export const theLedgerLesson = defineLesson({
  id: 'the-cfa-ledger',
  title: 'Both Columns, With Numbers',
  subtitle:
    'The arrangement has a cost and a benefit, and each is large. Read them together or you will get the argument wrong.',
  icon: '⚖️',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'mc-inflation-record',
      type: 'multiple_choice',
      tags: ['cfa', 'inflation', 'evidence'],
      xp: 25,
      prompt:
        'In 2023 inflation was 4.4% in Côte d’Ivoire and 38.1% in Ghana — neighbours, similar exports, different monetary arrangements. What does that support?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'peg-delivers-stability',
          label: 'That the peg delivers price stability its neighbours have not managed — a real benefit, borne by real people',
        },
        {
          id: 'nothing',
          label: 'Nothing — the countries are too different to compare',
          feedback:
            'They are not identical, but they are about as close as international economics ever gets: adjacent West African economies exporting cocoa and gold, differing most obviously in monetary regime. A gap of nine to one is not explained away by the residual differences.',
        },
        {
          id: 'ghana-mismanaged',
          label: 'That Ghana was simply badly managed',
          feedback:
            'Partly, and that is the point rather than an objection: a peg is a device for constraining domestic management. It works by removing the option that was misused.',
        },
        {
          id: 'colonial',
          label: 'That the data reflect colonial accounting conventions',
        },
      ],
      correctOptionId: 'peg-delivers-stability',
      explanation:
        'This has to be faced squarely by anyone arguing the arrangement is purely extractive. A saver in Abidjan kept their purchasing power through 2022 and 2023; a saver in Accra lost roughly a third of it in a single year. That difference is the inflation tax from an earlier module, and it fell on the country without the peg. The benefit is not theoretical and it is not small.',
    },

    {
      id: 'mc-depreciation',
      type: 'multiple_choice',
      tags: ['cfa', 'exchange-rates', 'evidence'],
      xp: 25,
      prompt:
        'Since 2010 the naira went from 150 to 1,518 per dollar and the cedi from 1.43 to 12.56. The CFA franc went from 495 to 582. Who gained from the CFA’s stability?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'holders-and-importers',
          label: 'Anyone holding the currency or buying imports — and anyone repatriating profits abroad',
        },
        {
          id: 'exporters',
          label: 'Exporters, who got a stronger currency',
          feedback:
            'Backwards. A currency that does not depreciate while your costs rise makes your exports dearer abroad — that is the real appreciation from the previous lesson.',
        },
        {
          id: 'nobody',
          label: 'Nobody — exchange rates are neutral over time',
        },
        {
          id: 'governments',
          label: 'Member governments, whose debt fell in real terms',
          feedback:
            'The opposite: stable money means their debt does not inflate away. That is a genuine constraint on them, which is part of what the arrangement is for.',
        },
      ],
      correctOptionId: 'holders-and-importers',
      explanation:
        'Name the winners precisely and the distribution becomes visible. Wage earners and savers keep their purchasing power. Importers and consumers of imported goods gain. And a foreign firm repatriating profits converts at a rate that has not moved in fifteen years — no devaluation risk, no capital controls, guaranteed convertibility. That last group is where the extraction argument has its strongest footing, and it does not require anyone to be holding anyone else’s reserves.',
    },

    {
      id: 'match-the-ledger',
      type: 'concept_match',
      tags: ['cfa', 'evaluation'],
      xp: 30,
      prompt: 'Match each feature of the arrangement to what it actually does.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'stability',
          term: 'Low, stable inflation',
          definition:
            'A real benefit, mostly to wage earners and savers — 4.4% against Ghana’s 38.1% in 2023',
        },
        {
          id: 'no-policy',
          term: 'No independent monetary policy',
          definition:
            'A real cost, paid whenever local conditions differ from the euro area’s',
        },
        {
          id: 'overvaluation',
          term: 'Real appreciation over time',
          definition:
            'A slow cost to exporters and manufacturing, which ended in a 50% devaluation in 1994',
        },
        {
          id: 'convertibility',
          term: 'Guaranteed free convertibility',
          definition:
            'Cuts both ways: it attracts investment, and it makes taking the returns out frictionless',
        },
        {
          id: 'guarantee',
          term: 'The French convertibility guarantee',
          definition:
            'Why no speculator has done to the CFA what was done to sterling in 1992',
        },
      ],
      explanation:
        'Every line is real and they do not net out to zero in any obvious direction — which is why serious economists disagree about this arrangement and why the honest position is not a slogan. What you can say precisely is who bears each item: savers and importers on one side of the ledger, exporters, manufacturers and the unemployed on the other.',
    },

    {
      id: 'mc-what-would-settle-it',
      type: 'multiple_choice',
      tags: ['cfa', 'method', 'evidence'],
      xp: 25,
      prompt:
        'You want to test whether the arrangement is on balance extractive. What evidence would actually move you?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'compare-flows',
          label: 'Profit repatriation and capital outflows relative to comparable non-peg economies, over a long period',
        },
        {
          id: 'reserves-held',
          label: 'How much of the reserves France holds',
          feedback:
            'For the eight UEMOA states the answer has been none since about 2020, and the arrangement’s effects did not visibly change. A variable that went to zero without the outcome changing is not the one doing the work.',
        },
        {
          id: 'colonial-origin',
          label: 'The colonial origin of the arrangement',
          feedback:
            'It explains why the arrangement exists and why the parity is a 1994 French franc rate. It cannot tell you what the arrangement does now — origins are not effects.',
        },
        {
          id: 'sentiment',
          label: 'How the populations of member states feel about it',
        },
      ],
      correctOptionId: 'compare-flows',
      explanation:
        'Extraction is a claim about flows, so it has to be tested on flows — and against a comparison group, because the question is never "are resources leaving" but "are more leaving than would otherwise". The 2020 reform is the closest thing the region offers to a controlled experiment: one large feature was removed from one zone and not the other. Watching what changed and what did not is worth more than any amount of argument about the account in Paris.',
    },

    {
      id: 'mc-transfer',
      type: 'multiple_choice',
      tags: ['pegs', 'method', 'general'],
      xp: 25,
      prompt:
        'What transfers from this module to a pegged currency anywhere in the world?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'four-questions',
          label: 'Ask who sets the anchor’s policy, what the export currency is, where the adjustment lands, and who can take money out',
        },
        {
          id: 'pegs-bad',
          label: 'That pegs are bad for developing countries',
          feedback:
            'The inflation and exchange rate data in this lesson are a direct argument against stating it that flatly. A peg is a trade, and which side of it you are on depends on whether you hold the currency or export in it.',
        },
        {
          id: 'colonial',
          label: 'That currency arrangements with former colonial powers are extractive',
        },
        {
          id: 'float',
          label: 'That floating is always better',
          feedback:
            'The naira went from 150 to 1,518 per dollar and Ghana ran 38% inflation. Floating is not a solution; it is a different distribution of the same adjustment.',
        },
      ],
      correctOptionId: 'four-questions',
      explanation:
        'Those four questions work on the Hong Kong dollar, the Danish krone, the Gulf pegs and the CFA franc alike, and they give different answers each time — which is what makes them worth having. The Danish peg to the euro looks like the CFA’s on paper and is a very different arrangement, because Denmark trades with the euro area, sets its own fiscal policy and can leave. Same mechanism, different answers to the four questions, different verdict.',
    },
  ],
  keyTakeaways: [
    'Côte d’Ivoire 4.4% inflation against Ghana’s 38.1% in 2023: the price stability is real and it is large.',
    'The CFA moved 1.2x against the dollar since 2010; the cedi 8.8x and the naira 10.1x.',
    'The clearest beneficiaries are savers, importers and anyone repatriating profits without devaluation risk.',
    'Extraction is a claim about flows, so test it on flows against a comparison group — and the 2020 reform is close to an experiment.',
  ],
});
