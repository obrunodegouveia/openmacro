import { defineLesson } from '../../schema';

/**
 * The payment system, which for many central banks is the largest
 * operational responsibility they have and the one nobody asks about.
 */
export const settlementIsTheProductLesson = defineLesson({
  id: 'settlement-is-the-product',
  title: 'The Thing a Central Bank Actually Operates',
  subtitle:
    'Monetary policy is a committee meeting eight times a year. Settlement runs every second, and it is the same institution.',
  icon: '🔧',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-why-central-bank',
      type: 'multiple_choice',
      tags: ['payments', 'settlement'],
      xp: 30,
      prompt: 'Why does the central bank operate the system banks settle in, rather than a private clearing house?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'riskless',
          label: 'Its money is the one claim in the system that cannot fail',
        },
        {
          id: 'regulation',
          label: 'Because it supervises the banks that participate in it',
          feedback:
            'Supervision and operation are separate functions, and several countries split them between institutions. The reason is about the asset being settled in, not about who writes the rules.',
        },
        {
          id: 'efficiency',
          label: 'It can run the system more cheaply than a private operator would',
          feedback:
            'Private clearing houses have often been cheaper and faster. What they cannot be is riskless, and speed is not what is being bought.',
        },
        {
          id: 'data',
          label: 'To see the payment flows crossing the economy in real time',
          feedback:
            'The data is genuinely valuable and it is a by-product. The system would exist even if nobody looked at what crossed it.',
        },
      ],
      correctOptionId: 'riskless',
      explanation:
        'A payment between two banks is settled when a claim on somebody changes hands, and the question is always whose claim. Settle in a commercial bank’s money and every participant is exposed to that bank. Settle in central bank money and the claim is on an institution that cannot run out of its own liabilities — which is the same property the whole course has been building on, applied to plumbing. It is why final settlement is a central bank function in essentially every country.',
    },
    {
      id: 'match-settlement-designs',
      type: 'concept_match',
      tags: ['rtgs', 'netting', 'payments'],
      xp: 30,
      prompt: 'Two designs, and what each costs. Match them.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'rtgs',
          term: 'Real-time gross settlement',
          definition: 'Each payment settles individually and finally, which removes credit risk and demands far more liquidity',
        },
        {
          id: 'netting',
          term: 'Deferred net settlement',
          definition: 'Obligations offset through the day and only the balance settles, which is cheap in liquidity and leaves exposure until it does',
        },
        {
          id: 'hybrid',
          term: 'Hybrid systems',
          definition: 'Queue payments, offset what can be offset continuously, and settle the rest gross — most large systems now',
        },
      ],
      explanation:
        'The trade is liquidity against risk, and it is the central design decision in the field. Gross settlement needs each bank to have the money at the moment of payment; netting lets them owe each other until the end of the day and then settle a small residue. The world moved to gross settlement after the Herstatt failure in 1974 showed what an unsettled obligation across a time zone costs — and then spent thirty years inventing ways to get the liquidity efficiency of netting back without the exposure.',
    },
    {
      id: 'mc-finality',
      type: 'multiple_choice',
      tags: ['settlement', 'finality', 'law'],
      xp: 35,
      prompt:
        'Settlement finality is a legal concept as much as a technical one. Why does it need a statute?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'insolvency',
          label: 'Insolvency law would otherwise let a failed bank’s payments be unwound',
        },
        {
          id: 'speed',
          label: 'To make settlement complete faster across the day',
          feedback:
            'Finality is about whether a settled payment can be reversed later, not about how quickly it happens. A fast system without legal finality is fast and fragile.',
        },
        {
          id: 'disputes',
          label: 'To resolve payment disputes between participating banks',
          feedback:
            'Commercial disputes are handled by contract. The thing a statute is needed for is a third party — an insolvency administrator — reaching back into a completed settlement.',
        },
        {
          id: 'international',
          label: 'Because payments frequently cross national borders',
          feedback:
            'Cross-border settlement adds conflict-of-laws problems on top. The core need exists inside one jurisdiction with one currency.',
        },
      ],
      correctOptionId: 'insolvency',
      explanation:
        'Ordinary insolvency law lets an administrator claw back transactions made in the period before a failure. Applied to a payment system that would mean every bank which received money from a failed bank that morning could be asked for it back — days later, after they had passed it on. Settlement finality legislation carves the system out of that, which is what makes a completed settlement genuinely completed. It is the least glamorous statute a central bank depends on and the one without which none of the rest works.',
    },
    {
      id: 'mc-who-gets-an-account',
      type: 'multiple_choice',
      tags: ['access', 'payments'],
      xp: 35,
      prompt:
        'Who is allowed to hold an account at the central bank is a policy decision. What does granting access to a non-bank payment firm actually change?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'no-sponsor',
          label: 'It settles directly rather than through a competitor',
        },
        {
          id: 'safer',
          label: 'Its customers’ balances become covered by deposit insurance',
          feedback:
            'Deposit insurance is separate and usually does not follow. Holding balances at the central bank makes the money safe in a different way — there is no institution left to fail — without any scheme being involved.',
        },
        {
          id: 'regulated',
          label: 'It becomes a licensed and supervised bank',
          feedback:
            'Access is usually granted with its own requirements attached and without a banking licence. Keeping those two separable is precisely the policy question.',
        },
        {
          id: 'lending',
          label: 'It can begin creating deposits by making loans',
          feedback:
            'Deposit creation follows from lending under a banking licence. An account for settlement does not confer it.',
        },
      ],
      correctOptionId: 'no-sponsor',
      explanation:
        'This is competition policy conducted through an operational decision, and it is where the CBDC argument quietly lives. A payment firm that must settle through a sponsoring bank depends on a competitor for its access to the system and pays for the privilege. Opening access removes that, and it also removes a layer of supervision the sponsoring bank was performing. Every country has now had this argument, and almost none of it happened in public.',
    },
  ],
  keyTakeaways: [
    'Settlement is a central bank function because its money is the only claim that cannot fail.',
    'Gross settlement removes credit risk and demands liquidity; netting does the reverse.',
    'Settlement finality needs a statute, because insolvency law would otherwise unwind completed payments.',
    'Who may hold an account is competition policy, decided operationally.',
  ],
});
