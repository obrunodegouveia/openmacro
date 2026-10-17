import { SEASON_PACKS, type SeasonColors, type SeasonId } from "@openmacro/core/season";
import { paletteCss } from "@openmacro/seasons/web/boot";

/**
 * The site's seasonal palettes, written from the season packs.
 *
 * A season's colours live once, in its pack (`SeasonPack.palette` in
 * `@openmacro/core/season`), by role. This maps the roles onto the site's
 * CSS variables (`seasonVariables`), and the package's `paletteCss` writes
 * one stylesheet for every season from it, with the palette-role variables
 * the decorations read (`--sv-ink` and the rest) alongside; the root layout
 * inlines it (`SEASON_STYLES`). The app maps the same roles onto its own
 * tokens (`seasonal` in `src/theme/palette.ts`), so both clients paint one
 * palette and a new season needs no CSS.
 *
 * Inlined rather than linked, and keyed on `data-season`, which the inline
 * boot script sets before first paint: the right colours are there on the
 * first frame. A few kilobytes for every season, all year.
 *
 * Mint and coral are never mapped: they mean "correct" and "wrong" all year.
 *
 * Imports nothing at runtime but the packs and the package's dependency-free
 * generator, so `npm run check:seasons` can load it directly and measure
 * exactly what the site paints.
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

/** Every season's stylesheet, for the root layout to inline. */
export const SEASON_STYLES: string = paletteCss(SEASON_PACKS, {
  map: seasonVariables,
  // The site is dark by default, light under the media query.
  base: "dark",
  // A dark surface keeps the season's dark accents in either theme.
  extra: (id: SeasonId, selector) => {
    const { dark } = SEASON_PACKS[id].palette;
    return `${selector} .on-dark {\n  --color-gold: ${dark.accent};\n  --color-azure-text: ${dark.coolText};\n}`;
  },
});
