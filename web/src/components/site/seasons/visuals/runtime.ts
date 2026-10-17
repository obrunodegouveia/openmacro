"use client";

import * as React from "react";

/**
 * The page-wide switches every seasonal visual in this folder obeys.
 *
 * The visuals here are app-agnostic primitives: React and CSS only, every
 * colour, emoji, count and size given as a prop, nothing imported from the
 * site's own modules. The site's wrappers (`../*-layer.tsx`,
 * `../../seasonal-*.tsx`) read the season pack and pass it in.
 *
 * Two attributes on <html> drive them all:
 *
 * - `data-sv-paused` while the tab is hidden: every animation inside an
 *   `.sv` root holds its frame (`sv.css`), so a background tab burns nothing.
 * - `--sv-px` / `--sv-py`, the pointer's offset from the window's centre
 *   (-1 to 1), which layers multiply by their own depth for parallax. Only
 *   with a fine pointer and no reduced-motion request; on touch they stay 0.
 */

import "./sv.css";

/**
 * Holds every visual's animations while the tab is hidden, and feeds the
 * pointer parallax while it is enabled. Mount once, wherever the visuals are.
 *
 * @param parallax Whether layers may follow the pointer (motion allowed).
 */
export function useVisualsRuntime(parallax: boolean): void {
  React.useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      if (document.visibilityState === "hidden") root.setAttribute("data-sv-paused", "");
      else root.removeAttribute("data-sv-paused");
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      root.removeAttribute("data-sv-paused");
    };
  }, []);

  React.useEffect(() => {
    if (!parallax) return;
    const fine = window.matchMedia("(pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return;
    const root = document.documentElement;
    let frame = 0;
    let x = 0;
    let y = 0;
    // One write per frame at most, and only custom properties: the layers
    // read them in `transform`, which composites without layout.
    const write = () => {
      frame = 0;
      root.style.setProperty("--sv-px", x.toFixed(3));
      root.style.setProperty("--sv-py", y.toFixed(3));
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      x = (event.clientX / window.innerWidth) * 2 - 1;
      y = (event.clientY / window.innerHeight) * 2 - 1;
      frame ||= requestAnimationFrame(write);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      root.style.removeProperty("--sv-px");
      root.style.removeProperty("--sv-py");
    };
  }, [parallax]);
}

/**
 * A deterministic pseudo-random number for a particle, so each varies but
 * the same index always gets the same value: no reshuffle on re-render, and
 * the server and every reload agree.
 *
 * @param index The particle's index.
 * @param salt A different number for each property drawn from it.
 * @return A number in [0, 1).
 */
export function hash(index: number, salt: number): number {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * A `#rrggbb` colour at an opacity, as `rgba()`, for gradients and shadows.
 *
 * @param hex The colour.
 * @param alpha Its opacity, 0 to 1.
 * @return The colour as `rgba(r, g, b, a)`.
 */
export function rgba(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha)).toFixed(3)})`;
}

/** A colour, or any value, that differs by appearance. */
export interface ByScheme<T> {
  readonly light: T;
  readonly dark: T;
}

/** CSS custom properties, for `style`. */
export type Vars = React.CSSProperties & Record<`--${string}`, string | number>;
