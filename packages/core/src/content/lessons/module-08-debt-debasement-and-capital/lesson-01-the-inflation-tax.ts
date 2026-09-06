import { defineLesson } from '../../schema';

/**
 * US CPI stood at 9.8 in January 1913 and 333.9 in July 2026 — a price level
 * 34 times higher, so a 1913 dollar buys about 2.9 cents of what it did.
 */
export const theInflationTaxLesson = defineLesson({
  id: 'the-inflation-tax',
  title: 'The Tax Nobody Votes For',
  subtitle:
    'Debasement moves purchasing power from people who hold money to whoever owes it. That is a transfer, and it has a beneficiary.',
  icon: '🪙',
  difficulty: 'core',
  estimatedMinutes: 9,
  challenges: [
    {
      id: 'mc-who-pays',
      type: 'multiple_choice',
      tags: ['inflation', 'debasement'],
      xp: 15,
      prompt:
        'Prices double while your salary, your savings and your bond holdings are all fixed in nominal terms. Who gained what you lost?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'nobody',
          label: 'Nobody — value was simply destroyed',
          feedback:
            'Purchasing power does not evaporate. Every nominal contract has two sides, and what the holder of the claim loses, the writer of it keeps.',
        },
        {
          id: 'debtors',
          label: 'Everyone who owed money in that currency — above all the largest debtor',
        },
        {
          id: 'shops',
          label: 'The businesses that raised their prices',
          feedback:
            'Their costs rose too. A shop that doubles its prices and pays double for stock and wages has gained nothing in real terms.',
        },
        {
          id: 'foreigners',
          label: 'Foreign holders of the currency',
        },
      ],
      correctOptionId: 'debtors',
      explanation:
        'A debt fixed in nominal terms is halved in real terms when prices double. The gain accrues to whoever wrote the contract — mortgage borrowers, indebted firms, and the single largest issuer of nominal claims in any economy, which is the government. It is a transfer from creditors to debtors, and it requires no vote.',
    },

    {
      id: 'sim-purchasing-power',
      type: 'interactive_sim',
      tags: ['inflation', 'purchasing-power'],
      xp: 30,
      prompt: 'What survives twenty years of inflation?',
      instructions: 'Move the inflation rate and read what is left of $100,000',
      narrative:
        'You put $100,000 under the mattress, or in any account that pays nothing. Nobody takes it. Nothing is confiscated. Find out how much of it is still there in twenty years at rates that have all been ordinary at some point in living memory.',
      constants: {
        nominal: 100000,
        years: 20,
      },
      sliders: [
        {
          key: 'inflationRate',
          label: 'Average annual inflation',
          min: 0,
          max: 0.15,
          step: 0.01,
          defaultValue: 0.02,
          format: 'percent',
          hint: '2% is the target. 1970s America ran near 7%. It has been far worse elsewhere.',
        },
      ],
      readouts: [
        {
          key: 'remaining',
          label: 'What it still buys',
          formulaId: 'purchasing_power',
          format: 'currency',
          emphasis: true,
          caption: 'In today’s goods, after twenty years',
        },
        {
          key: 'lost',
          label: 'Taken',
          formulaId: 'purchasing_power_lost',
          format: 'percent',
          caption: 'Nobody sent a bill for this',
        },
      ],
      objective: {
        description: 'Compare the 2% target with 7%, and leave under $30,000 standing',
        requiredObservations: [{ sliderKey: 'inflationRate', values: [0.02, 0.07] }],
        target: {
          readoutKey: 'remaining',
          comparator: 'lte',
          value: 30000,
        },
      },
      explanation:
        'At the 2% target, twenty years costs a third of it — and that is the outcome policy is deliberately aiming at. At 7%, three quarters are gone. The US price level is 34 times its 1913 level, so a dollar saved then and held would buy about three cents of what it did. Compounding is the whole argument: no single year of this is dramatic, and no saver survives forty of them.',
    },

    {
      id: 'match-who-bears-it',
      type: 'concept_match',
      tags: ['inflation', 'distribution'],
      xp: 20,
      prompt: 'Match each group to what inflation does to it.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'saver',
          term: 'A cash saver',
          definition: 'Loses steadily, and is never sent a bill',
        },
        {
          id: 'borrower',
          term: 'A fixed-rate borrower',
          definition: 'Repays in cheaper money than they borrowed',
        },
        {
          id: 'wage',
          term: 'A wage earner',
          definition:
            'Loses whenever pay rises later than prices, which is usually',
        },
        {
          id: 'asset-holder',
          term: 'An owner of real assets',
          definition:
            'Roughly protected — the asset is repriced along with everything else',
        },
        {
          id: 'government',
          term: 'A government with nominal debt',
          definition:
            'Sees its obligations shrink in real terms without legislating anything',
        },
      ],
      explanation:
        'Read that list as a distribution. The people who lose most are the ones holding claims fixed in money — savers, pensioners on nominal incomes, workers whose pay lags. The people who gain hold real assets or owe money. It is possible to argue about whether that trade is worth making; it is not really possible to argue that it is neutral.',
    },

    {
      id: 'mc-why-not-tax',
      type: 'multiple_choice',
      tags: ['inflation', 'fiscal', 'politics'],
      xp: 20,
      prompt:
        'If a government needs resources, why would it ever debase rather than raise taxes?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'cheaper',
          label: 'Debasement is cheaper to administer',
          feedback:
            'It is, marginally — no returns to file, no collectors. But administration is not what makes the difference between the two.',
        },
        {
          id: 'no-vote',
          label: 'It needs no legislation, no vote, and no name attached to it',
        },
        {
          id: 'no-cost',
          label: 'Because it is not actually a cost to anyone',
          feedback:
            'The previous screen priced it. Something that removes three quarters of a saver’s purchasing power in twenty years is a cost, whatever it is called.',
        },
        {
          id: 'growth',
          label: 'Because inflation raises real output',
        },
      ],
      correctOptionId: 'no-vote',
      explanation:
        'This is the mechanism worth understanding, whatever you conclude from it. A tax requires a legislature to vote for it, and voters can see who did. Inflation requires nobody to agree to anything and arrives with no name on it — which makes it the only levy a government can impose without asking. Every historical episode in the next lesson runs through that door.',
    },
  ],
  keyTakeaways: [
    'Inflation is a transfer from holders of nominal claims to writers of them, not a disappearance of value.',
    'The largest single writer of nominal claims in any economy is its government.',
    'Even at the 2% target, twenty years removes a third of a cash saving. At 7% it removes three quarters.',
    'Its defining political property is that it needs no vote and carries nobody’s name.',
  ],
});
