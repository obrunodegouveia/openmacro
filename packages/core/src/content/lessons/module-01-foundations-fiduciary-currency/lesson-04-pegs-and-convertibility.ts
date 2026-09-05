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
  title: 'Pegs, and Why They Break',
  subtitle: 'Promising a fixed price for your currency, and running out of the means to keep it.',
  icon: '⚖️',
  difficulty: 'core',
  estimatedMinutes: 7,
  hearts: 3,

  keyTakeaways: [
    'Defending a peg means buying your own currency back — which destroys it, contracting the domestic money supply.',
    'The defence is limited by foreign reserves. Selling the currency is unlimited; buying it is not.',
    'The trilemma: fixed rate, free capital movement, independent monetary policy — pick two.',
    'A peg is credible until the market can count the reserves and see the end of them.',
  ],

  challenges: [
    {
      id: 'mc-defence-direction',
      type: 'multiple_choice',
      tags: ['pegs', 'fx'],
      xp: 10,
      prompt: 'Your currency is under pressure and slipping below its peg. To defend it, the central bank must:',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'sell-domestic',
          label: 'Sell domestic currency and buy foreign currency',
          feedback:
            'That pushes it further down. Selling more of your own currency is what you do to stop it rising, not falling.',
        },
        {
          id: 'buy-domestic',
          label: 'Buy domestic currency, paying with its foreign reserves',
        },
        {
          id: 'print',
          label: 'Print more domestic currency to show strength',
          feedback:
            'Issuing more of something under pressure lowers its price. This is the opposite of a defence.',
        },
        {
          id: 'cut-rates',
          label: 'Cut interest rates to stimulate the economy',
          feedback:
            'Lower rates make the currency *less* attractive to hold. Defending a peg usually forces rates up, which is exactly the painful part.',
        },
      ],
      correctOptionId: 'buy-domestic',
      explanation:
        'A currency falls because more people want to sell it than buy it. The central bank becomes the buyer of last resort, paying in dollars or euros from its reserves. Note the asymmetry that decides every peg crisis: a central bank can create its own currency without limit, so holding a peg *down* is easy — but it can only buy its currency back with reserves it already has.',
    },

    {
      id: 't-peg-defence',
      type: 't_account_flow',
      tags: ['pegs', 'fx', 'balance-sheets'],
      xp: 25,
      prompt: 'The central bank spends $1B of reserves defending the peg. Post it.',
      instructions: 'Pick an entry, then choose whose sheet it lands on and which side',
      scenario:
        'Traders are selling the domestic currency. The central bank buys $1B worth of it back from a commercial bank, paying in foreign exchange. Four entries are needed — three of the seven do not belong.',
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
          feedback: 'Reserves are being spent, not acquired. This is the entry for holding a peg down, not up.',
        },
        {
          id: 'cb-bonds-down',
          shift: { entityId: 'central-bank', side: 'asset', account: 'Domestic government bonds', delta: -1e9 },
          feedback: 'The bank was paid in foreign exchange, not with bonds. The bond portfolio is untouched.',
        },
        {
          id: 'bank-deposits-up',
          shift: { entityId: 'commercial-bank', side: 'liability', account: 'Customer deposits', delta: 1e9 },
          feedback:
            'Nobody deposited anything. The bank swapped one asset for another; its customers are not involved.',
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
          note: 'The currency the central bank bought back is extinguished — its liability shrank by $1B.',
        },
        {
          aggregate: 'M2',
          direction: 'contract',
          note: 'Less base money in the system, and nothing replaced it. Defending the peg is monetary tightening whether the central bank wanted it or not.',
        },
        {
          aggregate: 'collateral',
          direction: 'contract',
          note: 'Foreign reserves — the most usable collateral a central bank has — are $1B lower and visibly counted by the market.',
        },
      ],
      explanation:
        'Both sheets shrink by $1B. The crucial line is the central bank’s liability: money bought back by its issuer ceases to exist, exactly as a repaid loan destroys a deposit. So defending a currency automatically tightens domestic monetary conditions — the defence and the recession are the same operation. This is why pegs are usually abandoned during downturns, when the tightening becomes politically unbearable.',
    },

    {
      id: 'order-peg-crisis',
      type: 'order_flow',
      tags: ['pegs', 'crisis'],
      xp: 15,
      prompt: 'How does a peg actually fall? Put the sequence in order.',
      instructions: 'Earliest cause at the top',
      events: [
        {
          id: 'divergence',
          label: 'Domestic conditions diverge from the anchor country',
          detail: 'The pegged rate stops matching what the economy needs',
        },
        {
          id: 'doubt',
          label: 'Traders start testing whether the peg will hold',
          detail: 'Selling the currency costs little if the peg holds and pays well if it breaks',
        },
        {
          id: 'drain',
          label: 'The central bank spends reserves buying its currency back',
          detail: 'Each defence is visible in the published reserve figures',
        },
        {
          id: 'count',
          label: 'The market counts the remaining reserves',
          detail: 'The end of the defence becomes a date, not a possibility',
        },
        {
          id: 'break',
          label: 'The peg is abandoned and the currency repricing happens at once',
          detail: 'Months of suppressed adjustment arrive in an afternoon',
        },
      ],
      correctOrder: ['divergence', 'doubt', 'drain', 'count', 'break'],
      explanation:
        'The step that makes speculation rational is the fourth. Reserves are published, so the defence has a visible floor — and a bet against a peg is close to one-way: if it holds you lose a little carry, and if it breaks you win the whole devaluation. Sterling in 1992 and the Swiss franc in 2015 both ended this way, the second when the central bank chose to stop rather than run out.',
    },

    {
      id: 'mc-trilemma',
      type: 'multiple_choice',
      tags: ['trilemma', 'pegs'],
      xp: 15,
      prompt: 'A country wants a fixed exchange rate, free movement of capital, and its own interest rate policy. What happens?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'fine',
          label: 'Nothing — these are independent choices',
          feedback:
            'They are not. If capital can move freely and your rate differs from the anchor country’s, money floods in or out until the peg gives way.',
        },
        {
          id: 'pick-two',
          label: 'It can have any two, and must give up the third',
        },
        {
          id: 'impossible',
          label: 'All three are impossible together and always have been',
          feedback:
            'Any *two* are perfectly workable, which is the useful part. The Eurozone keeps the first two and surrenders the third; the US keeps the last two and floats.',
        },
        {
          id: 'reserves',
          label: 'It can have all three with enough foreign reserves',
          feedback:
            'Reserves buy time, not exemption. They set how long the contradiction can be absorbed before it forces a choice.',
        },
      ],
      correctOptionId: 'pick-two',
      explanation:
        'This is the impossible trinity. Set your rate above the anchor’s and capital pours in chasing yield, pushing your currency up until the peg breaks; set it below and capital leaves. The Eurozone chose fixed rates and open capital, surrendering national monetary policy. China long chose fixed rates and its own policy, using capital controls as the third lever. In practice most countries sit somewhere between the corners rather than on one — a managed float with partial controls is a compromise, not a fourth option.',
    },
  ],
});
