import { LocaleLink } from "@/components/site/locale-link";
import { getSiteText } from "@/lib/site-text";
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
export default async function ModuleBriefsPage() {
  const s = await getSiteText();
  return (
    <>
      <Nav />
      <main id="main" className="pt-[var(--header-total)]">
        <Section>
          <SectionHeading
            align="left"
            overline={s("briefs.overline")}
            title={
              <>
                {s("briefs.title.lead")}{" "}
                <span className="text-gradient">{s("briefs.title.emphasis")}</span>.
              </>
            }
            lede={s("briefs.lede")}
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
                  {/* The level is the one thing a brief index can say about
                      whether to start here, and it costs a word. */}
                  <span className="rounded-full border border-hairline px-2 py-0.5">
                    {s(`level.${module.level}`)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <FileText className="size-3.5" aria-hidden />
                    {s("briefs.lessons", { count: module.lessons.length })}
                  </span>
                  <span
                    className={
                      module.video
                        ? "inline-flex items-center gap-1.5 text-mint-bright"
                        : "inline-flex items-center gap-1.5"
                    }
                  >
                    <Video className="size-3.5" aria-hidden />
                    {module.video ? s("briefs.videoLive") : s("briefs.videoNone")}
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-card border border-hairline bg-white/[0.02] p-6">
            <h2 className="font-display text-lg font-extrabold">{s("briefs.howTitle")}</h2>
            <ol className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-ink-muted">
              <li>{s("briefs.step.1")}</li>
              <li>{s("briefs.step.2")}</li>
              <li>{s("briefs.step.3")}</li>
              <li>
                {s("briefs.step.4")}{" "}
                <code className="font-mono text-xs text-ink">packages/core</code> {s("briefs.step.4.as")}{" "}
                <code className="font-mono text-xs text-ink">
                  video: {"{"} url, minutes, source {"}"}
                </code>
                {s("briefs.step.4.tail")}
              </li>
            </ol>
            <p className="mt-4 text-xs leading-relaxed text-ink-faint">
              {s("briefs.noApi")}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ink-faint">
              {s("briefs.privacy")}{" "}
              <LocaleLink href="/privacy" className="text-ink-muted underline underline-offset-4">
                {s("briefs.privacyLink")}
              </LocaleLink>
              .
            </p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
