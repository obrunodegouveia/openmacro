import { defineLesson } from '../../schema';

/**
 * Solvency and liquidity, and the 2023 case that showed how fast the second
 * now moves.
 *
 * Figures: Silicon Valley Bank saw roughly $42bn of withdrawal requests in a
 * single day on 9 March 2023 and was closed the next morning; around 94% of
 * its deposits were above the $250,000 insured limit. Deposit insurance
 * covers €100,000 in the EU.
 */
export const theRunIsALiquidityEventLesson = defineLesson({
  id: 'the-run-is-a-liquidity-event',
  title: 'Solvent on Thursday, Closed on Friday',
  subtitle:
    'A bank does not fail when its assets are worth less than its debts. It fails when it cannot pay today.',
  icon: '🚪',
  difficulty: 'advanced',
  estimatedMinutes: 11,
  challenges: [
    {
      id: 'mc-svb',
      type: 'multiple_choice',
      tags: ['bank-run', 'liquidity', 'history'],
      xp: 30,
      prompt:
        'Silicon Valley Bank held government bonds that would have repaid in full at maturity. It failed anyway. What was the mechanism?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'forced-sale',
          label: 'Withdrawals forced it to sell them early',
        },
        {
          id: 'default',
          label: 'The bonds it held defaulted and stopped paying',
          feedback:
            'They were US Treasuries and agency securities. Not one missed a payment. That is what makes the case instructive: a bank can be destroyed by assets that perform exactly as promised.',
        },
        {
          id: 'fraud',
          label: 'Fraud that had concealed the true position',
          feedback:
            'The losses were disclosed and visible in the filings. Anyone reading them could see the duration mismatch — several people did, publicly, before it failed.',
        },
        {
          id: 'lending',
          label: 'Bad lending to start-ups that could not repay',
          feedback:
            'The loan book was not the problem. The securities portfolio was, and it was full of the safest instruments in existence.',
        },
      ],
      correctOptionId: 'forced-sale',
      explanation:
        'Rates rose, long bonds fell in price, and the loss was unrealised so long as nobody had to sell. Then depositors asked for their money — roughly $42bn in one day — and selling to pay them converted the paper loss into a realised one large enough to wipe out the capital. Interest rate risk became credit-free insolvency by way of a liquidity event. Hold that sequence: it is the same one in 1866, 1907 and 2008, running faster.',
    },
    {
      id: 'order-modern-run',
      type: 'order_flow',
      tags: ['bank-run', 'liquidity'],
      xp: 30,
      prompt: 'Put a modern run in order.',
      instructions: 'Drag the steps into causal order',
      events: [
        { id: 'losses', label: 'Rates rise and the securities book falls in value', detail: 'Unrealised, and disclosed' },
        { id: 'raise', label: 'The bank announces a capital raise to cover the gap', detail: 'Intended to reassure' },
        { id: 'signal', label: 'The announcement is read as an admission' },
        { id: 'coordinate', label: 'Depositors message each other and move at once', detail: 'Hours, not days — the queue is an app' },
        { id: 'sell', label: 'Assets are sold at a loss to meet the outflow' },
        { id: 'close', label: 'The supervisor closes the bank before Monday' },
      ],
      correctOrder: ['losses', 'raise', 'signal', 'coordinate', 'sell', 'close'],
      explanation:
        'Two steps are new and both are about speed. The capital raise as trigger is old — telling the market you need money is telling it you have a hole — but coordination is now instantaneous, and a bank whose depositors share a group chat has no time to arrange anything. The nineteenth-century queue took days and could be out-waited. This one was over inside a working day, which is why supervisors now talk about the run rate rather than the run.',
    },
    {
      id: 'mc-uninsured',
      type: 'multiple_choice',
      tags: ['deposit-insurance', 'bank-run'],
      xp: 35,
      prompt:
        'Around 94% of SVB’s deposits were above the insured limit. Why does that share matter more than the size of the bank?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'incentive',
          label: 'An insured depositor has no reason to run; an uninsured one has every reason to run first',
        },
        {
          id: 'size',
          label: 'Large depositors hold more money, so the outflow is bigger',
          feedback:
            'True and secondary. The decisive property is the incentive: a depositor who will be made whole either way has nothing to gain from being early, and the whole logic of the run rests on that.',
        },
        {
          id: 'sophistication',
          label: 'Large depositors are more sophisticated and spot problems earlier',
          feedback:
            'They often are. But even an unsophisticated depositor above the limit should run at the first rumour, and that is the point — you do not need to be right, only early.',
        },
        {
          id: 'regulation',
          label: 'Uninsured deposits attract higher capital requirements',
          feedback:
            'They do not. The funding structure is a supervisory concern rather than a capital charge, which is part of what the 2023 failures exposed.',
        },
      ],
      correctOptionId: 'incentive',
      explanation:
        'Deposit insurance works by removing the reason to be first, not by having enough money to pay everyone — that is why it can stop a run it could never fund. Invert it and you have a bank whose funding is entirely made of people for whom running is the rational move. A supervisor who knows the insured share of a bank’s deposits knows more about its fragility than one who knows its capital ratio.',
    },
    {
      id: 'match-liquidity-rules',
      type: 'concept_match',
      tags: ['lcr', 'nsfr', 'liquidity'],
      xp: 30,
      prompt: 'Basel added two liquidity rules after 2008. Match each to what it asks.',
      instructions: 'Tap a term, then its definition',
      pairs: [
        {
          id: 'lcr',
          term: 'Liquidity coverage ratio',
          definition: 'Enough assets that can be sold or pledged instantly to survive thirty days of heavy outflow',
        },
        {
          id: 'nsfr',
          term: 'Net stable funding ratio',
          definition: 'Long assets funded by funding that is also long — a limit on the maturity mismatch itself',
        },
        {
          id: 'hqla',
          term: 'High-quality liquid assets',
          definition: 'What counts for the first test: central bank reserves and the government bonds a central bank will lend against',
        },
      ],
      explanation:
        'Note what the definition of a liquid asset rests on: it is liquid because the central bank will take it. That is not a market fact, it is a policy choice, and it means the supervisor writing the liquidity rule and the central bank writing the collateral framework are deciding the same thing from two directions. The next module is about the other direction.',
    },
  ],
  keyTakeaways: [
    'Assets that repay in full can still destroy a bank if it is forced to sell them early.',
    'Deposit insurance works by removing the reason to be first, not by funding everyone.',
    'A bank funded by uninsured deposits is fragile regardless of its capital ratio.',
    'An asset is liquid because the central bank will lend against it — which makes liquidity a policy choice.',
  ],
});
