import { defineLesson } from '../../schema';

/**
 * Impaired transmission: the case where the instrument is set correctly and
 * does not arrive. Ties the module back to collateral, capital and the
 * balance sheet tools.
 */
export const whenTransmissionBreaksLesson = defineLesson({
  id: 'when-transmission-breaks',
  title: 'When You Set the Rate and Nothing Happens',
  subtitle:
    'The policy rate is an input. If the mechanism between it and the economy is impaired, the decision is correct and irrelevant.',
  icon: '🔌',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'mc-capital-constrained',
      type: 'multiple_choice',
      tags: ['transmission', 'bank-capital'],
      xp: 40,
      prompt:
        'A central bank cuts rates. Banks are close to their capital minimum. What happens to lending?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'constrained',
          label: 'Little changes — capital, not the rate, is what binds',
        },
        {
          id: 'rises',
          label: 'It rises, since funding is cheaper',
          feedback:
            'Cheaper funding helps a bank that can lend. A bank that would breach its requirement by expanding its balance sheet will not expand it at any funding cost.',
        },
        {
          id: 'falls',
          label: 'It falls, because margins compress',
          feedback:
            'Margin compression is a real effect and a second-order one. The binding constraint is the capital requirement against the assets.',
        },
        {
          id: 'shifts',
          label: 'It shifts toward safer borrowers',
          feedback:
            'This does happen, and it is a compositional consequence of the constraint in the answer rather than an alternative to it.',
        },
      ],
      correctOptionId: 'constrained',
      explanation:
        'This is why the euro area spent years cutting rates into an economy where credit was not responding, and it is the direct link between Module 21 and this one. A rate cut lowers the price of lending; it does nothing about a bank that cannot expand its balance sheet without breaching a requirement. The fix was never monetary — it was recapitalisation and cleaning up bad loans, which took most of a decade and belonged to supervisors and governments. A governor who diagnoses a capital constraint as a demand problem will cut into a mechanism that cannot respond.',
    },
    {
      id: 'match-impairments',
      type: 'concept_match',
      tags: ['transmission', 'impairment'],
      xp: 35,
      prompt: 'Four ways transmission breaks. Match each to the tool that addresses it.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'capital',
          term: 'Banks at their capital floor',
          definition: 'Recapitalisation and supervisory action — not a monetary tool at all',
        },
        {
          id: 'collateral',
          term: 'Banks short of eligible collateral',
          definition: 'Widen the eligible list or cut haircuts, which is a monetary decision',
        },
        {
          id: 'fragment',
          term: 'Sovereign spreads breaking the rate',
          definition: 'Targeted purchases, with conditions, aimed at the spread rather than the level',
        },
        {
          id: 'bound',
          term: 'The rate at its floor',
          definition: 'Duration purchases and guidance — act on the curve since the front end is stuck',
        },
      ],
      explanation:
        'Read as a set, these are most of the unconventional toolkit, and every one of them is a response to a specific broken channel rather than a general stimulus. That framing matters for how they are judged: a targeted longer-term lending operation is not "more easing", it is a repair to the bank lending channel, and it should be assessed on whether lending resumed. Governors who present these tools as extra stimulus invite the question of why they did not simply do more of it, which has no good answer.',
    },
    {
      id: 'mc-diagnosis',
      type: 'multiple_choice',
      tags: ['transmission', 'diagnosis'],
      xp: 40,
      prompt:
        'Credit is not growing after several cuts. How do you tell weak demand for loans from impaired supply?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'terms',
          label: 'Look at the terms — rejection rates and conditions, not just volumes',
        },
        {
          id: 'volumes',
          label: 'Compare lending volumes with previous cycles',
          feedback:
            'Volumes are the product of both forces and cannot separate them. Weak demand and impaired supply produce the same low number.',
        },
        {
          id: 'survey',
          label: 'Ask banks whether they are lending',
          feedback:
            'Bank lending surveys are genuinely useful and ask precisely about standards and demand separately — which is the distinction in the answer, applied properly.',
        },
        {
          id: 'gdp',
          label: 'Look at whether GDP is growing',
          feedback:
            'Too aggregated and too slow. By the time output separates the two explanations the diagnosis no longer matters.',
        },
      ],
      correctOptionId: 'terms',
      explanation:
        'Prices and quantities together identify what volumes alone cannot. If loan volumes are flat and banks are tightening standards and rejecting more applicants, supply is constrained. If volumes are flat while standards are loose and spreads are narrow, borrowers simply do not want to borrow — and no monetary easing will change that, because the problem is expected demand for their products. The two diagnoses call for completely different responses, and the bank lending survey exists to make the distinction observable quarterly rather than in hindsight.',
    },
    {
      id: 'order-repair',
      type: 'order_flow',
      tags: ['transmission', 'policy'],
      xp: 30,
      prompt: 'Order the response to a transmission mechanism that has stopped working.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'identify', label: 'Identify which channel has failed' },
        { id: 'own', label: 'Ask whether the fix is yours to make' },
        { id: 'targeted', label: 'Deploy the targeted tool for that channel' },
        { id: 'measure', label: 'Measure whether that channel resumed, not whether growth did' },
        { id: 'say', label: 'Say publicly what is outside monetary policy' },
      ],
      correctOrder: ['identify', 'own', 'targeted', 'measure', 'say'],
      explanation:
        'The second step is the one institutions skip. A central bank facing a broken channel it cannot repair — undercapitalised banks, an insolvent sovereign, a collapse in the demand for credit — is under enormous pressure to deploy monetary tools anyway, because it is the institution that can act quickly and it will be blamed otherwise. Doing so expands the balance sheet, takes on risk, and does not fix the problem, while relieving the pressure on whoever could have fixed it. Knowing which repairs are yours is not a jurisdictional nicety. It is the difference between a tool that works and a gesture with a balance sheet attached.',
    },
  ],
  keyTakeaways: [
    'A rate cut cannot move a bank constrained by capital rather than by price.',
    'Unconventional tools are repairs to specific broken channels, not general stimulus.',
    'Terms and rejection rates separate weak loan demand from impaired supply.',
    'Some broken channels are not yours to repair, and saying so is part of the job.',
  ],
});
