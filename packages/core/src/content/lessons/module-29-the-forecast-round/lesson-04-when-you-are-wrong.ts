import { defineLesson } from '../../schema';

/**
 * Forecast failure as an institutional problem. What to change after a large
 * miss, and — harder — what not to.
 */
export const whenYouAreWrongLesson = defineLesson({
  id: 'when-you-are-wrong',
  title: 'After a Very Large Miss',
  subtitle:
    'In 2021 essentially every central bank forecast inflation far too low, for four quarters running. The interesting question is what you do in 2022.',
  icon: '🪞',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'mc-systematic',
      type: 'multiple_choice',
      tags: ['forecasting', 'evaluation'],
      xp: 40,
      prompt: 'What distinguishes a forecast failure worth changing something over?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'same-direction',
          label: 'The errors run the same way for several rounds',
        },
        {
          id: 'large',
          label: 'The error is large',
          feedback:
            'A single large error can be an unforecastable shock, which is what the distribution already allows for. Size alone does not indicate a flaw in the process.',
        },
        {
          id: 'criticised',
          label: 'The forecast was publicly criticised',
          feedback:
            'Criticism follows large errors regardless of whether the process was at fault. Responding to attention rather than to evidence is how good procedures get discarded.',
        },
        {
          id: 'model',
          label: 'The model performed worse than a simple rule',
          feedback:
            'Simple rules often beat models at short horizons in normal times. That is a known property, not a diagnosis.',
        },
      ],
      correctOptionId: 'same-direction',
      explanation:
        'Random errors are the cost of forecasting and require nothing. Errors with the same sign quarter after quarter are evidence of something structural: a model misspecification, a conditioning assumption that was wrong and kept being made, or an institutional reluctance to publish a number the committee would find uncomfortable. The 2021 misses were serial and one-directional across many institutions at once, which points at a shared model assumption rather than bad luck — and that is exactly the kind of failure worth acting on.',
    },
    {
      id: 'order-post-mortem',
      type: 'order_flow',
      tags: ['forecasting', 'learning'],
      xp: 35,
      prompt: 'Order a forecast post-mortem that would actually teach you something.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'decompose', label: 'Decompose the error: assumptions, model, judgement' },
        { id: 'counterfactual', label: 'Ask what the forecast would have been with correct assumptions' },
        { id: 'pattern', label: 'Check whether the same error appears in earlier rounds' },
        { id: 'decision', label: 'Ask whether the decision would have differed' },
        { id: 'change', label: 'Change the thing that was actually responsible' },
      ],
      correctOrder: ['decompose', 'counterfactual', 'pattern', 'decision', 'change'],
      explanation:
        'The second step separates the two failures that get conflated. If oil was assumed at $70 and came in at $120, the model may have been perfectly fine and the conditioning assumption wrong — a different problem with a different fix, and often no fix at all, since nobody forecasts oil. Run the model with the outturn assumptions and see what is left: that residual is the part the institution owns. Most published post-mortems skip this step, which is why they usually conclude that the world was unusual.',
    },
    {
      id: 'mc-what-not-to-change',
      type: 'multiple_choice',
      tags: ['forecasting', 'governance'],
      xp: 40,
      prompt: 'After a large miss, what is the most common overcorrection?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'refight',
          label: 'Calibrating the process to the last shock',
        },
        {
          id: 'model',
          label: 'Replacing the core forecasting model',
          feedback:
            'Sometimes warranted and rarely the actual error. Replacing a model that was overridden by judgement changes nothing about what went wrong.',
        },
        {
          id: 'staff',
          label: 'Replacing the staff who produced it',
          feedback:
            'It happens and it is worse than useless: it teaches everyone remaining to forecast defensively, toward the consensus, which reduces the information in the projection.',
        },
        {
          id: 'publishing',
          label: 'Publishing rather less detail than before',
          feedback:
            'A real temptation after public criticism, and it removes the evidence needed to learn. It also tends to follow the overcorrection in the answer rather than lead it.',
        },
      ],
      correctOptionId: 'refight',
      explanation:
        'Every institution that missed the 2021 inflation is now much better calibrated for a supply-driven inflation surge, and there is no particular reason the next shock will be one. Fighting the last shock is how a forecasting process accumulates asymmetries: a bias toward seeing the previous crisis everywhere, and a blind spot for whatever is genuinely new. The defensible changes are the ones that would have helped across a range of shocks — nonlinear supply constraints, logged judgements, wider and honestly skewed fans, more weight on near-term statistical models. Those are improvements regardless of what comes next.',
    },
    {
      id: 'mc-communicating-error',
      type: 'multiple_choice',
      tags: ['forecasting', 'accountability'],
      xp: 35,
      prompt:
        'How should a central bank talk about a forecast it got badly wrong? Consider what each option costs.',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'specific',
          label: 'Say which part was wrong and what was changed because of it',
        },
        {
          id: 'unprecedented',
          label: 'Explain that conditions were unprecedented',
          feedback:
            'Often true and it is what every institution says, which is why it carries no information. An explanation that would have been offered regardless of the cause explains nothing.',
        },
        {
          id: 'minimal',
          label: 'Note the error and move on to the current projection',
          feedback:
            'It protects the institution briefly and forfeits the chance to show that it has a process for learning, which is what its credibility rests on.',
        },
        {
          id: 'others',
          label: 'Point out that other forecasters missed it too',
          feedback:
            'Accurate and read as deflection. A shared error is still evidence about a shared assumption worth examining.',
        },
      ],
      correctOptionId: 'specific',
      explanation:
        'Credibility does not come from being right, which no forecaster manages reliably. It comes from demonstrating a process that detects and corrects error — so the specific admission is the stronger position, not the weaker one. "Our oil assumption was wrong and we do not forecast oil; separately, our model understated how quickly services prices followed, and here is what changed" is an institution that can be trusted with the next forecast. Institutions that only ever explain why the miss was unavoidable are making a claim nobody can check and inviting the conclusion that nothing was learned.',
    },
  ],
  keyTakeaways: [
    'Serial one-directional errors indicate something structural; single large ones may not.',
    'Separate wrong assumptions from a wrong model before concluding anything.',
    'The common overcorrection is calibrating to the last shock.',
    'Credibility comes from a visible correction process, not from being right.',
  ],
});
