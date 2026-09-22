import { defineLesson } from '../../schema';

/**
 * The confusion that makes every other conversation about banks harder than
 * it needs to be: capital is not money the bank has, it is money the bank
 * does not owe.
 */
export const capitalIsNotCashLesson = defineLesson({
  id: 'capital-is-not-cash',
  title: 'Capital Is Not a Pot of Money',
  subtitle:
    'It is on the right-hand side of the balance sheet. Everything confusing about bank regulation starts by forgetting that.',
  icon: '🧱',
  difficulty: 'core',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-what-capital-is',
      type: 'multiple_choice',
      tags: ['capital', 'balance-sheet'],
      xp: 25,
      prompt: 'A regulator tells a bank to raise its capital. What is it being told to do?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'funding',
          label: 'Fund more of its assets with money nobody can demand back',
        },
        {
          id: 'set-aside',
          label: 'Set aside a reserve of cash against future losses',
          feedback:
            'The commonest misreading, and it is on the wrong side of the sheet. Capital is not an asset the bank holds; it is a form of funding. A bank can raise capital and lend every cent of it out the same afternoon.',
        },
        {
          id: 'lend-less',
          label: 'Lend less',
          feedback:
            'A consequence sometimes, not the instruction. A bank can meet the requirement by issuing shares and lending exactly as much as before — which is precisely the argument for making it do so in good times.',
        },
        {
          id: 'reserves',
          label: 'Hold more reserves at the central bank',
          feedback:
            'Those are an asset, and a different requirement entirely. Confusing capital with reserves is how people conclude that capital rules "take money out of the economy", which they do not.',
        },
      ],
      correctOptionId: 'funding',
      explanation:
        'Assets are funded by deposits, by borrowing, and by capital. The first two have to be repaid; the third does not. So capital is the share of the bank’s assets that can fall in value without anyone being left unpaid — a loss-absorbing layer, measured in how the bank is financed rather than in what it holds. The bank is not sitting on it. It is lent out like everything else.',
    },
    {
      id: 'match-three-requirements',
      type: 'concept_match',
      tags: ['capital', 'liquidity', 'regulation'],
      xp: 30,
      prompt:
        'Three requirements that get muddled constantly. Match each to the question it answers.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'capital',
          term: 'Capital requirement',
          definition: 'Can it absorb losses and stay solvent? — a question about the funding mix',
        },
        {
          id: 'liquidity',
          term: 'Liquidity requirement',
          definition: 'Can it pay what is demanded this month? — a question about the assets it holds',
        },
        {
          id: 'reserves',
          term: 'Reserve requirement',
          definition: 'A minimum balance at the central bank, set to zero in much of the world since 2020',
        },
      ],
      explanation:
        'A bank can fail each of these independently. It can be well capitalised and unable to pay on Friday, which is what a run does. It can be liquid and insolvent, which is a bank whose loans are worthless and whose vault is full. And reserve requirements, which the older half of this course is built on, have been set to zero in the United States and are 1% in the euro area — the constraint that once did this work is largely gone, and capital and liquidity rules replaced it.',
    },
    {
      id: 'mc-risk-weights',
      type: 'multiple_choice',
      tags: ['capital', 'risk-weights'],
      xp: 35,
      prompt:
        'Bank A and Bank B each hold €100bn of assets and €7bn of capital. A lends to businesses, B lends on residential mortgages. Why does B report a much higher capital ratio?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'weights',
          label: 'Its assets carry lower risk weights, so the denominator is smaller',
        },
        {
          id: 'safer',
          label: 'Because mortgages genuinely are safer, and the ratio reflects that',
          feedback:
            'Loan by loan, mortgages do default less. The ratio is not measuring that directly — it is applying a weight set by rule, and the rule is what makes the two banks look different despite identical capital and identical assets.',
        },
        {
          id: 'more-capital',
          label: 'It must be holding more capital than stated',
          feedback:
            'Both hold €7bn. The numerator is the same in each; only the denominator moves.',
        },
        {
          id: 'accounting',
          label: 'An accounting difference that washes out over time',
          feedback:
            'It does not wash out. It changes how much capital each bank must hold for the rest of its life, and therefore how large it can grow on a given equity base.',
        },
      ],
      correctOptionId: 'weights',
      explanation:
        'Risk weights exist so that a bank holding safe assets need not carry capital as if they were risky, and they create the single most consequential incentive in banking: lending that attracts a low weight lets you build a larger balance sheet on the same equity. That is a large part of why mortgage lending crowded out business lending across the rich world, and why the same 7% means different things at two banks.',
    },
    {
      id: 'mc-leverage-ratio',
      type: 'multiple_choice',
      tags: ['leverage-ratio', 'capital'],
      xp: 35,
      prompt:
        'Basel III added a leverage ratio — capital over total assets, with no risk weighting at all — on top of the risk-weighted rules. Why keep a cruder measure alongside a more sophisticated one?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'backstop',
          label: 'It cannot be gamed by moving into assets the model thinks are safe',
        },
        {
          id: 'simpler',
          label: 'It is easier for supervisors to compute',
          feedback:
            'It is, and that is not why it exists. A cheap-to-compute measure that added nothing would be dropped; this one binds on some of the largest banks.',
        },
        {
          id: 'stricter',
          label: 'It is always the stricter of the two',
          feedback:
            'It binds on banks with low-risk-weight assets and is slack for banks with genuinely risky books. Which one bites tells you what a bank is made of.',
        },
        {
          id: 'legacy',
          label: 'Historical carry-over from pre-Basel rules',
          feedback:
            'It was introduced *by* Basel III, in 2010, precisely because the crisis had just demonstrated the failure mode it guards against.',
        },
      ],
      correctOptionId: 'backstop',
      explanation:
        'Every bank that failed in 2008 met its risk-weighted requirement on the way in. The weights were wrong — mortgage securities carried weights that assumed a national house price fall could not happen — and a rule built on a wrong model fails exactly when the model does. The leverage ratio is deliberately stupid: it asks how much you owe against how much you have, and it cannot be argued with. Holding both is an admission that the sophisticated measure will sometimes be wrong in the same direction as everyone else’s.',
    },
  ],
  keyTakeaways: [
    'Capital is a funding source, not a reserve of cash — it is lent out like everything else.',
    'Capital, liquidity and reserve requirements answer three different questions.',
    'Risk weights decide how large a balance sheet a given equity base can carry, which shapes what banks lend on.',
    'The leverage ratio exists because the risk-weighted measure fails when its model does.',
  ],
});
