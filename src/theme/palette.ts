/**
 * The app's colours, as plain data.
 *
 * Split from `tokens.ts` so that nothing here imports React Native: the
 * season check (`npm run check:seasons`) loads this file directly to prove
 * every season has a palette and that its text clears WCAG AA.
 */

import type { SeasonId } from '@openmacro/core/season';

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
 * What each season repaints, on top of `light` and `dark`.
 *
 * Only accents and surfaces move. Mint stays green and coral stays red in
 * every season, because they mean "correct" and "wrong" and a learner should
 * never have to relearn that for a month. Every text colour here was checked
 * for 4.5:1 on its surfaces, like the base palette.
 */
export const seasonal: Record<SeasonId, { light: Partial<Record<PaletteKey, string>>; dark: Partial<Record<PaletteKey, string>> }> = {
  // Pumpkin for the streak and XP, violet where the app is usually blue, and
  // a warm parchment canvas. Mint stays, and reads as slime green beside them.
  halloween: {
    light: {
      gold: '#FF8A1F',
      goldDark: '#A84A00',
      goldSoft: '#FFEBD6',
      blue: '#7B4DE8',
      blueDark: '#5B32C4',
      blueSoft: '#EFE8FF',
      blueBevel: '#5B32C4',
      // Teal, because blue has become violet.
      linkAccent: '#14A3A8',
      shadow: '#1A0F24',
      ink: '#241A2E',
      inkMuted: '#594C66',
      inkFaint: '#66587A',
      border: '#EDE2D2',
      borderStrong: '#D9C9B2',
      canvas: '#FBF5EC',
      overlay: 'rgba(36, 26, 46, 0.4)',
    },
    dark: {
      gold: '#FF8A1F',
      goldDark: '#FFA348',
      goldSoft: '#3A220C',
      blue: '#7B4DE8',
      blueDark: '#B49CFF',
      blueSoft: '#22163A',
      blueBevel: '#5B32C4',
      ink: '#EEE6F5',
      inkMuted: '#B9ABCC',
      inkFaint: '#9D8EB3',
      border: '#2E2140',
      borderStrong: '#3F2E55',
      surface: '#1A1026',
      canvas: '#0E0816',
    },
  },
  // A snowy night: frost blue where the app is usually blue, candle gold for
  // the streak and XP, and a cold canvas. Red and green come from the
  // decorations only, never from the palette, where they would read as
  // "wrong" and "correct".
  christmas: {
    light: {
      gold: '#FFC23D',
      goldDark: '#8A5A00',
      goldSoft: '#FFF3D6',
      blue: '#2E7BD1',
      blueDark: '#1C5A9E',
      blueSoft: '#E4F0FB',
      blueBevel: '#1C5A9E',
      shadow: '#0A1626',
      ink: '#14233A',
      inkMuted: '#45566D',
      inkFaint: '#536580',
      border: '#DCE6F0',
      borderStrong: '#C3D2E2',
      canvas: '#F3F7FB',
      overlay: 'rgba(20, 35, 58, 0.38)',
    },
    dark: {
      gold: '#FFC23D',
      goldDark: '#FFD36B',
      goldSoft: '#33270B',
      blue: '#2E7BD1',
      blueDark: '#8CC4FF',
      blueSoft: '#10233A',
      blueBevel: '#1C5A9E',
      ink: '#E8F1FA',
      inkMuted: '#A9BBD0',
      inkFaint: '#8EA3BC',
      border: '#1E3048',
      borderStrong: '#2C4260',
      surface: '#0F1C2E',
      canvas: '#08111F',
    },
  },
};
