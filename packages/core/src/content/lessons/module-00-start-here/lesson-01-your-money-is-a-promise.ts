import { defineLesson } from '../../schema';

/**
 * The first lesson anybody meets. It assumes nothing at all, and its whole job
 * is to make one everyday object strange: the number in a banking app.
 */
export const yourMoneyIsAPromiseLesson = defineLesson({
  id: 'your-money-is-a-promise',
  title: 'The Number in Your Banking App',
  subtitle:
    'You open the app and see €2,400. What is that, exactly? It is not cash, and it is not in a box with your name on it.',
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
            'Think of how many people have accounts at your bank. The vault does not hold notes for all of them. It does not need to, because almost nobody asks for their money at the same time.',
        },
        {
          id: 'gold',
          label: 'Gold the bank holds on your behalf',
          feedback:
            'Banks stopped backing deposits with gold a long time ago. By 1971 that link was gone everywhere.',
        },
        {
          id: 'government',
          label: 'Money the government is holding for you',
          feedback:
            'The government has nothing to do with your current account. The promise comes from your bank, so it matters which bank you use.',
        },
      ],
      correctOptionId: 'promise',
      explanation:
        'Your balance is an IOU (“I owe you”): the bank owes you €2,400 and will pay it whenever you ask. The promise is so reliable that we just call it “money”. But it is still a promise made by a company, and the rest of this course starts from that fact.',
    },
    {
      id: 'mc-so-what',
      type: 'multiple_choice',
      tags: ['basics', 'deposits'],
      xp: 15,
      prompt: 'Your balance is a promise from your bank. When does that matter?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'bank-trouble',
          label: 'When the bank is in trouble, because a promise is only as good as the one who made it',
        },
        {
          id: 'never',
          label: 'Never, in practice',
          feedback:
            'You almost never notice it, and that is why it is worth knowing. People find out on the one day it suddenly matters.',
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
        'This is why deposit guarantees exist. In the EU, up to €100,000 per person per bank is guaranteed. Someone has to back the bank’s promise, because the promise of a failed company is worth nothing. When a government “rescues a bank”, this is what it is protecting: people’s trust that the number in the app is real.',
    },
    {
      id: 'match-kinds-of-money',
      type: 'concept_match',
      tags: ['basics', 'money'],
      xp: 15,
      prompt: 'We call all three of these “money”. Match each one to whose promise it is.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'notes',
          term: 'A €20 note in your pocket',
          definition: 'A promise from the central bank, and the only kind you can hold in your hand',
        },
        {
          id: 'deposit',
          term: 'The balance in your app',
          definition: 'A promise from your commercial bank, and most of the money you use',
        },
        {
          id: 'card',
          term: 'Tapping your card',
          definition: 'Not money at all: just an instruction to move someone’s promise',
        },
      ],
      explanation:
        'Almost all the money in the euro area is the second kind: promises from ordinary banks. Notes are only a small part of it. So “how much money is there?” is mostly a question about how much banks have promised. That depends on lending, which is the next lesson.',
    },
  ],
  keyTakeaways: [
    'Your bank balance is a promise from your bank, not cash set aside for you.',
    'That promise is so reliable that we call it money and stop thinking about it.',
    'It matters when the bank is in trouble, which is why deposit guarantees exist.',
    'Most of the money in use is bank promises, not notes.',
  ],
});
