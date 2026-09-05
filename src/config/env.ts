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

  /** Runs `validateModules` over the registry on boot. Defaults to on in dev. */
  validateContentOnBoot: flag(process.env.EXPO_PUBLIC_VALIDATE_CONTENT, __DEV__),
} as const;

/**
 * True when this build has somewhere to sync to. Gates every piece of account
 * UI: with no Supabase project configured the app never mentions signing in.
 */
export const cloudSyncConfigured: boolean =
  env.supabaseUrl.length > 0 && env.supabaseAnonKey.length > 0;
