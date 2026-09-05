/**
 * ============================================================================
 * Module 3 · Lesson 4 — "The ceiling nobody wants to touch"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to explain the discount window's role as the
 * corridor ceiling, and why stigma stops it working as designed exactly when
 * it is needed.
 *
 * Sources / further reading for reviewers:
 *   - Federal Reserve, "The Discount Window and Discount Rate".
 *   - Armantier et al., "Discount Window Stigma During the 2007–08 Financial
 *     Crisis" (NY Fed Staff Report 483) — banks paid more in the market than
 *     the window charged.
 *   - Bank Term Funding Program (2023) — designed to be stigma-free.
 *
 * A note on rigour: stigma is an empirical finding, not a theoretical
 * necessity. The 2023 facilities were an explicit attempt to design around it,
 * and the lesson presents the problem as a design problem rather than an
 * inevitability.
 */

import { defineLesson } from '../../schema';

export const discountWindowLesson = defineLesson({
  id: 'discount-window',
  title: 'The Ceiling Nobody Wants to Touch',
  subtitle: 'A facility that caps the market rate — as long as using it is not an admission.',
  icon: '🪟',
  difficulty: 'advanced',
  estimatedMinutes: 7,
  hearts: 3,

  keyTakeaways: [
    'The discount window lends reserves against collateral, capping how high the overnight rate can go.',
    'No bank should pay another more than the window charges — yet in 2008 many did.',
    'Stigma is the reason: borrowing there signals distress, and the signal can cost more than the loan saves.',
    'A ceiling only works if using it is unremarkable, which makes disclosure rules part of monetary policy.',
  ],

  challenges: [
    {
      id: 'mc-ceiling-logic',
      type: 'multiple_choice',
      tags: ['discount-window', 'corridor'],
      xp: 15,
      prompt: 'The window lends at 4.5%. Why should no bank ever borrow from another at 5%?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'cheaper',
          label: 'Because the central bank is cheaper and will always lend against good collateral',
        },
        {
          id: 'illegal',
          label: 'Because paying above the discount rate is prohibited',
          feedback:
            'Nothing prohibits it. Banks are free to pay whatever they agree — the constraint is meant to be economic, not legal.',
        },
        {
          id: 'no-collateral',
          label: 'Because interbank loans need no collateral',
          feedback:
            'Unsecured interbank lending does exist, and being unsecured should make it *dearer*, not a reason to accept a worse rate.',
        },
        {
          id: 'slow',
          label: 'Because the window is faster',
          feedback:
            'Speed is not the issue — the window can be accessed same-day. What stops banks using it is something else entirely.',
        },
      ],
      correctOptionId: 'cheaper',
      explanation:
        'In theory the window is an arbitrage: any bank paying more than 4.5% in the market should borrow at the window instead, and that available alternative caps the market rate. Together with the floor from interest on reserves it forms a corridor the rate cannot leave. The theory is clean — and it failed in 2008.',
    },

    {
      id: 'order-stigma',
      type: 'order_flow',
      tags: ['discount-window', 'stigma', 'crisis'],
      xp: 20,
      prompt: 'Why does the ceiling leak in a crisis? Put the logic in order.',
      instructions: 'Earliest step at the top',
      events: [
        {
          id: 'strain',
          label: 'Funding markets tighten and a bank needs reserves',
          detail: 'The situation the window was built for',
        },
        {
          id: 'consider',
          label: 'It considers the window, which is cheaper than the market',
          detail: 'On price alone the decision is obvious',
        },
        {
          id: 'signal',
          label: 'But borrowing there may become known',
          detail: 'Counterparties, supervisors and eventually the public',
        },
        {
          id: 'infer',
          label: 'Others would infer it could not fund itself privately',
          detail: 'The inference is reasonable, which is what makes it dangerous',
        },
        {
          id: 'pay-more',
          label: 'It pays above the discount rate in the market instead',
          detail: 'The ceiling stops binding precisely when it is needed',
        },
      ],
      correctOrder: ['strain', 'consider', 'signal', 'infer', 'pay-more'],
      explanation:
        'New York Fed researchers found banks in 2007–08 paying substantially more for term funding than the window charged — a spread that only makes sense if borrowing there carried a cost beyond interest. The signal *is* informative, which is the trap: a facility that reveals weakness will be avoided by the weak, so the ceiling holds in calm markets and gives way in a panic.',
    },

    {
      id: 'match-facilities',
      type: 'concept_match',
      tags: ['facilities', 'corridor'],
      xp: 15,
      prompt: 'Match each facility to what it does.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'iorb',
          term: 'Interest on reserves',
          definition: 'Pays banks for balances left at the central bank — the corridor floor',
        },
        {
          id: 'window',
          term: 'Discount window',
          definition: 'Lends reserves against collateral — the corridor ceiling',
        },
        {
          id: 'onrrp',
          term: 'ON RRP',
          definition: 'Extends a floor to money funds and others with no reserve account',
        },
        {
          id: 'sfr',
          term: 'Standing repo facility',
          definition: 'Lends against Treasuries on demand, to cap repo rates too',
        },
        {
          id: 'stigma',
          term: 'Stigma',
          definition: 'The reputational cost that stops a facility being used when needed',
        },
      ],
      explanation:
        'Notice the pattern: each facility exists because the previous one had a gap. Interest on reserves set a floor for banks; ON RRP extended it to non-banks who leaked below it. The window capped unsecured borrowing; the standing repo facility caps secured borrowing after repo rates spiked above the corridor in September 2019. The toolkit is a record of things that went wrong.',
    },

    {
      id: 'mc-designing-around-stigma',
      type: 'multiple_choice',
      tags: ['discount-window', 'policy-design'],
      xp: 20,
      prompt: 'How would you design a lending facility that banks will actually use in a crisis?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'cheaper-still',
          label: 'Make it much cheaper than the market',
          feedback:
            'Cheaper does not help if the cost being avoided is reputational rather than financial — and a deeply subsidised rate creates its own problems.',
        },
        {
          id: 'broad-and-quiet',
          label: 'Make it broad, routine and slow to disclose, so using it says nothing in particular',
        },
        {
          id: 'mandatory',
          label: 'Require every bank to borrow from it regularly',
          feedback:
            'Closer than it looks — forcing broad participation does dilute the signal, and some central banks encourage routine test borrowing for exactly that reason. But compulsion has costs, and the general principle is about the signal, not the mandate.',
        },
        {
          id: 'secret',
          label: 'Keep every use permanently secret',
          feedback:
            'Permanent secrecy is not available to a public institution lending public money, and attempts at it damage the central bank rather than the stigma.',
        },
      ],
      correctOptionId: 'broad-and-quiet',
      explanation:
        'The 2023 Bank Term Funding Program was built on this logic: wide eligibility, generous collateral terms, and disclosure delayed by a year. If everyone can use a facility and nobody learns quickly who did, borrowing there stops being evidence of anything. It is a rare case of a policy problem being solved by changing what an action *means* rather than what it costs.',
    },
  ],
});
