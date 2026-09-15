import { defineLesson } from '../../schema';

/** Video 11. Three banks, three reserve ratios, three currencies — and the central bank invented to fix all three. */
export const kabAReserveBankLesson = defineLesson({
  id: 'kab-a-reserve-bank',
  title: 'Why Banks Invented a Bank for Banks',
  subtitle:
    'One reckless bank can run every other bank. Pooling the gold in one vault fixes that — and fixes the currency too.',
  icon: '🏦',
  difficulty: 'core',
  estimatedMinutes: 17,
  video: {
    url: 'https://www.youtube.com/watch?v=M-4GWomLbpc',
    minutes: 11,
    source: 'Khan Academy — Banking 11',
  },
  challenges: [
    {
      id: 'mc-weak-link',
      type: 'multiple_choice',
      tags: ['central-banking', 'contagion'],
      xp: 25,
      prompt:
        'One bank keeps 8% reserves; the others keep 10% and 12%. The 8% bank fails when 9% of depositors want their money. Why is that everyone’s problem?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'contagion',
          label:
            'Depositors cannot tell prudent banks from reckless ones, so they run on all of them',
        },
        {
          id: 'lent-to',
          label: 'Because the other banks had lent to it',
          feedback:
            'Interbank exposure is a real channel, but not the one in this example. The contagion here is pure confidence: the buildings all look alike.',
        },
        {
          id: 'same-gold',
          label: 'Because all three share the same gold',
          feedback:
            'They do not yet — that is the solution the video is about to propose, not the problem.',
        },
        {
          id: 'regulation',
          label: 'Because regulators force the others to match the weakest bank',
          feedback:
            'No such rule is described. The damage spreads through depositors’ fear, which needs no regulator to transmit it.',
        },
      ],
      correctOptionId: 'contagion',
      explanation:
        'The bitter detail is that the failure was avoidable: the 12% bank had surplus gold and would gladly have lent 1% to prevent a systemic run. What is missing is a mechanism for that lending to happen — which is precisely what a reserve bank provides.',
    },
    {
      id: 'order-central-bank',
      type: 'order_flow',
      tags: ['central-banking', 'reserves'],
      xp: 25,
      prompt: 'Put the invention of a reserve bank in order.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'problems', label: 'Three problems appear', detail: 'Inconsistent ratios, contagious runs, competing currencies' },
        { id: 'pool', label: 'All banks move their gold to one vault' },
        { id: 'accounts', label: 'Their reserves become accounts at the reserve bank', detail: 'Rather than metal in their own vaults' },
        { id: 'lend', label: 'A short bank borrows from the pool', detail: 'Instead of failing while others sit on surplus' },
        { id: 'monopoly', label: 'Only the reserve bank may issue notes', detail: 'One currency instead of three' },
        { id: 'shift', label: 'Reserves come to mean those notes, not gold' },
      ],
      correctOrder: ['problems', 'pool', 'accounts', 'lend', 'monopoly', 'shift'],
      explanation:
        'The last step is the quiet one that matters most. Once commercial banks hold central bank notes as their reserves, the gold is an ornament sitting in a vault — and the system has already become fiat in everything but name. Video 17 returns to finish that thought.',
    },
    {
      id: 'match-problems-fixes',
      type: 'concept_match',
      tags: ['central-banking', 'regulation'],
      xp: 30,
      prompt: 'The video finds three separate faults in a world of independent banks. Match each to the part of a reserve bank that answers it.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'ratios',
          term: 'Every bank sets its own ratio',
          definition: 'One authority sets a minimum for all of them, so the recklessness of the worst is capped',
        },
        {
          id: 'runs',
          term: 'Runs spread between banks',
          definition: 'Reserves sit in one pooled vault, so a bank short of gold today can borrow from banks holding a surplus',
        },
        {
          id: 'currency',
          term: 'Three banks, three currencies',
          definition: 'Only one institution may issue, so there is a single currency and no exchange rates between hometown banks',
        },
      ],
      explanation:
        'A central bank is not one invention but three, bolted together for three different reasons — regulator, lender of last resort, and monopoly issuer. They are separable in principle and history has tried them apart; the Federal Reserve of 1913 was assembled from exactly these three complaints, and the last of them is why American currency stopped saying the name of a local bank.',
    },
    {
      id: 'mc-reserves-become-accounts',
      type: 'multiple_choice',
      tags: ['central-banking', 'reserves'],
      xp: 35,
      prompt:
        'Once the three banks pool their gold, the video says something quiet with enormous consequences. What has happened to what the word "reserves" means for an ordinary bank?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'accounts',
          label: 'They are a balance at the reserve bank, not metal in its vault',
        },
        {
          id: 'gone',
          label: 'It no longer needs reserves, since the central bank will always lend',
          feedback:
            'It needs them just as much, and the central bank sets the minimum. What changed is the form they take, not whether they are required.',
        },
        {
          id: 'notes',
          label: 'Its reserves are the loans on its own balance sheet',
          feedback:
            'Loans were never reserves — they cannot be handed to a depositor who wants cash today. That distinction survives the reorganisation intact.',
        },
        {
          id: 'shared',
          label: 'The banks now jointly own all the gold, so no individual bank has reserves',
          feedback:
            'Each bank has its own claim on the pool, recorded as its own balance. Pooled custody is not shared ownership.',
        },
      ],
      correctOptionId: 'accounts',
      explanation:
        'This is the hinge of the entire module. A commercial bank’s reserves stop being a thing it possesses and become a claim on somebody else — and once the notes of the reserve bank circulate widely enough, nobody bothers asking for the gold behind them. The system has become fiat before anyone announces it, which is exactly the argument video 17 picks up.',
    },
    {
      id: 'mc-why-not-just-lend',
      type: 'multiple_choice',
      tags: ['central-banking', 'contagion', 'liquidity'],
      xp: 35,
      prompt:
        'Sal points out the 12% bank would obviously rather lend the 8% bank 1% of gold than face a run on itself. If it is so obviously in its interest, why does it need a central bank to make it happen?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'cannottell',
          label: 'In a panic it cannot tell a bank short for a day from one that is bust',
        },
        {
          id: 'greedy',
          label: 'Because banks compete, and would rather watch a rival go under',
          feedback:
            'The video’s own argument rules this out: the rival’s failure brings a run on you too, so letting it fail is not in your interest. Something other than appetite is blocking the loan.',
        },
        {
          id: 'illegal',
          label: 'Because banks were not allowed to lend to each other',
          feedback:
            'Nothing forbade it, and interbank lending long predates central banks. What was missing was the information and the speed to do it in a panic.',
        },
        {
          id: 'nogold',
          label: 'Because the 12% bank would not have enough spare gold',
          feedback:
            'It holds 12% precisely to be able to cover a bad day, and the shortfall is 1%. The gold is there; the willingness to part with it, on that day, to that borrower, is not.',
        },
      ],
      correctOptionId: 'cannottell',
      explanation:
        'Everything is obvious afterwards and nothing is obvious at the time. The lender cannot value another bank’s loan book overnight, and a panic gives it hours. So the rational move is to keep your own gold and let the neighbour fall, even knowing the fall may take you with it — a coordination failure, not a failure of nerve. A central bank solves it by being the one institution that can inspect the books, lend instantly against them, and accept the risk of being wrong. Bagehot’s rule, written forty years before the Fed existed, is the same idea: lend freely, against good collateral, at a penalty rate.',
    },
  ],
  keyTakeaways: [
    'One weak bank can run the whole system, because depositors cannot tell banks apart.',
    'Pooling reserves lets surplus banks fund short ones instead of watching them fail.',
    'A note monopoly gives one currency; reserves then become central bank money.',
  ],
});
