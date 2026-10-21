import { defineLesson } from '../../schema';

/**
 * Why the share of spending a sector takes is a poor guide to how much the
 * economy depends on it — and specifically why a rising share can mean the
 * opposite of what it looks like.
 *
 * Baumol and Bowen published the cost disease in 1966, studying why the
 * performing arts kept getting more expensive relative to everything else.
 */
export const shareIsNotImportanceLesson = defineLesson({
  id: 'share-is-not-importance',
  title: 'The Sector That Shrank Because It Succeeded',
  subtitle:
    'Farming is about 2% of a rich economy. Try going a week without it.',
  icon: '🌾',
  difficulty: 'intro',
  estimatedMinutes: 9,
  challenges: [
    {
      id: 'mc-agriculture',
      type: 'multiple_choice',
      tags: ['sectors', 'productivity'],
      xp: 20,
      prompt:
        'In 1900, about 40% of American workers were in farming. Today farming is only a few per cent of the economy. What does that fall show?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'productivity',
          label: 'Productivity — the same food now needs far fewer people and less land',
        },
        {
          id: 'less-food',
          label: 'The country now grows much less of its own food',
          feedback:
            'The United States is one of the world’s biggest food exporters. It produces far more food than before. What shrank is the share of the economy needed to grow it.',
        },
        {
          id: 'unimportant',
          label: 'Food has become less important to people',
          feedback:
            'Nobody eats less because farming got efficient. Food got cheaper compared with other things. A falling price makes a sector a smaller share, even when it produces more.',
        },
        {
          id: 'imports',
          label: 'Farming moved abroad, as factory work did',
          feedback:
            'Some did. But the country grows many times more food than in 1900, with far fewer workers. Moving abroad cannot explain that.',
        },
      ],
      correctOptionId: 'productivity',
      explanation:
        'When a sector gets much better at its job, it takes a smaller share of spending. A share is price times quantity, and the price fell a lot. So some of the smallest sectors in a rich economy are among the most successful. Reading a 2% share as “2% important” gets the story backwards.',
    },
    {
      id: 'mc-baumol',
      type: 'multiple_choice',
      tags: ['baumol', 'services', 'productivity'],
      xp: 30,
      prompt:
        'A Mozart string quartet still needs the same four musicians it needed in 1790. Health care and teaching also cannot be automated much. What happens to their share of GDP over time?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'rises',
          label: 'It rises, because they get more expensive compared with things that are automated',
        },
        {
          id: 'falls',
          label: 'It falls, because they do not become more productive',
          feedback:
            'The other way round. Their wages must keep up with the rest of the economy, or musicians and nurses would leave for other jobs. With no productivity gain to balance that, their costs go up.',
        },
        {
          id: 'stable',
          label: 'It stays the same, because demand for them is steady',
          feedback:
            'Demand does grow as people get richer, which adds to the effect. But the effect happens even with steady demand, just because of prices.',
        },
        {
          id: 'inefficiency',
          label: 'It rises, which proves they are badly run',
          feedback:
            'This is the most costly mistake. The cost rises because everything else gets cheaper, not because of waste. A quartet is not badly managed because it needs four players.',
        },
      ],
      correctOptionId: 'rises',
      explanation:
        'Economists Baumol and Bowen described this “cost disease” in 1966. A rising share of spending on health, education or care partly happens automatically, because everything else gets cheaper. On its own, it does not prove the sector became more important or badly managed. So when someone quotes a rising share, ask: did the quantity rise, or only the price?',
    },
    {
      id: 'match-why-share-moves',
      type: 'concept_match',
      tags: ['sectors', 'measurement'],
      xp: 30,
      prompt: 'A sector’s share of GDP can rise for three different reasons. Match each reason to what you would see.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'volume',
          term: 'People really want more of it',
          definition: 'The quantity rises and its price stays about the same compared with other things',
        },
        {
          id: 'baumol',
          term: 'Cost disease',
          definition: 'The quantity stays the same and its price rises, because everything else got cheaper',
        },
        {
          id: 'scarcity',
          term: 'A supply shock',
          definition: 'The quantity falls and the price rises even more, so people pay more and get less',
        },
      ],
      explanation:
        'The third one matters most for this module. In 2022, energy went from a few per cent of European spending to much more. Nobody decided energy had become more important. Less energy was available, and the price did the rest. A share can rise because a sector is winning, standing still or failing.',
    },
    {
      id: 'mc-which-ranking',
      type: 'multiple_choice',
      tags: ['sectors', 'criticality'],
      xp: 30,
      prompt:
        'In most rich economies, shops are a bigger share of the economy than energy. Which sector is more important?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'depends',
          label: 'You cannot answer until you say “important for what?”',
        },
        {
          id: 'retail',
          label: 'Shops, since they are bigger and employ more people',
          feedback:
            'That answers “which is bigger?”, which was not the question. Size is one way to rank sectors, and this module shows there are three.',
        },
        {
          id: 'energy',
          label: 'Energy, because everything else needs it',
          feedback:
            'This module will end up agreeing — but you need the test from the next lesson to show it. Without the test, it is just a slogan.',
        },
        {
          id: 'equal',
          label: 'Both are equally important; the market prices both correctly',
          feedback:
            'Prices work well when things are normal. They say little about what happens when supply suddenly stops, and that is what “important” means here.',
        },
      ],
      correctOptionId: 'depends',
      explanation:
        'There are three fair ways to rank sectors, and they disagree. By size: what we spend most on. By criticality: what we cannot do without. By capacity: what helps us produce more in the future. Most public arguments about the economy mix up two of these. The next lesson shows how to measure the second one.',
    },
  ],
  keyTakeaways: [
    'A shrinking share can mean a sector got much better, not less important.',
    'Cost disease raises a sector’s share through prices alone, with no change in quantity.',
    'Size, criticality and future capacity are three different rankings, and they disagree.',
  ],
});
