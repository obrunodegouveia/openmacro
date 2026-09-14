/**
 * ============================================================================
 * Module 4 · Lesson 7 — "Reading a crisis while it happens"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The capstone. The learner should be able to take an unlabelled set of
 * symptoms, classify the kind of crisis, and predict which instrument will be
 * used — drawing on every module rather than any single one.
 *
 * Sources / further reading for reviewers:
 *   - The episodes referenced: 2008, the euro crisis, September 2019, March
 *     2020, and the March 2023 regional bank failures.
 *
 * A note on rigour: the diagnostic offered here is a heuristic, not a
 * classification system. Real crises mix categories, and the final challenge
 * says so explicitly — a learner who thinks every episode has one clean label
 * has learned the wrong lesson from a course that spent four modules
 * separating mechanisms.
 */

import { defineLesson } from '../../schema';

export const readingACrisisLesson = defineLesson({
  id: 'reading-a-crisis',
  title: 'Reading a Crisis While It Happens',
  subtitle: 'Four kinds of trouble, four different tools. Telling them apart is the whole skill.',
  icon: '🧭',
  difficulty: 'advanced',
  estimatedMinutes: 9,
  hearts: 3,

  keyTakeaways: [
    'Liquidity, solvency, market functioning and currency crises look alike from outside and need different tools.',
    'Lending against good collateral fixes illiquidity and only postpones insolvency.',
    'Buying to restore trading is not stimulus, even though the operation looks identical.',
    'Most real episodes are mixtures, and the first job is working out which parts you are looking at.',
  ],

  challenges: [
    {
      id: 'match-crisis-types',
      type: 'concept_match',
      tags: ['crisis', 'diagnosis'],
      xp: 20,
      prompt: 'Match each kind of crisis to the tool that addresses it.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'liquidity',
          term: 'Liquidity crisis',
          definition: 'Good assets, no cash — met by lending against collateral',
        },
        {
          id: 'solvency',
          term: 'Solvency crisis',
          definition: 'Assets worth less than debts — met by recapitalisation or resolution',
        },
        {
          id: 'functioning',
          term: 'Market dysfunction',
          definition: 'Willing buyers and sellers who cannot trade — met by a market maker of last resort',
        },
        {
          id: 'currency',
          term: 'Currency crisis',
          definition: 'A price that cannot be defended — met by reserves, rates, or letting it go',
        },
        {
          id: 'dollar',
          term: 'Offshore dollar shortage',
          definition: 'Dollar debts abroad with no dollar issuer behind them — met by swap lines',
        },
      ],
      explanation:
        'The tools are not interchangeable, and using the wrong one wastes time you do not have. Lending to an insolvent bank buys a few days and leaves the public with the losses. Recapitalising a bank that was merely illiquid is an expensive intervention nobody needed. The diagnosis is the decision.',
    },

    {
      id: 'mc-diagnose-2020',
      type: 'multiple_choice',
      tags: ['crisis', 'diagnosis'],
      xp: 20,
      prompt: 'March 2020: Treasury yields spike, spreads blow out, and everyone wants cash. Banks are well capitalised. What is this?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'solvency',
          label: 'A solvency crisis',
          feedback:
            'The premise rules it out — banks entered 2020 with far more capital than 2008, and the assets being sold were sound.',
        },
        {
          id: 'functioning',
          label: 'Market dysfunction — the assets are fine, but they cannot be traded at a sensible price',
        },
        {
          id: 'currency',
          label: 'A currency crisis',
          feedback:
            'The dollar strengthened rather than collapsing. If anything the world wanted more of it, which is the opposite of a currency crisis.',
        },
        {
          id: 'inflation',
          label: 'An inflation crisis',
          feedback:
            'Inflation arrived later and for different reasons. In March 2020 the immediate fear was deflationary.',
        },
      ],
      correctOptionId: 'functioning',
      explanation:
        'The tell is that the *safest* asset was the one dislocating. Credit problems show up in risky assets first; when Treasuries stop trading properly it is the plumbing, not the credit. That is why the response was buying on an enormous scale over three weeks and then stopping — a market maker restoring function, not a stimulus programme, even though the operations were indistinguishable on paper.',
    },

    {
      id: 'order-diagnostic',
      type: 'order_flow',
      tags: ['crisis', 'diagnosis'],
      xp: 25,
      prompt: 'You are handed an unfolding crisis. What do you check, in what order?',
      instructions: 'First question at the top',
      events: [
        {
          id: 'solvent',
          label: 'Are the assets actually worth what the books say?',
          detail: 'Everything else depends on this answer',
        },
        {
          id: 'currency',
          label: 'Is the debt in a currency the borrower can issue?',
          detail: 'Decides whether default is a choice or a necessity',
        },
        {
          id: 'who-holds',
          label: 'Who holds the exposure, and can they absorb it?',
          detail: 'Banks, funds, households, or the state',
        },
        {
          id: 'trading',
          label: 'Are markets still functioning, or just falling?',
          detail: 'A falling market is working; a frozen one is not',
        },
        {
          id: 'tool',
          label: 'Which institution has the tool, and the authority to use it?',
          detail: 'A central bank cannot recapitalise; a treasury cannot lend overnight',
        },
      ],
      correctOrder: ['solvent', 'currency', 'who-holds', 'trading', 'tool'],
      explanation:
        'Solvency comes first because it determines whether any amount of lending helps. Currency comes second because it determines whether the sovereign has an escape at all — the difference between Italy and the UK from the doom loop lesson. The last question is the one most often skipped: central banks can lend but cannot spend public money, treasuries can recapitalise but cannot act overnight, and resolution authorities can impose losses but only within a legal hierarchy. Knowing which crisis you have is useless if the institution facing it lacks the instrument.',
    },

    {
      id: 'mc-mixtures',
      type: 'multiple_choice',
      tags: ['crisis', 'diagnosis'],
      xp: 20,
      prompt: '2008 involved bad mortgages, frozen funding markets, and a global dollar shortage at once. What does that tell you?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'categories-useless',
          label: 'The categories are useless',
          feedback:
            'They are what let you see that three distinct problems were present, each needing its own response. Without them 2008 is just "everything went wrong".',
        },
        {
          id: 'mixtures',
          label: 'Real crises mix categories, and each component still needs its own tool',
        },
        {
          id: 'one-cause',
          label: 'There is always one true underlying cause',
          feedback:
            'Tempting and misleading. Fixing the mortgages would not have unfrozen the eurodollar market, and the swap lines did nothing about the mortgages.',
        },
        {
          id: 'unpredictable',
          label: 'Crises cannot be analysed while they happen',
          feedback:
            'They can, imperfectly, and the responses in 2008 and 2020 improved as officials worked out which problem they were facing.',
        },
      ],
      correctOptionId: 'mixtures',
      explanation:
        'The three problems in 2008 needed three different answers: capital for the insolvent banks, lending against collateral for the illiquid ones, and swap lines for the offshore dollar shortage. Each was deployed, at different times, by different institutions, and the parts that went slowly were the parts where the diagnosis was contested. That is the skill this course has been building toward — not predicting the next crisis, but recognising which mechanism you are watching while it is still running.',
    },
  ],
});
