import { defineLesson } from '../../schema';

/**
 * The identity behind the H.4.1's Table 1, driven by hand.
 *
 * Constants are the real 2 September 2026 sheet: $6,737,204m of assets,
 * $2,430,305m of notes, and $75,508m of other liabilities and capital, which
 * leaves the Treasury account and the reverse repo facility as the two things
 * the learner can move.
 */
export const reservesAreTheResidualLesson = defineLesson({
  id: 'reserves-are-the-residual',
  title: 'Nobody Chooses How Many Reserves Exist',
  subtitle:
    'Reserves are what is left of the asset side once everyone else has taken their share.',
  icon: '🧮',
  difficulty: 'advanced',
  estimatedMinutes: 8,
  challenges: [
    {
      id: 'mc-who-decides',
      type: 'multiple_choice',
      tags: ['reserves', 'balance-sheet'],
      xp: 15,
      prompt:
        'A bank decides it is holding too many reserves and wants fewer. Can it get rid of them?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'lend',
          label: 'Yes — it lends them out',
          feedback:
            'Lending creates a deposit, not a reserve transfer. When the borrower spends, the reserves move to another bank — the system still holds every one of them.',
        },
        {
          id: 'individual-yes-system-no',
          label: 'It can pass them to another bank, but the system cannot shed them',
        },
        {
          id: 'return',
          label: 'Yes — it returns them to the Fed',
          feedback:
            'There is no window for handing reserves back. They are extinguished only when the Fed’s asset side shrinks, and that is the Fed’s decision, not the bank’s.',
        },
        {
          id: 'no',
          label: 'No — reserves are frozen once created',
          feedback:
            'They move constantly between banks all day. What cannot change is the total, and only from the individual bank’s side.',
        },
      ],
      correctOptionId: 'individual-yes-system-no',
      explanation:
        'This is the hot potato: any one bank can offload reserves onto another, and the banking system as a whole is stuck with whatever total the Fed’s balance sheet leaves it. Which is why the next screen matters — that total is a residual, and two of the three things determining it are not the Fed’s doing.',
    },

    {
      id: 'sim-residual',
      type: 'interactive_sim',
      tags: ['reserves', 'tga', 'rrp', 'balance-sheet'],
      xp: 30,
      prompt: 'Move the other liabilities. Watch reserves take the hit.',
      instructions:
        'Drag the Treasury account and the reverse repo facility, and watch what is left',
      narrative:
        'The asset side is frozen at the real 2 September 2026 figure of $6.74 trillion, and currency is frozen at $2.43 trillion — the public takes what cash it wants and nobody else gets a say. That leaves the Treasury’s account and the reverse repo facility. Whatever those two do not take is reserves.',
      constants: {
        totalAssets: 6737204000000,
        currency: 2430305000000,
        otherLiabilities: 75508000000,
      },
      sliders: [
        {
          key: 'tga',
          label: 'U.S. Treasury, General Account',
          min: 0,
          max: 1200000000000,
          // $100bn steps, not $50bn: the readouts are shown to one decimal at
          // this scale, so a smaller step would move the number the learner is
          // meant to be watching by less than it can display.
          step: 100000000000,
          defaultValue: 900000000000,
          format: 'currency',
          hint: 'Actual on 2 Sep 2026: $944bn. It has been under $50bn during a debt ceiling standoff.',
        },
        {
          key: 'rrp',
          label: 'Reverse repurchase agreements',
          min: 0,
          max: 800000000000,
          step: 100000000000,
          defaultValue: 400000000000,
          format: 'currency',
          hint: 'Actual on 2 Sep 2026: $358bn, nearly all of it foreign central banks.',
        },
      ],
      readouts: [
        {
          key: 'reserves',
          label: 'Bank reserves — whatever is left',
          formulaId: 'fed_reserve_balances',
          format: 'currency',
          emphasis: true,
          caption: 'Assets − currency − TGA − reverse repos − other',
        },
        {
          key: 'absorbing',
          label: 'Absorbed by everyone else',
          formulaId: 'fed_factors_absorbing',
          format: 'currency',
          caption: 'Currency + TGA + reverse repos',
        },
        {
          key: 'reserveShare',
          label: 'Reserves as a share of the sheet',
          formulaId: 'fed_reserves_share',
          format: 'percent',
          caption: 'How much of the asset side is left over for banks',
        },
      ],
      objective: {
        description:
          'Compare a $900bn Treasury account with a $1.2tn one, then leave reserves under $2.7tn',
        requiredObservations: [
          { sliderKey: 'tga', values: [900000000000, 1200000000000] },
        ],
        target: {
          readoutKey: 'reserves',
          comparator: 'lte',
          value: 2700000000000,
        },
      },
      explanation:
        'You never touched an asset, and reserves fell by three hundred billion dollars. This is why the Fed watches the Treasury’s cash forecast as closely as it watches the economy: the government can drain the banking system without anyone at the Fed voting on anything.',
    },

    {
      id: 'mc-ample-reserves',
      type: 'multiple_choice',
      tags: ['reserves', 'policy'],
      xp: 15,
      prompt:
        'The Fed says it wants to hold reserves at an "ample" level. Given that reserves are a residual, how does it actually do that?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'orders',
          label: 'It instructs banks to hold a target amount',
          feedback:
            'Reserve requirements were cut to zero in March 2020 and have not come back. Even when they existed, they set a floor per bank, not a system total.',
        },
        {
          id: 'assets',
          label: 'By adjusting the size of its asset side — the only side it controls',
        },
        {
          id: 'iorb',
          label: 'By moving the interest rate it pays on reserves',
          feedback:
            'That changes what reserves are worth to hold, not how many exist. The rate is a price; the quantity comes from the balance sheet.',
        },
        {
          id: 'tga-control',
          label: "By telling the Treasury how much to keep in its account",
          feedback:
            'The Treasury sets its own cash balance policy and has targeted a buffer big enough to cover a week of outflows since 2015. The Fed is a bystander to that decision.',
        },
      ],
      correctOptionId: 'assets',
      explanation:
        'It buys or stops replacing assets. That is the entire toolkit for the quantity of reserves — which is why the Fed stopped shrinking its portfolio well before anyone thought reserves were scarce. Once the residual gets tight, the only fix is slow.',
    },
  ],
  keyTakeaways: [
    'No individual bank, and no bank in aggregate, can change how many reserves exist.',
    'Reserves are the residual: assets minus currency, minus the Treasury’s account, minus reverse repos, minus everything else.',
    'Two of the three claims on the asset side are set by people other than the Fed.',
    'The Fed steers the quantity of reserves only by changing the size of its portfolio, and that is a slow instrument.',
  ],
});
