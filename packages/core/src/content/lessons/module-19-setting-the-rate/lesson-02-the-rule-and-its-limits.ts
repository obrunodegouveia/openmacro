import { defineLesson } from '../../schema';

/**
 * The Taylor rule, driven by hand, and then the three situations where
 * following it would be wrong.
 *
 * Taylor published it in 1993 with coefficients of 0.5 and 0.5 and r* of 2%,
 * fitted to what the Fed had already been doing. It was a description that
 * became a benchmark, and the useful thing about it is not the number it
 * produces but the discipline it imposes: the response to inflation has to
 * raise the real rate, or inflation feeds itself.
 */
export const theRuleAndItsLimitsLesson = defineLesson({
  id: 'the-rule-and-its-limits',
  title: 'A Rule You Should Not Follow',
  subtitle:
    'Drive the Taylor rule yourself, then find the three places where doing what it says would be a mistake.',
  icon: '📏',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'sim-taylor',
      type: 'interactive_sim',
      tags: ['taylor-rule', 'policy-rate'],
      xp: 40,
      constants: { inflationWeight: 0.5, gapWeight: 0.5, target: 0.02 },
      prompt: 'Set the rate the way the rule would.',
      instructions: 'Push inflation to 9%, then find a setting the rule cannot deliver',
      narrative:
        'i = r* + π + 0.5(π − target) + 0.5(output gap). The target is 2%. Inflation above it raises the rate by more than one-for-one, which is the whole point — the real rate has to rise, or inflation feeds itself. The output gap is how far production is above or below what the economy can sustain. Watch the stance readout: it is the part of the prescription that is not simply tracking inflation.',
      sliders: [
        {
          key: 'inflation',
          label: 'Inflation now',
          min: -0.02,
          max: 0.12,
          step: 0.005,
          defaultValue: 0.02,
          format: 'percent',
          hint: 'The euro area touched 10.6% in October 2022',
        },
        {
          key: 'outputGap',
          label: 'Output gap',
          min: -0.06,
          max: 0.04,
          step: 0.005,
          defaultValue: 0,
          format: 'percent',
          hint: 'Negative means the economy is producing less than it could',
        },
        {
          key: 'neutralReal',
          label: 'Neutral real rate (r*)',
          min: -0.01,
          max: 0.03,
          step: 0.005,
          defaultValue: 0.005,
          format: 'percent',
          hint: 'Estimated, never observed — move it and watch everything shift',
        },
      ],
      readouts: [
        {
          key: 'prescribed',
          label: 'Rate the rule prescribes',
          formulaId: 'taylor_rate',
          format: 'percent',
          emphasis: true,
          caption: 'r* + π + 0.5(π − target) + 0.5(gap)',
        },
        {
          key: 'floored',
          label: 'What you can actually set',
          formulaId: 'taylor_rate_floored',
          format: 'percent',
          caption: 'the same, floored at zero',
        },
        {
          key: 'stance',
          label: 'Stance',
          formulaId: 'policy_stance',
          format: 'percent',
          caption: 'above zero is restrictive',
        },
      ],
      objective: {
        description: 'Reach a deflationary slump where the rule asks for a rate below zero',
        requiredObservations: [{ sliderKey: 'inflation', values: [0.09] }],
        target: { readoutKey: 'prescribed', comparator: 'lte', value: -0.005 },
      },
      explanation:
        'Two things you just produced. At 9% inflation the rule asks for double digits — roughly what it prescribed through 2022, against actual policy rates that peaked far lower, which is a real and unresolved argument rather than evidence that somebody was asleep. And in a slump it asks for a rate below zero, which you cannot set: the gap between the two readouts is the part of the prescription that has to be delivered some other way, and is the reason asset purchases and forward guidance were invented.',
    },
    {
      id: 'mc-taylor-principle',
      type: 'multiple_choice',
      tags: ['taylor-rule', 'stability'],
      xp: 35,
      prompt:
        'Why must the nominal rate rise by *more* than one point when inflation rises by one point?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'real-rate',
          label: 'Otherwise the real rate falls, so higher inflation loosens policy',
        },
        {
          id: 'credibility',
          label: 'To show markets the central bank is serious',
          feedback:
            'Signalling matters and is not the mechanism. Even a bank nobody watched would need this, because the arithmetic of the real rate does not care who is looking.',
        },
        {
          id: 'overshoot',
          label: 'To overshoot deliberately and bring inflation down faster',
          feedback:
            'The condition holds even when you only want to hold inflation steady. It is the minimum for stability, not a choice to be aggressive.',
        },
        {
          id: 'expectations',
          label: 'Because expectations adapt with a lag',
          feedback:
            'Expectations matter enormously and the principle does not depend on them. Take them as fixed and the arithmetic still holds.',
        },
      ],
      correctOptionId: 'real-rate',
      explanation:
        'This is the Taylor principle, and it is the closest thing to a law in this subject. Raise nominal by 0.5 when inflation rises by 1 and the real rate has *fallen* by 0.5 — you have loosened into an inflation. The system then has no anchor: inflation raises itself. A central bank that consistently fails this test does not have a policy, it has a feedback loop, and the 1970s are what that looks like.',
    },
    {
      id: 'order-when-not-to-follow',
      type: 'order_flow',
      tags: ['taylor-rule', 'judgement'],
      xp: 30,
      prompt: 'A rule is a benchmark. Put the reasons to depart from it in order of how often they bite.',
      instructions: 'Drag the steps into order, most routine first',
      events: [
        { id: 'rstar', label: 'r* is uncertain, so the level it prescribes is too', detail: 'Every meeting' },
        { id: 'gap', label: 'The output gap is an estimate revised for years afterwards' },
        { id: 'supply', label: 'A supply shock: tightening cannot make more gas' },
        { id: 'zlb', label: 'The prescription is below zero and cannot be set' },
        { id: 'stability', label: 'Tightening that far would break something in the financial system', detail: 'Rare, and decisive when it happens' },
      ],
      correctOrder: ['rstar', 'gap', 'supply', 'zlb', 'stability'],
      explanation:
        'The first two apply at every meeting and are about measurement — the inputs are noisy, so the output cannot be precise. The middle two are structural: the rule assumes demand-driven inflation and an unconstrained instrument, and neither holds in a supply shock or at the floor. The last is the one that ends careers, and March 2023 is the case: the rule said keep going, three American banks had already failed, and those are the same decision.',
    },
    {
      id: 'mc-rule-value',
      type: 'multiple_choice',
      tags: ['taylor-rule', 'framework'],
      xp: 30,
      prompt: 'If you would depart from the rule that often, what is it for?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'burden',
          label: 'It makes you name your reason for departing',
        },
        {
          id: 'automate',
          label: 'To automate the decision and take human error out of it',
          feedback:
            'Taylor himself presented it as a description of decisions already made. No central bank has ever delegated the decision to it, and one that did would be helpless in the situations the previous challenge listed.',
        },
        {
          id: 'forecast',
          label: 'To forecast what the central bank will do next',
          feedback:
            'Markets do use it that way and it works moderately well. That is a use others make of it, not what it is for inside the building.',
        },
        {
          id: 'nothing',
          label: 'Nothing much — it is a teaching device',
          feedback:
            'Too dismissive. Every inflation-targeting central bank publishes rule prescriptions in its own materials precisely because a benchmark you must argue against is more disciplining than no benchmark at all.',
        },
      ],
      correctOptionId: 'burden',
      explanation:
        'The value is the burden of proof. Without a benchmark, any rate can be justified after the fact; with one, a committee that sets policy two points below the prescription has to say why, in writing, at the time. That record is what makes it possible to learn later whether the reason was good — which is the only way this job improves.',
    },
  ],
  keyTakeaways: [
    'The nominal rate must rise more than one-for-one with inflation, or inflation feeds itself.',
    'The rule asks for the impossible at the floor, which is what asset purchases were invented for.',
    'A benchmark is worth having because it forces you to name your reason for departing from it.',
  ],
});
