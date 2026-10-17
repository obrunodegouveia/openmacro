import { SEASON_IDS, SEASON_PACKS, type SeasonColors, type SeasonId } from "@openmacro/core/season";

/**
 * The site's seasonal palettes, written from the season packs.
 *
 * A season's colours live once, in its pack (`SeasonPack.palette` in
 * `@openmacro/core/season`), by role. This maps the roles onto the site's
 * CSS variables and writes one stylesheet for every season, which the root
 * layout inlines (`SEASON_STYLES`). The app maps the same roles onto its own
 * tokens (`seasonal` in `src/theme/palette.ts`), so both clients paint one
 * palette and a new season needs no CSS.
 *
 * Inlined rather than linked, and keyed on `data-season`, which the inline
 * boot script sets before first paint: the right colours are there on the
 * first frame. A few kilobytes for every season, all year.
 *
 * Mint and coral are never mapped: they mean "correct" and "wrong" all year.
 *
 * Imports nothing at runtime but the packs, so `npm run check:seasons` can
 * load it directly and measure exactly what the site paints.
 */

/** The light theme's own abyss, kept by every season: it is the scrim's colour, not a surface. */
const LIGHT_ABYSS = "#05080f";

/**
 * A season's CSS variables for one appearance.
 *
 * @param colors The season's colours for that appearance.
 * @param scheme Which appearance: gold is text in light and a fill in dark.
 * @return Variable name to value.
 */
export function seasonVariables(colors: SeasonColors, scheme: "light" | "dark"): Record<string, string> {
  const vars: Record<string, string> = {
    "--color-abyss": scheme === "dark" ? (colors.abyss ?? colors.well) : LIGHT_ABYSS,
    "--color-canvas": colors.canvas,
    "--color-surface": colors.surface,
    "--color-surface-raised": colors.raised,
    "--color-hairline": colors.hairline,
    "--color-well": colors.well,
    "--color-ink": colors.ink,
    "--color-ink-muted": colors.inkMuted,
    "--color-ink-faint": colors.inkFaint,
    "--color-gold": scheme === "light" ? colors.accentText : colors.accent,
    "--color-gold-deep": colors.accentDeep,
    "--color-azure": colors.cool,
    "--color-azure-deep": colors.coolDeep,
    "--color-azure-text": colors.coolText,
  };
  if (colors.correctText) vars["--color-mint-bright"] = colors.correctText;
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
function rule(selector: string, vars: Record<string, string>, indent = ""): string {
  const body = Object.entries(vars)
    .map(([name, value]) => `${indent}  ${name}: ${value};`)
    .join("\n");
  return `${indent}${selector} {\n${body}\n${indent}}`;
}

/**
 * The stylesheet for one season: its dark values, its light values inside
 * the light media query (a token set only in the dark block would stay dark
 * in light mode, because `:root[data-season]` outranks the plain light
 * `:root`), and the dark accents kept on `.on-dark` surfaces.
 *
 * @param id The season.
 * @return Its CSS.
 */
export function seasonStylesFor(id: SeasonId): string {
  const { palette } = SEASON_PACKS[id];
  const selector = `:root[data-season="${id}"]`;
  return [
    rule(selector, seasonVariables(palette.dark, "dark")),
    `@media (prefers-color-scheme: light) {\n${rule(selector, seasonVariables(palette.light, "light"), "  ")}\n}`,
    // A dark surface keeps the season's dark accents in either theme.
    rule(`${selector} .on-dark`, { "--color-gold": palette.dark.accent, "--color-azure-text": palette.dark.coolText }),
  ].join("\n");
}

/** Every season's stylesheet, for the root layout to inline. */
export const SEASON_STYLES: string = SEASON_IDS.map(seasonStylesFor).join("\n");
