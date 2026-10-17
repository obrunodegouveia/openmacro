import { decide } from './engine.ts';
import { fetchRemoteConfig, parseRemoteConfig, type RemoteSource } from './remote.ts';
import type { RemoteSeasonConfig, SeasonDecision, SeasonPreference, SeasonWindow } from './types.ts';

/**
 * Synchronous key-value storage: `localStorage` on the web, a small file on
 * a phone. Synchronous because the boot decision has to be made before the
 * first frame, with no time to wait for a promise.
 *
 * Either method may throw (private browsing, a full disk); the controller
 * catches it and carries on in memory.
 */
export interface SeasonStorage {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

/** Everything a controller needs. */
export interface SeasonControllerOptions<Id extends string> {
  /** The calendar. */
  readonly calendar: readonly SeasonWindow<Id>[];
  /** Where the preference and the cached remote config live. None: memory only. */
  readonly storage?: SeasonStorage | null;
  /** A QA override, as for `decide`. */
  readonly override?: string | null;
  /** The remote config. None: no remote control. */
  readonly remote?: RemoteSource | null;
  /** The clock; tests pass a fixed one. */
  readonly now?: () => number;
  /** Prefixes every storage key, so two products on one origin cannot collide. */
  readonly keyPrefix?: string;
}

/** A live view of the season, for one app. */
export interface SeasonController<Id extends string> {
  /**
   * The decision made when the controller was created, which never changes.
   * For whatever can only be decided once per launch: the app bakes its
   * palette into its stylesheets when they load, so it paints from this.
   */
  readonly boot: SeasonDecision<Id>;
  /** The decision now. The same object until something changes, so React can compare it. */
  getSnapshot(): SeasonDecision<Id>;
  /** Calls back whenever `getSnapshot` changes. Returns the unsubscribe. */
  subscribe(listener: () => void): () => void;
  /** The viewer's choice; `auto` until they make one. */
  getPreference(): SeasonPreference;
  /** Saves the viewer's choice and applies it at once. */
  setPreference(preference: SeasonPreference): void;
  /**
   * Fetches the remote config, if the cached one is stale or `force` is set,
   * and applies it. Never rejects.
   */
  refresh(options?: { force?: boolean }): Promise<void>;
  /** Decides again, now: after the app returns to the foreground, say. */
  update(): void;
  /**
   * Keeps the decision current by itself: decides again at local midnight
   * (and when a remote config expires), and refreshes the remote config.
   * Returns a function that stops it.
   */
  start(): () => void;
}

/** What is kept of a fetched config. */
interface CachedRemote {
  readonly config: RemoteSeasonConfig;
  readonly fetchedAt: number;
}

const PREFERENCES: readonly SeasonPreference[] = ['auto', 'calm', 'off'];

/** The longest a timer may be set for; browsers overflow a 32-bit delay. */
const MAX_DELAY = 2 ** 31 - 1;

/**
 * Creates the season controller for one app.
 *
 * It owns the three inputs that change at runtime (the viewer's preference,
 * the remote config and the date) and turns them into one decision through
 * `decide`. Everything else is framework-free, so the same controller drives
 * React Native, React DOM, or anything with a subscribe function.
 *
 * @param options The calendar, storage and remote source.
 * @return The controller.
 */
export function createSeasonController<Id extends string>(options: SeasonControllerOptions<Id>): SeasonController<Id> {
  const now = options.now ?? Date.now;
  const prefix = options.keyPrefix ?? 'seasons';
  const preferenceKey = `${prefix}.preference`;
  const remoteKey = `${prefix}.remote`;
  const ids = options.calendar.map((window) => window.id);
  const listeners = new Set<() => void>();

  const read = (key: string): string | null => {
    try {
      return options.storage?.get(key) ?? null;
    } catch {
      return null;
    }
  };
  const write = (key: string, value: string): void => {
    try {
      options.storage?.set(key, value);
    } catch {
      // Storage unavailable: the choice holds for this session only.
    }
  };

  let preference: SeasonPreference = PREFERENCES.find((p) => p === read(preferenceKey)) ?? 'auto';
  let cached: CachedRemote | null = readCachedRemote(read(remoteKey), ids);
  let inFlight: Promise<void> | null = null;

  const compute = (): SeasonDecision<Id> =>
    decide({
      now: now(),
      calendar: options.calendar,
      override: options.override,
      preference,
      remote: cached?.config ?? null,
    });

  const boot = compute();
  let snapshot = boot;

  const update = (): void => {
    const next = compute();
    if (
      next.season === snapshot.season &&
      next.look === snapshot.look &&
      next.available === snapshot.available &&
      next.reason === snapshot.reason
    ) {
      return;
    }
    snapshot = next;
    listeners.forEach((listener) => listener());
  };

  const refresh = async ({ force = false }: { force?: boolean } = {}): Promise<void> => {
    const source = options.remote;
    if (!source) return;
    const fresh = cached && now() - cached.fetchedAt < (source.maxAgeMs ?? 15 * 60_000);
    if (fresh && !force) return;
    // One request at a time, however many screens ask.
    inFlight ??= (async () => {
      const config = await fetchRemoteConfig(source, ids);
      if (config) {
        cached = { config, fetchedAt: now() };
        write(remoteKey, JSON.stringify(cached));
        update();
      }
    })().finally(() => {
      inFlight = null;
    });
    return inFlight;
  };

  return {
    boot,
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getPreference: () => preference,
    setPreference(next) {
      if (!PREFERENCES.includes(next) || next === preference) return;
      preference = next;
      write(preferenceKey, next);
      update();
    },
    refresh,
    update,
    start() {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const schedule = () => {
        const at = new Date(now());
        // One second past local midnight, so the new day has certainly begun.
        const midnight = new Date(at.getFullYear(), at.getMonth(), at.getDate() + 1, 0, 0, 1).getTime();
        const expires = cached?.config.expires ? Date.parse(cached.config.expires) : NaN;
        const next = expires > now() && expires < midnight ? expires + 1000 : midnight;
        timer = setTimeout(() => {
          update();
          void refresh();
          schedule();
        }, Math.min(Math.max(next - now(), 1000), MAX_DELAY));
      };
      schedule();
      void refresh();
      return () => clearTimeout(timer);
    },
  };
}

/**
 * Reads the cached remote config back, validating it again: storage is as
 * untrusted as the network, and a config cached by an older release may name
 * a season this one has dropped.
 *
 * @param raw The stored JSON.
 * @param ids Every known season id.
 * @return The cache, or `null`.
 */
function readCachedRemote(raw: string | null, ids: readonly string[]): CachedRemote | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as { config?: unknown; fetchedAt?: unknown };
    const parsed = parseRemoteConfig(value.config, ids);
    if (!parsed.ok || typeof value.fetchedAt !== 'number') return null;
    return { config: parsed.config, fetchedAt: value.fetchedAt };
  } catch {
    return null;
  }
}
