"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, Send, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ROLES = [
  { id: "learner", label: "Learner" },
  { id: "parent", label: "Parent" },
  { id: "educator", label: "Educator" },
  { id: "developer", label: "Developer" },
] as const;

type Status = "idle" | "submitting" | "success" | "error";

/** App Store launch waitlist + newsletter signup. */
export function Waitlist() {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<string>("learner");
  const [status, setStatus] = React.useState<Status>("idle");
  const [message, setMessage] = React.useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setMessage("");

    const form = new FormData(event.currentTarget);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role,
          company: form.get("company"),
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; message?: string };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(data.message ?? "You're on the list.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Could not reach the server. Please try again.");
    }
  }

  return (
    <div id="waitlist" className="glass rounded-card p-6 sm:p-8">
      <h3 className="font-display text-2xl font-extrabold tracking-tight">
        Get the app at launch
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
        One email when OpenMacro hits the App Store and Play Store, plus the
        occasional note when a new module ships. No tracking pixels, no selling
        your address, unsubscribe in one click.
      </p>

      <form onSubmit={onSubmit} className="mt-6">
        <fieldset disabled={status === "submitting"} className="contents">
          {/* Honeypot: hidden from people, irresistible to bots. */}
          <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="company">Company</label>
            <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <label htmlFor="waitlist-email" className="sr-only">
                Email address
              </label>
              <input
                id="waitlist-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={status === "error"}
                aria-describedby="waitlist-message"
                className={cn(
                  "h-12 w-full rounded-xl border bg-abyss/70 px-4 text-[0.95rem] font-semibold text-ink placeholder:text-ink-faint focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-bright",
                  status === "error" ? "border-coral/60" : "border-hairline",
                )}
              />
            </div>
            <Button type="submit" size="lg" className="h-12 sm:w-auto">
              {status === "submitting" ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Send className="size-4" aria-hidden />
              )}
              {status === "submitting" ? "Joining" : "Join waitlist"}
            </Button>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-ink-faint">
              I am a
            </p>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setRole(option.id)}
                  aria-pressed={role === option.id}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors",
                    role === option.id
                      ? "border-mint/50 bg-mint/15 text-mint-bright"
                      : "border-hairline bg-white/5 text-ink-muted hover:text-ink",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </fieldset>

        {/* Status line, announced to screen readers. */}
        <p id="waitlist-message" role="status" aria-live="polite" className="mt-4">
          <AnimatePresence mode="wait">
            {status === "success" || status === "error" ? (
              <motion.span
                key={status}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "flex items-center gap-2 text-sm font-bold",
                  status === "success" ? "text-mint-bright" : "text-coral",
                )}
              >
                {status === "success" ? (
                  <Check className="size-4" aria-hidden />
                ) : (
                  <TriangleAlert className="size-4" aria-hidden />
                )}
                {message}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </p>

        <p className="mt-3 text-xs leading-relaxed text-ink-faint">
          Under 13? Ask a parent or guardian to sign up for you. We collect only
          an email address and the role you picked — see our{" "}
          <a href="/privacy" className="text-ink-muted underline underline-offset-4 hover:text-mint-bright">
            privacy notice
          </a>
          .
        </p>
      </form>
    </div>
  );
}
