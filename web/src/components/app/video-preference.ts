"use client";

/**
 * Whether videos are collapsed.
 *
 * One preference, shared by every video card and remembered in the browser.
 * Not per-card state: a toggle that reset on the next lesson would collapse
 * the thing in front of you and hand you the same problem on every lesson
 * after it. Someone who does not want a 16:9 player eating the viewport has
 * decided that once.
 *
 * Written as an external store rather than context for the same reason as the
 * locale: the cards are in different trees — the course map and the lesson
 * player — and this keeps them in step without a provider around both. The
 * server snapshot is always `false`, so the markup React renders on the server
 * matches the first client render and hydration stays quiet; the stored
 * preference is applied in an effect immediately afterwards.
 */

import * as React from "react";

const STORAGE_KEY = "openmacro.videoCollapsed.v1";

let collapsed = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => collapsed;
// Never read storage here. This runs on the server, where there is none, and
// returning anything else would make the first client paint disagree with it.
const getServerSnapshot = () => false;

export function setVideosCollapsed(next: boolean) {
  if (next === collapsed) return;
  collapsed = next;
  emit();
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {
    // Private mode, blocked storage. The preference still holds for this
    // session; it simply will not outlive it.
  }
}

/** `[collapsed, setCollapsed]`, shared by every card on the page. */
export function useVideosCollapsed(): [boolean, (next: boolean) => void] {
  const value = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  React.useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return;
    }
    if (stored === "1" && !collapsed) {
      collapsed = true;
      emit();
    }
  }, []);

  return [value, setVideosCollapsed];
}
