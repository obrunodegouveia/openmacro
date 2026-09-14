/**
 * ============================================================================
 * Module 5 · Lesson 1 — "The plumbing, explained from a bicycle upwards"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to say what a repo is without using the word
 * collateral, explain how quantitative tightening destroys money, post a QT
 * runoff by hand, and account for why overnight cash cost 10% on a day when
 * nothing was wrong with the collateral.
 *
 * Why this lesson exists, and why it opens the module
 * --------------------------------------------------
 * Module 5 began at `core` and climbed to `advanced`. There was no way in. A
 * reader who wants to understand the Fed's balance sheet because they read
 * something alarming about it had to start with the H.4.1 release itself.
 *
 * So this is the on-ramp, and it is deliberately built as a ramp rather than a
 * flat intro: challenge 1 is a bicycle and challenge 6 is why nobody can
 * publish the number that would have prevented the whole episode. A twelve
 * year old should get through the first two and learn something true; an adult
 * should reach the end and find the mechanism intact, not a simplification
 * they will later have to unlearn.
 *
 * The ordering is the argument. Repo first (what the market is), then QT (what
 * was draining it), then the postings (where the money actually goes), then
 * the sequence of the night itself, then the taxonomy that explains why the
 * drain was invisible, and finally the point: the floor is discovered by
 * hitting it.
 *
 * Sources / further reading for reviewers:
 *   - Federal Reserve Bank of New York, SOFR data for 17 September 2019 —
 *     the 5.25% fixing, against a 2.00–2.25% target range.
 *   - BIS Quarterly Review, December 2019, "September stress in dollar repo
 *     markets: passing or structural?" — the standard account.
 *   - Federal Reserve H.4.1, reserve balances through 2019.
 *
 * A note on rigour: the intraday 10% print is widely reported and was a high,
 * not a fixing — the benchmark settled at 5.25%. The lesson says both, because
 * a learner who quotes 10% as "the rate that day" has been taught something
 * they will be corrected on.
 */

import { defineLesson } from '../../schema';

export const theNightCashCostTenPercentLesson = defineLesson({
  id: 'the-night-cash-cost-ten-percent',
  title: 'The Night Cash Cost 10%',
  subtitle:
    'Nothing was wrong with the collateral. The plumbing had simply run dry, and nobody knew where the bottom was.',
  icon: '🔧',
  difficulty: 'intro',
  estimatedMinutes: 9,
  hearts: 3,

  keyTakeaways: [
    'A repo is an overnight loan where the lender holds something valuable until they are paid back. Banks do it with government bonds instead of bicycles.',
    'Quantitative tightening destroys money: a bond matures, the central bank does not replace it, and the reserves used to pay for the replacement cease to exist.',
    'Reserves are whatever is left on the central bank’s liability side after notes, the government’s account and the money funds have taken their share.',
    'Nobody publishes how many reserves the system needs. It is discovered by going below it.',
  ],

  challenges: [
    // ---- the ramp starts as low as it can -------------------------------
    {
      id: 'mc-the-bicycle',
      type: 'multiple_choice',
      tags: ['repo', 'collateral'],
      xp: 10,
      prompt:
        'Your friend needs £10 today. You lend it, and they leave their bicycle with you until they pay you back tomorrow. They never come back. What happens?',
      explanation:
        'You keep the bicycle, and you do not have to ask anyone’s permission — it is already in your hallway. You have just done a repo. Banks do exactly this every night, with government bonds instead of bicycles, and it is the largest lending market in the world: trillions of dollars, every single night. The word for the bicycle is collateral. The reason the deal is legally written as a *sale* rather than a loan is precisely so that "you keep the bicycle" needs no court and no queue.',
      options: [
        { id: 'keep', label: 'You keep the bicycle' },
        {
          id: 'lose',
          label: 'You lose your £10',
          feedback:
            'You are holding something worth more than £10. That is the whole reason you agreed — the bicycle is what makes the loan safe.',
        },
        {
          id: 'sue',
          label: 'You have to take them to court to get your money',
          feedback:
            'That is what happens with an unsecured loan. Holding the bicycle is what lets you skip the court entirely, and that is the point of the arrangement.',
        },
        {
          id: 'return',
          label: 'You must return the bicycle and write off the £10',
          feedback:
            'Then the bicycle would have served no purpose. It is there precisely so that you are not left empty-handed.',
        },
      ],
      correctOptionId: 'keep',
    },

    // ---------------------------------------------------------------------
    {
      id: 'mc-what-qt-does',
      type: 'multiple_choice',
      tags: ['quantitative-tightening', 'money-creation'],
      xp: 15,
      prompt:
        'The Fed owns a bond. It matures, and this time the Fed does not buy a replacement. What happens to the money that was created when it first bought that bond?',
      explanation:
        'It is destroyed. That is quantitative tightening, and it is done almost entirely this way — by letting bonds mature and not replacing them, rather than by selling anything. Creation runs backwards: the government repays the Fed, then sells a new bond to a private buyer to get the cash back, and the reserves that buyer pays with disappear into the Fed. The money does not move somewhere else. It stops existing, exactly as it started existing.',
      options: [
        { id: 'destroyed', label: 'It is destroyed — it stops existing' },
        {
          id: 'government',
          label: 'It goes to the government',
          feedback:
            'The government repaid the Fed; it did not receive anything. Follow the direction of travel — money moved *to* the central bank, and a liability that returns to its issuer is extinguished.',
        },
        {
          id: 'vault',
          label: 'It sits in the Fed’s vault',
          feedback:
            'There is no vault of reserves. Reserves are an entry on the Fed’s liability side, and an entry that is owed to nobody is not stored — it is gone.',
        },
        {
          id: 'profit',
          label: 'It becomes the Fed’s profit',
          feedback:
            'The Fed got its money back, not a gain. It lent by buying and was repaid; net worth is where it started.',
        },
      ],
      correctOptionId: 'destroyed',
    },

    // ---- now the real mechanism, posted by hand -------------------------
    {
      id: 'ta-qt-runoff',
      type: 't_account_flow',
      tags: ['quantitative-tightening', 'balance-sheets', 'reserves'],
      xp: 30,
      prompt: 'Post a $100B quantitative tightening runoff.',
      instructions: 'Pick an entry, then choose whose sheet it lands on and which side',
      scenario:
        'A $100B bond the Fed holds matures. The Treasury repays the Fed, then sells a new $100B bond to a commercial bank to replace the cash — so the government’s own account ends where it began, and only the Fed and the bank are left changed. Four entries are needed; three of the seven do not belong.',
      currency: 'USD',
      entities: [
        {
          id: 'fed',
          label: 'Federal Reserve',
          tier: 'central_bank',
          role: 'Not replacing what matured',
          openingLines: [
            { account: 'US Treasuries', side: 'asset', amount: 5000e9 },
            { account: 'Bank reserves', side: 'liability', amount: 3200e9 },
            { account: 'Notes in circulation', side: 'liability', amount: 2300e9 },
          ],
        },
        {
          id: 'bank',
          label: 'Commercial Bank',
          tier: 'commercial_bank',
          role: 'Buying the replacement bond',
          openingLines: [
            { account: 'US Treasuries', side: 'asset', amount: 400e9 },
            { account: 'Reserves at the Fed', side: 'asset', amount: 300e9 },
            { account: 'Customer deposits', side: 'liability', amount: 650e9 },
          ],
        },
      ],
      options: [
        {
          id: 'fed-bonds-down',
          shift: { entityId: 'fed', side: 'asset', account: 'US Treasuries', delta: -100e9 },
        },
        {
          id: 'fed-reserves-down',
          shift: { entityId: 'fed', side: 'liability', account: 'Bank reserves', delta: -100e9 },
        },
        {
          id: 'bank-bonds-up',
          shift: { entityId: 'bank', side: 'asset', account: 'US Treasuries', delta: 100e9 },
        },
        {
          id: 'bank-reserves-down',
          shift: { entityId: 'bank', side: 'asset', account: 'Reserves at the Fed', delta: -100e9 },
        },
        {
          id: 'fed-notes-down',
          shift: { entityId: 'fed', side: 'liability', account: 'Notes in circulation', delta: -100e9 },
          feedback:
            'Nobody handed in any cash. Notes only leave circulation when the public deposits them, and the public was not part of this at all.',
        },
        {
          id: 'bank-deposits-down',
          shift: { entityId: 'bank', side: 'liability', account: 'Customer deposits', delta: -100e9 },
          feedback:
            'The bank bought the bond with its own reserves, not with its customers’ money. No depositor lost anything — which is why QT drains bank liquidity without anyone noticing in their account.',
        },
        {
          id: 'fed-bonds-up',
          shift: { entityId: 'fed', side: 'asset', account: 'US Treasuries', delta: 100e9 },
          feedback:
            'That is the QE entry, not the QT one. Not replacing a matured bond means the Fed’s holdings go down, not up.',
        },
      ],
      expectedShifts: [
        { entityId: 'fed', side: 'asset', account: 'US Treasuries', delta: -100e9 },
        { entityId: 'fed', side: 'liability', account: 'Bank reserves', delta: -100e9 },
        { entityId: 'bank', side: 'asset', account: 'US Treasuries', delta: 100e9 },
        { entityId: 'bank', side: 'asset', account: 'Reserves at the Fed', delta: -100e9 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'contract',
          note: 'Base money fell by $100B. The reserves the bank paid with returned to their issuer and ceased to exist.',
        },
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'No deposit moved. This is why QT can drain the banking system for two years without touching anybody’s current account.',
        },
        {
          aggregate: 'collateral',
          direction: 'expand',
          note: 'The bond went back to a private holder. QT returns collateral to the market exactly as QE removed it.',
        },
      ],
      explanation:
        'Both sides of the Fed shrank by $100B at once, and the commercial bank’s total did not change at all — it swapped reserves for a bond. That swap is the danger hiding in QT. The bank is no poorer, its customers see nothing, and its balance sheet is the same size; but the part of it that can be paid out overnight just fell by $100B. Do this every month for two years and the system is steadily less able to meet a sudden demand for cash, with no line in anybody’s accounts flashing red.',
    },

    // ---------------------------------------------------------------------
    {
      id: 'of-september-2019',
      type: 'order_flow',
      tags: ['repo', 'reserves', 'september-2019'],
      xp: 25,
      prompt: 'Put September 2019 in order. How did overnight cash come to cost 10%?',
      instructions: 'Earliest cause at the top',
      explanation:
        'No policy decision was made, and nothing was wrong with the collateral — these were US Treasuries, the safest asset there is. Two ordinary drains landed in the same week on a reserve base that two years of QT had already thinned to roughly $1.4 trillion, and banks holding cash declined to lend it at any price they were offered. The benchmark, SOFR, fixed at 5.25% against a target range of 2.00–2.25%, and individual trades printed around 10% intraday. The Fed intervened with overnight repo operations — its first since the financial crisis — and then began buying Treasury bills to rebuild reserves.',
      events: [
        {
          id: 'qt',
          label: 'Two years of QT drain reserves',
          detail: 'Bonds mature, the Fed does not replace them, reserves fall month after month',
        },
        {
          id: 'tax',
          label: 'Quarterly corporate tax date',
          detail: 'Companies draw down deposits to pay; reserves move into the government’s account',
        },
        {
          id: 'settlement',
          label: 'A large Treasury settlement lands the same week',
          detail: 'Dealers must pay for newly issued bonds, draining reserves again',
        },
        {
          id: 'hoard',
          label: 'Banks holding cash decline to lend it',
          detail: 'Intraday liquidity needs and balance-sheet limits outweigh the return offered',
        },
        {
          id: 'spike',
          label: 'Overnight repo prints around 10%',
          detail: 'SOFR fixes at 5.25%, against a policy ceiling of 2.25%',
        },
        {
          id: 'fed',
          label: 'The Fed lends against collateral, then buys bills',
          detail: 'Its first repo operations since the financial crisis',
        },
      ],
      correctOrder: ['qt', 'tax', 'settlement', 'hoard', 'spike', 'fed'],
    },

    // ---------------------------------------------------------------------
    {
      id: 'cm-liability-or-money',
      type: 'concept_match',
      tags: ['reserves', 'base-money', 'balance-sheets'],
      xp: 20,
      prompt: 'All four are on the Fed’s books, or nearly. Match each to what it actually is.',
      explanation:
        'Same issuer, same balance sheet, four different meanings — decided entirely by who holds the thing. That is why the drain was invisible: when tax money moves from a bank’s reserve account into the government’s account, the Fed’s total liabilities do not change by a cent. Nothing looks smaller. But base money fell, because the dollars crossed out of the banking system into an account no bank can lend against.',
      pairs: [
        {
          id: 'note',
          term: 'A banknote in circulation',
          definition: 'A Fed liability, and base money',
        },
        {
          id: 'reserves',
          term: 'A bank’s reserves at the Fed',
          definition: 'A Fed liability, and base money',
        },
        {
          id: 'tga',
          term: 'The government’s account at the Fed',
          definition: 'A Fed liability, but not base money — no bank can lend it',
        },
        {
          id: 'unissued',
          term: 'A note still in the Fed’s own vault',
          definition: 'Neither. It is paper the Fed happens to own',
        },
      ],
    },

    // ---- and the point ---------------------------------------------------
    {
      id: 'mc-the-floor',
      type: 'multiple_choice',
      tags: ['reserves', 'september-2019'],
      xp: 20,
      prompt: 'Why did nobody stop QT before reserves fell too far?',
      explanation:
        'Because the number does not exist until you cross it. How many reserves the system needs is not a published figure — it depends on how banks behave under stress, which regulations bind that quarter, and how unevenly the reserves are distributed between institutions. The Fed was not asleep; it was estimating a floor nobody could observe. That is what "reserves are the residual" finally means in practice: the Fed sets the size of its assets, every other claim on its liability side takes its share first, banks live on what is left, and the adequacy of what is left is discovered by finding out. Every QT programme since has been run watching repo spreads like a pulse.',
      options: [
        {
          id: 'unknowable',
          label: 'The level the system needs is not published — it is discovered by going below it',
        },
        {
          id: 'asleep',
          label: 'The Fed was not paying attention to the data',
          feedback:
            'It was watching closely and publishing the numbers weekly. The problem was not the data — it was that no amount of data tells you where a threshold is until something touches it.',
        },
        {
          id: 'lied',
          label: 'Banks hid how little cash they had',
          feedback:
            'Reserve balances are reported to the Fed by definition — it is the Fed’s own liability. The quantity was known exactly. What was unknown was how much would turn out to be enough.',
        },
        {
          id: 'delayed',
          label: 'The balance sheet data comes out too late to act on',
          feedback:
            'The H.4.1 is published every Thursday, and reserve balances are visible daily to the Fed. Timeliness was not the constraint.',
        },
      ],
      correctOptionId: 'unknowable',
    },
  ],
});
