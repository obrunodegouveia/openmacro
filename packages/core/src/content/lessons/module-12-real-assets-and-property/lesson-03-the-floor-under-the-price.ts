import { defineLesson } from '../../schema';

/**
 * Why the downside is bounded in a way a financial asset's is not.
 *
 * Eurostat construction cost index, new residential buildings, 2015=100: the
 * euro area went from 99.9 in 2015-Q1 to 133.5 in 2023-Q3, +34%, and fell in
 * only 4 of 34 quarters, the worst of them by 0.5%. Portugal: +38% over the
 * same span, 4 falls in 35 quarters, worst 1.1%.
 */
export const theFloorUnderThePriceLesson = defineLesson({
  id: 'the-floor-under-the-price',
  title: 'What It Costs to Make Another One',
  subtitle:
    'A house has a cost of production, and that cost is a ratchet. Financial assets have no such floor.',
  icon: '🧱',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'mc-replacement-cost',
      type: 'multiple_choice',
      tags: ['construction', 'supply', 'property'],
      xp: 25,
      prompt:
        'Market prices in a city fall below what it costs to build there — land, materials, labour, permits, finance. What happens next?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'building-stops',
          label: 'Building stops, because nobody spends 300 to create something worth 250',
        },
        {
          id: 'build-cheaper',
          label: 'Developers build more cheaply',
          feedback:
            'At the margin, and it is bounded. Concrete, steel, wiring and hours have prices set outside the local market, and quality standards are legislated.',
        },
        {
          id: 'prices-keep-falling',
          label: 'Prices keep falling until they reach zero',
        },
        {
          id: 'nothing',
          label: 'Nothing — construction is unrelated to prices of existing homes',
          feedback:
            'New and existing homes are substitutes for a buyer. What it costs to make another one sets what a rational developer will pay for land, and eventually what the existing stock is worth.',
        },
      ],
      correctOptionId: 'building-stops',
      explanation:
        'That is the replacement cost floor and it is the structural difference between a house and a share. Supply withdraws when price falls below the cost of production, the shortage builds while nothing is added, and the price recovers to the cost of making another one. A share has no cost of production and therefore no floor at all — which is why equities can fall 80% and stay there, and housing markets usually cannot.',
    },

    {
      id: 'match-cost-stack',
      type: 'concept_match',
      tags: ['construction', 'logistics', 'inputs'],
      xp: 25,
      prompt: 'Match each input in the cost of a building to why it rarely gets cheaper.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'materials',
          term: 'Cement, steel and glass',
          definition:
            'Energy-intensive to make, so their price carries the energy price and inherits its ratchet',
        },
        {
          id: 'logistics',
          term: 'Getting it to the site',
          definition:
            'Freight, fuel and drivers — heavy, low-value cargo that cannot be sourced far away',
        },
        {
          id: 'labour',
          term: 'Trades on site',
          definition:
            'Wages that are sticky downward, for skills that take years to replace',
        },
        {
          id: 'land',
          term: 'The land itself',
          definition:
            'Fixed in quantity, and in a desirable location cannot be manufactured at any price',
        },
        {
          id: 'permits',
          term: 'Permits and compliance',
          definition:
            'Set by regulation, revised upward far more often than downward',
        },
      ],
      explanation:
        'Four of these five are prices that other markets set and that this market must accept. Logistics is the most underrated: building materials are heavy and cheap per tonne, so transport is a large share of delivered cost and cannot be arbitraged away by sourcing from somewhere cheaper. When freight rates rise, every construction site in the country pays, and when they fall the saving is rarely handed back.',
    },

    {
      id: 'mc-the-ratchet',
      type: 'multiple_choice',
      tags: ['construction', 'evidence'],
      xp: 25,
      prompt:
        'Euro area construction costs rose 34% from 2015 and fell in only 4 of 34 quarters, the worst by 0.5%. What does that pattern mean for the floor?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'floor-ratchets-up',
          label: 'The floor moves up and effectively never comes back down',
        },
        {
          id: 'costs-follow',
          label: 'That construction costs simply follow house prices',
          feedback:
            'They rose 34% while house prices rose 60% — different magnitudes, and cost inflation was driven by energy and freight in 2021 and 2022 rather than by the housing market.',
        },
        {
          id: 'small',
          label: 'Nothing — a 34% rise over a decade is ordinary inflation',
          feedback:
            'Consumer prices rose 32% over a similar span, so the level is comparable. The pattern is what matters: consumer prices contain items that fall, and this index barely does.',
        },
        {
          id: 'measurement',
          label: 'That the index is not measuring real costs',
        },
      ],
      correctOptionId: 'floor-ratchets-up',
      explanation:
        'Four down-quarters in nine years, none deeper than half a per cent. That is not a price — it is a ratchet, and it means the cheapest new home a market can produce gets more expensive almost every quarter regardless of what demand does. Anyone waiting for prices to fall back to a level from ten years ago is waiting for something the cost side has already made impossible to build.',
    },

    {
      id: 'flow-supply-response',
      type: 'order_flow',
      tags: ['supply', 'property', 'cities'],
      xp: 25,
      prompt:
        'Demand rises sharply in a desirable city. Put the supply response in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'prices-rise',
          label: 'Prices rise, because the stock is fixed today',
          detail: 'Nothing can be built this month whatever anyone offers',
        },
        {
          id: 'developers',
          label: 'Developers want to build and go looking for sites',
          detail: 'The margin over cost has opened up',
        },
        {
          id: 'land',
          label: 'They discover the constraint is land and permission, not money',
          detail: 'The desirable part of the city is already built on',
        },
        {
          id: 'permits',
          label: 'Permitting takes years, and neighbours object',
          detail: 'The people who benefit from scarcity live there and vote',
        },
        {
          id: 'arrives-late',
          label: 'Supply arrives late, small, and often somewhere else',
          detail: 'By which time the price has already found its new level',
        },
      ],
      correctOrder: ['prices-rise', 'developers', 'land', 'permits', 'arrives-late'],
      explanation:
        'This is why "desirable" is doing so much work in the question. In a market where supply can respond, high prices call forth building and the price comes back down — that is what markets are supposed to do. In a supply-constrained city the response is delayed by years, capped by land and blocked by the incumbents who gain from the block. Demand then has nowhere to go except into the price, and it stays there.',
    },
  ],
  keyTakeaways: [
    'Below replacement cost, building stops — so the shortage grows and the price recovers. Shares have no such floor.',
    'The cost stack is materials, freight, labour, land and compliance, and most of it is priced elsewhere.',
    'Euro area construction costs rose 34% and fell in 4 quarters of 34, never by more than 0.5%.',
    'In a desirable city the supply response is late, small and often blocked by the people who benefit from its absence.',
  ],
});
