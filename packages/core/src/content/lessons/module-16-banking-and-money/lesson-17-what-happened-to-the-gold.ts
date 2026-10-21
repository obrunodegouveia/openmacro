import { defineLesson } from '../../schema';

/** Video 17. The gold turns out to have been doing nothing, and 1971 is the formality that admits it. */
export const kabWhatHappenedToTheGoldLesson = defineLesson({
  id: 'kab-what-happened-to-the-gold',
  title: 'What Happened to the Gold?',
  subtitle:
    'The gold sat in a vault doing nothing, but it still put a random limit on the amount of money. In 1971 the last link was cut.',
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
        'What is the video’s main problem with linking the amount of money to gold?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'geology',
          label:
            'The amount of money depends on mining, not on what the economy produces',
        },
        {
          id: 'inflation',
          label: 'Linking money to gold always makes prices rise',
          feedback:
            'The video gives one case where gold did make prices rise: Spain in the 1500s. It uses it to show that metal is no guarantee, not that prices always rise.',
        },
        {
          id: 'heavy',
          label: 'Gold is heavy, and moving it between vaults is impractical',
          feedback:
            'True, but notes and cheques solved that problem several videos ago. The problem here is the limit on the amount of money.',
        },
        {
          id: 'worthless',
          label: 'Gold has no value, so it cannot back anything',
          feedback:
            'The video does not say that. It says gold stands for wealth but is not wealth itself: you cannot eat it or live in it.',
        },
      ],
      correctOptionId: 'geology',
      explanation:
        'Imagine an asteroid made of gold lands in the United States. Should the money be worth less because of a lucky find? Or should the economy grow more slowly because nobody found new gold? With money linked to gold, the answer to both is yes. Neither has anything to do with how hard people work or what they produce.',
    },
    {
      id: 'mc-backed-by-what',
      type: 'multiple_choice',
      tags: ['fiat', 'wealth'],
      xp: 30,
      prompt:
        'The video says money backed by a government may rest on more wealth than money backed by gold. What does it rest on?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'tax',
          label:
            'Its power to tax a real economy',
        },
        {
          id: 'military',
          label: 'Its army, and the peace and order that gives',
          feedback:
            'That is not the argument. The point is about the economy: a government can tax what its economy produces.',
        },
        {
          id: 'reserves',
          label: 'The foreign currency reserves it holds',
          feedback:
            'This argument does not mention those reserves. The backing is everything the economy can produce, which can be taxed.',
        },
        {
          id: 'nothing',
          label: 'Nothing, because that is what fiat money means',
          feedback:
            'The video questions that idea. “Not backed by metal” is not the same as “not backed by anything”.',
        },
      ],
      correctOptionId: 'tax',
      explanation:
        'Sal asks: if your plane crashed, would you prefer an island with a pile of gold, or one with water, cattle, oil and skilled people? Gold stands for wealth because people agree it does. An economy is real wealth. But there is a condition: you must trust whoever creates the money to manage it well. The last question of this lesson, and video 18, look at that condition.',
    },
    {
      id: 'mc-spanish-gold',
      type: 'multiple_choice',
      tags: ['gold-standard', 'inflation', 'history'],
      xp: 35,
      prompt:
        'Sal talks about Spain in the 1500s. Its money was real gold and silver. Then ships brought huge amounts of metal from the Americas, and prices shot up. What does this show?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'backing',
          label: 'Backing money with metal does not stop prices rising',
        },
        {
          id: 'spain',
          label: 'That Spain in particular managed its gold badly',
          feedback:
            'Spain did what almost any government would do with a sudden fortune. You do not need to blame anyone: the amount of money simply grew much faster than the goods.',
        },
        {
          id: 'notreal',
          label: 'That the metal coming from the Americas was fake',
          feedback:
            'It was completely real. That is exactly why this story is so bad for the idea that real gold stops prices rising.',
        },
        {
          id: 'paperbetter',
          label: 'That paper money would have served Spain better',
          feedback:
            'This story does not say paper is better. It says that metal money versus paper money is not what decides whether prices rise.',
        },
      ],
      correctOptionId: 'backing',
      explanation:
        'Spain got a flood of precious metal. Most of it was silver, from mines such as Potosí, but there was gold too. Prices rose to match, even though the money was real metal. What sets prices is how much money there is compared with goods. Metal only limits the amount of money while it is hard to find, and people kept finding more. The video does not say paper is safer. It says the safety was never in the metal.',
    },
    {
      id: 'mc-what-gold-constrained',
      type: 'multiple_choice',
      tags: ['gold-standard', 'central-banking'],
      xp: 35,
      prompt:
        'Even when money was linked to gold, there were always more notes than gold in the vault. So what did the gold actually limit?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'ownratio',
          label: 'It gave the central bank its own reserve ratio, based on how much metal miners happened to dig up',
        },
        {
          id: 'onetoone',
          label: 'Nothing, because there were more notes than gold anyway',
          feedback:
            'Having more notes than gold is not the same as ignoring the gold. The ratio still had to be kept. So when gold left the country, central banks had to reduce the amount of money.',
        },
        {
          id: 'govspending',
          label: 'Government spending, which could not be more than the gold it had',
          feedback:
            'Governments borrowed far more than their gold during this whole time. The limit was on how many notes could be issued, not on the budget.',
        },
        {
          id: 'privatebanks',
          label: 'Lending by commercial banks, which was limited by the gold',
          feedback:
            'Commercial banks were limited by their reserves, which were already central bank notes. The gold limited the level above them: the central bank.',
        },
      ],
      correctOptionId: 'ownratio',
      explanation:
        'This is the clever part of the argument. Every other bank had a reserve rule set by people who could think about it. The central bank had a rule set by how much gold was in the ground. If the economy grew faster than miners could dig, prices had to fall. If a gold rush happened nearby, prices rose. Neither had anything to do with how hard anyone worked.',
    },
    {
      id: 'mc-the-big-if',
      type: 'multiple_choice',
      tags: ['fiat-money', 'central-banking'],
      xp: 30,
      prompt:
        'Sal argues for leaving the gold standard (money linked to gold), but with what he calls a “big if”. What is the condition?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'trust',
          label: 'That the government can be trusted to manage the supply',
        },
        {
          id: 'growth',
          label: 'That the economy keeps growing year after year',
          feedback:
            'Growth helps, but the condition is about how the money is managed. A shrinking economy with a careful central bank is not the danger he means.',
        },
        {
          id: 'keepgold',
          label: 'That the central bank holds on to some gold anyway',
          feedback:
            'He says the Fed still has gold, but he sees it as a leftover, not as a condition.',
        },
        {
          id: 'surplus',
          label: 'That the government never spends more than it collects in taxes',
          feedback:
            'He never makes that the test. The test is how the amount of money is managed, and that is a different job, often done by different people.',
        },
      ],
      correctOptionId: 'trust',
      explanation:
        'Notice how much Sal admits here. He does not say paper money controls itself. He says it is better only if the people running it behave well. So the problem moves from the gold mines to the people in charge. That is why independent central banks, inflation targets and clear public rules matter so much. Without them, the argument falls apart.',
    },
    {
      id: 'order-off-gold',
      type: 'order_flow',
      tags: ['gold-standard', 'history', 'fiat-money'],
      xp: 30,
      prompt: 'Put the steps from gold money to paper money in order, as the video tells it.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'pool', label: 'Banks pool their gold at one reserve bank' },
        { id: 'notes', label: 'Only that bank may issue notes against it' },
        { id: 'habit', label: 'Banks start keeping the notes as their reserves', detail: 'Instead of asking for the metal' },
        { id: 'ratio', label: 'Over time, there are far more notes than gold behind them' },
        { id: 'idle', label: 'In the end, the gold just sits in the vault', detail: 'Its only job left is to limit how many notes can be issued' },
        { id: 'nixon', label: 'In 1971 the last link is cut', detail: 'Other countries’ central banks can no longer swap dollars for gold. Little else changes' },
      ],
      correctOrder: ['pool', 'notes', 'habit', 'ratio', 'idle', 'nixon'],
      explanation:
        'The surprise is that 1971 is the quietest step. By then, the gold had done very little for decades. Banks paid each other in central bank money. Americans could not swap their notes for gold after 1933. The legal rule to keep gold behind the notes ended in 1968. In 1971, President Nixon only ended other central banks’ right to swap dollars for gold. That is why the system kept working the next morning.',
    },
  ],
  keyTakeaways: [
    'When money is linked to metal, the amount of money depends on mining, not on what the economy produces.',
    'Gold in a central bank vault does nothing useful except make people feel safe.',
    'Paper money rests on an economy that can be taxed, but only if it is managed well.',
  ],
});
