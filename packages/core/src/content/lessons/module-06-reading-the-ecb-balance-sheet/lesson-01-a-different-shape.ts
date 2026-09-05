import { defineLesson } from '../../schema';

/**
 * Figures throughout this module are the Eurosystem's consolidated financial
 * statement as at 28 August 2026, published 1 September 2026, in millions of
 * euro. Trend figures come from the same weekly series (ECB Data Portal,
 * ILM.W.U2.C.T000000.Z5.Z01); policy rates as at 6 September 2026.
 */
export const aDifferentShapeLesson = defineLesson({
  id: 'ecb-a-different-shape',
  title: 'The Same Job, a Different Shape',
  subtitle:
    'The ECB publishes its balance sheet every Tuesday, and it looks nothing like the Fed’s.',
  icon: '🇪🇺',
  difficulty: 'core',
  estimatedMinutes: 7,
  challenges: [
    {
      id: 'mc-biggest-difference',
      type: 'multiple_choice',
      tags: ['ecb', 'balance-sheet'],
      xp: 15,
      prompt:
        'On 28 August 2026 the Eurosystem held €1,232,838 million of one asset the Fed effectively does not hold at all. Which?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'gold',
          label: 'Gold — a fifth of the entire balance sheet',
        },
        {
          id: 'corporate',
          label: 'Corporate bonds',
          feedback:
            'The ECB does hold corporate bonds, and the Fed briefly did too in 2020. But they are a slice of the securities line, nowhere near €1.2 trillion.',
        },
        {
          id: 'fx',
          label: 'Foreign currency claims',
          feedback:
            'Close in spirit — the Eurosystem holds €526,308m of those and the Fed holds very little. But it is not the €1.2 trillion line.',
        },
        {
          id: 'loans',
          label: 'Loans to banks',
          feedback:
            'Backwards, and by a lot. Lending to euro area credit institutions was €32,429m that week — half of one per cent of the sheet.',
        },
      ],
      correctOptionId: 'gold',
      explanation:
        'The Eurosystem carries €1.23 trillion of gold, 21% of its assets. The Fed carries a gold certificate account of $11,037 million — 0.16% of its assets. Same asset class, two orders of magnitude apart as a share, and the reason is an accounting rule rather than a vault.',
    },

    {
      id: 'match-ecb-lines',
      type: 'concept_match',
      tags: ['ecb', 'balance-sheet'],
      xp: 20,
      prompt: 'Match each line of the Eurosystem statement to what it is.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'mpo-securities',
          term: 'Securities held for monetary policy purposes',
          definition:
            'The APP and PEPP portfolios — €3.36tn, and the largest thing on the sheet',
        },
        {
          id: 'deposit-facility',
          term: 'Deposit facility',
          definition:
            'Where banks park euros overnight at the policy floor — €2.01tn of them',
        },
        {
          id: 'current-accounts',
          term: 'Current accounts',
          definition:
            'The other place banks can hold central bank money — only €318bn sits here',
        },
        {
          id: 'revaluation',
          term: 'Revaluation accounts',
          definition:
            'Unrealised gains on gold and foreign currency, €1.21tn of them',
        },
        {
          id: 'lending',
          term: 'Lending to euro area credit institutions',
          definition: 'Refinancing operations — once €2tn, now €32bn',
        },
      ],
      explanation:
        'Three of these five have no equivalent on the Fed’s balance sheet at all. The Fed has one reserve line, not two; it has no revaluation account; and its lending column has been near zero for so long that people forget it is there.',
    },

    {
      id: 'mc-who-is-eurosystem',
      type: 'multiple_choice',
      tags: ['ecb', 'institutions'],
      xp: 10,
      prompt:
        'The statement is titled "consolidated financial statement of the Eurosystem", not "of the ECB". What is the difference?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'nothing',
          label: 'Nothing — the two names are used interchangeably',
          feedback:
            'They are used loosely in the press, but the statement is precise for a reason: most of what is on it does not belong to the ECB.',
        },
        {
          id: 'ecb-plus-ncbs',
          label: 'The Eurosystem is the ECB plus the twenty national central banks',
        },
        {
          id: 'eu-wide',
          label: 'The Eurosystem covers the whole EU, the ECB only the euro area',
          feedback:
            'Backwards. The wider body is the European System of Central Banks, which includes non-euro members like Poland and Sweden. The Eurosystem is euro-area only.',
        },
        {
          id: 'historic',
          label: 'A historical name kept for continuity',
        },
      ],
      correctOptionId: 'ecb-plus-ncbs',
      explanation:
        'The Banque de France, the Bundesbank and eighteen others hold most of these assets on their own books; the ECB itself is a small share. That matters for who bears a loss: when a bond in the APP portfolio defaults, most of the pain sits with the national central bank that bought it, not with Frankfurt.',
    },

    {
      id: 'mc-total-check',
      type: 'multiple_choice',
      tags: ['ecb', 'balance-sheet'],
      xp: 15,
      prompt:
        'Eurosystem total assets: €5,915,343m. Fed total assets: $6,737,204m. What does the comparison tell you?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'similar',
          label: 'Two balance sheets of broadly similar size, doing the job differently',
        },
        {
          id: 'ecb-smaller-economy',
          label: 'The euro area economy must be about 12% smaller than the US',
          feedback:
            'The ratio of two balance sheets is not the ratio of two economies. It reflects policy choices — how much was bought, how fast it is running off — far more than the size of what sits underneath.',
        },
        {
          id: 'ecb-tighter',
          label: 'The ECB has been tighter than the Fed throughout',
          feedback:
            'A level cannot tell you that. It happens that the ECB *is* shrinking faster right now, but you need the trend to say so, not the size.',
        },
        {
          id: 'currency',
          label: 'Nothing — they are in different currencies and cannot be compared',
          feedback:
            'They are within about 15% of each other at any plausible exchange rate. The comparison is rough but perfectly informative.',
        },
      ],
      correctOptionId: 'similar',
      explanation:
        'Two institutions, comparable size, almost nothing in common structurally. The Fed’s assets are 96% securities; the Eurosystem’s are 57% securities, 21% gold and 9% foreign currency. Reading one does not teach you to read the other.',
    },
  ],
  keyTakeaways: [
    'The Eurosystem publishes a consolidated weekly statement, and it is the ECB plus twenty national central banks.',
    'Gold is a fifth of its assets. On the Fed’s sheet gold is a rounding error.',
    'Banks hold euros in two places — current accounts and the deposit facility — where at the Fed there is one line.',
    'Similar size, different shape: 57% securities against the Fed’s 96%.',
  ],
});
