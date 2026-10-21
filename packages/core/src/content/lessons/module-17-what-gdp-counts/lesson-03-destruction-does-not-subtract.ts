import { defineLesson } from '../../schema';

/**
 * Why a flow measure has no line for destruction, and what follows from that
 * for war and for disasters.
 *
 * The SNA 2008 treatment of weapons is stated because it is checkable and
 * because it cuts against the intuitive version of the argument: durable
 * military equipment is capital formation in the accounts, not consumption.
 * The argument survives it — a tank is capital that produces nothing
 * civilian, and is destroyed rather than depreciated — but the argument has
 * to be made honestly rather than by assuming the accountants agree.
 */
export const destructionDoesNotSubtractLesson = defineLesson({
  id: 'destruction-does-not-subtract',
  title: 'GDP Does Not Go Down When Something Is Destroyed',
  subtitle:
    'GDP only counts new production. It has no line for what is lost. See what that means for a flood, a broken window and a war.',
  icon: '💥',
  difficulty: 'core',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'mc-flood',
      type: 'multiple_choice',
      tags: ['gdp', 'flow-vs-stock', 'disasters'],
      xp: 25,
      prompt:
        'In March, a flood destroys €10 billion of houses. Over that year, what does the destruction itself do to GDP?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'nothing-direct',
          label: 'Nothing directly — and the rebuilding afterwards makes it rise',
        },
        {
          id: 'minus-ten',
          label: 'GDP falls by €10 billion',
          feedback:
            'There is nowhere to subtract it. GDP adds up what is produced during the year. The houses were built in earlier years and counted then. Losing them destroys wealth, but it does not “un-produce” anything.',
        },
        {
          id: 'falls-later',
          label: 'GDP falls the next year, when the houses are missing',
          feedback:
            'It falls only a little: by the housing the lost homes would have provided, measured as rent. The €10 billion itself never shows up as a fall.',
        },
        {
          id: 'depends-insurance',
          label: 'It depends on whether the houses were insured',
          feedback:
            'Insurance only changes who pays for the loss. It produces nothing, so it changes nothing in GDP. The payout is a transfer, like a pension.',
        },
      ],
      correctOptionId: 'nothing-direct',
      explanation:
        'The loss is recorded, but in a different set of accounts: the national balance sheet, which almost nobody quotes. So a country can become poorer and still have a higher GDP in the same year. Nobody made a mistake in the maths.',
    },
    {
      id: 'mc-broken-window',
      type: 'multiple_choice',
      tags: ['gdp', 'bastiat', 'opportunity-cost'],
      xp: 30,
      prompt:
        'A child breaks a shop window. A glazier earns €200 to fix it. Someone says this is good for the economy. What is wrong with that?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'forgone',
          label: 'The shopkeeper can no longer buy what the €200 would have bought',
        },
        {
          id: 'gdp-unchanged',
          label: 'Nothing is wrong — GDP really does rise by the €200 the glazier earned',
          feedback:
            'GDP does rise, and that is why the person sounds right. The mistake is jumping from “GDP rose” to “good for the economy”. This module is about that jump.',
        },
        {
          id: 'glazier-loses',
          label: 'The glazier gains nothing, because he had other work anyway',
          feedback:
            'He may well gain. The loss is the shopkeeper’s, and the town’s: a window that existed is gone, and the work that replaced it cannot be used for anything else.',
        },
        {
          id: 'insurance',
          label: 'Insurance will pay, so no one is worse off',
          feedback:
            'Someone is still one window poorer, however the cost is shared. Insurance only changes who pays for the loss.',
        },
      ],
      correctOptionId: 'forgone',
      explanation:
        'The French writer Bastiat described this in 1850. What you see: the glazier working, €200 of activity. What you do not see: the shoes the shopkeeper would have bought. The town ends up with the same windows as before and one less pair of shoes. GDP records what you see, not what you do not see.',
    },
    {
      id: 'mc-weapons-accounting',
      type: 'multiple_choice',
      tags: ['gdp', 'war', 'national-accounts'],
      xp: 30,
      prompt:
        'Since the 2008 update of the international rules for national accounts, how is a newly built warship counted?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'capital-formation',
          label: 'As investment — capital, like a factory or a road',
        },
        {
          id: 'consumption',
          label: 'As government consumption, since it makes nothing for civilians',
          feedback:
            'That was the old rule. The 2008 update changed it because a warship is a long-lasting asset, like any other. Do not base the argument on a rule that no longer applies.',
        },
        {
          id: 'excluded',
          label: 'It is left out of GDP, because it is a public good',
          feedback:
            'Nothing is left out for being a public good. The nurse, the road and the warship are all things the state buys.',
        },
        {
          id: 'negative',
          label: 'As a negative entry, because it may destroy things',
          feedback:
            'The accounts have no negative entries for what something might be used for. They record what was produced, not what anyone plans to do with it.',
        },
      ],
      correctOptionId: 'capital-formation',
      explanation:
        'In the accounts, a warship is capital, like a factory. So the honest argument is not that war spending is counted wrongly. It is that this capital makes nothing people can eat, wear or live in, and it usually ends up destroyed. Ammunition is counted differently: as stock, used up when it is fired.',
    },
    {
      id: 'order-war-cycle',
      type: 'order_flow',
      tags: ['gdp', 'war', 'capital-stock'],
      xp: 35,
      prompt:
        'Put one cycle of a war economy in order. Notice which steps change GDP and which change what the country owns.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'order', label: 'The state orders €20bn of shells and vehicles', detail: 'Counted in GDP as they are made' },
        { id: 'divert', label: 'Factories and workers stop making civilian goods', detail: 'Things that would have existed are never made' },
        { id: 'use', label: 'The weapons are used at the front' },
        { id: 'destroy', label: 'Equipment and buildings on both sides are destroyed', detail: 'Nothing changes in GDP' },
        { id: 'poorer', label: 'The country owns less than before the cycle began' },
        { id: 'rebuild', label: 'Rebuilding starts after the war', detail: 'Counted in GDP again, as new production' },
      ],
      correctOrder: ['order', 'divert', 'use', 'destroy', 'poorer', 'rebuild'],
      explanation:
        'GDP rises at the first step and again at the last. It never falls in the middle, where the country actually became poorer. Repeat the cycle and you get a fast-growing economy that owns less at the end than at the start. GDP is not broken here; it measures production, as designed. The mistake is reading it as a score of whether a country is getting richer.',
    },
  ],
  keyTakeaways: [
    'Destruction never shows up in GDP. It shows up in a balance sheet that almost nobody quotes.',
    'Rebuilding raises GDP, so disasters and wars can look like growth.',
    'Warships count as capital in the accounts. The real argument is about what they produce, not how they are counted.',
  ],
});
