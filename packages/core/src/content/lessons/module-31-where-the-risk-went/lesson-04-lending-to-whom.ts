import { defineLesson } from '../../schema';

/**
 * Extending the backstop beyond banks. Closes the module and the technical
 * core: the lender of last resort question, asked about institutions Bagehot
 * never imagined.
 */
export const lendingToWhomLesson = defineLesson({
  id: 'lending-to-whom',
  title: 'Bagehot Did Not Have Pension Funds in Mind',
  subtitle:
    'The rule was lend freely to solvent institutions against good collateral. Every word of it assumed the borrower was a bank.',
  icon: '🚪',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'mc-why-not-just-banks',
      type: 'multiple_choice',
      tags: ['lender-of-last-resort', 'non-banks'],
      xp: 40,
      prompt:
        'Why can a central bank not simply lend to banks and let them onward-lend to non-banks in a stress?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'balance-sheet',
          label: 'Banks are balance-sheet constrained exactly when the demand arrives',
        },
        {
          id: 'unwilling',
          label: 'Banks would refuse to help competitors',
          feedback:
            'Commercial motives exist and banks intermediate for clients routinely. What stops them in a stress is capacity, not willingness.',
        },
        {
          id: 'slow',
          label: 'It would be too slow',
          feedback:
            'Speed matters and the deeper issue is that the intermediary cannot expand at all, however fast it wants to.',
        },
        {
          id: 'illegal',
          label: 'Banks are not permitted to intermediate central bank liquidity',
          feedback:
            'This is precisely what they do in normal conditions. The question is why the channel stops working when it is most needed.',
        },
      ],
      correctOptionId: 'balance-sheet',
      explanation:
        'In March 2020, dealers had ample access to central bank liquidity and could not use it: taking on more Treasuries meant expanding a balance sheet against leverage ratio constraints, and every client wanted to sell at once. The intermediation channel was full. This is the operational argument for facilities that reach non-banks directly — not a theory about who deserves support, but the observation that the pipe through banks has a fixed diameter and the stress exceeds it. The leverage ratio exemptions granted that month were an acknowledgement of the same problem from the other direction.',
    },
    {
      id: 'match-facility-design',
      type: 'concept_match',
      tags: ['lender-of-last-resort', 'design'],
      xp: 35,
      prompt: 'Four design choices for a facility reaching beyond banks. Match each to what it protects against.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'price',
          term: 'Priced above normal market terms',
          definition: 'Ensures it is used in stress and abandoned when conditions normalise',
        },
        {
          id: 'collateral',
          term: 'Defined collateral and haircuts',
          definition: 'Keeps it a liquidity operation rather than a transfer of losses',
        },
        {
          id: 'temporary',
          term: 'A stated end date',
          definition: 'Forces the exit to be a decision that was already taken, not one to be argued',
        },
        {
          id: 'conditions',
          term: 'Conditions on the borrower',
          definition: 'Prevents the position being rebuilt with the liquidity provided to unwind it',
        },
      ],
      explanation:
        'The fourth is the one that separates a rescue from a repair and it was the essential feature of the Bank of England’s 2022 gilt operation: the purpose was to give pension schemes time to raise cash and reduce leverage, not to let them hold the position at the same size with official support. It is also the hardest to enforce, because a central bank has no supervisory relationship with most of these borrowers. The facility can set terms; it cannot examine anyone. That gap is the strongest argument for regulating non-bank leverage before the facility is ever needed.',
    },
    {
      id: 'mc-moral-hazard',
      type: 'multiple_choice',
      tags: ['moral-hazard', 'lender-of-last-resort'],
      xp: 40,
      prompt:
        'The objection to backstopping non-banks is moral hazard. What is the strongest response?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'already',
          label: 'The expectation of rescue already exists — the choice is whether it is priced',
        },
        {
          id: 'overstated',
          label: 'Moral hazard is overstated as a concern',
          feedback:
            'It is real: expected support demonstrably changes how much leverage institutions run. Dismissing it concedes the argument to the people who raise it.',
        },
        {
          id: 'crisis',
          label: 'In a crisis there is no alternative',
          feedback:
            'True at the moment of crisis and it is an argument for acting, not an answer to the objection. It also arrives too late to shape any incentive.',
        },
        {
          id: 'investors',
          label: 'Investors still lose money in these interventions',
          feedback:
            'Often they do, which limits the hazard without eliminating it. The stronger response goes to whether the expectation exists at all.',
        },
      ],
      correctOptionId: 'already',
      explanation:
        'Market participants have watched every systemic event since 2008 and concluded, correctly, that a sufficiently systemic failure will be addressed. That expectation is already in their pricing and their leverage, whether or not any central bank admits it. Given that, the real choice is between an implicit guarantee that is free, unconditional and never discussed, and an explicit framework with a price, collateral, conditions and supervision attached. Refusing to build the second does not remove the first — it just means the terms get set at three in the morning by people who have no alternative.',
    },
    {
      id: 'order-decide',
      type: 'order_flow',
      tags: ['lender-of-last-resort', 'decision'],
      xp: 35,
      prompt: 'A non-bank sector is in a forced-selling spiral. Order the decision.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'diagnose', label: 'Is this illiquidity or insolvency?' },
        { id: 'systemic', label: 'Is the price it is selling at becoming everyone’s price?' },
        { id: 'mandate', label: 'Which mandate does this fall under — stability or monetary?' },
        { id: 'design', label: 'Size, price, collateral, conditions and end date' },
        { id: 'exit', label: 'Unwind on the stated schedule' },
        { id: 'regulate', label: 'Fix the leverage that made it necessary' },
      ],
      correctOrder: ['diagnose', 'systemic', 'mandate', 'design', 'exit', 'regulate'],
      explanation:
        'The third step is the one that decides how the operation is judged and remembered. An intervention in the government bond market for financial stability reasons, while monetary policy is tightening, has to be explicitly separated from monetary policy — different purpose, different size, different exit — or it will be read as the central bank abandoning its inflation fight, and the exchange rate will say so within hours. The Bank of England did separate them, said so repeatedly, and still spent months being accused of the opposite. The final step is the one that actually prevents a repeat and the one most likely to be abandoned once the emergency has passed.',
    },
  ],
  keyTakeaways: [
    'The channel through banks has a fixed diameter, and stress exceeds it.',
    'Conditions on the borrower are what separate a repair from a rescue.',
    'The implicit guarantee already exists; the choice is whether it is priced.',
    'A stability intervention during tightening must be explicitly separated from policy.',
  ],
});
