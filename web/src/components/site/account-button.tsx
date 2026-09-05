"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, LogOut, User } from "lucide-react";
import { GoogleIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/site/auth-provider";
import { GoogleSignIn } from "@/components/site/google-sign-in";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * Account controls
 * ============================================================================
 *
 * One button for signing in and signing up, because with Google there is no
 * difference between the two: the first visit creates the account, every visit
 * after it signs in. Offering both as separate choices would invent a decision
 * the learner does not have to make.
 *
 * Everything here renders nothing at all when the site is built without a
 * Supabase project. A fork should not show account UI that cannot work.
 */

/** Compact control for the header. */
export function AccountButton({ onNavigate }: { onNavigate?: () => void }) {
  const { enabled, loading, learner, signingIn, signIn, signOut } = useAuth();

  if (!enabled) return null;

  // Hold the space during the session check rather than flashing "Sign in" at
  // someone who is already signed in.
  if (loading) {
    return <span className="h-9 w-24 animate-pulse rounded-xl bg-white/5" aria-hidden />;
  }

  if (!learner) {
    return (
      <Button
        size="sm"
        disabled={signingIn}
        onClick={() => {
          onNavigate?.();
          // Somebody signing in from the header is not mid-lesson, so the
          // dashboard is where they want to end up. Returning them to the page
          // they happened to be on leaves them signed in and looking at
          // nothing that changed.
          void signIn("/dashboard");
        }}
      >
        <GoogleIcon className="size-4" aria-hidden />
        {signingIn ? "Opening Google" : "Sign in"}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* The name is the way into the dashboard — the obvious place to click. */}
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="flex items-center gap-2 rounded-xl border border-hairline bg-white/5 px-3 py-1.5 transition-colors hover:border-mint/50 hover:bg-white/10"
      >
        <Avatar learner={learner} />
        <span className="max-w-[10rem] truncate text-sm font-bold text-ink">
          {learner.name}
        </span>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          onNavigate?.();
          void signOut();
        }}
        aria-label={`Sign out of ${learner.name}'s account`}
      >
        <LogOut className="size-4" aria-hidden />
        <span className="sr-only sm:not-sr-only">Sign out</span>
      </Button>
    </div>
  );
}

/**
 * The full-width panel used in the footer and on /login.
 *
 * States what an account is actually for. "Sign up" on its own asks for a
 * commitment without naming the benefit, and the benefit here is small and
 * specific: XP and a streak that survive closing the tab.
 */
export function AccountPanel({
  className,
  redirectTo,
}: {
  className?: string;
  /** Where to land after signing in. Defaults to the current page. */
  redirectTo?: string;
}) {
  const { enabled, learner, error, signOut } = useAuth();

  if (!enabled) return null;

  return (
    <div className={cn("glass rounded-card p-6 sm:p-8", className)}>
      <h3 className="font-display text-2xl font-extrabold tracking-tight">
        {learner ? "You're signed in" : "Keep your progress"}
      </h3>

      {learner ? (
        <>
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-ink-muted">
            <Avatar learner={learner} />
            {learner.name}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-muted">
            XP and your day streak are saved to your account as you finish
            lessons, so they follow you to any device you sign in on.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard">
                Your progress
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button variant="outline" onClick={() => void signOut()}>
              <LogOut className="size-4" aria-hidden />
              Sign out
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
            An account saves your XP and day streak so they survive closing the
            tab, and carries them to your phone. Signing in with Google creates
            it — there is no separate sign-up, and no password to remember.
          </p>
          <GoogleSignIn className="mt-6" redirectTo={redirectTo} />

          {error ? (
            <p role="alert" className="mt-3 text-sm font-bold text-coral">
              {error}
            </p>
          ) : null}

          <p className="mt-4 text-xs leading-relaxed text-ink-faint">
            Every lesson is free to play without an account — signing in only
            adds memory. We receive your name, email address and profile picture
            from Google, and nothing else. See our{" "}
            <a
              href="/privacy"
              className="text-ink-muted underline underline-offset-4 hover:text-mint-bright"
            >
              privacy notice
            </a>
            .
          </p>
        </>
      )}
    </div>
  );
}

/** Profile picture, falling back to an icon when Google sends none. */
function Avatar({ learner }: { learner: { name: string; avatarUrl: string | null } }) {
  if (!learner.avatarUrl) {
    return (
      <span
        className="grid size-6 shrink-0 place-items-center rounded-full border border-hairline bg-white/5"
        aria-hidden
      >
        <User className="size-3.5 text-ink-muted" />
      </span>
    );
  }
  return (
    /* eslint-disable-next-line @next/next/no-img-element --
       A remote Google avatar, 24px and already cached by the browser. Routing it
       through next/image would mean configuring a remote pattern and paying for
       optimisation of an image that is smaller than its own request header. */
    <img
      src={learner.avatarUrl}
      alt=""
      width={24}
      height={24}
      className="size-6 shrink-0 rounded-full border border-hairline object-cover"
      referrerPolicy="no-referrer"
    />
  );
}
