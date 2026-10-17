import { createSeasonController, type SeasonController } from "@openmacro/seasons";
import { applyDecision, browserOverride, browserStorage } from "@openmacro/seasons/web";
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
 * an effect on the outside world waits for `startSeasonRuntime`.
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

/**
 * Keeps the page dressed for the live decision: repaints <html> whenever it
 * changes (the visitor's own switch, a remote kill switch, midnight), and
 * checks again whenever the tab comes back into view.
 *
 * Unlike the app, the site repaints its palette at once: its colours are CSS
 * variables keyed on `data-season`, so changing the attribute is enough.
 *
 * @return Stops it.
 */
export function startSeasonRuntime(): () => void {
  const seasons = seasonController();
  if (!seasons) return () => {};
  const root = document.documentElement;
  // The boot script decided from the same inputs, but it cannot validate a
  // cached remote config as strictly; if the two disagree, this one wins.
  applyDecision(root, seasons.getSnapshot());
  const unsubscribe = seasons.subscribe(() => applyDecision(root, seasons.getSnapshot()));
  const stop = seasons.start();
  const onVisible = () => {
    if (document.visibilityState !== "visible") return;
    seasons.update();
    void seasons.refresh();
  };
  document.addEventListener("visibilitychange", onVisible);
  return () => {
    unsubscribe();
    stop();
    document.removeEventListener("visibilitychange", onVisible);
  };
}
