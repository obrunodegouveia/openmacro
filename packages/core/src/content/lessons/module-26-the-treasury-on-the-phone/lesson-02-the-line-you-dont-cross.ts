import { defineLesson } from '../../schema';

/**
 * Monetary financing: what the prohibition actually prohibits, and the
 * technical tests that distinguish a legitimate operation from a breach.
 */
export const theLineYouDontCrossLesson = defineLesson({
  id: 'the-line-you-dont-cross',
  title: 'The Line You Do Not Cross',
  subtitle:
    'Almost everything a central bank does puts money into the government’s hands eventually. The prohibition is narrower and sharper than that.',
  icon: '🚧',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-what-is-prohibited',
      type: 'multiple_choice',
      tags: ['monetary-financing', 'law'],
      xp: 35,
      prompt: 'What does a monetary financing prohibition actually forbid?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'direct',
          label: 'Lending to the state, or buying its debt from it directly',
        },
        {
          id: 'holding',
          label: 'Holding government debt at all',
          feedback:
            'Government debt is the standard asset behind the money supply in almost every system. Holding it is the normal state of affairs.',
        },
        {
          id: 'helping',
          label: 'Any action that lowers the government’s funding cost',
          feedback:
            'Every rate cut does that. A prohibition written that way would forbid monetary policy.',
        },
        {
          id: 'deficits',
          label: 'Operating while the government runs a deficit',
          feedback:
            'Governments run deficits most of the time. The constraint is about the channel through which they are funded, not about their existence.',
        },
      ],
      correctOptionId: 'direct',
      explanation:
        'The prohibition is about the primary market: the central bank may not be the government’s lender. The reason is that a government which can always sell to its central bank never has to face a price, and the price is the entire discipline. Once the debt has been bought by someone who had to judge it worth buying, the central bank can purchase it in the secondary market for monetary purposes — which is why the distinction between primary and secondary is not a technicality but the whole architecture.',
    },
    {
      id: 'match-financing-tests',
      type: 'concept_match',
      tags: ['monetary-financing', 'governance'],
      xp: 35,
      prompt: 'Four tests applied to a purchase programme. Match each to what it establishes.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'blackout',
          term: 'Blackout period around auctions',
          definition: 'The market must price the issue before the central bank touches it',
        },
        {
          id: 'limits',
          term: 'Issue and issuer limits',
          definition: 'Prevents becoming a blocking holder able to determine a restructuring',
        },
        {
          id: 'purpose',
          term: 'A stated monetary purpose',
          definition: 'The programme must be explicable by the target, not by the deficit',
        },
        {
          id: 'conditionality',
          term: 'Conditions on eligibility',
          definition: 'Keeps a fiscal judgement out of what is meant to be a monetary decision',
        },
      ],
      explanation:
        'The last one cuts both ways and is worth sitting with. Requiring a government to meet conditions before its bonds are eligible protects the central bank from funding a state that will not adjust — and it also hands the central bank a lever over fiscal policy, which is not its job either. Every design here is a choice between two ways of blurring the boundary, and the honest ones say so in the published decision rather than pretending a clean option exists.',
    },
    {
      id: 'order-auction-failure',
      type: 'order_flow',
      tags: ['crisis', 'debt-management'],
      xp: 35,
      prompt: 'A government bond auction fails to clear. Order what should happen.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'debt-office', label: 'The debt office withdraws and uses its cash buffer', detail: 'It should have one' },
        { id: 'diagnose', label: 'Establish whether the failure is liquidity or solvency' },
        { id: 'shorten', label: 'Reissue at a shorter maturity the market will take' },
        { id: 'secondary', label: 'The central bank intervenes in the secondary market if pricing is disorderly' },
        { id: 'fiscal', label: 'Fiscal correction if the diagnosis was solvency' },
      ],
      correctOrder: ['debt-office', 'diagnose', 'shorten', 'secondary', 'fiscal'],
      explanation:
        'The central bank appears fourth, and the ordering is the lesson. A failed auction is first a debt management problem with debt management answers — the cash buffer exists precisely so that one bad auction is survivable without anybody’s help. Central bank intervention addresses disorderly pricing in the secondary market and cannot address a government the market will not fund at any maturity. Putting it earlier in the sequence is how a liquidity operation becomes a financing operation while everyone involved believes they are doing the same thing they did last week.',
    },
    {
      id: 'mc-cash-buffer',
      type: 'multiple_choice',
      tags: ['debt-management', 'liquidity'],
      xp: 30,
      prompt:
        'Why does a treasury hold a large cash buffer at the central bank when it is paying interest to borrow the money?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'optional-auction',
          label: 'It makes every individual auction optional',
        },
        {
          id: 'interest',
          label: 'To earn interest on the balance it holds',
          feedback:
            'It earns less than it pays to borrow — the buffer has a negative carry. That cost is the insurance premium.',
        },
        {
          id: 'payments',
          label: 'To meet the state’s day-to-day payments',
          feedback:
            'Working balances are much smaller than the buffers debt offices actually hold. The size is set by how long they want to be able to stay out of the market.',
        },
        {
          id: 'required',
          label: 'Central bank rules require a minimum balance',
          feedback:
            'The size is a debt management decision, usually expressed as months of financing need covered.',
        },
      ],
      correctOptionId: 'optional-auction',
      explanation:
        'A treasury that must raise money on Tuesday will accept whatever Tuesday offers. One that can fund three months of obligations from cash can decline a bad price and come back — and because the market knows it can, the bad price is less likely to be offered. The buffer costs the spread between what it pays and what it earns, every year, in exchange for never being a forced seller. Read against the last lesson, it is also the cheapest possible defence of central bank independence: a government that cannot be cornered never needs to ask.',
    },
  ],
  keyTakeaways: [
    'The prohibition targets the primary market — the central bank may not be the lender.',
    'Eligibility conditions protect the central bank and hand it fiscal leverage.',
    'A failed auction is a debt management problem before it is a monetary one.',
    'A cash buffer makes each auction optional, which is what removes the coercion.',
  ],
});
