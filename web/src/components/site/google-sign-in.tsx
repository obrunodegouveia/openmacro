"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/ui/icons";
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
  const { signIn, signingIn, error } = useAuth();

  return (
    <div className={className}>
      <Button size="lg" disabled={signingIn} onClick={() => void signIn(redirectTo)}>
        <GoogleIcon className="size-4" aria-hidden />
        {signingIn ? "Opening Google" : label}
      </Button>

      {error ? (
        <p role="alert" className="mt-3 max-w-sm text-sm leading-relaxed text-coral">
          {error}
        </p>
      ) : null}
    </div>
  );
}
