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
  subtitle: 'Not trust, not gold — an obligation you cannot settle any other way.',
  icon: '🧾',
  difficulty: 'intro',
  estimatedMinutes: 6,
  hearts: 3,

  keyTakeaways: [
    'A tax liability payable only in one unit creates standing demand for that unit, whatever it is made of.',
    'Legal tender law says a creditor cannot refuse it to settle a debt. It does not force a shop to sell you anything.',
    'Acceptance is self-reinforcing: you take it because others will, and they take it for the same reason.',
    'Currencies do circulate outside the state that issues them, so taxes are not the whole story.',
  ],

  challenges: [
    {
      id: 'order-tax-driven-demand',
      type: 'order_flow',
      tags: ['chartalism', 'foundations'],
      xp: 15,
      prompt: 'How does a government make its currency wanted? Put the chain in order.',
      instructions: 'Earliest cause at the top',
      events: [
        {
          id: 'declare',
          label: 'The state names a unit and declares taxes payable in it',
          detail: 'The obligation is defined before any money exists',
        },
        {
          id: 'spend',
          label: 'The state spends the unit into existence',
          detail: 'Paying soldiers, suppliers and officials puts it in circulation',
        },
        {
          id: 'need',
          label: 'Everyone with a tax bill now needs to obtain some',
          detail: 'Including people the state never paid directly',
        },
        {
          id: 'accept',
          label: 'Sellers accept it because their customers must hold it',
          detail: 'Demand for the unit is now general, not just from taxpayers',
        },
        {
          id: 'price',
          label: 'Prices start being quoted in the unit',
          detail: 'It has become the unit of account, not just a means of payment',
        },
      ],
      correctOrder: ['declare', 'spend', 'need', 'accept', 'price'],
      explanation:
        'The order matters more than it looks. The state must create the obligation *before* it can spend the currency into existence — otherwise nobody would take the first payment. This is why the sequence is often summarised as "taxes drive money": the liability comes first and manufactures the demand that the spending then satisfies.',
    },

    {
      id: 'mc-legal-tender',
      type: 'multiple_choice',
      tags: ['legal-tender', 'foundations'],
      xp: 10,
      prompt: 'A café refuses your €50 note for a coffee. Are they breaking the law?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'yes-legal-tender',
          label: 'Yes — legal tender must be accepted for any payment',
          feedback:
            'This is the most common misreading of legal tender law. It governs the settlement of *debts*, not whether a shop must agree to sell.',
        },
        {
          id: 'no-no-debt',
          label: 'No — you owe them nothing until they agree to serve you',
        },
        {
          id: 'yes-currency',
          label: 'Yes, because it is the national currency',
          feedback:
            'Being the national currency does not oblige a private seller to enter a transaction on your terms.',
        },
        {
          id: 'depends-amount',
          label: 'Only if the note is small enough to be reasonable change',
          feedback:
            'Some jurisdictions do cap how much coin must be accepted for a debt, but that is a rule about debts again — not about a sale that has not happened yet.',
        },
      ],
      correctOptionId: 'no-no-debt',
      explanation:
        'Legal tender means a creditor cannot refuse it to discharge a debt already owed. Before the café serves you there is no debt, so they can decline the note, decline cash entirely, or refuse your business. The law makes the currency a valid *settlement*, not a universal key.',
    },

    {
      id: 'match-acceptance-terms',
      type: 'concept_match',
      tags: ['chartalism', 'foundations'],
      xp: 15,
      prompt: 'Match each idea to what it claims.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'chartalism',
          term: 'Chartalism',
          definition: 'A currency is wanted because the state demands it back in tax',
        },
        {
          id: 'legal-tender',
          term: 'Legal tender',
          definition: 'A creditor cannot refuse it to settle a debt already owed',
        },
        {
          id: 'network',
          term: 'Network effect',
          definition: 'It is worth holding mainly because everyone around you holds it too',
        },
        {
          id: 'seigniorage',
          term: 'Seigniorage',
          definition: 'The issuer’s profit from creating money more cheaply than its face value',
        },
        {
          id: 'dollarisation',
          term: 'Dollarisation',
          definition: 'A population abandoning its own unit for a foreign one it finds steadier',
        },
      ],
      explanation:
        'These are competing and complementary explanations, not a single theory. Chartalism explains why a specific unit gets traction inside a state; network effects explain why it keeps it, and why a better-run foreign currency can take over anyway once confidence goes.',
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
            'Too strong. Tax liabilities plainly do create demand — it is why a new currency can be launched at all. The case shows it is not the *only* source.',
        },
        {
          id: 'not-only-source',
          label: 'Tax demand is one source of acceptance, not the only one',
        },
        {
          id: 'us-forces',
          label: 'The US must be forcing them to use it',
          feedback:
            'Ecuador adopted the dollar unilaterally in 2000, after its own currency collapsed. The US was not consulted and gains nothing but seigniorage.',
        },
        {
          id: 'gold',
          label: 'The dollar must still be backed by something physical',
          feedback:
            'It is not. Ecuadorians hold dollars for the same reason Americans do — everyone else will take them, and the issuer has kept them reasonably stable.',
        },
      ],
      correctOptionId: 'not-only-source',
      explanation:
        'A currency can be adopted purely because it is a better store of value and everyone else accepts it. Ecuador dollarised after its own currency lost most of its value in a year. Tax liabilities can start a currency; stability and network effects are what keep one alive — and can carry a foreign one across a border where no tax obligation exists at all.',
    },
  ],
});
