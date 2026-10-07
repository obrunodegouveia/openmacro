import { defineLesson } from '../../schema';

/**
 * Debt management as monetary policy: a Treasury that buys back long bonds
 * with money borrowed in bills removes the same interest-rate risk from the
 * market that a purchase programme does, without the central bank buying a
 * thing.
 *
 * The lesson is the first one's consolidated balance sheet run from the other
 * side. There the central bank shortened the state's debt and the debt office
 * undid it; here the debt office does the shortening itself, and the question
 * is what that buys and who pays for it.
 *
 * It sits on `yield-curve-control` in the levers module, which teaches what a
 * price commitment is, and on `fiscal-dominance` in the currency module, which
 * teaches what happens once the budget cannot take a rate rise. What is added
 * here is the route between them that nobody announces.
 */
export const yieldControlByAnotherNameLesson = defineLesson({
  id: 'yield-control-by-another-name',
  title: 'Yield Control by Another Name',
  subtitle:
    'A Treasury that buys back long bonds and borrows short instead can push long yields down without a central bank buying anything — and without anyone calling it yield control.',
  icon: '🔁',
  difficulty: 'advanced',
  estimatedMinutes: 18,
  challenges: [
    {
      id: 'mc-what-a-buyback-changes',
      type: 'multiple_choice',
      tags: ['debt-management', 'buybacks'],
      xp: 30,
      prompt:
        'The Treasury buys back $100 billion of 10-year bonds and pays for it by selling $100 billion of new three-month bills. What has changed?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'maturity',
          label: 'Not how much it owes, but for how long it has borrowed',
        },
        {
          id: 'retired',
          label: 'The debt has fallen by $100 billion',
          feedback:
            'A buyback retires debt only when it is paid for out of a surplus, as the United States did between 2000 and 2002. Paid for with new bills, the amount owed ends exactly where it started.',
        },
        {
          id: 'money',
          label: '$100 billion of new money has been created',
          feedback:
            'No reserves were created. The cash came from whoever bought the bills and went to whoever sold the bonds. That is the difference from QE, where the central bank pays with reserves it creates.',
        },
        {
          id: 'nothing',
          label: 'Nothing that matters — debt is debt',
          feedback:
            'The face value is unchanged, but $100 billion that was fixed for ten years now reprices every three months. For the market and for the budget that is a very different position.',
        },
      ],
      correctOptionId: 'maturity',
      explanation:
        'The state owes the same amount; what moved is who carries the interest-rate risk. A 10-year bond loses value when long rates rise, and a three-month bill barely moves, so the swap takes that risk off private balance sheets. It lands on the budget instead, which now refinances that $100 billion four times a year at whatever the short rate happens to be.',
    },
    {
      id: 'tacc-post-the-buyback',
      type: 't_account_flow',
      tags: ['debt-management', 'buybacks', 'balance-sheets'],
      xp: 50,
      prompt: 'Post the buyback.',
      instructions: 'Place the entries that settle it. Six belong; four do not.',
      scenario:
        'The Treasury sells $100 billion of bills to a money market fund and uses the cash, the same day, to buy back $100 billion of 10-year bonds from a pension fund. Show where each balance sheet ends up.',
      currency: 'USD',
      entities: [
        {
          id: 'treasury',
          label: 'Treasury',
          tier: 'fiduciary_core',
          role: 'Changing the shape of its debt',
          openingLines: [
            { account: 'Cash at the central bank', side: 'asset', amount: 800e9 },
            { account: '10-year bonds', side: 'liability', amount: 9000e9 },
            { account: 'Bills', side: 'liability', amount: 6000e9 },
          ],
        },
        {
          id: 'pension',
          label: 'Pension Fund',
          tier: 'shadow_bank',
          role: 'Long-horizon investor, selling bonds',
          openingLines: [
            { account: '10-year bonds', side: 'asset', amount: 400e9 },
            { account: 'Cash', side: 'asset', amount: 20e9 },
            { account: 'Pensions owed', side: 'liability', amount: 420e9 },
          ],
        },
        {
          id: 'mmf',
          label: 'Money Market Fund',
          tier: 'shadow_bank',
          role: 'Buying the new bills',
          openingLines: [
            { account: 'Cash', side: 'asset', amount: 150e9 },
            { account: 'Bills', side: 'asset', amount: 850e9 },
            { account: 'Shares owed to savers', side: 'liability', amount: 1000e9 },
          ],
        },
      ],
      options: [
        {
          id: 'tsy-bonds-down',
          shift: { entityId: 'treasury', side: 'liability', account: '10-year bonds', delta: -100e9 },
        },
        {
          id: 'tsy-bills-up',
          shift: { entityId: 'treasury', side: 'liability', account: 'Bills', delta: 100e9 },
        },
        {
          id: 'pension-bonds-down',
          shift: { entityId: 'pension', side: 'asset', account: '10-year bonds', delta: -100e9 },
        },
        {
          id: 'pension-cash-up',
          shift: { entityId: 'pension', side: 'asset', account: 'Cash', delta: 100e9 },
        },
        {
          id: 'mmf-bills-up',
          shift: { entityId: 'mmf', side: 'asset', account: 'Bills', delta: 100e9 },
        },
        {
          id: 'mmf-cash-down',
          shift: { entityId: 'mmf', side: 'asset', account: 'Cash', delta: -100e9 },
        },
        {
          id: 'tsy-cash-up',
          shift: { entityId: 'treasury', side: 'asset', account: 'Cash at the central bank', delta: 100e9 },
          feedback:
            'The cash from the bills arrived and left the same day to pay the pension fund. The Treasury’s account ends where it started — this trade raises no money.',
        },
        {
          id: 'pension-bills-up',
          shift: { entityId: 'pension', side: 'asset', account: 'Bills', delta: 100e9 },
          feedback:
            'The pension fund sold its bonds for cash. It was not handed bills — those went to the buyer who wanted short paper.',
        },
        {
          id: 'mmf-bonds-up',
          shift: { entityId: 'mmf', side: 'asset', account: '10-year bonds', delta: 100e9 },
          feedback:
            'A US money market fund may not hold anything maturing in more than 397 days, and must keep its average maturity under 60. That rule is why it buys bills — and why a Treasury that issues more of them has a ready buyer.',
        },
        {
          id: 'pension-liab-down',
          shift: { entityId: 'pension', side: 'liability', account: 'Pensions owed', delta: -100e9 },
          feedback:
            'Selling a bond does not change what the fund owes its pensioners. It swaps one asset for another, so only the asset side moves.',
        },
      ],
      expectedShifts: [
        { entityId: 'treasury', side: 'liability', account: '10-year bonds', delta: -100e9 },
        { entityId: 'treasury', side: 'liability', account: 'Bills', delta: 100e9 },
        { entityId: 'pension', side: 'asset', account: '10-year bonds', delta: -100e9 },
        { entityId: 'pension', side: 'asset', account: 'Cash', delta: 100e9 },
        { entityId: 'mmf', side: 'asset', account: 'Bills', delta: 100e9 },
        { entityId: 'mmf', side: 'asset', account: 'Cash', delta: -100e9 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'unchanged',
          note: 'The central bank is not a party to the trade. No reserves are created or destroyed; cash only passes through the Treasury’s account on its way from one fund to the other.',
        },
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'Deposits moved from one fund to the other, $100 billion out and $100 billion in, and the savers’ shares in the money market fund did not change. The money stock is the same size, only differently held.',
        },
        {
          aggregate: 'collateral',
          direction: 'unchanged',
          note: 'The same face value of Treasuries is outstanding. What changed is its maturity — $100 billion of ten-year risk has left private hands and become three-month paper, which is the whole point.',
        },
      ],
      explanation:
        'Every entry is a swap of one asset or one liability for another, which is why each sheet balances without any sheet growing. That is what makes the operation hard to see in the usual statistics: no new debt, no new money, nothing on the central bank’s balance sheet. Yet the market now holds $100 billion less of the bond that sets long-term borrowing costs, and the Treasury holds $100 billion more debt that resets with the policy rate.',
    },
    {
      id: 'sim-who-holds-the-risk',
      type: 'interactive_sim',
      tags: ['debt-management', 'duration', 'rollover-risk'],
      xp: 50,
      currency: 'USD',
      constants: { parYield: 0.04 },
      prompt: 'How much long-rate risk can a buyback take off the market — and what does it cost the budget?',
      instructions: 'Compare no buyback with $2 trillion, and watch all three readouts',
      narrative:
        'Long yields include a term premium: what investors charge for tying money up while rates might rise. Reduce the amount of long-rate risk they must hold and the premium tends to fall. A buyback funded with bills does exactly that. The bill is paid on the other side — the shorter the debt, the more of it is refinanced each year at whatever the short rate is.',
      sliders: [
        {
          key: 'totalDebt',
          label: 'Marketable debt outstanding',
          min: 10e12,
          max: 40e12,
          step: 1e12,
          defaultValue: 30e12,
          format: 'currency',
        },
        {
          key: 'billShare',
          label: 'Share issued as bills',
          min: 0.1,
          max: 0.4,
          step: 0.01,
          defaultValue: 0.2,
          format: 'percent',
          hint: 'Debt maturing within a year of issue',
        },
        {
          key: 'longMaturity',
          label: 'Average maturity of the rest',
          min: 4,
          max: 12,
          step: 0.5,
          defaultValue: 8,
          format: 'number',
          hint: 'Years',
        },
        {
          key: 'buyback',
          label: 'Bonds bought back, funded with bills',
          min: 0,
          max: 4e12,
          step: 250e9,
          defaultValue: 0,
          format: 'currency',
        },
      ],
      readouts: [
        {
          key: 'tenYearEq',
          label: 'Risk held by the market, in 10-year bonds',
          formulaId: 'ten_year_equivalents',
          format: 'currency',
          emphasis: true,
          caption: 'Same price sensitivity, counted in 10-year bonds',
        },
        {
          key: 'rollover',
          label: 'Share refinanced within a year',
          formulaId: 'rollover_share',
          format: 'percent',
          caption: 'All bills, plus the bonds coming due',
        },
        {
          key: 'onePoint',
          label: 'Yearly cost of a 1-point rate rise',
          formulaId: 'cost_of_one_point',
          format: 'currency',
          caption: 'Once it reaches the debt refinanced within a year',
        },
      ],
      objective: {
        description: 'Compare no buyback with $2 trillion, and finish with the market holding under $18.6 trillion',
        requiredObservations: [{ sliderKey: 'buyback', values: [0, 2e12] }],
        target: { readoutKey: 'tenYearEq', comparator: 'lte', value: 18.6e12 },
      },
      explanation:
        'At the defaults the market carries the risk of about $20.1 trillion of 10-year bonds, 30% of the debt is refinanced within a year, and a one-point rise in short rates adds about $90 billion a year once it has passed through. A $2 trillion buyback takes the risk down to about $18.5 trillion — and the share refinanced to almost 36%, the cost of that rate rise to about $108 billion. Every dollar of eight-year debt retired removes only about 0.8 of a 10-year bond’s risk, because a shorter bond moves less when yields change. The readouts move together because they are one decision seen from opposite sides: whatever risk the market stops holding, the budget starts holding. Debt managers call this the cost–risk trade-off, and it is why the trade is tempting: bills usually yield less than bonds, so shortening saves money on average — until the rate it now depends on goes up. Raising the bill share does the same thing more slowly, spread across ordinary auctions instead of done in one go.',
    },
    {
      id: 'match-who-shortens',
      type: 'concept_match',
      tags: ['qe', 'yield-curve-control', 'debt-management'],
      xp: 35,
      prompt: 'Five ways to change how much long debt the market holds. Match each to what it actually does.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'qe',
          term: 'Quantitative easing',
          definition: 'The central bank buys long bonds with reserves it creates; it sets the amount and lets the price move',
        },
        {
          id: 'ycc',
          term: 'Yield curve control',
          definition: 'The central bank promises a yield and buys whatever amount it takes to hold it',
        },
        {
          id: 'twist',
          term: 'Operation Twist',
          definition: 'The central bank sells short bonds and buys long ones, so its balance sheet stays the same size',
        },
        {
          id: 'buyback',
          term: 'Buyback funded with bills',
          definition: 'The debt office swaps its own long debt for short debt, and no reserves are created',
        },
        {
          id: 'termout',
          term: 'Terming out',
          definition: 'The debt office lengthens what it issues to lock in today’s rates — the same lever pulled the other way',
        },
      ],
      explanation:
        'Three of these are central bank operations and two belong to the debt office, but four of them do the same thing to the market: they change how much long-rate risk private investors have to hold. That is why the first lesson insisted on the consolidated balance sheet. Seen from outside, a Fed that buys ten-year bonds with reserves and a Treasury that buys them back with bills both leave the public holding shorter, rate-sensitive paper. Only yield curve control is different in kind, because it fixes a price rather than a quantity.',
    },
    {
      id: 'mc-what-it-lacks',
      type: 'multiple_choice',
      tags: ['yield-curve-control', 'buybacks'],
      xp: 40,
      prompt:
        'A Treasury buyback programme has pulled 10-year yields down. What does it lack that a central bank’s yield curve control has?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'promise',
          label: 'A promise to buy any amount at a stated yield',
        },
        {
          id: 'effect',
          label: 'Any real effect on long yields',
          feedback:
            'Taking duration out of the market lowers the term premium whoever does it. The effect is real; what differs is how far it can be pushed and how credible it is.',
        },
        {
          id: 'legal',
          label: 'Legal authority',
          feedback:
            'Debt offices routinely buy back their own bonds. The US Treasury restarted regular buybacks in 2024 — small ones, run for market liquidity and cash management rather than to move yields. Authority is not what is missing; scale and intent are what would change.',
        },
        {
          id: 'money',
          label: 'The ability to create money to pay for it',
          feedback:
            'True, but that is a consequence rather than the defining difference. A central bank running QE also creates money and still promises no price — what makes yield curve control different is the price commitment.',
        },
      ],
      correctOptionId: 'promise',
      explanation:
        'Yield curve control works mostly through the promise: because the central bank stands ready to buy without limit, investors stop testing the target and it may barely need to buy anything. A buyback is a quantity. It can be large or small, but it is finite — bounded by the Treasury’s cash and by how many more bills the market will absorb — and a market that thinks the quantity is too small can sell into it. So it can lean on long yields, sometimes hard, but it cannot pin them. That limit is precisely why such a programme is easier to start: nobody has committed to anything they might be forced to defend.',
    },
    {
      id: 'mc-how-big-is-it',
      type: 'multiple_choice',
      tags: ['debt-management', 'evidence', 'contested'],
      xp: 45,
      prompt:
        'In 2024 two economists argued that the US Treasury’s tilt towards bills had lowered long yields about as much as a round of QE. Why treat that size with caution?',
      instructions: 'Pick the strongest reason',
      options: [
        {
          id: 'estimated',
          label: 'Supply effects are model estimates that vary widely, and issuance is priced in early',
        },
        {
          id: 'no-effect',
          label: 'The supply of a bond cannot change its yield, so the effect is zero',
          feedback:
            'That is the one position the evidence rules out. QE announcements moved yields, and research on decades of Treasury supply finds that more duration outstanding means a higher term premium. The question is how much, not whether.',
        },
        {
          id: 'too-small',
          label: 'Bills are too small a share of US debt to matter either way',
          feedback:
            'Bills are around a fifth of marketable US debt, which is trillions of dollars. A shift of a few percentage points in that share moves as much duration as some purchase programmes did.',
        },
        {
          id: 'motive',
          label: 'The Treasury says it does not aim at yields, so there is no effect',
          feedback:
            'Intent and effect are separate questions. A debt office can choose its mix for cost and risk reasons and still change how much duration the market holds — that is the point of the first lesson in this module.',
        },
      ],
      correctOptionId: 'estimated',
      explanation:
        'The mechanism is well supported: Greenwood and Vayanos showed in 2014 that the amount of long-term debt outstanding helps predict the term premium, and Greenwood, Hanson, Rudolph and Summers showed the same year that the Treasury’s lengthening of its debt after 2008 offset part of what QE removed. The size is another matter. No one observes the yield that would have prevailed without the shift, so every figure comes from a model, and models of duration supply disagree by several times. Issuance plans are also announced quarters ahead, so much of any effect is priced when the plan is published rather than when the bills are sold. Miran and Roubini’s 2024 estimate is a serious argument, not a measurement, and the Treasury disputed it. Hold the direction with confidence and the magnitude loosely.',
    },
    {
      id: 'order-the-quiet-route',
      type: 'order_flow',
      tags: ['fiscal-dominance', 'debt-management'],
      xp: 45,
      prompt: 'Long yields rise faster than the budget can bear. Put the quiet route in order.',
      instructions: 'Drag the steps into the order they happen',
      events: [
        { id: 'pressure', label: 'Long yields rise and the interest bill climbs with them' },
        { id: 'shorten', label: 'The debt office issues more bills and buys back long bonds', detail: 'Framed as cost management, never as a target for yields' },
        { id: 'premium', label: 'Less long-rate risk in private hands; the term premium eases' },
        { id: 'reprice', label: 'A larger share of the debt now resets with the policy rate' },
        { id: 'bind', label: 'Every rate rise reaches the budget within months' },
        { id: 'lean', label: 'The central bank finds the cost of tightening has gone up', detail: 'The pressure to hold short rates down is now fiscal' },
      ],
      correctOrder: ['pressure', 'shorten', 'premium', 'reprice', 'bind', 'lean'],
      explanation:
        'The first three steps happen in the bond market and look like a success: long yields come down without any announcement. The last three happen in the budget and arrive later. By shortening its debt, the Treasury has tied its own funding cost to a rate it does not set — so the risk it removed from the long end reappears as pressure on the central bank at the short end. This is the same chain as fiscal dominance in the currency module, reached through debt management rather than through a deficit, and it is why the maturity of the debt is worth watching as closely as its size.',
    },
    {
      id: 'mc-is-it-printing',
      type: 'multiple_choice',
      tags: ['monetary-financing', 'contested'],
      xp: 45,
      prompt: 'Critics call buybacks funded with bills “money printing by the back door”. How accurate is that?',
      instructions: 'Pick the most precise answer',
      options: [
        {
          id: 'combination',
          label: 'Only if the central bank then holds short rates down for the budget',
        },
        {
          id: 'yes',
          label: 'Fully accurate — it is the central bank buying the bonds',
          feedback:
            'It has the same effect on long-rate risk, not the same effect on money. No reserves are created, and the bills are owed back with interest to investors who chose to buy them.',
        },
        {
          id: 'no',
          label: 'Not at all — bills are debt, so this is just borrowing',
          feedback:
            'Formally correct, and incomplete. Bills are the closest thing to money a government issues: money funds hold them as cash and they are prime collateral in repo. Short enough debt behaves a good deal like money.',
        },
        {
          id: 'illegal',
          label: 'Not at all — monetary financing is prohibited by law',
          feedback:
            'The prohibition covers the central bank lending to or buying directly from the government. A Treasury buying back its own bonds from investors is outside it, which is part of why this route gets used.',
        },
      ],
      correctOptionId: 'combination',
      explanation:
        'This one is genuinely contested, and the honest answer depends on a second decision. On its own, a bill-funded buyback creates no money and is repaid in full. But it leaves the budget exposed to the short rate, and if the central bank then sets that rate partly to keep the interest bill manageable rather than to meet its inflation target, the pair together does much of what financing the deficit with money would. The economics is in the combination, not in either step — which is exactly why each step can be described, truthfully, as something else.',
    },
  ],
  keyTakeaways: [
    'A buyback funded with bills changes the maturity of the debt, not its size, and creates no money.',
    'It takes long-rate risk off the market as QE does — the term premium can fall without a central bank buying anything.',
    'The risk moves to the budget, which now refinances more each year at the policy rate.',
    'It is a quantity, not a promise, so it can lean on long yields but cannot pin them as yield curve control does.',
    'That duration supply moves the term premium is well evidenced; how much a given shift moves it is not.',
    'Whether it amounts to monetary financing depends on what the central bank does next with the short rate.',
  ],
});
