#!/usr/bin/env node
/**
 * ============================================================================
 * Feedback cue self-test — `npm run check:feedback`
 * ============================================================================
 *
 * `src/feedback` has one rule that cannot be expressed in the type system and
 * is not visible in review: **a cue never waits on anything.** It is started
 * synchronously, inside the call that fired it, or it is skipped — never
 * queued behind a promise, because a sound that lands after its tap reads as
 * the app being slow, and that is worse than silence.
 *
 * It has been broken twice. First by a `seekTo(0)` awaited before every
 * `play()`, then by the media players underneath expo-audio, which buffer
 * before they start and put about half a second between a tap and its sound.
 * The module now decodes every clip once into a Web Audio buffer and starts a
 * fresh buffer source per cue, which is what makes the rule cheap to keep.
 *
 * None of that is caught by a typechecker or a linter, and it needs a device
 * to hear. So this drives the real module against a stub audio graph that
 * records every call, under the cases a device only produces occasionally:
 * cues fired before the clips have decoded, cues faster than any clip ends, a
 * decode that finishes after a pack switch, and a graph iOS has suspended.
 *
 * `react-native`, `expo-haptics` and `react-native-audio-api` are stubbed
 * through a resolve hook, so the file under test is the shipped one rather
 * than a copy.
 */

import { registerHooks } from 'node:module';
import { mkdtempSync, writeFileSync, statSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const ROOT = new URL('../', import.meta.url);
const STUBS = mkdtempSync(join(tmpdir(), 'openmacro-feedback-'));

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
  join(STUBS, 'react-native-audio-api.mjs'),
  [
    'import { record, deferDecode, contexts } from ' + HARNESS_URL + ';',
    'let nextSource = 0;',
    'export class AudioContext {',
    "  constructor() { this.state = 'running'; this.destination = { id: 'destination' }; contexts.push(this); record({ call: 'context' }); }",
    "  decodeAudioData(source) { record({ call: 'decode', source }); return deferDecode({ clip: source }); }",
    '  createBufferSource() {',
    "    const node = { id: 's' + nextSource++, buffer: null, connected: false };",
    "    node.connect = (target) => { node.connected = target === this.destination; };",
    "    node.start = () => record({ call: 'start', source: node.id, clip: node.buffer?.clip ?? null, connected: node.connected });",
    '    return node;',
    '  }',
    "  resume() { record({ call: 'resume' }); this.state = 'running'; return Promise.resolve(); }",
    "  close() { record({ call: 'close' }); this.state = 'closed'; return Promise.resolve(); }",
    '}',
    'export const AudioManager = {',
    "  setAudioSessionOptions(options) { record({ call: 'session', options }); },",
    '};',
  ].join('\n'),
);

writeFileSync(
  join(STUBS, 'harness.mjs'),
  `export const calls = [];
   export const contexts = [];
   export const pending = [];
   export function record(entry) { calls.push(entry); }
   export function deferDecode(value) {
     return new Promise((resolve) => pending.push(() => resolve(value)));
   }\n`,
);

const STUB_FOR = {
  'react-native': join(STUBS, 'react-native.mjs'),
  'expo-haptics': join(STUBS, 'expo-haptics.mjs'),
  'react-native-audio-api': join(STUBS, 'react-native-audio-api.mjs'),
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
 * and has no meaning in Node's ESM scope. Handing back the path lets the
 * module load, and lets the stub report which clip a cue started.
 */
globalThis.require = (id) => id;

const harness = await import(pathToFileURL(join(STUBS, 'harness.mjs')).href);
const feedback = await import('@/feedback');

/** Let every in-flight decode finish, in the order it was requested. */
async function settle() {
  while (harness.pending.length > 0) harness.pending.shift()();
  for (let i = 0; i < 4; i++) await Promise.resolve();
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
const reset = () => { harness.calls.length = 0; };
const starts = () => harness.calls.filter((c) => c.call === 'start');

console.log('\nFeedback cues — self-test\n');

console.log('Before the clips have decoded');
feedback.preloadSounds();
const session = harness.calls.find((c) => c.call === 'session');
check(
  'the iOS session obeys the silent switch and ducks nothing',
  session?.options.iosCategory === 'ambient' && session.options.iosOptions.includes('mixWithOthers'),
  JSON.stringify(session?.options),
);
check('every clip of the pack is decoded up front', harness.calls.filter((c) => c.call === 'decode').length === 6);
reset();
feedback.emitFeedback('correct');
check('a cue fired before its clip is ready is skipped, not queued', starts().length === 0);
await settle();
check('…and does not sound late once the decode lands', starts().length === 0);
check('…nor starts a second round of decoding', harness.calls.filter((c) => c.call === 'decode').length === 0);

reset();
console.log('\nThe invariant');
feedback.emitFeedback('correct');
const immediate = starts();
check('a cue starts inside the call that fired it, with nothing awaited', immediate.length === 1);
check('…playing its own clip', immediate[0]?.clip?.includes('/correct.wav') ?? false, immediate[0]?.clip ?? 'none');
check('…through the speakers', immediate[0]?.connected === true);

reset();
console.log('\nCues faster than any clip ends (dragging a slider)');
for (let i = 0; i < 12; i++) feedback.emitFeedback('select');
const burst = starts();
check('12 rapid cues are all heard, none dropped', burst.length === 12, `${burst.length} start(s) for 12 fires`);
check('…each on its own source, so they overlap instead of cutting off', new Set(burst.map((c) => c.source)).size === 12);

reset();
console.log('\nA graph iOS suspended after an interruption');
harness.contexts[0].state = 'suspended';
feedback.emitFeedback('advance');
check('it is resumed', harness.calls.some((c) => c.call === 'resume'));
check('…and the cue still starts at once', starts().length === 1);

reset();
console.log('\nSound switched off');
feedback.setSoundEnabled(false);
feedback.emitFeedback('select');
check('nothing touches the audio graph', harness.calls.length === 0);
feedback.setSoundEnabled(true);
feedback.emitFeedback('select');
check('…and switching it back on works immediately', starts().length === 1);

reset();
console.log('\nSound packs');
check('every pack is offered', feedback.SOUND_PACKS.length >= 2, feedback.SOUND_PACKS.join(', '));
check('an unknown pack name falls back to classic', feedback.toSoundPack('nonsense') === 'classic');
check('an absent pack name falls back to classic', feedback.toSoundPack(undefined) === 'classic');
check('a known pack name is kept', feedback.toSoundPack('arcade') === 'arcade');

feedback.setSoundPack('arcade');
const arcadeDecodes = harness.calls.filter((c) => c.call === 'decode');
check(
  'switching pack decodes the new clips straight away',
  arcadeDecodes.length === 6 && arcadeDecodes.every((c) => c.source.includes('/arcade/')),
);
check('…reusing the one audio graph', harness.contexts.length === 1);
reset();
feedback.emitFeedback('correct');
check('…and stays silent rather than playing an old clip meanwhile', starts().length === 0);

// Switch back before the arcade decodes land: those results are stale.
feedback.setSoundPack('classic');
await settle();
reset();
feedback.emitFeedback('correct');
check(
  'a decode that lands after a switch never plays for the new pack',
  starts().length === 1 && !starts()[0].clip.includes('/arcade/'),
  starts()[0]?.clip ?? 'none',
);

reset();
feedback.setSoundPack('classic');
check('switching to the pack already in use does nothing', harness.calls.length === 0);

console.log('\nStart timing instrumentation');
feedback.setAudioTimingEnabled(false);
reset();
feedback.emitFeedback('correct');
check('with timing off, nothing is recorded', feedback.audioTimingReport() === null);
const withoutTiming = starts().length;

feedback.setAudioTimingEnabled(true);
reset();
feedback.emitFeedback('correct');
check(
  'turning it on does not change what the graph is asked to do',
  starts().length === withoutTiming,
  `${withoutTiming} start(s) off, ${starts().length} on`,
);
check('…and a sample is recorded', (feedback.audioTimingReport()?.samples ?? 0) === 1);

// Drive past the sample ceiling: it must stop on its own rather than grow.
for (let i = 0; i < 400; i++) feedback.emitFeedback('select');
const capped = feedback.audioTimingReport();
check(
  'it stops sampling on its own rather than growing unbounded',
  capped !== null && capped.samples <= 120,
  `${capped?.samples} samples after 400 further cues`,
);
reset();
feedback.emitFeedback('correct');
check('…and cues still play normally once it has stopped', starts().length === 1);
feedback.setAudioTimingEnabled(false);

reset();
console.log('\nReleasing');
feedback.releaseSounds();
check('the audio graph is closed', harness.calls.some((c) => c.call === 'close'));
feedback.emitFeedback('select');
check('…and a cue afterwards rebuilds it instead of failing', harness.contexts.length === 2 && starts().length === 0);

/**
 * The clips are pulled in with `require`, which Metro resolves at bundle time.
 * A mistyped path there does not fail the build — it ships an app with no
 * sound and no error, which is exactly the failure the module's own docblock
 * warns about. So check the paths against the disk.
 */
console.log('\nClip paths');
const moduleSource = readFileSync(new URL('../src/feedback/index.ts', import.meta.url), 'utf8');
const referenced = [...moduleSource.matchAll(/require\('([^']+\.wav)'\)/g)].map((m) => m[1]);
const missing = referenced.filter(
  (relative) => !isFile(new URL(relative.replace(/^\.\.\/\.\.\//, ''), ROOT).href),
);
check(
  'every clip the module requires exists on disk',
  referenced.length > 0 && missing.length === 0,
  missing.length ? `missing: ${missing.join(', ')}` : `${referenced.length} clips`,
);
check(
  'every cue is covered by every pack',
  referenced.length === feedback.SOUND_PACKS.length * 6,
  `${referenced.length} clips for ${feedback.SOUND_PACKS.length} packs`,
);

if (failures === 0) {
  console.log('\x1b[32m%s\x1b[0m', '\n✓ Feedback cues sound — every check passed.\n');
  process.exit(0);
}
console.log('\x1b[31m%s\x1b[0m', `\n✗ ${failures} check(s) failed.\n`);
process.exit(1);
