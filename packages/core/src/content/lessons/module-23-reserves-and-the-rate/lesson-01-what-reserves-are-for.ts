import { defineLesson } from '../../schema';

/**
 * Reserves: what they are actually for, how adequacy is measured, and the
 * fact that the metrics were designed for a world where capital did not move.
 */
export const whatReservesAreForLesson = defineLesson({
  id: 'what-reserves-are-for',
  title: 'Three Months of Imports Was a Rule for a Different World',
  subtitle:
    'Reserves are not savings. They are the ability to meet a demand for foreign currency on a day you did not choose.',
  icon: '🏦',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-what-they-are-for',
      type: 'multiple_choice',
      tags: ['reserves', 'fx'],
      xp: 30,
      prompt: 'What are foreign exchange reserves actually for?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'meet-demand',
          label: 'Meeting a demand for foreign currency the private market will not meet',
        },
        {
          id: 'wealth',
          label: 'National savings, held for the future',
          feedback:
            'A sovereign wealth fund saves. Reserves are held liquid and short precisely so they can be spent on a bad Tuesday, which is why they earn so little — and why calling them savings leads to proposals to invest them in something that yields more.',
        },
        {
          id: 'backing',
          label: 'Backing for the currency in issue',
          feedback:
            'True only under a currency board, where the link is legal and mechanical. Most central banks issue far more base money than they hold reserves against, and the currency is not a claim on them.',
        },
        {
          id: 'profit',
          label: 'Earning a return on the central bank’s balance sheet',
          feedback:
            'They usually cost money to hold rather than earn it, as the next lesson shows. Anything held because it yields well is not a reserve.',
        },
      ],
      correctOptionId: 'meet-demand',
      explanation:
        'Everything follows from that sentence. Reserves have to be in currencies people actually want, in instruments that can be sold in size on a bad day, and available immediately. Each of those constraints costs return, and a portfolio optimised for yield stops being reserves. The question to ask of any reserve portfolio is not what it earns but what it could raise by Friday.',
    },
    {
      id: 'match-adequacy-metrics',
      type: 'concept_match',
      tags: ['reserves', 'adequacy'],
      xp: 30,
      prompt: 'Four ways to say whether reserves are enough. Match each to the danger it was designed for.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'imports',
          term: 'Three months of imports',
          definition: 'A trade shock in a world where capital barely crossed borders — the oldest metric and the least relevant now',
        },
        {
          id: 'guidotti',
          term: 'Cover for a year of external debt',
          definition: 'Nobody rolling over your short-term borrowing — the metric that matters when capital does move',
        },
        {
          id: 'money',
          term: 'A share of broad money',
          definition: 'Residents themselves converting their deposits into foreign currency — a domestic run, not a foreign one',
        },
        {
          id: 'composite',
          term: 'A weighted composite',
          definition: 'All of the above at once, weighted by how likely each drain is for the country in question',
        },
      ],
      explanation:
        'Three of the four describe different people asking for your foreign currency: an importer, a foreign creditor, and your own citizens. That last one is the least discussed and the most dangerous, because it has no upper bound — a country whose residents lose confidence can demand foreign currency equal to its entire money supply, and no reserve stock covers that.',
    },
    {
      id: 'mc-self-insurance',
      type: 'multiple_choice',
      tags: ['reserves', 'history'],
      xp: 35,
      prompt:
        'After 1997, Asian economies accumulated reserves on a scale nobody had seen. What were they buying?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'independence',
          label: 'The ability to handle a crisis without asking anybody for terms',
        },
        {
          id: 'undervalue',
          label: 'A cheaper currency, to support exports',
          feedback:
            'A real motive in several cases and not the one that explains the scale. Export competitiveness does not require reserves of twenty per cent of GDP; not needing a programme does.',
        },
        {
          id: 'yield',
          label: 'A return on their trade surpluses',
          feedback:
            'The return was poor and often negative after the cost of sterilisation. They were paying for the insurance, not earning on it.',
        },
        {
          id: 'peg',
          label: 'The ability to hold a fixed exchange rate',
          feedback:
            'Several of them floated afterwards and kept accumulating regardless, which points at something other than the peg.',
        },
      ],
      correctOptionId: 'independence',
      explanation:
        'The 1997 programmes came with conditions that were experienced as humiliating and, in several judgements since, as economically wrong for the situation. The response was self-insurance: hold enough that you never have to ask. It is expensive, it contributed to the global savings glut that pushed down world interest rates, and from any individual country’s point of view it was entirely rational. A governor deciding how much is enough is pricing the cost of carry against the cost of one phone call.',
    },
    {
      id: 'mc-encumbered',
      type: 'multiple_choice',
      tags: ['reserves', 'disclosure'],
      xp: 35,
      prompt:
        'A country reports $40bn of reserves. What would you need to know before believing it can spend them?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'encumbrance',
          label: 'How much of it is already committed elsewhere',
        },
        {
          id: 'currency',
          label: 'Which currencies the reserves are actually denominated in',
          feedback:
            'Worth knowing for the drain you expect to face, and secondary. A euro reserve can be sold for dollars in normal conditions; a pledged reserve cannot be sold at all.',
        },
        {
          id: 'gold',
          label: 'How much of it is gold',
          feedback:
            'Gold is genuinely slower to mobilise and is disclosed separately. It is a smaller problem than commitments that are not disclosed at all.',
        },
        {
          id: 'return',
          label: 'What return they are earning',
          feedback:
            'Almost irrelevant to whether they can be spent, which is the only question in a crisis.',
        },
      ],
      correctOptionId: 'encumbrance',
      explanation:
        'Headline reserves are a gross number. Forward commitments, currency swaps with domestic banks, and reserves lent to state entities can all mean the usable figure is a fraction of the reported one — and every reserve crisis in the past thirty years has featured the discovery that the real number was smaller than the published one. The IMF’s reserve template exists to force disclosure of exactly this, and reading it is the difference between knowing a country’s reserves and knowing its position.',
    },
  ],
  keyTakeaways: [
    'Reserves buy the ability to meet a demand for foreign currency on a day you did not choose.',
    'The metrics describe different people asking: importers, foreign creditors, your own residents.',
    'Self-insurance after 1997 was expensive and individually rational.',
    'A gross reserve number says nothing until you know what is already committed.',
  ],
});
