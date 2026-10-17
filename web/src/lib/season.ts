import { SEASON_IDS, SEASONS, type SeasonId } from "@openmacro/core/season";

/** Where a `?season=` override is kept for the rest of the tab's visit. */
const OVERRIDE_KEY = "om-season";

/**
 * Sets `data-season` on <html> before first paint.
 *
 * Inline, like `TODAY_REDIRECT` in layout.tsx, because the home page and the
 * lessons are static: a season decided on the server would be the season on
 * the day of the build. This runs in the visitor's browser, on their date.
 *
 * It mirrors `seasonOn` and `parseSeasonOverride` in `@openmacro/core/season`
 * rather than calling them, because an inline script cannot import; the
 * calendar itself is serialised from `SEASONS`, so only the date comparison
 * is repeated here. `?season=halloween` or `?season=none` forces a look, and
 * is remembered for the tab so it survives a reload.
 */
export const SEASON_SCRIPT = `(function(){try{var w=${JSON.stringify(SEASONS)},ids=${JSON.stringify(SEASON_IDS)},k=${JSON.stringify(OVERRIDE_KEY)},q=new URLSearchParams(location.search).get("season");if(q){q=q.toLowerCase();sessionStorage.setItem(k,q)}else{q=sessionStorage.getItem(k)}var id;if(q==="none")return;if(q&&ids.indexOf(q)>=0){id=q}else{var d=new Date(),t=(d.getMonth()+1)*100+d.getDate();for(var i=0;i<w.length;i++){var f=w[i].from.month*100+w[i].from.day,e=w[i].to.month*100+w[i].to.day;if(f<=e?t>=f&&t<=e:t>=f||t<=e){id=w[i].id;break}}}if(id)document.documentElement.setAttribute("data-season",id)}catch(x){}})();`;

/**
 * The season the inline script chose for this page, read back from <html>.
 *
 * Client only: on the server there is no document, and the answer would be
 * the build day's anyway.
 *
 * @return The season, or `null` on an ordinary day or during prerendering.
 */
export function documentSeason(): SeasonId | null {
  if (typeof document === "undefined") return null;
  const value = document.documentElement.getAttribute("data-season");
  return (SEASON_IDS as readonly string[]).includes(value ?? "") ? (value as SeasonId) : null;
}
