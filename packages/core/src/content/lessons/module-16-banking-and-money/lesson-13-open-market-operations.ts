import { defineLesson } from '../../schema';

/** Video 13. The mechanism: print, buy treasuries, and let the seller's deposit multiply through the banks. */
export const kabOpenMarketOperationsLesson = defineLesson({
  id: 'kab-open-market-operations',
  title: 'The Two Printing Presses',
  subtitle:
    'The central bank prints reserves and buys government debt. The base rises once; the banks multiply it again.',
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
      prompt: 'Put an open market purchase in order, from the press to the loan.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'print', label: 'The central bank creates 100 of notes', detail: 'An asset, with notes outstanding as the matching liability' },
        { id: 'buy', label: 'It buys treasuries on the open market', detail: 'From whoever will sell — a pension fund, China, your uncle' },
        { id: 'seller', label: 'The seller now holds cash instead of a bond' },
        { id: 'deposit', label: 'The seller deposits that cash in a commercial bank' },
        { id: 'reserves', label: 'The bank’s reserves rise', detail: 'M0 has gone from 200 to 300' },
        { id: 'multiply', label: 'The bank lends against the new reserves', detail: 'And M1 rises by a multiple' },
      ],
      correctOrder: ['print', 'buy', 'seller', 'deposit', 'reserves', 'multiply'],
      explanation:
        'Two presses, as the video puts it: the base money press at the central bank, and the leverage press in the commercial banks. A 100 injection raised M0 by 100 and M1 by 200 at a 50% reserve ratio — and by 1,000 at a 10% one.',
    },
    {
      id: 'mc-why-not-reserve-req',
      type: 'multiple_choice',
      tags: ['monetary-policy', 'reserve-ratio'],
      xp: 25,
      prompt:
        'The central bank could expand money simply by lowering the reserve requirement. Why does it prefer open market operations?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'unwind',
          label:
            'Because raising the requirement back is brutal — banks at the limit would have to dump assets or unwind loans',
        },
        {
          id: 'illegal',
          label: 'Because it is not allowed to set the requirement',
          feedback:
            'It does set it. The video is explicit that this is one of its tools — just a clumsy one.',
        },
        {
          id: 'no-effect',
          label: 'Because changing the requirement would not affect the money supply',
          feedback:
            'It would, dramatically: at 10% rather than 50%, the same base supports five times the deposits. The objection is to the reverse move.',
        },
        {
          id: 'slow',
          label: 'Because it takes months to take effect',
          feedback:
            'Speed is not the complaint. The problem is that the tool is hard to reverse without breaking the banks that responded to it.',
        },
      ],
      correctOptionId: 'unwind',
      explanation:
        'Banks operate close to whatever limit they are given, because idle reserves earn nothing. Loosening the limit invites them to lend up to it; tightening it again then forces fire sales at the worst moment. Open market operations adjust the base instead, which is reversible by simply selling the bonds back.',
    },
  ],
  keyTakeaways: [
    'An open market purchase raises base money, which banks then multiply.',
    'The seller of the bond is the channel: their deposit becomes a bank’s reserves.',
    'Reserve requirements are a real tool but a nearly irreversible one.',
  ],
});
