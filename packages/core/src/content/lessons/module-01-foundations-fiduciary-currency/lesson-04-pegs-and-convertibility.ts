/**
 * ============================================================================
 * Module 1 · Lesson 4 — "A promise you can be forced to keep"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to post a peg defence across two balance sheets,
 * see that defending a currency destroys the domestic money it buys back, and
 * explain why a peg is a finite promise rather than a permanent state.
 *
 * Sources / further reading for reviewers:
 *   - Obstfeld & Rogoff, "The Mirage of Fixed Exchange Rates" (1995).
 *   - Bank of England, "The 1992 ERM crisis" retrospectives.
 *   - Swiss National Bank press release, 15 January 2015 (abandoning the floor).
 *
 * A note on rigour: the trilemma is stated as the standard three-way choice.
 * Reality is a spectrum — managed floats and partial capital controls sit
 * between the corners — and the final challenge is there to make that explicit
 * rather than leave learners with a false trichotomy.
 */

import { defineLesson } from '../../schema';

export const pegsAndConvertibilityLesson = defineLesson({
  id: 'pegs-and-convertibility',
  title: 'Fixed Exchange Rates, and Why They Break',
  subtitle: 'A country promises a fixed price for its currency, then runs out of the money it needs to keep that promise.',
  icon: '⚖️',
  difficulty: 'core',
  estimatedMinutes: 7,
  hearts: 3,

  keyTakeaways: [
    'To defend a peg (a fixed exchange rate), the central bank buys its own currency back. That removes money from the economy.',
    'The defence is limited by foreign reserves. A central bank can sell its own currency without limit, but it can only buy it back with reserves it has.',
    'The trilemma: a fixed rate, free movement of money across borders, and your own interest rate. You can only have two.',
    'People believe a peg until they can count the reserves and see when they will run out.',
  ],

  challenges: [
    {
      id: 'mc-defence-direction',
      type: 'multiple_choice',
      tags: ['pegs', 'fx'],
      xp: 10,
      prompt: 'Your currency is falling below its fixed rate (its “peg”). To defend it, what must the central bank do?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'sell-domestic',
          label: 'Sell domestic currency and buy foreign currency',
          feedback:
            'That pushes it down further. You sell more of your own currency to stop it rising, not falling.',
        },
        {
          id: 'buy-domestic',
          label: 'Buy its own currency, paying with its foreign reserves',
        },
        {
          id: 'print',
          label: 'Print more domestic currency to show strength',
          feedback:
            'Creating more of something under pressure makes its price fall. That is the opposite of a defence.',
        },
        {
          id: 'cut-rates',
          label: 'Cut interest rates to stimulate the economy',
          feedback:
            'Lower rates make the currency less attractive to hold. Defending a peg usually means raising rates, which is the painful part.',
        },
      ],
      correctOptionId: 'buy-domestic',
      explanation:
        'A currency falls when more people want to sell it than buy it. So the central bank becomes the buyer, paying in dollars or euros from its reserves. Note the key difference: a central bank can create its own currency without limit, so stopping it from rising is easy. But it can only buy it back with the reserves it already has.',
    },

    {
      id: 't-peg-defence',
      type: 't_account_flow',
      tags: ['pegs', 'fx', 'balance-sheets'],
      xp: 25,
      prompt: 'The central bank spends $1B of its reserves to defend the peg. Post it.',
      instructions: 'Pick an entry, then choose whose list it goes on and which side',
      scenario:
        'Traders are selling the country’s currency. The central bank buys $1B of it back from a commercial bank and pays in foreign currency. Four entries are needed. Three of the seven are wrong.',
      currency: 'USD',
      entities: [
        {
          id: 'central-bank',
          label: 'Central Bank',
          tier: 'central_bank',
          role: 'Defending the peg',
          openingLines: [
            { account: 'Foreign exchange reserves', side: 'asset', amount: 40e9 },
            { account: 'Domestic government bonds', side: 'asset', amount: 60e9 },
            { account: 'Domestic currency in circulation', side: 'liability', amount: 100e9 },
          ],
        },
        {
          id: 'commercial-bank',
          label: 'Commercial Bank',
          tier: 'commercial_bank',
          role: 'Selling domestic currency',
          openingLines: [
            { account: 'Domestic currency', side: 'asset', amount: 8e9 },
            { account: 'Foreign currency', side: 'asset', amount: 2e9 },
            { account: 'Customer deposits', side: 'liability', amount: 10e9 },
          ],
        },
      ],
      options: [
        {
          id: 'cb-fx-down',
          shift: { entityId: 'central-bank', side: 'asset', account: 'Foreign exchange reserves', delta: -1e9 },
        },
        {
          id: 'cb-currency-down',
          shift: { entityId: 'central-bank', side: 'liability', account: 'Domestic currency in circulation', delta: -1e9 },
        },
        {
          id: 'bank-fx-up',
          shift: { entityId: 'commercial-bank', side: 'asset', account: 'Foreign currency', delta: 1e9 },
        },
        {
          id: 'bank-domestic-down',
          shift: { entityId: 'commercial-bank', side: 'asset', account: 'Domestic currency', delta: -1e9 },
        },
        {
          id: 'cb-fx-up',
          shift: { entityId: 'central-bank', side: 'asset', account: 'Foreign exchange reserves', delta: 1e9 },
          feedback: 'The reserves are being spent, not received. This entry is for stopping a currency from rising, not from falling.',
        },
        {
          id: 'cb-bonds-down',
          shift: { entityId: 'central-bank', side: 'asset', account: 'Domestic government bonds', delta: -1e9 },
          feedback: 'The bank was paid in foreign currency, not with bonds. The bonds do not change.',
        },
        {
          id: 'bank-deposits-up',
          shift: { entityId: 'commercial-bank', side: 'liability', account: 'Customer deposits', delta: 1e9 },
          feedback:
            'Nobody deposited anything. The bank swapped one asset for another. Its customers are not involved.',
        },
      ],
      expectedShifts: [
        { entityId: 'central-bank', side: 'asset', account: 'Foreign exchange reserves', delta: -1e9 },
        { entityId: 'central-bank', side: 'liability', account: 'Domestic currency in circulation', delta: -1e9 },
        { entityId: 'commercial-bank', side: 'asset', account: 'Foreign currency', delta: 1e9 },
        { entityId: 'commercial-bank', side: 'asset', account: 'Domestic currency', delta: -1e9 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'contract',
          note: 'The currency the central bank bought back no longer exists: what it owes fell by $1B.',
        },
        {
          aggregate: 'M2',
          direction: 'contract',
          note: 'There is less money in the system and nothing replaced it. Defending the peg tightens money, whether the central bank wants that or not.',
        },
        {
          aggregate: 'collateral',
          direction: 'contract',
          note: 'Foreign reserves, the most useful thing a central bank holds, are $1B lower, and the market can see it.',
        },
      ],
      explanation:
        'Both lists shrink by $1B. The key line is the central bank’s liability. When the issuer buys its own money back, that money disappears, just as repaying a loan removes a deposit. So defending a currency automatically tightens money at home: the defence and the slowdown are the same action. That is why countries often give up a peg during a recession, when the pain becomes too much.',
    },

    {
      id: 'order-peg-crisis',
      type: 'order_flow',
      tags: ['pegs', 'crisis'],
      xp: 15,
      prompt: 'How does a peg really fall? Put the steps in order.',
      instructions: 'First step at the top',
      events: [
        {
          id: 'divergence',
          label: 'The country’s economy starts to need something different from the anchor country',
          detail: 'The fixed rate no longer fits what the economy needs',
        },
        {
          id: 'doubt',
          label: 'Traders start testing whether the peg will hold',
          detail: 'Selling the currency costs little if the peg holds, and pays a lot if it breaks',
        },
        {
          id: 'drain',
          label: 'The central bank spends reserves buying its currency back',
          detail: 'Every defence shows up in the published reserve numbers',
        },
        {
          id: 'count',
          label: 'The market counts how many reserves are left',
          detail: 'People can now see the date when the defence will end',
        },
        {
          id: 'break',
          label: 'The peg is dropped and the currency jumps to a new price at once',
          detail: 'Months of held-back change happen in one afternoon',
        },
      ],
      correctOrder: ['divergence', 'doubt', 'drain', 'count', 'break'],
      explanation:
        'The fourth step is what makes betting against a peg sensible. Reserves are published, so everyone can see the limit. The bet is almost one-way: if the peg holds you lose a little, and if it breaks you win a lot. The British pound in 1992 and the Swiss franc in 2015 both ended like this. In 2015 the central bank chose to stop before it ran out.',
    },

    {
      id: 'mc-trilemma',
      type: 'multiple_choice',
      tags: ['trilemma', 'pegs'],
      xp: 15,
      prompt: 'A country wants three things: a fixed exchange rate, money that can move freely in and out, and its own interest rate. What happens?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'fine',
          label: 'Nothing, because these choices do not affect each other',
          feedback:
            'They do. If money moves freely and your rate is different from the anchor country’s, money rushes in or out until the peg breaks.',
        },
        {
          id: 'pick-two',
          label: 'It can have any two, and must give up the third',
        },
        {
          id: 'impossible',
          label: 'All three are impossible together and always have been',
          feedback:
            'Any two of them work fine, and that is the useful part. The euro area keeps the first two and gives up the third. The US keeps the last two and lets its currency float.',
        },
        {
          id: 'reserves',
          label: 'It can have all three with enough foreign reserves',
          feedback:
            'Reserves buy time, not freedom from the rule. They decide how long the conflict can last before the country has to choose.',
        },
      ],
      correctOptionId: 'pick-two',
      explanation:
        'This is called the impossible trinity. Set your rate above the anchor’s and money pours in looking for higher returns, pushing your currency up until the peg breaks. Set it below and money leaves. The euro area chose fixed rates and free movement of money, and gave up national interest rates. China for a long time chose a fixed rate and its own rates, and limited money moving across its borders. In practice most countries sit somewhere in between.',
    },
  ],
});
