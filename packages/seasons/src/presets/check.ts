/**
 * `checkPack`: everything that can be proved about a season before anyone
 * sees it. Run it in a test or a CI script over every pack you ship,
 * especially your own; a season is the one time a palette is written in a
 * hurry, and it is on screen for weeks before anyone notices a problem.
 *
 * It asserts that:
 *
 * - every text role clears WCAG AA (4.5:1) on every surface role, in both
 *   appearances;
 * - the canvas under the sky (every glow at its brightest, the sun's core
 *   and rays stacked on top) and under the mist still carries AA text;
 * - every glow fades out inside its band, and none is brighter than a tint;
 * - nothing twinkles, flickers, breathes or shimmers faster than once a
 *   second;
 * - the particle field stays within its cap, with at most one faint layer
 *   in front of the content;
 * - the garland, the sun and the burst are well formed.
 *
 * Pure functions over plain data, so it runs anywhere: Node, a browser, a
 * test runner. The contrast helpers are exported for measuring an app's own
 * mapped tokens the same way.
 */

import { GLOW_FALLOFF, MAX_FRONT_OPACITY, MAX_GLOW_ALPHA, MAX_PARTICLES, MIN_CYCLE_MS, RAY_FALLOFF, RAY_STRENGTH, SUN_FALLOFF, SUN_REACH, type Falloff } from './optics.ts';
import { PALETTE_ROLES, SURFACE_ROLES, TEXT_ROLES, type PaletteRole } from './palette.ts';
import type { SeasonColors, SeasonPack, SkyGlow, Sun } from './types.ts';

/** The AA threshold for body text. */
export const AA = 4.5;

const HEX = /^#[0-9a-f]{6}$/i;

/**
 * Parses `#rrggbb`.
 *
 * @param hex The colour.
 * @return Its red, green and blue channels, 0 to 255.
 */
function channels(hex: string): [number, number, number] {
  const value = hex.trim().replace('#', '');
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16)) as [number, number, number];
}

/**
 * Relative luminance, per WCAG 2.
 *
 * @param hex A `#rrggbb` colour.
 * @return Its luminance, 0 (black) to 1 (white).
 */
export function luminance(hex: string): number {
  const [r, g, b] = channels(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * The contrast ratio between two colours, per WCAG 2.
 *
 * @param a A `#rrggbb` colour.
 * @param b Another.
 * @return The ratio, 1 to 21.
 */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * A colour with tints laid over it, one after another.
 *
 * @param base The colour underneath, `#rrggbb`.
 * @param tints Each `{ color, alpha }`, in drawing order.
 * @return The result, `#rrggbb`.
 */
export function composite(base: string, tints: readonly { readonly color: string; readonly alpha: number }[]): string {
  let out: number[] = channels(base);
  for (const { color, alpha } of tints) {
    const over = channels(color);
    out = out.map((c, i) => c * (1 - alpha) + over[i]! * alpha);
  }
  return `#${out.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`;
}

/** A glow's footprint, for sampling: a centre and radii, as fractions of the band. */
interface Spot {
  readonly x: number;
  readonly y: number;
  readonly rx: number;
  readonly ry: number;
}

/**
 * A glow's opacity at a point of its band, following a falloff.
 *
 * @param spot Where the glow is.
 * @param alpha Its peak opacity.
 * @param x The point across the band, 0 to 1.
 * @param y The point down the band, 0 to 1.
 * @param falloff How it fades.
 * @return The opacity there.
 */
function glowAt(spot: Spot, alpha: number, x: number, y: number, falloff: Falloff = GLOW_FALLOFF): number {
  const d = Math.hypot((x - spot.x) / spot.rx, (y - spot.y) / spot.ry);
  if (d >= 1) return 0;
  const i = Math.max(1, falloff.findIndex(([at]) => at >= d));
  const [a0, k0] = falloff[i - 1]!;
  const [a1, k1] = falloff[i]!;
  return alpha * (a1 === a0 ? k1 : k0 + ((d - a0) / (a1 - a0)) * (k1 - k0));
}

/**
 * The colour furthest from the canvas's own luminance that the sky makes
 * anywhere: the band sampled on a grid, every glow at its brightest there,
 * and the sun's core and its rays (as if they filled their whole crown,
 * which they never do) on top. The sun's core is taken twice as tall as it
 * is wide, taller than on any screen, so its reach is overestimated, never
 * under.
 *
 * @param canvas The canvas, `#rrggbb`.
 * @param glows The sky's glows.
 * @param sun The sun, if any.
 * @param scheme Which appearance's colours and opacities to use.
 * @return The worst colour under the sky, `#rrggbb`.
 */
export function worstSky(canvas: string, glows: readonly SkyGlow[], sun: Sun | null, scheme: 'light' | 'dark'): string {
  const base = luminance(canvas);
  let worst = canvas;
  const core = sun && { x: sun.x, y: sun.y, rx: sun.radius, ry: sun.radius * 2 };
  const crown = sun && { x: sun.x, y: sun.y, rx: sun.radius * SUN_REACH, ry: sun.radius * SUN_REACH * 2 };
  for (let gx = 0; gx <= 40; gx += 1) {
    for (let gy = 0; gy <= 40; gy += 1) {
      const [x, y] = [gx / 40, gy / 40];
      const tints = glows.map((glow) => ({ color: glow.color[scheme], alpha: glowAt(glow, glow.alpha[scheme], x, y) }));
      if (sun && core && crown) {
        tints.push({ color: sun.color[scheme], alpha: glowAt(crown, sun.alpha[scheme] * RAY_STRENGTH, x, y, RAY_FALLOFF) });
        tints.push({ color: sun.color[scheme], alpha: glowAt(core, sun.alpha[scheme], x, y, SUN_FALLOFF) });
      }
      const here = composite(canvas, tints);
      if (Math.abs(luminance(here) - base) > Math.abs(luminance(worst) - base)) worst = here;
    }
  }
  return worst;
}

/**
 * The backgrounds a season's look lays over a canvas at their worst: `sky`
 * under the glows and the sun, `fog` under the mist at its densest.
 *
 * @param pack The season.
 * @param canvas The canvas the app actually paints, `#rrggbb`.
 * @param scheme The appearance.
 * @return Both backgrounds, `#rrggbb`.
 */
export function atmosphereOver(pack: SeasonPack, canvas: string, scheme: 'light' | 'dark'): { sky: string; fog: string } {
  const { look } = pack;
  const mist = look.mist ? [{ color: look.mist.color[scheme], alpha: look.mist.alpha[scheme] }] : [];
  return { sky: worstSky(canvas, look.sky.glows, look.sun, scheme), fog: composite(canvas, mist) };
}

/** Options for `checkPack`. */
export interface CheckOptions {
  /** The text roles to measure. Default: every text role. */
  readonly text?: readonly PaletteRole[];
  /** The roles they are drawn on. Default: canvas, surface, raised. */
  readonly surfaces?: readonly PaletteRole[];
}

/**
 * Everything wrong with a season, in words a person can act on.
 *
 * @param pack The season.
 * @param options Which roles to measure.
 * @return The problems; empty when the pack is sound.
 */
export function checkPack(pack: SeasonPack, options: CheckOptions = {}): string[] {
  const errors: string[] = [];
  const texts = options.text ?? TEXT_ROLES;
  const surfaces = options.surfaces ?? SURFACE_ROLES;

  // The palette: every role present and well formed, every text on every surface.
  for (const scheme of ['light', 'dark'] as const) {
    const colors: SeasonColors | undefined = pack.palette?.[scheme];
    if (!colors) {
      errors.push(`palette: no ${scheme} colours`);
      continue;
    }
    for (const info of PALETTE_ROLES) {
      const value = colors[info.role];
      if (value === undefined) {
        if (info.required) errors.push(`palette ${scheme}: missing "${info.role}"`);
      } else if (!HEX.test(value)) {
        errors.push(`palette ${scheme}: "${info.role}" is ${JSON.stringify(value)}, not #rrggbb`);
      }
    }
    const under = HEX.test(colors.canvas ?? '') ? atmosphereOver(pack, colors.canvas, scheme) : null;
    for (const text of texts) {
      const fg = colors[text];
      if (!fg || !HEX.test(fg)) continue;
      const backgrounds: [string, string | undefined][] = surfaces.map((role) => [role, colors[role]]);
      if (under) backgrounds.push(['the canvas under the sky', under.sky], ['the canvas under the mist', under.fog]);
      for (const [where, bg] of backgrounds) {
        if (!bg || !HEX.test(bg)) continue;
        const ratio = contrast(fg, bg);
        if (ratio < AA) errors.push(`palette ${scheme}: ${text} ${fg} on ${where} ${bg} is ${ratio.toFixed(2)}:1, below ${AA}:1`);
      }
    }
  }

  // The look: gentle, bounded, never flashing.
  const look = pack.look;
  if (!look) return [...errors, 'no look'];
  for (const [i, glow] of look.sky.glows.entries()) {
    if (glow.y + glow.ry > 1.001) errors.push(`sky glow ${i} runs past its band (y + ry = ${(glow.y + glow.ry).toFixed(2)} > 1), so its edge would show`);
    if (glow.alpha.light > MAX_GLOW_ALPHA || glow.alpha.dark > MAX_GLOW_ALPHA) errors.push(`sky glow ${i} is brighter than ${MAX_GLOW_ALPHA}; the sky is a tint, not a light`);
  }
  if (look.sky.breatheMs < MIN_CYCLE_MS) errors.push(`the sky breathes every ${look.sky.breatheMs}ms, under ${MIN_CYCLE_MS}ms`);
  const total = look.motes.layers.reduce((sum, layer) => sum + layer.count, 0);
  if (total > MAX_PARTICLES) errors.push(`${total} particles, over the cap of ${MAX_PARTICLES}`);
  if (!look.motes.colors.length) errors.push('the particles have no colour');
  const front = look.motes.layers.filter((layer) => layer.front);
  if (front.length > 1) errors.push('more than one particle layer in front of the content');
  for (const layer of front) if (layer.opacity > MAX_FRONT_OPACITY) errors.push(`the front particle layer is over ${MAX_FRONT_OPACITY} opacity`);
  const beats: [string, number | undefined][] = [
    ['the garland beats', look.garland?.beatMs],
    ['the candle flickers', look.candle?.flickerMs],
    ['the mist cycles', look.mist?.cycleMs],
  ];
  for (const [what, ms] of beats) {
    if (ms !== undefined && ms < MIN_CYCLE_MS) errors.push(`${what} every ${ms}ms, under ${MIN_CYCLE_MS}ms`);
  }
  if (look.garland && !look.garland.beads?.length && !look.garland.colors.length) errors.push('the garland has neither bulbs nor beads');
  if (look.sun && look.sun.y + look.sun.radius > 1) errors.push('the sun runs past the sky band');
  if (pack.particles.length < 2) errors.push('a burst needs at least two particles');
  if (!pack.strings.toy.length) errors.push('the toy has nothing to say');
  return errors;
}
