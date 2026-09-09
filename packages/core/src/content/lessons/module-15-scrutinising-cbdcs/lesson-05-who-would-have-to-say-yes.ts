import { defineLesson } from '../../schema';

/**
 * The method lesson: an experiment is not a decision, and the step that
 * decides is the one with elected people in it.
 *
 * Dated facts used here, all public:
 *   - Digital euro investigation phase October 2021 to October 2023;
 *     preparation phase November 2023 to October 2025; the Governing Council
 *     decided in October 2025 to continue with a focus on technical
 *     readiness. The ECB's own line: "If EU lawmakers adopt the regulation in
 *     the course of 2026, the digital euro could be issued during 2029", and
 *     the issuance decision "will only be considered at a later stage once the
 *     European Union's legislative process has been completed."
 *   - Parliament's ECON committee adopted its negotiating position on 23 June
 *     2026, by 43 votes to 14 with one abstention, opening trilogues. Under
 *     the framework being negotiated the ECB would set the holding limit
 *     within a ceiling fixed by the Commission on the ECB's recommendation and
 *     reviewed at least every two years. No number is in force.
 *   - Pontes: the Eurosystem's DLT solution linking market platforms to TARGET
 *     Services, initial launch planned for the third quarter of 2026, built on
 *     2024 exploratory work with 64 participants and more than 50 trials.
 *     Appia is the longer-term track, targeted at 2028.
 *   - mBridge reached minimum viable product in June 2024; the BIS ended its
 *     involvement on 31 October 2024 and handed the platform to the
 *     participating central banks.
 */
export const whoWouldHaveToSayYesLesson = defineLesson({
  id: 'who-would-have-to-say-yes',
  title: 'Who Would Have to Say Yes',
  subtitle:
    'An experiment is not a decision. Five questions that separate them — and the one wholesale system that really is going live this year.',
  icon: '🗳️',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'order-approval-chain',
      type: 'order_flow',
      tags: ['method', 'institutions', 'digital-euro'],
      xp: 30,
      prompt:
        'Put the steps between a BIS Innovation Hub prototype and a central bank euro in somebody’s wallet into order.',
      instructions: 'Arrange the steps into the correct sequence',
      events: [
        {
          id: 'poc',
          label: 'A BIS Innovation Hub proof of concept',
          detail: 'Feasibility, on a testnet, with hypothetical currencies',
        },
        {
          id: 'cb-project',
          label: 'A central bank opens its own project',
          detail: 'Investigation and preparation, on its own authority',
        },
        {
          id: 'legislation',
          label: 'A legislature passes the enabling law',
          detail: 'For the euro, a Regulation agreed by Parliament and Council',
        },
        {
          id: 'gc-decision',
          label: 'The issuing central bank decides to issue',
          detail: 'A decision the ECB says it will only take after the law is finished',
        },
        {
          id: 'rollout',
          label: 'Issuance and rollout',
          detail: 'Years rather than months after that decision',
        },
      ],
      correctOrder: ['poc', 'cb-project', 'legislation', 'gc-decision', 'rollout'],
      explanation:
        'The BIS sits at the left-hand end of this chain and has no route to the right-hand end: no currency, no legislature, no citizens. The ECB sits in the middle and has put the constraint in writing — the decision on whether to issue "will only be considered at a later stage once the European Union’s legislative process has been completed". The step that actually decides is the one containing elected people, and it is reliably the step that gets the least attention.',
    },
    {
      id: 'mc-digital-euro-status',
      type: 'multiple_choice',
      tags: ['digital-euro', 'ecb', 'legislation'],
      xp: 30,
      prompt: 'As of September 2026, where has the digital euro actually got to?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'legislating',
          label:
            'The preparation phase closed in October 2025; Parliament’s ECON committee adopted its negotiating position in June 2026, and the ECB says issuance could follow in 2029 if the Regulation is adopted during 2026',
        },
        {
          id: 'issued',
          label: 'It has been issued and is in limited circulation',
          feedback:
            'Nothing has been issued. There is no digital euro in anybody’s hands, in any quantity, anywhere.',
        },
        {
          id: 'abandoned',
          label: 'The project was abandoned when the preparation phase ended',
          feedback:
            'The Governing Council decided in October 2025 to continue, with the focus on technical readiness. Ending a phase is not ending a project, and a phase ending on schedule is not news.',
        },
        {
          id: 'ecb-decides',
          label: 'The ECB can issue it whenever its Governing Council chooses',
          feedback:
            'It cannot. The legal basis has to exist first, which is why the file sits with Parliament and Council and why the ECB keeps repeating that the issuance decision comes afterwards.',
        },
      ],
      correctOptionId: 'legislating',
      explanation:
        'Five years in, the digital euro is a legislative file with a technical programme attached to it. The dates are worth holding because they are public commitments rather than predictions: investigation October 2021 to October 2023, preparation November 2023 to October 2025, ECON’s position adopted on 23 June 2026 by 43 votes to 14, and a possible first issuance during 2029 conditional on lawmakers adopting the Regulation in the course of 2026. Any of those slipping is a fact you can check, which is worth more than a forecast you cannot.',
    },
    {
      id: 'mc-holding-limit',
      type: 'multiple_choice',
      tags: ['digital-euro', 'holding-limits', 'bank-funding'],
      xp: 35,
      prompt: 'What is the digital euro holding limit?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'undecided',
          label:
            'There is not one yet. What is being legislated is who sets it and within what ceiling, not the number',
        },
        {
          id: 'three-thousand',
          label: '€3,000',
          feedback:
            'The most-quoted figure, and it is a number in circulation rather than a limit in force. Stating it as settled is the same error as claiming no limit is planned, just in the other direction.',
        },
        {
          id: 'none',
          label: 'There is no limit and none is proposed',
          feedback:
            'A limit is load-bearing in the design. Without one, deposits could leave commercial banks for the central bank in a stress — the financial stability objection the ECB has spent years modelling.',
        },
        {
          id: 'ecb-alone',
          label: 'Whatever the ECB decides, with no constraint',
          feedback:
            'Under the framework being negotiated the ECB would set it within a ceiling fixed by the Commission on the ECB’s recommendation, reviewed at least every two years. "Decides" and "decides within bounds set by lawmakers" is the entire argument about central bank independence, in one preposition.',
        },
      ],
      correctOptionId: 'undecided',
      explanation:
        'The holding limit is the parameter the whole retail design rests on: it is what stops the digital euro draining commercial bank deposits, and its size decides whether the thing is a payment instrument or a savings account at the central bank. It is genuinely undecided. Where machinery is still being built, precision means naming the process and watching the trilogue, not quoting a number that has not been agreed.',
    },
    {
      id: 'mc-pontes',
      type: 'multiple_choice',
      tags: ['pontes', 'wholesale', 'target', 'ecb'],
      xp: 35,
      prompt:
        'Meanwhile the Eurosystem is putting something into production in the third quarter of 2026, called Pontes. What is it?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'link',
          label:
            'A link between market DLT platforms and TARGET Services, so tokenised trades can settle their cash leg in existing central bank money',
        },
        {
          id: 'wcbdc',
          label: 'The euro area’s wholesale CBDC, issued as a token',
          feedback:
            'Closer than most answers, and still not right. Pontes offers a choice: settle with cash tokens on a Eurosystem ledger, or settle the cash leg in T2. It is a bridge to the system that already exists rather than a new form of money in general circulation.',
        },
        {
          id: 'digital-euro-launch',
          label: 'The first stage of the digital euro',
          feedback:
            'A different animal entirely. Pontes is wholesale, for banks and market infrastructures; the digital euro is retail and waiting on a Regulation. They are frequently merged in coverage and never in the ECB’s own documents.',
        },
        {
          id: 'mariana-live',
          label: 'Project Mariana going into production',
          feedback:
            'Mariana concluded in September 2023 and had no successor project. Pontes came out of the Eurosystem’s own 2024 exploratory work — 64 participants, more than 50 trials — under a two-track plan whose longer-term track, Appia, is targeted at 2028.',
        },
      ],
      correctOptionId: 'link',
      explanation:
        'This is the honest state of play: the wholesale side is shipping while the retail side is still legislating. Pontes is deliberately unexciting — it extends a settlement system that already works to platforms that are new — and it is the thing that will actually move central bank money this year. If you want to watch central bank money change, watch the boring track, because it is the one that does not need a vote.',
    },
    {
      id: 'mc-mbridge',
      type: 'multiple_choice',
      tags: ['mbridge', 'bis', 'method'],
      xp: 35,
      prompt:
        'Project mBridge — a multi-CBDC platform with China, Hong Kong, Thailand, the UAE and later Saudi Arabia — reached minimum viable product in 2024. What happened next?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'handover',
          label:
            'The BIS ended its involvement on 31 October 2024 and handed the platform to the participating central banks',
        },
        {
          id: 'shut',
          label: 'It was shut down',
          feedback:
            'Handed over, not stopped. An experiment that changes owner is much harder to follow than one that ends — and harder still than one that succeeds in public.',
        },
        {
          id: 'merged',
          label: 'It was merged into Project Mariana',
          feedback:
            'Mariana had already concluded in September 2023. The two had different architectures, different participants and different questions.',
        },
        {
          id: 'bis-still-runs',
          label: 'The BIS still leads it',
          feedback:
            'The exit was confirmed publicly by the BIS General Manager in late 2024, on the reasoning that the participating central banks were ready to carry it forward themselves.',
        },
      ],
      correctOptionId: 'handover',
      explanation:
        'mBridge belongs in this module as a lesson about tracking rather than about payments. The BIS convenes, prototypes, publishes, and then leaves — and what remains is a live system owned by a group of central banks with no BIS report attached to it. So "where is the document?" is a question whose answer decays. The follow-up that keeps working is: who owns this now, and what do they publish? Ask it of any project in this field and you will usually find the answer faster than the argument you were about to have.',
    },
  ],
  keyTakeaways: [
    'A BIS proof of concept cannot become a currency: the chain runs prototype → central bank project → law → issuance decision → rollout.',
    'The digital euro is a legislative file. ECON adopted its position on 23 June 2026; issuance could follow in 2029 if the Regulation passes in 2026.',
    'The holding limit is undecided — what is being legislated is who sets it, within what ceiling, and how often it is reviewed.',
    'Pontes, live in Q3 2026, links DLT platforms to TARGET. It is wholesale, and it is not the digital euro.',
    'Ask who owns a project now and what they publish. Sponsors leave, and the documents stop.',
  ],
});
