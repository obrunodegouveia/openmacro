/**
 * OpenMacro design tokens.
 *
 * Single source of truth for colour, spacing, radius and typography.
 * Components must never hard-code a hex value — add it here instead so the
 * whole app can be re-themed (and so a dark theme can be layered on later).
 */

export const palette = {
  /** Brand / "correct" green. */
  mint: '#2FBF71',
  mintDark: '#249A5A',
  mintSoft: '#E4F7ED',

  /** "Incorrect" red. */
  coral: '#FF5A5F',
  coralDark: '#D93B40',
  coralSoft: '#FFE9EA',

  /** Informational / interactive blue. */
  blue: '#3D7EFF',
  blueDark: '#2A5FD0',
  blueSoft: '#E8F0FF',

  /** Streak / XP gold. */
  gold: '#FFC94A',
  goldDark: '#D9A423',
  goldSoft: '#FFF6E0',

  /** Hearts. */
  heart: '#FF4B6E',

  ink: '#1F2933',
  inkMuted: '#7B8794',
  inkFaint: '#B4BEC9',

  border: '#E4E7EB',
  borderStrong: '#CBD2D9',

  surface: '#FFFFFF',
  canvas: '#F7F9FB',
  overlay: 'rgba(31, 41, 51, 0.35)',
} as const;

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
