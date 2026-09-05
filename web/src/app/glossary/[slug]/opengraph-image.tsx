import { ImageResponse } from "next/og";
import { GLOSSARY, findTerm } from "@/lib/glossary";
import { TIERS } from "@/lib/curriculum";
import { SITE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "OpenMacro glossary";

/** Prerender a card per term rather than rendering them on demand. */
export function generateStaticParams() {
  return GLOSSARY.map((entry) => ({ slug: entry.slug }));
}

/**
 * Per-term social card.
 *
 * A shared image across 19 pages makes every link look identical in a feed;
 * putting the term and its definition on the card is the difference between a
 * shared link that gets clicked and one that reads as generic branding.
 *
 * Satori supports a subset of CSS: no CSS variables, and any element with more
 * than one child must declare `display: flex`.
 */
export default async function GlossaryOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = findTerm(slug);
  const tier = entry ? TIERS.find((item) => item.id === entry.tier) : undefined;

  const title = entry?.term ?? "Glossary";
  const definition = entry?.definition ?? SITE.description;
  // Long definitions are trimmed rather than allowed to overflow the card.
  const trimmed =
    definition.length > 190 ? `${definition.slice(0, 187).trimEnd()}…` : definition;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "linear-gradient(135deg, #05080f 0%, #0d1424 55%, #10251c 100%)",
          color: "#f2f6fc",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700 }}>
            <span>Open</span>
            <span style={{ color: "#3ee08a" }}>Macro</span>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#64748b" }}>
            / glossary
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {entry?.abbreviation ? (
            <div
              style={{
                display: "flex",
                fontSize: 26,
                fontWeight: 700,
                color: "#3ee08a",
                letterSpacing: 2,
                marginBottom: 12,
              }}
            >
              {entry.abbreviation}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              fontSize: title.length > 34 ? 60 : 76,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 27,
              lineHeight: 1.45,
              color: "#97a5bd",
              maxWidth: 1000,
            }}
          >
            {trimmed}
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, fontSize: 22, color: "#97a5bd" }}>
          {tier ? (
            <div
              style={{
                display: "flex",
                border: "2px solid #1e2a42",
                borderRadius: 999,
                padding: "10px 22px",
              }}
            >
              Tier {tier.index} · {tier.name}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              border: "2px solid #1e2a42",
              borderRadius: 999,
              padding: "10px 22px",
            }}
          >
            openmacro.org
          </div>
        </div>
      </div>
    ),
    size,
  );
}
