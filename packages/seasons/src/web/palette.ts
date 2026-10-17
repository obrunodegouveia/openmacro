/**
 * Every season's palette as one stylesheet of CSS variables, keyed on the
 * `data-season` attribute the boot script sets before first paint.
 *
 * Inline the result in your root layout (`<style>{css}</style>`): it is a
 * few kilobytes for every season, and keyed on an attribute that is already
 * there on the first frame, so the right colours never flash in late, and a
 * change of season at runtime is one attribute away.
 *
 * Two kinds of variable come out, for each season and appearance:
 *
 * - The palette roles, as `--sv-<role>` (`--sv-canvas`, `--sv-ink`,
 *   `--sv-accent-text`, …). The web renderer's chrome reads these, and so
 *   can your own CSS.
 * - Your own tokens, if you pass `map`: the one function that says which of
 *   your variables each role repaints. This is how a season reaches the
 *   rest of your UI (buttons, links, cards).
 *
 * Dependency-free, so it runs on the server, in a build script or in a test.
 */

import type { SeasonColors, SeasonPack } from '../presets/types.ts';
import { SEASON_ATTRIBUTE } from './attributes.ts';

/** Options for `paletteCss`. */
export interface PaletteCssOptions<Id extends string> {
  /**
   * Your own CSS variables for one appearance of a season, from its roles.
   * Return names with their leading `--`.
   */
  readonly map?: (colors: SeasonColors, scheme: 'light' | 'dark', id: Id) => Readonly<Record<string, string>>;
  /** Also write the `--sv-<role>` variables. Default true. */
  readonly roles?: boolean;
  /**
   * The appearance your plain `:root` is in: its values go in the plain
   * rule, the other appearance's inside `@media (prefers-color-scheme: …)`.
   * Default `light`.
   */
  readonly base?: 'light' | 'dark';
  /**
   * A selector on <html> that turns the other appearance on by class or
   * attribute (`.dark`, `[data-theme="dark"]`) instead of the media query,
   * for an app with its own theme switch.
   */
  readonly toggle?: string;
  /** Extra CSS for a season, appended after its rules (`selector` is `:root[data-season="id"]`). */
  readonly extra?: (id: Id, selector: string) => string;
}

/**
 * A palette role's CSS variable name: `inkFaint` → `--sv-ink-faint`.
 *
 * @param role The role.
 * @return The variable's name.
 */
export function roleVariable(role: string): string {
  return `--sv-${role.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
}

/** Optional roles, and what stands in for them where a palette leaves them out. */
const STAND_INS: Partial<Record<keyof SeasonColors, keyof SeasonColors>> = { abyss: 'well', link: 'cool' };

/**
 * The `--sv-<role>` variables for one appearance's colours: every role
 * the palette sets in *both* appearances (so none leaks from one into the
 * other), with `abyss` and `link` standing in as `well` and `cool` where a
 * palette leaves them out.
 *
 * @param colors The colours for this appearance.
 * @param other The colours for the other one.
 * @return Variable name to value.
 */
export function roleVariables(colors: SeasonColors, other: SeasonColors = colors): Record<string, string> {
  const vars: Record<string, string> = {};
  const roles = new Set([...Object.keys(colors), ...Object.keys(other), ...Object.keys(STAND_INS)]) as Set<keyof SeasonColors>;
  for (const role of roles) {
    const stand = STAND_INS[role];
    const value = colors[role] ?? (stand ? colors[stand] : undefined);
    const there = other[role] ?? (stand ? other[stand] : undefined);
    if (typeof value === 'string' && typeof there === 'string') vars[roleVariable(role)] = value;
  }
  return vars;
}

/**
 * One CSS rule.
 *
 * @param selector The selector.
 * @param vars The declarations.
 * @param indent Leading spaces, for a rule inside a media query.
 * @return The rule.
 */
function rule(selector: string, vars: Readonly<Record<string, string>>, indent = ''): string {
  const body = Object.entries(vars)
    .map(([name, value]) => `${indent}  ${name}: ${value};`)
    .join('\n');
  return `${indent}${selector} {\n${body}\n${indent}}`;
}

/**
 * The stylesheet for every season.
 *
 * Each season's base-appearance values go on `:root[data-season="id"]`; the
 * other appearance's on the same selector inside the media query (or the
 * toggle). Every variable is set in both, because `:root[data-season]`
 * outranks a plain `:root`: a variable set for one appearance only would
 * keep that value in the other.
 *
 * @param packs The seasons, by id.
 * @param options Your mapping, and how your app switches appearance.
 * @return The CSS.
 */
export function paletteCss<Id extends string>(packs: Readonly<Record<Id, SeasonPack<string>>>, options: PaletteCssOptions<Id> = {}): string {
  const base = options.base ?? 'light';
  const other = base === 'light' ? 'dark' : 'light';
  const roles = options.roles ?? true;
  const variables = (id: Id, scheme: 'light' | 'dark') => {
    const { palette } = packs[id];
    const colors = palette[scheme];
    return { ...(roles ? roleVariables(colors, palette[scheme === 'light' ? 'dark' : 'light']) : {}), ...(options.map?.(colors, scheme, id) ?? {}) };
  };
  return (Object.keys(packs) as Id[])
    .map((id) => {
      const selector = `:root[${SEASON_ATTRIBUTE}="${id}"]`;
      const rules = [rule(selector, variables(id, base))];
      // On <html> itself: `:root[data-season="winter"].dark`.
      if (options.toggle) rules.push(rule(`${selector}${options.toggle}`, variables(id, other)));
      else rules.push(`@media (prefers-color-scheme: ${other}) {\n${rule(selector, variables(id, other), '  ')}\n}`);
      const extra = options.extra?.(id, selector);
      if (extra) rules.push(extra);
      return rules.join('\n');
    })
    .join('\n');
}
