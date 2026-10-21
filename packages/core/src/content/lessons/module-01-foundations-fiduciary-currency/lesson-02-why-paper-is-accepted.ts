/**
 * ============================================================================
 * Module 1 · Lesson 2 — "Why you accept a piece of paper"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to explain acceptance without appealing to
 * "trust": specifically, that a state creating a tax liability payable only in
 * its own unit manufactures demand for that unit, and that legal tender law
 * settles debts rather than compelling anyone to sell.
 *
 * Sources / further reading for reviewers:
 *   - Knapp, "The State Theory of Money" (1905) — the chartalist origin.
 *   - Lerner, "Money as a Creature of the State" (1947).
 *   - US Treasury, "Legal Tender Status" FAQ — the widely misread statute.
 *
 * A note on rigour: chartalism explains why a *particular* unit wins, not why
 * money exists at all, and network effects do much of the work in practice —
 * the euro circulates in Kosovo and the dollar in Ecuador without either
 * state's tax system requiring it. The lesson gives tax-driven demand its due
 * without overclaiming; please keep the final challenge, which is the
 * counterexample.
 */

import { defineLesson } from '../../schema';

export const whyPaperIsAcceptedLesson = defineLesson({
  id: 'why-paper-is-accepted',
  title: 'Why You Accept a Piece of Paper',
  subtitle: 'Not trust, and not gold: a bill you cannot pay any other way.',
  icon: '🧾',
  difficulty: 'intro',
  estimatedMinutes: 6,
  hearts: 3,

  keyTakeaways: [
    'If taxes can only be paid in one currency, people will always need that currency, whatever it is made of.',
    'Legal tender means you cannot refuse it as payment of a debt. It does not force a shop to sell you anything.',
    'Acceptance feeds itself: you take it because others will, and they take it for the same reason.',
    'Currencies are also used outside the country that issues them, so taxes are not the whole story.',
  ],

  challenges: [
    {
      id: 'order-tax-driven-demand',
      type: 'order_flow',
      tags: ['chartalism', 'foundations'],
      xp: 15,
      prompt: 'How does a government make people want its currency? Put the steps in order.',
      instructions: 'First step at the top',
      events: [
        {
          id: 'declare',
          label: 'The state names a currency and says taxes must be paid in it',
          detail: 'The tax bill exists before any of the money does',
        },
        {
          id: 'spend',
          label: 'The state pays with the new currency, and that puts it into use',
          detail: 'It pays soldiers, suppliers and officials',
        },
        {
          id: 'need',
          label: 'Everyone with a tax bill now needs to get some',
          detail: 'Even people the state never paid',
        },
        {
          id: 'accept',
          label: 'Sellers accept it, because their customers need it too',
          detail: 'Now everyone wants it, not only taxpayers',
        },
        {
          id: 'price',
          label: 'Prices start being written in the currency',
          detail: 'It is now the unit of account, not only a way to pay',
        },
      ],
      correctOrder: ['declare', 'spend', 'need', 'accept', 'price'],
      explanation:
        'The order matters. The state must create the tax bill first, before it spends the currency. Otherwise nobody would accept the first payment. That is why people say “taxes drive money”: the tax bill comes first and creates the demand, and the state’s spending then meets it.',
    },

    {
      id: 'mc-legal-tender',
      type: 'multiple_choice',
      tags: ['legal-tender', 'foundations'],
      xp: 10,
      prompt: 'A café will not take your €50 note for a coffee. Is that against the law?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'yes-legal-tender',
          label: 'Yes, because legal tender must be accepted for any payment',
          feedback:
            'This is the most common mistake about legal tender. The law is about paying debts, not about whether a shop must agree to sell.',
        },
        {
          id: 'no-no-debt',
          label: 'No, because you owe them nothing until they agree to serve you',
        },
        {
          id: 'yes-currency',
          label: 'Yes, because it is the national currency',
          feedback:
            'Being the national currency does not force a private seller to sell to you on your terms.',
        },
        {
          id: 'depends-amount',
          label: 'Only if the note is small enough to be reasonable change',
          feedback:
            'Some countries limit how many coins you must accept for a debt. But that is again a rule about debts, not about a sale that has not happened yet.',
        },
      ],
      correctOptionId: 'no-no-debt',
      explanation:
        'Legal tender means a person you owe money to cannot refuse it as payment. Before the café serves you, you owe them nothing. So they can refuse the note, refuse cash completely, or refuse to serve you. The law makes the currency valid for paying debts. It does not make every seller take it.',
    },

    {
      id: 'match-acceptance-terms',
      type: 'concept_match',
      tags: ['chartalism', 'foundations'],
      xp: 15,
      prompt: 'Match each idea to what it says.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'chartalism',
          term: 'Chartalism',
          definition: 'People want a currency because the state asks for it back in taxes',
        },
        {
          id: 'legal-tender',
          term: 'Legal tender',
          definition: 'A person you owe money to cannot refuse it as payment',
        },
        {
          id: 'network',
          term: 'Network effect',
          definition: 'It is worth holding mostly because everyone around you holds it too',
        },
        {
          id: 'seigniorage',
          term: 'Seigniorage',
          definition: 'The profit an issuer makes because money costs less to make than the amount written on it',
        },
        {
          id: 'dollarisation',
          term: 'Dollarisation',
          definition: 'People drop their own currency for a foreign one that holds its value better',
        },
      ],
      explanation:
        'These ideas do not compete; they work together. Chartalism explains why one currency first takes hold in a country. Network effects explain why it stays. They also explain how a better-run foreign currency can take over once people stop trusting their own.',
    },

    {
      id: 'mc-dollarisation-counterexample',
      type: 'multiple_choice',
      tags: ['dollarisation', 'foundations'],
      xp: 10,
      prompt: 'Ecuador uses the US dollar. Nobody in Ecuador pays US taxes. What does that tell you?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'chartalism-wrong',
          label: 'Tax-driven demand is a myth',
          feedback:
            'Too strong. Taxes clearly do create demand; that is how a new currency can start at all. This case only shows that taxes are not the only reason.',
        },
        {
          id: 'not-only-source',
          label: 'Tax demand is one source of acceptance, not the only one',
        },
        {
          id: 'us-forces',
          label: 'The US must be forcing them to use it',
          feedback:
            'Ecuador chose the dollar by itself in 2000, after its own currency collapsed. The US was not asked, and it gains almost nothing.',
        },
        {
          id: 'gold',
          label: 'The dollar must still be backed by something physical',
          feedback:
            'It is not. People in Ecuador hold dollars for the same reason Americans do: everyone else accepts them, and their value has stayed fairly stable.',
        },
      ],
      correctOptionId: 'not-only-source',
      explanation:
        'People can choose a currency just because it keeps its value and everyone accepts it. Ecuador switched to the dollar after its own currency lost most of its value in a year. Taxes can start a currency. Stability and the fact that everyone uses it are what keep it alive, even across a border where nobody pays taxes in it.',
    },
  ],
});
