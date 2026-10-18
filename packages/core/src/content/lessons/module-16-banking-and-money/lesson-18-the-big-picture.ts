import { defineLesson } from '../../schema';

/** Video 18. Money against wealth, and the honest admission that gold's 1980-to-2009 record is a warning to both sides. */
export const kabBigPictureLesson = defineLesson({
  id: 'kab-big-picture',
  title: 'Money Is Not Wealth',
  subtitle:
    'Scarce or flexible, metal or paper — every monetary system is a bet on how humans will behave.',
  icon: '🧭',
  difficulty: 'advanced',
  estimatedMinutes: 18,
  video: {
    url: 'https://www.youtube.com/watch?v=T9byZBGtGuw',
    minutes: 14,
    source: 'Khan Academy — Banking 18',
  },
  challenges: [
    {
      id: 'mc-scarcity',
      type: 'multiple_choice',
      tags: ['money-vs-wealth', 'gold'],
      xp: 25,
      prompt:
        'The video says scarcity is what defines gold as money — and that it cuts both ways. How?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'both',
          label:
            'It cannot be manipulated, which is a virtue; and it cannot be adjusted to the economy’s needs, which is a defect',
        },
        {
          id: 'virtue',
          label: 'Only as a virtue — unmanipulable money is strictly better',
          feedback:
            'That is one side. The other is the planting-season problem from video 16: a money supply that cannot expand turns away good projects.',
        },
        {
          id: 'defect',
          label: 'Only as a defect — inflexible money is strictly worse',
          feedback:
            'The video rejects that too. Scarcity really does protect against a government shrinking its debts by creating money and inflation.',
        },
        {
          id: 'neither',
          label: 'Neither — scarcity is irrelevant once you have fractional reserve banking',
          feedback:
            'Fractional reserve banking multiplies whatever base exists; it does not free you from the base. Under a gold standard that base is still dug out of the ground.',
        },
      ],
      correctOptionId: 'both',
      explanation:
        'The same property is a virtue or a defect depending on which failure you fear more: a government making the currency worth less, or an economy starved of credit. Notice that the video does not settle it — it makes the trade-off clear and leaves the judgement to you.',
    },
    {
      id: 'mc-gold-1980',
      type: 'multiple_choice',
      tags: ['gold', 'inflation', 'investing'],
      xp: 30,
      prompt:
        'In 1980 inflation was very high and buying gold looked obvious. Measured in the dollars of 2009, when the video was made, gold cost about $2,400 at its 1980 peak and about $840 in 2009. What lesson does the video draw?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'bet-on-humans',
          label:
            'That holding something like gold as money is a bet on what people will do',
        },
        {
          id: 'gold-bad',
          label: 'That gold is a poor investment over any long horizon',
          feedback:
            'Too strong. The point is how hard it is to price something that pays no income, not a verdict on gold.',
        },
        {
          id: 'inflation-never',
          label: 'That fears of inflation are always overdone',
          feedback:
            'The 1980 fear was reasonable on the evidence at the time. What defeated it was a policy choice that few expected to go so far.',
        },
        {
          id: 'cash-better',
          label: 'That a savings account always beats gold in the long run',
          feedback:
            'The comparison is with a bank account earning 3–4% over that particular period, not a general law.',
        },
      ],
      correctOptionId: 'bet-on-humans',
      explanation:
        'A very reasonable person in 1980 could have put everything into gold and still been behind a savings account decades later — because the Fed under Paul Volcker raised interest rates hard, against enormous political pressure, and inflation fell. Gold pays no income, so its price reflects expectations rather than earnings, and that makes it a bet on human decisions rather than on arithmetic.',
    },
    {
      id: 'mc-four-systems',
      type: 'multiple_choice',
      tags: ['monetary-systems', 'full-reserve'],
      xp: 35,
      prompt:
        'Sal lays out the paths not taken: banks may keep full (100%) or fractional reserves, and the base money may be gold or paper. Which combination limits money creation the most, and what is the case for it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'fullgold',
          label: 'Full reserves on gold — nobody can create money, so nobody can manipulate it',
        },
        {
          id: 'fracgold',
          label: 'Fractional reserves on gold, which is what the 19th century ran',
          feedback:
            'It limits money more than today’s system but less than full reserves on gold. Banks could still multiply deposits, which is where most money creation happens.',
        },
        {
          id: 'fullpaper',
          label: 'Full reserves on paper, since the central bank still controls the base',
          feedback:
            'Closer, but the central bank can still expand the base at will. Take away the ability to print and you remove the last lever anyone can pull.',
        },
        {
          id: 'none',
          label: 'They all limit money equally, since all four have a reserve rule',
          feedback:
            'The rules differ enormously. A 100% requirement makes the multiplier exactly one; a 10% requirement makes it up to ten.',
        },
      ],
      correctOptionId: 'fullgold',
      explanation:
        'Full reserves on gold switch off both presses at once: banks cannot multiply deposits, and no one can expand the base without mining. Full-reserve proposals have serious advocates — the Chicago Plan of the 1930s and today’s "narrow banking" arguments — and the honest cost is the one Sal names: no flexibility at all, so the money supply cannot respond to a planting season or a panic. You are trading crises of manipulation for crises of rigidity.',
    },
    {
      id: 'mc-what-you-are-betting-on',
      type: 'multiple_choice',
      tags: ['gold', 'investing', 'inflation'],
      xp: 35,
      prompt:
        'A reasonable person in 1980, facing very high inflation, bought gold — and lost out over the next three decades. Sal’s point is not that they were foolish. What is it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'humans',
          label: 'They were betting on what people would do next — and few expected the Fed to fight inflation as hard as it did',
        },
        {
          id: 'wrong',
          label: 'They were simply wrong about inflation',
          feedback:
            'They were right about inflation — it was high and getting worse. What they could not see was how hard the policy response that ended it would be.',
        },
        {
          id: 'timing',
          label: 'They bought at the wrong moment and should have waited',
          feedback:
            'Only hindsight tells you the right moment. The argument is about what kind of thing is being predicted, not about when to buy.',
        },
        {
          id: 'goldbad',
          label: 'Gold is always a bad investment',
          feedback:
            'He explicitly refuses to say that, and notes gold may well do well from here. The claim is that it is unusually hard to price, not that it is doomed.',
        },
      ],
      correctOptionId: 'humans',
      explanation:
        'Something that pays no income cannot be valued from its own earnings — you are pricing what everyone else will think, and in this case that turned on how far the Fed under Paul Volcker would go: it pushed interest rates to around 20%. Sal’s arithmetic is the sting: an ordinary deposit account paying 3 or 4% from 1980 beat gold all the way to 2009, even though the fear of inflation was correct at the time.',
    },
    {
      id: 'match-spins',
      type: 'concept_match',
      tags: ['gold', 'fiat-money', 'monetary-systems'],
      xp: 30,
      prompt: 'Sal insists that each property can be described kindly or unkindly. Match each description to what it says.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'goldgood',
          term: 'Scarce, kindly put',
          definition: 'Cannot be manipulated — no government can conjure more of it to fund itself',
        },
        {
          id: 'goldbad',
          term: 'Scarce, unkindly put',
          definition: 'Inflexible — the supply cannot answer a harvest, a panic or a century of growth',
        },
        {
          id: 'papergood',
          term: 'Printable, kindly put',
          definition: 'Flexible — it can expand exactly when the economy needs it to',
        },
        {
          id: 'paperbad',
          term: 'Printable, unkindly put',
          definition: 'Manipulable — and governments have repeatedly printed too much, sometimes until the money was worthless',
        },
      ],
      explanation:
        'Each fact is described twice, and the description people reach for usually reflects their politics rather than their economics. Holding both readings at once is the point of the exercise: scarcity really does protect against one failure and really does cause another, and choosing a monetary system is choosing which crisis you would rather risk.',
    },
  ],
  keyTakeaways: [
    'Money is a medium of exchange; wealth is what it is exchanged for.',
    'Scarcity protects against manipulation and prevents adaptation — the same property.',
    'Full reserve banking is a genuine alternative, with its own trade-offs.',
  ],
});
