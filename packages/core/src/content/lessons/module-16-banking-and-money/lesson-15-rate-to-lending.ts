import { defineLesson } from '../../schema';

/** Video 15. The same mechanism again, with the point that a rate cut is really a lending-capacity increase. */
export const kabRateToLendingLesson = defineLesson({
  id: 'kab-rate-to-lending',
  title: 'What a Rate Cut Really Announces',
  subtitle:
    'They say five per cent. What they mean is that every new dollar of reserves can support about ten dollars of deposits.',
  icon: '🔁',
  difficulty: 'core',
  estimatedMinutes: 16,
  video: {
    url: 'https://www.youtube.com/watch?v=rgqFXkLAc-4',
    minutes: 12,
    source: 'Khan Academy — Banking 15',
  },
  challenges: [
    {
      id: 'mc-hidden-meaning',
      type: 'multiple_choice',
      tags: ['monetary-policy', 'multiplier'],
      xp: 25,
      prompt:
        'The central bank announces a rate cut from 6% to 5%, and buys bonds to deliver it. With a 10% reserve requirement, how much money can each new dollar of reserves end up supporting in the banking system?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'ten', label: 'Up to about ten dollars of deposits' },
        {
          id: 'one',
          label: 'One dollar — reserves and deposits move together',
          feedback:
            'That would be full reserve banking. Under a 10% requirement a dollar of reserves supports ten dollars of deposits.',
        },
        {
          id: 'tenth',
          label: 'Ten cents',
          feedback:
            'That uses the right number the wrong way round. Divide by 0.1 rather than multiplying by it.',
        },
        {
          id: 'none',
          label: 'Nothing — rate announcements are signals, not operations',
          feedback:
            'They are backed by real purchases of real bonds. The announcement is only believed because the purchases follow.',
        },
      ],
      correctOptionId: 'ten',
      explanation:
        'The rate is the visible half. The invisible half is that the purchases that achieve it add base money, and each unit of that can be multiplied through the banking system. The central bank talks in rates because that is what it can observe minute by minute — but what it is doing is changing how much credit the system can create.',
    },
    {
      id: 'mc-seller-deposits',
      type: 'multiple_choice',
      tags: ['open-market-operations', 'reserve-ratio'],
      xp: 25,
      prompt:
        'The Fed pays a bond seller, who deposits the money in a bank. The bank’s reserves and its deposits both rise by the same amount. Why does its reserve ratio go up?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'hundred-percent',
          label:
            'The new deposit arrives with an equal amount of new reserves — 100% backing on the new money',
        },
        {
          id: 'liabilities-fall',
          label: 'Because its liabilities fall as the bond leaves the system',
          feedback:
            'They rise — the seller now has a deposit. The ratio improves anyway, because an equal amount of reserves arrived with it.',
        },
        {
          id: 'loans-fall',
          label: 'Because its loan book shrinks when reserves are injected',
          feedback:
            'Nothing happens to the loans. Only reserves and a matching deposit are added.',
        },
        {
          id: 'no-change',
          label: 'It does not — the ratio is unchanged when both sides grow equally',
          feedback:
            'Growing by the same *amount* is not growing by the same *percentage*. A bank with 200 of reserves against 2,000 of deposits (10%) that gains 100 of each ends up at 300 against 2,100 — about 14%.',
        },
      ],
      correctOptionId: 'hundred-percent',
      explanation:
        'A bank at 10% that receives a deposit backed entirely by reserves ends up holding more reserves per unit of deposit than before. That surplus is what it can then lend against — and it is also why a bank that was short of reserves no longer needs to borrow, which is how the rate between banks falls.',
    },
    {
      id: 'mc-overshoot',
      type: 'multiple_choice',
      tags: ['open-market-operations', 'fed-funds'],
      xp: 30,
      prompt:
        'The Fed’s target is 5%, but its purchases have pushed the overnight rate down to 4.5%. What does it do now?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'sell',
          label: 'Sell Treasuries, which takes reserves back out and lets the rate rise',
        },
        {
          id: 'announce',
          label: 'Announce a new target of 4.5%, since that is where the market has settled',
          feedback:
            'The target is the decision; the market rate is what is being steered towards it. Moving the target to meet the market would mean giving up on having one.',
        },
        {
          id: 'wait',
          label: 'Nothing — rates drift, and it will come back on its own',
          feedback:
            'Nothing pulls it back. The extra reserves stay in the system until somebody removes them, which is why the Fed’s trading desk operates every day.',
        },
        {
          id: 'requirement',
          label: 'Raise the reserve requirement to soak up the surplus',
          feedback:
            'That would work, but it is the tool video 13 says central banks avoid — it forces every bank to shrink at once. Selling a few billion of Treasuries does the same job and can be reversed.',
        },
      ],
      correctOptionId: 'sell',
      explanation:
        'Open market operations work in both directions, and selling is the same mechanism run backwards: the Fed sells a Treasury, the buyer pays with reserves, those reserves leave the banking system, and overnight money gets scarcer and therefore more expensive. The Fed does this continually, which is why the market rate stays close to the target.',
    },
    {
      id: 'mc-price-and-yield',
      type: 'multiple_choice',
      tags: ['treasuries', 'interest-rates', 'open-market-operations'],
      xp: 35,
      prompt:
        'Sal says his uncle would not sell at the old price, so the buyer has to offer more. While the Fed buys, what happens to the prices of Treasuries and to their yields (the return a buyer earns)?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'priceup',
          label: 'Prices rise, so yields fall — the two always move in opposite directions',
        },
        {
          id: 'both',
          label: 'Both rise, since the Fed is paying more for them',
          feedback:
            'A bond pays a fixed amount at maturity. Pay more today for that same fixed amount and your return must be smaller — price and yield cannot rise together.',
        },
        {
          id: 'neither',
          label: 'Neither moves. The Fed pays the market price',
          feedback:
            'It pays the market price, but its buying is what moves that price. The uncle only sells because the price offered went up.',
        },
        {
          id: 'yieldup',
          label: 'Prices fall and yields rise, because more bonds are in circulation',
          feedback:
            'No new bonds were issued. The Fed is buying existing ones out of the market, which makes them scarcer rather than more plentiful.',
        },
      ],
      correctOptionId: 'priceup',
      explanation:
        'The same operation does two things at once, and most commentary notices only one. It adds reserves, which lowers the overnight rate; and it pushes up bond prices, which lowers longer-term yields directly. That second channel is the main idea behind quantitative easing — when the overnight rate is already at zero and cannot fall, buying bonds can still lower longer-term rates.',
    },
    {
      id: 'mc-why-treasuries',
      type: 'multiple_choice',
      tags: ['central-banking', 'collateral'],
      xp: 30,
      prompt:
        'The Fed could add reserves by buying anything at all. Sal says it buys Treasuries because it does not want to become an insolvent bank. What is the worry?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'losses',
          label: 'Riskier assets can lose value, and big enough losses would wipe out its equity',
        },
        {
          id: 'illegal',
          label: 'It is legally forbidden from buying anything else',
          feedback:
            'The Fed bought hundreds of billions of mortgage-backed securities after 2008, and other central banks have bought company bonds and shares. The limit is about prudence, not an absolute ban.',
        },
        {
          id: 'liquidity',
          label: 'It could not create enough reserves to buy anything larger',
          feedback:
            'It can create reserves without limit — that is the one thing it never runs short of. The question is what it ends up owning.',
        },
        {
          id: 'inflation',
          label: 'Buying private assets would be more inflationary than buying treasuries',
          feedback:
            'The same quantity of reserves is created either way. What differs is the credit risk the central bank has taken onto its own books.',
        },
      ],
      correctOptionId: 'losses',
      explanation:
        'A central bank cannot run out of cash, but it can lose money and look foolish, and choosing which companies to back with money it printed is a political problem as much as a financial one. Treasuries let it hold assets without choosing between companies and with little chance of default. Note how the rule bent in 2008 and again in 2020 — once a crisis is big enough, central banks buy riskier assets anyway and argue about it later.',
    },
    {
      id: 'taccount-open-market-purchase',
      type: 't_account_flow',
      tags: ['open-market-operations', 'balance-sheets', 'reserves'],
      xp: 35,
      prompt: 'The Fed buys $100 of Treasuries from Sal’s uncle, who deposits the money in his bank.',
      instructions: 'Place every posting this operation requires',
      scenario:
        'Follow the whole chain in one go. The Fed creates the money it pays with, the uncle gives up a bond and gains a deposit, and his bank ends up holding new reserves against a new deposit. Post all three balance sheets.',
      entities: [
        {
          id: 'fed',
          label: 'Federal Reserve',
          tier: 'central_bank',
          role: 'Creates the means of payment as it pays',
        },
        {
          id: 'bank',
          label: 'The uncle’s bank',
          tier: 'commercial_bank',
          openingLines: [
            { account: 'Reserves at the Fed', side: 'asset', amount: 200 },
            { account: 'Loans', side: 'asset', amount: 1800 },
            { account: 'Demand deposits', side: 'liability', amount: 2000 },
          ],
        },
        {
          id: 'uncle',
          label: 'Sal’s uncle',
          tier: 'fiduciary_core',
          role: 'Held the bond, wanted a better price',
          openingLines: [{ account: 'Treasuries', side: 'asset', amount: 100 }],
        },
      ],
      options: [
        { id: 'fed-tsy', shift: { entityId: 'fed', side: 'asset', account: 'Treasuries', delta: 100 } },
        { id: 'fed-res', shift: { entityId: 'fed', side: 'liability', account: 'Reserves', delta: 100 } },
        { id: 'unc-tsy', shift: { entityId: 'uncle', side: 'asset', account: 'Treasuries', delta: -100 } },
        { id: 'unc-dep', shift: { entityId: 'uncle', side: 'asset', account: 'Bank deposit', delta: 100 } },
        { id: 'bk-res', shift: { entityId: 'bank', side: 'asset', account: 'Reserves at the Fed', delta: 100 } },
        { id: 'bk-dep', shift: { entityId: 'bank', side: 'liability', account: 'Demand deposits', delta: 100 } },
        {
          id: 'bk-loans',
          shift: { entityId: 'bank', side: 'asset', account: 'Loans', delta: 100 },
          feedback:
            'Not yet. New reserves let the bank lend more later; they are not a loan themselves. Post only what this purchase does today.',
        },
        {
          id: 'fed-notes-asset',
          shift: { entityId: 'fed', side: 'asset', account: 'Reserves', delta: 100 },
          feedback:
            'Reserves are what the Fed owes the banks. Creating them adds to its liabilities, and that is how it pays for the asset it is buying.',
        },
      ],
      expectedShifts: [
        { entityId: 'fed', side: 'asset', account: 'Treasuries', delta: 100 },
        { entityId: 'fed', side: 'liability', account: 'Reserves', delta: 100 },
        { entityId: 'uncle', side: 'asset', account: 'Treasuries', delta: -100 },
        { entityId: 'uncle', side: 'asset', account: 'Bank deposit', delta: 100 },
        { entityId: 'bank', side: 'asset', account: 'Reserves at the Fed', delta: 100 },
        { entityId: 'bank', side: 'liability', account: 'Demand deposits', delta: 100 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'expand',
          note: 'Reserves rose by 100 and nothing else fell. The Fed bought an asset with money that did not exist a moment earlier.',
        },
        {
          aggregate: 'M1',
          direction: 'expand',
          note: 'The uncle holds a spendable deposit where he held an illiquid bond, so the public’s money supply is 100 larger before any lending has happened.',
        },
      ],
      explanation:
        'Notice the uncle’s balance sheet: same total, different mix — he swapped a bond for a deposit and is no richer. The bank’s reserve ratio rises from 10% (200 / 2,000) to about 14% (300 / 2,100), because the new deposit came with 100% reserves. That is what lets the second press start: at 10%, the bank could now create about 900 of new loans and deposits, and only then does the multiplier get to work.',
    },
  ],
  keyTakeaways: [
    'A rate cut is delivered by injecting reserves, which expands lending capacity.',
    'A deposit arriving with its own reserves improves a bank’s ratio.',
    'Rates are targeted because they are observable in real time; credit is the real effect.',
  ],
});
