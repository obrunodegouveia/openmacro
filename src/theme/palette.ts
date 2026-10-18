/**
 * The app's colours, as plain data.
 *
 * Split from `tokens.ts` so that nothing here imports React Native: the
 * season check (`npm run check:seasons`) loads this file directly to prove
 * every season has a palette and that its text clears WCAG AA.
 */

import { SEASON_IDS, SEASON_PACKS, type SeasonColors, type SeasonId } from '@openmacro/core/season';

/** The light appearance: every colour. */
export const light = {
  /** Brand / "correct" green. A fill: the same in both appearances. */
  mint: '#2FBF71',
  /** Green as text. 4.6:1 or better on every surface, in both appearances. */
  mintDark: '#1C7D48',
  mintSoft: '#E4F7ED',

  /** "Incorrect" red. */
  coral: '#FF5A5F',
  coralDark: '#C8343A',
  coralSoft: '#FFE9EA',

  /** Informational / interactive blue. */
  blue: '#3D7EFF',
  blueDark: '#2A5FD0',
  blueSoft: '#E8F0FF',

  /** Streak / XP gold. */
  gold: '#FFC94A',
  goldDark: '#946300',
  goldSoft: '#FFF6E0',

  /**
   * The 3D bevel under a coloured button. Always darker than its face, so it
   * reads as a shadow in both appearances; the *Dark tones above get lighter
   * in dark mode so they stay readable as text, and would invert the bevel.
   */
  mintBevel: '#1C7D48',
  coralBevel: '#B02A30',
  blueBevel: '#2A5FD0',

  /** Hearts. */
  heart: '#FF4B6E',

  /**
   * The fifth colour that tells concept_match links apart, after blue, gold,
   * mint and coral. A fill, the same in both appearances. Violet, except at
   * Halloween, when blue is already violet (see `seasonal`).
   */
  linkAccent: '#9B5DE5',

  /** Drop shadows. Dark in both appearances: a light shadow reads as a glow. */
  shadow: '#0B1220',

  /**
   * Behind a video, and the text on it. Near-black in both appearances, like
   * any player: a frame that turned pale in dark mode flashed white around
   * the video as it loaded.
   */
  media: '#0B0F14',
  onMedia: '#F7F9FB',

  /**
   * Text on the bright fills (mint, coral, gold), in both appearances. White
   * on mint measured 2.4:1 and on coral 2.8:1, below even the 3:1 allowed for
   * large bold labels; this dark ink is 8.8:1 and 6.4:1.
   */
  onFill: '#0B1220',

  /*
   * Text. inkMuted and inkFaint used to be #7B8794 and #B4BEC9, which
   * measured 3.5:1 and 1.8:1 on the canvas: secondary text failed WCAG AA
   * and "faint" text was barely there. Now 6.1:1 and 5.1:1 in light, and
   * 9.3:1 and 6.7:1 in dark. The hierarchy between them comes from size and
   * weight, not from being hard to read.
   */
  ink: '#1F2933',
  inkMuted: '#52606D',
  inkFaint: '#5F6C7E',

  border: '#E4E7EB',
  borderStrong: '#CBD2D9',

  surface: '#FFFFFF',
  canvas: '#F7F9FB',
  overlay: 'rgba(31, 41, 51, 0.35)',
} as const;

export type PaletteKey = keyof typeof light;

/** The dark appearance: only what differs. Fills such as mint stay the same. */
export const dark: Partial<Record<PaletteKey, string>> = {
  mintDark: '#3DCB7C',
  mintSoft: '#12301F',
  coralDark: '#FF7A7E',
  coralSoft: '#3A1618',
  blueDark: '#79A6FF',
  blueSoft: '#13233F',
  goldDark: '#F2B33D',
  goldSoft: '#33280E',
  ink: '#E6EDF3',
  inkMuted: '#AAB6C3',
  inkFaint: '#8E9AA8',
  border: '#2A313C',
  borderStrong: '#3A4350',
  surface: '#161B22',
  canvas: '#0B0F14',
  overlay: 'rgba(0, 0, 0, 0.55)',
};


/**
 * A season's colours as the app's tokens: the pack's palette roles
 * (`SeasonColors` in `@openmacro/core/season`) mapped onto this palette's
 * names. The site maps the same roles onto its CSS variables
 * (`web/src/lib/season-palette.ts`), so both clients paint one palette.
 *
 * Mint and coral are not mapped: they mean "correct" and "wrong" all year.
 *
 * @param colors The season's colours for one appearance.
 * @param scheme Which appearance they are for; the overlay and shadow tint
 *     only the light one.
 * @return The tokens the season repaints.
 */
function seasonTokens(colors: SeasonColors, scheme: 'light' | 'dark'): Partial<Record<PaletteKey, string>> {
  const tokens: Partial<Record<PaletteKey, string>> = {
    gold: colors.accent,
    goldDark: colors.accentText,
    goldSoft: colors.accentSoft,
    blue: colors.cool,
    blueDark: colors.coolText,
    blueSoft: colors.coolSoft,
    blueBevel: colors.coolDeep,
    ink: colors.ink,
    inkMuted: colors.inkMuted,
    inkFaint: colors.inkFaint,
    border: colors.hairline,
    borderStrong: colors.hairlineStrong,
    surface: colors.surface,
    canvas: colors.canvas,
  };
  if (colors.link) tokens.linkAccent = colors.link;
  if (scheme === 'light') {
    if (colors.shadow) tokens.shadow = colors.shadow;
    tokens.overlay = overlayOf(colors.ink);
  }
  return tokens;
}

/**
 * The scrim behind a sheet, tinted with the season's ink rather than black.
 *
 * @param ink `#rrggbb`.
 * @return An `rgba()` at the light scrim's opacity.
 */
function overlayOf(ink: string): string {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(ink.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, 0.4)`;
}

/**
 * What each season repaints, on top of `light` and `dark`, from its pack.
 *
 * Only accents and surfaces move. Every text colour in a pack is checked for
 * 4.5:1 on its surfaces, under the season's sky and mist too
 * (`npm run check:seasons`).
 */
export const seasonal = Object.fromEntries(
  SEASON_IDS.map((id) => {
    const { palette } = SEASON_PACKS[id];
    return [id, { light: seasonTokens(palette.light, 'light'), dark: seasonTokens(palette.dark, 'dark') }];
  }),
) as Record<SeasonId, { light: Partial<Record<PaletteKey, string>>; dark: Partial<Record<PaletteKey, string>> }>;
