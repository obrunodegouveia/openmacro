/**
 * ============================================================================
 * Module 2 · Lesson 4 — "Paying across a border, with no shared central bank"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to explain that a cross-border payment has no
 * settlement tier to fall back on, and that correspondent banking solves this
 * by reintroducing exactly the credit exposure domestic settlement removes.
 *
 * Sources / further reading for reviewers:
 *   - BIS CPMI, "Correspondent banking" (2016) and the de-risking follow-ups.
 *   - Financial Stability Board reports on the decline in correspondent
 *     relationships.
 *
 * A note on rigour: SWIFT is a messaging network, not a payment system. It
 * carries instructions; the money moves through accounts banks hold with each
 * other. Learners routinely believe money "travels over SWIFT", and the lesson
 * exists partly to kill that idea.
 */

import { defineLesson } from '../../schema';

export const correspondentBankingLesson = defineLesson({
  id: 'correspondent-banking',
  title: 'Paying Across a Border',
  subtitle: 'No shared central bank, no settlement tier — so banks hold accounts with each other.',
  icon: '🌐',
  difficulty: 'core',
  estimatedMinutes: 7,
  hearts: 3,

  keyTakeaways: [
    'There is no global central bank, so cross-border payments settle in accounts banks hold with one another.',
    'A nostro is your account at them; a vostro is their account at you. Same account, two viewpoints.',
    'This reintroduces credit risk that domestic settlement had removed — you are holding a claim on a foreign bank.',
    'SWIFT moves the instruction, not the money.',
  ],

  challenges: [
    {
      id: 'mc-swift-myth',
      type: 'multiple_choice',
      tags: ['cross-border', 'payments'],
      xp: 10,
      prompt: 'You send money abroad and the bank says it went "via SWIFT". What actually travelled?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'money',
          label: 'The money itself, over the SWIFT network',
          feedback:
            'SWIFT carries no funds. It is a secure messaging co-operative — closer to certified mail between banks than to a payment rail.',
        },
        {
          id: 'message',
          label: 'A message instructing banks to move balances they already hold with each other',
        },
        {
          id: 'gold',
          label: 'A claim settled later in gold',
          feedback:
            'Gold settlement between central banks ended decades ago. Cross-border payments settle in commercial bank balances or, for some currencies, in central bank money at the issuing central bank.',
        },
        {
          id: 'crypto',
          label: 'A tokenised representation of the funds',
          feedback:
            'Correspondent banking long predates tokenisation and still runs on plain double-entry bookkeeping between banks.',
        },
      ],
      correctOptionId: 'message',
      explanation:
        'This distinction matters more than it sounds. Because SWIFT only carries instructions, being cut off from it does not seize anyone’s money — it removes the standard way of telling banks what to do, which is disruptive but not confiscation. The funds sit in correspondent accounts throughout, and it is control over *those accounts* that determines whether a payment can be made at all.',
    },

    {
      id: 'match-correspondent-terms',
      type: 'concept_match',
      tags: ['cross-border', 'payments'],
      xp: 15,
      prompt: 'Match each term to what it means.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'nostro',
          term: 'Nostro account',
          definition: 'Our account, held at a bank abroad, in their currency',
        },
        {
          id: 'vostro',
          term: 'Vostro account',
          definition: 'Their account, held with us, in our currency',
        },
        {
          id: 'correspondent',
          term: 'Correspondent bank',
          definition: 'A foreign bank that makes and receives payments on your behalf',
        },
        {
          id: 'derisking',
          term: 'De-risking',
          definition: 'Closing whole categories of relationship because compliance costs exceed the revenue',
        },
        {
          id: 'pvp',
          term: 'Payment versus payment',
          definition: 'Both currency legs settle together, or neither does',
        },
      ],
      explanation:
        'Nostro and vostro describe one account from the two sides of it — the pair exists because each bank records the same balance on opposite sides of its own books. De-risking is the modern consequence: since 2011 the number of correspondent relationships has fallen sharply, and small or poor countries have found themselves with fewer routes to the dollar system, not because of sanctions but because serving them stopped being worth the compliance cost.',
    },

    {
      id: 't-correspondent-payment',
      type: 't_account_flow',
      tags: ['cross-border', 'balance-sheets'],
      xp: 30,
      prompt: 'A Kenyan bank pays $1m to a US supplier. Post it through the correspondent.',
      instructions: 'Pick an entry, then choose whose sheet it lands on and which side',
      scenario:
        'The Kenyan bank holds a dollar nostro account at a US correspondent. It instructs the correspondent to pay the supplier’s bank. Four entries are needed — three of the seven do not belong.',
      currency: 'USD',
      entities: [
        {
          id: 'kenyan-bank',
          label: 'Kenyan Bank',
          tier: 'commercial_bank',
          role: 'Holds dollars abroad, not at home',
          openingLines: [
            { account: 'Nostro balance at US correspondent', side: 'asset', amount: 40e6 },
            { account: 'Customer deposits', side: 'liability', amount: 900e6 },
          ],
        },
        {
          id: 'correspondent',
          label: 'US Correspondent Bank',
          tier: 'commercial_bank',
          role: 'Holds the dollars and has reserves',
          openingLines: [
            { account: 'Reserves at the Fed', side: 'asset', amount: 3e9 },
            { account: 'Vostro owed to Kenyan Bank', side: 'liability', amount: 40e6 },
          ],
        },
      ],
      options: [
        {
          id: 'kenyan-nostro-down',
          shift: { entityId: 'kenyan-bank', side: 'asset', account: 'Nostro balance at US correspondent', delta: -1e6 },
        },
        {
          id: 'kenyan-deposits-down',
          shift: { entityId: 'kenyan-bank', side: 'liability', account: 'Customer deposits', delta: -1e6 },
        },
        {
          id: 'corr-vostro-down',
          shift: { entityId: 'correspondent', side: 'liability', account: 'Vostro owed to Kenyan Bank', delta: -1e6 },
        },
        {
          id: 'corr-reserves-down',
          shift: { entityId: 'correspondent', side: 'asset', account: 'Reserves at the Fed', delta: -1e6 },
        },
        {
          id: 'kenyan-reserves-down',
          shift: { entityId: 'kenyan-bank', side: 'asset', account: 'Reserves at the Fed', delta: -1e6 },
          feedback:
            'The Kenyan bank has no Fed account — that is the entire reason it needs a correspondent. It cannot hold dollars at the Fed.',
        },
        {
          id: 'corr-vostro-up',
          shift: { entityId: 'correspondent', side: 'liability', account: 'Vostro owed to Kenyan Bank', delta: 1e6 },
          feedback:
            'The correspondent now owes the Kenyan bank *less*, having paid on its behalf. This entry is for a dollar receipt.',
        },
        {
          id: 'kenyan-nostro-up',
          shift: { entityId: 'kenyan-bank', side: 'asset', account: 'Nostro balance at US correspondent', delta: 1e6 },
          feedback: 'The nostro is being spent down, not topped up.',
        },
      ],
      expectedShifts: [
        { entityId: 'kenyan-bank', side: 'asset', account: 'Nostro balance at US correspondent', delta: -1e6 },
        { entityId: 'kenyan-bank', side: 'liability', account: 'Customer deposits', delta: -1e6 },
        { entityId: 'correspondent', side: 'liability', account: 'Vostro owed to Kenyan Bank', delta: -1e6 },
        { entityId: 'correspondent', side: 'asset', account: 'Reserves at the Fed', delta: -1e6 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M0',
          direction: 'unchanged',
          note: 'Reserves left the correspondent and arrived at the supplier’s bank. The Fed’s total liability is the same.',
        },
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'A Kenyan deposit was extinguished and a US one created. The dollar money supply gained what Kenya’s dollar claims lost.',
        },
      ],
      explanation:
        'Follow the tiers. The Kenyan bank cannot touch Fed reserves, so it spends a claim on its correspondent instead — and the correspondent, which *does* have a Fed account, makes the real settlement. The Kenyan bank was never holding dollars in the sense of central bank money; it was holding a promise from an American bank. That is the exposure domestic settlement is designed to eliminate and cross-border payment cannot avoid.',
    },

    {
      id: 'mc-correspondent-risk',
      type: 'multiple_choice',
      tags: ['cross-border', 'risk'],
      xp: 15,
      prompt: 'The US correspondent fails overnight. What happens to the Kenyan bank’s $39m nostro balance?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'safe-fed',
          label: 'It is safe — the money is at the Fed',
          feedback:
            'It is not at the Fed. It is a claim on the correspondent, which happens to hold reserves at the Fed. Those reserves belong to the correspondent, not to its account holders.',
        },
        {
          id: 'creditor',
          label: 'The Kenyan bank joins the queue of creditors, like any other',
        },
        {
          id: 'insured',
          label: 'Deposit insurance covers it',
          feedback:
            'Deposit insurance caps are designed for households and are irrelevant at $39m. Correspondent balances are effectively uninsured.',
        },
        {
          id: 'central-bank',
          label: 'The Kenyan central bank makes it whole',
          feedback:
            'It has no obligation to, and could not do so in dollars in any case — a central bank can only create its own currency.',
        },
      ],
      correctOptionId: 'creditor',
      explanation:
        'This is the price of having no shared settlement asset. Domestically, a bank holding reserves cannot lose them to another bank’s failure, because reserves are a claim on the central bank. Internationally there is no such refuge: dollars held abroad are always somebody’s liability. It is why access to a correspondent is a strategic asset for a country’s banks, and why losing it — through failure, sanctions or de-risking — cuts a banking system off from a currency far more effectively than any rule about messaging.',
    },
  ],
});
