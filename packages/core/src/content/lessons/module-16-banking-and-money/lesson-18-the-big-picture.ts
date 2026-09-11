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
            'That holding a medium of exchange is a bet on what people will do — and Paul Volcker was not forecastable',
        },
        {
          id: 'gold-bad',
          label: 'That gold is a bad investment',
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
          label: 'That cash always beats gold',
          feedback:
            'The comparison offered is a bank account earning 3–4% over that particular span, not a general law.',
        },
      ],
      correctOptionId: 'bet-on-humans',
      explanation:
        'A very reasonable person in 1980 could have converted everything to gold and still been behind a savings account decades later — because Volcker raised rates against enormous political pressure. Gold generates no cash flow, so its price is a measure of expectations rather than of earnings, and that makes it a bet on human decisions rather than on arithmetic.',
    },
  ],
  keyTakeaways: [
    'Money is a medium of exchange; wealth is what it is exchanged for.',
    'Scarcity protects against manipulation and prevents adaptation — the same property.',
    'Full reserve banking is a genuine alternative, with its own trade-offs.',
  ],
});
