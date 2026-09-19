/**
 * ============================================================================
 * Module 1 · Lesson 6 — "Creating money does not make you richer"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to say why a central bank's own money appears on
 * the liability side of its balance sheet, who it is owed to, and why an asset
 * appears at the same instant — and to post an open market purchase by hand.
 *
 * Why this lesson exists
 * ----------------------
 * It is the single most common place people get stuck, and the usual
 * explanations skip the step that resolves it. The stuck version goes: "the
 * central bank can create money, so it has an asset — but somehow it is a
 * liability, and I do not know to whom."
 *
 * Three corrections, in order, and they have to be in this order:
 *
 *   1. Printing is not creating. Notes in the issuer's own vault are paper.
 *      The Fed's H.4.1 reports "Federal Reserve notes, net of F.R. Bank
 *      holdings" — it subtracts the ones it is holding itself.
 *   2. The money *is* the liability. There is no moment where the bank holds
 *      the money it made; the moment it leaves, it is owed.
 *   3. The asset appears because the bank received something. Creation is
 *      always a swap or a loan, never an emission.
 *
 * The landing point is that equity does not move. If creating money enriched a
 * central bank, it would create without limit and buy the world.
 *
 * Sources / further reading for reviewers:
 *   - Federal Reserve statistical release H.4.1, liabilities table — the
 *     "net of F.R. Bank holdings" line is the whole of challenge 1.
 *   - Bank of England Quarterly Bulletin 2014 Q1, "Money creation in the
 *     modern economy".
 *   - Treaty on the Functioning of the European Union, Article 123 — the
 *     prohibition challenge 5 rests on.
 *
 * A note on rigour: whether fiat central bank money is "really" a liability is
 * genuinely disputed — it is not redeemable for anything but itself. The
 * lesson takes the position that it is a claim because the issuer must accept
 * it back at par, and says so explicitly in challenge 4 rather than presenting
 * one side of a live argument as settled.
 */

import { defineLesson } from '../../schema';

export const theMoneyIsTheIouLesson = defineLesson({
  id: 'the-money-is-the-iou',
  title: 'The Money Is the IOU',
  subtitle:
    'A central bank cannot create money and keep it. The thing it creates is the thing it owes.',
  icon: '⚖️',
  difficulty: 'core',
  estimatedMinutes: 8,
  hearts: 3,

  keyTakeaways: [
    'Printing a banknote creates nothing. It becomes money, and a liability, only when it is issued in exchange for something.',
    'The money a central bank creates *is* its liability. There is no moment at which it holds the money it made.',
    'An asset appears at the same instant because the bank received something: an asset it bought, or a promise to repay.',
    'Creating money does not make a central bank richer. Both sides rise together and net worth does not move.',
    'What makes a purchase monetary financing is not where it was bought or from whom, but whether the central bank’s holdings grew in order to fund new borrowing.',
  ],

  challenges: [
    // -----------------------------------------------------------------------
    {
      id: 'mc-printing-is-not-creating',
      type: 'multiple_choice',
      tags: ['money-creation', 'central-banking'],
      xp: 15,
      prompt:
        'The Fed prints $1M of new $100 bills. They are stacked in its own vault. What is on its balance sheet?',
      explanation:
        'Nothing. Unissued notes are inventory — paper and ink the Fed happens to own, like its chairs. They become money, and a liability, at issuance: when a bank draws them down and pays for them out of its reserves. The Fed publishes this distinction rather than hiding it — the H.4.1 liability line reads "Federal Reserve notes, net of F.R. Bank holdings", explicitly subtracting the notes it is holding itself.',
      options: [
        { id: 'nothing', label: 'Nothing at all' },
        {
          id: 'liability',
          label: 'A $1M liability',
          feedback:
            'Not yet. A liability is owed to somebody, and these notes are owed to nobody — they have not left the building. Your own IOU, in your own drawer, is not a debt.',
        },
        {
          id: 'asset',
          label: 'A $1M asset',
          feedback:
            'The paper is worth its printing cost, not its face value. If printing created assets at face value, the printing cost would be the only limit on a central bank’s wealth.',
        },
        {
          id: 'both',
          label: 'Both: a $1M asset and a $1M liability',
          feedback:
            'This is the right shape for *issued* money, but it has not been issued. The two entries appear together at the moment it is handed over in exchange for something.',
        },
      ],
      correctOptionId: 'nothing',
    },

    // -----------------------------------------------------------------------
    {
      id: 'mc-why-an-asset-appears',
      type: 'multiple_choice',
      tags: ['money-creation', 'balance-sheets'],
      xp: 15,
      prompt: 'When a central bank creates money, why does an asset appear at the same moment?',
      explanation:
        'Because it bought something. A central bank does not emit money into the void — it swaps its new liability for an asset, or lends it against a promise to repay. The asset is whatever it received. That is also why the accounting cannot be "gamed": the identity is not a rule imposed from outside, it is a description of a transaction that had two sides.',
      options: [
        {
          id: 'received',
          label: 'Because it received something in exchange for the money it created',
        },
        {
          id: 'rules',
          label: 'Because accounting rules require every liability to have a matching asset',
          feedback:
            'They do not. A liability can be matched by a fall in equity instead — which is exactly what happens when a central bank hands money over for nothing. The asset appears because of what happened, not because a rule demanded it.',
        },
        {
          id: 'gold',
          label: 'Because the money has to be backed by gold or foreign reserves',
          feedback:
            'No modern currency is redeemable for gold, yet the entries still pair. The asset is whatever was bought — usually government bonds — and it does not have to be a commodity.',
        },
        {
          id: 'profit',
          label: 'Because the central bank books the new money as profit',
          feedback:
            'If creation were profit, net worth would rise with every dollar and a central bank could buy the world. Both sides rise together instead, and equity does not move.',
        },
      ],
      correctOptionId: 'received',
    },

    // -----------------------------------------------------------------------
    {
      id: 'ta-open-market-purchase',
      type: 't_account_flow',
      tags: ['money-creation', 'open-market-operations', 'balance-sheets'],
      xp: 30,
      prompt: 'The Fed buys a $1B Treasury bond from a commercial bank. Post it.',
      instructions: 'Pick an entry, then choose whose sheet it lands on and which side',
      scenario:
        'This is how base money is normally created. The Fed buys the bond and pays by crediting the seller’s reserve account — with reserves that did not exist a moment earlier. Four entries are needed; three of the seven do not belong.',
      currency: 'USD',
      entities: [
        {
          id: 'fed',
          label: 'Federal Reserve',
          tier: 'central_bank',
          role: 'Buying the bond',
          openingLines: [
            { account: 'US Treasuries', side: 'asset', amount: 5000e9 },
            { account: 'Bank reserves', side: 'liability', amount: 3200e9 },
            { account: 'Notes in circulation', side: 'liability', amount: 1700e9 },
            { account: 'Capital and reserves', side: 'liability', amount: 100e9 },
          ],
        },
        {
          id: 'bank',
          label: 'Commercial Bank',
          tier: 'commercial_bank',
          role: 'Selling the bond',
          openingLines: [
            { account: 'US Treasuries', side: 'asset', amount: 20e9 },
            { account: 'Reserves at the Fed', side: 'asset', amount: 8e9 },
            { account: 'Customer deposits', side: 'liability', amount: 25e9 },
          ],
        },
      ],
      options: [
        {
          id: 'fed-bond-up',
          shift: { entityId: 'fed', side: 'asset', account: 'US Treasuries', delta: 1e9 },
        },
        {
          id: 'fed-reserves-up',
          shift: { entityId: 'fed', side: 'liability', account: 'Bank reserves', delta: 1e9 },
        },
        {
          id: 'bank-bond-down',
          shift: { entityId: 'bank', side: 'asset', account: 'US Treasuries', delta: -1e9 },
        },
        {
          id: 'bank-reserves-up',
          shift: { entityId: 'bank', side: 'asset', account: 'Reserves at the Fed', delta: 1e9 },
        },
        {
          id: 'fed-capital-up',
          shift: { entityId: 'fed', side: 'liability', account: 'Capital and reserves', delta: 1e9 },
          feedback:
            'The Fed is no richer for having done this. It paid full price for the bond, so its net worth is exactly what it was — that is the whole point of the pairing.',
        },
        {
          id: 'bank-deposits-up',
          shift: { entityId: 'bank', side: 'liability', account: 'Customer deposits', delta: 1e9 },
          feedback:
            'No customer was involved. The bank sold its own bond from its own portfolio; nobody’s deposit changed.',
        },
        {
          id: 'fed-notes-up',
          shift: { entityId: 'fed', side: 'liability', account: 'Notes in circulation', delta: 1e9 },
          feedback:
            'Payment was made in reserves, not banknotes. Notes only enter circulation when somebody withdraws cash.',
        },
      ],
      expectedShifts: [
        { entityId: 'fed', side: 'asset', account: 'US Treasuries', delta: 1e9 },
        { entityId: 'fed', side: 'liability', account: 'Bank reserves', delta: 1e9 },
        { entityId: 'bank', side: 'asset', account: 'US Treasuries', delta: -1e9 },
        { entityId: 'bank', side: 'asset', account: 'Reserves at the Fed', delta: 1e9 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'expand',
          note: 'Base money rose by $1B. The reserves the Fed credited did not come from anywhere — they are new.',
        },
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'Nobody’s deposit moved. The bank swapped one asset for another, and broad money is deposits, not reserves.',
        },
        {
          aggregate: 'collateral',
          direction: 'contract',
          note: 'A bond left the private market and sat on the Fed’s book. That is the part of QE that is about collateral rather than money.',
        },
      ],
      explanation:
        'The Fed’s total grew by $1B on both sides at once. Its asset is the bond; its liability is the money it paid with. Notice what did *not* happen: the Fed never held the $1B. The reserves existed only from the instant they were owed to the selling bank. Notice also the commercial bank’s total is unchanged — it swapped a bond for reserves, which is why an open market purchase makes the banking system more liquid without making it richer.',
    },

    // -----------------------------------------------------------------------
    {
      id: 'cm-whose-liability',
      type: 'concept_match',
      tags: ['money-creation', 'balance-sheets'],
      xp: 20,
      prompt: 'Each of these is somebody’s promise. Match it to who owes it.',
      explanation:
        'A liability is always owed to whoever holds it — that is what makes it a claim rather than an object. What a central bank actually owes you is the subtle part: hand a £10 note to the Bank of England and you get a £10 note back, so the promise is not to give you something else. The promise is to *take it back* — to accept it at par in settlement of taxes, of loans it made, of assets it sells. That obligation to accept is the content of the claim. Whether that makes fiat money "really" a liability is genuinely argued over; what is not argued over is that the issuer must honour it at par.',
      pairs: [
        {
          id: 'reserves',
          term: 'Reserves at the central bank',
          definition: 'Owed by the central bank to the commercial bank that holds them',
        },
        {
          id: 'banknote',
          term: 'A banknote in your pocket',
          definition: 'Owed by the central bank to whoever is holding it',
        },
        {
          id: 'deposit',
          term: 'The balance in your current account',
          definition: 'Owed by your commercial bank to you — not by the central bank',
        },
        {
          id: 'unissued',
          term: 'A note still in the issuer’s vault',
          definition: 'Owed to nobody. It is inventory, not money',
        },
      ],
    },

    // -----------------------------------------------------------------------
    {
      id: 'ta-monetary-financing',
      type: 't_account_flow',
      tags: ['money-creation', 'monetary-financing', 'balance-sheets'],
      xp: 30,
      prompt:
        'Now the case that is usually forbidden: the central bank credits the Treasury $1B and receives nothing. Post it.',
      instructions: 'Four entries. Think about what balances a new liability when no asset arrives',
      scenario:
        'No bond is bought and no loan is made — the money is simply given. Both sheets still have to balance, so on each one something has to absorb it. Only the accounts that move are shown. Four entries are needed; three of the seven do not belong.',
      currency: 'USD',
      entities: [
        {
          id: 'centralbank',
          label: 'Central Bank',
          tier: 'central_bank',
          role: 'Giving, not lending',
          openingLines: [
            { account: 'Government bonds', side: 'asset', amount: 500e9 },
            { account: 'Treasury deposit', side: 'liability', amount: 50e9 },
            { account: 'Bank reserves', side: 'liability', amount: 400e9 },
            { account: 'Capital and reserves', side: 'liability', amount: 50e9 },
          ],
        },
        {
          id: 'treasury',
          label: 'Treasury',
          tier: 'fiduciary_core',
          role: 'Receiving, not borrowing',
          openingLines: [
            { account: 'Deposit at the central bank', side: 'asset', amount: 50e9 },
            { account: 'Net position', side: 'liability', amount: 50e9 },
          ],
        },
      ],
      options: [
        {
          id: 'treasury-up',
          shift: { entityId: 'centralbank', side: 'liability', account: 'Treasury deposit', delta: 1e9 },
        },
        {
          id: 'capital-down',
          shift: { entityId: 'centralbank', side: 'liability', account: 'Capital and reserves', delta: -1e9 },
        },
        {
          id: 'gov-deposit-up',
          shift: { entityId: 'treasury', side: 'asset', account: 'Deposit at the central bank', delta: 1e9 },
        },
        {
          id: 'gov-networth-up',
          shift: { entityId: 'treasury', side: 'liability', account: 'Net position', delta: 1e9 },
        },
        {
          id: 'bonds-up',
          shift: { entityId: 'centralbank', side: 'asset', account: 'Government bonds', delta: 1e9 },
          feedback:
            'No bond was bought. That is precisely what separates this from an open market purchase — and precisely why it is treated differently in law.',
        },
        {
          id: 'reserves-up',
          shift: { entityId: 'centralbank', side: 'liability', account: 'Bank reserves', delta: 1e9 },
          feedback:
            'The money went to the Treasury’s account, not to a commercial bank’s. Reserves move later, when the government actually spends it.',
        },
        {
          id: 'capital-up',
          shift: { entityId: 'centralbank', side: 'liability', account: 'Capital and reserves', delta: 1e9 },
          feedback:
            'Backwards. The bank gave away $1B and got nothing, so its net worth fell. Giving money away does not build capital.',
        },
      ],
      expectedShifts: [
        { entityId: 'centralbank', side: 'liability', account: 'Treasury deposit', delta: 1e9 },
        { entityId: 'centralbank', side: 'liability', account: 'Capital and reserves', delta: -1e9 },
        { entityId: 'treasury', side: 'asset', account: 'Deposit at the central bank', delta: 1e9 },
        { entityId: 'treasury', side: 'liability', account: 'Net position', delta: 1e9 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'expand',
          note: 'A new central bank liability exists. It is base money the moment the Treasury spends it into the banking system.',
        },
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'Not yet. Broad money rises when the government pays somebody and the payment lands in a deposit account.',
        },
      ],
      explanation:
        'The central bank’s assets did not move, so its equity absorbed the whole $1B — and the Treasury’s net position rose by exactly the same amount. Put the two sheets side by side and the operation is not really money creation at all: it is a transfer of $1B of net worth from the central bank to the government, settled in newly created money. This is the case that proves the rule from the last exercise: the asset side normally appears *because the bank received something*, not because some rule forbids a lone liability. Remove the thing received and the liability still appears — it is simply paid for out of net worth. That is monetary financing, and Article 123 of the Treaty on the Functioning of the European Union prohibits the ECB from doing it. Not because the arithmetic fails, but because it works perfectly: it is a way to fund a government that never shows up as a tax and never shows up as a debt.',
    },

    // -----------------------------------------------------------------------
    {
      id: 'mc-which-one-is-financing',
      type: 'multiple_choice',
      tags: ['monetary-financing', 'open-market-operations', 'central-banking'],
      xp: 20,
      prompt: 'A central bank makes four purchases. Which one is monetary financing?',
      explanation:
        'The first. The test is not where the bond was bought, nor from whom — it is whether the central bank’s holdings grew *in order to fund borrowing that would otherwise have needed a private buyer*. Only the first does that. The rollover looks like the forbidden thing and is not: the bank held the same amount before and after, and the government raised nothing it would not otherwise have raised. The secondary purchase is ordinary QE — the bond was somebody else’s already. The repo is a loan, and it is returned in the morning. Worth knowing that the rules differ: the Fed rolls maturing holdings over at Treasury auctions, while Article 123 bars the ECB from the primary market at all, so it reinvests by buying in the secondary market instead. Same principle, drawn tighter.',
      options: [
        {
          id: 'new-issue',
          label: 'It buys a newly issued bond at auction, and its holdings rise by that amount',
        },
        {
          id: 'rollover',
          label: 'A bond it holds matures, and it buys a new one so its holdings stay the same',
          feedback:
            'This is the one that looks forbidden and is not. Nothing was funded that would not have been funded anyway — the holding was $100B before and $100B after, and the money supply is where it started.',
        },
        {
          id: 'secondary',
          label: 'It buys a five-year-old bond from a pension fund',
          feedback:
            'That is an ordinary open market purchase — QE. The government was financed years ago, by the pension fund. The central bank replaced the holder; it did not fund anything.',
        },
        {
          id: 'repo',
          label: 'It lends to a bank overnight, holding a government bond as security',
          feedback:
            'That is a loan against collateral, unwound in the morning. The bond never became the central bank’s, and the government was not on either side of it.',
        },
      ],
      correctOptionId: 'new-issue',
    },
  ],
});
