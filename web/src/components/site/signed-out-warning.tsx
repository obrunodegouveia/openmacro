"use client";

import { useAuth } from "@/components/site/auth-provider";
import { useLocale } from "@/components/site/locale-provider";
import { cn } from "@/lib/utils";

/**
 * "You're not signed in" — shown on Today and above every lesson while
 * nobody is signed in. The app shows the same (src/components/ui/SignedOutWarning.tsx).
 *
 * Progress made signed out is kept in this browser only: it never reaches an
 * account, so it is not on other devices and cannot be rewarded. Learners
 * found that out after the fact, so it is said before and during the work.
 *
 * Renders nothing when the site has no accounts, while the session is being
 * restored, or once someone is signed in.
 *
 * @param props.inLesson True above a lesson: one line and no button, since
 *   signing in leaves the page and would abandon the lesson.
 * @return The warning, or nothing when it does not apply.
 */
export function SignedOutWarning({ inLesson = false }: { inLesson?: boolean }) {
  const { enabled, loading, learner, signingIn, signIn } = useAuth();
  const { t } = useLocale();
  if (!enabled || loading || learner) return null;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl border border-gold/30 bg-gold/10 px-4 text-sm font-semibold text-ink",
        inLesson ? "mb-4 py-2" : "py-3",
      )}
    >
      <p>{inLesson ? t("signedOut.lesson") : t("signedOut.today")}</p>
      {inLesson ? null : (
        <button
          type="button"
          disabled={signingIn}
          onClick={() => void signIn("/dashboard")}
          className="shrink-0 font-extrabold text-gold underline-offset-4 hover:underline disabled:opacity-50"
        >
          {t("signedOut.signIn")}
        </button>
      )}
    </div>
  );
}
