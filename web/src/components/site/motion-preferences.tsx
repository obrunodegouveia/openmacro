"use client";

import { MotionConfig } from "motion/react";

/**
 * One switch for every Motion animation on the site.
 *
 * With `reducedMotion="user"`, a visitor who asked their system for less
 * motion gets no transform or layout animation anywhere, without each
 * component having to check `prefers-reduced-motion` itself. Opacity and
 * colour changes still run, so state changes remain visible.
 *
 * @param children The page tree.
 * @return The tree inside a MotionConfig.
 */
export function MotionPreferences({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
