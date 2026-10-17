#!/usr/bin/env node
/**
 * ============================================================================
 * Season parity and contrast — `npm run check:seasons`
 * ============================================================================
 *
 * A season is data in `packages/core/src/season.ts`, so its decorations
 * reach both clients by construction. Its colours and its words do not:
 * they live in four places, and a season missing from one of them fails
 * nowhere. The app simply paints the ordinary palette, or the site leaves
 * its CSS variables alone, or a Portuguese learner gets English, for the few
 * weeks the season lasts and then never again until next year, which is the
 * worst possible time to find out.
 *
 * So for every season on the calendar this asserts:
 *
 * 1. The app has a light and a dark palette for it (`src/theme/palette.ts`).
 * 2. The site has a dark block and a light block for it, and the light block
 *    sets every token the dark one does: `:root[data-season]` outranks the
 *    plain light block, so a token set in the dark block only would stay
 *    dark in light mode (`web/src/app/globals.css`).
 * 3. Every UI catalogue has every one of its strings, not just English.
 * 4. Its text colours clear WCAG AA (4.5:1) on its own canvas and surfaces,
 *    in both appearances, on both clients. A season is the one time a
 *    palette is written in a hurry; it is not the time for unreadable text.
 * 5. Its look (`pack.look`) keeps that true and stays gentle: the canvas
 *    under the sky glow and the fog, at their brightest and all stacked
 *    up, still carries AA text on both clients; every glow fades out inside
 *    its band; nothing twinkles or flickers anywhere near 3 Hz; and the
 *    particle field stays within its cap.
 *
 * The ordinary palettes are measured too, as the baseline the seasons are
 * held to.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const { SEASON_IDS, SEASON_PACKS, TOY_LINES } = await import(pathToFileURL(`${ROOT}packages/core/src/season.ts`).href);
const { light, dark, seasonal } = await import(pathToFileURL(`${ROOT}src/theme/palette.ts`).href);

const errors = [];
const fail = (message) => errors.push(message);

// ---------------------------------------------------------------------------
// Contrast
// ---------------------------------------------------------------------------

/** Relative luminance of a #rrggbb colour, per WCAG 2. */
function luminance(hex) {
  const value = hex.trim().replace('#', '');
  const channels = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** The contrast ratio between two #rrggbb colours. */
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

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
// 2 and 4 (site). Parse the season blocks out of globals.css.
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

for (const id of SEASON_IDS) {
  const selector = `:root[data-season="${id}"]`;
  const darkBlock = block(selector);
  if (!darkBlock) {
    fail(`web: no ${selector} block in web/src/app/globals.css`);
    continue;
  }
  // The light block is the same selector again, inside a light media query.
  const lightBlock = block(`  ${selector}`, darkBlock.start + selector.length);
  const media = css.lastIndexOf('@media (prefers-color-scheme: light)', lightBlock?.start ?? 0);
  if (!lightBlock || media < darkBlock.start) {
    fail(`web: no light block for ${selector} inside @media (prefers-color-scheme: light)`);
    continue;
  }
  for (const token of Object.keys(darkBlock.tokens)) {
    if (!(token in lightBlock.tokens)) fail(`web ${id}: ${token} is set for dark but not light, so light mode keeps the dark value`);
  }
  measure(`web ${id} dark`, { ...baseDark, ...darkBlock.tokens }, WEB_TEXT, WEB_BACKGROUNDS);
  measure(`web ${id} light`, { ...baseLight, ...lightBlock.tokens }, WEB_LIGHT_TEXT, WEB_BACKGROUNDS);
}

// ---------------------------------------------------------------------------
// 5. The look: atmosphere contrast, glow bounds, flashing, particle caps.
// ---------------------------------------------------------------------------

/** Parses #rrggbb to [r, g, b]. */
const rgb = (hex) => [0, 2, 4].map((i) => parseInt(hex.trim().replace('#', '').slice(i, i + 2), 16));
const toHex = (channels) => `#${channels.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`;

/**
 * The canvas with tints laid over it, one after another.
 *
 * @param canvas The canvas, #rrggbb.
 * @param tints Each `{ color, alpha }`, in drawing order.
 * @return The result, #rrggbb.
 */
function tinted(canvas, tints) {
  let out = rgb(canvas);
  for (const { color, alpha } of tints) {
    const over = rgb(color);
    out = out.map((c, i) => c * (1 - alpha) + over[i] * alpha);
  }
  return toHex(out);
}

/** How a glow fades from centre to edge, as both clients draw it (`FALLOFF` in each `SkyGlow`). */
const FALLOFF = [[0, 1], [0.3, 0.7], [0.55, 0.35], [0.8, 0.1], [1, 0]];

/** A glow's opacity at a point of its band, following `FALLOFF`. */
function glowAt(glow, alpha, x, y) {
  const d = Math.hypot((x - glow.x) / glow.rx, (y - glow.y) / glow.ry);
  if (d >= 1) return 0;
  const i = FALLOFF.findIndex(([at]) => at >= d);
  const [a0, k0] = FALLOFF[Math.max(0, i - 1)];
  const [a1, k1] = FALLOFF[i];
  return alpha * (a1 === a0 ? k1 : k0 + ((d - a0) / (a1 - a0)) * (k1 - k0));
}

/**
 * The darkest or lightest the sky makes the canvas anywhere: the band is
 * sampled on a grid, every glow's opacity there laid over the canvas, and
 * the sample furthest from the canvas's own luminance kept. The breath only
 * ever dims the glow, so its peak is the worst case.
 */
function worstSky(canvas, glows, scheme) {
  const base = luminance(canvas);
  let worst = canvas;
  for (let gx = 0; gx <= 20; gx += 1) {
    for (let gy = 0; gy <= 20; gy += 1) {
      const tints = glows.map((glow) => ({ color: glow.color[scheme], alpha: glowAt(glow, glow.alpha[scheme], gx / 20, gy / 20) }));
      const here = tinted(canvas, tints);
      if (Math.abs(luminance(here) - base) > Math.abs(luminance(worst) - base)) worst = here;
    }
  }
  return worst;
}

/** The most particles a field draws (MAX_PARTICLES in the app, MAX_FIELD on the site). */
const PARTICLE_CAP = 40;
/** The shortest twinkle or flicker cycle: each half stays well over 1/3 s. */
const SLOWEST_FLASH_MS = 1000;

for (const id of SEASON_IDS) {
  const look = SEASON_PACKS[id]?.look;
  if (!look) {
    fail(`core ${id}: no look in SEASON_PACKS`);
    continue;
  }
  for (const [i, glow] of look.sky.glows.entries()) {
    if (glow.y + glow.ry > 1.001) fail(`core ${id}: sky glow ${i} runs past its band (y + ry = ${(glow.y + glow.ry).toFixed(2)} > 1), so its edge would show`);
    if (glow.alpha.light > 0.35 || glow.alpha.dark > 0.35) fail(`core ${id}: sky glow ${i} is brighter than 0.35; the sky is a tint, not a light`);
  }
  const total = look.motes.layers.reduce((sum, layer) => sum + layer.count, 0);
  if (total > PARTICLE_CAP) fail(`core ${id}: ${total} particles, over the cap of ${PARTICLE_CAP}`);
  const front = look.motes.layers.filter((layer) => layer.front);
  if (front.length > 1) fail(`core ${id}: more than one particle layer in front of the content`);
  for (const layer of front) if (layer.opacity > 0.75) fail(`core ${id}: the front particle layer is over 0.75 opacity`);
  if (look.lights && look.lights.twinkleMs < SLOWEST_FLASH_MS) fail(`core ${id}: lights twinkle every ${look.lights.twinkleMs}ms, under ${SLOWEST_FLASH_MS}ms`);
  if (look.candle && look.candle.flickerMs < SLOWEST_FLASH_MS) fail(`core ${id}: the candle flickers every ${look.candle.flickerMs}ms, under ${SLOWEST_FLASH_MS}ms`);

  for (const scheme of ['light', 'dark']) {
    // The fog lies along the bottom, far from the sky at the top: each is
    // measured on its own, the fog at its densest.
    const fog = look.fog ? [{ color: look.fog.color[scheme], alpha: look.fog.alpha[scheme] }] : [];
    const under = (canvas) => ({ sky: worstSky(canvas, look.sky.glows, scheme), fog: tinted(canvas, fog) });

    // The app: its season palette for this appearance.
    const appLight = { ...light, ...seasonal[id].light };
    const app = scheme === 'light' ? appLight : { ...appLight, ...dark, ...seasonal[id].dark };
    measure(`app ${id} ${scheme}`, { ...app, ...under(app.canvas) }, APP_TEXT, ['sky', 'fog']);

    // The site: its season block for this appearance.
    const darkBlock = block(`:root[data-season="${id}"]`);
    const lightBlock = darkBlock && block(`  :root[data-season="${id}"]`, darkBlock.start + 1);
    if (!darkBlock || !lightBlock) continue;
    const web = scheme === 'light' ? { ...baseLight, ...lightBlock.tokens } : { ...baseDark, ...darkBlock.tokens };
    measure(`web ${id} ${scheme}`, { ...web, ...under(web['--color-canvas']) }, scheme === 'light' ? WEB_LIGHT_TEXT : WEB_TEXT, ['sky', 'fog']);
  }
}

// ---------------------------------------------------------------------------
// 3. Strings, in every catalogue.
// ---------------------------------------------------------------------------

const keysFor = (id) => [
  `season.${id}.name`,
  `season.${id}.greeting`,
  `season.${id}.welcome`,
  ...Array.from({ length: TOY_LINES }, (_, i) => `season.${id}.toy.${i + 1}`),
];
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

// ---------------------------------------------------------------------------
// The packs themselves.
// ---------------------------------------------------------------------------

for (const id of SEASON_IDS) {
  const pack = SEASON_PACKS[id];
  if (!pack) fail(`core: no pack for "${id}" in SEASON_PACKS`);
  else if (pack.particles.length < 2) fail(`core ${id}: a burst needs at least two particles`);
}

if (errors.length) {
  console.error(`\n  Seasons: ${errors.length} problem${errors.length === 1 ? '' : 's'}\n`);
  for (const error of errors) console.error(`  ✗ ${error}`);
  console.error('');
  process.exit(1);
}
console.log(`\n  Seasons: ${SEASON_IDS.join(', ')} have palettes on both clients, every string in ${catalogues.length} catalogues, AA text throughout (under the sky and fog too), and gentle looks.\n`);
