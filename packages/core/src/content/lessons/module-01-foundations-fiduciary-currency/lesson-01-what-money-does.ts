/**
 * ============================================================================
 * Module 1 · Lesson 1 — "Money is a job description, not a substance"
 * ============================================================================
 *
 * Learning objective
 * ------------------
 * The learner should be able to name the three functions money performs, and
 * explain why the thing performing them stopped needing any commodity value of
 * its own.
 *
 * Sources / further reading for reviewers:
 *   - Jevons, "Money and the Mechanism of Exchange" (1875), ch. 1–3 — still the
 *     clearest statement of the double coincidence of wants.
 *   - Bank of England Quarterly Bulletin 2014 Q1, "Money in the modern economy:
 *     an introduction".
 *
 * A note on rigour: the "barter came first, then money" story is a convenient
 * teaching device, not settled economic history — Graeber and others argue
 * credit relationships predate coinage. The lesson deliberately frames barter
 * as a thought experiment about *why the functions matter*, not as a claim
 * about what actually happened. Please keep that framing if you edit it.
 */

import { defineLesson } from '../../schema';

export const whatMoneyDoesLesson = defineLesson({
  id: 'what-money-does',
  title: 'What Money Really Does',
  subtitle: 'Money has three jobs. And the thing doing those jobs no longer needs to be valuable itself.',
  icon: '🪙',
  difficulty: 'intro',
  estimatedMinutes: 5,
  hearts: 3,

  keyTakeaways: [
    'Money is defined by the three jobs it does, not by what it is made of.',
    'Barter fails because both people must want what the other has, at the same time. This is called the “double coincidence of wants”.',
    'The unit of account is the job people notice least but need most: it lets you compare prices at all.',
    'When money is only a promise, its value depends on who made the promise and whether they can keep it.',
  ],

  challenges: [
    {
      id: 'mc-barter-problem',
      type: 'multiple_choice',
      tags: ['money-functions', 'foundations'],
      xp: 10,
      prompt: 'You are a baker and you want shoes. The shoemaker does not want bread. What is the problem?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'no-value',
          label: 'Bread is worth less than shoes',
          feedback:
            'Value is not the problem: you could offer many loaves. The trade fails even at a price you both think is fair.',
        },
        {
          id: 'double-coincidence',
          label: 'A trade needs both people to want what the other has, at the same time',
        },
        {
          id: 'perishable',
          label: 'Bread goes stale',
          feedback:
            'That is a real problem, and it is why bread is a bad store of value. But the trade fails today, while the bread is still fresh.',
        },
        {
          id: 'no-price',
          label: 'Nobody has agreed a price for bread in shoes',
          feedback:
            'Closer: comparing different goods is hard. But even with an agreed price, the shoemaker still does not want bread.',
        },
      ],
      correctOptionId: 'double-coincidence',
      explanation:
        'This is the double coincidence of wants: a direct swap only works if each person wants exactly what the other has. That rarely happens. Money splits one trade into two. You sell bread to someone who wants bread. Then you buy shoes from the shoemaker, who takes money because he can spend it on anything.',
    },

    {
      id: 'match-money-jobs',
      type: 'concept_match',
      tags: ['money-functions', 'foundations'],
      xp: 15,
      prompt: 'Match each term to what it means.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'medium',
          term: 'Medium of exchange',
          definition: 'What you hand over in a trade, so both people do not need to want each other’s goods',
        },
        {
          id: 'unit',
          term: 'Unit of account',
          definition: 'The common measure prices are written in, so any two things can be compared',
        },
        {
          id: 'store',
          term: 'Store of value',
          definition: 'Something that still buys about as much next year as it does today',
        },
        {
          id: 'fiduciary',
          term: 'Fiduciary currency',
          definition: 'Money whose value comes from a promise, not from what it is made of',
        },
        {
          id: 'commodity',
          term: 'Commodity money',
          definition: 'Money that would still be worth something if nobody accepted it as money',
        },
      ],
      explanation:
        'The three jobs usually go together, but they can split apart. In very high inflation, people still pay in the local currency. But they write prices in dollars and save in anything else. So the medium of exchange survives after the other two jobs are gone.',
    },

    {
      id: 'order-money-evolution',
      type: 'order_flow',
      tags: ['money-history', 'foundations'],
      xp: 15,
      prompt: 'Put the steps from metal coins to modern money in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'commodity',
          label: 'People agree on one good that everyone accepts',
          detail: 'Metal wins because it lasts and can be divided, not because of a law',
        },
        {
          id: 'warehouse',
          label: 'Goldsmiths give out paper receipts for metal left with them',
          detail: 'Paper is easier to carry than the metal it stands for',
        },
        {
          id: 'circulate',
          label: 'People pay with the receipts instead of the metal',
          detail: 'Nobody swaps them back for metal, because the paper works just as well',
        },
        {
          id: 'overissue',
          label: 'The issuers notice that most metal never leaves the vault',
          detail: 'So they write more receipts than they have metal',
        },
        {
          id: 'fiduciary',
          label: 'The link to metal is cut completely',
          detail: 'What is left is only a promise from the issuer',
        },
      ],
      correctOrder: ['commodity', 'warehouse', 'circulate', 'overissue', 'fiduciary'],
      explanation:
        'The key step is the middle one. Once people pay with receipts instead of metal, the metal does no work in daily trade. It just sits in the vault. After that, the question is how much metal is really needed, and the answer kept being “less than we have”.',
    },

    {
      id: 'mc-what-backs-it',
      type: 'multiple_choice',
      tags: ['fiduciary', 'foundations'],
      xp: 10,
      prompt: 'You cannot swap a modern banknote for gold or anything else. So why is it worth something?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'gold',
          label: 'Gold held by the government',
          feedback:
            'No major currency could be swapped for gold after 1971. Countries still hold gold, but you cannot bring a note and claim any of it.',
        },
        {
          id: 'confidence',
          label: 'People’s confidence in it, and nothing more solid than that',
          feedback:
            'Close, but too vague. Confidence in what? There are real obligations underneath.',
        },
        {
          id: 'obligations',
          label: 'Real obligations written in it: taxes, debts, wages and contracts',
        },
        {
          id: 'scarcity',
          label: 'The fact that the supply is strictly limited',
          feedback:
            'The supply is not strictly limited: central banks increase it on purpose. Scarcity affects prices, but it is not why people accept a note in the first place.',
        },
      ],
      correctOptionId: 'obligations',
      explanation:
        'You accept a note because you have bills you can only pay with it, and so does everyone you deal with. Rent, taxes, loan payments and wages are all written in euros. This web of obligations is what “confidence” really means. When people start writing these obligations in another currency, the old one collapses.',
    },
  ],
});
