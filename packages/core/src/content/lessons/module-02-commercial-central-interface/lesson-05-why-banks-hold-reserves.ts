/**
 * ============================================================================
 * Module 2 · Lesson 5 — "Reserves are not a lending fund"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to state what reserves are actually for
 * (settlement and withdrawals), and refute the "banks lend out their reserves"
 * model by following where a loan's money goes.
 *
 * Sources / further reading for reviewers:
 *   - Bank of England Quarterly Bulletin 2014 Q1, "Money creation in the modern
 *     economy" — explicitly rejects the reserves-first multiplier story.
 *   - Fed, "Reserve requirements" — set to zero in March 2020 and not restored.
 *
 * A note on rigour: Module 1's multiplier sim teaches the textbook ceiling.
 * This lesson is where the learner is told plainly that the causation in that
 * model runs the wrong way round in practice. That tension is deliberate and
 * should not be resolved by deleting either one — seeing the classic model and
 * then seeing why it misleads is the point.
 */

import { defineLesson } from '../../schema';

export const whyBanksHoldReservesLesson = defineLesson({
  id: 'why-banks-hold-reserves',
  title: 'What Reserves Are Actually For',
  subtitle: 'Not a pot of money waiting to be lent — a settlement balance.',
  icon: '🏧',
  difficulty: 'core',
  estimatedMinutes: 6,
  hearts: 3,

  keyTakeaways: [
    'Reserves exist to settle payments and meet cash withdrawals, not to be lent to customers.',
    'A bank cannot lend reserves to you: you have no reserve account, so they cannot move to you.',
    'Lending creates a deposit first; the reserves needed to settle any resulting payment are found afterwards.',
    'Several major central banks now set the reserve requirement to zero, and lending did not stop.',
  ],

  challenges: [
    {
      id: 'mc-lend-reserves',
      type: 'multiple_choice',
      tags: ['reserves', 'lending'],
      xp: 15,
      prompt: 'A bank has €500m of reserves. It makes you a €1m loan. What happens to the reserves at that moment?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'falls',
          label: 'They fall to €499m — the loan came out of them',
          feedback:
            'Nothing has left the bank yet. It created a deposit in your account; that is a new liability, not a transfer of an asset.',
        },
        {
          id: 'unchanged',
          label: 'Nothing — the loan created a deposit, and no payment has been made yet',
        },
        {
          id: 'rises',
          label: 'They rise, because the loan is a new asset',
          feedback:
            'The loan *is* a new asset, but it is a claim on you, not reserves. The reserve balance is untouched.',
        },
        {
          id: 'requirement',
          label: 'They fall by the reserve requirement on the new deposit',
          feedback:
            'A requirement determines how many reserves the bank must *hold*, not a payment it must make. And in the US and euro area that requirement is currently zero.',
        },
      ],
      correctOptionId: 'unchanged',
      explanation:
        'The loan expands both sides of the sheet — a new asset (your debt) and a new liability (your deposit) — and touches no reserves at all. Reserves only move when you *spend* the loan to someone at another bank. That is the sequence the multiplier story gets backwards: lending comes first and creates the deposit, and the settlement need appears afterwards, if at all.',
    },

    {
      id: 'order-loan-then-settlement',
      type: 'order_flow',
      tags: ['reserves', 'lending', 'settlement'],
      xp: 20,
      prompt: 'You borrow €1m and immediately buy a warehouse from someone at another bank. Order it.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'loan',
          label: 'The bank credits €1m to your account',
          detail: 'A new asset and a new liability appear together',
        },
        {
          id: 'broad',
          label: 'Broad money is now €1m larger',
          detail: 'The deposit did not exist a moment ago',
        },
        {
          id: 'pay',
          label: 'You pay the seller, who banks elsewhere',
          detail: 'Your deposit is extinguished; theirs is created',
        },
        {
          id: 'settle',
          label: 'Your bank transfers €1m of reserves to the seller’s bank',
          detail: 'Only now does central bank money move',
        },
        {
          id: 'borrow',
          label: 'If your bank is short, it borrows the reserves overnight',
          detail: 'From another bank, or from the central bank',
        },
      ],
      correctOrder: ['loan', 'broad', 'pay', 'settle', 'borrow'],
      explanation:
        'Notice where the reserves appear: last, and only if needed. The bank did not check its reserve balance before lending — it lent because you were creditworthy and the loan was profitable, then managed the settlement consequence afterwards. This is why economists say lending is constrained by capital and demand rather than by reserves: a solvent bank can always obtain reserves, at a price the central bank sets.',
    },

    {
      id: 'match-reserve-purposes',
      type: 'concept_match',
      tags: ['reserves', 'liquidity'],
      xp: 15,
      prompt: 'Match each item to what it constrains.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'reserves',
          term: 'Reserves',
          definition: 'What a bank settles payments and funds cash withdrawals with',
        },
        {
          id: 'capital',
          term: 'Capital',
          definition: 'The loss-absorbing buffer that limits how much a bank may lend',
        },
        {
          id: 'lcr',
          term: 'Liquidity coverage ratio',
          definition: 'A rule requiring enough liquid assets to survive a 30-day outflow',
        },
        {
          id: 'requirement',
          term: 'Reserve requirement',
          definition: 'A minimum reserve balance, now set to zero in several major systems',
        },
        {
          id: 'demand',
          term: 'Loan demand',
          definition: 'The binding constraint most of the time: someone creditworthy who wants to borrow',
        },
      ],
      explanation:
        'Ask what actually stops a bank lending more and the honest answer is rarely reserves. It is capital — every loan consumes some, and raising more is expensive — and it is the supply of borrowers worth lending to. In a recession banks sit on reserves and still do not lend, which is exactly what the multiplier model says cannot happen.',
    },

    {
      id: 'mc-zero-requirement',
      type: 'multiple_choice',
      tags: ['reserves', 'policy'],
      xp: 15,
      prompt: 'In March 2020 the Fed cut the reserve requirement to zero. What should the multiplier model have predicted?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'infinite',
          label: 'Infinite money creation — the multiplier is 1 / 0',
        },
        {
          id: 'nothing',
          label: 'No change at all',
          feedback:
            'The model has R in the denominator, so it cannot be indifferent to R going to zero. The point of this question is that the prediction is absurd.',
        },
        {
          id: 'small',
          label: 'A modest rise in lending',
          feedback:
            'That is the intuitive guess, but it is not what the arithmetic of M = D x (1/R) says as R approaches zero.',
        },
        {
          id: 'inflation',
          label: 'Immediate hyperinflation',
          feedback:
            'A consequence some predicted, but not what the multiplier model itself implies about the *quantity* of money.',
        },
      ],
      correctOptionId: 'infinite',
      explanation:
        'M = D x (1/R) goes to infinity as R goes to zero, so the model predicts unbounded money creation. Bank lending in fact grew slowly and inflation stayed low for another year. The requirement was never the binding constraint, so removing it changed almost nothing — which tells you the model describes an accounting ceiling that was not being touched, not the mechanism that determines how much banks lend.',
    },
  ],
});
