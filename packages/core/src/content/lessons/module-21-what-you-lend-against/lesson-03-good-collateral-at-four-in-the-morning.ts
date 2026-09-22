import { defineLesson } from '../../schema';

/**
 * Bagehot operationalised. The principle is a century and a half old and
 * every word of it turns into a judgement call under time pressure.
 */
export const goodCollateralAtFourInTheMorningLesson = defineLesson({
  id: 'good-collateral-at-four-in-the-morning',
  title: 'Every Word of Bagehot Is a Decision',
  subtitle:
    'Lend freely, to solvent institutions, against good collateral, at a penalty rate. Four phrases, four arguments, one night to have them.',
  icon: '🌙',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'match-bagehot',
      type: 'concept_match',
      tags: ['lender-of-last-resort', 'bagehot'],
      xp: 35,
      prompt: 'Match each phrase of the rule to the judgement it hides.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'freely',
          term: '"Lend freely"',
          definition: 'How much is enough to stop a run, given that too little is worse than nothing at all',
        },
        {
          id: 'solvent',
          term: '"To solvent institutions"',
          definition: 'Solvency judged in hours, on a book you did not write, whose value depends on whether you lend',
        },
        {
          id: 'good',
          term: '"Against good collateral"',
          definition: 'Valued at what, exactly — the market price in a market that has stopped, or something else?',
        },
        {
          id: 'penalty',
          term: '"At a penalty rate"',
          definition: 'High enough to deter casual use, low enough that using it is not itself a confession',
        },
      ],
      explanation:
        'Bagehot wrote it in 1873 and it has survived because every phrase is right and none is operational. The modern additions are all attempts to make the judgements in advance rather than at four in the morning: resolution plans, pre-positioned collateral, valuations kept current, published haircut schedules. A central bank that has done none of that in peacetime has to do all of it in one night.',
    },
    {
      id: 'mc-valued-at-what',
      type: 'multiple_choice',
      tags: ['collateral', 'valuation', 'crisis'],
      xp: 35,
      prompt:
        'The market for an asset has stopped. The last trade was at 60, and it was distressed. You are asked to lend against it tonight. What is the defensible basis?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'hold-value',
          label: 'What it is worth held to maturity, with a haircut sized to your uncertainty',
        },
        {
          id: 'last-trade',
          label: 'The last traded price, because it is the only observed fact',
          feedback:
            'A price from a market that has stopped functioning is a fact about the market, not about the asset. Lending against it means the fire sale sets the terms of the rescue — which is the spiral you are trying to stop.',
        },
        {
          id: 'par',
          label: 'Par, since the issuer has not defaulted',
          feedback:
            'Sometimes defensible — the Fed did exactly that in March 2023 for government securities. It is defensible when the issuer is beyond doubt and the loss is purely rates; it is not a general rule.',
        },
        {
          id: 'refuse',
          label: 'Refuse to lend until a price can be observed',
          feedback:
            'Then you are choosing the failure. Refusing to act because the inputs are imperfect is the most common way a lender of last resort fails, and it is always available as a reason.',
        },
      ],
      correctOptionId: 'hold-value',
      explanation:
        'This is where the collateral framework and the lender-of-last-resort function become the same instrument. A distressed price reflects that nobody has cash, which is the condition you exist to fix — valuing against it imports the panic into your own terms. The honest method is an estimate of hold-to-maturity value with a haircut wide enough to cover being wrong, stated in advance where possible. It also explains why this is so contested afterwards: you are lending against a number you chose.',
    },
    {
      id: 'order-ela',
      type: 'order_flow',
      tags: ['ela', 'crisis', 'lender-of-last-resort'],
      xp: 30,
      prompt: 'Put the escalation in order, from a normal funding need to emergency assistance.',
      instructions: 'Drag the steps into order of escalation',
      events: [
        { id: 'market', label: 'The bank funds itself in the market', detail: 'Normal times' },
        { id: 'ops', label: 'It bids in the central bank’s regular operations', detail: 'Routine, against the standard list' },
        { id: 'window', label: 'It goes to the standing facility, at a penalty rate', detail: 'Visible, and carries stigma' },
        { id: 'ela', label: 'It receives emergency assistance against collateral outside the normal list' },
        { id: 'condition', label: 'The assistance is made conditional on a recapitalisation plan' },
        { id: 'resolution', label: 'Assistance stops and the bank is resolved' },
      ],
      correctOrder: ['market', 'ops', 'window', 'ela', 'condition', 'resolution'],
      explanation:
        'Each step widens what you will accept and narrows who decides. By the fourth the collateral is outside the published framework, the national central bank is bearing the risk, and the decision has become a judgement about one institution rather than an operation. The Greek banks in 2015 spent months at that step, with the ceiling reviewed at intervals — which is the mechanism by which a central bank ends up holding the fate of a banking system and, through it, a negotiation between governments.',
    },
    {
      id: 'mc-stigma',
      type: 'multiple_choice',
      tags: ['stigma', 'lender-of-last-resort'],
      xp: 35,
      prompt:
        'Banks avoid the standing facility even when they need it, because using it marks them as weak. What is the technical fix that has actually worked?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'auction',
          label: 'Lend the same money by anonymous auction',
        },
        {
          id: 'cheaper',
          label: 'Make the facility cheaper than funding available in the market',
          feedback:
            'Then it is used casually and the penalty principle is gone. The cost was never what deterred anyone — banks have paid far more elsewhere to avoid the window.',
        },
        {
          id: 'mandatory',
          label: 'Require every bank to use it occasionally',
          feedback:
            'Proposed seriously and it has an obvious flaw: in a crisis everyone knows which participation is routine and which is not, so the cover disappears exactly when it is needed.',
        },
        {
          id: 'secret',
          label: 'Never disclose who used it',
          feedback:
            'Disclosure is usually lagged by years already, and the market infers from balance sheets long before. Secrecy has proved unkeepable and does not remove the inference.',
        },
      ],
      correctOptionId: 'auction',
      explanation:
        'The Term Auction Facility in December 2007 lent on close to discount window terms but allocated by auction to many bidders at once, and it was used heavily by institutions that had refused the window. The lesson generalises: stigma attaches to being identified, not to borrowing, so the design question is whether your facility singles anyone out. A governor who has an emergency facility nobody will touch has an instrument only on paper.',
    },
  ],
  keyTakeaways: [
    'Every phrase in Bagehot’s rule hides a judgement that has to be prepared in peacetime.',
    'Valuing collateral at a distressed price imports the panic into the rescue.',
    'Emergency assistance widens what you accept and narrows who decides.',
    'Stigma attaches to being identified, so the fix is design, not price.',
  ],
});
