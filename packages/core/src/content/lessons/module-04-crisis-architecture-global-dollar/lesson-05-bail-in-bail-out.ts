/**
 * ============================================================================
 * Module 4 · Lesson 4 — "Who pays when a bank fails"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to order the creditor hierarchy, explain what a
 * bail-in converts and why, and describe the moral hazard problem that
 * resolution regimes were built to address.
 *
 * Sources / further reading for reviewers:
 *   - Financial Stability Board, "Key Attributes of Effective Resolution
 *     Regimes"; the EU Bank Recovery and Resolution Directive.
 *   - Credit Suisse / UBS, March 2023 — where AT1 holders were written down
 *     while shareholders received something, inverting the expected order.
 *
 * A note on rigour: the hierarchy is a legal construct and jurisdictions
 * differ. The Credit Suisse case is included precisely because it departed
 * from the expected order, which is the honest way to teach that these rules
 * are political as well as legal.
 */

import { defineLesson } from '../../schema';

export const bailInBailOutLesson = defineLesson({
  id: 'bail-in-bail-out',
  title: 'Who Pays When a Bank Fails',
  subtitle: 'Shareholders first, then bondholders, then — if the rules hold — nobody else.',
  icon: '⚰️',
  difficulty: 'advanced',
  estimatedMinutes: 8,
  hearts: 3,

  keyTakeaways: [
    'A bail-out puts taxpayers behind the losses. A bail-in puts the bank’s own creditors there.',
    'The hierarchy is: shareholders, then junior debt, then senior debt, with insured deposits protected.',
    'Bail-in debt exists to be converted into equity — that is the job it is issued to do.',
    'The order is legal, not physical, and it has been departed from when authorities judged the alternative worse.',
  ],

  challenges: [
    {
      id: 'order-creditor-hierarchy',
      type: 'order_flow',
      tags: ['resolution', 'hierarchy'],
      xp: 25,
      prompt: 'A bank fails. Who absorbs the loss, and in what order?',
      instructions: 'First to lose at the top',
      events: [
        {
          id: 'equity',
          label: 'Shareholders',
          detail: 'They own the upside, so they take the downside first',
        },
        {
          id: 'at1',
          label: 'Additional tier 1 holders',
          detail: 'Bonds designed to convert or be written off under stress',
        },
        {
          id: 'junior',
          label: 'Subordinated bondholders',
          detail: 'Paid only after senior creditors, and priced for it',
        },
        {
          id: 'senior',
          label: 'Senior unsecured bondholders',
          detail: 'Traditionally assumed safe, no longer',
        },
        {
          id: 'uninsured',
          label: 'Uninsured depositors',
          detail: 'Balances above the guarantee limit',
        },
        {
          id: 'insured',
          label: 'Insured depositors — protected, and paid by the guarantee scheme',
          detail: 'In principle they never lose',
        },
      ],
      correctOrder: ['equity', 'at1', 'junior', 'senior', 'uninsured', 'insured'],
      explanation:
        'Each layer is compensated in advance for its position: shareholders get the profits, junior debt pays a higher coupon than senior, and insured deposits earn least of all because they carry no risk. The hierarchy is not a moral ranking, it is a price. Break it and you have not just moved a loss — you have made every future issue of that instrument more expensive, because nobody knows what they are buying.',
    },

    {
      id: 'mc-what-bail-in-does',
      type: 'multiple_choice',
      tags: ['resolution', 'bail-in'],
      xp: 15,
      prompt: 'A bail-in converts €5bn of bonds into equity. What has changed?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'cash-in',
          label: 'The bank received €5bn of new cash',
          feedback:
            'No money entered. A liability became equity — the left-hand side of the balance sheet is untouched.',
        },
        {
          id: 'liability-to-equity',
          label: 'A €5bn liability became €5bn of equity, so the bank is solvent again without any new money',
        },
        {
          id: 'debt-forgiven',
          label: 'The debt was simply cancelled',
          feedback:
            'Close, but the holders are not left with nothing — they receive shares. Whether those shares are worth anything is another question.',
        },
        {
          id: 'government',
          label: 'The government now owns the bank',
          feedback:
            'That is a bail-out. The point of a bail-in is that the former bondholders become the owners, not the state.',
        },
      ],
      correctOptionId: 'liability-to-equity',
      explanation:
        'This is why bail-in works without cash. A bank is insolvent when liabilities exceed assets; converting €5bn of liabilities into equity closes the gap by shrinking what is owed. The bondholders become shareholders of a recapitalised bank — usually worth far less than their bonds, which is the loss they signed up for. Depositors and the payment system carry on uninterrupted, which is the entire objective.',
    },

    {
      id: 't-bail-in',
      type: 't_account_flow',
      tags: ['resolution', 'balance-sheets'],
      xp: 30,
      prompt: 'Losses have wiped out equity. Post a €5bn bail-in.',
      instructions: 'Pick an entry, then choose whose sheet it lands on and which side',
      scenario:
        'The bank’s equity is gone and it is €2bn short. The resolution authority converts €5bn of junior bonds into equity. Four entries are needed — three of the seven do not belong.',
      currency: 'EUR',
      entities: [
        {
          id: 'bank',
          label: 'The Failing Bank',
          tier: 'commercial_bank',
          role: 'Being resolved over a weekend',
          openingLines: [
            { account: 'Loans and securities', side: 'asset', amount: 98e9 },
            { account: 'Customer deposits', side: 'liability', amount: 95e9 },
            { account: 'Junior bonds', side: 'liability', amount: 5e9 },
            { account: 'Shareholders’ equity', side: 'liability', amount: -2e9 },
          ],
        },
        {
          id: 'bondholders',
          label: 'Junior Bondholders',
          tier: 'shadow_bank',
          role: 'About to become shareholders',
          openingLines: [{ account: 'Bank junior bonds', side: 'asset', amount: 5e9 }],
        },
      ],
      options: [
        {
          id: 'bank-bonds-down',
          shift: { entityId: 'bank', side: 'liability', account: 'Junior bonds', delta: -5e9 },
        },
        {
          id: 'bank-equity-up',
          shift: { entityId: 'bank', side: 'liability', account: 'Shareholders’ equity', delta: 5e9 },
        },
        {
          id: 'holders-bonds-down',
          shift: { entityId: 'bondholders', side: 'asset', account: 'Bank junior bonds', delta: -5e9 },
        },
        {
          id: 'holders-shares-up',
          shift: { entityId: 'bondholders', side: 'asset', account: 'Bank shares', delta: 5e9 },
        },
        {
          id: 'bank-deposits-down',
          shift: { entityId: 'bank', side: 'liability', account: 'Customer deposits', delta: -5e9 },
          feedback:
            'Depositors are untouched — protecting them is the whole point of resolving the bank this way rather than liquidating it.',
        },
        {
          id: 'bank-assets-up',
          shift: { entityId: 'bank', side: 'asset', account: 'Loans and securities', delta: 5e9 },
          feedback:
            'No new assets arrived. A bail-in restructures the right-hand side of the balance sheet only.',
        },
        {
          id: 'bank-assets-down',
          shift: { entityId: 'bank', side: 'asset', account: 'Loans and securities', delta: -5e9 },
          feedback:
            'The losses that destroyed equity were already recognised. The bail-in is the repair, not the damage.',
        },
      ],
      expectedShifts: [
        { entityId: 'bank', side: 'liability', account: 'Junior bonds', delta: -5e9 },
        { entityId: 'bank', side: 'liability', account: 'Shareholders’ equity', delta: 5e9 },
        { entityId: 'bondholders', side: 'asset', account: 'Bank junior bonds', delta: -5e9 },
        { entityId: 'bondholders', side: 'asset', account: 'Bank shares', delta: 5e9 },
      ],
      aggregateEffects: [
        {
          aggregate: 'M2',
          direction: 'unchanged',
          note: 'Not a cent of deposits moved. The payment system carried on through the weekend, which is the measure of success.',
        },
        {
          aggregate: 'collateral',
          direction: 'unchanged',
          note: 'The bank’s assets are exactly as they were. Only the claims on them were rearranged.',
        },
      ],
      explanation:
        'Equity goes from −€2bn to €3bn and the bank is solvent on Monday morning, with no public money and no interruption to depositors. Note what did not happen: the asset side never moved. That is the elegance of the mechanism and also its limit — it repairs a balance sheet, but it cannot make bad loans good, and if the losses are larger than the bail-in-able debt the tool runs out.',
    },

    {
      id: 'mc-credit-suisse',
      type: 'multiple_choice',
      tags: ['resolution', 'credibility'],
      xp: 20,
      prompt: 'In 2023 Credit Suisse’s AT1 bonds were written to zero while shareholders received UBS stock. Why did that matter?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'illegal',
          label: 'It was illegal',
          feedback:
            'Swiss regulators had the authority, and the bond terms permitted it. Lawful and surprising are not exclusive.',
        },
        {
          id: 'inverted',
          label: 'It inverted the expected order, so the whole asset class had to be repriced',
        },
        {
          id: 'small',
          label: 'It was too small to matter',
          feedback:
            'About $17bn was written off, and the repricing hit a market of several hundred billion the following morning.',
        },
        {
          id: 'no-effect',
          label: 'Investors had always expected it',
          feedback:
            'They had not — AT1 spreads widened sharply across every issuer, which is the market saying it had been surprised.',
        },
      ],
      correctOptionId: 'inverted',
      explanation:
        'Everyone had assumed shareholders lose before bondholders, because that is the hierarchy. Getting nothing while shareholders got something told the market that the order was not reliable in every jurisdiction — so AT1 debt everywhere became riskier and dearer overnight. It is a reminder that these hierarchies are legal and political constructs, not laws of nature, and that a rule broken once is priced differently forever after.',
    },
  ],
});
