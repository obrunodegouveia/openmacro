"use client";

import { ArrowRight, ListChecks } from "lucide-react";
import { createTranslator } from "@openmacro/core/i18n";

import { useAssignedExam } from "@/lib/use-assigned-exam";
import { localePath } from "@/lib/locale-path";

/**
 * The way into an assigned exam, in the language the exam is set in. Renders
 * nothing unless this learner has one waiting.
 */
export function AssignedExamCard() {
  const { exam } = useAssignedExam();
  if (!exam) return null;

  const t = createTranslator(exam.locale);

  return (
    <a
      href={localePath(exam.locale, "/dashboard/exam")}
      className="flex items-center gap-4 rounded-card border border-mint/40 bg-veil/[0.03] p-5 hover:border-mint/70"
    >
      <ListChecks className="size-6 shrink-0 text-mint-bright" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-extrabold uppercase tracking-wider text-ink-faint">
          {t("exam.card.eyebrow")}
        </span>
        <span className="block font-display text-lg font-extrabold tracking-tight">
          {t("exam.card.title")}
        </span>
      </span>
      <ArrowRight className="size-5 shrink-0 text-ink-muted" aria-hidden />
    </a>
  );
}
