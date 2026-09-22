import { defineLesson } from '../../schema';

/**
 * Resolution: the technical machinery that decides who bears a bank's losses,
 * and why the alternative to having it is not "no bailouts" but "bailouts
 * decided at four in the morning".
 *
 * Credit Suisse in March 2023 is the case that has to be included: AT1
 * instruments were written down to zero while shareholders received value,
 * which inverted the hierarchy investors had priced.
 */
export const whoFailsAndHowLesson = defineLesson({
  id: 'who-fails-and-how',
  title: 'Somebody Has to Take the Loss',
  subtitle:
    'Resolution is the question of who, decided in advance, by rule — or at four in the morning, by whoever is in the room.',
  icon: '⚖️',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'order-hierarchy',
      type: 'order_flow',
      tags: ['resolution', 'bail-in'],
      xp: 35,
      prompt: 'Put the creditor hierarchy in order, from who loses first to who loses last.',
      instructions: 'Drag them into the order losses are absorbed',
      events: [
        { id: 'equity', label: 'Shareholders', detail: 'Wiped out before anyone else loses a cent' },
        { id: 'at1', label: 'Additional tier 1 instruments', detail: 'Designed to convert or be written down' },
        { id: 'tier2', label: 'Subordinated debt' },
        { id: 'senior', label: 'Senior unsecured bondholders' },
        { id: 'large', label: 'Deposits above the insured limit' },
        { id: 'insured', label: 'Insured deposits', detail: 'Protected, and paid by the scheme if it comes to it' },
      ],
      correctOrder: ['equity', 'at1', 'tier2', 'senior', 'large', 'insured'],
      explanation:
        'The order is the product, not the detail. Every investor prices their instrument on the assumption that this sequence holds, and an authority that departs from it in a crisis is not saving money — it is repricing every comparable instrument in the market the following Monday. Credit Suisse in March 2023 wrote AT1 down to zero while shareholders received value, inverting two of these rungs; the AT1 market shut for months afterwards and the legal argument continues.',
    },
    {
      id: 'mc-why-resolution',
      type: 'multiple_choice',
      tags: ['resolution', 'moral-hazard'],
      xp: 35,
      prompt:
        'A resolution regime exists so that a large bank can fail without bringing down the system. What does that buy, beyond avoiding a bailout?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'funding-cost',
          label: 'Creditors price the risk, so the subsidy for being large goes',
        },
        {
          id: 'money',
          label: 'It saves public money that would otherwise fund a rescue',
          feedback:
            'Often, and it is the least interesting benefit. Several resolutions have cost the state nothing and several bailouts eventually turned a profit — the accounting is not the argument.',
        },
        {
          id: 'punish',
          label: 'It punishes bankers for bad decisions',
          feedback:
            'It falls on shareholders and creditors rather than on individuals, and framing it as punishment leads to designing it badly. The purpose is to restore a price signal, not a retribution.',
        },
        {
          id: 'speed',
          label: 'It makes the process faster',
          feedback:
            'Resolutions are executed over a weekend by design, which is operational rather than the point. A fast process for an institution nobody ever lets fail changes nothing.',
        },
      ],
      correctOptionId: 'funding-cost',
      explanation:
        'A bank everyone expects to be rescued borrows more cheaply than one they do not, and the gap is a subsidy paid by taxpayers to the largest institutions, scaling with size. That distorts everything: it rewards growing until you are systemic, and it puts prudent competitors at a permanent disadvantage. Credible resolution is how the subsidy is withdrawn — which means the machinery only works if the market believes it will actually be used.',
    },
    {
      id: 'mc-illiquid-or-insolvent',
      type: 'multiple_choice',
      tags: ['lender-of-last-resort', 'resolution'],
      xp: 35,
      prompt:
        'It is Saturday. A bank needs €8bn by Monday. Which question decides whether you lend to it or resolve it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'solvent',
          label: 'Whether its assets, valued sensibly, still exceed what it owes',
        },
        {
          id: 'size',
          label: 'Whether it is large enough to threaten the system',
          feedback:
            'That decides how frightened you are, not what the correct action is. Lending to an insolvent bank because it is large is the definition of the problem resolution exists to solve.',
        },
        {
          id: 'collateral',
          label: 'Whether it has collateral to pledge',
          feedback:
            'Necessary and not sufficient. Collateral lets you lend safely; it does not tell you whether lending is the right answer, and an insolvent bank with good collateral is still insolvent on Tuesday.',
        },
        {
          id: 'cause',
          label: 'Whether the trouble was its own fault',
          feedback:
            'Emotionally compelling and analytically useless at four in the morning. The hierarchy and the solvency test do not ask about blame.',
        },
      ],
      correctOptionId: 'solvent',
      explanation:
        'Bagehot’s test, and it has not improved in a century and a half: lend freely to a solvent institution against good collateral at a penalty rate, and resolve an insolvent one. The difficulty is never the principle, it is that solvency has to be judged in hours, on a book you did not write, while the value of everything in it depends on whether you lend. That is why the preparation — the resolution plan, the valuation done in advance, the loss-absorbing debt already in place — is the whole of the job. The weekend is too late to start.',
    },
    {
      id: 'match-what-makes-it-credible',
      type: 'concept_match',
      tags: ['resolution', 'preparation'],
      xp: 30,
      prompt: 'Four things that have to exist before the weekend. Match each to what it makes possible.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'mrel',
          term: 'A required stack of bail-inable debt',
          definition: 'Something to convert into capital that is not a deposit — without it the only loss-absorbers are depositors',
        },
        {
          id: 'plan',
          term: 'A resolution plan',
          definition: 'Which entity is resolved, which subsidiaries keep operating, who holds the operating contracts',
        },
        {
          id: 'valuation',
          term: 'Valuation capability',
          definition: 'The ability to put a number on the book over a weekend, rather than over the six months it deserves',
        },
        {
          id: 'access',
          term: 'Liquidity in resolution',
          definition: 'A funding line for the surviving entity, because solvency restored on Sunday still needs cash on Monday',
        },
      ],
      explanation:
        'The last one is the gap most regimes still have. You can bail in creditors, restore the capital position and still watch the bank fail on Monday morning because nobody will fund it — solvency and liquidity come apart in resolution exactly as they do outside it. A governor who has read the plan and not asked where Monday’s cash comes from has read half of it.',
    },
  ],
  keyTakeaways: [
    'The creditor hierarchy is the product; departing from it reprices every similar instrument.',
    'Credible resolution removes the funding subsidy that rewards being systemically large.',
    'Lend to the illiquid, resolve the insolvent — and the judgement has to be prepared in advance.',
    'A bank restored to solvency on Sunday still needs someone to fund it on Monday.',
  ],
});
