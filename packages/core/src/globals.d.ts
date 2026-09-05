/**
 * ============================================================================
 * The platform surface this package is allowed to touch
 * ============================================================================
 *
 * `packages/core` runs inside React Native, inside a browser and inside Node
 * (the content validator), so it may only use globals that all three provide.
 *
 * Declaring them by hand rather than pulling in `lib: ["DOM"]` or `@types/node`
 * is deliberate: those would silently make `document`, `window` and `fs`
 * type-check here, and the first accidental use would only be discovered when
 * the mobile app crashed. With this file, anything beyond the two entries below
 * fails `tsc -p packages/core` — which CI runs.
 */

declare const console: {
  warn(...data: unknown[]): void;
  error(...data: unknown[]): void;
};

declare const process: {
  env: { NODE_ENV?: string };
};
