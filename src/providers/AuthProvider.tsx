/**
 * ============================================================================
 * Authentication
 * ============================================================================
 *
 * Wraps Supabase's sign-in in a shape the rest of the app can use without
 * knowing which platform it is on, or whether accounts exist in this build at
 * all.
 *
 * When no Supabase project is configured, `enabled` is false, `session` stays
 * null, and every account affordance in the UI hides itself. That is the
 * default for a fresh clone: OpenMacro still runs, fully offline, with no
 * mention of signing in.
 *
 * ---------------------------------------------------------------------------
 * WHY THERE ARE TWO PROVIDERS
 * ---------------------------------------------------------------------------
 *
 * App Store guideline 4.8. An app that offers a third-party login service has
 * to offer an alternative that collects no more than name and email, lets the
 * learner withhold the real email, and does not use the sign-in to track them.
 * Sign in with Apple is that alternative, and Google on its own is a rejection.
 *
 * The two take different routes on purpose. Google has no native SDK here, so
 * it opens a system auth session and we exchange the returned code. Apple is
 * a native sheet that hands back an identity token directly, so there is no
 * browser, no redirect, and nothing to exchange — which is also why it works
 * on a device with no default browser configured.
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
import * as AppleAuthentication from 'expo-apple-authentication';
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
  /**
   * Whether this device can offer Sign in with Apple. False everywhere but a
   * real iOS 13+ device or simulator, and false in a build with no Supabase
   * project, so the button simply is not rendered rather than rendered broken.
   */
  appleAvailable: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Pulls a display name and avatar out of whatever the provider returned.
 *
 * Apple sends neither. Its identity token carries an email — often a private
 * relay address — and nothing else, so the fallback chain ends at the email and
 * `signInWithApple` writes `full_name` itself on the one occasion Apple hands
 * a name over. Google sends all three every time.
 */
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
  const [appleAvailable, setAppleAvailable] = useState(false);

  /**
   * Asked once, not assumed from `Platform.OS`. Apple sign-in needs iOS 13,
   * and the entitlement has to have made it into the binary — a build where
   * the config plugin did not run answers false here, which is exactly when
   * you want to find out before a learner taps the button.
   */
  useEffect(() => {
    if (!supabase || Platform.OS !== 'ios') return;
    let live = true;
    void AppleAuthentication.isAvailableAsync().then((available) => {
      if (live) setAppleAvailable(available);
    });
    return () => {
      live = false;
    };
  }, []);

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

  /**
   * Native Apple sign-in: the system sheet returns a signed identity token and
   * Supabase verifies it against Apple's public keys and this app's bundle id.
   *
   * No nonce is sent. Apple only puts a nonce claim in the token if you ask it
   * to, and Supabase only validates one if you pass it back, so adding one
   * means hashing it with a second native module for a replay window that is
   * already closed by the token's five-minute expiry and its audience check.
   * If that module arrives for another reason, this is the place to use it.
   *
   * `fullName` is the part that surprises people: Apple sends it on the very
   * first authorisation for this app and never again. If we do not store it
   * now, the learner is their email address forever — which, behind a private
   * relay, is a string of random characters.
   */
  const signInWithApple = useCallback(async () => {
    if (!supabase) return;
    setSigningIn(true);
    setError(null);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('Apple did not return an identity token.');
      }

      const { error: signInError } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });
      if (signInError) throw signInError;

      const name = [credential.fullName?.givenName, credential.fullName?.familyName]
        .filter(Boolean)
        .join(' ')
        .trim();
      if (name) {
        // Best effort. A failure here costs a display name, not a session, so
        // it must not surface as a sign-in error.
        await supabase.auth.updateUser({ data: { full_name: name } });
      }
    } catch (cause) {
      // Tapping Cancel on the sheet is a decision, not a failure.
      const code = (cause as { code?: string } | null)?.code;
      if (code === 'ERR_REQUEST_CANCELED' || code === 'ERR_CANCELED') return;
      setError(cause instanceof Error ? cause.message : 'Could not sign in with Apple.');
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
      appleAvailable,
      signInWithGoogle,
      signInWithApple,
      signOut,
    }),
    [
      loading,
      session,
      identity,
      signingIn,
      error,
      appleAvailable,
      signInWithGoogle,
      signInWithApple,
      signOut,
    ],
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
