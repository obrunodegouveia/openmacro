import { defineLesson } from '../../schema';

/**
 * The other question, computed — with the mortgage in it.
 *
 * €300,000, 20% deposit, €240,000 over 30 years. At Euribor 12M of 2.954%
 * plus a 1% spread the payment is about €1,139 a month and the first five
 * years cost €45,279 in interest. Break-even against renting at 3%
 * appreciation: €1,100 rent and a 3.95% loan gives 4 years; €400 rent and a
 * 6% loan gives 23.
 */
export const rentOrBuyLesson = defineLesson({
  id: 'rent-or-buy',
  title: 'Now Put the Mortgage In',
  subtitle:
    'The previous lesson asked whether the flat covers its own costs. This one asks whether owning beats renting — and interest belongs here.',
  icon: '⚖️',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'mc-two-questions',
      type: 'multiple_choice',
      tags: ['portugal', 'rent-vs-buy', 'method'],
      xp: 30,
      prompt:
        'The break-even lesson excluded mortgage interest. Someone objects that this obviously understates the cost. Are they right?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'different-question',
          label: 'They are answering a different question — interest without rent avoided compares buying with a loan against living somewhere for free',
        },
        {
          id: 'yes-understates',
          label: 'Yes — interest is the largest cash cost and leaving it out flatters the purchase',
          feedback:
            'It is the largest cash cost, and adding it alone makes things worse than reality rather than better. Charging the mortgage without crediting the housing it bought is not a more conservative calculation, it is an incoherent one.',
        },
        {
          id: 'no-deductible',
          label: 'No, because interest is tax deductible',
        },
        {
          id: 'no-small',
          label: 'No, because interest is small next to the transaction costs',
          feedback:
            'Five years of interest on €240,000 at 3.95% is €45,279 — more than three times the entire cost of buying. It is not small.',
        },
      ],
      correctOptionId: 'different-question',
      explanation:
        'Charge the interest and credit nothing, and 3% growth turns a seven-year break-even into a twenty-five year one — a number that describes nobody’s situation, because everyone has to live somewhere. Charge the interest and credit the rent, and it comes back to about four years. The first calculation asks whether the asset pays for itself; this one asks whether owning beats the alternative you actually have.',
    },
    {
      id: 'sim-rent-or-buy',
      type: 'interactive_sim',
      tags: ['portugal', 'rent-vs-buy', 'mortgage'],
      xp: 40,
      currency: 'EUR',
      prompt: 'Owning against renting, with everything in.',
      instructions: 'Move the loan rate and the rent you would otherwise pay',
      narrative:
        'The same €300,000 flat, a 20% deposit and €240,000 over 30 years. Now the mortgage is in: every payment counts against you and every month of rent you did not pay counts for you. Appreciation is held at a deliberately modest 3% — not the decade’s 10.7% — so the answer does not rest on the boom continuing.',
      constants: {
        price: 300000,
        depositShare: 0.2,
        loanTerm: 30,
        entryCosts: 13942.04,
        carryAnnual: 4100,
        sellingRate: 0.0615,
        growth: 0.03,
        holdYears: 5,
      },
      sliders: [
        {
          key: 'loanRate',
          label: 'Your loan rate',
          min: 0.01,
          max: 0.07,
          step: 0.0025,
          defaultValue: 0.04,
          format: 'percent',
          hint: 'Euribor plus your spread. It was 0.5% in 2021 and 5.16% at the 2023 peak.',
        },
        {
          key: 'monthlyRent',
          label: 'Rent you would otherwise pay',
          min: 400,
          max: 1800,
          step: 50,
          defaultValue: 1100,
          format: 'currency',
          hint: 'The single most important number here, and the one people guess at.',
        },
      ],
      readouts: [
        {
          key: 'payment',
          label: 'Monthly mortgage payment',
          formulaId: 'home_loan_payment',
          format: 'currency',
          caption: '€240,000 over 30 years',
        },
        {
          key: 'breakeven',
          label: 'Years until owning is ahead of renting',
          formulaId: 'rent_vs_buy_breakeven',
          format: 'number',
          emphasis: true,
          caption: 'At 3% appreciation. Zero means never, inside forty years',
        },
        {
          key: 'netAt5',
          label: 'Where you stand after five years',
          formulaId: 'rent_vs_buy_net',
          format: 'currency',
          caption: 'Sale proceeds, less the debt, less everything paid in, plus the rent avoided',
        },
      ],
      objective: {
        description:
          'Try a €400 rent, then €1,100, and finish standing ahead after five years',
        requiredObservations: [{ sliderKey: 'monthlyRent', values: [400, 1100] }],
        target: {
          readoutKey: 'netAt5',
          comparator: 'gte',
          value: 0,
        },
      },
      explanation:
        'Two things fall out of this. The rent slider moves the answer more than the interest rate does — at a 4% loan, €400 rent means thirteen years and €1,500 rent means three, which is why "should I buy" is largely a question about what you are paying now. And at a modest 3% appreciation, owning still wins in a handful of years for anyone paying a normal rent, which is the opposite of what the previous lesson’s twenty-five year figure suggested. Same flat, same costs, different question.',
    },
    {
      id: 'flow-where-money-goes',
      type: 'order_flow',
      tags: ['portugal', 'mortgage', 'amortisation'],
      xp: 25,
      prompt:
        'Follow one €1,139 monthly payment in the first year. Put it in order of size.',
      instructions: 'Largest first',
      events: [
        {
          id: 'interest',
          label: 'Interest to the bank',
          detail: 'About €780 of the first payment — money that does not come back',
        },
        {
          id: 'principal',
          label: 'Principal repaid',
          detail: 'About €360 — this part is saving, not spending',
        },
        {
          id: 'maintenance',
          label: 'Maintenance set aside',
          detail: '€250 a month averaged, whether or not anything broke this month',
        },
        {
          id: 'imi',
          label: 'IMI',
          detail: '€50 a month, and the tax everybody complains about',
        },
      ],
      correctOrder: ['interest', 'principal', 'maintenance', 'imi'],
      explanation:
        'Only two of these four are genuinely gone. Principal repaid is savings — it comes back at sale, which is why counting the whole mortgage payment as a cost overstates the case badly in the later years, when the split reverses. Early on it is roughly two-thirds interest, and that is the honest cost of borrowing rather than paying cash.',
    },
    {
      id: 'mc-euribor-risk',
      type: 'multiple_choice',
      tags: ['portugal', 'euribor', 'risk'],
      xp: 30,
      prompt:
        'The calculation used a fixed 3.95% loan rate. What does a Euribor-linked mortgage do to that assumption?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'not-a-constant',
          label: 'Makes it a variable, and one that ranged from 0.5% to 5.16% within three years on the same contract',
        },
        {
          id: 'averages-out',
          label: 'Nothing much — it averages out over thirty years',
          feedback:
            'It might, over thirty years. The break-even is decided in the first five, when the balance is largest and the interest share of each payment is highest, and a bad five years is not averaged away by a good twenty-fifth.',
        },
        {
          id: 'fixed-better',
          label: 'Fixed rates are always better',
          feedback:
            'A fixed rate is priced to contain the expected path, exactly as the twelve-month tenor is. You pay for the certainty either way; whether it is worth it is a question about your household, not about rates.',
        },
        {
          id: 'irrelevant',
          label: 'Irrelevant, since rent also rises',
        },
      ],
      correctOptionId: 'not-a-constant',
      explanation:
        'On this loan the payment was about €1,013 at a 3% rate and €1,313 at the 2023 peak — €300 a month, on a contract nobody renegotiated. The rent side moves too, and usually more slowly and less far. So the honest version of the comparison is not one break-even year but a range, and the width of that range is set by Euribor, which is the module you have already done.',
    },
    {
      id: 'mc-what-decides',
      type: 'multiple_choice',
      tags: ['portugal', 'rent-vs-buy', 'conclusion'],
      xp: 30,
      prompt:
        'Across both calculations, which input changes the answer most?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'depends-question',
          label: 'Appreciation for whether the asset pays for itself; the rent you would otherwise pay for whether owning beats renting',
        },
        {
          id: 'imt',
          label: 'IMT, since it is the largest single upfront cost',
          feedback:
            'It is €10,542 on a €300,000 flat and it is paid once. The rent slider moves the break-even by a decade, which is worth far more than any one-off.',
        },
        {
          id: 'rate',
          label: 'The loan rate, in both',
          feedback:
            'It matters enormously in the second calculation and not at all in the first, which is the distinction the lesson exists to draw.',
        },
        {
          id: 'deposit',
          label: 'The size of the deposit',
        },
      ],
      correctOptionId: 'depends-question',
      explanation:
        'That is the whole module in one sentence. Which number dominates depends on which question you asked, and asking the wrong one carefully is worse than asking the right one roughly. If you are choosing between buying and continuing to rent, the number to get right is your rent. If you are asking whether a flat will have paid for itself by the time you want to sell, the number to get right is the growth rate — and there is no rate of rent that rescues you below the 1.37% carry.',
    },
  ],
  keyTakeaways: [
    'Interest belongs in the rent-versus-buy question and nowhere else — charging it without crediting rent compares buying against living for free.',
    'At 3% appreciation and a normal rent, owning is ahead within a handful of years even with the mortgage counted.',
    'The rent you would otherwise pay moves the answer more than the loan rate does.',
    'Only the interest is truly spent — principal repaid is saving, and it comes back at the sale.',
  ],
});
