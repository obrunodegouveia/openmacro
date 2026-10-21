import { defineLesson } from '../../schema';

/**
 * Video 4. The question left hanging by the multiplier: is the extra money a
 * shell game? The answer turns on whether the projects were real.
 */
export const kabIsItRealWealthLesson = defineLesson({
  id: 'kab-is-it-real-wealth',
  title: 'Is the Extra Money Real?',
  subtitle:
    'Deposits nearly tripled. Is that real wealth or a trick? It depends on one thing, and it is not the gold.',
  icon: '🍎',
  difficulty: 'core',
  estimatedMinutes: 17,
  video: {
    url: 'https://www.youtube.com/watch?v=F7r7l1VG-Tw',
    minutes: 11,
    source: 'Khan Academy — Banking 4',
  },
  challenges: [
    // ---- Olivia warm-ups --------------------------------------------------
    // Sal asks whether the extra deposits are a trick, and answers that it
    // depends on what the loans built. These four ask the same of Breno’s €40
    // loan: Dona Rosa’s fixed oven bakes real bread, a loan spent on nothing
    // does not.
    {
      id: 'olivia-real-or-not',
      type: 'multiple_choice',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'wealth', 'lending'],
      prompt:
        'Breno could lend €40 to only one person. Which loan makes the town truly richer?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'oven', label: 'To Dona Rosa, to fix her oven so it bakes 100 more loaves a week' },
        {
          id: 'sweets',
          label: 'To Tomás, for sweets he eats on the walk home',
          feedback:
            'The sweets are gone by tea time. Nothing is left that makes anything, and Tomás still owes €40.',
        },
        {
          id: 'numbers',
          label: 'To nobody — Breno just writes bigger numbers in his book',
          feedback:
            'Bigger numbers in a book do not bake bread or tune a guitar. Only real things make a town richer.',
        },
        {
          id: 'any',
          label: 'Any of them — €40 is €40, whoever borrows it',
          feedback:
            'The money is the same, but what it builds is not. A working oven keeps making bread; a bag of sweets makes nothing.',
        },
      ],
      correctOptionId: 'oven',
      explanation:
        'The loan is only worth something real if it builds something real. Dona Rosa’s oven turns flour into 100 more loaves every week. That is Sal’s answer too: the extra money is not a trick when the projects it pays for are real.',
    },
    {
      id: 'olivia-money-vs-bread',
      type: 'concept_match',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'wealth', 'money'],
      prompt: 'Money and wealth are not the same thing. Match each word to what it means in Olivia’s town.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'money',
          term: 'Money',
          definition: 'Coins and numbers in accounts that people swap for things',
        },
        {
          id: 'wealth',
          term: 'Wealth',
          definition: 'Real, useful things: bread, guitars, a working oven',
        },
        {
          id: 'loan',
          term: 'Loan',
          definition: 'Money now, paid back later out of what it helps to make',
        },
      ],
      explanation:
        'You cannot eat a coin or play a song on a number. Money is how people swap wealth, and a good loan helps make more of it. Sal says the same about gold: it cannot be eaten either.',
    },
    {
      id: 'olivia-oven-pays-back',
      type: 'multiple_choice',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'lending', 'wealth'],
      prompt:
        'Dona Rosa’s fixed oven bakes 100 more loaves a week, and she sells them for €1 each. Where does the €40 she pays back to Breno come from?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'bread', label: 'From selling the extra bread the oven bakes' },
        {
          id: 'another-loan',
          label: 'From borrowing €40 more from Breno',
          feedback:
            'That would only swap one debt for another. Her extra bread is what really pays the loan off.',
        },
        {
          id: 'never',
          label: 'Nowhere — a loan never has to be paid back',
          feedback:
            'Every loan has to be paid back. That is why Breno cares so much about what it is for.',
        },
        {
          id: 'olivia',
          label: 'From Olivia’s account, because it was her money',
          feedback:
            'Olivia’s €50 is still hers, and Breno still owes it to her. Dona Rosa pays back from her own bakery.',
        },
      ],
      correctOptionId: 'bread',
      explanation:
        'One week of extra bread brings in €100, more than enough to pay the €40 back. A loan that builds something useful pays for itself, and the town ends up with more bread than before.',
    },
    {
      id: 'olivia-loan-for-nothing',
      type: 'multiple_choice',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'lending', 'wealth'],
      prompt:
        'Imagine Breno had lent the €40 for fireworks instead: one loud night, then nothing. The accounts still add up to €90. Is the town richer?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'no', label: 'No — the numbers grew, but nothing real was built to pay the loan back' },
        {
          id: 'yes',
          label: 'Yes — there is €90 in the accounts either way',
          feedback:
            'The numbers are the same, but there is no oven and no extra bread behind them. More money with nothing new to buy does not make anyone richer.',
        },
        {
          id: 'poorer-olivia',
          label: 'No — and Olivia has lost her €50',
          feedback:
            'Breno still owes Olivia her €50. The trouble is the loan: whoever bought the fireworks may never be able to pay it back.',
        },
        {
          id: 'richer-breno',
          label: 'Only Breno is richer, because he made a loan',
          feedback:
            'A loan is only worth something if it gets paid back. A loan spent on fireworks might not be.',
        },
      ],
      correctOptionId: 'no',
      explanation:
        'Money for a bad project is like a promise with nothing behind it. Sal makes the same point: the new deposits are real wealth only if the projects they paid for are real.',
    },
    // ---- Sal’s bank ---------------------------------------------------------
    {
      id: 'mc-what-makes-it-real',
      type: 'multiple_choice',
      tags: ['money-vs-wealth', 'investment'],
      xp: 20,
      prompt:
        'The villagers’ accounts now add up to 2,710 gold pieces, but only 1,000 coins exist. What decides if the extra money stands for real wealth?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'projects',
          label:
            'Whether the projects it paid for really produce at least as much value as was borrowed',
        },
        {
          id: 'gold-ratio',
          label: 'Whether the bank keeps enough gold for the deposits',
          feedback:
            'The gold does nothing. It sits in the vault whether the canal works or not, so it cannot tell you if wealth was created.',
        },
        {
          id: 'confidence',
          label: 'Whether depositors believe their money is there',
          feedback:
            'Trust keeps the bank open, but trust does not build anything. A village that trusts its bank but pays for useless projects still ends up poorer.',
        },
        {
          id: 'never',
          label: 'It never does — money created by lending is always fake',
          feedback:
            'The video argues against this idea. Its test is simple: did the village grow more apples? In the example, apples go from 1,000 to 3,000 a year.',
        },
      ],
      correctOptionId: 'projects',
      explanation:
        'The extra money paid for things that produce goods. If the canal and the factory really produce more than was borrowed, the deposits are backed by future goods, not by gold. If the projects fail, the deposits are empty promises, and no reserve rule could have changed that.',
    },
    {
      id: 'mc-deflation',
      type: 'multiple_choice',
      tags: ['inflation', 'productivity'],
      xp: 25,
      prompt:
        'The island now grows 3,000 apples a year instead of 1,000. The money people think they have goes from 1,000 to 2,710. People spend their money as often as before. What happens to the price of an apple?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'falls',
          label: 'It falls — apples grew faster than money',
        },
        {
          id: 'rises',
          label: 'It rises, because there is much more money to spend on apples',
          feedback:
            'Money grew 2.71 times. Apples grew 3 times. Apples grew faster than money, so each apple costs less, not more.',
        },
        {
          id: 'same',
          label: 'It stays the same, since both roughly tripled',
          feedback:
            'Close, but not quite. 2,710 of money for 3,000 apples is less money per apple than 1,000 for 1,000.',
        },
        {
          id: 'unknowable',
          label: 'You cannot tell without knowing the interest rate',
          feedback:
            'The interest rate affects which projects get money. Here you already know what happened, and comparing money with apples is enough to find the price.',
        },
      ],
      correctOptionId: 'falls',
      explanation:
        'Many people say “creating money always causes inflation”. This example shows it does not. Money grew and prices still fell, because the money paid for projects that made goods grow even faster. Inflation depends on whether money grows faster than goods, not on new money alone.',
    },
    {
      id: 'mc-bad-projects',
      type: 'multiple_choice',
      tags: ['money-creation', 'inflation', 'credit-risk'],
      xp: 30,
      prompt:
        'Now tell the same story with bad projects. The canal fills with mud, the tool factory never opens, and the island still grows only 1,000 apples a year. Deposits are still 2,710. What goes wrong?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'both',
          label: 'Two things: prices rise, and the bank is in trouble because its loans will not be paid back',
        },
        {
          id: 'inflation',
          label: 'Only inflation — more money to spend on the same number of apples',
          feedback:
            'That is only half of it. Look at what the bank owns to cover those 2,710 of deposits: two loans that will never be paid back.',
        },
        {
          id: 'bankonly',
          label: 'Only the bank is in trouble. Prices depend on supply and demand, not on deposits',
          feedback:
            'Deposits are the demand: they are the money people spend. 2,710 of money for 1,000 apples gives a higher price than 1,000 for 1,000.',
        },
        {
          id: 'nothing',
          label: 'Nothing. The money was created and still exists',
          feedback:
            'It exists as a number in an account. But the failed projects change what it can buy, and whether the bank can pay it out.',
        },
      ],
      correctOptionId: 'both',
      explanation:
        'This is the video’s story turned the other way. More lending is not always good or always bad. It depends on whether the things it pays for really get built. If they do, money and goods grow together. If they do not, the failed projects bring both rising prices and a banking crisis. Many real financial crises happened like this.',
    },
    {
      id: 'mc-partial-growth',
      type: 'multiple_choice',
      tags: ['inflation', 'money-supply'],
      xp: 30,
      prompt:
        'Now say the projects only half worked. The island grows 1,500 apples a year instead of 3,000. Deposits still reach 2,710. People spend their money as often as before. What happens to the price of an apple?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'rises',
          label: 'It rises — money grew 2.7 times and apples only 1.5 times',
        },
        {
          id: 'falls',
          label: 'It falls, as it did in the video, because output went up',
          feedback:
            'More apples is not enough on its own. What matters is whether apples grew faster than money, and 1.5 times is much less than 2.7 times.',
        },
        {
          id: 'same',
          label: 'It stays at one gold piece, because there are still only 1,000 coins of gold (M0)',
          feedback:
            'People spend the money they think they have: the 2,710 in their accounts. The gold in the vault (M0) is not what people take to the market.',
        },
        {
          id: 'unknowable',
          label: 'There is not enough information without knowing the interest rate',
          feedback:
            'The interest rate decides who can borrow. Here, the price comes from the two growth numbers you already have.',
        },
      ],
      correctOptionId: 'rises',
      explanation:
        '2,710 of money for 1,500 apples is about 1.8 gold pieces per apple, up from 1. The video chose numbers where goods grow faster than money, so prices fall. With other numbers, the same process makes prices rise. Lending alone does not decide which. What decides is how much the projects really produce.',
    },
    {
      id: 'match-money-wealth',
      type: 'concept_match',
      tags: ['money-supply', 'wealth'],
      xp: 25,
      prompt: 'The video says that money and wealth are different things. Match each idea to what it means on the island.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'money',
          term: 'Money',
          definition: 'The 2,710 in people’s accounts — you cannot eat it, live in it or ride it',
        },
        {
          id: 'wealth',
          term: 'Wealth',
          definition: 'The apples, the canal and the tool factory — the real things the money can buy',
        },
        {
          id: 'm0',
          term: 'M0',
          definition: 'The 1,000 gold coins themselves, which never changed in number',
        },
        {
          id: 'deflation',
          term: 'Deflation on the island',
          definition: 'Goods grew faster than money, so each gold piece could buy more',
        },
      ],
      explanation:
        'Sal says that mixing up money and wealth will make you unhappy. He means this as economics, not as a life lesson. Money stands for wealth, but it is not wealth. An island that doubles its gold but grows no more apples is not richer. An island that grows three times more apples is richer, even if nobody digs up more gold.',
    },
  ],
  keyTakeaways: [
    'New money from lending stands for real wealth only if the projects it paid for really produce something.',
    'Money stands for wealth, but it is not wealth. You cannot eat gold either.',
    'The money supply can grow while prices fall, if the amount of goods grows even faster.',
  ],
});
