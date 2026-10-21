import { defineLesson } from '../../schema';

/** Video 11. Three banks, three reserve ratios, three currencies — and the central bank invented to fix all three. */
export const kabAReserveBankLesson = defineLesson({
  id: 'kab-a-reserve-bank',
  title: 'Why Banks Invented a Bank for Banks',
  subtitle:
    'One careless bank can cause a run on every other bank. Putting all the gold in one shared vault fixes that. It also gives everyone one currency.',
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
            'Depositors cannot tell which banks are safe, so they run on all of them',
        },
        {
          id: 'lent-to',
          label: 'Because the other two banks had lent it a lot of money',
          feedback:
            'Banks lending to each other is a real way for trouble to spread. But it is not what happens here. Here only fear spreads: from the outside, all banks look the same.',
        },
        {
          id: 'same-gold',
          label: 'Because all three banks keep their gold in one shared vault',
          feedback:
            'Not yet. Sharing the gold is the solution the video is about to suggest, not the problem.',
        },
        {
          id: 'regulation',
          label: 'Because regulators force the others to match the weakest bank',
          feedback:
            'The video describes no such rule. The damage spreads through depositors’ fear, and fear needs no regulator.',
        },
      ],
      correctOptionId: 'contagion',
      explanation:
        'The sad part is that this failure could have been avoided. The 12% bank had spare gold and would happily have lent the missing 1%. It wanted to avoid a run on itself. What was missing was a way to make that loan happen. A reserve bank gives that.',
    },
    {
      id: 'order-central-bank',
      type: 'order_flow',
      tags: ['central-banking', 'reserves'],
      xp: 25,
      prompt: 'Put the steps that create a reserve bank in order, as the video tells it. First the problems, then the shared vault, then the fix for runs, then the fix for the currency.',
      instructions: 'Drag the steps into order',
      events: [
        { id: 'problems', label: 'Three problems appear', detail: 'Different reserve ratios, runs that spread, and too many currencies' },
        { id: 'pool', label: 'All banks move their gold to one vault' },
        { id: 'accounts', label: 'Their reserves become accounts at the reserve bank', detail: 'Instead of gold in their own vaults' },
        { id: 'lend', label: 'A bank short of gold borrows from the pool', detail: 'Instead of failing while other banks have spare gold' },
        { id: 'monopoly', label: 'Only the reserve bank may print notes', detail: 'One currency instead of three' },
        { id: 'shift', label: 'Reserves come to mean those notes, not gold' },
      ],
      correctOrder: ['problems', 'pool', 'accounts', 'lend', 'monopoly', 'shift'],
      explanation:
        'The last step seems small, but it matters most. Once banks keep central bank notes as their reserves, the gold just sits in a vault. Nobody uses it. The system is already paper money (fiat money) in practice. Video 17 comes back to this.',
    },
    {
      id: 'match-problems-fixes',
      type: 'concept_match',
      tags: ['central-banking', 'regulation'],
      xp: 30,
      prompt: 'The video finds three problems when every bank works on its own. Match each problem to the part of a reserve bank that fixes it.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'ratios',
          term: 'Every bank sets its own ratio',
          definition: 'One authority sets a minimum for all banks, so even the most careless bank must keep some reserves',
        },
        {
          id: 'runs',
          term: 'Runs spread between banks',
          definition: 'All reserves are kept in one shared vault, so a bank short of gold today can borrow from banks with spare gold',
        },
        {
          id: 'currency',
          term: 'Three banks, three currencies',
          definition: 'Only one bank may print notes, so there is one currency and no swapping between different banks’ notes',
        },
      ],
      explanation:
        'A central bank does three jobs: it sets rules, it lends to banks in trouble (lender of last resort), and it is the only one that prints notes. The US Federal Reserve was created in 1913 to solve problems very like these. The last job is why US notes stopped showing the names of local banks.',
    },
    {
      id: 'mc-reserves-become-accounts',
      type: 'multiple_choice',
      tags: ['central-banking', 'reserves'],
      xp: 35,
      prompt:
        'Once the three banks put their gold in one vault, something small but very important changes. What does the word “reserves” now mean for an ordinary bank?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'accounts',
          label: 'A balance it holds at the reserve bank, not metal in its own vault',
        },
        {
          id: 'gone',
          label: 'It no longer needs reserves, because the central bank will always lend',
          feedback:
            'It needs them just as much, and the central bank sets the minimum. What changed is the form of the reserves, not the need for them.',
        },
        {
          id: 'notes',
          label: 'Its reserves are the loans on its own balance sheet',
          feedback:
            'Loans were never reserves. You cannot give a loan to a depositor who wants cash today. That is still true after the change.',
        },
        {
          id: 'shared',
          label: 'The banks now jointly own all the gold, so no individual bank has reserves',
          feedback:
            'Each bank has its own claim on the vault, written down as its own balance. Keeping gold in the same place does not mean owning it together.',
        },
      ],
      correctOptionId: 'accounts',
      explanation:
        'This is the key idea of the whole module. A bank’s reserves stop being gold it owns. They become money it is owed by the reserve bank. Once the reserve bank’s notes are used everywhere, nobody asks for the gold behind them. The system has become paper money before anyone says so. Video 17 picks up this idea.',
    },
    {
      id: 'mc-why-not-just-lend',
      type: 'multiple_choice',
      tags: ['central-banking', 'contagion', 'liquidity'],
      xp: 35,
      prompt:
        'Sal says the 12% bank would rather lend the missing gold to the 8% bank than face a run itself. If that is clearly good for it, why is a central bank needed to make the loan happen?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'cannottell',
          label: 'In a panic, it cannot tell if the other bank is just short of cash or broke',
        },
        {
          id: 'greedy',
          label: 'Because banks compete, and would rather watch a rival fail',
          feedback:
            'The video already rules this out: if the rival fails, people run on you too. So letting it fail does not help you. Something else is stopping the loan.',
        },
        {
          id: 'illegal',
          label: 'Because banks were not allowed to lend to each other',
          feedback:
            'Nothing stopped it, and banks lent to each other long before central banks existed. What was missing was the information and the speed to do it in a panic.',
        },
        {
          id: 'nogold',
          label: 'Because the 12% bank would not have enough spare gold',
          feedback:
            'It keeps 12% exactly for bad days, and only 1% is missing. The gold is there. What is missing is the trust to hand it over, on that day, to that bank.',
        },
      ],
      correctOptionId: 'cannottell',
      explanation:
        'It is easy to see the answer later, but hard in the moment. A bank cannot check another bank’s loans overnight, and a panic gives it only hours. So each bank, alone, keeps its gold and lets the other bank fall, even if that hurts it too. A central bank solves this. It can check the books, lend at once and take the risk. An old rule from Walter Bagehot says the same: in a panic, lend freely, against good security, at a higher interest rate than usual.',
    },
  ],
  keyTakeaways: [
    'One weak bank can cause runs on all banks, because depositors cannot tell which banks are safe.',
    'With shared reserves, banks with spare gold can lend to banks that are short, instead of watching them fail.',
    'When only one bank may print notes, there is one currency. Then bank reserves become money held at the central bank.',
  ],
});
