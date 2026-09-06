import Link from "next/link";
import { FileText, Video } from "lucide-react";
import { MODULES } from "@openmacro/core/content";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Section, SectionHeading } from "@/components/ui/section";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = {
  ...pageMetadata({
    title: "Module briefs",
    description:
      "One plain-text brief per module, written to be turned into a narrated overview video.",
    path: "/modules",
  }),
  // Working material for whoever maintains the course, not a page for learners.
  robots: { index: false, follow: true },
};

/**
 * The list of brief URLs, so making a video per module is copy, paste, repeat.
 *
 * Deliberately unlisted in the nav and not indexed: this is a workbench, not a
 * destination. Its whole job is to be the page you open once per module when
 * you are generating overviews.
 */
export default function ModuleBriefsPage() {
  return (
    <>
      <Nav />
      <main id="main" className="pt-16">
        <Section>
          <SectionHeading
            align="left"
            overline="Working material"
            title={
              <>
                One brief per module, ready to{" "}
                <span className="text-gradient">turn into a video</span>.
              </>
            }
            lede="Each link below returns that module as plain text: the questions it answers, the mechanism behind each one, the misconceptions with their rebuttals, and the takeaways. Paste a link into NotebookLM as a website source and ask it for a Video Overview."
          />

          <ol className="mt-10 flex flex-col gap-3">
            {MODULES.map((module, index) => (
              <li
                key={module.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-hairline bg-white/[0.03] p-4"
              >
                <span className="font-mono text-xs font-bold text-ink-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-sm font-extrabold text-ink">
                    {module.title}
                  </span>
                  <a
                    href={`/modules/${module.id}`}
                    className="mt-0.5 block truncate font-mono text-xs text-mint-bright underline-offset-4 hover:underline"
                  >
                    {SITE.url}/modules/{module.id}
                  </a>
                </span>
                <span className="flex shrink-0 items-center gap-3 text-xs font-bold text-ink-faint">
                  <span className="inline-flex items-center gap-1.5">
                    <FileText className="size-3.5" aria-hidden />
                    {module.lessons.length} lessons
                  </span>
                  <span
                    className={
                      module.video
                        ? "inline-flex items-center gap-1.5 text-mint-bright"
                        : "inline-flex items-center gap-1.5"
                    }
                  >
                    <Video className="size-3.5" aria-hidden />
                    {module.video ? "video live" : "no video yet"}
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-card border border-hairline bg-white/[0.02] p-6">
            <h2 className="font-display text-lg font-extrabold">How to make one</h2>
            <ol className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-ink-muted">
              <li>1. Open NotebookLM and add the module link above as a website source.</li>
              <li>2. Ask for a Video Overview. The headings in the brief become the slides.</li>
              <li>3. Publish the result somewhere with a stable URL.</li>
              <li>
                4. Add it to the module in{" "}
                <code className="font-mono text-xs text-ink">packages/core</code> as{" "}
                <code className="font-mono text-xs text-ink">
                  video: {"{"} url, minutes, source {"}"}
                </code>
                , and it appears above that module&rsquo;s lessons.
              </li>
            </ol>
            <p className="mt-4 text-xs leading-relaxed text-ink-faint">
              There is no API for this yet — Google&rsquo;s notebook API is enterprise-only and does
              not expose video generation — so step two is done by hand, once per module. The briefs
              are the part worth automating and they are generated from the course itself, so they
              cannot describe a lesson that no longer exists.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ink-faint">
              Videos are embedded without contacting YouTube until a learner presses play, so the
              privacy notice stays true for anyone who does not watch. See{" "}
              <Link href="/privacy" className="text-ink-muted underline underline-offset-4">
                the privacy notice
              </Link>
              .
            </p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
