import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Emits `.next/standalone` — a self-contained server bundle with only the
   * runtime files it actually needs. This is what keeps the Cloud Run image
   * small and its cold starts short.
   */
  output: "standalone",

  // The marketing site ships its own SVG artwork, so no remote image hosts
  // are allowed by default. Add `images.remotePatterns` entries if that
  // changes (e.g. avatars pulled from the GitHub API).
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },

  // Cloud Run terminates TLS at the load balancer and forwards the original
  // scheme/host, so the app can safely trust these headers for absolute URLs.
  poweredByHeader: false,

  /**
   * Canonical host enforcement.
   *
   * The service answers on three hostnames — the apex, www, and the
   * *.run.app URL Cloud Run assigns. Left alone that is three copies of every
   * page competing with each other in search results, and a `rel=canonical`
   * tag is only a hint. A 308 makes it unambiguous.
   *
   * `/api/` is deliberately excluded: Cloud Run's own health checks and any
   * server-to-server call hit the run.app hostname directly, and redirecting
   * those would break them.
   */
  async redirects() {
    const toApex = (host: string) => ({
      source: "/:path((?!api/).*)",
      has: [{ type: "host" as const, value: host }],
      destination: "https://openmacro.org/:path",
      permanent: true,
    });

    return [
      toApex("www.openmacro.org"),
      // Matches whichever run.app hostname this revision is served under.
      {
        source: "/:path((?!api/).*)",
        has: [{ type: "host" as const, value: "(?<runHost>.*\\.run\\.app)" }],
        destination: "https://openmacro.org/:path",
        permanent: true,
      },
    ];
  },

  // The repository root holds the Expo app and its own lockfile, so point
  // Turbopack at this directory explicitly rather than letting it infer.
  turbopack: { root: __dirname },
};

export default nextConfig;
