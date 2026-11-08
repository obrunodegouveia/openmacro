/**
 * ============================================================================
 * Bitcoin mode
 * ============================================================================
 *
 * One switch on this device: when it is on, the Bitcoin modules
 * (`BITCOIN_MODE_MODULES` in `@openmacro/core/content/optional`) join the end
 * of the course, on the path, in the course map and at their lesson screens.
 * Off, they do not exist for this learner.
 *
 * Per device, not per account, like kids mode: it is a choice about what
 * this phone shows. The website keeps the same choice in
 * web/src/components/app/bitcoin-mode.ts.
 *
 * Same shape as `kidsMode.ts`: a module-level store hydrated at import, so
 * every screen agrees without a provider of its own.
 */

import { useSyncExternalStore } from 'react';

import { readVersioned, writeVersioned } from '@/services/localStore';

const STORAGE_KEY = 'openmacro.bitcoinMode.v1';
const STORAGE_VERSION = 1;

interface StoredChoice {
  bitcoin: boolean;
}

function isStoredChoice(value: unknown): value is StoredChoice {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as StoredChoice).bitcoin === 'boolean'
  );
}

let bitcoin = false;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

async function hydrate(): Promise<void> {
  const stored = await readVersioned(STORAGE_KEY, STORAGE_VERSION, isStoredChoice);
  if (stored && stored.bitcoin !== bitcoin) {
    bitcoin = stored.bitcoin;
    emit();
  }
}

void hydrate();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): boolean {
  return bitcoin;
}

/** Turn Bitcoin mode on or off. Persisted; failure to persist is survivable. */
export function setBitcoinMode(next: boolean): void {
  if (next === bitcoin) return;
  bitcoin = next;
  emit();
  writeVersioned(STORAGE_KEY, STORAGE_VERSION, { bitcoin: next }).catch(() => {});
}

/** `[on, setOn]`, shared by every screen. */
export function useBitcoinMode(): [boolean, (next: boolean) => void] {
  const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return [value, setBitcoinMode];
}
