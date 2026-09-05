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
  /**
   * The redirect flow. Kept as a fallback for browsers where Google's script
   * cannot load — it works, but the consent screen shows the Supabase host.
   *
   * Optional path to land on afterwards; defaults to the current page.
   */
  signIn: (redirectTo?: string) => Promise<void>;
  /**
   * The preferred path: an ID token obtained in-page, verified by Supabase.
   * No redirect, and Google's consent screen names this site.
   */
  signInWithGoogleCredential: (credential: string, nonce: string) => Promise<void>;
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

  const signInWithGoogleCredential = React.useCallback(
    async (credential: string, nonce: string) => {
      const supabase = getSupabase();
      if (!supabase) throw new Error("Accounts are not configured in this build.");

      setSigningIn(true);
      setError(null);
      try {
        const { error: idError } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: credential,
          // Raw nonce: Supabase checks it hashes to the value inside the token.
          nonce,
        });
        if (idError) throw idError;
      } catch (cause) {
        const message =
          cause instanceof Error ? cause.message : "Could not sign in.";
        setError(message);
        throw new Error(message);
      } finally {
        setSigningIn(false);
      }
    },
    [],
  );

  /**
   * Google's credential callback is global to the page, so one subscription
   * here handles whichever button was pressed. Doing it per-button would mean
   * every mounted button racing to exchange the same token.
   */
  React.useEffect(
    () =>
      onGoogleCredential((credential, nonce) => {
        void signInWithGoogleCredential(credential, nonce).catch(() => {
          // The provider already surfaced the message through `error`.
        });
      }),
    [signInWithGoogleCredential],
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
      signInWithGoogleCredential,
      signOut,
    }),
    [loading, learner, signingIn, error, signIn, signInWithGoogleCredential, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an <AuthProvider>.");
  return context;
}
