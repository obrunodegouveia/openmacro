#!/usr/bin/env node
/**
 * ============================================================================
 * Feedback cue self-test — `npm run check:feedback`
 * ============================================================================
 *
 * `src/feedback` has one rule that cannot be expressed in the type system and
 * is not visible in review: **playback never begins from an unknown position.**
 *
 * It is easy to break. `seekTo` is asynchronous and `play` is not, so the
 * obvious spelling — seek, then play on the next line — starts playback from
 * wherever the player already was and lands the rewind afterwards. The result
 * is a cue that is silently dropped or one that jumps mid-note, depending on
 * timing, which is why it was reported as sounds being *sometimes* out of
 * sync rather than always.
 *
 * Nothing about that is caught by a typechecker or a linter, and it needs a
 * device to hear. So this drives the real module against a stub player that
 * records every call, under interleavings a device would only produce
 * occasionally: cues fired faster than seeks resolve, a cue fired the instant
 * the previous clip ends, and sound switched off while a rewind is in flight.
 *
 * `react-native`, `expo-haptics` and `expo-audio` are stubbed through a
 * resolve hook, so the file under test is the shipped one rather than a copy.
 */

import { registerHooks } from 'node:module';
import { mkdtempSync, writeFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const ROOT = new URL('../', import.meta.url);
const STUBS = mkdtempSync(join(tmpdir(), 'openmacro-feedback-'));

/** Every call the module makes on a player, in order, for assertions below. */
const calls = [];
/** Pending seek resolvers, so the test controls when a rewind lands. */
const pending = [];

writeFileSync(
  join(STUBS, 'react-native.mjs'),
  `export const Platform = { OS: 'ios' };\nexport default { Platform };\n`,
);
writeFileSync(
  join(STUBS, 'expo-haptics.mjs'),
  `export const NotificationFeedbackType = { Success: 'success', Error: 'error' };
   export const ImpactFeedbackStyle = { Light: 'light' };
   export async function selectionAsync() {}
   export async function notificationAsync() {}
   export async function impactAsync() {}\n`,
);
const HARNESS_URL = JSON.stringify(pathToFileURL(join(STUBS, 'harness.mjs')).href);

writeFileSync(
  join(STUBS, 'expo-audio.mjs'),
  [
    'import { record, deferSeek, players } from ' + HARNESS_URL + ';',
    'class StubPlayer {',
    '  constructor(id) { this.id = id; this.position = 0; this.playing = false; }',
    "  play() { record({ player: this.id, call: 'play', position: this.position }); this.playing = true; }",
    "  pause() { record({ player: this.id, call: 'pause' }); this.playing = false; }",
    "  remove() { record({ player: this.id, call: 'remove' }); }",
    '  seekTo(seconds) {',
    "    record({ player: this.id, call: 'seekTo', seconds });",
    '    return deferSeek(() => { this.position = seconds; });',
    '  }',
    '  // Only the harness calls this: a clip reaching its natural end leaves a',
    '  // real player parked at the end position, which is where play() is a no-op.',
    '  finish(duration) { this.position = duration; this.playing = false; }',
    '}',
    'let next = 0;',
    "export function createAudioPlayer() { const p = new StubPlayer('p' + next++); players.push(p); return p; }",
    'export async function setAudioModeAsync() {}',
  ].join('\n'),
);

writeFileSync(
  join(STUBS, 'harness.mjs'),
  `export const calls = [];
   export const players = [];
   export const pending = [];
   export function record(entry) { calls.push(entry); }
   export function deferSeek(apply) {
     return new Promise((resolve) => pending.push(() => { apply(); resolve(); }));
   }\n`,
);

const STUB_FOR = {
  'react-native': join(STUBS, 'react-native.mjs'),
  'expo-haptics': join(STUBS, 'expo-haptics.mjs'),
  'expo-audio': join(STUBS, 'expo-audio.mjs'),
};

function isFile(url) {
  try { return statSync(fileURLToPath(url)).isFile(); } catch { return false; }
}
function firstExisting(base) {
  return [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`].find(isFile) ?? null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (STUB_FOR[specifier]) {
      return { url: pathToFileURL(STUB_FOR[specifier]).href, shortCircuit: true };
    }
    if (specifier.startsWith('@/')) {
      const resolved = firstExisting(new URL(`src/${specifier.slice(2)}`, ROOT).href);
      if (resolved) return { url: resolved, shortCircuit: true };
    }
    if (specifier.startsWith('.') && context.parentURL) {
      const resolved = firstExisting(new URL(specifier, context.parentURL).href);
      if (resolved) return { url: resolved, shortCircuit: true };
    }
    // The clips are `require`d assets; Metro handles them, Node must not try.
    if (specifier.endsWith('.wav')) {
      return { url: pathToFileURL(join(STUBS, 'harness.mjs')).href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});

/**
 * The clips are pulled in with `require`, which is Metro's asset convention
 * and has no meaning in Node's ESM scope. The stub player ignores its source
 * argument, so handing back the path is enough to let the module load.
 */
globalThis.require = (id) => id;

const harness = await import(pathToFileURL(join(STUBS, 'harness.mjs')).href);
const feedback = await import('@/feedback');

/** Let every in-flight rewind land, in the order it was requested. */
async function settle() {
  while (harness.pending.length > 0) harness.pending.shift()();
  await Promise.resolve();
  await Promise.resolve();
}

let failures = 0;
function check(name, condition, detail = '') {
  console.log(
    condition
      ? `  \x1b[32m✓\x1b[0m ${name}${detail ? `  \x1b[2m${detail}\x1b[0m` : ''}`
      : `  \x1b[31m✗\x1b[0m ${name}${detail ? `  ${detail}` : ''}`,
  );
  if (!condition) failures += 1;
}
const reset = () => { harness.calls.length = 0; harness.pending.length = 0; };

console.log('\nFeedback cues — self-test\n');
feedback.preloadSounds();
reset();

console.log('The invariant');
feedback.emitFeedback('correct');
await settle();
const plays = harness.calls.filter((c) => c.call === 'play');
check('a single cue plays', plays.length === 1);
check('…from position zero', plays.every((c) => c.position === 0), `positions: ${plays.map((c) => c.position)}`);
check(
  '…and only after its rewind resolved',
  harness.calls.findIndex((c) => c.call === 'seekTo') < harness.calls.findIndex((c) => c.call === 'play'),
);

reset();
console.log('\nCues faster than the rewinds resolve (dragging a slider)');
for (let i = 0; i < 12; i++) feedback.emitFeedback('select');
await settle();
const burst = harness.calls.filter((c) => c.call === 'play');
check('12 rapid cues never play from a stale position', burst.every((c) => c.position === 0), `positions: ${[...new Set(burst.map((c) => c.position))]}`);
check('…and collapse to one sound rather than stacking up', burst.length === 1, `${burst.length} play(s) for 12 fires`);

reset();
console.log('\nCues at a realistic pace (each rewind lands before the next)');
let playedInSequence = 0;
for (let i = 0; i < 6; i++) {
  feedback.emitFeedback('select');
  await settle();
  playedInSequence += harness.calls.filter((c) => c.call === 'play').length;
  reset();
}
check(
  'six separated cues play six times — collapsing only applies to a burst',
  playedInSequence === 6,
  `${playedInSequence} play(s) for 6 fires`,
);

reset();
console.log('\nA cue fired the instant the previous clip ended');
feedback.emitFeedback('correct');
await settle();
// Simulate the clip running to its end: a real player is left sitting at the
// end position, which is where `play()` does nothing at all.
for (const player of harness.players) player.finish(0.4);
reset();
feedback.emitFeedback('correct');
await settle();
const afterEnd = harness.calls.filter((c) => c.call === 'play');
check(
  'it is rewound before playing, not played from the end',
  afterEnd.length > 0 && afterEnd.every((c) => c.position === 0),
  `positions: ${afterEnd.map((c) => c.position)}`,
);
check('…so the cue is not silently dropped', afterEnd.length === 1);

reset();
console.log('\nSound switched off while a rewind is in flight');
feedback.emitFeedback('complete');
feedback.setSoundEnabled(false);
await settle();
check('the pending cue does not play', harness.calls.filter((c) => c.call === 'play').length === 0);
feedback.setSoundEnabled(true);
reset();
feedback.emitFeedback('complete');
await settle();
check('…and switching it back on works immediately', harness.calls.filter((c) => c.call === 'play').length === 1);

reset();
console.log('\nHousekeeping');
feedback.setSoundEnabled(false);
feedback.emitFeedback('select');
await settle();
check('no player is touched at all while sound is off', harness.calls.length === 0);
feedback.setSoundEnabled(true);

if (failures === 0) {
  console.log('\x1b[32m%s\x1b[0m', '\n✓ Feedback cues sound — every check passed.\n');
  process.exit(0);
}
console.log('\x1b[31m%s\x1b[0m', `\n✗ ${failures} check(s) failed.\n`);
process.exit(1);
