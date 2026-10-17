import { NextResponse } from "next/server";
import { EMPTY_REMOTE_CONFIG, parseRemoteConfig } from "@openmacro/seasons";
import { SEASON_IDS } from "@openmacro/core/season";

/**
 * The remote season switchboard, read by the site and the app.
 *
 * The config is the `SEASONS_CONFIG` environment variable, so a season can be
 * switched off, calmed, forced or moved by changing one value on the running
 * service, with no build and no release of either client:
 *
 *     gcloud run services update openmacro-web --region <region> \
 *       --update-env-vars '^|^SEASONS_CONFIG={"version":1,"enabled":false}'
 *
 * See docs/seasons.md for every field. An invalid value is never served: the
 * route answers with the empty config, which changes nothing, and logs why,
 * so a typo cannot turn into whatever a half-read config happens to mean.
 *
 * Cached for five minutes, at the edge and in the client, so a change
 * reaches everyone within about that plus the clients' own refresh interval.
 * Forced dynamic so the value is read at request time, not baked at build.
 */
export const dynamic = "force-dynamic";

export function GET() {
  const raw = process.env.SEASONS_CONFIG;
  let config = EMPTY_REMOTE_CONFIG;
  if (raw) {
    try {
      const parsed = parseRemoteConfig(JSON.parse(raw), SEASON_IDS);
      if (parsed.ok) config = parsed.config;
      else console.error(`[seasons] SEASONS_CONFIG ignored: ${parsed.errors.join("; ")}`);
    } catch {
      console.error("[seasons] SEASONS_CONFIG ignored: not valid JSON");
    }
  }
  return NextResponse.json(config, {
    headers: { "cache-control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600" },
  });
}
