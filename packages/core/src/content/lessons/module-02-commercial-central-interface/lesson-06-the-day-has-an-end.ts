/**
 * ============================================================================
 * Module 2 · Lesson 6 — "Overnight is a maturity, not a time of day"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to say what "overnight" actually denotes, place
 * the main events of a bank's funding day in order, and explain why a shortfall
 * has to be fixed before the payment system closes rather than in the morning.
 *
 * Why this lesson exists
 * ----------------------
 * A learner asked whether "overnight" was a historical term or whether things
 * really happen at 3am. It is a fair question that the course had no answer
 * for: `overnight-rates` teaches what SOFR measures and where the rate sits in
 * the corridor, and never mentions a clock. The word was used throughout the
 * module as though it were self-explanatory, which it is not.
 *
 * The answer is that nothing happens at night, and that is the entire point:
 * the night is the gap you are paying to cross. Reserve balances are final at
 * the close, so a bank short at 5pm cannot repair it at 2am — there is nobody
 * to trade with and no system to settle in. The overnight loan exists because
 * the payment system does not.
 *
 * Placed immediately before `overnight-rates`, which then has a clock to hang
 * its pricing on.
 *
 * Sources / further reading for reviewers:
 *   - Federal Reserve, Fedwire Funds Service operating hours — the value day
 *     opens at 9pm ET on the preceding calendar day.
 *   - New York Fed, SOFR publication schedule — published about 8am ET for the
 *     previous business day.
 *   - Federal Reserve Bank of New York, tri-party repo infrastructure reform —
 *     why the unwind moved later in the day after the financial crisis.
 *
 * A note on rigour: exact times are conventions, not physics, and several have
 * moved within living memory — the tri-party unwind was deliberately shifted to
 * cut the intraday credit clearing banks were extending. The challenges teach
 * the *shape* of the day and say the times are approximate, so that a learner
 * reading a pre-2010 description elsewhere is not confused by the difference.
 */

import { defineLesson } from '../../schema';

export const theDayHasAnEndLesson = defineLesson({
  id: 'the-day-has-an-end',
  title: 'The Day Has an End',
  subtitle:
    'Nobody trades at three in the morning. The night is the thing a bank is paying to get across.',
  icon: '🌙',
  difficulty: 'core',
  estimatedMinutes: 6,
  hearts: 3,

  keyTakeaways: [
    '"Overnight" describes how long the loan lasts — until the next business day — not the hour it is traded at.',
    'A Friday overnight loan runs to Monday. Three nights, still called overnight, still priced at the overnight rate.',
    'Most overnight funding is arranged in the morning; banks square up late in the day, before the payment system closes.',
    'Balances are final at the close. A bank short of reserves at five o’clock cannot fix it at two in the morning, which is precisely why it borrows.',
  ],

  challenges: [
    {
      id: 'mc-friday-overnight',
      type: 'multiple_choice',
      tags: ['overnight', 'settlement'],
      xp: 15,
      prompt: 'A bank borrows overnight on a Friday afternoon. When does it repay?',
      explanation:
        'Monday — three nights later. "Overnight" means until the next *business* day, so over a long weekend it can be four nights. It is still called an overnight loan and it is still priced off the overnight rate. That alone tells you the word describes a maturity, not a time of day: it is defined by the settlement calendar, not by the clock. The same logic gives you "30-year bond", which nobody thinks means thirty years of trading.',
      options: [
        { id: 'monday', label: 'Monday — three nights later' },
        {
          id: 'saturday',
          label: 'Saturday morning',
          feedback:
            'The payment system is shut. There is no way to move reserves on a Saturday, so there is no way to repay — which is exactly why the loan is written to the next business day instead.',
        },
        {
          id: 'sunday',
          label: 'Sunday night, so it is literally overnight',
          feedback:
            'Nothing settles on a Sunday night either. The loan has to end when the system is open, and it is priced for the whole period it actually runs.',
        },
        {
          id: 'cannot',
          label: 'It cannot borrow overnight on a Friday',
          feedback:
            'Friday is one of the busiest days for it. The loan simply runs longer, and the rate is quoted knowing that.',
        },
      ],
      correctOptionId: 'monday',
    },

    {
      id: 'mc-when-traded',
      type: 'multiple_choice',
      tags: ['overnight', 'market-structure'],
      xp: 15,
      prompt: 'When is most overnight funding actually agreed?',
      explanation:
        'In the morning, during ordinary working hours — much of the repo market’s overnight business is done within a couple of hours of the open. The famous September 2019 spike, when overnight cash briefly cost around 10%, happened over breakfast; traders watched it climb during the morning session. Fed funds trading has traditionally run the other way, late in the day, as banks see what their closing position will be and square up. Nothing about any of it requires anyone to be awake at night.',
      options: [
        { id: 'morning', label: 'Early morning, in normal working hours' },
        {
          id: 'midnight',
          label: 'Around midnight, when the day rolls over',
          feedback:
            'The value day does roll over in the evening — Fedwire opens for the next day at around 9pm ET. But opening the system is not the same as trading in it, and the desks are empty.',
        },
        {
          id: 'threeam',
          label: 'Roughly 3am, hence the name',
          feedback:
            'This is the intuition the name invites and it is simply wrong. The name is about how long the money is lent for, not when the lending is arranged.',
        },
        {
          id: 'anytime',
          label: 'Evenly spread across 24 hours',
          feedback:
            'It is heavily concentrated. Repo clusters early, fed funds late — because both are shaped by one deadline, which is the close.',
        },
      ],
      correctOptionId: 'morning',
    },

    {
      id: 'of-a-funding-day',
      type: 'order_flow',
      tags: ['overnight', 'settlement', 'reserves'],
      xp: 25,
      prompt: 'Put a bank’s funding day in order.',
      instructions: 'Earliest first. Times are approximate and are conventions, not rules of nature',
      explanation:
        'The shape is what matters: the system opens long before anybody trades, money moves all day and drags the bank’s position with it, and there is a hard deadline at the end. Everything about overnight funding is organised around that deadline. Note that the value day opens the *previous evening* — one of the reasons "the day" is such a slippery word in money markets — and that the benchmark rate for a day is not published until the next morning, once every transaction has been collected.',
      events: [
        {
          id: 'open',
          label: 'The payment system opens for the value day',
          detail: 'Fedwire opens around 9pm ET the previous calendar evening',
        },
        {
          id: 'repo',
          label: 'Overnight repo is traded',
          detail: 'Early morning, much of it within a couple of hours of the open',
        },
        {
          id: 'flows',
          label: 'Payments run all day and move the bank’s position',
          detail: 'Every customer transfer, bond settlement and tax payment shifts reserves',
        },
        {
          id: 'square',
          label: 'The bank sees it will be short at the close, and borrows',
          detail: 'Late afternoon, once the day’s flows are largely known',
        },
        {
          id: 'close',
          label: 'The system closes and balances are final',
          detail: 'Whatever the bank is holding, it holds until morning',
        },
        {
          id: 'publish',
          label: 'The benchmark rate for that day is published',
          detail: 'SOFR appears around 8am ET the following business day',
        },
      ],
      correctOrder: ['open', 'repo', 'flows', 'square', 'close', 'publish'],
    },

    {
      id: 'mc-why-not-wait',
      type: 'multiple_choice',
      tags: ['overnight', 'settlement', 'reserves'],
      xp: 20,
      prompt:
        'A bank realises at five o’clock that it will be short of reserves. Why borrow now rather than sort it out in the morning?',
      explanation:
        'Because when the system closes, the position is frozen. There is no counterparty awake, no way to move reserves, and no mechanism to settle a trade even if someone agreed to one — so whatever the bank is holding at the close is what it holds until the system reopens. That is the whole reason the overnight market exists, and it is the answer to why it is called overnight: the loan is not happening *during* the night, it is carrying the bank *across* it. The night is not when the action is. The night is the gap being paid for.',
      options: [
        {
          id: 'frozen',
          label: 'Once the system closes, the position is frozen until it reopens',
        },
        {
          id: 'cheaper',
          label: 'Borrowing is cheaper in the evening than in the morning',
          feedback:
            'Late-day borrowing is often *dearer*, not cheaper — a bank that has left it until the last hour has less bargaining power. It borrows anyway, because the alternative is not available at any price.',
        },
        {
          id: 'midnight',
          label: 'Regulators check reserve balances at midnight',
          feedback:
            'What is measured is the balance at the close of the payment system, not a midnight snapshot. The deadline is operational before it is regulatory: the money genuinely cannot move.',
        },
        {
          id: 'required',
          label: 'The central bank requires every bank to borrow each night',
          feedback:
            'Nobody is required to borrow. A bank with enough reserves simply does not — and in an abundant-reserves system most do not, which is why the overnight rate sits near the floor.',
        },
      ],
      correctOptionId: 'frozen',
    },
  ],
});
