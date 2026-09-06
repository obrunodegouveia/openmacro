import { defineLesson } from '../../schema';

/**
 * The transfer mechanism, named and posted.
 *
 * Most of the money that bids up a housing market is not saved money moving
 * about — it is created at the moment of purchase, by the mortgage. Which is
 * the money-creation lesson from module 2, arriving in a market where supply
 * cannot respond.
 */
export const whoeverGetsItFirstLesson = defineLesson({
  id: 'whoever-gets-it-first',
  title: 'The Money Is Made at the Moment of Sale',
  subtitle:
    'New money does not land evenly. It lands where the credit is, and the credit is in property.',
  icon: '🧾',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mortgage-posting',
      type: 't_account_flow',
      tags: ['mortgage', 'money-creation', 'property'],
      xp: 30,
      prompt: 'Post a €300,000 purchase: €60,000 saved, €240,000 borrowed.',
      instructions:
        'Three sheets. Ask where the €240,000 was before the sale.',
      scenario:
        'A buyer takes a €240,000 mortgage and adds €60,000 of their own deposit to buy a flat from its current owner. All three parties bank at the same institution.',
      currency: 'EUR',
      entities: [
        {
          id: 'bank',
          label: 'The Lending Bank',
          tier: 'commercial_bank',
          role: 'Writes both sides of the mortgage',
          openingLines: [
            { account: 'Mortgage loans', side: 'asset', amount: 4000000000 },
            { account: 'Customer deposits', side: 'liability', amount: 4000000000 },
          ],
        },
        {
          id: 'buyer',
          label: 'The Buyer',
          tier: 'fiduciary_core',
          role: 'Puts in 60,000, borrows the rest',
          openingLines: [
            { account: 'Deposit at the bank', side: 'asset', amount: 60000 },
            { account: 'Equity', side: 'liability', amount: 60000 },
          ],
        },
        {
          id: 'seller',
          label: 'The Seller',
          tier: 'fiduciary_core',
          role: 'Owns the flat this morning',
          openingLines: [
            { account: 'The flat', side: 'asset', amount: 300000 },
            { account: 'Equity', side: 'liability', amount: 300000 },
          ],
        },
      ],
      options: [
        {
          id: 'bank-loan-up',
          shift: { entityId: 'bank', side: 'asset', account: 'Mortgage loans', delta: 240000 },
        },
        {
          id: 'bank-deposits-up',
          shift: {
            entityId: 'bank',
            side: 'liability',
            account: 'Customer deposits',
            delta: 240000,
          },
        },
        {
          id: 'buyer-flat-up',
          shift: { entityId: 'buyer', side: 'asset', account: 'The flat', delta: 300000 },
        },
        {
          id: 'buyer-deposit-down',
          shift: {
            entityId: 'buyer',
            side: 'asset',
            account: 'Deposit at the bank',
            delta: -60000,
          },
        },
        {
          id: 'buyer-mortgage-up',
          shift: { entityId: 'buyer', side: 'liability', account: 'Mortgage', delta: 240000 },
        },
        {
          id: 'seller-flat-down',
          shift: { entityId: 'seller', side: 'asset', account: 'The flat', delta: -300000 },
        },
        {
          id: 'seller-deposit-up',
          shift: {
            entityId: 'seller',
            side: 'asset',
            account: 'Deposit at the bank',
            delta: 300000,
          },
        },
        {
          id: 'bank-reserves-down',
          shift: {
            entityId: 'bank',
            side: 'asset',
            account: 'Reserves at the central bank',
            delta: -240000,
          },
          feedback:
            'The reflex again: the bank must already have had the money. It did not — it wrote a loan on one side and a deposit on the other, and both are new. That is precisely why a housing market can absorb far more money than anybody had saved.',
        },
        {
          id: 'buyer-equity-up',
          shift: { entityId: 'buyer', side: 'liability', account: 'Equity', delta: 240000 },
          feedback:
            'Borrowing does not make the buyer richer. They hold a €300,000 flat against a €240,000 debt and a €60,000 deposit they no longer have — their stake is exactly the €60,000 it was this morning.',
        },
      ],
      expectedShifts: [
        { entityId: 'bank', side: 'asset', account: 'Mortgage loans', delta: 240000 },
        {
          entityId: 'bank',
          side: 'liability',
          account: 'Customer deposits',
          delta: 240000,
        },
        { entityId: 'buyer', side: 'asset', account: 'The flat', delta: 300000 },
        {
          entityId: 'buyer',
          side: 'asset',
          account: 'Deposit at the bank',
          delta: -60000,
        },
        { entityId: 'buyer', side: 'liability', account: 'Mortgage', delta: 240000 },
        { entityId: 'seller', side: 'asset', account: 'The flat', delta: -300000 },
        {
          entityId: 'seller',
          side: 'asset',
          account: 'Deposit at the bank',
          delta: 300000,
        },
      ],
      aggregateEffects: [
        {
          aggregate: 'M2',
          direction: 'expand',
          note: '€240,000 of deposit money exists that did not exist this morning. It was created to buy this flat.',
        },
        {
          aggregate: 'M0',
          direction: 'unchanged',
          note: 'No central bank money was used. The mortgage did not need any.',
        },
        {
          aggregate: 'collateral',
          direction: 'expand',
          note: 'The flat now secures a loan. The asset backs the money that was created to buy it.',
        },
      ],
      explanation:
        'This is the engine of the whole module. The €240,000 was not saved by anyone and did not come out of anybody else’s account — it was created by the loan, and it went straight into the price of one flat. Multiply by every transaction in a market where nothing new can be built, and you have an asset price rising because money is being manufactured at the point of sale, in an amount set by what the bank will lend rather than by what anyone had.',
    },

    {
      id: 'flow-cantillon',
      type: 'order_flow',
      tags: ['cantillon', 'money-creation', 'distribution'],
      xp: 25,
      prompt: 'Put the order of arrival right: who touches new money first?',
      instructions: 'Earliest first',
      events: [
        {
          id: 'credit',
          label: 'Credit conditions loosen — rates fall or lending standards ease',
          detail: 'Nothing has been spent yet',
        },
        {
          id: 'borrowers',
          label: 'Those with collateral and income borrow',
          detail: 'You need an asset or a salary to get a mortgage at all',
        },
        {
          id: 'assets',
          label: 'The money is spent on assets, at yesterday’s prices',
          detail: 'The first buyers transact before the market has repriced',
        },
        {
          id: 'reprice',
          label: 'Asset prices rise as the new money competes for a fixed stock',
          detail: 'The next buyer pays more for the same flat',
        },
        {
          id: 'wages',
          label: 'Wages and consumer prices follow, years later and by less',
          detail: 'Whoever holds only a salary is last in the queue',
        },
      ],
      correctOrder: ['credit', 'borrowers', 'assets', 'reprice', 'wages'],
      explanation:
        'Richard Cantillon described this in the 1730s and it has never needed revising: new money enters at a point, and whoever is near that point transacts at prices set before it arrived. The order of arrival is the distribution. It is not a conspiracy and nobody decides it — it falls out of the fact that credit is extended against collateral, so having assets is the qualification for receiving the money that bids assets up.',
    },

    {
      id: 'match-queue',
      type: 'concept_match',
      tags: ['cantillon', 'distribution', 'property'],
      xp: 25,
      prompt: 'Match each position in the queue to what the decade did to it.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'owner',
          term: 'Someone who already owned',
          definition:
            'Collateral rose, debt shrank in real terms, and they could borrow against the difference',
        },
        {
          id: 'buyer',
          term: 'Someone buying their first home',
          definition:
            'Needs a larger multiple of a salary that rose 32% for an asset that rose 60%',
        },
        {
          id: 'saver',
          term: 'Someone saving a deposit in euros',
          definition:
            'Chasing a target that moved away faster than the savings grew',
        },
        {
          id: 'renter',
          term: 'Someone renting indefinitely',
          definition:
            'Pays the yield on an asset whose price they had no way to lock in',
        },
      ],
      explanation:
        'The cruellest row is the third. A saver doing exactly what they are told — spending less than they earn, keeping it safe, waiting — was moving toward a target receding faster than they could approach it. Every year of prudence made the flat less affordable, which is a strange thing for an economy to do to the people obeying its advice, and it is a mechanical consequence of holding the nominal claim rather than the real asset.',
    },

    {
      id: 'mc-rates-channel',
      type: 'multiple_choice',
      tags: ['rates', 'property', 'valuation'],
      xp: 20,
      prompt:
        'The deposit facility rate went from −0.5% to 2.25% over this period. Why did house prices not collapse when rates rose?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'stock-not-flow',
          label: 'Rates set what new buyers can borrow; they do not force existing owners to sell',
        },
        {
          id: 'no-effect',
          label: 'Interest rates do not affect house prices',
          feedback:
            'They very much do, through the size of the loan a given income supports. What they do not do is create sellers, and a price needs both sides.',
        },
        {
          id: 'inflation-offset',
          label: 'Inflation offset the rate rise exactly',
        },
        {
          id: 'foreign',
          label: 'Foreign cash buyers replaced mortgage buyers entirely',
          feedback:
            'They matter at the margin in some cities, Lisbon included. But the pattern of prices holding through rate rises is far too widespread to be explained by one buyer type.',
        },
      ],
      correctOptionId: 'stock-not-flow',
      explanation:
        'This is where housing differs from every financial asset in the course. A bond reprices instantly because holders can sell in seconds and the price is quoted continuously. A house transacts when its owner chooses, and an owner on a fixed-rate mortgage with a job has no reason to choose. Higher rates therefore reduce transactions long before they reduce prices — the market clears by going quiet, not by falling.',
    },
  ],
  keyTakeaways: [
    'Most of the money bidding on housing is created by the mortgage at the moment of sale.',
    'New money arrives at a point, and whoever is near it transacts at prices set before it arrived.',
    'Having collateral is the qualification for receiving the money that bids collateral up.',
    'Rate rises cut transactions before they cut prices, because higher rates do not create sellers.',
  ],
});
