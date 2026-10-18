/**
 * `@openmacro/seasons/native`: seasons for React Native and Expo.
 *
 * Wrap the app in `SeasonProvider`, place the decorations (`SeasonAtmosphere`,
 * `SeasonToy`, `SeasonSky`, …) where they belong, and map the palette roles
 * onto your theme. The primitives underneath (`SkyGlow`, `ParticleField`,
 * `DraggableToy`, …) are exported too, for drawing something the
 * composition does not.
 *
 * Needs react-native, react-native-reanimated (4, with react-native-worklets)
 * and react-native-gesture-handler, all of which Expo ships in every
 * binary: no new native code, so seasons ship as an over-the-air update.
 * Haptics are a callback (`expoHaptics` adapts expo-haptics), never an
 * import.
 */

export {
  SeasonProvider,
  chromeFromPalette,
  useSeason,
  useSeasonContext,
  useSeasonEmoji,
  useSeasonMusic,
  useSeasonScheme,
  useSeasonSettings,
  type ActiveSeason,
  type FeedbackKind,
  type NativeSeasonArt,
  type SeasonChrome,
  type SeasonProviderProps,
} from './context.tsx';
export {
  SeasonAtmosphere,
  SeasonBurst,
  SeasonCardCorner,
  SeasonFooter,
  SeasonGarland,
  SeasonGreeting,
  SeasonIcon,
  SeasonRain,
  SeasonScreenCorner,
  SeasonSky,
  SeasonToy,
  useAwake,
} from './decor.tsx';
export { expoHaptics, type HapticsModule } from './haptics.ts';
export { SeasonWelcome } from './welcome.tsx';

// The primitives: plain props in, pixels out.
export { BeachBall } from './visuals/BeachBall.tsx';
export { Burst } from './visuals/Burst.tsx';
export { CandleGlow } from './visuals/CandleGlow.tsx';
export { DraggableToy } from './visuals/DraggableToy.tsx';
export { EmojiRain } from './visuals/EmojiRain.tsx';
export { FairyLights } from './visuals/FairyLights.tsx';
export { Flyer } from './visuals/Flyer.tsx';
export { FrostRim } from './visuals/FrostRim.tsx';
export { Mist } from './visuals/Mist.tsx';
export { MAX_PARTICLES, ParticleField, type ParticleLayer } from './visuals/ParticleField.tsx';
export { Scatter } from './visuals/Scatter.tsx';
export { HIDDEN, hash, rgba } from './visuals/shared.ts';
export { SkyGlow, glowGradient, type Glow } from './visuals/SkyGlow.tsx';
export { SnowCap } from './visuals/SnowCap.tsx';
export { Sun } from './visuals/Sun.tsx';
export { WelcomeStage, type WelcomeColors, type WelcomeMotes } from './visuals/WelcomeStage.tsx';
