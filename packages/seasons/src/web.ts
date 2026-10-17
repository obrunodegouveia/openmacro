import { decide } from './engine.ts';
import type { SeasonStorage } from './controller.ts';
import type { SeasonDecision, SeasonWindow } from './types.ts';

/** The attributes a season sets on the root element. */
export const SEASON_ATTRIBUTE = 'data-season';
export const LOOK_ATTRIBUTE = 'data-season-look';

/** Options shared by the boot script and the runtime helpers. */
export interface WebSeasonOptions<Id extends string> {
  readonly calendar: readonly SeasonWindow<Id>[];
  /** The same prefix the controller is given. Default `seasons`. */
  readonly keyPrefix?: string;
  /** The query parameter that forces a season. Default `season`. */
  readonly param?: string;
}

/**
 * The inline script that dresses the page before its first paint.
 *
 * A static or cached page cannot know the season when it is built; the
 * visitor's own date, preference and cached remote config are only in their
 * browser. So this runs in `<head>` or at the top of `<body>`, synchronously,
 * and sets `data-season` and `data-season-look` on `<html>` before anything
 * is drawn. Palette CSS keyed on those attributes then never flashes.
 *
 * The decision is made by `decide` itself, serialised with `toString`, not
 * by a copy written for the occasion: one implementation, two runtimes. A
 * `?season=` parameter is remembered in `sessionStorage` for the rest of the
 * tab's visit, so a forced look survives navigation.
 *
 * Call it on the server, where the function source is the compiled one the
 * bundler produced.
 *
 * @param options The calendar and storage names.
 * @return The script's source, for `dangerouslySetInnerHTML` or a nonce'd tag.
 */
export function createBootScript<Id extends string>(options: WebSeasonOptions<Id>): string {
  const keys = storageKeys(options.keyPrefix);
  const config = {
    calendar: options.calendar,
    keys,
    param: options.param ?? 'season',
    season: SEASON_ATTRIBUTE,
    look: LOOK_ATTRIBUTE,
  };
  // Every lookup is guarded: an inline script that throws takes nothing else
  // down, but it would leave the page in the ordinary look, which is the safe
  // failure.
  return `(function(decide,c){try{var q=new URLSearchParams(location.search).get(c.param);try{if(q){sessionStorage.setItem(c.keys.override,q)}else{q=sessionStorage.getItem(c.keys.override)}}catch(e){}var p=null,r=null;try{p=localStorage.getItem(c.keys.preference);r=JSON.parse(localStorage.getItem(c.keys.remote)||"null");r=r&&r.config}catch(e){}var d=decide({now:Date.now(),calendar:c.calendar,override:q,preference:p,remote:r}),h=document.documentElement;if(d.season){h.setAttribute(c.season,d.season);h.setAttribute(c.look,d.look)}}catch(e){}})(${decide.toString()},${JSON.stringify(config)});`;
}

/**
 * The storage keys shared by the boot script and the controller.
 *
 * @param prefix The key prefix.
 * @return The keys.
 */
export function storageKeys(prefix = 'seasons'): { preference: string; remote: string; override: string } {
  return { preference: `${prefix}.preference`, remote: `${prefix}.remote`, override: `${prefix}.override` };
}

/**
 * `localStorage` as controller storage, or `null` where there is none.
 *
 * @return The storage.
 */
export function browserStorage(): SeasonStorage | null {
  if (typeof localStorage === 'undefined') return null;
  return {
    get: (key) => localStorage.getItem(key),
    set: (key, value) => localStorage.setItem(key, value),
  };
}

/**
 * The override the boot script remembered for this tab, for the controller.
 *
 * @param prefix The key prefix.
 * @return The override, or `null`.
 */
export function browserOverride(prefix?: string): string | null {
  try {
    return sessionStorage.getItem(storageKeys(prefix).override);
  } catch {
    return null;
  }
}

/**
 * Writes a decision onto an element as the boot script would, so a change
 * at runtime (the viewer turning a season off, a remote kill switch) repaints
 * the page at once.
 *
 * @param element Usually `document.documentElement`.
 * @param decision What to show.
 */
export function applyDecision(element: Element, decision: SeasonDecision): void {
  if (decision.season) {
    element.setAttribute(SEASON_ATTRIBUTE, decision.season);
    element.setAttribute(LOOK_ATTRIBUTE, decision.look);
  } else {
    element.removeAttribute(SEASON_ATTRIBUTE);
    element.removeAttribute(LOOK_ATTRIBUTE);
  }
}
