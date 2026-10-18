/**
 * The package must stay portable: nothing in `src/` may import from the app
 * that hosts it. Only relative imports, Node built-ins and the declared
 * peers are allowed, so the folder can be lifted into any other project.
 *
 * Every entry point is covered, at any depth: the engine, `presets`,
 * `native` and `web`. On top of that, each part may only reach the peers it
 * is documented to need: the engine, the presets and the web's server half
 * none at all, `native` only React Native's, `web` only React.
 */

import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { test } from 'node:test';

const root = join(import.meta.dirname, '..');
const src = join(root, 'src');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  exports: Record<string, string>;
};
const allowed = new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})]);

/**
 * Every source file under a folder.
 *
 * @param dir The folder.
 * @return Absolute paths of its `.ts` and `.tsx` files, at any depth.
 */
function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sources(path);
    return /\.tsx?$/.test(name) ? [path] : [];
  });
}

/**
 * A file's code without its comments, so examples in docblocks are not
 * mistaken for imports.
 *
 * @param file The file.
 * @return The code.
 */
function code(file: string): string {
  return readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

/**
 * The bare package names a file imports (relative and `node:` imports left out).
 *
 * @param file The file.
 * @return Each import's specifier and its package name.
 */
function imports(file: string): { spec: string; name: string }[] {
  const source = code(file);
  const found: { spec: string; name: string }[] = [];
  for (const match of source.matchAll(/\bfrom\s+['"]([^'"]+)['"]|\bimport\(\s*['"]([^'"]+)['"]\s*\)|^\s*import\s+['"]([^'"]+)['"]/gm)) {
    const spec = match[1] ?? match[2] ?? match[3]!;
    if (spec.startsWith('.') || spec.startsWith('node:')) continue;
    found.push({ spec, name: spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]! });
  }
  return found;
}

/**
 * Which part of the package a source file belongs to.
 *
 * @param path The file, relative to `src/`.
 * @return Its part.
 */
function part(path: string): 'engine' | 'presets' | 'native' | 'web' | 'web-server' | 'react' {
  if (path === 'react.ts') return 'react';
  if (path === 'web.ts') return 'web';
  if (['web/boot.ts', 'web/attributes.ts', 'web/palette.ts'].includes(path)) return 'web-server';
  const top = path.split('/')[0]!;
  if (top === 'presets' || top === 'native' || top === 'web') return top;
  return 'engine';
}

const files = sources(src);

test('there is something to check in every entry point', () => {
  for (const folder of ['presets', 'native', 'web']) {
    assert.ok(files.some((file) => relative(src, file).startsWith(`${folder}/`)), `no sources in src/${folder}`);
  }
});

test('src imports only itself and declared peers', () => {
  for (const file of files) {
    for (const { spec, name } of imports(file)) {
      assert.ok(allowed.has(name), `${relative(root, file)} imports "${spec}", which is not a declared dependency or peer`);
    }
  }
});

test('src never names the host app or a framework', () => {
  for (const file of files) {
    assert.doesNotMatch(code(file), /from\s+['"]@\/|@openmacro\/core|['"]expo-router|['"]next\//, `${relative(root, file)} reaches into the host app or a framework`);
  }
});

test('each part reaches only the peers it is documented to need', () => {
  const peers: Record<ReturnType<typeof part>, ReadonlySet<string>> = {
    engine: new Set(),
    presets: new Set(),
    'web-server': new Set(),
    react: new Set(['react']),
    native: new Set(['react', 'react-native', 'react-native-reanimated', 'react-native-gesture-handler', 'react-native-worklets']),
    web: new Set(['react']),
  };
  for (const file of files) {
    const path = relative(src, file);
    const which = part(path);
    for (const { spec, name } of imports(file)) assert.ok(peers[which].has(name), `${path} (${which}) imports "${spec}"`);
  }
});

test('the web never reaches native code, and native never the DOM renderer', () => {
  for (const file of files) {
    const path = relative(src, file);
    const relatives = [...code(file).matchAll(/from\s+['"](\.[^'"]+)['"]/g)].map((m) => m[1]!);
    if (part(path) === 'web' || part(path) === 'web-server') assert.ok(!relatives.some((spec) => spec.includes('native/')), `${path} imports native code`);
    if (part(path) === 'native') assert.ok(!relatives.some((spec) => spec.includes('web/')), `${path} imports web code`);
  }
});

test('every export resolves to a file that exists', () => {
  for (const [entry, target] of Object.entries(pkg.exports)) {
    assert.doesNotThrow(() => statSync(join(root, target)), `export "${entry}" points at a missing ${target}`);
  }
});
