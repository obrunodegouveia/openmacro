import Link from "next/link";
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

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="pt-16">
        <Section>
          <div className="mx-auto max-w-xl text-center">
            <p className="font-mono text-6xl font-extrabold text-mint-bright">
              404
            </p>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight">
              This page does not balance.
            </h1>
            <p className="mt-3 leading-relaxed text-ink-muted">
              The URL you followed does not exist. It may have moved, or it may
              never have existed — either way, both sides of the sheet are
              empty.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center rounded-xl border-b-4 border-mint-deep bg-mint px-6 font-extrabold text-abyss transition-all hover:bg-mint-bright active:translate-y-[3px] active:border-b-0"
              >
                Back to the home page
              </Link>
              <Link
                href="/glossary"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-hairline bg-white/5 px-6 font-extrabold text-ink transition-colors hover:border-mint/60 hover:bg-white/10"
              >
                Browse the glossary
              </Link>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
