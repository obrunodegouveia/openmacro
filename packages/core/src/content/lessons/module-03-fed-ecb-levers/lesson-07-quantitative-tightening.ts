/**
 * ============================================================================
 * Module 3 · Lesson 7 — "Unwinding is not the mirror image"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to distinguish passive runoff from active sales,
 * post a maturing bond, and explain why QT is not simply QE reversed.
 *
 * Sources / further reading for reviewers:
 *   - Fed, "Plans for Reducing the Size of the Balance Sheet" (2022).
 *   - Bank of England's active gilt sales, the exception among major central
 *     banks.
 *
 * A note on rigour: whether QT is meaningfully contractionary is genuinely
 * contested — estimates of its effect on yields vary widely. The lesson
 * presents the mechanism and flags the uncertainty rather than asserting a
 * magnitude.
 */

import { defineLesson } from '../../schema';

export const quantitativeTighteningLesson = defineLesson({
  id: 'quantitative-tightening',
  title: 'Unwinding Is Not the Mirror Image',
  subtitle: 'Letting bonds mature drains reserves — and nobody is quite sure how much it matters.',
  icon: '📉',
  difficulty: 'advanced',
  estimatedMinutes: 7,
  hearts: 3,

  keyTakeaways: [
    'Passive QT lets bonds mature without reinvesting; active QT sells them.',
    'When a bond the central bank holds matures, reserves are extinguished — the balance sheet shrinks on both sides.',
    'QT is slower and less controllable than QE, because maturity dates are fixed in advance.',
    'The binding limit is not a target size but the point at which reserves stop being abundant.',
  ],

  challenges: [
    {
      id: 'mc-runoff-vs-sales',
      type: 'multiple_choice',
      tags: ['qt', 'balance-sheet'],
      xp: 15,
      prompt: 'What is the difference between letting bonds run off and selling them?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'same',
          label: 'Nothing — both shrink the balance sheet',
          feedback:
            'Both shrink it, but one lets the market set the pace of price discovery and the other forces it. That difference is why nearly every central bank chose runoff.',
        },
        {
          id: 'runoff-passive',
          label: 'Runoff shrinks it on a schedule the bonds set; selling forces a price into the market now',
        },
        {
          id: 'sales-slower',
          label: 'Selling is slower',
          feedback:
            'Selling is faster — that is its appeal and its risk. Runoff proceeds only as fast as bonds mature.',
        },
        {
          id: 'runoff-no-effect',
          label: 'Runoff has no monetary effect',
          feedback:
            'It does: when a bond matures the Treasury repays the central bank, and the reserves used to do it are extinguished.',
        },
      ],
      correctOptionId: 'runoff-passive',
      explanation:
        'Runoff is predictable and undramatic — everyone knows the maturity schedule years ahead, so it is largely priced in. Active sales put supply into the market on a date the central bank chooses, which discovers a price and can move yields sharply. The UK found this out in 2022 when gilt sales collided with a fiscal event, and the Bank had to suspend the programme and buy instead.',
    },

    {
      id: 't-bond-matures',
      type: 't_account_flow',
      tags: ['qt', 'balance-sheets'],
      xp: 30,
      prompt: 'A €10bn bond the central bank holds matures and is not reinvested. Post it.',
      instructions: 'Pick an entry, then choose whose sheet it lands on and which side',
      scenario:
        'The government repays €10bn to the central bank. It funds the repayment from its account, which was topped up by taxes collected through the banking system. Four entries are needed — three of the seven do not belong.',
      currency: 'EUR',
      entities: [
        {
          id: 'central-bank',
          label: 'Central Bank',
          tier: 'central_bank',
          role: 'Holds the maturing bond',
          openingLines: [
            { account: 'Government bonds', side: 'asset', amount: 3e12 },
            { account: 'Commercial bank reserves', side: 'liability', amount: 2.5e12 },
            { account: 'Government deposit', side: 'liability', amount: 200e9 },
          ],
        },
        {
          id: 'government',
          label: 'Government',
          tier: 'fiduciary_core',
          role: 'Repaying the bond',
          openingLines: [
            { account: 'Deposit at the central bank', side: 'asset', amount: 200e9 },
            { account: 'Bonds outstanding', side: 'liability', amount: 2.4e12 },
          ],
        },
      ],
      options: [
        {
          id: 'cb-bonds-down',
          shift: { entityId: 'central-bank', side: 'asset', account: 'Government bonds', delta: -10e9 },
        },
        {
          id: 'cb-govt-deposit-down',
          shift: { entityId: 'central-bank', side: 'liability', account: 'Government deposit', delta: -10e9 },
        },
        {
          id: 'govt-deposit-down',
          shift: { entityId: 'government', side: 'asset', account: 'Deposit at the central bank', delta: -10e9 },
        },
        {
          id: 'govt-bonds-down',
          shift: { entityId: 'government', side: 'liability', account: 'Bonds outstanding', delta: -10e9 },
        },
        {
          id: 'cb-reserves-up',
          shift: { entityId: 'central-bank', side: 'liability', account: 'Commercial bank reserves', delta: 10e9 },
          feedback:
            'QT drains reserves rather than creating them. Reserves fell earlier, when taxpayers moved money to the government’s account to fund this repayment.',
        },
        {
          id: 'cb-bonds-up',
          shift: { entityId: 'central-bank', side: 'asset', account: 'Government bonds', delta: 10e9 },
          feedback: 'The bond matured — it leaves the portfolio. Buying more would be the opposite of runoff.',
        },
        {
          id: 'govt-deposit-up',
          shift: { entityId: 'government', side: 'asset', account: 'Deposit at the central bank', delta: 10e9 },
          feedback: 'The government is paying, so its balance falls.',
        },
      ],
      expectedShifts: [
        { entityId: 'central-bank', side: 'asset', account: 'Government bonds', delta: -10e9 },
        { entityId: 'central-bank', side: 'liability', account: 'Government deposit', delta: -10e9 },
        { entityId: 'government', side: 'asset', account: 'Deposit at the central bank', delta: -10e9 },
        { entityId: 'government', side: 'liability', account: 'Bonds outstanding', delta: -10e9 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'contract',
          note: 'The central bank’s balance sheet is €10bn smaller. The money used to repay it no longer exists.',
        },
        {
          aggregate: 'M2',
          direction: 'contract',
          note: 'Taxpayers’ deposits fell to fund the repayment and nothing replaced them — unlike a bond repaid to a private investor, who receives a deposit back.',
        },
      ],
      explanation:
        'Both sheets shrink. The key contrast is with a bond held privately: when *that* matures, the government pays an investor who ends up with a deposit, so money moves rather than disappearing. When the holder is the central bank, the money is extinguished — exactly as repaying a bank loan destroys a deposit. QT is that, repeated on schedule, for years.',
    },

    {
      id: 'order-qt-limit',
      type: 'order_flow',
      tags: ['qt', 'reserves', 'crisis'],
      xp: 20,
      prompt: 'What eventually stops QT? Put the sequence in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'shrink',
          label: 'Reserves fall steadily as bonds mature',
          detail: 'Predictable, gradual, largely unremarked',
        },
        {
          id: 'ample',
          label: 'Reserves stop being obviously abundant',
          detail: 'Banks begin managing balances more carefully',
        },
        {
          id: 'volatile',
          label: 'Short-term rates start twitching on ordinary dates',
          detail: 'Quarter-ends and tax dates produce spikes that did not happen before',
        },
        {
          id: 'spike',
          label: 'A funding market dislocates',
          detail: 'Repo rates jump well above the policy corridor',
        },
        {
          id: 'stop',
          label: 'The central bank stops, and starts adding reserves again',
          detail: 'The floor was found by hitting it',
        },
      ],
      correctOrder: ['shrink', 'ample', 'volatile', 'spike', 'stop'],
      explanation:
        'This is a description of September 2019, when US repo rates spiked to nearly 10% intraday and the Fed began adding reserves within days. The uncomfortable lesson is that nobody knows in advance where "ample" ends — the level of reserves the system needs is not observable until you are below it. That is why QT is now run with more caution than QE ever was, and why the standing repo facility was created afterwards.',
    },

    {
      id: 'mc-qt-not-mirror',
      type: 'multiple_choice',
      tags: ['qt', 'policy'],
      xp: 15,
      prompt: 'Why is QT not simply QE run backwards?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'asymmetric',
          label: 'QE is announced and executed at will; QT proceeds at the pace bonds happen to mature',
        },
        {
          id: 'reversible',
          label: 'QE cannot be reversed at all',
          feedback:
            'It plainly can — balance sheets have shrunk substantially since 2022. The asymmetry is in control and speed, not possibility.',
        },
        {
          id: 'no-effect',
          label: 'QT has no effect on markets',
          feedback:
            'It affects the supply of duration the market must absorb. The debate is about magnitude, not existence.',
        },
        {
          id: 'illegal',
          label: 'Central banks are not permitted to sell',
          feedback:
            'The Bank of England has sold gilts actively. It is a policy choice, not a legal barrier.',
        },
      ],
      correctOptionId: 'asymmetric',
      explanation:
        'QE is a decision: buy this much, starting now. QT under runoff is a consequence: whatever matures this month leaves, and the schedule was fixed when the bonds were issued. The central bank can cap the pace but cannot accelerate it without selling. Add that the effects are uncertain — estimates of QT’s impact on long yields differ by an order of magnitude — and you get an instrument used far more tentatively than the one it undoes.',
    },
  ],
});
