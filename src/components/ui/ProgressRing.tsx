/**
 * ============================================================================
 * Progress ring
 * ============================================================================
 *
 * A circular progress indicator with something in the middle — a module's
 * number, a checkmark. It is how a module row says "how far" in the space of
 * an icon, which is what lets 22 Advanced modules fit on a phone as a list
 * you can read at a glance instead of 22 cards you have to scroll past.
 *
 * DRAWN WITH VIEWS, NOT SVG. The app has no SVG renderer, and adding one is a
 * native module: the fingerprint would change and this could only ship in a
 * new App Store build rather than over the air. The two-half technique below
 * is the long-standing way to do it with borders alone: each half of the ring
 * is a circle whose top and right borders are coloured, clipped to one side
 * and rotated into view as progress passes through that half.
 */

import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { palette } from '@/theme/tokens';

export interface ProgressRingProps {
  /** 0–1. */
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  /** Rendered in the centre. */
  children?: ReactNode;
}

export function ProgressRing({
  progress,
  size = 44,
  stroke = 4,
  color = palette.mint,
  track = palette.border,
  children,
}: ProgressRingProps) {
  const p = Math.min(1, Math.max(0, progress));
  const half = size / 2;
  const circle = {
    width: size,
    height: size,
    borderRadius: half,
    borderWidth: stroke,
  };
  // The coloured half-arc starts hidden on the opposite side of each clip and
  // turns into view: the right half covers 0–50 %, the left half 50–100 %.
  const rightTurn = -135 + Math.min(p, 0.5) * 360;
  const leftTurn = 45 + Math.max(0, p - 0.5) * 360;
  const arc = {
    borderTopColor: color,
    borderRightColor: color,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  };

  return (
    <View style={{ width: size, height: size }}>
      <View style={[StyleSheet.absoluteFill, circle, { borderColor: track }]} />
      {p > 0 ? (
        <>
          <View style={[styles.clip, { left: half, width: half, height: size }]}>
            <View
              style={[
                circle,
                arc,
                { position: 'absolute', left: -half, transform: [{ rotate: `${rightTurn}deg` }] },
              ]}
            />
          </View>
          {p > 0.5 ? (
            <View style={[styles.clip, { left: 0, width: half, height: size }]}>
              <View
                style={[
                  circle,
                  arc,
                  { position: 'absolute', left: 0, transform: [{ rotate: `${leftTurn}deg` }] },
                ]}
              />
            </View>
          ) : null}
        </>
      ) : null}
      <View style={[StyleSheet.absoluteFill, styles.centre]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { position: 'absolute', top: 0, overflow: 'hidden' },
  centre: { alignItems: 'center', justifyContent: 'center' },
});
