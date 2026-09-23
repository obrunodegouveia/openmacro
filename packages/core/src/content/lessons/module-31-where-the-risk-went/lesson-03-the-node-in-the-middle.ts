import { defineLesson } from '../../schema';

/**
 * Central counterparties. The post-2008 reform that worked, and the
 * concentration it created.
 */
export const theNodeInTheMiddleLesson = defineLesson({
  id: 'the-node-in-the-middle',
  title: 'The Institution Everything Now Runs Through',
  subtitle:
    'After 2008, derivatives were pushed into central clearing to remove counterparty risk. It worked. It also built a handful of institutions that cannot be allowed to fail.',
  icon: '🕸️',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'mc-what-ccp-does',
      type: 'multiple_choice',
      tags: ['ccp', 'clearing'],
      xp: 35,
      prompt: 'What does a central counterparty actually change about a trade?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'interposes',
          label: 'It becomes the counterparty to both sides',
        },
        {
          id: 'guarantees',
          label: 'It guarantees the trade will be profitable',
          feedback:
            'Market risk stays entirely with the participants. What is removed is the risk that the person on the other side fails to pay.',
        },
        {
          id: 'records',
          label: 'It records the trade for the regulators',
          feedback:
            'Trade repositories do that, and the transparency was a separate part of the same reform. A CCP takes on an actual position.',
        },
        {
          id: 'margin',
          label: 'It requires both sides to post margin',
          feedback:
            'It does, and margin is the mechanism that makes the interposition safe rather than the change itself.',
        },
      ],
      correctOptionId: 'interposes',
      explanation:
        'The CCP steps into the middle: the buyer’s counterparty is the CCP and so is the seller’s. A web of bilateral exposures — where nobody could tell who was exposed to whom, which is what made Lehman unresolvable in a weekend — becomes a hub and spokes, where the exposures are visible and netted. The reform genuinely worked. Its consequence is that the hub now concentrates what used to be spread across the web, and a handful of clearing houses sit at the centre of the global derivatives market.',
    },
    {
      id: 'order-waterfall',
      type: 'order_flow',
      tags: ['ccp', 'default-management'],
      xp: 40,
      prompt: 'A clearing member defaults. Order the default waterfall.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'margin', label: 'The defaulter’s own margin' },
        { id: 'fund', label: 'The defaulter’s contribution to the default fund' },
        { id: 'skin', label: 'A slice of the CCP’s own capital', detail: 'Deliberately placed here' },
        { id: 'mutual', label: 'The surviving members’ default fund contributions' },
        { id: 'assess', label: 'Further calls on surviving members' },
        { id: 'allocate', label: 'Allocating losses to those with winning positions' },
      ],
      correctOrder: ['margin', 'fund', 'skin', 'mutual', 'assess', 'allocate'],
      explanation:
        'The third step is small in money and large in incentives: placing the CCP’s own capital ahead of the surviving members ensures the institution setting the margin models has something to lose if it sets them too loosely. The last step is where it gets genuinely uncomfortable — at the end of the waterfall a CCP may haircut the gains of members who were on the right side of the trade, meaning a participant who hedged correctly does not get paid in full. That is the point at which clearing stops looking like insurance, and it is why the end of the waterfall is one of the most contested areas in financial regulation.',
    },
    {
      id: 'mc-concentration',
      type: 'multiple_choice',
      tags: ['ccp', 'systemic-risk'],
      xp: 40,
      prompt: 'What is the sharpest objection to how central clearing was implemented?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'concentrated',
          label: 'Risk was concentrated into institutions with no resolution regime to match',
        },
        {
          id: 'expensive',
          label: 'It made derivatives more expensive to trade',
          feedback:
            'It did, and that was intentional — the pre-reform price did not include the counterparty risk being taken. Correct pricing is not an objection.',
        },
        {
          id: 'ineffective',
          label: 'Bilateral exposures persisted anyway',
          feedback:
            'A large share of the market genuinely moved to clearing. The problem is what the destination looks like, not whether the migration happened.',
        },
        {
          id: 'foreign',
          label: 'Clearing happens in a few foreign jurisdictions',
          feedback:
            'Cross-border location is a real supervisory headache and a consequence of the concentration in the answer rather than a separate flaw.',
        },
      ],
      correctOptionId: 'concentrated',
      explanation:
        'Bank resolution regimes were built over a decade after 2008: bail-in debt, resolution planning, loss-absorbing capacity, cross-border agreements. The equivalent for a failing CCP is far less developed, and the question of who provides liquidity to one under stress mostly does not have a settled answer. So the reform converted a diffuse, opaque risk into a concentrated, visible one — which is progress, because visible concentrated risk can be supervised — while leaving the failure case underspecified. A governor should know whether their currency’s major clearing house is supervised at home or abroad, and what their own institution would be expected to do at three in the morning.',
    },
    {
      id: 'mc-liquidity-access',
      type: 'multiple_choice',
      tags: ['ccp', 'central-bank'],
      xp: 35,
      prompt:
        'Should a central counterparty have an account at the central bank and access to its liquidity?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'yes-conditions',
          label: 'Yes, with liquidity terms defined in advance',
        },
        {
          id: 'no',
          label: 'No — it would create severe moral hazard',
          feedback:
            'Refusing access does not make the CCP failable; it makes the improvised rescue worse. Moral hazard is managed by the conditions attached, not by silence.',
        },
        {
          id: 'yes-unlimited',
          label: 'Yes, with exactly the access a bank has',
          feedback:
            'A CCP is not supervised as a bank and does not hold bank capital, so identical access without matching requirements is the weakest combination available.',
        },
        {
          id: 'commercial',
          label: 'No — it should settle through commercial banks',
          feedback:
            'That routes systemic flows through institutions that may themselves be under stress, which is the concentration of risk the clearing reform was meant to undo.',
        },
      ],
      correctOptionId: 'yes-conditions',
      explanation:
        'This is the same argument as access for payment firms in the plumbing module, with higher stakes. Holding a CCP’s cash at the central bank removes the risk of it sitting at a commercial bank that fails. Liquidity access is the harder half: everyone knows a systemic CCP would be supported, so the choice is between deciding the terms now — collateral, price, conditions, who authorises it — or discovering them during a weekend when refusing is not an option. Pre-agreed terms are what convert an implicit guarantee into a priced and constrained one.',
    },
  ],
  keyTakeaways: [
    'A CCP replaces a web of bilateral exposures with a hub, and concentrates them there.',
    'The waterfall ends by haircutting the gains of members who were right.',
    'Clearing reform created institutions whose resolution regime is still underspecified.',
    'Liquidity access is better defined in advance than improvised on the night.',
  ],
});
