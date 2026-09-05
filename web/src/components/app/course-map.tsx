import Link from "next/link";
import { Clock, Coins, Play } from "lucide-react";
import { DEFAULT_CHALLENGE_XP, MODULES } from "@openmacro/core/content";
import type { Lesson } from "@openmacro/core/content/schema";

/**
 * Every playable lesson, grouped by module.
 *
 * Built from the shared registry, so a contributor who adds a lesson to
 * `packages/core` gets it listed here and on the mobile app's path without
 * touching either UI.
 */
export function CourseMap() {
  const lessonCount = MODULES.reduce((sum, module) => sum + module.lessons.length, 0);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl font-extrabold tracking-tight">
          Play a lesson
        </h2>
        <p className="text-xs font-bold text-ink-faint">
          {lessonCount} live · more shipping
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-8">
        {MODULES.map((module) => (
          <section key={module.id}>
            <h3 className="font-display text-base font-extrabold tracking-tight text-ink">
              {module.title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-muted">
              {module.description}
            </p>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {module.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <LessonCard lesson={lesson} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function LessonCard({ lesson }: { lesson: Lesson }) {
  const xp = lesson.challenges.reduce(
    (sum, challenge) => sum + (challenge.xp ?? DEFAULT_CHALLENGE_XP),
    0,
  );

  return (
    <Link
      href={`/learn/${lesson.id}`}
      className="group flex h-full gap-4 rounded-2xl border border-hairline bg-white/[0.03] p-4 transition-colors hover:border-mint/50 hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-bright"
    >
      <span
        aria-hidden
        className="grid size-11 shrink-0 place-items-center rounded-xl border border-hairline bg-white/5 text-xl"
      >
        {lesson.icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-display text-sm font-extrabold leading-snug text-ink">
          {lesson.title}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
          {lesson.subtitle}
        </span>

        <span className="mt-3 flex flex-wrap items-center gap-3 text-[0.7rem] font-bold text-ink-faint">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" aria-hidden />
            {lesson.estimatedMinutes} min
          </span>
          <span className="inline-flex items-center gap-1">
            <Coins className="size-3" aria-hidden />
            {xp} XP
          </span>
          <span className="capitalize">{lesson.difficulty}</span>
          <span className="ml-auto inline-flex items-center gap-1 text-mint-bright opacity-0 transition-opacity group-hover:opacity-100">
            <Play className="size-3" aria-hidden />
            Play
          </span>
        </span>
      </span>
    </Link>
  );
}
