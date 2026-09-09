import { defineLesson } from '../../schema';

/**
 * Everything in this lesson comes from the Project Mariana final report (BIS,
 * September 2023): the participants, the three components, the two use cases,
 * the networks it ran on, and the disclaimer in its own executive summary.
 *
 * The lesson is deliberately literal. A reader who can say what the project
 * built, on what, with whose money, is immune to both of the usual failures —
 * treating a testnet prototype as an imminent currency, and treating it as
 * vapour because it was a prototype.
 */
export const whatMarianaBuiltLesson = defineLesson({
  id: 'what-mariana-built',
  title: 'Three Components, One Testnet',
  subtitle:
    'Exactly what the BIS, France, Singapore and Switzerland built in 2023 — and the sentence in which they said what it was not.',
  icon: '🧪',
  difficulty: 'core',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'mc-what-it-was',
      type: 'multiple_choice',
      tags: ['mariana', 'bis', 'cbdc'],
      xp: 20,
      prompt:
        'Project Mariana ran through 2023 and published its final report on 28 September. What was it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'poc',
          label:
            'A proof of concept: hypothetical euro, Singapore dollar and Swiss franc wholesale CBDCs, on test networks, with no real money',
        },
        {
          id: 'pilot',
          label: 'A pilot moving real central bank money across borders',
          feedback:
            'That describes the 2022 mBridge pilot, which did settle real value. Mariana’s three currencies are called hypothetical throughout its own report, and its shared network was a public Ethereum testnet.',
        },
        {
          id: 'launch',
          label: 'The launch of a shared BIS currency for the three jurisdictions',
          feedback:
            'No such thing exists, and the report forecloses it in one sentence: the project "does not indicate that any of the involved central banks intend to issue CBDC". The BIS could not issue a currency in any case — it has no legislature behind it and no citizens in front of it.',
        },
        {
          id: 'paper',
          label: 'A theoretical paper describing a system nobody built',
          feedback:
            'It ran. Twenty-four test cases were executed across the two use cases, and the annex lists sample transaction hashes. Understating it is as inaccurate as overstating it, and rather more common among people who have not opened the report.',
        },
      ],
      correctOptionId: 'poc',
      explanation:
        'Mariana was real code doing fake transactions, which is a specific and useful thing to be. The disclaimer sits in the executive summary and rewards being read literally: "purely experimental and does not indicate that any of the involved central banks intend to issue CBDC or endorse DeFi or a particular technological solution." Everything demonstrated is a feasibility claim — and feasibility is the cheapest of all the claims a monetary system has to survive.',
    },
    {
      id: 'mc-where-it-ran',
      type: 'multiple_choice',
      tags: ['mariana', 'dlt', 'tokens'],
      xp: 25,
      prompt: 'Where did the code actually run?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'besu-sepolia',
          label:
            'Domestic platforms on permissioned Ethereum (Hyperledger Besu); the shared transnational network on Sepolia, a public Ethereum testnet',
        },
        {
          id: 'private',
          label: 'Entirely on private infrastructure operated by the BIS',
          feedback:
            'The three domestic platforms were permissioned, but the transnational network hosting the pool was a public testnet, named in the report as Sepolia. That the shared layer was public is one of the more interesting choices in the whole design.',
        },
        {
          id: 'mainnet',
          label: 'Ethereum mainnet, paying real gas fees',
          feedback:
            'A testnet, not mainnet. The report goes as far as noting that network usage fees were excluded from consideration altogether.',
        },
        {
          id: 'bitcoin',
          label: 'A Bitcoin sidechain',
          feedback:
            'The wholesale CBDCs were ERC-20 smart contracts, which is an Ethereum standard. Nothing in Mariana touches Bitcoin.',
        },
      ],
      correctOptionId: 'besu-sepolia',
      explanation:
        'The wholesale CBDCs were ERC-20 tokens — the same fungible-token standard most stablecoins use — because a common standard is what lets three currencies sit in one pool and be traded against each other. Central banks kept their own permissioned platforms at home and met on shared public infrastructure. The report’s framing of why that matters: central banks "are able to manage their wCBDC without necessarily operating or controlling the underlying infrastructure."',
    },
    {
      id: 'order-use-case-one',
      type: 'order_flow',
      tags: ['mariana', 'cross-border-payments', 'fx'],
      xp: 30,
      prompt:
        'Use case 1: a Singaporean bank pays a Swiss bank. Put the six steps into the order Mariana executed them.',
      instructions: 'Arrange the steps into the correct sequence',
      events: [
        {
          id: 'issue',
          label: 'Singapore issues SGD wholesale CBDC',
          detail: 'The Singaporean bank requests issuance on its domestic platform',
        },
        {
          id: 'bridge-out',
          label: 'The SGD crosses the bridge',
          detail: 'From the Singapore platform to the shared transnational network',
        },
        {
          id: 'swap',
          label: 'The market-maker swaps SGD for CHF',
          detail: 'Priced and settled in one transaction against the three-currency pool',
        },
        {
          id: 'pay',
          label: 'CHF wholesale CBDC is paid to the Swiss bank',
          detail: 'An ordinary transfer, on the transnational network',
        },
        {
          id: 'bridge-home',
          label: 'The CHF crosses the Swiss bridge',
          detail: 'From the transnational network back to the Swiss domestic platform',
        },
        {
          id: 'redeem',
          label: 'The Swiss National Bank redeems the token',
          detail: 'It is destroyed; the Swiss bank is left holding ordinary central bank money',
        },
      ],
      correctOrder: ['issue', 'bridge-out', 'swap', 'pay', 'bridge-home', 'redeem'],
      explanation:
        'Look at what is missing from the middle: no correspondent bank, no account pre-funded in Switzerland months earlier, no two-day settlement lag, and no window in which one leg has been paid and the other has not. Trading and settlement collapse into a single transaction, and that is where the elimination of settlement risk comes from. Then look at what is present at both ends — a central bank issuing, and a central bank redeeming. The token never stops being somebody’s liability, and the somebody never changes.',
    },
    {
      id: 'mc-bridge-balance-sheet',
      type: 'multiple_choice',
      tags: ['mariana', 'bridges', 'balance-sheets'],
      xp: 30,
      prompt:
        'Requirement B.3: "Each central bank’s balance sheet remains unaffected by the transfer of wCBDC between the respective domestic platform and the transnational network." How was that achieved?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'custody-release',
          label:
            'The domestic bridge contract takes the token into custody while the transnational contract releases an equal amount — the claim changes network, not issuer',
        },
        {
          id: 'new-issue',
          label: 'The transnational network issued a fresh token backed by the domestic one',
          feedback:
            'That would create a second issuer and a second liability, which is what wrapped assets do in DeFi and exactly what the requirement rules out. The franc on the shared network is the Swiss National Bank’s liability, not a wrapper’s.',
        },
        {
          id: 'netting',
          label: 'Transfers were netted at the end of each day, so nothing moved intraday',
          feedback:
            'Nothing in Mariana nets. Every trade is pre-funded and settles gross and instantly — that is the market-maker’s central design choice and, as the next lesson shows, its central cost.',
        },
        {
          id: 'off-balance',
          label: 'The tokens were held off balance sheet by the relayers',
          feedback:
            'Relayers pass messages; they never hold value. Six per bridge, three in each direction, two of the three required to confirm before anything proceeds.',
        },
      ],
      correctOptionId: 'custody-release',
      explanation:
        'A bridge moves where a claim lives without changing whose claim it is, which is the only way a cross-network transfer can leave the issuer’s balance sheet flat. It cost real complexity to build: the report calls the implementation complex, names reliable communication between the networks as the hard part, and warns that bridging platforms built on different protocols would be considerably harder again. Bridges are also the most attacked component in the whole of decentralised finance, which the report acknowledges without resolving.',
    },
    {
      id: 'match-mariana-parts',
      type: 'concept_match',
      tags: ['mariana', 'defi', 'vocabulary'],
      xp: 25,
      prompt: 'Four pieces of vocabulary that make the report readable. Match each to its job.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'bridge',
          term: 'Bridge',
          definition:
            'Smart contracts on both networks plus off-chain relayers, moving a token between them without changing its issuer',
        },
        {
          id: 'allow-list',
          term: 'Allow list',
          definition:
            'The register each central bank keeps of which institutions may hold, send and receive its token',
        },
        {
          id: 'bonding-curve',
          term: 'Bonding curve',
          definition:
            'The function that sets the price of one currency against another inside the shared pool',
        },
        {
          id: 'lp-token',
          term: 'LP token',
          definition:
            'The receipt a bank gets for putting liquidity in, and the way it measures its position',
        },
      ],
      explanation:
        'None of these is exotic once translated. An allow list is an account-opening policy, a bonding curve is a price rule, an LP token is a receipt, a bridge is a custody arrangement between two ledgers. The moment the vocabulary resolves, "thirty pages of impenetrable jargon" turns out to be about eight ideas — which is worth knowing before deciding that the difficulty was the point.',
    },
  ],
  keyTakeaways: [
    'Mariana was a proof of concept: hypothetical currencies, test networks, no real value, 24 test cases.',
    'Domestic platforms ran on permissioned Ethereum; the shared network was the public Sepolia testnet.',
    'The wholesale CBDCs were ERC-20 tokens, so three currencies could sit in one pool.',
    'Bridges move a claim between networks without changing its issuer, which is why the issuing balance sheet stays flat.',
  ],
});
