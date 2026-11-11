import { defineLesson } from '../../schema';

/**
 * What people actually exchange. Everything bought was made by someone
 * putting in their energy — the course's shorthand for work, time and skill,
 * which economists call labour — and what comes out is either a product you
 * can keep or a service you cannot.
 *
 * The second half makes the point that trips people up: value lives in the
 * person who wants something, not in the effort that went into it.
 */
export const energyInGoodsOutLesson = defineLesson({
  id: 'energy-in-goods-out',
  title: 'Energy In, Products and Services Out',
  subtitle:
    'Everything people buy was made by someone putting in their energy: their work, their time and their skill.',
  icon: '🎸',
  difficulty: 'intro',
  estimatedMinutes: 9,
  hearts: 4,
  challenges: [
    // ---- Olivia busks in the town square -------------------------------------
    // Olivia's energy becomes joy for strangers, and some of them pay for it.
    // Set in the square rather than at her first gig, which the Banking and
    // Money module is still saving up for.
    {
      id: 'olivia-busking',
      type: 'multiple_choice',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'services'],
      prompt:
        'Olivia spends weeks writing a song and practising it. On Saturday she plays it in the town square, and people stop, smile and sing along. What did they get from her?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'service', label: 'A service: her energy, turned into joy they wanted' },
        {
          id: 'nothing',
          label: 'Nothing, because they cannot take a song home',
          feedback:
            'You do not have to take something home for it to be worth something. A haircut, a lesson and a concert are all services: done for you, and over when they end.',
        },
        {
          id: 'product',
          label: 'A product, like a T-shirt',
          feedback:
            'A product is a thing you can hold and keep. A song played live is a service: it happens for you, and then it is over.',
        },
        {
          id: 'worthless',
          label: 'Free fun, so it has no value',
          feedback:
            'Joy is something people want, and Olivia can only play in one square for one afternoon. Wanted and scarce: that is exactly what has value.',
        },
      ],
      correctOptionId: 'service',
      explanation:
        'Olivia put in her energy: weeks of writing and practising, and an afternoon of playing. The crowd got something they wanted, a happy afternoon. Feeling joy is a real need in our lives, and that is why music has value.',
    },
    {
      id: 'olivia-why-people-pay',
      type: 'multiple_choice',
      speaker: 'olivia',
      kids: true,
      xp: 10,
      tags: ['basics', 'value'],
      prompt:
        'By the end of the afternoon, people have dropped €30 into Olivia’s guitar case. Nobody had to. Why did they pay?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'valued', label: 'Her song gave them joy, and they wanted to give something back for it' },
        {
          id: 'worked-hard',
          label: 'She practised for weeks, so she deserved it',
          feedback:
            'Practice is what made the song good. But if nobody had enjoyed it, weeks of work would have earned nothing. People pay for what they value, not for how hard it was to make.',
        },
        {
          id: 'law',
          label: 'Because there is a rule that you must pay street musicians',
          feedback:
            'There is no such rule. Every coin in the case was a choice someone made.',
        },
        {
          id: 'guitar',
          label: 'Because her guitar was expensive',
          feedback:
            'Nobody in the square knew what her guitar cost, and it would not matter. They paid because of what they got, not because of what she spent.',
        },
      ],
      correctOptionId: 'valued',
      explanation:
        'This is an exchange. Olivia gave her energy, as music. The crowd gave theirs back, as money: the €30 came from work they had done. Each person decided for themselves what the song was worth to them.',
    },
    {
      id: 'olivia-energy-chain',
      type: 'order_flow',
      speaker: 'olivia',
      kids: true,
      xp: 15,
      tags: ['basics', 'exchange'],
      prompt: 'Follow Olivia’s energy, from her bedroom to Breno’s shop. Put it in order.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'practise',
          label: 'Olivia practises her song every evening',
          detail: 'Energy goes in: her time and her skill.',
        },
        {
          id: 'play',
          label: 'She plays it in the town square',
          detail: 'The crowd gets a service they want: joy.',
        },
        {
          id: 'paid',
          label: 'People drop €30 into her guitar case',
          detail: 'They give back energy of their own, as money.',
        },
        {
          id: 'strings',
          label: 'She spends €10 on new strings at Breno’s shop',
          detail: 'Her money carries her energy on to Breno.',
        },
      ],
      correctOrder: ['practise', 'play', 'paid', 'strings'],
      explanation:
        'Energy went in, a service came out, and money carried the value on to someone else. Breno never heard the song, but part of Olivia’s afternoon reached his shop anyway. That chain, repeated billions of times a day, is the economy.',
    },
    {
      id: 'breno-product-or-service',
      type: 'multiple_choice',
      speaker: 'breno',
      kids: true,
      xp: 10,
      tags: ['basics', 'services'],
      prompt:
        'At Breno’s shop you can buy things, and you can also pay Breno to do things for you. Which of these is a service?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'repair', label: 'Breno fixing a broken string on your guitar' },
        {
          id: 'amp',
          label: 'A brand-new amp, still in its box',
          feedback:
            'An amp is a thing you can carry home and keep. That makes it a product.',
        },
        {
          id: 'strings',
          label: 'A packet of new strings for later',
          feedback:
            'You can hold a packet of strings and take it home, so it is a product. Putting them on your guitar for you would be a service.',
        },
        {
          id: 'case',
          label: 'A soft guitar case with a zip',
          feedback:
            'A case is something you keep and can sell later. That is a product.',
        },
      ],
      correctOptionId: 'repair',
      explanation:
        'When Breno fixes your guitar, you do not take a new thing home: you pay for his time and his skill. That is a service. His shop sells both, and both are made with someone’s energy.',
    },
    // ---- The grown-up version -----------------------------------------------
    {
      id: 'mc-plumber',
      type: 'multiple_choice',
      tags: ['production', 'services'],
      xp: 15,
      prompt:
        'A plumber spends one hour fixing a leak under your sink and charges €60. What did you mostly pay for?',
      instructions: 'Pick the best answer',
      options: [
        { id: 'energy', label: 'An hour of his work and skill, turned into a service you wanted' },
        {
          id: 'tools',
          label: 'His pipes and tools',
          feedback:
            'He takes his tools home with him. A small part of the bill may be a new washer, but most of it is his time and the years it took to learn the job.',
        },
        {
          id: 'waste',
          label: 'Nothing you can keep, so the money is gone for nothing',
          feedback:
            'You kept a dry kitchen. A service leaves nothing to hold, but it can be worth more than most things you could hold.',
        },
        {
          id: 'water',
          label: 'The value of the water you will now save',
          feedback:
            'Nobody worked that out. €60 is the price you both agreed to, and you agreed because the fix was worth more than €60 to you.',
        },
      ],
      correctOptionId: 'energy',
      explanation:
        'Economists call human work, time and skill labour, and it is the energy behind every product and service. They count two other inputs too: capital (tools and machines made earlier) and land (what nature provides). People exchange labour for money, and money for the labour of others.',
    },
    {
      id: 'mc-value',
      type: 'multiple_choice',
      tags: ['value'],
      xp: 20,
      prompt:
        'Two friends each pay €5 to hear Olivia play a concert. One leaves thrilled, the other bored. What does that show about value?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'subjective',
          label: 'Value depends on the person, not only on the concert',
        },
        {
          id: 'five',
          label: 'The concert was worth exactly €5 to both of them',
          feedback:
            '€5 is the price, the same for both. The thrilled friend would have paid more, and the bored one wishes they had paid less. Price and value are not the same thing.',
        },
        {
          id: 'wrong',
          label: 'The bored friend was wrong about the music',
          feedback:
            'There is no right answer about what someone enjoys. Value depends on who is doing the valuing.',
        },
        {
          id: 'effort',
          label: 'Value comes from the hours Olivia practised',
          feedback:
            'The hours were the same for both friends, yet one valued the concert and one did not. Effort is what it costs to make something; value is what it is worth to the person who gets it.',
        },
      ],
      correctOptionId: 'subjective',
      explanation:
        'Economists say value is subjective: it exists in the mind of the person who wants something. A trade happens when each side values what they get more than what they give. That is why both can walk away better off.',
    },
    {
      id: 'match-what-goes-in',
      type: 'concept_match',
      tags: ['production'],
      xp: 15,
      prompt: 'What goes into the economy, and what comes out. Match each word to its meaning.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'labour',
          term: 'Labour',
          definition: 'People’s work, time and skill: the human energy put in',
        },
        {
          id: 'capital',
          term: 'Capital',
          definition: 'Tools and machines made earlier to help make more, like Breno’s shop or Olivia’s guitar',
        },
        {
          id: 'land',
          term: 'Land',
          definition: 'What nature provides: soil, water, wood and oil',
        },
        {
          id: 'product',
          term: 'A product',
          definition: 'A thing you can hold, keep and sell on, like an amp',
        },
        {
          id: 'service',
          term: 'A service',
          definition: 'Something done for you that you cannot keep, like a concert or a haircut',
        },
      ],
      explanation:
        'Labour, capital and land go in; products and services come out. Every one of them is scarce, which is why the last lesson’s question, who gets what, never goes away.',
    },
  ],
  keyTakeaways: [
    'Every product and service was made by someone putting in their energy: work, time and skill.',
    'A product is a thing you keep; a service is done for you and then it is over.',
    'Value is in the person who wants something, not in the effort it took to make.',
    'A trade happens when each side values what they get more than what they give.',
  ],
});
