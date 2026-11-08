"use client";

import { DEFAULT_CHALLENGE_XP } from "@openmacro/core/content";

import { LessonPlayer } from "@/components/app/lesson-player";
import { useLocale } from "@/components/site/locale-provider";

/**
 * A lesson in a private module (`content/private.ts`).
 *
 * The page prerenders without the lesson, so its text is never in the HTML a
 * crawler or a stranger fetches. It appears only once the signed-in learner's
 * grants have been read and include its module; anyone else gets the same
 * "not found" the app shows.
 */
export function PrivateLesson({ lessonId, moduleId }: { lessonId: string; moduleId: string }) {
  const { t, lessonById, grantsLoading } = useLocale();
  const lesson = lessonById(lessonId);

  if (lesson) {
    const xpAvailable = lesson.challenges.reduce(
      (sum, challenge) => sum + (challenge.xp ?? DEFAULT_CHALLENGE_XP),
      0,
    );
    return <LessonPlayer lesson={lesson} moduleId={moduleId} xpAvailable={xpAvailable} />;
  }
  if (grantsLoading) return null;
  return (
    <div className="mx-auto grid max-w-xl gap-2 px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-extrabold tracking-tight">{t("notFound.title")}</h1>
      <p className="text-ink-muted">{t("notFound.body", { id: lessonId })}</p>
    </div>
  );
}
