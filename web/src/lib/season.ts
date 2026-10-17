import { createSeasonController, type SeasonController } from "@openmacro/seasons";
import { browserOverride, browserStorage } from "@openmacro/seasons/web/boot";
import { SEASONS, SEASONS_KEY_PREFIX, type SeasonId } from "@openmacro/core/season";

/**
 * Same origin as the page, so the request needs no CORS and is cached by the
 * same CDN rule as everything else. The app fetches the same document from
 * openmacro.org (see `SEASONS_REMOTE_URL`).
 */
const REMOTE_PATH = "/api/seasons";

let controller: SeasonController<SeasonId> | null = null;

/**
 * The site's season controller, created on first use in the browser.
 *
 * Creation only reads storage, so it is safe during render; everything with
 * an effect on the outside world waits for the provider's runtime (see
 * `components/site/seasons/provider.tsx`), which keeps <html> dressed for
 * the live decision and checks again when the tab comes back into view.
 *
 * @return The controller, or `null` on the server.
 */
export function seasonController(): SeasonController<SeasonId> | null {
  if (typeof window === "undefined") return null;
  controller ??= createSeasonController({
    calendar: SEASONS,
    storage: browserStorage(),
    override: browserOverride(SEASONS_KEY_PREFIX),
    remote: { url: REMOTE_PATH },
    keyPrefix: SEASONS_KEY_PREFIX,
  });
  return controller;
}
