/**
 * OpenMacro design tokens.
 *
 * Single source of truth for colour, spacing, radius and typography.
 * Components must never hard-code a hex value — add it here instead so the
 * whole app can be re-themed. Colours that differ by appearance are built
 * with `adaptive`, below.
 */

import { DynamicColorIOS, Platform, type ColorSchemeName, type ColorValue } from 'react-native';

/**
 * A colour that follows the system appearance.
 *
 * On iOS this is a native dynamic colour: React Native resolves it on the UI
 * side, so a `StyleSheet.create` written once flips between light and dark
 * when the system does, with no re-render and no theme hook in every screen.
 * Android has no equivalent in React Native core and no release yet, so it
 * gets the light value until it ships.
 *
 * The app follows the system only when `userInterfaceStyle` in app.json is
 * "automatic"; while it is "light", iOS always resolves the light value.
 */
function adaptive(light: string, dark: string): ColorValue {
  return Platform.OS === 'ios' ? DynamicColorIOS({ light, dark }) : light;
}

/** The light appearance: every colour. */
const light = {
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

  /** Drop shadows. Dark in both appearances: a light shadow reads as a glow. */
  shadow: '#0B1220',

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

type PaletteKey = keyof typeof light;

/** The dark appearance: only what differs. Fills such as mint stay the same. */
const dark: Partial<Record<PaletteKey, string>> = {
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
 * The palette components use. Each colour that differs by appearance is a
 * native dynamic colour (see `adaptive`); the rest are plain strings.
 */
export const palette = Object.fromEntries(
  (Object.keys(light) as PaletteKey[]).map((key) => [
    key,
    dark[key] ? adaptive(light[key], dark[key]) : light[key],
  ]),
) as Record<PaletteKey, ColorValue>;

/**
 * Plain colour strings for one appearance, for the few props that accept
 * only a string (the slider's tints). Pair it with `useColorScheme()`.
 *
 * @param scheme The appearance to resolve for.
 * @return Every palette colour as a string.
 */
export function resolvePalette(scheme: ColorSchemeName): Record<PaletteKey, string> {
  return scheme === 'dark' ? { ...light, ...dark } as Record<PaletteKey, string> : { ...light };
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 30, lineHeight: 36, fontWeight: '800' },
  title: { fontSize: 23, lineHeight: 30, fontWeight: '800' },
  heading: { fontSize: 19, lineHeight: 26, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '500' },
  bodyStrong: { fontSize: 16, lineHeight: 23, fontWeight: '700' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
  overline: { fontSize: 12, lineHeight: 16, fontWeight: '800', letterSpacing: 1.1 },
  mono: { fontSize: 16, lineHeight: 22, fontWeight: '700' },
} as const;

/**
 * Chunky "3D" button shadow used across the app (a pressed button visually
 * sinks onto its shadow). Kept here so every pressable feels identical.
 */
export const elevation = {
  buttonOffset: 4,
} as const;

export const theme = { palette, spacing, radius, typography, elevation } as const;

export type Theme = typeof theme;
