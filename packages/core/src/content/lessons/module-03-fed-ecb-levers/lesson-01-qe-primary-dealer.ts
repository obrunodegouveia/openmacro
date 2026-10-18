import { defineLesson } from '../../schema';

/**
 * Tier 1 -> Tier 2: how a central bank asset purchase lands on two balance
 * sheets at once.
 *
 * This is the lesson the whole platform is built around. Everything else —
 * the corridor, the floor, the swap lines — is a variation on the mechanism
 * the learner posts by hand here.
 *
 * Figures are in whole dollars so the T-account maths stays exact.
 */
export const qePrimaryDealerLesson = defineLesson({
  id: 'qe-primary-dealer',
  title: 'Quantitative Easing, Posted by Hand',
  subtitle: 'Follow $10B of asset purchases across the Fed and a dealer bank.',
  icon: '🏛️',
  difficulty: 'core',
  estimatedMinutes: 6,
  challenges: [
    {
      id: 'qe-who-pays',
      type: 'multiple_choice',
      prompt:
        'The Fed buys $10B of Treasuries from a primary dealer. What does it pay with?',
      explanation:
        'The Fed pays by crediting the reserve account of the dealer’s bank. Those reserves did not exist beforehand — the Fed issues its own liability to settle, which is exactly what "creating money" means at Tier 1.',
      options: [
        {
          id: 'tax',
          label: 'Tax revenue held at the Treasury',
          feedback:
            'The Treasury’s cash account (the TGA) is a Fed liability, but no tax money moves in an open-market operation.',
        },
        {
          id: 'reserves',
          label: 'Newly created commercial bank reserves',
        },
        {
          id: 'banknotes',
          label: 'Physical banknotes shipped to the dealer',
          feedback:
            'Banknotes are a Fed liability too, but settlement between the Fed and a bank happens in reserves, not paper.',
        },
      ],
      correctOptionId: 'reserves',
      tags: ['central-banking', 'open-market-operations'],
    },
    {
      id: 'qe-post-the-entries',
      type: 't_account_flow',
      prompt: 'Post the $10B purchase across both balance sheets.',
      instructions:
        'Some entries are traps — place only the ones this trade really moves. Each sheet must balance.',
      scenario:
        'The Fed executes $10B of quantitative easing, buying Treasuries from a primary dealer. The dealer keeps its account at a commercial bank, so that is where the payment is credited.',
      explanation:
        'Both sheets grow by $10B. The Fed gains $10B of Treasuries (an asset) and pays for them with $10B of new reserves (a liability). The dealer’s bank receives those reserves (an asset) and credits the dealer’s deposit (a liability). Off screen, the dealer’s own sheet swaps assets: Treasuries −$10B, deposit +$10B. Base money and broad money both grow — but note the bank did not lend anything.',
      currency: 'USD',
      entities: [
        {
          id: 'fed',
          label: 'Federal Reserve',
          tier: 'central_bank',
          role: 'Issuer of the monetary base',
          openingLines: [
            { account: 'US Treasuries', side: 'asset', amount: 5_200_000_000_000 },
            { account: 'Bank reserves', side: 'liability', amount: 3_100_000_000_000 },
            { account: 'Banknotes in circulation', side: 'liability', amount: 2_100_000_000_000 },
          ],
        },
        {
          id: 'dealer-bank',
          label: 'Dealer’s Commercial Bank',
          tier: 'commercial_bank',
          role: 'Holds the dealer’s deposit account',
          openingLines: [
            { account: 'Reserves at the Fed', side: 'asset', amount: 80_000_000_000 },
            { account: 'Loans and other assets', side: 'asset', amount: 560_000_000_000 },
            { account: 'Customer deposits', side: 'liability', amount: 640_000_000_000 },
          ],
        },
      ],
      options: [
        {
          id: 'fed-asset-treasuries',
          shift: { entityId: 'fed', side: 'asset', account: 'US Treasuries', delta: 10_000_000_000 },
        },
        {
          id: 'fed-liability-reserves',
          shift: {
            entityId: 'fed',
            side: 'liability',
            account: 'Bank reserves',
            delta: 10_000_000_000,
          },
        },
        {
          id: 'bank-asset-reserves',
          shift: {
            entityId: 'dealer-bank',
            side: 'asset',
            account: 'Reserves at the Fed',
            delta: 10_000_000_000,
          },
        },
        {
          id: 'bank-liability-deposit',
          shift: {
            entityId: 'dealer-bank',
            side: 'liability',
            account: 'Customer deposits',
            delta: 10_000_000_000,
          },
        },
        {
          id: 'fed-liability-banknotes',
          shift: {
            entityId: 'fed',
            side: 'liability',
            account: 'Banknotes in circulation',
            delta: 10_000_000_000,
          },
          feedback:
            'No new paper was printed. Settlement happens in reserves — banknotes only change when the public asks for cash.',
        },
        {
          id: 'bank-asset-treasuries',
          shift: {
            entityId: 'dealer-bank',
            side: 'asset',
            account: 'US Treasuries',
            delta: 10_000_000_000,
          },
          feedback:
            'The bank never owned these bonds. The dealer sold them, and the bank only cleared the payment.',
        },
        {
          id: 'fed-asset-reserves',
          shift: {
            entityId: 'fed',
            side: 'asset',
            account: 'Bank reserves',
            delta: 10_000_000_000,
          },
          feedback:
            'Reserves are something the Fed owes, not something it owns. They belong on the liability side.',
        },
      ],
      expectedShifts: [
        { entityId: 'fed', side: 'asset', account: 'US Treasuries', delta: 10_000_000_000 },
        {
          entityId: 'fed',
          side: 'liability',
          account: 'Bank reserves',
          delta: 10_000_000_000,
        },
        {
          entityId: 'dealer-bank',
          side: 'asset',
          account: 'Reserves at the Fed',
          delta: 10_000_000_000,
        },
        {
          entityId: 'dealer-bank',
          side: 'liability',
          account: 'Customer deposits',
          delta: 10_000_000_000,
        },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'expand',
          note: 'Reserves are part of the monetary base, and $10B of them now exist that did not before.',
        },
        {
          aggregate: 'M2',
          direction: 'expand',
          note: 'The dealer’s deposit is broad money. QE swapped Treasuries the dealer held for a deposit it can spend.',
        },
        {
          aggregate: 'collateral',
          direction: 'contract',
          note: 'Those Treasuries left the market. There are now fewer of them — the safest collateral there is — available for repo and for dealers’ balance sheets.',
        },
      ],
      xp: 25,
      tags: ['central-banking', 'quantitative-easing', 't-accounts'],
    },
  ],
  keyTakeaways: [
    'A central bank pays for assets by issuing its own liability.',
    'QE swaps an asset for a deposit — it does not force banks to lend.',
    'Every operation is two entries on two sheets, and both must balance.',
  ],
});
