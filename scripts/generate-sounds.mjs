#!/usr/bin/env node
/**
 * ============================================================================
 * Feedback sound generator — `npm run gen:sounds`
 * ============================================================================
 *
 * Synthesises the six feedback cues in `src/feedback` as 16-bit mono WAV files
 * under `assets/audio/`. The generated files are committed; this script exists
 * so they can be *changed* — tweak a note here and regenerate, rather than
 * hunting for a replacement clip that sounds almost right.
 *
 * Synthesised rather than sampled because OpenMacro is MIT and people are
 * invited to fork it: a sound pack with an attribution clause, or unclear
 * provenance, is a liability. These are original work under the same licence
 * as the rest of the repository.
 *
 * ---------------------------------------------------------------------------
 * WHY THESE SOUND LIKE A SET
 * ---------------------------------------------------------------------------
 *
 * Four rules, and breaking any one of them is what makes app audio feel random
 * even when each individual sound is fine:
 *
 * 1. ONE KEY. Everything is built from C. Success is C major, failure is C
 *    minor — the same tonic, so they are relatives rather than strangers. The
 *    first version of this file had four unrelated keys (E, E flat, C, D
 *    minor), which is exactly what "a bit random" sounds like.
 *
 * 2. ONE PULSE. Every note starts on a 1/16 grid at 150 BPM (100 ms). Notes
 *    landing on a shared grid read as deliberate; arbitrary offsets read as
 *    sloppy, even at this length where nobody could name the tempo.
 *
 * 3. ONE VOICE. A single `voice()` for all six cues, varying only in
 *    brightness and decay. Three different synthesis functions meant three
 *    different instruments playing in three different rooms.
 *
 *    `glide()` below is the one sanctioned extension: the same harmonic stack
 *    and the same envelope, with the fundamental moving. That is one
 *    instrument bending a note, not a second instrument — which is why the
 *    arcade pack still sounds like it came from the same box as the classic
 *    one.
 *
 * 4. ONE GAIN STAGE. The whole set is normalised together, against the loudest
 *    cue, so the relative dynamics written below survive into the files. The
 *    previous version normalised each file to its own peak, which flattened a
 *    quiet tap and a lesson fanfare to the same level and then tried to undo
 *    it with volume multipliers in the app.
 *
 * Requires Node 22.18+, like the rest of the tooling here.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'assets', 'audio');

const SAMPLE_RATE = 44100;

/** 150 BPM. `S` is a sixteenth — the grid every note onset is a multiple of. */
const S = 60 / 150 / 4; // 0.1 s

/**
 * Equal temperament around a tonic of C. Only the degrees these cues use.
 * Major degrees carry the "yes" cues, minor ones the "no" cues.
 */
const N = {
  C4: 261.63, Eb4: 311.13, G4: 392.0,
  C5: 523.25, Eb5: 622.25, E5: 659.25, G5: 783.99,
  C6: 1046.5, E6: 1318.51,
};

/**
 * The one voice: a struck tone with a fixed harmonic series, shaped by
 * `brightness` (how much of the upper partials survive) and `decay` (how fast
 * the tail goes). Everything else is held constant so the six cues share a
 * character.
 *
 * @param {Float64Array} buf destination, mixed into
 * @param {number} at onset in seconds — always a multiple of `S`
 * @param {number} freq fundamental in Hz
 * @param {number} dur tail length in seconds
 * @param {number} gain relative level, 0..1, preserved across the whole set
 * @param {number} decay larger = shorter
 * @param {number} brightness 0 = fundamental only, 1 = full harmonic stack
 */
function voice(buf, at, freq, dur, gain, decay, brightness) {
  const start = Math.floor(at * SAMPLE_RATE);
  const len = Math.floor(dur * SAMPLE_RATE);
  const attack = Math.floor(0.004 * SAMPLE_RATE); // 4 ms: no click, still crisp

  // Partial amplitudes at full brightness. Scaled by `brightness` so a dark
  // cue is the same instrument played softly, not a different one.
  const partials = [
    [1, 1.0],
    [2, 0.34 * brightness],
    [3, 0.16 * brightness],
    [4, 0.07 * brightness],
  ];
  const norm = partials.reduce((sum, [, a]) => sum + a, 0);

  for (let i = 0; i < len; i++) {
    const n = start + i;
    if (n >= buf.length) break;
    const t = i / SAMPLE_RATE;
    const env = (i < attack ? i / attack : 1) * Math.exp(-decay * t);
    let w = 0;
    for (const [mult, amp] of partials) w += amp * Math.sin(2 * Math.PI * freq * mult * t);
    buf[n] += (w / norm) * env * gain;
  }
}

/**
 * The same voice with a moving fundamental.
 *
 * Everything a slide whistle, a falling boom or a rising power-up has in
 * common is a pitch that travels; the timbre is beside the point. So this is
 * `voice` with `freq` swept from `from` to `to` rather than held, and the
 * phase accumulated sample by sample — computing `sin(2π f t)` against a
 * changing `f` would jump the phase on every sample and buzz instead of bend.
 *
 * `curve` shapes the sweep: 1 is linear, above 1 lingers at the start and
 * falls away late, which is what makes a drop sound like it is accelerating.
 *
 * @param {Float64Array} buf destination, mixed into
 * @param {number} at onset in seconds — always a multiple of `S`
 * @param {number} from starting fundamental in Hz
 * @param {number} to ending fundamental in Hz
 * @param {number} dur length in seconds
 * @param {number} gain relative level, 0..1
 * @param {number} decay larger = shorter tail
 * @param {number} brightness 0 = fundamental only, 1 = full harmonic stack
 * @param {number} [curve] sweep shape, 1 = linear
 */
function glide(buf, at, from, to, dur, gain, decay, brightness, curve = 1) {
  const start = Math.floor(at * SAMPLE_RATE);
  const len = Math.floor(dur * SAMPLE_RATE);
  const attack = Math.floor(0.004 * SAMPLE_RATE);

  const partials = [
    [1, 1.0],
    [2, 0.34 * brightness],
    [3, 0.16 * brightness],
    [4, 0.07 * brightness],
  ];
  const norm = partials.reduce((sum, [, a]) => sum + a, 0);

  // One accumulated phase per partial, so a bend stays a bend.
  const phase = partials.map(() => 0);

  for (let i = 0; i < len; i++) {
    const n = start + i;
    if (n >= buf.length) break;
    const t = i / SAMPLE_RATE;
    const progress = Math.pow(i / len, curve);
    const freq = from + (to - from) * progress;
    const env = (i < attack ? i / attack : 1) * Math.exp(-decay * t);

    let w = 0;
    for (let k = 0; k < partials.length; k++) {
      const [mult, amp] = partials[k];
      phase[k] += (2 * Math.PI * freq * mult) / SAMPLE_RATE;
      w += amp * Math.sin(phase[k]);
    }
    buf[n] += (w / norm) * env * gain;
  }
}

const silence = (sec) => new Float64Array(Math.ceil(sec * SAMPLE_RATE));

/**
 * The six cues of the default pack.
 *
 * `gain` values are relative and meaningful: `select` fires on every tap and
 * must sit under the interface, `complete` happens once a lesson and is
 * allowed to be the loudest thing in the app. These proportions survive into
 * the files because the set is normalised together.
 */
const CLASSIC = {
  /** Tapping an option. One note on the dominant — unresolved, so it asks for
   *  nothing and can repeat endlessly without fatiguing. */
  select() {
    const buf = silence(0.1);
    voice(buf, 0, N.G5, 0.09, 0.2, 30, 0.35);
    return buf;
  },

  /** Moving to the next challenge. The tonic an octave up: settled, forward. */
  advance() {
    const buf = silence(0.16);
    voice(buf, 0, N.C6, 0.14, 0.26, 22, 0.5);
    return buf;
  },

  /** Graded correct. A rising fourth onto the tonic — the sound of resolving. */
  correct() {
    const buf = silence(0.5);
    voice(buf, 0 * S, N.G5, 0.2, 0.62, 12, 0.8);
    voice(buf, 1 * S, N.C6, 0.38, 0.78, 7, 0.9);
    return buf;
  },

  /** Graded incorrect. A falling minor third, borrowed from C minor: related
   *  to the success cues, clearly not one of them. Dark and brief. */
  incorrect() {
    const buf = silence(0.46);
    voice(buf, 0 * S, N.Eb5, 0.18, 0.5, 13, 0.35);
    voice(buf, 1 * S, N.C5, 0.32, 0.55, 9, 0.28);
    return buf;
  },

  /** Lesson finished. The C major arpeggio, on the grid, with the final tonic
   *  held and doubled a third above for shimmer. The loudest cue in the app. */
  complete() {
    const buf = silence(1.2);
    voice(buf, 0 * S, N.C5, 0.26, 0.62, 11, 0.75);
    voice(buf, 1 * S, N.E5, 0.26, 0.68, 11, 0.8);
    voice(buf, 2 * S, N.G5, 0.3, 0.74, 10, 0.85);
    voice(buf, 3 * S, N.C6, 0.8, 1.0, 4, 0.95);
    voice(buf, 3 * S, N.E6, 0.8, 0.3, 4, 0.7);
    return buf;
  },

  /** Out of hearts. The C minor triad falling, on a slower 1/8 grid so it
   *  lands heavier than anything else without being louder. */
  fail() {
    const buf = silence(1.0);
    voice(buf, 0 * S, N.G4, 0.3, 0.6, 8, 0.4);
    voice(buf, 2 * S, N.Eb4, 0.3, 0.62, 8, 0.35);
    voice(buf, 4 * S, N.C4, 0.6, 0.66, 4.5, 0.3);
    return buf;
  },
};

/**
 * The arcade pack.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS, AND WHY IT IS SYNTHESISED
 * ---------------------------------------------------------------------------
 *
 * The obvious way to make an app for teenagers sound fun is to reach for the
 * audio they already know — the boom, the sad trombone, the record scratch.
 * Every one of those is a clip of somebody's copyrighted recording, and a meme
 * going round the world grants no licence to anyone. OpenMacro is MIT and
 * invites forks, which means shipping a clip we do not own would hand every
 * fork a liability along with the code, on top of putting the store listings
 * at risk.
 *
 * But copyright covers a recording, not an idea. "A pitch that drops fast and
 * hits hard" is a genre, not property. So these are built from the same
 * oscillator as the classic pack: recognisably the same *kind* of sound,
 * owing nothing to anyone, MIT like the rest of the repository.
 *
 * Called `arcade` rather than `meme` deliberately. It describes the character
 * — bent pitches, big drops, cartoon physics — instead of tying the pack to
 * whatever was funny the year it was written, and it is the honest label for
 * what these actually are.
 *
 * The pack is a drop-in replacement: same six cue names, same relative
 * dynamics, normalised to the same ceiling, so switching between them changes
 * the character and not the volume.
 */
const ARCADE = {
  /** Tapping an option. A tiny upward blip — a coin, not a note. */
  select() {
    const buf = silence(0.1);
    glide(buf, 0, N.G5, N.C6, 0.07, 0.2, 34, 0.45);
    return buf;
  },

  /** Moving on. A short rising sweep: the sound of a thing being collected. */
  advance() {
    const buf = silence(0.18);
    glide(buf, 0, N.C5, N.C6, 0.14, 0.28, 20, 0.55);
    return buf;
  },

  /** Graded correct. Two rising blips into the octave — a pickup, arcade
   *  shorthand for "that counted" since the early eighties. */
  correct() {
    const buf = silence(0.5);
    glide(buf, 0 * S, N.C5, N.G5, 0.1, 0.6, 18, 0.75);
    glide(buf, 1 * S, N.G5, N.C6, 0.34, 0.8, 8, 0.9);
    return buf;
  },

  /** Graded incorrect. A short descending bend — the cartoon "nope". Stays
   *  brief and unspiteful: this fires often and must not punish. */
  incorrect() {
    const buf = silence(0.46);
    glide(buf, 0 * S, N.Eb5, N.C4, 0.3, 0.55, 9, 0.3, 1.7);
    return buf;
  },

  /** Lesson finished. A rising run that overshoots and lands on the tonic,
   *  with the octave above ringing on. The loudest cue in the app. */
  complete() {
    const buf = silence(1.2);
    glide(buf, 0 * S, N.C4, N.C5, 0.12, 0.6, 16, 0.7);
    glide(buf, 1 * S, N.C5, N.G5, 0.12, 0.7, 16, 0.8);
    glide(buf, 2 * S, N.G5, N.E6, 0.16, 0.8, 12, 0.9);
    voice(buf, 3 * S, N.C6, 0.8, 1.0, 4, 0.95);
    voice(buf, 3 * S, N.G5, 0.8, 0.34, 4, 0.7);
    return buf;
  },

  /** Out of hearts. The long fall: a slide whistle going down a well, then a
   *  low thud at the bottom. Cartoon physics, entirely synthesised. */
  fail() {
    const buf = silence(1.1);
    glide(buf, 0 * S, N.C6, N.C4, 0.6, 0.55, 3.2, 0.5, 2.2);
    glide(buf, 6 * S, 110, 44, 0.42, 0.72, 5, 0.25, 1.6);
    return buf;
  },
};

/** Every pack, by the directory it is written to. `classic` is the default. */
const PACKS = { classic: CLASSIC, arcade: ARCADE };

/** Float samples to a 16-bit PCM mono WAV. Scaling is applied by the caller. */
function toWav(samples, scale) {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(-1, Math.min(1, samples[i] * scale));
    data.writeInt16LE(Math.round(v * 32767), i * 2);
  }

  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);

  return Buffer.concat([header, data]);
}

mkdirSync(OUT_DIR, { recursive: true });

console.log('\nOpenMacro feedback sounds — C major / C minor, 150 BPM\n');

let grandTotal = 0;
for (const [packName, cues] of Object.entries(PACKS)) {
  // `classic` keeps the original paths so nothing that already points at a
  // clip has to move; every other pack gets a directory of its own.
  const dir = packName === 'classic' ? OUT_DIR : join(OUT_DIR, packName);
  mkdirSync(dir, { recursive: true });

  // Render the whole pack before writing any of it, so one gain stage serves
  // the set and the relative dynamics written above survive into the files.
  const rendered = Object.entries(cues).map(([name, make]) => [name, make()]);

  /**
   * Each pack is normalised against its own peak rather than against every
   * pack at once.
   *
   * Within a pack that keeps `select` under the interface and lets `complete`
   * be the loudest thing in the app. Across packs it means both hit the same
   * ceiling, so switching changes the character and not the volume — which is
   * the whole point of a pack being a drop-in replacement.
   */
  let setPeak = 0;
  for (const [, buf] of rendered) for (const s of buf) setPeak = Math.max(setPeak, Math.abs(s));
  const scale = setPeak > 0 ? 0.89 / setPeak : 1;

  console.log(`  ${packName}`);
  let total = 0;
  for (const [name, buf] of rendered) {
    const wav = toWav(buf, scale);
    writeFileSync(join(dir, `${name}.wav`), wav);
    total += wav.length;

    let peak = 0;
    for (const s of buf) peak = Math.max(peak, Math.abs(s));
    const seconds = ((wav.length - 44) / 2 / SAMPLE_RATE).toFixed(2);
    const relative = ((peak / setPeak) * 100).toFixed(0);
    console.log(
      `    ${name.padEnd(10)} ${String(Math.round(wav.length / 1024)).padStart(3)} KB  ` +
        `${seconds}s  ${relative.padStart(3)}% of set peak`,
    );
  }
  console.log(`    ${rendered.length} cues, ${Math.round(total / 1024)} KB\n`);
  grandTotal += total;
}

console.log(
  `  ${Object.keys(PACKS).length} packs, ${Math.round(grandTotal / 1024)} KB total\n`,
);
