import { defineLesson } from '../../schema';

/** Video 15. The same mechanism again, with the point that a rate cut is really a lending-capacity increase. */
export const kabRateToLendingLesson = defineLesson({
  id: 'kab-rate-to-lending',
  title: 'What a Rate Cut Really Announces',
  subtitle:
    'They say five per cent. What they mean is that every new reserve lets a bank write ten times as much in loans.',
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
        'The central bank announces a cut from 6% to 5%. With a 10% reserve ratio, what does each dollar of new reserves enable?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'ten', label: 'About ten dollars of new lending' },
        {
          id: 'one',
          label: 'One dollar — reserves and loans move together',
          feedback:
            'That would be full reserve banking. Under a 10% requirement a dollar of reserves supports ten dollars of deposits.',
        },
        {
          id: 'tenth',
          label: 'Ten cents',
          feedback:
            'The ratio is the right number applied the wrong way round. Divide by 0.1 rather than multiplying by it.',
        },
        {
          id: 'none',
          label: 'Nothing — rate announcements are signals, not operations',
          feedback:
            'They are backed by real purchases of real bonds. The announcement is only credible because the operations follow.',
        },
      ],
      correctOptionId: 'ten',
      explanation:
        'The rate is the visible half. The invisible half is that the operations achieving it inject base money, and every unit of that multiplies through the banking system. The central bank speaks in rates because that is what it can observe minute by minute — but what it is doing is changing how much credit the system can create.',
    },
    {
      id: 'mc-seller-deposits',
      type: 'multiple_choice',
      tags: ['open-market-operations', 'reserve-ratio'],
      xp: 25,
      prompt:
        'When the bond seller deposits their proceeds, both the bank’s assets and liabilities rise by the same amount. Why does its reserve ratio improve?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'hundred-percent',
          label:
            'The new deposit arrives fully backed by reserves — 100% on the increment',
        },
        {
          id: 'liabilities-fall',
          label: 'Because its liabilities fall as the bond leaves the system',
          feedback:
            'They rise — the seller now has a checking account. The ratio improves despite that, because the reserves arrived alongside it one for one.',
        },
        {
          id: 'loans-fall',
          label: 'Because its loan book shrinks when reserves are injected',
          feedback:
            'Nothing happens to the loan book. Only cash and a matching deposit are added.',
        },
        {
          id: 'no-change',
          label: 'It does not — the ratio is unchanged when both sides grow equally',
          feedback:
            'Equal growth in *currency* terms is not equal in ratio terms. Adding 100 of reserves and 100 of deposits to a bank holding 10% reserves raises the average sharply.',
        },
      ],
      correctOptionId: 'hundred-percent',
      explanation:
        'A bank at 10% that receives a deposit backed entirely by reserves ends up holding more reserves per unit of deposit than before. That surplus is what it then lends against — and it is also why the bank that was short of reserves no longer needs to borrow, which is how the interbank rate falls.',
    },
    {
      id: 'mc-overshoot',
      type: 'multiple_choice',
      tags: ['open-market-operations', 'fed-funds'],
      xp: 30,
      prompt:
        'The Fed wanted 5% and its purchases have pushed the overnight rate down to 4.5%. What does it do now?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'sell',
          label: 'Sell treasuries, which drains reserves back out and lets the rate rise',
        },
        {
          id: 'announce',
          label: 'Announce a new target of 4.5%, since that is where the market has settled',
          feedback:
            'The target is the decision; the market rate is the thing being steered towards it. Moving the target to meet the market would be giving up on having one.',
        },
        {
          id: 'wait',
          label: 'Nothing — rates drift, and it will come back on its own',
          feedback:
            'Nothing pulls it back. The extra reserves stay in the system until somebody removes them, and the desk operates daily precisely because drift does not self-correct.',
        },
        {
          id: 'requirement',
          label: 'Raise the reserve requirement to soak up the surplus',
          feedback:
            'That would work and it is the tool video 13 explains they avoid — it forces every bank to shrink at once. Selling a few billion of treasuries does the same job reversibly.',
        },
      ],
      correctOptionId: 'sell',
      explanation:
        'Open market operations run in both directions, and the reverse is the same mechanism read backwards: the Fed sells a treasury, the buyer pays with reserves, those reserves leave the banking system, and overnight money gets scarcer and therefore dearer. The desk does this continuously rather than once a quarter, which is why the effective rate tracks the target within a basis point or two.',
    },
    {
      id: 'mc-price-and-yield',
      type: 'multiple_choice',
      tags: ['treasuries', 'interest-rates', 'open-market-operations'],
      xp: 35,
      prompt:
        'Sal says his uncle would not sell at the old price, so the buyer has to offer more. What is happening to treasury prices and yields while the Fed buys?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'priceup',
          label: 'Prices rise, so yields fall — the two always move opposite ways',
        },
        {
          id: 'both',
          label: 'Both rise, since the Fed is paying more for them',
          feedback:
            'A bond pays a fixed sum at maturity. Pay more today for that same fixed sum and your return must be smaller — price and yield cannot rise together.',
        },
        {
          id: 'neither',
          label: 'Neither moves. The Fed pays the market price',
          feedback:
            'It pays the market price, and its buying is what moves that price. The uncle only parts with the bond because the bid went up.',
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
        'The same operation is doing two things at once, and most commentary only notices one of them. It adds reserves, which lowers the overnight rate; and it bids up bond prices, which lowers longer-term yields directly. That second channel is the whole of quantitative easing — when the overnight rate is already at zero and cannot fall, buying bonds still works on the rest of the curve.',
    },
    {
      id: 'mc-why-treasuries',
      type: 'multiple_choice',
      tags: ['central-banking', 'collateral'],
      xp: 30,
      prompt:
        'The Fed could inject reserves by buying anything at all. Sal says it buys treasuries because it does not want to become an insolvent bank. What is the worry?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'losses',
          label: 'Anything it buys can fall in value, and losses would eat the equity behind the currency',
        },
        {
          id: 'illegal',
          label: 'It is legally forbidden from buying anything else',
          feedback:
            'The Fed bought mortgage-backed securities in the hundreds of billions after 2008, and other central banks have bought corporate bonds and equities. The constraint is prudential, not absolute.',
        },
        {
          id: 'liquidity',
          label: 'It could not create enough reserves to buy anything larger',
          feedback:
            'It can create reserves without limit — that is the one thing it never runs short of. The question is what it ends up owning afterwards.',
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
        'A central bank cannot be made illiquid but it can be made to look foolish, and picking winners with money it printed is a political problem as much as a financial one. Treasuries are the asset it can hold without choosing between companies and without much chance of a write-down. Note how the logic bent in 2008 and again in 2020 — once the crisis is large enough, central banks buy the risky thing anyway and argue about the precedent later.',
    },
    {
      id: 'taccount-open-market-purchase',
      type: 't_account_flow',
      tags: ['open-market-operations', 'balance-sheets', 'reserves'],
      xp: 35,
      prompt: 'The Fed buys $100 of treasuries from Sal’s uncle, who banks the proceeds.',
      instructions: 'Place every posting this operation requires',
      scenario:
        'Follow the whole chain in one go. The Fed creates the money to pay with, the uncle gives up a bond and gains a deposit, and his bank finds itself holding new reserves against a new deposit. Post all three sheets.',
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
            'Not yet. New reserves let the bank lend more later; they are not themselves a loan. Post what the operation does today.',
        },
        {
          id: 'fed-notes-asset',
          shift: { entityId: 'fed', side: 'asset', account: 'Reserves', delta: 100 },
          feedback:
            'Reserves are what the Fed owes the banking system. Creating them expands its liabilities, which is how it pays for the asset it is buying.',
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
        'Notice the uncle’s sheet: same total, different composition — he swapped a bond for a deposit and is no richer. The bank’s reserve ratio improves because reserves and deposits both rose by 100, which is a much better ratio than the 10% it was running. That improvement is the thing that lets the second press start: the bank can now lend roughly 900 on top, and only then does the multiplier get to work.',
    },
  ],
  keyTakeaways: [
    'A rate cut is delivered by injecting reserves, which expands lending capacity.',
    'A deposit arriving with its own reserves improves a bank’s ratio.',
    'Rates are targeted because they are observable in real time; credit is the real effect.',
  ],
});
