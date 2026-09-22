import { defineLesson } from '../../schema';

/**
 * Central bank losses. A technical treatment: what negative equity does and
 * does not prevent, and the one channel through which it genuinely binds.
 */
export const lossesAndCapitalLesson = defineLesson({
  id: 'losses-and-capital',
  title: 'A Central Bank With Negative Equity',
  subtitle:
    'It cannot become insolvent in its own currency. That is true, and it is not the end of the question.',
  icon: '📉',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-where-losses-come-from',
      type: 'multiple_choice',
      tags: ['central-bank-balance-sheet', 'losses'],
      xp: 30,
      prompt:
        'A central bank that bought long bonds at low yields now pays a high policy rate on reserves. Where does the loss come from?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'carry',
          label: 'Its assets pay a fixed low coupon while its liabilities reprice upward',
        },
        {
          id: 'default',
          label: 'The bonds it bought have fallen in credit quality',
          feedback:
            'They are usually government bonds of the issuing state and are being paid in full. The loss arrives without a single missed payment.',
        },
        {
          id: 'fx',
          label: 'Exchange rate movements on its reserves',
          feedback:
            'That is a real and separate source of loss. The one operating here is domestic and structural: fixed-rate assets funded at a floating rate.',
        },
        {
          id: 'operations',
          label: 'The cost of running the institution',
          feedback:
            'Operating costs are trivial against the balance sheet. The numbers that matter are the carry on hundreds of billions.',
        },
      ],
      correctOptionId: 'carry',
      explanation:
        'It is a maturity mismatch, and the central bank put it on deliberately: buying long assets funded by overnight reserves is what duration extraction consists of. When the policy rate rises the mismatch produces exactly the loss the structure implies. Nothing has gone wrong in the sense of an error — the loss is the delayed cost of a policy that had a benefit at the time. What makes it awkward is that the benefit accrued to a past government and the cost lands on a present one.',
    },
    {
      id: 'mc-does-it-constrain',
      type: 'multiple_choice',
      tags: ['central-bank-balance-sheet', 'independence'],
      xp: 40,
      prompt:
        'Equity is now negative. Which of these is the operational consequence that actually matters?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'recapitalisation',
          label: 'It may have to ask the government for capital',
        },
        {
          id: 'cannot-operate',
          label: 'It can no longer conduct its operations',
          feedback:
            'It settles its obligations by issuing its own liabilities, which is a capacity negative equity does not touch. The operations continue unaffected.',
        },
        {
          id: 'inflation',
          label: 'The losses are inflationary in and of themselves',
          feedback:
            'The reserves created were already there; paying interest on them adds to the stock at the policy rate. The inflation risk comes from what the bank might do to avoid the losses, not from the losses.',
        },
        {
          id: 'default',
          label: 'It could default on the reserves that it owes',
          feedback:
            'It cannot — they are its own liabilities and it issues them. This is the fact the whole course has been building on, and it remains true here.',
        },
      ],
      correctOptionId: 'recapitalisation',
      explanation:
        'Technically negative equity changes nothing: an institution that issues the money its obligations are denominated in meets them by definition. The bite is institutional. A central bank asking for capital is negotiating with the authority whose debt it holds and whose deficit it is supposed to be indifferent to, and that conversation has a price even when it goes well. This is why arrangements are best settled before they are needed — an indemnity agreed in advance, a deferred asset framework that lets losses run off against future income, a loss-sharing rule written when nobody is losing.',
    },
    {
      id: 'match-loss-arrangements',
      type: 'concept_match',
      tags: ['losses', 'governance'],
      xp: 30,
      prompt: 'Three ways institutions handle the losses. Match them.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'indemnity',
          term: 'Treasury indemnity',
          definition: 'The government bears programme losses and receives the gains, agreed before the programme starts',
        },
        {
          id: 'deferred',
          term: 'Deferred asset',
          definition: 'Losses accumulate as a claim on future profits, and remittances stop until it is cleared',
        },
        {
          id: 'absorb',
          term: 'Absorb against reserves',
          definition: 'Retained earnings and revaluation accounts take the hit, which is why they were built up',
        },
      ],
      explanation:
        'The first is the cleanest and the rarest, because it requires a government to accept an open-ended contingent liability in exchange for gains it will probably have spent by the time the losses arrive. The second is the most common and it works by making the loss invisible in the accounts while it is entirely visible in the missing remittances. Which one a country uses tells you a good deal about how the relationship between the two institutions is actually conducted.',
    },
    {
      id: 'order-loss-decision',
      type: 'order_flow',
      tags: ['losses', 'policy'],
      xp: 35,
      prompt:
        'Losses are mounting and the balance sheet is a subject of public argument. Order the decision.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'target', label: 'Ask what the inflation target requires', detail: 'First, and separately' },
        { id: 'cost', label: 'Measure the losses that path implies' },
        { id: 'arrangement', label: 'Apply the loss arrangement already in place' },
        { id: 'disclose', label: 'Publish the number before anyone else calculates it' },
        { id: 'unchanged', label: 'Set the rate the target requires' },
      ],
      correctOrder: ['target', 'cost', 'arrangement', 'disclose', 'unchanged'],
      explanation:
        'The sequence exists to keep one step from moving. The rate is set by what the target requires, and the losses are a consequence to be measured, absorbed and disclosed — never an input. The moment the order reverses, and the bank holds the rate lower because raising it is expensive for its own accounts, it has adopted a second objective it was never given, and every future decision is read that way. The technical work is in steps two to four. The discipline is in step five being identical to step one.',
    },
  ],
  keyTakeaways: [
    'The loss is a maturity mismatch the bank took on deliberately, not an error.',
    'Negative equity does not impair operations — it impairs independence.',
    'Indemnities, deferred assets and reserves are the three ways losses are absorbed.',
    'Losses are an output of the rate decision and must never be an input.',
  ],
});
