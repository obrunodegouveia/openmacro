import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card, rendered by Satori.
 *
 * Satori supports only a subset of CSS: no CSS variables, no external
 * stylesheets, and every element with more than one child must declare
 * `display: flex`. That is why the colours are inlined and each line of the
 * headline is its own flex row rather than a text node with a `<br />`.
 */
export default function OpenGraphImage() {
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
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              width: 60,
              height: 60,
              borderRadius: 18,
              border: "3px solid #3ee08a",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
            }}
          >
            🪙
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>
            <span>Open</span>
            <span style={{ color: "#3ee08a" }}>Macro</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 78, fontWeight: 700, letterSpacing: -2 }}>
            Understand the Machine
          </div>
          <div style={{ display: "flex", fontSize: 78, fontWeight: 700, letterSpacing: -2 }}>
            <span>Behind&nbsp;</span>
            <span style={{ color: "#3ee08a" }}>Money.</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 30,
              color: "#97a5bd",
              maxWidth: 940,
            }}
          >
            {SITE.description}
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "#97a5bd" }}>
          <div
            style={{
              display: "flex",
              border: "2px solid #1e2a42",
              borderRadius: 999,
              padding: "10px 22px",
            }}
          >
            MIT licensed
          </div>
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
