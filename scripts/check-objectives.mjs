#!/usr/bin/env node
/**
 * ============================================================================
 * Simulation objectives self-test — `npm run check:objectives`
 * ============================================================================
 *
 * Every `interactive_sim` sets the learner a target: get this readout above
 * or below that number. `lint:content` checks the target names a readout that
 * exists and that the sliders can stop on the values the objective asks to be
 * observed. It does not check the only thing that matters — that some
 * combination of slider positions actually satisfies the target.
 *
 * An impossible objective is invisible from every angle. It typechecks, it
 * validates, it renders, and the simulation works perfectly. The learner
 * simply cannot finish it, and has no way to tell whether that is the puzzle
 * or a bug. The failure is indistinguishable from being bad at it, which is
 * the worst property a teaching tool can have.
 *
 * So this drives the real formulas through the real engine and searches for a
 * satisfying assignment. The search is over each slider's extremes and its
 * default rather than the full grid — the full cross-product of 43
 * simulations is astronomically large, and readouts here are monotone or
 * near-monotone in their inputs, so an optimum lives at a corner. A target
 * that needs an interior combination would be reported as unreachable when it
 * is merely awkward; that is the intended direction to be wrong in.
 */

import { registerHooks } from 'node:module';
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = new URL('../', import.meta.url);
const isFile = (url) => {
  try {
    return statSync(fileURLToPath(url)).isFile();
  } catch {
    return false;
  }
};
const firstExisting = (base) =>
  [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`].find(isFile) ?? null;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@openmacro/core/')) {
      const resolved = firstExisting(
        new URL(`packages/core/src/${specifier.slice('@openmacro/core/'.length)}`, ROOT).href,
      );
      if (resolved) return { url: resolved, shortCircuit: true };
    }
    if (specifier.startsWith('.') && context.parentURL) {
      const target = new URL(specifier, context.parentURL).href;
      if (target.endsWith('.json') && isFile(target)) {
        return { url: target, shortCircuit: true, importAttributes: { type: 'json' } };
      }
      const resolved = firstExisting(target);
      if (resolved) return { url: resolved, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});

const { MODULES } = await import('@openmacro/core/content/registry');
const { evaluateReadouts } = await import('@openmacro/core/engine/simulation');

/** The engine's five comparators, and no others — an unknown one must fail. */
const COMPARE = {
  gte: (a, b) => a >= b,
  lte: (a, b) => a <= b,
  gt: (a, b) => a > b,
  lt: (a, b) => a < b,
  eq: (a, b) => Math.abs(a - b) < 1e-9,
};

/** A slider's extremes and its default — where an optimum lives. */
function probeValues(slider) {
  const steps = Math.floor((slider.max - slider.min) / slider.step);
  const top = Number((slider.min + steps * slider.step).toFixed(10));
  return [...new Set([slider.min, top, slider.defaultValue])];
}

let checked = 0;
let failures = 0;

console.log('\nSimulation objectives — can they actually be finished?\n');

for (const module of MODULES) {
  for (const lesson of module.lessons) {
    for (const challenge of lesson.challenges) {
      if (challenge.type !== 'interactive_sim') continue;
      const target = challenge.objective.target;
      if (!target) continue;
      checked += 1;

      const compare = COMPARE[target.comparator];
      if (!compare) {
        failures += 1;
        console.log(`  \x1b[31m✗\x1b[0m ${lesson.id} / ${challenge.id}`);
        console.log(`      unknown comparator "${target.comparator}"`);
        continue;
      }

      const axes = challenge.sliders.map((slider) => ({
        key: slider.key,
        values: probeValues(slider),
      }));

      let reachable = false;
      let best = null;
      const walk = (index, values) => {
        if (reachable) return;
        if (index === axes.length) {
          const value = evaluateReadouts(challenge, values)[target.readoutKey];
          if (!Number.isFinite(value)) return;
          if (best === null || Math.abs(value - target.value) < Math.abs(best - target.value)) {
            best = value;
          }
          if (compare(value, target.value)) reachable = true;
          return;
        }
        for (const value of axes[index].values) {
          walk(index + 1, { ...values, [axes[index].key]: value });
        }
      };
      walk(0, {});

      if (!reachable) {
        failures += 1;
        console.log(`  \x1b[31m✗\x1b[0m ${lesson.id} / ${challenge.id}`);
        console.log(
          `      needs ${target.readoutKey} ${target.comparator} ${target.value}, ` +
            `closest reachable ${Number(best).toPrecision(4)}`,
        );
      }
    }
  }
}

if (failures === 0) {
  console.log(`  \x1b[32m✓\x1b[0m all ${checked} objectives can be satisfied\n`);
  process.exit(0);
}
console.log('\x1b[31m%s\x1b[0m', `\n✗ ${failures} of ${checked} objectives cannot be finished.\n`);
process.exit(1);
