"use client";

import * as React from "react";
import { Check, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A link icon that copies its own address.
 *
 * It is a real `<a href>`, so middle-click, right-click and "open in new tab"
 * behave and modified clicks are left alone. But a plain self-link does
 * nothing visible when clicked, and somebody reaching for a link icon wants
 * the address rather than the page they are already on — so an ordinary click
 * copies the absolute URL and the icon becomes a tick for two seconds.
 *
 * Falls back to following the link where the clipboard API is unavailable,
 * which it is over plain HTTP and in some embedded browsers.
 *
 * Deliberately not gated on being signed in. Sharing a question with somebody
 * is the moment they are most likely to arrive without an account, and putting
 * a sign-in wall between a learner and a link would cost more than it could
 * possibly earn.
 */
export function Permalink({
  href,
  label,
  className,
  size = "md",
}: {
  /** Root-relative path, including any hash. */
  href: string;
  /** What is being linked, for the accessible name: "Copy a link to {label}". */
  label: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <a
      href={href}
      aria-label={copied ? "Link copied" : `Copy a link to ${label}`}
      title={copied ? "Link copied" : `Copy a link to ${label}`}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (!navigator.clipboard?.writeText) return;
        event.preventDefault();
        void navigator.clipboard
          .writeText(new URL(href, window.location.origin).toString())
          .then(() => setCopied(true))
          .catch(() => setCopied(false));
      }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg align-middle transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-bright",
        size === "sm" ? "size-6" : "size-7",
        copied ? "text-mint-bright" : "text-ink-faint hover:bg-white/5 hover:text-mint-bright",
        className,
      )}
    >
      {copied ? (
        <Check className={size === "sm" ? "size-3.5" : "size-4"} strokeWidth={3} aria-hidden />
      ) : (
        <Link2 className={size === "sm" ? "size-3.5" : "size-4"} aria-hidden />
      )}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </a>
  );
}
