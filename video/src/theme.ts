/**
 * The app's own tokens, restated.
 *
 * Copied rather than imported because `@/theme/tokens` lives in the Expo app
 * and pulls React Native with it, which has no place in a video bundle. The
 * values are the contract; if the app's palette moves, this moves with it.
 */
export const palette = {
  ink: '#1F2933',
  inkMuted: '#7B8794',
  inkFaint: '#B4BEC9',
  mint: '#2FBF71',
  mintDark: '#249A5A',
  coral: '#FF5A5F',
  gold: '#FFC94A',
  canvas: '#0B1220',
  surface: '#131C2E',
  border: '#22304A',
} as const;

export const font =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, Helvetica, Arial, sans-serif';
