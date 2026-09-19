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
        'Why does the video call treasuries risk free, given governments are hardly models of restraint?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'own-currency',
          label:
            'The debt is denominated in the currency of the economy the government can tax',
        },
        {
          id: 'honest',
          label: 'Because governments always repay their debts',
          feedback:
            'Plenty have not. The claim is narrower and more mechanical: default is not forced on a government borrowing in a currency it can raise by taxation.',
        },
        {
          id: 'gold-backed',
          label: 'Because they are backed by the gold in the reserve bank',
          feedback:
            'The video makes the opposite point — obligations of the government rest on its power to tax, which is a claim on a real economy rather than on metal.',
        },
        {
          id: 'insured',
          label: 'Because the central bank guarantees them',
          feedback:
            'The direction of the guarantee runs the other way: Federal Reserve notes are obligations of the government, not the reverse.',
        },
      ],
      correctOptionId: 'own-currency',
      explanation:
        '"Risk free" here means free of *credit* risk, not free of every risk — inflation can still erode what you are repaid. The distinction matters for the euro area, where member states borrow in a currency none of them individually controls.',
    },
    {
      id: 'match-maturities',
      type: 'concept_match',
      tags: ['treasuries', 'maturity'],
      xp: 20,
      prompt: 'Match each government IOU to its maturity.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        { id: 'bill', term: 'Treasury bill', definition: 'A year or less' },
        { id: 'note', term: 'Treasury note', definition: 'Out to about ten years' },
        { id: 'bond', term: 'Treasury bond', definition: 'Longer than ten years' },
        {
          id: 'why',
          term: 'Open market operations',
          definition:
            'Buying and selling these is how the central bank injects or drains reserves',
        },
      ],
      explanation:
        'Bills, notes and bonds differ only in how long the government has your money. The last pair is the reason they appear in this playlist at all: open market operations need something safe and liquid to trade, and government debt is the deepest such market there is.',
    },
    {
      id: 'mc-issued-vs-obligation',
      type: 'multiple_choice',
      tags: ['central-banking', 'sovereign-debt'],
      xp: 30,
      prompt:
        'Sal says one distinction confused him "to no end": the notes are issued by the reserve bank but are an obligation of the government. What does that actually buy the holder?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'backstop',
          label: 'If the reserve bank itself failed, the government would still have to make the notes good',
        },
        {
          id: 'same',
          label: 'Nothing — the reserve bank and the government are the same institution',
          feedback:
            'They are deliberately not. The reserve bank is chartered separately, with its own balance sheet that can in principle be exhausted. The guarantee exists precisely because the two are distinct.',
        },
        {
          id: 'gold',
          label: 'A guarantee that the notes stay convertible into gold forever',
          feedback:
            'The guarantee is of the note’s value, at whatever terms the law sets — and those terms were changed in 1933 and again in 1971 without breaking the promise.',
        },
        {
          id: 'interest',
          label: 'A claim on interest, since government obligations pay a coupon',
          feedback:
            'Notes pay nothing, which is exactly why they are such cheap funding for the issuer. The obligation is about being made whole, not about being paid to wait.',
        },
      ],
      correctOptionId: 'backstop',
      explanation:
        'The reserve bank can issue; only the state can tax. Putting a taxing authority behind a note that a bank prints is what lets people treat it as good without ever checking the bank’s books — and it is the sentence that turns a private clearing arrangement into national money. Every modern currency rests on this pairing, which is also why a central bank running negative equity is an accounting curiosity rather than a crisis.',
    },
    {
      id: 'mc-risk-free-of-what',
      type: 'multiple_choice',
      tags: ['treasuries', 'interest-rates', 'inflation'],
      xp: 35,
      prompt:
        'The video calls treasuries risk free because the government can always tax to repay. Free of which risk, exactly — and what is a holder still exposed to?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'default',
          label: 'Free of default risk only. Inflation and rate moves can still take real money off you',
        },
        {
          id: 'allrisk',
          label: 'Free of risk altogether, which is what the name says',
          feedback:
            'Anyone holding a thirty year bond through the 1970s was repaid every cent and still lost most of the purchasing power. Being certain of the number is not being certain of the value.',
        },
        {
          id: 'inflation',
          label: 'Free of inflation risk, since the government controls the currency',
          feedback:
            'It is the other way round. Controlling the currency is what makes nominal repayment certain and real repayment uncertain — the same printing press that guarantees you get paid can devalue what you are paid in.',
        },
        {
          id: 'shortonly',
          label: 'Free of all risk if held to maturity, whatever the maturity',
          feedback:
            'Holding to maturity removes price risk, since you get the face value. It does nothing about what that face value will buy.',
        },
      ],
      correctOptionId: 'default',
      explanation:
        'This is the most important footnote in the module. "Risk free" is a term of art meaning free of credit risk, and a government borrowing in a currency it issues genuinely is — it can always produce the currency. What it cannot promise is what the currency will be worth, or what your bond will fetch if rates rise before you sell. Banks that treated long treasuries as risk free in the fullest sense are how Silicon Valley Bank failed in 2023, holding paper that never missed a payment.',
    },
    {
      id: 'taccount-gold-to-reserves',
      type: 't_account_flow',
      tags: ['central-banking', 'reserves', 'balance-sheets'],
      xp: 35,
      prompt:
        'A national bank moves its 100 gold pieces into the new reserve bank and takes reserve notes instead.',
      instructions: 'Place every posting this operation requires',
      scenario:
        'This is the moment the pooling happens. The commercial bank gives up custody of the metal and receives a claim on the institution now holding it. Post what each side records.',
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
            'No customer gained a balance. The bank swapped one of its own assets for another; nothing on its liability side hears about it.',
        },
        {
          id: 'rb-notes-asset',
          shift: { entityId: 'reservebank', side: 'asset', account: 'Notes outstanding', delta: 100 },
          feedback:
            'The reserve bank owes gold to whoever holds its notes. A promise you have made sits on the right-hand side, whoever is holding it.',
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
        'Look at what just happened to the commercial bank: its reserves are no longer something it owns but something it is owed. From here on, a bank’s reserves are a liability of the central bank — which is why the central bank can create them at will, and why "printing money" is a balance sheet operation rather than a physical one. Every remaining video in the module depends on this swap having happened.',
    },
  ],
  keyTakeaways: [
    'Treasuries are risk free in the credit sense because the issuer can tax in that currency.',
    'Bills, notes and bonds are the same instrument at different maturities.',
    'They are what the central bank buys and sells to change the money supply.',
  ],
});
