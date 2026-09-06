import { defineLesson } from '../../schema';

/**
 * The first lesson anybody meets. It assumes nothing at all, and its whole job
 * is to make one everyday object strange: the number in a banking app.
 */
export const yourMoneyIsAPromiseLesson = defineLesson({
  id: 'your-money-is-a-promise',
  title: 'The Number in Your Banking App',
  subtitle:
    'You open the app and see €2,400. What exactly is that? It is not cash, and it is not in a box with your name on it.',
  icon: '📱',
  difficulty: 'intro',
  estimatedMinutes: 5,
  hearts: 5,
  challenges: [
    {
      id: 'mc-what-is-it',
      type: 'multiple_choice',
      tags: ['basics', 'deposits'],
      xp: 10,
      prompt: 'Your app says €2,400. What is that number?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'promise',
          label: 'A promise from your bank to give you €2,400 whenever you ask',
        },
        {
          id: 'cash-vault',
          label: '€2,400 of notes, kept for you in the bank’s vault',
          feedback:
            'Have a look at the number of people with accounts at your bank, and imagine the vault. The notes do not exist in anything like that quantity — and they do not need to, because almost nobody asks for them at once.',
        },
        {
          id: 'gold',
          label: 'Gold the bank holds on your behalf',
          feedback:
            'No bank has backed deposits with gold for a very long time. That link was cut everywhere by 1971.',
        },
        {
          id: 'government',
          label: 'Money the government is holding for you',
          feedback:
            'The government is not involved in your current account at all. The promise is your bank’s, which is why it matters which bank it is.',
        },
      ],
      correctOptionId: 'promise',
      explanation:
        'Your balance is an IOU. The bank owes you €2,400 and will hand it over on demand, and that promise is so reliable that we call it "money" and think no more about it. But it is a promise, made by a company — and everything else in this course follows from noticing that.',
    },
    {
      id: 'mc-so-what',
      type: 'multiple_choice',
      tags: ['basics', 'deposits'],
      xp: 15,
      prompt: 'If your balance is a promise, when does that fact ever matter?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'bank-trouble',
          label: 'When the bank gets into trouble — a promise is only as good as whoever made it',
        },
        {
          id: 'never',
          label: 'Never, in practice',
          feedback:
            'It is invisible almost all of the time, which is exactly why it is worth knowing. People discover it on the one day it stops being invisible.',
        },
        {
          id: 'abroad',
          label: 'Only when you travel',
        },
        {
          id: 'interest',
          label: 'Only when you are being paid interest',
        },
      ],
      correctOptionId: 'bank-trouble',
      explanation:
        'This is why deposit guarantees exist — in the EU, €100,000 per person per bank. Somebody had to promise to make the promise good, because a promise from a company that has failed is worth nothing. When you hear that a government "rescued a bank", this is the thing being rescued: the ordinary belief that the number in the app is real.',
    },
    {
      id: 'match-kinds-of-money',
      type: 'concept_match',
      tags: ['basics', 'money'],
      xp: 15,
      prompt: 'Three things we all call "money". Match each to whose promise it is.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'notes',
          term: 'A €20 note in your pocket',
          definition: 'A promise from the central bank — the only kind you can hold',
        },
        {
          id: 'deposit',
          term: 'The balance in your app',
          definition: 'A promise from your commercial bank, and most of the money you use',
        },
        {
          id: 'card',
          term: 'Tapping your card',
          definition: 'Not money at all — just an instruction to move somebody’s promise',
        },
      ],
      explanation:
        'Almost all the money in the euro area is the second kind: promises from ordinary commercial banks. Notes are a small fraction of it. So when people ask "how much money is there", they are mostly asking about how much banks have promised — which turns out to be a question about lending, and that is the next lesson.',
    },
  ],
  keyTakeaways: [
    'Your bank balance is a promise from your bank, not cash set aside for you.',
    'That promise is so dependable we call it money and stop thinking about it.',
    'It matters when the bank is in trouble, which is why deposit guarantees exist.',
    'Most of the money in use is bank promises, not notes.',
  ],
});
