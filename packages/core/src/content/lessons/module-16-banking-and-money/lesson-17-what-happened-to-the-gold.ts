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
            'True, but notes and cheques solved that several videos ago. The objection here is about the limit on quantity.',
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
        'The thought experiment is an asteroid made of gold landing in the United States. Should the currency be worth less because of a geological accident? Should growth be held back because no new gold was found? Under a gold standard, the answer to both is yes, and neither has anything to do with how productive the economy is.',
    },
    {
      id: 'mc-backed-by-what',
      type: 'multiple_choice',
      tags: ['fiat', 'wealth'],
      xp: 30,
      prompt:
        'The video argues that a currency backed by a government may rest on *more* wealth than one backed by gold. What does it rest on?',
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
            'Not the argument. The claim is economic: a government can tax the output of the economy it governs.',
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
        'The plane-crash question makes it concrete: would you rather crash-land on the island with a pile of gold, or on the one with water, cattle, oil and skilled people? Gold represents wealth by agreement; an economy is wealth. The whole argument comes with a condition, though — *if* you trust the issuer to manage the supply. The last question of this lesson and video 18 take that condition seriously.',
    },
    {
      id: 'mc-spanish-gold',
      type: 'multiple_choice',
      tags: ['gold-standard', 'inflation', 'history'],
      xp: 35,
      prompt:
        'Sal brings up 16th-century Spain: its money was real precious metal, then ships brought huge amounts of it from the Americas, and prices soared. What does that episode show?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'backing',
          label: 'Backing does not prevent inflation — money against goods sets prices',
        },
        {
          id: 'spain',
          label: 'That Spain mismanaged its gold specifically',
          feedback:
            'Spain did little that any government would not have done with a windfall. The point stands without blaming anyone: the amount of money grew far faster than the goods.',
        },
        {
          id: 'notreal',
          label: 'That the metal arriving from the Americas was not real',
          feedback:
            'It was entirely real, which is precisely what makes the episode devastating for the argument that real gold prevents inflation.',
        },
        {
          id: 'paperbetter',
          label: 'That paper money would have served Spain better',
          feedback:
            'Nothing here argues paper is better. It argues that the distinction between hard and soft money is not the distinction that determines inflation.',
        },
      ],
      correctOptionId: 'backing',
      explanation:
        'Spain got a flood of precious metal — historically mostly silver, from mines such as Potosí, as well as gold — and prices rose to match, with money that was as hard as money gets. Metal holds back the money supply only as long as it is hard to obtain, and history kept finding new supplies, from Potosí’s silver to the Klondike’s gold. The video is not arguing that paper is safer, but that the safety was never in the metal.',
    },
    {
      id: 'mc-what-gold-constrained',
      type: 'multiple_choice',
      tags: ['gold-standard', 'central-banking'],
      xp: 35,
      prompt:
        'Even under the gold standard there were always more notes outstanding than gold in the vault. So what was the gold actually constraining?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'ownratio',
          label: 'It forced a reserve ratio on the central bank itself, pegged to how much metal happened to be dug up',
        },
        {
          id: 'onetoone',
          label: 'Nothing was constrained, since the notes exceeded the gold anyway',
          feedback:
            'Exceeding the gold is not the same as ignoring it. The ratio still had to be defended, and defending it is what forced central banks to shrink the money supply when gold flowed out.',
        },
        {
          id: 'govspending',
          label: 'Government spending, which could not exceed the gold stock',
          feedback:
            'Governments borrowed far beyond their gold throughout the period. The bite was on the note issue, not the budget.',
        },
        {
          id: 'privatebanks',
          label: 'Commercial bank lending, which was capped by the gold',
          feedback:
            'Commercial banks were capped by their reserves, which had already become central bank notes. The gold constrained the layer above them.',
        },
      ],
      correctOptionId: 'ownratio',
      explanation:
        'That is the elegant part of the argument. Every other bank had a reserve requirement set by a regulator who could think; the central bank had one set by geology. An economy that grows faster than miners dig has to see prices fall, and one that happens to sit next to a gold rush sees prices rise — neither having anything to do with how hard anybody worked.',
    },
    {
      id: 'mc-the-big-if',
      type: 'multiple_choice',
      tags: ['fiat-money', 'central-banking'],
      xp: 30,
      prompt:
        'Sal’s case for leaving the gold standard comes with what he calls a big if. What is the condition?',
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
            'Growth helps, but the condition is about the issuer’s conduct. A shrinking economy with a disciplined central bank is not the failure case he has in mind.',
        },
        {
          id: 'keepgold',
          label: 'That the central bank holds on to some gold anyway',
          feedback:
            'He notes the Fed still holds gold, but treats it as a leftover, not as a condition for anything.',
        },
        {
          id: 'surplus',
          label: 'That the government runs a balanced budget',
          feedback:
            'He never makes a balanced budget the test. The test is how the money supply is managed, which is a different lever in different hands.',
        },
      ],
      correctOptionId: 'trust',
      explanation:
        'Notice how much the argument concedes. Fiat money is not defended as self-regulating — it is defended as better *provided* the people running it behave, which moves the problem from geology to institutions. That is why central bank independence, inflation targets and published mandates matter so much: they are the machinery for making the big if true, and the case falls apart without them.',
    },
    {
      id: 'order-off-gold',
      type: 'order_flow',
      tags: ['gold-standard', 'history', 'fiat-money'],
      xp: 30,
      prompt: 'Put the drift from a gold system to a fiat one in order, as the video tells it.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'pool', label: 'Banks pool their gold at one reserve bank' },
        { id: 'notes', label: 'Only that bank may issue notes against it' },
        { id: 'habit', label: 'Banks come to hold the notes as their reserves', detail: 'Rather than asking for the metal' },
        { id: 'ratio', label: 'Over time, notes outstanding grow well past the gold behind them' },
        { id: 'idle', label: 'The result: the gold just sits in the vault', detail: 'Its only remaining job is to limit how many notes may be issued' },
        { id: 'nixon', label: 'In 1971 the last link is cut', detail: 'Foreign central banks can no longer swap dollars for gold, and little else changes' },
      ],
      correctOrder: ['pool', 'notes', 'habit', 'ratio', 'idle', 'nixon'],
      explanation:
        'The striking thing about this sequence is that 1971 is its least eventful step. By then the gold had done little monetary work for decades: banks settled in central bank money, Americans had not been able to swap their notes for gold since 1933, and the legal gold cover behind Federal Reserve notes was dropped in 1968. What Nixon ended was foreign central banks’ right to convert dollars into gold — which is why the system carried on working the next morning.',
    },
  ],
  keyTakeaways: [
    'Under a metal standard, money growth depends on mining rather than on output.',
    'Gold in a central bank vault performs no economic function beyond confidence.',
    'Fiat rests on an economy that can be taxed — conditional on competent management.',
  ],
});
