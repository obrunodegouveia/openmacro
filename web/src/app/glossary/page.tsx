import Link from "next/link";
import { getSiteText } from "@/lib/site-text";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Section, SectionHeading } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { GLOSSARY_SORTED } from "@/lib/glossary";
import { TIERS } from "@/lib/curriculum";
import { JsonLd, ORGANIZATION, breadcrumbs, pageMetadata } from "@/lib/seo";
import { localisedCopy } from "@/lib/seo-copy";
import { serverLocale } from "@/lib/locale-server";
import { SITE } from "@/lib/site";

export async function generateMetadata() {
  const locale = await serverLocale();
  return pageMetadata({
    locale,
  title: "Money & Central Banking Glossary",
  description:
    "Plain-English definitions of how money works: reserves, repo, QE, IORB, eurodollars and more, each explained as balance sheet moves with primary sources.",
  path: "/glossary",
  keywords: [
    "money glossary",
    "central banking glossary",
    "monetary policy terms explained",
    "what is IORB",
    "ON RRP explained",
    "what are bank reserves",
    "eurodollar definition",
  ],
    ...localisedCopy("/glossary", locale),
  });
}

/**
 * The glossary index.
 *
 * Grouped by balance-sheet tier rather than alphabetically as the primary
 * axis: the tier is the thing that makes a term make sense, and a visitor who
 * lands here from a search for one term should be able to see where it sits.
 * The alphabetical list is still available inside each group.
 */
export default async function GlossaryIndexPage() {
  const s = await getSiteText();
  const byTier = TIERS.map((tier) => ({
    tier,
    entries: GLOSSARY_SORTED.filter((entry) => entry.tier === tier.id),
  })).filter((group) => group.entries.length > 0);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          "@id": `${SITE.url}/glossary`,
          name: "The OpenMacro monetary system glossary",
          description:
            "Mechanical definitions of central banking, money market and monetary policy terms.",
          url: `${SITE.url}/glossary`,
          inDefinedTermSet: `${SITE.url}/glossary`,
          publisher: ORGANIZATION,
          hasDefinedTerm: GLOSSARY_SORTED.map((entry) => ({
            "@type": "DefinedTerm",
            "@id": `${SITE.url}/glossary/${entry.slug}`,
            name: entry.term,
            description: entry.definition,
            url: `${SITE.url}/glossary/${entry.slug}`,
          })),
        }}
      />
      <JsonLd
        data={breadcrumbs([
          { name: s("nav.home"), path: "/" },
          { name: s("nav.glossary"), path: "/glossary" },
        ])}
      />

      <Nav />
      <main id="main" className="pt-16">
        <Section>
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-ink-muted transition-colors hover:text-mint-bright"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {s("glossary.back")}
          </Link>

          <SectionHeading
            align="left"
            overline={s("glossary.overline")}
            title={
              <>
                {s("glossary.title.lead")}{" "}
                <span className="text-gradient">{s("glossary.title.emphasis")}</span>
                {s("glossary.title.tail")}
              </>
            }
            lede={s("glossary.lede")}
          />

          <div className="mt-14 flex flex-col gap-12">
            {byTier.map(({ tier, entries }) => (
              <section key={tier.id} aria-labelledby={`tier-${tier.id}`}>
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl border border-hairline bg-white/5 text-lg">
                    {tier.icon}
                  </span>
                  <h2
                    id={`tier-${tier.id}`}
                    className="font-display text-xl font-extrabold tracking-tight"
                  >
                    {s("glossary.tier", { n: tier.index, name: tier.name })}
                  </h2>
                  <span className="text-xs font-semibold text-ink-faint">
                    {s("glossary.terms", { count: entries.length })}
                  </span>
                </div>

                <ul className="grid gap-3 sm:grid-cols-2">
                  {entries.map((entry) => (
                    <li key={entry.slug}>
                      <Link
                        href={`/glossary/${entry.slug}`}
                        className="group flex h-full flex-col rounded-2xl border border-hairline bg-white/[0.02] p-5 transition-colors hover:border-mint/40 hover:bg-white/[0.05]"
                      >
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-display font-extrabold text-ink">
                            {entry.term}
                          </span>
                          {entry.abbreviation ? (
                            <Badge tone="mint">{entry.abbreviation}</Badge>
                          ) : null}
                        </span>
                        <span className="mt-2 text-sm leading-relaxed text-ink-muted">
                          {entry.definition}
                        </span>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-mint-bright opacity-0 transition-opacity group-hover:opacity-100">
                          {s("glossary.read")}
                          <ArrowRight className="size-3" aria-hidden />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
