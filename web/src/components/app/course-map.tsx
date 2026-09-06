"use client";

import Link from "next/link";
import { ArrowRight, Check, Clock, Coins, Play, RotateCcw, Trophy } from "lucide-react";
import { DEFAULT_CHALLENGE_XP, MODULES } from "@openmacro/core/content";
import type { Lesson } from "@openmacro/core/content/schema";
import type { LessonProgress } from "@openmacro/core/progress/types";
import { useProgressSnapshot } from "@/lib/use-progress";
import { Permalink } from "@/components/ui/permalink";
import { cn } from "@/lib/utils";

/**
 * Every playable lesson, grouped by module.
 *
 * Built from the shared registry, so a contributor who adds a lesson to
 * `packages/core` gets it listed here and on the mobile app's path without
 * touching either UI.
 *
 * It also knows what the learner has already done. This page is the one the
 * nav points at and the one search sends people to, and a course index that
 * cannot tell you where you got to is a brochure, not a course. The progress
 * comes from the same hook the dashboard uses, so "finished" means one thing
 * across the site.
 */
export function CourseMap() {
  const { snapshot, state } = useProgressSnapshot();
  const all = MODULES.flatMap((module) => module.lessons);
  const done = snapshot
    ? all.filter((lesson) => snapshot.progress[lesson.id]).length
    : 0;
  const resume = all.find((lesson) => !snapshot?.progress[lesson.id]);
  const ready = state === "ready" && Boolean(snapshot);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl font-extrabold tracking-tight">
          Play a lesson
        </h2>
        <p className="text-xs font-bold text-ink-faint">
          {ready ? `${done} of ${all.length} finished` : `${all.length} live · more shipping`}
        </p>
      </div>

      {/* Resume ---------------------------------------------------------- */}
      {ready && done > 0 && resume ? (
        <Link
          href={`/learn/${resume.id}`}
          className="group mt-5 flex items-center gap-4 rounded-card border border-mint/30 bg-mint/[0.06] p-4 transition-colors hover:border-mint/60 hover:bg-mint/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-bright"
        >
          <span aria-hidden className="text-2xl">
            {resume.icon}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-extrabold uppercase tracking-wider text-mint-bright">
              Pick up where you left off
            </span>
            <span className="mt-0.5 block truncate font-display font-extrabold text-ink">
              {resume.title}
            </span>
          </span>
          <ArrowRight
            className="size-5 shrink-0 text-mint-bright transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </Link>
      ) : null}

      <div className="mt-6 flex flex-col gap-8">
        {MODULES.map((module) => {
          const moduleDone = module.lessons.filter(
            (lesson) => snapshot?.progress[lesson.id],
          ).length;

          return (
            /* The `id` makes each module a real destination — without one,
               "share the module" has nothing to point at. No scroll offset
               here: `scroll-padding-top` on <html> already clears the fixed
               header, and adding a margin as well lands 88px too low. */
            <section key={module.id} id={module.id}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="min-w-0 font-display text-base font-extrabold tracking-tight text-ink">
                  {module.title}
                  <Permalink
                    href={`/learn#${module.id}`}
                    label={module.title}
                    size="sm"
                    className="ml-1.5 translate-y-[-0.05em]"
                  />
                </h3>
                {ready ? (
                  <p className="shrink-0 text-xs font-bold text-ink-faint">
                    {moduleDone} / {module.lessons.length}
                  </p>
                ) : null}
              </div>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-muted">
                {module.description}
              </p>

              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {module.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <LessonCard
                      lesson={lesson}
                      record={snapshot?.progress[lesson.id]}
                    />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function LessonCard({
  lesson,
  record,
}: {
  lesson: Lesson;
  record?: LessonProgress;
}) {
  const xp = lesson.challenges.reduce(
    (sum, challenge) => sum + (challenge.xp ?? DEFAULT_CHALLENGE_XP),
    0,
  );
  const perfect = record ? record.bestXp >= xp : false;

  return (
    <Link
      href={`/learn/${lesson.id}`}
      className={cn(
        "group flex h-full gap-4 rounded-2xl border p-4 transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-bright",
        record
          ? "border-mint/25 bg-mint/[0.05] hover:border-mint/50"
          : "border-hairline bg-white/[0.03] hover:border-mint/50 hover:bg-white/[0.06]",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-xl border text-xl",
          record ? "border-mint/40 bg-mint/10" : "border-hairline bg-white/5",
        )}
      >
        {record ? (
          <Check className="size-5 text-mint-bright" strokeWidth={3} />
        ) : (
          lesson.icon
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-display text-sm font-extrabold leading-snug text-ink">
          {lesson.title}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
          {lesson.subtitle}
        </span>

        <span className="mt-3 flex flex-wrap items-center gap-3 text-[0.7rem] font-bold text-ink-faint">
          {record ? (
            <>
              <span className="inline-flex items-center gap-1 text-mint-bright">
                {perfect ? (
                  <Trophy className="size-3" aria-hidden />
                ) : (
                  <RotateCcw className="size-3" aria-hidden />
                )}
                Best {record.bestXp} / {xp} XP
              </span>
              {record.completions > 1 ? <span>{record.completions} runs</span> : null}
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" aria-hidden />
                {lesson.estimatedMinutes} min
              </span>
              <span className="inline-flex items-center gap-1">
                <Coins className="size-3" aria-hidden />
                {xp} XP
              </span>
              <span className="capitalize">{lesson.difficulty}</span>
            </>
          )}
          <span className="ml-auto inline-flex items-center gap-1 text-mint-bright opacity-0 transition-opacity group-hover:opacity-100">
            <Play className="size-3" aria-hidden />
            {record ? "Replay" : "Play"}
          </span>
        </span>
      </span>
    </Link>
  );
}
