"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { AccountButton } from "@/components/site/account-button";
import { useAuth } from "@/components/site/auth-provider";
import { GITHUB_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Hash targets are written root-relative (`/#demo`, not `#demo`) so the nav
 * works identically from a sub-page like /glossary/iorb, where a bare hash
 * would resolve against the current path and go nowhere.
 */
const LINKS = [
  { href: "/#demo", label: "Live demo" },
  { href: "/learn", label: "Learn" },
  { href: "/teach", label: "For parents" },
  { href: "/glossary", label: "Glossary" },
  { href: "/#curriculum", label: "Syllabus" },
  { href: "/#contribute", label: "Contribute" },
];

/** Sticky header that condenses into a glass bar once the hero scrolls away. */
export function Nav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { scrollY } = useScroll();
  const { learner } = useAuth();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-hairline bg-canvas/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8"
      >
        <Link href="/#top" className="flex items-center gap-2.5 font-display">
          <Logomark />
          <span className="text-lg font-extrabold tracking-tight">
            Open<span className="text-mint-bright">Macro</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {/*
            Signed in, the dashboard is a place, and places belong in the nav
            with the other places. The account chip on the right links there
            too, but an avatar is an identity, not a signpost — nobody clicks
            their own name looking for their progress.
          */}
          {learner ? (
            <Link
              href="/dashboard"
              className="mr-1 inline-flex items-center gap-1.5 rounded-lg border border-mint/30 bg-mint/10 px-3 py-2 text-sm font-bold text-mint-bright transition-colors hover:border-mint/60 hover:bg-mint/15"
            >
              <LayoutDashboard className="size-4" aria-hidden />
              Dashboard
            </Link>
          ) : null}
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-bold text-ink-muted transition-colors hover:bg-white/5 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="outline" size="sm">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener">
              <GithubIcon className="size-4" aria-hidden />
              GitHub
            </a>
          </Button>
          <AccountButton />
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-ink-muted hover:bg-white/5 hover:text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open ? (
        <motion.div
          id="mobile-menu"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="overflow-hidden border-t border-hairline bg-canvas/95 backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-1 px-5 py-4">
            {learner ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="mb-1 inline-flex items-center gap-2 rounded-lg border border-mint/30 bg-mint/10 px-3 py-3 text-sm font-bold text-mint-bright"
              >
                <LayoutDashboard className="size-4" aria-hidden />
                Dashboard
              </Link>
            ) : null}
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-bold text-ink-muted hover:bg-white/5 hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-3">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener">
                  <GithubIcon className="size-4" aria-hidden />
                  GitHub
                </a>
              </Button>
              <AccountButton onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </motion.div>
      ) : null}
    </header>
  );
}

/** Coin-and-ledger mark. Inline SVG so it inherits the theme colours. */
function Logomark() {
  return (
    <span
      className="grid size-9 place-items-center rounded-xl border border-mint/30 bg-mint/10"
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none">
        <circle cx="12" cy="12" r="9" stroke="var(--color-mint-bright)" strokeWidth="2" />
        <path
          d="M8 14.5c0 1.4 1.8 2.3 4 2.3s4-.9 4-2.6c0-3.6-7.6-1.8-7.6-5 0-1.6 1.7-2.5 3.8-2.5s3.7.9 3.7 2.2"
          stroke="var(--color-gold)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
