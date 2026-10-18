/**
 * Toys drawn rather than typed: shapes with no good emoji, described once
 * here as plain numbers so both renderers draw exactly the same thing out of
 * plain views or divs and gradients (no SVG, no images, no native module).
 */

/** A drawn toy, for `SeasonPack.toy.shape`. */
export type ToyShape = 'beach-ball';

/**
 * The beach ball: there is no beach-ball emoji (🏐 is a volleyball), so it
 * is drawn.
 *
 * Seen from the side, a ball's panels are lunes, and a lune projects onto
 * the disc as the space between two ellipses that share its height. So the
 * ball is a disc split left and right (the outer panels), a narrower ellipse
 * over it (the white panels either side of the front), a narrower one again
 * (the front panel), and a white cap where the panels meet at the pole. The
 * whole thing leans, so the pole sits up and to the left, the way a ball is
 * usually drawn, and a soft highlight and a shade on the far side make it
 * round.
 */
export const BEACH_BALL = {
  /** Left outer panel, right outer panel, the white panels, the front panel, the cap. */
  colors: { left: '#E8473F', right: '#FFC93C', white: '#FFFFFF', front: '#2D7FD3', cap: '#FFFFFF' },
  /** The white panels' ellipse, and the front panel's, as fractions of the diameter. */
  whiteWidth: 0.66,
  frontWidth: 0.26,
  /** The cap's width and height, as fractions of the diameter; centred on the top edge. */
  cap: { width: 0.34, height: 0.16 },
  /** How far the ball leans, in degrees (negative tips the pole to the left). */
  tilt: -24,
  /** The highlight (top left) and the shade (bottom right), as CSS gradients over the disc. */
  highlight: 'radial-gradient(circle at 34% 26%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 42%)',
  shade: 'radial-gradient(circle at 42% 38%, rgba(0, 0, 0, 0) 52%, rgba(0, 0, 0, 0.24) 100%)',
  /** A hairline round the disc, so the white panels hold their edge on a pale page. */
  rim: 'rgba(0, 0, 0, 0.18)',
} as const;
