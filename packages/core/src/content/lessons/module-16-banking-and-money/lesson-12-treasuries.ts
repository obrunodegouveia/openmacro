import { defineLesson } from '../../schema';

/** Video 12. Government debt introduced as the instrument open market operations will act on. */
export const kabTreasuriesLesson = defineLesson({
  id: 'kab-treasuries',
  title: 'Why Government Debt Is Called Risk Free',
  subtitle:
    'A Treasury is a promise to pay in a currency that the government can collect in taxes. That is what “risk free” means here.',
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
        'Governments do not always spend carefully. So why does the video call US Treasuries (US government debt) risk free?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'own-currency',
          label:
            'It borrows in its own currency, which it can always collect in taxes',
        },
        {
          id: 'honest',
          label: 'Because governments always repay their debts',
          feedback:
            'Many have not. The idea is narrower: a government that borrows in a currency it can collect in taxes never has to stop paying.',
        },
        {
          id: 'gold-backed',
          label: 'Because they are backed by the gold in the reserve bank',
          feedback:
            'The video says the opposite. Government debt depends on the power to collect taxes from a real economy, not on gold.',
        },
        {
          id: 'insured',
          label: 'Because the central bank promises to pay if the government cannot',
          feedback:
            'It is the other way round. In the video, the government stands behind the Federal Reserve’s notes. The central bank does not stand behind government debt.',
        },
      ],
      correctOptionId: 'own-currency',
      explanation:
        'Here “risk free” means there is no risk that the government will fail to pay. It does not mean there is no risk at all. Inflation can still make your money worth less. This matters in the euro area, where each country borrows in a currency it does not control on its own.',
    },
    {
      id: 'match-maturities',
      type: 'concept_match',
      tags: ['treasuries', 'maturity'],
      xp: 20,
      prompt: 'Match each type of US government debt to how long it lasts. Then match the last term to what it means.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        { id: 'bill', term: 'Treasury bill', definition: 'A year or less' },
        { id: 'note', term: 'Treasury note', definition: 'More than a year, up to ten years' },
        { id: 'bond', term: 'Treasury bond', definition: 'Longer than ten years' },
        {
          id: 'why',
          term: 'Open market operations',
          definition:
            'The central bank buys and sells these to add reserves to banks or take them away',
        },
      ],
      explanation:
        'Bills, notes and bonds differ mainly in how long the government keeps your money. The last pair explains why they are in these videos. The central bank needs something safe and easy to buy and sell, and government debt is the biggest market of that kind.',
    },
    {
      id: 'mc-issued-vs-obligation',
      type: 'multiple_choice',
      tags: ['central-banking', 'sovereign-debt'],
      xp: 30,
      prompt:
        'Sal says one idea confused him a lot: the notes are printed by the reserve bank, but the government is responsible for them. What does that mean for someone holding a note?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'backstop',
          label: 'If the reserve bank failed, the government would still have to make the notes good',
        },
        {
          id: 'same',
          label: 'Nothing, because the reserve bank and the government are the same thing',
          feedback:
            'They are kept separate on purpose. The reserve bank has its own balance sheet, which could in theory run out. The government’s promise matters because the two are different.',
        },
        {
          id: 'gold',
          label: 'A promise that you can always swap the notes for gold',
          feedback:
            'There is no such promise. The law decides what a note can be swapped for, and the US changed that in 1933 and again in 1971.',
        },
        {
          id: 'interest',
          label: 'A right to interest, because government debt pays interest',
          feedback:
            'Notes pay no interest. That is why they are such a cheap way for the issuer to borrow. The promise is that the note keeps its value, not that you are paid to wait.',
        },
      ],
      correctOptionId: 'backstop',
      explanation:
        'The reserve bank can print notes, but only the government can collect taxes. Because the power to tax stands behind the notes, people trust them without checking the bank’s books. That turns money between banks into the country’s money. Today’s currencies work this way.',
    },
    {
      id: 'mc-risk-free-of-what',
      type: 'multiple_choice',
      tags: ['treasuries', 'interest-rates', 'inflation'],
      xp: 35,
      prompt:
        'The video calls Treasuries risk free because the government can always collect taxes to pay back. Which risk do they not have? And which risks does the owner still face?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'default',
          label: 'Only the risk of not being paid; inflation and rate changes can still hurt',
        },
        {
          id: 'allrisk',
          label: 'All risk of any kind, just as the name “risk free” says',
          feedback:
            'People who held 30-year bonds through the 1970s got back every cent. But inflation meant that money bought much less. Knowing the amount is not the same as knowing what it will buy.',
        },
        {
          id: 'inflation',
          label: 'Inflation risk, because the government controls the currency',
          feedback:
            'It is the other way round. Controlling the currency makes sure you get the amount back. But the same power to create money can make that amount worth less.',
        },
        {
          id: 'shortonly',
          label: 'All risk, if you keep it until the end, however long that is',
          feedback:
            'Keeping it to the end means you never have to sell at a low price, because you get the full amount. But it does not change what that amount will buy.',
        },
      ],
      correctOptionId: 'default',
      explanation:
        '“Risk free” only means no default risk (the risk of not being paid). A government that borrows in its own currency can always produce that currency. But it cannot promise what the money will buy, or what your bond will sell for if interest rates go up. In 2023 Silicon Valley Bank failed partly because of this. Its bonds always paid, but they lost value when rates rose, and depositors ran.',
    },
    {
      id: 'taccount-gold-to-reserves',
      type: 't_account_flow',
      tags: ['central-banking', 'reserves', 'balance-sheets'],
      xp: 35,
      prompt:
        'A national bank moves its 100 gold pieces to the new reserve bank. In exchange it gets 100 in reserve bank notes.',
      instructions: 'Place every entry this exchange needs',
      scenario:
        'This is when the gold is put in one vault. The national bank hands over its gold. In return it gets a claim on the bank that now holds the gold. Show what each side writes down.',
      entities: [
        {
          id: 'reservebank',
          label: 'Reserve bank',
          tier: 'central_bank',
          role: 'The only bank allowed to print notes',
        },
        {
          id: 'national',
          label: 'National bank',
          tier: 'commercial_bank',
          openingLines: [
            { account: 'Gold', side: 'asset', amount: 100 },
            { account: 'Loans', side: 'asset', amount: 150 },
            { account: 'Demand deposits', side: 'liability', amount: 200 },
            { account: 'Equity', side: 'liability', amount: 50, equity: true },
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
            'No customer got a new balance. The bank swapped one thing it owns for another. What it owes does not change.',
        },
        {
          id: 'rb-notes-asset',
          shift: { entityId: 'reservebank', side: 'asset', account: 'Notes outstanding', delta: 100 },
          feedback:
            'The reserve bank owes gold to whoever holds its notes. A promise you made is a liability, whoever holds it.',
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
          note: 'Still the same 100 of base money, now as notes instead of gold. Nothing new was created. Only the place where the gold is kept changed.',
        },
        {
          aggregate: 'M1',
          direction: 'unchanged',
          note: 'No customer’s deposit changed. People can spend exactly what they could before.',
        },
      ],
      explanation:
        'Look at the national bank. Its reserves are no longer gold it holds. They are now a claim on the reserve bank. From now on, a bank’s reserves are something the central bank owes. That is why a central bank can create reserves just by writing them down. “Printing money” is really a balance sheet entry. The rest of the module depends on this swap.',
    },
  ],
  keyTakeaways: [
    'Treasuries are risk free in one sense: the government will always pay, because it can collect that currency in taxes.',
    'Bills, notes and bonds are the same kind of loan to the government. They only last for different lengths of time.',
    'The central bank buys and sells them to change the amount of money.',
  ],
});
