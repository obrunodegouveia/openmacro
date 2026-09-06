import { defineLesson } from '../../schema';

/**
 * The other half of the argument. Debasement redistributes an existing claim
 * on output; capital formation is how the output itself grows. The two are
 * connected: a currency nobody will hold for thirty years cannot fund anything
 * that takes thirty years to build.
 */
export const capitalAndWhatItBuildsLesson = defineLesson({
  id: 'capital-and-what-it-builds',
  title: 'What Capital Is For',
  subtitle:
    'Saved money that gets built into something is the only thing that has ever raised output per person.',
  icon: '🏗️',
  difficulty: 'core',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-what-capital-is',
      type: 'multiple_choice',
      tags: ['capital', 'growth'],
      xp: 15,
      prompt:
        'A country wants its people to produce more per hour next decade than they do now. What actually delivers that?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'more-money',
          label: 'More money in circulation',
          feedback:
            'Money is a claim on output, not output. Doubling the claims without changing what is produced changes prices and nothing else — which is the first lesson in this module.',
        },
        {
          id: 'capital-and-knowledge',
          label: 'Tools, machines and knowledge that let the same hour produce more',
        },
        {
          id: 'longer-hours',
          label: 'People working longer hours',
          feedback:
            'That raises output, not output per hour, and it runs out quickly. Productivity is the only source of a rising standard of living that does not require working more.',
        },
        {
          id: 'more-workers',
          label: 'A larger workforce',
        },
      ],
      correctOptionId: 'capital-and-knowledge',
      explanation:
        'A person with a loom out-produces a person with needles; a person with a compiler out-produces a person with punch cards. Capital is deferred consumption turned into a tool — somebody chose not to consume, and the resources went into something that makes future work more productive. Every sustained rise in living standards in history runs through that sentence.',
    },

    {
      id: 'lend-for-a-machine',
      type: 't_account_flow',
      tags: ['capital', 'credit', 'investment'],
      xp: 30,
      prompt: 'A bank lends $10m to a firm to buy a machine. Post it.',
      instructions:
        'Two sheets. Notice what the bank did — and did not — have to have first.',
      scenario:
        'A manufacturer borrows $10m to install a production line that will let it make more per worker-hour. The bank writes the loan.',
      currency: 'USD',
      entities: [
        {
          id: 'bank',
          label: 'The Lending Bank',
          tier: 'commercial_bank',
          role: 'Writes both sides of the loan',
          openingLines: [
            { account: 'Loans', side: 'asset', amount: 500000000 },
            { account: 'Reserves at the Fed', side: 'asset', amount: 60000000 },
            { account: 'Customer deposits', side: 'liability', amount: 540000000 },
          ],
        },
        {
          id: 'firm',
          label: 'The Manufacturer',
          tier: 'fiduciary_core',
          role: 'Borrows to build',
          openingLines: [
            { account: 'Plant and equipment', side: 'asset', amount: 80000000 },
            { account: 'Deposit at the bank', side: 'asset', amount: 4000000 },
            { account: 'Equity', side: 'liability', amount: 84000000 },
          ],
        },
      ],
      options: [
        {
          id: 'bank-loan-up',
          shift: { entityId: 'bank', side: 'asset', account: 'Loans', delta: 10000000 },
        },
        {
          id: 'bank-deposit-up',
          shift: {
            entityId: 'bank',
            side: 'liability',
            account: 'Customer deposits',
            delta: 10000000,
          },
        },
        {
          id: 'firm-deposit-up',
          shift: {
            entityId: 'firm',
            side: 'asset',
            account: 'Deposit at the bank',
            delta: 10000000,
          },
        },
        {
          id: 'firm-loan-up',
          shift: {
            entityId: 'firm',
            side: 'liability',
            account: 'Bank loan',
            delta: 10000000,
          },
        },
        {
          id: 'bank-reserves-down',
          shift: {
            entityId: 'bank',
            side: 'asset',
            account: 'Reserves at the Fed',
            delta: -10000000,
          },
          feedback:
            'The reflex is that the bank must hand over something it already had. It does not: it writes a loan on one side and a deposit on the other, and both are new. Reserves only move later, if the firm pays a supplier who banks elsewhere.',
        },
        {
          id: 'firm-equity-up',
          shift: {
            entityId: 'firm',
            side: 'liability',
            account: 'Equity',
            delta: 10000000,
          },
          feedback:
            'Borrowing does not make the firm richer. It has $10m more of assets and $10m more of debt — the owners’ stake is exactly what it was this morning.',
        },
      ],
      expectedShifts: [
        { entityId: 'bank', side: 'asset', account: 'Loans', delta: 10000000 },
        {
          entityId: 'bank',
          side: 'liability',
          account: 'Customer deposits',
          delta: 10000000,
        },
        {
          entityId: 'firm',
          side: 'asset',
          account: 'Deposit at the bank',
          delta: 10000000,
        },
        { entityId: 'firm', side: 'liability', account: 'Bank loan', delta: 10000000 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M2',
          direction: 'expand',
          note: 'A new deposit exists that did not exist this morning. Bank lending is where most broad money comes from.',
        },
        {
          aggregate: 'M0',
          direction: 'unchanged',
          note: 'No reserves were used to write the loan. None were created either.',
        },
        {
          aggregate: 'collateral',
          direction: 'expand',
          note: 'A machine now stands behind the loan, and it will still be producing when the loan is repaid.',
        },
      ],
      explanation:
        'This posting is identical in form to a government borrowing $10m — new asset, new deposit, new money. What differs is entirely off the balance sheet: at the end of this one there is a production line, and the loan is repaid out of what it produces. That difference is not visible in the accounting, which is precisely why the accounting cannot settle the argument.',
    },

    {
      id: 'flow-capital-chain',
      type: 'order_flow',
      tags: ['capital', 'growth', 'innovation'],
      xp: 25,
      prompt: 'Put the chain from saving to a higher standard of living in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'defer',
          label: 'Someone consumes less than they earn',
          detail: 'Resources are freed that would otherwise have been eaten',
        },
        {
          id: 'allocate',
          label: 'The claim is lent or invested, and someone chooses where',
          detail: 'This step is where most of the value is added, and most of it destroyed',
        },
        {
          id: 'build',
          label: 'The resources become a tool, a factory or a discovery',
          detail: 'Deferred consumption becomes productive capacity',
        },
        {
          id: 'productivity',
          label: 'The same hour of work produces more',
          detail: 'Output per person rises — the only durable source of higher living standards',
        },
        {
          id: 'compound',
          label: 'The surplus funds the next round',
          detail: 'Compounding, in the direction that helps',
        },
      ],
      correctOrder: ['defer', 'allocate', 'build', 'productivity', 'compound'],
      explanation:
        'The second step is the one people skip, and it is where the disagreements actually live. Saving without good allocation produces empty apartment blocks and stranded factories; the Soviet Union had an enormous investment rate and very little to show for it. Capital is necessary for growth and nowhere near sufficient — what matters is whether whoever allocates it bears the loss when they are wrong.',
    },

    {
      id: 'mc-crowding-out',
      type: 'multiple_choice',
      tags: ['capital', 'debt', 'crowding-out'],
      xp: 25,
      prompt:
        'The government issues $1tn of bonds. Investors buy them out of savings that would otherwise have gone into corporate bonds and equity. What is the mechanism worth arguing about?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'crowding-out',
          label: 'Whether the projects those savings would have funded were worth more than what the government did with them',
        },
        {
          id: 'no-money-left',
          label: 'The economy has run out of money to lend',
          feedback:
            'It has not. Banks create deposits when they lend — you posted that two screens ago. The binding constraint is real resources and willing allocators, not a fixed pot of money.',
        },
        {
          id: 'always-bad',
          label: 'Government borrowing is always less productive than private borrowing',
          feedback:
            'That is the conclusion, not the mechanism, and it is doing a lot of work. Some public capital — basic research, a legal system, the interstates — has returns very few private projects match. Some private capital funds a third delivery app.',
        },
        {
          id: 'irrelevant',
          label: 'Nothing — the money is spent either way',
          feedback:
            'Both are spending, but they buy different things and leave different assets behind. A dollar of transfers is consumed; a dollar in a machine is still working in fifteen years.',
        },
      ],
      correctOptionId: 'crowding-out',
      explanation:
        'This is the honest form of the argument, and it is worth being precise about it. Crowding out is not "the government took the money" — it is that finite real resources and finite attention went one way rather than the other, and the two uses leave very different things behind. What makes the question hard is that it is a comparison against a counterfactual nobody gets to observe. What makes it answerable at the margin is asking, of any given dollar: is anything still standing in ten years, and did whoever chose bear the cost of being wrong?',
    },
  ],
  keyTakeaways: [
    'Money is a claim on output; capital is what raises the output being claimed.',
    'A loan for a machine and a loan for anything else are identical in the accounting — the difference is entirely in what is left afterwards.',
    'Allocation matters as much as saving: high investment with bad allocation buys very little.',
    'Crowding out is a real mechanism about real resources, and it is an argument about a counterfactual, which is why it stays an argument.',
  ],
});
