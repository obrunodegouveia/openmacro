import { defineLesson } from '../../schema';

/**
 * The scrutiny lesson, done in both directions.
 *
 * The control features are real and are named in the report. Section 3.1
 * implements five of them — access control, pause, recovery, upgradeability
 * and monitoring — of which four answer numbered requirements C.1 to C.5.
 * Upgradeability answers none, and that is the detail the lesson turns on.
 *
 * Overstating the five costs credibility; dismissing them costs accuracy.
 * Three restate powers any operator of a real-time gross settlement system
 * already holds over a bank's account. Upgradeability, implemented with a
 * proxy pattern, has no clean analogue — and deserves the attention the other
 * four usually absorb.
 *
 * The claim being tested is the one that motivates most CBDC scepticism: that
 * complexity is itself concealment. On this project it is not — the design is
 * public and the control features are on the page. What is genuinely missing
 * from the report is missing because it was undecided, and the report says so.
 * Those are different failures with different remedies, and keeping them apart
 * is the transferable skill.
 */
export const readTheRequirementsLesson = defineLesson({
  id: 'read-the-requirements',
  title: 'Read the Requirements, Not the Reassurance',
  subtitle:
    'The control features are real, documented, and mostly not new. Telling those three things apart is the whole skill.',
  icon: '🔒',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  challenges: [
    {
      id: 'match-controls',
      type: 'concept_match',
      tags: ['cbdc', 'programmability', 'governance'],
      xp: 30,
      prompt:
        'Five control features implemented in Mariana’s tokens. Match each to what it does.',
      instructions: 'Pick a term, then its definition',
      pairs: [
        {
          id: 'access',
          term: 'Access control',
          definition:
            'Allow lists naming which institutions may hold, send and receive the token, kept per network',
        },
        {
          id: 'pause',
          term: 'Pause',
          definition:
            'The issuer halts every transaction in its currency, including issuance, redemption and recovery',
        },
        {
          id: 'recovery',
          term: 'Recovery',
          definition:
            'The issuer takes the token back from an institution removed from the allow list',
        },
        {
          id: 'upgrade',
          term: 'Upgradeability',
          definition:
            'The rules attached to the token are changed while it stays in active circulation',
        },
        {
          id: 'monitoring',
          term: 'Monitoring',
          definition: 'The issuer sees every transaction in its own currency, address by address',
        },
      ],
      explanation:
        'All five are in the report, described with implementation detail in the solution design. Four of them answer a numbered requirement: C.1 to C.5 cover issuance, access, prevention, recovery and monitoring. Upgradeability answers none — no requirement asked for it and it was built anyway, because that is simply how token contracts are maintained. Hold on to that, because the next question turns on it. None of this is a rumour and none of it leaked: it took a free PDF rather than an insider.',
    },
    {
      id: 'mc-what-is-actually-new',
      type: 'multiple_choice',
      tags: ['cbdc', 'programmability', 'rtgs'],
      xp: 35,
      prompt:
        'A central bank can already freeze a commercial bank’s reserve account and cut it out of the payment system, with no CBDC anywhere in sight. Which of the five features is genuinely new?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'upgradeability',
          label:
            'Upgradeability — the rules attached to the money can be rewritten while it stays in the holder’s hands',
        },
        {
          id: 'pause',
          label: 'Pause',
          feedback:
            'Suspending an institution’s access to settlement is an existing power, used in every banking crisis there has ever been. The token version is faster, not different in kind.',
        },
        {
          id: 'recovery',
          label: 'Recovery',
          feedback:
            'Debiting the account of a suspended institution is something the operator of a settlement system can already do. Uncomfortable, and old.',
        },
        {
          id: 'monitoring',
          label: 'Monitoring',
          feedback:
            'The central bank runs the settlement system. It already sees every interbank payment in its own currency — that is what operating TARGET or Fedwire consists of.',
        },
      ],
      correctOptionId: 'upgradeability',
      explanation:
        'Three of the five are the ordinary powers of a settlement-system operator restated in token form, and treating them as revelations spends the credibility the fourth question needs. Upgradeability is the one without a clean precedent — and, tellingly, the one no requirement asked for. Mariana used a proxy pattern so a token’s contract can have features "changed, added or removed" while the token remains in circulation. Among supervised banks that is a maintenance convenience. The reason to notice it now is that the same mechanism is what "programmable money" would have to be made of in a retail design — and that argument deserves to be had on the correct machine, with the correct holders.',
    },
    {
      id: 'mc-complexity-and-transparency',
      type: 'multiple_choice',
      tags: ['method', 'transparency', 'cbdc'],
      xp: 35,
      prompt:
        'A common claim: these projects are so complex that the complexity is itself a way of hiding what they do. Test it against Mariana specifically.',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'published-unread',
          label:
            'The design is published in full — the complexity limits how many people read it, not what can be found out',
        },
        {
          id: 'hidden',
          label: 'Confirmed: the control features were never disclosed',
          feedback:
            'They are in a free PDF — four of them as numbered requirements, all five with implementation detail in the design section. Whatever else is true here, concealment is not.',
        },
        {
          id: 'refuted',
          label: 'Refuted: the report exists, so there is nothing left to scrutinise',
          feedback:
            'Wrong in the more comfortable direction. Governance, law, privacy and performance are absent from the report because they were out of scope — unpublished because undecided, which is a real gap even though it is not concealment.',
        },
        {
          id: 'irrelevant',
          label: 'Unanswerable without access to the source code',
          feedback:
            'Source access would be better and its absence is fair criticism. But the requirements, the control features, the networks and the architecture are all documented, and a claim you can already check should be checked before you demand more.',
        },
      ],
      correctOptionId: 'published-unread',
      explanation:
        'Opacity and difficulty are different failures with different remedies. A document nobody reads is an accountability problem solved by people reading it. A decision nobody publishes is solved only by demanding publication. Mariana is mostly the first, and the parts that are genuinely undecided are labelled as undecided — which is the most useful thing a technical report can do. Keep the two ledgers apart and your scrutiny stays aimed at something that can move.',
    },
    {
      id: 'mc-retail-carry',
      type: 'multiple_choice',
      tags: ['method', 'retail-cbdc', 'digital-euro'],
      xp: 35,
      prompt: 'Which of Mariana’s findings carries cleanly into an argument about a retail CBDC?',
      instructions: 'Pick the best answer',
      options: [
        {
          id: 'none-directly',
          label:
            'None of them — but the method does: find the specification, read what powers it grants and to whom, and separate what is decided from what is deferred',
        },
        {
          id: 'surveillance',
          label:
            'That the issuer monitors every transaction, so a retail version would monitor every citizen',
          feedback:
            'A specification written for banks is not evidence about a design for households. The digital euro framework under negotiation goes the other way on identification — which is also a claim you should check in that document rather than accept from this one.',
        },
        {
          id: 'holding-limits',
          label: 'That holding limits are necessary',
          feedback:
            'Holding limits are a retail concept, about deposits leaving commercial banks for the central bank. Mariana has no retail holders and never discusses them.',
        },
        {
          id: 'amm-pricing',
          label: 'That retail payments would be priced by a bonding curve',
          feedback:
            'The market-maker prices foreign exchange between wholesale institutions. Nobody has proposed pricing a coffee this way, and the design could not do it.',
        },
      ],
      correctOptionId: 'none-directly',
      explanation:
        'The temptation with a document this detailed is to carry its conclusions across to the argument you actually care about. What travels is the method, not the findings. Applied to the digital euro, that means reading the draft Regulation — a different document, from a different institution, with an actual legislature attached to it and a public trail of amendments. Which is where the next lesson goes.',
    },
  ],
  keyTakeaways: [
    'Access control, pause, recovery, upgradeability and monitoring are all described in the report; C.1–C.5 are the numbered requirements behind four of them.',
    'Three of the five restate powers a settlement-system operator already has over a bank.',
    'Upgradeability had no requirement behind it, has no clean precedent, and is the mechanism any "programmable money" would need.',
    'Complexity that stops people reading is a different failure from a decision nobody published. Keep the ledgers apart.',
  ],
});
