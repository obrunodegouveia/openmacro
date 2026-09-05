/**
 * ============================================================================
 * Module 3 · Lesson 3 — "The rate that actually sets rates"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to explain why paying interest on reserves lets a
 * central bank set the policy rate without changing the quantity of reserves,
 * and why that decoupled the balance sheet from the stance of policy.
 *
 * Sources / further reading for reviewers:
 *   - Fed, "Interest on Reserve Balances" (Regulation D), and the 2008
 *     Emergency Economic Stabilization Act which brought the power forward.
 *   - Ihrig, Meade & Weinbach, "Rewriting Monetary Policy 101" (JEP 2015).
 *
 * A note on rigour: IORB is not a perfect floor in practice — money market
 * funds cannot earn it, so rates can trade slightly below. That leak is the
 * reason the ON RRP facility exists, which is lesson 2's subject; this lesson
 * sets up the problem that one solves.
 */

import { defineLesson } from '../../schema';

export const iorbPolicyRateLesson = defineLesson({
  id: 'iorb-the-real-policy-rate',
  title: 'The Rate That Sets All the Others',
  subtitle: 'Paying banks to do nothing turns out to be the most powerful lever there is.',
  icon: '🎚️',
  difficulty: 'advanced',
  estimatedMinutes: 7,
  hearts: 3,

  keyTakeaways: [
    'Interest on reserves sets a floor: no bank lends to another below what it earns risk-free at the central bank.',
    'It lets the policy rate be set independently of how many reserves exist — the balance sheet and the stance came apart.',
    'This is why a central bank can run QE and raise rates at the same time without contradiction.',
    'The floor leaks, because some large lenders in the money market have no reserve account.',
  ],

  challenges: [
    {
      id: 'mc-why-floor',
      type: 'multiple_choice',
      tags: ['iorb', 'policy'],
      xp: 15,
      prompt: 'The central bank pays 4% on reserves. Would a bank lend reserves to another bank at 3.5%?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'yes-relationship',
          label: 'Yes, to maintain the relationship',
          feedback:
            'No amount of goodwill justifies lending at 3.5% with credit risk when 4% is available with none. Relationships are maintained in other ways.',
        },
        {
          id: 'no-worse',
          label: 'No — it would be taking credit risk to earn less than the risk-free alternative',
        },
        {
          id: 'yes-required',
          label: 'Yes, if it has excess reserves it must place somewhere',
          feedback:
            'Reserves do not have to be placed anywhere. Left alone they sit at the central bank earning 4%, which is precisely why 4% is a floor.',
        },
        {
          id: 'depends',
          label: 'Only if the borrower is very safe',
          feedback:
            'Even a perfectly safe borrower is worse than the central bank at a lower rate. Safety cannot make up a negative spread.',
        },
      ],
      correctOptionId: 'no-worse',
      explanation:
        'This is the whole mechanism. The central bank does not command the interbank rate; it makes any lower rate irrational by offering a risk-free alternative. Every bank faces the same arithmetic, so the market rate settles at or just above the rate on reserves — no quantity adjustment required.',
    },

    {
      id: 'order-old-vs-new',
      type: 'order_flow',
      tags: ['iorb', 'policy', 'history'],
      xp: 20,
      prompt: 'How did the Fed raise rates *before* 2008? Put the old mechanism in order.',
      instructions: 'Earliest step at the top',
      events: [
        {
          id: 'target',
          label: 'The committee announces a target for the funds rate',
          detail: 'A number, not yet a mechanism',
        },
        {
          id: 'estimate',
          label: 'The desk estimates how many reserves the system needs',
          detail: 'Scarcity is what makes the rate move at all',
        },
        {
          id: 'sell',
          label: 'It sells securities to drain reserves',
          detail: 'Fewer reserves in the system than banks want',
        },
        {
          id: 'scramble',
          label: 'Banks short of reserves bid against each other',
          detail: 'Competition for a scarce asset lifts its price',
        },
        {
          id: 'hits',
          label: 'The market rate rises to the target',
          detail: 'Hit approximately, and re-estimated daily',
        },
      ],
      correctOrder: ['target', 'estimate', 'sell', 'scramble', 'hits'],
      explanation:
        'The old system worked only because reserves were scarce — a few tens of billions for the whole US banking system, so small changes in supply moved the price. After QE there were trillions, and draining enough to recreate scarcity would have meant unwinding the entire portfolio. Paying interest on reserves solved that: the rate could be set by announcement while the balance sheet stayed exactly where policy wanted it.',
    },

    {
      id: 'mc-decoupling',
      type: 'multiple_choice',
      tags: ['iorb', 'qe', 'policy'],
      xp: 15,
      prompt: 'In 2022 the Fed raised rates sharply while still holding trillions in bonds. Contradiction?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'yes',
          label: 'Yes — a large balance sheet is loose policy by definition',
          feedback:
            'This equates two things that IORB separated. The size of the balance sheet and the level of the policy rate are now independent settings.',
        },
        {
          id: 'no-separate',
          label: 'No — the rate is set by what it pays on reserves, not by how many there are',
        },
        {
          id: 'temporary',
          label: 'It works briefly, but the reserves must eventually force rates down',
          feedback:
            'They do not. Abundant reserves push the rate *to the floor* — and the central bank chooses where the floor is.',
        },
        {
          id: 'accounting',
          label: 'Only because of an accounting technicality',
          feedback:
            'There is nothing technical about it. Banks genuinely will not lend below the risk-free rate available to them, and that is an economic fact rather than a convention.',
        },
      ],
      correctOptionId: 'no-separate',
      explanation:
        'Before 2008 the two were welded together: changing the rate meant changing the quantity of reserves. Now they are separate instruments. The balance sheet is used for one job — influencing longer-term yields and market functioning — and the policy rate for another. This is also why QT and rate rises can proceed at different speeds, and why arguments that "the balance sheet must shrink before rates can rise" turned out to be wrong.',
    },

    {
      id: 'mc-floor-leak',
      type: 'multiple_choice',
      tags: ['iorb', 'money-markets'],
      xp: 20,
      prompt: 'Money market funds sometimes lend below the rate banks earn on reserves. How is that possible?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'irrational',
          label: 'They are behaving irrationally',
          feedback:
            'They are doing the best they can. The alternative they lack is the one that would make the behaviour irrational.',
        },
        {
          id: 'no-account',
          label: 'They have no reserve account, so the floor is not available to them',
        },
        {
          id: 'regulation',
          label: 'Regulation forces them to lend',
          feedback:
            'No rule obliges a fund to lend at a bad rate. Their problem is where else to put the cash.',
        },
        {
          id: 'higher-risk',
          label: 'They are compensated by taking more risk',
          feedback:
            'They are accepting *less* return, which is the puzzle. Risk-taking would explain a higher rate, not a lower one.',
        },
      ],
      correctOptionId: 'no-account',
      explanation:
        'Only banks and a few approved institutions may hold reserves. A money market fund with cash to place must lend it to someone, and if the best available bid is below the IORB rate, it takes it — a bank borrowing there and depositing at the central bank pockets the difference. That leak is exactly why the ON RRP facility was built: it extends a floor to non-banks, which is the subject of this module’s lesson on the ON RRP.',
    },
  ],
});
