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
  estimatedMinutes: 12,
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
            { account: 'Equity', side: 'liability', amount: 10000000, equity: true },
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
            equity: true,
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
          equity: true,
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
        'The loss had already happened — it happened when yields rose — but selling is what forces it onto the balance sheet. A bank that can hold to maturity never books it; a bank that needs cash books all of it at once. That difference, not the size of the loss, is what turned an ordinary interest rate move into the bank failures of spring 2023.',
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

    {
      id: 'mc-hold-or-sell',
      type: 'multiple_choice',
      tags: ['bonds', 'capital', 'banking'],
      xp: 20,
      prompt:
        'Two banks each bought $100m of the same Treasuries at par. Yields rose and the bonds are now worth $85m. Bank A keeps them. Bank B sells them to pay depositors who are leaving. Which bank lost money?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'only-b',
          label: 'Only Bank B, because Bank A sold nothing',
          feedback:
            'Bank A owns bonds worth $15m less than it paid, just like Bank B did. Not selling hides the loss from the books; it does not undo it.',
        },
        {
          id: 'both-b-books',
          label: 'Both lost value, but only Bank B must book it now',
        },
        {
          id: 'neither',
          label: 'Neither, because Treasuries always repay in full',
          feedback:
            'They will repay $100m at maturity. But money paid back years from now, at an old low rate, is worth less today when new bonds pay more.',
        },
        {
          id: 'only-a',
          label: 'Only Bank A, because it is stuck with the bonds',
          feedback:
            'Bank A is not worse off than Bank B; both own, or owned, bonds worth $85m. Holding them only means the loss has not been booked yet.',
        },
      ],
      correctOptionId: 'both-b-books',
      explanation:
        'The loss happened the moment yields rose, for every owner of the bond. Selling only decides when the loss shows up on the balance sheet. A bank that must sell, because depositors want their money, books the whole loss at once, and it comes straight out of its equity.',
    },

    {
      id: 'mc-which-line-absorbs',
      type: 'multiple_choice',
      tags: ['bonds', 'capital', 'banking'],
      xp: 20,
      prompt:
        'A bank sells $50m of bonds it bought at par for $46m. On its balance sheet, which line takes the $4m loss?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'deposits',
          label: 'Customer deposits fall by $4m',
          feedback:
            'Depositors are owed exactly what they were owed yesterday. A loss on the bank’s own investments is not passed on to them.',
        },
        {
          id: 'equity',
          label: 'Equity falls by $4m',
        },
        {
          id: 'reserves-only',
          label: 'Reserves fall by $4m',
          feedback:
            'Reserves go up, by the $46m the buyer pays. The bonds go down by $50m. The $4m gap between the two has to land on the other side of the sheet.',
        },
        {
          id: 'buyer',
          label: 'Nobody on the bank’s side; the buyer takes the loss',
          feedback:
            'The buyer paid $46m for bonds worth $46m, so it lost nothing. The loss belongs to whoever owned the bonds when yields rose: the bank.',
        },
      ],
      correctOptionId: 'equity',
      explanation:
        'Assets fall by $50m of bonds and rise by $46m of reserves, so the bank is $4m smaller. Debts to depositors do not change, so the owners’ share, equity, absorbs the difference. The buyer paid the market price and lost nothing.',
    },

    {
      id: 'flow-bank-loss',
      type: 'order_flow',
      tags: ['bonds', 'banking', 'yield'],
      xp: 25,
      prompt: 'Put the story of a bank’s bond loss in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'buys',
          label: 'The bank buys long Treasuries at par while yields are low',
          detail: 'Its deposits pay little, so the bonds look like easy income',
        },
        {
          id: 'rates-rise',
          label: 'Yields rise quickly',
          detail: 'New bonds now pay more than the ones the bank holds',
        },
        {
          id: 'price-falls',
          label: 'The bonds’ price falls, but the loss is not yet on the books',
          detail: 'Held to maturity, it stays hidden',
        },
        {
          id: 'deposits-leave',
          label: 'Depositors start taking their money out',
          detail: 'They can earn more elsewhere, or they get worried',
        },
        {
          id: 'sells',
          label: 'The bank sells the bonds and the loss hits its equity',
          detail: 'The cash raised is less than the bank paid',
        },
      ],
      correctOrder: ['buys', 'rates-rise', 'price-falls', 'deposits-leave', 'sells'],
      explanation:
        'No one defaulted at any step. A safe bond lost price because yields rose, and the loss stayed hidden until the bank needed cash. That chain, from a rate move to a forced sale, is the one behind the bank failures of spring 2023.',
    },

    {
      id: 'mc-yield-falls-back',
      type: 'multiple_choice',
      tags: ['bonds', 'yield'],
      xp: 15,
      prompt:
        'You bought a 10-year Treasury paying a fixed $4 a year on $100 when its yield was 5%, so you paid less than $100. Later the yield falls back to 4%. What happens to your bond?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'coupon-down',
          label: 'It now pays only $3 a year',
          feedback:
            'The $4 is fixed in the contract. A falling yield cannot change it; only the price can move.',
        },
        {
          id: 'no-change',
          label: 'Nothing, because you already own it',
          feedback:
            'The price moves every day with the yield, whether you sell or not. Owning it means you feel the change, up or down.',
        },
        {
          id: 'price-rises',
          label: 'Its price rises to $100, a gain on what you paid',
        },
        {
          id: 'price-falls',
          label: 'Its price falls, because a lower yield means a worse bond',
          feedback:
            'A lower yield means buyers accept a lower return, so they pay more for the same fixed $4. The price goes up, not down.',
        },
      ],
      correctOptionId: 'price-rises',
      explanation:
        'Price and yield move in opposite directions, both ways. When the yield falls to the coupon rate of 4%, the bond is worth exactly its $100 face value. You bought below that, so the fall in yield is a gain, the mirror image of the loss a bank takes when yields rise.',
    },
  ],
  keyTakeaways: [
    'A bond’s cash flows are fixed, so a change in yield can only be a change in price.',
    'Par is not a starting point — it is the one yield at which price equals face.',
    'A rate loss exists as soon as yields move; selling is what forces it onto the balance sheet.',
    'Sensitivity rises with maturity: the same one-point move costs a 30-year bond roughly eight times what it costs a 2-year note.',
  ],
});
