/**
 * Palette roles: what each colour in a pack is *for*, so an app can map
 * them onto its own tokens once and paint every season, present or future.
 *
 * A pack never names an app's tokens. It says "this is the canvas, this is
 * text, this is the warm accent as a fill", and the app says, in one typed
 * function, which of its tokens each role repaints. That function is the
 * whole integration with a design system.
 */

import type { SeasonColors, SeasonPalette } from './types.ts';

/** Every role a season's colours are written in. */
export type PaletteRole = keyof SeasonColors;

/** What a role is used as, which decides what it is measured against. */
export type RoleKind = 'surface' | 'border' | 'text' | 'fill' | 'tint';

/** One role, documented. */
export interface RoleInfo {
  readonly role: PaletteRole;
  readonly kind: RoleKind;
  /** Present in every pack (`true`) or only where the season needs it. */
  readonly required: boolean;
  readonly description: string;
}

/**
 * Every palette role, in the order a mapping function usually lists them.
 * The README's "Palette roles" table is this list.
 */
export const PALETTE_ROLES: readonly RoleInfo[] = [
  { role: 'canvas', kind: 'surface', required: true, description: 'The page behind everything.' },
  { role: 'surface', kind: 'surface', required: true, description: 'Cards.' },
  { role: 'raised', kind: 'surface', required: true, description: 'Cards on cards, popovers, speech bubbles.' },
  { role: 'well', kind: 'surface', required: true, description: 'Sunken wells and insets.' },
  { role: 'abyss', kind: 'surface', required: false, description: 'The deepest shade, behind scrims. Dark appearance only.' },
  { role: 'hairline', kind: 'border', required: true, description: 'Hairline borders.' },
  { role: 'hairlineStrong', kind: 'border', required: true, description: 'Stronger borders.' },
  { role: 'ink', kind: 'text', required: true, description: 'Body text and headings.' },
  { role: 'inkMuted', kind: 'text', required: true, description: 'Secondary text.' },
  { role: 'inkFaint', kind: 'text', required: true, description: 'The faintest text that still clears AA; threads and wires.' },
  { role: 'accent', kind: 'fill', required: true, description: 'The warm accent as a fill: a streak, points, a highlight.' },
  { role: 'accentText', kind: 'text', required: true, description: 'The warm accent as text.' },
  { role: 'accentDeep', kind: 'fill', required: true, description: 'A deeper warm fill, for pressed edges and bevels.' },
  { role: 'accentSoft', kind: 'tint', required: true, description: 'A pale warm wash, behind accent text (a greeting pill).' },
  { role: 'cool', kind: 'fill', required: true, description: 'The cool accent as a fill: primary actions, links.' },
  { role: 'coolText', kind: 'text', required: true, description: 'The cool accent as text.' },
  { role: 'coolDeep', kind: 'fill', required: true, description: 'A deeper cool fill, for a button’s bevel.' },
  { role: 'coolSoft', kind: 'tint', required: true, description: 'A pale cool wash.' },
  { role: 'link', kind: 'fill', required: false, description: 'A third accent, where the cool one is too close to the text to read as a link.' },
  { role: 'correctText', kind: 'text', required: false, description: 'Success green as text, deepened where the sky would wash it out.' },
  { role: 'shadow', kind: 'tint', required: false, description: 'The tint of drop shadows. Light appearance.' },
];

/** The roles drawn as text, measured for AA by `checkPack`. */
export const TEXT_ROLES: readonly PaletteRole[] = PALETTE_ROLES.filter((info) => info.kind === 'text').map((info) => info.role);

/** The roles text is drawn on, measured against by `checkPack`. */
export const SURFACE_ROLES: readonly PaletteRole[] = ['canvas', 'surface', 'raised'];

/**
 * Maps a season's palette onto an app's own tokens, for both appearances.
 *
 * The one function an app writes to adopt any season. Typed by what it
 * returns, so the app's token names are checked, not the package's.
 *
 * ```ts
 * const tokens = mapPalette(pack.palette, (c, scheme) => ({
 *   background: c.canvas,
 *   card: c.surface,
 *   text: c.ink,
 *   primary: c.cool,
 *   highlight: scheme === 'light' ? c.accentText : c.accent,
 * }));
 * tokens.light.primary; // string
 * ```
 *
 * @param palette The season's palette.
 * @param map The app's mapping, given one appearance's colours and its name.
 * @return The app's tokens for `light` and `dark`.
 */
export function mapPalette<T>(palette: SeasonPalette, map: (colors: SeasonColors, scheme: 'light' | 'dark') => T): { light: T; dark: T } {
  return { light: map(palette.light, 'light'), dark: map(palette.dark, 'dark') };
}
