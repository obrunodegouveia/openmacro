/**
 * ============================================================================
 * Haptic + sound feedback
 * ============================================================================
 *
 * A single façade so components never import `expo-haptics` or `expo-audio`
 * directly. That keeps platform guards in one place and means a cue's sound and
 * vibration are chosen together, from one list, rather than drifting apart
 * across call sites.
 *
 * The clips in `assets/audio/` are generated, not sampled — see
 * `scripts/generate-sounds.mjs`. To change how something sounds, edit the
 * recipe there and re-run `npm run gen:sounds`.
 */

import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

/** Semantic events the app can emit. Add new cues here, not at call sites. */
export type FeedbackCue =
  | 'select'      // tapping an option / dragging a slider notch
  | 'correct'     // answer graded correct
  | 'incorrect'   // answer graded incorrect
  | 'advance'     // moving to the next challenge
  | 'complete'    // lesson finished
  | 'fail';       // ran out of hearts

/** Haptics are a no-op on web; guard once rather than at every call site. */
const HAPTICS_SUPPORTED = Platform.OS === 'ios' || Platform.OS === 'android';

let hapticsEnabled = true;
let soundEnabled = true;

export function setHapticsEnabled(enabled: boolean): void {
  hapticsEnabled = enabled;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

/**
 * Choose which clips the cues play.
 *
 * Switching packs tears down the existing players, because a player is bound
 * to the clip it was built with. They are rebuilt on the next cue, or right
 * now if `preloadSounds` has already run — so a switch never leaves the first
 * cue of the new pack paying a decode cost the old one had already paid.
 */
export function setSoundPack(next: SoundPack): void {
  if (next === pack) return;
  pack = next;
  const wasPreloaded = voices.size > 0;
  releaseSounds();
  if (wasPreloaded) preloadSounds();
}

async function vibrate(cue: FeedbackCue): Promise<void> {
  if (!hapticsEnabled || !HAPTICS_SUPPORTED) return;
  try {
    switch (cue) {
      case 'select':
        await Haptics.selectionAsync();
        break;
      case 'correct':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'incorrect':
      case 'fail':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'advance':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'complete':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
    }
  } catch {
    // Haptics are cosmetic — never let a missing motor break a lesson.
  }
}

/**
 * The clips, required statically so Metro bundles them.
 *
 * `require` rather than `import` is deliberate: Metro resolves these to asset
 * modules at bundle time, and the static form is what lets it do that. A
 * computed path here would ship an app with no sounds and no error.
 */
const PACKS = {
  /** Tuned tones in C. The default. */
  classic: {
    select: require('../../assets/audio/select.wav'),
    correct: require('../../assets/audio/correct.wav'),
    incorrect: require('../../assets/audio/incorrect.wav'),
    advance: require('../../assets/audio/advance.wav'),
    complete: require('../../assets/audio/complete.wav'),
    fail: require('../../assets/audio/fail.wav'),
  },
  /**
   * Bent pitches and cartoon drops — the same six cues with a game's
   * character. Synthesised from the same oscillator as `classic`, for the
   * reason set out at length in `scripts/generate-sounds.mjs`: the sounds it
   * evokes are all clips somebody owns, and this repository is MIT and
   * expects to be forked.
   */
  arcade: {
    select: require('../../assets/audio/arcade/select.wav'),
    correct: require('../../assets/audio/arcade/correct.wav'),
    incorrect: require('../../assets/audio/arcade/incorrect.wav'),
    advance: require('../../assets/audio/arcade/advance.wav'),
    complete: require('../../assets/audio/arcade/complete.wav'),
    fail: require('../../assets/audio/arcade/fail.wav'),
  },
} as const satisfies Record<string, Record<FeedbackCue, unknown>>;

/** Which set of clips the cues play. */
export type SoundPack = keyof typeof PACKS;

export const SOUND_PACKS = Object.keys(PACKS) as readonly SoundPack[];

/** Narrow an untrusted string — an env var — to a pack, falling back safely. */
export function toSoundPack(value: string | undefined): SoundPack {
  return (SOUND_PACKS as readonly string[]).includes(value ?? '')
    ? (value as SoundPack)
    : 'classic';
}

let pack: SoundPack = 'classic';

/**
 * There is deliberately no per-cue volume table here.
 *
 * Balance belongs in the files: `scripts/generate-sounds.mjs` normalises the
 * whole set against its loudest cue, so `select` sits at 15% of `complete` by
 * construction. Correcting levels at playback instead means the mix lives in
 * two places and the WAVs lie about how loud they are.
 */

/**
 * Players kept per cue. `select` fires on every slider notch and option tap,
 * often faster than its 100ms clip ends; three lets those overlap instead of
 * cutting each other off, and is cheap — each is a decoded clip in memory.
 */
const POOL_SIZE = 3;

interface PooledPlayer {
  player: AudioPlayer;
  /** At position 0 and not playing: `play()` can start it immediately. */
  ready: boolean;
  /** When it last started, to pick the oldest if every player is busy. */
  startedAt: number;
}

/** The players for each cue. Created once — see `preloadSounds`. */
const voices = new Map<FeedbackCue, PooledPlayer[]>();

/** True once the audio session has been configured. See `configureAudio`. */
let audioConfigured = false;

/**
 * Set the audio session before the first sound.
 *
 * Two choices worth stating. `playsInSilentMode: false` means the silent
 * switch silences us, which is what a person flicking that switch is asking
 * for. `interruptionMode: 'mixWithOthers'` means we duck nothing — someone
 * doing a lesson on a walk keeps their podcast.
 */
function configureAudio(): void {
  if (audioConfigured) return;
  audioConfigured = true;
  void setAudioModeAsync({
    playsInSilentMode: false,
    shouldPlayInBackground: false,
    interruptionMode: 'mixWithOthers',
  }).catch(() => {
    // An unavailable audio session is not a reason to fail a lesson.
  });
}

/**
 * The pool for a cue, created on first use if `preloadSounds` has not run.
 *
 * `keepAudioSessionActive` keeps the iOS audio session up between cues. Off
 * by default, the session was torn down after every clip and brought back up
 * for the next one: a delay on each sound, and an interruption of whatever
 * else was playing — the lesson video included — every time. That, more than
 * anything, is why sound came and went. `downloadFirst` means a clip is fully
 * loaded before it is first asked to play.
 */
function poolFor(cue: FeedbackCue): PooledPlayer[] {
  const existing = voices.get(cue);
  if (existing) return existing;
  const pool: PooledPlayer[] = Array.from({ length: POOL_SIZE }, () => {
    const entry: PooledPlayer = {
      player: createAudioPlayer(PACKS[pack][cue], {
        keepAudioSessionActive: true,
        downloadFirst: true,
      }),
      ready: true,
      startedAt: 0,
    };
    // Rewind as soon as a clip ends, off the hot path, so the next fire finds
    // it at the start and can play with no seek in between.
    entry.player.addListener('playbackStatusUpdate', (status) => {
      if (!status.didJustFinish) return;
      void entry.player
        .seekTo(0)
        .then(() => {
          entry.ready = true;
        })
        .catch(() => {});
    });
    return entry;
  });
  voices.set(cue, pool);
  return pool;
}

/**
 * Create every player up front, so no cue pays a load cost the first time it
 * fires.
 *
 * This is why sounds felt late rather than wrong: a lazily-created player has
 * to decode its clip before the first `play()`, so the first correct answer of
 * a session arrived after the animation it was meant to accompany, and only
 * the first. Building them at boot costs a few milliseconds once and makes
 * every cue land on time.
 *
 * Safe to call more than once, and safe to call with sound disabled — the
 * learner can switch it on mid-session and it should be instant then too.
 */
export function preloadSounds(): void {
  try {
    configureAudio();
    for (const cue of Object.keys(PACKS[pack]) as FeedbackCue[]) poolFor(cue);
  } catch {
    // A device that cannot prepare audio simply plays none.
  }
}

/**
 * ---------------------------------------------------------------------------
 * Start timing
 * ---------------------------------------------------------------------------
 *
 * How long a cue takes from being fired to `play()` being called. On the
 * normal path, a ready player from the pool, that is the cost of one array
 * scan; it only grows when every player of a cue is busy and the oldest has
 * to be rewound first. Measure it on a real device: a median near zero and a
 * p95 well under a 60fps frame says the pool is big enough.
 *
 * Self-limiting on purpose. It takes a bounded sample, prints one line, and
 * switches itself off — so a build that ships with it enabled costs a boolean
 * check per cue and one log per session, rather than becoming something that
 * has to be remembered and removed.
 */
const TIMING_SAMPLE_SIZE = 120;

let timingEnabled = false;
let timings: number[] = [];

export interface AudioTimingReport {
  samples: number;
  /** Milliseconds from a cue firing to its clip starting. */
  min: number;
  median: number;
  p95: number;
  max: number;
}

export function setAudioTimingEnabled(enabled: boolean): void {
  timingEnabled = enabled;
  if (!enabled) timings = [];
}

/** The measurement so far, or `null` before anything has been recorded. */
export function audioTimingReport(): AudioTimingReport | null {
  if (timings.length === 0) return null;
  const sorted = [...timings].sort((a, b) => a - b);
  const at = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))] ?? 0;
  return {
    samples: sorted.length,
    min: sorted[0] ?? 0,
    median: at(0.5),
    p95: at(0.95),
    max: sorted[sorted.length - 1] ?? 0,
  };
}

/** Monotonic where available; `Date.now` is accurate enough as a fallback. */
function now(): number {
  return typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? performance.now()
    : Date.now();
}

function recordSeek(startedAt: number): void {
  timings.push(now() - startedAt);
  if (timings.length < TIMING_SAMPLE_SIZE) return;

  const report = audioTimingReport();
  timingEnabled = false;
  if (!report) return;
  const ms = (value: number) => value.toFixed(2);
  console.log(
    `[OpenMacro] audio start over ${report.samples} cues — ` +
      `min ${ms(report.min)}ms, median ${ms(report.median)}ms, ` +
      `p95 ${ms(report.p95)}ms, max ${ms(report.max)}ms ` +
      `(one 60fps frame is 16.67ms)`,
  );
}

/**
 * Play a cue, now.
 *
 * The previous version paused one player per cue, awaited `seekTo(0)` and only
 * then called `play()`. Correct, but every sound waited on a native seek
 * before starting, so it landed after the tap it belonged to; and when cues
 * arrived faster than seeks resolved, a generation counter dropped all but
 * the last, so a quick select-then-check could lose a sound outright. Both
 * were heard as audio that was late and came and went.
 *
 * Now each cue has a small pool of players already sitting at position 0. A
 * fire takes a ready one and calls `play()` synchronously — no seek on the hot
 * path — and the player rewinds itself after it finishes. Rapid fires overlap
 * across the pool instead of cutting each other off. Only if every player is
 * still sounding does it fall back to restarting the oldest, which is the old
 * seek-then-play path and rare by construction.
 */
function playCue(cue: FeedbackCue): void {
  if (!soundEnabled) return;

  try {
    configureAudio();
    const pool = poolFor(cue);
    const startedAt = now();
    const free = pool.find((entry) => entry.ready && entry.player.isLoaded);

    if (free) {
      free.ready = false;
      free.startedAt = startedAt;
      free.player.play();
      if (timingEnabled) recordSeek(startedAt);
      return;
    }

    // Every player is busy: restart the one that started longest ago.
    const oldest = pool.reduce((a, b) => (a.startedAt <= b.startedAt ? a : b));
    oldest.ready = false;
    oldest.startedAt = startedAt;
    oldest.player.pause();
    void oldest.player
      .seekTo(0)
      .then(() => {
        if (timingEnabled) recordSeek(startedAt);
        if (!soundEnabled) return;
        oldest.player.play();
      })
      .catch(() => {});
  } catch {
    // Sound is cosmetic — a device that will not play it still teaches.
  }
}

/**
 * Release every player. Call when audio is switched off for good; the app
 * itself never needs this, since the players live as long as the process.
 */
export function releaseSounds(): void {
  for (const pool of voices.values()) {
    for (const entry of pool) {
      try {
        entry.player.remove();
      } catch {
        // Already gone.
      }
    }
  }
  voices.clear();
}

/** Fire-and-forget: emits the haptic and the sound for a cue. */
export function emitFeedback(cue: FeedbackCue): void {
  void vibrate(cue);
  playCue(cue);
}
