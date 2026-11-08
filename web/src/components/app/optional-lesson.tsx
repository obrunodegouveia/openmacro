"use client";

import { DEFAULT_CHALLENGE_XP } from "@openmacro/core/content";
import { isBitcoinModeModule } from "@openmacro/core/content/optional";

import { LessonPlayer } from "@/components/app/lesson-player";
import { useBitcoinMode } from "@/components/app/bitcoin-mode";
import { useLocale } from "@/components/site/locale-provider";
import { Button } from "@/components/ui/button";

/**
 * A lesson in an optional module (`content/optional.ts`).
 *
 * The page prerenders without the lesson. It fills in once this browser's
 * Bitcoin mode and the learner's grants have been read and one of them
 * unlocks its module. A Bitcoin lesson with Bitcoin mode off says how to turn
 * it on, the same as the app; anything else is "not found".
 */
export function OptionalLesson({ lessonId, moduleId }: { lessonId: string; moduleId: string }) {
  const { t, lessonById, unlockedLoading } = useLocale();
  const [, setBitcoinMode] = useBitcoinMode();
  const lesson = lessonById(lessonId);

  if (lesson) {
    const xpAvailable = lesson.challenges.reduce(
      (sum, challenge) => sum + (challenge.xp ?? DEFAULT_CHALLENGE_XP),
      0,
    );
    return <LessonPlayer lesson={lesson} moduleId={moduleId} xpAvailable={xpAvailable} />;
  }
  if (unlockedLoading) return null;
  if (isBitcoinModeModule(moduleId)) {
    return (
      <div className="mx-auto grid max-w-xl justify-items-center gap-3 px-4 py-24 text-center">
        <span aria-hidden className="font-display text-5xl font-extrabold">
          ₿
        </span>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          {t("bitcoin.locked.title")}
        </h1>
        <p className="text-ink-muted">{t("bitcoin.locked.body")}</p>
        <Button onClick={() => setBitcoinMode(true)}>{t("bitcoin.turnOn")}</Button>
      </div>
    );
  }
  return (
    <div className="mx-auto grid max-w-xl gap-2 px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-extrabold tracking-tight">{t("notFound.title")}</h1>
      <p className="text-ink-muted">{t("notFound.body", { id: lessonId })}</p>
    </div>
  );
}
