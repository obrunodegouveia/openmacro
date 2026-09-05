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
  title: 'What Money Actually Does',
  subtitle: 'Three jobs, and why the thing doing them stopped needing to be valuable.',
  icon: '🪙',
  difficulty: 'intro',
  estimatedMinutes: 5,
  hearts: 3,

  keyTakeaways: [
    'Money is defined by three jobs it performs, not by what it is made of.',
    'Barter fails because it needs a double coincidence of wants — you must find someone who has what you want and wants what you have.',
    'The unit of account is the job people notice least and rely on most: it is what lets prices be compared at all.',
    'Once money is only a claim, its usefulness depends on who owes it and whether they are good for it.',
  ],

  challenges: [
    {
      id: 'mc-barter-problem',
      type: 'multiple_choice',
      tags: ['money-functions', 'foundations'],
      xp: 10,
      prompt: 'You are a baker who wants shoes. The cobbler does not want bread. What exactly is the problem?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'no-value',
          label: 'Bread is worth less than shoes',
          feedback:
            'Relative value is not the obstacle — you could offer many loaves. The trade fails even at a price you both consider fair.',
        },
        {
          id: 'double-coincidence',
          label: 'A trade needs both people to want what the other has, at the same time',
        },
        {
          id: 'perishable',
          label: 'Bread goes stale',
          feedback:
            'That is a real problem, and it is why bread is a poor *store of value*. But the trade fails today, while the bread is still fresh.',
        },
        {
          id: 'no-price',
          label: 'Nobody has agreed a price for bread in shoes',
          feedback:
            'Closer — comparing across goods is genuinely hard. But even with an agreed rate the cobbler still does not want bread.',
        },
      ],
      correctOptionId: 'double-coincidence',
      explanation:
        'This is the double coincidence of wants. Direct exchange requires your want and their want to line up exactly, which almost never happens. Money solves it by splitting one trade into two: you sell bread to whoever wants bread, and buy shoes from the cobbler, who accepts money because he can spend it on anything.',
    },

    {
      id: 'match-money-jobs',
      type: 'concept_match',
      tags: ['money-functions', 'foundations'],
      xp: 15,
      prompt: 'Match each term to what it actually means.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'medium',
          term: 'Medium of exchange',
          definition: 'The thing you hand over so a trade does not need a double coincidence of wants',
        },
        {
          id: 'unit',
          term: 'Unit of account',
          definition: 'The common ruler prices are quoted in, so any two goods can be compared',
        },
        {
          id: 'store',
          term: 'Store of value',
          definition: 'Something that still buys roughly as much next year as it does today',
        },
        {
          id: 'fiduciary',
          term: 'Fiduciary currency',
          definition: 'Money whose value rests on a promise rather than on the material it is made of',
        },
        {
          id: 'commodity',
          term: 'Commodity money',
          definition: 'Money that would still be worth something if nobody accepted it as money',
        },
      ],
      explanation:
        'The three jobs are usually listed together, but they can come apart. In a hyperinflation people keep using the local currency to pay for things while quoting prices in dollars and saving in anything else — the medium of exchange survives after the unit of account and store of value have gone.',
    },

    {
      id: 'order-money-evolution',
      type: 'order_flow',
      tags: ['money-history', 'foundations'],
      xp: 15,
      prompt: 'Put the steps from metal to modern money in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'commodity',
          label: 'People settle on a commodity everyone accepts',
          detail: 'Metal wins on durability and divisibility, not by decree',
        },
        {
          id: 'warehouse',
          label: 'Goldsmiths issue receipts for metal on deposit',
          detail: 'Paper is easier to carry than the thing it represents',
        },
        {
          id: 'circulate',
          label: 'The receipts circulate instead of the metal',
          detail: 'Nobody redeems, because the paper spends just as well',
        },
        {
          id: 'overissue',
          label: 'Issuers notice most metal never leaves the vault',
          detail: 'More receipts are written than there is metal behind them',
        },
        {
          id: 'fiduciary',
          label: 'The link to metal is cut entirely',
          detail: 'What is left is a claim on the issuer and nothing else',
        },
      ],
      correctOrder: ['commodity', 'warehouse', 'circulate', 'overissue', 'fiduciary'],
      explanation:
        'The decisive step is the middle one. Once receipts circulate rather than the metal, the metal is doing no work in daily trade — it is just collateral sitting still. Everything after that is a discovery about how much collateral is actually needed, and the answer kept turning out to be "less than we hold".',
    },

    {
      id: 'mc-what-backs-it',
      type: 'multiple_choice',
      tags: ['fiduciary', 'foundations'],
      xp: 10,
      prompt: 'A modern banknote is not redeemable for anything. So what makes it worth something?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'gold',
          label: 'Gold held by the government',
          feedback:
            'No major currency has been redeemable for gold since 1971. Reserves exist, but you cannot present a note and claim any of it.',
        },
        {
          id: 'confidence',
          label: 'Public confidence, and nothing more concrete than that',
          feedback:
            'Close, but this is the hand-wave this course exists to avoid. Confidence in *what*, exactly? There are concrete obligations underneath.',
        },
        {
          id: 'obligations',
          label: 'Real obligations denominated in it — taxes, debts, wages and contracts',
        },
        {
          id: 'scarcity',
          label: 'The fact that the supply is strictly limited',
          feedback:
            'Supply is not strictly limited — central banks expand it deliberately. Scarcity relative to demand matters for the price level, but it is not what makes a note acceptable in the first place.',
        },
      ],
      correctOptionId: 'obligations',
      explanation:
        'You accept a note because you have obligations you can only discharge with it, and so does everyone you trade with. Rent, taxes, loan repayments and wages are all written in the unit. That web of obligations is what "confidence" actually refers to — and it is why a currency collapses when the obligations start being written in something else.',
    },
  ],
});
