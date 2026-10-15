"use client";

/**
 * ============================================================================
 * Is the learner actively here?
 * ============================================================================
 *
 * "Active" means the tab is visible and either a lesson video is playing or
 * the learner touched, clicked, typed or scrolled within the last two minutes.
 * Watching is learning even with hands off the screen; an open tab in the
 * background, or a paused video on a phone left on the table, stops counting.
 *
 * One module-level tracker so the heartbeat and the earnings timer agree on
 * the same answer. Listeners are attached once, passively, on first use.
 */

const IDLE_AFTER_MS = 2 * 60 * 1000;

const EVENTS = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"] as const;

let lastInteraction = 0;
let attached = false;
let watching = 0;

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

/**
 * A video started or stopped playing. Counted rather than a flag, so two
 * players on one page cannot switch each other off.
 */
export function setWatching(playing: boolean): void {
  watching = Math.max(0, watching + (playing ? 1 : -1));
  // Stopping is an interaction too: the idle window starts from here, not
  // from whenever the learner last touched the screen before pressing play.
  touch();
}

export function isActiveNow(): boolean {
  if (typeof document === "undefined") return false;
  if (document.visibilityState !== "visible") return false;
  return watching > 0 || Date.now() - lastInteraction < IDLE_AFTER_MS;
}
