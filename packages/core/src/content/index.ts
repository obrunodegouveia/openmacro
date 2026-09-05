/**
 * ============================================================================
 * Content — public surface
 * ============================================================================
 *
 * The one import a consumer needs to render a course. Everything here is data
 * and pure functions: no React, no React Native, no DOM, so the mobile app and
 * the website can share it without either dragging in the other's runtime.
 *
 * CONTRIBUTORS: to add a lesson, write it under `lessons/` and register it in
 * `registry.ts`. Nothing in this file needs to change.
 */

export * from './schema';
export * from './registry';
export * from './formulas';
export { validateModules } from './validate';
