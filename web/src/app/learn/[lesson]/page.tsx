import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DEFAULT_CHALLENGE_XP,
  MODULES,
  getLessonById,
  getModuleForLesson,
} from "@openmacro/core/content";
import { FooterMinimal } from "@/components/site/footer";
import { LessonPlayer } from "@/components/app/lesson-player";
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
  const lesson = getLessonById(id);
  if (!lesson) return {};

  return pageMetadata({
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

  const parentModule = getModuleForLesson(lesson.id);
  const xpAvailable = lesson.challenges.reduce(
    (sum, challenge) => sum + (challenge.xp ?? DEFAULT_CHALLENGE_XP),
    0,
  );

  return (
    <>
      <main id="main">
        <JsonLd
          data={breadcrumbs([
            { name: "Learn", path: "/learn" },
            { name: lesson.title, path: `/learn/${lesson.id}` },
          ])}
        />
        <LessonPlayer
          lesson={lesson}
          moduleTitle={parentModule?.title}
          xpAvailable={xpAvailable}
        />
      </main>
      <FooterMinimal />
    </>
  );
}
