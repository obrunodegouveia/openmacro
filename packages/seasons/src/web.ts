/**
 * `@openmacro/seasons/web`: seasons for React on the web (Next.js, Vite,
 * Remix, anything that renders React DOM).
 *
 * 1. Inline `createBootScript` and `paletteCss` in your root layout, so the
 *    right palette is there on the first paint of a static page.
 * 2. Import `@openmacro/seasons/web/styles.css` once.
 * 3. Wrap the app in `SeasonProvider` and mount `SeasonLayer` (lazily).
 * 4. Place the small ones where they belong: `SeasonFooter`,
 *    `SeasonGreeting`, `SeasonIcon`, `SeasonBurst`, `SeasonCardEdge`,
 *    `SeasonRain`, `SeasonWelcome`.
 *
 * Needs only React. The server half (the boot script, the palette CSS) is
 * also at `@openmacro/seasons/web/boot`, with no React at all; the provider
 * and hooks alone at `@openmacro/seasons/web/provider`, with no visuals.
 */

export * from './web/boot.ts';
export * from './web/provider.ts';
export { SeasonBurst, SeasonCardEdge, SeasonFooter, SeasonRain, SeasonWelcome } from './web/decor.tsx';
export { SeasonLayer } from './web/layer.tsx';

// The primitives: plain props in, pixels out.
export { BeachBall } from './web/visuals/beach-ball.tsx';
export { Burst } from './web/visuals/burst.tsx';
export { CandleGlow } from './web/visuals/candle-glow.tsx';
export { DraggableToy } from './web/visuals/draggable-toy.tsx';
export { FairyLights } from './web/visuals/fairy-lights.tsx';
export { Flyer } from './web/visuals/flyer.tsx';
export { FrostRim } from './web/visuals/frost-rim.tsx';
export { Mist } from './web/visuals/mist.tsx';
export { MAX_FIELD, ParticleField, type FieldLayer } from './web/visuals/particle-field.tsx';
export { hash, rgba, useVisualsRuntime, type ByScheme, type Vars } from './web/visuals/runtime.ts';
export { Scatter } from './web/visuals/scatter.tsx';
export { SkyGlow, type SkyGlowSpot } from './web/visuals/sky-glow.tsx';
export { SnowCap } from './web/visuals/snow-cap.tsx';
export { Sun } from './web/visuals/sun.tsx';
export { WelcomeStage, type WelcomeMotes } from './web/visuals/welcome-stage.tsx';
