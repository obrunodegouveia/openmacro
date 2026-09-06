import { defineLesson } from '../../schema';

/**
 * The mechanical heart of the module: a bond is a fixed set of cash flows, so
 * its price and its yield are two ways of saying the same thing, and they can
 * only move in opposite directions.
 */
export const priceAndYieldLesson = defineLesson({
  id: 'bond-price-and-yield',
  title: 'Price and Yield Are One Number',
  subtitle:
    'A bond pays what it pays. If the yield moves, it is the price that did the moving.',
  icon: '⚖️',
  difficulty: 'core',
  estimatedMinutes: 9,
  challenges: [
    {
      id: 'mc-which-moves',
      type: 'multiple_choice',
      tags: ['bonds', 'yield'],
      xp: 15,
      prompt:
        'You own a 10-year Treasury paying a fixed $4 a year on $100 of face value. The 10-year yield rises from 4% to 5%. What happened to your bond?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'coupon-up',
          label: 'It now pays $5 a year',
          feedback:
            'The coupon is written into the bond and never changes. That is exactly why the price has to move instead — it is the only free variable.',
        },
        {
          id: 'price-down',
          label: 'It still pays $4, and its price fell until $4 represents a 5% return',
        },
        {
          id: 'nothing',
          label: 'Nothing, if you hold it to maturity',
          feedback:
            'You will still get $100 back, which is what people mean by this. But the price fell today, and if you have to sell, or mark it to market, that loss is entirely real.',
        },
        {
          id: 'default',
          label: 'The market thinks the Treasury is more likely to default',
        },
      ],
      correctOptionId: 'price-down',
      explanation:
        'The cash flows are fixed by contract. The only way a fixed stream can offer a higher return is for it to cost less. Yield up and price down are not two events — they are one event described from two ends.',
    },

    {
      id: 'sim-price-yield',
      type: 'interactive_sim',
      tags: ['bonds', 'duration', 'yield'],
      xp: 30,
      prompt: 'Move the yield. Watch what it does to a $100 bond.',
      instructions: 'Drag the yield and read the price',
      narrative:
        'A 10-year Treasury with a 4% coupon on $100 of face value. At a 4.77% yield — where the 10-year actually sat on 3 September 2026 — it is already worth less than you paid. Find out what a 6% yield would do to it.',
      constants: {
        face: 100,
        couponRate: 0.04,
        years: 10,
      },
      sliders: [
        {
          key: 'yieldRate',
          label: '10-year yield',
          min: 0.01,
          max: 0.08,
          step: 0.0025,
          defaultValue: 0.0475,
          format: 'percent',
          hint: 'Actually 4.77% on 3 September 2026.',
        },
      ],
      readouts: [
        {
          key: 'price',
          label: 'What the bond is worth',
          formulaId: 'bond_price',
          format: 'currency',
          emphasis: true,
          caption: 'Coupons plus principal, each discounted at the yield',
        },
        {
          key: 'change',
          label: 'Against the $100 you lent',
          formulaId: 'bond_price_change',
          format: 'percent',
          caption: 'Par is where the yield equals the coupon, and nowhere else',
        },
      ],
      objective: {
        description: 'Sit on 4% and see par, then take the yield to 6%',
        requiredObservations: [{ sliderKey: 'yieldRate', values: [0.04, 0.06] }],
        target: {
          readoutKey: 'price',
          comparator: 'lte',
          value: 90,
        },
      },
      explanation:
        'Two points are worth carrying away. At exactly 4% the price is exactly $100 — par is not a starting value, it is the single yield at which a bond is worth its face. And a two-point rise in yield costs about fifteen per cent of the principal, on the safest instrument in the world, with no default and no drama. That is duration, and it is what made 2022 the worst year for Treasuries in modern record.',
    },

    {
      id: 'realise-the-loss',
      type: 't_account_flow',
      tags: ['bonds', 'capital', 'banking'],
      xp: 30,
      prompt: 'A bank sells that bond at $85 to raise cash. Post it.',
      instructions:
        'Three lines on one sheet, two on the other. Watch where the loss lands.',
      scenario:
        'A bank bought $100m of 10-year Treasuries at par. Yields rose, and it needs cash now, so it sells the position for $85m to a pension fund.',
      currency: 'USD',
      entities: [
        {
          id: 'bank',
          label: 'The Selling Bank',
          tier: 'commercial_bank',
          role: 'Bought at par, sells at 85',
          openingLines: [
            { account: 'Treasury securities', side: 'asset', amount: 100000000 },
            { account: 'Reserves at the Fed', side: 'asset', amount: 40000000 },
            { account: 'Customer deposits', side: 'liability', amount: 130000000 },
            { account: 'Equity', side: 'liability', amount: 10000000 },
          ],
        },
        {
          id: 'fund',
          label: 'The Pension Fund',
          tier: 'shadow_bank',
          role: 'Buys the same bond at the market price',
          openingLines: [
            { account: 'Bank deposits', side: 'asset', amount: 200000000 },
            { account: 'Obligations to members', side: 'liability', amount: 200000000 },
          ],
        },
      ],
      options: [
        {
          id: 'bank-bonds-down',
          shift: {
            entityId: 'bank',
            side: 'asset',
            account: 'Treasury securities',
            delta: -100000000,
          },
        },
        {
          id: 'bank-cash-up',
          shift: {
            entityId: 'bank',
            side: 'asset',
            account: 'Reserves at the Fed',
            delta: 85000000,
          },
        },
        {
          id: 'bank-equity-down',
          shift: {
            entityId: 'bank',
            side: 'liability',
            account: 'Equity',
            delta: -15000000,
          },
        },
        {
          id: 'fund-bonds-up',
          shift: {
            entityId: 'fund',
            side: 'asset',
            account: 'Treasury securities',
            delta: 85000000,
          },
        },
        {
          id: 'fund-cash-down',
          shift: {
            entityId: 'fund',
            side: 'asset',
            account: 'Bank deposits',
            delta: -85000000,
          },
        },
        {
          id: 'bank-deposits-down',
          shift: {
            entityId: 'bank',
            side: 'liability',
            account: 'Customer deposits',
            delta: -15000000,
          },
          feedback:
            'Depositors do not absorb a trading loss — they are owed the same amount the day after as the day before. That is the entire point of being a depositor rather than a shareholder, and it is why the equity line is the one that moves.',
        },
        {
          id: 'fund-gains',
          shift: {
            entityId: 'fund',
            side: 'liability',
            account: 'Obligations to members',
            delta: 15000000,
          },
          feedback:
            'The fund paid the market price for a market asset. It made no profit today — it simply owns a bond worth what it paid for it.',
        },
      ],
      expectedShifts: [
        {
          entityId: 'bank',
          side: 'asset',
          account: 'Treasury securities',
          delta: -100000000,
        },
        {
          entityId: 'bank',
          side: 'asset',
          account: 'Reserves at the Fed',
          delta: 85000000,
        },
        {
          entityId: 'bank',
          side: 'liability',
          account: 'Equity',
          delta: -15000000,
        },
        {
          entityId: 'fund',
          side: 'asset',
          account: 'Treasury securities',
          delta: 85000000,
        },
        {
          entityId: 'fund',
          side: 'asset',
          account: 'Bank deposits',
          delta: -85000000,
        },
      ],
      aggregateEffects: [
        {
          aggregate: 'M2',
          direction: 'contract',
          note: 'The fund paid from a bank deposit, and that deposit is gone. Broad money falls when a non-bank buys a bond from a bank.',
        },
        {
          aggregate: 'M0',
          direction: 'unchanged',
          note: 'Reserves moved between banks, but the system holds the same number.',
        },
        {
          aggregate: 'collateral',
          direction: 'unchanged',
          note: 'The same bond exists; it changed owner. Nothing was created or retired.',
        },
      ],
      explanation:
        'The loss had already happened — it happened when yields rose — but selling is what forces it onto the balance sheet. A bank that can hold to maturity never books it; a bank that needs cash books all of it at once. That difference, not the size of the loss, is what turned an ordinary interest rate move into three bank failures in March 2023.',
    },

    {
      id: 'mc-duration',
      type: 'multiple_choice',
      tags: ['duration', 'bonds'],
      xp: 15,
      prompt:
        'Yields rise by one percentage point. Which loses more value: a 2-year note or a 30-year bond?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'thirty',
          label: 'The 30-year, by a very wide margin',
        },
        {
          id: 'two',
          label: 'The 2-year, because short rates move more',
          feedback:
            'Short *yields* do move more, which is a separate fact. For the same one-point move, the longer bond loses far more price, because it has thirty years of cash flows being discounted instead of two.',
        },
        {
          id: 'same',
          label: 'The same — one point is one point',
          feedback:
            'One point applied to two years of cash flows and one point applied to thirty are entirely different amounts of discounting. Sensitivity to yield rises with maturity, and that sensitivity has a name: duration.',
        },
        {
          id: 'depends-coupon',
          label: 'It depends entirely on the coupon',
        },
      ],
      correctOptionId: 'thirty',
      explanation:
        'Roughly, price falls by duration times the yield change. A 2-year note has a duration near 2 and loses about 2%; a 30-year bond has a duration near 17 and loses about 17%. This is why "safe" and "no price risk" are different claims, and why a portfolio of long Treasuries is a bet on rates however impeccable the credit.',
    },
  ],
  keyTakeaways: [
    'A bond’s cash flows are fixed, so a change in yield can only be a change in price.',
    'Par is not a starting point — it is the one yield at which price equals face.',
    'A rate loss exists as soon as yields move; selling is what forces it onto the balance sheet.',
    'Sensitivity rises with maturity: the same one-point move costs a 30-year bond roughly eight times what it costs a 2-year note.',
  ],
});
