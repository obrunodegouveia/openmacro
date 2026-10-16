"use client";

import * as React from "react";
import { useSiteText } from "@/lib/use-site-text";
import { Button } from "@/components/ui/button";
import { AppleIcon, GoogleIcon } from "@/components/ui/icons";

/**
 * Whether to offer Sign in with Apple on the website.
 *
 * Off until the Supabase Apple provider has a web Services ID and its client
 * secret: until then Supabase answers "missing OAuth secret" and the button
 * would be a dead end. The app signs in with Apple natively and does not need
 * this. Set NEXT_PUBLIC_APPLE_WEB_SIGN_IN=1 at build time (web/deploy/config.sh)
 * once it is configured.
 */
const APPLE_WEB_SIGN_IN = process.env.NEXT_PUBLIC_APPLE_WEB_SIGN_IN === "1";
import { useAuth } from "@/components/site/auth-provider";

/**
 * The sign-in control.
 *
 * Uses Google's redirect flow, which is the path known to work here — it is
 * what created the accounts that exist.
 *
 * An in-page Google Identity Services flow was tried, to stop Google's consent
 * screen naming the Supabase project URL instead of openmacro.org. It is a
 * real improvement when it works, and it broke sign-in: the button renders and
 * a forwarded click does not reliably open the popup, most likely on mobile.
 * A prettier consent screen is not worth a sign-in that does not sign anyone
 * in, so it is reverted. The proper fix for the wording is a Supabase custom
 * domain, which moves the callback onto openmacro.org without touching this
 * flow at all.
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
  const s = useSiteText();
  const { signIn, signingIn, error } = useAuth();

  return (
    <div className={className}>
      <div className="flex flex-col items-start gap-3">
        {APPLE_WEB_SIGN_IN ? (
          // Black on white per Apple's guidelines, and listed first: on an
          // iPhone it is the one-tap path.
          <button
            type="button"
            disabled={signingIn}
            onClick={() => void signIn(redirectTo, "apple")}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-white px-7 text-base font-extrabold text-black transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            <AppleIcon className="size-5" />
            {s("apple.continue")}
          </button>
        ) : null}
        <Button size="lg" disabled={signingIn} onClick={() => void signIn(redirectTo)}>
          <GoogleIcon className="size-4" aria-hidden />
          {signingIn ? s("google.opening") : label}
        </Button>
      </div>

      {error ? (
        <p role="alert" className="mt-3 max-w-sm text-sm leading-relaxed text-coral">
          {error}
        </p>
      ) : null}
    </div>
  );
}
