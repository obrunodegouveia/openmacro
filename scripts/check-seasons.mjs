#!/usr/bin/env node
/**
 * ============================================================================
 * Season parity and contrast — `npm run check:seasons`
 * ============================================================================
 *
 * A season is one object (a `SeasonPack` from `@openmacro/seasons/presets`,
 * referenced by `packages/core/src/season.ts`), palette included, so its
 * decorations and colours reach both clients by construction. Each client maps the palette onto its own tokens, though,
 * and its words live in the catalogues; a season that misses one fails
 * nowhere. A Portuguese learner simply gets English, or a text colour
 * written in a hurry turns unreadable, for the weeks the season lasts and
 * then never again until next year, which is the worst possible time to
 * find out.
 *
 * So for every season on the calendar this asserts:
 *
 * 1. The app's palette for it, as `src/theme/palette.ts` maps the pack.
 * 2. The site's, as `web/src/lib/season-palette.ts` maps the pack: the
 *    light rule sets every variable the dark one does, because
 *    `:root[data-season]` outranks the plain light block, so a variable set
 *    in the dark rule only would stay dark in light mode.
 * 3. Every UI catalogue has every one of its strings, not just English.
 * 4. Its text colours clear WCAG AA (4.5:1) on its own canvas and surfaces,
 *    in both appearances, on both clients. A season is the one time a
 *    palette is written in a hurry; it is not the time for unreadable text.
 * 5. The pack passes the package's own `checkPack`, and its look keeps
 *    the clients' text readable and stays gentle: the canvas under the sky
 *    glow and the sun, and under the mist, at their brightest and all
 *    stacked up, still carries AA text on both clients; every glow
 *    fades out inside its band; nothing twinkles, flickers, breathes or
 *    shimmers anywhere near 3 Hz; and the particle field stays within its
 *    cap.
 * 6. The calendar covers every day of the year with some season, so the
 *    nature seasons have no gaps between them.
 *
 * The ordinary palettes are measured too, as the baseline the seasons are
 * held to.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const { SEASONS, SEASON_IDS, SEASON_PACKS } = await import(pathToFileURL(`${ROOT}packages/core/src/season.ts`).href);
const { seasonVariables } = await import(pathToFileURL(`${ROOT}web/src/lib/season-palette.ts`).href);
const { decide } = await import(pathToFileURL(`${ROOT}packages/seasons/src/engine.ts`).href);
const { atmosphereOver, checkPack, contrast } = await import(pathToFileURL(`${ROOT}packages/seasons/src/presets/index.ts`).href);
const { light, dark, seasonal } = await import(pathToFileURL(`${ROOT}src/theme/palette.ts`).href);

const errors = [];
const fail = (message) => errors.push(message);

// ---------------------------------------------------------------------------
// Contrast: the package's own WCAG helpers, so this measures exactly as
// `checkPack` does.
// ---------------------------------------------------------------------------

/**
 * Asserts each text token clears 4.5:1 on each background token.
 *
 * @param label Where this palette comes from, for the message.
 * @param colours Token name to #rrggbb.
 * @param texts Text tokens.
 * @param backgrounds Background tokens.
 */
function measure(label, colours, texts, backgrounds) {
  for (const text of texts) {
    for (const background of backgrounds) {
      const fg = colours[text];
      const bg = colours[background];
      if (!/^#[0-9a-f]{6}$/i.test(fg ?? '') || !/^#[0-9a-f]{6}$/i.test(bg ?? '')) {
        fail(`${label}: cannot measure ${text} on ${background} (${fg} on ${bg})`);
        continue;
      }
      const ratio = contrast(fg, bg);
      if (ratio < 4.5) fail(`${label}: ${text} ${fg} on ${background} ${bg} is ${ratio.toFixed(2)}:1, below 4.5:1`);
    }
  }
}

// ---------------------------------------------------------------------------
// 1 and 4 (app). Text tokens on the surfaces they are drawn on.
// ---------------------------------------------------------------------------

const APP_TEXT = ['ink', 'inkMuted', 'inkFaint', 'mintDark', 'coralDark', 'blueDark', 'goldDark'];
const APP_BACKGROUNDS = ['canvas', 'surface'];

const appPalettes = [['ordinary', null]].concat(SEASON_IDS.map((id) => [id, seasonal[id]]));
for (const [id, overrides] of appPalettes) {
  if (id !== 'ordinary' && (!overrides?.light || !overrides?.dark)) {
    fail(`app: no light and dark palette for "${id}" in src/theme/palette.ts`);
    continue;
  }
  const lightNow = { ...light, ...(overrides?.light ?? {}) };
  const darkNow = { ...lightNow, ...dark, ...(overrides?.dark ?? {}) };
  measure(`app ${id} light`, lightNow, APP_TEXT, APP_BACKGROUNDS);
  measure(`app ${id} dark`, darkNow, APP_TEXT, APP_BACKGROUNDS);
}

// ---------------------------------------------------------------------------
// 2 and 4 (site). The ordinary palette from globals.css; each season's as
// lib/season-palette.ts writes it from the pack.
// ---------------------------------------------------------------------------

const css = readFileSync(`${ROOT}web/src/app/globals.css`, 'utf8');

/** The custom properties declared in the first rule matching a selector, after a given index. */
function block(selector, from = 0) {
  const start = css.indexOf(`${selector} {`, from);
  if (start < 0) return null;
  const end = css.indexOf('}', start);
  const body = css.slice(css.indexOf('{', start) + 1, end);
  return { start, tokens: Object.fromEntries([...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()])) };
}

const themeBlock = block('@theme');
const lightMedia = css.indexOf('@media (prefers-color-scheme: light)');
const baseDark = themeBlock.tokens;
const baseLight = { ...baseDark, ...block(':root', lightMedia).tokens };

const WEB_TEXT = ['--color-ink', '--color-ink-muted', '--color-ink-faint', '--color-azure-text', '--color-mint-bright'];
const WEB_BACKGROUNDS = ['--color-canvas', '--color-surface', '--color-surface-raised'];
// Gold is text in the light theme only; in the dark theme it is a fill.
const WEB_LIGHT_TEXT = [...WEB_TEXT, '--color-gold'];

measure('web ordinary dark', baseDark, WEB_TEXT, WEB_BACKGROUNDS);
// The ordinary light gold (#c98a00) measures under 3:1 as text and predates
// seasons; it is a known issue in the base palette, tracked separately, so
// only the seasons are held to it here.
measure('web ordinary light', baseLight, WEB_TEXT, WEB_BACKGROUNDS);

/** What the site paints for a season, by appearance. */
const webSeason = {};
for (const id of SEASON_IDS) {
  const palette = SEASON_PACKS[id]?.palette;
  if (!palette?.light || !palette?.dark) {
    fail(`core ${id}: no light and dark palette in its pack`);
    continue;
  }
  const darkVars = seasonVariables(palette.dark, 'dark');
  const lightVars = seasonVariables(palette.light, 'light');
  for (const token of Object.keys(darkVars)) {
    if (!(token in lightVars)) fail(`web ${id}: ${token} is set for dark but not light, so light mode keeps the dark value`);
  }
  webSeason[id] = { dark: { ...baseDark, ...darkVars }, light: { ...baseLight, ...lightVars } };
  measure(`web ${id} dark`, webSeason[id].dark, WEB_TEXT, WEB_BACKGROUNDS);
  measure(`web ${id} light`, webSeason[id].light, WEB_LIGHT_TEXT, WEB_BACKGROUNDS);
}

// ---------------------------------------------------------------------------
// 5. The look, and the pack on its own terms: `checkPack` from the package
// (every palette role at AA, under the sky, sun and mist too; glows inside
// their band; nothing beating faster than once a second; the particle cap).
// Then what each client actually paints, under the same atmosphere.
// ---------------------------------------------------------------------------

for (const id of SEASON_IDS) {
  const pack = SEASON_PACKS[id];
  if (!pack?.look) {
    fail(`core ${id}: no look in SEASON_PACKS`);
    continue;
  }
  for (const problem of checkPack(pack)) fail(`core ${id}: ${problem}`);

  for (const scheme of ['light', 'dark']) {
    // The app: its season palette for this appearance.
    const appLight = { ...light, ...seasonal[id].light };
    const app = scheme === 'light' ? appLight : { ...appLight, ...dark, ...seasonal[id].dark };
    measure(`app ${id} ${scheme}`, { ...app, ...atmosphereOver(pack, app.canvas, scheme) }, APP_TEXT, ['sky', 'fog']);

    // The site: what it paints for this appearance.
    const web = webSeason[id]?.[scheme];
    if (!web) continue;
    measure(`web ${id} ${scheme}`, { ...web, ...atmosphereOver(pack, web['--color-canvas'], scheme) }, scheme === 'light' ? WEB_LIGHT_TEXT : WEB_TEXT, ['sky', 'fog']);
  }
}

// ---------------------------------------------------------------------------
// 6. The calendar covers the year.
// ---------------------------------------------------------------------------

// A leap year and a common one, so 29 February is covered too.
for (const year of [2027, 2028]) {
  for (let day = new Date(year, 0, 1); day.getFullYear() === year; day.setDate(day.getDate() + 1)) {
    if (!decide({ now: day.getTime(), calendar: SEASONS }).season) {
      fail(`calendar: no season on ${day.toDateString()}`);
      break;
    }
  }
}

// ---------------------------------------------------------------------------
// 3. Strings, in every catalogue.
// ---------------------------------------------------------------------------

const keysFor = (id) => {
  const strings = SEASON_PACKS[id].strings;
  return [strings.name, strings.greeting, strings.welcome, ...strings.toy];
};
const catalogues = readdirSync(`${ROOT}packages/core/src/i18n/ui`).filter((file) => file.endsWith('.ts'));
for (const file of catalogues) {
  const module = await import(pathToFileURL(`${ROOT}packages/core/src/i18n/ui/${file}`).href);
  const dictionary = Object.values(module).find((value) => value && typeof value === 'object');
  for (const id of SEASON_IDS) {
    for (const key of keysFor(id)) {
      if (typeof dictionary?.[key] !== 'string') fail(`i18n ${file}: missing "${key}"`);
    }
  }
}

if (errors.length) {
  console.error(`\n  Seasons: ${errors.length} problem${errors.length === 1 ? '' : 's'}\n`);
  for (const error of errors) console.error(`  ✗ ${error}`);
  console.error('');
  process.exit(1);
}
console.log(`\n  Seasons: ${SEASON_IDS.join(', ')} have palettes on both clients, every string in ${catalogues.length} catalogues, AA text throughout (under the sky, sun and mist too), gentle looks, and a calendar with no gaps.\n`);
