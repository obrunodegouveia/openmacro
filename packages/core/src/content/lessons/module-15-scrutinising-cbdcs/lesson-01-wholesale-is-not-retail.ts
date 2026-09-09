import { defineLesson } from '../../schema';

/**
 * The distinction the whole module rests on, taught before any project is
 * named — because a reader who has not separated wholesale from retail cannot
 * evaluate a single sentence of a BIS report, and will import alarm from a
 * document about banks into an argument about households.
 *
 * The BIS definition, from the Mariana report's glossary: "A wholesale CBDC
 * (wCBDC) is a CBDC available to commercial banks and other licenced financial
 * institutions."
 */
export const wholesaleIsNotRetailLesson = defineLesson({
  id: 'cbdc-wholesale-is-not-retail',
  title: 'Two Machines, One Acronym',
  subtitle:
    'Wholesale CBDC and retail CBDC share three letters and almost nothing else. Separating them is the difference between scrutiny and noise.',
  icon: '🔍',
  difficulty: 'core',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-what-is-new',
      type: 'multiple_choice',
      tags: ['cbdc', 'reserves', 'wholesale'],
      xp: 20,
      prompt:
        'Banks have held money at the central bank electronically for decades — reserve balances are already digital central bank money. So what would a wholesale CBDC actually change?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'settlement-tech',
          label:
            'The plumbing: the same claim on the central bank, held as a programmable token on a platform that can run around the clock',
        },
        {
          id: 'new-access',
          label: 'It gives banks access to central bank money for the first time',
          feedback:
            'Banks held balances at the central bank long before anyone had a computer. Access is precisely what a wholesale CBDC does not change — which is what makes "wholesale" the quiet half of the acronym.',
        },
        {
          id: 'public-access',
          label: 'It gives the public a direct claim on the central bank',
          feedback:
            'That is a retail CBDC. The BIS glossary is explicit: a wholesale CBDC is "available to commercial banks and other licenced financial institutions". Households do not appear anywhere in it.',
        },
        {
          id: 'more-money',
          label: 'It expands the money supply, because the central bank issues new digital units',
          feedback:
            'Issuance is a swap — reserves down, wholesale CBDC up, on the same balance sheet. You will post that swap by hand two challenges from now, and both sides will balance without a new euro appearing.',
        },
      ],
      correctOptionId: 'settlement-tech',
      explanation:
        'A wholesale CBDC changes the technology of settlement while leaving the set of holders roughly where it already is. A retail CBDC changes the set of holders, which is a different question carrying different stakes. Almost every confused argument about CBDCs is two people answering different ones of those two questions and each finding the other unserious.',
    },
    {
      id: 'match-whose-liability',
      type: 'concept_match',
      tags: ['cbdc', 'money-hierarchy', 'stablecoins'],
      xp: 25,
      prompt: 'Five money-shaped things. Match each to whose promise you are actually holding.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'reserves',
          term: 'Bank reserves',
          definition:
            'A central bank liability, held only by banks — the settlement asset of the system that already exists',
        },
        {
          id: 'wcbdc',
          term: 'Wholesale CBDC',
          definition:
            'A central bank liability, held by banks and licensed financial institutions, as a token on a programmable platform',
        },
        {
          id: 'retail-cbdc',
          term: 'Retail CBDC',
          definition:
            'A central bank liability held directly by the public — fully launched in three countries, and China’s far larger e-CNY is still a pilot',
        },
        {
          id: 'tokenised-deposit',
          term: 'Tokenised deposit',
          definition:
            'A commercial bank liability in token form: your bank’s promise, wearing new clothes',
        },
        {
          id: 'stablecoin',
          term: 'Stablecoin',
          definition:
            'A private issuer’s liability, backed by assets it chooses and that you must trust it holds',
        },
      ],
      explanation:
        'One column, five rows, and the only thing that really changes down the list is whose promise fails if something goes wrong. That is the question to ask of any new money-shaped object, and it survives every rebrand: name the issuer, and you know what the failure looks like.',
    },
    {
      id: 't-wcbdc-issuance',
      type: 't_account_flow',
      tags: ['cbdc', 'balance-sheets', 'money-creation'],
      xp: 35,
      prompt:
        'A euro area bank asks its central bank to issue €500 million of wholesale CBDC on the domestic platform.',
      instructions: 'Place every posting this operation requires',
      scenario:
        'This is "process A" in Project Mariana — the first step of every use case in the experiment. The bank already holds reserves; it wants some of that balance in token form so it can be moved to the network where the FX pool lives. Post what the operation does to both sheets.',
      currency: 'EUR',
      entities: [
        {
          id: 'centralbank',
          label: 'Central bank',
          tier: 'central_bank',
          role: 'Sole issuer of its own currency, in every form',
          openingLines: [
            { account: 'Government bonds', side: 'asset', amount: 4_000_000_000_000 },
            { account: 'Bank reserves', side: 'liability', amount: 2_800_000_000_000 },
            { account: 'Banknotes in circulation', side: 'liability', amount: 1_200_000_000_000 },
          ],
        },
        {
          id: 'commercialbank',
          label: 'Commercial bank',
          tier: 'commercial_bank',
          role: 'Holds the same claim, on one rail or the other',
          openingLines: [
            { account: 'Reserves at the central bank', side: 'asset', amount: 30_000_000_000 },
            { account: 'Loans', side: 'asset', amount: 170_000_000_000 },
            { account: 'Customer deposits', side: 'liability', amount: 200_000_000_000 },
          ],
        },
      ],
      options: [
        {
          id: 'cb-reserves-down',
          shift: {
            entityId: 'centralbank',
            side: 'liability',
            account: 'Bank reserves',
            delta: -500_000_000,
          },
        },
        {
          id: 'cb-wcbdc-up',
          shift: {
            entityId: 'centralbank',
            side: 'liability',
            account: 'Wholesale CBDC',
            delta: 500_000_000,
          },
        },
        {
          id: 'bank-reserves-down',
          shift: {
            entityId: 'commercialbank',
            side: 'asset',
            account: 'Reserves at the central bank',
            delta: -500_000_000,
          },
        },
        {
          id: 'bank-wcbdc-up',
          shift: {
            entityId: 'commercialbank',
            side: 'asset',
            account: 'Wholesale CBDC',
            delta: 500_000_000,
          },
        },
        {
          id: 'cb-bonds-up',
          shift: {
            entityId: 'centralbank',
            side: 'asset',
            account: 'Government bonds',
            delta: 500_000_000,
          },
          feedback:
            'Nothing was bought. This is an issuance against a balance the bank already holds, so the central bank’s asset side never moves — which is exactly why the operation creates no money.',
        },
        {
          id: 'bank-deposits-up',
          shift: {
            entityId: 'commercialbank',
            side: 'liability',
            account: 'Customer deposits',
            delta: 500_000_000,
          },
          feedback:
            'No customer received anything. The bank swapped one central bank claim for another; its depositors are untouched. This is the most common wrong instinct about CBDC issuance, and it is what makes people hear "printing".',
        },
        {
          id: 'bank-loans-up',
          shift: {
            entityId: 'commercialbank',
            side: 'asset',
            account: 'Loans',
            delta: 500_000_000,
          },
          feedback:
            'Issuing a wholesale CBDC lends to nobody. Credit is created on the loan book, and this operation does not go near it.',
        },
        {
          id: 'cb-banknotes-down',
          shift: {
            entityId: 'centralbank',
            side: 'liability',
            account: 'Banknotes in circulation',
            delta: -500_000_000,
          },
          feedback:
            'Banknotes are the central bank’s other public-facing liability, and nothing here converts them. A wholesale token is issued to a bank, not withdrawn from anyone’s pocket.',
        },
      ],
      expectedShifts: [
        {
          entityId: 'centralbank',
          side: 'liability',
          account: 'Bank reserves',
          delta: -500_000_000,
        },
        {
          entityId: 'centralbank',
          side: 'liability',
          account: 'Wholesale CBDC',
          delta: 500_000_000,
        },
        {
          entityId: 'commercialbank',
          side: 'asset',
          account: 'Reserves at the central bank',
          delta: -500_000_000,
        },
        {
          entityId: 'commercialbank',
          side: 'asset',
          account: 'Wholesale CBDC',
          delta: 500_000_000,
        },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'unchanged',
          note: 'Reserves fell €500M and wholesale CBDC rose €500M. Both are central bank liabilities held by banks — the monetary base is the same size in a different wrapper.',
        },
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'No deposit was created or destroyed. Nothing a household or a firm can spend moved at all.',
        },
        {
          aggregate: 'collateral',
          direction: 'unchanged',
          note: 'No security changed hands. The central bank’s asset side never moved, so nothing left or entered the collateral pool.',
        },
      ],
      explanation:
        'Issuance is a swap on the liability side of one balance sheet, mirrored as a swap on the asset side of another. That is the entire operation. "The central bank issues digital currency" sounds like creation and is not — and you now know that because you posted it yourself and both sheets balanced without a single new euro.',
    },
    {
      id: 'mc-surveillance',
      type: 'multiple_choice',
      tags: ['cbdc', 'privacy', 'wholesale'],
      xp: 30,
      prompt:
        '"A CBDC lets the central bank see every payment." Under Project Mariana’s published requirements, what could a central bank actually see?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'wcbdc-txns',
          label:
            'Every transaction in its own wholesale CBDC — which are transfers between banks and licensed institutions, not between people',
        },
        {
          id: 'nothing',
          label: 'Nothing — the design is decentralised, so no single party has a full view',
          feedback:
            'Requirement C.5 says the opposite in one line: "Each central bank can monitor transactions involving its wCBDC." It was implemented with ordinary blockchain explorers. The question worth asking is not whether monitoring exists, but whose transactions are being monitored.',
        },
        {
          id: 'all-payments',
          label: 'Every payment made by every citizen in its currency',
          feedback:
            'There is not a single citizen anywhere in Mariana. The holders are commercial banks and the payments are interbank FX legs. Retail visibility is a serious question about retail designs — but you have to carry it there deliberately, rather than importing the alarm from a document about banks.',
        },
        {
          id: 'only-aggregates',
          label: 'Only aggregate volumes, never individual transfers',
          feedback:
            'Monitoring was implemented with blockchain explorers, which show individual transactions, addresses and balances. Aggregation would have been a design choice, and it was not the one made.',
        },
      ],
      correctOptionId: 'wcbdc-txns',
      explanation:
        'The answer to a surveillance question is always "of whom". On a wholesale platform the monitored parties are supervised banks, whose interbank activity the central bank already watches through the settlement system it operates. That makes C.5 unremarkable here and does not make the retail version unremarkable — it makes it a separate argument, which is the point of spending a lesson on the distinction before naming a single project.',
    },
  ],
  keyTakeaways: [
    'Reserves are already digital central bank money; a wholesale CBDC changes the plumbing, not the holders.',
    'A retail CBDC changes who holds a claim on the central bank — the genuinely new thing, and fully launched in only three countries.',
    'Issuing a wholesale CBDC is a liability swap: M0 unchanged, M2 unchanged, nothing created.',
    'Mariana’s monitoring requirement is about banks. Surveillance questions need "of whom" attached before they mean anything.',
  ],
});
