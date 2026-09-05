import type { Answer } from "@/lib/answers";

/**
 * Question-and-answer block.
 *
 * Rendered as plain semantic HTML — a heading per question, a paragraph per
 * answer — rather than as collapsed accordions. Content hidden behind a click
 * is harder for both a reader skimming and a crawler extracting, and there is
 * nothing here worth hiding.
 */
export function AnswerList({ answers }: { answers: Answer[] }) {
  return (
    <div className="flex flex-col gap-8">
      {answers.map((item) => (
        <article key={item.question}>
          <h3 className="text-balance font-display text-lg font-extrabold leading-snug text-ink sm:text-xl">
            {item.question}
          </h3>
          <p className="mt-2.5 text-pretty leading-relaxed text-ink-muted">
            {item.answer}
          </p>
        </article>
      ))}
    </div>
  );
}
