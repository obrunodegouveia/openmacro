import { defineLesson } from '../../schema';

/**
 * The historical record. Every episode here is a well-documented case of a
 * government meeting an obligation it could not tax for by degrading the unit
 * of account instead — and in most of them the obligation was a war.
 */
export const debasementAndWarLesson = defineLesson({
  id: 'debasement-and-war',
  title: 'What Debasement Has Been Used For',
  subtitle:
    'The same mechanism, from Nero to the twentieth century, and what it was almost always paying for.',
  icon: '⚔️',
  difficulty: 'core',
  estimatedMinutes: 9,
  challenges: [
    {
      id: 'flow-debasement-mechanism',
      type: 'order_flow',
      tags: ['debasement', 'war-finance', 'history'],
      xp: 25,
      prompt: 'Put the mechanism in order. It has not changed in two thousand years.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'obligation',
          label: 'The state takes on an obligation it cannot tax for',
          detail: 'Usually a war; sometimes a promise made to a domestic constituency',
        },
        {
          id: 'limits',
          label: 'Taxing or borrowing further becomes politically impossible',
          detail: 'Both require someone to agree, and nobody will',
        },
        {
          id: 'debase',
          label: 'The unit of account is degraded',
          detail: 'Less silver in the coin, more notes off the press, more bonds onto the central bank',
        },
        {
          id: 'prices',
          label: 'Prices rise, and real obligations shrink',
          detail: 'Wages, pensions and bondholders absorb the difference',
        },
        {
          id: 'blame',
          label: 'The consequence is blamed on merchants, speculators or foreigners',
          detail: 'Diocletian’s price edict of 301 carried the death penalty',
        },
      ],
      correctOrder: ['obligation', 'limits', 'debase', 'prices', 'blame'],
      explanation:
        'The last step recurs so reliably it is almost diagnostic. A state that has degraded its own currency very rarely announces that it has done so; the observable consequence — rising prices — is attributed to whoever is charging them. Rome fixed prices and executed violators. Revolutionary France made refusing the assignat a capital offence.',
    },

    {
      id: 'match-episodes',
      type: 'concept_match',
      tags: ['history', 'debasement', 'war-finance'],
      xp: 25,
      prompt: 'Match each episode to what the debasement was paying for.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'rome',
          term: 'The Roman denarius',
          definition:
            'Legions and frontier defence: silver content fell from around 98% under Augustus to under 5% by the 260s',
        },
        {
          id: 'assignats',
          term: 'The French assignats',
          definition:
            'Revolutionary war and a bankrupt treasury: issued 1789, effectively worthless by 1796',
        },
        {
          id: 'greenbacks',
          term: 'US greenbacks',
          definition:
            'The Civil War: unbacked notes issued from 1862 because the Union could not tax or borrow fast enough',
        },
        {
          id: 'weimar',
          term: 'The Weimar papiermark',
          definition:
            'War debts and reparations after 1918, monetised until the currency ceased to function in 1923',
        },
      ],
      explanation:
        'Four currencies, two thousand years apart, and the same proximate cause in every case: an obligation the state could not meet out of what it was able to collect. The pattern is strong enough that "why is this currency being debased" is usually answered by "what is it fighting, and what did it promise".',
    },

    {
      id: 'mc-why-wars',
      type: 'multiple_choice',
      tags: ['war-finance', 'fiscal'],
      xp: 20,
      prompt:
        'Why is war the obligation that shows up again and again in these episodes, rather than, say, road building?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'expensive',
          label: 'Wars are simply more expensive',
          feedback:
            'Some are and some are not — modern states spend more on pensions than on defence. Cost alone does not explain why this is the spending that gets monetised.',
        },
        {
          id: 'urgent-and-unbudgeted',
          label: 'War spending is enormous, immediate, and cannot wait for a tax debate',
        },
        {
          id: 'popular',
          label: 'Wars are popular, so the public tolerates the inflation',
          feedback:
            'The inflation is generally not noticed as a war cost at all, which is closer to the real answer — but it is not that people approve of it.',
        },
        {
          id: 'productive',
          label: 'Because war spending is productive and pays for itself',
        },
      ],
      correctOptionId: 'urgent-and-unbudgeted',
      explanation:
        'A road can be deferred to next year’s budget. A war cannot, and the sums arrive faster than any tax system can be reformed to raise them. That combination — very large, very urgent, and impossible to legislate in time — is what makes the printing press the instrument of last resort, and it is why the historical record is so heavily weighted toward conflict.',
    },

    {
      id: 'mc-modern-form',
      type: 'multiple_choice',
      tags: ['debasement', 'qe', 'modern'],
      xp: 20,
      prompt:
        'Nobody clips coins any more. What is the modern equivalent of the mechanism above?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'qe-into-deficits',
          label: 'A central bank buying government debt while the government runs large deficits',
        },
        {
          id: 'any-qe',
          label: 'Any central bank asset purchase, always and everywhere',
          feedback:
            'Too broad to be useful. A central bank buying bonds to hold an interest rate target, with the budget roughly balanced, is doing something different from one absorbing an unfundable deficit — the money it creates is not financing anything.',
        },
        {
          id: 'low-rates',
          label: 'Keeping interest rates below inflation',
          feedback:
            'This one is real and has a name — financial repression — and it does transfer from savers to the government. But it is a second mechanism, not the modern form of coin clipping.',
        },
        {
          id: 'nothing',
          label: 'Nothing — modern central banks are independent, so it cannot happen',
          feedback:
            'Independence is a legal arrangement, and legal arrangements are revised under pressure. It raises the cost of doing this; it does not make it impossible.',
        },
      ],
      correctOptionId: 'qe-into-deficits',
      explanation:
        'The honest distinction is about what the purchases are financing, not about the purchases themselves — which is exactly why it is contested. Buying bonds to hit a rate target is monetary policy. Buying them because nobody else will absorb the deficit is the old mechanism in modern clothing, and telling the two apart from the outside is genuinely hard. Watching who is buying the new issuance is the closest thing to a test.',
    },
  ],
  keyTakeaways: [
    'The mechanism is identical from Rome to Weimar: an unfundable obligation, then a degraded unit of account.',
    'War is the obligation that recurs because it is large, immediate and impossible to legislate for in time.',
    'The consequence is reliably blamed on whoever is raising prices, not on whoever debased the money.',
    'The modern form turns on what the purchases finance — which is why the argument about it is not settled.',
  ],
});
