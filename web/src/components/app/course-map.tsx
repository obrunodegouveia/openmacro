"use client";

import { LocaleLink } from "@/components/site/locale-link";
import { useSiteText } from "@/lib/use-site-text";
import { ArrowRight, Check, Clock, Coins, Play, RotateCcw, Trophy } from "lucide-react";
import { DEFAULT_CHALLENGE_XP } from "@openmacro/core/content";
import { useLocale } from "@/components/site/locale-provider";
import type { Lesson } from "@openmacro/core/content/schema";
import type { LessonProgress } from "@openmacro/core/progress/types";
import { useProgressSnapshot } from "@/lib/use-progress";
import { Permalink } from "@/components/ui/permalink";
import { ModuleVideo } from "@/components/app/module-video";
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
  const { t, modules } = useLocale();
  const all = modules.flatMap((module) => module.lessons);
  const done = snapshot
    ? all.filter((lesson) => snapshot.progress[lesson.id]).length
    : 0;
  const resume = all.find((lesson) => !snapshot?.progress[lesson.id]);
  const ready = state === "ready" && Boolean(snapshot);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl font-extrabold tracking-tight">
          {t("map.title")}
        </h2>
        <p className="text-xs font-bold text-ink-faint">
          {ready
            ? t("map.finished", { done, total: all.length })
            : t("map.live", { count: all.length })}
        </p>
      </div>

      {/* Resume ---------------------------------------------------------- */}
      {ready && done > 0 && resume ? (
        <LocaleLink
          href={`/learn/${resume.id}`}
          className="group mt-5 flex items-center gap-4 rounded-card border border-mint/30 bg-mint/[0.06] p-4 transition-colors hover:border-mint/60 hover:bg-mint/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-bright"
        >
          <span aria-hidden className="text-2xl">
            {resume.icon}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-extrabold uppercase tracking-wider text-mint-bright">
              {t("map.resume")}
            </span>
            <span className="mt-0.5 block truncate font-display font-extrabold text-ink">
              {resume.title}
            </span>
          </span>
          <ArrowRight
            className="size-5 shrink-0 text-mint-bright transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </LocaleLink>
      ) : null}

      <div className="mt-6 flex flex-col gap-8">
        {modules.map((module, index) => {
          const moduleDone = module.lessons.filter(
            (lesson) => snapshot?.progress[lesson.id],
          ).length;
          /* `MODULES` is stored in level order, so a heading is drawn when
             the level changes rather than by grouping — see registry.ts.
             Sorting a copy here would let this page disagree with the order
             the lesson runner walks. */
          const opensLevel = module.level !== modules[index - 1]?.level;

          return (
            /* The `id` makes each module a real destination — without one,
               "share the module" has nothing to point at. No scroll offset
               here: `scroll-padding-top` on <html> already clears the fixed
               header, and adding a margin as well lands 88px too low. */
            <section key={module.id} id={module.id}>
              {opensLevel ? (
                <div className="mb-7 mt-12 border-t border-hairline pt-9 first:mt-0 first:border-0 first:pt-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-display text-2xl font-extrabold tracking-tight text-ink">
                      {t(`level.${module.level}`)}
                    </h3>
                    <span className="rounded-full border border-mint/30 bg-mint/10 px-2.5 py-0.5 text-xs font-bold text-mint-bright">
                      {t('level.count', {
                        count: modules.filter((entry) => entry.level === module.level).length,
                      })}
                    </span>
                  </div>
                  <p className="mt-1.5 max-w-2xl leading-relaxed text-ink-muted">
                    {t(`level.${module.level}.blurb`)}
                  </p>
                </div>
              ) : null}
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

              {/* Watch first, then play. Only rendered for modules that have
                  a video — every other module is unchanged. */}
              {module.video ? (
                <div className="max-w-2xl">
                  <ModuleVideo video={module.video} moduleTitle={module.title} />
                </div>
              ) : null}

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
  const { t } = useLocale();
  const s = useSiteText();
  const xp = lesson.challenges.reduce(
    (sum, challenge) => sum + (challenge.xp ?? DEFAULT_CHALLENGE_XP),
    0,
  );
  const perfect = record ? record.bestXp >= xp : false;

  return (
    <LocaleLink
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
                {t("map.best", { best: record.bestXp, total: xp })}
              </span>
              {record.completions > 1 ? (
                <span>{t("map.runs", { count: record.completions })}</span>
              ) : null}
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" aria-hidden />
                {t("path.lesson.minutes", { count: lesson.estimatedMinutes })}
              </span>
              <span className="inline-flex items-center gap-1">
                <Coins className="size-3" aria-hidden />
                {t("path.xp", { count: xp })}
              </span>
              <span>{t(`difficulty.${lesson.difficulty}`)}</span>
            </>
          )}
          <span className="ml-auto inline-flex items-center gap-1 text-mint-bright opacity-0 transition-opacity group-hover:opacity-100">
            <Play className="size-3" aria-hidden />
            {record ? s("map.replay") : s("map.play")}
          </span>
        </span>
      </span>
    </LocaleLink>
  );
}
