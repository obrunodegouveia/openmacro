import { defineLesson } from '../../schema';

/**
 * The carry trade from the trader's seat: one trade from the loan to the
 * repayment, and the four ways traders try to protect it — a forward hedge,
 * an option, stop-losses and spreading the bet — with what each one costs.
 *
 * Follows "The Peso's Year". The numbers are that lesson's, rounded: yen
 * borrowed at 1.25%, peso bonds at 12%, one year. Simplified on purpose:
 * no bid-ask spreads, no taxes, the yen held steady against the dollar, and
 * an option premium that is a slider rather than priced from volatility.
 * The formulas are in formulas.ts under "The carry trade".
 */
const CARRY = { localRate: 0.12, fundingRate: 0.0125 };

export const insideTheCarryTradeLesson = defineLesson({
  id: 'inside-the-carry-trade',
  title: 'Inside the Carry Trade',
  subtitle:
    'Borrow at 1%, lend at 12%, keep the difference — unless the currency moves first. How traders try to protect it, and why none of it is free.',
  icon: '🧮',
  difficulty: 'advanced',
  estimatedMinutes: 15,
  challenges: [
    {
      id: 'order-one-trade',
      type: 'order_flow',
      tags: ['carry-trade', 'mechanics'],
      xp: 30,
      prompt: 'One carry trade, from the loan to the repayment. Put it in order.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'borrow', label: 'Borrow yen at about 1.25% a year' },
        { id: 'sell-yen', label: 'Sell the yen and buy pesos', detail: 'At today’s exchange rate' },
        { id: 'bonds', label: 'Buy Colombian peso bonds paying about 12%' },
        { id: 'collect', label: 'Collect the interest, in pesos, for a year' },
        { id: 'buy-back', label: 'Sell the bonds and buy yen back', detail: 'At that day’s exchange rate — unknown today' },
        { id: 'repay', label: 'Repay the loan and its interest; what is left is the result' },
      ],
      correctOrder: ['borrow', 'sell-yen', 'bonds', 'collect', 'buy-back', 'repay'],
      explanation:
        'Every step is known in advance except one: the exchange rate on the day you buy the yen back. The interest you earn and the interest you owe are fixed when you start. The rate you convert back at is not, and it decides whether the year was worth it. In practice most traders do not hold one bond for a year: they hold for weeks or months and roll the position over, which means they face that unknown rate again and again. Some skip the loan altogether and buy pesos for a future date with a forward contract, which you will meet in the next step.',
    },
    {
      id: 'sim-carry-hedge',
      type: 'interactive_sim',
      tags: ['carry-trade', 'hedging', 'covered-interest-parity'],
      xp: 45,
      constants: CARRY,
      prompt: 'Run the trade. Then try to remove its risk with a forward contract.',
      instructions: 'Move the peso and the share you hedge, and watch the result',
      narrative:
        'A forward is a contract made today to swap currencies on a future date at a rate fixed today. Sell your future pesos forward and the rate you convert back at is no longer unknown. The question is what rate the bank will give you.',
      sliders: [
        {
          key: 'pesoMove',
          label: 'Change in pesos per yen over the year',
          min: -0.15,
          max: 0.3,
          step: 0.05,
          defaultValue: 0,
          format: 'percent',
          hint: 'Above 0 the peso weakens; below 0 it strengthens',
        },
        {
          key: 'hedgeRatio',
          label: 'Share of the trade sold forward',
          min: 0,
          max: 1,
          step: 0.25,
          defaultValue: 0,
          format: 'percent',
        },
      ],
      readouts: [
        {
          key: 'result',
          label: 'Profit per yen borrowed, after repaying',
          formulaId: 'carry_hedged_return',
          format: 'percent',
          emphasis: true,
          caption: 'The unhedged part depends on the peso; the hedged part earns nothing extra',
        },
        {
          key: 'breakEven',
          label: 'How far the peso can weaken before an unhedged trade loses',
          formulaId: 'carry_break_even',
          format: 'percent',
          caption: 'Also how much cheaper the bank sells pesos for a year from now',
        },
      ],
      objective: {
        description: 'Try the peso steady, 10% weaker and 20% weaker, both unhedged and fully hedged',
        requiredObservations: [
          { sliderKey: 'pesoMove', values: [0, 0.1, 0.2] },
          { sliderKey: 'hedgeRatio', values: [0, 1] },
        ],
      },
      explanation:
        'Fully hedged, the result is zero whatever the peso does. The bank is not cheating you: it can borrow yen, buy pesos and lend them at 12% as easily as you can, so the forward rate it quotes already contains the whole interest gap. A year forward, a yen buys about 10.6% more pesos than today. That is covered interest parity, and it is the central fact of the carry trade: the profit is the payment for carrying the currency risk. Hedge the risk and you hand the profit back. Half hedged, you keep half of each — half the gain and half the loss.',
    },
    {
      id: 'mc-why-not-hedge',
      type: 'multiple_choice',
      tags: ['carry-trade', 'covered-interest-parity'],
      xp: 35,
      prompt:
        'A fund borrows at 1.25%, buys peso bonds at 12% and sells all its future pesos forward. What has it earned?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'nothing',
          label: 'About nothing: the forward rate already took the gap away',
        },
        {
          id: 'gap',
          label: 'The full 10.75-point gap, risk free',
          feedback:
            'If that were possible, every bank would do it without limit, borrowing yen and selling pesos forward until the forward rate moved. It already has: that is why the forward peso is about 10.6% cheaper.',
        },
        {
          id: 'half',
          label: 'Half the gap; the bank keeps the other half',
          feedback:
            'The bank earns a small spread on the contract, not half the gap. Almost all of the gap goes into the forward rate itself.',
        },
        {
          id: 'depends',
          label: 'It depends on what the peso does',
          feedback:
            'That was true before it hedged. Once every future peso is sold at a fixed rate, the spot rate on the day no longer matters.',
        },
      ],
      correctOptionId: 'nothing',
      explanation:
        'So why do people say carry trades are "hedged"? Usually they mean partly: a fund hedges some of the position, or hedges only when it is worried, or buys insurance against a large fall rather than all falls. The investors who made the most from the peso in 2026 were the ones who did not hedge at all. And their buying is what pushed the peso up.',
    },
    {
      id: 'sim-carry-insurance',
      type: 'interactive_sim',
      tags: ['carry-trade', 'options', 'hedging'],
      xp: 45,
      constants: { ...CARRY, putStrike: 0.15 },
      prompt: 'Instead of a forward, buy insurance: an option that caps your loss.',
      instructions: 'Move the peso and the price of the insurance',
      narrative:
        'A put option on the peso gives you the right, not the obligation, to convert back at a rate no worse than 15% below today’s. If the peso falls further, you use it; if not, you let it expire. You pay for it up front, whatever happens.',
      sliders: [
        {
          key: 'pesoMove',
          label: 'Change in pesos per yen over the year',
          min: -0.15,
          max: 0.3,
          step: 0.05,
          defaultValue: 0,
          format: 'percent',
          hint: 'Above 0 the peso weakens; below 0 it strengthens',
        },
        {
          key: 'putPremium',
          label: 'Price of the insurance',
          min: 0,
          max: 0.06,
          step: 0.01,
          defaultValue: 0.03,
          format: 'percent',
          hint: 'Per yen borrowed. Higher when markets are nervous',
        },
      ],
      readouts: [
        {
          key: 'result',
          label: 'Profit per yen borrowed, after the insurance',
          formulaId: 'carry_insured_return',
          format: 'percent',
          emphasis: true,
        },
        {
          key: 'worst',
          label: 'The worst it can be',
          formulaId: 'carry_insured_worst',
          format: 'percent',
          caption: 'However far the peso falls',
        },
      ],
      objective: {
        description: 'Let the peso fall 30%, with cheap and with expensive insurance',
        requiredObservations: [
          { sliderKey: 'pesoMove', values: [0, 0.3] },
          { sliderKey: 'putPremium', values: [0, 0.06] },
        ],
      },
      explanation:
        'Unlike the forward, the option keeps the upside: if the peso holds or strengthens you still earn the gap, minus the premium. If it collapses, your loss stops at the strike. But look at the premium slider. At 3% the insurance eats more than a quarter of the year’s carry, and at 6% over half. Its price is set by how much the market expects the peso to swing, so it is cheap when everyone is calm and expensive when they are frightened. The traders who buy it late pay the most.',
    },
    {
      id: 'mc-insurance-timing',
      type: 'multiple_choice',
      tags: ['options', 'risk'],
      xp: 30,
      prompt: 'When is insurance against a peso fall most expensive?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'fear',
          label: 'When markets are nervous — exactly when you most want it',
        },
        {
          id: 'calm',
          label: 'When markets are calm, because more people buy it then',
          feedback:
            'In calm markets few people want it and the expected swings are small, so it is cheap. That is when the patient buy it.',
        },
        {
          id: 'never',
          label: 'Its price is fixed when the trade starts',
          feedback:
            'The price you pay is fixed for the option you buy. The next one, when you roll the position, costs whatever fear costs that day.',
        },
        {
          id: 'rates',
          label: 'When the interest gap is largest',
          feedback:
            'A larger gap gives you more cushion, not more expensive insurance. Price follows expected swings — fear — rather than the gap.',
        },
      ],
      correctOptionId: 'fear',
      explanation:
        'This is the trap in insuring a carry trade: the moment you decide you need insurance is the moment everyone else decides the same, and the seller charges for it. Around an election the pattern is typical: insurance costs more before the vote and less once the result is known, which makes the trade cheaper to hold just as uncertainty clears — one more way a single event can bring money in all at once.',
    },
    {
      id: 'sim-carry-leverage',
      type: 'interactive_sim',
      tags: ['carry-trade', 'leverage', 'risk'],
      xp: 45,
      constants: CARRY,
      prompt: 'Professional funds rarely trade only their own money. Add leverage.',
      instructions: 'Move the leverage and the peso',
      narrative:
        'Leverage 5 means every unit of the fund’s own money supports five units of trade; the other four are borrowed too. The gap is earned five times over. So is every move in the peso.',
      sliders: [
        {
          key: 'leverage',
          label: 'Leverage',
          min: 2,
          max: 10,
          step: 1,
          defaultValue: 5,
          format: 'multiplier',
        },
        {
          key: 'pesoMove',
          label: 'Change in pesos per yen over the year',
          min: -0.15,
          max: 0.3,
          step: 0.05,
          defaultValue: 0,
          format: 'percent',
          hint: 'Above 0 the peso weakens; below 0 it strengthens',
        },
      ],
      readouts: [
        {
          key: 'result',
          label: 'Result on the fund’s own money',
          formulaId: 'carry_levered_return',
          format: 'percent',
          emphasis: true,
          caption: 'Cannot fall below −100%: the lender closes the trade there',
        },
        {
          key: 'wipeout',
          label: 'Peso fall that wipes out the fund’s money',
          formulaId: 'carry_wipeout_move',
          format: 'percent',
        },
      ],
      objective: {
        description: 'Compare leverage 2 and 10, with the peso steady and 15% weaker',
        requiredObservations: [
          { sliderKey: 'leverage', values: [2, 10] },
          { sliderKey: 'pesoMove', values: [0, 0.15] },
        ],
      },
      explanation:
        'At leverage 10 the steady peso earns about 100% in a year, which is why the trade attracts so much money. A 15% fall loses nearly 40%, and about a 23% fall loses everything. Long before that, the lender asks for more collateral — a margin call — and a fund that cannot pay is closed out, selling pesos at the worst moment. That is why leveraged traders use stop-losses: orders to sell automatically once the loss passes a limit.',
    },
    {
      id: 'order-stop-cascade',
      type: 'order_flow',
      tags: ['carry-trade', 'stop-loss', 'crisis'],
      xp: 35,
      prompt:
        'Stop-losses protect each fund. Watch what they do to the currency. Put it in order.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'news', label: 'Bad news: the peso falls 3% in a day' },
        { id: 'stops', label: 'Funds’ stop-loss orders trigger and sell pesos' },
        { id: 'further', label: 'The selling pushes the peso down further' },
        { id: 'more-stops', label: 'That trips more funds’ stops and margin calls' },
        { id: 'overshoot', label: 'The peso falls far more than the news justified' },
        { id: 'response', label: 'The central bank sells dollars or raises rates to stop it' },
      ],
      correctOrder: ['news', 'stops', 'further', 'more-stops', 'overshoot', 'response'],
      explanation:
        'Each stop-loss is sensible on its own and dangerous in a crowd, because carry traders hold the same positions and set their limits at similar levels. Traders describe carry currencies as going "up the stairs and down the elevator": they rise slowly for months as money arrives, then fall in days when it leaves together. A stop-loss does not remove the risk; it turns a slow loss for one fund into a fast fall for everyone, and the fund often sells at a worse rate than its limit.',
    },
    {
      id: 'mc-spread-the-bet',
      type: 'multiple_choice',
      tags: ['carry-trade', 'diversification'],
      xp: 35,
      prompt:
        'A fund spreads its carry trade across the peso, the Brazilian real, the Mexican peso and the South African rand. What is it protected against?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'country',
          label: 'One country’s bad news — not a global rush to safety',
        },
        {
          id: 'everything',
          label: 'Almost everything: four currencies rarely fall together',
          feedback:
            'In calm times they move fairly independently. In a global panic investors sell all of them at once, and that is when the protection was needed.',
        },
        {
          id: 'nothing',
          label: 'Nothing: they all move together',
          feedback:
            'An election in Colombia does not move the rand. Against news in one country, spreading the bet works well.',
        },
        {
          id: 'rates',
          label: 'Interest rates in the funding country',
          feedback:
            'A rise in Japanese rates squeezes all four trades at once, because they are all funded in yen.',
        },
      ],
      correctOptionId: 'country',
      explanation:
        'Spreading the bet removes the risk that is specific to one country and keeps the risk they all share: the world deciding to sell emerging markets and buy dollars or yen. In August 2024 a rise in Japanese rates and a stronger yen forced yen-funded carry trades worldwide to close at once, and high-yield currencies fell together. Diversification protects you from a bad election. It does not protect you from everyone heading for the exit at the same time.',
    },
    {
      id: 'match-who-trades',
      type: 'concept_match',
      tags: ['carry-trade', 'market-participants'],
      xp: 30,
      prompt: 'Who is on each side of the peso carry trade, and how they behave.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'hedge-fund',
          term: 'Leveraged hedge fund',
          definition: 'Trades on borrowed money with stop-losses; arrives fast and leaves first',
        },
        {
          id: 'bond-fund',
          term: 'Foreign bond fund',
          definition: 'Holds peso bonds for the yield on its own money; slower, hedges part of it',
        },
        {
          id: 'bank',
          term: 'Bank currency desk',
          definition: 'Sells the forwards and options, and covers its own risk at once',
        },
        {
          id: 'importer',
          term: 'Colombian importer',
          definition: 'Buys dollars forward to fix the peso cost of next quarter’s goods',
        },
      ],
      explanation:
        'Every forward has two sides. When a fund buys pesos a year ahead, someone sells them: often an importer who needs dollars later and wants to know the price now. The bank in the middle matches them and earns a spread. When people say "the carry trade moved the peso", they mostly mean the first row: the fast, leveraged money that sets the price at the margin. It is also the money that leaves first.',
    },
  ],
  keyTakeaways: [
    'Everything in a carry trade is known in advance except the rate you convert back at.',
    'A forward removes the risk and the profit together: covered interest parity.',
    'Options keep the upside but cost most when you need them.',
    'Leverage and stop-losses turn a small fall into a fast, shared one.',
    'Spreading the bet protects against one country, not against everyone leaving.',
  ],
});
