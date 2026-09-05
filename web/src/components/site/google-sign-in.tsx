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
 * Uses Google Identity Services so the token is obtained in-page — that is
 * what makes Google's consent screen name openmacro.org instead of the
 * Supabase project URL.
 *
 * Google's own button is rendered, but kept off screen and driven by ours.
 * Two reasons:
 *
 *   1. It ignores `hl` and follows the viewer's Google *account* language, so
 *      an English page could show a Greek button. Wrapping it puts the wording
 *      back under our control.
 *   2. It cannot be styled, and the hero's call to action is not "Continue
 *      with Google", it is "Sign in to start learning".
 *
 * `renderButton` produces same-origin DOM — a `div[role="button"]` — so
 * forwarding the click is a real click on a real element, synchronously inside
 * the user's own gesture, which is what keeps the popup from being blocked.
 * If that element ever stops existing, this falls back to the redirect flow
 * rather than becoming a dead button.
 */
export function GoogleSignIn({
  /** Where to go once signed in. Omit to stay put, which is what a lesson wants. */
  redirectTo,
  /** Our button's label. */
  label = "Continue with Google",
  className,
}: {
  redirectTo?: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();
  const { signIn, signingIn, learner, error } = useAuth();
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;

    ensureGoogleInitialized(GOOGLE_CLIENT_ID)
      .then((google) => {
        if (cancelled || !hostRef.current) return;
        google.accounts.id.renderButton(hostRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: 300,
        });
        setReady(true);
      })
      .catch(() => {
        // Leave `ready` false: the button below falls back to the redirect.
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

  /** When the in-page attempt was last made, so a second press can escape. */
  const attemptedAt = React.useRef(0);

  function start() {
    // Already failed once — retrying the same path would fail the same way.
    if (error) {
      void signIn(redirectTo);
      return;
    }

    /**
     * Second press, a few seconds after the first, still signed out.
     *
     * The likeliest cause is a popup that never opened — mobile browsers block
     * them more aggressively, and a forwarded click is exactly the kind they
     * distrust. Rather than guess at that with a timer, which would hijack a
     * flow that was working fine, this treats a deliberate second press as the
     * signal and switches to the redirect.
     */
    const now = Date.now();
    if (attemptedAt.current && now - attemptedAt.current > 3000) {
      void signIn(redirectTo);
      return;
    }
    attemptedAt.current = now;

    // Same tick as the user's click, so the popup keeps its gesture.
    const inner = hostRef.current?.querySelector<HTMLElement>('[role="button"]');
    if (ready && inner) {
      inner.click();
      return;
    }

    // No Google button to drive — the script was blocked, or its markup
    // changed. The redirect still signs people in.
    void signIn(redirectTo);
  }

  return (
    <div className={className}>
      <Button size="lg" disabled={signingIn} onClick={start}>
        <GoogleIcon className="size-4" aria-hidden />
        {signingIn ? "Opening Google" : label}
      </Button>

      {/*
        Google's button, present and clickable but not shown. `display: none`
        would stop it rendering at all, so it is taken out of flow and hidden
        from assistive technology instead — ours is the real control.
      */}
      <div
        ref={hostRef}
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
      />

      {error ? (
        <p role="alert" className="mt-3 max-w-sm text-sm leading-relaxed text-coral">
          {error} — press the button again to try the older redirect sign-in.
        </p>
      ) : null}
    </div>
  );
}
