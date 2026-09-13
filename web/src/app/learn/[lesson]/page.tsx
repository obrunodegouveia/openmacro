import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DEFAULT_CHALLENGE_XP,
  MODULES,
  getLessonById,
  getModuleForLesson,
} from "@openmacro/core/content";
import { localisedLessonById } from "@openmacro/core/i18n/content";
import { FooterMinimal } from "@/components/site/footer";
import { LessonPlayer } from "@/components/app/lesson-player";
import { getSiteText } from "@/lib/site-text";
import { serverLocale } from "@/lib/locale-server";
import { JsonLd, breadcrumbs, pageMetadata } from "@/lib/seo";

/** Every lesson is known at build time, so these prerender as static HTML. */
export function generateStaticParams() {
  return MODULES.flatMap((module) =>
    module.lessons.map((lesson) => ({ lesson: lesson.id })),
  );
}

/** Anything that is not a lesson is a genuine 404, not an empty player. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lesson: string }>;
}): Promise<Metadata> {
  const { lesson: id } = await params;
  const locale = await serverLocale();
  /**
   * The localised lesson, not the English one.
   *
   * The player already renders the lesson in the reader's language, so this was
   * the odd one out: a Portuguese page whose browser tab, share card and search
   * result all read English. Metadata is the part nobody sees while testing and
   * everybody sees when a link is shared.
   */
  const lesson = localisedLessonById(locale, id) ?? getLessonById(id);
  if (!lesson) return {};

  return pageMetadata({
    locale,
    title: lesson.title,
    description: lesson.subtitle,
    path: `/learn/${lesson.id}`,
    keywords: [
      "macroeconomics lesson",
      "central banking",
      "balance sheet",
      "monetary policy",
    ],
  });
}

/**
 * A lesson is a surface of its own, not a page of the site with a quiz on it.
 *
 * The marketing nav and the full footer are deliberately absent: a learner
 * halfway through posting a T-account does not need "For parents", "Contribute"
 * or a three-column sitemap in their field of view, and every one of those is a
 * way to lose the run. The player supplies the one exit that matters.
 */
export default async function LessonPage({
  params,
}: {
  params: Promise<{ lesson: string }>;
}) {
  const { lesson: id } = await params;
  const lesson = getLessonById(id);
  if (!lesson) notFound();

  const locale = await serverLocale();
  const localised = localisedLessonById(locale, id) ?? lesson;
  const parentModule = getModuleForLesson(lesson.id);
  const site = await getSiteText();
  const xpAvailable = lesson.challenges.reduce(
    (sum, challenge) => sum + (challenge.xp ?? DEFAULT_CHALLENGE_XP),
    0,
  );

  return (
    <>
      <main id="main">
        <JsonLd
          data={breadcrumbs([
            { name: site("nav.learn"), path: "/learn" },
            { name: localised.title, path: `/learn/${lesson.id}` },
          ])}
        />
        {/*
          The module's *id*, not its title. Ids do not change between languages
          and titles do, so the player looks the title up in the same catalogue
          it already resolves the lesson from — which is why the challenges were
          Portuguese while the module name above them stayed English.
        */}
        <LessonPlayer
          lesson={lesson}
          moduleId={parentModule?.id}
          xpAvailable={xpAvailable}
        />
      </main>
      <FooterMinimal />
    </>
  );
}
