/**
 * ============================================================================
 * How much of a video was watched
 * ============================================================================
 *
 * Both clients play videos through the same YouTube player (the website's,
 * which the app loads in a WebView), and both count what was watched here, so
 * a video watched on a phone and finished in a browser adds up the same way.
 *
 * What counts is the stretches actually played, merged: skipping ahead does
 * not add the part skipped, and watching a part twice counts it once. The
 * player reports its position every couple of seconds while it plays; two
 * reports in a row that moved forward by about the time that passed (up to
 * double speed) are a stretch watched. A jump is a seek, and adds nothing.
 *
 * Stored per learner and video in `video_progress` (migration 0013), through
 * `record_video_progress`. Signed-out learners record nothing.
 */

/** A stretch of a video that was played, as [from, to] whole seconds. */
export type WatchSegment = readonly [number, number];

/** Watched this share of a video or more, it counts as watched. Mirrored in 0013. */
export const VIDEO_WATCHED_SHARE = 0.9;

/** At most this many separate stretches are kept, as the database allows. */
export const MAX_SEGMENTS = 200;

/** The `video_progress` columns a client reads. */
export const VIDEO_PROGRESS_COLUMNS = 'video_key, video_id, duration_seconds, watched_seconds, completed_at';

/** The same, with the stretches, for a client resuming a video. */
export const VIDEO_PROGRESS_RESUME_COLUMNS = `${VIDEO_PROGRESS_COLUMNS}, segments`;

/** Where a lesson's video is recorded. */
export const lessonVideoKey = (lessonId: string): string => lessonId;

/** Where a module's overview video is recorded. */
export const moduleVideoKey = (moduleId: string): string => `module:${moduleId}`;

/**
 * Sorts and merges stretches that overlap or touch (a second apart or less),
 * and drops anything that is not a valid stretch. Whole seconds.
 */
export function mergeSegments(segments: readonly (readonly number[])[]): WatchSegment[] {
  const clean = segments
    .filter(
      (pair) =>
        Array.isArray(pair) &&
        pair.length === 2 &&
        Number.isFinite(pair[0]) &&
        Number.isFinite(pair[1]) &&
        pair[1] > pair[0] &&
        pair[0] >= 0,
    )
    .map((pair) => [Math.floor(pair[0] as number), Math.ceil(pair[1] as number)] as [number, number])
    .sort((a, b) => a[0] - b[0]);
  const out: [number, number][] = [];
  for (const [from, to] of clean) {
    const last = out[out.length - 1];
    if (last && from <= last[1] + 1) last[1] = Math.max(last[1], to);
    else out.push([from, to]);
  }
  // Too many separate stretches: join the closest neighbours until it fits.
  // Generous to the learner by a few seconds, never by more than the gaps.
  const gap = (i: number): number => out[i]![0] - out[i - 1]![1];
  while (out.length > MAX_SEGMENTS) {
    let best = 1;
    for (let i = 2; i < out.length; i++) if (gap(i) < gap(best)) best = i;
    out[best - 1]![1] = out[best]![1];
    out.splice(best, 1);
  }
  return out;
}

/** Seconds covered by merged stretches. */
export function watchedSeconds(segments: readonly WatchSegment[]): number {
  return segments.reduce((sum, [from, to]) => sum + (to - from), 0);
}

/** The share watched, 0..1, or null without a known length. */
export function watchedShare(watched: number, duration: number | null | undefined): number | null {
  if (!duration || duration <= 0) return null;
  return Math.max(0, Math.min(1, watched / duration));
}

/** The longest a single report may move forward per second that passed: double speed, and some slack. */
const MAX_RATE = 2.5;

/**
 * Follows one playing of a video. Feed it every report from the player;
 * `segments()` is everything known so far, merged with what it started from.
 */
export function createWatchTracker(initial: readonly WatchSegment[] = []) {
  let segments = mergeSegments(initial);
  let last: { time: number; playing: boolean; at: number } | null = null;
  let changed = false;
  return {
    /**
     * One report from the player.
     *
     * @param time The position, in seconds.
     * @param playing Whether it is playing.
     * @param at When the report came, in milliseconds (`Date.now()`).
     */
    observe(time: number, playing: boolean, at: number): void {
      if (!Number.isFinite(time) || time < 0) return;
      if (last && last.playing) {
        const advanced = time - last.time;
        const passed = Math.max(0, (at - last.at) / 1000);
        if (advanced > 0 && advanced <= passed * MAX_RATE + 1) {
          const next = mergeSegments([...segments, [last.time, time]]);
          if (watchedSeconds(next) !== watchedSeconds(segments)) changed = true;
          segments = next;
        }
      }
      last = { time, playing, at };
    },
    segments: (): WatchSegment[] => segments,
    /** Whether anything was added since the last `saved()`. */
    get changed(): boolean {
      return changed;
    },
    saved(): void {
      changed = false;
    },
    /** A save failed: try again with the next report. */
    unsaved(): void {
      changed = true;
    },
  };
}

export type WatchTracker = ReturnType<typeof createWatchTracker>;

/** The arguments for `record_video_progress`. */
export function videoProgressArgs(
  key: string,
  videoId: string,
  duration: number,
  segments: readonly WatchSegment[],
) {
  const merged = mergeSegments(segments.map(([from, to]) => [from, Math.min(to, Math.ceil(duration))]));
  return {
    p_video_key: key,
    p_video_id: videoId,
    p_duration: Math.max(1, Math.round(duration)),
    p_segments: merged,
    p_watched: Math.min(Math.round(duration), watchedSeconds(merged)),
  };
}

/**
 * ---------------------------------------------------------------------------
 * XP for watching
 * ---------------------------------------------------------------------------
 *
 * A video watched (90% or more played) earns XP once: `VIDEO_XP_PER_MINUTE`
 * for each minute of its listed running time (`video.minutes` in the
 * content), at most `VIDEO_XP_CAP`. The length comes from the content, never
 * from the player, so a doctored report cannot make a video worth more. For a
 * learner on the earnings scheme the server mints it like lesson XP
 * (`web/src/lib/rewards/earnings.ts`), and only for a recorded length close to
 * the listed one (`VIDEO_MIN_LENGTH_SHARE`).
 */
export const VIDEO_XP_PER_MINUTE = 3;
export const VIDEO_XP_CAP = 60;

/** A recorded length below this share of the listed running time earns nothing. */
export const VIDEO_MIN_LENGTH_SHARE = 0.75;

/** The XP a video of this listed length earns, once, when watched. */
export function videoXp(minutes: number | null | undefined): number {
  if (!minutes || minutes <= 0) return 0;
  return Math.min(VIDEO_XP_CAP, Math.round(minutes * VIDEO_XP_PER_MINUTE));
}

/** Every video in these modules, by key, with its listed running time in minutes. */
export function videoMinutesByKey(
  modules: readonly {
    id: string;
    video?: { minutes?: number } | null;
    lessons: readonly { id: string; video?: { minutes?: number } | null }[];
  }[],
): ReadonlyMap<string, number> {
  const out = new Map<string, number>();
  for (const module of modules) {
    if (module.video?.minutes) out.set(moduleVideoKey(module.id), module.video.minutes);
    for (const lesson of module.lessons) {
      if (lesson.video?.minutes) out.set(lessonVideoKey(lesson.id), lesson.video.minutes);
    }
  }
  return out;
}

/**
 * The XP a recorded row earns, as the server counts it: watched, a video the
 * course has, and a recorded length close to the listed one.
 */
export function videoXpForRow(
  row: { video_key: string; duration_seconds: number; completed_at?: string | null },
  minutesByKey: ReadonlyMap<string, number>,
): number {
  const minutes = minutesByKey.get(row.video_key);
  if (!row.completed_at || !minutes) return 0;
  if (row.duration_seconds < minutes * 60 * VIDEO_MIN_LENGTH_SHARE) return 0;
  return videoXp(minutes);
}

/** While a video plays, what was watched is saved at most this often; and at once on pause and on close. */
export const VIDEO_SAVE_EVERY_MS = 15_000;

/** Whether a client should save now. */
export function shouldSaveVideoProgress(
  tracker: Pick<WatchTracker, 'changed'>,
  playing: boolean,
  lastSavedAt: number,
  now: number,
): boolean {
  return tracker.changed && (!playing || now - lastSavedAt >= VIDEO_SAVE_EVERY_MS);
}

/** A `video_progress` row as the clients use it. */
export interface VideoProgress {
  key: string;
  watchedSeconds: number;
  durationSeconds: number;
  /** 0..1. */
  share: number;
  /** When 90% or more had first been watched, or null. */
  completedAt: string | null;
}

export function videoProgressFromRow(row: {
  video_key: string;
  duration_seconds: number;
  watched_seconds: number;
  completed_at?: string | null;
}): VideoProgress {
  return {
    key: row.video_key,
    watchedSeconds: row.watched_seconds,
    durationSeconds: row.duration_seconds,
    share: watchedShare(row.watched_seconds, row.duration_seconds) ?? 0,
    completedAt: row.completed_at ?? null,
  };
}

/** Whether a share counts as watched. */
export const videoWatched = (share: number | null | undefined): boolean =>
  typeof share === 'number' && share >= VIDEO_WATCHED_SHARE;
