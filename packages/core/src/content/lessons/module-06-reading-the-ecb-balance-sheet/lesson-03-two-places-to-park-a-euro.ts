import { defineLesson } from '../../schema';

/**
 * Current accounts €317,864m against the deposit facility €2,005,870m as at
 * 28 August 2026 — 86% of banks' central bank money sitting in the facility.
 * Policy rates on 6 September 2026: DFR 2.25%, MRO 2.40%, MLF 2.65%. €STR
 * fixed at 2.189% on 3 September 2026, six basis points under the floor.
 */
export const twoPlacesToParkAEuroLesson = defineLesson({
  id: 'ecb-two-places-to-park-a-euro',
  title: 'Two Places to Park a Euro',
  subtitle:
    'The Eurosystem gives banks two accounts and pays different rates on them. The split is the whole story.',
  icon: '🏦',
  difficulty: 'advanced',
  estimatedMinutes: 9,
  challenges: [
    {
      id: 'mc-the-split',
      type: 'multiple_choice',
      tags: ['ecb', 'reserves', 'deposit-facility'],
      xp: 15,
      prompt:
        'Banks held €317,864m in current accounts and €2,005,870m in the deposit facility. Why is almost everything in the facility?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'safer',
          label: 'The deposit facility is safer',
          feedback:
            'Both are claims on the Eurosystem. There is no credit difference between them at all — a bank cannot be safer than the institution that issues the currency.',
        },
        {
          id: 'rate',
          label: 'Only the facility pays interest; current accounts above the requirement pay nothing',
        },
        {
          id: 'required',
          label: 'Regulators require banks to use the facility',
          feedback:
            'Nothing requires it. Banks sweep into it every evening because leaving money in the current account would earn them zero.',
        },
        {
          id: 'settlement',
          label: 'Payments settle out of the facility',
          feedback:
            'Backwards — payments settle across current accounts during the day. The facility is where the money goes when the payment system closes.',
        },
      ],
      correctOptionId: 'rate',
      explanation:
        'Since September 2023 the Eurosystem remunerates minimum reserves at 0%. Every euro a bank holds beyond its requirement earns nothing in the current account and the deposit facility rate — 2.25% — in the facility. So every evening banks sweep the difference, and the €318bn left behind is roughly the reserve requirement itself.',
    },

    {
      id: 'sweep-posting',
      type: 't_account_flow',
      tags: ['ecb', 'deposit-facility', 'reserves'],
      xp: 25,
      prompt: 'A bank sweeps €5bn into the deposit facility at the end of the day.',
      instructions: 'Two sheets. Ask yourself what actually changed.',
      scenario:
        'At 18:00 CET a euro area bank moves €5bn of idle balances out of its current account and into the overnight deposit facility, where it earns 2.25% instead of nothing.',
      currency: 'EUR',
      entities: [
        {
          id: 'eurosystem',
          label: 'Eurosystem',
          tier: 'central_bank',
          role: 'Runs both accounts',
          openingLines: [
            { account: 'Current accounts', side: 'liability', amount: 317864000000 },
            { account: 'Deposit facility', side: 'liability', amount: 2005870000000 },
          ],
        },
        {
          id: 'bank',
          label: 'A Euro Area Bank',
          tier: 'commercial_bank',
          role: 'Holds both, and prefers the one that pays',
          openingLines: [
            { account: 'Current account at the Eurosystem', side: 'asset', amount: 8000000000 },
            { account: 'Deposit facility balance', side: 'asset', amount: 20000000000 },
            { account: 'Customer deposits', side: 'liability', amount: 300000000000 },
          ],
        },
      ],
      options: [
        {
          id: 'euro-df-up',
          shift: {
            entityId: 'eurosystem',
            side: 'liability',
            account: 'Deposit facility',
            delta: 5000000000,
          },
        },
        {
          id: 'euro-ca-down',
          shift: {
            entityId: 'eurosystem',
            side: 'liability',
            account: 'Current accounts',
            delta: -5000000000,
          },
        },
        {
          id: 'bank-df-up',
          shift: {
            entityId: 'bank',
            side: 'asset',
            account: 'Deposit facility balance',
            delta: 5000000000,
          },
        },
        {
          id: 'bank-ca-down',
          shift: {
            entityId: 'bank',
            side: 'asset',
            account: 'Current account at the Eurosystem',
            delta: -5000000000,
          },
        },
        {
          id: 'deposits-down',
          shift: {
            entityId: 'bank',
            side: 'liability',
            account: 'Customer deposits',
            delta: -5000000000,
          },
          feedback:
            'No customer was involved. The bank moved its own money between two of its own accounts — its depositors have no idea this happened and are owed exactly as much as before.',
        },
      ],
      expectedShifts: [
        {
          entityId: 'eurosystem',
          side: 'liability',
          account: 'Deposit facility',
          delta: 5000000000,
        },
        {
          entityId: 'eurosystem',
          side: 'liability',
          account: 'Current accounts',
          delta: -5000000000,
        },
        {
          entityId: 'bank',
          side: 'asset',
          account: 'Deposit facility balance',
          delta: 5000000000,
        },
        {
          entityId: 'bank',
          side: 'asset',
          account: 'Current account at the Eurosystem',
          delta: -5000000000,
        },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'unchanged',
          note: 'Both accounts are central bank money. Base money did not move a cent.',
        },
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'Not one deposit in the euro area changed.',
        },
        {
          aggregate: 'collateral',
          direction: 'unchanged',
          note: 'Nothing was pledged. The deposit facility is unsecured — the Eurosystem needs no collateral to owe you euros.',
        },
      ],
      explanation:
        'Nothing happened, economically. Yet this is the single largest recurring movement on the Eurosystem’s balance sheet, and it is why the two lines have to be read together: "reserves fell" means nothing in the euro area unless you say which of the two accounts you mean.',
    },

    {
      id: 'sim-corridor',
      type: 'interactive_sim',
      tags: ['ecb', 'corridor', 'estr'],
      xp: 30,
      currency: 'EUR',
      prompt: 'Drain the excess liquidity and watch the overnight rate climb.',
      instructions: 'Move the excess liquidity slider and read where the market settles',
      narrative:
        'The corridor runs from the deposit facility rate at 2.25% to the marginal lending facility at 2.65%. While liquidity is abundant nobody lends below the floor and the market sits on it — €STR fixed at 2.189% on 3 September 2026, just under the DFR. Drain enough and the overnight rate lifts off the floor toward the ceiling.',
      constants: {
        floorRate: 2.25,
        ceilingRate: 2.65,
        saturationPoint: 1000000000000,
      },
      sliders: [
        {
          key: 'excessReserves',
          label: 'Excess liquidity in the system',
          min: 0,
          max: 2500000000000,
          step: 250000000000,
          defaultValue: 2000000000000,
          format: 'currency',
          hint: 'Roughly €2tn today, nearly all of it in the deposit facility.',
        },
      ],
      readouts: [
        {
          key: 'overnight',
          label: 'Where the overnight rate settles',
          formulaId: 'corridor_rate',
          format: 'number',
          emphasis: true,
          caption: 'Per cent. Floor 2.25, ceiling 2.65.',
        },
      ],
      objective: {
        description:
          'Compare €2tn of excess liquidity with €250bn, then leave the rate at or above 2.5%',
        requiredObservations: [
          { sliderKey: 'excessReserves', values: [2000000000000, 250000000000] },
        ],
        target: {
          readoutKey: 'overnight',
          comparator: 'gte',
          value: 2.5,
        },
      },
      explanation:
        'Everything from €1tn upward gives the same answer: the floor. That flat stretch is the whole point of a floor system — the ECB can let its balance sheet shrink by hundreds of billions without the overnight rate twitching. The danger is the far left of the slider, where the curve turns and the rate starts moving on its own.',
    },

    {
      id: 'mc-below-the-floor',
      type: 'multiple_choice',
      tags: ['estr', 'ecb', 'money-markets'],
      xp: 15,
      prompt:
        '€STR fixed at 2.189% while the deposit facility pays 2.25%. Why would anyone lend at six basis points below what the ECB itself pays?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'mistake',
          label: 'It is a data artefact — the rates are measured differently',
          feedback:
            'Both are overnight euro rates, published daily, and the gap is persistent rather than noisy. It is real.',
        },
        {
          id: 'no-access',
          label: 'Most lenders in that market cannot use the deposit facility at all',
        },
        {
          id: 'credit',
          label: 'Lenders are paid extra for taking bank credit risk',
          feedback:
            'That would push the rate *above* the floor, not below it. Risk is compensated, not paid for.',
        },
        {
          id: 'collateral',
          label: 'The loans are collateralised, so they yield less',
          feedback:
            '€STR is an unsecured rate. Collateralised euro lending is a different benchmark.',
        },
      ],
      correctOptionId: 'no-access',
      explanation:
        'The deposit facility is open to banks. Money market funds, insurers, pension funds and non-euro-area institutions are not banks, and for them the choice is not "2.25% at the ECB or less in the market" — it is "less in the market or nothing". So they lend below the floor, and the floor leaks. It is the same structural fact that made the Fed build its reverse repo facility, which is open to exactly the non-banks the ECB leaves outside.',
    },
  ],
  keyTakeaways: [
    'Euro area banks hold central bank money in two accounts, and only one of them pays.',
    'Reserve requirements have been remunerated at 0% since September 2023, so banks sweep everything into the facility each evening.',
    'A floor system is flat: liquidity can drain by hundreds of billions before the overnight rate moves.',
    '€STR sits below the floor because most of the lenders in that market cannot reach the facility.',
  ],
});
