import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Coins, Heart } from "lucide-react";
import {
  DEFAULT_CHALLENGE_XP,
  DEFAULT_HEARTS,
  MODULES,
  getLessonById,
  getModuleForLesson,
} from "@openmacro/core/content";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
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
      <Nav />
      <main id="main">
        <Section className="pt-28">
          <JsonLd
            data={breadcrumbs([
              { name: "Learn", path: "/learn" },
              { name: lesson.title, path: `/learn/${lesson.id}` },
            ])}
          />

          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All lessons
          </Link>

          <header className="mt-6 max-w-3xl">
            {parentModule ? <Badge tone="azure">{parentModule.title}</Badge> : null}
            <h1 className="mt-4 text-balance font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              <span aria-hidden className="mr-2">
                {lesson.icon}
              </span>
              {lesson.title}
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-ink-muted">
              {lesson.subtitle}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-bold text-ink-faint">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" aria-hidden />
                {lesson.estimatedMinutes} min
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Coins className="size-3.5" aria-hidden />
                {xpAvailable} XP available
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Heart className="size-3.5" aria-hidden />
                {lesson.hearts ?? DEFAULT_HEARTS} hearts
              </span>
              <span>
                {lesson.challenges.length} challenge
                {lesson.challenges.length === 1 ? "" : "s"}
              </span>
            </div>
          </header>

          <div className="mt-12 max-w-4xl">
            <LessonPlayer lesson={lesson} />
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
