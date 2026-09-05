"use client";

import * as React from "react";
import type { Session } from "@supabase/supabase-js";
import { cloudSyncConfigured, getSupabase } from "@/lib/supabase";
import { onGoogleCredential } from "@/lib/google-identity";

export interface Learner {
  id: string;
  name: string;
  avatarUrl: string | null;
}

interface AuthValue {
  /** False when this build has no Supabase project — hide all account UI. */
  enabled: boolean;
  /** True until the stored session has been restored. */
  loading: boolean;
  learner: Learner | null;
  signingIn: boolean;
  error: string | null;
  /** Optional path to land on afterwards; defaults to the current page. */
  signIn: (redirectTo?: string) => Promise<void>;
  /** Where an in-page sign-in should land. Set by whichever button is used. */
  setSignInDestination: (path: string | undefined) => void;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthValue | null>(null);

function toLearner(session: Session | null): Learner | null {
  if (!session) return null;
  const meta = session.user.user_metadata as Record<string, unknown>;
  const pick = (key: string) =>
    typeof meta[key] === "string" && meta[key] ? (meta[key] as string) : null;

  return {
    id: session.user.id,
    name: pick("full_name") ?? pick("name") ?? session.user.email ?? "Learner",
    avatarUrl: pick("avatar_url") ?? pick("picture"),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(cloudSyncConfigured);
  const [signingIn, setSigningIn] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const signIn = React.useCallback(async (redirectTo?: string) => {
    const supabase = getSupabase();
    if (!supabase) return;
    setSigningIn(true);
    setError(null);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          /**
           * Default to the page they were on, so signing in mid-lesson does not
           * dump them on the home page. A caller that has somewhere better to
           * send them — the sign-in page, which means the dashboard — passes it.
           *
           * Resolved against the current origin so a caller can only ever
           * redirect within this site.
           */
          redirectTo: redirectTo
            ? new URL(redirectTo, window.location.origin).toString()
            : window.location.href,
        },
      });
      if (oauthError) throw oauthError;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign in.");
      setSigningIn(false);
    }
  }, []);

  /**
   * Where to go after an in-page sign-in.
   *
   * Held here rather than in the button, because Google's credential callback
   * is global to the page and cannot tell which button was pressed.
   */
  const destination = React.useRef<string | undefined>(undefined);
  const setSignInDestination = React.useCallback((path: string | undefined) => {
    destination.current = path;
  }, []);

  /**
   * Exchanges a Google ID token for a Supabase session.
   *
   * The nonce is tried three ways, and that is deliberate rather than lazy.
   * Supabase verifies the nonce against the token's claim, but which form it
   * expects — the raw value or the SHA-256 the token actually carries — is not
   * something this codebase should be guessing at, and guessing wrong is
   * exactly what silently broke sign-in before. Each attempt is a single
   * request and only failures cost anything.
   *
   * If every attempt fails, the redirect flow is started rather than leaving
   * the learner with a button that does nothing. That is the property that
   * matters: this path can be wrong without anyone being locked out.
   */
  const exchangeGoogleCredential = React.useCallback(
    async (credential: string, nonce: { raw: string; hashed: string }) => {
      const supabase = getSupabase();
      if (!supabase) return;

      setSigningIn(true);
      setError(null);

      const attempts: (string | undefined)[] = [nonce.raw, nonce.hashed, undefined];
      let lastMessage = "Could not sign in.";

      for (const candidate of attempts) {
        const { error: idError } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: credential,
          ...(candidate ? { nonce: candidate } : {}),
        });
        if (!idError) {
          setSigningIn(false);
          return;
        }
        lastMessage = idError.message;
      }

      // Every in-page attempt failed. Fall back rather than dead-end.
      setError(`${lastMessage} — falling back to the standard Google sign-in.`);
      await signIn(destination.current);
    },
    [signIn],
  );

  React.useEffect(
    () => onGoogleCredential((credential, nonce) => void exchangeGoogleCredential(credential, nonce)),
    [exchangeGoogleCredential],
  );

  const signOut = React.useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) setError(signOutError.message);
  }, []);

  /**
   * Memoised on the learner's *values*, not the session object: a token
   * refresh hands back a new session, and a new learner object each time would
   * cascade into consumers re-fetching progress on a timer.
   */
  const raw = toLearner(session);
  const id = raw?.id ?? null;
  const name = raw?.name ?? null;
  const avatarUrl = raw?.avatarUrl ?? null;

  const learner = React.useMemo<Learner | null>(
    () => (id ? { id, name: name ?? "Learner", avatarUrl } : null),
    [id, name, avatarUrl],
  );

  const value = React.useMemo<AuthValue>(
    () => ({
      enabled: cloudSyncConfigured,
      loading,
      learner,
      signingIn,
      error,
      signIn,
      setSignInDestination,
      signOut,
    }),
    [loading, learner, signingIn, error, signIn, setSignInDestination, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an <AuthProvider>.");
  return context;
}
