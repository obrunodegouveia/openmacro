import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Coins } from "lucide-react";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { LessonRunner } from "@/components/site/lesson-runner";
import { LESSONS, findLesson, lessonXp } from "@/lib/exercises";
import { JsonLd, breadcrumbs, pageMetadata } from "@/lib/seo";

/** Every lesson is known at build time, so these prerender as static HTML. */
export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ lesson: lesson.slug }));
}

/** Anything that is not a lesson is a genuine 404, not an empty runner. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lesson: string }>;
}): Promise<Metadata> {
  const { lesson: slug } = await params;
  const lesson = findLesson(slug);
  if (!lesson) return {};

  return pageMetadata({
    title: lesson.title,
    description: lesson.subtitle,
    path: `/learn/${lesson.slug}`,
    keywords: ["macroeconomics lesson", "central banking", "balance sheet", "monetary policy"],
  });
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lesson: string }>;
}) {
  const { lesson: slug } = await params;
  const lesson = findLesson(slug);
  if (!lesson) notFound();

  return (
    <>
      <Nav />
      <main>
        <Section className="pt-28">
          <JsonLd
            data={breadcrumbs([
              { name: "Learn", path: "/learn" },
              { name: lesson.title, path: `/learn/${lesson.slug}` },
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
            <Badge tone="azure">{lesson.moduleLabel}</Badge>
            <h1 className="mt-4 text-balance font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {lesson.title}
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-ink-muted">{lesson.subtitle}</p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-bold text-ink-faint">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" aria-hidden />
                {lesson.estimatedMinutes} min
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Coins className="size-3.5" aria-hidden />
                {lessonXp(lesson)} XP available
              </span>
              <span>
                {lesson.exercises.length} step{lesson.exercises.length === 1 ? "" : "s"}
              </span>
            </div>
          </header>

          <div className="mt-12 max-w-4xl">
            <LessonRunner lesson={lesson} />
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
