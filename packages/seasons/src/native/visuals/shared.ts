/**
 * Small helpers every native seasonal visual shares.
 *
 * The visuals in this folder are primitives: React Native, Reanimated and
 * Gesture Handler only, and every colour, emoji, count and size arrives as
 * a prop. They know nothing about packs or seasons; the composition layer
 * (`../decor.tsx`) reads the live season's pack and hands them plain values.
 * Use them directly to draw something the composition does not.
 *
 * The rules every one of them follows: hidden from VoiceOver and TalkBack
 * (`HIDDEN`), never taking a touch meant for the screen under it (only the
 * toy is touchable), standing still when `animate` is false, and holding
 * their frame when `paused`.
 */

/** Props that take a decoration out of the accessibility tree. */
export const HIDDEN = {
  accessible: false,
  accessibilityElementsHidden: true,
  importantForAccessibility: 'no-hide-descendants',
} as const;

/**
 * A `#rrggbb` colour at an opacity, as an `rgba()` string, for gradients and
 * shadows, which take no separate opacity.
 *
 * @param hex The colour, `#rrggbb`.
 * @param alpha Its opacity, 0 to 1.
 * @return The colour as `rgba(r, g, b, a)`.
 */
export function rgba(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha)).toFixed(3)})`;
}

/**
 * A deterministic pseudo-random number for a particle, so every particle
 * varies but the same index always gets the same value: no reshuffle on
 * re-render, and nothing to seed.
 *
 * @param index The particle's index.
 * @param salt A different number for each property drawn from it.
 * @return A number in [0, 1).
 */
export function hash(index: number, salt: number): number {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Whether a looping animation runs or holds its frame, for Reanimated's CSS animations. */
export function playState(paused: boolean): 'running' | 'paused' {
  return paused ? 'paused' : 'running';
}
