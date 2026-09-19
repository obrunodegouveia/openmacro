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
        'The video says scarcity is the defining property of gold as money — and that it cuts both ways. How?',
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
            'That is one side. The other is the planting-season problem from video 16: a supply that cannot expand turns away good projects.',
        },
        {
          id: 'defect',
          label: 'Only as a defect — inflexible money is strictly worse',
          feedback:
            'The video refuses that too. Scarcity is genuine protection against a government inflating away its debts.',
        },
        {
          id: 'neither',
          label: 'Neither — scarcity is irrelevant once you have fractional reserve banking',
          feedback:
            'Fractional reserve multiplies whatever base exists; it does not free you from the base. Under a gold standard that base is still dug out of the ground.',
        },
      ],
      correctOptionId: 'both',
      explanation:
        'The same property is a virtue or a defect depending on which failure you fear more: a government debasing the currency, or an economy starved of credit. Notice that the video does not resolve it — it makes the trade-off explicit and leaves the judgement with you.',
    },
    {
      id: 'mc-gold-1980',
      type: 'multiple_choice',
      tags: ['gold', 'inflation', 'investing'],
      xp: 30,
      prompt:
        'In 1980 inflation was rampant and buying gold looked obvious. In inflation-adjusted terms gold was about $2,400 then and about $840 when the video was made. What does the video draw from this?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'bet-on-humans',
          label:
            'That holding a medium of exchange is a bet on what people will do',
        },
        {
          id: 'gold-bad',
          label: 'That gold is a poor investment over any long horizon',
          feedback:
            'Too strong. The point is about the difficulty of pricing something that generates no return, not a verdict on the asset.',
        },
        {
          id: 'inflation-never',
          label: 'That fears of inflation are always overdone',
          feedback:
            'The 1980 fear was entirely reasonable on the evidence available. What defeated it was a policy choice nobody could have predicted.',
        },
        {
          id: 'cash-better',
          label: 'That a savings account always beats gold in the long run',
          feedback:
            'The comparison offered is a bank account earning 3–4% over that particular span, not a general law.',
        },
      ],
      correctOptionId: 'bet-on-humans',
      explanation:
        'A very reasonable person in 1980 could have converted everything to gold and still been behind a savings account decades later — because Volcker raised rates against enormous political pressure. Gold generates no cash flow, so its price is a measure of expectations rather than of earnings, and that makes it a bet on human decisions rather than on arithmetic.',
    },
    {
      id: 'mc-four-systems',
      type: 'multiple_choice',
      tags: ['monetary-systems', 'full-reserve'],
      xp: 35,
      prompt:
        'Sal lays out the paths not taken: reserves may be full or fractional, and the base may be gold or not. Which combination is the most restrictive, and what is the case for it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'fullgold',
          label: 'Full reserve on gold — nobody can create money, so nobody can manipulate it',
        },
        {
          id: 'fracgold',
          label: 'Fractional reserve on gold, which is what the 19th century ran',
          feedback:
            'It is more restrictive than today’s system and less than the alternative on offer. Banks could still multiply deposits, which is most of where money creation happens.',
        },
        {
          id: 'fullpaper',
          label: 'Full reserve on paper, since the central bank still controls the base',
          feedback:
            'Closer, but the base is still expandable at will. Take away the ability to print and you have removed the last discretionary lever.',
        },
        {
          id: 'none',
          label: 'They are all equally restrictive, since all four have a reserve rule',
          feedback:
            'The rules differ enormously. A 100% requirement makes the multiplier exactly one; a 10% requirement makes it ten.',
        },
      ],
      correctOptionId: 'fullgold',
      explanation:
        'Full reserve on gold removes both presses at once: banks cannot multiply deposits, and no one can expand the base without mining. That is a real proposal with serious advocates — the Chicago Plan of the 1930s and today’s narrow banking arguments — and the honest cost is the one Sal names: no elasticity at all, so the money supply cannot answer a planting season or a panic. You are trading crises of manipulation for crises of rigidity.',
    },
    {
      id: 'mc-what-you-are-betting-on',
      type: 'multiple_choice',
      tags: ['gold', 'investing', 'inflation'],
      xp: 35,
      prompt:
        'A reasonable person in 1980, facing rampant inflation, bought gold. Sal’s point is not that they were foolish. What is it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'humans',
          label: 'They were betting on what people would do next, and Volcker was not forecastable',
        },
        {
          id: 'wrong',
          label: 'They were simply wrong about inflation',
          feedback:
            'They were right about inflation — it was rampant and getting worse. What they could not see was the policy response that ended it.',
        },
        {
          id: 'timing',
          label: 'They bought at the wrong moment and should have waited',
          feedback:
            'Hindsight supplies the moment. The argument is about the kind of thing being predicted, not about entry points.',
        },
        {
          id: 'goldbad',
          label: 'Gold is always a bad investment',
          feedback:
            'He explicitly refuses to say that, and notes gold may well be right from here. The claim is that it is unusually hard to price, not that it is doomed.',
        },
      ],
      correctOptionId: 'humans',
      explanation:
        'Something that produces no cash flow cannot be valued from its own fundamentals — you are pricing the collective judgement of everyone else, and that judgement turned on one appointment nobody predicted. Sal’s arithmetic is the sting: an ordinary deposit account paying 3 or 4% from 1980 beat gold all the way to 2009, despite the inflation case being correct at the time.',
    },
    {
      id: 'match-spins',
      type: 'concept_match',
      tags: ['gold', 'fiat-money', 'monetary-systems'],
      xp: 30,
      prompt: 'Sal insists each property has an optimistic and a pessimistic reading. Match each reading to the property it describes.',
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
          definition: 'Manipulable — and governments have repeatedly done so, all the way to worthlessness',
        },
      ],
      explanation:
        'The same fact described twice, and the description you reach for is usually your politics rather than your economics. Holding both readings at once is the point of the exercise: scarcity really does protect against one failure and really does cause another, and choosing a monetary system is choosing which crisis you would rather have.',
    },
  ],
  keyTakeaways: [
    'Money is a medium of exchange; wealth is what it is exchanged for.',
    'Scarcity protects against manipulation and prevents adaptation — the same property.',
    'Full reserve banking is a genuine alternative, with its own trade-offs.',
  ],
});
