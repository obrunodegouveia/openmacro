import { defineLesson } from '../../schema';

/**
 * 16 September 1992. Verified daily dollar rates (FRED DEXUSUK): $2.0030 on
 * 8 September, $1.8715 on the 15th, $1.8110 on the day, $1.7082 by the 22nd,
 * and a monthly average of $1.4395 by February 1993. Derived DM/£ fell from
 * 2.8131 in August 1992 to 2.4238 by November.
 *
 * HM Treasury papers released in 2005 put the cost to the UK at about £3.3bn.
 */
export const blackWednesdayLesson = defineLesson({
  id: 'black-wednesday',
  title: 'The Day, and the Arithmetic',
  subtitle:
    'Put the whole mechanism together on the one day it ran to completion.',
  icon: '📉',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'flow-the-day',
      type: 'order_flow',
      tags: ['black-wednesday', 'history'],
      xp: 25,
      prompt: 'Put 16 September 1992 in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'selling',
          label: 'Sterling opens under heavy selling and sits on its floor',
          detail: 'The Bank must buy every pound offered at DM 2.7780',
        },
        {
          id: 'rate-12',
          label: 'The base rate is raised from 10% to 12%',
          detail: 'Announced mid-morning to make the short expensive',
        },
        {
          id: 'no-effect',
          label: 'The selling does not stop',
          detail: 'Nobody believes 12% will survive the winter',
        },
        {
          id: 'rate-15',
          label: 'A further rise to 15% is announced',
          detail: 'It never takes effect',
        },
        {
          id: 'suspend',
          label: 'That evening Britain suspends its ERM membership',
          detail: 'The floor is gone, and so is the trade',
        },
      ],
      correctOrder: ['selling', 'rate-12', 'no-effect', 'rate-15', 'suspend'],
      explanation:
        'The two rate rises in one day are the tell. A government that raises by two points, watches nothing happen, and then reaches for five more within hours is not tightening policy — it is signalling that it has run out of instruments. The market read the second announcement as the end, and it was: sterling left the mechanism that evening.',
    },

    {
      id: 'mc-the-arithmetic',
      type: 'multiple_choice',
      tags: ['black-wednesday', 'speculation'],
      xp: 25,
      prompt:
        'Sterling was $1.8715 on 15 September and $1.7082 a week later. On a $10bn short position, what does that pay?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'about-873',
          label: 'About $873 million — roughly 8.7% of the notional',
        },
        {
          id: 'ten-billion',
          label: 'About $10 billion, the whole position',
          feedback:
            'The position is the size of the bet, not the size of the prize. You keep the move, not the notional — which is 8.7% here.',
        },
        {
          id: 'sixteen-cents',
          label: 'About $1.6 billion — sixteen cents on every pound',
          feedback:
            'The move was 16.33 cents, but on a $10bn notional the return is the *percentage* move, 8.7%. Sixteen cents per pound would be the answer if the position were quoted in pounds, and it was reported in dollars.',
        },
        {
          id: 'nothing',
          label: 'Nothing, until the position is closed',
        },
      ],
      correctOptionId: 'about-873',
      explanation:
        'Quantum’s position was reported at around $10bn and its profit at around $1bn. Those two reported figures and the published exchange rates agree with each other to within the noise of when exactly the position was closed — which is a useful thing to be able to check for yourself, and the reason this module was built around a simulation rather than an anecdote.',
    },

    {
      id: 'mc-who-lost',
      type: 'multiple_choice',
      tags: ['black-wednesday', 'distribution'],
      xp: 20,
      prompt:
        'The Treasury later put the cost to Britain at about £3.3bn. Who actually paid the speculators?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'taxpayer-reserves',
          label: 'The taxpayer, through reserves sold high and bought back cheap',
        },
        {
          id: 'banks',
          label: 'The commercial banks that lent the sterling',
          feedback:
            'They were repaid in full, in sterling, with interest. Lending to a short seller is not taking the other side of the bet.',
        },
        {
          id: 'nobody',
          label: 'Nobody — currency gains are paper gains',
          feedback:
            'The Bank of England bought pounds at DM 2.78 and the pound was worth DM 2.42 weeks later. That is a realised loss on a real portfolio.',
        },
        {
          id: 'germany',
          label: 'The Bundesbank',
        },
      ],
      correctOptionId: 'taxpayer-reserves',
      explanation:
        'The Bank spent hard currency buying sterling at a price it could not hold, and the currency it bought was worth substantially less days later. That difference is the transfer, and it went from public reserves to whoever was on the other side. Worth being precise about, because "Soros broke the Bank of England" obscures the mechanism: he did not break anything. He took the other side of a price the government was publicly committed to defending, and the government was wrong about the price.',
    },

    {
      id: 'match-preconditions',
      type: 'concept_match',
      tags: ['pegs', 'crisis', 'diagnosis'],
      xp: 25,
      prompt:
        'You are looking at another pegged currency today. Match each thing to check to what it tells you.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'gap',
          term: 'The gap between domestic and anchor interest rates',
          definition:
            'What it costs a speculator to wait — the whole downside of the trade',
        },
        {
          id: 'reserves-vs-flows',
          term: 'Reserves against the size of borrowable domestic currency',
          definition:
            'Whether the authorities can be outspent by someone with a credit line',
        },
        {
          id: 'domestic-pain',
          term: 'Mortgages, unemployment and the electoral calendar',
          definition:
            'How long the rate weapon can credibly be held before politics reverses it',
        },
        {
          id: 'published-floor',
          term: 'Whether the defended level is published',
          definition:
            'Whether there is a precise line to attack, or only a fog to guess at',
        },
      ],
      explanation:
        'This is what the module is actually for. The 1992 trade was not genius about sterling — it was a checklist, applied to a country where every item pointed the same way. The same four questions were asked of the Thai baht in 1997 and of the Swiss franc cap in 2015, and both ended the same way. Where the answers point the other way, the peg holds: Hong Kong has been attacked repeatedly and its currency board has more reserves than there is domestic money to borrow.',
    },
  ],
  keyTakeaways: [
    'Two rate rises in one day is not tightening — it is a government announcing it has run out of instruments.',
    'A move from $1.8715 to $1.7082 pays about 8.7% of notional: roughly $873m on $10bn, which reproduces the reported profit.',
    'The transfer came from public reserves bought at a price the state could not hold.',
    'The trade was a checklist — carry cost, reserves against borrowable currency, domestic pain, and a published line.',
  ],
});
