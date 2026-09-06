import { DEFAULT_CHALLENGE_XP } from "@openmacro/core/content";
import type { Challenge, Module } from "@openmacro/core/content/schema";
import { SITE } from "@/lib/site";

/**
 * ============================================================================
 * Module briefs
 * ============================================================================
 *
 * A plain-text rendering of one module, written to be handed to a tool that
 * turns documents into narrated video — NotebookLM being the one this was
 * built for.
 *
 * The shape matters more than the words. Those tools build slides, and slides
 * come out of headings, short declarative lines and figures with their units
 * attached; they come out badly from paragraphs. So this emits one heading per
 * idea, one line per fact, and keeps every number next to the date it belongs
 * to rather than letting a summariser detach them.
 *
 * The most valuable section is the one no ordinary source document has. Every
 * wrong answer in the course carries a targeted rebuttal — what somebody
 * believes instead, and why it is wrong — and there are several hundred of
 * them. "Here is the mistake people make" is the best material an explainer
 * video can be given, and it is already written.
 *
 * Generated from the content registry, so a brief cannot describe a lesson
 * that no longer exists.
 */

/** Pulls the misconceptions out of a challenge, whatever its type. */
function misconceptions(challenge: Challenge): { claim: string; rebuttal: string }[] {
  if (challenge.type === "multiple_choice") {
    return challenge.options
      .filter((option) => option.feedback && option.id !== challenge.correctOptionId)
      .map((option) => ({ claim: option.label, rebuttal: option.feedback! }));
  }
  if (challenge.type === "t_account_flow") {
    return challenge.options
      .filter((option) => option.feedback)
      .map((option) => ({
        claim: `Posting ${option.shift.account} to ${option.shift.entityId}'s ${option.shift.side}s`,
        rebuttal: option.feedback!,
      }));
  }
  return [];
}

/** The correct answer, stated plainly, for the types where that is possible. */
function answerOf(challenge: Challenge): string | null {
  switch (challenge.type) {
    case "multiple_choice":
      return (
        challenge.options.find((option) => option.id === challenge.correctOptionId)?.label ?? null
      );
    case "order_flow":
      return challenge.correctOrder
        .map((id, index) => {
          const event = challenge.events.find((candidate) => candidate.id === id);
          return `${index + 1}. ${event?.label ?? id}`;
        })
        .join(" → ");
    case "concept_match":
      return challenge.pairs.map((pair) => `${pair.term} = ${pair.definition}`).join("; ");
    case "t_account_flow":
      return challenge.expectedShifts
        .map((shift) => `${shift.account} on ${shift.entityId}'s ${shift.side}s: ${shift.delta}`)
        .join("; ");
    case "interactive_sim":
      return challenge.objective.description;
  }
}

export function buildModuleBrief(module: Module): string {
  const out: string[] = [];
  const xp = module.lessons.reduce(
    (sum, lesson) =>
      sum +
      lesson.challenges.reduce(
        (inner, challenge) => inner + (challenge.xp ?? DEFAULT_CHALLENGE_XP),
        0,
      ),
    0,
  );
  const minutes = module.lessons.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0);

  out.push(`# ${module.title}`);
  out.push("");
  out.push(module.description);
  out.push("");
  out.push(
    `From OpenMacro (${SITE.url}), an open-source course on how the monetary system works. ` +
      `This module is ${module.lessons.length} lessons, about ${minutes} minutes and ${xp} XP. ` +
      `Every figure below is stated with the date it was reported; treat undated numbers as absent rather than current.`,
  );
  out.push("");

  // ---- What the module answers -------------------------------------------
  out.push("## What this module answers");
  out.push("");
  for (const lesson of module.lessons) {
    out.push(`- **${lesson.title}** — ${lesson.subtitle}`);
  }
  out.push("");

  // ---- The conclusions, up front -----------------------------------------
  out.push("## The conclusions, in one line each");
  out.push("");
  for (const lesson of module.lessons) {
    for (const takeaway of lesson.keyTakeaways ?? []) out.push(`- ${takeaway}`);
  }
  out.push("");

  // ---- Lesson by lesson ---------------------------------------------------
  module.lessons.forEach((lesson, index) => {
    out.push(`## Lesson ${index + 1}: ${lesson.title}`);
    out.push("");
    out.push(`_${lesson.subtitle}_`);
    out.push("");

    for (const challenge of lesson.challenges) {
      out.push(`### ${challenge.prompt}`);
      out.push("");
      const answer = answerOf(challenge);
      if (answer) {
        out.push(`**Answer:** ${answer}`);
        out.push("");
      }
      out.push(challenge.explanation);
      out.push("");

      const wrong = misconceptions(challenge);
      if (wrong.length) {
        out.push("**What people believe instead:**");
        out.push("");
        for (const { claim, rebuttal } of wrong) {
          out.push(`- _"${claim}"_ — ${rebuttal}`);
        }
        out.push("");
      }
    }

    if (lesson.keyTakeaways?.length) {
      out.push(`**Takeaways from ${lesson.title}:**`);
      out.push("");
      for (const takeaway of lesson.keyTakeaways) out.push(`- ${takeaway}`);
      out.push("");
    }
  });

  // ---- Closing ------------------------------------------------------------
  out.push("## About this material");
  out.push("");
  out.push(
    `Written for OpenMacro and MIT licensed, so it may be reused and adapted freely with attribution. ` +
      `The lessons themselves are interactive — learners post central bank operations onto balance sheets by hand — ` +
      `and are playable at ${SITE.url}/learn.`,
  );
  out.push("");
  out.push(
    "If you are generating a narrated overview from this document: the section headings are the natural slide " +
      "boundaries, the lines under “The conclusions” work as an opening summary, and the " +
      "“What people believe instead” entries are the strongest material for holding attention — " +
      "each one is a specific, common mistake with the correction attached.",
  );
  out.push("");

  return out.join("\n");
}
