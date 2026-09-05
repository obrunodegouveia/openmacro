/**
 * ============================================================================
 * Authentication
 * ============================================================================
 *
 * Wraps Supabase's Google OAuth in a shape the rest of the app can use without
 * knowing which platform it is on, or whether accounts exist in this build at
 * all.
 *
 * When no Supabase project is configured, `enabled` is false, `session` stays
 * null, and every account affordance in the UI hides itself. That is the
 * default for a fresh clone: OpenMacro still runs, fully offline, with no
 * mention of signing in.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import type { Session } from '@supabase/supabase-js';

import { cloudSyncConfigured } from '@/config/env';
import { supabase } from '@/services/supabaseClient';
import type { CloudIdentity } from '@/services/supabaseDataProvider';

interface AuthContextValue {
  /** False when this build has no Supabase project — hide all account UI. */
  enabled: boolean;
  /** True until the stored session has been restored. */
  loading: boolean;
  session: Session | null;
  identity: CloudIdentity | null;
  /** True while a sign-in round trip is in flight. */
  signingIn: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Pulls a display name and avatar out of whatever Google returned. */
function readIdentity(session: Session | null): CloudIdentity | null {
  if (!session) return null;
  const meta = session.user.user_metadata as Record<string, unknown>;
  const pick = (key: string): string | null =>
    typeof meta[key] === 'string' && meta[key] ? (meta[key] as string) : null;

  return {
    userId: session.user.id,
    displayName: pick('full_name') ?? pick('name') ?? session.user.email ?? 'Learner',
    avatarUrl: pick('avatar_url') ?? pick('picture'),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(cloudSyncConfigured);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;

    // Restore whatever is on disk, then follow every change. `onAuthStateChange`
    // also fires for the token refreshes that keep a long session alive.
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return;
    setSigningIn(true);
    setError(null);
    try {
      if (Platform.OS === 'web') {
        // The browser navigates away to Google and comes back to this origin;
        // `detectSessionInUrl` then completes the handshake on load.
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin },
        });
        if (oauthError) throw oauthError;
        return;
      }

      // Native: open a system auth session, then exchange the returned code
      // ourselves — nothing navigates, so there is no URL for the client to
      // detect a session in.
      const redirectTo = makeRedirectUri({ scheme: 'openmacro', path: 'auth-callback' });
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (oauthError) throw oauthError;
      if (!data.url) throw new Error('Google did not return a sign-in URL.');

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type !== 'success') return; // dismissed or cancelled — not an error

      const code = new URL(result.url).searchParams.get('code');
      if (!code) throw new Error('Google did not return an authorisation code.');

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) throw exchangeError;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not sign in with Google.');
    } finally {
      setSigningIn(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    setError(null);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) setError(signOutError.message);
  }, []);

  /**
   * Memoised on the identity's *values*, not on the session object.
   *
   * `onAuthStateChange` hands back a fresh session object on every token
   * refresh, and a new identity object each time would cascade: consumers
   * rebuild the data provider, which drops its cache and re-reads the network.
   * Keying on the three fields we actually use keeps the reference stable for
   * as long as the learner is the same person.
   */
  const raw = readIdentity(session);
  const userId = raw?.userId ?? null;
  const displayName = raw?.displayName ?? null;
  const avatarUrl = raw?.avatarUrl ?? null;

  const identity = useMemo<CloudIdentity | null>(
    () => (userId ? { userId, displayName: displayName ?? 'Learner', avatarUrl } : null),
    [userId, displayName, avatarUrl],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      enabled: cloudSyncConfigured,
      loading,
      session,
      identity,
      signingIn,
      error,
      signInWithGoogle,
      signOut,
    }),
    [loading, session, identity, signingIn, error, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>.');
  }
  return context;
}
