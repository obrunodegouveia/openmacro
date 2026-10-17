"use client";

import * as React from "react";
import type { Vars } from "./runtime.ts";

/** How far a pointer must move before a press is a drag, not a click. */
const DRAG_SLOP = 6;

/** The spring that brings it back sideways: loose, so it swings past and settles. */
const PENDULUM = { stiffness: 70, damping: 5 } as const;

/** The spring on the thread's length: a bounce, quicker to settle. */
const BOUNCE = { stiffness: 110, damping: 9 } as const;

/** Below this distance and speed the spring has stopped. */
const REST = 0.4;

/**
 * One step of a damped spring towards zero (semi-implicit Euler, unit mass).
 *
 * @param x Where it is.
 * @param v How fast it is going.
 * @param spring Its stiffness and damping.
 * @param dt The step, in seconds.
 * @return The new position and velocity.
 */
function step(x: number, v: number, spring: { stiffness: number; damping: number }, dt: number): [number, number] {
  const next = v + (-spring.stiffness * x - spring.damping * v) * dt;
  return [x + next * dt, next];
}

/**
 * A toy on a thread from the top of its container that a pointer can pick
 * up: the same feel as the native `DraggableToy`.
 *
 * It bobs on its own. Dragged, it follows the pointer on a stretching thread,
 * hanging along it; let go, it springs back and swings like a pendulum,
 * carrying the speed it was thrown with. A click drops it (`drop`), rings
 * it (`swing`), bounces it on its thread (`bounce`) or sends it darting
 * about in a little loop (`buzz`). The physics runs in `requestAnimationFrame` and writes
 * `transform`s straight to the DOM: React renders nothing while it moves.
 * Without motion it hangs still and comes back from a drag without
 * swinging. See `runtime.ts` for the rules every visual here follows.
 *
 * It is a `div` with pointer handlers, not a button, on purpose: an ornament
 * with no function, hidden from assistive technology, and not one more tab
 * stop on every page.
 *
 * @param props.rest How far below the container's top it hangs, as a CSS length.
 * @param props.move `drop`, `swing`, `bounce` or `buzz`.
 * @param props.animate Whether it may move on its own.
 * @param props.onTap A click, after the toy has started its move.
 * @param props.className Places the toy (its container is absolutely positioned).
 * @param props.children The toy's artwork.
 * @param props.attached Drawn beside the toy and moving with it, such as a line it says.
 * @return The toy.
 */
export function DraggableToy({
  rest,
  move,
  animate,
  onTap,
  className,
  children,
  attached,
}: {
  rest: string;
  move: "drop" | "swing" | "bounce" | "buzz";
  animate: boolean;
  onTap?: () => void;
  className?: string;
  children: React.ReactNode;
  attached?: React.ReactNode;
}) {
  const swingRef = React.useRef<HTMLDivElement>(null);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const [moving, setMoving] = React.useState(false);
  const [held, setHeld] = React.useState(false);
  // Everything the physics touches lives in a ref: no render per frame.
  const physics = React.useRef({ x: 0, y: 0, vx: 0, vy: 0, frame: 0, last: 0, restPx: 0 });
  const press = React.useRef<{ id: number; x0: number; y0: number; sx: number; sy: number; dragging: boolean; t: number; px: number; py: number } | null>(null);

  /** Writes the current offset to the DOM: a rotation about the anchor and a stretch along the thread. */
  const paint = React.useCallback(() => {
    const p = physics.current;
    const down = p.restPx + p.y;
    const angle = Math.atan2(p.x, Math.max(1, down));
    const stretch = Math.hypot(p.x, down) - p.restPx;
    if (swingRef.current) swingRef.current.style.transform = `rotate(${-angle}rad) translateY(${stretch.toFixed(1)}px)`;
  }, []);

  const settle = React.useCallback(() => {
    const p = physics.current;
    cancelAnimationFrame(p.frame);
    p.last = performance.now();
    // Without motion, critically damped: home without a swing.
    const sideways = animate ? PENDULUM : { stiffness: PENDULUM.stiffness, damping: 2 * Math.sqrt(PENDULUM.stiffness) };
    const along = animate ? BOUNCE : { stiffness: BOUNCE.stiffness, damping: 2 * Math.sqrt(BOUNCE.stiffness) };
    const tick = (now: number) => {
      // Small fixed steps, so a dropped frame does not blow the spring up.
      let left = Math.min(0.064, (now - p.last) / 1000);
      p.last = now;
      while (left > 0) {
        const dt = Math.min(left, 0.008);
        [p.x, p.vx] = step(p.x, p.vx, sideways, dt);
        [p.y, p.vy] = step(p.y, p.vy, along, dt);
        left -= dt;
      }
      paint();
      if (Math.abs(p.x) + Math.abs(p.y) < REST && Math.abs(p.vx) + Math.abs(p.vy) < REST * 10) {
        p.x = p.y = p.vx = p.vy = 0;
        paint();
        setHeld(false);
        return;
      }
      p.frame = requestAnimationFrame(tick);
    };
    p.frame = requestAnimationFrame(tick);
  }, [animate, paint]);

  React.useEffect(() => () => cancelAnimationFrame(physics.current.frame), []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const p = physics.current;
    cancelAnimationFrame(p.frame);
    // The thread's resting length, measured now, so `rest` may be any CSS length.
    p.restPx = bodyRef.current?.offsetTop ?? 0;
    event.currentTarget.setPointerCapture(event.pointerId);
    press.current = { id: event.pointerId, x0: event.clientX, y0: event.clientY, sx: p.x, sy: p.y, dragging: false, t: event.timeStamp, px: event.clientX, py: event.clientY };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = press.current;
    if (!current || current.id !== event.pointerId) return;
    const dx = event.clientX - current.x0;
    const dy = event.clientY - current.y0;
    if (!current.dragging) {
      if (Math.hypot(dx, dy) < DRAG_SLOP) return;
      current.dragging = true;
      setHeld(true);
      setMoving(false);
    }
    const p = physics.current;
    const dt = Math.max(1, event.timeStamp - current.t) / 1000;
    // Velocity from the last move, for the throw.
    p.vx = (event.clientX - current.px) / dt;
    p.vy = (event.clientY - current.py) / dt;
    current.t = event.timeStamp;
    current.px = event.clientX;
    current.py = event.clientY;
    p.x = current.sx + dx;
    // Not above the anchor.
    p.y = Math.max(-p.restPx * 0.6, current.sy + dy);
    paint();
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = press.current;
    if (!current || current.id !== event.pointerId) return;
    press.current = null;
    if (current.dragging) {
      settle();
      return;
    }
    if (animate) setMoving(true);
    onTap?.();
  };

  return (
    <div className={`sv sv-toy ${className ?? ""}`} data-move={move} data-moving={moving || undefined} data-held={held || undefined} data-animate={animate || undefined} style={{ "--sv-toy-rest": rest } as Vars}>
      <div ref={swingRef} className="sv-toy-swing">
        <div
          ref={bodyRef}
          className="sv-toy-body"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onAnimationEnd={(event) => {
            // Only the body's own drop or swing; a line's fade-in bubbles up too.
            if (event.target === event.currentTarget && event.animationName !== "sv-toy-bob") setMoving(false);
          }}
        >
          {children}
          {attached}
        </div>
      </div>
    </div>
  );
}
