import { defineLesson } from '../../schema';

/**
 * The forum, and who is actually at the head of the table.
 *
 * The Global Economy Meeting brings together 30 governors from major advanced
 * and emerging economies, with observers from 22 more, and is chaired by
 * Christine Lagarde — the President of the ECB. The All Governors' Meeting
 * covers all 63 members and is chaired by Fabio Panetta, chair of the BIS
 * Board. The Economic Consultative Committee, 19 members, prepares proposals
 * for the GEM.
 *
 * Article 130 TFEU: neither the ECB nor a national central bank may seek or
 * take instructions from Union institutions, from any member state government,
 * or from any other body.
 */
export const theRoomInBaselLesson = defineLesson({
  id: 'the-room-in-basel',
  title: 'Who Chairs the Room',
  subtitle:
    'Governors meet in Basel every two months. The main meeting is chaired by the President of the ECB.',
  icon: '🪑',
  difficulty: 'advanced',
  estimatedMinutes: 9,
  challenges: [
    {
      id: 'mc-who-chairs',
      type: 'multiple_choice',
      tags: ['bis', 'ecb', 'governance'],
      xp: 25,
      prompt:
        'The Global Economy Meeting gathers thirty governors in Basel and gives guidance to the Basel-based committees. Who chairs it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'lagarde',
          label: 'Christine Lagarde, the President of the ECB',
        },
        {
          id: 'bis-gm',
          label: 'The General Manager of the BIS',
          feedback:
            'The BIS provides the room, the secretariat and the analysis. It does not chair the governors — they chair themselves.',
        },
        {
          id: 'fed',
          label: 'The Chair of the Federal Reserve',
        },
        {
          id: 'rotating',
          label: 'A rotating chair with no fixed holder',
        },
      ],
      correctOptionId: 'lagarde',
      explanation:
        'This single fact is hard to reconcile with the ECB being steered from Basel. The most important standing meeting of central bank governors in the world is chaired by the President of the ECB, and the BIS Board is chaired by Fabio Panetta, the Governor of the Banca d’Italia. The institution is not above its members; it is staffed by them.',
    },

    {
      id: 'mc-article-130',
      type: 'multiple_choice',
      tags: ['ecb', 'independence', 'law'],
      xp: 25,
      prompt:
        'Article 130 of the Treaty says the ECB shall not seek or take instructions from Union institutions, from member state governments, or from "any other body". What does that last phrase do?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'covers-everything',
          label: 'It makes taking instructions from any external body — including the BIS — unlawful',
        },
        {
          id: 'eu-only',
          label: 'It applies only to EU institutions',
          feedback:
            'The article lists Union institutions, then member state governments, then "any other body". The third category exists precisely so the list is not exhaustible.',
        },
        {
          id: 'symbolic',
          label: 'It is a statement of principle with no operative effect',
          feedback:
            'It is primary EU law and has been litigated. Independence is the most concretely defended feature of the ECB’s design.',
        },
        {
          id: 'monetary-only',
          label: 'It covers monetary policy but not supervision',
        },
      ],
      correctOptionId: 'covers-everything',
      explanation:
        'The prohibition is deliberately open-ended, and it runs in both directions: the ECB may not take instructions, and nobody may seek to give them. Which is why the honest question is not whether the BIS can order the ECB to do anything — it plainly cannot — but how influence operates when authority is unavailable. That is what the rest of this module is about.',
    },

    {
      id: 'match-influence-channels',
      type: 'concept_match',
      tags: ['bis', 'ecb', 'influence'],
      xp: 25,
      prompt: 'Match each channel of influence to how it actually works.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'standards',
          term: 'Standard setting',
          definition:
            'Real, but only after the EU legislature turns it into law — and it can refuse',
        },
        {
          id: 'analysis',
          term: 'Research and the Annual Economic Report',
          definition:
            'Sets the terms of the argument — which risks get named, and what counts as evidence',
        },
        {
          id: 'peer',
          term: 'Six meetings a year with the same thirty people',
          definition:
            'Peer pressure and shared framing, with nothing binding said out loud',
        },
        {
          id: 'statistics',
          term: 'The BIS statistical collections',
          definition:
            'Whoever measures a thing decides what the debate can be about',
        },
      ],
      explanation:
        'None of these is a command and all of them are real. The last is the most underrated: the BIS assembles the international banking and derivatives statistics that almost every study of cross-border finance rests on. A phenomenon nobody measures is one that policy cannot easily discuss — so choosing what to count is a quiet, durable form of agenda-setting.',
    },

    {
      id: 'mc-soft-power-limit',
      type: 'multiple_choice',
      tags: ['bis', 'influence', 'evidence'],
      xp: 25,
      prompt:
        'For years BIS research argued that ultra-low rates and large balance sheets carried financial stability costs. The ECB went ahead with negative rates and a €3.3tn asset purchase programme anyway. What does that tell you about the channel?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'real-but-weak',
          label: 'Influence over the terms of debate is real; influence over the decision is not',
        },
        {
          id: 'no-influence',
          label: 'That BIS research has no influence at all',
          feedback:
            'Too strong. The arguments were made, answered and cited in ECB speeches for years — they shaped what the Governing Council had to justify. They just did not decide it.',
        },
        {
          id: 'secret',
          label: 'That the real influence happens privately, not in published research',
          feedback:
            'That would be an unfalsifiable claim, and it is not needed: the published disagreement is on the record and is a sufficient explanation of what happened.',
        },
        {
          id: 'later',
          label: 'That the BIS was proved right, so its influence was vindicated',
        },
      ],
      correctOptionId: 'real-but-weak',
      explanation:
        'This is the most useful single test in the module, because it is a case where the two institutions publicly disagreed for years and the ECB simply did what it judged right. An institution that can shape which questions are asked, but not which answer is chosen, has exactly the kind of influence the evidence supports — and claiming more than that makes the real mechanism harder to see, not easier.',
    },
  ],
  keyTakeaways: [
    'The Global Economy Meeting is chaired by the President of the ECB; the BIS Board by an NCB governor.',
    'Article 130 makes taking instructions from any external body unlawful, in deliberately open-ended terms.',
    'The real channels are standards, published analysis, repeated contact and the statistics themselves.',
    'When the BIS and the ECB disagreed publicly for years, the ECB did what it judged right.',
  ],
});
