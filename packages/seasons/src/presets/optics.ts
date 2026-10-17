/**
 * The numbers both renderers draw with and `checkPack` measures with: how a
 * glow fades, how far the sun's rays reach, how many particles a field may
 * hold and how fast anything may beat. Kept in one place so the checker
 * measures exactly what is drawn, on either platform.
 */

/** A falloff: [offset from the centre (0 to 1), strength there (0 to 1)] pairs. */
export type Falloff = readonly (readonly [number, number])[];

/**
 * How a sky glow fades from its centre to its edge: an eased falloff, so the
 * edge of a wide, flat glow never reads as a line.
 */
export const GLOW_FALLOFF: Falloff = [
  [0, 1],
  [0.3, 0.7],
  [0.55, 0.35],
  [0.8, 0.1],
  [1, 0],
];

/** How the sun's core fades from its centre to its edge. */
export const SUN_FALLOFF: Falloff = [
  [0, 1],
  [0.35, 0.7],
  [0.65, 0.25],
  [1, 0],
];

/** How one of the sun's rays fades along its length. */
export const RAY_FALLOFF: Falloff = [
  [0, 1],
  [0.55, 0.33],
  [1, 0],
];

/** How far the sun's rays reach, as a multiple of the core's radius. */
export const SUN_REACH = 2.6;

/** How bright a ray is at its root, against the core's peak. */
export const RAY_STRENGTH = 0.55;

/** The most particles one field draws, across all its depths. */
export const MAX_PARTICLES = 40;

/**
 * The shortest twinkle, flicker, breath or shimmer cycle, in milliseconds.
 * Each half stays well over a third of a second, far from the 3 Hz where
 * flashing becomes a seizure risk (WCAG 2.3.1).
 */
export const MIN_CYCLE_MS = 1000;

/** The brightest a sky glow may be at its centre: the sky is a tint, not a light. */
export const MAX_GLOW_ALPHA = 0.35;

/** The most opaque the particle layer in front of the content may be. */
export const MAX_FRONT_OPACITY = 0.75;
