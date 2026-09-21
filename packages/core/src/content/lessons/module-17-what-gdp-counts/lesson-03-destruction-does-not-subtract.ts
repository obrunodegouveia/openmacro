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
  title: 'Nothing in GDP Goes Down When Something Is Destroyed',
  subtitle:
    'A flow measure has no line for the stock. Follow what that means through a flood, a broken window and a war.',
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
        'A flood destroys €10 billion of houses in March. Over that year, what does the destruction itself do to GDP?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'nothing-direct',
          label: 'Nothing directly — and the rebuilding that follows raises it',
        },
        {
          id: 'minus-ten',
          label: 'GDP falls by €10 billion',
          feedback:
            'There is no line to put it on. GDP adds up production during the year; the houses were produced in earlier years and counted then. Losing them destroys wealth without un-producing anything.',
        },
        {
          id: 'falls-later',
          label: 'GDP falls the following year, when the houses are missing',
          feedback:
            'It falls only to the extent that the lost houses were producing something countable — mainly the rent, imputed or actual, that housing services represent. The €10 billion of value never appears as a fall.',
        },
        {
          id: 'depends-insurance',
          label: 'It depends on whether the houses were insured',
          feedback:
            'Insurance moves who bears the loss. It produces nothing and so changes nothing in GDP; the payout is a transfer, like a pension.',
        },
      ],
      correctOptionId: 'nothing-direct',
      explanation:
        'The national accounts do record the loss — in the balance sheet, under other changes in the volume of assets. That is a different set of books from GDP, and almost nobody quotes it. So a country can be measurably poorer and have a higher GDP in the same year, with no error anywhere in the arithmetic.',
    },
    {
      id: 'mc-broken-window',
      type: 'multiple_choice',
      tags: ['gdp', 'bastiat', 'opportunity-cost'],
      xp: 30,
      prompt:
        'A child breaks a shopkeeper’s window. The glazier earns €200 fixing it. A bystander says this is good for the economy. What is wrong with that, in one step?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'forgone',
          label: 'Something the €200 would have bought now never exists',
        },
        {
          id: 'gdp-unchanged',
          label: 'Nothing is wrong with it — GDP really does rise by the €200 the glazier earned',
          feedback:
            'GDP does rise, which is exactly why the bystander sounds right. The error is in the leap from that to *good for the economy*, and the module is about the size of that leap.',
        },
        {
          id: 'glazier-loses',
          label: 'The glazier gains nothing, because he had other work anyway',
          feedback:
            'He may well gain. The loss is the shopkeeper’s, and the country’s: a window that existed no longer does, and the resources that replaced it cannot be used twice.',
        },
        {
          id: 'insurance',
          label: 'Insurance will pay, so no one is worse off',
          feedback:
            'Somebody is worse off by one window however the cost is shared out. Insurance changes the distribution of the loss, never its existence.',
        },
      ],
      correctOptionId: 'forgone',
      explanation:
        'Bastiat wrote this in 1850 and it is still the cleanest test of the confusion. What is seen: the glazier at work, €200 of measured activity. What is not seen: the shoes the shopkeeper would have bought, and the fact that the town has the same number of windows as before and one fewer pair of shoes. GDP records what is seen. It has no column for what is not.',
    },
    {
      id: 'mc-weapons-accounting',
      type: 'multiple_choice',
      tags: ['gdp', 'war', 'national-accounts'],
      xp: 30,
      prompt:
        'Since the 2008 revision of the System of National Accounts, how is a newly built warship treated?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'capital-formation',
          label: 'As gross fixed capital formation — capital, alongside a factory or a road',
        },
        {
          id: 'consumption',
          label: 'As government consumption, since it produces nothing civilian',
          feedback:
            'That was the older treatment, and the 2008 revision changed it precisely because a warship is a long-lived produced asset by any ordinary definition. Do not build the argument on an accounting rule that no longer holds.',
        },
        {
          id: 'excluded',
          label: 'Excluded from GDP, being a public good',
          feedback:
            'Nothing is excluded for being a public good. The nurse, the road and the warship are all output bought by the state.',
        },
        {
          id: 'negative',
          label: 'As a negative entry, because it may destroy value',
          feedback:
            'There are no negative entries for intent. The accounts record production, not what anybody plans to do with it.',
        },
      ],
      correctOptionId: 'capital-formation',
      explanation:
        'Worth knowing before arguing about war and GDP: the accountants are not on the side you might expect. A warship is capital in the accounts. The honest form of the argument is therefore not that war spending is miscounted — it is that this particular capital produces nothing anyone can eat, wear or live in, and that its normal fate is to be destroyed rather than to depreciate slowly. Munitions are treated differently again: they are inventories, counted as used.',
    },
    {
      id: 'order-war-cycle',
      type: 'order_flow',
      tags: ['gdp', 'war', 'capital-stock'],
      xp: 35,
      prompt:
        'Put one cycle of a war economy in order, and watch which steps move GDP and which move the stock.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'order', label: 'The state orders €20bn of shells and vehicles', detail: 'Enters GDP as it is produced' },
        { id: 'divert', label: 'Factories and workers switch from civilian goods', detail: 'Output that would have existed does not' },
        { id: 'use', label: 'The materiel is used at the front' },
        { id: 'destroy', label: 'Both sides’ equipment and buildings are destroyed', detail: 'No entry in GDP at all' },
        { id: 'poorer', label: 'The capital stock is smaller than before the cycle began' },
        { id: 'rebuild', label: 'Reconstruction is contracted after the war', detail: 'Enters GDP again, as new production' },
      ],
      correctOrder: ['order', 'divert', 'use', 'destroy', 'poorer', 'rebuild'],
      explanation:
        'GDP rises at the first step and again at the last, and never falls at the one in the middle where the country actually became poorer. Run the cycle twice and you have a fast-growing economy with less standing at the end of it than at the start. Nothing here is a flaw in GDP — it is a flow measure doing exactly what a flow measure does. The flaw is in reading it as a scoreboard for whether a country is getting richer.',
    },
  ],
  keyTakeaways: [
    'Destruction never appears in GDP; it appears in a balance sheet almost nobody quotes.',
    'Rebuilding raises GDP, which is why disasters and wars can show up as growth.',
    'Durable weapons are capital formation in the accounts — the argument has to rest on what they produce, not on how they are booked.',
  ],
});
