import { defineLesson } from '../../schema';

/**
 * The module argues that war spending raises GDP while destroying capital.
 * This lesson puts the five strongest counter-arguments to that in front of
 * the learner and works through each, because a course that only ever
 * prosecutes its own thesis is teaching a position rather than a method.
 *
 * Every channel here is real. Four of the five survive with a caveat; the
 * fifth — the post-war miracle — is the one that does not survive contact
 * with the evidence, and it is the one people reach for most.
 *
 * Sources for the checkable claims: the US Interstate system was created by
 * the Federal-Aid Highway Act of 1956 as the National System of Interstate
 * and Defense Highways. ARPANET (1969) and Navstar GPS were both defence
 * programmes. Keynes wrote How to Pay for the War in 1940, and the national
 * accounts were built out in both Britain and the US for war planning.
 * Davis and Weinstein (2002) found bombed Japanese cities returning to their
 * pre-war population trajectories.
 */
export const theCaseAgainstThisModuleLesson = defineLesson({
  id: 'the-case-against-this-module',
  title: 'Five Ways War Leaves Something Behind',
  subtitle:
    'The strongest arguments against what you have just learned. Four of them hold up. One does not.',
  icon: '⚔️',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'match-five-channels',
      type: 'concept_match',
      tags: ['war', 'growth', 'counterarguments'],
      xp: 30,
      prompt:
        'Here are five ways a war really can leave something useful behind. Match each one to its catch.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'slack',
          term: 'Idle workers and factories',
          definition:
            'A power grid or a railway would have employed the same workers and left something useful. War is a very expensive way to create jobs',
        },
        {
          id: 'dualuse',
          term: 'Roads and ports built for the military',
          definition:
            'Real, but limited: only the part still useful after the war counts, and a road is a road whoever paid for it',
        },
        {
          id: 'spillover',
          term: 'New technology',
          definition:
            'Civilian research would probably get more per euro. What war adds is urgency and acceptance of failure, not extra money',
        },
        {
          id: 'state',
          term: 'A stronger state',
          definition:
            'Income tax, statistics and social insurance came with wars. But a state built to fight does not always govern well',
        },
        {
          id: 'conquest',
          term: 'Conquest',
          definition:
            'Taking, not producing: the winner owns what the loser owned, and the world is no richer',
        },
      ],
      explanation:
        'None of these is a trick. Each one really happens, and each one has a limit. But none of them proves the strong claim: that the destruction itself made anyone richer.',
    },
    {
      id: 'mc-interstate',
      type: 'multiple_choice',
      tags: ['war', 'infrastructure', 'dual-use'],
      xp: 25,
      prompt:
        'Which is the clearest case of military spending that leaves a lasting asset, like a building does?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'interstate',
          label:
            'The US motorway network, created in 1956 as the “National System of Interstate and Defense Highways”',
        },
        {
          id: 'tanks',
          label: 'Making tanks, because the factories could be used for other things afterwards',
          feedback:
            'The factory is the asset, not the tank. A factory built for tanks is expensive to convert. Some were converted, but that part is much smaller than the spending.',
        },
        {
          id: 'employment',
          label: 'Wartime jobs, because workers learned new skills',
          feedback:
            'The skills are real and they last. But that is just the “idle workers” point again, and a civilian programme would have taught the same skills.',
        },
        {
          id: 'bonds',
          label: 'War bonds, because families ended the war owning savings',
          feedback:
            'A bond is a promise to be paid from future taxes. One citizen holds it and all citizens owe it. The country as a whole is not richer.',
        },
      ],
      correctOptionId: 'interstate',
      explanation:
        'Defence was the reason for building it, and goods have travelled on it for decades. The same is true of Roman roads, ports, airfields, satellites and the network that became the internet. But note: the fighting did not create these assets. The spending did; it just went through a defence budget.',
    },
    {
      id: 'mc-postwar-miracle',
      type: 'multiple_choice',
      tags: ['war', 'reconstruction', 'evidence'],
      xp: 35,
      prompt:
        'Germany and Japan grew very fast after 1945. Many people say the destruction cleared out old factories and made room for newer ones. What does the evidence show?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'catchup',
          label: 'They caught up to the path they were already on; the destruction did not help',
        },
        {
          id: 'leapfrog',
          label: 'A real jump ahead — their new factories beat the old ones the winners kept',
          feedback:
            'New factories were built, that is true. But if destruction helped, the most bombed cities should have grown past the least bombed ones. Instead, studies show they just returned to their own pre-war path.',
        },
        {
          id: 'marshall',
          label: 'It was the Marshall Plan aid, not the destruction',
          feedback:
            'The aid mattered, but it was small next to those economies: a few per cent of their GDP. It cannot explain the whole story.',
        },
        {
          id: 'unknowable',
          label: 'We cannot know, because we cannot compare with a country that was not destroyed',
          feedback:
            'There is a useful comparison: cities in the same country, bombed very differently, under the same government and currency. That is exactly what researchers compared.',
        },
      ],
      correctOptionId: 'catchup',
      explanation:
        'Researchers Davis and Weinstein followed bombed Japanese cities. Within about fifteen years, the cities returned to the population growth they had before the bombing. Fast growth from a low point looks like a miracle, but it is a return to normal. Both countries would have been even richer without the war.',
    },
    {
      id: 'mc-whose-territory',
      type: 'multiple_choice',
      tags: ['war', 'gdp', 'capital-stock'],
      xp: 35,
      prompt:
        'The United States ended the Second World War with more factories than it started with. Europe ended it in ruins. What explains the difference?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'territory',
          label: 'Where the destruction happened, not who won',
        },
        {
          id: 'winning',
          label: 'Winning — the winners gain and the losers pay afterwards',
          feedback:
            'Britain and the Soviet Union won and were badly damaged. Britain was still rationing bread in 1948. Winning did not protect factories that the fighting reached.',
        },
        {
          id: 'planning',
          label: 'Better economic planning during the war',
          feedback:
            'Wartime planning was strong everywhere, including in countries that ended in ruins. Skill did not decide this.',
        },
        {
          id: 'reserve',
          label: 'The dollar becoming the world’s main currency',
          feedback:
            'That came after the US had the factories and the money, not before. The 1944 Bretton Woods agreement only confirmed what the war had already decided.',
        },
      ],
      correctOptionId: 'territory',
      explanation:
        'There is no general answer to “does war make a country richer?”, because war does not hit everyone the same way. Production happens where the factories are. Destruction happens where the fighting is. When those are different places, one country records the production and another suffers the loss. The world as a whole still loses everything that was destroyed.',
    },
    {
      id: 'mc-insurance',
      type: 'multiple_choice',
      tags: ['defence', 'growth', 'framing'],
      xp: 35,
      prompt:
        'After all of this, what is the fairest thing to say about defence spending and growth?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'insurance',
          label: 'It is like insurance — needed for growth, but not a source of growth',
        },
        {
          id: 'always-waste',
          label: 'It is a waste, since what it buys produces nothing',
          feedback:
            'It produces security, and that is a real service. A country that loses its territory loses everything else in this course too.',
        },
        {
          id: 'engine',
          label: 'It drives growth, given how much technology came from it',
          feedback:
            'The new technology is real, but it is a side effect. Paying for research through a defence budget works, but it is not the cheapest way, as the first question showed.',
        },
        {
          id: 'neutral',
          label: 'It makes no difference — it counts in GDP like anything else',
          feedback:
            'It counts like anything else, and that is the problem this module started with. Counting the same is not being the same.',
        },
      ],
      correctOptionId: 'insurance',
      explanation:
        'Nobody calls fire insurance a source of wealth, and nobody sensible lives without it. Defence is a service you use all the time, and you only notice it when it fails. The difference from a hospital is real: a hospital is not used up by treating patients, but a fired shell is gone and may destroy a bridge too.',
    },
  ],
  keyTakeaways: [
    'Four things are real: idle workers put to work, roads and ports, new technology and a stronger state. Each has a limit.',
    'Conquest makes a winner richer by taking, not by producing.',
    'The post-war “miracle” was catching up to the normal path, not a gain from destruction.',
    'Defence is like insurance: needed for growth, but not a source of it.',
  ],
});
