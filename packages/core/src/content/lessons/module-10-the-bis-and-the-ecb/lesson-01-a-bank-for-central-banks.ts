import { defineLesson } from '../../schema';

/**
 * BIS Annual Report 2025/26: balance sheet total SDR 482bn at 31 March 2026,
 * of which SDR 428bn is currency deposits placed mainly by central banks.
 * Assets 28% government and other securities, 25% reverse repos, 22% cash at
 * central banks, 16% gold and gold loans (102 tonnes in its own investment
 * portfolio), 9% loans, advances and other. Owned by 63 central banks
 * accounting for about 95% of world GDP. Reporting currency: the SDR.
 */
export const aBankForCentralBanksLesson = defineLesson({
  id: 'what-the-bis-is',
  title: 'The Bank Whose Customers Are Central Banks',
  subtitle:
    'Before anything about influence: the BIS is a bank, and its depositors are the institutions people think it commands.',
  icon: '🏛️',
  difficulty: 'core',
  estimatedMinutes: 8,
  challenges: [
    {
      id: 'mc-what-it-is',
      type: 'multiple_choice',
      tags: ['bis', 'institutions'],
      xp: 15,
      prompt:
        'The BIS reports a balance sheet of SDR 482 billion, of which SDR 428 billion is deposits. Who placed those deposits?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'central-banks',
          label: 'Central banks, placing part of their foreign exchange reserves',
        },
        {
          id: 'governments',
          label: 'Governments, funding the institution',
          feedback:
            'Governments do not bank there. The BIS is owned by central banks and its customers are central banks — which is a narrower and more specific relationship than "governments".',
        },
        {
          id: 'commercial',
          label: 'Large commercial banks',
          feedback:
            'The BIS does not take deposits from commercial banks or from the public. Its customer list is essentially the same list as its shareholder list.',
        },
        {
          id: 'imf',
          label: 'The IMF, which uses the BIS as its custodian',
        },
      ],
      correctOptionId: 'central-banks',
      explanation:
        'This is the fact to fix first, because everything else follows from it. The BIS is a bank, and its depositors are the sixty-three central banks that also own it. When people say "the BIS", they are usually describing something the depositors did together, not something the bank did to them.',
    },

    {
      id: 'match-bis-anatomy',
      type: 'concept_match',
      tags: ['bis', 'balance-sheet'],
      xp: 20,
      prompt: 'Match each part of the BIS to what it actually is.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'deposits',
          term: 'Currency deposits',
          definition:
            'SDR 428bn of central bank reserves parked at the BIS — its largest liability',
        },
        {
          id: 'gold',
          term: 'Gold and gold loans',
          definition:
            '16% of assets, including 102 tonnes in its own investment portfolio',
        },
        {
          id: 'sdr',
          term: 'The SDR',
          definition:
            'The IMF unit the BIS keeps its books in, so no member’s currency is the yardstick',
        },
        {
          id: 'owners',
          term: 'The shareholders',
          definition:
            '63 central banks, covering about 95% of world GDP — and also the customers',
        },
      ],
      explanation:
        'Reporting in SDR rather than dollars or euros is not a technicality. An institution owned by sixty-three central banks cannot keep its books in one member’s money without making that member’s policy its accounting baseline — so it uses a basket that belongs to nobody.',
    },

    {
      id: 'reserve-placement',
      type: 't_account_flow',
      tags: ['bis', 'reserves', 'balance-sheet'],
      xp: 25,
      prompt:
        'A euro area national central bank places €1bn of reserves on deposit at the BIS. Post it.',
      instructions: 'Two sheets. Note who ends up owing whom.',
      scenario:
        'A Eurosystem national central bank moves €1bn of its foreign exchange reserves out of a commercial bank account and into a deposit at the BIS, which invests it in government securities and reverse repos.',
      currency: 'EUR',
      entities: [
        {
          id: 'ncb',
          label: 'A Eurosystem National Central Bank',
          tier: 'central_bank',
          role: 'Owner, customer and depositor',
          openingLines: [
            { account: 'Balances with commercial banks', side: 'asset', amount: 12000000000 },
            { account: 'Deposits at the BIS', side: 'asset', amount: 3000000000 },
            { account: 'Banknotes in circulation', side: 'liability', amount: 15000000000 },
          ],
        },
        {
          id: 'bis',
          label: 'Bank for International Settlements',
          tier: 'shadow_bank',
          role: 'Takes the deposit, invests the proceeds',
          openingLines: [
            { account: 'Government securities', side: 'asset', amount: 140000000000 },
            { account: 'Currency deposits', side: 'liability', amount: 428000000000 },
          ],
        },
      ],
      options: [
        {
          id: 'ncb-bis-up',
          shift: {
            entityId: 'ncb',
            side: 'asset',
            account: 'Deposits at the BIS',
            delta: 1000000000,
          },
        },
        {
          id: 'ncb-banks-down',
          shift: {
            entityId: 'ncb',
            side: 'asset',
            account: 'Balances with commercial banks',
            delta: -1000000000,
          },
        },
        {
          id: 'bis-deposits-up',
          shift: {
            entityId: 'bis',
            side: 'liability',
            account: 'Currency deposits',
            delta: 1000000000,
          },
        },
        {
          id: 'bis-securities-up',
          shift: {
            entityId: 'bis',
            side: 'asset',
            account: 'Government securities',
            delta: 1000000000,
          },
        },
        {
          id: 'ncb-notes-up',
          shift: {
            entityId: 'ncb',
            side: 'liability',
            account: 'Banknotes in circulation',
            delta: 1000000000,
          },
          feedback:
            'Nothing was issued. The national central bank swapped one asset for another; its liabilities are exactly what they were this morning.',
        },
      ],
      expectedShifts: [
        {
          entityId: 'ncb',
          side: 'asset',
          account: 'Deposits at the BIS',
          delta: 1000000000,
        },
        {
          entityId: 'ncb',
          side: 'asset',
          account: 'Balances with commercial banks',
          delta: -1000000000,
        },
        {
          entityId: 'bis',
          side: 'liability',
          account: 'Currency deposits',
          delta: 1000000000,
        },
        {
          entityId: 'bis',
          side: 'asset',
          account: 'Government securities',
          delta: 1000000000,
        },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'unchanged',
          note: 'No euro base money was created or destroyed. This is a reserve manager moving a deposit.',
        },
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'Nothing in the euro area money supply moved.',
        },
        {
          aggregate: 'collateral',
          direction: 'unchanged',
          note: 'The BIS bought securities that already existed from someone who already held them.',
        },
      ],
      explanation:
        'Read the direction of the obligation. The BIS now owes the national central bank €1bn — the customer is the creditor, and the BIS is the one holding someone else’s money. That is the shape of every relationship on this balance sheet, and it is worth having in mind before the next lesson, which is about the influence people believe runs the other way.',
    },

    {
      id: 'mc-scale',
      type: 'multiple_choice',
      tags: ['bis', 'ecb', 'scale'],
      xp: 20,
      prompt:
        'The BIS balance sheet is SDR 482bn. The Eurosystem’s is €5,915,343m. What follows?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'order-of-magnitude',
          label: 'The Eurosystem is an order of magnitude larger — the BIS cannot move markets by dealing',
        },
        {
          id: 'bis-bigger',
          label: 'They are broadly comparable institutions',
          feedback:
            'At any plausible SDR rate the Eurosystem is more than ten times the size. That gap matters for what kind of influence is even mechanically available.',
        },
        {
          id: 'irrelevant',
          label: 'Nothing — balance sheet size says nothing about influence',
          feedback:
            'It rules out one specific channel. An institution cannot steer euro money markets by transacting when the counterparty it would be steering is ten times its size.',
        },
        {
          id: 'lender',
          label: 'The BIS could act as lender of last resort to the euro area',
        },
      ],
      correctOptionId: 'order-of-magnitude',
      explanation:
        'This closes off the crudest theory of influence before the module opens the real ones. Whatever the BIS does to shape what the ECB decides, it does not do it by dealing — it does not have the balance sheet, and the money it does have belongs to its members. The influence, where it exists, runs through standards, forums and ideas. Those are the next three lessons.',
    },
  ],
  keyTakeaways: [
    'The BIS is a bank whose depositors and shareholders are the same 63 central banks.',
    'SDR 482bn of assets, SDR 428bn of it other people’s deposits, 16% held in gold.',
    'When a central bank deposits reserves, the BIS becomes the debtor — the customer is the creditor.',
    'It is an order of magnitude smaller than the Eurosystem, which rules out influence by dealing.',
  ],
});
