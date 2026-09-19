/**
 * ============================================================================
 * Module 4 · Lesson 5 — "Banks hold their government's debt"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to describe the sovereign–bank doom loop in both
 * directions and explain why it is far more dangerous inside a currency union.
 *
 * Sources / further reading for reviewers:
 *   - Brunnermeier et al., "The Sovereign-Bank Diabolic Loop and ESBies" (2016).
 *   - ESRB reports on sovereign exposures and the zero risk weight.
 *
 * A note on rigour: the zero risk weight on sovereign exposures is a
 * regulatory choice that survived the euro crisis for political reasons.
 * Saying so is not editorialising — it is the standard account, and a learner
 * who thinks the weight reflects measured risk will not understand why the
 * loop persists.
 */

import { defineLesson } from '../../schema';

export const doomLoopLesson = defineLesson({
  id: 'doom-loop',
  title: 'The Doom Loop',
  subtitle: 'Banks hold their government’s bonds; the government stands behind the banks.',
  icon: '🔄',
  difficulty: 'advanced',
  estimatedMinutes: 7,
  hearts: 3,

  keyTakeaways: [
    'Banks hold large amounts of their own sovereign’s debt, so a sovereign’s trouble is immediately theirs.',
    'Governments stand behind their banks, so a banking crisis becomes a fiscal one.',
    'Each direction amplifies the other, which is what makes it a loop rather than a shock.',
    'Inside a currency union it is far worse, because the sovereign cannot create the money to pay.',
  ],

  challenges: [
    {
      id: 'order-doom-loop',
      type: 'order_flow',
      tags: ['doom-loop', 'crisis'],
      xp: 25,
      prompt: 'Trace the loop from a sovereign scare to a credit crunch.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'yields',
          label: 'Doubts about the government push its bond prices down',
          detail: 'Yields rise on a deficit or a political shock',
        },
        {
          id: 'losses',
          label: 'Domestic banks take losses on the bonds they hold',
          detail: 'Their largest single exposure is usually their own sovereign',
        },
        {
          id: 'capital',
          label: 'Their capital falls and they cut lending',
          detail: 'Less capital means fewer loans they are permitted to make',
        },
        {
          id: 'recession',
          label: 'The economy weakens and tax revenue falls',
          detail: 'The credit crunch is felt by firms with nothing to do with bonds',
        },
        {
          id: 'worse',
          label: 'The fiscal position deteriorates further',
          detail: 'Which was the original worry — now with evidence',
        },
      ],
      correctOrder: ['yields', 'losses', 'capital', 'recession', 'worse'],
      explanation:
        'The loop closes at the last step: the fear about the sovereign helped make the sovereign’s position worse. It runs the other way too — a banking crisis that requires rescue lands on the same public finances, which is how Ireland turned a property bust into a sovereign crisis in 2010. Either entry point produces the same spiral.',
    },

    {
      id: 'mc-why-banks-hold',
      type: 'multiple_choice',
      tags: ['doom-loop', 'regulation'],
      xp: 20,
      prompt: 'Why do banks hold so much of their own government’s debt?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'patriotism',
          label: 'Patriotic duty',
          feedback:
            'Governments do lean on banks in a crisis, and it has a name — financial repression. But the standing incentive is structural rather than moral.',
        },
        {
          id: 'zero-weight',
          label: 'It is treated as risk-free in capital rules, so holding it costs no capital',
        },
        {
          id: 'highest-yield',
          label: 'It pays the highest yield available',
          feedback:
            'Government debt pays less than almost anything else a bank could lend against. Yield is not the attraction.',
        },
        {
          id: 'required',
          label: 'They are legally required to',
          feedback:
            'Liquidity rules require holdings of high-quality liquid assets, which sovereign bonds satisfy — but nothing requires it to be *their own* sovereign.',
        },
      ],
      correctOptionId: 'zero-weight',
      explanation:
        'Basel rules let banks assign a zero risk weight to their own sovereign’s debt in its own currency, so it can be held with no capital against it. That is a powerful subsidy, and it survived the euro crisis — where the assumption of risk-free was demonstrably false — because forcing banks to hold capital against their own government’s bonds would have raised borrowing costs for exactly the governments least able to bear it. The loop is regulated into existence and left in place for political reasons.',
    },

    {
      id: 'mc-currency-union',
      type: 'multiple_choice',
      tags: ['doom-loop', 'currency-union'],
      xp: 20,
      prompt: 'Why is the loop worse for Italy than for the UK, with similar debt ratios?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'debt',
          label: 'Italy simply owes more',
          feedback:
            'The premise fixes debt ratios as comparable. Something other than the quantity is doing the work.',
        },
        {
          id: 'cannot-issue',
          label: 'Italy owes euros it cannot create; the UK owes pounds it can',
        },
        {
          id: 'growth',
          label: 'The UK grows faster',
          feedback:
            'Growth matters for debt sustainability, but it is not what makes the *loop* differ in kind rather than degree.',
        },
        {
          id: 'ecb-hostile',
          label: 'The ECB refuses to help Italy',
          feedback:
            'The ECB built OMT and has bought Italian debt in large quantities. The structural point stands regardless of willingness.',
        },
      ],
      correctOptionId: 'cannot-issue',
      explanation:
        'A government borrowing in a currency it issues can always repay in nominal terms — default becomes a choice, and the market prices inflation risk rather than credit risk. A euro area member cannot: it must obtain euros through taxation or borrowing like a household. So Italian bonds carry genuine default risk, which means Italian banks holding them carry genuine credit risk, which means the loop actually closes. This is the same distinction Module 3 drew about fragmentation, seen from the banks’ side.',
    },

    {
      id: 'match-doom-loop-fixes',
      type: 'concept_match',
      tags: ['doom-loop', 'policy'],
      xp: 15,
      prompt: 'Match each proposed fix to what it does.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'concentration',
          term: 'Concentration limits',
          definition: 'Cap how much of one sovereign’s debt a single bank may hold',
        },
        {
          id: 'riskweight',
          term: 'Positive risk weights',
          definition: 'Require capital against sovereign exposures, ending the free treatment',
        },
        {
          id: 'banking-union',
          term: 'Banking union',
          definition: 'Move supervision and resolution above the national level',
        },
        {
          id: 'deposit-insurance',
          term: 'Common deposit insurance',
          definition: 'Guarantee deposits at the union level so the guarantee does not depend on the state',
        },
        {
          id: 'safe-asset',
          term: 'A common safe asset',
          definition: 'Give banks something to hold that is not any single government’s debt',
        },
      ],
      explanation:
        'Every one of these has been proposed and none is fully in place, which tells you the obstacle is political rather than technical. Each fix shifts risk from one member state to the group, and creditor countries have consistently declined. The euro area therefore lives with a loop it has diagnosed precisely and chosen not to cut — which is worth knowing when the next episode arrives.',
    },
  ],
});
