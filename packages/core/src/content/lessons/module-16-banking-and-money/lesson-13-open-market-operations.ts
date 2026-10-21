import { defineLesson } from '../../schema';

/** Video 13. The mechanism: print, buy treasuries, and let the seller's deposit multiply through the banks. */
export const kabOpenMarketOperationsLesson = defineLesson({
  id: 'kab-open-market-operations',
  title: 'The Two Printing Presses',
  subtitle:
    'The central bank creates new money and buys government bonds with it. Then the banks lend on top of that new money.',
  icon: '🖨️',
  difficulty: 'core',
  estimatedMinutes: 18,
  video: {
    url: 'https://www.youtube.com/watch?v=BTNarhvGX88',
    minutes: 12,
    source: 'Khan Academy — Banking 13',
  },
  challenges: [
    {
      id: 'order-omo',
      type: 'order_flow',
      tags: ['open-market-operations', 'money-supply'],
      xp: 30,
      prompt:
        'An open market purchase is when the central bank buys bonds with new money. Put the steps in order, from printing the money to the bank’s new loan.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'print', label: 'The central bank creates 100 of new notes', detail: 'The notes are something it owes' },
        { id: 'buy', label: 'It uses them to buy Treasury bonds from anyone who wants to sell', detail: 'For example a pension fund, or your uncle. The bonds are now something it owns' },
        { id: 'seller', label: 'The seller now has cash instead of a bond' },
        { id: 'deposit', label: 'The seller puts that cash in a commercial bank' },
        { id: 'reserves', label: 'The bank’s reserves go up', detail: 'M0 is now 300 instead of 200' },
        { id: 'multiply', label: 'The bank makes new loans using the new reserves', detail: 'So M1 goes up by more than 100' },
      ],
      correctOrder: ['print', 'buy', 'seller', 'deposit', 'reserves', 'multiply'],
      explanation:
        'The video calls these two printing presses. The first is the central bank, which creates the base money (M0). The second is the commercial banks, which lend on top of it. Adding 100 raises M0 by 100. With a 50% reserve ratio, M1 can rise by up to 200. With a 10% ratio, it could rise by up to 1,000.',
    },
    {
      id: 'mc-why-not-reserve-req',
      type: 'multiple_choice',
      tags: ['monetary-policy', 'reserve-ratio'],
      xp: 25,
      prompt:
        'The central bank could also add money by lowering the reserve requirement (the share of deposits a bank must keep as cash). In the video, why does it prefer to buy and sell bonds instead?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'unwind',
          label:
            'Raising the requirement again later would force banks to sell things in a hurry or ask for loans back',
        },
        {
          id: 'illegal',
          label: 'Because it is not allowed to set the requirement',
          feedback:
            'It does set it. The video says this is one of its tools. It is just a clumsy one.',
        },
        {
          id: 'no-effect',
          label: 'Because changing the requirement would not change the money supply',
          feedback:
            'It would change it a lot. At 10% instead of 50%, the same reserves support five times more deposits. The problem is going back the other way.',
        },
        {
          id: 'slow',
          label: 'Because a change in the requirement takes months to change lending',
          feedback:
            'Speed is not the problem. The problem is that this tool is hard to reverse without hurting the banks that followed it.',
        },
      ],
      correctOptionId: 'unwind',
      explanation:
        'Cash kept as reserves earns nothing, so banks lend as much as the rule allows. If the rule is loosened, they lend more. If it is tightened again, they must suddenly sell things cheaply, at the worst moment. Buying bonds is easy to undo: the central bank just sells them back.',
    },
    {
      id: 'mc-omo-arithmetic',
      type: 'multiple_choice',
      tags: ['open-market-operations', 'multiplier'],
      xp: 35,
      prompt:
        'The Fed creates 100 and buys Treasury bonds. With a 50% reserve requirement, the video says M0 goes from 200 to 300 and M1 goes from 400 to 600. What would the same 100 do with a 10% requirement, if banks lend as much as they can?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'thousand',
          label: 'M0 still goes up by 100, but M1 could go up by as much as 1,000',
        },
        {
          id: 'same',
          label: 'The same as before, because the Fed created the same 100',
          feedback:
            'M0 goes up by 100 both times. But how much banks can lend on top of it depends on the ratio. At 10% each dollar supports 10 dollars of deposits; at 50% only 2.',
        },
        {
          id: 'twohundred',
          label: 'M0 goes up by 100 and M1 goes up by 200, as before',
          feedback:
            'That is the answer at 50%. At 10%, each new dollar of reserves supports ten dollars of deposits, not two.',
        },
        {
          id: 'hundred',
          label: 'Both go up by exactly 100, because the Fed cannot create deposits',
          feedback:
            'The Fed does not create those deposits. The commercial banks do, by lending, using the reserves the Fed gave them. That is the second press.',
        },
      ],
      correctOptionId: 'thousand',
      explanation:
        'The central bank only controls the base money. How much more money that becomes depends on the ratio. It also depends on whether banks want to lend and people want to borrow. After 2008, quantitative easing raised M0 enormously but M1 much less: the reserves were created, but banks did not lend much on top of them.',
    },
    {
      id: 'mc-no-requirement-for-the-fed',
      type: 'multiple_choice',
      tags: ['central-banking', 'reserves'],
      xp: 30,
      prompt:
        'Every commercial bank has a reserve requirement. The central bank has none. Sal says it does not need one, once its notes can no longer be swapped for gold. Why not?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'ownliability',
          label: 'People can only ask it for its own notes and reserves, and it can always create more',
        },
        {
          id: 'gold',
          label: 'Because it keeps enough gold to cover all the notes it has issued',
          feedback:
            'It keeps only a small part of that in gold, and that is how the system is designed. If gold were the answer, a central bank would be no different from any other bank.',
        },
        {
          id: 'trusted',
          label: 'Because people never rush to take money out of a central bank',
          feedback:
            'They have done it. That is what a currency crisis is. What protects the central bank is that a rush can never leave it without its own money.',
        },
        {
          id: 'regulator',
          label: 'Because it makes the rules and would not set one for itself',
          feedback:
            'Maybe, but that is not the reason. Even if it wanted a requirement, it would mean nothing: it cannot run out of something it creates itself.',
        },
      ],
      correctOptionId: 'ownliability',
      explanation:
        'A commercial bank promises to pay cash, and it cannot make cash. A central bank promises its own notes and reserves, and it can create them by typing a number. So it can never run out of its own money. But there is a real limit: it cannot control what that money is worth. If it creates too much, the money loses value.',
    },
    {
      id: 'match-two-presses',
      type: 'concept_match',
      tags: ['money-creation', 'central-banking'],
      xp: 30,
      prompt: 'Sal talks about two printing presses. Match each term to what it means.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'base',
          term: 'The base money press',
          definition: 'The central bank creates new reserves and notes, and buys things with them',
        },
        {
          id: 'leverage',
          term: 'The leverage press',
          definition: 'Commercial banks lend, turning each unit of reserves into several units of deposits',
        },
        {
          id: 'brake',
          term: 'The brake on the second press',
          definition: 'The reserve ratio, and whether anyone safe to lend to actually wants to borrow',
        },
      ],
      explanation:
        'Keeping the two presses apart clears up a lot of confusion about “printing money”. The central bank runs the first press only. When people say “the Fed printed trillions”, they mean reserves. Those reserves only become much more spending money if banks lend on top of them. That is why the same action raises prices in one decade but not in another: the second press depends on people deciding whether a loan is worth making.',
    },
  ],
  keyTakeaways: [
    'When the central bank buys bonds, base money goes up, and banks then lend on top of it.',
    'The person who sold the bond deposits the money, and it becomes a bank’s reserves.',
    'Changing the reserve requirement works, but it is very hard to undo.',
  ],
});
