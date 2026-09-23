import { defineLesson } from '../../schema';

/**
 * The mechanics of intervention, which are a balance sheet operation before
 * they are an exchange rate policy — and the carrying cost that follows.
 */
export const sterilisedOrNotLesson = defineLesson({
  id: 'sterilised-or-not',
  title: 'Every Intervention Is Two Decisions',
  subtitle:
    'Buying foreign currency creates domestic money. Whether you take that money back is a separate choice, and it is the one that matters.',
  icon: '💱',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'mc-creates-money',
      type: 'multiple_choice',
      tags: ['intervention', 'sterilisation'],
      xp: 30,
      prompt:
        'A central bank buys $2bn of foreign currency to hold its own currency down. What has it done to its domestic money supply?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'expands',
          label: 'Expanded it — it paid with domestic money it created',
        },
        {
          id: 'nothing',
          label: 'Nothing; it exchanged one asset for another',
          feedback:
            'It exchanged a foreign asset for a liability of its own. Reserves on the asset side go up, and domestic base money on the liability side goes up with them — the same balance sheet expansion as any asset purchase.',
        },
        {
          id: 'contracts',
          label: 'Contracted it, since money left the country',
          feedback:
            'The money did not leave. Whoever sold the dollars now holds domestic currency, newly created, in a domestic bank account.',
        },
        {
          id: 'depends',
          label: 'It depends on the exchange rate regime',
          feedback:
            'The mechanics are the same under any regime. What differs is whether you are obliged to keep intervening.',
        },
      ],
      correctOptionId: 'expands',
      explanation:
        'Intervention is quantitative easing conducted in a foreign asset. That is the whole of the mechanism and it is why an exchange rate policy is inescapably a monetary policy: a central bank buying foreign currency to hold its rate down is easing at home, whether or not it intended to. The trilemma is not a theoretical constraint — it is this balance sheet identity.',
    },
    {
      id: 'sim-sterilisation',
      type: 'interactive_sim',
      tags: ['reserves', 'sterilisation', 'intervention'],
      xp: 40,
      currency: 'USD',
      constants: {},
      prompt: 'What does holding the line cost, and for how long?',
      instructions: 'Take the domestic rate well above the foreign one and watch the annual bill',
      narrative:
        'The bank holds reserves and is selling them to defend its currency. Two numbers decide everything. How long the stock lasts at the current rate of drain — and, if it sterilises, what it pays every year for the privilege: it earns the foreign rate on the reserves and pays the domestic rate on the paper it issued to take the money back. For a country with high domestic rates, that gap is the standing cost of its own insurance.',
      sliders: [
        {
          key: 'reserves',
          label: 'Usable reserves',
          min: 5000000000,
          max: 200000000000,
          step: 5000000000,
          defaultValue: 60000000000,
          format: 'currency',
        },
        {
          key: 'dailyDrain',
          label: 'Sold per day to hold the rate',
          min: 100000000,
          max: 5000000000,
          step: 100000000,
          defaultValue: 800000000,
          format: 'currency',
          hint: 'A determined attack empties a queue faster than a market makes one',
        },
        {
          key: 'domesticRate',
          label: 'Domestic interest rate',
          min: 0,
          max: 0.3,
          step: 0.01,
          defaultValue: 0.09,
          format: 'percent',
        },
        {
          key: 'foreignRate',
          label: 'Rate earned on the reserves',
          min: 0,
          max: 0.08,
          step: 0.005,
          defaultValue: 0.04,
          format: 'percent',
        },
      ],
      readouts: [
        {
          key: 'days',
          label: 'Days the reserves last',
          formulaId: 'days_of_defence',
          format: 'number',
          emphasis: true,
          caption: 'reserves ÷ daily drain',
        },
        {
          key: 'cost',
          label: 'Annual cost of sterilising',
          formulaId: 'sterilisation_cost',
          format: 'currency',
          caption: 'reserves × (domestic − foreign)',
        },
      ],
      objective: {
        description: 'Find a position with fewer than sixty days of cover and a sterilisation bill above $4bn a year',
        requiredObservations: [{ sliderKey: 'dailyDrain', values: [5000000000] }],
        target: { readoutKey: 'days', comparator: 'lte', value: 60 },
      },
      explanation:
        'Two things a governor watches at once, and they pull in opposite directions. Holding a large reserve stock is what makes a defence credible — and it is precisely the large stock that generates the annual bill, every year, whether or not anything happens. That cost is real money: several emerging economies have paid more to sterilise their reserves than they spend on parts of their public administration. The defence is not free before it starts, and the days counter is what it buys.',
    },
    {
      id: 'mc-unsterilised',
      type: 'multiple_choice',
      tags: ['intervention', 'sterilisation'],
      xp: 35,
      prompt:
        'Evidence on intervention generally finds unsterilised intervention more effective than sterilised. Why would that be?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'is-policy',
          label: 'Unsterilised intervention is also a monetary decision',
        },
        {
          id: 'bigger',
          label: 'It is usually larger in size than a sterilised operation',
          feedback:
            'Not systematically. The difference is in what is left behind afterwards, not in the size of the trade.',
        },
        {
          id: 'signal',
          label: 'It signals more commitment',
          feedback:
            'It does signal more, and that is downstream of the substance: it signals more because it costs more and cannot be reversed as quietly.',
        },
        {
          id: 'legal',
          label: 'Sterilised intervention is constrained by law in most countries',
          feedback:
            'It is not. Sterilising is an operational choice made most days, in most countries, without anyone outside the building noticing.',
        },
      ],
      correctOptionId: 'is-policy',
      explanation:
        'Sterilised intervention swaps one asset for another in private portfolios and leaves the policy rate untouched — so it works only through signalling and portfolio balance, both of which are modest and temporary. Unsterilised intervention changes the quantity of domestic money, which is a genuine monetary loosening or tightening. That is the honest summary of a large literature: intervention works to the extent that it is monetary policy, and the rest is a nudge against a disorderly market.',
    },
    {
      id: 'mc-when-it-works',
      type: 'multiple_choice',
      tags: ['intervention', 'evidence'],
      xp: 35,
      prompt: 'Under what condition is intervention most likely to achieve something?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'disorderly',
          label: 'The market is disorderly rather than wrong — a move with no news behind it',
        },
        {
          id: 'fundamentals',
          label: 'The currency is far from where fundamentals say it should be',
          feedback:
            'This is the case where intervention most reliably fails. Leaning against a move the fundamentals support means buying a currency everyone has a reason to sell, and the reserves run out before the reasons do.',
        },
        {
          id: 'reserves',
          label: 'The central bank has very large reserves',
          feedback:
            'Necessary, not sufficient, and 1992 is the standing counterexample: a defence can be large, well funded and still lose, because the other side can be larger.',
        },
        {
          id: 'coordinated',
          label: 'Other central banks intervene at the same time',
          feedback:
            'Coordination helps a great deal and is rare, because it requires the others to want the same outcome. When it is available it is usually because the move was disorderly — which is the answer above.',
        },
      ],
      correctOptionId: 'disorderly',
      explanation:
        'The distinction to carry is between a market that is moving for reasons and one that is moving because it is thin, one-sided or panicking. Against the first, intervention is a subsidy to whoever is on the other side. Against the second, a credible seller can break a spiral that had nothing behind it — which is why interventions are usually announced as being about disorderly conditions, and why that phrasing is more honest than it sounds.',
    },
  ],
  keyTakeaways: [
    'Buying foreign currency creates domestic money; intervention is an asset purchase.',
    'Sterilising costs the gap between domestic and foreign rates, every year.',
    'Intervention works to the extent that it is monetary policy.',
    'It can break a disorderly move and cannot outlast a move the fundamentals support.',
  ],
});
