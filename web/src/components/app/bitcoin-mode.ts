"use client";

/**
 * Bitcoin mode, remembered in this browser.
 *
 * With it on, the Bitcoin modules (`BITCOIN_MODE_MODULES` in
 * `@openmacro/core/content/optional`) join the end of the course. The app
 * keeps the same choice in src/services/bitcoinMode.ts.
 *
 * Same shape as `kids-mode.ts`: an external store whose server snapshot is
 * always off, so the prerendered page hydrates quietly and the stored choice
 * lands in an effect straight after.
 */

import * as React from "react";

const STORAGE_KEY = "openmacro.bitcoinMode.v1";

let bitcoin = false;
let hydrated = false;
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

const getSnapshot = () => bitcoin;
// Never read storage here: this runs on the server too.
const getServerSnapshot = () => false;

export function setBitcoinMode(next: boolean) {
  hydrated = true;
  if (next === bitcoin) return;
  bitcoin = next;
  emit();
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {
    // Private mode, blocked storage: it holds for this visit only.
  }
}

/**
 * `[on, setOn, ready]`, shared by every component on the page. `ready` turns
 * true once the stored choice has been read, so a page can wait for it before
 * saying a Bitcoin lesson is not available.
 */
export function useBitcoinMode(): [boolean, (next: boolean) => void, boolean] {
  const value = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = React.useSyncExternalStore(
    subscribe,
    () => hydrated,
    () => false,
  );

  React.useEffect(() => {
    if (hydrated) return;
    hydrated = true;
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      emit();
      return;
    }
    if (stored === "1" && !bitcoin) bitcoin = true;
    emit();
  }, []);

  return [value, setBitcoinMode, ready];
}
