import { defineLesson } from '../../schema';

/** Video 15. The same mechanism again, with the point that a rate cut is really a lending-capacity increase. */
export const kabRateToLendingLesson = defineLesson({
  id: 'kab-rate-to-lending',
  title: 'What a Rate Cut Really Means',
  subtitle:
    'The central bank says “5%”. What it also means is that each new dollar of reserves can support about ten dollars of deposits.',
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
        'The central bank cuts its rate from 6% to 5%, and buys bonds to make that happen. The reserve requirement is 10%. How much money can each new dollar of reserves support in the banks?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'ten', label: 'Up to about ten dollars of deposits' },
        {
          id: 'one',
          label: 'One dollar, because reserves and deposits move together',
          feedback:
            'That would be true only if banks kept 100% reserves. With a 10% requirement, one dollar of reserves supports ten dollars of deposits.',
        },
        {
          id: 'tenth',
          label: 'Ten cents',
          feedback:
            'That uses the right number the wrong way round. Divide by 0.1 instead of multiplying by it.',
        },
        {
          id: 'none',
          label: 'Nothing, because a rate announcement is only words',
          feedback:
            'The announcement is backed by real purchases of real bonds. People believe it because the purchases follow.',
        },
      ],
      correctOptionId: 'ten',
      explanation:
        'The rate is the part everyone sees. The hidden part is that the bond purchases add base money, and banks can lend several times that amount. The central bank talks about rates because it can see them every minute. But what it is really changing is how much the banks can lend.',
    },
    {
      id: 'mc-seller-deposits',
      type: 'multiple_choice',
      tags: ['open-market-operations', 'reserve-ratio'],
      xp: 25,
      prompt:
        'The Fed pays someone for a bond, and they put the money in a bank. The bank’s reserves and its deposits both go up by the same amount. Why does its reserve ratio (reserves ÷ deposits) go up?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'hundred-percent',
          label: 'The new deposit arrives with 100% reserves behind it',
        },
        {
          id: 'liabilities-fall',
          label: 'Because what it owes goes down when the bond leaves',
          feedback:
            'What it owes goes up, because the seller now has a deposit. The ratio still improves, because the same amount of reserves came with it.',
        },
        {
          id: 'loans-fall',
          label: 'Because its loans go down when new reserves arrive',
          feedback:
            'Nothing happens to the loans. Only reserves and a matching deposit are added.',
        },
        {
          id: 'no-change',
          label: 'It does not, because both sides grow by the same amount',
          feedback:
            'The same amount is not the same percentage. A bank with 200 of reserves and 2,000 of deposits has 10%. If it gains 100 of each, it has 300 and 2,100: about 14%.',
        },
      ],
      correctOptionId: 'hundred-percent',
      explanation:
        'The new deposit came with 100% reserves, so the bank now has more reserves for each dollar of deposits. It can lend against those extra reserves. And a bank that was short of reserves no longer needs to borrow. That is how the rate between banks falls.',
    },
    {
      id: 'mc-overshoot',
      type: 'multiple_choice',
      tags: ['open-market-operations', 'fed-funds'],
      xp: 30,
      prompt:
        'The Fed’s target is 5%. But its bond buying has pushed the one-night rate between banks down to 4.5%. What does it do now?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'sell',
          label: 'Sell Treasury bonds, which takes reserves back out and lets the rate rise',
        },
        {
          id: 'announce',
          label: 'Announce a new target of 4.5%, since that is where the market rate is now',
          feedback:
            'The target is the Fed’s decision. The market rate is what it pushes towards that target. Moving the target to match the market would mean having no target at all.',
        },
        {
          id: 'wait',
          label: 'Nothing, because the rate will come back to 5% on its own',
          feedback:
            'Nothing pulls it back. The extra reserves stay until someone takes them out. That is why the Fed’s traders work every day.',
        },
        {
          id: 'requirement',
          label: 'Raise the reserve requirement to use up the extra reserves',
          feedback:
            'That would work, but video 13 says central banks avoid this tool. It forces every bank to shrink at once. Selling a few billion dollars of bonds does the same job and is easy to undo.',
        },
      ],
      correctOptionId: 'sell',
      explanation:
        'Buying and selling bonds works in both directions. Selling is the same thing backwards. The Fed sells a bond, the buyer pays with reserves, and those reserves leave the banks. One-night money becomes scarcer, so it costs more. The Fed does this all the time, so the market rate stays close to the target.',
    },
    {
      id: 'mc-price-and-yield',
      type: 'multiple_choice',
      tags: ['treasuries', 'interest-rates', 'open-market-operations'],
      xp: 35,
      prompt:
        'Sal says his uncle would not sell his bond at the old price, so the buyer has to offer more. While the Fed buys, what happens to the price of Treasury bonds and to their yield (the return a buyer earns)?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'priceup',
          label: 'Prices go up, so yields go down, because the two always move in opposite directions',
        },
        {
          id: 'both',
          label: 'Both go up, because the Fed is paying more for the bonds',
          feedback:
            'A bond pays a fixed amount at the end. If you pay more today for the same fixed amount, your return is smaller. Price and yield cannot both go up.',
        },
        {
          id: 'neither',
          label: 'Neither changes, because the Fed pays the market price',
          feedback:
            'It pays the market price, but its buying is what moves that price. The uncle only sells because the price went up.',
        },
        {
          id: 'yieldup',
          label: 'Prices go down and yields go up, because there are more bonds around',
          feedback:
            'No new bonds were made. The Fed is buying bonds that already exist, so there are fewer of them on the market, not more.',
        },
      ],
      correctOptionId: 'priceup',
      explanation:
        'Buying bonds does two things at once. It adds reserves, which lowers the one-night rate. And it pushes bond prices up, which lowers long-term rates. The second effect is the main idea behind quantitative easing. When the one-night rate is already zero and cannot fall, buying bonds can still lower long-term rates.',
    },
    {
      id: 'mc-why-treasuries',
      type: 'multiple_choice',
      tags: ['central-banking', 'collateral'],
      xp: 30,
      prompt:
        'The Fed could add reserves by buying anything at all. Sal says it buys Treasury bonds because it does not want to go bust. What is the worry?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'losses',
          label: 'Riskier things can lose value, and big losses would wipe out its own capital',
        },
        {
          id: 'illegal',
          label: 'The law does not allow it to buy anything else',
          feedback:
            'After 2008 the Fed bought hundreds of billions of dollars of bonds backed by home loans. Other central banks have bought company bonds and shares. The limit is about being careful, not a strict ban.',
        },
        {
          id: 'liquidity',
          label: 'It could not create enough reserves to buy bigger things',
          feedback:
            'It can create reserves without limit. That is the one thing it never runs out of. The question is what it ends up owning.',
        },
        {
          id: 'inflation',
          label: 'Buying private assets would push prices up more than buying Treasury bonds',
          feedback:
            'The same amount of reserves is created either way. The difference is the risk of not being paid back, which the central bank now carries itself.',
        },
      ],
      correctOptionId: 'losses',
      explanation:
        'A central bank cannot run out of cash, but it can lose money. Choosing which companies to support with new money is also a political problem. Treasury bonds let it avoid choosing between companies, and they are very unlikely not to be paid. But in 2008 and again in 2020, central banks bought riskier things anyway. In a big enough crisis, they act first and argue later.',
    },
    {
      id: 'taccount-open-market-purchase',
      type: 't_account_flow',
      tags: ['open-market-operations', 'balance-sheets', 'reserves'],
      xp: 35,
      prompt: 'The Fed buys $100 of Treasury bonds from Sal’s uncle, who puts the money in his bank. Post every change.',
      instructions: 'Place every entry this purchase needs',
      scenario:
        'Follow the whole chain. The Fed creates the money it pays with. The uncle gives up a bond and gets a bank deposit. His bank gets new reserves and a new deposit. Post the changes on all three balance sheets.',
      entities: [
        {
          id: 'fed',
          label: 'Federal Reserve',
          tier: 'central_bank',
          role: 'Creates the money it pays with',
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
          role: 'Owned the bond and wanted a better price',
          openingLines: [
            { account: 'Treasuries', side: 'asset', amount: 100 },
            { account: 'Net worth', side: 'liability', amount: 100, equity: true },
          ],
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
            'Not yet. New reserves let the bank lend more later, but they are not a loan. Post only what this purchase does today.',
        },
        {
          id: 'fed-notes-asset',
          shift: { entityId: 'fed', side: 'asset', account: 'Reserves', delta: 100 },
          feedback:
            'Reserves are what the Fed owes the banks. Creating them adds to what it owes, and that is how it pays for the bond.',
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
          note: 'Reserves went up by 100 and nothing else went down. The Fed bought a bond with money that did not exist a moment before.',
        },
        {
          aggregate: 'M1',
          direction: 'expand',
          note: 'The uncle now has a deposit he can spend instead of a bond. So the public has 100 more money, even before any new loans.',
        },
      ],
      explanation:
        'Look at the uncle: he swapped a bond for a deposit, so he is no richer. The bank’s reserve ratio goes from 10% (200 / 2,000) to about 14% (300 / 2,100), because the new deposit came with 100% reserves. Now the second press can start. At 10%, the bank could make about 900 of new loans and deposits.',
    },
  ],
  keyTakeaways: [
    'To cut the rate, the central bank adds reserves, so banks can lend more.',
    'A new deposit that comes with its own reserves raises a bank’s reserve ratio.',
    'Central banks target rates because they can see them every minute. The real effect is on lending.',
  ],
});
