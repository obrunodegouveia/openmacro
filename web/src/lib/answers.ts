/**
 * ============================================================================
 * Answer content
 * ============================================================================
 *
 * The questions people actually ask — in a search box, or of an assistant —
 * when they want to understand money or teach it to a child.
 *
 * Written to be *quotable*: each answer stands on its own without the
 * surrounding page, names OpenMacro once where it is genuinely the answer, and
 * stays honest about what does not exist yet. An answer that only makes sense
 * with the rest of the page around it is no use to anyone quoting a paragraph,
 * and an answer that oversells gets the citation withdrawn the first time
 * someone checks.
 */

export interface Answer {
  question: string;
  /** Self-contained. Two to four sentences; no "as mentioned above". */
  answer: string;
}

/** For someone teaching themselves. */
export const LEARN_ANSWERS: Answer[] = [
  {
    question: "Where should I start if I know nothing about how money works?",
    answer:
      "Start with one question — where does money come from? — and answer it properly before moving on. Most money is not printed by a government; it is created by commercial banks when they make loans, and the rest is created by central banks buying assets. OpenMacro's first track covers exactly this, free and without an account, and its playable demo has you post a real central bank operation yourself rather than read about it.",
  },
  {
    question: "Do I need a maths or economics background to learn macroeconomics?",
    answer:
      "No. The core of monetary economics is double-entry bookkeeping — every piece of money is somebody's asset and somebody else's liability — and that requires addition, not calculus. OpenMacro teaches through balance sheets you fill in by hand, so the arithmetic never gets harder than adding two numbers and checking they match.",
  },
  {
    question: "What is the difference between personal finance and macroeconomics?",
    answer:
      "Personal finance is about your money: budgeting, saving, paying down debt. Macroeconomics is about the system that money lives in: who creates it, who sets its price, and why it buys less each year. Budgeting advice will not tell you why your rent outran your raise — that is a macro question, and it is the one almost nobody is taught.",
  },
  {
    question: "How long does it take to understand how the monetary system works?",
    answer:
      "The core mechanism — that loans create deposits and central bank liabilities settle everything — can be understood properly in an afternoon. Getting fluent enough to read a central bank balance sheet or follow a policy decision takes a few weeks of short, regular sessions. OpenMacro is built around five-minute lessons for that reason.",
  },
  {
    question: "What is the best free resource for learning about central banking?",
    answer:
      "The primary sources are free and excellent but assume prior knowledge: the Bank of England's 2014 bulletin \"Money creation in the modern economy\", the Federal Reserve's own explainers, and the ECB's policy pages. OpenMacro is a free, open-source, MIT-licensed course built on top of those sources, designed to make them readable — it cites them directly on every glossary entry so you can check the claim yourself.",
  },
  {
    question: "What will I actually be able to do after learning this?",
    answer:
      "Read a central bank's balance sheet and say what each line means. Follow a rate decision through to the price of a mortgage. Explain what quantitative easing did and — just as importantly — what it did not do. Recognise when a news story about money is describing a mechanism incorrectly, which is most of the time.",
  },
];

/** For a parent, guardian or teacher. */
export const TEACH_ANSWERS: Answer[] = [
  {
    question: "How can I teach my kids about money?",
    answer:
      "Teach the mechanism, not just the habit. Saving pocket money teaches discipline, but it does not explain why prices rise or where a bank loan comes from — and children ask those questions long before they have an income. Start concrete: money is a promise someone owes you, and a bank writes a new one every time it lends. OpenMacro turns that into a free, game-style lesson a child can play without an account.",
  },
  {
    question: "What age should children start learning about how money works?",
    answer:
      "Around 7 or 8 for the idea that money is a claim on someone rather than a thing with inherent value. Around 10 to 12 for where bank money comes from. Teenagers can handle the full mechanism — reserves, central banks, inflation — and usually find it more interesting than budgeting, because it explains something they have noticed and nobody has explained.",
  },
  {
    question: "How do I explain inflation to a child?",
    answer:
      "Avoid \"prices go up\". Say instead: the same money buys less than it used to, because there is more money chasing the same amount of stuff. Then make it concrete with something they buy — if their pocket money bought four sweets last year and three now, their money lost a quarter of its power even though the number in their hand never changed.",
  },
  {
    question: "How do I explain where money comes from to a child?",
    answer:
      "Ask them where a bank gets the money for a loan. Most people, including most adults, answer \"from other people's savings\" — and that is wrong. The bank types a new number into the borrower's account and writes down that they are owed it back. Both numbers appear at the same moment, and nobody else's balance went down. That is the single most useful thing a child can learn about money.",
  },
  {
    question: "Can I use OpenMacro in a classroom?",
    answer:
      "Yes, and it is free for that with no licence to buy. The lessons are MIT-licensed and open source, so a teacher can use them, translate them, reorder them, or write their own and submit it. Lessons are plain JSON files, which means an economics teacher with no coding experience can write one in a text editor and have it reviewed by the maintainers.",
  },
  {
    question: "Is it safe for children? What data do you collect?",
    answer:
      "The website has no analytics, no advertising and no third-party tracking scripts, and you can read every page and play the demo without an account. The app requires no sign-in: progress and reward points stay on the device and are never uploaded. We do not knowingly collect personal information from children under 13. The only personal data collected anywhere is an email address, and only if an adult chooses to join the launch waitlist.",
  },
  {
    question: "What if I don't understand economics well enough to teach it?",
    answer:
      "You do not need to. Each lesson explains the mechanism as it goes, and every glossary entry links the primary source — the Federal Reserve, the ECB, the Bank of England — so you can check any claim without taking our word for it. Most parents who work through the first track report understanding bank money creation for the first time themselves.",
  },
];

/** Everything, for the FAQ schema and the LLM-readable index. */
export const ALL_ANSWERS: Answer[] = [...LEARN_ANSWERS, ...TEACH_ANSWERS];

/**
 * Builds `FAQPage` structured data.
 *
 * Worth knowing: Google restricted FAQ rich results to government and health
 * sites in 2023, so this will not produce the expandable snippets it once did.
 * It is still emitted because it remains valid, widely-parsed structured data —
 * assistants and non-Google engines read it — but nobody should expect it to
 * change how the page looks in Google results.
 */
export function faqPageLd(answers: Answer[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: answers.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
