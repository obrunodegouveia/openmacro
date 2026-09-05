/**
 * ============================================================================
 * Module 2 · Lesson 6 — "The price of a night's liquidity"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to explain what an overnight rate is a price
 * *of*, why a benchmark built on actual transactions replaced one built on
 * estimates, and how the quantity of excess reserves moves the rate within a
 * corridor.
 *
 * Sources / further reading for reviewers:
 *   - New York Fed, SOFR methodology; ECB, €STR methodology.
 *   - FCA and DOJ findings on LIBOR manipulation (2012 onwards).
 *
 * A note on rigour: the corridor sim uses a linear glide from ceiling to floor,
 * which no real system exhibits — the relationship is convex and shifts with
 * regulation and market structure. The shape being taught is directional:
 * abundant reserves pin the rate near the floor, scarcity pushes it up.
 */

import { defineLesson } from '../../schema';

export const overnightRatesLesson = defineLesson({
  id: 'overnight-rates',
  title: 'The Price of a Night’s Liquidity',
  subtitle: 'What SOFR and €STR measure, and why LIBOR had to die.',
  icon: '🌙',
  difficulty: 'advanced',
  estimatedMinutes: 8,
  hearts: 3,

  keyTakeaways: [
    'An overnight rate is the price of borrowing reserves until tomorrow — the shortest, safest rate there is.',
    'LIBOR was a survey of estimates and was manipulated; SOFR and €STR are computed from actual transactions.',
    'Where the rate sits inside the central bank’s corridor depends on how plentiful reserves are.',
    'When reserves are abundant the rate pins near the floor, and the central bank steers by moving the floor rather than the quantity.',
  ],

  challenges: [
    {
      id: 'mc-what-is-overnight',
      type: 'multiple_choice',
      tags: ['rates', 'money-markets'],
      xp: 10,
      prompt: 'Bank A borrows €200m from Bank B until tomorrow morning. What is being traded?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'deposits',
          label: 'Customer deposits',
          feedback:
            'Deposits belong to customers and cannot be lent between banks. What moves between banks is reserves.',
        },
        {
          id: 'reserves',
          label: 'Reserves — central bank money, for one night',
        },
        {
          id: 'bonds',
          label: 'Government bonds',
          feedback:
            'Bonds are often *collateral* for such a loan, in which case it is a repo. The thing borrowed is still reserves.',
        },
        {
          id: 'capital',
          label: 'Capital',
          feedback:
            'Capital is equity — it cannot be borrowed overnight. Borrowing adds a liability and so does not raise capital at all.',
        },
      ],
      correctOptionId: 'reserves',
      explanation:
        'The overnight market is where banks that ended the day with more reserves than they need lend to banks that ended short. The rate on that trade is the shortest, most heavily collateralised price in the financial system, which is why it anchors nearly everything else: a mortgage or a corporate loan is ultimately priced off the expected path of this one number.',
    },

    {
      id: 'match-benchmark-rates',
      type: 'concept_match',
      tags: ['rates', 'benchmarks'],
      xp: 15,
      prompt: 'Match each benchmark or term to what it is.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'sofr',
          term: 'SOFR',
          definition: 'US overnight rate computed from actual Treasury repo transactions',
        },
        {
          id: 'estr',
          term: '€STR',
          definition: 'Euro area overnight rate computed from banks’ unsecured borrowing',
        },
        {
          id: 'libor',
          term: 'LIBOR',
          definition: 'A retired benchmark based on what banks estimated they could borrow at',
        },
        {
          id: 'repo',
          term: 'Repo',
          definition: 'A loan secured by securities sold now and bought back tomorrow',
        },
        {
          id: 'corridor',
          term: 'Corridor',
          definition: 'The band between the rate the central bank pays and the rate it charges',
        },
      ],
      explanation:
        'The difference between an estimate and a transaction is the whole story of the LIBOR scandal. Banks were asked what they *thought* they could borrow at, with no obligation to have borrowed anything — and traders leaned on the submitters to move the number in whichever direction their book needed. SOFR cannot be manipulated the same way because it is a volume-weighted median of trades that actually happened.',
    },

    {
      id: 'sim-corridor',
      type: 'interactive_sim',
      tags: ['rates', 'corridor', 'policy'],
      xp: 30,
      prompt: 'Where does the overnight rate settle?',
      instructions: 'Change how much excess liquidity is in the system',
      narrative:
        'The central bank pays 3% on reserves and lends at 4%. Between those two numbers, where the market rate sits is decided by how many spare reserves are chasing a home.',
      constants: { floorRate: 0.03, ceilingRate: 0.04, saturationPoint: 500e9 },
      sliders: [
        {
          key: 'excessReserves',
          label: 'Excess reserves in the system',
          min: 0,
          max: 800e9,
          step: 50e9,
          defaultValue: 0,
          format: 'currency',
          hint: 'Reserves above what banks need to settle',
        },
      ],
      readouts: [
        {
          key: 'corridor_rate',
          label: 'Where the overnight rate settles',
          formulaId: 'corridor_rate',
          format: 'percent',
          emphasis: true,
          caption: 'Between the 3% floor and the 4% ceiling',
        },
      ],
      objective: {
        description: 'Flood the system and pin the rate to the floor',
        requiredObservations: [
          { sliderKey: 'excessReserves', values: [0, 250e9, 800e9] },
        ],
        target: { readoutKey: 'corridor_rate', comparator: 'lte', value: 0.0301 },
      },
      explanation:
        'With no spare reserves, a bank that needs them must pay close to the central bank’s lending rate — the ceiling. Flood the system and no bank needs to borrow from another, so nobody will lend below what the central bank itself pays: the rate collapses onto the floor. This is the difference between a *scarce reserves* regime, where the central bank steers by adjusting quantity, and the *abundant reserves* regime most now run, where quantity is irrelevant at the margin and policy works by moving the floor. It is also why paying interest on reserves became the main policy tool after 2008.',
    },

    {
      id: 'mc-floor-system',
      type: 'multiple_choice',
      tags: ['rates', 'policy'],
      xp: 15,
      prompt: 'In an abundant-reserves system, how does a central bank raise the overnight rate?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'drain',
          label: 'Drain reserves until the market rate rises',
          feedback:
            'That is the scarce-reserves method, and it would take an enormous drain to bite. With trillions of excess reserves, removing a few billion changes nothing.',
        },
        {
          id: 'raise-floor',
          label: 'Raise the rate it pays on reserves, and the market follows',
        },
        {
          id: 'instruct',
          label: 'Instruct banks to charge each other more',
          feedback:
            'Central banks do not set private prices by decree. They change the terms on which they themselves deal, and the market reprices around that.',
        },
        {
          id: 'sell-bonds',
          label: 'Sell bonds to push yields up',
          feedback:
            'Selling bonds affects longer maturities and drains reserves slowly. It is not how the overnight rate is set.',
        },
      ],
      correctOptionId: 'raise-floor',
      explanation:
        'No bank will lend reserves to another bank for less than it can earn risklessly at the central bank. Raising that deposit rate lifts the whole overnight market with it, without moving the quantity of reserves at all. This is why post-2008 central banks could run huge balance sheets and still control rates precisely — the two had been decoupled, and the size of the balance sheet stopped being a monetary policy setting.',
    },
  ],
});
