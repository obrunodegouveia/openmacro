import { createBootScript } from "@openmacro/seasons/web/boot";
import { SEASONS, SEASONS_KEY_PREFIX } from "@openmacro/core/season";

/**
 * Sets `data-season` and `data-season-look` on <html> before first paint.
 *
 * Inline, like `TODAY_REDIRECT` in layout.tsx, because the home page and the
 * lessons are static: a season decided on the server would be the season on
 * the day of the build. This runs in the visitor's browser, on their date,
 * with their own setting and the last remote config this browser fetched.
 *
 * It is not a copy of the decision logic. `createBootScript` serialises the
 * engine's own `decide` function into the script, so the browser, the
 * runtime controller and the app all run one implementation. `?season=
 * christmas`, `?season=christmas:calm` or `?season=none` forces a look, and
 * is remembered for the tab so it survives a reload.
 *
 * Server only: built once per server process from the compiled function.
 */
export const SEASON_SCRIPT = createBootScript({ calendar: SEASONS, keyPrefix: SEASONS_KEY_PREFIX });
