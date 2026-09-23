/**
 * Typed, validated access to public environment variables.
 *
 * Expo inlines any variable prefixed `EXPO_PUBLIC_` into the bundle at build
 * time, so `process.env.EXPO_PUBLIC_X` must be written out in full — it cannot
 * be accessed dynamically. That is why each one is spelled out below.
 *
 * Never put a secret in an `EXPO_PUBLIC_` variable: it ships to every device.
 * See `.env.example` for the full list.
 */

function flag(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') return fallback;
  return value === '1' || value.toLowerCase() === 'true';
}

/**
 * Which on-device store backs progress while the learner is signed out.
 *
 * Cloud sync is a separate axis: it switches on when Supabase is configured
 * *and* someone is signed in — see `cloudSyncConfigured` below.
 */
export type DataProviderKind = 'local' | 'mock';

const DATA_PROVIDERS: readonly DataProviderKind[] = ['local', 'mock'];

function dataProviderKind(value: string | undefined): DataProviderKind {
  const match = DATA_PROVIDERS.find((kind) => kind === value);
  if (!match && value) {
    console.warn(
      `[OpenMacro] Unknown EXPO_PUBLIC_DATA_PROVIDER "${value}"; falling back to "local".`,
    );
  }
  return match ?? 'local';
}

/** The feedback clip sets. Mirrors `SOUND_PACKS` in `src/feedback`. */
const SOUND_PACKS = ['classic', 'arcade'] as const;
export type SoundPackName = (typeof SOUND_PACKS)[number];

/**
 * Narrow the sound-pack env var.
 *
 * Kept here rather than imported from `src/feedback` so that reading
 * configuration never drags in the audio stack; the two lists are small,
 * named the same, and a mismatch shows up immediately as a type error at the
 * one place they meet, in `app/_layout.tsx`.
 */
function soundPackName(value: string | undefined): SoundPackName {
  const match = SOUND_PACKS.find((pack) => pack === value);
  if (!match && value) {
    console.warn(`[OpenMacro] Unknown EXPO_PUBLIC_SOUND_PACK "${value}"; falling back to "classic".`);
  }
  return match ?? 'classic';
}

export const env = {
  /**
   * `local` (default) persists to the device via AsyncStorage; `mock` keeps
   * progress in memory only, which is handy for demos and tests.
   */
  dataProvider: dataProviderKind(process.env.EXPO_PUBLIC_DATA_PROVIDER),

  /**
   * Supabase project credentials. Both are safe to ship: the anon key only
   * grants what row-level security allows, which is "your own rows".
   *
   * Leave them blank and OpenMacro runs exactly as before — fully offline,
   * no accounts, no network. That is the default for contributors.
   */
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',

  /** Master switches so contributors can silence feedback while developing. */
  hapticsEnabled: flag(process.env.EXPO_PUBLIC_ENABLE_HAPTICS, true),
  soundEnabled: flag(process.env.EXPO_PUBLIC_ENABLE_SOUND, true),

  /**
   * Which set of feedback clips to play: `classic` (tuned tones, the default)
   * or `arcade` (bent pitches and cartoon drops).
   *
   * A build-time switch rather than a setting, because that is how the other
   * feedback options already work and there is no settings screen to hang a
   * toggle on yet.
   */
  soundPack: soundPackName(process.env.EXPO_PUBLIC_SOUND_PACK),

  /** Runs `validateModules` over the registry on boot. Defaults to on in dev. */
  validateContentOnBoot: flag(process.env.EXPO_PUBLIC_VALIDATE_CONTENT, __DEV__),
} as const;

/**
 * True when this build has somewhere to sync to. Gates every piece of account
 * UI: with no Supabase project configured the app never mentions signing in.
 */
export const cloudSyncConfigured: boolean =
  env.supabaseUrl.length > 0 && env.supabaseAnonKey.length > 0;
