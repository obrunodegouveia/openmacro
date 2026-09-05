import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, TriangleAlert } from "lucide-react";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { GLOSSARY, findTerm } from "@/lib/glossary";
import { TIERS } from "@/lib/curriculum";
import { JsonLd, ORGANIZATION, breadcrumbs, pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

/** Every term is known at build time, so all of these prerender as static HTML. */
export function generateStaticParams() {
  return GLOSSARY.map((entry) => ({ slug: entry.slug }));
}

/** Anything not in the glossary is a genuine 404, not an empty page. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = findTerm(slug);
  if (!entry) return {};

  const name = entry.abbreviation
    ? `${entry.term} (${entry.abbreviation})`
    : entry.term;

  return pageMetadata({
    title: `${name}: what it is and how it works`,
    description: entry.definition,
    path: `/glossary/${entry.slug}`,
    keywords: [
      entry.term.toLowerCase(),
      ...(entry.abbreviation ? [entry.abbreviation.toLowerCase()] : []),
      ...(entry.aliases ?? []),
      "central banking",
      "monetary policy",
    ],
    type: "article",
  });
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = findTerm(slug);
  if (!entry) notFound();

  const tier = TIERS.find((candidate) => candidate.id === entry.tier);
  const related = entry.related
    .map((relatedSlug) => findTerm(relatedSlug))
    .filter((candidate) => candidate !== undefined);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DefinedTerm",
          "@id": `${SITE.url}/glossary/${entry.slug}`,
          name: entry.term,
          alternateName: [
            ...(entry.abbreviation ? [entry.abbreviation] : []),
            ...(entry.aliases ?? []),
          ],
          description: entry.definition,
          url: `${SITE.url}/glossary/${entry.slug}`,
          inDefinedTermSet: {
            "@type": "DefinedTermSet",
            "@id": `${SITE.url}/glossary`,
            name: "The OpenMacro monetary system glossary",
            url: `${SITE.url}/glossary`,
          },
          publisher: ORGANIZATION,
          subjectOf: entry.sources.map((source) => ({
            "@type": "CreativeWork",
            name: source.label,
            url: source.url,
          })),
        }}
      />
      <JsonLd
        data={breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Glossary", path: "/glossary" },
          { name: entry.term, path: `/glossary/${entry.slug}` },
        ])}
      />

      <Nav />
      <main id="main" className="pt-16">
        <Section>
          <div className="mx-auto max-w-3xl">
            <Link
              href="/glossary"
              className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted transition-colors hover:text-mint-bright"
            >
              <ArrowLeft className="size-4" aria-hidden />
              All terms
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {entry.abbreviation ? (
                <Badge tone="mint">{entry.abbreviation}</Badge>
              ) : null}
              {tier ? (
                <Badge tone="neutral">
                  Tier {tier.index} · {tier.name}
                </Badge>
              ) : null}
            </div>

            <h1 className="mt-4 text-balance font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {entry.term}
            </h1>

            {/* The definition doubles as the meta description, so it is
                deliberately a single self-contained sentence. */}
            <p className="mt-5 text-pretty text-lg leading-relaxed text-ink">
              {entry.definition}
            </p>

            {entry.aliases?.length ? (
              <p className="mt-3 text-sm text-ink-faint">
                Also called: {entry.aliases.join(", ")}.
              </p>
            ) : null}

            <div className="mt-10 flex flex-col gap-5">
              {entry.explanation.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="text-pretty leading-relaxed text-ink-muted"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* The mechanism, as balance sheet facts. */}
            <section className="mt-10" aria-labelledby="mechanics">
              <h2
                id="mechanics"
                className="font-display text-xl font-extrabold tracking-tight"
              >
                The mechanics
              </h2>
              <dl className="mt-4 flex flex-col gap-3">
                {entry.mechanics.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-hairline bg-abyss/50 p-4"
                  >
                    <dt className="text-xs font-extrabold uppercase tracking-wider text-mint-bright">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-ink-muted">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            {entry.misreading ? (
              <section
                className="mt-8 rounded-card border border-gold/25 bg-gold/[0.06] p-6"
                aria-labelledby="misreading"
              >
                <h2
                  id="misreading"
                  className="flex items-center gap-2 font-display text-base font-extrabold text-gold"
                >
                  <TriangleAlert className="size-4" aria-hidden />
                  The common misreading
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {entry.misreading}
                </p>
              </section>
            ) : null}

            {related.length > 0 ? (
              <section className="mt-10" aria-labelledby="related">
                <h2
                  id="related"
                  className="font-display text-xl font-extrabold tracking-tight"
                >
                  Related terms
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/glossary/${item.slug}`}
                        className="flex h-full flex-col rounded-2xl border border-hairline bg-white/[0.02] p-4 transition-colors hover:border-mint/40 hover:bg-white/[0.05]"
                      >
                        <span className="font-display text-sm font-extrabold text-ink">
                          {item.term}
                        </span>
                        <span className="mt-1 text-xs leading-relaxed text-ink-muted">
                          {item.definition}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* Primary sources, not secondary summaries. */}
            <section className="mt-10" aria-labelledby="sources">
              <h2
                id="sources"
                className="font-display text-xl font-extrabold tracking-tight"
              >
                Primary sources
              </h2>
              <ul className="mt-4 flex flex-col gap-2">
                {entry.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted underline-offset-4 hover:text-mint-bright hover:underline"
                    >
                      {source.label}
                      <ExternalLink className="size-3.5" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-12 rounded-card border border-mint/25 bg-mint/[0.06] p-6">
              <h2 className="font-display text-lg font-extrabold">
                Post it yourself
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Reading a definition is not the same as being able to work the
                mechanism. The playable teaser walks you through a real central
                bank operation, entry by entry.
              </p>
              <Link
                href="/#demo"
                className="mt-4 inline-flex h-11 items-center justify-center rounded-xl border-b-4 border-mint-deep bg-mint px-5 font-extrabold text-abyss transition-all hover:bg-mint-bright active:translate-y-[3px] active:border-b-0"
              >
                Try the T-account demo
              </Link>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
