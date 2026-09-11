import { defineLesson } from '../../schema';

/** Video 17. The gold turns out to have been doing nothing, and 1971 is the formality that admits it. */
export const kabWhatHappenedToTheGoldLesson = defineLesson({
  id: 'kab-what-happened-to-the-gold',
  title: 'What Happened to the Gold?',
  subtitle:
    'It sat in a vault doing nothing, while forcing an arbitrary limit on the money supply. In 1971 it stopped pretending.',
  icon: '🥇',
  difficulty: 'advanced',
  estimatedMinutes: 17,
  video: {
    url: 'https://www.youtube.com/watch?v=NFDMXwwzyIM',
    minutes: 10,
    source: 'Khan Academy — Banking 17',
  },
  challenges: [
    {
      id: 'mc-arbitrary-constraint',
      type: 'multiple_choice',
      tags: ['gold-standard', 'money-supply'],
      xp: 25,
      prompt:
        'What is the video’s central objection to tying the money supply to gold?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'geology',
          label:
            'It ties the money supply to mining rather than to output',
        },
        {
          id: 'inflation',
          label: 'Gold standards always cause inflation',
          feedback:
            'The video gives a case where gold *did* cause inflation — sixteenth-century Spain — but as evidence that metal is no guarantee, not that it always inflates.',
        },
        {
          id: 'heavy',
          label: 'Gold is heavy, and moving it between vaults is impractical',
          feedback:
            'True and already solved by notes and cheques, several videos ago. The objection here is about the constraint on quantity.',
        },
        {
          id: 'worthless',
          label: 'Gold has no value, so it cannot back anything',
          feedback:
            'The video is careful not to claim that. Its claim is that gold represents wealth rather than being wealth — it cannot be eaten or lived in.',
        },
      ],
      correctOptionId: 'geology',
      explanation:
        'The thought experiment is an asteroid of gold landing in the United States. Should the currency be worth less because of a geological accident? Should progress be throttled because no new seams were found? Under a metal standard, the answer to both is yes, and neither has anything to do with productivity.',
    },
    {
      id: 'mc-backed-by-what',
      type: 'multiple_choice',
      tags: ['fiat', 'wealth'],
      xp: 30,
      prompt:
        'The video argues a currency backed by a government may rest on *more* wealth than one backed by gold. On what?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'tax',
          label:
            'Its power to tax a real economy',
        },
        {
          id: 'military',
          label: 'Its military power and the stability that buys',
          feedback:
            'Not the argument. The claim is economic: a government can levy on the output of the economy it governs.',
        },
        {
          id: 'reserves',
          label: 'The foreign currency reserves it holds',
          feedback:
            'Reserves appear nowhere in this argument. The backing described is the productive capacity that can be taxed.',
        },
        {
          id: 'nothing',
          label: 'Nothing — that is what fiat means',
          feedback:
            'The video takes the word apart rather than accepting it. "Not backed by metal" is not the same as "not backed by anything".',
        },
      ],
      correctOptionId: 'tax',
      explanation:
        'The plane-crash question makes it concrete: ditch on the island with a pile of gold, or on the one with water, cattle, oil and skilled people? Gold represents wealth by convention; an economy is wealth. The whole argument carries an explicit condition, though — *if* you trust the issuer to manage the supply. Video 18 takes that condition seriously.',
    },
  ],
  keyTakeaways: [
    'Under a metal standard, money growth depends on mining rather than on output.',
    'Gold in a central bank vault performs no economic function beyond confidence.',
    'Fiat rests on an economy that can be taxed — conditional on competent management.',
  ],
});
