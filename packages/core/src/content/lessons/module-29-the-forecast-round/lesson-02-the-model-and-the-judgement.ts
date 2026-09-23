import { defineLesson } from '../../schema';

/**
 * What is actually inside the forecast, and where the humans intervene.
 */
export const theModelAndTheJudgementLesson = defineLesson({
  id: 'the-model-and-the-judgement',
  title: 'What Is Actually in the Machine',
  subtitle:
    'There is a model. There are also about forty places where somebody overrode it, and the overrides are where the forecast comes from.',
  icon: '⚙️',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'match-model-types',
      type: 'concept_match',
      tags: ['forecasting', 'models'],
      xp: 35,
      prompt: 'Four kinds of model in a forecasting suite. Match each to its job.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'semi',
          term: 'Semi-structural core model',
          definition: 'Tells a coherent story across the whole projection, at the cost of fitting badly',
        },
        {
          id: 'dsge',
          term: 'DSGE model',
          definition: 'Internally consistent and behavioural, so you can ask what a policy change does',
        },
        {
          id: 'bvar',
          term: 'Bayesian VAR',
          definition: 'Forecasts better in the near term and cannot explain why',
        },
        {
          id: 'nowcast',
          term: 'Nowcasting models',
          definition: 'Estimate the quarter you are in from high-frequency data, before the statistics arrive',
        },
      ],
      explanation:
        'No institution runs one model, because the properties trade off directly: the models that forecast best have the least economic content, and the models with the most content forecast worst. The core model exists to keep the story consistent — if you assume that much fiscal expansion you must accept this much import growth — and the statistical models exist to catch what the story is missing. A forecast round is largely the argument between them, and a governor who asks "what do the near-term models say that the core model does not" is asking the right question.',
    },
    {
      id: 'mc-add-factors',
      type: 'multiple_choice',
      tags: ['forecasting', 'judgement'],
      xp: 40,
      prompt:
        'Staff adjust the model’s output for things it cannot capture. What is the real risk of that practice?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'undocumented',
          label: 'They carry the forecast and nobody logs them',
        },
        {
          id: 'wrong',
          label: 'The judgements are often simply wrong',
          feedback:
            'They are frequently better than the model — staff know about the strike, the tax change and the one-off rebate. Being wrong is not the distinctive danger.',
        },
        {
          id: 'slow',
          label: 'It makes the whole process slower',
          feedback:
            'It does, and it is a cost worth paying. Speed is not what is at stake.',
        },
        {
          id: 'model',
          label: 'It undermines confidence in the model',
          feedback:
            'The model’s limitations are well known internally. The problem is about what can be learned later, not about anyone’s confidence.',
        },
      ],
      correctOptionId: 'undocumented',
      explanation:
        'When judgement carries most of the forecast and the judgements are not logged, the institution loses the ability to learn. You cannot tell afterwards whether the miss came from the model, from the conditioning assumptions or from an override that seemed obvious at the time — so the same mistake is available next year. The institutions that handled 2021 best were those that had recorded, in advance, which parts of the projection were model and which were judgement, because they could then say precisely which had failed. This is unglamorous documentation discipline and it is the difference between an institution that learns and one that repeats.',
    },
    {
      id: 'mc-model-blindspot',
      type: 'multiple_choice',
      tags: ['forecasting', 'models'],
      xp: 35,
      prompt:
        'Standard macro models struggled badly with 2021–22. What was the structural blind spot?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'nonlinear',
          label: 'They assume substitution where none was possible',
        },
        {
          id: 'money',
          label: 'They do not include the money supply at all',
          feedback:
            'Most do not, and the aggregates would have given a signal in 2021. They would also have given false signals repeatedly in the decade before, which is why they were dropped.',
        },
        {
          id: 'expectations',
          label: 'They model expectations formation badly',
          feedback:
            'A genuine and long-standing weakness. It does not explain the specific failure to see an output constraint that no amount of price adjustment could relieve.',
        },
        {
          id: 'fiscal',
          label: 'They understate fiscal multipliers',
          feedback:
            'Multipliers were probably underestimated in that episode. The deeper issue is what happens when the extra demand meets a supply side that physically cannot respond.',
        },
      ],
      correctOptionId: 'nonlinear',
      explanation:
        'Linear models treat the economy as continuously substitutable: if one input is scarce, its price rises and something else takes its place. In 2021 a ship, a port slot and a semiconductor were none of them substitutable at any price, so the price rose without the quantity responding — which is the Leontief case Module 5 covers. This is why the profession’s forecasts were not merely too low but wrong in structure, and it is why nonlinearity and capacity constraints have been the main modelling work since. A governor should know which of these limitations the house model still has.',
    },
    {
      id: 'order-challenge',
      type: 'order_flow',
      tags: ['forecasting', 'governance'],
      xp: 30,
      prompt: 'Order how a committee member should interrogate a projection.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'assumptions', label: 'What is it conditioned on?' },
        { id: 'change', label: 'What changed since last round, and why?' },
        { id: 'judgement', label: 'Which parts are model and which are judgement?' },
        { id: 'wrong', label: 'What would have to be true for this to be badly wrong?' },
        { id: 'act', label: 'Does the decision change if it is?' },
      ],
      correctOrder: ['assumptions', 'change', 'judgement', 'wrong', 'act'],
      explanation:
        'The last question is the one that turns analysis into a decision, and it is frequently the one that saves time: if the same rate decision follows under both the central case and the plausible alternative, the disagreement about the forecast does not need resolving. Conversely, when the answer is that the decision flips, the committee has found exactly where to spend its remaining hours. Most forecast arguments are about differences that would not change what anyone does.',
    },
  ],
  keyTakeaways: [
    'Models that forecast well have little economic content, and vice versa — you need both.',
    'Judgement usually carries the forecast; failing to log it prevents the institution learning.',
    'Linear models miss binding constraints, which is why 2021 was wrong in structure.',
    'The decisive question is whether the decision changes if the forecast is wrong.',
  ],
});
