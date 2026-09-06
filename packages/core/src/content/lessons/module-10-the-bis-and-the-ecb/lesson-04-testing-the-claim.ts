import { defineLesson } from '../../schema';

/**
 * The capstone: take the claim "the BIS influences ECB decisions", break it
 * into channels, and decide which survive contact with the evidence. The point
 * is a method the learner can apply to any claim about institutional power.
 */
export const testingTheClaimLesson = defineLesson({
  id: 'testing-the-claim',
  title: 'Separating the Real Channels from the Imagined Ones',
  subtitle:
    'Four claims about BIS influence over the ECB. Two are documented, one is confused, one is backwards.',
  icon: '🔍',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'match-verdicts',
      type: 'concept_match',
      tags: ['bis', 'ecb', 'evidence'],
      xp: 30,
      prompt: 'Match each claim about BIS influence to its verdict.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'capital',
          term: '"Basel sets the capital rules euro area banks must meet"',
          definition:
            'True with one correction: the EU legislature sets them, using Basel as the draft',
        },
        {
          id: 'frames',
          term: '"BIS analysis shapes how the ECB frames risks"',
          definition:
            'True, and visible in a decade of speeches answering it',
        },
        {
          id: 'rates',
          term: '"The BIS influences where the ECB sets its policy rate"',
          definition:
            'Unsupported: the two disagreed publicly for years and the ECB did as it judged',
        },
        {
          id: 'orders',
          term: '"Central banks answer to the BIS"',
          definition:
            'Backwards: they own it, bank with it, and chair its meetings',
        },
      ],
      explanation:
        'Two true, one unsupported, one inverted — and the inverted one is the popular version. The correction that does the most work is the first: not "Basel sets the rules" but "Basel writes a draft that a legislature can adopt, delay or rewrite", which the EU has now demonstrably done.',
    },

    {
      id: 'mc-strongest-evidence',
      type: 'multiple_choice',
      tags: ['bis', 'ecb', 'method'],
      xp: 25,
      prompt:
        'Someone claims the ECB takes orders from Basel. What single piece of evidence most cleanly tests it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'frtb',
          label: 'The EU postponing the Basel market risk framework twice and then amending it',
        },
        {
          id: 'independence',
          label: 'Article 130, which forbids taking instructions',
          feedback:
            'Strong, but it is a rule rather than an observation — and the reply "rules are ignored in practice" costs nothing to make. A documented instance of the EU not complying is harder to wave away.',
        },
        {
          id: 'ownership',
          label: 'The fact that central banks own the BIS',
          feedback:
            'Suggestive but not decisive on its own. Shareholders are sometimes captured by the institutions they own; you need an instance of the members actually overruling it.',
        },
        {
          id: 'balance-sheet',
          label: 'The BIS being much smaller than the Eurosystem',
          feedback:
            'That rules out influence by dealing, which nobody seriously claims. It says nothing about influence through standards or ideas.',
        },
      ],
      correctOptionId: 'frtb',
      explanation:
        'Prefer the observation over the rule. Article 130 says what should happen; the market risk delay shows what did happen, in public, with dates — a Basel standard the EU declined to apply on schedule and then rewrote to suit its own banks. Claims about power are tested by looking for the case where the alleged authority was not obeyed, and finding one.',
    },

    {
      id: 'flow-influence-order',
      type: 'order_flow',
      tags: ['bis', 'influence', 'method'],
      xp: 25,
      prompt:
        'Rank the channels from strongest evidence of real influence to weakest.',
      instructions: 'Strongest first',
      events: [
        {
          id: 'law',
          label: 'Standards that a legislature has enacted into binding law',
          detail: 'CRR3 and CRD6 — traceable text, dated, enforceable',
        },
        {
          id: 'measure',
          label: 'Statistics only the BIS assembles',
          detail: 'Whoever measures a thing shapes what can be argued about it',
        },
        {
          id: 'research',
          label: 'Published research that officials answer in speeches',
          detail: 'Shapes the terms of the debate, and is on the record',
        },
        {
          id: 'meetings',
          label: 'Six meetings a year among the same governors',
          detail: 'Real, unminuted, and impossible to evidence either way',
        },
        {
          id: 'orders',
          label: 'Direct instruction on policy decisions',
          detail: 'Unlawful under Article 130, and contradicted by the observed disagreements',
        },
      ],
      correctOrder: ['law', 'measure', 'research', 'meetings', 'orders'],
      explanation:
        'The ordering principle is how much of the channel leaves a trace. Enacted law is fully documented; a statistical monopoly is visible in every citation; published research can be tracked into speeches; a private meeting cannot be evidenced at all, which is exactly why it attracts claims that cannot be checked. The last item is not merely unevidenced — it is contradicted by cases where the ECB went the other way.',
    },

    {
      id: 'mc-so-what',
      type: 'multiple_choice',
      tags: ['bis', 'ecb', 'conclusion'],
      xp: 25,
      prompt:
        'You want to anticipate a change in what euro area banks must hold. Where do you look first?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'basel-then-brussels',
          label: 'Basel Committee consultations first, then the EU legislative file that would carry them',
        },
        {
          id: 'governing-council',
          label: 'ECB Governing Council statements',
          feedback:
            'Those tell you about interest rates. Capital requirements arrive through the supervisory arm, and they originate in a legislative file rather than in a monetary policy decision.',
        },
        {
          id: 'gem',
          label: 'The Global Economy Meeting communiqué',
          feedback:
            'It does not issue one, and it would not be the instrument if it did. The GEM gives guidance to committees; the committees consult; the legislature decides.',
        },
        {
          id: 'annual-report',
          label: 'The BIS Annual Economic Report',
        },
      ],
      correctOptionId: 'basel-then-brussels',
      explanation:
        'This is what the module is for. Basel consultations are published, often years ahead, and they tell you the direction. The EU file tells you whether it will actually arrive, when, and in what altered form — and on recent evidence the alteration is substantial. Watch both, in that order, and you can see a capital rule coming long before it reaches a bank. Watching for secret instructions gets you nothing, because the traceable channel is the one that works.',
    },
  ],
  keyTakeaways: [
    'Standards and framing are documented channels; direct instruction on policy is not, and is contradicted.',
    'The popular version is inverted: central banks own the BIS, bank with it and chair its meetings.',
    'Test a claim about power by looking for the case where the alleged authority was not obeyed.',
    'To see a capital rule coming: Basel consultations for the direction, the EU file for whether and in what form.',
  ],
});
