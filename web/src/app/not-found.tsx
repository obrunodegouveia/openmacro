import { LocaleLink } from "@/components/site/locale-link";
import { getSiteText } from "@/lib/site-text";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/seo";

/**
 * 404.
 *
 * Next returns a real 404 status for this route, which is what matters for
 * crawlers — a "soft 404" that answers 200 with an error page is one of the
 * most common ways sites leak crawl budget. The links exist so a visitor who
 * lands on a dead URL has somewhere useful to go.
 */
export const metadata = {
  ...pageMetadata({
    title: "Page not found",
    description: "That page does not exist on openmacro.org.",
    path: "/404",
  }),
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  const s = await getSiteText();
  return (
    <>
      <Nav />
      <main id="main" className="pt-[var(--header-total)]">
        <Section>
          <div className="mx-auto max-w-xl text-center">
            <p className="font-mono text-6xl font-extrabold text-mint-bright">
              404
            </p>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight">
              {s("notFound.title")}
            </h1>
            <p className="mt-3 leading-relaxed text-ink-muted">
              {s("notFound.body")}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <LocaleLink
                href="/"
                className="inline-flex h-12 items-center justify-center rounded-xl border-b-4 border-mint-deep bg-mint px-6 font-extrabold text-abyss transition-all hover:bg-mint-bright active:translate-y-[3px] active:border-b-0"
              >
                {s("notFound.home")}
              </LocaleLink>
              <LocaleLink
                href="/glossary"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-hairline bg-white/5 px-6 font-extrabold text-ink transition-colors hover:border-mint/60 hover:bg-white/10"
              >
                {s("notFound.glossary")}
              </LocaleLink>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
