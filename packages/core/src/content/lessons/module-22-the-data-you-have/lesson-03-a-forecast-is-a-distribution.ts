import { defineLesson } from '../../schema';

/**
 * What a published forecast actually is, and the two things about it that are
 * routinely misread: that it is conditional, and that the point is the least
 * informative part of it.
 *
 * The Bank of England introduced the fan chart in its February 1996 Inflation
 * Report for precisely this reason.
 */
export const aForecastIsADistributionLesson = defineLesson({
  id: 'a-forecast-is-a-distribution',
  title: 'The Line in the Middle Is the Least Useful Part',
  subtitle:
    'A central bank forecast is a conditional distribution. Almost everyone reads it as an unconditional promise.',
  icon: '🌫️',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'mc-conditional',
      type: 'multiple_choice',
      tags: ['forecasting', 'projections'],
      xp: 35,
      prompt:
        'A central bank projects inflation back at target in two years. Market rates are priced for four cuts over that period. What has been said?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'conditional',
          label: 'That inflation returns to target *if* those cuts happen',
        },
        {
          id: 'promise',
          label: 'That inflation will in fact be at target two years from now',
          feedback:
            'This is the standard misreading, and central banks have stopped fighting it. The projection is a statement about a world in which a particular rate path occurs, not a claim about the world.',
        },
        {
          id: 'cuts',
          label: 'That the bank intends to cut four times',
          feedback:
            'It has adopted the market’s path as an assumption, which is closer to reading the market back to itself than to announcing an intention. Some banks publish their own path instead, and the difference between those two conventions matters enormously.',
        },
        {
          id: 'disagree',
          label: 'That the bank disagrees with market pricing',
          feedback:
            'Conditioning on the market path means taking it as given rather than endorsing or disputing it. Disagreement would show up as a projection that misses target under that path.',
        },
      ],
      correctOptionId: 'conditional',
      explanation:
        'Conditioning is the most misunderstood feature of published projections. An inflation forecast that returns to target under an assumed rate path tells you the path is roughly consistent with the mandate — nothing more. Read it as a promise and you will be outraged when it is missed; read it as a conditional statement and you can check the interesting thing, which is what would have to be true for it to hold.',
    },
    {
      id: 'mc-fan-chart',
      type: 'multiple_choice',
      tags: ['forecasting', 'uncertainty'],
      xp: 35,
      prompt:
        'The Bank of England began publishing fan charts in 1996 — a distribution rather than a line. What was the point?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'honest',
          label: 'To make the uncertainty part of the message rather than a footnote to it',
        },
        {
          id: 'hedge',
          label: 'To make the forecast harder to hold them to',
          feedback:
            'The cynical reading, and it does not survive the design: a fan chart commits you to a stated width, which is a testable claim. A bank whose outturns fall outside its own bands too often has been caught being overconfident.',
        },
        {
          id: 'accuracy',
          label: 'To improve forecast accuracy',
          feedback:
            'Presentation does not change the central estimate. It changes what the reader does with it, which was the aim.',
        },
        {
          id: 'model',
          label: 'Because the models produce distributions naturally',
          feedback:
            'The width of a fan chart is usually calibrated on historical forecast errors rather than falling out of a model. The choice of what to publish was the innovation.',
        },
      ],
      correctOptionId: 'honest',
      explanation:
        'A point forecast invites a question it cannot answer — will inflation be 2.1 or 2.4 — and conceals the one that matters, which is how confident anyone is. A fan chart makes the width visible, and publishing the width is a commitment: if outturns keep landing outside the bands, the institution has been caught claiming more precision than it had. Presenting uncertainty honestly is a discipline on the forecaster, not an escape from one.',
    },
    {
      id: 'match-forecast-vs-scenario',
      type: 'concept_match',
      tags: ['forecasting', 'scenarios'],
      xp: 30,
      prompt: 'Three things that get called forecasts. Match each to what it is for.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'central',
          term: 'The central projection',
          definition: 'The most likely path under stated assumptions — the thing that gets quoted and the least informative',
        },
        {
          id: 'scenario',
          term: 'A scenario',
          definition: 'A coherent alternative world, built to test whether the decision changes if it happens',
        },
        {
          id: 'reverse',
          term: 'A conditioning exercise',
          definition: 'What would have to be true for the outcome you fear — run backwards from the result',
        },
      ],
      explanation:
        'The second and third are where the work happens, and neither is a prediction. A committee that has only a central projection can discuss whether it believes a number; one that has scenarios can discuss whether its decision survives being wrong — which is the only question a decision-maker under uncertainty can usefully ask. When the projections were publicly wrong in 2021, the institutions that came out of it best were those whose published material had already described the world in which they would be.',
    },
    {
      id: 'mc-when-wrong',
      type: 'multiple_choice',
      tags: ['forecasting', 'credibility'],
      xp: 35,
      prompt:
        'Your forecast has been badly wrong for a year. What is the technically correct response?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'diagnose',
          label: 'Find which input was wrong and whether the error was random or one-directional',
        },
        {
          id: 'defend',
          label: 'Defend it — the assumptions were reasonable at the time',
          feedback:
            'They may well have been, and that is an argument about blame rather than about the model. If the errors are all in the same direction, something is wrong regardless of how reasonable each decision looked.',
        },
        {
          id: 'replace',
          label: 'Replace the model',
          feedback:
            'Often the eventual answer and never the first step. A model replaced without diagnosing the failure tends to reproduce it, because the error usually lives in an assumption rather than in the equations.',
        },
        {
          id: 'judgement',
          label: 'Rely on judgement instead of the model',
          feedback:
            'Judgement is already inside every published forecast, adjusting what the model produces. Removing the model removes the record of what was assumed, which is what makes learning from the error possible.',
        },
      ],
      correctOptionId: 'diagnose',
      explanation:
        'One-directional errors are the diagnostic. Random errors mean the world is uncertain, which is not news; a year of misses all on the same side means an assumption is systematically wrong, and the value of a published forecast is that the assumptions were written down and can be checked. Every serious central bank ran this exercise after 2021, and the answers were specific — energy pass-through, the speed of supply normalisation, how much of the fiscal transfer would be spent — rather than a general admission of difficulty.',
    },
  ],
  keyTakeaways: [
    'A published projection is conditional on an assumed rate path, not a promise.',
    'Publishing the width of the uncertainty is a commitment, not an escape.',
    'Scenarios test whether the decision survives being wrong, which the central projection cannot.',
    'One-directional forecast errors point at an assumption; random ones point at the world.',
  ],
});
