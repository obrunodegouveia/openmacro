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
    {
      id: 'mc-spanish-gold',
      type: 'multiple_choice',
      tags: ['gold-standard', 'inflation', 'history'],
      xp: 35,
      prompt:
        'Sal raises 15th and 16th century Spain: a currency genuinely backed by gold, and then galleons of American gold arrive and prices soar. What does that episode establish?',
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
            'Spain did little that any government would not have done with a windfall. The point survives without blaming anyone: the money supply tripled and the goods did not.',
        },
        {
          id: 'notreal',
          label: 'That the gold arriving from the Americas was not real gold',
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
        'Spain got a gold supply shock and a price level to match, on a currency that was hard by every definition. Gold restrains a money supply only as long as gold is hard to obtain — a constraint history repeatedly failed to honour, from Potosí to the Klondike. What the video is arguing is not that paper is safer, but that the safety was never in the metal.',
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
            'Exceeding it is not the same as ignoring it. The ratio still had to be defended, and defending it is what forced central banks to contract when gold flowed out.',
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
        'That is the elegant part of the argument. Every other player in the system had a reserve requirement imposed by a regulator who could think; the central bank had one imposed by geology. An economy that innovates faster than miners dig has to deflate, and one unlucky enough to sit next to a gold rush inflates — neither having anything to do with how hard anybody worked.',
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
            'He notes the Fed still holds gold, and treats it as a leftover nobody knew what to do with rather than as a condition of anything.',
        },
        {
          id: 'surplus',
          label: 'That the government runs a balanced budget',
          feedback:
            'He never makes fiscal balance the test. The test is the money supply, which is a different lever in different hands.',
        },
      ],
      correctOptionId: 'trust',
      explanation:
        'Worth noticing how much the argument concedes. Fiat money is not defended as self-regulating — it is defended as better *provided* the people running it behave, which relocates the problem from metallurgy to institutions. That is exactly why central bank independence, inflation targets and published mandates were built afterwards: they are the machinery for making the big if true, and the whole case falls over without them.',
    },
    {
      id: 'order-off-gold',
      type: 'order_flow',
      tags: ['gold-standard', 'history', 'fiat-money'],
      xp: 30,
      prompt: 'Put the drift from a gold system to a fiat one in order.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'pool', label: 'Banks pool their gold at one reserve bank' },
        { id: 'notes', label: 'Only that bank may issue notes against it' },
        { id: 'habit', label: 'Banks come to hold the notes as their reserves', detail: 'Rather than asking for the metal' },
        { id: 'ratio', label: 'Notes outstanding grow past the gold behind them' },
        { id: 'idle', label: 'The gold sits in the vault doing nothing', detail: 'Except constraining the issuer' },
        { id: 'nixon', label: 'In 1971 the last link is cut', detail: 'And little about the machinery changes' },
      ],
      correctOrder: ['pool', 'notes', 'habit', 'ratio', 'idle', 'nixon'],
      explanation:
        'The striking thing about this sequence is that 1971 is the least eventful step in it. By then the gold had not been doing monetary work for decades — banks settled in central bank notes, the notes already exceeded the metal, and the only live function the gold retained was to impose a reserve ratio set by mining. Nixon severed a link that had been ceremonial for a long time, which is why the system carried on working the next morning.',
    },
  ],
  keyTakeaways: [
    'Under a metal standard, money growth depends on mining rather than on output.',
    'Gold in a central bank vault performs no economic function beyond confidence.',
    'Fiat rests on an economy that can be taxed — conditional on competent management.',
  ],
});
