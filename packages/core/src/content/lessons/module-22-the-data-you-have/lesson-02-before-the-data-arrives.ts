import { defineLesson } from '../../schema';

/**
 * Nowcasting: what you can know about the quarter you are living in, and the
 * discipline of not being fooled by the fastest series.
 */
export const beforeTheDataArrivesLesson = defineLesson({
  id: 'before-the-data-arrives',
  title: 'Knowing the Quarter You Are In',
  subtitle:
    'Official output arrives weeks after the quarter ends. Decisions do not wait, so you assemble the number from things that arrive daily.',
  icon: '📡',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'match-fast-indicators',
      type: 'concept_match',
      tags: ['nowcasting', 'indicators'],
      xp: 30,
      prompt: 'Match each fast indicator to what it is actually telling you.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'pmi',
          term: 'Purchasing manager surveys',
          definition: 'Direction, not level — a reading above fifty says more firms are expanding than contracting, and nothing about by how much',
        },
        {
          id: 'cards',
          term: 'Card and payment data',
          definition: 'Household spending within days, at the cost of covering only what is bought by card',
        },
        {
          id: 'electricity',
          term: 'Electricity and freight volumes',
          definition: 'Physical activity, unrevised and hard to fake — and increasingly detached from output as economies decarbonise',
        },
        {
          id: 'postings',
          term: 'Job postings',
          definition: 'Labour demand turning before employment does, because hiring stops long before firing starts',
        },
      ],
      explanation:
        'Each is fast because it is narrow. The nowcaster’s job is to combine them into an estimate of something none of them measures, while remembering what each one leaves out — card data missed the cash economy, electricity has been drifting away from output for two decades, and a survey of direction cannot tell you the size of anything.',
    },
    {
      id: 'mc-overfitting',
      type: 'multiple_choice',
      tags: ['nowcasting', 'method'],
      xp: 35,
      prompt:
        'A high-frequency series turns sharply for two weeks. What is the disciplined response?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'corroborate',
          label: 'Ask whether anything slower is pointing the same way, and wait if nothing is',
        },
        {
          id: 'act',
          label: 'Act on it — the whole point of fast data is speed',
          feedback:
            'Speed is only valuable if the signal is real. High-frequency series are dominated by noise, weather, holidays and calendar effects, and a committee that moves on two weeks of one series will be reversing itself within the quarter.',
        },
        {
          id: 'ignore',
          label: 'Ignore it until the official data confirms',
          feedback:
            'That discards the entire advantage of watching it, and by then the decision window is gone. The answer is corroboration, not dismissal.',
        },
        {
          id: 'model',
          label: 'Add it to the model with a higher weight',
          feedback:
            'Weighting a series more because it just moved is fitting the model to the most recent noise — the classic way a nowcasting system degrades over time.',
        },
      ],
      correctOptionId: 'corroborate',
      explanation:
        'Fast data earns its place by being corroborated, not by being fast. The discipline is to specify in advance which combination of series would change your view and by how much, rather than to look at what moved and construct a story around it — because there is always something moving, and a committee can always find one.',
    },
    {
      id: 'mc-what-nowcast-is',
      type: 'multiple_choice',
      tags: ['nowcasting', 'forecasting'],
      xp: 30,
      prompt: 'What is the difference between a nowcast and a forecast?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'already-happened',
          label: 'A nowcast estimates what has already happened',
        },
        {
          id: 'shorter',
          label: 'A nowcast is simply a forecast with a much shorter horizon',
          feedback:
            'Close enough to be misleading. The horizon is not merely short, it is negative — the quarter being nowcast is partly or wholly in the past, so the uncertainty is about measurement rather than about the future.',
        },
        {
          id: 'accurate',
          label: 'A nowcast is more accurate',
          feedback:
            'It usually is, and that is a consequence of estimating something that has already occurred rather than a property of the method.',
        },
        {
          id: 'model',
          label: 'A nowcast uses data and a forecast uses a model',
          feedback:
            'Both use both. Nowcasts are typically statistical rather than structural, which is a choice about tools rather than the definition.',
        },
      ],
      correctOptionId: 'already-happened',
      explanation:
        'The distinction matters for how much confidence each deserves. A nowcast is an inference about the recent past from partial information, and it converges as more data arrives. A forecast is a claim about a future that has not been determined yet, and no amount of data will resolve it before it happens. Treating the two with the same confidence — in either direction — is a standard error.',
    },
    {
      id: 'order-information-arrives',
      type: 'order_flow',
      tags: ['nowcasting', 'data'],
      xp: 30,
      prompt: 'Put the flow of information about one quarter in order.',
      instructions: 'Drag the steps into the order they reach you',
      events: [
        { id: 'daily', label: 'Payments, energy and freight data', detail: 'Daily, through the quarter' },
        { id: 'surveys', label: 'Business surveys for each month', detail: 'Within days of month end' },
        { id: 'labour', label: 'Employment for the final month' },
        { id: 'flash', label: 'A flash estimate of GDP', detail: 'Roughly a month after the quarter closes' },
        { id: 'full', label: 'The full national accounts release' },
        { id: 'revised', label: 'The annual benchmark revision', detail: 'A year or more later, and it can change the story' },
      ],
      correctOrder: ['daily', 'surveys', 'labour', 'flash', 'full', 'revised'],
      explanation:
        'A committee meeting in the first week of a quarter is deciding on the previous one’s flash estimate at best, and often on surveys alone. That is the ordinary condition of the job rather than an unusual constraint — and it is why the framework question of the previous lesson matters so much. You are never going to have the data. What you can have is a rule about how much weight each kind of evidence carries before it arrives.',
    },
  ],
  keyTakeaways: [
    'Fast indicators are fast because they are narrow; know what each leaves out.',
    'Fast data earns its place by corroboration, not by speed.',
    'A nowcast infers the recent past; a forecast claims an undetermined future.',
    'You will never have the data — you can have a rule about what weight each kind carries.',
  ],
});
