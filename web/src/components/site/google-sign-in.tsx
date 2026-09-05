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
 * Tries Google's in-page flow first, because that is what makes the consent
 * screen say openmacro.org instead of the Supabase project URL. Google's own
 * button is rendered but kept off screen and driven by ours: it cannot be
 * styled, and it follows the viewer's Google *account* language rather than
 * the page's, which put a Greek button on an English page.
 *
 * Everything about this path is allowed to fail. If the script does not load,
 * or the element is not there to click, or Supabase rejects the token, the
 * redirect flow takes over — that one is known to work, and an ugly consent
 * screen beats a button that does nothing. The exchange itself is handled in
 * the auth provider, since Google's callback is global to the page.
 */
export function GoogleSignIn({
  /** Where to land afterwards. Omit to return to the current page. */
  redirectTo,
  label = "Continue with Google",
  className,
}: {
  redirectTo?: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();
  const { signIn, signingIn, learner, error, setSignInDestination } = useAuth();
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
        // Leave `ready` false; the button below uses the redirect instead.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /** Navigate once a session actually exists, however it arrived. */
  const signedIn = Boolean(learner);
  const wasSignedIn = React.useRef(signedIn);
  React.useEffect(() => {
    if (redirectTo && signedIn && !wasSignedIn.current) router.push(redirectTo);
    wasSignedIn.current = signedIn;
  }, [signedIn, redirectTo, router]);

  function start() {
    // The provider needs to know where to land if it has to fall back.
    setSignInDestination(redirectTo);

    const inner = hostRef.current?.querySelector<HTMLElement>('[role="button"]');
    if (ready && inner) {
      // Same tick as the user's click, so the popup keeps its gesture.
      inner.click();
      return;
    }
    void signIn(redirectTo);
  }

  return (
    <div className={className}>
      <Button size="lg" disabled={signingIn} onClick={start}>
        <GoogleIcon className="size-4" aria-hidden />
        {signingIn ? "Signing you in" : label}
      </Button>

      {/*
        Google's button: present and clickable, but not shown. `display: none`
        would stop it rendering at all, so it is taken out of flow and hidden
        from assistive technology instead — ours is the real control.
      */}
      <div
        ref={hostRef}
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
      />

      {error ? (
        <p role="status" className="mt-3 max-w-sm text-sm leading-relaxed text-ink-faint">
          {error}
        </p>
      ) : null}
    </div>
  );
}
