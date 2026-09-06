import { defineLesson } from '../../schema';

/**
 * The honest appendix. Everything the break-even calculation deliberately
 * excluded, and what each one does to the answer.
 */
export const whatItLeavesOutLesson = defineLesson({
  id: 'what-the-break-even-leaves-out',
  title: 'Four Things the Calculation Does Not Know',
  subtitle:
    'The arithmetic was honest about its own boundaries. Here is what sits outside them.',
  icon: '🧩',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'mc-capital-gains',
      type: 'multiple_choice',
      tags: ['portugal', 'mais-valias', 'tax'],
      xp: 30,
      prompt:
        'You sell at a €120,000 gain. For a Portuguese resident, half the gain is added to taxable income at your marginal IRS rate — unless what?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'reinvest',
          label: 'Unless the proceeds are reinvested in another permanent home, within the statutory window',
        },
        {
          id: 'held-long',
          label: 'Unless you held it for more than five years',
          feedback:
            'Portugal has no holding-period exemption for property. Time changes the size of the gain, not whether it is taxed.',
        },
        {
          id: 'no-tax',
          label: 'There is no capital gains tax on a permanent home',
          feedback:
            'The relief is conditional on reinvestment, not automatic. Sell and keep the cash, and half the gain is taxable.',
        },
        {
          id: 'flat',
          label: 'Unless you elect a flat 28% rate',
        },
      ],
      correctOptionId: 'reinvest',
      explanation:
        'This is the largest omission in the break-even, and it points the same way as everything else — it makes the true break-even later. It also has a strategic edge worth seeing: the relief attaches to reinvestment in another permanent home, so the tax system rewards moving from one home to another and taxes leaving the housing market. Anyone whose plan ends in cash should run the numbers again with the tax in.',
    },
    {
      id: 'mc-rent-comparison',
      type: 'multiple_choice',
      tags: ['portugal', 'rent', 'method'],
      xp: 30,
      prompt:
        'You would otherwise pay €1,100 a month in rent. How does that enter the decision?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'separate-question',
          label: 'As the comparator for the mortgage, in a separate calculation — not as a gain on the flat',
        },
        {
          id: 'add-to-gain',
          label: 'Add €13,200 a year to the gain on the property',
          feedback:
            'Tempting and it double-counts. Rent avoided is the return on living somewhere, and it is offset by the interest, the carry and the capital tied up. It belongs in the rent-versus-buy question, where all of those appear together.',
        },
        {
          id: 'irrelevant',
          label: 'It is irrelevant to a purchase decision',
        },
        {
          id: 'subtract',
          label: 'Subtract it from the carry cost',
        },
      ],
      correctOptionId: 'separate-question',
      explanation:
        'Two questions, kept apart, both answerable. "Does owning beat renting?" puts rent avoided against interest, carry and the return the deposit would have made elsewhere. "Does the price gain cover transacting and holding?" is the module’s question and is unaffected by rent. The mistake to avoid is adding rent avoided to capital appreciation, which counts the same benefit twice and makes almost any purchase look good.',
    },
    {
      id: 'match-omissions',
      type: 'concept_match',
      tags: ['portugal', 'property', 'limits'],
      xp: 30,
      prompt: 'Match each omission to which way it pushes the break-even.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'gains',
          term: 'Capital gains tax on exit',
          definition: 'Later — half the gain is taxable unless reinvested in another home',
        },
        {
          id: 'jovem',
          term: 'The IMT Jovem exemption',
          definition: 'Earlier — about €13,000 of entry costs simply removed for a qualifying buyer',
        },
        {
          id: 'illiquid',
          term: 'How long a sale takes',
          definition:
            'Later in practice — you cannot exit on the day the arithmetic says you are even',
        },
        {
          id: 'leverage',
          term: 'The mortgage',
          definition:
            'Neither — it changes the return on your cash, not the year the asset covers its own costs',
        },
      ],
      explanation:
        'Three of the four make the honest break-even later than the model says, and one makes it dramatically earlier. That asymmetry is worth carrying: a simple model of a property purchase almost always flatters it, because the omissions are mostly costs and frictions, and the one large omission in the buyer’s favour applies only to people under 35 buying their first home.',
    },
    {
      id: 'mc-desirable-assumption',
      type: 'multiple_choice',
      tags: ['portugal', 'property', 'risk'],
      xp: 30,
      prompt:
        'The whole calculation runs on an assumed appreciation rate. What is the strongest reason to doubt 10% continuing?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'income-limit',
          label: 'Prices tripled while incomes did not, so the buyer pool has to be replaced by someone whose income is not local',
        },
        {
          id: 'rates',
          label: 'Because interest rates might rise',
          feedback:
            'Rates rose from −0.5% to over 4% across 2022 and 2023 and Portuguese prices kept climbing. It is a real headwind and it has already been tested.',
        },
        {
          id: 'supply',
          label: 'Because new supply will arrive',
          feedback:
            'The supply lesson in the property module argues the opposite: in constrained cities the response is late, small and often blocked. Supply is the weakest of the reasons here.',
        },
        {
          id: 'crash',
          label: 'Because all booms end in crashes',
        },
      ],
      correctOptionId: 'income-limit',
      explanation:
        'A price rise sustained by local incomes has a natural limit; one sustained by demand from outside the local income distribution has a different one, and it is set by conditions elsewhere — foreign wages, tax regimes, mobility, and how attractive the country stays. That is not a prediction of a fall. It is a statement about what the 10% is now resting on, and it is a thinner foundation than the same number resting on wage growth would be.',
    },
    {
      id: 'mc-final',
      type: 'multiple_choice',
      tags: ['portugal', 'property', 'capstone'],
      xp: 30,
      prompt:
        'Someone asks whether they should buy a flat in Lisbon. What has this module actually equipped you to tell them?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'conditional',
          label: 'The costs precisely, the break-even for any growth rate they care to assume, and the rate below which it never arrives',
        },
        {
          id: 'yes',
          label: 'Yes — the arithmetic is overwhelming at 10% a year',
          feedback:
            'At 10% it is. The module’s point is that the answer is a function of a number nobody knows, and reporting only the favourable case is exactly the error it was built to prevent.',
        },
        {
          id: 'no',
          label: 'No — the transaction costs are 11% of the price',
          feedback:
            'They are, and at anything above about 3% growth they are repaid within a few years. A cost is not an argument on its own.',
        },
        {
          id: 'depends',
          label: 'That it depends on too many unknowns to say anything useful',
        },
      ],
      correctOptionId: 'conditional',
      explanation:
        'That is what a good model produces: not a verdict, but the shape of the answer and the place where it turns. The costs are knowable to the euro and now are. The break-even follows from them and one assumption. And the assumption is theirs to make — but they should make it knowing that below about 1.37% a year the flat never pays for itself however long they hold it, and that this is the number the decision actually rests on.',
    },
  ],
  keyTakeaways: [
    'Capital gains tax makes the real break-even later unless the proceeds go into another permanent home.',
    'Rent avoided belongs to the rent-versus-buy question — adding it to appreciation counts it twice.',
    'Most omissions in a simple property model are costs, so a simple model flatters the purchase.',
    'The output is not a verdict: it is the costs to the euro, and the growth rate at which the answer changes.',
  ],
});
