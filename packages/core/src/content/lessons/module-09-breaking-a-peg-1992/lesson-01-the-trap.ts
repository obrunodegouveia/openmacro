import { defineLesson } from '../../schema';

/**
 * Sterling joined the Exchange Rate Mechanism on 8 October 1990 at a central
 * rate of DM 2.95 with a ±6% band, putting the floor at DM 2.7780. Derived
 * monthly rates (FRED EXUSUK × EXGEUS) show DM/£ at 2.9647 in October 1990 and
 * 2.8131 by August 1992 — inside the band, and drifting toward the bottom of
 * it. The Bundesbank's discount rate reached 8.75% in July 1992.
 */
export const theTrapLesson = defineLesson({
  id: 'the-trap-of-1992',
  title: 'A Promise Britain Could Not Keep',
  subtitle:
    'Sterling was pegged to the D-mark. Then Germany needed high rates and Britain needed low ones.',
  icon: '🕳️',
  difficulty: 'core',
  estimatedMinutes: 8,
  challenges: [
    {
      id: 'mc-what-erm-was',
      type: 'multiple_choice',
      tags: ['erm', 'pegs', 'history'],
      xp: 15,
      prompt:
        'Sterling entered the ERM in October 1990 at DM 2.95, with a band of ±6%. What did the UK actually commit to?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'keep-in-band',
          label: 'To do whatever was needed — spend reserves, move rates — to keep sterling above DM 2.7780',
        },
        {
          id: 'fixed',
          label: 'To fix the rate at exactly DM 2.95',
          feedback:
            'The band was the point. Sterling could move six per cent either way; what it could not do was leave the band, and the floor at DM 2.7780 is the number that mattered.',
        },
        {
          id: 'target',
          label: 'To aim for DM 2.95 as a target, with no obligation attached',
          feedback:
            'An aim with no obligation is not a peg, and no speculator would have bothered with it. The obligation is what created something to bet against.',
        },
        {
          id: 'gold',
          label: 'To back sterling with D-mark reserves one for one',
        },
      ],
      correctOptionId: 'keep-in-band',
      explanation:
        'A peg is a promise, and a promise creates an obligation someone else can test. The moment Britain committed to holding a floor, it also committed to spending whatever it took to hold it — and published exactly where the line was. Both halves of that matter later.',
    },

    {
      id: 'flow-the-trap-closes',
      type: 'order_flow',
      tags: ['erm', 'pegs', 'trilemma'],
      xp: 25,
      prompt: 'Put the trap in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'reunification',
          label: 'Germany reunifies and spends enormously on the east',
          detail: 'A demand shock in one country of the system',
        },
        {
          id: 'bundesbank',
          label: 'The Bundesbank raises rates to hold German inflation down',
          detail: 'Its discount rate reached 8.75% in July 1992',
        },
        {
          id: 'uk-recession',
          label: 'Britain is in recession and needs the opposite',
          detail: 'Unemployment rising, house prices falling, mortgages on floating rates',
        },
        {
          id: 'forced-match',
          label: 'The peg forces Britain to hold rates high anyway',
          detail: 'Cut, and sterling falls through the floor',
        },
        {
          id: 'obvious',
          label: 'Everyone can see the position is unbearable',
          detail: 'Including the people who can bet on it ending',
        },
      ],
      correctOrder: ['reunification', 'bundesbank', 'uk-recession', 'forced-match', 'obvious'],
      explanation:
        'Nobody did anything wrong here in the ordinary sense. Germany set rates for Germany, which is what a central bank is supposed to do. Britain wanted a stable currency, which is a reasonable thing to want. The trap is structural: two economies at different points in the cycle cannot share one interest rate unless one of them is willing to suffer for it, and by 1992 it was clear which one and how much.',
    },

    {
      id: 'mc-trilemma',
      type: 'multiple_choice',
      tags: ['trilemma', 'pegs'],
      xp: 20,
      prompt:
        'Britain wanted a fixed exchange rate, free movement of capital, and an interest rate set for its own economy. What is the problem?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'pick-two',
          label: 'Those three are only ever available two at a time',
        },
        {
          id: 'expensive',
          label: 'All three are possible but expensive',
          feedback:
            'Britain proved otherwise in the most public way available. Reserves ran out; the third leg was not purchasable.',
        },
        {
          id: 'inflation',
          label: 'The combination causes inflation',
        },
        {
          id: 'no-problem',
          label: 'No problem — most countries manage all three',
          feedback:
            'Look at any country and you will find one of the three missing. China restricts capital movement; the euro area gave up national rates; the US and UK let the rate float.',
        },
      ],
      correctOptionId: 'pick-two',
      explanation:
        'If capital can move freely and you promise a fixed rate, your interest rate is set by whoever you are pegged to — because any gap between your rate and theirs is a free trade for anyone with a telephone. Britain wanted all three, and the one it lost was the one it had least expected to lose.',
    },

    {
      id: 'mc-why-visible',
      type: 'multiple_choice',
      tags: ['pegs', 'speculation'],
      xp: 20,
      prompt:
        'What made this particular position attackable, when plenty of countries have overvalued currencies without being attacked?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'published-line',
          label: 'The line was published, the reserves were finite, and the political cost of defending was visible to everyone',
        },
        {
          id: 'weak-economy',
          label: 'The UK economy was weak',
          feedback:
            'Weak economies are common; forced devaluations are rarer. Weakness is a reason the peg was wrong, not a reason the attack could work.',
        },
        {
          id: 'small-country',
          label: 'Britain was too small to defend itself',
          feedback:
            'Britain had one of the largest reserve stocks in Europe. Size was not the constraint — the willingness to keep paying was.',
        },
        {
          id: 'no-support',
          label: 'Germany refused to help',
        },
      ],
      correctOptionId: 'published-line',
      explanation:
        'This is the whole setup for what follows. A published floor tells you exactly where the authorities must buy. Finite reserves tell you they cannot do it forever. And a recession with floating-rate mortgages tells you the other weapon — higher interest rates — has a political cost that voters will notice. When all three are true, betting against the peg is not a guess about the market. It is a guess about how long a government can stand the pain, and that is a much easier question.',
    },
  ],
  keyTakeaways: [
    'A peg is a promise, and a promise is something another party can test.',
    'Free capital, a fixed rate and an independent interest rate are available two at a time, never three.',
    'German rates were set for German conditions; Britain had to match them while in recession.',
    'Published line, finite reserves, visible political pain: that combination is what makes a peg attackable.',
  ],
});
