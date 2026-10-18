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
        'Three banks keep reserves of 8%, 10% and 12% of their deposits. One day, depositors at the 8% bank ask for 9% of its deposits. It cannot pay, and it fails. Why is that a problem for the other two banks?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'contagion',
          label:
            'Depositors cannot tell careful banks from reckless ones, so they rush to withdraw from all of them',
        },
        {
          id: 'lent-to',
          label: 'Because the other banks had lent to it',
          feedback:
            'Banks lending to each other is a real way for trouble to spread, but not the one in this example. Here it spreads through confidence alone: from the outside, all banks look alike.',
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
        'The bitter detail is that the failure was avoidable: the 12% bank had spare gold and would gladly have lent the missing 1% to prevent a run on every bank. What is missing is a way for that loan to happen — which is exactly what a reserve bank provides.',
    },
    {
      id: 'order-central-bank',
      type: 'order_flow',
      tags: ['central-banking', 'reserves'],
      xp: 25,
      prompt: 'Put the invention of a reserve bank in order, as the video tells it: the problems first, then the shared vault, then the fix for runs, then the fix for the currency.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'problems', label: 'Three problems appear', detail: 'Inconsistent ratios, contagious runs, competing currencies' },
        { id: 'pool', label: 'All banks move their gold to one vault' },
        { id: 'accounts', label: 'Their reserves become accounts at the reserve bank', detail: 'Rather than metal in their own vaults' },
        { id: 'lend', label: 'A bank short of gold borrows from the pool', detail: 'Instead of failing while others sit on spare gold' },
        { id: 'monopoly', label: 'Only the reserve bank may issue notes', detail: 'One currency instead of three' },
        { id: 'shift', label: 'Reserves come to mean those notes, not gold' },
      ],
      correctOrder: ['problems', 'pool', 'accounts', 'lend', 'monopoly', 'shift'],
      explanation:
        'The last step is the quiet one that matters most. Once commercial banks hold central bank notes as their reserves, the gold just sits in a vault as decoration — and the system is already fiat money in everything but name. Video 17 returns to finish that thought.',
    },
    {
      id: 'match-problems-fixes',
      type: 'concept_match',
      tags: ['central-banking', 'regulation'],
      xp: 30,
      prompt: 'The video finds three separate faults in a world of independent banks. Match each fault to the part of a reserve bank that fixes it.',
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
          definition: 'Only one institution may issue notes, so there is a single currency and no exchange rates between the notes of different local banks',
        },
      ],
      explanation:
        'A central bank is not one invention but three, joined together for three different reasons — regulator, lender of last resort, and sole issuer of notes. They can be separated in principle, and history has tried them apart. The Federal Reserve, created in 1913, answered complaints very like these, and the last of them is why US notes eventually stopped carrying the names of local banks.',
    },
    {
      id: 'mc-reserves-become-accounts',
      type: 'multiple_choice',
      tags: ['central-banking', 'reserves'],
      xp: 35,
      prompt:
        'Once the three banks pool their gold, the video says something quiet with enormous consequences. What does the word "reserves" now mean for an ordinary bank?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'accounts',
          label: 'A balance it holds at the reserve bank, not metal in its own vault',
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
        'Sal points out that the 12% bank would clearly rather lend the 8% bank the missing gold than face a run itself. If that is so clearly in its interest, why is a central bank needed to make it happen?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'cannottell',
          label: 'In a panic, it cannot tell a bank that is only short of cash for a day from one that is bust',
        },
        {
          id: 'greedy',
          label: 'Because banks compete, and would rather watch a rival go under',
          feedback:
            'The video’s own argument rules this out: the rival’s failure brings a run on you too, so letting it fail is not in your interest. Something other than rivalry is blocking the loan.',
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
            'It holds 12% precisely to cover a bad day, and the shortfall is only 1%. The gold is there; what is missing is the confidence to hand it over, on that day, to that borrower.',
        },
      ],
      correctOptionId: 'cannottell',
      explanation:
        'Everything is obvious afterwards and nothing is obvious at the time. A bank cannot check another bank’s loans overnight, and a panic gives it only hours. So the sensible move for each bank alone is to keep its gold and let the neighbour fall, even knowing the fall may take it down too — a failure of coordination, not of nerve. A central bank solves this by being the one institution that can inspect the books, lend at once, and accept the risk of being wrong. Bagehot’s rule, written forty years before the Fed existed, is the same idea: in a panic, lend freely, against good collateral, at a high (penalty) rate.',
    },
  ],
  keyTakeaways: [
    'One weak bank can run the whole system, because depositors cannot tell banks apart.',
    'Pooling reserves lets surplus banks fund short ones instead of watching them fail.',
    'A note monopoly gives one currency; reserves then become central bank money.',
  ],
});
