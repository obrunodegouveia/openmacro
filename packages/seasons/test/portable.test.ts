/**
 * The package must stay portable: nothing in `src/` may import from the app
 * that hosts it. Only relative imports, Node built-ins and the declared peer
 * (react) are allowed, so the folder can be lifted into any other project.
 */

import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const src = join(import.meta.dirname, '..', 'src');
const pkg = JSON.parse(readFileSync(join(import.meta.dirname, '..', 'package.json'), 'utf8')) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};
const allowed = new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})]);

test('src imports only itself and declared peers', () => {
  for (const file of readdirSync(src).filter((name) => name.endsWith('.ts'))) {
    const code = readFileSync(join(src, file), 'utf8');
    for (const match of code.matchAll(/\bfrom\s+['"]([^'"]+)['"]|\bimport\(\s*['"]([^'"]+)['"]\s*\)/g)) {
      const spec = match[1] ?? match[2]!;
      if (spec.startsWith('./') || spec.startsWith('node:')) continue;
      const name = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]!;
      assert.ok(allowed.has(name), `${file} imports "${spec}", which is not a declared dependency or peer`);
    }
  }
});

test('src never names the host app', () => {
  for (const file of readdirSync(src).filter((name) => name.endsWith('.ts'))) {
    const code = readFileSync(join(src, file), 'utf8');
    assert.doesNotMatch(code, /from\s+['"]@\/|@openmacro\/core/, `${file} reaches into the host app`);
  }
});
