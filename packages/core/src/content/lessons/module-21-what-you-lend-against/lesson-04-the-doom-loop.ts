import { defineLesson } from '../../schema';

/**
 * What the framework does when the collateral is the sovereign and the
 * borrower is a bank in the same country.
 */
export const theDoomLoopLesson = defineLesson({
  id: 'the-doom-loop',
  title: 'When the Collateral Is Your Own Government',
  subtitle:
    'Banks hold the state’s debt, the state stands behind the banks, and each is the other’s weak point.',
  icon: '🔁',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'order-doom-loop',
      type: 'order_flow',
      tags: ['doom-loop', 'sovereign', 'banks'],
      xp: 35,
      prompt: 'Put the loop in order, starting from a sovereign under pressure.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'yields', label: 'The government’s bond yields rise' },
        { id: 'losses', label: 'Banks holding those bonds take mark-to-market losses', detail: 'They hold a great deal of them' },
        { id: 'capital', label: 'Bank capital ratios fall and funding gets harder' },
        { id: 'lending', label: 'Banks lend less, and the economy slows' },
        { id: 'revenue', label: 'Tax revenue falls and the deficit widens' },
        { id: 'again', label: 'The sovereign looks weaker still', detail: 'And the loop starts again' },
      ],
      correctOrder: ['yields', 'losses', 'capital', 'lending', 'revenue', 'again'],
      explanation:
        'It runs in the other direction too — a banking system that has to be rescued turns a manageable public debt into an unmanageable one, which is Ireland in 2010. The loop has no natural stopping point, which is why it took a central bank saying it would do whatever it takes to break it in 2012 rather than anything in the banks’ own accounts changing.',
    },
    {
      id: 'mc-why-banks-hold',
      type: 'multiple_choice',
      tags: ['doom-loop', 'regulation'],
      xp: 35,
      prompt:
        'Why do banks hold so much of their own government’s debt, when concentration is exactly what a supervisor should hate?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'rules',
          label: 'The rules encourage it: a zero risk weight, and eligibility as collateral',
        },
        {
          id: 'patriotism',
          label: 'Political pressure to fund the state',
          feedback:
            'It happens, especially under stress, and it is not needed to explain the pattern. The incentives make it the profitable choice before anyone makes a phone call.',
        },
        {
          id: 'safest',
          label: 'It is genuinely the safest asset available to them',
          feedback:
            'For some sovereigns, yes. The pattern holds even where it plainly is not the safest asset, which is what points at the rules rather than at the risk.',
        },
        {
          id: 'liquidity',
          label: 'They need it to meet liquidity requirements',
          feedback:
            'A real driver and part of the same story — it qualifies as a high-quality liquid asset because the central bank will lend against it, which is the eligibility point again.',
        },
      ],
      correctOptionId: 'rules',
      explanation:
        'A zero risk weight means holding it costs no capital, so it can be bought on leverage without constraint. Eligibility means it converts to cash on demand. Liquidity rules count it as a liquid asset. Three separate rulebooks all push the same way, and none of them was written with the concentration in mind. The euro area has debated ending the zero risk weight for a decade and has not, because doing so would force a large, disorderly sale of exactly the bonds nobody wants sold.',
    },
    {
      id: 'mc-eligibility-as-weapon',
      type: 'multiple_choice',
      tags: ['collateral', 'sovereign', 'crisis'],
      xp: 35,
      prompt:
        'A central bank’s framework requires a minimum credit rating. A member state is downgraded below it. What is the real choice?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'either-way',
          label: 'Either outcome is a policy decision — enforcing the rule is as consequential as waiving it',
        },
        {
          id: 'enforce',
          label: 'Enforce it: rules exist to be applied',
          feedback:
            'Enforcing it removes the funding of every bank in that country overnight. That is not the neutral option; it is the most aggressive action available, taken by doing nothing.',
        },
        {
          id: 'waive',
          label: 'Waive it: the alternative is a banking collapse',
          feedback:
            'Often the right call and never free. A threshold that is suspended whenever it binds is not a threshold, and the market prices the next suspension immediately.',
        },
        {
          id: 'technical',
          label: 'It is a technical matter for the risk management function',
          feedback:
            'It is decided there in calm times and it stops being technical the moment it determines whether a country’s banks can fund themselves.',
        },
      ],
      correctOptionId: 'either-way',
      explanation:
        'The ECB waived the rating threshold for Greek debt in 2010, suspended the waiver in 2015, and restored it later — each time with enormous consequences for Greek banks, and each time describing the decision as a technical application of its framework. Both readings are honest: it *is* a rule about risk to the central bank’s balance sheet, and it *is* the switch that determines whether a banking system has funding. A governor who does not understand that their eligibility criteria are a lever will find themselves pulling it by accident.',
    },
    {
      id: 'match-breaking-the-loop',
      type: 'concept_match',
      tags: ['doom-loop', 'banking-union'],
      xp: 30,
      prompt: 'Four things that weaken the loop. Match each to the link it cuts.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'concentration',
          term: 'Concentration limits',
          definition: 'Stops one government’s trouble landing on its own banks’ balance sheets',
        },
        {
          id: 'resolution',
          term: 'Bail-in and a common resolution fund',
          definition: 'Stops a failing bank becoming its own government’s liability',
        },
        {
          id: 'insurance',
          term: 'Common deposit insurance',
          definition: 'Stops a deposit’s safety depending on which state stands behind it',
        },
        {
          id: 'backstop',
          term: 'A central bank backstop',
          definition: 'Stops a self-fulfilling run on a solvent state — and is the only one of the four that exists in full',
        },
      ],
      explanation:
        'Three of the four are still partial in the euro area more than a decade after they were proposed, and the fourth — the central bank — carries the load because it is the one instrument that did not require agreement between governments. That is not a comfortable position for a central bank to occupy, and it is the technical reason so much political weight ends up on monetary policy: the other three links were supposed to be cut by somebody else.',
    },
  ],
  keyTakeaways: [
    'The loop runs both ways and has no natural stopping point.',
    'Three separate rulebooks each encourage banks to hold their own sovereign.',
    'Enforcing an eligibility threshold is as consequential as waiving it.',
    'The central bank carries the loop because the other remedies need agreement between governments.',
  ],
});
