"use client";

/**
 * ============================================================================
 * Is the learner actively here?
 * ============================================================================
 *
 * "Active" means the tab is visible and the learner touched, clicked, typed or
 * scrolled within the last two minutes. An open tab in the background, or a
 * phone left on the table with the page up, stops counting after that window.
 *
 * One module-level tracker so the heartbeat and the earnings timer agree on
 * the same answer. Listeners are attached once, passively, on first use.
 */

const IDLE_AFTER_MS = 2 * 60 * 1000;

const EVENTS = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"] as const;

let lastInteraction = 0;
let attached = false;

function touch() {
  lastInteraction = Date.now();
}

/** Start listening. Safe to call any number of times. */
export function startActivityTracking(): void {
  if (attached || typeof window === "undefined") return;
  attached = true;
  // Arriving on a page is itself an interaction.
  touch();
  for (const name of EVENTS) {
    window.addEventListener(name, touch, { passive: true, capture: true });
  }
}

export function isActiveNow(): boolean {
  if (typeof document === "undefined") return false;
  if (document.visibilityState !== "visible") return false;
  return Date.now() - lastInteraction < IDLE_AFTER_MS;
}
