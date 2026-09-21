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
  title: 'The Sector That Shrank Because It Won',
  subtitle:
    'Agriculture is about 2% of output in a rich economy. Try going a week without it.',
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
        'Agriculture was around 40% of the American workforce in 1900 and is a couple of per cent of output today. What does that fall record?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'productivity',
          label: 'Productivity — the same food from a fraction of the people and land',
        },
        {
          id: 'less-food',
          label: 'A country that grows much less of its own food',
          feedback:
            'The United States is one of the largest food exporters in the world. Output rose enormously; it is the share of the economy needed to produce it that collapsed.',
        },
        {
          id: 'unimportant',
          label: 'Food becoming less important to people',
          feedback:
            'Nobody eats less because farming got efficient. What changed is the price of food relative to everything else, and a falling relative price shrinks a sector’s share even as its volume grows.',
        },
        {
          id: 'imports',
          label: 'Production moving abroad, as it did in manufacturing',
          feedback:
            'Some did. But the domestic volume is up many times over on a fraction of the labour, which offshoring cannot explain.',
        },
      ],
      correctOptionId: 'productivity',
      explanation:
        'A sector that gets radically better at its job takes a smaller share of spending, because share is price times quantity and the price collapsed. So the smallest sectors in a rich economy include some of the most successful ones — and reading a 2% share as 2% of importance gets the story exactly backwards.',
    },
    {
      id: 'mc-baumol',
      type: 'multiple_choice',
      tags: ['baumol', 'services', 'productivity'],
      xp: 30,
      prompt:
        'A Mozart string quartet needs the same four musicians it needed in 1790. Health and education have barely more room to automate. What does that imply for their share of GDP over time?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'rises',
          label: 'It rises, because they get more expensive relative to everything that automates',
        },
        {
          id: 'falls',
          label: 'It falls, because they add no productivity growth',
          feedback:
            'Backwards. Their wages must keep pace with the rest of the economy or the musicians and nurses leave for it — and with no offsetting productivity gain, that shows up entirely as cost.',
        },
        {
          id: 'stable',
          label: 'It stays flat, since demand for them is stable',
          feedback:
            'Demand does grow with income, which adds to the effect. But the effect works even with flat demand, purely through relative prices.',
        },
        {
          id: 'inefficiency',
          label: 'It rises, which is evidence they are being run inefficiently',
          feedback:
            'This is the most costly misreading of the three. Cost disease is a relative-price phenomenon, not waste — a quartet is not badly managed for needing four players.',
        },
      ],
      correctOptionId: 'rises',
      explanation:
        'Baumol and Bowen named this in 1966. It means a rising share of spending on health, education or care is partly a mechanical consequence of everything else getting cheaper — not, by itself, evidence of either growing importance or bad management. Whenever someone quotes a sector’s rising share as an argument, the first question is whether the quantity rose or only the relative price.',
    },
    {
      id: 'match-why-share-moves',
      type: 'concept_match',
      tags: ['sectors', 'measurement'],
      xp: 30,
      prompt: 'A sector’s share of GDP can rise for three unrelated reasons. Match each to its signature.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'volume',
          term: 'People genuinely want more of it',
          definition: 'Quantity rises and the relative price is roughly flat — growth you can see in the units',
        },
        {
          id: 'baumol',
          term: 'Cost disease',
          definition: 'Quantity is flat and the relative price rises, because the rest of the economy got cheaper',
        },
        {
          id: 'scarcity',
          term: 'A supply shock',
          definition: 'Quantity falls and the price rises more, so the bill goes up while people get less',
        },
      ],
      explanation:
        'The third is the one that matters for the rest of this module. When energy went from a few per cent of European spending to a great deal more in 2022, nobody had decided energy was more important — the quantity available fell and the price did the rest. A share can rise because a sector is winning, because it is standing still, or because it is failing.',
    },
    {
      id: 'mc-which-ranking',
      type: 'multiple_choice',
      tags: ['sectors', 'criticality'],
      xp: 30,
      prompt:
        'Retail is a larger share of output than energy in most rich economies. Which is the more important sector?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'depends',
          label: 'The question is badly posed until you say what for',
        },
        {
          id: 'retail',
          label: 'Retail, since it is larger and employs more people',
          feedback:
            'That answers "which is bigger", which was not asked. Size is one ranking and the module is about the fact that there are three.',
        },
        {
          id: 'energy',
          label: 'Energy, because everything else needs it',
          feedback:
            'This is the answer the module will end up defending — but not yet, and not for free. It needs the test that the next lesson builds, or it is just a slogan.',
        },
        {
          id: 'equal',
          label: 'Equally important; the market has priced both correctly',
          feedback:
            'Prices clear a market under normal conditions. They say little about what happens when supply is interrupted, which is the question criticality asks.',
        },
      ],
      correctOptionId: 'depends',
      explanation:
        'There are three defensible rankings and they disagree. By size: what we spend most on. By criticality: what we cannot do without. By capacity: what raises what we can produce next. Almost every public argument about the economy is two of those three being confused — and the next lesson makes the second one measurable.',
    },
  ],
  keyTakeaways: [
    'A shrinking share can mean a sector got radically better, not less important.',
    'Cost disease raises a share through relative prices, with no change in quantity.',
    'Size, criticality and future capacity are three rankings, and they disagree.',
  ],
});
