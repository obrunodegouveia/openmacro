import { defineLesson } from '../../schema';

/**
 * The countercyclical buffer, and why the hard part is not the instrument but
 * the moment it has to be used.
 */
export const theBufferYouBuildInGoodTimesLesson = defineLesson({
  id: 'the-buffer-you-build-in-good-times',
  title: 'Raise It When Nobody Wants You To',
  subtitle:
    'The one macroprudential tool that works has to be tightened into a boom and loosened into a crash. Both are unpopular in the moment.',
  icon: '🛡️',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-release-not-build',
      type: 'multiple_choice',
      tags: ['countercyclical-buffer', 'macroprudential'],
      xp: 35,
      prompt:
        'The countercyclical buffer is built up in good times so it can be *released* in bad ones. What does releasing it actually achieve?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'keep-lending',
          label: 'It lets a bank absorb losses without having to shrink lending to restore its ratio',
        },
        {
          id: 'gives-money',
          label: 'It gives banks money to lend',
          feedback:
            'Nothing is handed over. The buffer was never a pot — releasing it lowers a *requirement*, which changes what the bank is obliged to hold against its assets, not what it has.',
        },
        {
          id: 'signal',
          label: 'It signals that the authorities are acting',
          feedback:
            'Signalling is real and secondary. The mechanical effect is what matters: without the release, a bank taking losses must either raise capital in the worst possible market or cut lending.',
        },
        {
          id: 'profits',
          label: 'It allows banks to keep paying dividends through a downturn',
          feedback:
            'Usually the opposite — releases are normally paired with restrictions on distributions, so the relief goes into lending capacity rather than out to shareholders.',
        },
      ],
      correctOptionId: 'keep-lending',
      explanation:
        'This is the whole point and it is counter-intuitive enough to be worth stating twice. A bank hit by losses can restore its ratio by raising capital, which is expensive precisely when it is needed, or by lending less — and every bank doing the second at once turns a downturn into a credit crunch. Releasing the buffer removes the obligation to do either. The buffer is built so that it can be given away.',
    },
    {
      id: 'mc-timing-problem',
      type: 'multiple_choice',
      tags: ['macroprudential', 'political-economy'],
      xp: 35,
      prompt:
        'Why is the buffer usually raised too late?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'boom',
          label: 'It has to be tightened while nothing appears to be wrong',
        },
        {
          id: 'data',
          label: 'The data on credit growth only arrives a quarter or two later',
          feedback:
            'It does, by a quarter or two, and that is not the binding constraint. Credit-to-GDP gaps were flashing for years before 2008 in several countries that did nothing.',
        },
        {
          id: 'complex',
          label: 'The calculation is technically difficult',
          feedback:
            'The indicator is a credit-to-GDP gap and a handful of supporting series. The difficulty is not arithmetic.',
        },
        {
          id: 'coordination',
          label: 'It requires international coordination',
          feedback:
            'Reciprocity arrangements exist and mostly work. Domestic willingness is the constraint.',
        },
      ],
      correctOptionId: 'boom',
      explanation:
        'Every argument against raising it is strongest exactly when raising it is right: lending is growing, house prices are rising, nobody has defaulted, and the banks can show you that the last decade of data says their book is safe. You are asking an economy that feels healthy to take less credit, on the basis of a forecast you cannot prove. It is the same shape of problem as tightening policy into a boom, and it fails for the same reason — the costs are immediate and specific, the benefits are diffuse and counterfactual.',
    },
    {
      id: 'order-credit-cycle',
      type: 'order_flow',
      tags: ['credit-cycle', 'macroprudential'],
      xp: 30,
      prompt: 'Put a credit cycle in order, and mark where the tool should be used.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'growth', label: 'Credit grows faster than the economy', detail: 'The indicator turns — this is when to build' },
        { id: 'prices', label: 'Collateral values rise, so more can be borrowed against them' },
        { id: 'standards', label: 'Lending standards loosen as competition bites' },
        { id: 'turn', label: 'Something stops the rise' },
        { id: 'losses', label: 'Losses arrive and capital ratios fall', detail: 'This is when to release' },
        { id: 'crunch', label: 'Banks cut lending to rebuild ratios, deepening the downturn' },
      ],
      correctOrder: ['growth', 'prices', 'standards', 'turn', 'losses', 'crunch'],
      explanation:
        'Steps two and three are the engine: rising collateral values justify more lending, which raises collateral values. That loop is self-reinforcing in both directions, which is why the last step is not a failure of nerve by bankers but the same arithmetic running backwards. The tool exists to break the final step, and it only can if the work was done at the first.',
    },
    {
      id: 'match-ltv-dsti',
      type: 'concept_match',
      tags: ['macroprudential', 'housing'],
      xp: 30,
      prompt: 'Borrower-based measures act on the loan rather than the bank. Match each to what it limits.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'ltv',
          term: 'Loan-to-value cap',
          definition: 'How much can be lent against the property — protects the bank if prices fall',
        },
        {
          id: 'dsti',
          term: 'Debt-service-to-income cap',
          definition: 'How much of income can go to repayments — protects the borrower if rates rise',
        },
        {
          id: 'maturity',
          term: 'Maturity limits',
          definition: 'Stops the payment being made affordable by stretching the term to forty years',
        },
      ],
      explanation:
        'The pairing is deliberate: the first protects the lender and the second protects the household, and a regime with only the first will happily lend 70% of a value to someone who cannot afford the payment. Portugal and several euro area countries added income-based limits in the late 2010s precisely because the loan-to-value test alone had proved compatible with a boom. These are also the only instruments here that act directly on composition, which is what the policy rate cannot do.',
    },
  ],
  keyTakeaways: [
    'Releasing a buffer removes an obligation; it does not hand anyone money.',
    'The buffer is built in order to be given away in the downturn.',
    'Rising collateral values justify more lending, which raises collateral values — in both directions.',
    'Value-based limits protect the lender; income-based limits protect the borrower.',
  ],
});
