#!/usr/bin/env node
/**
 * ============================================================================
 * Background music generator — `npm run gen:music`
 * ============================================================================
 *
 * Synthesises the app's optional background loops under `assets/audio/music/`:
 *
 *   korobeiniki.m4a     a short chiptune arrangement of "Korobeiniki"
 *   funeral-march.m4a   Gounod, "Funeral March of a Marionette" (Halloween)
 *   mountain-king.m4a   Grieg, "In the Hall of the Mountain King" (Halloween)
 *
 * `npm run gen:music` writes all of them; name tracks to write only those,
 * e.g. `npm run gen:music -- funeral-march mountain-king`. `--stems <dir>`
 * additionally writes each Halloween track's lead line as a dry WAV, with its
 * note list as JSON, so the notes can be checked against the score with a
 * pitch tracker.
 *
 * Every file is pure arithmetic: no randomness, no samples, no clock. The one
 * thing `afconvert` puts in an .m4a that changes between runs is the creation
 * time in the container header; `pinTimestamps` zeroes it, so running the
 * script twice gives byte-identical files.
 *
 * ---------------------------------------------------------------------------
 * WHY THESE TUNES ARE SAFE TO SHIP
 * ---------------------------------------------------------------------------
 *
 * "Korobeiniki" is a Russian folk song from the 1860s (Nekrasov's poem, set
 * to a traditional melody). The melody is in the public domain. Arrangements
 * of it are not: the version people know from Tetris is a copyrighted
 * arrangement, and "Tetris" is a trademark. So nothing here is taken from a
 * MIDI file or a recording. The notes below are the folk melody, written out
 * by hand, and the bass line, voices and mix are original work under this
 * repository's licence. Call it Korobeiniki, never "the Tetris theme", in the
 * app and in store copy.
 *
 * The two Halloween pieces follow the same rule. Both composers died well over
 * seventy years ago (Gounod 1893, Grieg 1907), so the compositions are in the
 * public domain everywhere. Recordings, MIDI files and modern arrangements of
 * them are separate works and may not be, so none were used. The melodies
 * were read off nineteenth-century printed scores, themselves public domain,
 * and the accompaniment, voicing and mix here are original:
 *
 * - Gounod: H. Lemoine, Paris, 1882 (the composer's own publisher), the
 *   illustrated edition of the piano original. Internet Archive
 *   `marchefunbredu00goun`, pages 4 and 5: the main theme.
 * - Grieg: Peer Gynt Suite No. 1, Op. 46, piano solo, G. Schirmer, New York,
 *   1899 (ed. Louis Oesterle). Internet Archive `31761045200615`, page 12.
 *   Only Grieg's notes are taken; the editor's fingering is not.
 *
 * The Gounod piece is widely known as the theme of "Alfred Hitchcock
 * Presents". That television arrangement is not used, and the app should not
 * call this "the Hitchcock theme"; it is Gounod's march.
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SAMPLE_RATE = 22050;
const BPM = 140;
const BEAT = 60 / BPM;
const BAR = 4 * BEAT;
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'audio', 'music');

/** Note name to frequency, A4 = 440. `null` is a rest. Accepts `#` and `b`. */
function hz(name) {
  if (name === null) return null;
  const match = /^([A-G])([#b]?)(\d)$/.exec(name);
  const accidental = match[2] === '#' ? 1 : match[2] === 'b' ? -1 : 0;
  const semitone = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 }[match[1]] + accidental;
  return 440 * 2 ** ((semitone + (Number(match[3]) - 4) * 12) / 12);
}

/* ==========================================================================
 * KOROBEINIKI
 * ==========================================================================
 *
 * A minor, the relative minor of the feedback cues' C, so a correct-answer
 * chime over the music never clashes. 140 BPM, 4/4, thirty-two bars, about
 * 55 seconds:
 *
 *   A   the folk melody, eight bars, a soft pulse-wave lead
 *   A'  the same, with a quiet triangle countermelody in half notes under it
 *   B   a slow bridge in half and whole notes, eight bars (see below)
 *   A'  the folk melody with its countermelody again
 *
 * The loop point is the rest at the end of the last bar: the lead and the bass
 * are both silent on the final eighth, so it repeats without a seam.
 *
 * ---------------------------------------------------------------------------
 * THE BRIDGE IS ORIGINAL, AND WHY
 * ---------------------------------------------------------------------------
 *
 * The folk song is just the eight-bar tune. The slow, long-note "second part"
 * people remember from Tetris was written for the Game Boy version and belongs
 * to that copyrighted arrangement, so it is not used, transcribed or imitated
 * here. Section B fills the same role (slower, calmer, a breath before the
 * tune returns) with its own melody: an arch in half and whole notes, rising
 * from A4 to G5 over Dm Am E Am | F C Dm E and leaning back onto the dominant.
 * Its contour, rhythm and harmony are this file's own, under the repository's
 * licence like the rest of the arrangement.
 *
 * ---------------------------------------------------------------------------
 * THE BASS
 * ---------------------------------------------------------------------------
 *
 * Written out bar by bar rather than generated, so it is deterministic and can
 * be read: each bar is an eight-character pattern of eighth notes,
 *
 *   r  the chord's root        R  the root an octave up
 *   f  the fifth               g  a ghost note: the root, very soft and short
 *   a  a chromatic approach: a semitone into the next bar's root
 *   -  a rest
 *
 * Syncopation, rests and the odd octave jump keep it moving without the
 * metronome feel of constant octave eighths. In the bridge it thins out.
 */

/**
 * The folk melody, eight bars, as [note, beats]. q = 1, e = 0.5.
 */
const THEME = [
  // 1
  ['E5', 1], ['B4', 0.5], ['C5', 0.5], ['D5', 1], ['C5', 0.5], ['B4', 0.5],
  // 2
  ['A4', 1], ['A4', 0.5], ['C5', 0.5], ['E5', 1], ['D5', 0.5], ['C5', 0.5],
  // 3
  ['B4', 1.5], ['C5', 0.5], ['D5', 1], ['E5', 1],
  // 4
  ['C5', 1], ['A4', 1], ['A4', 1], [null, 1],
  // 5
  ['D5', 1.5], ['F5', 0.5], ['A5', 1], ['G5', 0.5], ['F5', 0.5],
  // 6
  ['E5', 1.5], ['C5', 0.5], ['E5', 1], ['D5', 0.5], ['C5', 0.5],
  // 7
  ['B4', 1], ['B4', 0.5], ['C5', 0.5], ['D5', 1], ['E5', 1],
  // 8
  ['C5', 1], ['A4', 1], ['A4', 1], [null, 1],
];

/** The countermelody for A': chord tones in half notes, well under the lead. */
const COUNTER = [
  ['C4', 2], ['B3', 2], // 1  Am E
  ['C4', 2], ['E4', 2], // 2  Am
  ['D4', 2], ['B3', 2], // 3  E7
  ['C4', 3], [null, 1], // 4  Am
  ['F4', 2], ['D4', 2], // 5  Dm
  ['E4', 2], ['G4', 2], // 6  C
  ['E4', 2], ['G#4', 2], // 7  E
  ['E4', 3], [null, 1], // 8  Am
];

/** The bridge: original, see above. */
const BRIDGE = [
  ['A4', 2], ['D5', 2], // 1  Dm
  ['C5', 4], //            2  Am
  ['B4', 2], ['G#4', 2], // 3  E
  ['A4', 4], //            4  Am
  ['A4', 2], ['C5', 2], // 5  F
  ['E5', 2], ['G5', 2], // 6  C
  ['F5', 2], ['D5', 2], // 7  Dm
  ['B4', 2], ['D5', 2], // 8  E7, back to the tune's E
];

/** Bass roots per bar, [first half, second half]. */
const THEME_ROOTS = [
  ['A2', 'E2'], ['A2', 'A2'], ['E2', 'E2'], ['A2', 'A2'],
  ['D2', 'D2'], ['C2', 'C2'], ['E2', 'E2'], ['A2', 'A2'],
];
const BRIDGE_ROOTS = [
  ['D2', 'D2'], ['A2', 'A2'], ['E2', 'E2'], ['A2', 'A2'],
  ['F2', 'F2'], ['C2', 'C2'], ['D2', 'D2'], ['E2', 'E2'],
];

/** The bass, one pattern per bar, in the order the sections play. */
const BASS_PATTERNS = [
  // A
  'r-gr-fR-', 'r--Rg-fa', 'r-gr-Rf-', 'r--rg-Ra', 'r-gf-rR-', 'r--Rg-fa', 'r-gr-fR-', 'r--rg-R-',
  // A'
  'r-Rr-gf-', 'r-g-r-fa', 'r--rR-g-', 'r-gr-fRa', 'r--fR-g-', 'r-gR-rfa', 'r-gr-Rf-', 'r--rg-Ra',
  // B
  'r---f-g-', 'r--r-R--', 'r---f--a', 'r--R-g--', 'r---f-g-', 'r--r-R-a', 'r---f-R-', 'r-gr-fRa',
  // A' (the last bar ends on a rest: the loop seam)
  'r-Rr-gf-', 'r-g-r-fa', 'r--rR-g-', 'r-gr-fRa', 'r--fR-g-', 'r-gR-rfa', 'r-gr-Rf-', 'r--rg-R-',
];

/**
 * Adds one note to the buffer: a waveform under a short attack and an
 * exponential release, so nothing clicks at the note's edges.
 *
 * @param {Float64Array} buf The mix.
 * @param {number} at Start, in seconds.
 * @param {number} freq Frequency in Hz.
 * @param {number} dur Length, in seconds.
 * @param {number} gain Peak level.
 * @param {(phase: number) => number} wave One cycle, phase in [0, 1).
 * @param {number} [decay] Exponential decay per second over the note.
 */
function note(buf, at, freq, dur, gain, wave, decay = 1.6) {
  const start = Math.floor(at * SAMPLE_RATE);
  const len = Math.floor(dur * SAMPLE_RATE);
  const attack = Math.floor(0.006 * SAMPLE_RATE);
  const release = Math.floor(Math.min(0.06, dur * 0.3) * SAMPLE_RATE);
  for (let i = 0; i < len && start + i < buf.length; i++) {
    const t = i / SAMPLE_RATE;
    let env = 1;
    if (i < attack) env = i / attack;
    else if (i > len - release) env = (len - i) / release;
    // A gentle decay over the note keeps long notes from droning.
    env *= Math.exp(-decay * t);
    buf[start + i] += gain * env * wave((freq * t) % 1);
  }
}

/** A 25% pulse, softened: the classic handheld lead without the buzz. */
const pulse = (p) => (p < 0.25 ? 0.8 : -0.27) * 0.9 + Math.sin(2 * Math.PI * p) * 0.1;

/** A triangle, for a round bass that sits under the lead. */
const triangle = (p) => (p < 0.5 ? 4 * p - 1 : 3 - 4 * p);

/**
 * Plays a [note, beats] line from a given bar.
 *
 * @param {Float64Array} buf The mix.
 * @param {Array<[string | null, number]>} line The melody.
 * @param {number} bar The bar it starts on.
 * @param {(phase: number) => number} wave The voice.
 * @param {number} gain Level.
 * @param {number} legato Fraction of each note that sounds.
 * @param {number} [decay] Decay per second.
 */
function melody(buf, line, bar, wave, gain, legato, decay) {
  let at = bar * BAR;
  for (const [name, beats] of line) {
    const freq = hz(name);
    if (freq) note(buf, at, freq, beats * BEAT * legato, gain, wave, decay);
    at += beats * BEAT;
  }
}

/** Renders the loop: A A' B A', with the written-out bass. */
function renderKorobeiniki() {
  const sections = [
    { lead: THEME, counter: null, roots: THEME_ROOTS },
    { lead: THEME, counter: COUNTER, roots: THEME_ROOTS },
    { lead: BRIDGE, counter: null, roots: BRIDGE_ROOTS },
    { lead: THEME, counter: COUNTER, roots: THEME_ROOTS },
  ];
  const bars = sections.length * 8;
  const buf = new Float64Array(Math.round(bars * BAR * SAMPLE_RATE));
  const roots = sections.flatMap((s) => s.roots);
  const eighth = BEAT / 2;

  sections.forEach((section, index) => {
    const bar = index * 8;
    if (section.lead === BRIDGE) {
      // Long notes: a slower decay and full length, so they sing rather than pluck.
      melody(buf, BRIDGE, bar, pulse, 0.27, 0.96, 0.55);
    } else {
      // Slightly detached, like a plucked note, so repeated pitches articulate.
      melody(buf, THEME, bar, pulse, 0.32, 0.9);
    }
    if (section.counter) melody(buf, section.counter, bar, triangle, 0.15, 0.92, 0.9);
  });

  BASS_PATTERNS.forEach((pattern, bar) => {
    const next = hz(roots[(bar + 1) % bars][0]);
    [...pattern].forEach((symbol, step) => {
      if (symbol === '-') return;
      const root = hz(roots[bar][step < 4 ? 0 : 1]);
      const at = bar * BAR + step * eighth;
      const semitone = 2 ** (1 / 12);
      const voice = {
        r: [root, 0.24, 0.8],
        R: [root * 2, 0.19, 0.7],
        f: [root * 1.5, 0.18, 0.7],
        g: [root, 0.08, 0.35],
        // From below when the next root is higher, from above when it is lower.
        a: [next >= root ? next / semitone : next * semitone, 0.17, 0.8],
      }[symbol];
      note(buf, at, voice[0], eighth * voice[2], voice[1], triangle);
    });
  });

  return { loop: level(buf) };
}

/* ==========================================================================
 * THE HALLOWEEN INSTRUMENTS
 * ==========================================================================
 *
 * Spooky but gentle: this is music under a lesson. Three voices, all additive
 * (a few sine partials under one envelope), so nothing has the buzz of a raw
 * square or saw:
 *
 * - `celesta`: a struck bell-like tone, a music box. Rings past its written
 *   length and fades, like the real thing.
 * - `reed`: a muted bassoon. A soft attack, an odd-leaning harmonic stack and
 *   a little late vibrato. Played staccato it is the comic-sinister bassoon
 *   every cartoon villain tiptoes to.
 * - `pizz`: a plucked string. Upper partials die faster than the fundamental,
 *   which is most of what makes a pluck sound like a pluck.
 *
 * Every partial is weighted by `soften`, a gentle low-pass, so a high note
 * never gets bright or harsh. A short, dark reverb puts all three in the same
 * room. Then `level` brings the loop to the shared target loudness (RMS), so
 * the app's single VOLUME constant suits every track.
 */

/**
 * Every loop's loudness: that of the first, sixteen-bar `korobeiniki.m4a`
 * (measured RMS -14.0 dBFS, peak -3.0 dBFS), which the app's VOLUME was tuned to.
 */
const TARGET_RMS_DB = -14;

/** Nothing may go above this; a soft knee catches the odd stacked chord. */
const CEILING = 10 ** (-2.5 / 20);

/**
 * A first-order low-pass response, applied per partial: 1 below `corner`,
 * falling at 6 dB per octave above it. Keeps the highs round.
 *
 * @param {number} freq The partial's frequency in Hz.
 * @param {number} corner The corner frequency in Hz.
 * @returns {number} The partial's weight, 0..1.
 */
function soften(freq, corner) {
  return 1 / Math.sqrt(1 + (freq / corner) ** 2);
}

/**
 * The instruments. Each is a recipe for `tone()`:
 *
 * - `partials`: [multiple of the fundamental, level, extra decay per second]
 * - `attack`, `release`: seconds
 * - `decay`: overall exponential decay per second while the note sounds
 * - `ring`: how long the note sounds, as a function of its written length
 * - `vibrato`: [rate Hz, depth as a fraction of the pitch, delay seconds]
 * - `corner`: the `soften` corner, Hz
 */
const INSTRUMENTS = {
  celesta: {
    partials: [[1, 1, 0], [2, 0.22, 2.5], [3, 0.05, 5], [4, 0.09, 7]],
    attack: 0.002,
    release: 0.08,
    decay: 2.6,
    ring: (dur) => dur + Math.min(0.25, dur * 1.5),
    vibrato: null,
    corner: 2600,
  },
  reed: {
    partials: [[1, 1, 0], [2, 0.5, 0], [3, 0.42, 0], [4, 0.18, 0], [5, 0.14, 0], [6, 0.05, 0]],
    attack: 0.03,
    release: 0.05,
    decay: 0.9,
    ring: (dur) => dur,
    vibrato: [5.2, 0.0035, 0.18],
    corner: 1400,
  },
  pizz: {
    partials: [[1, 1, 0], [2, 0.5, 4], [3, 0.3, 9], [4, 0.16, 14], [5, 0.08, 20]],
    attack: 0.003,
    release: 0.06,
    decay: 5.5,
    ring: (dur) => Math.max(dur, 0.45),
    vibrato: null,
    corner: 1800,
  },
};

/**
 * Adds one note of an instrument to the buffer. The phase of each partial is
 * accumulated sample by sample, so vibrato bends the pitch instead of jumping
 * the waveform.
 *
 * @param {Float64Array} buf The mix (longer than the loop; the tail is wrapped later).
 * @param {number} at Start, in seconds.
 * @param {number} freq Fundamental, in Hz.
 * @param {number} dur Written length, in seconds; the instrument decides how long it rings.
 * @param {number} gain Peak level.
 * @param {keyof typeof INSTRUMENTS} instrument The voice.
 */
function tone(buf, at, freq, dur, gain, instrument) {
  const voice = INSTRUMENTS[instrument];
  const start = Math.round(at * SAMPLE_RATE);
  const len = Math.floor(voice.ring(dur) * SAMPLE_RATE);
  const attack = Math.max(1, Math.floor(voice.attack * SAMPLE_RATE));
  const release = Math.max(1, Math.floor(Math.min(voice.release, voice.ring(dur) * 0.4) * SAMPLE_RATE));
  const parts = voice.partials.map(([mult, level, extra]) => ({
    mult,
    level: level * soften(freq * mult, voice.corner),
    extra,
  }));
  const norm = parts.reduce((sum, p) => sum + p.level, 0);
  const phase = parts.map(() => 0);

  for (let i = 0; i < len && start + i < buf.length; i++) {
    const t = i / SAMPLE_RATE;
    let env = i < attack ? i / attack : 1;
    if (i > len - release) env *= (len - i) / release;
    env *= Math.exp(-voice.decay * t);

    let f = freq;
    if (voice.vibrato && t > voice.vibrato[2]) {
      const [rate, depth, delay] = voice.vibrato;
      // Fades in over 0.2 s so short notes stay straight.
      const amount = Math.min(1, (t - delay) / 0.2);
      f *= 1 + depth * amount * Math.sin(2 * Math.PI * rate * (t - delay));
    }

    let sample = 0;
    for (let k = 0; k < parts.length; k++) {
      phase[k] += (2 * Math.PI * f * parts[k].mult) / SAMPLE_RATE;
      sample += parts[k].level * Math.exp(-parts[k].extra * t) * Math.sin(phase[k]);
    }
    buf[start + i] += (gain * env * sample) / norm;
  }
}

/** Shifts a note name by whole octaves. */
function octave(name, by) {
  return name.replace(/\d$/, (n) => String(Number(n) + by));
}

/**
 * Plays a line of [note | chord | null, length in units] events.
 *
 * @param {Float64Array} buf The mix.
 * @param {Array<[string | string[] | null, number]>} line The events.
 * @param {object} opts How to play it.
 * @param {number} opts.at Start of the line, seconds.
 * @param {number} opts.unit Seconds per unit of length.
 * @param {keyof typeof INSTRUMENTS} opts.instrument The voice.
 * @param {number} opts.gain Level of a single note.
 * @param {number} [opts.shift] Octaves to transpose by.
 * @param {number} [opts.legato] Fraction of the written length that sounds.
 * @param {Array<{at: number, dur: number, notes: string[]}>} [opts.log] Collects what was played.
 * @returns {number} Where the line ended, seconds.
 */
function play(buf, line, { at, unit, instrument, gain, shift = 0, legato = 0.9, log }) {
  let time = at;
  for (const [what, length] of line) {
    if (what !== null) {
      const notes = (Array.isArray(what) ? what : [what]).map((n) => octave(n, shift));
      // A chord shares one note's level, so it is no louder than a melody note.
      const each = gain / Math.sqrt(notes.length);
      for (const n of notes) tone(buf, time, hz(n), length * unit * legato, each, instrument);
      log?.push({ at: time, dur: length * unit, notes });
    }
    time += length * unit;
  }
  return time;
}

/** Total length of a line, in units. */
const span = (line) => line.reduce((sum, [, length]) => sum + length, 0);

/**
 * A small, dark Schroeder reverb: four damped combs in parallel, two
 * all-passes in series. Run over the loop three times in a row and only the
 * last pass kept, so the tail that spills over the end is already in the
 * start: the reverb is as seamless as the notes.
 *
 * @param {Float64Array} dry The loop.
 * @param {number} mix The wet level.
 * @returns {Float64Array} The loop with its reverb.
 */
function reverb(dry, mix) {
  const n = dry.length;
  const combs = [557, 593, 641, 677].map((delay) => ({ delay, line: new Float64Array(delay), pos: 0, low: 0 }));
  const passes = [223, 341].map((delay) => ({ delay, line: new Float64Array(delay), pos: 0 }));
  const feedback = 0.8;
  const damping = 0.45;
  const out = new Float64Array(n);

  for (let round = 0; round < 3; round++) {
    for (let i = 0; i < n; i++) {
      const input = dry[i];
      let wet = 0;
      for (const c of combs) {
        const delayed = c.line[c.pos];
        c.low = delayed * (1 - damping) + c.low * damping;
        c.line[c.pos] = input + c.low * feedback;
        c.pos = (c.pos + 1) % c.delay;
        wet += delayed;
      }
      wet *= 0.25;
      for (const a of passes) {
        const delayed = a.line[a.pos];
        const value = wet + delayed * 0.5;
        a.line[a.pos] = value;
        a.pos = (a.pos + 1) % a.delay;
        wet = delayed - value * 0.5;
      }
      if (round === 2) out[i] = input + wet * mix;
    }
  }
  return out;
}

/**
 * Finishes a Halloween loop: folds everything that rang past the end back
 * onto the start (that is what the start sounds like when the loop repeats),
 * adds the reverb, and levels it.
 *
 * @param {Float64Array} buf The mix, `length` samples plus a tail.
 * @param {number} length The loop's length, in samples.
 * @returns {Float64Array} The finished loop.
 */
function finish(buf, length) {
  const loop = buf.slice(0, length);
  for (let i = length; i < buf.length; i++) loop[i % length] += buf[i];

  return level(reverb(loop, 0.32));
}

/**
 * The one gain stage every loop goes through: scales it to the target RMS,
 * so all tracks play equally loud at the app's single VOLUME, and rounds off
 * the rare peak above the ceiling with a soft knee.
 *
 * @param {Float64Array} buf The finished loop; scaled in place.
 * @returns {Float64Array} The same buffer.
 */
function level(buf) {
  let sum = 0;
  for (const s of buf) sum += s * s;
  const scale = 10 ** (TARGET_RMS_DB / 20) / Math.sqrt(sum / buf.length);
  const knee = CEILING * 0.7;
  for (let i = 0; i < buf.length; i++) {
    const s = buf[i] * scale;
    // Soft knee: untouched below 70% of the ceiling, rounded off above.
    const a = Math.abs(s);
    buf[i] = a <= knee ? s : Math.sign(s) * (knee + (CEILING - knee) * Math.tanh((a - knee) / (CEILING - knee)));
  }
  return buf;
}

/* ==========================================================================
 * GOUNOD — FUNERAL MARCH OF A MARIONETTE
 * ==========================================================================
 *
 * D minor, 6/8, Allegretto. The sixteen-bar main theme exactly as printed,
 * played twice: first by the muted bassoon, then by the music box, with the
 * bassoon shadowing it. Underneath, an oom-pah march: a plucked root on the
 * first beat, a soft plucked chord on the second, on the harmony the score
 * gives. Dotted quarter = 63, so a bar is 1.905 s and the loop about 61 s.
 *
 * ---------------------------------------------------------------------------
 * TRANSCRIPTION NOTES (Lemoine 1882, pp. 4-5)
 * ---------------------------------------------------------------------------
 *
 * The theme is two eight-bar phrases.
 *
 * Bars 1-4: the tiptoeing figure. A quarter rest, then D, a grace note E
 * into D, C sharp, B natural (the raised sixth of D minor), C sharp, a rest,
 * D, and an A major chord on the second beat. Stated twice.
 *
 * Bars 5-8: a rising sequence over an inner voice that climbs C# - E - G#:
 * A-G, C-B flat, E-D, each "sigh" answered by the next. Bar 8 runs down
 * C#-B flat-A-G-F-E, which leads straight back into the figure.
 *
 * Bars 9-16: the figure once, then again under a held, accented A falling
 * to G; the C-B flat sigh; A-G-F then E flat-G-B flat (the Neapolitan, the
 * one forte in the theme); D-C#-D, A major, A with a flattened sixth (F),
 * and the cadence: A major resolving to D minor.
 *
 * Uncertain: the grace note in bars 1, 3 and 9 is printed small and reads
 * as E; the inner-voice chords on the last eighth of the first beat in bars
 * 6, 7 and 13 are partly hidden by the engraving and are written here as
 * the thirds the harmony implies. Neither touches the tune.
 */

/** The two-bar figure, in eighth notes. Chords are arrays. */
const MARCH_FIGURE = [
  // 1: quarter rest, D, grace E into D, C#, B natural
  [null, 2], ['D4', 0.85], ['E4', 0.15], ['D4', 1], ['C#4', 1], ['B3', 1],
  // 2: C#, rest, D, then the A major chord
  ['C#4', 1], [null, 1], ['D4', 1], [['A3', 'C#4', 'E4'], 1], [null, 2],
];

/** Sixteen bars, top line, in eighth notes. */
const MARCH_TOP = [
  ...MARCH_FIGURE,
  ...MARCH_FIGURE,
  // 5
  [null, 2], [['D4', 'F4'], 1], ['A4', 2], ['G4', 1],
  // 6
  [['D4', 'F4'], 1], [null, 1], [['F4', 'A4'], 1], ['C5', 2], ['Bb4', 1],
  // 7
  [['F4', 'A4'], 1], [null, 1], [['A4', 'C5'], 1], ['E5', 2], ['D5', 1],
  // 8
  [['A4', 'C#5'], 1], ['Bb4', 1], ['A4', 1], ['G4', 1], ['F4', 1], ['E4', 1],
  // 9-10
  ...MARCH_FIGURE,
  // 11-12: the held A, tied across the bar, falling to G (the figure is below)
  [null, 3], ['A4', 6], ['G4', 3],
  // 13
  [['D4', 'F4'], 1], [null, 1], [['E4', 'G4'], 1], ['C5', 2], ['Bb4', 1],
  // 14: forte, the Neapolitan
  [['F4', 'A4'], 1], ['G4', 1], ['F4', 1], ['Eb4', 1], ['G4', 1], ['Bb4', 1],
  // 15
  ['D4', 1], ['C#4', 1], ['D4', 1], [['A3', 'C#4', 'E4'], 1], [null, 1], [['A3', 'C#4', 'F4'], 1],
  // 16
  [['A3', 'C#4', 'E4'], 3], [['A3', 'D4'], 1], [null, 2],
];

/** The inner voice: held notes under bars 5-7 and 13, the figure under 11-12. */
const MARCH_INNER = [
  [null, 4 * 6],
  [null, 3], ['C#4', 3], // 5
  [null, 3], ['E4', 3], // 6
  [null, 3], ['G#4', 3], // 7
  [null, 3 * 6], // 8-10
  [null, 2], ['D4', 1], ['D4', 1], ['C#4', 1], ['B3', 1], // 11
  ['C#4', 1], [null, 1], ['D4', 1], ['E4', 1], [null, 1], ['C#4', 1], // 12
  [null, 3], ['E4', 3], // 13
  [null, 3 * 6], // 14-16
];

/** Chords the score gives, per bar: [first beat, second beat]. */
const MARCH_HARMONY = [
  ['Dm', 'Dm'], ['A', 'A'], ['Dm', 'Dm'], ['A', 'A'],
  ['Dm', 'A7'], ['Dm', 'C7'], ['F', 'E7'], ['A7', 'A7'],
  ['Dm', 'Dm'], ['A', 'A'], ['Dm', 'Dm'], ['A7', 'A7'],
  ['Dm', 'C7'], ['F', 'Eb'], ['Dm', 'A'], ['A', 'Dm'],
];

/** Each chord: [low root, upper chord], voiced to keep clear of the tune. */
const MARCH_CHORDS = {
  Dm: ['D2', ['D3', 'F3', 'A3']],
  A: ['A1', ['C#3', 'E3', 'A3']],
  A7: ['A1', ['C#3', 'G3', 'A3']],
  C7: ['C2', ['E3', 'G3', 'Bb3']],
  F: ['F2', ['F3', 'A3', 'C4']],
  E7: ['E2', ['E3', 'G#3', 'D4']],
  Eb: ['Eb2', ['Eb3', 'G3', 'Bb3']],
};

/**
 * Renders the march.
 *
 * @param {Array<{at: number, dur: number, notes: string[]}>} [log] Collects the lead line.
 * @returns {{loop: Float64Array, lead: Float64Array}} The loop, and the dry lead for checking.
 */
function renderFuneralMarch(log) {
  const eighth = 60 / 63 / 3;
  const barLength = 6 * eighth;
  const bars = MARCH_HARMONY.length;
  const length = Math.round(2 * bars * barLength * SAMPLE_RATE);
  const tail = 3 * SAMPLE_RATE;
  const buf = new Float64Array(length + tail);
  const lead = new Float64Array(length + tail);

  if (span(MARCH_TOP) !== bars * 6 || span(MARCH_INNER) !== bars * 6) {
    throw new Error('march: a line does not add up to sixteen bars of 6/8');
  }

  for (let pass = 0; pass < 2; pass++) {
    const at = pass * bars * barLength;
    if (pass === 0) {
      // The bassoon has the tune: staccato, as Gounod marks it.
      play(buf, MARCH_TOP, { at, unit: eighth, instrument: 'reed', gain: 0.34, legato: 0.62 });
      play(lead, MARCH_TOP, { at, unit: eighth, instrument: 'reed', gain: 0.34, legato: 0.62, log });
      play(buf, MARCH_INNER, { at, unit: eighth, instrument: 'reed', gain: 0.2, legato: 0.62 });
    } else {
      // The music box takes it, an octave up; the bassoon shadows it softly.
      play(buf, MARCH_TOP, { at, unit: eighth, instrument: 'celesta', gain: 0.2, shift: 1 });
      play(lead, MARCH_TOP, { at, unit: eighth, instrument: 'celesta', gain: 0.2, shift: 1, log });
      play(buf, MARCH_TOP, { at, unit: eighth, instrument: 'reed', gain: 0.14, legato: 0.62 });
      play(buf, MARCH_INNER, { at, unit: eighth, instrument: 'celesta', gain: 0.1, shift: 1 });
    }

    MARCH_HARMONY.forEach(([first, second], bar) => {
      const start = at + bar * barLength;
      tone(buf, start, hz(MARCH_CHORDS[first][0]), eighth, 0.42, 'pizz');
      MARCH_CHORDS[second][1].forEach((n) => tone(buf, start + 3 * eighth, hz(n), eighth, 0.12, 'pizz'));
    });
  }

  return { loop: finish(buf, length), lead: lead.slice(0, length) };
}

/* ==========================================================================
 * GRIEG — IN THE HALL OF THE MOUNTAIN KING
 * ==========================================================================
 *
 * B minor, 4/4, "Alla marcia e molto marcato", sempre staccato e pianissimo.
 * The theme's sixteen bars as Grieg lays them out, and they already form a
 * loop: the phrase in B minor, the same an octave higher, the answer on the
 * dominant (F sharp major), the same an octave higher, ending on a held C
 * sharp that leads back to B.
 *
 * The piece famously accelerates for its whole length. A loop cannot, so the
 * tempo stays at quarter = 126 (Grieg starts at 138; a touch slower sits
 * better under a lesson), and the build is in the texture instead: the first
 * time round a plucked string doubled by a muted bassoon, tiptoeing over a
 * plucked pulse; the second time a music box joins two octaves up. It then
 * drops back to the sparse version, which is how the piece itself begins.
 * Thirty-two bars, about 61 s.
 *
 * ---------------------------------------------------------------------------
 * TRANSCRIPTION NOTES (Schirmer 1899, p. 12)
 * ---------------------------------------------------------------------------
 *
 * Read in the bass clef of the piano edition, which keeps Grieg's octave
 * (the orchestra has it in cellos, basses and bassoons, starting on B1):
 *
 *   B C# D E F# D F#(q) | E# C# E#(q) E C E(q) | B C# D E F# D F# B | A F# D F# A(h)
 *   F# G# A# B C# A# C#(q) | D A# D(q) C# A# C#(q) | (the same) | D A# D(q) C#(h)
 *
 * The chromatic slide F# - E# - E natural in bar 2, with C# then C natural
 * under it, is the creepy part; the answer's A# under D natural is the same
 * trick on the dominant. Every note was checked against the staff lines at
 * high magnification. The accompanying pulse is not Grieg's but follows his
 * harmony: a B pedal under the B minor phrases, F# under the answer.
 */

/** The phrase in B minor, at Grieg's written octave, in eighth notes. */
const KING_A = [
  ['B1', 1], ['C#2', 1], ['D2', 1], ['E2', 1], ['F#2', 1], ['D2', 1], ['F#2', 2],
  ['E#2', 1], ['C#2', 1], ['E#2', 2], ['E2', 1], ['C2', 1], ['E2', 2],
  ['B1', 1], ['C#2', 1], ['D2', 1], ['E2', 1], ['F#2', 1], ['D2', 1], ['F#2', 1], ['B2', 1],
  ['A2', 1], ['F#2', 1], ['D2', 1], ['F#2', 1], ['A2', 4],
];

/** The answer on the dominant. */
const KING_B = [
  ['F#2', 1], ['G#2', 1], ['A#2', 1], ['B2', 1], ['C#3', 1], ['A#2', 1], ['C#3', 2],
  ['D3', 1], ['A#2', 1], ['D3', 2], ['C#3', 1], ['A#2', 1], ['C#3', 2],
  ['F#2', 1], ['G#2', 1], ['A#2', 1], ['B2', 1], ['C#3', 1], ['A#2', 1], ['C#3', 2],
  ['D3', 1], ['A#2', 1], ['D3', 2], ['C#3', 4],
];

/** The sixteen bars: [phrase, octaves above the written pitch it sounds at]. */
const KING_FORM = [[KING_A, 1], [KING_A, 2], [KING_B, 1], [KING_B, 2]];

/** The plucked pulse, one pedal per phrase: root, fifth, root, fifth in quarters. */
const KING_PULSE = { A: ['B1', 'F#2'], B: ['F#1', 'C#2'] };

/**
 * Renders the Mountain King.
 *
 * @param {Array<{at: number, dur: number, notes: string[]}>} [log] Collects the lead line.
 * @returns {{loop: Float64Array, lead: Float64Array}} The loop, and the dry lead for checking.
 */
function renderMountainKing(log) {
  const eighth = 60 / 126 / 2;
  const barLength = 8 * eighth;
  const bars = KING_FORM.length * 4;
  const length = Math.round(2 * bars * barLength * SAMPLE_RATE);
  const tail = 3 * SAMPLE_RATE;
  const buf = new Float64Array(length + tail);
  const lead = new Float64Array(length + tail);

  for (const [phrase] of KING_FORM) {
    if (span(phrase) !== 4 * 8) throw new Error('mountain king: a phrase is not four bars of 4/4');
  }

  for (let pass = 0; pass < 2; pass++) {
    KING_FORM.forEach(([phrase, shift], index) => {
      const at = (pass * bars + index * 4) * barLength;
      // Grieg: sempre staccato. The pluck carries the line, the bassoon gives it body.
      play(buf, phrase, { at, unit: eighth, instrument: 'pizz', gain: 0.4, shift, legato: 0.5 });
      play(buf, phrase, { at, unit: eighth, instrument: 'reed', gain: 0.2, shift, legato: 0.45 });
      play(lead, phrase, { at, unit: eighth, instrument: 'pizz', gain: 0.4, shift, legato: 0.5, log });
      if (pass === 1) {
        play(buf, phrase, { at, unit: eighth, instrument: 'celesta', gain: 0.11, shift: shift + 2, legato: 0.5 });
      }

      const [root, fifth] = KING_PULSE[phrase === KING_A ? 'A' : 'B'];
      for (let quarter = 0; quarter < 16; quarter++) {
        const pitch = quarter % 2 === 0 ? root : fifth;
        tone(buf, at + quarter * 2 * eighth, hz(pitch), eighth, quarter % 4 === 0 ? 0.3 : 0.22, 'pizz');
      }
    });
  }

  return { loop: finish(buf, length), lead: lead.slice(0, length) };
}

/* ==========================================================================
 * OUTPUT
 * ========================================================================== */

/** Every track, by file name. */
const TRACKS = {
  korobeiniki: renderKorobeiniki,
  'funeral-march': renderFuneralMarch,
  'mountain-king': renderMountainKing,
};

/** 16-bit mono PCM WAV. */
function wav(buf) {
  const data = Buffer.alloc(buf.length * 2);
  buf.forEach((sample, i) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, sample)) * 32767), i * 2));
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

/**
 * Zeroes the creation and modification times `afconvert` writes into the
 * movie, track and media headers, the only bytes that differ between two runs.
 *
 * @param {Buffer} file The .m4a.
 * @returns {Buffer} The same file, with the clock taken out.
 */
function pinTimestamps(file) {
  const containers = new Set(['moov', 'trak', 'mdia']);
  const stamped = new Set(['mvhd', 'tkhd', 'mdhd']);
  const walk = (from, to) => {
    let at = from;
    while (at + 8 <= to) {
      const size = file.readUInt32BE(at);
      const type = file.toString('latin1', at + 4, at + 8);
      if (size < 8 || at + size > to) break;
      if (containers.has(type)) walk(at + 8, at + size);
      if (stamped.has(type)) {
        // Version 1 boxes carry 64-bit times, version 0 boxes 32-bit ones.
        const wide = file[at + 8] === 1;
        file.fill(0, at + 12, at + 12 + (wide ? 16 : 8));
      }
      at += size;
    }
  };
  walk(0, file.length);
  return file;
}

const args = process.argv.slice(2);
const stemsAt = args.indexOf('--stems');
const stemsDir = stemsAt >= 0 ? resolve(args[stemsAt + 1]) : null;
const names = args.filter((arg, i) => !arg.startsWith('--') && (stemsAt < 0 || i !== stemsAt + 1));
for (const name of names) {
  if (!TRACKS[name]) throw new Error(`unknown track "${name}"; known: ${Object.keys(TRACKS).join(', ')}`);
}

mkdirSync(OUT_DIR, { recursive: true });
if (stemsDir) mkdirSync(stemsDir, { recursive: true });

for (const name of names.length ? names : Object.keys(TRACKS)) {
  const log = [];
  const { loop, lead } = TRACKS[name](log);
  const wavPath = join(OUT_DIR, `${name}.wav`);
  const m4aPath = join(OUT_DIR, `${name}.m4a`);
  writeFileSync(wavPath, wav(loop));

  if (stemsDir && lead) {
    writeFileSync(join(stemsDir, `${name}-lead.wav`), wav(lead));
    writeFileSync(join(stemsDir, `${name}-lead.json`), JSON.stringify({ sampleRate: SAMPLE_RATE, notes: log }));
  }

  try {
    execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '64000', wavPath, m4aPath]);
    writeFileSync(m4aPath, pinTimestamps(readFileSync(m4aPath)));
    rmSync(wavPath);
    console.log(`wrote ${m4aPath} (${(loop.length / SAMPLE_RATE).toFixed(1)} s)`);
  } catch {
    console.log(`wrote ${wavPath}; convert it to ${m4aPath} (AAC, 64 kb/s), e.g. with ffmpeg`);
  }
}
