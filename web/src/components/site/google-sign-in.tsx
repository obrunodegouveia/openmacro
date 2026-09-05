"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/ui/icons";
import { GOOGLE_CLIENT_ID, ensureGoogleInitialized } from "@/lib/google-identity";
import { useAuth } from "@/components/site/auth-provider";

/**
 * The sign-in control.
 *
 * Renders Google's own button, which is the only way to obtain an ID token
 * in-page — and the reason to want one is that Google's consent screen then
 * names openmacro.org instead of the Supabase project URL.
 *
 * The credential is handled centrally by the auth provider, not here: the
 * Google callback is global, so a page with two buttons cannot tell which one
 * was pressed. This component only renders a button and, if asked, navigates
 * once a learner appears.
 *
 * If the script cannot load — an extension blocks it, or the network is down —
 * it falls back to our own button and the redirect flow. Sign-in still works
 * there; the consent screen just shows the Supabase host again.
 */
export function GoogleSignIn({
  /** Where to go once signed in. Omit to stay put, which is what a lesson wants. */
  redirectTo,
  /** Label for the fallback button. */
  fallbackLabel = "Continue with Google",
  className,
}: {
  redirectTo?: string;
  fallbackLabel?: string;
  className?: string;
}) {
  const router = useRouter();
  const { signIn, signingIn, learner, error } = useAuth();
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [mode, setMode] = React.useState<"loading" | "google" | "fallback">(
    GOOGLE_CLIENT_ID ? "loading" : "fallback",
  );

  React.useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;

    ensureGoogleInitialized(GOOGLE_CLIENT_ID)
      .then((google) => {
        if (cancelled || !hostRef.current) return;
        google.accounts.id.renderButton(hostRef.current, {
          type: "standard",
          theme: "filled_black",
          size: "large",
          text: "continue_with",
          shape: "pill",
          logo_alignment: "left",
          width: 300,
        });
        setMode("google");
      })
      .catch(() => {
        if (!cancelled) setMode("fallback");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Navigate once sign-in actually lands.
   *
   * Watching the learner rather than the callback keeps this correct however
   * the session arrived — the in-page token, the redirect fallback, or a
   * session restored in another tab.
   */
  const signedIn = Boolean(learner);
  const wasSignedIn = React.useRef(signedIn);
  React.useEffect(() => {
    if (redirectTo && signedIn && !wasSignedIn.current) router.push(redirectTo);
    wasSignedIn.current = signedIn;
  }, [signedIn, redirectTo, router]);

  return (
    <div className={className}>
      {/* Google renders into this node, which stays mounted so the handle is stable. */}
      <div ref={hostRef} hidden={mode !== "google"} />

      {/*
        If the token exchange fails — Supabase rejecting the audience, a clock
        skew, a network blip — the in-page path is a dead end with no way out.
        Showing the redirect button alongside the error means there is always a
        working way to sign in, even if this flow turns out to be misconfigured.
      */}
      {mode !== "google" || error ? (
        <Button
          size="lg"
          disabled={mode === "loading" || signingIn}
          onClick={() => void signIn(redirectTo)}
        >
          <GoogleIcon className="size-4" aria-hidden />
          {signingIn ? "Opening Google" : error ? "Continue with Google" : fallbackLabel}
        </Button>
      ) : null}

      {error ? (
        <p role="alert" className="mt-3 max-w-sm text-sm leading-relaxed text-coral">
          {error} — try the button above, which uses the older redirect sign-in.
        </p>
      ) : null}
    </div>
  );
}
