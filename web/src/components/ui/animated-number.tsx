"use client";

import * as React from "react";
import { useSpring, useMotionValueEvent, useReducedMotion } from "motion/react";

/**
 * A number that springs to its new value instead of snapping.
 *
 * Rendered as plain text (not a `motion.span`) so the caller keeps full
 * control of formatting — currency, multipliers and percentages all differ.
 *
 * The spring is an external system: the effect only pushes the new target into
 * it, and React state is updated from the spring's change subscription rather
 * than synchronously inside the effect.
 */
export function AnimatedNumber({
  value,
  format,
  className,
}: {
  value: number;
  format: (value: number) => string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const spring = useSpring(value, { stiffness: 140, damping: 22, mass: 0.6 });
  const [animated, setAnimated] = React.useState(value);

  React.useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useMotionValueEvent(spring, "change", setAnimated);

  // Anyone who asked for reduced motion reads the exact value, never a
  // half-finished interpolation on its way there.
  return <span className={className}>{format(reduceMotion ? value : animated)}</span>;
}
