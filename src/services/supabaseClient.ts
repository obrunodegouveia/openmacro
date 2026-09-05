/**
 * The Supabase client, or `null` when this build has no project configured.
 *
 * OpenMacro must stay clone-and-run: a contributor with an empty `.env` gets
 * the fully offline app, so every consumer of this module has to handle the
 * `null` case rather than assume a client exists.
 */

import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { cloudSyncConfigured, env } from '@/config/env';

function create(): SupabaseClient | null {
  if (!cloudSyncConfigured) return null;

  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      // Native has no localStorage; on web the library's own default (real
      // localStorage) is what the OAuth redirect handshake expects.
      ...(Platform.OS === 'web' ? {} : { storage: AsyncStorage }),
      autoRefreshToken: true,
      persistSession: true,
      /**
       * PKCE, not the library default of `implicit`.
       *
       * Implicit flow returns the session in the URL *fragment*, which a
       * native app cannot read back from `openAuthSessionAsync` and which
       * `exchangeCodeForSession` cannot consume — the native sign-in in
       * `AuthProvider` would fail on every attempt. PKCE returns `?code=`,
       * which both platforms handle: web via `detectSessionInUrl`, native via
       * the explicit exchange. It is also the flow Supabase recommends for
       * mobile, since the code is useless without the locally-held verifier.
       */
      flowType: 'pkce',
      // Only the web build ever comes back from Google with the session in the
      // URL. On native we exchange the code ourselves — see `AuthProvider`.
      detectSessionInUrl: Platform.OS === 'web',
    },
  });
}

export const supabase: SupabaseClient | null = create();

/**
 * Token refresh is driven by a timer, which the OS suspends in the background.
 * Stopping and restarting it around foreground transitions avoids a burst of
 * failed refreshes when the app wakes up. Not needed on web.
 */
if (supabase && Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      void supabase.auth.startAutoRefresh();
    } else {
      void supabase.auth.stopAutoRefresh();
    }
  });
}
