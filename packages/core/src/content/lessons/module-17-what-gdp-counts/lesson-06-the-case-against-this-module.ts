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
  title: 'Five Ways War Is Accretive',
  subtitle:
    'The strongest arguments against everything you have just learned. Four of them survive. One does not.',
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
        'Five channels through which war genuinely leaves something behind. Match each to the catch that comes with it.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'slack',
          term: 'Idle capacity',
          definition:
            'A grid or a railway would have employed the same workers and left an asset standing — war is a ruinously expensive way to buy a stimulus',
        },
        {
          id: 'dualuse',
          term: 'Dual-use infrastructure',
          definition:
            'The real thing, and the narrowest: only the part that outlives the war counts, and a road is a road whoever paid for it',
        },
        {
          id: 'spillover',
          term: 'Technology spillovers',
          definition:
            'Per euro, civilian research almost certainly yields more; what war supplies is urgency and a tolerance for failure, not money',
        },
        {
          id: 'state',
          term: 'State capacity',
          definition:
            'Income tax, statistics and social insurance arrived with wars — and a state built to fight is not automatically a state that governs well',
        },
        {
          id: 'conquest',
          term: 'Conquest',
          definition:
            'A transfer, not production: the winner holds what the loser held, and the world is no richer for the move',
        },
      ],
      explanation:
        'None of these is a trick. Each is a genuine mechanism with a genuine limit, and an argument about war and growth that ignores all five is not worth having. What none of them establishes is the strong claim — that the destruction itself was productive.',
    },
    {
      id: 'mc-interstate',
      type: 'multiple_choice',
      tags: ['war', 'infrastructure', 'dual-use'],
      xp: 25,
      prompt:
        'Which is the most literal case of military spending that accretes the way a building does?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'interstate',
          label:
            'The US Interstate system, created in 1956 as the National System of Interstate and Defense Highways',
        },
        {
          id: 'tanks',
          label: 'Tank production, because the factories could be converted afterwards',
          feedback:
            'The factory is the asset, not the tank — and a plant tooled for armour is expensive to convert. Some were; the conversion is the accretive part, and it is smaller than the outlay.',
        },
        {
          id: 'employment',
          label: 'Wartime employment, because workers gained skills',
          feedback:
            'Skills are real human capital and they do persist. But that is the idle-capacity channel wearing different clothes, and a civilian programme would have built the same skills.',
        },
        {
          id: 'bonds',
          label: 'War bonds, because households ended the war holding assets',
          feedback:
            'A bond is a claim on future taxes, held by one citizen and owed by all of them. The country as a whole is not richer by a single bond.',
        },
      ],
      correctOptionId: 'interstate',
      explanation:
        'Defence justified it, and eighty years of freight has used it. The same is true of Roman roads, of ports, airfields and satellites, and of the network that became the internet. This is the channel with the least to argue about — and note what it is not: it is not the fighting that produced the asset, it is the spending that happened to be routed through a defence budget.',
    },
    {
      id: 'mc-postwar-miracle',
      type: 'multiple_choice',
      tags: ['war', 'reconstruction', 'evidence'],
      xp: 35,
      prompt:
        'Germany and Japan grew spectacularly after 1945. The usual inference is that destruction cleared out old capital and let newer capital in. What does the evidence actually show?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'catchup',
          label: 'Catch-up to the path they were already on, not a gain from having been flattened',
        },
        {
          id: 'leapfrog',
          label: 'A genuine leapfrog — newer vintage capital beat what the winners kept',
          feedback:
            'Newer capital was installed, and that is true. But if destruction were the mechanism, the most heavily bombed cities should have overtaken the least bombed ones. Studied directly, they returned to their own pre-war trajectories instead.',
        },
        {
          id: 'marshall',
          label: 'It was the Marshall Plan, not the destruction',
          feedback:
            'The aid mattered, and it was small next to the economies it entered — a few per cent of recipient GDP. It is not large enough to be the whole story either way.',
        },
        {
          id: 'unknowable',
          label: 'Unknowable — there is no counterfactual for a destroyed country',
          feedback:
            'There is a usable one: cities within the same country, bombed to very different degrees, under the same government and currency. That comparison is exactly what the research uses.',
        },
      ],
      correctOptionId: 'catchup',
      explanation:
        'Davis and Weinstein followed Japanese cities through the bombing and found them converging back to the population paths they had been on before it, within about fifteen years. Fast growth from a low base looks like a miracle in the growth rate and is a return to trend in the level. Both countries would have been richer still without the war — which is the answer the growth figures cannot give you and the levels can.',
    },
    {
      id: 'mc-whose-territory',
      type: 'multiple_choice',
      tags: ['war', 'gdp', 'capital-stock'],
      xp: 35,
      prompt:
        'The United States finished the Second World War with a larger industrial base than it started with. Europe finished it in rubble. What does that difference turn on?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'territory',
          label: 'Where the destruction happened, not who won it',
        },
        {
          id: 'winning',
          label: 'Winning — the victors gain and the losers pay for it afterwards',
          feedback:
            'Britain and the Soviet Union won and were devastated; Britain was still rationing bread in 1948. Victory did not protect a capital stock that the fighting reached.',
        },
        {
          id: 'planning',
          label: 'Better economic management of the war effort',
          feedback:
            'Wartime planning was formidable everywhere, including in economies that ended in ruins. Competence did not decide this.',
        },
        {
          id: 'reserve',
          label: 'The dollar becoming the reserve currency',
          feedback:
            'That followed from the industrial and financial position rather than creating it. Bretton Woods ratified an outcome the war had already produced.',
        },
      ],
      correctOptionId: 'territory',
      explanation:
        '"Is war accretive" has no general answer because war is not one thing that happens to everybody. Production happens where the factories are; destruction happens where the fighting is. When those are different places, one participant books the output and another books the loss — and the world total is still down by everything destroyed.',
    },
    {
      id: 'mc-insurance',
      type: 'multiple_choice',
      tags: ['defence', 'growth', 'framing'],
      xp: 35,
      prompt:
        'After all of that, what is the most defensible thing to say about defence spending and growth?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'insurance',
          label: 'It is insurance — a precondition for growth rather than a source of it',
        },
        {
          id: 'always-waste',
          label: 'It is waste, since the output produces nothing',
          feedback:
            'It produces security, which is a service and a real one. A country that loses its territory loses every other thing in this course along with it.',
        },
        {
          id: 'engine',
          label: 'It is an engine of growth, given how much technology came out of it',
          feedback:
            'The spillovers are real and they are a by-product. Buying research through a defence budget works; it is not the cheapest way to buy research, and the lesson before this one is why.',
        },
        {
          id: 'neutral',
          label: 'It is neutral — it counts in GDP like anything else',
          feedback:
            'It counts like anything else, which is the whole problem the module started from. Counting the same is not being the same.',
        },
      ],
      correctOptionId: 'insurance',
      explanation:
        'Nobody calls their fire insurance a source of wealth, and nobody sensible goes without it. Defence buys a service that is consumed continuously and whose value is invisible precisely when it is working. The mechanical difference from a hospital stands: a hospital is not diminished by treating patients, and a shell fired is gone and takes a bridge with it. That is the asymmetry — not the accounting, which treats a warship as capital exactly like a factory.',
    },
  ],
  keyTakeaways: [
    'Four channels are real: idle capacity, dual-use infrastructure, spillovers and state capacity. Each has a limit.',
    'Conquest enriches a winner by transfer, not by production.',
    'The post-war miracle was catch-up to trend, not a gain from destruction.',
    'Defence is insurance: a precondition for growth rather than a source of it.',
  ],
});
