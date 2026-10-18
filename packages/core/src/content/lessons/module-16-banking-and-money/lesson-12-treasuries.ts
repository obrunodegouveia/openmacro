import { defineLesson } from '../../schema';

/** Video 12. Government debt introduced as the instrument open market operations will act on. */
export const kabTreasuriesLesson = defineLesson({
  id: 'kab-treasuries',
  title: 'Why Government IOUs Count as Risk Free',
  subtitle:
    'A treasury is a promise to pay in a currency the promiser can levy taxes in. That is what "risk free" means here.',
  icon: '📜',
  difficulty: 'core',
  estimatedMinutes: 15,
  video: {
    url: 'https://www.youtube.com/watch?v=JBWdbzzYbtU',
    minutes: 11,
    source: 'Khan Academy — Banking 12',
  },
  challenges: [
    {
      id: 'mc-risk-free',
      type: 'multiple_choice',
      tags: ['treasuries', 'sovereign-debt'],
      xp: 25,
      prompt:
        'Governments are hardly models of restraint. Why, then, does the video call US Treasuries (US government debt) risk free?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'own-currency',
          label:
            'The government borrows in its own currency, and can always raise that currency through taxes to repay',
        },
        {
          id: 'honest',
          label: 'Because governments always repay their debts',
          feedback:
            'Plenty have not. The claim is narrower: a government that borrows in a currency it can raise through taxes is never forced to default.',
        },
        {
          id: 'gold-backed',
          label: 'Because they are backed by the gold in the reserve bank',
          feedback:
            'The video makes the opposite point — the government’s debts rest on its power to tax, which is a claim on a real economy rather than on metal.',
        },
        {
          id: 'insured',
          label: 'Because the central bank guarantees them',
          feedback:
            'The guarantee runs the other way: in the video, Federal Reserve notes are backed by the government, not government debt by the central bank.',
        },
      ],
      correctOptionId: 'own-currency',
      explanation:
        '"Risk free" here means free of *default* risk, not free of every risk — inflation can still eat into what you are repaid. The distinction matters in the euro area, where each member state borrows in a currency that none of them controls on its own.',
    },
    {
      id: 'match-maturities',
      type: 'concept_match',
      tags: ['treasuries', 'maturity'],
      xp: 20,
      prompt: 'Match each US government security to how long it lasts, and match the last term to its meaning.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        { id: 'bill', term: 'Treasury bill', definition: 'A year or less' },
        { id: 'note', term: 'Treasury note', definition: 'More than a year, up to ten years' },
        { id: 'bond', term: 'Treasury bond', definition: 'Longer than ten years' },
        {
          id: 'why',
          term: 'Open market operations',
          definition:
            'Buying and selling these is how the central bank injects or drains reserves',
        },
      ],
      explanation:
        'Bills, notes and bonds differ mainly in how long the government keeps your money. The last pair is the reason they appear in this playlist at all: open market operations need something safe and easy to trade, and government debt is the largest such market there is.',
    },
    {
      id: 'mc-issued-vs-obligation',
      type: 'multiple_choice',
      tags: ['central-banking', 'sovereign-debt'],
      xp: 30,
      prompt:
        'Sal says one distinction confused him "to no end": the notes are issued by the reserve bank, but they are an obligation of the government. What does that mean for the person holding a note?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'backstop',
          label: 'If the reserve bank itself failed, the government would still have to honour the notes',
        },
        {
          id: 'same',
          label: 'Nothing — the reserve bank and the government are the same institution',
          feedback:
            'They are deliberately separate. The reserve bank is set up separately, with its own balance sheet that could in principle run out. The guarantee exists precisely because the two are distinct.',
        },
        {
          id: 'gold',
          label: 'A guarantee that the notes stay convertible into gold forever',
          feedback:
            'No such promise is made. The law decides what a note can be exchanged for, and the US changed those terms in 1933 and again in 1971.',
        },
        {
          id: 'interest',
          label: 'A claim on interest, since government obligations pay a coupon',
          feedback:
            'Notes pay no interest, which is exactly why they are such cheap funding for the issuer. The obligation is about getting your money’s worth back, not about being paid to wait.',
        },
      ],
      correctOptionId: 'backstop',
      explanation:
        'The reserve bank can issue notes; only the state can tax. Putting the power to tax behind a note that a bank prints is what lets people trust it without ever checking the bank’s books — and it is what turns an arrangement between banks into national money. Modern currencies rest on this pairing, which is also why a central bank with negative equity is usually treated as an accounting problem rather than a crisis.',
    },
    {
      id: 'mc-risk-free-of-what',
      type: 'multiple_choice',
      tags: ['treasuries', 'interest-rates', 'inflation'],
      xp: 35,
      prompt:
        'The video calls Treasuries risk free because the government can always tax to repay. Free of which risk, exactly — and which risks does the holder still face?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'default',
          label: 'Free of default risk only. Inflation and changes in interest rates can still cost you real money',
        },
        {
          id: 'allrisk',
          label: 'Free of risk altogether, which is what the name says',
          feedback:
            'Anyone holding a thirty-year bond through the 1970s was repaid every cent and still lost much of its purchasing power to inflation. Being sure of the amount is not being sure of what it will buy.',
        },
        {
          id: 'inflation',
          label: 'Free of inflation risk, since the government controls the currency',
          feedback:
            'It is the other way round. Controlling the currency makes repayment of the amount certain, but not what that amount will buy — the same printing press that guarantees you get paid can make the currency worth less.',
        },
        {
          id: 'shortonly',
          label: 'Free of all risk if held to maturity, whatever the maturity',
          feedback:
            'Holding to maturity removes the risk of selling at a low price, since you get the full face value. It does nothing about what that face value will buy.',
        },
      ],
      correctOptionId: 'default',
      explanation:
        'This is one of the most important footnotes in the module. "Risk free" is a technical term meaning free of default risk, and a government borrowing in a currency it issues really is — it can always produce the currency. What it cannot promise is what the currency will be worth, or what your bond will sell for if interest rates rise before you sell. Silicon Valley Bank failed in 2023 partly this way: its long-term government-backed bonds never missed a payment, but they lost value when rates rose, and depositors ran.',
    },
    {
      id: 'taccount-gold-to-reserves',
      type: 't_account_flow',
      tags: ['central-banking', 'reserves', 'balance-sheets'],
      xp: 35,
      prompt:
        'A national bank moves its 100 gold pieces into the new reserve bank and takes 100 in reserve bank notes in exchange.',
      instructions: 'Place every posting this operation requires',
      scenario:
        'This is the moment the gold is pooled. The commercial bank hands over the metal and receives a claim on the institution that now holds it. Post what each side records.',
      entities: [
        {
          id: 'reservebank',
          label: 'Reserve bank',
          tier: 'central_bank',
          role: 'The only institution permitted to issue notes',
        },
        {
          id: 'national',
          label: 'National bank',
          tier: 'commercial_bank',
          openingLines: [
            { account: 'Gold', side: 'asset', amount: 100 },
            { account: 'Loans', side: 'asset', amount: 150 },
            { account: 'Demand deposits', side: 'liability', amount: 200 },
          ],
        },
      ],
      options: [
        {
          id: 'rb-gold-up',
          shift: { entityId: 'reservebank', side: 'asset', account: 'Gold', delta: 100 },
        },
        {
          id: 'rb-notes-up',
          shift: { entityId: 'reservebank', side: 'liability', account: 'Notes outstanding', delta: 100 },
        },
        {
          id: 'nat-gold-down',
          shift: { entityId: 'national', side: 'asset', account: 'Gold', delta: -100 },
        },
        {
          id: 'nat-notes-up',
          shift: { entityId: 'national', side: 'asset', account: 'Reserve bank notes', delta: 100 },
        },
        {
          id: 'nat-deposits-up',
          shift: { entityId: 'national', side: 'liability', account: 'Demand deposits', delta: 100 },
          feedback:
            'No customer gained a balance. The bank swapped one of its own assets for another; its liability side does not change.',
        },
        {
          id: 'rb-notes-asset',
          shift: { entityId: 'reservebank', side: 'asset', account: 'Notes outstanding', delta: 100 },
          feedback:
            'The reserve bank owes gold to whoever holds its notes. A promise you have made is a liability, whoever is holding it.',
        },
      ],
      expectedShifts: [
        { entityId: 'reservebank', side: 'asset', account: 'Gold', delta: 100 },
        { entityId: 'reservebank', side: 'liability', account: 'Notes outstanding', delta: 100 },
        { entityId: 'national', side: 'asset', account: 'Gold', delta: -100 },
        { entityId: 'national', side: 'asset', account: 'Reserve bank notes', delta: 100 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'unchanged',
          note: 'The same 100 of base money, now in note form instead of metal. Nothing was created; custody moved.',
        },
        {
          aggregate: 'M1',
          direction: 'unchanged',
          note: 'No customer deposit changed. What the public can spend is exactly what it was.',
        },
      ],
      explanation:
        'Look at what just happened to the commercial bank: its reserves are no longer metal it holds but a claim on someone else. From here on, a bank’s reserves are a liability of the central bank — which is why the central bank can create them at will, and why "printing money" is a balance sheet entry rather than a physical act. Every remaining video in the module depends on this swap having happened.',
    },
  ],
  keyTakeaways: [
    'Treasuries are risk free in the credit sense because the issuer can tax in that currency.',
    'Bills, notes and bonds are the same instrument at different maturities.',
    'They are what the central bank buys and sells to change the money supply.',
  ],
});
