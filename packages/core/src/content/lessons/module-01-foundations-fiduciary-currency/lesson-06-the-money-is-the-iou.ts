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
    'A central bank cannot create money and keep it. The money it creates is the money it owes.',
  icon: '⚖️',
  difficulty: 'core',
  estimatedMinutes: 8,
  hearts: 3,

  keyTakeaways: [
    'Printing a banknote creates nothing. It only becomes money, and a debt, when it is handed over in exchange for something.',
    'The money a central bank creates is its liability. At no moment does it hold the money it made.',
    'An asset appears at the same moment because the bank received something: something it bought, or a promise to repay.',
    'Creating money does not make a central bank richer. Both sides grow together, so its net worth stays the same.',
    'A purchase is monetary financing when the central bank holds more bonds in order to pay for new government borrowing. Where or from whom it bought them does not decide it.',
  ],

  challenges: [
    // -----------------------------------------------------------------------
    {
      id: 'mc-printing-is-not-creating',
      type: 'multiple_choice',
      tags: ['money-creation', 'central-banking'],
      xp: 15,
      prompt:
        'The Fed prints $1M in new $100 bills and stacks them in its own vault. What is on its balance sheet now?',
      explanation:
        'Nothing. Notes that have not been issued are just stock: paper and ink the Fed owns, like its chairs. They become money, and a debt, when they are issued: when a bank takes them and pays with its reserves. The Fed says this openly. Its published line for notes reads “Federal Reserve notes, net of F.R. Bank holdings”, which removes the notes it holds itself.',
      options: [
        { id: 'nothing', label: 'Nothing at all' },
        {
          id: 'liability',
          label: 'A $1M liability',
          feedback:
            'Not yet. A liability is owed to someone, and these notes are owed to nobody: they have not left the building. An IOU you wrote and kept in your own drawer is not a debt.',
        },
        {
          id: 'asset',
          label: 'A $1M asset',
          feedback:
            'The paper is worth what it cost to print, not the amount written on it. If printing created assets at face value, a central bank could become as rich as it liked.',
        },
        {
          id: 'both',
          label: 'Both: a $1M asset and a $1M liability',
          feedback:
            'That is the right shape for money that has been issued, but this has not. The two entries appear together at the moment the money is handed over for something.',
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
        'Because it bought something. A central bank does not just release money into the air. It swaps its new liability for an asset, or lends it in exchange for a promise to repay. The asset is whatever it received. So you cannot trick the accounting: it simply describes a deal that had two sides.',
      options: [
        {
          id: 'received',
          label: 'Because it received something in exchange for the money it created',
        },
        {
          id: 'rules',
          label: 'Because accounting rules require every liability to have a matching asset',
          feedback:
            'They do not. A liability can be matched by a fall in equity instead, which is what happens when a central bank gives money away for nothing. The asset appears because of what happened, not because a rule says so.',
        },
        {
          id: 'gold',
          label: 'Because the money has to be backed by gold or foreign reserves',
          feedback:
            'No modern currency can be swapped for gold, but the two entries still come in pairs. The asset is whatever was bought, usually government bonds. It does not need to be gold or any other good.',
        },
        {
          id: 'profit',
          label: 'Because the central bank books the new money as profit',
          feedback:
            'If creating money were profit, the bank’s net worth would rise with every dollar and it could buy the world. Instead both sides rise together, and its equity stays the same.',
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
      prompt: 'The Fed buys a $1B US government bond from a commercial bank. Post it.',
      instructions: 'Pick an entry, then choose whose list it goes on and which side',
      scenario:
        'This is the normal way base money is created. The Fed buys the bond and pays by adding reserves to the seller’s account. Those reserves did not exist a moment before. Four entries are needed. Three of the seven are wrong.',
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
            { account: 'Capital and reserves', side: 'liability', amount: 100e9, equity: true },
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
            { account: 'Equity', side: 'liability', amount: 3_000_000_000, equity: true },
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
          shift: { entityId: 'fed', side: 'liability', account: 'Capital and reserves', delta: 1e9, equity: true },
          feedback:
            'The Fed is not richer after this. It paid the full price for the bond, so its net worth is the same. That is the whole point of the pair of entries.',
        },
        {
          id: 'bank-deposits-up',
          shift: { entityId: 'bank', side: 'liability', account: 'Customer deposits', delta: 1e9 },
          feedback:
            'No customer was involved. The bank sold its own bond, and nobody’s deposit changed.',
        },
        {
          id: 'fed-notes-up',
          shift: { entityId: 'fed', side: 'liability', account: 'Notes in circulation', delta: 1e9 },
          feedback:
            'The Fed paid in reserves, not banknotes. Notes only go out when someone takes out cash.',
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
          note: 'Base money rose by $1B. The reserves the Fed added did not come from anywhere: they are new.',
        },
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'Nobody’s deposit moved. The bank swapped one asset for another, and broad money is deposits, not reserves.',
        },
        {
          aggregate: 'collateral',
          direction: 'contract',
          note: 'A bond left the market and now sits with the Fed. This is the part of QE that is about collateral (assets used as security for loans), not about money.',
        },
      ],
      explanation:
        'The Fed’s total grew by $1B on both sides at once. Its asset is the bond. Its liability is the money it paid with. Notice what did not happen: the Fed never held the $1B. The reserves only existed from the moment they were owed to the selling bank. The bank’s total did not change either. It swapped a bond for reserves. So the purchase gives the banking system more cash to use, but does not make it richer.',
    },

    // -----------------------------------------------------------------------
    {
      id: 'cm-whose-liability',
      type: 'concept_match',
      tags: ['money-creation', 'balance-sheets'],
      xp: 20,
      prompt: 'Each of these is someone’s promise. Match it to who owes it.',
      explanation:
        'A liability is always owed to whoever holds it. That is what makes it a claim and not an object. What a central bank owes you is the tricky part. Give a £10 note to the Bank of England and you just get a £10 note back. So the promise is not to give you something else. The promise is to take it back: to accept it at full value for taxes, for loans it made, and for things it sells. Economists still argue whether that makes paper money “really” a debt. Nobody argues that the issuer must accept it at full value.',
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
          definition: 'Owed to you by your commercial bank, not by the central bank',
        },
        {
          id: 'unissued',
          term: 'A note still in the issuer’s vault',
          definition: 'Owed to nobody. It is stock, not money',
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
        'Now the case that is usually not allowed: the central bank gives the government (the Treasury) $1B and gets nothing back. Post it.',
      instructions: 'Four entries. Think about what balances a new liability when no asset comes in',
      scenario:
        'No bond is bought and no loan is made: the money is simply given. Both lists must still balance, so on each one something has to absorb the change. Only the accounts that move are shown. Four entries are needed. Three of the seven are wrong.',
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
            { account: 'Capital and reserves', side: 'liability', amount: 50e9, equity: true },
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
          shift: { entityId: 'centralbank', side: 'liability', account: 'Capital and reserves', delta: -1e9, equity: true },
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
            'No bond was bought. That is exactly what makes this different from a normal purchase, and why the law treats it differently.',
        },
        {
          id: 'reserves-up',
          shift: { entityId: 'centralbank', side: 'liability', account: 'Bank reserves', delta: 1e9 },
          feedback:
            'The money went to the government’s account, not to a commercial bank’s. Reserves move later, when the government spends it.',
        },
        {
          id: 'capital-up',
          shift: { entityId: 'centralbank', side: 'liability', account: 'Capital and reserves', delta: 1e9, equity: true },
          feedback:
            'Backwards. The bank gave away $1B and got nothing, so its net worth fell. Giving money away does not build capital.',
        },
      ],
      expectedShifts: [
        { entityId: 'centralbank', side: 'liability', account: 'Treasury deposit', delta: 1e9 },
        { entityId: 'centralbank', side: 'liability', account: 'Capital and reserves', delta: -1e9, equity: true },
        { entityId: 'treasury', side: 'asset', account: 'Deposit at the central bank', delta: 1e9 },
        { entityId: 'treasury', side: 'liability', account: 'Net position', delta: 1e9 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'expand',
          note: 'The central bank now owes something new. It becomes base money as soon as the government spends it into the banking system.',
        },
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'Not yet. Broad money rises when the government pays someone and the payment lands in a bank account.',
        },
      ],
      explanation:
        'The central bank’s assets did not change, so its equity took the whole $1B loss. The government’s net position rose by exactly the same amount. Side by side, this is really a gift of $1B of net worth from the central bank to the government, paid in new money. It proves the earlier rule: an asset normally appears because the bank received something. Take that away and the liability still appears; it is just paid for out of net worth. This is monetary financing. EU law (Article 123 of the Treaty on the Functioning of the EU) bans the ECB from doing it. The maths works fine. The problem is that it funds a government in a way that never shows up as a tax or as a debt.',
    },

    // -----------------------------------------------------------------------
    {
      id: 'mc-which-one-is-financing',
      type: 'multiple_choice',
      tags: ['monetary-financing', 'open-market-operations', 'central-banking'],
      xp: 20,
      prompt: 'A central bank makes four purchases. Which one is monetary financing?',
      explanation:
        'The first one. The test is not where the bond was bought or from whom. It is whether the central bank now holds more bonds in order to pay for borrowing that would otherwise need a private buyer. Only the first does that. The rollover looks forbidden but is not: the bank holds the same amount before and after, and the government raised no extra money. The old-bond purchase is normal QE: the bond already belonged to someone else. The repo is a loan, returned the next morning. The rules differ a little: the Fed swaps maturing bonds for new ones at government auctions, while the ECB may not buy at auctions at all, so it buys from other investors instead.',
      options: [
        {
          id: 'new-issue',
          label: 'It buys a new bond at the government’s auction, and its holdings rise by that amount',
        },
        {
          id: 'rollover',
          label: 'A bond it holds matures, and it buys a new one so its holdings stay the same',
          feedback:
            'This one looks forbidden but is not. Nothing new was funded: it held $100B before and $100B after, and the amount of money is where it started.',
        },
        {
          id: 'secondary',
          label: 'It buys a five-year-old bond from a pension fund',
          feedback:
            'That is a normal open market purchase: QE. The government got its money years ago, from the pension fund. The central bank only replaced the owner. It did not fund anything.',
        },
        {
          id: 'repo',
          label: 'It lends to a bank overnight, holding a government bond as security',
          feedback:
            'That is a loan with a bond as security, undone the next morning. The bond never became the central bank’s, and the government was not part of it.',
        },
      ],
      correctOptionId: 'new-issue',
    },
  ],
});
