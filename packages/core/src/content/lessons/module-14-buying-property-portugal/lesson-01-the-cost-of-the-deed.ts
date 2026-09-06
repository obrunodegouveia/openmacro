import { defineLesson } from '../../schema';

/**
 * IMT for a permanent primary residence, Continente, 2026 (Ofício Circulado
 * n.º 40129/2026):
 *
 *   up to 106,346      0%
 *   106,346–145,470    2%, less 2,126.92
 *   145,470–198,347    5%, less 6,491.02
 *   198,347–330,539    7%, less 10,457.96
 *   330,539–660,982    8%, less 13,763.35
 *   660,982–1,150,853  6% flat
 *   above 1,150,853    7.5% flat
 *
 * Buyers under 35 purchasing a first permanent home are exempt from IMT and
 * stamp duty up to €330,539, with partial relief to €660,982.
 */
export const theCostOfTheDeedLesson = defineLesson({
  id: 'the-cost-of-the-deed',
  title: 'What the Keys Cost Before You Own Anything',
  subtitle:
    'IMT, stamp duty and the deed. On a €300,000 flat that is €13,942 you never see again.',
  icon: '🔑',
  difficulty: 'core',
  estimatedMinutes: 9,
  challenges: [
    {
      id: 'mc-imt-bracket',
      type: 'multiple_choice',
      tags: ['portugal', 'imt', 'tax'],
      xp: 25,
      prompt:
        'A €300,000 permanent home falls in the 198,347–330,539 band: 7%, less a deduction of €10,457.96. What is the IMT?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'correct',
          label: '€10,542 — 7% of the whole price, minus the deduction',
        },
        {
          id: 'marginal-only',
          label: '€7,116 — 7% of only the amount above €198,347',
          feedback:
            'That is how income tax brackets work, and it is not how IMT works. The rate applies to the entire price and the deduction is what stops the jump at each threshold being brutal. The deduction is doing the job the lower bands would have done.',
        },
        {
          id: 'flat',
          label: '€21,000 — 7% of the price',
          feedback:
            'That is the first half of the calculation. Forgetting the deduction overstates the bill by exactly €10,457.96 at any price in this band.',
        },
        {
          id: 'zero',
          label: 'Nothing, since it is a permanent residence',
          feedback:
            'The exemption for a permanent residence runs only to €106,346. Above that you pay, and the "own permanent home" table is merely cheaper than the one for second homes.',
        },
      ],
      correctOptionId: 'correct',
      explanation:
        '300,000 × 0.07 − 10,457.96 = €10,542.04. Worth doing once by hand, because the structure is unusual: the rate hits the whole price and the deduction is what makes the schedule continuous. It also means a small price increase that crosses a threshold can cost far more than the increase itself.',
    },
    {
      id: 'match-entry-costs',
      type: 'concept_match',
      tags: ['portugal', 'purchase', 'costs'],
      xp: 25,
      prompt: 'Match each line of a Portuguese purchase to what it is.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'imt',
          term: 'IMT',
          definition:
            'Transfer tax, progressive with a deduction — €10,542 on a €300,000 permanent home',
        },
        {
          id: 'selo',
          term: 'Imposto do Selo',
          definition:
            'Stamp duty at 0.8% of the price, with no bands and no exemption — €2,400',
        },
        {
          id: 'deed',
          term: 'Escritura and registration',
          definition:
            'Notary and land registry, roughly €1,000 and largely independent of the price',
        },
        {
          id: 'jovem',
          term: 'IMT Jovem',
          definition:
            'Full exemption from IMT and stamp duty under 35 on a first permanent home to €330,539',
        },
      ],
      explanation:
        'Add the first three and a €300,000 purchase costs €13,942 before anyone has slept in it — 4.65% of the price, gone. The fourth line is worth knowing precisely because it is worth about €13,000 to a buyer who qualifies, which is more than most people will negotiate off the asking price.',
    },
    {
      id: 'mc-threshold-cliff',
      type: 'multiple_choice',
      tags: ['portugal', 'imt', 'negotiation'],
      xp: 25,
      prompt:
        'You are 32, buying your first permanent home, and negotiating between €330,000 and €335,000. What is the difference actually worth?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'exemption-cliff',
          label: 'Far more than €5,000 — €330,539 is where the young-buyer exemption stops being full',
        },
        {
          id: 'five-thousand',
          label: '€5,000, plus a little IMT',
          feedback:
            'That is the answer if you ignore where the thresholds fall. Here the price is sitting exactly on the line that decides whether the exemption is full or partial.',
        },
        {
          id: 'nothing',
          label: 'Nothing, since you are exempt either way',
          feedback:
            'The full exemption runs to €330,539. Above it the relief becomes partial, tapering out entirely at €660,982.',
        },
        {
          id: 'tax-deductible',
          label: 'Less than €5,000, because the tax is deductible',
        },
      ],
      correctOptionId: 'exemption-cliff',
      explanation:
        'Thresholds are where the money is. Every one of these tables has edges — €106,346, €330,539, €660,982 — and a price sitting just above one costs materially more than the same property just below it. It is the single most valuable thing to check before agreeing a number, and it takes about a minute.',
    },
    {
      id: 'mc-selling-side',
      type: 'multiple_choice',
      tags: ['portugal', 'selling', 'costs'],
      xp: 25,
      prompt:
        'Entry costs are 4.65%. What does it cost to get out again, on a typical sale through an agency?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'commission-vat',
          label: 'About 6.15% of the sale price — a 5% commission plus 23% VAT on it',
        },
        {
          id: 'five',
          label: '5% — the commission',
          feedback:
            'The commission is subject to VAT at 23%, so the invoice is 6.15%. It is a common omission and it is worth about €3,700 on a €300,000 sale.',
        },
        {
          id: 'nothing',
          label: 'Nothing — the buyer pays the taxes',
          feedback:
            'The buyer pays IMT and stamp duty. The seller pays the agency, and may pay capital gains tax on top.',
        },
        {
          id: 'imt-again',
          label: 'IMT again, this time on the sale price',
        },
      ],
      correctOptionId: 'commission-vat',
      explanation:
        'That is the number the whole module turns on. Buying and selling the same flat costs roughly 11% of its value in transaction costs alone — 4.65% in and 6.15% out — before a single year of ownership, before maintenance, and before tax on any gain. Everything that follows is about how long it takes appreciation to earn that back.',
    },
  ],
  keyTakeaways: [
    'IMT applies its rate to the whole price and subtracts a deduction: €10,542 on a €300,000 permanent home.',
    'Add 0.8% stamp duty and the deed, and entry costs are €13,942 — 4.65% of the price.',
    'Under 35 buying a first permanent home, IMT and stamp duty are waived to €330,539.',
    'Selling costs about 6.15%, so the round trip is roughly 11% before you have owned it for a day.',
  ],
});
