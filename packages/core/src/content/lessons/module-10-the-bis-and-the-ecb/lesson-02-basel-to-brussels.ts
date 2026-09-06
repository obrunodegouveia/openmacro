import { defineLesson } from '../../schema';

/**
 * The real transmission channel, and the place where it can be watched
 * breaking.
 *
 * The BIS on its own standards: "In order to become binding, the agreements
 * reached in Basel have to be approved and implemented at the national level,
 * following due regulatory and legislative processes in each individual
 * jurisdiction."
 *
 * The EU chain: CRR3 and CRD6 applied from 1 January 2025. The market risk
 * framework (FRTB) was postponed by delegated act twice, to 1 January 2027,
 * with the output floor's application aligned to it. In June 2026 the
 * Commission adopted a further delegated act adding a targeted multiplier and
 * operational relief, to apply from January 2027 to January 2030.
 */
export const baselToBrusselsLesson = defineLesson({
  id: 'basel-to-brussels',
  title: 'How a Basel Standard Becomes a Rule',
  subtitle:
    'This is the channel that is real. It runs through a legislature, and it is where the EU says no.',
  icon: '📜',
  difficulty: 'advanced',
  estimatedMinutes: 10,
  challenges: [
    {
      id: 'flow-basel-chain',
      type: 'order_flow',
      tags: ['basel', 'regulation', 'ecb'],
      xp: 30,
      prompt: 'Put the chain from a Basel agreement to a rule that binds a Spanish bank.',
      instructions: 'Earliest first',
      events: [
        {
          id: 'committee',
          label: 'The Basel Committee agrees a standard',
          detail: 'Hosted at the BIS, made up of supervisors from member jurisdictions',
        },
        {
          id: 'nonbinding',
          label: 'The standard binds nobody, anywhere',
          detail: 'It is an agreement between authorities, not a law',
        },
        {
          id: 'commission',
          label: 'The European Commission proposes legislation to implement it',
          detail: 'The banking package — CRR3 and CRD6',
        },
        {
          id: 'legislature',
          label: 'Parliament and Council negotiate, amend and adopt it',
          detail: 'This is where the standard can be changed, delayed or watered down',
        },
        {
          id: 'supervise',
          label: 'The ECB supervises euro area banks against the resulting EU law',
          detail: 'Against the regulation as adopted — never against the Basel text',
        },
      ],
      correctOrder: ['committee', 'nonbinding', 'commission', 'legislature', 'supervise'],
      explanation:
        'Every arrow in that chain matters, but the second one carries the argument. The BIS says so itself: agreements reached in Basel "have to be approved and implemented at the national level, following due regulatory and legislative processes in each individual jurisdiction". A Basel standard is a draft until a legislature makes it law.',
    },

    {
      id: 'mc-frtb-delay',
      type: 'multiple_choice',
      tags: ['basel', 'eu', 'regulation'],
      xp: 25,
      prompt:
        'Basel agreed the market risk framework. The EU postponed it twice — to 1 January 2027 — and in June 2026 added its own multiplier and relief measures. What does that demonstrate?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'eu-decides',
          label: 'That the EU decides whether, when and in what form a Basel standard binds',
        },
        {
          id: 'eu-defied',
          label: 'That the EU defied the BIS, which will impose consequences',
          feedback:
            'There are no consequences to impose. The Basel Committee has no enforcement power over a jurisdiction — it publishes assessments of who has implemented what, and that is the extent of it.',
        },
        {
          id: 'temporary',
          label: 'Nothing — a delay is administrative and the standard still applies',
          feedback:
            'Two delays plus a substantive amendment is not administration. Banks in the EU will be capitalised differently from the Basel text for years, and that difference was legislated deliberately.',
        },
        {
          id: 'weak-banks',
          label: 'That EU banks were too weak to meet the standard',
        },
      ],
      correctOptionId: 'eu-decides',
      explanation:
        'This is the cleanest available evidence against the idea that Basel dictates to Europe, and it is recent. Faced with a standard its own banks found competitively costly, the EU delayed it by two years and then rewrote parts of it. That is what sovereignty over financial regulation looks like in practice — visible, legislated, and reported.',
    },

    {
      id: 'mc-what-ecb-does',
      type: 'multiple_choice',
      tags: ['ecb', 'ssm', 'supervision'],
      xp: 20,
      prompt:
        'Where in the ECB does a Basel standard actually land — and where does it not?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'supervision-not-rates',
          label: 'In banking supervision, once it is EU law. Not in the interest rate decision',
        },
        {
          id: 'both',
          label: 'In both supervision and monetary policy',
          feedback:
            'Capital rules change how banks lend, which does eventually touch monetary conditions. But nothing in Basel speaks to what the deposit facility rate should be, and the Governing Council does not consult it when setting one.',
        },
        {
          id: 'rates-only',
          label: 'Mainly in the interest rate decision',
        },
        {
          id: 'nowhere',
          label: 'Nowhere — the ECB is bound only by its own statute',
          feedback:
            'The ECB supervises banks against EU law, and EU law is where Basel ends up. The standards reach it — through the legislature, and into the supervisory arm.',
        },
      ],
      correctOptionId: 'supervision-not-rates',
      explanation:
        'The ECB has two arms, and the distinction is the point of this lesson. Its supervisory arm applies EU banking law to euro area banks, and that law is where Basel arrives. Its monetary arm sets rates under a mandate written into the Treaty. Conflating them is how "the BIS influences the ECB" turns from a specific, documented, legislated channel into something much vaguer and much less true.',
    },

    {
      id: 'match-standards',
      type: 'concept_match',
      tags: ['basel', 'bis', 'committees'],
      xp: 20,
      prompt: 'Match each Basel-hosted body to what it produces.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'bcbs',
          term: 'Basel Committee on Banking Supervision',
          definition:
            'Bank capital and liquidity standards — the ones that become CRR and CRD in the EU',
        },
        {
          id: 'cpmi',
          term: 'Committee on Payments and Market Infrastructures',
          definition:
            'Standards for payment and settlement systems, which is what TARGET is measured against',
        },
        {
          id: 'cgfs',
          term: 'Committee on the Global Financial System',
          definition:
            'Analysis of financial stability, producing reports rather than rules',
        },
        {
          id: 'markets',
          term: 'Markets Committee',
          definition:
            'A forum on how central banks actually operate in markets — no standards at all',
        },
      ],
      explanation:
        'Only the first of these produces anything that ends up as binding law, and only after a legislature has passed it. The others produce analysis, codes and shared practice. Lumping them together as "the BIS" hides the fact that most of what comes out of Basel has no route to becoming a rule and was never meant to have one.',
    },
  ],
  keyTakeaways: [
    'A Basel standard binds nobody until a legislature enacts it — the BIS says so itself.',
    'In the EU the route is the Commission, Parliament and Council: CRR3 and CRD6 from January 2025.',
    'The EU postponed the market risk framework twice to 2027 and then amended it, which is the channel visibly not being obeyed.',
    'Basel lands in the ECB’s supervisory arm, through EU law. It does not reach the rate decision.',
  ],
});
