import { GitFork, GitPullRequest, MessageCircle, Star, Users } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { getSiteText } from "@/lib/site-text";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeSnippet } from "@/components/site/code-snippet";
import { SAMPLE_LESSON_JSON } from "@/lib/curriculum";
import { getRepoStats } from "@/lib/github";
import {
  GITHUB_CONTRIBUTING_URL,
  GITHUB_ISSUES_URL,
  GITHUB_LESSONS_URL,
  GITHUB_URL,
  SITE,
} from "@/lib/site";

/**
 * Contributor hub. A Server Component so the GitHub call happens once per
 * cache window on the server rather than once per visitor in the browser.
 */
export async function ContributorHub() {
  const s = await getSiteText();
  const stats = await getRepoStats();

  const tiles = [
    { label: s("contribute.stars"), value: stats.stars, icon: <Star className="size-4" aria-hidden /> },
    { label: s("contribute.prs"), value: stats.openPullRequests, icon: <GitPullRequest className="size-4" aria-hidden /> },
    { label: s("contribute.contributors"), value: stats.contributors, icon: <Users className="size-4" aria-hidden /> },
    { label: s("contribute.forks"), value: stats.forks, icon: <GitFork className="size-4" aria-hidden /> },
  ];

  return (
    <Section id="contribute">
      <SectionHeading
        overline={s("contribute.overline")}
        title={
          <>
            {s("contribute.title.lead")}{" "}
            <span className="text-gradient">{s("contribute.title.emphasis")}</span>.
            <br className="hidden sm:block" /> {s("contribute.title.tail")}
          </>
        }
        lede={s("contribute.lede")}
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <div className="order-2 min-w-0 lg:order-1">
          <CodeSnippet
            code={SAMPLE_LESSON_JSON}
            filename="packages/core/src/content/lessons/module-03-fed-ecb-levers/lesson-02-rrp-floor-mechanics.json"
          />
          <p className="mt-3 text-xs leading-relaxed text-ink-faint">
            {s("contribute.validated")}{" "}
            <code className="font-mono text-ink-muted">
              packages/core/src/content/schema.ts
            </code>{" "}
            {s("contribute.validatedBy")}{" "}
            <code className="font-mono text-ink-muted">npm run lint:content</code>,
            {s("contribute.validatedTail")}
          </p>
        </div>

        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <Card className="p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg font-extrabold">
                {SITE.githubRepo}
              </h3>
              <span className="text-[0.7rem] font-bold uppercase tracking-wider text-ink-faint">
                {stats.live ? s("contribute.live") : s("contribute.awaiting")}
              </span>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3">
              {tiles.map((tile) => (
                <div
                  key={tile.label}
                  className="rounded-2xl border border-hairline bg-abyss/60 p-4"
                >
                  <dt className="flex items-center gap-1.5 text-[0.7rem] font-extrabold uppercase tracking-wider text-ink-faint">
                    {tile.icon}
                    {tile.label}
                  </dt>
                  <dd className="tabular mt-1 font-mono text-2xl font-extrabold text-ink">
                    {stats.live ? tile.value.toLocaleString("en-US") : "—"}
                  </dd>
                </div>
              ))}
            </dl>

            {!stats.live ? (
              <p className="mt-4 text-xs leading-relaxed text-ink-faint">
                {s("contribute.countersNote")}
              </p>
            ) : null}
          </Card>

          <Card className="flex flex-col gap-3 p-6">
            <h3 className="font-display text-lg font-extrabold">{s("contribute.startHere")}</h3>
            <p className="text-sm leading-relaxed text-ink-muted">
              {s("contribute.goodFirst")}{" "}
              <code className="font-mono text-mint-bright">good-first-lesson</code>.
              {s("contribute.goodFirstTail")}
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="flex-1">
                <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener">
                  <GithubIcon className="size-4" aria-hidden />
                  {s("contribute.viewRepo")}
                </a>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <a href={SITE.discordUrl} target="_blank" rel="noreferrer noopener">
                  <MessageCircle className="size-4" aria-hidden />
                  {s("contribute.joinDiscord")}
                </a>
              </Button>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold">
              <a
                className="text-ink-muted underline-offset-4 hover:text-mint-bright hover:underline"
                href={GITHUB_CONTRIBUTING_URL}
                target="_blank"
                rel="noreferrer noopener"
              >
                {s("contribute.guide")}
              </a>
              <a
                className="text-ink-muted underline-offset-4 hover:text-mint-bright hover:underline"
                href={GITHUB_LESSONS_URL}
                target="_blank"
                rel="noreferrer noopener"
              >
                {s("contribute.browseLessons")}
              </a>
              <a
                className="text-ink-muted underline-offset-4 hover:text-mint-bright hover:underline"
                href={GITHUB_ISSUES_URL}
                target="_blank"
                rel="noreferrer noopener"
              >
                {s("contribute.openIssues")}
              </a>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}
