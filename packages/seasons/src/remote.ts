import type { DatePoint, RemoteSeasonConfig } from './types.ts';

/** The config that changes nothing, served when no other is set. */
export const EMPTY_REMOTE_CONFIG: RemoteSeasonConfig = { version: 1 };

/**
 * Whether a value is a date point `decide` can read. Deliberately as strict
 * as the engine, so a config that validates here behaves as written there.
 *
 * @param value The candidate.
 * @return True for a well-formed date point.
 */
export function isDatePoint(value: unknown): value is DatePoint {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const p = value as Record<string, unknown>;
  const whole = (n: unknown, min: number, max: number) => typeof n === 'number' && Number.isInteger(n) && n >= min && n <= max;
  if (p.offset !== undefined && !whole(p.offset, -366, 366)) return false;
  if (p.easter !== undefined) return whole(p.easter, -366, 366);
  if (!whole(p.month, 1, 12)) return false;
  if (p.day !== undefined) return whole(p.day, 1, 31);
  return whole(p.weekday, 0, 6) && whole(p.nth, -5, 5) && p.nth !== 0;
}

/**
 * Validates a remote config, field by field.
 *
 * Strict on purpose. The config can switch seasons on and off for every
 * viewer at once, so a typo should be rejected whole, with a reason a person
 * can act on, rather than half-applied. Ids the caller does not know are an
 * error too: a misspelt `"disabled": ["halloweeen"]` would otherwise do
 * nothing, silently, on the one day it matters.
 *
 * @param value The parsed JSON.
 * @param ids Every season id the caller knows.
 * @return The config, or the list of what is wrong with it.
 */
export function parseRemoteConfig(
  value: unknown,
  ids: readonly string[],
): { ok: true; config: RemoteSeasonConfig } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ok: false, errors: ['the config must be a JSON object'] };
  }
  const raw = value as Record<string, unknown>;
  const known = (id: unknown) => typeof id === 'string' && ids.includes(id);

  if (raw.version !== 1) errors.push('"version" must be 1');
  for (const key of Object.keys(raw)) {
    if (!['version', 'enabled', 'disabled', 'calm', 'force', 'windows', 'expires'].includes(key)) {
      errors.push(`unknown field "${key}"`);
    }
  }
  if (raw.enabled !== undefined && typeof raw.enabled !== 'boolean') errors.push('"enabled" must be true or false');
  if (raw.calm !== undefined && typeof raw.calm !== 'boolean') errors.push('"calm" must be true or false');
  if (raw.disabled !== undefined) {
    if (!Array.isArray(raw.disabled)) errors.push('"disabled" must be a list of season ids');
    else for (const id of raw.disabled) if (!known(id)) errors.push(`"disabled" names an unknown season: ${JSON.stringify(id)}`);
  }
  if (raw.force !== undefined && raw.force !== null && !known(raw.force)) {
    errors.push(`"force" names an unknown season: ${JSON.stringify(raw.force)}`);
  }
  if (raw.windows !== undefined) {
    if (!raw.windows || typeof raw.windows !== 'object' || Array.isArray(raw.windows)) {
      errors.push('"windows" must map season ids to { from, to }');
    } else {
      for (const [id, window] of Object.entries(raw.windows)) {
        if (!known(id)) errors.push(`"windows" names an unknown season: ${JSON.stringify(id)}`);
        const w = window as Record<string, unknown> | null;
        if (!w || typeof w !== 'object' || !isDatePoint(w.from) || !isDatePoint(w.to)) {
          errors.push(`"windows.${id}" must be { from, to } with two valid date points`);
        }
      }
    }
  }
  if (raw.expires !== undefined && (typeof raw.expires !== 'string' || Number.isNaN(Date.parse(raw.expires)))) {
    errors.push('"expires" must be an ISO 8601 date');
  }

  return errors.length ? { ok: false, errors } : { ok: true, config: raw as unknown as RemoteSeasonConfig };
}

/** How to reach the remote config. */
export interface RemoteSource {
  /** Where the JSON is served. */
  readonly url: string;
  /** Gives up after this long. A season is never worth a slow start. Default 4 s. */
  readonly timeoutMs?: number;
  /** Refetches only once the cached copy is older than this. Default 15 min. */
  readonly maxAgeMs?: number;
  /** The fetch to use; the global one by default. Tests pass a stub. */
  readonly fetch?: typeof fetch;
}

/**
 * Fetches and validates the remote config.
 *
 * Never throws. A network error, a timeout, a non-2xx status or an invalid
 * body all come back as `null`, and the caller keeps whatever it had: being
 * offline must never change what a viewer sees.
 *
 * @param source Where and how to fetch.
 * @param ids Every season id the caller knows, for validation.
 * @return The config, or `null` when there is no usable answer.
 */
export async function fetchRemoteConfig(source: RemoteSource, ids: readonly string[]): Promise<RemoteSeasonConfig | null> {
  const doFetch = source.fetch ?? globalThis.fetch;
  if (typeof doFetch !== 'function') return null;
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = setTimeout(() => controller?.abort(), source.timeoutMs ?? 4000);
  try {
    const response = await doFetch(source.url, {
      signal: controller?.signal,
      headers: { accept: 'application/json' },
    });
    if (!response.ok) return null;
    const parsed = parseRemoteConfig(await response.json(), ids);
    return parsed.ok ? parsed.config : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
